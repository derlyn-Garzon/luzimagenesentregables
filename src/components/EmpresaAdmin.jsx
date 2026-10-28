import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Copy, Check, Calendar, User, Image as ImageIcon,
  Key, Link2, Clock, Sparkles, Trash2, Search, AlertCircle, FileText, Upload
} from 'lucide-react';
import {
  getDeliverables, getClients, createDeliverable, createClientRecord, deleteDeliverable
} from '../services/storageService';
import { generateUniquePassword } from '../utils/security';

export default function EmpresaAdmin() {
  const [deliverables, setDeliverables] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState(null); // { id, type: 'url' | 'password' }

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [delivs, clis] = await Promise.all([getDeliverables(), getClients()]);
      setDeliverables(delivs);
      setClients(clis);
      if (clis.length > 0) {
        setSelectedClientId(clis[0].id);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }

  // Sube imagen como dataURL local o acepta URL directa
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDeliverable = async (e) => {
    e.preventDefault();
    if (!productName || !deadline) return;

    setIsSubmitting(true);
    try {
      let activeClientId = selectedClientId;
      let activeClientName = clients.find(c => c.id === selectedClientId)?.nombre;

      if (isAddingNewClient && newClientName.trim()) {
        const createdClient = await createClientRecord(newClientName.trim());
        activeClientId = createdClient.id;
        activeClientName = createdClient.nombre;
        setClients(prev => [createdClient, ...prev]);
      }

      const created = await createDeliverable({
        cliente_id: activeClientId,
        cliente_nombre: activeClientName || 'Cliente',
        nombre_producto: productName,
        descripcion_leve: description,
        fecha_limite: deadline,
        imagen_url: imageUrl,
        custom_password: customPassword
      });

      setDeliverables(prev => [created, ...prev]);

      // Reset Form
      setProductName('');
      setDescription('');
      setDeadline('');
      setImageUrl('');
      setCustomPassword('');
      setNewClientName('');
      setIsAddingNewClient(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error al guardar entregable:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este entregable?')) {
      await deleteDeliverable(id);
      setDeliverables(prev => prev.filter(item => item.id !== id));
    }
  };

  const copyToClipboard = (text, id, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem({ id, type });
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const getClientUrl = (id) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/entregables-cliente/${id}`;
  };

  // Filtrado de lista
  const filteredDeliverables = deliverables.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.nombre_producto?.toLowerCase().includes(term) ||
      item.cliente_nombre?.toLowerCase().includes(term) ||
      item.descripcion_leve?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Banner de Bienvenida y Header de la Sección */}
      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Sparkles className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold leading-tight">
            Gestión de Entregables Empresa
          </h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Administra tus carpetas de imágenes y transforma entregas digitales en experiencias emotivas e inolvidables para cada uno de tus clientes.
          </p>
        </div>
      </div>

      {/* Barra Superior de Acciones & Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">

        {/* Input de Búsqueda */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
          />
        </div>

        {/* Botón Abrir Formulario */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? 'Cerrar Gestor de Carga' : 'Nuevo Entregable'}</span>
        </button>
      </div>

      {/* Gestor de Carga / Formulario de Creación */}
      {showForm && (
        <form onSubmit={handleCreateDeliverable} className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-rose-100 space-y-6 transition-all">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-serif-title font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Preparar Nuevo Producto / Entregable
            </h2>
            <p className="text-xs text-slate-500">
              Asocia una imagen de presentación, asigna cliente y fecha límite. El sistema generará una contraseña única y segura automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Selección o Creación de Cliente */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cliente Asociado
              </label>
              {!isAddingNewClient ? (
                <div className="flex gap-2">
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewClient(true)}
                    className="px-3 py-2.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 border border-rose-200"
                  >
                    + Nuevo
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre completo del cliente..."
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    required
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAddingNewClient(false)}
                    className="px-3 py-2.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Nombre del Producto */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Nombre del Producto / Memoria
              </label>
              <input
                type="text"
                placeholder="Ej: Álbum Nupcial, Sesión Fotográfica..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Fecha Límite */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Fecha Límite de Entrega
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Contraseña opcional previa */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Contraseña Única del Cliente</span>
                <span className="text-[10px] text-slate-400 font-normal">Opcional (Generación automática)</span>
              </label>
              <input
                type="text"
                placeholder="Dejar vacío para auto-generar (ej: VDV-9A7K2M)"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
              />
            </div>

          </div>

          {/* Descripción Leve / Emotiva */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Descripción Breve / Mensaje Emotivo
            </label>
            <textarea
              rows={3}
              placeholder="Un breve mensaje dedicado al cliente que aparecerá al acceder a sus recuerdos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Imagen de Presentación */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Imagen de Presentación
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  placeholder="URL de la imagen (ej: https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 border border-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    Subir archivo local
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400">o pega una URL directa</span>
                </div>
              </div>

              {/* Vista previa miniatura */}
              {imageUrl && (
                <div className="w-24 h-24 rounded-xl border-2 border-rose-200 overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                  <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Guardando...' : 'Crear Entregable'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Entregables (Visualización en Orden Cronológico Descendente) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif-title font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            Catálogo de Entregables ({filteredDeliverables.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Ordenado: Más reciente a más antiguo
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 animate-pulse">
            Cargando catálogo de recuerdos...
          </div>
        ) : filteredDeliverables.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-100 shadow-sm">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">No se encontraron entregables.</p>
            <p className="text-xs text-slate-400">
              Usa el botón "Nuevo Entregable" para registrar tu primer producto de imágenes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliverables.map((item) => {
              const clientUrl = getClientUrl(item.id);
              const isUrgent = new Date(item.fecha_limite) <= new Date(Date.now() + 86400000 * 3);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-rose-100/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Miniatura de la imagen de presentación */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imagen_url}
                      alt={item.nombre_producto}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge de Cliente */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-sm">
                      <User className="w-3.5 h-3.5 text-rose-500" />
                      <span>{item.cliente_nombre}</span>
                    </div>

                    {/* Fecha Límite Destacada Visualmente */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                      isUrgent ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-900/80 backdrop-blur-md text-amber-300'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Límite: {item.fecha_limite}</span>
                    </div>

                    {/* Nombre del Producto sobre la foto */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif-title font-bold text-lg drop-shadow-md leading-snug">
                        {item.nombre_producto}
                      </h3>
                    </div>
                  </div>

                  {/* Detalle y Descripción */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {item.descripcion_leve ? (
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                          "{item.descripcion_leve}"
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Sin descripción adicional.</p>
                      )}
                    </div>

                    {/* Información de Contraseña y Acceso */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-amber-600" /> Contraseña Única:
                        </span>
                        <code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-xs">
                          {item.plain_password || '********'}
                        </code>
                      </div>
                    </div>

                    {/* Herramientas de Acceso Rápido (Botones) */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">

                        {/* 🔗 Botón "Copiar URL" */}
                        <button
                          onClick={() => copyToClipboard(clientUrl, item.id, 'url')}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copiedItem?.id === item.id && copiedItem?.type === 'url' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>¡Copiada!</span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5" />
                              <span>Copiar URL</span>
                            </>
                          )}
                        </button>

                        {/* 🔑 Botón "Copiar Contraseña" */}
                        <button
                          onClick={() => copyToClipboard(item.plain_password || 'VDV-AMOR2025', item.id, 'password')}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copiedItem?.id === item.id && copiedItem?.type === 'password' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>¡Copiada!</span>
                            </>
                          ) : (
                            <>
                              <Key className="w-3.5 h-3.5" />
                              <span>Copiar Clave</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Abrir vista previa del cliente & eliminar */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <a
                          href={clientUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-rose-600 font-medium underline flex items-center gap-1"
                        >
                          Ver portal cliente →
                        </a>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Eliminar entregable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
