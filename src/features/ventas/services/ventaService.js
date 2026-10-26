import api from '../../../api/axiosClient';

export const ventaService = {
  listarVentas: async (page = 0, size = 10) => {
    const response = await api.get(`/api/ventas?page=${page}&size=${size}`);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/api/ventas/${id}`);
    return response.data;
  },

  registrarVenta: async (ventaDto) => {
    const response = await api.post('/api/ventas', ventaDto);
    return response.data;
  },

  eliminarVenta: async (id) => {
    await api.delete(`/api/ventas/${id}`);
  },
};