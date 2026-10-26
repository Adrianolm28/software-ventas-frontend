import api from '../../../api/axiosClient';

export const usuarioService = {
  listarUsuarios: async (page = 0, size = 10) => {
    const response = await api.get(`/api/usuarios?page=${page}&size=${size}`);
    return response.data;
  },

  crearUsuario: async (usuarioData) => {
    const response = await api.post('/api/usuarios', usuarioData);
    return response.data;
  },

  actualizarUsuario: async (id, usuarioData) => {
    const response = await api.put(`/api/usuarios/${id}`, usuarioData);
    return response.data;
  },

  eliminarUsuario: async (id) => {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  },
};