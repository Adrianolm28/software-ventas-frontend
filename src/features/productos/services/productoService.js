import api from '../../../api/axiosClient';

export const productoService = {
  listarProductos: async (page = 0, size = 10) => {
    const response = await api.get(`/api/productos?page=${page}&size=${size}`);
    return response.data;
  },

  obtenerProductoPorId: async (id) => {
    const response = await api.get(`/api/productos/${id}`);
    return response.data;
  },

  guardarProducto: async (productoData) => {
    const response = await api.post('/api/productos', productoData);
    return response.data;
  },

  actualizarProducto: async (id, productoData) => {
    const response = await api.post('/api/productos', {
      ...productoData,
      idProducto: id,
    });
    return response.data;
  },

  eliminarProducto: async (id) => {
    const response = await api.put(`/api/productos/${id}/desactivar`);
    return response.data;
  },
};