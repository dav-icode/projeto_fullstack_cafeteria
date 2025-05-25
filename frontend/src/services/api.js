import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Serviços de Produtos
export const produtosService = {
  listar: (filtros = {}) => api.get("/produtos", { params: filtros }),
  buscarPorId: (id) => api.get(`/produtos/${id}`),
  criar: (dados) => api.post("/produtos", dados),
  atualizar: (id, dados) => api.put(`/produtos/${id}`, dados),
  deletar: (id) => api.delete(`/produtos/${id}`),
  listarCategorias: () => api.get("/produtos/categorias"),
  produtosDestaque: (limite = 6) =>
    api.get(`/produtos/destaque?limite=${limite}`),
};

// Serviços de Pedidos
export const pedidosService = {
  listar: (filtros = {}) => api.get("/pedidos", { params: filtros }),
  buscarPorId: (id) => api.get(`/pedidos/${id}`),
  criar: (dados) => api.post("/pedidos", dados),
  atualizarStatus: (id, status) =>
    api.patch(`/pedidos/${id}/status`, { status }),
  cancelar: (id) => api.delete(`/pedidos/${id}`),
};

// Serviços de Autenticação
export const authService = {
  login: (email, senha) => api.post("/auth/login", { email, senha }),
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },
  verificarToken: () => api.get("/auth/verify"),
  criarUsuario: (dados) => api.post("/auth/register", dados),
};

// Serviços de Dashboard/Relatórios
export const dashboardService = {
  resumo: () => api.get("/dashboard/resumo"),
  vendas: (periodo = "7d") => api.get(`/dashboard/vendas?periodo=${periodo}`),
  produtosMaisVendidos: (limite = 10) =>
    api.get(`/dashboard/produtos-mais-vendidos?limite=${limite}`),
  pedidosPendentes: () => api.get("/dashboard/pedidos-pendentes"),
};

// Funções auxiliares
export const formatarPreco = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export const formatarData = (data) => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
};

export const formatarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7
    )}`;
  }
  return telefone;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, "");
  return numeros.length >= 10 && numeros.length <= 11;
};

export default api;
