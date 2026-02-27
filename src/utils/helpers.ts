// ============================================================================
// saludvalpa 3.0 - HELPERS
// Utilidades y funciones auxiliares
// ============================================================================

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatear fecha según preferencias del usuario
 */
export function formatearFecha(fecha: Date, formato: string = 'dd/MM/yyyy'): string {
  return format(fecha, formato, { locale: es });
}

/**
 * Formatear fecha y hora
 */
export function formatearFechaHora(fecha: Date): string {
  return format(fecha, 'dd/MM/yyyy HH:mm', { locale: es });
}

/**
 * Calcular edad desde fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  
  return edad;
}

/**
 * Generar UUID v4
 */
export function generarUUID(): string {
  return crypto.randomUUID();
}

/**
 * Formatear moneda
 */
export function formatearMoneda(cantidad: number, moneda: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
  }).format(cantidad);
}

/**
 * Validar email
 */
export function esEmailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validar teléfono (formato flexible)
 */
export function esTelefonoValido(telefono: string): boolean {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(telefono) && telefono.replace(/\D/g, '').length >= 10;
}

/**
 * Obtener iniciales de un nombre
 */
export function obtenerIniciales(nombre: string, apellidos: string): string {
  const inicialesNombre = nombre.charAt(0).toUpperCase();
  const inicialesApellidos = apellidos.charAt(0).toUpperCase();
  return `${inicialesNombre}${inicialesApellidos}`;
}

/**
 * Truncar texto
 */
export function truncarTexto(texto: string, maxLength: number = 50): string {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
}

/**
 * Convertir imagen a Base64
 */
export function convertirImagenABase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Descargar archivo
 */
export function descargarArchivo(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
