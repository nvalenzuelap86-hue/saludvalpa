// ============================================================================
// saludvalpa 3.0 - PDF SERVICE
// Servicio para generación de documentos PDF
// ============================================================================

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import type { Paciente, Configuracion, Documento, Sesion, TipoProfesion } from '../types';
import { TipoDocumento } from '../types';
import { formatearFecha, formatearMoneda } from '../utils/helpers';
import { db } from '../db/database';

// ============================================================================
// CONFIGURACIÓN BASE
// ============================================================================

const MARGENES = {
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,
};

const COLORES = {
  primario: '#2C5D7D',
  secundario: '#5FB4B4',
  texto: '#111827',
  gris: '#6B7280',
};

// ============================================================================
// UTILIDADES PDF
// ============================================================================

/**
 * Obtiene la profesión correspondiente a un tipo de documento
 */
const obtenerProfesionPorTipoDocumento = (tipo: string): TipoProfesion => {
  // Mapeo de tipos de documento a profesiones
  const mapeo: Record<string, TipoProfesion> = {
    // Fisioterapia
    [TipoDocumento.EVALUACION_FISIOTERAPEUTICA]: 'fisioterapia',
    [TipoDocumento.PLAN_TRATAMIENTO]: 'fisioterapia',
    // Psicología
    [TipoDocumento.HISTORIA_CLINICA_PSICOLOGICA]: 'psicologia',
    [TipoDocumento.NOTA_SESION_PSICOLOGICA]: 'psicologia',
    [TipoDocumento.PLAN_TERAPEUTICO]: 'psicologia',
    // Nutrición
    [TipoDocumento.PLAN_NUTRICIONAL]: 'nutricion',
    [TipoDocumento.VALORACION_NUTRICIONAL]: 'nutricion',
    // Medicina General
    [TipoDocumento.HISTORIA_CLINICA_MEDICA]: 'medicina_general',
    [TipoDocumento.RECETA_MEDICA]: 'medicina_general',
    [TipoDocumento.CERTIFICADO_MEDICO]: 'medicina_general',
    [TipoDocumento.NOTA_EVOLUCION_MEDICA]: 'medicina_general',
    // Odontología
    [TipoDocumento.HISTORIA_CLINICA_ODONTOLOGICA]: 'odontologia',
    [TipoDocumento.ODONTOGRAMA]: 'odontologia',
    [TipoDocumento.PLAN_TRATAMIENTO_ODONTOLOGICO]: 'odontologia',
    [TipoDocumento.PRESUPUESTO_ODONTOLOGICO]: 'odontologia',
    // Genéricos (por defecto medicina_general)
    [TipoDocumento.RECIBO_PAGO]: 'medicina_general',
    [TipoDocumento.CONSENTIMIENTO_INFORMADO]: 'medicina_general',
    [TipoDocumento.HOJA_BLANCO]: 'medicina_general',
    [TipoDocumento.REPORTE_SESION]: 'medicina_general',
    [TipoDocumento.CONFIRMACION_CITA]: 'medicina_general',
    [TipoDocumento.HISTORIA_CLINICA]: 'medicina_general',
    [TipoDocumento.NOTA_SESION]: 'medicina_general',
  };
  return mapeo[tipo] || 'medicina_general';
};

/**
 * Agrega el encabezado estándar de SaludValpa
 */
const agregarEncabezado = async (
  pdf: jsPDF, 
  config: Configuracion, 
  titulo: string
) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  let logoY = MARGENES.top;
  
  // Logo en la esquina superior izquierda (siempre mostrar si existe)
  if (config.branding?.logo) {
    try {
      pdf.addImage(config.branding.logo, 'PNG', MARGENES.left, logoY, 35, 35);
    } catch (error) {
      console.error('Error al agregar logo:', error);
    }
  }

  // Información profesional (derecha)
  const infoX = pageWidth - MARGENES.right;
  let currentY = logoY + 5;
  
  // Nombre del consultorio/clínica (más destacado si existe)
  if (config.branding?.nombreClinica) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(COLORES.primario);
    pdf.text(config.branding.nombreClinica, infoX, currentY, { align: 'right' });
    currentY += 5;
  }
  
  // Nombre profesional
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(COLORES.texto);
  pdf.text(config.branding?.nombreProfesional || 'Profesional', infoX, currentY, { align: 'right' });
  currentY += 5;
  
  // Credenciales
  if (config.branding?.credenciales) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(COLORES.gris);
    pdf.text(config.branding.credenciales, infoX, currentY, { align: 'right' });
    currentY += 4;
  }
  
  // Especialidad
  if (config.branding?.especialidad) {
    pdf.setFontSize(8);
    pdf.text(config.branding.especialidad, infoX, currentY, { align: 'right' });
    currentY += 5;
  }
  
  // Línea separadora
  pdf.setDrawColor(COLORES.gris);
  pdf.setLineWidth(0.2);
  pdf.line(infoX - 60, currentY, infoX, currentY);
  currentY += 4;
  
  // Datos de contacto
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  
  if (config.datosContacto?.telefono) {
    pdf.text(`Tel: ${config.datosContacto.telefono}`, infoX, currentY, { align: 'right' });
    currentY += 4;
  }
  
  if (config.datosContacto?.email) {
    pdf.text(`Email: ${config.datosContacto.email}`, infoX, currentY, { align: 'right' });
    currentY += 4;
  }
  
  if (config.datosContacto?.direccion) {
    // Ajustar texto largo para dirección
    const maxWidth = 70;
    const direccionLineas = pdf.splitTextToSize(config.datosContacto.direccion, maxWidth);
    pdf.text(direccionLineas, infoX, currentY, { align: 'right' });
    currentY += (direccionLineas.length * 4);
  }
  
  if (config.datosContacto?.sitioWeb) {
    pdf.text(config.datosContacto.sitioWeb, infoX, currentY, { align: 'right' });
    currentY += 4;
  }

  // Línea separadora horizontal completa
  const finalY = Math.max(logoY + 40, currentY + 5);
  pdf.setDrawColor(COLORES.secundario);
  pdf.setLineWidth(0.5);
  pdf.line(MARGENES.left, finalY, pageWidth - MARGENES.right, finalY);

  // Título del documento (centrado)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(COLORES.primario);
  pdf.text(titulo, pageWidth / 2, finalY + 10, { align: 'center' });

  return finalY + 20; // Posición Y donde continuar el contenido
};

/**
 * Agrega el pie de página
 */
const agregarPieDePagina = (
  pdf: jsPDF,
  config: Configuracion,
  numeroPagina: number = 1
) => {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const footerY = pageHeight - MARGENES.bottom;

  pdf.setFontSize(8);
  pdf.setTextColor(COLORES.gris);

  // Línea superior del footer
  pdf.setDrawColor(COLORES.gris);
  pdf.setLineWidth(0.2);
  pdf.line(MARGENES.left, footerY - 5, pageWidth - MARGENES.right, footerY - 5);

  // Texto del footer
  const fechaHoy = formatearFecha(new Date());
  pdf.text(fechaHoy, MARGENES.left, footerY);
  pdf.text(`Página ${numeroPagina}`, pageWidth / 2, footerY, { align: 'center' });
  
  if (config.datosContacto?.direccion) {
    pdf.text(config.datosContacto.direccion, pageWidth - MARGENES.right, footerY, { align: 'right' });
  }
};

/**
 * Agrega marca de agua si es versión gratuita
 */
const agregarMarcaDeAgua = (pdf: jsPDF, esVersionGratuita: boolean) => {
  if (!esVersionGratuita) return;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }));
  pdf.setTextColor(COLORES.gris);
  pdf.setFontSize(50);
  
  // Rotar y centrar
  pdf.text(
    'saludvalpa VERSIÓN GRATUITA',
    pageWidth / 2,
    pageHeight / 2,
    {
      align: 'center',
      angle: 45,
    }
  );
  
  pdf.restoreGraphicsState();
};

// ============================================================================
// GENERADORES DE DOCUMENTOS
// ============================================================================

/**
 * Genera un recibo de pago
 */
export const generarRecibo = async (
  paciente: Paciente,
  datos: {
    folio: string;
    monto: number;
    concepto: string;
    metodoPago: string;
    fecha?: Date;
    notas?: string;
  }
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Encabezado
  let currentY = await agregarEncabezado(pdf, config, 'RECIBO DE PAGO');

  // Información del recibo
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  
  // Folio y fecha
  const fecha = datos.fecha || new Date();
  pdf.text(`Folio: ${datos.folio}`, MARGENES.left, currentY);
  pdf.text(`Fecha: ${formatearFecha(fecha)}`, pageWidth - MARGENES.right, currentY, { align: 'right' });
  currentY += 10;

  // Datos del paciente
  pdf.setFontSize(12);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Paciente:', MARGENES.left, currentY);
  currentY += 7;
  
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  pdf.text(`${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
  currentY += 5;
  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.gris);
  pdf.text(`Tel: ${paciente.telefono}`, MARGENES.left, currentY);
  currentY += 15;

  // Tabla de conceptos
  pdf.setFontSize(12);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Detalle del pago:', MARGENES.left, currentY);
  currentY += 10;

  // Rectángulo de concepto
  pdf.setFillColor(245, 247, 250);
  pdf.rect(MARGENES.left, currentY - 5, pageWidth - MARGENES.left - MARGENES.right, 30, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.gris);
  pdf.text('Concepto:', MARGENES.left + 5, currentY);
  pdf.setTextColor(COLORES.texto);
  pdf.text(datos.concepto, MARGENES.left + 5, currentY + 6);
  
  currentY += 20;
  pdf.text('Método de pago:', MARGENES.left + 5, currentY);
  pdf.text(datos.metodoPago, MARGENES.left + 50, currentY);
  currentY += 15;

  // Monto total
  pdf.setFillColor(44, 93, 125);
  pdf.rect(MARGENES.left, currentY, pageWidth - MARGENES.left - MARGENES.right, 15, 'F');
  
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('TOTAL:', MARGENES.left + 5, currentY + 10);
  pdf.text(formatearMoneda(datos.monto), pageWidth - MARGENES.right - 5, currentY + 10, { align: 'right' });
  currentY += 25;

  // Notas adicionales
  if (datos.notas) {
    pdf.setFontSize(9);
    pdf.setTextColor(COLORES.gris);
    pdf.text('Notas:', MARGENES.left, currentY);
    currentY += 5;
    pdf.setTextColor(COLORES.texto);
    const notasLines = pdf.splitTextToSize(datos.notas, pageWidth - MARGENES.left - MARGENES.right);
    pdf.text(notasLines, MARGENES.left, currentY);
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  return pdf.output('blob');
};

/**
 * Genera un consentimiento informado
 */
export const generarConsentimiento = async (
  paciente: Paciente,
  datos: {
    tipoConsentimiento: string;
    descripcionTratamiento: string;
    riesgos?: string;
    beneficios?: string;
    alternativas?: string;
    firmaBase64?: string;
  }
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGENES.left - MARGENES.right;
  
  // Encabezado
  let currentY = await agregarEncabezado(pdf, config, 'CONSENTIMIENTO INFORMADO');

  // Tipo de consentimiento
  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text(datos.tipoConsentimiento, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // Datos del paciente
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  pdf.text(`Paciente: ${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
  currentY += 5;
  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.gris);
  pdf.text(`Fecha de nacimiento: ${formatearFecha(paciente.fechaNacimiento)} (${paciente.edad} años)`, MARGENES.left, currentY);
  currentY += 5;
  pdf.text(`Fecha: ${formatearFecha(new Date())}`, MARGENES.left, currentY);
  currentY += 12;

  // Texto del consentimiento
  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.texto);

  // Descripción del tratamiento
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESCRIPCIÓN DEL TRATAMIENTO:', MARGENES.left, currentY);
  currentY += 5;
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(datos.descripcionTratamiento, contentWidth);
  pdf.text(descLines, MARGENES.left, currentY);
  currentY += descLines.length * 5 + 8;

  // Riesgos
  if (datos.riesgos) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('RIESGOS Y COMPLICACIONES:', MARGENES.left, currentY);
    currentY += 5;
    pdf.setFont('helvetica', 'normal');
    const riesgosLines = pdf.splitTextToSize(datos.riesgos, contentWidth);
    pdf.text(riesgosLines, MARGENES.left, currentY);
    currentY += riesgosLines.length * 5 + 8;
  }

  // Beneficios
  if (datos.beneficios) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('BENEFICIOS ESPERADOS:', MARGENES.left, currentY);
    currentY += 5;
    pdf.setFont('helvetica', 'normal');
    const beneficiosLines = pdf.splitTextToSize(datos.beneficios, contentWidth);
    pdf.text(beneficiosLines, MARGENES.left, currentY);
    currentY += beneficiosLines.length * 5 + 8;
  }

  // Alternativas
  if (datos.alternativas) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('ALTERNATIVAS DE TRATAMIENTO:', MARGENES.left, currentY);
    currentY += 5;
    pdf.setFont('helvetica', 'normal');
    const alternativasLines = pdf.splitTextToSize(datos.alternativas, contentWidth);
    pdf.text(alternativasLines, MARGENES.left, currentY);
    currentY += alternativasLines.length * 5 + 8;
  }

  // Declaración de consentimiento
  currentY += 5;
  pdf.setFont('helvetica', 'italic');
  const declaracion = 
    'Por medio de la presente, declaro que he sido informado(a) de manera clara y completa sobre ' +
    'la naturaleza del tratamiento, sus riesgos, beneficios y alternativas. He tenido la oportunidad ' +
    'de hacer preguntas y todas mis dudas han sido resueltas satisfactoriamente. En consecuencia, ' +
    'otorgo mi consentimiento para la realización del tratamiento descrito.';
  
  const declaracionLines = pdf.splitTextToSize(declaracion, contentWidth);
  pdf.text(declaracionLines, MARGENES.left, currentY);
  currentY += declaracionLines.length * 5 + 15;

  // Firma del paciente
  if (datos.firmaBase64) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Firma del paciente:', MARGENES.left, currentY);
    currentY += 5;
    
    try {
      pdf.addImage(datos.firmaBase64, 'PNG', MARGENES.left, currentY, 60, 20);
      currentY += 25;
    } catch (error) {
      console.error('Error al agregar firma:', error);
      currentY += 25;
    }
    
    // Línea para nombre
    pdf.setDrawColor(COLORES.gris);
    pdf.line(MARGENES.left, currentY, MARGENES.left + 60, currentY);
    pdf.text(`${paciente.nombre} ${paciente.apellidos}`, MARGENES.left + 30, currentY + 4, { align: 'center' });
  } else {
    // Espacio para firma manual
    pdf.text('Firma del paciente:', MARGENES.left, currentY);
    currentY += 20;
    pdf.setDrawColor(COLORES.gris);
    pdf.line(MARGENES.left, currentY, MARGENES.left + 60, currentY);
    currentY += 4;
    pdf.text(`${paciente.nombre} ${paciente.apellidos}`, MARGENES.left + 30, currentY, { align: 'center' });
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  return pdf.output('blob');
};

/**
 * Genera una hoja en blanco personalizable
 */
export const generarHojaEnBlanco = async (
  paciente?: Paciente,
  datos?: {
    titulo?: string;
    contenido?: string;
  }
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGENES.left - MARGENES.right;
  
  // Encabezado
  let currentY = await agregarEncabezado(pdf, config, datos?.titulo || 'DOCUMENTO');

  // Datos del paciente (si aplica)
  if (paciente) {
    pdf.setFontSize(10);
    pdf.setTextColor(COLORES.texto);
    pdf.text(`Paciente: ${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
    currentY += 5;
    pdf.setFontSize(9);
    pdf.setTextColor(COLORES.gris);
    pdf.text(`${paciente.edad} años • ${formatearFecha(paciente.fechaNacimiento)}`, MARGENES.left, currentY);
    currentY += 12;
  }

  // Contenido
  if (datos?.contenido) {
    pdf.setFontSize(10);
    pdf.setTextColor(COLORES.texto);
    const contenidoLines = pdf.splitTextToSize(datos.contenido, contentWidth);
    pdf.text(contenidoLines, MARGENES.left, currentY);
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  return pdf.output('blob');
};

/**
 * Genera PDF desde un elemento HTML (para casos avanzados)
 */
export const generarPDFDesdeHTML = async (
  elementoHTML: HTMLElement
): Promise<Blob> => {
  const canvas = await html2canvas(elementoHTML, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - MARGENES.left - MARGENES.right;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = MARGENES.top;

  pdf.addImage(imgData, 'PNG', MARGENES.left, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight + MARGENES.top;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', MARGENES.left, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output('blob');
};

// ============================================================================
// GESTIÓN DE DOCUMENTOS
// ============================================================================

/**
 * Guarda un documento en la base de datos
 */
export const guardarDocumento = async (
  pacienteId: string,
  tipo: typeof TipoDocumento[keyof typeof TipoDocumento],
  nombre: string,
  pdfBlob: Blob,
  metadata?: any
): Promise<string> => {
  // Convertir blob a base64 para guardar en IndexedDB
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });

  const documento: Documento = {
    id: crypto.randomUUID(),
    tipo,
    nombre,
    pacienteId,
    profesionalId: metadata?.profesionalId,
    profesion: obtenerProfesionPorTipoDocumento(tipo),
    fechaCreacion: new Date(),
    contenidoBase64: base64,
    firmado: !!metadata?.firmaBase64,
    metadata: metadata || {},
  };

  await db.documentos.add(documento);

  // Agregar ID del documento al paciente
  const paciente = await db.pacientes.get(pacienteId);
  if (paciente) {
    await db.pacientes.update(pacienteId, {
      documentosIds: [...paciente.documentosIds, documento.id],
    });
  }

  return documento.id;
};

/**
 * Obtiene todos los documentos de un paciente
 */
export const obtenerDocumentosPaciente = async (pacienteId: string): Promise<Documento[]> => {
  return await db.documentos.where('pacienteId').equals(pacienteId).toArray();
};

/**
 * Descarga un documento
 */
export const descargarDocumento = async (documentoId: string): Promise<void> => {
  const documento = await db.documentos.get(documentoId);
  if (!documento) throw new Error('Documento no encontrado');

  // Convertir base64 a blob
  const byteString = atob(documento.contenidoBase64.split(',')[1]);
  const mimeString = documento.contenidoBase64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  
  // Crear link de descarga
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${documento.nombre}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Elimina un documento
 */
export const eliminarDocumento = async (documentoId: string) => {
  const documento = await db.documentos.get(documentoId);
  if (!documento) throw new Error('Documento no encontrado');

  // Eliminar de la base de datos
  await db.documentos.delete(documentoId);

  // Actualizar el array del paciente
  const paciente = await db.pacientes.get(documento.pacienteId);
  if (paciente) {
    await db.pacientes.update(documento.pacienteId, {
      documentosIds: paciente.documentosIds.filter(id => id !== documentoId),
    });
  }
};

/**
 * Genera confirmación de cita en PDF
 */
export const generarConfirmacionCita = async (
  paciente: Paciente,
  datos: {
    fechaHora: Date;
    duracion: number;
    tipo: string;
    notas?: string;
  }
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGENES.left - MARGENES.right;
  
  // Encabezado
  let currentY = await agregarEncabezado(pdf, config, 'CONFIRMACIÓN DE CITA');

  // Información del paciente
  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Paciente:', MARGENES.left, currentY);
  currentY += 6;
  
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  pdf.text(`${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
  currentY += 5;
  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.gris);
  pdf.text(`Tel: ${paciente.telefono}`, MARGENES.left, currentY);
  if (paciente.email) {
    currentY += 5;
    pdf.text(`Email: ${paciente.email}`, MARGENES.left, currentY);
  }
  currentY += 15;

  // Detalles de la cita
  pdf.setFillColor(232, 244, 248); // saludvalpa-blue-light
  pdf.rect(MARGENES.left, currentY - 5, contentWidth, 50, 'F');

  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Detalles de la cita:', MARGENES.left + 5, currentY);
  currentY += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  
  // Fecha y hora
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fecha y hora:', MARGENES.left + 5, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    formatearFecha(datos.fechaHora) + ' a las ' + format(datos.fechaHora, 'HH:mm'),
    MARGENES.left + 40,
    currentY
  );
  currentY += 6;

  // Duración
  pdf.setFont('helvetica', 'bold');
  pdf.text('Duración:', MARGENES.left + 5, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${datos.duracion} minutos`, MARGENES.left + 40, currentY);
  currentY += 6;

  // Tipo
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tipo de consulta:', MARGENES.left + 5, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(datos.tipo, MARGENES.left + 40, currentY);
  currentY += 15;

  // Notas adicionales
  if (datos.notas) {
    pdf.setFontSize(9);
    pdf.setTextColor(COLORES.gris);
    pdf.text('Notas:', MARGENES.left, currentY);
    currentY += 5;
    pdf.setTextColor(COLORES.texto);
    const notasLines = pdf.splitTextToSize(datos.notas, contentWidth);
    pdf.text(notasLines, MARGENES.left, currentY);
    currentY += notasLines.length * 5 + 10;
  }

  // Información importante
  currentY += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Información importante:', MARGENES.left, currentY);
  currentY += 7;

  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.texto);
  const info = [
    '• Por favor, llegue 5-10 minutos antes de su cita.',
    '• Si necesita cancelar o reprogramar, contacte con al menos 24 horas de anticipación.',
    '• Traiga consigo cualquier estudio o documento médico relevante.',
    '• Use ropa cómoda y apropiada para la consulta.',
  ];

  info.forEach(linea => {
    pdf.text(linea, MARGENES.left, currentY);
    currentY += 5;
  });

  // Datos de contacto para confirmar/cancelar
  currentY += 10;
  pdf.setFillColor(240, 248, 240); // saludvalpa-green-light
  pdf.rect(MARGENES.left, currentY - 3, contentWidth, 20, 'F');

  pdf.setFontSize(9);
  pdf.setTextColor(COLORES.primario);
  pdf.text('Para confirmar o cancelar su cita:', MARGENES.left + 5, currentY + 2);
  currentY += 7;
  
  pdf.setTextColor(COLORES.texto);
  if (config.datosContacto?.telefono) {
    pdf.text(`Tel: ${config.datosContacto.telefono}`, MARGENES.left + 5, currentY);
  }
  if (config.datosContacto?.email) {
    pdf.text(`Email: ${config.datosContacto.email}`, MARGENES.left + 5, currentY + 5);
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  return pdf.output('blob');
};

/**
 * Convierte un Blob a base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remover el prefijo data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Genera una cotización en PDF
 */
export const generarCotizacion = async (
  cotizacion: any, // Cotizacion type
  paciente: Paciente
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let currentY = await agregarEncabezado(pdf, config, 'COTIZACIÓN');

  // Información del paciente
  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text('DATOS DEL CLIENTE', MARGENES.left, currentY);
  currentY += 7;

  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  pdf.text(`Nombre: ${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
  currentY += 5;
  if (paciente.telefono) {
    pdf.text(`Teléfono: ${paciente.telefono || 'N/A'}`, MARGENES.left, currentY);
    currentY += 5;
  }
  if (paciente.email) {
    pdf.text(`Email: ${paciente.email || 'N/A'}`, MARGENES.left, currentY);
    currentY += 5;
  }
  pdf.text(`Fecha: ${formatearFecha(cotizacion.fecha)}`, MARGENES.left, currentY);
  currentY += 5;
  pdf.text(`Válida por: ${cotizacion.validezDias} días`, MARGENES.left, currentY);
  currentY += 10;

  // Servicios
  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text('SERVICIOS', MARGENES.left, currentY);
  currentY += 7;

  // Tabla de servicios
  pdf.setFontSize(9);
  pdf.setDrawColor(200, 200, 200);
  
  // Header de tabla
  pdf.setFillColor(240, 240, 240);
  pdf.rect(MARGENES.left, currentY, pageWidth - MARGENES.left - MARGENES.right, 7, 'F');
  pdf.setTextColor(COLORES.texto);
  pdf.text('Servicio', MARGENES.left + 2, currentY + 5);
  pdf.text('Cant.', pageWidth - 80, currentY + 5);
  pdf.text('Precio', pageWidth - 55, currentY + 5);
  pdf.text('Total', pageWidth - MARGENES.right - 2, currentY + 5, { align: 'right' });
  currentY += 8;

  // Items
  pdf.setFontSize(9);
  cotizacion.servicios.forEach((item: any) => {
    pdf.text(item.nombre, MARGENES.left + 2, currentY + 4);
    pdf.text(item.cantidad.toString(), pageWidth - 80, currentY + 4);
    pdf.text(formatearMoneda(item.precioUnitario), pageWidth - 55, currentY + 4);
    pdf.text(formatearMoneda(item.total), pageWidth - MARGENES.right - 2, currentY + 4, { align: 'right' });
    
    if (item.descripcion) {
      pdf.setFontSize(8);
      pdf.setTextColor(COLORES.gris);
      pdf.text(item.descripcion, MARGENES.left + 5, currentY + 8);
      currentY += 4;
    }
    
    currentY += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(COLORES.texto);
  });

  currentY += 5;

  // Totales
  pdf.setFontSize(10);
  const totalesX = pageWidth - MARGENES.right - 2;
  
  pdf.text('Subtotal:', pageWidth - 70, currentY);
  pdf.text(formatearMoneda(cotizacion.subtotal), totalesX, currentY, { align: 'right' });
  currentY += 6;

  if (cotizacion.descuento && cotizacion.descuento > 0) {
    pdf.setTextColor(200, 0, 0);
    pdf.text('Descuento:', pageWidth - 70, currentY);
    pdf.text(`-${formatearMoneda(cotizacion.descuento)}`, totalesX, currentY, { align: 'right' });
    currentY += 6;
  }

  // Total destacado
  pdf.setFontSize(12);
  pdf.setTextColor(COLORES.primario);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL:', pageWidth - 70, currentY);
  pdf.text(formatearMoneda(cotizacion.total), pageWidth - MARGENES.right - 2, currentY, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  currentY += 10;

  // Notas si existen
  if (cotizacion.notas) {
    pdf.setFontSize(9);
    pdf.setTextColor(COLORES.gris);
    pdf.text('Notas:', MARGENES.left, currentY);
    currentY += 5;
    const notasLineas = pdf.splitTextToSize(cotizacion.notas, pageWidth - MARGENES.left - MARGENES.right);
    pdf.text(notasLineas, MARGENES.left, currentY);
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  return pdf.output('blob');
};

/**
 * Genera un reporte de sesión completo
 */
export const generarReporteSesion = async (
  sesion: Sesion,
  paciente: Paciente,
  profesion: TipoProfesion
): Promise<Blob> => {
  const config = await db.configuracion.get('1');
  if (!config) throw new Error('Configuración no encontrada');

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let currentY = await agregarEncabezado(pdf, config, 'REPORTE DE SESIÓN');

  // Información del paciente
  pdf.setFontSize(11);
  pdf.setTextColor(COLORES.primario);
  pdf.text('DATOS DEL PACIENTE', MARGENES.left, currentY);
  currentY += 7;

  pdf.setFontSize(10);
  pdf.setTextColor(COLORES.texto);
  pdf.text(`Nombre: ${paciente.nombre} ${paciente.apellidos}`, MARGENES.left, currentY);
  currentY += 5;
  pdf.text(`Edad: ${paciente.edad} años`, MARGENES.left, currentY);
  currentY += 5;
  pdf.text(`Fecha de sesión: ${formatearFecha(sesion.fecha)}`, MARGENES.left, currentY);
  currentY += 5;
  if (sesion.duracion) {
    pdf.text(`Duración: ${sesion.duracion} minutos`, MARGENES.left, currentY);
    currentY += 5;
  }
  pdf.text(`Tipo de sesión: ${sesion.tipo}`, MARGENES.left, currentY);
  currentY += 10;

  // Notas clínicas
  if (sesion.notas) {
    pdf.setFontSize(11);
    pdf.setTextColor(COLORES.primario);
    pdf.text('NOTAS CLÍNICAS', MARGENES.left, currentY);
    currentY += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(COLORES.texto);
    const notasLineas = pdf.splitTextToSize(sesion.notas, pageWidth - MARGENES.left - MARGENES.right);
    pdf.text(notasLineas, MARGENES.left, currentY);
    currentY += notasLineas.length * 5 + 5;
  }

  // Materiales utilizados
  if (sesion.materialesUtilizados && sesion.materialesUtilizados.length > 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(COLORES.primario);
    pdf.text('MATERIALES UTILIZADOS', MARGENES.left, currentY);
    currentY += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(COLORES.texto);
    sesion.materialesUtilizados.forEach((material: any) => {
      let texto = `• ${material.nombre}`;
      if (material.cantidad > 1) texto += ` (x${material.cantidad})`;
      if (material.costo > 0) texto += ` - $${material.costo.toFixed(2)}`;
      pdf.text(texto, MARGENES.left + 5, currentY);
      currentY += 5;
    });
    currentY += 5;
  }

  // Medios físicos aplicados
  if (sesion.mediosFisicos && sesion.mediosFisicos.length > 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(COLORES.primario);
    pdf.text('MEDIOS FÍSICOS APLICADOS', MARGENES.left, currentY);
    currentY += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(COLORES.texto);
    sesion.mediosFisicos.forEach((medio: string) => {
      pdf.text(`• ${medio}`, MARGENES.left + 5, currentY);
      currentY += 5;
    });
    currentY += 5;
  }

  // Datos específicos por profesión
  if (sesion.datosEspecificosProfesion) {
    const datos = sesion.datosEspecificosProfesion;

    if (profesion === 'fisioterapia') {
      pdf.setFontSize(11);
      pdf.setTextColor(COLORES.primario);
      pdf.text('EVALUACIÓN FISIOTERAPÉUTICA', MARGENES.left, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(COLORES.texto);

      if (datos.escalaDolor !== undefined) {
        pdf.text(`Escala de dolor: ${datos.escalaDolor}/10`, MARGENES.left, currentY);
        currentY += 5;
      }

      if (datos.areaDolor) {
        pdf.text(`Área de dolor: ${datos.areaDolor}`, MARGENES.left, currentY);
        currentY += 5;
      }

      if (datos.tecnicasAplicadas && datos.tecnicasAplicadas.length > 0) {
        pdf.text('Técnicas aplicadas:', MARGENES.left, currentY);
        currentY += 5;
        datos.tecnicasAplicadas.forEach((tecnica: string) => {
          pdf.text(`• ${tecnica}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.ejerciciosRealizados && datos.ejerciciosRealizados.length > 0) {
        pdf.text('Ejercicios realizados:', MARGENES.left, currentY);
        currentY += 5;
        datos.ejerciciosRealizados.forEach((ejercicio: string) => {
          pdf.text(`• ${ejercicio}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }
      currentY += 5;
    }

    if (profesion === 'psicologia') {
      pdf.setFontSize(11);
      pdf.setTextColor(COLORES.primario);
      pdf.text('EVALUACIÓN PSICOLÓGICA', MARGENES.left, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(COLORES.texto);

      if (datos.estadoEmocional) {
        pdf.text(`Estado emocional: ${datos.estadoEmocional}`, MARGENES.left, currentY);
        currentY += 5;
      }

      if (datos.estadoMental) {
        const mentalLineas = pdf.splitTextToSize(`Estado mental: ${datos.estadoMental}`, pageWidth - MARGENES.left - MARGENES.right);
        pdf.text(mentalLineas, MARGENES.left, currentY);
        currentY += mentalLineas.length * 5;
      }

      if (datos.tecnicasAplicadas && datos.tecnicasAplicadas.length > 0) {
        pdf.text('Técnicas terapéuticas:', MARGENES.left, currentY);
        currentY += 5;
        datos.tecnicasAplicadas.forEach((tecnica: string) => {
          pdf.text(`• ${tecnica}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.tareasAsignadas && datos.tareasAsignadas.length > 0) {
        pdf.text('Tareas asignadas:', MARGENES.left, currentY);
        currentY += 5;
        datos.tareasAsignadas.forEach((tarea: string) => {
          pdf.text(`• ${tarea}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.evolucion?.progreso) {
        pdf.text('Evolución:', MARGENES.left, currentY);
        currentY += 5;
        const evolucionLineas = pdf.splitTextToSize(datos.evolucion.progreso, pageWidth - MARGENES.left - MARGENES.right - 5);
        pdf.text(evolucionLineas, MARGENES.left + 5, currentY);
        currentY += evolucionLineas.length * 5;
      }
      currentY += 5;
    }

    if (profesion === 'nutricion') {
      pdf.setFontSize(11);
      pdf.setTextColor(COLORES.primario);
      pdf.text('DETALLES DEL SERVICIO', MARGENES.left, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(COLORES.texto);

      if (datos.serviciosAplicados && datos.serviciosAplicados.length > 0) {
        pdf.text('Servicios:', MARGENES.left, currentY);
        currentY += 5;
        datos.serviciosAplicados.forEach((servicio: any) => {
          pdf.text(`• ${servicio.tipo}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.coloresAplicados && datos.coloresAplicados.length > 0) {
        pdf.text('Colores utilizados:', MARGENES.left, currentY);
        currentY += 5;
        datos.coloresAplicados.forEach((color: any) => {
          pdf.text(`• ${color.nombre}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.productosUtilizados && datos.productosUtilizados.length > 0) {
        pdf.text('Productos:', MARGENES.left, currentY);
        currentY += 5;
        datos.productosUtilizados.forEach((producto: string) => {
          pdf.text(`• ${producto}`, MARGENES.left + 5, currentY);
          currentY += 5;
        });
      }

      if (datos.recomendacionesCuidado && datos.recomendacionesCuidado.length > 0) {
        pdf.text('Recomendaciones:', MARGENES.left, currentY);
        currentY += 5;
        datos.recomendacionesCuidado.forEach((rec: string) => {
          const recLineas = pdf.splitTextToSize(`• ${rec}`, pageWidth - MARGENES.left - MARGENES.right - 5);
          pdf.text(recLineas, MARGENES.left + 5, currentY);
          currentY += recLineas.length * 5;
        });
      }
      currentY += 5;
    }
  }

  // Costo
  if (sesion.costo && sesion.costo > 0) {
    pdf.setFontSize(12);
    pdf.setTextColor(COLORES.primario);
    pdf.text(`Total: ${formatearMoneda(sesion.costo)}`, pageWidth - MARGENES.right, currentY, { align: 'right' });
  }

  // Marca de agua
  agregarMarcaDeAgua(pdf, config.licencia?.tipo === 'gratuita');

  // Pie de página
  agregarPieDePagina(pdf, config);

  // Guardar documento en la base de datos
  const folio = generarFolio(TipoDocumento.REPORTE_SESION);
  const pdfBlob = pdf.output('blob');
  const pdfBase64 = await blobToBase64(pdfBlob);

  const documento: Documento = {
    id: crypto.randomUUID(),
    tipo: TipoDocumento.REPORTE_SESION,
    nombre: `Reporte_${folio}_${paciente.apellidos}`,
    pacienteId: paciente.id,
    profesionalId: sesion.profesionalId,
    profesion,
    fechaCreacion: new Date(),
    contenidoBase64: pdfBase64,
    firmado: false,
    metadata: {
      folio,
      sesionId: sesion.id,
      licenciaTipo: config.licencia?.tipo,
    },
  };

  await db.documentos.add(documento);

  // Actualizar sesión con el documento generado
  await db.sesiones.update(sesion.id, {
    documentosGenerados: [...(sesion.documentosGenerados || []), documento.id],
  });

  // Actualizar paciente con el nuevo documento
  const pacienteDB = await db.pacientes.get(paciente.id);
  if (pacienteDB) {
    await db.pacientes.update(paciente.id, {
      documentosIds: [...pacienteDB.documentosIds, documento.id],
    });
  }

  // Descargar
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfBlob);
  link.download = `Reporte_${folio}_${paciente.apellidos}.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);

  return pdfBlob;
};

/**
 * Genera un folio único para documentos
 */
export const generarFolio = (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]): string => {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().substring(2);
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const dia = fecha.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  let prefijo = 'DOC';
  if (tipo === TipoDocumento.RECIBO_PAGO) prefijo = 'REC';
  if (tipo === TipoDocumento.CONSENTIMIENTO_INFORMADO) prefijo = 'CON';
  if (tipo === TipoDocumento.REPORTE_SESION) prefijo = 'REP';
  if (tipo === TipoDocumento.CONFIRMACION_CITA) prefijo = 'CIT';
  
  return `${prefijo}-${año}${mes}${dia}-${random}`;
};

// ============================================================================
// DOCUMENTOS DE PSICOLOGÍA
// ============================================================================

