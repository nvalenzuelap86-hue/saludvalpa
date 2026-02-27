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
