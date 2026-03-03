// ============================================================================
// Tipos e interfaces para generación de PDF en módulo de medicina
// ============================================================================

import type { Paciente, Configuracion, DatosMedicinaGeneral } from '../../../types';
import type jsPDF from 'jspdf';

/**
 * Tipos de documentos médicos específicos para medicina
 */
export const TipoDocumentoMedico = {
  RECETA_MEDICA: 'RECETA_MEDICA',
  CARTA_DERIVACION: 'CARTA_DERIVACION',
  CERTIFICADO_MEDICO: 'CERTIFICADO_MEDICO',
  ORDEN_LABORATORIO: 'ORDEN_LABORATORIO',
  NOTA_SOAP: 'NOTA_SOAP',
  HISTORIA_CLINICA_MEDICA: 'HISTORIA_CLINICA_MEDICA',
} as const;

export type TipoDocumentoMedico = typeof TipoDocumentoMedico[keyof typeof TipoDocumentoMedico];

/**
 * Datos específicos para receta médica
 */
export interface DatosRecetaMedica {
  fechaReceta: string;
  diagnostico: string[];
  medicamentos: Array<{
    nombre: string;
    presentacion: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    via: string;
    indicacionesEspeciales?: string;
  }>;
  indicacionesGenerales: string[];
  proximaCita?: string;
  recomendaciones: string[];
  verificacionCDSS?: {
    interaccionesDetectadas: boolean;
    alertas: string[];
    recomendaciones: string[];
  };
}

/**
 * Datos para carta de derivación
 */
export interface DatosCartaDerivacion {
  especialistaDestino: {
    nombre: string;
    especialidad: string;
    institucion: string;
    direccion: string;
    telefono?: string;
    email?: string;
  };
  motivoReferencia: string;
  resumenClinico: string[];
  estudiosRealizados: string[];
  estudiosSolicitados: string[];
  urgencia: 'rutina' | 'moderada' | 'urgente';
  notasAdicionales?: string;
}

/**
 * Datos para certificado médico
 */
export interface DatosCertificadoMedico {
  tipoCertificado: 'incapacidad' | 'aptitud' | 'salud' | 'vacunacion' | 'enfermedad';
  diagnostico: string[];
  periodoIncapacidad?: {
    inicio: string;
    fin: string;
    dias: number;
  };
  recomendaciones: string[];
  fechaReincorporacion?: string;
  restricciones?: string[];
  notasLegales?: string;
}

/**
 * Datos para orden de laboratorio
 */
export interface DatosOrdenLaboratorio {
  laboratorioDestino: {
    nombre: string;
    direccion: string;
    telefono?: string;
    horario?: string;
  };
  estudios: Array<{
    categoria: string;
    items: string[];
    preparacion?: string;
  }>;
  preparacionEspecial: string[];
  justificacionClinica: string;
  urgencia: 'rutina' | 'urgente';
  fechaValidez: string;
}

/**
 * Datos para nota SOAP
 */
export interface DatosNotaSOAP {
  subjetivo: string[];
  objetivo: {
    signosVitales: {
      presionArterial: string;
      frecuenciaCardiaca: number;
      frecuenciaRespiratoria: number;
      temperatura: number;
      saturacionOxigeno: number;
    };
    examenFisico: string[];
    peso: number;
    talla: number;
    imc: number;
  };
  analisis: {
    diagnosticos: string[];
    evaluacion: string[];
    riesgo: 'bajo' | 'moderado' | 'alto';
  };
  plan: {
    tratamientoFarmacologico: string[];
    tratamientoNoFarmacologico: string[];
    estudiosSolicitados: string[];
    proximaCita: string;
    seguimiento: string[];
  };
}

/**
 * Interfaz base para todos los generadores de PDF
 */
export interface PDFGenerator<T> {
  generate(
    paciente: Paciente,
    datos: T,
    config: Configuracion,
    options?: PDFGenerationOptions
  ): Promise<Blob>;
  
  validateData(datos: T): ValidationResult;
  
  getTemplateVersion(): string;
}

/**
 * Opciones para generación de PDF
 */
export interface PDFGenerationOptions {
  includeWatermark?: boolean;
  includeQRCode?: boolean;
  language?: 'es' | 'en';
  paperSize?: 'A4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Configuración de estilos para PDF
 */
export interface PDFStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    gray: string;
    success: string;
    warning: string;
    danger: string;
  };
  fonts: {
    normal: string;
    bold: string;
    italic: string;
  };
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  lineHeight: number;
  fontSize: {
    title: number;
    subtitle: number;
    normal: number;
    small: number;
  };
}

/**
 * Información de encabezado para documentos médicos
 */
export interface DocumentHeaderInfo {
  clinicName: string;
  doctorName: string;
  professionalId: string;
  specialty: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
}

/**
 * Resultado de generación de PDF
 */
export interface PDFGenerationResult {
  success: boolean;
  blob?: Blob;
  fileName: string;
  fileSize: number;
  generationTime: number;
  errors?: string[];
  metadata: {
    documentType: TipoDocumentoMedico;
    patientId: string;
    generationDate: Date;
    templateVersion: string;
    checksum: string;
  };
}

/**
 * Utilidades para manejo de PDF
 */
export interface PDFUtils {
  addHeader(pdf: jsPDF, headerInfo: DocumentHeaderInfo, title: string): number;
  addFooter(pdf: jsPDF, config: Configuracion, pageNumber: number): void;
  addWatermark(pdf: jsPDF, text: string, isFreeVersion: boolean): void;
  addQRCode(pdf: jsPDF, data: string, x: number, y: number, size: number): void;
  addSignatureArea(pdf: jsPDF, x: number, y: number, width: number): void;
  addPatientInfo(pdf: jsPDF, paciente: Paciente, x: number, y: number): number;
  wrapText(pdf: jsPDF, text: string, maxWidth: number): string[];
  formatDate(date: Date | string): string;
  formatCurrency(amount: number): string;
}

/**
 * Plantilla base para documentos médicos
 */
export interface MedicalDocumentTemplate {
  id: string;
  name: string;
  documentType: TipoDocumentoMedico;
  version: string;
  description: string;
  requiredFields: string[];
  defaultValues: Record<string, any>;
  layout: {
    sections: Array<{
      id: string;
      title: string;
      required: boolean;
      order: number;
    }>;
  };
}

/**
 * Configuración del sistema de generación de PDF
 */
export interface PDFSystemConfig {
  defaultPaperSize: 'A4' | 'letter';
  defaultOrientation: 'portrait' | 'landscape';
  defaultLanguage: 'es' | 'en';
  quality: 'low' | 'medium' | 'high';
  compression: boolean;
  encryption: {
    enabled: boolean;
    password?: string;
  };
  storage: {
    saveToDatabase: boolean;
    saveToFileSystem: boolean;
    backupEnabled: boolean;
  };
}

// Constantes para estilos de PDF
export const PDF_STYLES: PDFStyleConfig = {
  colors: {
    primary: '#3498db',    // Azul SaludValpa
    secondary: '#2ecc71',  // Verde
    accent: '#e74c3c',     // Rojo
    text: '#2c3e50',       // Texto oscuro
    gray: '#7f8c8d',       // Gris
    success: '#27ae60',    // Verde éxito
    warning: '#f39c12',    // Naranja advertencia
    danger: '#c0392b',     // Rojo peligro
  },
  fonts: {
    normal: 'helvetica',
    bold: 'helvetica',
    italic: 'helvetica',
  },
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  lineHeight: 1.5,
  fontSize: {
    title: 16,
    subtitle: 12,
    normal: 10,
    small: 8,
  },
};

// Constantes para márgenes
export const PDF_MARGINS = {
  TOP: 20,
  RIGHT: 20,
  BOTTOM: 20,
  LEFT: 20,
  LINE_HEIGHT: 5,
  SECTION_SPACING: 10,
};

// Tipos de papel soportados
export type PaperSize = 'A4' | 'letter' | 'legal' | 'A5';

// Orientaciones soportadas
export type Orientation = 'portrait' | 'landscape';

// Exportar todos los tipos
export type {
  Paciente,
  Configuracion,
  DatosMedicinaGeneral,
};