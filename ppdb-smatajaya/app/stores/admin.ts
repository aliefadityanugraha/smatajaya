import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Participant, Profile, Biodata, Document, Grade, ParentInformation, School, RegistrationPath, TestSchedule } from '~/types/database'

interface ParticipantWithProfile extends Participant {
  profiles: Profile | null
  biodata: Biodata | null
  parent_information: ParentInformation | null
  schools: School | null
  documents: Document[]
  grades: Grade[]
  registration_paths: RegistrationPath | null
}

export const useAdminStore = defineStore('admin', () => {
  const supabase = useSupabaseClient()

  async function sendStatusEmail(participantId: string, newStatus: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.functions.invoke('send-status-email', {
        body: { participant_id: participantId, new_status: newStatus },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      })
    }
    catch (e) {
      console.warn('[Email] Failed to send notification:', e)
    }
  }

  const participants = ref<ParticipantWithProfile[]>([])
  const currentParticipant = ref<ParticipantWithProfile | null>(null)
  const loading = ref(false)

  // --- Site Settings ---
  const siteSettings = ref<Record<string, any>>({})
  const siteSettingsLoading = ref(false)

  // --- Registration Paths ---
  const paths = ref<RegistrationPath[]>([])

  async function fetchSiteSettings() {
    siteSettingsLoading.value = true
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error
      const settings: Record<string, any> = {}
      for (const row of (data || [])) {
        settings[row.key] = row.value
      }
      siteSettings.value = settings
    }
    finally {
      siteSettingsLoading.value = false
    }
  }

  async function updateSiteSetting(key: string, value: any) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (!error) {
      siteSettings.value[key] = value
    }
    return { error }
  }  const pathsLoading = ref(false)

  const activePaths = computed(() => paths.value.filter(p => p.is_active))

  async function fetchPaths() {
    pathsLoading.value = true
    try {
      const { data, error } = await supabase
        .from('registration_paths')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      paths.value = data as RegistrationPath[]
    }
    finally {
      pathsLoading.value = false
    }
  }

  async function createPath(path: Partial<RegistrationPath>) {
    const { data, error } = await supabase
      .from('registration_paths')
      .insert(path)
      .select()
      .single()

    if (!error && data) {
      paths.value.push(data as RegistrationPath)
    }
    return { error }
  }

  async function updatePath(id: string, updates: Partial<RegistrationPath>) {
    const { error } = await supabase
      .from('registration_paths')
      .update(updates)
      .eq('id', id)

    if (!error) {
      const idx = paths.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        paths.value[idx] = { ...paths.value[idx], ...updates }
      }
    }
    return { error }
  }

  async function deletePath(id: string) {
    const { error } = await supabase
      .from('registration_paths')
      .delete()
      .eq('id', id)

    if (!error) {
      paths.value = paths.value.filter(p => p.id !== id)
    }
    return { error }
  }

  async function togglePath(id: string, isActive: boolean) {
    return updatePath(id, { is_active: isActive })
  }

  // --- Test Schedules ---
  const testSchedules = ref<TestSchedule[]>([])
  const testSchedulesLoading = ref(false)

  const sortedTestSchedules = computed(() =>
    [...testSchedules.value].sort((a, b) => a.test_number - b.test_number),
  )

  async function fetchTestSchedules() {
    testSchedulesLoading.value = true
    try {
      const { data, error } = await supabase
        .from('test_schedules')
        .select('*')
        .order('test_number', { ascending: true })

      if (error) throw error
      testSchedules.value = data as TestSchedule[]
    }
    finally {
      testSchedulesLoading.value = false
    }
  }

  async function updateTestSchedule(id: string, updates: Partial<TestSchedule>) {
    const { error } = await supabase
      .from('test_schedules')
      .update({
        name: updates.name,
        date: updates.date,
        time: updates.time,
        location: updates.location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (!error) {
      await fetchTestSchedules()
    }
    return { error }
  }

  // --- Participants ---
  const stats = computed(() => ({
    total: participants.value.length,
    draft: participants.value.filter(p => p.status === 'draft').length,
    submitted: participants.value.filter(p => p.status === 'submitted' || p.status === 'waiting_verification').length,
    needsRevision: participants.value.filter(p => p.status === 'needs_revision').length,
    verified: participants.value.filter(p => p.status === 'verified').length,
    accepted: participants.value.filter(p => p.status === 'accepted').length,
  }))

  async function fetchParticipants() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          profiles:user_id (*),
          biodata (*),
          parent_information (*),
          schools (*),
          documents (*),
          grades (*),
          registration_paths:registration_path_id (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      participants.value = data as ParticipantWithProfile[]
    }
    finally {
      loading.value = false
    }
  }

  async function fetchParticipantDetail(id: string) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          profiles:user_id (*),
          biodata (*),
          parent_information (*),
          schools (*),
          documents (*),
          grades (*),
          registration_paths:registration_path_id (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      currentParticipant.value = data as ParticipantWithProfile
    }
    finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: string, notes?: string) {
    const update: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'verified') {
      update.verified_at = new Date().toISOString()
    }
    if (status === 'accepted') {
      update.verified_at = new Date().toISOString()
    }
    if (notes !== undefined) {
      update.admin_notes = notes
    }

    const { error } = await supabase
      .from('participants')
      .update(update)
      .eq('id', id)

    if (!error) {
      const idx = participants.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        participants.value[idx] = { ...participants.value[idx], ...update }
      }
      if (currentParticipant.value?.id === id) {
        currentParticipant.value = { ...currentParticipant.value, ...update } as ParticipantWithProfile
      }
      sendStatusEmail(id, status)
    }
  }

  async function triggerLulus(id: string, announcementDate: string) {
    const update: Record<string, unknown> = {
      final_status: 'lulus',
      admin_decision_at: new Date().toISOString(),
      announcement_date: announcementDate,
      announcement_revealed: false,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('participants')
      .update(update)
      .eq('id', id)

    if (!error) {
      const idx = participants.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        participants.value[idx] = { ...participants.value[idx], ...update } as ParticipantWithProfile
      }
      if (currentParticipant.value?.id === id) {
        currentParticipant.value = { ...currentParticipant.value, ...update } as ParticipantWithProfile
      }
    }
    return { error }
  }

  async function triggerTidakLulus(id: string, announcementDate: string) {
    const update: Record<string, unknown> = {
      final_status: 'tidak_lulus',
      admin_decision_at: new Date().toISOString(),
      announcement_date: announcementDate,
      announcement_revealed: false,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('participants')
      .update(update)
      .eq('id', id)

    if (!error) {
      const idx = participants.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        participants.value[idx] = { ...participants.value[idx], ...update } as ParticipantWithProfile
      }
      if (currentParticipant.value?.id === id) {
        currentParticipant.value = { ...currentParticipant.value, ...update } as ParticipantWithProfile
      }
    }
    return { error }
  }

  async function batchAcceptToPhase2() {
    const now = new Date().toISOString()
    const { error, count } = await supabase
      .from('participants')
      .update({
        status: 'accepted',
        verified_at: now,
        updated_at: now,
      })
      .eq('status', 'verified')

    if (!error) {
      participants.value.forEach((p) => {
        if (p.status === 'verified') {
          p.status = 'accepted'
          p.verified_at = now
          p.updated_at = now
        }
      })
    }
    return { error, count }
  }

  return {
    participants,
    currentParticipant,
    loading,
    stats,
    fetchParticipants,
    fetchParticipantDetail,
    updateStatus,
    triggerLulus,
    triggerTidakLulus,
    batchAcceptToPhase2,
    sendStatusEmail,
    // Site Settings
    siteSettings,
    siteSettingsLoading,
    fetchSiteSettings,
    updateSiteSetting,
    // Paths
    paths,
    pathsLoading,
    activePaths,
    fetchPaths,
    createPath,
    updatePath,
    deletePath,
    togglePath,
    // Test Schedules
    testSchedules,
    testSchedulesLoading,
    sortedTestSchedules,
    fetchTestSchedules,
    updateTestSchedule,
  }
})
