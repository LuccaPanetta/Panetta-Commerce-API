import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Edit2, LogOut, ShieldCheck, X, ShoppingCart, Trash, Search, Filter, ArrowUpDown, Info, Eye } from 'lucide-react'

function App() {
  const navigate = useNavigate()
  // --- ESTADOS PRINCIPALES ---
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortOrder, setSortOrder] = useState("default")

  // --- ESTADOS DE MODALES ---
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null) 
  const [isCartOpen, setIsCartOpen] = useState(false) 
  
  // --- PERSISTENCIA DEL CARRITO ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('panetta_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  
  const isAuthenticated = localStorage.getItem('token') !== null
  const isAdmin = isAuthenticated && localStorage.getItem('isAdmin') === 'true'

  useEffect(() => {
    localStorage.setItem('panetta_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/products/')
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const fetchCategories = () => {
    axios.get('http://127.0.0.1:8000/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error al cargar categorías", err))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    window.location.reload() 
  }

  const addToCart = (product) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }
    if (product.stock <= 0) {
      alert("Lo sentimos, este producto no tiene stock disponible.");
      return;
    }
    setCart([...cart, { ...product, cartId: Date.now() }])
    setSelectedProduct(null) 
  }

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  const handleConfirmPurchase = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Debes iniciar sesión para finalizar la compra.");
      navigate("/login");
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: 1 
        }))
      };

      await axios.post('http://127.0.0.1:8000/orders/', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("¡Compra exitosa! El stock ha sido actualizado.");
      setCart([]); 
      setIsCartOpen(false);
      fetchProducts(); 
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || "Error al procesar la compra";
      alert("No se pudo completar la transacción: " + errorMsg);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://127.0.0.1:8000/products/${editingProduct.id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEditingProduct(null)
      fetchProducts()
      alert("¡Producto actualizado correctamente!")
    } catch (err) {
      alert("Error: No tienes permisos o la sesión expiró.")
    }
  }

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") return Number(a.price) - Number(b.price)
      if (sortOrder === "price-desc") return Number(b.price) - Number(a.price)
      return a.id - b.id 
    })

  const cartTotal = cart.reduce((acc, item) => acc + Number(item.price), 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      
      {/* NAVBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto mb-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 sticky top-0 z-40 gap-4 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-cyan-500 italic uppercase tracking-tighter">Panetta HW</h1>
          {isAdmin && (
            <div className="text-emerald-400 text-[10px] font-bold mt-1 tracking-widest flex items-center gap-1 uppercase opacity-80">
              <ShieldCheck size={10}/> Modo Admin
            </div>
          )}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="¿Qué componente buscas?"
            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-cyan-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all">
            <div className="relative">
              <ShoppingCart size={20} className="text-slate-400" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-cyan-400 font-black">${cartTotal.toFixed(2)}</span>
          </button>

          {!isAuthenticated ? (
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-400 text-sm hover:text-white transition-colors">Ingresar</Link>
              <Link to="/register" className="text-cyan-500 text-sm font-bold hover:text-cyan-400 transition-colors">Registrarse</Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* NUEVO BOTÓN: Mis Compras */}
              <Link 
                to="/my-orders" 
                className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400 transition-colors"
              >
                Mis Compras
              </Link>
              
              <button onClick={handleLogout} className="text-red-400 text-sm flex items-center gap-2 font-bold hover:opacity-80">
                <LogOut size={16}/> Salir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={16} className="text-slate-500 mr-2" />
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${!selectedCategory ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'}`}
          >
            TODOS
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all uppercase ${selectedCategory === cat.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 group hover:border-cyan-500/50 transition-colors">
          <ArrowUpDown size={14} className="text-slate-500 group-hover:text-cyan-500" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-[10px] font-black text-slate-400 outline-none cursor-pointer uppercase tracking-widest focus:text-cyan-500 transition-colors"
          >
            <option value="default" className="bg-slate-950">Destacados</option>
            <option value="price-asc" className="bg-slate-950">Menor precio</option>
            <option value="price-desc" className="bg-slate-950">Mayor precio</option>
          </select>
        </div>
      </div>
      
      {/* GRILLA DE PRODUCTOS */}
      {loading ? (
        <div className="text-center py-20 italic opacity-50 font-bold tracking-widest uppercase">Sincronizando Stock...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map(p => (
            <div 
              key={p.id} 
              onClick={() => setSelectedProduct(p)} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer hover:border-cyan-500/50 transition-all shadow-xl"
            >
              <div className="relative overflow-hidden aspect-square flex items-center justify-center p-4">
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingProduct(p); }} 
                    className="absolute top-2 right-2 p-2 bg-slate-800/90 text-cyan-400 rounded-lg opacity-0 group-hover:opacity-100 z-10 transition-opacity border border-slate-700"
                  >
                    <Edit2 size={16}/>
                  </button>
                )}
                <img src={p.image_url} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                <h3 className="font-bold truncate text-slate-200 uppercase text-xs tracking-tight">{p.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-cyan-400 font-black text-lg">${p.price}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      Stock: {p.stock > 0 ? p.stock : <span className="text-red-500 italic">Sin stock</span>}
                    </p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={12}/> Ver más
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: DESCRIPCIÓN PREVIA */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-1/2 h-72 md:h-auto bg-white/5 flex items-center justify-center p-8">
              <img src={selectedProduct.image_url} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                <X size={32}/>
              </button>
              <div>
                <h2 className="text-3xl font-black uppercase italic text-cyan-500 mb-2 leading-none mt-4">{selectedProduct.name}</h2>
                <div className="h-1 w-16 bg-cyan-500 mb-6 rounded-full"></div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  {selectedProduct.description || "Componente seleccionado para brindarte el máximo rendimiento en Panetta HW."}
                </p>
                <div className="text-5xl font-black tracking-tighter text-white mb-2">${selectedProduct.price}</div>
                <p className="text-xs font-bold uppercase text-slate-500 mb-8 tracking-widest">
                  Disponibles: {selectedProduct.stock} unidades
                </p>
              </div>
              
              <button 
                onClick={() => addToCart(selectedProduct)} 
                disabled={selectedProduct.stock <= 0}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-cyan-900/20"
              >
                <ShoppingCart size={20}/> {selectedProduct.stock > 0 ? (isAuthenticated ? "Agregar al carrito" : "Ingresa para comprar") : "Agotado"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CARRITO LATERAL */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-end z-50 animate-in fade-in duration-300"
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            className="bg-slate-900 w-full max-w-md h-full border-l border-slate-800 p-8 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">Mi Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform"><X size={30}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4 bg-slate-800/40 p-3 rounded-xl items-center border border-slate-800 group animate-in slide-in-from-right duration-300">
                  <img src={item.image_url} className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1" />
                  <div className="flex-1">
                    <p className="text-xs font-bold truncate w-32 text-slate-200 uppercase">{item.name}</p>
                    <p className="text-cyan-400 font-black tracking-tight">${item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-slate-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                    <Trash size={16}/>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between mb-6">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-cyan-500 tracking-tighter">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleConfirmPurchase} 
                disabled={cart.length === 0} 
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 py-4 rounded-xl font-black uppercase disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
              >
                Confirmar Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDICIÓN */}
      {editingProduct && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl scale-in-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black mb-6 uppercase tracking-tighter italic border-b border-slate-800 pb-2">Editar Componente</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre</label>
                <input 
                  type="text" 
                  value={editingProduct.name} 
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-500 transition-all text-sm font-bold shadow-inner" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Precio (USD)</label>
                <input 
                  type="number" 
                  value={editingProduct.price} 
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-500 transition-all text-sm font-bold shadow-inner" 
                />
              </div>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-black uppercase shadow-lg shadow-cyan-950/20 active:scale-95 transition-all mt-4 tracking-widest text-xs">
                Guardar Cambios
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-widest py-2 hover:text-white transition-colors">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App