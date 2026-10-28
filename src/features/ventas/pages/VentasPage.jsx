import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard,
  Wallet,
  Smartphone,
  Building2,
  RefreshCw,
  History,
  Store,
  Eye,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Check,
  XCircle,
  UserPlus
} from "lucide-react";
import api from "../../../api/axiosClient";
import { useAuth } from "../../../context/AuthContext";
import { ventaService } from "../services/ventaService";
import {
  showSuccessAlert,
  showErrorAlert,
} from "../../../utils/alerts";
import { VentaDetailModal } from "../components/VentaDetailModal";
import { NuevoClienteModal } from "../components/NuevoClienteModal"; 

const moneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const METODOS_PAGO = [
  { id: "EFECTIVO", label: "Efectivo", icon: Wallet },
  { id: "TARJETA", label: "Tarjeta", icon: CreditCard },
  { id: "YAPE_PLIN", label: "Yape / Plin", icon: Smartphone },
  { id: "TRANSFERENCIA", label: "Transfer.", icon: Building2 },
];

export const VentasPage = () => {
  const { hasRole } = useAuth();
  const puedeCancelar = hasRole("ADMIN");

  const [activeTab, setActiveTab] = useState("pos");

  // Estados POS
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("CLIENTE_FRECUENTE");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [searchProduct, setSearchProduct] = useState("");
  const [loadingPOS, setLoadingPOS] = useState(false);
  const [submittingVenta, setSubmittingVenta] = useState(false);

  // Estado Modal Nuevo Cliente Rápido
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Historial
  const [ventas, setVentas] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedVentaDetail, setSelectedVentaDetail] = useState(null);

  useEffect(() => {
    cargarCatalogosPOS();
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      cargarVentas();
    }
  }, [activeTab, page]);

  const cargarCatalogosPOS = async () => {
    setLoadingPOS(true);
    try {
      const [resProd, resCli] = await Promise.all([
        api.get("/api/productos?size=100"),
        api.get("/api/clientes?size=100"),
      ]);

      setProductos(resProd.data.content || resProd.data || []);
      setClientes(resCli.data.content || resCli.data || []);
    } catch (error) {
      console.error("Error al cargar datos del POS:", error);
    } finally {
      setLoadingPOS(false);
    }
  };

  // Función para integrar el cliente recién creado sin recargar la página
  const handleClienteCreado = (nuevoCliente) => {
    setClientes((prev) => [nuevoCliente, ...prev]);
    setSelectedCliente(nuevoCliente.idCliente); // Auto-seleccionar al nuevo cliente
  };

  const cargarVentas = async () => {
    setLoadingHistory(true);
    try {
      const data = await ventaService.listarVentas(page, 10);
      setVentas(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      showErrorAlert("Error al cargar ventas", error.response?.data?.message || "Error de conexión");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCancelarVenta = async (venta) => {
  if ((venta.estado || "COMPLETADO") === "CANCELADO") {
    showErrorAlert("Venta cancelada", "Esta venta ya está cancelada.");
    return;
  }

  const resultado = await Swal.fire({
  title: "¿Cancelar esta venta?",
  text: `La venta ${venta.idVenta} será marcada como CANCELADO y se devolverá el stock al inventario.`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Sí, cancelar venta",
  cancelButtonText: "No, volver",
  reverseButtons: true,
  focusCancel: true,
  buttonsStyling: false,
  customClass: {
    popup: "rounded-2xl",
    title: "text-slate-800",
    htmlContainer: "text-slate-500",
    confirmButton:
      "bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold mx-1 transition-colors",
    cancelButton:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold mx-1 transition-colors",
  },
});

if (!resultado.isConfirmed) return;

  try {
    await ventaService.cancelarVenta(venta.idVenta);

    setSelectedVentaDetail((actual) =>
      actual?.idVenta === venta.idVenta
        ? { ...actual, estado: "CANCELADO" }
        : actual
    );

    showSuccessAlert(
      "Venta cancelada",
      "La venta se canceló correctamente y el stock fue devuelto."
    );

    await Promise.all([
      cargarVentas(),
      cargarCatalogosPOS()
    ]);
  } catch (error) {
    showErrorAlert(
      "Error al cancelar",
      error.response?.data?.message ||
        "No se pudo cancelar la venta."
    );
  }
};

  const addToCart = (producto) => {
    if (producto.estado === false) {
      showErrorAlert("Producto inactivo", "Este producto no está disponible para la venta.");
      return;
    }
  
    const stock = Number(producto.stock ?? 0);
    const existente = cart.find(
      (item) => item.idProducto === producto.idProducto
    );
    const cantidadActual = existente?.cantidad ?? 0;
  
    if (stock <= cantidadActual) {
      showErrorAlert(
        "Stock insuficiente",
        stock <= 0
          ? "Este producto no tiene existencias."
          : `Solo hay ${stock} unidades disponibles.`
      );
      return;
    }
  
    setCart((prevCart) => {
      const item = prevCart.find(
        (item) => item.idProducto === producto.idProducto
      );
  
      if (item) {
        return prevCart.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
  
      return [
        ...prevCart,
        {
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          marca: producto.marca,
          precio: producto.precio,
          cantidad: 1,
          stock,
        },
      ];
    });
  };

  const updateQuantity = (idProducto, delta) => {
    const producto = cart.find(
      (item) => item.idProducto === idProducto
    );
  
    if (!producto) return;
  
    const nuevaCantidad = producto.cantidad + delta;
  
    if (delta > 0 && nuevaCantidad > producto.stock) {
      showErrorAlert(
        "Stock insuficiente",
        `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`
      );
      return;
    }
  
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.idProducto === idProducto) {
            const cantidad = item.cantidad + delta;
            return cantidad > 0 ? { ...item, cantidad } : null;
          }
  
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (idProducto) => {
    setCart((prevCart) => prevCart.filter((item) => item.idProducto !== idProducto));
  };

  const clearCart = () => setCart([]);

  const totalCart = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleProcesarVenta = async () => {
    if (cart.length === 0) {
      showErrorAlert("Carrito Vacío", "Agrega al menos un producto para vender.");
      return;
    }

    const payload = {
      idCliente: selectedCliente === "CLIENTE_FRECUENTE" ? null : selectedCliente,
      metodoPago: metodoPago,
      detalles: cart.map((item) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
      })),
    };

    try {
      setSubmittingVenta(true);
      await ventaService.registrarVenta(payload);
      showSuccessAlert(
        "¡Venta Exitosa!",
        `Cobrado: ${moneda.format(totalCart)} via ${metodoPago}`
      );
      clearCart();
      setSelectedCliente("CLIENTE_FRECUENTE");
      setMetodoPago("EFECTIVO");
      await cargarCatalogosPOS();
    } catch (error) {
      showErrorAlert(
        "Error al procesar la venta",
        error.response?.data?.message || "Ocurrió un error al guardar la venta"
      );
    } finally {
      setSubmittingVenta(false);
    }
  };

  

  const filteredProductos = productos.filter((p) => {
    const busqueda = searchProduct.toLowerCase();
  
    return (
      p.estado !== false &&
      (
        p.nombre?.toLowerCase().includes(busqueda) ||
        p.idProducto?.toLowerCase().includes(busqueda) ||
        p.marca?.toLowerCase().includes(busqueda)
      )
    );
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-7 h-7 text-indigo-600" />
            Terminal POS & Ventas
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Realiza cobranzas rápidas o revisa el historial de transacciones
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-sm font-medium">
          <button
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "pos"
                ? "bg-white text-indigo-600 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Punto de Venta
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "history"
                ? "bg-white text-indigo-600 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4" />
            Historial de Ventas
          </button>
        </div>
      </div>

      {/* MODO PUNTO DE VENTA */}
      {activeTab === "pos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CATÁLOGO DE PRODUCTOS */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={cargarCatalogosPOS}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loadingPOS ? "animate-spin" : ""}`} />
                Actualizar Catálogo
              </button>
            </div>

            {loadingPOS ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                <p className="text-sm">Cargando catálogo...</p>
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No hay productos coincidentes.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredProductos.map((prod) => {
                  const stock = Number(prod.stock ?? 0);
                  const cantidadEnCarrito =
                    cart.find((item) => item.idProducto === prod.idProducto)?.cantidad ?? 0;
                  const disponibles = Math.max(stock - cantidadEnCarrito, 0);
                  const noDisponible = prod.estado === false || disponibles === 0;
              
                  return (
                    <div
                      key={prod.idProducto}
                      onClick={() => addToCart(prod)}
                      className={`group relative bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 rounded-xl p-4 transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                        noDisponible
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      <div>
                        <span className="inline-block text-[10px] font-mono bg-slate-200 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 px-1.5 py-0.5 rounded mb-2">
                          {prod.idProducto}
                        </span>
              
                        <h3 className="font-semibold text-slate-800 group-hover:text-indigo-900 text-sm line-clamp-2">
                          {prod.nombre}
                        </h3>
              
                        <p className="mt-1 text-xs text-slate-500">
                          {prod.marca || "Sin marca"}
                        </p>
              
                        <span
                          className={`inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded ${
                            disponibles > 0 && prod.estado !== false
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {prod.estado === false
                            ? "Producto inactivo"
                            : disponibles > 0
                              ? `Disponibles: ${disponibles}`
                              : "Sin unidades disponibles"}
                        </span>
                      </div>
              
                      <div className="mt-4 flex justify-between items-end pt-2 border-t border-slate-200/50">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            Precio
                          </span>
              
                          <span className="font-bold text-indigo-600 text-base">
                            {moneda.format(prod.precio)}
                          </span>
                        </div>
              
                        <button
                          type="button"
                          disabled={noDisponible}
                          className="bg-indigo-600 group-hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-transform active:scale-95 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PANEL DE ORDEN / CARRITO */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  <span>Orden de Venta</span>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                    {cart.reduce((a, c) => a + c.cantidad, 0)} items
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                )}
              </div>

              {/* Selector de Cliente + Botón de Creación Rápida */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Cliente
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="CLIENTE_FRECUENTE">
                       Cliente Frecuente (Público General)
                    </option>
                    {clientes.map((cli) => (
                      <option key={cli.idCliente} value={cli.idCliente}>
                       {cli.nombre} {cli.apellidos || ""} ({cli.idCliente})
                      </option>
                    ))}
                  </select>

                  {/* Botón "+ Nuevo" */}
                  <button
                    type="button"
                    onClick={() => setIsClienteModalOpen(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 border border-indigo-200 transition-colors"
                    title="Registrar cliente nuevo al vuelo"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Nuevo</span>
                  </button>
                </div>
              </div>

              {/* Items del Carrito */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400">
                    <PackageCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">El carrito está vacío</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.idProducto}
                      className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-sm"
                    >
                      <div className="flex-1 pr-2">
                        <p className="font-semibold text-slate-800 text-xs line-clamp-1">
                          {item.nombre}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {moneda.format(item.precio)} c/u
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.idProducto, -1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1 text-slate-800 min-w-[18px] text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.idProducto, 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right pl-3 min-w-[65px]">
                        <p className="font-bold text-slate-800 text-xs">
                          {moneda.format(item.precio * item.cantidad)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.idProducto)}
                        className="text-slate-400 hover:text-red-500 p-1 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Selector Visual de Métodos de Pago */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {METODOS_PAGO.map((m) => {
                    const Icon = m.icon;
                    const isSelected = metodoPago === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMetodoPago(m.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-600"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                          <span>{m.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Total y Botón de Cobro */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between font-extrabold text-slate-900 text-2xl">
                <span>Total</span>
                <span className="text-indigo-600">{moneda.format(totalCart)}</span>
              </div>

              <button
                onClick={handleProcesarVenta}
                disabled={cart.length === 0 || submittingVenta}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-base"
              >
                {submittingVenta ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Cobrar {moneda.format(totalCart)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODO HISTORIAL DE VENTAS */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-800 text-sm">
              Historial de Ventas Registradas
            </h2>
            <button
              onClick={cargarVentas}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center items-center p-16">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">ID Venta</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Método Pago</th>
                    <th className="p-4">Fecha / Hora</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {ventas.length > 0 ? (
                    ventas.map((venta) => (
                      <tr key={venta.idVenta} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">
                            {venta.idVenta?.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-800">
                          {venta.nombreCliente || venta.idCliente || (
                            <span className="text-indigo-600 font-semibold">Cliente Frecuente</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {venta.metodoPago || "EFECTIVO"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {new Date(venta.fecha).toLocaleString("es-PE")}
                        </td>
                        <td className="p-4 text-right font-bold text-slate-800">
                          {moneda.format(venta.total || 0)}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              (venta.estado || "COMPLETADO") === "CANCELADO"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {venta.estado || "COMPLETADO"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => setSelectedVentaDetail(venta)}
                              className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Ver Comprobante"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                        
                            {puedeCancelar &&
                              (venta.estado || "COMPLETADO") !== "CANCELADO" && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelarVenta(venta)}
                                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Cancelar venta"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-400">
                        No se encontraron registros de ventas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Página {page + 1} de {totalPages} ({totalElements} registros)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalle */}
      <VentaDetailModal
        isOpen={!!selectedVentaDetail}
        onClose={() => setSelectedVentaDetail(null)}
        venta={selectedVentaDetail}
      />

      {/* Modal de Registro Rápido de Cliente */}
      <NuevoClienteModal
        isOpen={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        onClienteCreado={handleClienteCreado}
      />
    </div>
  );
};