// ============================================================================
// saludvalpa 3.0 - GENERAR RECETA MÉDICA
// Modal para generar receta médica en PDF
// ============================================================================

import { useState } from 'react';
import type { Paciente, Sesion, DatosMedicinaGeneral } from '../../../types';
import { TipoDocumento } from '../../../types';
import { guardarDocumento, generarFolio } from '../../../services/pdfService';
import { descargarArchivo, formatearFecha } from "../../../utils/helpers";

import jsPDF from 'jspdf';


interface GenerarRecetaMedicaProps {
  paciente: Paciente;
  datosMedicina: DatosMedicinaGeneral;
  sesion?: Sesion;
  onExito: () => void;
  onCancelar: () => void;
}

interface DatosReceta {
  fechaReceta: string;
  diagnostico: string;
  medicamentos: Array<{
    nombre: string;
    presentacion: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    via: string;
    indicacionesEspeciales?: string;
  }>;
  indicacionesGenerales: string[];
  proximaCita?: string;
  recomendaciones: string[];
}

export default function GenerarRecetaMedica({ paciente, datosMedicina, sesion: _sesion, onExito, onCancelar }: GenerarRecetaMedicaProps) {
  const [generando, setGenerando] = useState(false);
  
  const hoy = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DatosReceta>({
    fechaReceta: hoy,
    diagnostico: datosMedicina.diagnostico?.join(', ') || '',
    medicamentos: datosMedicina.tratamiento?.medicamentos || [],
    indicacionesGenerales: datosMedicina.tratamiento?.indicaciones || [],
    proximaCita: datosMedicina.proximaCita ? new Date(datosMedicina.proximaCita).toISOString().split('T')[0] : '',
    recomendaciones: datosMedicina.recomendaciones || [],
  });

  const handleChange = (campo: keyof DatosReceta, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const agregarMedicamento = () => {
    const nuevoMed = {
      nombre: '',
      presentacion: 'tabletas',
      dosis: '',
      frecuencia: '',
      duracion: '',
      via: 'oral',
      indicacionesEspeciales: '',
    };
    
    handleChange('medicamentos', [...formData.medicamentos, nuevoMed]);
  };

  const actualizarMedicamento = (indice: number, campo: string, valor: string) => {
    const medicamentosActualizados = [...formData.medicamentos];
    medicamentosActualizados[indice] = {
      ...medicamentosActualizados[indice],
      [campo]: valor,
    };
    
    handleChange('medicamentos', medicamentosActualizados);
  };

  const eliminarMedicamento = (indice: number) => {
    const medicamentosActualizados = formData.medicamentos.filter((_, idx) => idx !== indice);
    handleChange('medicamentos', medicamentosActualizados);
  };

  const agregarIndicacion = () => {
    const input = document.getElementById('nueva-indicacion') as HTMLInputElement;
    if (!input || !input.value.trim()) return;
    
    const indicacionesActualizadas = [...formData.indicacionesGenerales, input.value.trim()];
    handleChange('indicacionesGenerales', indicacionesActualizadas);
    input.value = '';
  };

  const eliminarIndicacion = (indice: number) => {
    const indicacionesActualizadas = formData.indicacionesGenerales.filter((_, idx) => idx !== indice);
    handleChange('indicacionesGenerales', indicacionesActualizadas);
  };

  const agregarRecomendacion = () => {
    const input = document.getElementById('nueva-recomendacion') as HTMLInputElement;
    if (!input || !input.value.trim()) return;
    
    const recomendacionesActualizadas = [...formData.recomendaciones, input.value.trim()];
    handleChange('recomendaciones', recomendacionesActualizadas);
    input.value = '';
  };

  const eliminarRecomendacion = (indice: number) => {
    const recomendacionesActualizadas = formData.recomendaciones.filter((_, idx) => idx !== indice);
    handleChange('recomendaciones', recomendacionesActualizadas);
  };

  const generarPDF = async () => {
    setGenerando(true);
    
    try {
      const doc = new jsPDF();
      const folio = generarFolio(TipoDocumento.RECETA_MEDICA);
      
      // Configuración de márgenes
      const marginLeft = 20;
      const marginTop = 20;
      let yPos = marginTop;
      
      // Encabezado
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RECETA MÉDICA', marginLeft, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Folio: ${folio}`, marginLeft, yPos);
      doc.text(`Fecha: ${formatearFecha(new Date(formData.fechaReceta))}`, 150, yPos);
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL PACIENTE', marginLeft, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${paciente.nombre} ${paciente.apellidos || ''}`, marginLeft, yPos);
      yPos += 6;
      doc.text(`Edad: ${paciente.edad || 'N/A'} años`, marginLeft, yPos);
      yPos += 6;
      doc.text(`Sexo: ${paciente.genero || 'N/A'}`, marginLeft, yPos);
      
      // Diagnóstico
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DIAGNÓSTICO', marginLeft, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const diagnosticoLines = doc.splitTextToSize(formData.diagnostico || 'No especificado', 170);
      doc.text(diagnosticoLines, marginLeft, yPos);
      yPos += diagnosticoLines.length * 5;
      
      // Medicamentos
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAMENTOS PRESCRITOS', marginLeft, yPos);
      
      if (formData.medicamentos.length > 0) {
        yPos += 8;
        formData.medicamentos.forEach((med, _idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = marginTop;
          }
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${_idx + 1}. ${med.nombre}`, marginLeft, yPos);
          
          yPos += 6;
          doc.setFont('helvetica', 'normal');
          doc.text(`   Presentación: ${med.presentacion}`, marginLeft, yPos);
          yPos += 5;
          doc.text(`   Dosis: ${med.dosis}`, marginLeft, yPos);
          yPos += 5;
          doc.text(`   Frecuencia: ${med.frecuencia}`, marginLeft, yPos);
          yPos += 5;
          doc.text(`   Duración: ${med.duracion}`, marginLeft, yPos);
          yPos += 5;
          doc.text(`   Vía: ${med.via}`, marginLeft, yPos);
          
          if (med.indicacionesEspeciales) {
            yPos += 5;
            doc.text(`   Indicaciones: ${med.indicacionesEspeciales}`, marginLeft, yPos);
          }
          
          yPos += 8;
        });
      } else {
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('No se prescribieron medicamentos.', marginLeft, yPos);
        yPos += 6;
      }
      
      // Indicaciones generales
      if (formData.indicacionesGenerales.length > 0) {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INDICACIONES GENERALES', marginLeft, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        formData.indicacionesGenerales.forEach((ind, _idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = marginTop;
          }
          doc.text(`• ${ind}`, marginLeft, yPos);
          yPos += 6;
        });
      }
      
      // Recomendaciones
      if (formData.recomendaciones.length > 0) {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('RECOMENDACIONES', marginLeft, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        formData.recomendaciones.forEach((rec, _idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = marginTop;
          }
          doc.text(`• ${rec}`, marginLeft, yPos);
          yPos += 6;
        });
      }
      
      // Próxima cita
      if (formData.proximaCita) {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PRÓXIMA CITA', marginLeft, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${formatearFecha(new Date(formData.proximaCita))}`, marginLeft, yPos);
      }
      
      // Firma del médico
      yPos = 270;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('_________________________________', marginLeft + 50, yPos);
      yPos += 6;
      doc.text('Firma del Médico', marginLeft + 70, yPos);
      
      // Guardar documento
      const pdfBlob = doc.output('blob');
      const nombreArchivo = `Receta_Medica_${paciente.nombre}_${folio}.pdf`;
      
      await guardarDocumento(paciente.id, TipoDocumento.RECETA_MEDICA, nombreArchivo, pdfBlob, {
        folio,
        diagnostico: formData.diagnostico,
        medicamentos: formData.medicamentos.length,
      });
      
      // Descargar PDF
      descargarArchivo(pdfBlob, nombreArchivo);
      
      onExito();
      
    } catch (error) {
      console.error('Error generando receta médica:', error);
      alert('Error al generar la receta médica. Por favor, intente nuevamente.');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Generar Receta Médica</h2>
            <button
              onClick={onCancelar}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de la Receta
                </label>
                <input
                  type="date"
                  value={formData.fechaReceta}
                  onChange={(e) => handleChange('fechaReceta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima Cita (opcional)
                </label>
                <input
                  type="date"
                  value={formData.proximaCita || ''}
                  onChange={(e) => handleChange('proximaCita', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Diagnóstico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico
              </label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => handleChange('diagnostico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Ingrese el diagnóstico del paciente..."
              />
            </div>
            
            {/* Medicamentos */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Medicamentos</h3>
                <button
                  type="button"
                  onClick={agregarMedicamento}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  + Agregar Medicamento
                </button>
              </div>
              
              {formData.medicamentos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay medicamentos agregados.</p>
              ) : (
                <div className="space-y-4">
                  {formData.medicamentos.map((med, idx) => (
                    <div key={idx} className="border border-gray-300 rounded p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-800">Medicamento {idx + 1}</h4>
                        <button
                          type="button"
                          onClick={() => eliminarMedicamento(idx)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                          <input
                            type="text"
                            value={med.nombre}
                            onChange={(e) => actualizarMedicamento(idx, 'nombre', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Ej: Amoxicilina"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Presentación</label>
                          <select
                            value={med.presentacion}
                            onChange={(e) => actualizarMedicamento(idx, 'presentacion', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="tabletas">Tabletas</option>
                            <option value="capsulas">Cápsulas</option>
                            <option value="jarabe">Jarabe</option>
                            <option value="inyeccion">Inyección</option>
                            <option value="crema">Crema</option>
                            <option value="unguento">Ungüento</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Dosis *</label>
                          <input
                            type="text"
                            value={med.dosis}
                            onChange={(e) => actualizarMedicamento(idx, 'dosis', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Ej: 500mg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Frecuencia *</label>
                          <input
                            type="text"
                            value={med.frecuencia}
                            onChange={(e) => actualizarMedicamento(idx, 'frecuencia', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Ej: Cada 8 horas"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Duración *</label>
                          <input
                            type="text"
                            value={med.duracion}
                            onChange={(e) => actualizarMedicamento(idx, 'duracion', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Ej: 7 días"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Vía *</label>
                          <select
                            value={med.via}
                            onChange={(e) => actualizarMedicamento(idx, 'via', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="oral">Oral</option>
                            <option value="topica">Tópica</option>
                            <option value="inyeccion">Inyección</option>
                            <option value="inhalacion">Inhalación</option>
                            <option value="rectal">Rectal</option>
                            <option value="vaginal">Vaginal</option>
                          </select>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Indicaciones especiales (opcional)</label>
                          <textarea
                            value={med.indicacionesEspeciales || ''}
                            onChange={(e) => actualizarMedicamento(idx, 'indicacionesEspeciales', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            rows={2}
                            placeholder="Ej: Tomar con alimentos, evitar alcohol..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Indicaciones generales */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Indicaciones Generales</h3>
                <div className="space-y-2">
                  {formData.indicacionesGenerales.map((ind, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">• {ind}</span>
                      <button
                        type="button"
                        onClick={() => eliminarIndicacion(idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    id="nueva-indicacion"
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nueva indicación..."
                  />
                  <button
                    type="button"
                    onClick={agregarIndicacion}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
              
              {/* Recomendaciones */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones</h3>
                <div className="space-y-2">
                  {formData.recomendaciones.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">• {rec}</span>
                      <button
                        type="button"
                        onClick={() => eliminarRecomendacion(idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    id="nueva-recomendacion"
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nueva recomendación..."
                  />
                  <button
                    type="button"
                    onClick={agregarRecomendacion}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancelar}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={generarPDF}
                disabled={generando}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generando ? 'Generando...' : 'Generar Receta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};