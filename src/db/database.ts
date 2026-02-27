// ============================================================================
// SALUDVALPA - DATABASE
// Sistema de almacenamiento local con IndexedDB usando Dexie.js
// ============================================================================

import Dexie from 'dexie';
import type { Table } from 'dexie';
import type {
  Paciente,
  Sesion,
  Cita,
  Documento,
  Configuracion,
  Usuario,
  Servicio,
  Cotizacion,
  Recibo,
  RecursoBiblioteca,
  Ejercicio,
  RutinaEjercicios,
  SeguimientoRutina,
} from '../types';

export class SaludValpaDatabase extends Dexie {
  // Tablas
  pacientes!: Table<Paciente, string>;
  sesiones!: Table<Sesion, string>;
  citas!: Table<Cita, string>;
  documentos!: Table<Documento, string>;
  configuracion!: Table<Configuracion, string>;
  usuarios!: Table<Usuario, string>;
  servicios!: Table<Servicio, string>;
  cotizaciones!: Table<Cotizacion, string>;
  recibos!: Table<Recibo, string>;
  biblioteca!: Table<RecursoBiblioteca, string>;
  // Nuevas tablas para biblioteca de ejercicios y rutinas
  ejercicios!: Table<Ejercicio, string>;
  rutinas!: Table<RutinaEjercicios, string>;
  seguimientoRutinas!: Table<SeguimientoRutina, string>;

  constructor() {
    super('SaludValpaDB');
    
    // Versión 1: Esquema original
    this.version(1).stores({
      pacientes: 'id, nombre, apellidos, fechaNacimiento, fechaCreacion, ultimaConsulta, activo',
      sesiones: 'id, pacienteId, profesionalId, fecha, fechaCreacion',
      citas: 'id, pacienteId, profesionalId, fechaHora, estado, fechaCreacion',
      documentos: 'id, tipo, pacienteId, profesionalId, fechaGeneracion',
      configuracion: 'id',
      usuarios: 'id, email, activo',
      servicios: 'id, nombre, profesion, activo',
      cotizaciones: 'id, pacienteId, fecha, estado',
      recibos: 'id, numero, pacienteId, fecha, estadoPago',
      biblioteca: 'id, profesion, categoria, titulo, favorito',
    });

    // Versión 2: Agregar tablas de ejercicios y rutinas
    this.version(2).stores({
      pacientes: 'id, nombre, apellidos, fechaNacimiento, fechaCreacion, ultimaConsulta, activo',
      sesiones: 'id, pacienteId, profesionalId, fecha, fechaCreacion',
      citas: 'id, pacienteId, profesionalId, fechaHora, estado, fechaCreacion',
      documentos: 'id, tipo, pacienteId, profesionalId, fechaGeneracion',
      configuracion: 'id',
      usuarios: 'id, email, activo',
      servicios: 'id, nombre, profesion, activo',
      cotizaciones: 'id, pacienteId, fecha, estado',
      recibos: 'id, numero, pacienteId, fecha, estadoPago',
      biblioteca: 'id, profesion, categoria, titulo, favorito',
      // Nuevas tablas
      ejercicios: 'id, nombre, categoria, precargado, favorito, usuarioCreadorId, fechaCreacion',
      rutinas: 'id, nombre, pacienteId, esPlantilla, activa, usuarioCreadorId, fechaCreacion, fechaActualizacion',
      seguimientoRutinas: 'id, rutinaId, pacienteId, fecha, fechaCreacion',
    });

    // Versión 3: Agregar campo 'profesion' a todas las tablas relevantes para soporte multi-profesión
    this.version(3).stores({
      pacientes: 'id, nombre, apellidos, fechaNacimiento, fechaCreacion, ultimaConsulta, activo, profesionPrincipal',
      sesiones: 'id, pacienteId, profesionalId, fecha, fechaCreacion, profesion',
      citas: 'id, pacienteId, profesionalId, fechaHora, estado, fechaCreacion, profesion',
      documentos: 'id, tipo, pacienteId, profesionalId, fechaGeneracion, profesion',
      configuracion: 'id',
      usuarios: 'id, email, activo, profesion',
      servicios: 'id, nombre, profesion, activo',
      cotizaciones: 'id, pacienteId, fecha, estado, profesion',
      recibos: 'id, numero, pacienteId, fecha, estadoPago, profesion',
      biblioteca: 'id, profesion, categoria, titulo, favorito',
      ejercicios: 'id, nombre, categoria, precargado, favorito, usuarioCreadorId, fechaCreacion, profesion',
      rutinas: 'id, nombre, pacienteId, esPlantilla, activa, usuarioCreadorId, fechaCreacion, fechaActualizacion, profesion',
      seguimientoRutinas: 'id, rutinaId, pacienteId, fecha, fechaCreacion, profesion',
    }).upgrade(async (tx) => {
      // Función de migración que se ejecuta automáticamente al actualizar de v2 a v3
      console.log('🔧 Ejecutando migración v2 → v3: agregando campo profesion a todas las tablas...');
      
      // Obtener la profesión actual de la configuración (si existe)
      const config = await tx.table('configuracion').get('1');
      const profesionActual = config?.profesion || 'fisioterapia';
      
      // Actualizar todas las tablas con la profesión actual
      await tx.table('pacientes').toCollection().modify((paciente: any) => {
        paciente.profesionPrincipal = profesionActual;
      });
      
      await tx.table('sesiones').toCollection().modify((sesion: any) => {
        sesion.profesion = profesionActual;
      });
      
      await tx.table('citas').toCollection().modify((cita: any) => {
        cita.profesion = profesionActual;
      });
      
      await tx.table('documentos').toCollection().modify((documento: any) => {
        documento.profesion = profesionActual;
      });
      
      await tx.table('usuarios').toCollection().modify((usuario: any) => {
        usuario.profesion = profesionActual;
      });
      
      await tx.table('cotizaciones').toCollection().modify((cotizacion: any) => {
        cotizacion.profesion = profesionActual;
      });
      
      await tx.table('recibos').toCollection().modify((recibo: any) => {
        recibo.profesion = profesionActual;
      });
      
      await tx.table('ejercicios').toCollection().modify((ejercicio: any) => {
        ejercicio.profesion = profesionActual;
      });
      
      await tx.table('rutinas').toCollection().modify((rutina: any) => {
        rutina.profesion = profesionActual;
      });
      
      await tx.table('seguimientoRutinas').toCollection().modify((seguimiento: any) => {
        seguimiento.profesion = profesionActual;
      });
      
      console.log('✅ Migración v2 → v3 completada');
    });
  }
}

// Instancia única de la base de datos
export const db = new SaludValpaDatabase();

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================================================

/**
 * Inicializar la configuración por defecto si no existe
 */
export async function inicializarConfiguracion(): Promise<void> {
  // FASE 0: Ya no creamos configuración automáticamente
  // La configuración se crea cuando el usuario completa el onboarding
  // Esta función solo verifica que exista, pero no crea una por defecto
  const existe = await db.configuracion.get('1');
  
  if (existe) {
    console.log('✅ Configuración encontrada');
  } else {
    console.log('ℹ️ Sin configuración - usuario debe completar onboarding');
  }
}

/**
 * Inicializar contenidos de biblioteca precargados
 */
export async function inicializarBiblioteca(): Promise<void> {
  try {
    const contenidosExistentes = await db.biblioteca.toArray();
    
    // Solo cargar si no hay contenidos precargados ya
    const yaHayPrecargados = contenidosExistentes.some(c => c.esContenidoPrecargado);
    
    if (!yaHayPrecargados) {
      const { obtenerTodosLosContenidos } = await import('../data/contenidosPrecargados');
      const contenidos = obtenerTodosLosContenidos();
      const ahora = new Date();
      
      const contenidosConFechas = contenidos.map(c => ({
        ...c,
        id: crypto.randomUUID(),
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      }));
      
      await db.biblioteca.bulkAdd(contenidosConFechas);
      console.log(`✅ ${contenidosConFechas.length} recursos precargados en biblioteca`);
    }
  } catch (error) {
    console.error('Error al inicializar biblioteca:', error);
  }
}

/**
 * Inicializar ejercicios precargados en la biblioteca de ejercicios
 */
export async function inicializarEjerciciosPrecargados(): Promise<void> {
  try {
    const ejerciciosExistentes = await db.ejercicios.toArray();
    
    // Solo cargar si no hay ejercicios precargados ya
    const yaHayPrecargados = ejerciciosExistentes.some(e => e.precargado);
    
    if (!yaHayPrecargados) {
      const { obtenerEjerciciosPrecargados } = await import('../data/ejerciciosPrecargados');
      const ejerciciosPrecargados = obtenerEjerciciosPrecargados();
      const ahora = new Date();
      
      const ejerciciosConMetadata = ejerciciosPrecargados.map(e => ({
        ...e,
        id: crypto.randomUUID(),
        precargado: true,
        favorito: false,
        fechaCreacion: ahora,
        videosUrls: e.imagenUrl ? [] : undefined,
      }));
      
      await db.ejercicios.bulkAdd(ejerciciosConMetadata);
      console.log(`✅ ${ejerciciosConMetadata.length} ejercicios precargados en biblioteca`);
    } else {
      console.log('ℹ️ Ejercicios precargados ya existen en la base de datos');
    }
  } catch (error) {
    console.error('Error al inicializar ejercicios precargados:', error);
  }
}

/**
 * Inicializar la base de datos completa
 */
export async function inicializarDB(): Promise<void> {
  try {
    await db.open();
    await inicializarConfiguracion();
    await inicializarBiblioteca();
    await inicializarEjerciciosPrecargados();
    console.log('✅ Base de datos SaludValpa inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}

// (Los enums ya no se usan aquí, se crean en onboarding)
