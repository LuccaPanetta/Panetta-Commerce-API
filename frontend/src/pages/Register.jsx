import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react'

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Nuevo campo para verificar
    full_name: ''
  })
  
  const [showPassword, setShowPassword] = useState(false) // Estado para el "ojito"
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Verificación de contraseñas iguales
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      // Enviamos solo los datos que el backend espera
      const { email, password, full_name } = formData
      await axios.post('http://127.0.0.1:8000/users/', { email, password, full_name })
      
      alert("¡Cuenta creada con éxito! Iniciá sesión para comprar.")
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrarse. Intenta con otro email.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <div className="text-center mb-8">
          <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <UserPlus className="text-cyan-500" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Unirme a Panetta</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-black mb-6 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NOMBRE */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500 transition-all text-sm"
                placeholder="Tu nombre"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500 transition-all text-sm"
                placeholder="correo@ejemplo.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* CONTRASEÑA CON OJITO */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-cyan-500 transition-all text-sm"
                placeholder="Mínimo 6 caracteres"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* VERIFICAR CONTRASEÑA */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Repetir Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500 transition-all text-sm"
                placeholder="Verificá tu contraseña"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-900/20 mt-4"
          >
            Registrarme
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-slate-500 text-sm">¿Ya sos parte?</p>
          <Link to="/login" className="text-cyan-500 font-black uppercase text-xs tracking-widest hover:text-cyan-400 transition-colors">
            Iniciá Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register