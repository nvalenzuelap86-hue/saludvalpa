// ============================================================================
// saludvalpa 3.0 - LICENSE SERVICE
// Sistema de gestión y validación de licencias - Versión 2.0
// ============================================================================

import { db } from '../db/database';
import { TipoLicencia, EstadoLicencia, type Licencia } from '../types';

// URL del archivo JSON de códigos (en public/)
// Usar URL absoluta en producción para evitar problemas de ruta
// Agregar parámetro de cache-busting para evitar caché obsoleto
const getLicenseCodesUrl = () => {
  const baseUrl = import.meta.env.PROD
    ? `${window.location.origin}/license-codes.json`
    : '/license-codes.json';
  
  // Agregar timestamp para bustear caché (cambia cada 5 minutos)
  const cacheBuster = Math.floor(Date.now() / (5 * 60 * 1000)); // Cambia cada 5 minutos
  return `${baseUrl}?v=${cacheBuster}`;
};

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
    console.log(`📦 Usando cache de códigos (${cachedValidCodes.size} códigos válidos)`);
    return { codes: cachedValidCodes, details: cachedCodeDetails };
  }
  
  const licenseUrl = getLicenseCodesUrl();
  
  try {
    console.log(`🌐 Intentando cargar códigos desde: ${licenseUrl}`);
    const response = await fetch(licenseUrl);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    
    // Validar estructura del JSON
    if (!data.codigos || !Array.isArray(data.codigos)) {
      throw new Error('Estructura de JSON inválida: falta propiedad "codigos" o no es un array');
    }
    
    // Crear sets y maps para búsqueda rápida
    const codes = new Set<string>();
    const details = new Map<string, any>();
    
    // Obtener códigos ya usados
    const usedCodes = obtenerCodigosUsados();
    
    let disponiblesCount = 0;
    let usadosExcluidosCount = 0;
    
    data.codigos.forEach((codigoInfo: any) => {
      // Solo incluir códigos que estén disponibles Y no hayan sido usados
      if (codigoInfo.estado === 'disponible') {
        if (!usedCodes.has(codigoInfo.codigo)) {
          codes.add(codigoInfo.codigo);
          details.set(codigoInfo.codigo, codigoInfo);
          disponiblesCount++;
        } else {
          usadosExcluidosCount++;
        }
      }
    });
    
    // Actualizar cache
    cachedValidCodes = codes;
    cachedCodeDetails = details;
    lastFetchTime = now;
    
    console.log(`✅ Cargados ${codes.size} códigos válidos desde ${licenseUrl}`);
    console.log(`   - Total en archivo: ${data.codigos.length}`);
    console.log(`   - Disponibles (estado="disponible"): ${disponiblesCount + usadosExcluidosCount}`);
    console.log(`   - Excluidos (ya usados): ${usadosExcluidosCount}`);
    console.log(`   - Códigos usados en localStorage: ${usedCodes.size}`);
    
    return { codes, details };
  } catch (error) {
    console.error('❌ Error al cargar códigos de licencia:', error);
    console.error(`   URL intentada: ${licenseUrl}`);
    console.error(`   Entorno: ${import.meta.env.PROD ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
    console.error(`   Window location: ${window.location.origin}`);
    console.error(`   Import meta env: ${JSON.stringify(import.meta.env)}`);
    
    // Fallback a códigos hardcodeados si falla la carga
    const fallbackCodes = new Set([
      'saludvalpa-X9K2M-7P4QW-3T8ZN',
      'saludvalpa-B5H3R-9V6YL-2F4GJ',
      'saludvalpa-C8N1K-4M7PX-6D9WT'
    ]);
    
    const fallbackDetails = new Map();
    fallbackCodes.forEach(code => {
      fallbackDetails.set(code, {
        tipo: 'anual',
        duracion_dias: 365,
        es_fallback: true
      });
    });
    
    console.warn(`⚠️ Usando códigos de fallback (${fallbackCodes.size} códigos)`);
    
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
  console.log(`🔍 Validando código: "${codigo}"`);
  
  // Formato esperado:
  // 1. saludvalpa-XXXXX-XXXXX-XXXXX (segmentos alfanuméricos de longitud variable)
  // 2. BETA-PRO-YYYY-XXXXX (códigos legacy)
  // Usamos flag 'i' para case-insensitive porque normalizamos a mayúsculas después
  // Los códigos de prueba tienen patrones como: SALUDVALPA-TEST1-00001-00001 (5,5,5)
  // y SALUDVALPA-TEST10-00010-00010 (6,5,5)
  const regexValpa = /^(saludvalpa-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}|BETA-PRO-[A-Z0-9]{4,6}-[A-Z0-9]{4,6})$/i;
  
  const codigoNormalizado = codigo.toUpperCase().trim();
  console.log(`   Normalizado: "${codigoNormalizado}"`);
  
  if (!regexValpa.test(codigo)) {
    console.log(`❌ Falló validación de formato: "${codigo}" no coincide con regex`);
    return {
      valido: false,
      mensaje: 'Formato de código inválido. Use: saludvalpa-XXXXX-XXXXX-XXXXX o BETA-PRO-YYYY-XXXXX'
    };
  }
  
  console.log(`✅ Formato válido`);
  
  // Cargar códigos válidos
  const { codes, details } = await cargarCodigosValidos();
  
  console.log(`   Total códigos válidos cargados: ${codes.size}`);
  
  if (!codes.has(codigoNormalizado)) {
    console.log(`❌ Código no encontrado en códigos válidos: "${codigoNormalizado}"`);
    
    // Proporcionar más información de diagnóstico
    const usedCodes = obtenerCodigosUsados();
    if (usedCodes.has(codigoNormalizado)) {
      console.log(`   ⚠️ Código marcado como usado en localStorage`);
      return {
        valido: false,
        mensaje: 'Este código ya ha sido utilizado. Cada código solo puede usarse una vez.'
      };
    } else {
      console.log(`   ℹ️ Código no encontrado en la lista de códigos disponibles`);
      return {
        valido: false,
        mensaje: 'Código no registrado o no disponible. Verifica el código o contacta soporte.'
      };
    }
  }
  
  console.log(`✅ Código válido encontrado`);
  
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
    const tipoLicencia = detalles?.tipo || 'anual';
    
    // Calcular duración basada en el tipo
    if (detalles?.duracion_dias) {
      expiracion.setDate(expiracion.getDate() + detalles.duracion_dias);
    } else {
      // Licencias anuales: 1 año
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
        duracionDias: detalles?.duracion_dias || 365,
        precio: detalles?.precio || 800
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
    // Solo licencias anuales disponibles
    
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
