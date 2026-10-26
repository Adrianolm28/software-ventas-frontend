import api from '../../../api/axiosClient';

export const getCategorias = async () => {
    const response = await api.get('/api/categorias');
    return response.data;
};

export const getCategoriaById = async (id) => {
    const response = await api.get(`/api/categorias/${id}`);
    return response.data;
};  

export const createCategoria = async (categoriaData) => {
    const response = await api.post('/api/categorias', categoriaData);
    return response.data;
};  

export const updateCategoria = async (id, categoriaData) => {
    const response = await api.put(`/api/categorias/${id}`, categoriaData);
    return response.data;
};

export const deleteCategoria = async (id) => {
    await api.delete(`/api/categorias/${id}`);
};