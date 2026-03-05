// ============================================================================
// saludvalpa 3.0 - SERVICIO DE MIGRACIÓN
// Migración de datos de ConfiguracionAvanzada.tsx al sistema unificado (Fase 2)
// ============================================================================

import { db } from '../db/database';
import type { Configuracion, Preferencias, Branding } from '../types';

/**
 * Interfaz para datos de configuración antigua (ConfiguracionAvanzada.tsx)
 * Estos son campos que podrían existir en versiones anteriores
 */
interface LegacyConfigData {
  // Campos de preferencias avanzadas
  formatoDocumentos?: 'formal' | 'informal' | 'moderno';
  mostrarMarcaDeAgua?: boolean;
  piePagina?: string;
  
  // Campos de recordatorios avanzados
  recordatoriosAvanzados?: {
    plantillaSMS?: string;
    plantillaEmail?: string;
    horaRecordatorioDiario?: string;
  };
  
  // Campos de sincronización
  sincronizacionGoogleDrive?: {
    habilitado?: boolean;
    carpetaId?: string;
    ultimaSincronizacion?: Date;
  };
  
  // Campos de personalización avanzada
  temasPersonalizados?: Array<{
    nombre: string;
    colores: {
      primario: string;
      secundario: string;
      acento: string;
    };
  }>;
  
  // Otros campos legacy
  configuracionAvanzada?: any;
}

/**
 * Detectar si hay datos legacy que necesitan migración
 */
export const detectarNecesidadMigracion = async (): Promise<{
  necesitaMigracion: boolean;
  tipoMigracion: 'configuracion_avanzada' | 'preferencias' | 'ninguna';
  detalles: string;
}> => {
  try {
    // Obtener configuración actual
    const configuracion = await db.configuracion.get('1');
    
    if (!configuracion) {
      return {
        necesitaMigracion: false,
        tipoMigracion: 'ninguna',
        detalles: 'No hay configuración existente'
      };
    }
    
    // Verificar si hay datos legacy en metadata
    const tieneLegacy =
      (configuracion as any).configuracionAvanzada ||
      (configuracion as any).recordatoriosAvanzados ||
      (configuracion as any).sincronizacionGoogleDrive ||
      (configuracion as any).temasPersonalizados;
    
    // Verificar si faltan campos que deberían estar en el nuevo sistema
    const configAny = configuracion as any;
    const faltaBrandingCompleto =
      !configuracion.branding.formatoDocumentos ||
      typeof configuracion.branding.mostrarMarcaDeAgua === 'undefined';
    
    if (tieneLegacy || faltaBrandingCompleto) {
      return {
        necesitaMigracion: true,
        tipoMigracion: 'configuracion_avanzada',
        detalles: 'Configuración avanzada detectada, necesita migración al sistema unificado'
      };
    }
    
    return {
      necesitaMigracion: false,
      tipoMigracion: 'ninguna',
      detalles: 'Configuración ya está en formato unificado'
    };
  } catch (error) {
    console.error('Error detectando migración:', error);
    return {
      necesitaMigracion: false,
      tipoMigracion: 'ninguna',
      detalles: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`
    };
  }
};

/**
 * Migrar datos de configuración avanzada al sistema unificado
 */
export const migrarConfiguracionAvanzada = async (): Promise<{
  success: boolean;
  message: string;
  cambiosRealizados: string[];
}> => {
  const cambios: string[] = [];
  
  try {
    // Obtener configuración actual
    const configuracion = await db.configuracion.get('1');
    
    if (!configuracion) {
      return {
        success: false,
        message: 'No hay configuración para migrar',
        cambiosRealizados: []
      };
    }
    
    // Clonar configuración para modificaciones
    const configActualizada = { ...configuracion };
    
    // 1. Migrar campos de branding/documentos (si existen en datos legacy)
    const legacyData = configuracion as any;
    
    // Migrar formatoDocumentos si existe en nivel superior
    if (legacyData.formatoDocumentos && !configActualizada.branding.formatoDocumentos) {
      configActualizada.branding.formatoDocumentos = legacyData.formatoDocumentos;
      cambios.push('Formato de documentos migrado a branding');
    }
    
    // Migrar mostrarMarcaDeAgua si existe en nivel superior
    if (typeof legacyData.mostrarMarcaDeAgua === 'boolean' && 
        typeof configActualizada.branding.mostrarMarcaDeAgua === 'undefined') {
      configActualizada.branding.mostrarMarcaDeAgua = legacyData.mostrarMarcaDeAgua;
      cambios.push('Marca de agua migrada a branding');
    }
    
    // Migrar piePagina si existe en nivel superior
    if (legacyData.piePagina && !configActualizada.branding.piePagina) {
      configActualizada.branding.piePagina = legacyData.piePagina;
      cambios.push('Pie de página migrado a branding');
    }
    
    // 2. Migrar recordatorios avanzados
    if (legacyData.recordatoriosAvanzados) {
      // Inicializar plantillas si no existen
      if (!configActualizada.preferencias.recordatorios) {
        configActualizada.preferencias.recordatorios = {
          habilitados: true,
          anticipacionCitas: 30,
          anticipacionDia: 24,
          sonido: true
        };
      }
      
      // Agregar plantillas como campos adicionales (no en el tipo principal)
      // Estos se almacenarán como metadata adicional
      const recordatoriosConExtras = configActualizada.preferencias.recordatorios as any;
      recordatoriosConExtras.plantillaSMS =
        legacyData.recordatoriosAvanzados.plantillaSMS ||
        'Recordatorio: Tienes una cita mañana a las {{hora}} con {{profesional}}.';
      
      recordatoriosConExtras.plantillaEmail =
        legacyData.recordatoriosAvanzados.plantillaEmail ||
        'Estimado paciente, le recordamos su cita programada para mañana.';
      
      cambios.push('Plantillas de recordatorios migradas');
    }
    
    // 3. Migrar sincronización Google Drive
    if (legacyData.sincronizacionGoogleDrive) {
      // Agregar campo de sincronización a preferencias
      (configActualizada.preferencias as any).sincronizacion = {
        googleDrive: {
          habilitado: legacyData.sincronizacionGoogleDrive.habilitado || false,
          carpetaId: legacyData.sincronizacionGoogleDrive.carpetaId || '',
          ultimaSincronizacion: legacyData.sincronizacionGoogleDrive.ultimaSincronizacion || new Date()
        }
      };
      cambios.push('Configuración de Google Drive migrada');
    }
    
    // 4. Migrar temas personalizados
    if (legacyData.temasPersonalizados && Array.isArray(legacyData.temasPersonalizados)) {
      (configActualizada.branding as any).temasPersonalizados = legacyData.temasPersonalizados;
      cambios.push('Temas personalizados migrados');
    }
    
    // 5. Eliminar campos legacy
    delete (configActualizada as any).configuracionAvanzada;
    delete (configActualizada as any).formatoDocumentos;
    delete (configActualizada as any).mostrarMarcaDeAgua;
    delete (configActualizada as any).piePagina;
    delete (configActualizada as any).recordatoriosAvanzados;
    delete (configActualizada as any).sincronizacionGoogleDrive;
    delete (configActualizada as any).temasPersonalizados;
    
    cambios.push('Campos legacy eliminados');
    
    // Actualizar fecha de modificación
    configActualizada.fechaActualizacion = new Date();
    
    // Guardar configuración migrada
    await db.configuracion.put(configActualizada);
    
    return {
      success: true,
      message: `Migración completada exitosamente (${cambios.length} cambios)`,
      cambiosRealizados: cambios
    };
    
  } catch (error) {
    console.error('Error en migración:', error);
    return {
      success: false,
      message: `Error en migración: ${error instanceof Error ? error.message : 'Desconocido'}`,
      cambiosRealizados: cambios
    };
  }
};

/**
 * Crear datos por defecto para el sistema unificado
 */
export const crearDatosPorDefectoUnificados = (): Partial<Configuracion> => {
  const datosPorDefecto: Partial<Configuracion> = {
    preferencias: {
      formatoFecha: 'DD/MM/YYYY',
      zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
      idioma: 'es',
      notificaciones: true,
      recordatorios: {
        habilitados: true,
        anticipacionCitas: 30, // 30 minutos antes
        anticipacionDia: 24, // 24 horas antes
        sonido: true
      },
      agenda: {
        vistaInicial: 'semana',
        horaInicio: '08:00',
        horaFin: '20:00',
        duracionCitaDefault: 60
      },
      economia: {
        moneda: 'MXN',
        mostrarImpuestos: true,
        iva: 16
      }
    }
  };

  // Agregar campos de branding que pueden faltar en el tipo
  const brandingConExtras = {
    formatoDocumentos: 'formal' as const,
    mostrarMarcaDeAgua: true,
    piePagina: 'SaludValpa - Sistema de gestión para profesionales de la salud'
  };

  // Usar type assertion para incluir los campos adicionales
  (datosPorDefecto as any).branding = brandingConExtras;

  return datosPorDefecto;
};

/**
 * Verificar integridad de la configuración unificada
 */
export const verificarIntegridadConfiguracion = async (): Promise<{
  valida: boolean;
  problemas: string[];
  recomendaciones: string[];
}> => {
  const problemas: string[] = [];
  const recomendaciones: string[] = [];
  
  try {
    const configuracion = await db.configuracion.get('1');
    
    if (!configuracion) {
      problemas.push('No existe configuración en la base de datos');
      return {
        valida: false,
        problemas,
        recomendaciones: ['Ejecutar migración para crear configuración por defecto']
      };
    }
    
    // Verificar campos requeridos del nuevo sistema unificado
    const configAny = configuracion as any;
    
    // Verificar campos de branding que deberían existir
    if (!configAny.branding?.formatoDocumentos) {
      problemas.push('Falta formato de documentos en branding');
      recomendaciones.push('Ejecutar migración para agregar formato por defecto');
    }
    
    if (typeof configAny.branding?.mostrarMarcaDeAgua === 'undefined') {
      problemas.push('Falta configuración de marca de agua en branding');
      recomendaciones.push('Ejecutar migración para agregar configuración por defecto');
    }
    
    // Verificar si hay campos legacy
    const legacyFields = ['configuracionAvanzada', 'recordatoriosAvanzados', 'sincronizacionGoogleDrive'];
    const tieneLegacy = legacyFields.some(field => configAny[field]);
    
    if (tieneLegacy) {
      problemas.push('Se detectaron campos legacy en la configuración');
      recomendaciones.push('Ejecutar migración para limpiar campos legacy');
    }
    
    return {
      valida: problemas.length === 0,
      problemas,
      recomendaciones
    };
    
  } catch (error) {
    console.error('Error verificando integridad:', error);
    return {
      valida: false,
      problemas: [`Error: ${error instanceof Error ? error.message : 'Desconocido'}`],
      recomendaciones: ['Revisar conexión con la base de datos']
    };
  }
};

/**
 * Componente de migración automática (para usar en app initialization)
 */
export const ejecutarMigracionAutomaticaSiEsNecesaria = async (): Promise<{
  migracionEjecutada: boolean;
  resultado?: any;
}> => {
  try {
    const deteccion = await detectarNecesidadMigracion();
    
    if (deteccion.necesitaMigracion) {
      console.log('Migración automática detectada:', deteccion.detalles);
      const resultado = await migrarConfiguracionAvanzada();
      
      return {
        migracionEjecutada: true,
        resultado
      };
    }
    
    return {
      migracionEjecutada: false
    };
    
  } catch (error) {
    console.error('Error en migración automática:', error);
    return {
      migracionEjecutada: false
    };
  }
};