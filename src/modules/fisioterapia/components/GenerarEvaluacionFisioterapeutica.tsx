// ============================================================================
// saludvalpa 3.0 - GENERAR EVALUACIÓN FISIOTERAPÉUTICA
// Modal para generar evaluación fisioterapéutica completa en PDF
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../../../types';
import { TipoDocumento } from '../../../types';
import { guardarDocumento, generarFolio } from '../../../services/pdfService';
import { descargarArchivo } from '../../../utils/helpers';
import Input from '../../../components/shared/Input';
import Button from '../../../components/shared/Button';
import jsPDF from 'jspdf';
import { db } from '../../../db/database';
import { formatearFecha } from '../../../utils/helpers';

interface GenerarEvaluacionFisioterapeuticaProps {
  paciente: Paciente;
  onExito: () => void;
  onCancelar: () => void;
}

interface DatosEvaluacion {
  fechaEvaluacion: string;
  motivoConsulta: string;
  historiaEnfermedad: string;
  // Evaluación postural
  postura: {
    frontal: string;
    lateral: string;
    posterior: string;
  };
  // Evaluación de marcha
  marcha: string;
  // Goniometría (rangos de movimiento)
  goniometria: {
    hombro: { flexion: string; extension: string; abduccion: string; rotacionInterna: string; rotacionExterna: string };
    codo: { flexion: string; extension: string };
    muneca: { flexion: string; extension: string };
    cadera: { flexion: string; extension: string; abduccion: string; aduccion: string };
    rodilla: { flexion: string; extension: string };
    tobillo: { dorsiflexion: string; flexionPlantar: string };
  };
  // Fuerza muscular (escala 0-5)
  fuerzaMuscular: string;
  // Sensibilidad
  sensibilidad: string;
  // Dolor
  escalaDolor: number;
  areaDolor: string;
  caracteristicasDolor: string;
  // Pruebas especiales
  pruebasEspeciales: string;
  // Diagnóstico y objetivos
  diagnosticoFisioterapeutico: string;
  objetivosTratamiento: string;
  pronostico: string;
}

const GenerarEvaluacionFisioterapeutica = ({ paciente, onExito, onCancelar }: GenerarEvaluacionFisioterapeuticaProps) => {
  const [generando, setGenerando] = useState(false);
  const [paso, setPaso] = useState<'formulario' | 'goniometria'>('formulario');
  
  const hoy = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DatosEvaluacion>({
    fechaEvaluacion: hoy,
    motivoConsulta: '',
    historiaEnfermedad: '',
    postura: {
      frontal: '',
      lateral: '',
      posterior: '',
    },
    marcha: '',
    goniometria: {
      hombro: { flexion: '', extension: '', abduccion: '', rotacionInterna: '', rotacionExterna: '' },
      codo: { flexion: '', extension: '' },
      muneca: { flexion: '', extension: '' },
      cadera: { flexion: '', extension: '', abduccion: '', aduccion: '' },
      rodilla: { flexion: '', extension: '' },
      tobillo: { dorsiflexion: '', flexionPlantar: '' },
    },
    fuerzaMuscular: '',
    sensibilidad: '',
    escalaDolor: 0,
    areaDolor: '',
    caracteristicasDolor: '',
    pruebasEspeciales: '',
    diagnosticoFisioterapeutico: '',
    objetivosTratamiento: '',
    pronostico: '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.motivoConsulta.trim()) {
      nuevosErrores.motivoConsulta = 'El motivo de consulta es requerido';
    }

    if (!formData.diagnosticoFisioterapeutico.trim()) {
      nuevosErrores.diagnosticoFisioterapeutico = 'El diagnóstico fisioterapéutico es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleContinuar = () => {
    if (!validarFormulario()) return;
    setPaso('goniometria');
  };

  const generarPDF = async () => {
    const config = await db.configuracion.get('1');
    if (!config) throw new Error('Configuración no encontrada');

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = margin;

    // Función auxiliar para verificar espacio y agregar página
    const checkPageBreak = (neededSpace: number) => {
      if (currentY + neededSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Función auxiliar para agregar texto con wrap
    const addTextWithWrap = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * (fontSize * 0.35); // Retorna altura aproximada
    };

    // =========================================================================
    // ENCABEZADO
    // =========================================================================
    pdf.setFontSize(18);
    pdf.setTextColor(44, 93, 125); // saludvalpa-blue
    pdf.text('EVALUACIÓN FISIOTERAPÉUTICA', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Información del profesional
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(config.branding.nombreProfesional || 'Profesional', pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    if (config.branding.credenciales) {
      pdf.text(config.branding.credenciales, pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;
    }
    if (config.datosContacto?.telefono) {
      pdf.text(`Tel: ${config.datosContacto.telefono}`, pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;
    }
    currentY += 5;

    // Línea separadora
    pdf.setDrawColor(95, 180, 180); // turquesa
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // =========================================================================
    // DATOS DEL PACIENTE
    // =========================================================================
    pdf.setFillColor(232, 244, 248); // bg-blue-50
    pdf.rect(margin, currentY, contentWidth, 30, 'F');
    
    currentY += 7;
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL PACIENTE', margin + 5, currentY);
    currentY += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${paciente.nombre} ${paciente.apellidos}`, margin + 5, currentY);
    currentY += 5;
    
    const edad = paciente.edad || Math.floor((new Date().getTime() - new Date(paciente.fechaNacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    pdf.text(`Edad: ${edad} años  |  Género: ${paciente.genero}  |  Tel: ${paciente.telefono}`, margin + 5, currentY);
    currentY += 5;
    
    pdf.text(`Fecha de evaluación: ${formatearFecha(new Date(formData.fechaEvaluacion))}`, margin + 5, currentY);
    currentY += 10;

    // =========================================================================
    // MOTIVO DE CONSULTA E HISTORIA
    // =========================================================================
    checkPageBreak(30);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MOTIVO DE CONSULTA', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaMotivo = addTextWithWrap(formData.motivoConsulta, margin, currentY, contentWidth, 10);
    currentY += alturaMotivo + 8;

    if (formData.historiaEnfermedad) {
      checkPageBreak(25);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HISTORIA DE LA ENFERMEDAD ACTUAL', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaHistoria = addTextWithWrap(formData.historiaEnfermedad, margin, currentY, contentWidth, 10);
      currentY += alturaHistoria + 8;
    }

    // =========================================================================
    // EVALUACIÓN POSTURAL
    // =========================================================================
    checkPageBreak(50);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EVALUACIÓN POSTURAL', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');

    if (formData.postura.frontal) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vista frontal:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      const alturaFrontal = addTextWithWrap(formData.postura.frontal, margin + 25, currentY, contentWidth - 25, 10);
      currentY += Math.max(5, alturaFrontal) + 3;
    }

    if (formData.postura.lateral) {
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vista lateral:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      const alturaLateral = addTextWithWrap(formData.postura.lateral, margin + 25, currentY, contentWidth - 25, 10);
      currentY += Math.max(5, alturaLateral) + 3;
    }

    if (formData.postura.posterior) {
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Vista posterior:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      const alturaPosterior = addTextWithWrap(formData.postura.posterior, margin + 25, currentY, contentWidth - 25, 10);
      currentY += Math.max(5, alturaPosterior) + 3;
    }

    if (!formData.postura.frontal && !formData.postura.lateral && !formData.postura.posterior) {
      pdf.setTextColor(107, 114, 128);
      pdf.text('No se registraron datos posturales', margin, currentY);
      currentY += 6;
    }
    currentY += 5;

    // =========================================================================
    // EVALUACIÓN DE MARCHA
    // =========================================================================
    if (formData.marcha) {
      checkPageBreak(20);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EVALUACIÓN DE MARCHA', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaMarcha = addTextWithWrap(formData.marcha, margin, currentY, contentWidth, 10);
      currentY += alturaMarcha + 8;
    }

    // =========================================================================
    // GONIOMETRÍA
    // =========================================================================
    checkPageBreak(80);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GONIOMETRÍA - RANGOS DE MOVIMIENTO', margin, currentY);
    currentY += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');

    const gonio = formData.goniometria;
    let hayDatosGonio = false;

    // Hombro
    if (gonio.hombro.flexion || gonio.hombro.extension || gonio.hombro.abduccion) {
      hayDatosGonio = true;
      checkPageBreak(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HOMBRO:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.hombro.flexion) pdf.text(`Flexión: ${gonio.hombro.flexion}° (N: 0-180°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.hombro.extension) pdf.text(`Extensión: ${gonio.hombro.extension}° (N: 0-60°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.hombro.abduccion) pdf.text(`Abducción: ${gonio.hombro.abduccion}° (N: 0-180°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.hombro.rotacionInterna) pdf.text(`Rotación interna: ${gonio.hombro.rotacionInterna}° (N: 0-70°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.hombro.rotacionExterna) pdf.text(`Rotación externa: ${gonio.hombro.rotacionExterna}° (N: 0-90°)`, margin + 5, currentY);
      currentY += 6;
    }

    // Codo
    if (gonio.codo.flexion || gonio.codo.extension) {
      hayDatosGonio = true;
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CODO:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.codo.flexion) pdf.text(`Flexión: ${gonio.codo.flexion}° (N: 0-150°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.codo.extension) pdf.text(`Extensión: ${gonio.codo.extension}° (N: 0°)`, margin + 5, currentY);
      currentY += 6;
    }

    // Muñeca
    if (gonio.muneca.flexion || gonio.muneca.extension) {
      hayDatosGonio = true;
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MUÑECA:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.muneca.flexion) pdf.text(`Flexión: ${gonio.muneca.flexion}° (N: 0-80°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.muneca.extension) pdf.text(`Extensión: ${gonio.muneca.extension}° (N: 0-70°)`, margin + 5, currentY);
      currentY += 6;
    }

    // Cadera
    if (gonio.cadera.flexion || gonio.cadera.extension || gonio.cadera.abduccion) {
      hayDatosGonio = true;
      checkPageBreak(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CADERA:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.cadera.flexion) pdf.text(`Flexión: ${gonio.cadera.flexion}° (N: 0-120°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.cadera.extension) pdf.text(`Extensión: ${gonio.cadera.extension}° (N: 0-30°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.cadera.abduccion) pdf.text(`Abducción: ${gonio.cadera.abduccion}° (N: 0-45°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.cadera.aduccion) pdf.text(`Aducción: ${gonio.cadera.aduccion}° (N: 0-30°)`, margin + 5, currentY);
      currentY += 6;
    }

    // Rodilla
    if (gonio.rodilla.flexion || gonio.rodilla.extension) {
      hayDatosGonio = true;
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RODILLA:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.rodilla.flexion) pdf.text(`Flexión: ${gonio.rodilla.flexion}° (N: 0-135°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.rodilla.extension) pdf.text(`Extensión: ${gonio.rodilla.extension}° (N: 0°)`, margin + 5, currentY);
      currentY += 6;
    }

    // Tobillo
    if (gonio.tobillo.dorsiflexion || gonio.tobillo.flexionPlantar) {
      hayDatosGonio = true;
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOBILLO:', margin, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      if (gonio.tobillo.dorsiflexion) pdf.text(`Dorsiflexión: ${gonio.tobillo.dorsiflexion}° (N: 0-20°)`, margin + 5, currentY);
      currentY += 4;
      if (gonio.tobillo.flexionPlantar) pdf.text(`Flexión plantar: ${gonio.tobillo.flexionPlantar}° (N: 0-50°)`, margin + 5, currentY);
      currentY += 6;
    }

    if (!hayDatosGonio) {
      pdf.setTextColor(107, 114, 128);
      pdf.text('No se registraron mediciones goniométricas', margin, currentY);
      currentY += 8;
    }

    // =========================================================================
    // FUERZA MUSCULAR Y SENSIBILIDAD
    // =========================================================================
    if (formData.fuerzaMuscular) {
      checkPageBreak(15);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FUERZA MUSCULAR', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaFuerza = addTextWithWrap(formData.fuerzaMuscular, margin, currentY, contentWidth, 10);
      currentY += alturaFuerza + 8;
    }

    if (formData.sensibilidad) {
      checkPageBreak(15);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SENSIBILIDAD', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaSensibilidad = addTextWithWrap(formData.sensibilidad, margin, currentY, contentWidth, 10);
      currentY += alturaSensibilidad + 8;
    }

    // =========================================================================
    // EVALUACIÓN DEL DOLOR
    // =========================================================================
    checkPageBreak(30);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EVALUACIÓN DEL DOLOR', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Escala EVA: ${formData.escalaDolor}/10`, margin, currentY);
    currentY += 5;
    
    if (formData.areaDolor) {
      pdf.text(`Área de dolor: ${formData.areaDolor}`, margin, currentY);
      currentY += 5;
    }

    if (formData.caracteristicasDolor) {
      pdf.text('Características:', margin, currentY);
      currentY += 5;
      const alturaCaract = addTextWithWrap(formData.caracteristicasDolor, margin, currentY, contentWidth, 10);
      currentY += alturaCaract + 3;
    }
    currentY += 5;

    // =========================================================================
    // PRUEBAS ESPECIALES
    // =========================================================================
    if (formData.pruebasEspeciales) {
      checkPageBreak(20);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRUEBAS ESPECIALES', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaPruebas = addTextWithWrap(formData.pruebasEspeciales, margin, currentY, contentWidth, 10);
      currentY += alturaPruebas + 8;
    }

    // =========================================================================
    // DIAGNÓSTICO Y OBJETIVOS
    // =========================================================================
    checkPageBreak(40);
    pdf.setFillColor(232, 244, 248);
    pdf.rect(margin, currentY, contentWidth, 5, 'F');
    currentY += 5;

    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DIAGNÓSTICO FISIOTERAPÉUTICO', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaDiag = addTextWithWrap(formData.diagnosticoFisioterapeutico, margin, currentY, contentWidth, 10);
    currentY += alturaDiag + 8;

    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBJETIVOS DEL TRATAMIENTO', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaObj = addTextWithWrap(formData.objetivosTratamiento, margin, currentY, contentWidth, 10);
    currentY += alturaObj + 8;

    if (formData.pronostico) {
      checkPageBreak(15);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRONÓSTICO', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaPron = addTextWithWrap(formData.pronostico, margin, currentY, contentWidth, 10);
      currentY += alturaPron + 8;
    }

    // =========================================================================
    // PIE DE PÁGINA
    // =========================================================================
    const numPaginas = (pdf as any).internal.pages.length - 1;
    for (let i = 1; i <= numPaginas; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `Página ${i} de ${numPaginas}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Marca de agua si es licencia gratuita
      if (config.licencia.tipo === 'gratuita' && config.branding.mostrarMarcaDeAgua) {
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Creado con SaludValpa.app - Versión gratuita', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }
    }

    return pdf.output('blob');
  };

  const handleGenerar = async () => {
    if (!validarFormulario()) return;
    
    setGenerando(true);
    try {
      const folio = generarFolio(TipoDocumento.EVALUACION_FISIOTERAPEUTICA);
      
      const pdfBlob = await generarPDF();

      // Guardar en base de datos
      await guardarDocumento(
        paciente.id,
        TipoDocumento.EVALUACION_FISIOTERAPEUTICA,
        `Evaluación Fisioterapéutica ${folio}`,
        pdfBlob,
        {
          folio,
          fechaEvaluacion: formData.fechaEvaluacion,
          diagnostico: formData.diagnosticoFisioterapeutico,
          escalaDolor: formData.escalaDolor,
        }
      );

      // Descargar automáticamente
      descargarArchivo(
        pdfBlob, 
        `Evaluacion_Fisioterapeutica_${folio}_${paciente.apellidos}.pdf`
      );

      onExito();
    } catch (error) {
      console.error('Error al generar evaluación:', error);
      alert('Error al generar la evaluación fisioterapéutica');
    } finally {
      setGenerando(false);
    }
  };

  if (paso === 'goniometria') {
    return (
      <div className="space-y-6">
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Información básica completada
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Goniometría y Evaluaciones Complementarias</h3>
        <p className="text-sm text-gray-600">Completa las mediciones que sean relevantes para este paciente.</p>

        {/* Hombro */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Hombro</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input
              label="Flexión (°)"
              type="number"
              value={formData.goniometria.hombro.flexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, hombro: { ...prev.goniometria.hombro, flexion: e.target.value }}
              }))}
              placeholder="0-180"
            />
            <Input
              label="Extensión (°)"
              type="number"
              value={formData.goniometria.hombro.extension}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, hombro: { ...prev.goniometria.hombro, extension: e.target.value }}
              }))}
              placeholder="0-60"
            />
            <Input
              label="Abducción (°)"
              type="number"
              value={formData.goniometria.hombro.abduccion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, hombro: { ...prev.goniometria.hombro, abduccion: e.target.value }}
              }))}
              placeholder="0-180"
            />
            <Input
              label="Rot. Interna (°)"
              type="number"
              value={formData.goniometria.hombro.rotacionInterna}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, hombro: { ...prev.goniometria.hombro, rotacionInterna: e.target.value }}
              }))}
              placeholder="0-70"
            />
            <Input
              label="Rot. Externa (°)"
              type="number"
              value={formData.goniometria.hombro.rotacionExterna}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, hombro: { ...prev.goniometria.hombro, rotacionExterna: e.target.value }}
              }))}
              placeholder="0-90"
            />
          </div>
        </div>

        {/* Codo */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Codo</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Flexión (°)"
              type="number"
              value={formData.goniometria.codo.flexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, codo: { ...prev.goniometria.codo, flexion: e.target.value }}
              }))}
              placeholder="0-150"
            />
            <Input
              label="Extensión (°)"
              type="number"
              value={formData.goniometria.codo.extension}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, codo: { ...prev.goniometria.codo, extension: e.target.value }}
              }))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Muñeca */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Muñeca</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Flexión (°)"
              type="number"
              value={formData.goniometria.muneca.flexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, muneca: { ...prev.goniometria.muneca, flexion: e.target.value }}
              }))}
              placeholder="0-80"
            />
            <Input
              label="Extensión (°)"
              type="number"
              value={formData.goniometria.muneca.extension}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, muneca: { ...prev.goniometria.muneca, extension: e.target.value }}
              }))}
              placeholder="0-70"
            />
          </div>
        </div>

        {/* Cadera */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Cadera</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input
              label="Flexión (°)"
              type="number"
              value={formData.goniometria.cadera.flexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, cadera: { ...prev.goniometria.cadera, flexion: e.target.value }}
              }))}
              placeholder="0-120"
            />
            <Input
              label="Extensión (°)"
              type="number"
              value={formData.goniometria.cadera.extension}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, cadera: { ...prev.goniometria.cadera, extension: e.target.value }}
              }))}
              placeholder="0-30"
            />
            <Input
              label="Abducción (°)"
              type="number"
              value={formData.goniometria.cadera.abduccion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, cadera: { ...prev.goniometria.cadera, abduccion: e.target.value }}
              }))}
              placeholder="0-45"
            />
            <Input
              label="Aducción (°)"
              type="number"
              value={formData.goniometria.cadera.aduccion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, cadera: { ...prev.goniometria.cadera, aduccion: e.target.value }}
              }))}
              placeholder="0-30"
            />
          </div>
        </div>

        {/* Rodilla */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Rodilla</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Flexión (°)"
              type="number"
              value={formData.goniometria.rodilla.flexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, rodilla: { ...prev.goniometria.rodilla, flexion: e.target.value }}
              }))}
              placeholder="0-135"
            />
            <Input
              label="Extensión (°)"
              type="number"
              value={formData.goniometria.rodilla.extension}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, rodilla: { ...prev.goniometria.rodilla, extension: e.target.value }}
              }))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Tobillo */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Tobillo</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Dorsiflexión (°)"
              type="number"
              value={formData.goniometria.tobillo.dorsiflexion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, tobillo: { ...prev.goniometria.tobillo, dorsiflexion: e.target.value }}
              }))}
              placeholder="0-20"
            />
            <Input
              label="Flexión Plantar (°)"
              type="number"
              value={formData.goniometria.tobillo.flexionPlantar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                goniometria: { ...prev.goniometria, tobillo: { ...prev.goniometria.tobillo, flexionPlantar: e.target.value }}
              }))}
              placeholder="0-50"
            />
          </div>
        </div>

        {/* Fuerza muscular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuerza muscular (Escala 0-5)
          </label>
          <textarea
            value={formData.fuerzaMuscular}
            onChange={(e) => setFormData(prev => ({ ...prev, fuerzaMuscular: e.target.value }))}
            placeholder="Ej: 4/5 en cuádriceps bilateral, 5/5 en isquiotibiales..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Sensibilidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sensibilidad
          </label>
          <textarea
            value={formData.sensibilidad}
            onChange={(e) => setFormData(prev => ({ ...prev, sensibilidad: e.target.value }))}
            placeholder="Ej: Sensibilidad conservada en miembros inferiores..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Pruebas especiales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pruebas especiales
          </label>
          <textarea
            value={formData.pruebasEspeciales}
            onChange={(e) => setFormData(prev => ({ ...prev, pruebasEspeciales: e.target.value }))}
            placeholder="Ej: Test de Lasègue positivo, Test de Thomas negativo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => setPaso('formulario')}
            variant="outline"
            className="flex-1"
          >
            ← Volver
          </Button>
          <Button
            onClick={handleGenerar}
            variant="primary"
            disabled={generando}
            className="flex-1"
          >
            {generando ? 'Generando PDF...' : '✓ Generar Evaluación'}
          </Button>
        </div>

        {generando && (
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-saludvalpa-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 mt-2">Generando PDF...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
        <p className="text-sm text-saludvalpa-blue">
          <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
        </p>
      </div>

      <Input
        label="Fecha de evaluación *"
        type="date"
        value={formData.fechaEvaluacion}
        onChange={(e) => setFormData(prev => ({ ...prev, fechaEvaluacion: e.target.value }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Motivo de consulta *
        </label>
        <textarea
          value={formData.motivoConsulta}
          onChange={(e) => setFormData(prev => ({ ...prev, motivoConsulta: e.target.value }))}
          placeholder="Ej: Dolor lumbar crónico de 3 meses de evolución..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          autoFocus
        />
        {errores.motivoConsulta && (
          <p className="text-sm text-red-600 mt-1">{errores.motivoConsulta}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Historia de la enfermedad actual
        </label>
        <textarea
          value={formData.historiaEnfermedad}
          onChange={(e) => setFormData(prev => ({ ...prev, historiaEnfermedad: e.target.value }))}
          placeholder="Describe el inicio, evolución y tratamientos previos..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Evaluación postural */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Evaluación Postural</h3>
        
        <div className="space-y-3">
          <Input
            label="Vista frontal"
            value={formData.postura.frontal}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              postura: { ...prev.postura, frontal: e.target.value }
            }))}
            placeholder="Ej: Simetría de hombros, pelvis nivelada..."
          />
          
          <Input
            label="Vista lateral"
            value={formData.postura.lateral}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              postura: { ...prev.postura, lateral: e.target.value }
            }))}
            placeholder="Ej: Hiperlordosis lumbar, cabeza adelantada..."
          />
          
          <Input
            label="Vista posterior"
            value={formData.postura.posterior}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              postura: { ...prev.postura, posterior: e.target.value }
            }))}
            placeholder="Ej: Escoliosis leve, escápulas aladas..."
          />
        </div>
      </div>

      {/* Marcha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Evaluación de marcha
        </label>
        <textarea
          value={formData.marcha}
          onChange={(e) => setFormData(prev => ({ ...prev, marcha: e.target.value }))}
          placeholder="Ej: Marcha antálgica con cojera leve, fase de apoyo acortada..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={2}
        />
      </div>

      {/* Dolor */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Evaluación del Dolor</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escala de dolor EVA (0-10): <span className="text-2xl font-bold text-saludvalpa-blue ml-2">{formData.escalaDolor}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.escalaDolor}
            onChange={(e) => setFormData(prev => ({ ...prev, escalaDolor: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Sin dolor</span>
            <span>Dolor máximo</span>
          </div>
        </div>

        <Input
          label="Área de dolor"
          value={formData.areaDolor}
          onChange={(e) => setFormData(prev => ({ ...prev, areaDolor: e.target.value }))}
          placeholder="Ej: Zona lumbar L4-L5 con irradiación a glúteo derecho"
          className="mt-3"
        />

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Características del dolor
          </label>
          <textarea
            value={formData.caracteristicasDolor}
            onChange={(e) => setFormData(prev => ({ ...prev, caracteristicasDolor: e.target.value }))}
            placeholder="Ej: Dolor punzante, aumenta con flexión, disminuye en reposo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={2}
          />
        </div>
      </div>

      {/* Diagnóstico y objetivos */}
      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Diagnóstico y Objetivos</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnóstico fisioterapéutico *
          </label>
          <textarea
            value={formData.diagnosticoFisioterapeutico}
            onChange={(e) => setFormData(prev => ({ ...prev, diagnosticoFisioterapeutico: e.target.value }))}
            placeholder="Ej: Lumbalgia mecánica con limitación funcional moderada..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={3}
          />
          {errores.diagnosticoFisioterapeutico && (
            <p className="text-sm text-red-600 mt-1">{errores.diagnosticoFisioterapeutico}</p>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivos del tratamiento
          </label>
          <textarea
            value={formData.objetivosTratamiento}
            onChange={(e) => setFormData(prev => ({ ...prev, objetivosTratamiento: e.target.value }))}
            placeholder="Ej: 1) Reducir dolor a 3/10, 2) Aumentar ROM lumbar 20°, 3) Mejorar fuerza core..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pronóstico
          </label>
          <textarea
            value={formData.pronostico}
            onChange={(e) => setFormData(prev => ({ ...prev, pronostico: e.target.value }))}
            placeholder="Ej: Favorable con tratamiento de 8-12 sesiones..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onCancelar}
          variant="outline"
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleContinuar}
          variant="primary"
          className="flex-1"
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
};

export default GenerarEvaluacionFisioterapeutica;
