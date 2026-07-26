import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Participant, Biodata, ParentInformation, School, Document, Grade, RegistrationPath, TestSchedule } from '~/types/database'

export const useRegistrationStore = defineStore('registration', () => {
  const user = useSupabaseUser()

  function getSupabase() {
    return useSupabaseClient()
  }

  const participant = ref<Participant | null>(null)
  const biodata = ref<Biodata | null>(null)
  const parents = ref<ParentInformation | null>(null)
  const school = ref<School | null>(null)
  const documents = ref<Document[]>([])
  const grades = ref<Grade[]>([])
  const { success, error: notifyError } = useToast()
  const { withLoading, loading } = useLoading()

  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveError = ref<string | null>(null)

  const availablePaths = ref<RegistrationPath[]>([])
  const testSchedules = ref<TestSchedule[]>([])

  const currentStep = computed(() => participant.value?.current_step || 1)
  const status = computed(() => participant.value?.status || 'draft')
  const isSubmitted = computed(() => status.value !== 'draft')
  const canEdit = computed(() => ['draft', 'needs_revision'].includes(status.value))
  const registrationPathId = computed(() => participant.value?.registration_path_id || null)
  const hasPath = computed(() => !!participant.value?.registration_path_id)

  // Phase 2 computed
  const isAccepted = computed(() => status.value === 'accepted')
  const isTestPhase = computed(() => status.value === 'accepted')
  const finalStatus = computed(() => participant.value?.final_status || 'pending')
  const hasDecision = computed(() => participant.value?.admin_decision_at !== null)
  const announcementDate = computed(() => participant.value?.announcement_date)
  const announcementRevealed = computed(() => participant.value?.announcement_revealed === true)
  const isAnnouncementDay = computed(() => {
    if (!announcementDate.value) return false
    const today = new Date()
    const annDate = new Date(announcementDate.value)
    return today >= annDate
  })

  const sortedTestSchedules = computed(() =>
    [...testSchedules.value].sort((a, b) => a.test_number - b.test_number),
  )

  const testStatuses = computed(() =>
    sortedTestSchedules.value.map((test) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const testDate = new Date(test.date)
      testDate.setHours(0, 0, 0, 0)
      const isPast = today > testDate
      const isToday = today.getTime() === testDate.getTime()
      return {
        ...test,
        isPast,
        isToday,
        status: isPast ? 'completed' : isToday ? 'active' : 'upcoming',
      }
    }),
  )

  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  function setSaved() {
    saveStatus.value = 'saved'
    saveError.value = null
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => { saveStatus.value = 'idle' }, 2000)
  }

  function setError(msg: string) {
    saveStatus.value = 'error'
    saveError.value = msg
    console.error('[Registration Store]', msg)
  }

  async function loadPaths() {
    const { data, error } = await getSupabase()
      .from('registration_paths')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[Registration Store] Failed to load paths:', error.message)
      return
    }
    availablePaths.value = (data as RegistrationPath[]) || []
  }

  async function loadTestSchedules() {
    const { data, error } = await getSupabase()
      .from('test_schedules')
      .select('*')
      .order('test_number', { ascending: true })

    if (error) {
      console.error('[Registration Store] Failed to load test schedules:', error.message)
      return
    }
    testSchedules.value = (data as TestSchedule[]) || []
  }

  async function selectPath(pathId: string) {
    if (!participant.value) return

    await withLoading(async () => {
      try {
        const { error } = await getSupabase()
          .from('participants')
          .update({
            registration_path_id: pathId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', participant.value.id)

        if (error) throw error
        participant.value = { ...participant.value, registration_path_id: pathId }
        success('Jalur berhasil disimpan')
      }
      catch (e) {
        notifyError(`Gagal menyimpan jalur: ${(e as Error).message}`)
      }
    })
  }

  async function initParticipant() {
    if (!user.value) return

    await withLoading(async () => {
      let { data: participantData, error: fetchError } = await getSupabase()
        .from('participants')
        .select('*')
        .eq('user_id', user.value.id)
        .maybeSingle()

      if (fetchError || !participantData) {
        const { data: newParticipant, error: insertError } = await getSupabase()
          .from('participants')
          .insert({ user_id: user.value.id })
          .select()
          .single()
        if (insertError) {
          console.error('[Registration Store] Failed to create participant:', insertError.message)
          return
        }
        participantData = newParticipant
      }

      await loadAllData(participantData.id)
      participant.value = participantData
      await loadTestSchedules()
    })
  }

  async function loadAllData(participantId: string) {
    const [biodataRes, parentsRes, schoolRes, docsRes, gradesRes] = await Promise.all([
      getSupabase().from('biodata').select('*').eq('participant_id', participantId).maybeSingle(),
      getSupabase().from('parent_information').select('*').eq('participant_id', participantId).maybeSingle(),
      getSupabase().from('schools').select('*').eq('participant_id', participantId).maybeSingle(),
      getSupabase().from('documents').select('*').eq('participant_id', participantId),
      getSupabase().from('grades').select('*').eq('participant_id', participantId),
    ])

    if (biodataRes.error) {
      console.error('[Registration Store] Failed to load biodata:', biodataRes.error.message)
    }
    if (parentsRes.error) {
      console.error('[Registration Store] Failed to load parents:', parentsRes.error.message)
    }
    if (schoolRes.error) {
      console.error('[Registration Store] Failed to load school:', schoolRes.error.message)
    }
    if (docsRes.error) {
      console.error('[Registration Store] Failed to load documents:', docsRes.error.message)
    }
    if (gradesRes.error) {
      console.error('[Registration Store] Failed to load grades:', gradesRes.error.message)
    }

    biodata.value = biodataRes.data
    parents.value = parentsRes.data
    school.value = schoolRes.data
    documents.value = docsRes.data || []
    grades.value = gradesRes.data || []
  }

  function sanitizeData(data: Record<string, unknown>) {
    const clean = { ...data }
    for (const key of Object.keys(clean)) {
      if (clean[key] === '' || clean[key] === undefined) {
        clean[key] = null
      }
    }
    return clean
  }

  async function saveBiodata(data: Partial<Biodata>) {
    if (!participant.value) throw new Error('Participant not loaded')
    const clean = sanitizeData(data as Record<string, unknown>)

    const { error } = await getSupabase()
      .from('biodata')
      .upsert(
        { participant_id: participant.value.id, ...clean },
        { onConflict: 'participant_id' },
      )
    if (error) throw error

    const { data: saved } = await getSupabase()
      .from('biodata')
      .select('*')
      .eq('participant_id', participant.value.id)
      .single()
    biodata.value = saved
  }

  async function saveParents(data: Partial<ParentInformation>) {
    if (!participant.value) throw new Error('Participant not loaded')

    const { error } = await getSupabase()
      .from('parent_information')
      .upsert(
        { participant_id: participant.value.id, ...data },
        { onConflict: 'participant_id' },
      )
    if (error) throw error

    const { data: saved } = await getSupabase()
      .from('parent_information')
      .select('*')
      .eq('participant_id', participant.value.id)
      .single()
    parents.value = saved
  }

  async function saveSchool(data: Partial<School>) {
    if (!participant.value) throw new Error('Participant not loaded')

    const { error } = await getSupabase()
      .from('schools')
      .upsert(
        { participant_id: participant.value.id, ...data },
        { onConflict: 'participant_id' },
      )
    if (error) throw error

    const { data: saved } = await getSupabase()
      .from('schools')
      .select('*')
      .eq('participant_id', participant.value.id)
      .single()
    school.value = saved
  }

  async function saveAllBiodata(form: { father_name: string, mother_name: string, school_name: string, npsn: string, [key: string]: unknown }) {
    if (!participant.value) return

    await withLoading(async () => {
      try {
        const { father_name, mother_name, school_name, npsn, ...biodataData } = form
        await saveBiodata(biodataData)
        await saveParents({ father_name, mother_name })
        await saveSchool({ school_name, npsn })
        success('Biodata berhasil disimpan')
      }
      catch (e) {
        notifyError(`Gagal menyimpan biodata: ${(e as Error).message}`)
      }
    })
  }

  async function savePathData(data: Record<string, unknown>) {
    if (!participant.value) return

    await withLoading(async () => {
      try {
        const { error } = await getSupabase()
          .from('participants')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', participant.value.id)

        if (error) throw error
        participant.value = { ...participant.value, ...data } as Participant
        success('Data jalur berhasil disimpan')
      }
      catch (e) {
        notifyError(`Gagal menyimpan data jalur: ${(e as Error).message}`)
      }
    })
  }

  async function uploadDocument(file: File, docType: string) {
    if (!participant.value) return null

    return await withLoading(async () => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${participant.value.id}/${docType}.${fileExt}`

      const { error: uploadError } = await getSupabase().storage
        .from('documents')
        .upload(fileName, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        console.error('[Storage Upload]', uploadError.message, uploadError)
        throw uploadError
      }

      const { data: urlData } = getSupabase().storage
        .from('documents')
        .getPublicUrl(fileName)

      const docData = {
        participant_id: participant.value.id,
        doc_type: docType,
        file_url: urlData.publicUrl,
        file_name: file.name,
      }

      const { error } = await getSupabase()
        .from('documents')
        .upsert(docData, { onConflict: 'participant_id,doc_type' })
      if (error) throw error

      const { data: savedDocs } = await getSupabase()
        .from('documents')
        .select('*')
        .eq('participant_id', participant.value.id)
      documents.value = savedDocs || []

      success('Dokumen berhasil diunggah')
      return fileName
    })
  }

  async function saveGrades(semesterGrades: Array<{ semester: number, subject: string, score: number | null }>) {
    if (!participant.value) return

    await withLoading(async () => {
      try {
        for (const g of semesterGrades) {
          const existing = grades.value.find(
            eg => eg.semester === g.semester && eg.subject === g.subject,
          )

          if (existing) {
            const { error } = await getSupabase()
              .from('grades')
              .update({ score: g.score, updated_at: new Date().toISOString() })
              .eq('id', existing.id)
            if (error) throw error
          }
          else {
            const { error } = await getSupabase()
              .from('grades')
              .insert({
                participant_id: participant.value.id,
                semester: g.semester,
                subject: g.subject,
                score: g.score,
              })
            if (error) throw error
          }
        }

        const { data, error } = await getSupabase()
          .from('grades')
          .select('*')
          .eq('participant_id', participant.value.id)
        if (error) throw error
        grades.value = data || []

        success('Nilai raport berhasil disimpan')
      }
      catch (e) {
        notifyError(`Gagal menyimpan nilai: ${(e as Error).message}`)
      }
    })
  }

  async function updateStep(step: number) {
    if (!participant.value) return

    if (step < 1) {
      participant.value = { ...participant.value, current_step: step } as Participant
      return
    }

    await withLoading(async () => {
      const { error } = await getSupabase()
        .from('participants')
        .update({ current_step: step, updated_at: new Date().toISOString() })
        .eq('id', participant.value.id)

      if (!error) {
        participant.value = { ...participant.value, current_step: step } as Participant
      }
      else {
        notifyError('Gagal memperbarui langkah pendaftaran')
      }
    })
  }

  async function submitRegistration() {
    if (!participant.value) return

    await withLoading(async () => {
      const { error } = await getSupabase()
        .from('participants')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', participant.value.id)

      if (!error) {
        participant.value = {
          ...participant.value,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        } as Participant
        success('Pendaftaran berhasil dikirim!')
      }
      else {
        notifyError('Gagal mengirim pendaftaran')
      }
    })
  }

  return {
    participant,
    biodata,
    parents,
    school,
    documents,
    grades,
    loading,
    currentStep,
    status,
    isSubmitted,
    canEdit,
    registrationPathId,
    hasPath,
    availablePaths,
    loadPaths,
    selectPath,
    initParticipant,
    saveBiodata,
    saveParents,
    saveSchool,
    saveAllBiodata,
    savePathData,
    uploadDocument,
    saveGrades,
    updateStep,
    submitRegistration,
    // Phase 2
    testSchedules,
    sortedTestSchedules,
    testStatuses,
    isAccepted,
    isTestPhase,
    finalStatus,
    hasDecision,
    announcementDate,
    announcementRevealed,
    isAnnouncementDay,
    loadTestSchedules,
  }
})
