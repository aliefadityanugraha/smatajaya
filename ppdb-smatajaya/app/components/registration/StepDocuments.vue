<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRegistrationStore } from '~/stores/registration'
import { DOCUMENT_LABELS, PATH_DOCUMENTS, ALL_DOCUMENT_LABELS, OPTIONAL_DOCUMENTS, type DocumentType } from '~/types'

const emit = defineEmits<{
  next: []
  prev: []
}>()

const registrationStore = useRegistrationStore()
const uploading = ref<Record<string, boolean>>({})
const uploadProgress = ref<Record<string, number>>({})
const uploadErrors = ref<Record<string, string>>({})
const documents = ref<Record<string, { file_path: string; file_name: string; is_uploaded: boolean }>>({})

const baseDocTypes: DocumentType[] = ['pas_foto', 'kk', 'skl_ijazah', 'sertifikat_prestasi', 'surat_keterangan_sehat', 'surat_kelakuan_baik']

const currentPathSlug = computed(() => {
  const pathId = registrationStore.registrationPathId
  if (!pathId) return null
  const path = registrationStore.availablePaths.find(p => p.id === pathId)
  return path?.slug || null
})

const extraDocTypes = computed(() => {
  if (!currentPathSlug.value) return []
  return PATH_DOCUMENTS[currentPathSlug.value as keyof typeof PATH_DOCUMENTS] || []
})

const allDocTypes = computed(() => [...baseDocTypes, ...extraDocTypes.value])

function isOptional(docType: string): boolean {
  if (OPTIONAL_DOCUMENTS.includes(docType) && currentPathSlug.value !== 'beasiswa' && currentPathSlug.value !== 'beasiswa_yatim_piatu') {
    return true
  }
  return false
}

function getDocUrl(docType: string): string | null {
  const doc = registrationStore.documents.find(d => d.doc_type === docType)
  return doc?.file_url || null
}

function getDocName(docType: string): string | null {
  const doc = registrationStore.documents.find(d => d.doc_type === docType)
  return doc?.file_name || null
}

function getDocLabel(docType: string): string {
  return ALL_DOCUMENT_LABELS[docType] || docType
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function getAllowedTypes(docType: string) {
  if (docType === 'pas_foto') {
    return { mime: ['image/jpeg', 'image/png', 'image/webp'], ext: ['.jpg', '.jpeg', '.png', '.webp'], hint: 'JPG, PNG, atau WebP' }
  }
  return { mime: ['application/pdf'], ext: ['.pdf'], hint: 'PDF' }
}

function validateFile(file: File, docType: string): string | null {
  const allowed = getAllowedTypes(docType)
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowed.mime.includes(file.type) && !allowed.ext.includes(ext)) {
    return `Hanya file ${allowed.hint} yang diperbolehkan`
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Ukuran file maksimal 5MB'
  }
  return null
}

function getAcceptAttr(docType: string): string {
  if (docType === 'pas_foto') return '.jpg,.jpeg,.png,.webp'
  return '.pdf'
}

async function handleUpload(event: Event, docType: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const validationError = validateFile(file, docType)
  if (validationError) {
    uploadErrors.value[docType] = validationError
    input.value = ''
    return
  }

  uploading.value[docType] = true
  uploadProgress.value[docType] = 0
  uploadErrors.value[docType] = ''

  const progressInterval = setInterval(() => {
    if (uploadProgress.value[docType] < 90) {
      uploadProgress.value[docType] += Math.random() * 15
    }
  }, 200)

  try {
    const result = await registrationStore.uploadDocument(file, docType)

    clearInterval(progressInterval)
    uploadProgress.value[docType] = 100

    if (!result) {
      uploadErrors.value[docType] = 'Gagal mengunggah dokumen. Silakan coba lagi.'
      setTimeout(() => {
        uploading.value[docType] = false
        uploadProgress.value[docType] = 0
      }, 300)
      input.value = ''
      return
    }

    setTimeout(() => {
      uploading.value[docType] = false
      uploadProgress.value[docType] = 0
    }, 300)

    documents.value[docType] = {
      file_path: typeof result === 'string' ? result : file.name,
      file_name: file.name,
      is_uploaded: true,
    }
  }
  catch {
    clearInterval(progressInterval)
    uploadErrors.value[docType] = 'Gagal mengunggah dokumen. Silakan coba lagi.'
    uploading.value[docType] = false
    uploadProgress.value[docType] = 0
  }

  input.value = ''
}

function removeFile(docType: string) {
  const doc = registrationStore.documents.find(d => d.doc_type === docType)
  if (doc) {
    registrationStore.documents = registrationStore.documents.filter(d => d.doc_type !== docType)
  }
}

const requiredDocsUploaded = computed(() => {
  return allDocTypes.value.every(dt => {
    if (isOptional(dt)) return true
    return getDocUrl(dt) !== null
  })
})

const missingDocCount = computed(() => {
  return allDocTypes.value.filter(dt => {
    if (isOptional(dt)) return false
    return getDocUrl(dt) === null
  }).length
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-1">Upload Dokumen</h2>
      <p class="text-sm text-muted-foreground">Upload dokumen yang diperlukan (PDF, maks. 5MB per file; Pas Foto JPG/PNG/WebP)</p>
    </div>

    <!-- Base Documents -->
    <div class="space-y-4">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dokumen Wajib</h3>

      <div
        v-for="docType in baseDocTypes"
        :key="docType"
        class="border rounded-2xl p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium mb-1">
              {{ getDocLabel(docType) }}
              <span v-if="isOptional(docType)" class="text-xs text-muted-foreground font-normal ml-1">(Opsional)</span>
            </p>
            <p class="text-xs text-muted-foreground mb-2" v-if="docType === 'pas_foto'">
              Format: JPG, PNG, atau WebP. Background merah untuk laki-laki, biru untuk perempuan.
            </p>
            <p class="text-xs text-muted-foreground mb-2" v-else-if="isOptional(docType)">
              Format: PDF, maks. 5MB
            </p>

            <!-- Upload Progress Bar -->
            <div v-if="uploading[docType]" class="mb-3">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span class="text-xs font-medium text-primary">Mengunggah...</span>
                <span class="text-xs text-muted-foreground ml-auto">{{ Math.round(uploadProgress[docType] || 0) }}%</span>
              </div>
              <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${Math.min(uploadProgress[docType] || 0, 100)}%` }"
                />
              </div>
            </div>

            <template v-if="getDocUrl(docType) && !uploading[docType]">
              <div class="flex items-center gap-2">
                <template v-if="docType === 'pas_foto'">
                  <img :src="getDocUrl(docType)!" alt="Pas Foto" class="h-16 w-12 object-cover rounded border" />
                </template>
                <template v-else>
                  <div class="flex items-center gap-2 text-sm text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span class="truncate max-w-[200px]">{{ getDocName(docType) }}</span>
                  </div>
                </template>
                <a
                  :href="getDocUrl(docType)!"
                  target="_blank"
                  class="text-xs text-primary hover:underline"
                >
                  Lihat
                </a>
                <button
                  v-if="!registrationStore.isSubmitted"
                  class="text-xs text-destructive hover:underline"
                  @click="removeFile(docType)"
                >
                  Hapus
                </button>
              </div>
            </template>

            <template v-else-if="!uploading[docType]">
              <p class="text-xs text-muted-foreground">Belum diupload</p>
            </template>
          </div>

          <div v-if="!registrationStore.isSubmitted" class="text-right shrink-0">
            <input
              :id="`file-${docType}`"
              type="file"
              :accept="getAcceptAttr(docType)"
              class="hidden"
              @change="handleUpload($event, docType)"
            />
            <label
              :for="`file-${docType}`"
              :class="[
                'inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium cursor-pointer transition-colors',
                uploading[docType]
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-muted',
              ]"
            >
              {{ uploading[docType] ? 'Uploading...' : getDocUrl(docType) ? 'Ganti' : 'Upload' }}
            </label>
            <p v-if="uploadErrors[docType]" class="text-xs text-destructive mt-2">{{ uploadErrors[docType] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Extra Documents (Beasiswa paths) -->
    <div v-if="extraDocTypes.length > 0" class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dokumen Tambahan (Jalur Beasiswa)</h3>
        <p class="text-xs text-muted-foreground mt-1">Wajib diupload untuk jalur beasiswa</p>
      </div>

      <div
        v-for="docType in extraDocTypes"
        :key="docType"
        class="border rounded-2xl p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium mb-1">{{ getDocLabel(docType) }}</p>

            <!-- Upload Progress Bar -->
            <div v-if="uploading[docType]" class="mb-3">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span class="text-xs font-medium text-primary">Mengunggah...</span>
                <span class="text-xs text-muted-foreground ml-auto">{{ Math.round(uploadProgress[docType] || 0) }}%</span>
              </div>
              <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${Math.min(uploadProgress[docType] || 0, 100)}%` }"
                />
              </div>
            </div>

            <template v-if="getDocUrl(docType) && !uploading[docType]">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 text-sm text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span class="truncate max-w-[200px]">{{ getDocName(docType) }}</span>
                </div>
                <a
                  :href="getDocUrl(docType)!"
                  target="_blank"
                  class="text-xs text-primary hover:underline"
                >
                  Lihat
                </a>
                <button
                  v-if="!registrationStore.isSubmitted"
                  class="text-xs text-destructive hover:underline"
                  @click="removeFile(docType)"
                >
                  Hapus
                </button>
              </div>
            </template>

            <template v-else-if="!uploading[docType]">
              <p class="text-xs text-muted-foreground">Belum diupload</p>
            </template>
          </div>

          <div v-if="!registrationStore.isSubmitted" class="text-right shrink-0">
            <input
              :id="`file-${docType}`"
              type="file"
              :accept="getAcceptAttr(docType)"
              class="hidden"
              @change="handleUpload($event, docType)"
            />
            <label
              :for="`file-${docType}`"
              :class="[
                'inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium cursor-pointer transition-colors',
                uploading[docType]
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-muted',
              ]"
            >
              {{ uploading[docType] ? 'Uploading...' : getDocUrl(docType) ? 'Ganti' : 'Upload' }}
            </label>
            <p v-if="uploadErrors[docType]" class="text-xs text-destructive mt-2">{{ uploadErrors[docType] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Warning -->
    <div v-if="!requiredDocsUploaded && !registrationStore.isSubmitted" class="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p class="text-sm text-yellow-800">
          <strong>{{ missingDocCount }} dokumen wajib belum diupload.</strong> Semua dokumen wajib harus diupload sebelum melanjutkan.
        </p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4">
      <UiButton variant="outline" @click="emit('prev')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Sebelumnya
      </UiButton>
      <UiButton
        :disabled="!requiredDocsUploaded && !registrationStore.isSubmitted"
        @click="emit('next')"
      >
        Selanjutnya
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </UiButton>
    </div>
  </div>
</template>
