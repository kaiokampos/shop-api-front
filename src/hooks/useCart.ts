import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useCartStore } from '@/store/cart.store'
import type { Cart } from '@/types'

export const cartKeys = {
  cart: ['cart'] as const,
}

// Busca o carrinho do usuário logado
export function useCart() {
  const setCart = useCartStore((state) => state.setCart)

  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: async () => {
      const { data } = await api.get<Cart>('/cart')
      setCart(data) // Atualiza o estado global com o carrinho
      return data
    },
  })
}

// Adiciona item ao carrinho
export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.post<Cart>('/cart/items', { productId, quantity })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart })
    },
  })
}

// Remove item do carrinho
export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<Cart>(`/cart/items/${productId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart })
    },
  })
}

// Limpa o carrinho
export function useClearCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<Cart>('/cart')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart })
    },
  })
}
