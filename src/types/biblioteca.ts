// ============================================================================
// saludvalpa 3.0 - TIPOS PARA BIBLIOTECA Y RUTINAS
// Sistema de ejercicios y rutinas para fisioterapia
// ============================================================================

// ----------------------------------------------------------------------------
// ENUMS Y CONSTANTES
// ----------------------------------------------------------------------------

export const CategoriaEjercicio = {
  MOVILIDAD: 'movilidad',
  FUERZA: 'fuerza',
  EQUILIBRIO: 'equilibrio',
  ESTIRAMIENTO: 'estiramiento',
  CARDIO: 'cardio',
  OTRO: 'otro',
} as const;
export type CategoriaEjercicio = typeof CategoriaEjercicio[keyof typeof CategoriaEjercicio];

export const IntensidadEjercicio = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
} as const;
export type IntensidadEjercicio = typeof IntensidadEjercicio[keyof typeof IntensidadEjercicio];

export const ZonaCorporal = {
  // Miembro superior
  HOMBRO: 'hombro',
  CODO: 'codo',
  MUNECA: 'muñeca',
  MANO: 'mano',
  BRAZO: 'brazo',
  ANTEBRAZO: 'antebrazo',
  
  // Tronco
  CUELLO: 'cuello',
  ESPALDA_ALTA: 'espalda_alta',
  ESPALDA_MEDIA: 'espalda_media',
  ESPALDA_BAJA: 'espalda_baja',
  COLUMNA: 'columna',
  ABDOMEN: 'abdomen',
  TORAX: 'torax',
  
  // Miembro inferior
  CADERA: 'cadera',
  MUSLO: 'muslo',
  RODILLA: 'rodilla',
  PIERNA: 'pierna',
  TOBILLO: 'tobillo',
  PIE: 'pie',
  
  // Generales
  CUERPO_COMPLETO: 'cuerpo_completo',
  CORE: 'core',
} as const;
export type ZonaCorporal = typeof ZonaCorporal[keyof typeof ZonaCorporal];

export const NivelRutina = {
  PRINCIPIANTE: 'principiante',
  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado',
} as const;
export type NivelRutina = typeof NivelRutina[keyof typeof NivelRutina];

// ----------------------------------------------------------------------------
// INTERFACES - EJERCICIOS
// ----------------------------------------------------------------------------

/**
 * Representa un ejercicio individual en la biblioteca
 * Puede ser precargado (del sistema) o personalizado (creado por el usuario)
 */
export interface Ejercicio {
  /** UUID único del ejercicio */
  id: string;
  
  /** Nombre del ejercicio */
  nombre: string;
  
  /** Categoría del ejercicio */
  categoria: CategoriaEjercicio;
  
  /** Zonas corporales que trabaja el ejercicio */
  zonasCorporales: ZonaCorporal[];
  
  /** Descripción general del ejercicio */
  descripcion: string;
  
  /** Pasos detallados para realizar el ejercicio */
  instrucciones: string[];
  
  /** Sugerencia de repeticiones (ej: "3 series de 10") */
  repeticionesSugeridas?: string;
  
  /** Duración sugerida en minutos (para ejercicios de tiempo) */
  duracionSugerida?: number;
  
  /** Nivel de intensidad del ejercicio */
  intensidad: IntensidadEjercicio;
  
  /** Equipo o material necesario */
  equipoNecesario: string[];
  
  /** Contraindicaciones o precauciones */
  contraindicaciones: string[];
  
  /** URL o base64 de imagen demostrativa (opcional) */
  imagenUrl?: string;
  
  /** URLs de videos demostrativos (opcional) */
  videosUrls?: string[];
  
  /** Indica si es un ejercicio del sistema (true) o del usuario (false) */
  precargado: boolean;
  
  /** Fecha de creación del ejercicio */
  fechaCreacion: Date;
  
  /** Fecha de última modificación (solo para personalizados) */
  fechaActualizacion?: Date;
  
  /** ID del profesional que creó el ejercicio (solo para personalizados) */
  usuarioCreadorId?: string;
  
  /** Marcado como favorito por el usuario */
  favorito?: boolean;
  
  /** Notas personales del profesional sobre el ejercicio */
  notasPersonales?: string;
}

// ----------------------------------------------------------------------------
// INTERFACES - RUTINAS
// ----------------------------------------------------------------------------

/**
 * Ejercicio dentro de una rutina con sus parámetros específicos
 */
export interface EjercicioEnRutina {
  /** ID del ejercicio de la biblioteca */
  ejercicioId: string;
  
  /** Posición en la rutina (para ordenamiento) */
  orden: number;
  
  /** Número de series a realizar */
  series?: number;
  
  /** Número de repeticiones por serie */
  repeticiones?: number;
  
  /** Duración en segundos (para ejercicios de tiempo) */
  duracionSegundos?: number;
  
  /** Tiempo de descanso entre series en segundos */
  descansoSegundos?: number;
  
  /** Notas especiales para este ejercicio en esta rutina */
  notasEspeciales?: string;
}

/**
 * Configuración de frecuencia de una rutina
 */
export interface FrecuenciaRutina {
  /** Número de días por semana que se debe realizar */
  diasPorSemana: number;
  
  /** Duración del programa en semanas */
  duracionSemanas?: number;
  
  /** Días específicos de la semana (opcional) */
  diasEspecificos?: string[]; // ['lunes', 'miércoles', 'viernes']
}

/**
 * Rutina de ejercicios completa
 * Puede ser una plantilla reutilizable o estar asignada a un paciente específico
 */
export interface RutinaEjercicios {
  /** UUID único de la rutina */
  id: string;
  
  /** Nombre descriptivo de la rutina */
  nombre: string;
  
  /** Descripción o resumen de la rutina */
  descripcion?: string;
  
  /** Objetivo de la rutina (ej: "Rehabilitación de hombro post-operatorio") */
  objetivo: string;
  
  /** Duración estimada total en minutos (calculada automáticamente) */
  duracionEstimadaMinutos: number;
  
  /** Configuración de frecuencia */
  frecuencia: FrecuenciaRutina;
  
  /** Lista de ejercicios que conforman la rutina */
  ejercicios: EjercicioEnRutina[];
  
  /** Nivel de dificultad de la rutina */
  nivel: NivelRutina;
  
  /** Equipo necesario consolidado (calculado de los ejercicios) */
  equipoNecesario: string[];
  
  /** Indica si es una plantilla reutilizable */
  esPlantilla: boolean;
  
  /** ID del paciente al que está asignada (null si es plantilla) */
  pacienteId?: string;
  
  /** Notas generales sobre la rutina */
  notasGenerales?: string;
  
  /** Fecha de creación de la rutina */
  fechaCreacion: Date;
  
  /** Fecha de última modificación */
  fechaActualizacion: Date;
  
  /** ID del profesional que creó la rutina */
  usuarioCreadorId: string;
  
  /** Fecha en que se asignó al paciente */
  fechaAsignacion?: Date;
  
  /** Indica si la rutina está activa o archivada */
  activa: boolean;
}

// ----------------------------------------------------------------------------
// INTERFACES - SEGUIMIENTO Y ADHERENCIA
// ----------------------------------------------------------------------------

/**
 * Registro de una sesión de ejercicio completada
 * Permite hacer seguimiento de adherencia del paciente
 */
export interface SeguimientoRutina {
  /** UUID único del registro */
  id: string;
  
  /** ID de la rutina */
  rutinaId: string;
  
  /** ID del paciente */
  pacienteId: string;
  
  /** Fecha en que se realizó la sesión */
  fecha: Date;
  
  /** Ejercicios completados en esta sesión */
  ejerciciosCompletados: {
    ejercicioId: string;
    completado: boolean;
    seriesRealizadas?: number;
    repeticionesRealizadas?: number;
    notasPaciente?: string;
  }[];
  
  /** Nivel de dolor reportado (0-10) */
  nivelDolor?: number;
  
  /** Nivel de esfuerzo percibido (0-10) */
  nivelEsfuerzo?: number;
  
  /** Duración real de la sesión en minutos */
  duracionRealMinutos?: number;
  
  /** Notas del paciente */
  notasPaciente?: string;
  
  /** Notas del profesional (si revisó la sesión) */
  notasProfesional?: string;
  
  /** Fecha de creación del registro */
  fechaCreacion: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES - DATOS PRECARGADOS
// ----------------------------------------------------------------------------

/**
 * Estructura para definir ejercicios precargados en el sistema
 */
export interface EjercicioPrecargado {
  nombre: string;
  categoria: CategoriaEjercicio;
  zonasCorporales: ZonaCorporal[];
  descripcion: string;
  instrucciones: string[];
  repeticionesSugeridas?: string;
  duracionSugerida?: number;
  intensidad: IntensidadEjercicio;
  equipoNecesario: string[];
  contraindicaciones: string[];
  imagenUrl?: string;
}

// ----------------------------------------------------------------------------
// TIPOS AUXILIARES
// ----------------------------------------------------------------------------

/**
 * Filtros para búsqueda de ejercicios
 */
export interface FiltrosEjercicios {
  busqueda?: string;
  categoria?: CategoriaEjercicio;
  zonasCorporales?: ZonaCorporal[];
  intensidad?: IntensidadEjercicio;
  soloPrecargados?: boolean;
  soloPersonalizados?: boolean;
  soloFavoritos?: boolean;
}

/**
 * Filtros para búsqueda de rutinas
 */
export interface FiltrosRutinas {
  busqueda?: string;
  nivel?: NivelRutina;
  soloPlantillas?: boolean;
  soloPaciente?: string;
  soloActivas?: boolean;
}

/**
 * Estadísticas de una rutina
 */
export interface EstadisticasRutina {
  rutinaId: string;
  totalSesiones: number;
  sesionesCompletadas: number;
  porcentajeAdherencia: number;
  promedioNivelDolor?: number;
  promedioNivelEsfuerzo?: number;
  ultimaSesion?: Date;
}
