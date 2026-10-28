import React from 'react';
import { Heart, Sparkles, Lock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-rose-100 bg-white/60 backdrop-blur-sm py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-serif font-bold text-lg">
              ✨
            </div>
            <div>
              <p className="font-serif-title text-base font-semibold text-slate-800">
                Viaje de Vida • Plataforma de Entrega de Recuerdos
              </p>
              <p className="text-xs text-slate-500">
                Conectando momentos especiales con quienes más amas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              Contraseñas Hasheadas
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Supabase Storage Privado
            </span>
            <span className="flex items-center gap-1">
              Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para ti
            </span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Viaje de Vida. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
