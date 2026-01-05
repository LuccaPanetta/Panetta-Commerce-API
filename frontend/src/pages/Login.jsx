import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', email); 
    formData.append('password', password);

    try {
      const res = await axios.post('http://127.0.0.1:8000/login', formData);
      localStorage.setItem('token', res.data.access_token);
      alert("¡Bienvenido, Lucca!");
      navigate('/'); // Volver a la home logueado
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-6 text-center tracking-tighter">INICIAR SESIÓN</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
            <input 
              type="email" placeholder="Email" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-cyan-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
            <input 
              type="password" placeholder="Contraseña" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-cyan-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl mt-8 transition-all active:scale-95 shadow-lg shadow-cyan-900/20">
          Entrar al Sistema
        </button>
      </form>
    </div>
  );
}