// ============================================================================
// saludvalpa 3.0 - GENERAR PLAN DE TRATAMIENTO
// Modal para generar plan de tratamiento fisioterapéutico en PDF
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

interface GenerarPlanTratamientoProps {
  paciente: Paciente;
  onExito: () => void;
  onCancelar: () => void;
}

interface DatosPlan {
  fechaPlan: string;
  diagnostico: string;
  objetivosCortoPlaz: string[];
  objetivosLargoPlaz: string[];
  numeroSesiones: string;
  frecuencia: string;
  duracionSesion: string;
  tecnicasAplicar: string[];
  ejerciciosTerapeuticos: string[];
  ejerciciosCasa: string[];
  indicacionesEspeciales: string;
  precauciones: string;
  fechaRevaluacion: string;
  observaciones: string;
}

const GenerarPlanTratamiento = ({ paciente, onExito, onCancelar }: GenerarPlanTratamientoProps) => {
  const [generando, setGenerando] = useState(false);
  
  const hoy = new Date().toISOString().split('T')[0];
  const enUnMes = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DatosPlan>({
    fechaPlan: hoy,
    diagnostico: '',
    objetivosCortoPlaz: [],
    objetivosLargoPlaz: [],
    numeroSesiones: '',
    frecuencia: '',
    duracionSesion: '60',
    tecnicasAplicar: [],
    ejerciciosTerapeuticos: [],
    ejerciciosCasa: [],
    indicacionesEspeciales: '',
    precauciones: '',
    fechaRevaluacion: enUnMes,
    observaciones: '',
  });

  const [nuevaEntrada, setNuevaEntrada] = useState({
    objCorto: '',
    objLargo: '',
    tecnica: '',
    ejercicio: '',
    ejercicioCasa: '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.diagnostico.trim()) {
      nuevosErrores.diagnostico = 'El diagnóstico es requerido';
    }

    if (formData.objetivosCortoPlaz.length === 0) {
      nuevosErrores.objetivosCorto = 'Agrega al menos un objetivo a corto plazo';
    }

    if (!formData.numeroSesiones.trim()) {
      nuevosErrores.numeroSesiones = 'El número de sesiones es requerido';
    }

    if (!formData.frecuencia.trim()) {
      nuevosErrores.frecuencia = 'La frecuencia es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarObjetivoCorto = () => {
    if (!nuevaEntrada.objCorto.trim()) return;
    setFormData(prev => ({
      ...prev,
      objetivosCortoPlaz: [...prev.objetivosCortoPlaz, nuevaEntrada.objCorto.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, objCorto: '' }));
    setErrores(prev => ({ ...prev, objetivosCorto: '' }));
  };

  const agregarObjetivoLargo = () => {
    if (!nuevaEntrada.objLargo.trim()) return;
    setFormData(prev => ({
      ...prev,
      objetivosLargoPlaz: [...prev.objetivosLargoPlaz, nuevaEntrada.objLargo.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, objLargo: '' }));
  };

  const agregarTecnica = () => {
    if (!nuevaEntrada.tecnica.trim()) return;
    setFormData(prev => ({
      ...prev,
      tecnicasAplicar: [...prev.tecnicasAplicar, nuevaEntrada.tecnica.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, tecnica: '' }));
  };

  const agregarEjercicio = () => {
    if (!nuevaEntrada.ejercicio.trim()) return;
    setFormData(prev => ({
      ...prev,
      ejerciciosTerapeuticos: [...prev.ejerciciosTerapeuticos, nuevaEntrada.ejercicio.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, ejercicio: '' }));
  };

  const agregarEjercicioCasa = () => {
    if (!nuevaEntrada.ejercicioCasa.trim()) return;
    setFormData(prev => ({
      ...prev,
      ejerciciosCasa: [...prev.ejerciciosCasa, nuevaEntrada.ejercicioCasa.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, ejercicioCasa: '' }));
  };

  const eliminar = (campo: keyof DatosPlan, indice: number) => {
    setFormData(prev => ({
      ...prev,
      [campo]: (prev[campo] as string[]).filter((_, i) => i !== indice),
    }));
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

    // Función auxiliar para verificar espacio
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
      return lines.length * (fontSize * 0.35);
    };

    // =========================================================================
    // ENCABEZADO
    // =========================================================================
    pdf.setFontSize(18);
    pdf.setTextColor(44, 93, 125);
    pdf.text('PLAN DE TRATAMIENTO FISIOTERAPÉUTICO', pageWidth / 2, currentY, { align: 'center' });
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
    pdf.setDrawColor(95, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // =========================================================================
    // DATOS DEL PACIENTE
    // =========================================================================
    pdf.setFillColor(232, 244, 248);
    pdf.rect(margin, currentY, contentWidth, 25, 'F');
    
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
    pdf.text(`Edad: ${edad} años  |  Tel: ${paciente.telefono}`, margin + 5, currentY);
    currentY += 5;
    
    pdf.text(`Fecha del plan: ${formatearFecha(new Date(formData.fechaPlan))}`, margin + 5, currentY);
    currentY += 10;

    // =========================================================================
    // DIAGNÓSTICO
    // =========================================================================
    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DIAGNÓSTICO FISIOTERAPÉUTICO', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaDiag = addTextWithWrap(formData.diagnostico, margin, currentY, contentWidth, 10);
    currentY += alturaDiag + 10;

    // =========================================================================
    // OBJETIVOS DEL TRATAMIENTO
    // =========================================================================
    checkPageBreak(40);
    pdf.setFillColor(232, 244, 248);
    pdf.rect(margin, currentY, contentWidth, 5, 'F');
    currentY += 5;

    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBJETIVOS DEL TRATAMIENTO', margin, currentY);
    currentY += 8;

    // Objetivos a corto plazo
    if (formData.objetivosCortoPlaz.length > 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('A Corto Plazo (2-4 semanas):', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.objetivosCortoPlaz.forEach((obj, idx) => {
        checkPageBreak(8);
        pdf.text(`${idx + 1}. ${obj}`, margin + 5, currentY);
        currentY += 5;
      });
      currentY += 3;
    }

    // Objetivos a largo plazo
    if (formData.objetivosLargoPlaz.length > 0) {
      checkPageBreak(15);
      pdf.setFontSize(10);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('A Largo Plazo (1-3 meses):', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.objetivosLargoPlaz.forEach((obj, idx) => {
        checkPageBreak(8);
        pdf.text(`${idx + 1}. ${obj}`, margin + 5, currentY);
        currentY += 5;
      });
      currentY += 3;
    }
    currentY += 5;

    // =========================================================================
    // FRECUENCIA Y DURACIÓN
    // =========================================================================
    checkPageBreak(30);
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 22, 'F');
    
    currentY += 6;
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Número de sesiones:', margin + 5, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.numeroSesiones, margin + 50, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Frecuencia:', margin + 5, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formData.frecuencia, margin + 50, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Duración por sesión:', margin + 5, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${formData.duracionSesion} minutos`, margin + 50, currentY);
    currentY += 10;

    // =========================================================================
    // TÉCNICAS FISIOTERAPÉUTICAS
    // =========================================================================
    if (formData.tecnicasAplicar.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TÉCNICAS FISIOTERAPÉUTICAS A APLICAR', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.tecnicasAplicar.forEach((tec) => {
        checkPageBreak(6);
        pdf.text(`• ${tec}`, margin + 3, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // =========================================================================
    // EJERCICIOS TERAPÉUTICOS
    // =========================================================================
    if (formData.ejerciciosTerapeuticos.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EJERCICIOS TERAPÉUTICOS EN SESIÓN', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.ejerciciosTerapeuticos.forEach((ej) => {
        checkPageBreak(6);
        pdf.text(`• ${ej}`, margin + 3, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // =========================================================================
    // EJERCICIOS PARA CASA
    // =========================================================================
    if (formData.ejerciciosCasa.length > 0) {
      checkPageBreak(30);
      pdf.setFillColor(240, 253, 244); // bg-green-50
      pdf.rect(margin, currentY - 3, contentWidth, 5, 'F');
      currentY += 2;

      pdf.setFontSize(11);
      pdf.setTextColor(22, 101, 52); // green-800
      pdf.setFont('helvetica', 'bold');
      pdf.text('📋 EJERCICIOS PARA REALIZAR EN CASA', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.ejerciciosCasa.forEach((ej, idx) => {
        checkPageBreak(6);
        pdf.text(`${idx + 1}. ${ej}`, margin + 3, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // =========================================================================
    // INDICACIONES ESPECIALES
    // =========================================================================
    if (formData.indicacionesEspeciales) {
      checkPageBreak(20);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INDICACIONES ESPECIALES', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaInd = addTextWithWrap(formData.indicacionesEspeciales, margin, currentY, contentWidth, 10);
      currentY += alturaInd + 8;
    }

    // =========================================================================
    // PRECAUCIONES / CONTRAINDICACIONES
    // =========================================================================
    if (formData.precauciones) {
      checkPageBreak(20);
      pdf.setFillColor(254, 242, 242); // bg-red-50
      pdf.rect(margin, currentY - 3, contentWidth, 5, 'F');
      currentY += 2;

      pdf.setFontSize(11);
      pdf.setTextColor(153, 27, 27); // red-800
      pdf.setFont('helvetica', 'bold');
      pdf.text('⚠️ PRECAUCIONES / CONTRAINDICACIONES', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaPrec = addTextWithWrap(formData.precauciones, margin, currentY, contentWidth, 10);
      currentY += alturaPrec + 8;
    }

    // =========================================================================
    // OBSERVACIONES
    // =========================================================================
    if (formData.observaciones) {
      checkPageBreak(15);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OBSERVACIONES', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaObs = addTextWithWrap(formData.observaciones, margin, currentY, contentWidth, 10);
      currentY += alturaObs + 8;
    }

    // =========================================================================
    // FECHA DE RE-EVALUACIÓN
    // =========================================================================
    checkPageBreak(15);
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 12, 'F');
    
    currentY += 7;
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Fecha de re-evaluación programada:', margin + 5, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatearFecha(new Date(formData.fechaRevaluacion)), margin + 70, currentY);
    currentY += 10;

    // =========================================================================
    // FIRMA
    // =========================================================================
    checkPageBreak(30);
    currentY += 10;
    pdf.setDrawColor(107, 114, 128);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY, margin + 60, currentY);
    currentY += 5;
    
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(config.branding.nombreProfesional || 'Firma del profesional', margin, currentY);
    if (config.branding.credenciales) {
      currentY += 4;
      pdf.text(config.branding.credenciales, margin, currentY);
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
      const folio = generarFolio(TipoDocumento.PLAN_TRATAMIENTO);
      
      const pdfBlob = await generarPDF();

      // Guardar en base de datos
      await guardarDocumento(
        paciente.id,
        TipoDocumento.PLAN_TRATAMIENTO,
        `Plan de Tratamiento ${folio}`,
        pdfBlob,
        {
          folio,
          fechaPlan: formData.fechaPlan,
          diagnostico: formData.diagnostico,
          numeroSesiones: formData.numeroSesiones,
        }
      );

      // Descargar automáticamente
      descargarArchivo(
        pdfBlob, 
        `Plan_Tratamiento_${folio}_${paciente.apellidos}.pdf`
      );

      onExito();
    } catch (error) {
      console.error('Error al generar plan de tratamiento:', error);
      alert('Error al generar el plan de tratamiento');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
        <p className="text-sm text-saludvalpa-blue">
          <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
        </p>
      </div>

      <Input
        label="Fecha del plan *"
        type="date"
        value={formData.fechaPlan}
        onChange={(e) => setFormData(prev => ({ ...prev, fechaPlan: e.target.value }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diagnóstico fisioterapéutico *
        </label>
        <textarea
          value={formData.diagnostico}
          onChange={(e) => setFormData(prev => ({ ...prev, diagnostico: e.target.value }))}
          placeholder="Ej: Lumbalgia mecánica con limitación funcional moderada..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={2}
          autoFocus
        />
        {errores.diagnostico && (
          <p className="text-sm text-red-600 mt-1">{errores.diagnostico}</p>
        )}
      </div>

      {/* Objetivos a corto plazo */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Objetivos a Corto Plazo (2-4 semanas) *</h4>
        
        {formData.objetivosCortoPlaz.length > 0 && (
          <div className="space-y-2 mb-3">
            {formData.objetivosCortoPlaz.map((obj, idx) => (
              <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                <span className="text-sm">{idx + 1}. {obj}</span>
                <button
                  onClick={() => eliminar('objetivosCortoPlaz', idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEntrada.objCorto}
            onChange={(e) => setNuevaEntrada(prev => ({ ...prev, objCorto: e.target.value }))}
            placeholder="Ej: Reducir dolor de 7/10 a 3/10"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarObjetivoCorto()}
          />
          <Button onClick={agregarObjetivoCorto} className="text-sm">
            + Agregar
          </Button>
        </div>
        {errores.objetivosCorto && (
          <p className="text-sm text-red-600 mt-1">{errores.objetivosCorto}</p>
        )}
      </div>

      {/* Objetivos a largo plazo */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Objetivos a Largo Plazo (1-3 meses)</h4>
        
        {formData.objetivosLargoPlaz.length > 0 && (
          <div className="space-y-2 mb-3">
            {formData.objetivosLargoPlaz.map((obj, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                <span className="text-sm">{idx + 1}. {obj}</span>
                <button
                  onClick={() => eliminar('objetivosLargoPlaz', idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEntrada.objLargo}
            onChange={(e) => setNuevaEntrada(prev => ({ ...prev, objLargo: e.target.value }))}
            placeholder="Ej: Retorno completo a actividades deportivas"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarObjetivoLargo()}
          />
          <Button onClick={agregarObjetivoLargo} className="text-sm">
            + Agregar
          </Button>
        </div>
      </div>

      {/* Frecuencia y duración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Número de sesiones *"
          type="text"
          value={formData.numeroSesiones}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroSesiones: e.target.value }))}
          placeholder="Ej: 10-12"
          error={errores.numeroSesiones}
        />
        <Input
          label="Frecuencia *"
          type="text"
          value={formData.frecuencia}
          onChange={(e) => setFormData(prev => ({ ...prev, frecuencia: e.target.value }))}
          placeholder="Ej: 2-3 veces/semana"
          error={errores.frecuencia}
        />
        <Input
          label="Duración por sesión (min)"
          type="number"
          value={formData.duracionSesion}
          onChange={(e) => setFormData(prev => ({ ...prev, duracionSesion: e.target.value }))}
        />
      </div>

      {/* Técnicas a aplicar */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Técnicas Fisioterapéuticas a Aplicar</h4>
        
        {formData.tecnicasAplicar.length > 0 && (
          <div className="space-y-1 mb-3">
            {formData.tecnicasAplicar.map((tec, idx) => (
              <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded">
                <span className="text-sm">• {tec}</span>
                <button
                  onClick={() => eliminar('tecnicasAplicar', idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEntrada.tecnica}
            onChange={(e) => setNuevaEntrada(prev => ({ ...prev, tecnica: e.target.value }))}
            placeholder="Ej: Movilización articular, TENS, Ultrasonido..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarTecnica()}
          />
          <Button onClick={agregarTecnica} className="text-sm">
            + Agregar
          </Button>
        </div>
      </div>

      {/* Ejercicios terapéuticos */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Ejercicios Terapéuticos en Sesión</h4>
        
        {formData.ejerciciosTerapeuticos.length > 0 && (
          <div className="space-y-1 mb-3">
            {formData.ejerciciosTerapeuticos.map((ej, idx) => (
              <div key={idx} className="flex items-center justify-between bg-purple-50 px-3 py-1.5 rounded">
                <span className="text-sm">• {ej}</span>
                <button
                  onClick={() => eliminar('ejerciciosTerapeuticos', idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEntrada.ejercicio}
            onChange={(e) => setNuevaEntrada(prev => ({ ...prev, ejercicio: e.target.value }))}
            placeholder="Ej: Fortalecimiento de core con plancha 3x30seg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarEjercicio()}
          />
          <Button onClick={agregarEjercicio} className="text-sm">
            + Agregar
          </Button>
        </div>
      </div>

      {/* Ejercicios para casa */}
      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
        <h4 className="font-medium text-green-900 mb-3">📋 Ejercicios para Realizar en Casa</h4>
        
        {formData.ejerciciosCasa.length > 0 && (
          <div className="space-y-1 mb-3">
            {formData.ejerciciosCasa.map((ej, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded">
                <span className="text-sm">{idx + 1}. {ej}</span>
                <button
                  onClick={() => eliminar('ejerciciosCasa', idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEntrada.ejercicioCasa}
            onChange={(e) => setNuevaEntrada(prev => ({ ...prev, ejercicioCasa: e.target.value }))}
            placeholder="Ej: Estiramiento de isquiotibiales 3 veces al día"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarEjercicioCasa()}
          />
          <Button onClick={agregarEjercicioCasa} className="text-sm bg-green-600 hover:bg-green-700">
            + Agregar
          </Button>
        </div>
      </div>

      {/* Indicaciones especiales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Indicaciones Especiales
        </label>
        <textarea
          value={formData.indicacionesEspeciales}
          onChange={(e) => setFormData(prev => ({ ...prev, indicacionesEspeciales: e.target.value }))}
          placeholder="Ej: Aplicar hielo después de cada sesión, evitar actividades de alto impacto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={2}
        />
      </div>

      {/* Precauciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ⚠️ Precauciones / Contraindicaciones
        </label>
        <textarea
          value={formData.precauciones}
          onChange={(e) => setFormData(prev => ({ ...prev, precauciones: e.target.value }))}
          placeholder="Ej: No realizar ejercicios si el dolor excede 5/10, suspender si hay aumento de inflamación..."
          className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50"
          rows={2}
        />
      </div>

      {/* Fecha de re-evaluación */}
      <Input
        label="Fecha de re-evaluación programada"
        type="date"
        value={formData.fechaRevaluacion}
        onChange={(e) => setFormData(prev => ({ ...prev, fechaRevaluacion: e.target.value }))}
      />

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones adicionales
        </label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          placeholder="Cualquier información adicional relevante..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={2}
        />
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
          onClick={handleGenerar}
          variant="primary"
          disabled={generando}
          className="flex-1"
        >
          {generando ? 'Generando PDF...' : '✓ Generar Plan de Tratamiento'}
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
};

export default GenerarPlanTratamiento;
