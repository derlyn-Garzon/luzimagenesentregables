import { createClient } from '@supabase/supabase-js';
import { hashPassword, verifyPassword, generateUniquePassword } from '../utils/security';

// Supabase environment keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Key for Local Storage fallback persistence
const LOCAL_STORAGE_KEY = 'viaje_de_vida_deliverables_v2';
const LOCAL_CLIENTS_KEY = 'viaje_de_vida_clients_v2';

// High quality visual placeholders for demo memories
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', // Wedding
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Beach sunset
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Travel
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', // Event / Celebration
];

// Datos iniciales de demostración
const INITIAL_CLIENTS = [
  { id: 'cli-001', nombre: 'Mariana & Carlos Rossi', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'cli-002', nombre: 'Sofía Fernández', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'cli-003', nombre: 'Familia Mendoza', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
];

async function getInitialDeliverables() {
  const hash1 = await hashPassword('VDV-AMOR2025');
  const hash2 = await hashPassword('VDV-AVENTURA88');
  const hash3 = await hashPassword('VDV-FAMILIA10');

  return [
    {
      id: 'deliv-101',
      cliente_id: 'cli-003',
      cliente_nombre: 'Familia Mendoza',
      nombre_producto: 'Álbum Fotográfico: Encuentro Anual en la Montaña',
      descripcion_leve: 'Una colección cálida de momentos compartidos durante el amanecer en los Picos Blancos.',
      fecha_limite: '2025-04-15',
      imagen_url: SAMPLE_IMAGES[2],
      password_hash: hash3,
      plain_password: 'VDV-FAMILIA10', // Solo visible en panel empresa para facilidad de demostración
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
    },
    {
      id: 'deliv-102',
      cliente_id: 'cli-002',
      cliente_nombre: 'Sofía Fernández',
      nombre_producto: 'Sesión Personal: Retratos de Viaje y Libertad',
      descripcion_leve: 'Imágenes capturando la paz del atardecer frente al mar Caribe.',
      fecha_limite: '2025-04-10',
      imagen_url: SAMPLE_IMAGES[1],
      password_hash: hash2,
      plain_password: 'VDV-AVENTURA88',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: 'deliv-103',
      cliente_id: 'cli-001',
      cliente_nombre: 'Mariana & Carlos Rossi',
      nombre_producto: 'Memoria Nupcial: El Gran Día',
      descripcion_leve: 'Recuerdos inolvidables de una ceremonia rodeada de flores, risas y seres queridos.',
      fecha_limite: '2025-03-30',
      imagen_url: SAMPLE_IMAGES[0],
      password_hash: hash1,
      plain_password: 'VDV-AMOR2025',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    }
  ];
}

// Inicialización de Local Storage
async function initializeLocalStorage() {
  if (!localStorage.getItem(LOCAL_CLIENTS_KEY)) {
    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const deliverables = await getInitialDeliverables();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deliverables));
  }
}

initializeLocalStorage();

/**
 * Obtener todos los clientes
 */
export async function getClients() {
  if (supabase) {
    const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  const raw = localStorage.getItem(LOCAL_CLIENTS_KEY);
  return raw ? JSON.parse(raw) : INITIAL_CLIENTS;
}

/**
 * Crear un nuevo cliente
 */
export async function createClientRecord(nombre) {
  const newClient = {
    id: `cli-${Date.now()}`,
    nombre: nombre.trim(),
    created_at: new Date().toISOString()
  };

  if (supabase) {
    const { data, error } = await supabase.from('clientes').insert([{ nombre: newClient.nombre }]).select().single();
    if (!error && data) return data;
  }

  const clients = await getClients();
  const updated = [newClient, ...clients];
  localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(updated));
  return newClient;
}

/**
 * Obtener todos los entregables ordenados por fecha de creación descendente (created_at DESC)
 */
export async function getDeliverables() {
  if (supabase) {
    const { data, error } = await supabase
      .from('entregables')
      .select('*, clientes(nombre)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(item => ({
        ...item,
        cliente_nombre: item.clientes?.nombre || 'Cliente General'
      }));
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  let list = raw ? JSON.parse(raw) : await getInitialDeliverables();

  // Garantizar orden descendente por fecha de creación
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Obtener metadata básica de un entregable por ID
 */
export async function getDeliverableMetadata(id) {
  const deliverables = await getDeliverables();
  const found = deliverables.find(d => d.id === id);
  if (!found) return null;

  // No retornar password_hash por seguridad en respuestas públicas generales
  return {
    id: found.id,
    cliente_nombre: found.cliente_nombre,
    nombre_producto: found.nombre_producto,
    descripcion_leve: found.descripcion_leve,
    fecha_limite: found.fecha_limite,
    created_at: found.created_at
  };
}

/**
 * Validar la contraseña única del cliente y devolver la Signed URL generada
 */
export async function authenticateClientDeliverable(id, inputPassword) {
  const deliverables = await getDeliverables();
  const deliverable = deliverables.find(d => d.id === id);

  if (!deliverable) {
    return { success: false, error: 'Entregable no encontrado' };
  }

  const isValid = await verifyPassword(inputPassword, deliverable.password_hash);

  if (!isValid) {
    return { success: false, error: 'La contraseña ingresada no es correcta. Por favor verifica e intenta de nuevo.' };
  }

  let signedUrl = deliverable.imagen_url;

  // Si estamos usando Supabase Storage con bucket privado
  if (supabase && deliverable.imagen_url && deliverable.imagen_url.includes('supabase')) {
    try {
      const path = deliverable.imagen_url.split('/').pop();
      const { data, error } = await supabase.storage
        .from('entregables-privados')
        .createSignedUrl(path, 3600); // URL firmada válida por 1 hora

      if (data?.signedUrl) {
        signedUrl = data.signedUrl;
      }
    } catch (e) {
      console.warn('Error al generar URL firmada de Supabase Storage:', e);
    }
  }

  return {
    success: true,
    deliverable: {
      ...deliverable,
      signedUrl
    }
  };
}

/**
 * Crear un nuevo entregable
 */
export async function createDeliverable(payload) {
  const { cliente_id, cliente_nombre, nombre_producto, descripcion_leve, fecha_limite, imagen_url, custom_password } = payload;

  const rawPassword = custom_password && custom_password.trim() ? custom_password.trim() : generateUniquePassword();
  const password_hash = await hashPassword(rawPassword);

  const newDeliverable = {
    id: `deliv-${Date.now()}`,
    cliente_id,
    cliente_nombre,
    nombre_producto,
    descripcion_leve,
    fecha_limite,
    imagen_url: imagen_url || SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
    password_hash,
    plain_password: rawPassword, // Guardamos la versión sin hashear para que la empresa pueda copiarla
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('entregables')
        .insert([{
          cliente_id,
          nombre_producto,
          descripcion_leve,
          fecha_limite,
          imagen_url: newDeliverable.imagen_url,
          password_hash
        }])
        .select()
        .single();

      if (!error && data) {
        return {
          ...data,
          cliente_nombre,
          plain_password: rawPassword
        };
      }
    } catch (e) {
      console.warn('Error guardando en Supabase, guardando localmente:', e);
    }
  }

  const deliverables = await getDeliverables();
  const updatedList = [newDeliverable, ...deliverables];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  return newDeliverable;
}

/**
 * Eliminar entregable
 */
export async function deleteDeliverable(id) {
  if (supabase) {
    await supabase.from('entregables').delete().eq('id', id);
  }
  const deliverables = await getDeliverables();
  const filtered = deliverables.filter(d => d.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
