// ============================================================================
// saludvalpa 3.0 - TIPOS ESPECÍFICOS DE NUTRICIÓN
// Interfaces para el módulo de planes de alimentación
// ============================================================================

// ----------------------------------------------------------------------------
// DÍA DE LA SEMANA (para planificación semanal)
// ----------------------------------------------------------------------------

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export const DIAS_SEMANA: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

// ----------------------------------------------------------------------------
// COMIDA EN UN DÍA (para planificación semanal)
// ----------------------------------------------------------------------------

export interface ComidaEnDia {
  dia: DiaSemana;
  comidas: ComidaEnPlan[];
}

// ----------------------------------------------------------------------------
// RECETA PERSONALIZADA (Creada por el usuario)
// ----------------------------------------------------------------------------

export interface RecetaPersonalizada {
  id: string;
  nombre: string;
  categoria: 'desayuno' | 'colacion' | 'comida' | 'cena';
  descripcion: string;
  ingredientes: string[];
  preparacion: string[];
  tiempoPreparacion: number; // minutos
  dificultad: 'facil' | 'media' | 'avanzada';
  nutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra?: number;
  };
  porciones: number;
  alergenos?: string[];
  etiquetas?: string[];
  aptoPara?: string[];
  foto?: string;
  usuarioCreadorId?: string;
  favorita: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// ----------------------------------------------------------------------------
// CICLO DE MENÚ (para repetición semanal)
// ----------------------------------------------------------------------------

export interface MenuCycle {
  id: string;
  nombre: string;
  planId: string;
  semanas: MenuCycleWeek[];
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface MenuCycleWeek {
  numero: number; // 1-based week number within the cycle
  nombre: string; // e.g., "Semana A", "Semana B"
  comidasPorDia: ComidaEnDia[];
}

// ----------------------------------------------------------------------------
// COMIDA PRECARGADA (Catálogo)
// ----------------------------------------------------------------------------

export interface ComidaPrecargada {
  id: string;
  nombre: string;
  categoria: 'desayuno' | 'colacion' | 'comida' | 'cena';
  descripcion: string;
  ingredientes: string[];
  preparacion?: string[];
  tiempoPreparacion?: number; // minutos
  dificultad: 'facil' | 'media' | 'avanzada';
  nutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra?: number;
  };
  porciones: number;
  alergenos?: string[];
  etiquetas?: string[];
  aptoPara?: string[]; // ['diabetico', 'vegano', 'celiaco', ...]
  foto?: string; // URL o base64
  esRecetaPersonalizada?: boolean; // Flag to distinguish custom recipes
}

// ----------------------------------------------------------------------------
// COMIDA EN UN PLAN (Instancia dentro de un plan de alimentación)
// ----------------------------------------------------------------------------

export interface ComidaEnPlan {
  id: string;
  comidaPrecargadaId?: string;
  nombre: string;
  tipo: 'desayuno' | 'colacion1' | 'comida' | 'colacion2' | 'cena';
  horario: string;
  ingredientes: string[];
  preparacion?: string;
  porcion: string;
  porcionMultiplicador: number; // 1 = porción normal, 0.5 = media porción, 2 = doble
  nutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra?: number;
  };
  personalizaciones?: PersonalizacionComida[];
  notas?: string;
  orden: number;
}

// Extensión para almacenamiento en DB (incluye campos de tabla)
export interface ComidaEnPlanDB extends ComidaEnPlan {
  planId: string;
  fechaCreacion: Date;
}

export interface PersonalizacionComida {
  ingredienteOriginal: string;
  sustituto: string;
  motivo: 'alergia' | 'preferencia' | 'intolerancia' | 'disponibilidad' | 'religion' | 'otro';
  fechaModificacion: Date;
}

// ----------------------------------------------------------------------------
// PLAN DE ALIMENTACIÓN COMPLETO
// ----------------------------------------------------------------------------

export interface PlanAlimentacion {
  id: string;
  nombre: string;
  descripcion: string;
  objetivo: 'perder_peso' | 'ganar_musculo' | 'mantener' | 'control_enfermedad' | 'rendimiento';
  pacienteId?: string;
  esPlantilla: boolean;
  activo: boolean;
  requerimientos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra?: number;
  };
  distribucionComidas: {
    desayuno: ComidaEnPlan[];
    colacion1: ComidaEnPlan[];
    comida: ComidaEnPlan[];
    colacion2: ComidaEnPlan[];
    cena: ComidaEnPlan[];
  };
  comidasPorDia?: ComidaEnDia[];  // Weekly meal distribution (new weekly structure)
  recomendaciones: string[];
  usuarioCreadorId?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  profesion: string;
  // Metadatos de personalización
  personalizacionesActivas?: boolean;
  historialPersonalizaciones?: {
    fecha: Date;
    descripcion: string;
    usuarioId: string;
  }[];
  // Ciclo de menú (para repetición semanal)
  menuCycles?: MenuCycle[];
  menuCycleActivoId?: string;
  // Configuración de repetición
  repetirMenu?: boolean;
  semanasRepeticion?: number; // Cada cuántas semanas se repite (1 = semanal, 2 = quincenal, etc.)
}

// ----------------------------------------------------------------------------
// SEGUIMIENTO NUTRICIONAL
// ----------------------------------------------------------------------------

export interface SeguimientoNutricional {
  id: string;
  planId: string;
  pacienteId: string;
  fecha: Date;
  cumplimiento: number; // 0-100%
  comidasRealizadas: string[]; // IDs de comidas completadas
  comidasSaltadas: string[]; // IDs de comidas no realizadas
  dificultades: string[];
  peso?: number;
  observaciones?: string;
  profesion: string;
  fechaCreacion: Date;
}

// ----------------------------------------------------------------------------
// FILTROS PARA BÚSQUEDA
// ----------------------------------------------------------------------------

export interface FiltrosPlanes {
  busqueda?: string;
  objetivo?: PlanAlimentacion['objetivo'];
  activo?: boolean;
  esPlantilla?: boolean;
  pacienteId?: string;
  ordenarPor?: 'fecha' | 'nombre' | 'calorias';
  ordenDireccion?: 'asc' | 'desc';
}

// ----------------------------------------------------------------------------
// ESTADÍSTICAS DE PLANES
// ----------------------------------------------------------------------------

export interface EstadisticasPlanes {
  totalPlanes: number;
  planesActivos: number;
  plantillas: number;
  planesPorObjetivo: Record<string, number>;
  cumplimientoPromedio: number;
  pacientesConPlan: number;
}

// ----------------------------------------------------------------------------
// OPCIONES PARA CREAR PLAN
// ----------------------------------------------------------------------------

export interface CrearPlanOptions {
  nombre: string;
  descripcion: string;
  objetivo: PlanAlimentacion['objetivo'];
  usarPlantilla?: string; // ID de plantilla base
  datosPaciente?: {
    edad: number;
    sexo: 'masculino' | 'femenino';
    peso: number;
    talla: number;
    actividad: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta';
    alergias?: string[];
    preferencias?: string[];
  };
}
