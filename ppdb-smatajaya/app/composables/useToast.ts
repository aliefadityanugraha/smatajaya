import { toast } from 'vue-sonner'

export function useToast() {
  const success = (message: string) => {
    toast.success(message)
  }

  const error = (message: string) => {
    toast.error(message)
  }

  return { success, error }
}
