import type { Ref } from 'vue'

export function useLoading(initialState = false) {
  const loading = ref(initialState)

  const start = () => { loading.value = true }
  const stop = () => { loading.value = false }
  
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    start()
    try {
      return await fn()
    } finally {
      stop()
    }
  }

  return { loading, start, stop, withLoading }
}
