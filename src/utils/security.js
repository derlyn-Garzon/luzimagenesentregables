/**
 * Utilidades de Seguridad y Cifrado de Contraseñas
 * Utiliza Web Crypto API nativa del navegador para hashing SHA-256 seguro.
 */

/**
 * Genera una contraseña única con formato legible y seguro.
 * Ejemplo: VDV-9A7K2M
 */
export function generateUniquePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evitamos I, O, 0, 1 para evitar confusiones
  let result = 'VDV-';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Calcula el hash SHA-256 de una contraseña.
 * Devuelve un string hexadecimal.
 */
export async function hashPassword(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifica si una contraseña coincide con el hash almacenado.
 */
export async function verifyPassword(inputPassword, storedHash) {
  if (!inputPassword || !storedHash) return false;
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}
