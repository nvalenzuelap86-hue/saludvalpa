// ============================================================================
// saludvalpa 3.0 - BACKUP SERVICE
// Sistema de respaldo y restauración de datos
// ============================================================================

import { db } from '../db/database';
import type { RespaldoCompleto } from '../types';

const VERSION_RESPALDO = '1.0.0';

/**
 * Exportar todos los datos a un objeto JSON
 */
export async function exportarDatos(): Promise<RespaldoCompleto> {
  try {
    const [
      configuracion,
      pacientes,
      sesiones,
      citas,
      documentos,
      servicios,
      cotizaciones,
      recibos,
      biblioteca,
      usuarios,
    ] = await Promise.all([
      db.configuracion.get('1'),
      db.pacientes.toArray(),
      db.sesiones.toArray(),
      db.citas.toArray(),
      db.documentos.toArray(),
      db.servicios.toArray(),
      db.cotizaciones.toArray(),
      db.recibos.toArray(),
      db.biblioteca.toArray(),
      db.usuarios.toArray(),
    ]);

    if (!configuracion) {
      throw new Error('Configuración no encontrada');
    }

    // Los documentos ya están en base64, listos para respaldar
    const documentosSinBlobs = documentos;

    const respaldo: RespaldoCompleto = {
      version: VERSION_RESPALDO,
      fechaRespaldo: new Date(),
      configuracion,
      pacientes,
      sesiones,
      citas,
      documentos: documentosSinBlobs,
      servicios,
      cotizaciones,
      recibos,
      biblioteca,
      usuarios,
    };

    return respaldo;
  } catch (error) {
    console.error('Error al exportar datos:', error);
    throw error;
  }
}

/**
 * Descargar respaldo como archivo JSON
 */
export async function descargarRespaldo(): Promise<void> {
  try {
    const datos = await exportarDatos();
    const json = JSON.stringify(datos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `saludvalpa-respaldo-${fecha}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Respaldo descargado:', nombreArchivo);
  } catch (error) {
    console.error('Error al descargar respaldo:', error);
    throw error;
  }
}

/**
 * Validar un archivo de respaldo
 */
export function validarRespaldo(data: any): {
  valido: boolean;
  errores: string[];
} {
  const errores: string[] = [];

  if (!data.version) {
    errores.push('Falta versión del respaldo');
  }

  if (!data.fechaRespaldo) {
    errores.push('Falta fecha del respaldo');
  }

  if (!data.configuracion) {
    errores.push('Falta configuración');
  }

  if (!Array.isArray(data.pacientes)) {
    errores.push('Datos de pacientes inválidos');
  }

  if (!Array.isArray(data.sesiones)) {
    errores.push('Datos de sesiones inválidos');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}

/**
 * Importar datos desde un respaldo
 * ADVERTENCIA: Esto sobreescribirá todos los datos actuales
 */
export async function importarRespaldo(data: RespaldoCompleto): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Validar el respaldo
    const validacion = validarRespaldo(data);
    if (!validacion.valido) {
      return {
        success: false,
        message: `Respaldo inválido: ${validacion.errores.join(', ')}`,
      };
    }

    // Convertir fechas de string a Date si es necesario
    const procesarFechas = (obj: any): any => {
      if (obj instanceof Date) return obj;
      if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
        return new Date(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(procesarFechas);
      }
      if (typeof obj === 'object' && obj !== null) {
        const resultado: any = {};
        for (const key in obj) {
          resultado[key] = procesarFechas(obj[key]);
        }
        return resultado;
      }
      return obj;
    };

    const datosConFechas = procesarFechas(data);

    // Limpiar base de datos actual
    await db.transaction('rw', [
      db.configuracion,
      db.pacientes,
      db.sesiones,
      db.citas,
      db.documentos,
      db.servicios,
      db.cotizaciones,
      db.recibos,
      db.biblioteca,
      db.usuarios,
    ], async () => {
      await db.configuracion.clear();
      await db.pacientes.clear();
      await db.sesiones.clear();
      await db.citas.clear();
      await db.documentos.clear();
      await db.servicios.clear();
      await db.cotizaciones.clear();
      await db.recibos.clear();
      await db.biblioteca.clear();
      await db.usuarios.clear();

      // Importar nuevos datos
      await db.configuracion.add(datosConFechas.configuracion);
      
      if (datosConFechas.pacientes.length > 0) {
        await db.pacientes.bulkAdd(datosConFechas.pacientes);
      }
      
      if (datosConFechas.sesiones.length > 0) {
        await db.sesiones.bulkAdd(datosConFechas.sesiones);
      }
      
      if (datosConFechas.citas.length > 0) {
        await db.citas.bulkAdd(datosConFechas.citas);
      }
      
      if (datosConFechas.documentos.length > 0) {
        await db.documentos.bulkAdd(datosConFechas.documentos);
      }
      
      if (datosConFechas.servicios?.length > 0) {
        await db.servicios.bulkAdd(datosConFechas.servicios);
      }
      
      if (datosConFechas.cotizaciones?.length > 0) {
        await db.cotizaciones.bulkAdd(datosConFechas.cotizaciones);
      }
      
      if (datosConFechas.recibos?.length > 0) {
        await db.recibos.bulkAdd(datosConFechas.recibos);
      }
      
      if (datosConFechas.biblioteca?.length > 0) {
        await db.biblioteca.bulkAdd(datosConFechas.biblioteca);
      }
      
      if (datosConFechas.usuarios?.length > 0) {
        await db.usuarios.bulkAdd(datosConFechas.usuarios);
      }
    });

    return {
      success: true,
      message: `Respaldo importado exitosamente. ${datosConFechas.pacientes.length} pacientes restaurados.`,
    };
  } catch (error) {
    console.error('Error al importar respaldo:', error);
    return {
      success: false,
      message: 'Error al importar respaldo. Verifica que el archivo sea válido.',
    };
  }
}

/**
 * Importar respaldo desde archivo
 */
export async function importarRespaldoDesdeArchivo(file: File): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const texto = await file.text();
    const datos = JSON.parse(texto);
    return await importarRespaldo(datos);
  } catch (error) {
    return {
      success: false,
      message: 'Error al leer el archivo. Asegúrate de que sea un archivo JSON válido de SaludValpa.',
    };
  }
}

/**
 * Obtener estadísticas del respaldo (sin cargarlo completo)
 */
export async function obtenerEstadisticasRespaldo(): Promise<{
  pacientes: number;
  sesiones: number;
  citas: number;
  documentos: number;
  fechaUltimoRespaldo?: Date;
}> {
  const [
    cantidadPacientes,
    cantidadSesiones,
    cantidadCitas,
    cantidadDocumentos,
  ] = await Promise.all([
    db.pacientes.count(),
    db.sesiones.count(),
    db.citas.count(),
    db.documentos.count(),
  ]);

  return {
    pacientes: cantidadPacientes,
    sesiones: cantidadSesiones,
    citas: cantidadCitas,
    documentos: cantidadDocumentos,
  };
}

// ============================================================================
// SISTEMA DE BACKUP AUTOMÁTICO PARA MIGRACIONES (Fase 4)
// ============================================================================

/**
 * Crear backup automático antes de migración
 * Guarda el backup en localStorage con timestamp
 */
export async function crearBackupAutomaticoMigracion(): Promise<{
  success: boolean;
  backupId: string;
  timestamp: Date;
  size: number;
  error?: string;
}> {
  try {
    const timestamp = new Date();
    const backupId = `migration-backup-${timestamp.getTime()}`;
    
    // Exportar todos los datos
    const datos = await exportarDatos();
    
    // Convertir a JSON
    const jsonData = JSON.stringify(datos);
    const size = new Blob([jsonData]).size;
    
    // Guardar en localStorage (temporal para migración)
    localStorage.setItem(backupId, jsonData);
    
    // También guardar metadata del backup
    const metadata = {
      backupId,
      timestamp: timestamp.toISOString(),
      size,
      type: 'migration',
      version: VERSION_RESPALDO
    };
    
    localStorage.setItem(`${backupId}-metadata`, JSON.stringify(metadata));
    
    // Limpiar backups antiguos (mantener solo los últimos 3)
    limpiarBackupsAntiguos();
    
    return {
      success: true,
      backupId,
      timestamp,
      size
    };
    
  } catch (error) {
    console.error('Error creando backup automático:', error);
    return {
      success: false,
      backupId: '',
      timestamp: new Date(),
      size: 0,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Restaurar desde backup automático de migración
 */
export async function restaurarDesdeBackupMigracion(backupId: string): Promise<{
  success: boolean;
  message: string;
  restoredItems?: number;
}> {
  try {
    // Obtener datos del backup
    const jsonData = localStorage.getItem(backupId);
    
    if (!jsonData) {
      return {
        success: false,
        message: `Backup ${backupId} no encontrado`
      };
    }
    
    const datos = JSON.parse(jsonData);
    
    // Importar datos
    const resultado = await importarRespaldo(datos);
    
    if (resultado.success) {
      return {
        success: true,
        message: `Backup restaurado exitosamente: ${backupId}`,
        restoredItems: calcularItemsRestaurados(datos)
      };
    } else {
      return resultado;
    }
    
  } catch (error) {
    console.error('Error restaurando backup:', error);
    return {
      success: false,
      message: `Error restaurando backup: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}

/**
 * Listar backups automáticos disponibles
 */
export function listarBackupsAutomaticos(): Array<{
  backupId: string;
  timestamp: string;
  size: number;
  type: string;
  version: string;
}> {
  const backups = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('migration-backup-') && key.includes('-metadata')) {
      try {
        const metadata = JSON.parse(localStorage.getItem(key) || '{}');
        backups.push(metadata);
      } catch (error) {
        console.warn(`Error parseando metadata de backup ${key}:`, error);
      }
    }
  }
  
  // Ordenar por timestamp (más reciente primero)
  return backups.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Eliminar backup automático específico
 */
export function eliminarBackupAutomatico(backupId: string): boolean {
  try {
    localStorage.removeItem(backupId);
    localStorage.removeItem(`${backupId}-metadata`);
    return true;
  } catch (error) {
    console.error(`Error eliminando backup ${backupId}:`, error);
    return false;
  }
}

/**
 * Limpiar backups antiguos (mantiene solo los últimos 3)
 */
function limpiarBackupsAntiguos(): void {
  const backups = listarBackupsAutomaticos();
  
  if (backups.length > 3) {
    const backupsAEliminar = backups.slice(3);
    
    backupsAEliminar.forEach(backup => {
      eliminarBackupAutomatico(backup.backupId);
    });
    
    console.log(`Eliminados ${backupsAEliminar.length} backups antiguos`);
  }
}

/**
 * Calcular número de items restaurados
 */
function calcularItemsRestaurados(datos: any): number {
  let total = 0;
  
  if (datos.pacientes) total += datos.pacientes.length;
  if (datos.sesiones) total += datos.sesiones.length;
  if (datos.citas) total += datos.citas.length;
  if (datos.documentos) total += datos.documentos.length;
  if (datos.servicios) total += datos.servicios.length;
  if (datos.cotizaciones) total += datos.cotizaciones.length;
  if (datos.recibos) total += datos.recibos.length;
  if (datos.biblioteca) total += datos.biblioteca.length;
  if (datos.usuarios) total += datos.usuarios.length;
  
  return total;
}

/**
 * Verificar integridad de backup automático
 */
export async function verificarIntegridadBackup(backupId: string): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: any;
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Obtener metadata
    const metadataJson = localStorage.getItem(`${backupId}-metadata`);
    if (!metadataJson) {
      errors.push(`Metadata no encontrada para backup ${backupId}`);
      return { valid: false, errors, warnings, metadata: null };
    }
    
    const metadata = JSON.parse(metadataJson);
    
    // Obtener datos
    const datosJson = localStorage.getItem(backupId);
    if (!datosJson) {
      errors.push(`Datos no encontrados para backup ${backupId}`);
      return { valid: false, errors, warnings, metadata };
    }
    
    const datos = JSON.parse(datosJson);
    
    // Verificar estructura básica
    if (!datos.version) {
      errors.push('Backup no tiene versión');
    }
    
    if (!datos.configuracion) {
      errors.push('Backup no tiene configuración');
    }
    
    if (!datos.fechaRespaldo) {
      warnings.push('Backup no tiene fecha de respaldo');
    }
    
    // Verificar que los datos sean parseables
    try {
      JSON.stringify(datos);
    } catch (error) {
      errors.push(`Error serializando datos: ${error}`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metadata
    };
    
  } catch (error) {
    errors.push(`Error verificando backup: ${error}`);
    return { valid: false, errors, warnings, metadata: null };
  }
}
