import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Verifica que sea el puerto de tu Spring Boot
});

// Interceptor para enviar el Token JWT en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O la clave donde guardes tu JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta (Opcional - para ver por qué te redirige)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Petición no autorizada:', error.response);
      // Descomenta para depurar antes de limpiar sesión:
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;