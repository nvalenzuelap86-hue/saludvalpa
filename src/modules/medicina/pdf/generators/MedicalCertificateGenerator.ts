// ============================================================================
// Generador de certificados médicos en PDF
// ============================================================================

import jsPDF from 'jspdf';
import type { 
  Paciente, 
  Configuracion, 
  DatosCertificadoMedico,
  PDFGenerationOptions,
  PDFGenerationResult,
  TipoDocumentoMedico 
} from '../types';
import { BasePDFGenerator } from './BasePDFGenerator';
import { TipoDocumentoMedico as TDM } from '../types';

/**
 * Generador de certificados médicos
 */
export class MedicalCertificateGenerator extends BasePDFGenerator<DatosCertificadoMedico> {
  constructor() {
    super(TDM.CERTIFICADO_MEDICO, '1.0');
  }

  /**
   * Genera un certificado médico en PDF
   */
  async generate(
    paciente: Paciente,
    datos: DatosCertificadoMedico,
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
      
      // Determinar título según tipo de certificado
      const tituloCertificado = this.getCertificateTitle(datos.tipoCertificado);
      let currentY = this.addDocumentHeader(pdf, config, tituloCertificado);

      // Agregar información del paciente
      currentY = this.addPatientInformation(pdf, paciente, marginLeft, currentY);
      currentY += 10;

      // Agregar tipo de certificado
      currentY = this.addCertificateType(pdf, datos.tipoCertificado, marginLeft, currentY);
      currentY += 10;

      // Agregar diagnóstico
      currentY = this.addDiagnosis(pdf, datos.diagnostico, marginLeft, currentY);
      currentY += 10;

      // Agregar período de incapacidad si aplica
      if (datos.periodoIncapacidad) {
        currentY = this.addIncapacityPeriod(pdf, datos.periodoIncapacidad, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar fecha de reincorporación si aplica
      if (datos.fechaReincorporacion) {
        currentY = this.addReturnDate(pdf, datos.fechaReincorporacion, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar recomendaciones
      if (datos.recomendaciones && datos.recomendaciones.length > 0) {
        currentY = this.addRecommendations(pdf, datos.recomendaciones, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar restricciones si aplican
      if (datos.restricciones && datos.restricciones.length > 0) {
        currentY = this.addRestrictions(pdf, datos.restricciones, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar notas legales si existen
      if (datos.notasLegales) {
        currentY = this.addLegalNotes(pdf, datos.notasLegales, marginLeft, currentY);
        currentY += 10;
      }

      // Agregar declaración médica
      currentY = this.addMedicalDeclaration(pdf, datos.tipoCertificado, marginLeft, currentY);
      currentY += 15;

      // Agregar firma y sello
      currentY = this.addSignatureAndSeal(pdf, config, marginLeft, currentY);

      // Agregar pie de página
      this.addDocumentFooter(pdf, config, pageWidth - 20);

      // Generar blob del PDF
      const pdfBlob = pdf.output('blob');
      const endTime = Date.now();
      const generationTime = endTime - startTime;

      console.log(`✅ Certificado médico generado en ${generationTime}ms`);

      return pdfBlob;

    } catch (error) {
      console.error('❌ Error generando certificado médico:', error);
      throw error;
    }
  }

  /**
   * Validación específica para certificado médico
   */
  protected performSpecificValidation(
    datos: DatosCertificadoMedico,
    errors: string[],
    warnings: string[]
  ): void {
    // Validar tipo de certificado
    if (!datos.tipoCertificado) {
      errors.push('Tipo de certificado es requerido');
    } else if (!['incapacidad', 'aptitud', 'salud', 'vacunacion', 'enfermedad'].includes(datos.tipoCertificado)) {
      errors.push('Tipo de certificado no válido');
    }

    // Validar diagnóstico
    if (!datos.diagnostico || datos.diagnostico.length === 0) {
      errors.push('Diagnóstico es requerido');
    }

    // Validar período de incapacidad para certificados de incapacidad
    if (datos.tipoCertificado === 'incapacidad') {
      if (!datos.periodoIncapacidad) {
        errors.push('Período de incapacidad es requerido para certificados de incapacidad');
      } else {
        if (!datos.periodoIncapacidad.inicio) {
          errors.push('Fecha de inicio de incapacidad es requerida');
        }
        if (!datos.periodoIncapacidad.fin) {
          errors.push('Fecha de fin de incapacidad es requerida');
        }
        if (!datos.periodoIncapacidad.dias || datos.periodoIncapacidad.dias <= 0) {
          errors.push('Número de días de incapacidad debe ser mayor a 0');
        }
      }
    }

    // Validar fecha de reincorporación para certificados de aptitud
    if (datos.tipoCertificado === 'aptitud' && !datos.fechaReincorporacion) {
      warnings.push('Fecha de reincorporación no especificada para certificado de aptitud');
    }

    // Validar recomendaciones
    if (!datos.recomendaciones || datos.recomendaciones.length === 0) {
      warnings.push('No se especificaron recomendaciones');
    }

    // Validar restricciones para certificados de aptitud
    if (datos.tipoCertificado === 'aptitud' && (!datos.restricciones || datos.restricciones.length === 0)) {
      warnings.push('No se especificaron restricciones para certificado de aptitud');
    }
  }

  /**
   * Obtiene el título del certificado según el tipo
   */
  private getCertificateTitle(tipo: DatosCertificadoMedico['tipoCertificado']): string {
    switch (tipo) {
      case 'incapacidad':
        return 'CERTIFICADO MÉDICO DE INCAPACIDAD';
      case 'aptitud':
        return 'CERTIFICADO MÉDICO DE APTITUD';
      case 'salud':
        return 'CERTIFICADO MÉDICO DE SALUD';
      case 'vacunacion':
        return 'CERTIFICADO DE VACUNACIÓN';
      case 'enfermedad':
        return 'CERTIFICADO MÉDICO DE ENFERMEDAD';
      default:
        return 'CERTIFICADO MÉDICO';
    }
  }

  /**
   * Agrega tipo de certificado
   */
  private addCertificateType(
    pdf: jsPDF,
    tipo: DatosCertificadoMedico['tipoCertificado'],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const tipoTexto = this.getCertificateTypeText(tipo);
    pdf.text(tipoTexto, x, currentY);
    currentY += 10;

    return currentY;
  }

  /**
   * Obtiene texto descriptivo del tipo de certificado
   */
  private getCertificateTypeText(tipo: DatosCertificadoMedico['tipoCertificado']): string {
    switch (tipo) {
      case 'incapacidad':
        return 'CERTIFICADO DE INCAPACIDAD LABORAL';
      case 'aptitud':
        return 'CERTIFICADO DE APTITUD FÍSICA';
      case 'salud':
        return 'CERTIFICADO DE ESTADO DE SALUD';
      case 'vacunacion':
        return 'CERTIFICADO DE VACUNACIÓN';
      case 'enfermedad':
        return 'CERTIFICADO DE ENFERMEDAD';
      default:
        return 'CERTIFICADO MÉDICO';
    }
  }

  /**
   * Agrega diagnóstico
   */
  private addDiagnosis(
    pdf: jsPDF,
    diagnostico: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('DIAGNÓSTICO:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    diagnostico.forEach((diag, index) => {
      const wrappedText = this.wrapText(pdf, `${index + 1}. ${diag}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega período de incapacidad
   */
  private addIncapacityPeriod(
    pdf: jsPDF,
    periodo: NonNullable<DatosCertificadoMedico['periodoIncapacidad']>,
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('PERÍODO DE INCAPACIDAD:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const inicio = new Date(periodo.inicio).toLocaleDateString('es-MX');
    const fin = new Date(periodo.fin).toLocaleDateString('es-MX');
    
    pdf.text(`Desde: ${inicio}`, x, currentY);
    currentY += 6;
    
    pdf.text(`Hasta: ${fin}`, x, currentY);
    currentY += 6;
    
    pdf.text(`Días: ${periodo.dias} días naturales`, x, currentY);
    currentY += 6;

    return currentY;
  }

  /**
   * Agrega fecha de reincorporación
   */
  private addReturnDate(
    pdf: jsPDF,
    fechaReincorporacion: string,
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('FECHA DE REINCORPORACIÓN:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const fecha = new Date(fechaReincorporacion).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    pdf.text(fecha, x, currentY);
    currentY += 6;

    return currentY;
  }

  /**
   * Agrega recomendaciones
   */
  private addRecommendations(
    pdf: jsPDF,
    recomendaciones: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('RECOMENDACIONES MÉDICAS:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    recomendaciones.forEach((rec, index) => {
      const wrappedText = this.wrapText(pdf, `• ${rec}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega restricciones
   */
  private addRestrictions(
    pdf: jsPDF,
    restricciones: string[],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('RESTRICCIONES:', x, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    restricciones.forEach((rest, index) => {
      const wrappedText = this.wrapText(pdf, `✗ ${rest}`, 170);
      wrappedText.forEach(line => {
        pdf.text(line, x, currentY);
        currentY += 6;
      });
    });

    return currentY;
  }

  /**
   * Agrega notas legales
   */
  private addLegalNotes(
    pdf: jsPDF,
    notas: string,
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    
    const wrappedText = this.wrapText(pdf, `Nota: ${notas}`, 170);
    wrappedText.forEach(line => {
      pdf.text(line, x, currentY);
      currentY += 5;
    });

    // Reset font
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    return currentY;
  }

  /**
   * Agrega declaración médica
   */
  private addMedicalDeclaration(
    pdf: jsPDF,
    tipo: DatosCertificadoMedico['tipoCertificado'],
    x: number,
    y: number
  ): number {
    let currentY = y;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const declaracion = this.getMedicalDeclaration(tipo);
    const wrappedText = this.wrapText(pdf, declaracion, 170);
    
    wrappedText.forEach(line => {
      pdf.text(line, x, currentY);
      currentY += 6;
    });

    return currentY;
  }

  /**
   * Obtiene declaración médica según tipo de certificado
   */
  private getMedicalDeclaration(tipo: DatosCertificadoMedico['tipoCertificado']): string {
    switch (tipo) {
      case 'incapacidad':
        return 'Por la presente se certifica que el paciente requiere reposo médico y está incapacitado para realizar sus actividades laborales habituales durante el período especificado.';
      case 'aptitud':
        return 'Por la presente se certifica que el paciente se encuentra apto para realizar las actividades especificadas, sujeto a las restricciones mencionadas.';
      case 'salud':
        return 'Por la presente se certifica el estado de salud del paciente según la evaluación médica realizada en la fecha de emisión de este documento.';
      case 'vacunacion':
        return 'Por la presente se certifica que el paciente ha recibido las vacunas especificadas según el esquema de vacunación vigente.';
      case 'enfermedad':
        return 'Por la presente se certifica el diagnóstico de enfermedad del paciente, el cual requiere el tratamiento y seguimiento médico indicado.';
      default:
        return 'Por la presente se certifica la información médica contenida en este documento.';
    }
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
   * Obtiene descripción del tipo de certificado
   */
  getCertificateTypeDescription(tipo: DatosCertificadoMedico['tipoCertificado']): string {
    switch (tipo) {
      case 'incapacidad':
        return 'Documento que certifica la incapacidad temporal del paciente para realizar sus actividades laborales habituales debido a condición médica.';
      case 'aptitud':
        return 'Documento que certifica la aptitud física del paciente para realizar actividades específicas, sujeto a restricciones médicas.';
      case 'salud':
        return 'Documento que certifica el estado general de salud del paciente según evaluación médica.';
      case 'vacunacion':
        return 'Documento que certifica la aplicación de vacunas según esquema de vacunación vigente.';
      case 'enfermedad':
        return 'Documento que certifica el diagnóstico de enfermedad y la necesidad de tratamiento médico.';
      default:
        return 'Documento médico certificado.';
    }
  }

  /**
   * Verifica si el certificado requiere período de incapacidad
   */
  requiresIncapacityPeriod(tipo: DatosCertificadoMedico['tipoCertificado']): boolean {
    return tipo === 'incapacidad';
  }

  /**
   * Verifica si el certificado requiere fecha de reincorporación
   */
  requiresReturnDate(tipo: DatosCertificadoMedico['tipoCertificado']): boolean {
    return tipo === 'aptitud';
  }

  /**
   * Calcula la duración de incapacidad en días
   */
  calculateIncapacityDays(inicio: string, fin: string): number {
    try {
      const startDate = new Date(inicio);
      const endDate = new Date(fin);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Incluir día de inicio
    } catch {
      return 0;
    }
  }
}

// Exportar una instancia por defecto para uso conveniente
export const medicalCertificateGenerator = new MedicalCertificateGenerator();

// Exportar también la clase para uso avanzado
