// ============================================================================
// saludvalpa 3.0 - MÓDULO DE MEDICINA GENERAL
// Exporta todos los generadores de PDF para documentos médicos
// ============================================================================

// Exportar tipos e interfaces
export type {
  TipoDocumentoMedico,
  DatosRecetaMedica,
  DatosCartaDerivacion,
  DatosCertificadoMedico,
  DatosOrdenLaboratorio,
  DatosNotaSOAP,
  PDFGenerator,
  PDFGenerationOptions,
  PDFGenerationResult,
  ValidationResult,
  PDFStyleConfig,
  DocumentHeaderInfo
} from './types';

// Exportar utilidades
export { PDFMedicalUtils } from './utils';

// Exportar generadores base
export { BasePDFGenerator } from './generators/BasePDFGenerator';

// Exportar generadores específicos
export { 
  medicalPrescriptionGenerator,
  MedicalPrescriptionGenerator 
} from './generators/MedicalPrescriptionGenerator';

export { 
  medicalReferralLetterGenerator,
  MedicalReferralLetterGenerator 
} from './generators/MedicalReferralLetterGenerator';

export { 
  medicalCertificateGenerator,
  MedicalCertificateGenerator 
} from './generators/MedicalCertificateGenerator';

// Re-exportar constantes de tipos de documentos
export { TipoDocumentoMedico as TDM } from './types';

/**
 * Utilidad para obtener el generador apropiado según el tipo de documento
 */
export function getPDFGenerator(tipoDocumento: TipoDocumentoMedico) {
  switch (tipoDocumento) {
    case 'RECETA_MEDICA':
      return medicalPrescriptionGenerator;
    case 'CARTA_DERIVACION':
      return medicalReferralLetterGenerator;
    case 'CERTIFICADO_MEDICO':
      return medicalCertificateGenerator;
    case 'ORDEN_LABORATORIO':
      // TODO: Implementar cuando esté disponible
      throw new Error('Generador para orden de laboratorio no implementado aún');
    case 'NOTA_SOAP':
      // TODO: Implementar cuando esté disponible
      throw new Error('Generador para nota SOAP no implementado aún');
    case 'HISTORIA_CLINICA_MEDICA':
      // TODO: Implementar cuando esté disponible
      throw new Error('Generador para historia clínica médica no implementado aún');
    default:
      throw new Error(`Tipo de documento no soportado: ${tipoDocumento}`);
  }
}

/**
 * Utilidad para validar datos antes de generar PDF
 */
export function validateDocumentData<T>(
  tipoDocumento: TipoDocumentoMedico,
  datos: T
): ValidationResult {
  const generator = getPDFGenerator(tipoDocumento);
  // Nota: Necesitamos hacer un cast ya que el tipo T puede no coincidir exactamente
  return (generator as any).validateData(datos);
}

/**
 * Utilidad para generar cualquier documento médico
 */
export async function generarDocumentoMedico<T>(
  tipoDocumento: TipoDocumentoMedico,
  paciente: any,
  datos: T,
  config: any,
  options?: any
): Promise<Blob> {
  const generator = getPDFGenerator(tipoDocumento);
  return await generator.generate(paciente, datos, config, options);
}

/**
 * Mapa de nombres de documentos para mostrar en la interfaz
 */
export const NOMBRES_DOCUMENTOS: Record<TipoDocumentoMedico, string> = {
  RECETA_MEDICA: 'Receta Médica',
  CARTA_DERIVACION: 'Carta de Derivación',
  CERTIFICADO_MEDICO: 'Certificado Médico',
  ORDEN_LABORATORIO: 'Orden de Laboratorio',
  NOTA_SOAP: 'Nota SOAP',
  HISTORIA_CLINICA_MEDICA: 'Historia Clínica Médica'
};

/**
 * Descripciones de documentos para mostrar en la interfaz
 */
export const DESCRIPCIONES_DOCUMENTOS: Record<TipoDocumentoMedico, string> = {
  RECETA_MEDICA: 'Prescripción de medicamentos con dosis, frecuencia y duración del tratamiento',
  CARTA_DERIVACION: 'Referencia a especialista con resumen clínico y nivel de urgencia',
  CERTIFICADO_MEDICO: 'Documento oficial que certifica estado de salud, incapacidad o aptitud',
  ORDEN_LABORATORIO: 'Solicitud de estudios de laboratorio e imagenología',
  NOTA_SOAP: 'Nota de evolución médica estructurada (Subjetivo, Objetivo, Evaluación, Plan)',
  HISTORIA_CLINICA_MEDICA: 'Registro completo de la historia clínica del paciente'
};

/**
 * Iconos sugeridos para cada tipo de documento
 */
export const ICONOS_DOCUMENTOS: Record<TipoDocumentoMedico, string> = {
  RECETA_MEDICA: '💊',
  CARTA_DERIVACION: '📨',
  CERTIFICADO_MEDICO: '📄',
  ORDEN_LABORATORIO: '🧪',
  NOTA_SOAP: '📝',
  HISTORIA_CLINICA_MEDICA: '🏥'
};