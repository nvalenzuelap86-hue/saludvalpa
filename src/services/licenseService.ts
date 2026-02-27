// ============================================================================
// saludvalpa 3.0 - LICENSE SERVICE
// Sistema de gestión y validación de licencias - Versión 2.0
// ============================================================================

import { db } from '../db/database';
import { TipoLicencia, EstadoLicencia, type Licencia } from '../types';

// URL del archivo JSON de códigos (en public/)
const LICENSE_CODES_URL = '/license-codes.json';

// Cache para códigos válidos
let cachedValidCodes: Set<string> | null = null;
let cachedCodeDetails: Map<string, any> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Clave para almacenar códigos usados en localStorage (como fallback)
const USED_CODES_STORAGE_KEY = 'valpa_used_license_codes';

/**
 * Obtener códigos usados desde localStorage
 */
function obtenerCodigosUsados(): Set<string> {
  try {
    const stored = localStorage.getItem(USED_CODES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch (error) {
    console.error('Error al leer códigos usados:', error);
  }
  return new Set();
}

/**
 * Marcar un código como usado
 */
function marcarCodigoComoUsado(codigo: string): void {
  try {
    const usedCodes = obtenerCodigosUsados();
    usedCodes.add(codigo.toUpperCase().trim());
    localStorage.setItem(USED_CODES_STORAGE_KEY, JSON.stringify(Array.from(usedCodes)));
    console.log(`✅ Código ${codigo} marcado como usado`);
  } catch (error) {
    console.error('Error al marcar código como usado:', error);
  }
}

/**
 * Verificar si un código ya fue usado
 */
function esCodigoUsado(codigo: string): boolean {
  const usedCodes = obtenerCodigosUsados();
  return usedCodes.has(codigo.toUpperCase().trim());
}

/**
 * Cargar códigos válidos desde el archivo JSON externo
 */
async function cargarCodigosValidos(): Promise<{
  codes: Set<string>;
  details: Map<string, any>;
}> {
  const now = Date.now();
  
  // Usar cache si está fresco
  if (cachedValidCodes && cachedCodeDetails && (now - lastFetchTime) < CACHE_DURATION) {
    return { codes: cachedValidCodes, details: cachedCodeDetails };
  }
  
  try {
    const response = await fetch(LICENSE_CODES_URL);
    if (!response.ok) {
      throw new Error(`Error al cargar códigos: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Crear sets y maps para búsqueda rápida
    const codes = new Set<string>();
    const details = new Map<string, any>();
    
    // Obtener códigos ya usados
    const usedCodes = obtenerCodigosUsados();
    
    data.codigos.forEach((codigoInfo: any) => {
      // Solo incluir códigos que estén disponibles Y no hayan sido usados
      if (codigoInfo.estado === 'disponible' && !usedCodes.has(codigoInfo.codigo)) {
        codes.add(codigoInfo.codigo);
        details.set(codigoInfo.codigo, codigoInfo);
      }
    });
    
    // Actualizar cache
    cachedValidCodes = codes;
    cachedCodeDetails = details;
    lastFetchTime = now;
    
    console.log(`✅ Cargados ${codes.size} códigos válidos desde ${LICENSE_CODES_URL} (${usedCodes.size} códigos usados excluidos)`);
    
    return { codes, details };
  } catch (error) {
    console.error('❌ Error al cargar códigos de licencia:', error);
    
    // Fallback a códigos hardcodeados si falla la carga
    const fallbackCodes = new Set([
      'saludvalpa-X9K2M-7P4QW-3T8ZN',
      'saludvalpa-B5H3R-9V6YL-2F4GJ',
      'saludvalpa-C8N1K-4M7PX-6D9WT',
      'BETA-PRO-2026-A1B2C',
      'BETA-PRO-2026-D3E4F'
    ]);
    
    const fallbackDetails = new Map();
    fallbackCodes.forEach(code => {
      fallbackDetails.set(code, {
        tipo: code.startsWith('BETA') ? 'beta' : 'anual',
        duracion_dias: code.startsWith('BETA') ? 180 : 365
      });
    });
    
    return { codes: fallbackCodes, details: fallbackDetails };
  }
}

/**
 * Validar un código de licencia
 * Verifica formato y si está en la lista de códigos válidos
 */
export async function validarCodigoLicencia(codigo: string): Promise<{
  valido: boolean;
  detalles?: any;
  mensaje?: string;
}> {
  // Formato esperado: saludvalpa-XXXXX-XXXXX-XXXXX o BETA-PRO-YYYY-XXXXX
  const regexValpa = /^saludvalpa-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  const regexBeta = /^BETA-PRO-\d{4}-[A-Z0-9]{5}$/;
  
  const codigoNormalizado = codigo.toUpperCase().trim();
  
  if (!regexValpa.test(codigoNormalizado) && !regexBeta.test(codigoNormalizado)) {
    return {
      valido: false,
      mensaje: 'Formato de código inválido. Use: saludvalpa-XXXXX-XXXXX-XXXXX o BETA-PRO-YYYY-XXXXX'
    };
  }
  
  // Cargar códigos válidos
  const { codes, details } = await cargarCodigosValidos();
  
  if (!codes.has(codigoNormalizado)) {
    return {
      valido: false,
      mensaje: 'Código no registrado o ya utilizado. Verifica o contacta soporte.'
    };
  }
  
  return {
    valido: true,
    detalles: details.get(codigoNormalizado)
  };
}

/**
 * Activar una licencia con código
 */
export async function activarLicencia(codigo: string): Promise<{
  success: boolean;
  message: string;
  detalles?: any;
}> {
  try {
    // Validar código usando el nuevo sistema
    const validacion = await validarCodigoLicencia(codigo);
    
    if (!validacion.valido) {
      return {
        success: false,
        message: validacion.mensaje || 'Código de licencia inválido o no registrado.',
      };
    }

    // Obtener configuración actual
    const config = await db.configuracion.get('1');
    if (!config) {
      return {
        success: false,
        message: 'Error: Configuración no encontrada',
      };
    }

    // Verificar si ya tiene una licencia activa
    if (config.licencia.tipo === TipoLicencia.PAGADA &&
        config.licencia.estado === EstadoLicencia.ACTIVA) {
      return {
        success: false,
        message: 'Ya tienes una licencia activa. Solo puedes tener una licencia activa a la vez.',
      };
    }

    // Determinar duración según tipo de código
    const ahora = new Date();
    const expiracion = new Date(ahora);
    const detalles = validacion.detalles;
    const esBeta = codigo.startsWith('BETA');
    const tipoLicencia = detalles?.tipo || (esBeta ? 'beta' : 'anual');
    
    // Calcular duración basada en el tipo
    if (detalles?.duracion_dias) {
      expiracion.setDate(expiracion.getDate() + detalles.duracion_dias);
    } else if (esBeta) {
      // Códigos beta: 6 meses gratis
      expiracion.setMonth(expiracion.getMonth() + 6);
    } else {
      // Códigos pagados: 1 año por defecto
      expiracion.setFullYear(expiracion.getFullYear() + 1);
    }

    const licenciaActivada: Licencia = {
      tipo: TipoLicencia.PAGADA,
      codigo: codigo,
      fechaActivacion: ahora,
      fechaExpiracion: expiracion,
      estado: EstadoLicencia.ACTIVA,
      limitePacientes: undefined, // Sin límite
      metadata: {
        tipo: tipoLicencia,
        duracionDias: detalles?.duracion_dias || (esBeta ? 180 : 365),
        precio: detalles?.precio || (esBeta ? 0 : 800)
      }
    };

    // Actualizar branding para marca blanca
    config.licencia = licenciaActivada;
    config.branding.piePagina = `${config.branding.nombreProfesional || 'Profesional'}`;
    config.fechaActualizacion = new Date();

    // Usar update con cambios específicos para evitar problemas de tipo
    await db.configuracion.update('1', {
      licencia: config.licencia,
      branding: config.branding,
      fechaActualizacion: config.fechaActualizacion
    });

    // Determinar mensaje según tipo
    let tipoMensaje = 'PRO';
    if (esBeta) tipoMensaje = 'Beta Tester';
    if (tipoLicencia === 'mensual') tipoMensaje = 'Mensual';
    if (tipoLicencia === 'trimestral') tipoMensaje = 'Trimestral';
    if (tipoLicencia === 'semestral') tipoMensaje = 'Semestral';
    
    const precio = detalles?.precio ? ` ($${detalles.precio} MXN)` : '';
    
    // Marcar el código como usado
    marcarCodigoComoUsado(codigo);
    
    // Invalidar cache para que se recarguen los códigos válidos
    cachedValidCodes = null;
    cachedCodeDetails = null;
    
    return {
      success: true,
      message: `¡Licencia ${tipoMensaje}${precio} activada exitosamente! Válida hasta ${expiracion.toLocaleDateString('es-ES')}`,
      detalles: {
        tipo: tipoLicencia,
        expiracion,
        duracionDias: detalles?.duracion_dias
      }
    };
  } catch (error) {
    console.error('Error al activar licencia:', error);
    return {
      success: false,
      message: 'Error al procesar la licencia. Intenta de nuevo o contacta soporte.',
    };
  }
}

/**
 * Obtener el estado actual de la licencia
 */
export async function obtenerEstadoLicencia(): Promise<Licencia> {
  const config = await db.configuracion.get('1');
  if (!config) {
    throw new Error('Configuración no encontrada');
  }

  const licencia = config.licencia;
  const ahora = new Date();

  // Calcular días restantes
  if (licencia.fechaExpiracion) {
    const diffTime = licencia.fechaExpiracion.getTime() - ahora.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    licencia.diasRestantes = diffDays > 0 ? diffDays : 0;

    // Actualizar estado si expiró
    if (diffDays <= 0 && licencia.estado === EstadoLicencia.ACTIVA) {
      licencia.estado = EstadoLicencia.EXPIRADA;
      config.licencia = licencia;
      await db.configuracion.update('1', {
        licencia: config.licencia
      });
    }
  }

  return licencia;
}

/**
 * Verificar si se puede agregar un nuevo paciente (respetando límites)
 */
export async function puedeAgregarPaciente(): Promise<{
  puede: boolean;
  razon?: string;
}> {
  const licencia = await obtenerEstadoLicencia();
  
  // Si la licencia expiró
  if (licencia.estado === EstadoLicencia.EXPIRADA) {
    return {
      puede: false,
      razon: 'Tu licencia ha expirado. Activa una licencia para continuar.',
    };
  }

  // Si es versión gratuita, verificar límite
  if (licencia.tipo === TipoLicencia.GRATUITA && licencia.limitePacientes) {
    const cantidadPacientes = await db.pacientes.count();
    
    if (cantidadPacientes >= licencia.limitePacientes) {
      return {
        puede: false,
        razon: `Límite de ${licencia.limitePacientes} pacientes alcanzado en versión gratuita. Activa una licencia para agregar más.`,
      };
    }
  }

  return { puede: true };
}

/**
 * Verificar si puede personalizar branding (solo con licencia pagada)
 */
export async function puedePersonalizarBranding(): Promise<boolean> {
  const licencia = await obtenerEstadoLicencia();
  return licencia.tipo === TipoLicencia.PAGADA && licencia.estado === EstadoLicencia.ACTIVA;
}

/**
 * Generar un código de licencia (para uso administrativo)
 */
export function generarCodigoLicencia(): string {
  const generarSegmento = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 4; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
  };

  return `saludvalpa-${generarSegmento()}-${generarSegmento()}-${generarSegmento()}`;
}
