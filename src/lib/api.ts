import axios from "axios";

// URL base da API — usa a variável de ambiente em produção
// e localhost em desenvolvimento
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição — adiciona o token JWT automaticamente
// em todas as requisições se o usuário estiver logado
api.interceptors.request.use((config) => {
  // localStorage só existe no browser — não no servidor (SSR)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, o token expirou — redireciona para login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
