import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, ShieldCheck, HelpCircle, Heart, Sparkles, Building2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-orange-400 p-0.5 shadow-md group-hover:shadow-rose-300/50 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-serif-title font-bold text-2xl tracking-tight bg-gradient-to-r from-rose-600 via-amber-700 to-orange-600 bg-clip-text text-transparent">
                Viaje de Vida
              </span>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase -mt-1 flex items-center gap-1">
                Entregables & Recuerdos <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 inline" />
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/empresa"
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                isActive('/empresa') || isActive('/')
                  ? 'bg-rose-50 text-rose-700 font-semibold shadow-sm border border-rose-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-rose-500" />
              <span>Gestión Empresa</span>
            </Link>

            <Link
              to="/ayuda"
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                isActive('/ayuda')
                  ? 'bg-amber-50 text-amber-800 font-semibold shadow-sm border border-amber-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Guía & Ayuda</span>
            </Link>
          </nav>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-xs font-medium text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Acceso Seguro RLS / Crypt</span>
          </div>

        </div>
      </div>
    </header>
  );
}
