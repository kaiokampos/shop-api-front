import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

/**
 * Redireciona para /login se o usuário não estiver autenticado.
 * Retorna `isAuthenticated` para o componente saber se pode renderizar.
 *
 * Usar em toda página que exige login — nunca chamar router.push
 * diretamente no corpo do componente.
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}
