// ============================================================================
// saludvalpa 3.0 - GENERAR NOTA DE EVOLUCIÓN
// Modal para generar nota de evolución fisioterapéutica en PDF
// ============================================================================

import { useState, useEffect } from 'react';
import type { Paciente, Sesion } from '../../../types';
import { TipoDocumento } from '../../../types';
import { guardarDocumento, generarFolio } from '../../../services/pdfService';
import { descargarArchivo } from '../../../utils/helpers';
import Input from '../../../components/shared/Input';
import Button from '../../../components/shared/Button';
import jsPDF from 'jspdf';
import { db } from '../../../db/database';
import { formatearFecha } from '../../../utils/helpers';

interface GenerarNotaEvolucionProps {
  paciente: Paciente;
  sesion?: Sesion; // Sesión actual opcional
  onExito: () => void;
  onCancelar: () => void;
}

interface DatosNota {
  fechaNota: string;
  numeroSesion: string;
  totalSesiones: string;
  evolucionGeneral: string;
  escalaDolor: number;
  escalaDolorAnterior: number;
  tecnicasAplicadas: string[];
  ejerciciosRealizados: string[];
  respuestaTratamiento: string;
  avances: string;
  dificultades: string;
  observaciones: string;
  proximosPasos: string;
}

const GenerarNotaEvolucion = ({ paciente, sesion, onExito, onCancelar }: GenerarNotaEvolucionProps) => {
  const [generando, setGenerando] = useState(false);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  
  const hoy = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DatosNota>({
    fechaNota: hoy,
    numeroSesion: '',
    totalSesiones: '',
    evolucionGeneral: '',
    escalaDolor: sesion?.datosEspecificosProfesion?.escalaDolor || 0,
    escalaDolorAnterior: 0,
    tecnicasAplicadas: sesion?.datosEspecificosProfesion?.tecnicasAplicadas || [],
    ejerciciosRealizados: sesion?.datosEspecificosProfesion?.ejerciciosRealizados || [],
    respuestaTratamiento: '',
    avances: '',
    dificultades: '',
    observaciones: sesion?.notas || '',
    proximosPasos: '',
  });

  const [nuevaEntrada, setNuevaEntrada] = useState({
    tecnica: '',
    ejercicio: '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  // Cargar sesiones previas del paciente
  useEffect(() => {
    const cargarSesiones = async () => {
      const sesionesDb = await db.sesiones
        .where('pacienteId')
        .equals(paciente.id)
        .reverse()
        .sortBy('fecha');
      setSesiones(sesionesDb);

      // Calcular número de sesión
      const numSesion = sesionesDb.length;
      setFormData(prev => ({
        ...prev,
        numeroSesion: numSesion.toString(),
      }));

      // Obtener dolor de sesión anterior
      if (sesionesDb.length > 1) {
        const sesionAnterior = sesionesDb[sesionesDb.length - 2];
        if (sesionAnterior.datosEspecificosProfesion?.escalaDolor !== undefined) {
          setFormData(prev => ({
            ...prev,
            escalaDolorAnterior: sesionAnterior.datosEspecificosProfesion.escalaDolor,
          }));
        }
      }
    };

    cargarSesiones();
  }, [paciente.id]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.evolucionGeneral.trim()) {
      nuevosErrores.evolucionGeneral = 'La evolución general es requerida';
    }

    if (!formData.respuestaTratamiento.trim()) {
      nuevosErrores.respuestaTratamiento = 'La respuesta al tratamiento es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarTecnica = () => {
    if (!nuevaEntrada.tecnica.trim()) return;
    setFormData(prev => ({
      ...prev,
      tecnicasAplicadas: [...prev.tecnicasAplicadas, nuevaEntrada.tecnica.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, tecnica: '' }));
  };

  const agregarEjercicio = () => {
    if (!nuevaEntrada.ejercicio.trim()) return;
    setFormData(prev => ({
      ...prev,
      ejerciciosRealizados: [...prev.ejerciciosRealizados, nuevaEntrada.ejercicio.trim()],
    }));
    setNuevaEntrada(prev => ({ ...prev, ejercicio: '' }));
  };

  const eliminar = (campo: 'tecnicasAplicadas' | 'ejerciciosRealizados', indice: number) => {
    setFormData(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== indice),
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
    pdf.text('NOTA DE EVOLUCIÓN FISIOTERAPÉUTICA', pageWidth / 2, currentY, { align: 'center' });
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
    // DATOS DEL PACIENTE Y SESIÓN
    // =========================================================================
    pdf.setFillColor(232, 244, 248);
    pdf.rect(margin, currentY, contentWidth, 30, 'F');
    
    currentY += 7;
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMACIÓN DE LA SESIÓN', margin + 5, currentY);
    currentY += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Paciente: ${paciente.nombre} ${paciente.apellidos}`, margin + 5, currentY);
    currentY += 5;
    
    const edad = paciente.edad || Math.floor((new Date().getTime() - new Date(paciente.fechaNacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    pdf.text(`Edad: ${edad} años  |  Tel: ${paciente.telefono}`, margin + 5, currentY);
    currentY += 5;
    
    const sesionInfo = formData.totalSesiones 
      ? `Sesión ${formData.numeroSesion} de ${formData.totalSesiones}` 
      : `Sesión número ${formData.numeroSesion}`;
    pdf.text(`${sesionInfo}  |  Fecha: ${formatearFecha(new Date(formData.fechaNota))}`, margin + 5, currentY);
    currentY += 10;

    // =========================================================================
    // EVOLUCIÓN DESDE ÚLTIMA SESIÓN
    // =========================================================================
    checkPageBreak(30);
    pdf.setFillColor(240, 253, 244); // bg-green-50
    pdf.rect(margin, currentY, contentWidth, 5, 'F');
    currentY += 5;

    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EVOLUCIÓN DESDE ÚLTIMA SESIÓN', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaEvol = addTextWithWrap(formData.evolucionGeneral, margin, currentY, contentWidth, 10);
    currentY += alturaEvol + 10;

    // =========================================================================
    // COMPARATIVA DE DOLOR
    // =========================================================================
    checkPageBreak(40);
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 30, 'F');
    
    currentY += 7;
    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESCALA DE DOLOR (EVA)', margin + 5, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    
    // Dolor actual
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dolor hoy:', margin + 5, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(formData.escalaDolor <= 3 ? 34 : formData.escalaDolor <= 6 ? 202 : 220, 
                     formData.escalaDolor <= 3 ? 197 : formData.escalaDolor <= 6 ? 138 : 38,
                     formData.escalaDolor <= 3 ? 94 : formData.escalaDolor <= 6 ? 4 : 38);
    pdf.text(`${formData.escalaDolor}/10`, margin + 35, currentY);
    
    // Dolor anterior (si existe)
    if (formData.escalaDolorAnterior > 0) {
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`(anterior: ${formData.escalaDolorAnterior}/10)`, margin + 50, currentY);
      
      // Indicador de cambio
      const cambio = formData.escalaDolorAnterior - formData.escalaDolor;
      if (cambio > 0) {
        pdf.setTextColor(34, 197, 94); // verde
        pdf.text(`↓ Mejoría de ${cambio} puntos`, margin + 90, currentY);
      } else if (cambio < 0) {
        pdf.setTextColor(220, 38, 38); // rojo
        pdf.text(`↑ Aumento de ${Math.abs(cambio)} puntos`, margin + 90, currentY);
      } else {
        pdf.setTextColor(107, 114, 128);
        pdf.text('→ Sin cambios', margin + 90, currentY);
      }
    }
    
    currentY += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text('0 = Sin dolor  |  10 = Dolor máximo', margin + 5, currentY);
    currentY += 10;

    // =========================================================================
    // TÉCNICAS APLICADAS EN ESTA SESIÓN
    // =========================================================================
    if (formData.tecnicasAplicadas.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TÉCNICAS APLICADAS EN ESTA SESIÓN', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.tecnicasAplicadas.forEach((tec) => {
        checkPageBreak(6);
        pdf.text(`• ${tec}`, margin + 3, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // =========================================================================
    // EJERCICIOS REALIZADOS
    // =========================================================================
    if (formData.ejerciciosRealizados.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EJERCICIOS REALIZADOS', margin, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      formData.ejerciciosRealizados.forEach((ej) => {
        checkPageBreak(6);
        pdf.text(`• ${ej}`, margin + 3, currentY);
        currentY += 5;
      });
      currentY += 5;
    }

    // =========================================================================
    // RESPUESTA AL TRATAMIENTO
    // =========================================================================
    checkPageBreak(30);
    pdf.setFillColor(254, 252, 232); // bg-yellow-50
    pdf.rect(margin, currentY, contentWidth, 5, 'F');
    currentY += 5;

    pdf.setFontSize(11);
    pdf.setTextColor(44, 93, 125);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RESPUESTA AL TRATAMIENTO', margin, currentY);
    currentY += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'normal');
    const alturaResp = addTextWithWrap(formData.respuestaTratamiento, margin, currentY, contentWidth, 10);
    currentY += alturaResp + 10;

    // =========================================================================
    // AVANCES Y DIFICULTADES
    // =========================================================================
    if (formData.avances) {
      checkPageBreak(25);
      pdf.setFontSize(11);
      pdf.setTextColor(22, 163, 74); // green-600
      pdf.setFont('helvetica', 'bold');
      pdf.text('✓ AVANCES OBSERVADOS', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaAvances = addTextWithWrap(formData.avances, margin, currentY, contentWidth, 10);
      currentY += alturaAvances + 8;
    }

    if (formData.dificultades) {
      checkPageBreak(25);
      pdf.setFontSize(11);
      pdf.setTextColor(220, 38, 38); // red-600
      pdf.setFont('helvetica', 'bold');
      pdf.text('⚠ DIFICULTADES / LIMITACIONES', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaDif = addTextWithWrap(formData.dificultades, margin, currentY, contentWidth, 10);
      currentY += alturaDif + 8;
    }

    // =========================================================================
    // OBSERVACIONES
    // =========================================================================
    if (formData.observaciones) {
      checkPageBreak(20);
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
    // PRÓXIMOS PASOS
    // =========================================================================
    if (formData.proximosPasos) {
      checkPageBreak(25);
      pdf.setFillColor(232, 244, 248);
      pdf.rect(margin, currentY, contentWidth, 5, 'F');
      currentY += 5;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 93, 125);
      pdf.setFont('helvetica', 'bold');
      pdf.text('→ PRÓXIMOS PASOS / PLAN', margin, currentY);
      currentY += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'normal');
      const alturaProx = addTextWithWrap(formData.proximosPasos, margin, currentY, contentWidth, 10);
      currentY += alturaProx + 8;
    }

    // =========================================================================
    // FIRMA
    // =========================================================================
    checkPageBreak(25);
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
      const folio = generarFolio(TipoDocumento.NOTA_SESION);
      
      const pdfBlob = await generarPDF();

      // Guardar en base de datos
      await guardarDocumento(
        paciente.id,
        TipoDocumento.NOTA_SESION,
        `Nota de Evolución ${folio}`,
        pdfBlob,
        {
          folio,
          fechaNota: formData.fechaNota,
          numeroSesion: formData.numeroSesion,
          escalaDolor: formData.escalaDolor,
        }
      );

      // Descargar automáticamente
      descargarArchivo(
        pdfBlob, 
        `Nota_Evolucion_${folio}_${paciente.apellidos}.pdf`
      );

      onExito();
    } catch (error) {
      console.error('Error al generar nota de evolución:', error);
      alert('Error al generar la nota de evolución');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
        <p className="text-sm text-saludvalpa-blue">
          <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
        </p>
        {sesiones.length > 0 && (
          <p className="text-xs text-saludvalpa-blue mt-1">
            Total de sesiones registradas: {sesiones.length}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Fecha de la nota *"
          type="date"
          value={formData.fechaNota}
          onChange={(e) => setFormData(prev => ({ ...prev, fechaNota: e.target.value }))}
        />
        <Input
          label="Número de sesión"
          type="text"
          value={formData.numeroSesion}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroSesion: e.target.value }))}
          placeholder="Ej: 5"
        />
        <Input
          label="Total sesiones (opcional)"
          type="text"
          value={formData.totalSesiones}
          onChange={(e) => setFormData(prev => ({ ...prev, totalSesiones: e.target.value }))}
          placeholder="Ej: 10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Evolución desde última sesión *
        </label>
        <textarea
          value={formData.evolucionGeneral}
          onChange={(e) => setFormData(prev => ({ ...prev, evolucionGeneral: e.target.value }))}
          placeholder="Describe cómo ha evolucionado el paciente desde la última sesión..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          autoFocus
        />
        {errores.evolucionGeneral && (
          <p className="text-sm text-red-600 mt-1">{errores.evolucionGeneral}</p>
        )}
      </div>

      {/* Escala de dolor comparativa */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Escala de Dolor (EVA)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dolor hoy: <span className="text-2xl font-bold text-saludvalpa-blue ml-2">{formData.escalaDolor}</span>
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

          {formData.escalaDolorAnterior > 0 && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Comparativa:</p>
              <p className="text-xs text-gray-500">Sesión anterior: <strong>{formData.escalaDolorAnterior}/10</strong></p>
              <p className="text-xs text-gray-500">Hoy: <strong>{formData.escalaDolor}/10</strong></p>
              {(() => {
                const cambio = formData.escalaDolorAnterior - formData.escalaDolor;
                if (cambio > 0) {
                  return <p className="text-sm text-green-600 font-medium mt-2">↓ Mejoría de {cambio} puntos</p>;
                } else if (cambio < 0) {
                  return <p className="text-sm text-red-600 font-medium mt-2">↑ Aumento de {Math.abs(cambio)} puntos</p>;
                } else {
                  return <p className="text-sm text-gray-600 font-medium mt-2">→ Sin cambios</p>;
                }
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Técnicas aplicadas */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Técnicas Aplicadas en Esta Sesión</h4>
        
        {formData.tecnicasAplicadas.length > 0 && (
          <div className="space-y-1 mb-3">
            {formData.tecnicasAplicadas.map((tec, idx) => (
              <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded">
                <span className="text-sm">• {tec}</span>
                <button
                  onClick={() => eliminar('tecnicasAplicadas', idx)}
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
            placeholder="Ej: Movilización articular, TENS..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarTecnica()}
          />
          <Button onClick={agregarTecnica} className="text-sm">
            + Agregar
          </Button>
        </div>
      </div>

      {/* Ejercicios realizados */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Ejercicios Realizados</h4>
        
        {formData.ejerciciosRealizados.length > 0 && (
          <div className="space-y-1 mb-3">
            {formData.ejerciciosRealizados.map((ej, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded">
                <span className="text-sm">• {ej}</span>
                <button
                  onClick={() => eliminar('ejerciciosRealizados', idx)}
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
            placeholder="Ej: Fortalecimiento de core, estiramientos..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && agregarEjercicio()}
          />
          <Button onClick={agregarEjercicio} className="text-sm">
            + Agregar
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Respuesta al tratamiento *
        </label>
        <textarea
          value={formData.respuestaTratamiento}
          onChange={(e) => setFormData(prev => ({ ...prev, respuestaTratamiento: e.target.value }))}
          placeholder="Describe cómo respondió el paciente al tratamiento de hoy..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
        />
        {errores.respuestaTratamiento && (
          <p className="text-sm text-red-600 mt-1">{errores.respuestaTratamiento}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ✓ Avances observados
        </label>
        <textarea
          value={formData.avances}
          onChange={(e) => setFormData(prev => ({ ...prev, avances: e.target.value }))}
          placeholder="Ej: Aumento de rango de movimiento, reducción del dolor, mejor tolerancia al ejercicio..."
          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ⚠ Dificultades / Limitaciones
        </label>
        <textarea
          value={formData.dificultades}
          onChange={(e) => setFormData(prev => ({ ...prev, dificultades: e.target.value }))}
          placeholder="Ej: Persiste limitación en rotación externa, dolor al final del rango..."
          className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones adicionales
        </label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          placeholder="Cualquier observación relevante sobre la sesión..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          → Próximos pasos / Plan
        </label>
        <textarea
          value={formData.proximosPasos}
          onChange={(e) => setFormData(prev => ({ ...prev, proximosPasos: e.target.value }))}
          placeholder="Ej: Continuar con ejercicios de fortalecimiento, aumentar intensidad, programar re-evaluación..."
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
          {generando ? 'Generando PDF...' : '✓ Generar Nota de Evolución'}
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

export default GenerarNotaEvolucion;
