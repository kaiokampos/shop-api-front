import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Product } from '@/types'

// Chaves de cache — usadas para invalidar queries após mutations
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
}

// Busca todos os produtos
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/products')
      return data
    },
  })
}

// Busca um produto por ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    },
    enabled: !!id, // Só executa se tiver um ID
  })
}

// Cria um produto (admin)
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post<Product>('/products', product)
      return data
    },
    // Após criar, invalida o cache da lista de produtos
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

// Atualiza um produto (admin)
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data } = await api.put<Product>(`/products/${id}`, product)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
  })
}

// Deleta um produto (admin)
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
