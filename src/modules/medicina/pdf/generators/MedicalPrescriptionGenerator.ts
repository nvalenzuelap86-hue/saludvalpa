// ============================================================================
// Generador de recetas médicas en PDF
// ============================================================================

import jsPDF from 'jspdf';
import type {
  Paciente,
  Configuracion,
  DatosRecetaMedica,
  PDFGenerationOptions,
  PDFGenerationResult,
  TipoDocumentoMedico
} from '../types';
import { BasePDFGenerator } from './BasePDFGenerator';
import { TipoDocumentoMedico as TDM } from '../types';

/**
 * Generador de recetas médicas
 */
export class MedicalPrescriptionGenerator extends BasePDFGenerator<DatosRecetaMedica> {
  constructor() {
    super(TDM.RECETA_MEDICA, '2.0');
  }

  /**
   * Genera una receta médica en PDF
   */
  async generate(
    paciente: Paciente,
    datos: DatosRecetaMedica,
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
      let currentY = this.addDocumentHeader(pdf, config, 'RECETA MÉDICA');

      // Agregar información del paciente
      currentY = this.addPatientInformation(pdf, paciente, marginLeft, currentY);
      currentY += 10;

      // Agregar folio del documento
      const folio = this.generateDocumentFolio('REC');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Folio: ${folio}`, pageWidth - 20, currentY, { align: 'right' });
      currentY += 15;

      // Sección: Diagnóstico
      if (datos.diagnostico && datos.diagnostico.length > 0) {
        currentY = this.addSection(
          pdf,
          'DIAGNÓSTICO',
          marginLeft,
          currentY,
          datos.diagnostico,
          false
        );
        currentY += 10;
      }

      // Sección: Medicamentos prescritos
      if (datos.medicamentos && datos.medicamentos.length > 0) {
        currentY = this.addSection(
          pdf,
          'MEDICAMENTOS PRESCRITOS',
          marginLeft,
          currentY,
          [],
          false
        );

        // Tabla de medicamentos
        const headers = ['Medicamento', 'Presentación', 'Dosis', 'Frecuencia', 'Duración', 'Vía'];
        const rows = datos.medicamentos.map(med => [
          med.nombre,
          med.presentacion,
          med.dosis,
          med.frecuencia,
          med.duracion,
          med.via
        ]);

        const columnWidths = [40, 30, 25, 30, 25, 20];
        currentY = this.addTable(pdf, headers, rows, marginLeft, currentY, columnWidths);
        currentY += 10;

        // Indicaciones especiales por medicamento
        const medicamentosConIndicaciones = datos.medicamentos.filter(
          med => med.indicacionesEspeciales
        );

        if (medicamentosConIndicaciones.length > 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          pdf.text('Indicaciones especiales:', marginLeft, currentY);
          currentY += 6;

          medicamentosConIndicaciones.forEach(med => {
            const indicacionText = `${med.nombre}: ${med.indicacionesEspeciales}`;
            const wrappedLines = this.wrapText(pdf, indicacionText, 160);
            wrappedLines.forEach(line => {
              pdf.text(`• ${line}`, marginLeft + 5, currentY);
              currentY += 5;
            });
          });
          currentY += 5;
        }
      } else {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('No se prescribieron medicamentos.', marginLeft, currentY);
        currentY += 10;
      }

      // Sección: Indicaciones generales
      if (datos.indicacionesGenerales && datos.indicacionesGenerales.length > 0) {
        currentY = this.addSection(
          pdf,
          'INDICACIONES GENERALES',
          marginLeft,
          currentY,
          datos.indicacionesGenerales,
          true
        );
        currentY += 10;
      }

      // Sección: Recomendaciones
      if (datos.recomendaciones && datos.recomendaciones.length > 0) {
        currentY = this.addSection(
          pdf,
          'RECOMENDACIONES',
          marginLeft,
          currentY,
          datos.recomendaciones,
          true
        );
        currentY += 10;
      }

      // Sección: Próxima cita
      if (datos.proximaCita) {
        currentY = this.addSection(
          pdf,
          'PRÓXIMA CITA',
          marginLeft,
          currentY,
          [`Fecha: ${this.formatDate(datos.proximaCita)}`],
          false
        );
        currentY += 10;
      }

      // Verificación CDSS (si existe)
      if (datos.verificacionCDSS) {
        currentY = this.addCDSSVerificationSection(pdf, datos.verificacionCDSS, marginLeft, currentY);
        currentY += 10;
      }

      // Espacio para firma
      currentY = Math.max(currentY, 250); // Asegurar posición mínima
      this.addSignature(pdf, marginLeft + 50, currentY, 100);
      currentY += 30;

      // Código QR con información de la receta
      const qrData = this.generateQRCodeData(paciente, datos, folio);
      this.addQRCode(pdf, qrData, pageWidth - 60, currentY - 40, 40, options);

      // Agregar marca de agua si es necesario
      this.addWatermarkIfNeeded(pdf, config, options);

      // Agregar pie de página
      this.addDocumentFooter(pdf, config, 1);

      // Generar blob del PDF
      const pdfBlob = pdf.output('blob');
      const generationTime = Date.now() - startTime;

      // Crear resultado
      const result = this.createGenerationResult(
        true,
        pdfBlob,
        `Receta_${paciente.nombre}_${folio}.pdf`,
        undefined,
        {
          patientId: paciente.id,
          generationDate: new Date(startTime),
          checksum: this.generateDocumentChecksum(pdfBlob),
        }
      );

      result.generationTime = generationTime;
      result.fileSize = pdfBlob.size;

      return pdfBlob;

    } catch (error) {
      const generationTime = Date.now() - startTime;
      const result = this.createGenerationResult(
        false,
        undefined,
        undefined,
        [error instanceof Error ? error.message : 'Error desconocido'],
        {
          patientId: paciente.id,
          generationDate: new Date(startTime),
        }
      );

      result.generationTime = generationTime;
      throw error;
    }
  }

  /**
   * Realiza validaciones específicas para recetas médicas
   */
  protected performSpecificValidation(
    datos: DatosRecetaMedica,
    errors: string[],
    warnings: string[]
  ): void {
    // Validar fecha de receta
    if (!datos.fechaReceta) {
      errors.push('La fecha de la receta es requerida');
    } else {
      try {
        const fecha = new Date(datos.fechaReceta);
        if (isNaN(fecha.getTime())) {
          errors.push('La fecha de la receta no es válida');
        }
      } catch {
        errors.push('La fecha de la receta no es válida');
      }
    }

    // Validar diagnóstico
    if (!datos.diagnostico || datos.diagnostico.length === 0) {
      warnings.push('No se especificó diagnóstico');
    }

    // Validar medicamentos
    if (!datos.medicamentos || datos.medicamentos.length === 0) {
      warnings.push('No se prescribieron medicamentos');
    } else {
      datos.medicamentos.forEach((med, index) => {
        if (!med.nombre) {
          errors.push(`Medicamento ${index + 1}: El nombre es requerido`);
        }
        if (!med.dosis) {
          errors.push(`Medicamento ${index + 1}: La dosis es requerida`);
        }
        if (!med.frecuencia) {
          warnings.push(`Medicamento ${index + 1}: No se especificó frecuencia`);
        }
        if (!med.duracion) {
          warnings.push(`Medicamento ${index + 1}: No se especificó duración`);
        }
      });
    }

    // Validar próximas citas futuras
    if (datos.proximaCita) {
      try {
        const fechaProxima = new Date(datos.proximaCita);
        const fechaReceta = new Date(datos.fechaReceta);
        
        if (fechaProxima < fechaReceta) {
          warnings.push('La próxima cita es anterior a la fecha de la receta');
        }
      } catch {
        warnings.push('La fecha de la próxima cita no es válida');
      }
    }

    // Validar verificaciones CDSS
    if (datos.verificacionCDSS) {
      if (datos.verificacionCDSS.interaccionesDetectadas) {
        warnings.push('Se detectaron interacciones medicamentosas - revisar con cuidado');
      }
      if (datos.verificacionCDSS.alertas && datos.verificacionCDSS.alertas.length > 0) {
        warnings.push(...datos.verificacionCDSS.alertas.map(alerta => `Alerta CDSS: ${alerta}`));
      }
    }
  }

  /**
   * Agrega sección de verificación CDSS al documento
   */
  private addCDSSVerificationSection(
    pdf: jsPDF,
    verificacion: DatosRecetaMedica['verificacionCDSS'],
    x: number,
    y: number
  ): number {
    let currentY = y;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 180);
    pdf.text('VERIFICACIÓN CDSS', x, currentY);
    currentY += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);

    if (verificacion?.interaccionesDetectadas) {
      pdf.setTextColor(180, 60, 60);
      pdf.text('⚠️ Se detectaron interacciones medicamentosas', x, currentY);
      currentY += 6;
    } else {
      pdf.setTextColor(60, 180, 60);
      pdf.text('✓ Sin interacciones medicamentosas detectadas', x, currentY);
      currentY += 6;
    }

    if (verificacion?.alertas && verificacion.alertas.length > 0) {
      pdf.setTextColor(220, 120, 0);
      pdf.text('Alertas:', x, currentY);
      currentY += 5;

      verificacion.alertas.forEach(alerta => {
        const wrappedLines = this.wrapText(pdf, `• ${alerta}`, 160);
        wrappedLines.forEach(line => {
          pdf.text(line, x + 5, currentY);
          currentY += 5;
        });
      });
    }

    if (verificacion?.recomendaciones && verificacion.recomendaciones.length > 0) {
      pdf.setTextColor(60, 120, 200);
      pdf.text('Recomendaciones CDSS:', x, currentY);
      currentY += 5;

      verificacion.recomendaciones.forEach(recomendacion => {
        const wrappedLines = this.wrapText(pdf, `• ${recomendacion}`, 160);
        wrappedLines.forEach(line => {
          pdf.text(line, x + 5, currentY);
          currentY += 5;
        });
      });
    }

    return currentY;
  }

  /**
   * Genera datos para código QR
   */
  private generateQRCodeData(
    paciente: Paciente,
    datos: DatosRecetaMedica,
    folio: string
  ): string {
    const qrData = {
      tipo: 'receta_medica',
      folio,
      paciente: {
        id: paciente.id,
        nombre: `${paciente.nombre} ${paciente.apellidos}`,
      },
      fecha: datos.fechaReceta,
      medico: 'Sistema SaludValpa',
      medicamentos: datos.medicamentos?.length || 0,
      validez: '30 días',
      url: `https://saludvalpa.com/verificar/receta/${folio}`,
    };

    return JSON.stringify(qrData);
  }

  /**
   * Genera un checksum específico para el documento
   */
  private generateDocumentChecksum(blob: Blob): string {
    // En una implementación real, calcularíamos un hash del contenido
    // Por ahora, usamos un método simple
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `RC-${timestamp.toString(16)}-${random.toString(16).padStart(6, '0')}`;
  }

  /**
   * Métodos de utilidad específicos para recetas
   */
  
  /**
   * Formatea la información de un medicamento para mostrar
   */
  formatMedicationInfo(medicamento: DatosRecetaMedica['medicamentos'][0]): string {
    return `${medicamento.nombre} ${medicamento.dosis} ${medicamento.presentacion}, ` +
           `${medicamento.frecuencia} por ${medicamento.duracion}, vía ${medicamento.via}` +
           (medicamento.indicacionesEspeciales ? ` (${medicamento.indicacionesEspeciales})` : '');
  }

  /**
   * Calcula la duración total del tratamiento
   */
  calculateTreatmentDuration(medicamentos: DatosRecetaMedica['medicamentos']): string {
    if (!medicamentos || medicamentos.length === 0) {
      return 'No especificado';
    }

    // Intentar extraer números de duración (ej: "7 días", "1 mes", "2 semanas")
    const durations = medicamentos.map(med => {
      const match = med.duracion.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });

    const maxDuration = Math.max(...durations);
    return maxDuration > 0 ? `${maxDuration} días` : 'Variable';
  }

  /**
   * Verifica si hay medicamentos de control especial
   */
  hasControlledMedications(medicamentos: DatosRecetaMedica['medicamentos']): boolean {
    if (!medicamentos) return false;
    
    const controlledKeywords = [
      'controlado', 'estupefaciente', 'psicotrópico', 'opioide',
      'benzodiazepina', 'anfetamina', 'metadona', 'morfina'
    ];

    return medicamentos.some(med =>
      controlledKeywords.some(keyword =>
        med.nombre.toLowerCase().includes(keyword)
      )
    );
  }
}

// Exportar una instancia por defecto para uso conveniente
export const medicalPrescriptionGenerator = new MedicalPrescriptionGenerator();

// Exportar también la clase para uso avanzado
export default MedicalPrescriptionGenerator;