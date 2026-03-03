// ============================================================================
// Generador base de PDF para documentos médicos
// ============================================================================

import jsPDF from 'jspdf';
import type { 
  Paciente, 
  Configuracion, 
  PDFGenerator, 
  ValidationResult,
  PDFGenerationOptions,
  PDFGenerationResult,
  TipoDocumentoMedico
} from '../types';
import { PDFMedicalUtils } from '../utils';

/**
 * Clase base abstracta para generadores de PDF médicos
 */
export abstract class BasePDFGenerator<T> implements PDFGenerator<T> {
  protected utils: PDFMedicalUtils;
  protected documentType: TipoDocumentoMedico;
  protected templateVersion: string;

  constructor(
    documentType: TipoDocumentoMedico,
    templateVersion: string = '1.0'
  ) {
    this.utils = new PDFMedicalUtils();
    this.documentType = documentType;
    this.templateVersion = templateVersion;
  }

  /**
   * Método abstracto que debe implementarse por generadores específicos
   */
  abstract generate(
    paciente: Paciente,
    datos: T,
    config: Configuracion,
    options?: PDFGenerationOptions
  ): Promise<Blob>;

  /**
   * Validación base de datos
   */
  validateData(datos: T): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validaciones básicas comunes a todos los documentos
    if (!datos) {
      errors.push('Los datos del documento no pueden estar vacíos');
    }

    // Validación específica debe implementarse en clases hijas
    this.performSpecificValidation(datos, errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Método protegido para validaciones específicas
   */
  protected abstract performSpecificValidation(
    datos: T,
    errors: string[],
    warnings: string[]
  ): void;

  /**
   * Obtiene la versión de la plantilla
   */
  getTemplateVersion(): string {
    return this.templateVersion;
  }

  /**
   * Crea un nuevo documento PDF con configuración estándar
   */
  protected createPDFDocument(options?: PDFGenerationOptions): jsPDF {
    const paperSize = options?.paperSize || 'A4';
    const orientation = options?.orientation || 'portrait';
    
    return this.utils.createPDF(paperSize, orientation);
  }

  /**
   * Agrega encabezado estándar al documento
   */
  protected addDocumentHeader(
    pdf: jsPDF,
    config: Configuracion,
    title: string
  ): number {
    const headerInfo = this.utils.getHeaderInfoFromConfig(config);
    return this.utils.addHeader(pdf, headerInfo, title);
  }

  /**
   * Agrega información del paciente al documento
   */
  protected addPatientInformation(
    pdf: jsPDF,
    paciente: Paciente,
    x: number,
    y: number
  ): number {
    return this.utils.addPatientInfo(pdf, paciente, x, y);
  }

  /**
   * Agrega pie de página estándar
   */
  protected addDocumentFooter(
    pdf: jsPDF,
    config: Configuracion,
    pageNumber: number = 1
  ): void {
    this.utils.addFooter(pdf, config, pageNumber);
  }

  /**
   * Agrega marca de agua si es necesario
   */
  protected addWatermarkIfNeeded(
    pdf: jsPDF,
    config: Configuracion,
    options?: PDFGenerationOptions
  ): void {
    const includeWatermark = options?.includeWatermark ?? true;
    const isFreeVersion = config.licencia?.tipo === 'gratuita';
    
    if (includeWatermark && isFreeVersion) {
      this.utils.addWatermark(pdf, undefined, true);
    }
  }

  /**
   * Genera un resultado estándar de generación de PDF
   */
  protected createGenerationResult(
    success: boolean,
    blob?: Blob,
    fileName?: string,
    errors?: string[],
    metadata?: Partial<PDFGenerationResult['metadata']>
  ): PDFGenerationResult {
    const defaultMetadata = {
      documentType: this.documentType,
      patientId: 'unknown',
      generationDate: new Date(),
      templateVersion: this.templateVersion,
      checksum: this.generateChecksum(),
    };

    const finalMetadata = { ...defaultMetadata, ...metadata };

    return {
      success,
      blob,
      fileName: fileName || this.generateDefaultFileName(),
      fileSize: blob?.size || 0,
      generationTime: 0, // Se calcularía en tiempo real
      errors,
      metadata: finalMetadata as PDFGenerationResult['metadata'],
    };
  }

  /**
   * Genera un nombre de archivo por defecto
   */
  protected generateDefaultFileName(prefix?: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const docPrefix = prefix || this.getDocumentTypePrefix();
    return `${docPrefix}_${timestamp}.pdf`;
  }

  /**
   * Obtiene el prefijo para el tipo de documento
   */
  protected getDocumentTypePrefix(): string {
    const prefixMap: Record<TipoDocumentoMedico, string> = {
      RECETA_MEDICA: 'Receta',
      CARTA_DERIVACION: 'Derivacion',
      CERTIFICADO_MEDICO: 'Certificado',
      ORDEN_LABORATORIO: 'OrdenLab',
      NOTA_SOAP: 'NotaSOAP',
      HISTORIA_CLINICA_MEDICA: 'HistoriaClinica',
    };

    return prefixMap[this.documentType] || 'Documento';
  }

  /**
   * Genera un checksum para verificación de integridad
   */
  protected generateChecksum(): string {
    const data = `${this.documentType}-${this.templateVersion}-${Date.now()}`;
    // Implementación simple de checksum - en producción usaría algo como SHA-256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Verifica si hay espacio suficiente en la página actual
   */
  protected hasSpace(
    pdf: jsPDF,
    requiredHeight: number,
    currentY: number
  ): boolean {
    return this.utils.hasSpace(pdf, requiredHeight, currentY);
  }

  /**
   * Agrega una nueva página si es necesario
   */
  protected addPageIfNeeded(
    pdf: jsPDF,
    requiredHeight: number,
    currentY: number
  ): number {
    return this.utils.addPageIfNeeded(pdf, requiredHeight, currentY);
  }

  /**
   * Agrega una sección con título al documento
   */
  protected addSection(
    pdf: jsPDF,
    title: string,
    x: number,
    y: number,
    content: string[],
    bulletPoints: boolean = false
  ): number {
    return this.utils.addSection(pdf, title, x, y, content, bulletPoints);
  }

  /**
   * Agrega una tabla simple al documento
   */
  protected addTable(
    pdf: jsPDF,
    headers: string[],
    rows: string[][],
    x: number,
    y: number,
    columnWidths: number[]
  ): number {
    return this.utils.addSimpleTable(pdf, headers, rows, x, y, columnWidths);
  }

  /**
   * Agrega área de firma al documento
   */
  protected addSignature(
    pdf: jsPDF,
    x: number,
    y: number,
    width: number = 150
  ): void {
    this.utils.addSignatureArea(pdf, x, y, width);
  }

  /**
   * Agrega código QR al documento
   */
  protected addQRCode(
    pdf: jsPDF,
    data: string,
    x: number,
    y: number,
    size: number = 40,
    options?: PDFGenerationOptions
  ): void {
    if (options?.includeQRCode !== false) {
      this.utils.addQRCode(pdf, data, x, y, size);
    }
  }

  /**
   * Formatea una fecha para mostrar en el documento
   */
  protected formatDate(date: Date | string): string {
    return this.utils.formatDate(date);
  }

  /**
   * Formatea una cantidad monetaria
   */
  protected formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  /**
   * Envuelve texto para ajustarse al ancho máximo
   */
  protected wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
    return this.utils.wrapText(pdf, text, maxWidth);
  }

  /**
   * Genera un folio único para el documento
   */
  protected generateDocumentFolio(prefix?: string): string {
    const docPrefix = prefix || this.getDocumentTypePrefix().substring(0, 3).toUpperCase();
    return this.utils.generateDocumentFolio(docPrefix);
  }
}