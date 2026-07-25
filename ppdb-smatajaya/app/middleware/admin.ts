import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.profile) {
    await authStore.fetchProfile()
  }

  if (authStore.profile?.role !== 'admin') {
    if (to.path !== '/dashboard') {
      return navigateTo('/dashboard')
    }
  }
})
