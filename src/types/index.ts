// ============================================================================
// saludvalpa 3.0 - TYPE DEFINITIONS
// ============================================================================

// ----------------------------------------------------------------------------
// CONSTANTES Y TIPOS
// ----------------------------------------------------------------------------

export const TipoLicencia = {
  GRATUITA: 'gratuita',
  PAGADA: 'pagada',
} as const;
export type TipoLicencia = typeof TipoLicencia[keyof typeof TipoLicencia];

export const EstadoLicencia = {
  ACTIVA: 'activa',
  EXPIRADA: 'expirada',
  INVALIDA: 'invalida',
} as const;
export type EstadoLicencia = typeof EstadoLicencia[keyof typeof EstadoLicencia];

export const EstadoCita = {
  PROGRAMADA: 'programada',
  CONFIRMADA: 'confirmada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;
export type EstadoCita = typeof EstadoCita[keyof typeof EstadoCita];

export const EstadoPago = {
  PENDIENTE: 'pendiente',
  PAGADO_PARCIAL: 'pagado_parcial',
  PAGADO_COMPLETO: 'pagado_completo',
} as const;
export type EstadoPago = typeof EstadoPago[keyof typeof EstadoPago];

// ============================================================================
// BIBLIOTECA DE CONTENIDOS
// ============================================================================

export interface RecursoBiblioteca {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string; // HTML o Markdown
  categoria: string; // Ej: "ejercicios", "educacion", "cuidados"
  profesion: TipoProfesion;
  imagenes?: string[]; // URLs o base64
  videos?: string[]; // URLs
  linksExternos?: { titulo: string; url: string }[];
  etiquetas: string[]; // Tags para búsqueda
  favorito?: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  esContenidoPrecargado?: boolean; // Para distinguir contenido del sistema vs usuario
}

export const TipoProfesion = {
  FISIOTERAPIA: 'fisioterapia',
  PSICOLOGIA: 'psicologia',
  NUTRICION: 'nutricion',
  MEDICINA_GENERAL: 'medicina_general',
  ODONTOLOGIA: 'odontologia',
} as const;
export type TipoProfesion = typeof TipoProfesion[keyof typeof TipoProfesion];

export const TipoDocumento = {
  RECIBO_PAGO: 'recibo_pago',
  CONSENTIMIENTO_INFORMADO: 'consentimiento_informado',
  HOJA_BLANCO: 'hoja_blanco',
  REPORTE_SESION: 'reporte_sesion',
  CONFIRMACION_CITA: 'confirmacion_cita',
  // Fisioterapia
  EVALUACION_FISIOTERAPEUTICA: 'evaluacion_fisioterapeutica',
  PLAN_TRATAMIENTO: 'plan_tratamiento',
  // Psicología
  HISTORIA_CLINICA_PSICOLOGICA: 'historia_clinica_psicologica',
  NOTA_SESION_PSICOLOGICA: 'nota_sesion_psicologica',
  PLAN_TERAPEUTICO: 'plan_terapeutico',
  // Nutrición
  PLAN_NUTRICIONAL: 'plan_nutricional',
  VALORACION_NUTRICIONAL: 'valoracion_nutricional',
  // Medicina General
  HISTORIA_CLINICA_MEDICA: 'historia_clinica_medica',
  RECETA_MEDICA: 'receta_medica',
  CERTIFICADO_MEDICO: 'certificado_medico',
  NOTA_EVOLUCION_MEDICA: 'nota_evolucion_medica',
  // Odontología
  HISTORIA_CLINICA_ODONTOLOGICA: 'historia_clinica_odontologica',
  ODONTOGRAMA: 'odontograma',
  PLAN_TRATAMIENTO_ODONTOLOGICO: 'plan_tratamiento_odontologico',
  PRESUPUESTO_ODONTOLOGICO: 'presupuesto_odontologico',
  // Genéricos
  HISTORIA_CLINICA: 'historia_clinica',
  NOTA_SESION: 'nota_sesion',
} as const;
export type TipoDocumento = typeof TipoDocumento[keyof typeof TipoDocumento];

// Categorización de documentos para filtrado y organización
export const DocumentCategory = {
  ADMINISTRATIVO: 'administrativo',
  MEDICO: 'medico',
} as const;
export type DocumentCategory = typeof DocumentCategory[keyof typeof DocumentCategory];

// ----------------------------------------------------------------------------
// SISTEMA DE DOCUMENTOS POR ESPECIALIDAD
// ----------------------------------------------------------------------------

/**
 * Documento especializado por profesión con configuración para generación
 */
export interface DocumentoEspecialidad {
  id: string;
  tipoDocumento: TipoDocumento;
  nombre: string;
  descripcion: string;
  icono: string;
  especialidad: TipoProfesion;
  categoria: DocumentCategory;
  componenteGenerador: string; // Nombre del componente React
  requiereSesion?: boolean;
}

/**
 * Configuración completa de documentos disponibles por especialidad
 */
export const DOCUMENTOS_POR_ESPECIALIDAD: Record<TipoProfesion, DocumentoEspecialidad[]> = {
  [TipoProfesion.FISIOTERAPIA]: [
    {
      id: 'eval-fisio',
      tipoDocumento: TipoDocumento.EVALUACION_FISIOTERAPEUTICA,
      nombre: 'Evaluación Fisioterapéutica',
      descripcion: 'Evaluación inicial completa del paciente',
      icono: '📋',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'GenerarEvaluacionFisioterapeutica'
    },
    {
      id: 'plan-tratamiento',
      tipoDocumento: TipoDocumento.PLAN_TRATAMIENTO,
      nombre: 'Plan de Tratamiento',
      descripcion: 'Plan personalizado de ejercicios y terapias',
      icono: '📝',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'GenerarPlanTratamiento'
    },
    {
      id: 'nota-evolucion',
      tipoDocumento: TipoDocumento.NOTA_EVOLUCION_MEDICA,
      nombre: 'Nota de Evolución',
      descripcion: 'Seguimiento del progreso del paciente',
      icono: '📈',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'GenerarNotaEvolucion'
    },
    {
      id: 'consentimiento',
      tipoDocumento: TipoDocumento.CONSENTIMIENTO_INFORMADO,
      nombre: 'Consentimiento Informado',
      descripcion: 'Autorización para tratamiento',
      icono: '✍️',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarConsentimiento'
    },
    {
      id: 'confirmacion-cita',
      tipoDocumento: TipoDocumento.CONFIRMACION_CITA,
      nombre: 'Confirmación de Cita',
      descripcion: 'Documento para confirmar citas médicas programadas',
      icono: '📅',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'comprobante-pago',
      tipoDocumento: TipoDocumento.RECIBO_PAGO,
      nombre: 'Comprobante de Pago',
      descripcion: 'Documento para registrar pagos y facturación',
      icono: '💰',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'hoja-blanca',
      tipoDocumento: TipoDocumento.HOJA_BLANCO,
      nombre: 'Hoja en Blanco',
      descripcion: 'Documento genérico en blanco para notas personalizadas',
      icono: '📄',
      especialidad: TipoProfesion.FISIOTERAPIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    }
  ],
  [TipoProfesion.PSICOLOGIA]: [
    {
      id: 'eval-psico',
      tipoDocumento: TipoDocumento.HISTORIA_CLINICA_PSICOLOGICA,
      nombre: 'Evaluación Psicológica',
      descripcion: 'Evaluación psicológica inicial',
      icono: '🧠',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'EvaluacionPsicologica'
    },
    {
      id: 'informe-psico',
      tipoDocumento: TipoDocumento.NOTA_SESION_PSICOLOGICA,
      nombre: 'Informe Psicológico',
      descripcion: 'Informe detallado de evaluación',
      icono: '📊',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'InformePsicologico'
    },
    {
      id: 'plan-terapeutico',
      tipoDocumento: TipoDocumento.PLAN_TERAPEUTICO,
      nombre: 'Plan Terapéutico',
      descripcion: 'Plan de intervención psicológica',
      icono: '🎯',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'PlanTerapeutico'
    },
    {
      id: 'confirmacion-cita-psico',
      tipoDocumento: TipoDocumento.CONFIRMACION_CITA,
      nombre: 'Confirmación de Cita',
      descripcion: 'Documento para confirmar citas psicológicas programadas',
      icono: '📅',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'comprobante-pago-psico',
      tipoDocumento: TipoDocumento.RECIBO_PAGO,
      nombre: 'Comprobante de Pago',
      descripcion: 'Documento para registrar pagos de sesiones psicológicas',
      icono: '💰',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'hoja-blanca-psico',
      tipoDocumento: TipoDocumento.HOJA_BLANCO,
      nombre: 'Hoja en Blanco',
      descripcion: 'Documento genérico en blanco para notas psicológicas',
      icono: '📄',
      especialidad: TipoProfesion.PSICOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    }
  ],
  [TipoProfesion.NUTRICION]: [
    {
      id: 'eval-nutri',
      tipoDocumento: TipoDocumento.VALORACION_NUTRICIONAL,
      nombre: 'Evaluación Nutricional',
      descripcion: 'Evaluación completa del estado nutricional',
      icono: '🍎',
      especialidad: TipoProfesion.NUTRICION,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'EvaluacionNutricional'
    },
    {
      id: 'plan-nutri',
      tipoDocumento: TipoDocumento.PLAN_NUTRICIONAL,
      nombre: 'Plan Nutricional',
      descripcion: 'Plan de alimentación personalizado',
      icono: '🥗',
      especialidad: TipoProfesion.NUTRICION,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'PlanNutricional'
    },
    {
      id: 'ficha-cliente',
      tipoDocumento: TipoDocumento.HOJA_BLANCO,
      nombre: 'Ficha de Cliente',
      descripcion: 'Ficha de registro del paciente',
      icono: '📋',
      especialidad: TipoProfesion.NUTRICION,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarFichaCliente'
    },
    {
      id: 'confirmacion-cita-nutri',
      tipoDocumento: TipoDocumento.CONFIRMACION_CITA,
      nombre: 'Confirmación de Cita',
      descripcion: 'Documento para confirmar citas nutricionales programadas',
      icono: '📅',
      especialidad: TipoProfesion.NUTRICION,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'comprobante-pago-nutri',
      tipoDocumento: TipoDocumento.RECIBO_PAGO,
      nombre: 'Comprobante de Pago',
      descripcion: 'Documento para registrar pagos de consultas nutricionales',
      icono: '💰',
      especialidad: TipoProfesion.NUTRICION,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    }
  ],
  [TipoProfesion.MEDICINA_GENERAL]: [
    {
      id: 'receta-medica',
      tipoDocumento: TipoDocumento.RECETA_MEDICA,
      nombre: 'Receta Médica',
      descripcion: 'Prescripción de medicamentos',
      icono: '💊',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'GenerarRecetaMedica'
    },
    {
      id: 'examen-medico',
      tipoDocumento: TipoDocumento.HISTORIA_CLINICA_MEDICA,
      nombre: 'Examen Médico',
      descripcion: 'Examen médico completo',
      icono: '🩺',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'HistoriaClinicaMedica'
    },
    {
      id: 'certificado-medico',
      tipoDocumento: TipoDocumento.CERTIFICADO_MEDICO,
      nombre: 'Certificado Médico',
      descripcion: 'Certificado de salud o incapacidad',
      icono: '📜',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'historia-clinica',
      tipoDocumento: TipoDocumento.HISTORIA_CLINICA,
      nombre: 'Historia Clínica',
      descripcion: 'Historial médico completo',
      icono: '📋',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'HistoriaClinicaMedica'
    },
    {
      id: 'confirmacion-cita-medica',
      tipoDocumento: TipoDocumento.CONFIRMACION_CITA,
      nombre: 'Confirmación de Cita',
      descripcion: 'Documento para confirmar citas médicas programadas',
      icono: '📅',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'comprobante-pago-medico',
      tipoDocumento: TipoDocumento.RECIBO_PAGO,
      nombre: 'Comprobante de Pago',
      descripcion: 'Documento para registrar pagos de consultas médicas',
      icono: '💰',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'hoja-blanca-medica',
      tipoDocumento: TipoDocumento.HOJA_BLANCO,
      nombre: 'Hoja en Blanco',
      descripcion: 'Documento genérico en blanco para notas médicas',
      icono: '📄',
      especialidad: TipoProfesion.MEDICINA_GENERAL,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    }
  ],
  [TipoProfesion.ODONTOLOGIA]: [
    {
      id: 'historia-odonto',
      tipoDocumento: TipoDocumento.HISTORIA_CLINICA_ODONTOLOGICA,
      nombre: 'Historia Odontológica',
      descripcion: 'Historial dental completo',
      icono: '🦷',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.MEDICO,
      componenteGenerador: 'HistoriaClinicaOdontologica'
    },
    {
      id: 'presupuesto-dental',
      tipoDocumento: TipoDocumento.PRESUPUESTO_ODONTOLOGICO,
      nombre: 'Presupuesto Dental',
      descripcion: 'Presupuesto de tratamientos dentales',
      icono: '💰',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'consentimiento-odonto',
      tipoDocumento: TipoDocumento.CONSENTIMIENTO_INFORMADO,
      nombre: 'Consentimiento Informado',
      descripcion: 'Autorización para tratamiento dental',
      icono: '✍️',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarConsentimiento'
    },
    {
      id: 'confirmacion-cita-odonto',
      tipoDocumento: TipoDocumento.CONFIRMACION_CITA,
      nombre: 'Confirmación de Cita',
      descripcion: 'Documento para confirmar citas dentales programadas',
      icono: '📅',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'comprobante-pago-odonto',
      tipoDocumento: TipoDocumento.RECIBO_PAGO,
      nombre: 'Comprobante de Pago',
      descripcion: 'Documento para registrar pagos de tratamientos dentales',
      icono: '💰',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    },
    {
      id: 'hoja-blanca-odonto',
      tipoDocumento: TipoDocumento.HOJA_BLANCO,
      nombre: 'Hoja en Blanco',
      descripcion: 'Documento genérico en blanco para notas dentales',
      icono: '📄',
      especialidad: TipoProfesion.ODONTOLOGIA,
      categoria: DocumentCategory.ADMINISTRATIVO,
      componenteGenerador: 'GenerarHojaBlanco'
    }
  ]
};

/**
 * Determina la categoría de un documento basado en su tipo
 */
export function obtenerCategoriaDocumento(tipo: TipoDocumento): DocumentCategory {
  // Documentos administrativos
  const administrativos: TipoDocumento[] = [
    TipoDocumento.RECIBO_PAGO,
    TipoDocumento.CONSENTIMIENTO_INFORMADO,
    TipoDocumento.HOJA_BLANCO,
    TipoDocumento.CONFIRMACION_CITA,
    TipoDocumento.PRESUPUESTO_ODONTOLOGICO
  ];

  // Documentos médicos (todos los demás)
  const medicos: TipoDocumento[] = [
    TipoDocumento.EVALUACION_FISIOTERAPEUTICA,
    TipoDocumento.PLAN_TRATAMIENTO,
    TipoDocumento.HISTORIA_CLINICA_PSICOLOGICA,
    TipoDocumento.NOTA_SESION_PSICOLOGICA,
    TipoDocumento.PLAN_TERAPEUTICO,
    TipoDocumento.PLAN_NUTRICIONAL,
    TipoDocumento.VALORACION_NUTRICIONAL,
    TipoDocumento.HISTORIA_CLINICA_MEDICA,
    TipoDocumento.RECETA_MEDICA,
    TipoDocumento.CERTIFICADO_MEDICO,
    TipoDocumento.NOTA_EVOLUCION_MEDICA,
    TipoDocumento.HISTORIA_CLINICA_ODONTOLOGICA,
    TipoDocumento.ODONTOGRAMA,
    TipoDocumento.PLAN_TRATAMIENTO_ODONTOLOGICO,
    TipoDocumento.HISTORIA_CLINICA,
    TipoDocumento.NOTA_SESION,
    TipoDocumento.REPORTE_SESION
  ];

  if (administrativos.includes(tipo)) {
    return DocumentCategory.ADMINISTRATIVO;
  }
  
  if (medicos.includes(tipo)) {
    return DocumentCategory.MEDICO;
  }

  // Por defecto, considerar como médico
  return DocumentCategory.MEDICO;
}

export const Genero = {
  MASCULINO: 'masculino',
  FEMENINO: 'femenino',
  OTRO: 'otro',
  PREFIERO_NO_DECIR: 'prefiero_no_decir',
} as const;
export type Genero = typeof Genero[keyof typeof Genero];

// ----------------------------------------------------------------------------
// INTERFACES PRINCIPALES
// ----------------------------------------------------------------------------

export interface Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: Date;
  edad?: number; // Calculado
  genero: Genero;
  telefono: string;
  email?: string;
  direccion?: string;
  foto?: string; // Base64 o URL
  profesion?: string; // Profesión del paciente (ocupación)
  profesionPrincipal: TipoProfesion; // Profesión del profesional que atiende al paciente
  motivoConsulta?: string;
  historialMedico?: string;
  alergias: string[];
  medicamentos: string[];
  contactoEmergencia?: ContactoEmergencia;
  fechaCreacion: Date;
  ultimaConsulta?: Date;
  activo: boolean;
  // Datos específicos por profesión
  datosEspecificos?: any;
  // Referencias
  documentosIds: string[];
  citasIds: string[];
  sesionesIds: string[];
}

export interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  relacion: string;
}

export interface Sesion {
  id: string;
  pacienteId: string;
  profesionalId?: string; // Para multiusuario
  fecha: Date;
  duracion?: number; // En minutos
  tipo: string;
  notas: string;
  materialesUtilizados: Material[];
  mediosFisicos: string[];
  profesion: TipoProfesion; // Profesión de la sesión
  // Datos específicos por profesión
  datosEspecificosProfesion: any;
  documentosGenerados: string[];
  costo?: number;
  estadoPago?: EstadoPago;
  conMarcadorTiempo?: boolean; // Indica si la sesión/consulta usó marcador de tiempo
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Material {
  nombre: string;
  cantidad: number;
  costo?: number;
}

export interface Cita {
  id: string;
  pacienteId: string;
  profesionalId?: string;
  fechaHora: Date;
  duracion: number; // En minutos
  tipo: string;
  estado: EstadoCita;
  profesion: TipoProfesion; // Profesión de la cita
  notas?: string;
  recordatorioEnviado: boolean;
  sesionId?: string; // Si ya se completó la cita
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Documento {
  id: string;
  tipo: TipoDocumento;
  nombre: string; // Nombre descriptivo del documento
  pacienteId: string;
  profesionalId?: string;
  profesion: TipoProfesion; // Profesión del documento
  fechaCreacion: Date; // Fecha de generación
  contenidoBase64: string; // PDF en base64 para almacenar en IndexedDB
  firmado: boolean; // Si tiene firma digital
  categoria?: DocumentCategory; // Categoría del documento (administrativo/médico)
  metadata: {
    folio?: string;
    numeroConsecutivo?: number;
    version?: string;
    licenciaTipo?: TipoLicencia;
    [key: string]: any; // Metadata adicional específica por tipo
  };
}

export interface Licencia {
  tipo: TipoLicencia;
  codigo?: string;
  fechaActivacion?: Date;
  fechaExpiracion?: Date;
  estado: EstadoLicencia;
  diasRestantes?: number;
  limitePacientes?: number;
  metadata?: {
    tipo?: string; // 'anual', 'semestral', 'trimestral', 'mensual', 'beta'
    duracionDias?: number;
    precio?: number;
    generado?: string;
    [key: string]: any;
  };
}

export interface Configuracion {
  id: string; // Siempre '1' para singleton
  profesion: TipoProfesion;
  tipoCuenta: 'personal' | 'clinica';
  licencia: Licencia;
  branding: Branding;
  datosContacto: DatosContacto;
  preferencias: Preferencias;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Branding {
  logo?: string; // Base64
  nombreProfesional: string;
  nombreClinica?: string;
  credenciales?: string; // Ej: "Lic. en Fisioterapia, Cédula 1234567"
  especialidad?: string; // Ej: "Especialista en Rehabilitación Deportiva"
  colores: {
    primario: string;
    secundario: string;
    acento: string;
  };
  tema: 'saludvalpa' | 'minimalista' | 'profesional' | 'moderno' | 'personalizado';
  piePagina: string;
  mostrarMarcaDeAgua: boolean; // En versión gratuita siempre true
  formatoDocumentos: 'formal' | 'informal' | 'moderno';
}

export interface DatosContacto {
  telefono: string;
  email: string;
  direccion?: string;
  sitioWeb?: string;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Preferencias {
  formatoFecha: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  zonaHoraria: string;
  idioma: 'es' | 'en';
  notificaciones: boolean;
  recordatorios: {
    habilitados: boolean;
    anticipacionCitas: number; // Minutos antes
    anticipacionDia: number; // Horas antes (para recordatorio del día anterior)
    sonido: boolean;
  };
  agenda: {
    vistaInicial: 'dia' | 'semana' | 'mes';
    horaInicio: string; // Ej: "08:00"
    horaFin: string; // Ej: "20:00"
    duracionCitaDefault: number; // Minutos
  };
  economia: {
    moneda: string; // Ej: "MXN", "USD", "COP"
    mostrarImpuestos: boolean;
    iva: number; // Porcentaje
  };
}

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  rol: 'admin' | 'profesional' | 'recepcionista';
  profesion?: TipoProfesion;
  activo: boolean;
  firma?: string; // Base64
  fechaCreacion: Date;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion?: number; // En minutos
  categoria?: string;
  activo: boolean;
  profesion?: TipoProfesion;
}

export interface Cotizacion {
  id: string;
  pacienteId: string;
  fecha: Date;
  servicios: ItemCotizacion[];
  subtotal: number;
  descuento?: number;
  total: number;
  validezDias: number;
  profesion: TipoProfesion; // Profesión de la cotización
  notas?: string;
  estado: 'vigente' | 'aceptada' | 'rechazada' | 'expirada';
}

export interface ItemCotizacion {
  servicioId?: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Recibo {
  id: string;
  numero: number; // Consecutivo
  pacienteId: string;
  fecha: Date;
  servicios: ItemCotizacion[];
  subtotal: number;
  descuento?: number;
  total: number;
  profesion: TipoProfesion; // Profesión del recibo
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  estadoPago: EstadoPago;
  fechaPago?: Date;
  notas?: string;
}

// Alias para compatibilidad (usar RecursoBiblioteca)
export type ContenidoBiblioteca = RecursoBiblioteca;

// ============================================================================
// BIBLIOTECA Y RUTINAS (FISIOTERAPIA)
// ============================================================================

export type {
  Ejercicio,
  EjercicioPrecargado,
  RutinaEjercicios,
  EjercicioEnRutina,
  FrecuenciaRutina,
  SeguimientoRutina,
  FiltrosEjercicios,
  FiltrosRutinas,
  EstadisticasRutina,
} from './biblioteca';

// Exportar también los enums como valores
export {
  CategoriaEjercicio,
  IntensidadEjercicio,
  ZonaCorporal,
  NivelRutina,
} from './biblioteca';

// Exportar también los tipos de los enums
export type {
  CategoriaEjercicio as CategoriaEjercicioType,
  IntensidadEjercicio as IntensidadEjercicioType,
  ZonaCorporal as ZonaCorporalType,
  NivelRutina as NivelRutinaType,
} from './biblioteca';

// ----------------------------------------------------------------------------
// DATOS ESPECÍFICOS POR PROFESIÓN
// ----------------------------------------------------------------------------

export interface DatosFisioterapia {
  // Evaluación inicial
  evaluacionInicial?: {
    postura?: string;
    marcha?: string;
    rangoMovimiento?: { [key: string]: string };
    fuerzaMuscular?: string;
    sensibilidad?: string;
  };
  // Durante la sesión
  escalaDolor?: number; // 0-10
  areaDolor?: string;
  tecnicasAplicadas: string[];
  ejerciciosRealizados: string[];
  // Plan de tratamiento
  planTratamiento?: {
    objetivos: string[];
    numeroSesiones?: number;
    frecuencia?: string;
    ejerciciosCasa: string[];
  };
}

export interface DatosPsicologia {
  // Historia clínica
  historiaClinica?: {
    motivoConsulta: string;
    antecedentesPersonales?: string;
    antecedentesFamiliares?: string;
    historiaPsiquiatrica?: string;
  };
  
  // Evaluación psicológica
  evaluacionPsicologica?: {
    pruebasAplicadas: string[];
    resultados: { [prueba: string]: any };
    observaciones: string;
  };
  
  // Plan terapéutico
  planTerapeutico?: {
    objetivosEspecificos: string[];
    tecnicasTerapeuticas: string[];
    frecuenciaSesiones: string;
    duracionEstimada: string;
  };
  
  // Durante la sesión
  estadoEmocional?: string;
  estadoMental?: string;
  tecnicasAplicadas: string[];
  tareasAsignadas: string[];
  
  // Seguimiento de síntomas
  seguimientoSintomas?: {
    escala: string; // "PHQ-9", "GAD-7", etc.
    puntuacion: number;
    fecha: Date;
  }[];
  
  // Evolución
  evolucion?: {
    progreso: string;
    objetivosTerapeuticos: string[];
    proximosPasos: string[];
  };
}

export interface DatosNutricion {
  // Evaluación nutricional
  evaluacionNutricional?: {
    antropometria: {
      peso: number;
      talla: number;
      imc: number;
      circunferenciaCintura: number;
      plieguesCutaneos?: { [zona: string]: number };
    };
    habitosAlimenticios: string[];
    alergiasAlimentarias: string[];
    preferenciasAlimentarias: string[];
  };
  
  // Plan nutricional
  planNutricional?: {
    requerimientos: {
      calorias: number;
      proteinas: number; // g
      carbohidratos: number; // g
      grasas: number; // g
    };
    distribucionComidas: {
      desayuno: string;
      colacion1: string;
      comida: string;
      colacion2: string;
      cena: string;
    };
    recomendacionesEspecificas: string[];
  };
  
  // Seguimiento
  seguimiento?: {
    peso: number;
    fecha: Date;
    cumplimiento: number; // 0-100%
    dificultades: string[];
  }[];
}

export interface DatosManicurista {
  serviciosAplicados: ServicioManicura[];
  productosUtilizados: string[];
  coloresAplicados: Array<{ nombre: string; codigo?: string }>;
  duracionProcedimiento?: number;
  fotosGaleria?: string[]; // Base64
  recomendacionesCuidado: string[];
  proximaCitaSugerida?: Date;
}

export interface ServicioManicura {
  tipo: 'manicure' | 'pedicure' | 'acrilicas' | 'gel' | 'nail_art' | 'otro';
  descripcion?: string;
}

// ----------------------------------------------------------------------------
// TIPO UNION PARA DATOS ESPECÍFICOS POR PROFESIÓN
// ----------------------------------------------------------------------------

export type DatosEspecificosProfesion =
  | DatosFisioterapia
  | DatosPsicologia
  | DatosNutricion
  | DatosMedicinaGeneral
  | DatosOdontologia
  | DatosManicurista;

// ----------------------------------------------------------------------------
// MEDICINA GENERAL - Interfaces específicas
// ----------------------------------------------------------------------------

// Tipos enumerados para medicina
export const TipoAntecedente = {
  PATOLOGICO: 'patologico',
  QUIRURGICO: 'quirurgico',
  ALERGICO: 'alergico',
  TOXICO: 'toxico',
  GINECOLOGICO: 'ginecologico',
  FAMILIAR: 'familiar',
  TRAUMATICO: 'traumatico',
  HOSPITALARIO: 'hospitalario',
} as const;
export type TipoAntecedente = typeof TipoAntecedente[keyof typeof TipoAntecedente];

export const ViaAdministracion = {
  ORAL: 'oral',
  INTRAVENOSA: 'intravenosa',
  INTRAMUSCULAR: 'intramuscular',
  SUBCUTANEA: 'subcutanea',
  TOPICA: 'topica',
  INHALATORIA: 'inhalatoria',
  OFTALMICA: 'oftalmica',
  OTICA: 'otica',
  RECTAL: 'rectal',
  VAGINAL: 'vaginal',
  TRANSDERMICA: 'transdermica',
} as const;
export type ViaAdministracion = typeof ViaAdministracion[keyof typeof ViaAdministracion];

export const FrecuenciaMedicacion = {
  UNA_VEZ_DIA: 'una_vez_dia',
  DOS_VECES_DIA: 'dos_veces_dia',
  TRES_VECES_DIA: 'tres_veces_dia',
  CADA_4_HORAS: 'cada_4_horas',
  CADA_6_HORAS: 'cada_6_horas',
  CADA_8_HORAS: 'cada_8_horas',
  CADA_12_HORAS: 'cada_12_horas',
  CADA_24_HORAS: 'cada_24_horas',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
  SEGUN_NECESIDAD: 'segun_necesidad',
  ANTES_COMIDA: 'antes_comida',
  DESPUES_COMIDA: 'despues_comida',
  CON_COMIDA: 'con_comida',
} as const;
export type FrecuenciaMedicacion = typeof FrecuenciaMedicacion[keyof typeof FrecuenciaMedicacion];

export const UnidadDosis = {
  MG: 'mg',
  G: 'g',
  ML: 'ml',
  MCG: 'mcg',
  UI: 'UI',
  MG_KG: 'mg_kg',
  MCG_KG: 'mcg_kg',
  GOTAS: 'gotas',
  COMPRIMIDOS: 'comprimidos',
  CÁPSULAS: 'capsulas',
  SOBRES: 'sobres',
  INHALACIONES: 'inhalaciones',
  APLICACIONES: 'aplicaciones',
} as const;
export type UnidadDosis = typeof UnidadDosis[keyof typeof UnidadDosis];

// Interfaces para historia clínica médica completa
export interface AntecedenteMedico {
  tipo: TipoAntecedente;
  descripcion: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  tratamiento?: string;
  estado: 'activo' | 'resuelto' | 'cronico';
  notas?: string;
}

export interface AlergiaMedica {
  sustancia: string;
  tipoReaccion: 'cutanea' | 'respiratoria' | 'anafilaxia' | 'gastrointestinal' | 'otra';
  severidad: 'leve' | 'moderada' | 'grave';
  fechaDiagnostico?: Date;
  tratamiento?: string;
  notas?: string;
}

export interface MedicamentoActual {
  nombre: string;
  principioActivo?: string;
  dosis: string;
  frecuencia: string;
  via: ViaAdministracion;
  fechaInicio: Date;
  fechaFin?: Date;
  indicacion: string;
  prescritoPor?: string;
  notas?: string;
}

export interface SignosVitales {
  id: string;
  pacienteId: string;
  notaSOAPId?: string;
  fecha: Date;
  presionArterialSistolica: number;
  presionArterialDiastolica: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  temperatura: number;
  saturacionOxigeno: number;
  peso: number;
  talla: number;
  imc?: number;
  glucemia?: number;
  otros?: Record<string, any>;
}

export interface ExamenFisicoPorSistema {
  sistema: string;
  normal: boolean;
  hallazgos?: string;
  detalles?: Record<string, any>;
}

export interface ExamenFisicoCompleto {
  id: string;
  pacienteId: string;
  notaSOAPId?: string;
  fecha: Date;
  general?: {
    aspecto: string;
    estadoConciencia: string;
    hidratacion: string;
    nutricion: string;
  };
  cabezaCuello?: {
    cabeza: string;
    ojos: string;
    oidos: string;
    nariz: string;
    boca: string;
    cuello: string;
  };
  torax?: {
    inspeccion: string;
    palpacion: string;
    percusion: string;
    auscultacion: string;
  };
  abdomen?: {
    inspeccion: string;
    palpacion: string;
    percusion: string;
    auscultacion: string;
    organomegalias?: string;
  };
  extremidades?: {
    superiores: string;
    inferiores: string;
    pulsos: string;
    edema?: string;
  };
  neurologico?: {
    estadoMental: string;
    paresCraneales: string;
    fuerzaMuscular: string;
    sensibilidad: string;
    reflejos: string;
    coordinacion: string;
  };
  pielFaneras?: {
    piel: string;
    faneras: string;
    mucosas: string;
  };
  sistemas: ExamenFisicoPorSistema[];
  notas?: string;
}

export interface DiagnosticoCIE10 {
  id: string;
  pacienteId: string;
  notaSOAPId?: string;
  codigo: string;
  descripcion: string;
  tipo: 'principal' | 'secundario' | 'comorbilidad' | 'complicacion';
  certeza: 'confirmado' | 'probable' | 'sospecha' | 'resuelto';
  fechaDiagnostico: Date;
  notas?: string;
}

export interface MedicamentoPrescritoDetallado {
  id: string;
  pacienteId: string;
  notaSOAPId?: string;
  nombre: string;
  principioActivo?: string;
  presentacion: string;
  concentracion: number;
  unidadConcentracion: UnidadDosis;
  dosis: number;
  unidadDosis: UnidadDosis;
  frecuencia: FrecuenciaMedicacion;
  duracionDias: number;
  via: ViaAdministracion;
  indicacionesEspeciales?: string;
  justificacion?: string;
  contraindicaciones?: string[];
  monitorizacion?: string[];
  costoAproximado?: number;
}

export interface EstudioSolicitado {
  id: string;
  pacienteId: string;
  notaSOAPId?: string;
  tipo: 'laboratorio' | 'imagenologia' | 'gabinete' | 'especializado';
  nombre: string;
  codigo?: string;
  indicacion: string;
  urgencia: 'rutina' | 'urgente' | 'emergencia';
  preparacion?: string;
  fechaSolicitud: Date;
  fechaRealizacion?: Date;
  resultados?: string;
  interpretacion?: string;
}

export interface TratamientoCompleto {
  medicamentos: MedicamentoPrescritoDetallado[];
  estudiosSolicitados: EstudioSolicitado[];
  procedimientos?: string[];
  recomendacionesGenerales: string[];
  objetivosTerapeuticos: string[];
  seguimiento: {
    frecuencia: string;
    proximaCita?: Date;
    parametrosMonitorizar: string[];
    criteriosExito: string[];
  };
  educacionPaciente: string[];
}

export interface NotaSOAP {
  id: string;
  pacienteId: string;
  subjetivo: {
    motivoConsulta: string;
    historiaEnfermedadActual: string;
    sintomasAsociados: string[];
    revisionPorSistemas: Record<string, string>;
  };
  objetivo: {
    signosVitales: SignosVitales;
    examenFisico: ExamenFisicoCompleto;
    resultadosEstudios: string[];
  };
  analisis: {
    impresionDiagnostica: string;
    diagnosticoDiferencial: string[];
    justificacion: string;
  };
  plan: TratamientoCompleto;
  fecha: Date;
  profesionalId?: string;
}

export interface HistoriaClinicaMedicaCompleta {
  // Identificador único
  id: string;
  
  // Información básica del paciente
  pacienteId: string;
  
  // Antecedentes estructurados
  antecedentes: {
    personales: AntecedenteMedico[];
    familiares: AntecedenteMedico[];
    alergicos: AlergiaMedica[];
    quirurgicos: AntecedenteMedico[];
    ginecoObstetricos?: {
      menarca?: number;
      ciclos?: string;
      gestas?: number;
      partos?: number;
      abortos?: number;
      cesareas?: number;
      fum?: Date;
      pap?: string;
      mamografia?: string;
    };
    toxicos: {
      tabaco: { activo: boolean; cantidad?: string; anos?: number };
      alcohol: { activo: boolean; cantidad?: string; anos?: number };
      otrasDrogas: { sustancia: string; cantidad?: string; frecuencia?: string }[];
    };
  };
  
  // Medicamentos actuales
  medicamentosActuales: MedicamentoActual[];
  
  // Historial de consultas
  consultas: NotaSOAP[];
  
  // Diagnósticos activos
  diagnosticosActivos: DiagnosticoCIE10[];
  
  // Estudios y resultados
  estudios: {
    laboratorio: EstudioSolicitado[];
    imagenologia: EstudioSolicitado[];
    otros: EstudioSolicitado[];
  };
  
  // Seguimiento de condiciones crónicas
  condicionesCronicas: {
    diagnostico: DiagnosticoCIE10;
    inicio: Date;
    ultimaEvaluacion: Date;
    control: 'optimo' | 'suboptimo' | 'descontrolado';
    complicaciones: string[];
    tratamientoActual: string;
  }[];
  
  // Inmunizaciones
  inmunizaciones: {
    vacuna: string;
    fecha: Date;
    lote?: string;
    lugar?: string;
    proximaDosis?: Date;
  }[];
  
  metadata: {
    fechaCreacion: Date;
    fechaActualizacion: Date;
    profesionalResponsable?: string;
    version: number;
  };
}

// Interface original mantenida para compatibilidad
export interface DatosMedicinaGeneral {
  // Signos vitales
  signosVitales?: {
    presionArterial: string; // "120/80"
    frecuenciaCardiaca: number; // bpm
    frecuenciaRespiratoria: number; // rpm
    temperatura: number; // °C
    saturacionOxigeno: number; // %
    peso: number; // kg
    talla: number; // cm
    imc?: number; // calculado
  };
  
  // Antecedentes
  antecedentesPersonales?: {
    patologicos: string[];
    quirurgicos: string[];
    alergicos: string[];
    toxicos: string[];
    ginecologicos?: string[]; // para mujeres
  };
  
  // Exploración física
  exploracionFisica?: {
    cabezaCuello: string;
    torax: string;
    abdomen: string;
    extremidades: string;
    neurologico: string;
  };
  
  // Diagnóstico y tratamiento
  diagnostico: string[];
  cie10?: string[]; // Códigos CIE-10
  tratamiento: {
    medicamentos: MedicamentoPrescrito[];
    indicaciones: string[];
    estudiosSolicitados: string[];
    interconsultas: string[];
  };
  
  // Seguimiento
  proximaCita?: Date;
  recomendaciones: string[];
}

export interface MedicamentoPrescrito {
  nombre: string;
  presentacion: string; // "tabletas", "jarabe", etc.
  dosis: string; // "500mg"
  frecuencia: string; // "cada 8 horas"
  duracion: string; // "7 días"
  via: string; // "oral", "intramuscular", etc.
  indicacionesEspeciales?: string;
}

// ----------------------------------------------------------------------------
// ODONTOLOGÍA - Interfaces específicas
// ----------------------------------------------------------------------------

export interface DatosOdontologia {
  // Información básica
  motivoConsulta?: string;
  historiaEnfermedadActual?: string;
  
  // Antecedentes odontológicos
  antecedentesOdontologicos?: {
    tratamientosPrevios: string[];
    traumatismos: string[];
    habitos: string[];
    protesis: string[];
  };
  
  // Odontograma
  odontograma?: {
    piezas: PiezaDental[];
    notas: string;
  };
  
  // Diagnóstico odontológico
  diagnostico: {
    caries: string[];
    enfermedadPeriodontal: string[];
    maloclusion: string[];
    otros: string[];
  };
  
  // Tratamiento planificado
  tratamientoPlanificado: ProcedimientoOdontologico[];
  
  // Procedimientos realizados
  procedimientosRealizados: ProcedimientoRealizado[];
  
  // Materiales utilizados
  materialesUtilizados: MaterialOdontologico[];
  
  // Radiografías
  radiografias?: {
    tipo: string; // "periapical", "panorámica", etc.
    fecha: Date;
    notas?: string;
  }[];
  
  // Higiene y prevención
  indicePlaca?: number; // 0-3
  indiceSangrado?: number; // 0-3
  instruccionesHigiene: string[];
}

export interface PiezaDental {
  numero: number; // 1-32
  estado: 'sano' | 'cariado' | 'obturado' | 'ausente' | 'protesis' | 'corona' | 'endodoncia' | 'sellante' | 'movilidad' | 'fractura' | 'raices' | 'impactado' | 'erupcion';
  tratamientos: string[]; // ["obturacion", "endodoncia", etc.]
  movilidad?: number; // 1-3
  notas?: string;
}

export interface ProcedimientoOdontologico {
  codigo: string; // Código de procedimiento
  descripcion: string;
  piezas: number[]; // Números de piezas afectadas
  costo: number;
  duracion: number; // minutos
  prioridad: 'alta' | 'media' | 'baja';
}

export interface ProcedimientoRealizado {
  procedimiento: ProcedimientoOdontologico;
  fecha: Date;
  profesionalId?: string;
  notas?: string;
  materialesUtilizados: MaterialOdontologico[];
}

export interface MaterialOdontologico {
  nombre: string;
  descripcion?: string;
  cantidad: number;
  unidad: string; // "unidad", "ml", "g", etc.
  costo?: number;
  categoria?: string;
  subcategoria?: string;
  proveedor?: string;
  codigoProveedor?: string;
  unidadMedida?: string;
  costoUnitario?: number;
  temperaturaAlmacenamiento?: string;
  fechaCaducidad?: string;
  lote?: string;
}

// ----------------------------------------------------------------------------
// RESPALDOS
// ----------------------------------------------------------------------------

export interface RespaldoCompleto {
  version: string;
  fechaRespaldo: Date;
  configuracion: Configuracion;
  pacientes: Paciente[];
  sesiones: Sesion[];
  citas: Cita[];
  documentos: Omit<Documento, 'pdfBlob'>[]; // No incluir blobs pesados
  servicios: Servicio[];
  cotizaciones: Cotizacion[];
  recibos: Recibo[];
  biblioteca: ContenidoBiblioteca[];
  usuarios?: Usuario[];
}

// ----------------------------------------------------------------------------
// UI Y UTILIDADES
// ----------------------------------------------------------------------------

export interface ModoPaciente {
  modo: 'revision' | 'ejecucion';
}

export interface FiltrosPacientes {
  busqueda?: string;
  activo?: boolean;
  ordenarPor?: 'nombre' | 'fechaCreacion' | 'ultimaConsulta';
  ordenDireccion?: 'asc' | 'desc';
}

export interface VistaAgenda {
  tipo: 'dia' | 'semana' | 'mes';
  fecha: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES PARA MÓDULOS DE PROFESIÓN
// ----------------------------------------------------------------------------

/**
 * Interfaz que todos los módulos de profesión deben exportar
 * Define la estructura común para el sistema de lazy loading
 */
export interface ProfessionModule {
  CamposEspecificos: React.ComponentType<any>;
  DocumentosEspecificos: Record<string, React.ComponentType<any>>;
  BibliotecaEspecifica?: React.ComponentType<any>;
  hooks?: Record<string, Function>;
}
