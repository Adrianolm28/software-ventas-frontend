import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getClientes, deleteCliente } from '../services/clienteService';
import { ClienteFormModal } from '../components/ClienteFormModal';

export function ClientesPage() {
  const [clientesData, setClientesData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const fetchClientes = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const data = await getClientes(pageNumber, 10);
      setClientesData(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes(page);
  }, [page]);

  const handleCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el cliente con ID ${id}?`)) {
      try {
        await deleteCliente(id);
        fetchClientes(page);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('No se pudo eliminar el cliente. Es posible que tenga ventas registradas.');
      }
    }
  };

  const filteredClientes = (clientesData.content || []).filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.idCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Gestión de Clientes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra la información de los clientes registrados
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar por ID, nombre o apellidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm">Cargando clientes...</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No se encontraron clientes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="py-3.5 px-6">Identificación (ID)</th>
                  <th className="py-3.5 px-6">Nombres</th>
                  <th className="py-3.5 px-6">Apellidos</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.idCliente} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700">
                      {cliente.idCliente}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{cliente.nombre}</td>
                    <td className="py-4 px-6 text-gray-600">{cliente.apellidos}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.idCliente)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {clientesData.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Página {page + 1} de {clientesData.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page + 1 >= clientesData.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchClientes(page)}
        clienteToEdit={selectedCliente}
      />
    </div>
  );
}