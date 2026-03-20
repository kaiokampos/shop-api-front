import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

// Define o formato do estado de autenticação
interface AuthState {
  user: User | null; // Usuário logado ou null
  token: string | null; // Token JWT ou null
  isAuthenticated: boolean; // Atalho para verificar se está logado

  // Ações que modificam o estado
  setAuth: (user: User, token: string) => void; // Salva após login
  clearAuth: () => void; // Limpa após logout
}

// "persist" salva o estado no localStorage automaticamente
// Quando o usuário recarrega a página, o estado é restaurado
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Chamado após login bem sucedido
      setAuth: (user, token) => {
        // Salva o token no localStorage para o interceptor do axios usar
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true });
      },

      // Chamado no logout
      clearAuth: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      // Nome da chave no localStorage
      name: "shop-auth",
      // Salva apenas o user e token — não as funções
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
