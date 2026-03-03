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

/**
 * Normalizar y validar especialidad médica
 * Convierte valores como "medicina" a "medicina_general" y valida contra TipoProfesion
 */
export function normalizarEspecialidad(
  especialidad: string | undefined | null,
  fallback: string = 'fisioterapia'
): string {
  if (!especialidad) {
    return fallback;
  }

  // Mapeo de valores comunes a valores válidos de TipoProfesion
  const mapeoEspecialidades: Record<string, string> = {
    'medicina': 'medicina_general',
    'medico': 'medicina_general',
    'doctor': 'medicina_general',
    'fisio': 'fisioterapia',
    'fisioterapeuta': 'fisioterapia',
    'psicologo': 'psicologia',
    'psicóloga': 'psicologia',
    'psicólogo': 'psicologia',
    'nutriologo': 'nutricion',
    'nutriólogo': 'nutricion',
    'nutricionista': 'nutricion',
    'odontologo': 'odontologia',
    'odontólogo': 'odontologia',
    'dentista': 'odontologia',
  };

  // Convertir a minúsculas y quitar espacios
  const especialidadNormalizada = especialidad.toLowerCase().trim();
  
  // Aplicar mapeo si existe
  const especialidadMapeada = mapeoEspecialidades[especialidadNormalizada] || especialidadNormalizada;

  // Validar que sea una especialidad válida
  const especialidadesValidas = [
    'fisioterapia',
    'psicologia',
    'nutricion',
    'medicina_general',
    'odontologia'
  ];

  if (especialidadesValidas.includes(especialidadMapeada)) {
    return especialidadMapeada;
  }

  // Si no es válida, usar el fallback
  console.warn(`Especialidad "${especialidad}" no válida. Usando fallback: ${fallback}`);
  return fallback;
}

/**
 * Obtener especialidad con fallback a configuración del sistema
 */
export function obtenerEspecialidadConFallback(
  especialidadPrincipal: string | undefined | null,
  especialidadConfiguracion: string | undefined | null
): string {
  const especialidad = normalizarEspecialidad(especialidadPrincipal);
  
  // Si la especialidad principal es válida y no es el fallback por defecto, usarla
  if (especialidad && especialidad !== 'fisioterapia') {
    return especialidad;
  }
  
  // Si la especialidad es 'fisioterapia', necesitamos verificar si fue:
  // 1. Especificada explícitamente (ej: 'fisioterapia', 'fisio') → devolver 'fisioterapia'
  // 2. Resultado de fallback por valor inválido (ej: 'invalid') → usar configuración
  if (especialidad === 'fisioterapia') {
    // Verificar si el valor original se mapea directamente a 'fisioterapia'
    const mapeoDirecto: Record<string, boolean> = {
      'fisioterapia': true,
      'fisio': true,
      'fisioterapeuta': true
    };
    
    if (especialidadPrincipal && mapeoDirecto[especialidadPrincipal.toLowerCase().trim()]) {
      return 'fisioterapia';
    }
    
    // Si no es un mapeo directo, es un fallback por valor inválido
    // Usar la configuración
  }
  
  // Si no, usar la especialidad de configuración
  return normalizarEspecialidad(especialidadConfiguracion);
}
