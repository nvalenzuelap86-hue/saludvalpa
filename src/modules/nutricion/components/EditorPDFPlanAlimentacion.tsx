// ============================================================================
// saludvalpa 3.0 - EDITOR PDF PLAN DE ALIMENTACIÓN
// Modal de edición antes de generar el PDF del plan de alimentación
// Permite personalizar el contenido antes de la generación
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/shared/Modal';
import VisorPDF from '../../../components/common/VisorPDF';
import type { PlanAlimentacion } from '../../../types/nutricion';
import type { Configuracion, Paciente } from '../../../types';
import { generarPDFPlanAlimentacion } from './generadorPDFPlanAlimentacion';
import type { OpcionesPDFPlan } from './generadorPDFPlanAlimentacion';
import { db } from '../../../db/database';

// ============================================================================
// INTERFACES
// ============================================================================

interface EditorPDFPlanAlimentacionProps {
  plan: PlanAlimentacion;
  paciente: Paciente;
  onClose: () => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function EditorPDFPlanAlimentacion({
  plan,
  paciente,
  onClose,
}: EditorPDFPlanAlimentacionProps) {
  // ============================================================================
  // ESTADOS
  // ============================================================================

  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [verPreview, setVerPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opciones editables
  const [mensajePersonalizado, setMensajePersonalizado] = useState('');
  const [incluirRecetas, setIncluirRecetas] = useState(true);
  const [incluirListaCompras, setIncluirListaCompras] = useState(true);
  const [incluirRecomendaciones, setIncluirRecomendaciones] = useState(true);
  const [recomendacionesEditadas, setRecomendacionesEditadas] = useState<string[]>(
    plan.recomendaciones ? [...plan.recomendaciones] : []
  );
  const [notasAdicionales, setNotasAdicionales] = useState('');

  // ============================================================================
  // CARGAR CONFIGURACIÓN
  // ============================================================================

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const config = await db.configuracion.get('1');
        setConfiguracion(config || null);
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        setError('No se pudo cargar la configuración del profesional');
      } finally {
        setCargando(false);
      }
    };
    cargarConfig();
  }, []);

  // ============================================================================
  // LIMPIAR OBJETO URL DEL PDF AL DESMONTAR
  // ============================================================================

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // ============================================================================
  // MANEJADORES DE RECOMENDACIONES
  // ============================================================================

  const handleAgregarRecomendacion = () => {
    setRecomendacionesEditadas((prev) => [...prev, '']);
  };

  const handleEditarRecomendacion = (index: number, valor: string) => {
    setRecomendacionesEditadas((prev) => {
      const nuevas = [...prev];
      nuevas[index] = valor;
      return nuevas;
    });
  };

  const handleEliminarRecomendacion = (index: number) => {
    setRecomendacionesEditadas((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================================
  // GENERAR PDF
  // ============================================================================

  const handleGenerarPDF = useCallback(async () => {
    if (!configuracion) {
      setError('Configuración no disponible');
      return;
    }

    setGenerando(true);
    setError(null);

    try {
      const opciones: OpcionesPDFPlan = {
        incluirRecetas,
        incluirListaCompras,
        incluirRecomendaciones,
        mensajePersonalizado: mensajePersonalizado || undefined,
        recomendacionesEditadas:
          recomendacionesEditadas.filter((r) => r.trim() !== '').length > 0
            ? recomendacionesEditadas.filter((r) => r.trim() !== '')
            : undefined,
        notasAdicionales: notasAdicionales || undefined,
      };

      const blob = await generarPDFPlanAlimentacion(
        plan,
        paciente,
        configuracion,
        opciones
      );

      // Convertir el Blob a una URL de objeto estable para que react-pdf
      // pueda renderizar todas las páginas (pasar el Blob directo solo
      // renderiza la primera página en react-pdf v10).
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (err: any) {
      console.error('Error al generar PDF:', err);
      setError(err.message || 'Error al generar el PDF');
    } finally {
      setGenerando(false);
    }
  }, [
    configuracion,
    plan,
    paciente,
    incluirRecetas,
    incluirListaCompras,
    incluirRecomendaciones,
    mensajePersonalizado,
    recomendacionesEditadas,
    notasAdicionales,
    pdfUrl,
  ]);

  // ============================================================================
  // DESCARGAR PDF
  // ============================================================================

  const handleDescargar = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plan_Alimentacion_${paciente.nombre.replace(/\s+/g, '_')}_${paciente.apellidos.replace(/\s+/g, '_')}_${plan.nombre.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // ENVIAR (abrir email)
  // ============================================================================

  const handleEnviar = () => {
    if (!pdfBlob) return;

    const subject = encodeURIComponent(`Plan de Alimentación: ${plan.nombre}`);
    const body = encodeURIComponent(
      `Hola ${paciente.nombre} ${paciente.apellidos},\n\nAdjunto encontrarás tu plan de alimentación "${plan.nombre}".\n\nSaludos,\n${configuracion?.branding.nombreProfesional || 'Profesional de la salud'}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (cargando) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Preparando editor..." size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando configuración...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="📄 Enviar Plan de Alimentación" size="xl">
      <div className="space-y-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Resumen del plan */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Resumen del plan</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Plan:</span>
              <p className="text-blue-900">{plan.nombre}</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Paciente:</span>
              <p className="text-blue-900">{paciente.nombre}</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Calorías:</span>
              <p className="text-blue-900">{plan.requerimientos.calorias} kcal/día</p>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Comidas:</span>
              <p className="text-blue-900">
                {Object.values(plan.distribucionComidas).reduce((sum, arr) => sum + arr.length, 0)}/día
              </p>
            </div>
          </div>
        </div>

        {/* Opciones editables */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
            Personalizar contenido del PDF
          </h4>

          {/* Mensaje personalizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje personalizado para el paciente
            </label>
            <textarea
              value={mensajePersonalizado}
              onChange={(e) => setMensajePersonalizado(e.target.value)}
              placeholder="Escribe un mensaje introductorio para el paciente..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={incluirRecetas}
                onChange={(e) => setIncluirRecetas(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">🍳 Incluir recetas</span>
                <p className="text-xs text-gray-500">Ingredientes y preparación</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={incluirListaCompras}
                onChange={(e) => setIncluirListaCompras(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">🛒 Incluir lista de compras</span>
                <p className="text-xs text-gray-500">Ingredientes agrupados</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={incluirRecomendaciones}
                onChange={(e) => setIncluirRecomendaciones(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">📋 Incluir recomendaciones</span>
                <p className="text-xs text-gray-500">Consejos nutricionales</p>
              </div>
            </label>
          </div>

          {/* Recomendaciones editables */}
          {incluirRecomendaciones && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-amber-800">
                  📋 Recomendaciones nutricionales
                </h5>
                <button
                  onClick={handleAgregarRecomendacion}
                  className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  + Agregar
                </button>
              </div>

              {recomendacionesEditadas.length === 0 ? (
                <p className="text-sm text-amber-600 italic">
                  No hay recomendaciones. Haz clic en "Agregar" para añadir una.
                </p>
              ) : (
                <div className="space-y-2">
                  {recomendacionesEditadas.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-amber-600 text-sm font-medium">{index + 1}.</span>
                      <input
                        type="text"
                        value={rec}
                        onChange={(e) => handleEditarRecomendacion(index, e.target.value)}
                        placeholder="Escribe una recomendación..."
                        className="flex-1 px-2 py-1.5 border border-amber-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleEliminarRecomendacion(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Eliminar recomendación"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notas adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              value={notasAdicionales}
              onChange={(e) => setNotasAdicionales(e.target.value)}
              placeholder="Notas adicionales que aparecerán al final del PDF..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Vista previa / Estado del PDF */}
        {pdfBlob && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">PDF generado exitosamente</span>
              <span className="text-xs text-green-500 ml-2">
                ({(pdfBlob.size / 1024).toFixed(1)} KB)
              </span>
              <button
                onClick={() => setVerPreview(true)}
                className="ml-auto px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                👁️ Ver PDF
              </button>
            </div>
          </div>
        )}

        {/* Vista previa del PDF (todas las páginas) */}
        {verPreview && pdfUrl && (
          <div className="border border-gray-200 rounded-lg overflow-auto" style={{ height: '70vh' }}>
            <VisorPDF
              pdfUrl={pdfUrl}
              onCerrar={() => setVerPreview(false)}
              permitirDescarga={false}
              permitirImpresion={false}
              nombreArchivo={`Plan_Alimentacion_${paciente.nombre.replace(/\s+/g, '_')}_${paciente.apellidos.replace(/\s+/g, '_')}_${plan.nombre.replace(/\s+/g, '_')}.pdf`}
            />
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {/* Generar PDF */}
            <button
              onClick={handleGenerarPDF}
              disabled={generando || !configuracion}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Generar PDF
                </>
              )}
            </button>

            {/* Descargar */}
            <button
              onClick={handleDescargar}
              disabled={!pdfBlob}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar
            </button>

            {/* Enviar por email */}
            <button
              onClick={handleEnviar}
              disabled={!pdfBlob}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
