import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Package, ArrowLeft, Calendar, CreditCard } from 'lucide-react'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        // Usamos la barra final para evitar redirecciones y errores de CORS
        const res = await axios.get('http://127.0.0.1:8000/my-orders/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(res.data)
      } catch (err) {
        console.error("Error al cargar pedidos", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Función para formatear la fecha de forma segura
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? "Formato inválido" 
      : date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
          <Package className="text-cyan-500" size={32} /> Mis Pedidos
        </h2>

        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500 mb-4"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Sincronizando historial...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center shadow-2xl">
            <p className="text-slate-400 font-medium">Aún no has realizado ninguna compra.</p>
            <Link to="/" className="text-cyan-500 text-xs font-black uppercase mt-4 inline-block hover:underline">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-cyan-500/30 transition-all shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/20">
                      Pedido #{order.id}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 mt-3">
                      <Calendar size={14} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                    <div className="flex items-center md:justify-end gap-2 text-emerald-400 mb-1">
                      <CreditCard size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tighter">${order.total_price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Detalle de hardware</p>
                  <ul className="space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-500 font-black text-xs bg-cyan-500/10 w-6 h-6 flex items-center justify-center rounded">
                            {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors uppercase">
                            {item.product?.name || `Producto #${item.product_id}`}
                          </span>
                        </div>
                        <span className="text-sm font-black text-slate-500 tracking-tighter">
                          ${item.unit_price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders