import api from '../../../api/axiosClient';

export const getClientes = async (page = 0, size = 10) => {
  const response = await api.get(`/api/clientes?page=${page}&size=${size}`);
  return response.data;
};

export const getClienteById = async (id) => {
  const response = await api.get(`/api/clientes/${id}`);
  return response.data;
};

export const createCliente = async (clienteData) => {
  const response = await api.post('/api/clientes', clienteData);
  return response.data;
};

export const updateCliente = async (id, clienteData) => {
  const response = await api.put(`/api/clientes/${id}`, clienteData);
  return response.data;
};

export const deleteCliente = async (id) => {
  await api.delete(`/api/clientes/${id}`);
};