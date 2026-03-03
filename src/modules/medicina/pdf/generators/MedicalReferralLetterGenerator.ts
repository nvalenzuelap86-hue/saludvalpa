// ============================================================================
// Generador de cartas de derivación médica en PDF
// ============================================================================

import jsPDF from 'jspdf';
import type { 
  Paciente, 
  Configuracion, 
  DatosCartaDerivacion,
  PDFGenerationOptions,
  PDFGenerationResult,
  TipoDocumentoMedico 
} from '../types';
import { BasePDFGenerator } from './BasePDFGenerator';
import { TipoDocumentoMedico as TDM } from '../types';

/**
 * Generador de cartas de derivación médica
 */
export class MedicalReferralLetterGenerator extends BasePDFGenerator<DatosCartaDerivacion> {
  constructor() {
    super(TDM.CARTA_DERIVACION, '1.0');
  }

  /**
   * Genera una carta de derivación médica en PDF
   */
  async generate(
    paciente: Paciente,
    datos: DatosCartaDerivacion,
    config: Configuracion,
    options?: PDFGenerationOptions
  ): Promise<Blob> {
    const startTime = Date.now();
    
    try {
      // Validar datos antes de generar
      const validation = this.validateData(datos);
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Crear documento PDF
      const pdf = this.createPDFDocument(options);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const marginLeft = 20;
      let currentY = this.addDocumentHeader(pdf, config, 'CARTA DE DERIVACIÓN MÉDICA');

      // Agregar información del paciente
      currentY = this.addPatientInformation(pdf, paciente, marginLeft, currentY);
      currentY += 10;

      // Agregar información del especialista destino
      currentY = this.addSpecialistInformation(pdf, datos.especialistaDestino, marginLeft, currentY);
      currentY += 15;

      // Agregar motivo de referencia
      currentY = this.addReferralReason(pdf, datos.motivoReferencia, marginLeft, currentY);
      currentY += 10;

      // Agregar resumen clínico
      currentY = this.addClinicalSummary(pdf, datos.resumenClinico, marginLeft, currentY);
      currentY += 10;

      // Agregar estudios realizados
      if (datos.estudiosRealizados && datos.estudiosRealizados.length > 0) {
        currentY = this.addPerformedStudies(pdf, datos.estudiosRealizados, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar estudios solicitados
      if (datos.estudiosSolicitados && datos.estudiosSolicitados.length > 0) {
        currentY = this.addRequestedStudies(pdf, datos.estudiosSolicitados, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar nivel de urgencia
      currentY = this.addUrgencyLevel(pdf, datos.urgencia, marginLeft, currentY);
      currentY += 10;

      // Agregar notas adicionales si existen
      if (datos.notasAdicionales) {
        currentY = this.addAdditionalNotes(pdf, datos.notasAdicionales, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar firma y sello
      currentY = this.addSignatureAndSeal(pdf, config, marginLeft, currentY);

      // Agregar pie de página
      this.addDocumentFooter(pdf, config, pageWidth - 20);

      // Generar blob del PDF
      const pdfBlob = pdf.output('blob');
      const endTime = Date.now();
      const generationTime = endTime - startTime;

      console.log(`✅ Carta de derivación generada en ${generationTime}ms`);

      return pdfBlob;

    } catch (error) {
      console.error('❌ Error generando carta de derivación:', error);
      throw error;
    }
  }

  /**
   * Valida los datos de la carta de derivación
   */
  validateData(datos: DatosCartaDerivacion): import('../types').ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validaciones requeridas
    if (!datos.especialistaDestino?.nombre) {
      errors.push('Nombre del especialista destino es requerido');
    }

    if (!datos.especialistaDestino?.especialidad) {
      errors.push('Especialidad del especialista destino es requerida');
    }

    if (!datos.motivoReferencia) {
      errors.push('Motivo de referencia es requerido');
    }

    if (!datos.resumenClinico || datos.resumenClinico.length === 0) {
      errors.push('Resumen clínico es requerido');
    }

    if (!datos.urgencia) {
      errors.push('Nivel de urgencia es requerido');
    }

    // Validaciones de advertencia
    if (!datos.especialistaDestino?.institucion) {
      warnings.push('Institución del especialista no especificada');
    }

    if (!datos.especialistaDestino?.direccion) {
      warnings.push('Dirección del especialista no especificada');
    }

    if (datos.estudiosRealizados && datos.estudiosRealizados.length === 0) {
      warnings.push('No se especificaron estudios realizados');
    }

    if (datos.estudiosSolicitados && datos.estudiosSolicitados.length === 0) {
      warnings.push('No se especificaron estudios solicitados');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validación específica para carta de derivación
   */
  protected performSpecificValidation(
    datos: DatosCartaDerivacion,
    errors: string[],
    warnings: string[]
  ): void {
    // Validar especialista destino
    if (!datos.especialistaDestino?.nombre) {
      errors.push('Nombre del especialista destino es requerido');
    }

    if (!datos.especialistaDestino?.especialidad) {
      errors.push('Especialidad del especialista destino es requerida');
    }

    // Validar motivo de referencia
    if (!datos.motivoReferencia) {
      errors.push('Motivo de referencia es requerido');
    } else if (datos.motivoReferencia.length < 10) {
      warnings.push('El motivo de referencia parece muy breve');
    }

    // Validar resumen clínico
    if (!datos.resumenClinico || datos.resumenClinico.length === 0) {
      errors.push('Resumen clínico es requerido');
    } else if (datos.resumenClinico.length < 2) {
      warnings.push('El resumen clínico podría ser más detallado');
    }

    // Validar nivel de urgencia
    if (!datos.urgencia) {
      errors.push('Nivel de urgencia es requerido');
    } else if (!['rutina', 'moderada', 'urgente'].includes(datos.urgencia)) {
      errors.push('Nivel de urgencia no válido');
    }

    // Validar estudios realizados
    if (datos.estudiosRealizados && datos.estudiosRealizados.length > 10) {
      warnings.push('Muchos estudios realizados, considerar resumir');
    }

    // Validar estudios solicitados
    if (datos.estudiosSolicitados && datos.estudiosSolicitados.length > 10) {
      warnings.push('Muchos estudios solicitados, considerar priorizar');
    }
  }

  /**
   * Agrega información del especialista destino
   */
  private addSpecialistInformation(
    pdf: jsPDF,
    especialista: DatosCartaDerivacion['especialistaDestino'],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('PARA:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Nombre y especialidad
    pdf.text(`Dr./Dra. ${especialista.nombre}`, x, currentY);
    currentY += 6;
    
    pdf.text(`Especialidad: ${especialista.especialidad}`, x, currentY);
    currentY += 6;

    // Institución
    if (especialista.institucion) {
      pdf.text(`Institución: ${especialista.institucion}`, x, currentY);
      currentY += 6;
    }

    // Dirección
    if (especialista.direccion) {
      pdf.text(`Dirección: ${especialista.direccion}`, x, currentY);
      currentY += 6;
    }

    // Contacto
    const contactInfo = [];
    if (especialista.telefono) contactInfo.push(`Tel: ${especialista.telefono}`);
    if (especialista.email) contactInfo.push(`Email: ${especialista.email}`);
    
    if (contactInfo.length > 0) {
      pdf.text(`Contacto: ${contactInfo.join(' | ')}`, x, currentY);
      currentY += 6;
    }

    return currentY;
  }

  /**
   * Agrega motivo de referencia
   */
  private addReferralReason(
    pdf: jsPDF,
    motivo: string,
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('MOTIVO DE REFERENCIA:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const wrappedText = this.wrapText(pdf, motivo, 170);
    wrappedText.forEach(line => {
      pdf.text(line, x, currentY);
      currentY += 6;
    });

    return currentY;
  }

  /**
   * Agrega resumen clínico
   */
  private addClinicalSummary(
    pdf: jsPDF,
    resumen: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('RESUMEN CLÍNICO:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    resumen.forEach(item => {
      const wrappedText = this.wrapText(pdf, `• ${item}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega estudios realizados
   */
  private addPerformedStudies(
    pdf: jsPDF,
    estudios: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('ESTUDIOS REALIZADOS:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    estudios.forEach(estudio => {
      const wrappedText = this.wrapText(pdf, `✓ ${estudio}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega estudios solicitados
   */
  private addRequestedStudies(
    pdf: jsPDF,
    estudios: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('ESTUDIOS SOLICITADOS:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    estudios.forEach(estudio => {
      const wrappedText = this.wrapText(pdf, `→ ${estudio}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega nivel de urgencia
   */
  private addUrgencyLevel(
    pdf: jsPDF,
    urgencia: DatosCartaDerivacion['urgencia'],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('NIVEL DE URGENCIA:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    let urgencyText = '';
    let urgencyColor = [0, 0, 0];
    
    switch (urgencia) {
      case 'rutina':
        urgencyText = 'RUTINA - Evaluación en consulta programada';
        urgencyColor = [0, 100, 0]; // Verde
        break;
      case 'moderada':
        urgencyText = 'MODERADA - Evaluación en las próximas 2-4 semanas';
        urgencyColor = [255, 165, 0]; // Naranja
        break;
      case 'urgente':
        urgencyText = 'URGENTE - Evaluación inmediata o en las próximas 48 horas';
        urgencyColor = [255, 0, 0]; // Rojo
        break;
    }

    pdf.setTextColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
    pdf.setFont('helvetica', 'bold');
    
    const wrappedText = this.wrapText(pdf, urgencyText, 170);
    wrappedText.forEach(line => {
      pdf.text(line, x, currentY);
      currentY += 6;
    });

    // Reset color
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    return currentY;
  }

  /**
   * Agrega notas adicionales
   */
  private addAdditionalNotes(
    pdf: jsPDF,
    notas: string,
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('NOTAS ADICIONALES:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const wrappedText = this.wrapText(pdf, notas, 170);
    wrappedText.forEach(line => {
      pdf.text(line, x, currentY);
      currentY += 6;
    });

    return currentY;
  }

  /**
   * Agrega firma y sello
   */
  private addSignatureAndSeal(
    pdf: jsPDF,
    config: Configuracion,
    x: number,
    y: number
  ): number {
    let currentY = y + 20;

    // Línea para firma
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(x, currentY, x + 100, currentY);
    currentY += 5;

    // Nombre del médico/profesional
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    const nombreProfesional = config.branding?.nombreProfesional || 'Médico Tratante';
    const titulo = config.profesion === 'medicina_general' ? 'Dr./Dra.' : 'Profesional';
    pdf.text(`${titulo} ${nombreProfesional}`, x, currentY);
    currentY += 6;

    // Especialidad y credenciales
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const medicoInfo = [];
    if (config.branding?.especialidad) {
      medicoInfo.push(config.branding.especialidad);
    }
    if (config.branding?.credenciales) {
      medicoInfo.push(config.branding.credenciales);
    }
    
    if (medicoInfo.length > 0) {
      pdf.text(medicoInfo.join(' | '), x, currentY);
      currentY += 6;
    }

    // Clínica o institución
    const nombreClinica = config.branding?.nombreClinica || 'Clínica';
    pdf.text(nombreClinica, x, currentY);
    currentY += 6;

    // Contacto si está disponible
    if (config.datosContacto?.telefono || config.datosContacto?.email) {
      const contactoInfo = [];
      if (config.datosContacto.telefono) contactoInfo.push(`Tel: ${config.datosContacto.telefono}`);
      if (config.datosContacto.email) contactoInfo.push(`Email: ${config.datosContacto.email}`);
      
      if (contactoInfo.length > 0) {
        pdf.text(contactoInfo.join(' | '), x, currentY);
        currentY += 6;
      }
    }

    // Fecha
    const fecha = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    pdf.text(`Fecha: ${fecha}`, x, currentY);
    currentY += 6;

    return currentY;
  }

  /**
   * Formatea la información de urgencia para mostrar
   */
  formatUrgencyText(urgencia: DatosCartaDerivacion['urgencia']): string {
    switch (urgencia) {
      case 'rutina':
        return 'Rutina (evaluación programada)';
      case 'moderada':
        return 'Moderada (evaluación en 2-4 semanas)';
      case 'urgente':
        return 'Urgente (evaluación inmediata)';
      default:
        return 'No especificado';
    }
  }

  /**
   * Verifica si la carta requiere estudios adicionales
   */
  requiresAdditionalStudies(datos: DatosCartaDerivacion): boolean {
    return datos.estudiosSolicitados && datos.estudiosSolicitados.length > 0;
  }

  /**
   * Obtiene el nivel de urgencia como texto descriptivo
   */
  getUrgencyDescription(urgencia: DatosCartaDerivacion['urgencia']): string {
    switch (urgencia) {
      case 'rutina':
        return 'El paciente puede ser evaluado en consulta programada regular. No requiere atención inmediata.';
      case 'moderada':
        return 'El paciente requiere evaluación en las próximas 2-4 semanas. Condición estable pero requiere seguimiento especializado.';
      case 'urgente':
        return 'El paciente requiere evaluación inmediata o en las próximas 48 horas. Condición que puede deteriorarse rápidamente.';
      default:
        return 'Nivel de urgencia no especificado.';
    }
  }
}

// Exportar una instancia por defecto para uso conveniente
export const medicalReferralLetterGenerator = new MedicalReferralLetterGenerator();

// Exportar también la clase para uso avanzado