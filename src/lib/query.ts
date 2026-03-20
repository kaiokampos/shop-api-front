import { QueryClient } from '@tanstack/react-query'

// Cria o cliente do TanStack Query com configurações padrão
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados ficam "frescos" por 1 minuto — não refetch desnecessário
      staleTime: 1000 * 60,
      // Tenta novamente 1 vez em caso de erro
      retry: 1,
    },
  },
})
