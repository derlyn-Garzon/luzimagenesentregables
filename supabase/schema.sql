-- ==========================================
-- ESQUEMA DE BASE DE DATOS: VIAJE DE VIDA
-- Supabase / PostgreSQL Schema & RLS Setup
-- ==========================================

-- Enable extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Entregables / Productos vinculados al viaje del cliente
CREATE TABLE IF NOT EXISTS entregables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nombre_producto VARCHAR(255) NOT NULL,
  descripcion_leve TEXT,
  fecha_limite DATE NOT NULL,
  imagen_url TEXT NOT NULL, -- Ruta privada en Supabase Storage
  password_hash TEXT NOT NULL, -- Hash SHA-256 de la contraseña única generada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para ordenamiento descendente eficiente por fecha de creación
CREATE INDEX IF NOT EXISTS idx_entregables_created_at ON entregables (created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregables ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para acceso lectura/escritura en la aplicación
CREATE POLICY "Permitir lectura publica de entregables" ON entregables FOR SELECT USING (true);
CREATE POLICY "Permitir insercion de entregables" ON entregables FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion de entregables" ON entregables FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminacion de entregables" ON entregables FOR DELETE USING (true);

CREATE POLICY "Permitir lectura publica de clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Permitir insercion de clientes" ON clientes FOR INSERT WITH CHECK (true);

-- Configuración sugerida para Supabase Storage:
-- 1. Crear un Bucket Privado llamado 'entregables-privados'
-- 2. Configurar RLS en storage.objects para limitar la descarga pública directa y forzar URLs Firmadas (Signed URLs).
