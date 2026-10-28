import React from 'react';
import { X, Receipt, User, Calendar, Tag, CreditCard, Wallet, Smartphone, Building2 } from 'lucide-react';

const moneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

// Helper para badges de método de pago
const renderMetodoBadge = (metodo) => {
  const m = (metodo || 'EFECTIVO').toUpperCase();
  switch (m) {
    case 'TARJETA':
      return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold"><CreditCard className="w-3 h-3"/> Tarjeta</span>;
    case 'YAPE_PLIN':
    case 'YAPE':
      return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold"><Smartphone className="w-3 h-3"/> Yape / Plin</span>;
    case 'TRANSFERENCIA':
      return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold"><Building2 className="w-3 h-3"/> Transferencia</span>;
    default:
      return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold"><Wallet className="w-3 h-3"/> Efectivo</span>;
  }
};

export function VentaDetailModal({ isOpen, onClose, venta }) {
  if (!isOpen || !venta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Comprobante de Venta</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Información de la Venta */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
            <div>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> ID Venta
              </p>
              <p className="font-mono font-semibold text-slate-800 break-all">{venta.idVenta}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Fecha
              </p>
              <p className="font-medium text-slate-700">
                {new Date(venta.fecha).toLocaleString('es-PE')}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Cliente
              </p>
              <p className="font-semibold text-slate-800">
                {venta.nombreCliente || venta.idCliente || 'Cliente Frecuente'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Método de Pago</p>
              <div>{renderMetodoBadge(venta.metodoPago)}</div>
            </div>
            
            <div>
              <p className="text-slate-400 text-xs mb-1">Estado de la venta</p>
            
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                  venta.estado === "CANCELADO"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {venta.estado || "COMPLETADO"}
              </span>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Productos Comprados</h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-3">Producto ID</th>
                    <th className="p-3 text-center">Cant.</th>
                    <th className="p-3 text-right">P. Unit.</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {venta.detalles && venta.detalles.length > 0 ? (
                    venta.detalles.map((det, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-medium text-slate-700">
                          {det.idProducto}
                        </td>
                        <td className="p-3 text-center font-semibold text-slate-800">
                          {det.cantidad}
                        </td>
                        <td className="p-3 text-right text-slate-600">
                          {moneda.format(det.precioUnitario || 0)}
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-800">
                          {moneda.format(det.subtotal || 0)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-slate-400">
                        Sin detalles registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-indigo-50 text-indigo-900 rounded-xl">
            <span className="font-bold text-base">Total Pagado:</span>
            <span className="font-extrabold text-2xl">{moneda.format(venta.total || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}