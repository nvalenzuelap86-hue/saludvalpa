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
  DiagnosticoEntry,
  SignosVitalesEntry,
  AntecedenteEntry,
} from '../types';
import type {
  PlanAlimentacion,
  ComidaEnPlanDB,
  SeguimientoNutricional,
} from '../types/nutricion';

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
  // Tablas para biblioteca de ejercicios y rutinas
  ejercicios!: Table<Ejercicio, string>;
  rutinas!: Table<RutinaEjercicios, string>;
  seguimientoRutinas!: Table<SeguimientoRutina, string>;
  // Tablas para historial clínico del paciente
  diagnosticos!: Table<DiagnosticoEntry, string>;
  signosVitales!: Table<SignosVitalesEntry, string>;
  antecedentes!: Table<AntecedenteEntry, string>;
  // Tablas para módulo de nutrición
  planesAlimentacion!: Table<PlanAlimentacion, string>;
  comidas!: Table<ComidaEnPlanDB, string>;
  seguimientoNutricional!: Table<SeguimientoNutricional, string>;

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

    // Versión 4: Agregar tablas para historial clínico del paciente
    this.version(4).stores({
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
      // Nuevas tablas para historial clínico
      diagnosticos: 'id, pacienteId, profesion, fecha, activo',
      signosVitales: 'id, pacienteId, profesion, fecha',
      antecedentes: 'id, pacienteId, tipo, activo',
    });

    // Versión 5: Agregar tablas para módulo de nutrición
    this.version(5).stores({
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
      diagnosticos: 'id, pacienteId, profesion, fecha, activo',
      signosVitales: 'id, pacienteId, profesion, fecha',
      antecedentes: 'id, pacienteId, tipo, activo',
      // Nuevas tablas para nutrición
      planesAlimentacion: 'id, nombre, objetivo, pacienteId, activo, esPlantilla, usuarioCreadorId, fechaCreacion, fechaActualizacion, profesion',
      comidas: 'id, planId, tipo, horario, orden, fechaCreacion',
      seguimientoNutricional: 'id, planId, pacienteId, fecha, cumplimiento, profesion, fechaCreacion',
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
 * Usa un flag en localStorage para garantizar que solo se ejecute UNA VEZ
 * y evita duplicados incluso si se llama múltiples veces.
 */
let inicializandoEjercicios = false;

export async function inicializarEjerciciosPrecargados(): Promise<void> {
  // Prevenir ejecución concurrente
  if (inicializandoEjercicios) {
    console.log('ℹ️ Ya se está inicializando ejercicios precargados, ignorando llamada concurrente');
    return;
  }

  // Verificar flag persistente en localStorage para evitar re-inserción
  const yaInicializado = localStorage.getItem('saludvalpa_ejercicios_inicializados');
  if (yaInicializado === 'true') {
    console.log('ℹ️ Ejercicios precargados ya fueron inicializados (localStorage flag)');
    return;
  }

  try {
    inicializandoEjercicios = true;
    
    const ejerciciosExistentes = await db.ejercicios.toArray();
    
    // Verificar si ya hay ejercicios precargados por el campo 'precargado'
    const yaHayPrecargados = ejerciciosExistentes.some(e => e.precargado === true);
    
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
      }));
      
      await db.ejercicios.bulkAdd(ejerciciosConMetadata);
      console.log(`✅ ${ejerciciosConMetadata.length} ejercicios precargados en biblioteca`);
    } else {
      console.log('ℹ️ Ejercicios precargados ya existen en la base de datos');
    }

    // Marcar como inicializado permanentemente
    localStorage.setItem('saludvalpa_ejercicios_inicializados', 'true');
  } catch (error) {
    console.error('Error al inicializar ejercicios precargados:', error);
  } finally {
    inicializandoEjercicios = false;
  }
}

/**
 * Limpiar ejercicios precargados duplicados existentes en la base de datos.
 * Esta función se ejecuta una sola vez para corregir el problema de duplicados
 * que ya estén almacenados. Identifica duplicados por nombre y conserva solo
 * la primera ocurrencia de cada ejercicio precargado.
 */
async function limpiarEjerciciosDuplicados(): Promise<void> {
  const yaLimpio = localStorage.getItem('saludvalpa_ejercicios_limpios');
  if (yaLimpio === 'true') return;

  try {
    const todos = await db.ejercicios.where('precargado').equals(1).toArray();
    
    if (todos.length === 0) return;

    // Agrupar por nombre para detectar duplicados
    const grupos = new Map<string, typeof todos>();
    for (const ej of todos) {
      const existentes = grupos.get(ej.nombre) || [];
      existentes.push(ej);
      grupos.set(ej.nombre, existentes);
    }

    const duplicados: string[] = [];
    for (const [, grupo] of grupos) {
      if (grupo.length > 1) {
        // Conservar el primero, eliminar los demás
        for (let i = 1; i < grupo.length; i++) {
          duplicados.push(grupo[i].id);
        }
      }
    }

    if (duplicados.length > 0) {
      await db.ejercicios.bulkDelete(duplicados);
      console.log(`🧹 Eliminados ${duplicados.length} ejercicios duplicados`);
    }

    localStorage.setItem('saludvalpa_ejercicios_limpios', 'true');
  } catch (error) {
    console.error('Error al limpiar ejercicios duplicados:', error);
  }
}

/**
 * Actualizar ejercicios precargados genéricos en la base de datos
 * con las versiones mejoradas del archivo fuente.
 * Detecta ejercicios que aún tienen instrucciones genéricas
 * ("Posición correcta", "Contraer músculos") y los reemplaza
 * con las versiones específicas del catálogo actualizado.
 */
async function actualizarEjerciciosGenericosEnDB(): Promise<void> {
  const yaActualizado = localStorage.getItem('saludvalpa_ejercicios_actualizados');
  if (yaActualizado === 'true') return;

  try {
    const ejerciciosEnDB = await db.ejercicios.where('precargado').equals(1).toArray();
    
    if (ejerciciosEnDB.length === 0) return;

    // Detectar ejercicios genéricos: los que tienen "Posición correcta" o "Contraer músculos"
    const esGenerico = (instrucciones: string[] | undefined): boolean => {
      if (!instrucciones || instrucciones.length === 0) return false;
      const texto = instrucciones.join(' ');
      return texto.includes('Posición correcta') || texto.includes('Contraer músculos');
    };

    const genericosEnDB = ejerciciosEnDB.filter(e => esGenerico(e.instrucciones));
    
    if (genericosEnDB.length === 0) {
      console.log('✅ No se encontraron ejercicios genéricos en la base de datos');
      localStorage.setItem('saludvalpa_ejercicios_actualizados', 'true');
      return;
    }

    console.log(`🔍 Encontrados ${genericosEnDB.length} ejercicios genéricos en DB, actualizando...`);

    // Obtener los ejercicios nuevos del archivo fuente
    const { obtenerEjerciciosPrecargados } = await import('../data/ejerciciosPrecargados');
    const ejerciciosNuevos = obtenerEjerciciosPrecargados();

    // Crear un mapa nombre -> ejercicio nuevo para búsqueda rápida
    const mapaNuevos = new Map(ejerciciosNuevos.map(e => [e.nombre, e]));

    let actualizados = 0;
    let noEncontrados = 0;

    for (const generico of genericosEnDB) {
      const nuevo = mapaNuevos.get(generico.nombre);
      
      if (nuevo) {
        // Reemplazar datos genéricos con los nuevos específicos,
        // pero preservar id, favorito, fechaCreacion, videosUrls
        await db.ejercicios.update(generico.id, {
          descripcion: nuevo.descripcion,
          instrucciones: nuevo.instrucciones,
          zonasCorporales: nuevo.zonasCorporales,
          repeticionesSugeridas: nuevo.repeticionesSugeridas,
          duracionSugerida: nuevo.duracionSugerida,
          intensidad: nuevo.intensidad,
          equipoNecesario: nuevo.equipoNecesario,
          contraindicaciones: nuevo.contraindicaciones,
        });
        actualizados++;
      } else {
        console.warn(`⚠️ No se encontró versión nueva para: "${generico.nombre}"`);
        noEncontrados++;
      }
    }

    console.log(`✅ Migración completada: ${actualizados} ejercicios actualizados, ${noEncontrados} no encontrados`);
    localStorage.setItem('saludvalpa_ejercicios_actualizados', 'true');
  } catch (error) {
    console.error('Error al actualizar ejercicios genéricos:', error);
  }
}

/**
 * Inicializar comidas precargadas en la base de datos
 */
export async function inicializarComidasPrecargadas(): Promise<void> {
  try {
    const count = await db.comidas.count();
    if (count > 0) {
      console.log(`ℹ️ Ya existen ${count} comidas precargadas en la base de datos`);
      return;
    }

    const { comidasPrecargadas } = await import('../modules/nutricion/data/comidasPrecargadas');
    
    const comidasConMetadata = comidasPrecargadas.map(c => ({
      ...c,
      fechaCreacion: new Date(),
    }));

    await db.comidas.bulkAdd(comidasConMetadata);
    console.log(`✅ ${comidasConMetadata.length} comidas precargadas insertadas correctamente`);
  } catch (error) {
    console.error('❌ Error al inicializar comidas precargadas:', error);
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
    // Limpiar duplicados existentes (solo una vez)
    await limpiarEjerciciosDuplicados();
    // Actualizar ejercicios genéricos con versiones específicas (solo una vez)
    await actualizarEjerciciosGenericosEnDB();
    // Inicializar comidas precargadas para nutrición
    await inicializarComidasPrecargadas();
    console.log('✅ Base de datos SaludValpa inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}

// (Los enums ya no se usan aquí, se crean en onboarding)
