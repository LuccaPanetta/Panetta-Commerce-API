import { ShoppingCart, User, Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="text-cyan-400" size={32} />
          <span className="text-xl font-black tracking-tighter">PANETTA <span className="text-cyan-500">HW</span></span>
        </div>
        
        <div className="flex items-center gap-6 text-slate-300">
          <button className="hover:text-white transition cursor-pointer">Productos</button>
          <div className="h-6 w-px bg-slate-800"></div>
          <button className="hover:text-cyan-400 transition relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}