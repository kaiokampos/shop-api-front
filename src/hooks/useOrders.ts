import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Order } from '@/types'

export const orderKeys = {
  all: ['orders'] as const,
  detail: (id: string) => ['orders', id] as const,
}

// Lista pedidos do usuário logado
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders')
      return data
    },
  })
}

// Busca um pedido por ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Finaliza a compra (checkout)
export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Order>('/orders')
      return data
    },
    onSuccess: () => {
      // Invalida o carrinho e a lista de pedidos
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

// Atualiza status do pedido (admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch<Order>(`/orders/${id}/status`, { status })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) })
    },
  })
}
