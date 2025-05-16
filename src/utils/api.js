import axios from "axios";

// Configurar a URL base da API - usando localhost com a porta do servidor Spring Boot padrão
// Tentando alternativa já que a conexão com 10.0.0.100:3005 não funcionou
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000, // Timeout para evitar esperas muito longas
});

// Configurar interceptor para adicionar o token JWT a cada requisição
api.interceptors.request.use(
  (config) => {
    // O token JWT já é adicionado pelo AuthContext quando o usuário faz login
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;