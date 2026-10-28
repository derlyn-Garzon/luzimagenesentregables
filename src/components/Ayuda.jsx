import React, { useState } from 'react';
import {
  Building2, UserCheck, HelpCircle, ChevronDown, Key, Link2,
  Download, FileText, ShieldCheck, Sparkles, Heart
} from 'lucide-react';

export default function Ayuda() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: '¿Cómo garantizamos la seguridad de las imágenes del cliente?',
      a: 'Todas las imágenes de alta calidad se resguardan en un bucket privado de Supabase Storage. El acceso no utiliza enlaces públicos permanentes, sino URLs firmadas temporales que se generan dinámicamente solo después de validar la contraseña única del cliente.'
    },
    {
      q: '¿Qué hago si un cliente pierde su contraseña única?',
      a: 'La empresa puede acceder en todo momento al panel de "Gestión Empresa" y hacer clic en el botón "Copiar Clave" para brindársela nuevamente al cliente de forma segura.'
    },
    {
      q: '¿Cómo funciona la descarga del archivo PDF?',
      a: 'En el portal del cliente, al pulsar "Descargar PDF", el sistema compila la imagen de presentación junto con el nombre del cliente, nombre del producto y mensaje de entrega en un documento PDF de alta resolución listo para imprimir o conservar.'
    },
    {
      q: '¿Las contraseñas de los clientes se guardan en texto plano?',
      a: 'No. En la base de datos PostgreSQL de Supabase, las contraseñas se almacenan mediante hashing cifrado SHA-256 para cumplir con las mejores prácticas de privacidad y seguridad.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* Header Emotivo */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-600" /> Centro de Ayuda & Guía
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-slate-900">
          ¿Cómo funciona Viaje de Vida?
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          Guía paso a paso para la gestión de entregables por parte de la empresa y la experiencia de los clientes al recibir sus recuerdos.
        </p>
      </div>

      {/* Guías Divididas en 2 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Guía para la Empresa */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-lg text-slate-900">Guía para la Empresa</h2>
              <p className="text-xs text-slate-500">Gestión de entregables y credenciales</p>
            </div>
          </div>

          <ol className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <strong className="text-slate-800">Crear Entregable:</strong> En la sección "Gestión Empresa", haz clic en "Nuevo Entregable", asocia la imagen, selecciona el cliente y fija la fecha límite.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <strong className="text-slate-800">Contraseña Automática:</strong> El sistema generará una contraseña única segura (ej: <code>VDV-AMOR2025</code>) y guardará su hash cifrado.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <strong className="text-slate-800">Compartir al Cliente:</strong> Usa los botones de un solo clic 🔗 <strong>"Copiar URL"</strong> y 🔑 <strong>"Copiar Clave"</strong> para enviárselos a tu cliente.
              </div>
            </li>
          </ol>
        </div>

        {/* Guía para el Cliente */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-lg text-slate-900">Guía para el Cliente</h2>
              <p className="text-xs text-slate-500">Acceso a recuerdos y descargas</p>
            </div>
          </div>

          <ol className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <strong className="text-slate-800">Ingresar al Enlace:</strong> Abre el enlace único que te envió la empresa desde cualquier dispositivo.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <strong className="text-slate-800">Validar Contraseña:</strong> Introduce tu clave única. El sistema verificará tu acceso y generará un enlace protegido temporal.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <strong className="text-slate-800">Revivir & Descargar:</strong> Disfruta de la vista de alta calidad y utiliza los botones 📥 <strong>"Descargar Imagen"</strong> o 📄 <strong>"Descargar PDF"</strong>.
              </div>
            </li>
          </ol>
        </div>

      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest">Atención Cálida & Empática</span>
          <h2 className="text-2xl font-serif-title font-bold text-slate-900">Preguntas Frecuentes (FAQ)</h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 bg-slate-50/50 hover:bg-slate-50 font-serif-title font-semibold text-slate-800 text-sm sm:text-base flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
