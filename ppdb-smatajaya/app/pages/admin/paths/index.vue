<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: 'Jalur Pendaftaran - Admin',
})

const adminStore = useAdminStore()
const showCreateDialog = ref(false)
const editingPath = ref<string | null>(null)
const actionLoading = ref(false)

const form = ref({
  name: '',
  slug: '',
  description: '',
  is_active: true,
  sort_order: 0,
})

onMounted(async () => {
  await adminStore.fetchPaths()
})

function openCreate() {
  form.value = { name: '', slug: '', description: '', is_active: true, sort_order: adminStore.paths.length }
  editingPath.value = null
  showCreateDialog.value = true
}

function openEdit(id: string) {
  const path = adminStore.paths.find(p => p.id === id)
  if (!path) return
  form.value = {
    name: path.name,
    slug: path.slug,
    description: path.description || '',
    is_active: path.is_active,
    sort_order: path.sort_order,
  }
  editingPath.value = id
  showCreateDialog.value = true
}

async function handleSubmit() {
  actionLoading.value = true
  if (editingPath.value) {
    await adminStore.updatePath(editingPath.value, form.value)
  }
  else {
    await adminStore.createPath(form.value)
  }
  actionLoading.value = false
  showCreateDialog.value = false
}

async function handleToggle(id: string, currentActive: boolean) {
  await adminStore.togglePath(id, !currentActive)
}

async function handleDelete(id: string) {
  if (!confirm('Yakin ingin menghapus jalur pendaftaran ini?')) return
  await adminStore.deletePath(id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Jalur Pendaftaran</h1>
        <p class="text-muted-foreground">Kelola jalur pendaftaran PPDB</p>
      </div>
      <UiButton @click="openCreate">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Tambah Jalur
      </UiButton>
    </div>

    <div v-if="adminStore.pathsLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="bg-card rounded-3xl border p-5 animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <div class="h-5 w-36 bg-muted rounded" />
            <div class="h-5 w-16 bg-muted rounded-full" />
          </div>
          <div class="flex gap-2">
            <div class="h-8 w-20 bg-muted rounded-lg" />
            <div class="h-8 w-12 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="adminStore.paths.length === 0" class="text-center py-12 text-muted-foreground">
      Belum ada jalur pendaftaran
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="path in adminStore.paths"
        :key="path.id"
        class="bg-card rounded-3xl border p-5 flex items-center justify-between gap-4"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-sm font-semibold">{{ path.name }}</h3>
            <span
              :class="[
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                path.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
              ]"
            >
              {{ path.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
          <p v-if="path.description" class="text-xs text-muted-foreground line-clamp-1">{{ path.description }}</p>
          <p class="text-xs text-muted-foreground mt-1">Slug: <code class="bg-muted px-1 rounded">{{ path.slug }}</code></p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UiButton
            variant="ghost"
            size="sm"
            @click="handleToggle(path.id, path.is_active)"
          >
            {{ path.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
          </UiButton>
          <UiButton
            variant="ghost"
            size="sm"
            @click="openEdit(path.id)"
          >
            Edit
          </UiButton>
          <UiButton
            variant="ghost"
            size="sm"
            class="text-destructive hover:text-destructive"
            @click="handleDelete(path.id)"
          >
            Hapus
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showCreateDialog = false"
    >
      <div class="bg-card rounded-3xl p-6 max-w-lg mx-4 shadow-xl w-full">
        <h3 class="text-lg font-semibold mb-4">{{ editingPath ? 'Edit Jalur' : 'Tambah Jalur Baru' }}</h3>

        <div class="space-y-4">
          <div class="space-y-2">
            <UiLabel for="pathName">Nama Jalur</UiLabel>
            <UiInput id="pathName" v-model="form.name" placeholder="Contoh: Jalur Prestasi" />
          </div>

          <div class="space-y-2">
            <UiLabel for="pathSlug">Slug</UiLabel>
            <UiInput id="pathSlug" v-model="form.slug" placeholder="Contoh: prestasi" />
            <p class="text-xs text-muted-foreground">Identifier unik, gunakan huruf kecil tanpa spasi</p>
          </div>

          <div class="space-y-2">
            <UiLabel for="pathDesc">Deskripsi</UiLabel>
            <textarea
              id="pathDesc"
              v-model="form.description"
              rows="3"
              placeholder="Deskripsi singkat jalur pendaftaran..."
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <UiLabel for="pathSort">Urutan</UiLabel>
              <UiInput id="pathSort" v-model.number="form.sort_order" type="number" />
            </div>
            <div class="space-y-2 flex items-end pb-1">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  v-model="form.is_active"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300"
                />
                Aktif
              </label>
            </div>
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <UiButton variant="outline" @click="showCreateDialog = false">Batal</UiButton>
          <UiButton
            :disabled="actionLoading || !form.name.trim() || !form.slug.trim()"
            @click="handleSubmit"
          >
            {{ actionLoading ? 'Menyimpan...' : (editingPath ? 'Simpan Perubahan' : 'Tambah Jalur') }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
