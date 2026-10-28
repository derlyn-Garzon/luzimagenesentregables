import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Key, Lock, Download, FileText, Heart, Sparkles, ShieldCheck,
  ArrowLeft, CheckCircle2, AlertCircle, Eye, Calendar, User, Image as ImageIcon
} from 'lucide-react';
import { getDeliverableMetadata, authenticateClientDeliverable } from '../services/storageService';
import { downloadDeliverablePDF } from '../utils/pdfGenerator';

export default function ClientePortal() {
  const { id } = useParams();
  const pdfCardRef = useRef(null);

  const [metadata, setMetadata] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticatedData, setAuthenticatedData] = useState(null); // deliverable payload after valid auth

  // PDF generation state
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      setLoadingMeta(true);
      try {
        const meta = await getDeliverableMetadata(id);
        setMetadata(meta);
      } catch (err) {
        console.error('Error cargando metadata:', err);
      } finally {
        setLoadingMeta(false);
      }
    }
    loadMeta();
  }, [id]);

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setAuthenticating(true);
    setAuthError('');

    try {
      const res = await authenticateClientDeliverable(id, passwordInput.trim());
      if (res.success) {
        setAuthenticatedData(res.deliverable);
      } else {
        setAuthError(res.error || 'La contraseña ingresada no es válida.');
      }
    } catch (err) {
      console.error('Error al autenticar:', err);
      setAuthError('Ocurrió un error al verificar el acceso. Inténtalo nuevamente.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!authenticatedData?.signedUrl) return;

    const link = document.createElement('a');
    link.href = authenticatedData.signedUrl;
    link.download = `Recuerdo_${authenticatedData.cliente_nombre}_${authenticatedData.nombre_producto}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    if (!authenticatedData) return;

    setGeneratingPdf(true);
    try {
      await downloadDeliverablePDF(authenticatedData, pdfCardRef);
    } catch (err) {
      console.error('Error descargando PDF:', err);
      alert('Ocurrió un problema al generar el documento PDF.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loadingMeta) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Cargando tus recuerdos...</p>
        </div>
      </div>
    );
  }

  // Si no se autenticó aún: Muestra la pantalla de validación inspiradora
  if (!authenticatedData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-20">

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-100 relative overflow-hidden space-y-8">

          {/* Fondo decorativo superior */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500" />

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner border border-rose-100">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Acceso Exclusivo • Viaje de Vida
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-slate-900">
                Tu viaje, tus momentos ✨
              </h1>
            </div>

            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Ingresa la contraseña única proporcionada por la empresa para abrir la puerta a tus recuerdos más especiales.
            </p>
          </div>

          {/* Formulario de Contraseña */}
          <form onSubmit={handleAuthenticate} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider text-center">
                Contraseña Única del Entregable
              </label>

              <div className="relative">
                <Key className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  placeholder="Ej: VDV-AMOR2025"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-lg font-mono font-bold text-slate-800 tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all uppercase placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                />
              </div>

              {authError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-4 bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {authenticating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando contraseña...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Ingresar a Mis Recuerdos</span>
                </>
              )}
            </button>
          </form>

          {/* Información de Seguridad */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Enlace protegido mediante URLs firmadas y cifrado seguro.</span>
          </div>

        </div>

      </div>
    );
  }

  // Vista Principal del Entregable (Post-Autenticación)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Mensaje de Bienvenida Emotivo */}
      <div className="bg-gradient-to-br from-rose-500 via-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-white" /> ¡Bienvenido/a a tu espacio de recuerdos!
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-title font-bold leading-tight">
            Hola, {authenticatedData.cliente_nombre} 👋
          </h1>

          <p className="text-rose-100 text-base sm:text-lg font-serif italic leading-relaxed">
            "{authenticatedData.descripcion_leve || 'Cada imagen es una ventana a un momento irrepetible en el viaje de tu vida.'}"
          </p>
        </div>
      </div>

      {/* Contenedor del Entregable para Generación de PDF / Visualización */}
      <div ref={pdfCardRef} className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-rose-100 space-y-8">

        {/* Header con Nombre del Producto */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Producto Entregable
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-slate-900 mt-1">
              {authenticatedData.nombre_producto}
            </h2>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Fecha Límite: {authenticatedData.fecha_limite}</span>
          </div>
        </div>

        {/* Visualizador de Imagen Elegante */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl group">
            <img
              src={authenticatedData.signedUrl}
              alt={authenticatedData.nombre_producto}
              className="w-full h-[450px] sm:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex justify-between items-center bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl">
              <span>{authenticatedData.cliente_nombre}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Alta Calidad Garantizada
              </span>
            </div>
          </div>
        </div>

        {/* Detalles Emotivos */}
        <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 space-y-2">
          <h3 className="font-serif-title font-semibold text-slate-800 text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            Detalles de la Entrega
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {authenticatedData.descripcion_leve || 'Esta entrega ha sido preparada con máximo cuidado y cariño para preservar tus momentos más importantes.'}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setAuthenticatedData(null)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Cerrar Sesión / Salir
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">

            {/* 📥 Botón "Descargar Imagen" */}
            <button
              onClick={handleDownloadImage}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>Descargar Imagen</span>
            </button>

            {/* 📄 Botón "Descargar PDF" */}
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPdf}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{generatingPdf ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
