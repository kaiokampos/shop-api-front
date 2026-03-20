import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { AuthResponse } from '@/types'

// Login
export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push('/')
    },
  })
}

// Cadastro
export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => {
      await api.post('/auth/register', { name, email, password })
      // Após cadastro, faz login automaticamente
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push('/')
    },
  })
}

// Logout
export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const router = useRouter()

  return () => {
    clearAuth()
    router.push('/login')
  }
}
