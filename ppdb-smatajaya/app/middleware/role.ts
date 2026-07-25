import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.profile) {
    await authStore.fetchProfile()
  }

  // Jika user admin, paksa selalu ke halaman admin
  if (authStore.profile?.role === 'admin' && !to.path.startsWith('/admin')) {
    return navigateTo('/admin')
  }
  
  // Jika user peserta, tidak boleh masuk ke halaman admin
  if (authStore.profile?.role === 'participant' && to.path.startsWith('/admin')) {
    return navigateTo('/dashboard')
  }
})
