// ============================================================================
// Utilidades para generación de PDF en módulo de medicina
// ============================================================================

import jsPDF from 'jspdf';
import type { 
  Paciente, 
  Configuracion, 
  PDFStyleConfig, 
  DocumentHeaderInfo,
  PDFUtils,
  PaperSize,
  Orientation
} from './types';
import { PDF_STYLES, PDF_MARGINS } from './types';

/**
 * Clase de utilidades para generación de PDF médicos
 */
export class PDFMedicalUtils implements PDFUtils {
  private styles: PDFStyleConfig;
  private margins: typeof PDF_MARGINS;

  constructor(customStyles?: Partial<PDFStyleConfig>) {
    this.styles = { ...PDF_STYLES, ...customStyles };
    this.margins = PDF_MARGINS;
  }

  /**
   * Agrega encabezado estándar a un documento PDF
   */
  addHeader(
    pdf: jsPDF, 
    headerInfo: DocumentHeaderInfo, 
    title: string
  ): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = this.margins.TOP;

    // Logo (si existe en config)
    // Nota: La implementación real dependería de tener acceso a la imagen del logo
    // Por ahora, solo agregamos texto

    // Información de la clínica (izquierda)
    pdf.setFontSize(this.styles.fontSize.subtitle);
    pdf.setFont(this.styles.fonts.bold, 'bold');
    pdf.setTextColor(this.styles.colors.primary);
    
    if (headerInfo.clinicName) {
      pdf.text(headerInfo.clinicName, this.margins.LEFT, currentY);
      currentY += 6;
    }

    // Información del médico
    pdf.setFontSize(this.styles.fontSize.normal);
    pdf.setFont(this.styles.fonts.normal, 'normal');
    pdf.setTextColor(this.styles.colors.text);
    
    if (headerInfo.doctorName) {
      pdf.text(`Médico: ${headerInfo.doctorName}`, this.margins.LEFT, currentY);
      currentY += 5;
    }

    if (headerInfo.professionalId) {
      pdf.text(`Cédula: ${headerInfo.professionalId}`, this.margins.LEFT, currentY);
      currentY += 5;
    }

    if (headerInfo.specialty) {
      pdf.text(`Especialidad: ${headerInfo.specialty}`, this.margins.LEFT, currentY);
      currentY += 5;
    }

    // Información de contacto (derecha)
    const contactX = pageWidth - this.margins.RIGHT;
    let contactY = this.margins.TOP;
    
    pdf.setFontSize(this.styles.fontSize.small);
    pdf.setTextColor(this.styles.colors.gray);
    
    if (headerInfo.contactInfo.phone) {
      pdf.text(`Tel: ${headerInfo.contactInfo.phone}`, contactX, contactY, { align: 'right' });
      contactY += 4;
    }

    if (headerInfo.contactInfo.email) {
      pdf.text(`Email: ${headerInfo.contactInfo.email}`, contactX, contactY, { align: 'right' });
      contactY += 4;
    }

    if (headerInfo.contactInfo.address) {
      const addressLines = this.wrapText(pdf, headerInfo.contactInfo.address, 60);
      addressLines.forEach((line, index) => {
        pdf.text(line, contactX, contactY + (index * 4), { align: 'right' });
      });
      contactY += addressLines.length * 4;
    }

    // Línea separadora
    const separatorY = Math.max(currentY, contactY) + 5;
    pdf.setDrawColor(this.styles.colors.primary);
    pdf.setLineWidth(0.5);
    pdf.line(
      this.margins.LEFT, 
      separatorY, 
      pageWidth - this.margins.RIGHT, 
      separatorY
    );

    // Título del documento
    pdf.setFontSize(this.styles.fontSize.title);
    pdf.setFont(this.styles.fonts.bold, 'bold');
    pdf.setTextColor(this.styles.colors.primary);
    pdf.text(
      title, 
      pageWidth / 2, 
      separatorY + 15, 
      { align: 'center' }
    );

    return separatorY + 25; // Retorna la posición Y para continuar
  }

  /**
   * Agrega pie de página estándar
   */
  addFooter(
    pdf: jsPDF, 
    config: Configuracion, 
    pageNumber: number = 1
  ): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const footerY = pageHeight - this.margins.BOTTOM;

    pdf.setFontSize(this.styles.fontSize.small);
    pdf.setTextColor(this.styles.colors.gray);

    // Línea superior del footer
    pdf.setDrawColor(this.styles.colors.gray);
    pdf.setLineWidth(0.2);
    pdf.line(
      this.margins.LEFT, 
      footerY - 5, 
      pageWidth - this.margins.RIGHT, 
      footerY - 5
    );

    // Información del footer
    const fechaHoy = this.formatDate(new Date());
    pdf.text(fechaHoy, this.margins.LEFT, footerY);
    pdf.text(`Página ${pageNumber}`, pageWidth / 2, footerY, { align: 'center' });
    
    if (config.datosContacto?.direccion) {
      pdf.text(
        config.datosContacto.direccion, 
        pageWidth - this.margins.RIGHT, 
        footerY, 
        { align: 'right' }
      );
    }

    // Marca de SaludValpa
    pdf.setFontSize(7);
    pdf.text(
      'Generado por SaludValpa - Sistema Médico Integral',
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    );
  }

  /**
   * Agrega marca de agua si es versión gratuita
   */
  addWatermark(
    pdf: jsPDF, 
    text: string = 'saludvalpa VERSIÓN GRATUITA', 
    isFreeVersion: boolean = false
  ): void {
    if (!isFreeVersion) return;

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.saveGraphicsState();
    
    // Configurar transparencia
    const gState = new (pdf as any).GState({ opacity: 0.1 });
    pdf.setGState(gState);
    
    pdf.setTextColor(this.styles.colors.gray);
    pdf.setFontSize(50);
    
    // Rotar y centrar la marca de agua
    pdf.text(
      text,
      pageWidth / 2,
      pageHeight / 2,
      {
        align: 'center',
        angle: 45,
      }
    );
    
    pdf.restoreGraphicsState();
  }

  /**
   * Agrega código QR al PDF
   */
  addQRCode(
    pdf: jsPDF, 
    data: string, 
    x: number, 
    y: number, 
    size: number = 40
  ): void {
    // Nota: Para implementación real necesitaríamos una biblioteca de QR
    // Por ahora, agregamos un placeholder
    pdf.setDrawColor(this.styles.colors.primary);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, y, size, size, 'F');
    
    pdf.setFontSize(8);
    pdf.setTextColor(this.styles.colors.gray);
    pdf.text('QR Code', x + size/2, y + size/2, { align: 'center' });
    pdf.text('(placeholder)', x + size/2, y + size/2 + 4, { align: 'center' });
  }

  /**
   * Agrega área para firma
   */
  addSignatureArea(
    pdf: jsPDF, 
    x: number, 
    y: number, 
    width: number = 150
  ): void {
    pdf.setDrawColor(this.styles.colors.text);
    pdf.setLineWidth(0.5);
    
    // Línea para firma
    pdf.line(x, y, x + width, y);
    
    // Texto de firma
    pdf.setFontSize(this.styles.fontSize.normal);
    pdf.setTextColor(this.styles.colors.text);
    pdf.text('Firma del Médico', x + width/2, y + 8, { align: 'center' });
    
    // Información adicional
    pdf.setFontSize(this.styles.fontSize.small);
    pdf.setTextColor(this.styles.colors.gray);
    pdf.text('Nombre y cédula profesional', x + width/2, y + 15, { align: 'center' });
  }

  /**
   * Agrega información del paciente
   */
  addPatientInfo(
    pdf: jsPDF,
    paciente: Paciente,
    x: number,
    y: number
  ): number {
    let currentY = y;
    
    // Título de sección
    pdf.setFontSize(this.styles.fontSize.subtitle);
    pdf.setFont(this.styles.fonts.bold, 'bold');
    pdf.setTextColor(this.styles.colors.primary);
    pdf.text('DATOS DEL PACIENTE', x, currentY);
    currentY += 8;

    // Información del paciente
    pdf.setFontSize(this.styles.fontSize.normal);
    pdf.setFont(this.styles.fonts.normal, 'normal');
    pdf.setTextColor(this.styles.colors.text);
    
    pdf.text(`Nombre: ${paciente.nombre} ${paciente.apellidos}`, x, currentY);
    currentY += 6;
    
    if (paciente.edad) {
      pdf.text(`Edad: ${paciente.edad} años`, x, currentY);
      currentY += 6;
    }
    
    if (paciente.genero) {
      pdf.text(`Género: ${paciente.genero}`, x, currentY);
      currentY += 6;
    }
    
    if (paciente.id) {
      pdf.text(`ID Paciente: ${paciente.id}`, x, currentY);
      currentY += 6;
    }
    
    if (paciente.telefono) {
      pdf.text(`Teléfono: ${paciente.telefono}`, x, currentY);
      currentY += 6;
    }
    
    if (paciente.email) {
      pdf.text(`Email: ${paciente.email}`, x, currentY);
      currentY += 6;
    }

    return currentY;
  }

  /**
   * Envuelve texto para ajustarse al ancho máximo
   */
  wrapText(
    pdf: jsPDF, 
    text: string, 
    maxWidth: number
  ): string[] {
    return pdf.splitTextToSize(text, maxWidth);
  }

  /**
   * Formatea una fecha
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Formatea una cantidad monetaria
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Agrega una sección con título
   */
  addSection(
    pdf: jsPDF,
    title: string,
    x: number,
    y: number,
    content: string[],
    bulletPoints: boolean = false
  ): number {
    let currentY = y;
    
    // Título de sección
    pdf.setFontSize(this.styles.fontSize.subtitle);
    pdf.setFont(this.styles.fonts.bold, 'bold');
    pdf.setTextColor(this.styles.colors.primary);
    pdf.text(title.toUpperCase(), x, currentY);
    currentY += 8;

    // Contenido
    pdf.setFontSize(this.styles.fontSize.normal);
    pdf.setFont(this.styles.fonts.normal, 'normal');
    pdf.setTextColor(this.styles.colors.text);
    
    content.forEach((line, index) => {
      if (currentY > 270) { // Cerca del final de la página
        pdf.addPage();
        currentY = this.margins.TOP;
      }
      
      const prefix = bulletPoints ? '• ' : '';
      const wrappedLines = this.wrapText(pdf, `${prefix}${line}`, 170);
      
      wrappedLines.forEach((wrappedLine, lineIndex) => {
        pdf.text(wrappedLine, x + (bulletPoints ? 5 : 0), currentY);
        currentY += 6;
      });
      
      if (index < content.length - 1) {
        currentY += 2; // Espacio entre elementos
      }
    });

    return currentY;
  }

  /**
   * Agrega una tabla simple
   */
  addSimpleTable(
    pdf: jsPDF,
    headers: string[],
    rows: string[][],
    x: number,
    y: number,
    columnWidths: number[]
  ): number {
    let currentY = y;
    
    // Encabezado de tabla
    pdf.setFontSize(this.styles.fontSize.normal);
    pdf.setFont(this.styles.fonts.bold, 'bold');
    pdf.setTextColor(this.styles.colors.text);
    
    let currentX = x;
    headers.forEach((header, index) => {
      pdf.text(header, currentX, currentY);
      currentX += columnWidths[index];
    });
    
    currentY += 8;
    
    // Filas de tabla
    pdf.setFont(this.styles.fonts.normal, 'normal');
    
    rows.forEach((row, rowIndex) => {
      if (currentY > 270) {
        pdf.addPage();
        currentY = this.margins.TOP;
      }
      
      currentX = x;
      row.forEach((cell, cellIndex) => {
        pdf.text(cell, currentX, currentY);
        currentX += columnWidths[cellIndex];
      });
      
      currentY += 6;
      
      // Línea separadora entre filas
      if (rowIndex < rows.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.1);
        pdf.line(x, currentY - 2, x + columnWidths.reduce((a, b) => a + b, 0), currentY - 2);
        currentY += 2;
      }
    });

    return currentY;
  }

  /**
   * Crea un nuevo PDF con configuración estándar
   */
  createPDF(
    paperSize: PaperSize = 'A4',
    orientation: Orientation = 'portrait'
  ): jsPDF {
    return new jsPDF({
      orientation,
      unit: 'mm',
      format: paperSize,
      compress: true,
    });
  }

  /**
   * Obtiene información de encabezado desde configuración
   */
  getHeaderInfoFromConfig(config: Configuracion): DocumentHeaderInfo {
    return {
      clinicName: config.branding?.nombreClinica || 'Clínica Médica',
      doctorName: config.branding?.nombreProfesional || 'Médico',
      professionalId: config.branding?.credenciales || 'Cédula no especificada',
      specialty: config.branding?.especialidad || 'Medicina General',
      contactInfo: {
        phone: config.datosContacto?.telefono,
        email: config.datosContacto?.email,
        address: config.datosContacto?.direccion,
        website: config.datosContacto?.sitioWeb,
      },
    };
  }

  /**
   * Verifica si hay espacio suficiente en la página actual
   */
  hasSpace(pdf: jsPDF, requiredHeight: number, currentY: number): boolean {
    const pageHeight = pdf.internal.pageSize.getHeight();
    return currentY + requiredHeight < pageHeight - this.margins.BOTTOM;
  }

  /**
   * Agrega una nueva página si no hay espacio suficiente
   */
  addPageIfNeeded(pdf: jsPDF, requiredHeight: number, currentY: number): number {
    if (!this.hasSpace(pdf, requiredHeight, currentY)) {
      pdf.addPage();
      return this.margins.TOP;
    }
    return currentY;
  }

  /**
   * Genera un folio único para documentos
   */
  generateDocumentFolio(prefix: string = 'DOC'): string {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().substring(2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    
    return `${prefix}-${año}${mes}${dia}-${horas}${minutos}${segundos}-${random}`;
  }
}

// Exportar una instancia por defecto para uso conveniente
export const pdfMedicalUtils = new PDFMedicalUtils();

// Exportar también la clase para uso avanzado
export default PDFMedicalUtils;