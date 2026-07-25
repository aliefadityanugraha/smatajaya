import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Profile } from '~/types/database'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { error: notifyError } = useToast()

  const profile = ref<Profile | null>(null)
  const loading = ref(false)

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isParticipant = computed(() => profile.value?.role === 'participant')
  const isAuthenticated = computed(() => !!user.value)

  async function fetchProfile() {
    const currentUser = user.value

    if (!currentUser) {
      profile.value = null
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) throw error
      profile.value = data
    }
    catch (e) {
      console.error('Error fetching profile:', e)
      notifyError('Gagal memuat profil pengguna')
    }
  }

  async function register(email: string, password: string, fullName: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) throw error
      return { data, error: null }
    }
    catch (error) {
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    }
    catch (error) {
      return { data: null, error }
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    profile.value = null
    navigateTo('/login')
  }

  async function resetPassword(email: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error
      return { error: null }
    }
    catch (error) {
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  async function updatePassword(newPassword: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      return { error: null }
    }
    catch (error) {
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: { full_name?: string }) {
    loading.value = true
    try {
      if (!user.value) throw new Error('Not authenticated')

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: updates.full_name, updated_at: new Date().toISOString() })
        .eq('id', user.value.id)

      if (profileError) throw profileError

      if (updates.full_name) {
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: updates.full_name },
        })
        if (authError) throw authError
      }

      await fetchProfile()
      return { error: null }
    }
    catch (error) {
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  async function updateEmail(newEmail: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      return { error: null, message: 'Email konfirmasi telah dikirim. Silakan cek inbox Anda.' }
    }
    catch (error) {
      return { error }
    }
    finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    user,
    isAdmin,
    isParticipant,
    isAuthenticated,
    fetchProfile,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    updateEmail,
  }
})
