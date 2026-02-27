// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE SESIÓN EN VIVO
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import type { Paciente, Material, TipoProfesion } from '../types';
import { useSesiones } from '../hooks/useSesiones';
import { db } from '../db/database';

// Importaremos los componentes específicos de cada profesión
import CamposFisioterapia from '../modules/fisioterapia/components/CamposFisioterapia';
import CamposPsicologia from './CamposPsicologia';
import CamposManicurista from './CamposManicurista';
import CamposMedicina from '../modules/medicina/components/CamposMedicina';
import CamposOdontologia from '../modules/odontologia/components/CamposOdontologia';

interface SesionEnVivoProps {
  paciente: Paciente;
  profesion: TipoProfesion;
  onCerrar: () => void;
  citaId?: string; // Si viene de una cita
  sesionExistenteId?: string; // Si se está editando una sesión
}

export default function SesionEnVivo({ 
  paciente, 
  profesion, 
  onCerrar,
  citaId,
  sesionExistenteId 
}: SesionEnVivoProps) {
  const { crearSesion, actualizarSesion, agregarMaterial, eliminarMaterial, agregarMedioFisico, eliminarMedioFisico, obtenerSesion } = useSesiones();

  // Estado de la sesión
  const [sesionId, setSesionId] = useState<string | null>(sesionExistenteId || null);
  const [tipoSesion, setTipoSesion] = useState('consulta_general');
  const [notas, setNotas] = useState('');
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [mediosFisicos, setMediosFisicos] = useState<string[]>([]);
  const [datosEspecificos, setDatosEspecificos] = useState<any>({});
  const [costo, setCosto] = useState<number>(0);

  // Estado del temporizador
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [temporizadorActivo, setTemporizadorActivo] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Estado de guardado
  const [guardando, setGuardando] = useState(false);
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null);
  const autoguardadoRef = useRef<number | null>(null);

  // Estado para formularios de agregado rápido
  const [nuevoMaterial, setNuevoMaterial] = useState({ nombre: '', cantidad: 1, costo: 0 });
  const [nuevoMedio, setNuevoMedio] = useState('');
  const [generandoPDF, setGenerandoPDF] = useState(false);

  // -------------------------------------------------------------------------
  // CARGAR SESIÓN EXISTENTE SI ES EDICIÓN
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (sesionExistenteId) {
      const cargarSesion = async () => {
        const sesion = await obtenerSesion(sesionExistenteId);
        if (sesion) {
          setTipoSesion(sesion.tipo);
          setNotas(sesion.notas);
          setMateriales(sesion.materialesUtilizados);
          setMediosFisicos(sesion.mediosFisicos);
          setDatosEspecificos(sesion.datosEspecificosProfesion || {});
          setCosto(sesion.costo || 0);
          
          // Calcular tiempo transcurrido desde la creación
          const duracion = sesion.duracion || 0;
          setSegundosTranscurridos(duracion * 60);
        }
      };
      cargarSesion();
    }
  }, [sesionExistenteId, obtenerSesion]);

  // -------------------------------------------------------------------------
  // TEMPORIZADOR
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (temporizadorActivo) {
      intervalRef.current = window.setInterval(() => {
        setSegundosTranscurridos(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [temporizadorActivo]);

  // -------------------------------------------------------------------------
  // AUTOGUARDADO
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (sesionId) {
      autoguardadoRef.current = window.setInterval(() => {
        guardarBorrador();
      }, 30000); // Autoguardar cada 30 segundos

      return () => {
        if (autoguardadoRef.current) {
          clearInterval(autoguardadoRef.current);
        }
      };
    }
  }, [sesionId, notas, materiales, mediosFisicos, datosEspecificos, costo]);

  // -------------------------------------------------------------------------
  // GUARDAR BORRADOR (autoguardado)
  // -------------------------------------------------------------------------
  const guardarBorrador = async () => {
    if (!sesionId) return;
    
    try {
      setGuardando(true);
      await actualizarSesion(sesionId, {
        tipo: tipoSesion,
        notas,
        materialesUtilizados: materiales,
        mediosFisicos,
        datosEspecificosProfesion: datosEspecificos,
        costo,
        duracion: Math.floor(segundosTranscurridos / 60),
      });
      setUltimoGuardado(new Date());
    } catch (error) {
      console.error('Error en autoguardado:', error);
    } finally {
      setGuardando(false);
    }
  };

  // -------------------------------------------------------------------------
  // INICIAR SESIÓN (crear en DB)
  // -------------------------------------------------------------------------
  const iniciarSesion = async () => {
    if (sesionId) return; // Ya está iniciada

    try {
      const id = await crearSesion({
        pacienteId: paciente.id,
        profesion: profesion,
        fecha: new Date(),
        tipo: tipoSesion,
        notas: '',
        materialesUtilizados: [],
        mediosFisicos: [],
        datosEspecificosProfesion: {},
        documentosGenerados: [],
      });
      
      setSesionId(id);
      setUltimoGuardado(new Date());
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar la sesión');
    }
  };

  // Iniciar sesión automáticamente al montar si no es edición
  useEffect(() => {
    if (!sesionExistenteId) {
      iniciarSesion();
    }
  }, []);

  // -------------------------------------------------------------------------
  // AGREGAR MATERIAL
  // -------------------------------------------------------------------------
  const handleAgregarMaterial = async () => {
    if (!nuevoMaterial.nombre.trim() || !sesionId) return;

    const material: Material = {
      nombre: nuevoMaterial.nombre,
      cantidad: nuevoMaterial.cantidad,
      costo: nuevoMaterial.costo,
    };

    try {
      await agregarMaterial(sesionId, material);
      setMateriales(prev => [...prev, material]);
      setNuevoMaterial({ nombre: '', cantidad: 1, costo: 0 });
    } catch (error) {
      console.error('Error al agregar material:', error);
    }
  };

  // -------------------------------------------------------------------------
  // ELIMINAR MATERIAL
  // -------------------------------------------------------------------------
  const handleEliminarMaterial = async (indice: number) => {
    if (!sesionId) return;

    try {
      await eliminarMaterial(sesionId, indice);
      setMateriales(prev => prev.filter((_, i) => i !== indice));
    } catch (error) {
      console.error('Error al eliminar material:', error);
    }
  };

  // -------------------------------------------------------------------------
  // AGREGAR MEDIO FÍSICO
  // -------------------------------------------------------------------------
  const handleAgregarMedio = async () => {
    if (!nuevoMedio.trim() || !sesionId) return;

    try {
      await agregarMedioFisico(sesionId, nuevoMedio);
      setMediosFisicos(prev => [...prev, nuevoMedio]);
      setNuevoMedio('');
    } catch (error) {
      console.error('Error al agregar medio físico:', error);
    }
  };

  // -------------------------------------------------------------------------
  // ELIMINAR MEDIO FÍSICO
  // -------------------------------------------------------------------------
  const handleEliminarMedio = async (indice: number) => {
    if (!sesionId) return;

    try {
      await eliminarMedioFisico(sesionId, indice);
      setMediosFisicos(prev => prev.filter((_, i) => i !== indice));
    } catch (error) {
      console.error('Error al eliminar medio físico:', error);
    }
  };

  // -------------------------------------------------------------------------
  // FINALIZAR SESIÓN Y GENERAR REPORTE
  // -------------------------------------------------------------------------
  const finalizarSesion = async () => {
    if (!sesionId) {
      alert('No hay sesión activa');
      return;
    }

    if (!notas.trim()) {
      if (!confirm('No has agregado notas a la sesión. ¿Deseas continuar?')) {
        return;
      }
    }

    try {
      setGenerandoPDF(true);

      // Guardar una última vez
      await actualizarSesion(sesionId, {
        tipo: tipoSesion,
        notas,
        materialesUtilizados: materiales,
        mediosFisicos,
        datosEspecificosProfesion: datosEspecificos,
        costo,
        duracion: Math.floor(segundosTranscurridos / 60),
      });

      // Si viene de una cita, actualizarla
      if (citaId) {
        await db.citas.update(citaId, { 
          estado: 'completada',
          sesionId: sesionId 
        });
      }

      // Generar reporte PDF
      const { generarReporteSesion } = await import('../services/pdfService');
      const sesion = await obtenerSesion(sesionId);
      if (sesion) {
        await generarReporteSesion(sesion, paciente, profesion);
      }

      // Cerrar y volver
      alert('Sesión finalizada y reporte generado exitosamente');
      onCerrar();
    } catch (error) {
      console.error('Error al finalizar sesión:', error);
      alert('Error al finalizar la sesión');
    } finally {
      setGenerandoPDF(false);
    }
  };

  // -------------------------------------------------------------------------
  // CANCELAR SESIÓN
  // -------------------------------------------------------------------------
  const cancelarSesion = async () => {
    if (!confirm('¿Estás seguro de cancelar esta sesión? Los cambios no guardados se perderán.')) {
      return;
    }

    // Detener temporizador
    setTemporizadorActivo(false);
    onCerrar();
  };

  // -------------------------------------------------------------------------
  // FORMATEAR TIEMPO
  // -------------------------------------------------------------------------
  const formatearTiempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------------------
  // RENDERIZADO
  // -------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header fijo */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <button
                onClick={cancelarSesion}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Salir</span>
              </button>
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-saludvalpa-blue">
                {paciente.nombre} {paciente.apellidos}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="text-2xl font-mono text-saludvalpa-teal font-bold">
                  {formatearTiempo(segundosTranscurridos)}
                </span>
                <button
                  onClick={() => setTemporizadorActivo(!temporizadorActivo)}
                  className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  {temporizadorActivo ? '⏸ Pausar' : '▶ Reanudar'}
                </button>
              </div>
              {ultimoGuardado && (
                <p className="text-xs text-gray-500 mt-1">
                  {guardando ? '💾 Guardando...' : `✓ Guardado ${new Date(ultimoGuardado).toLocaleTimeString()}`}
                </p>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={finalizarSesion}
                disabled={generandoPDF}
                className="bg-saludvalpa-lime text-white px-6 py-2 rounded-lg hover:bg-saludvalpa-lime/90 font-semibold disabled:opacity-50"
              >
                {generandoPDF ? '⏳ Generando...' : '✅ Finalizar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Tipo de sesión */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de sesión
          </label>
          <select
            value={tipoSesion}
            onChange={(e) => setTipoSesion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
          >
            <option value="consulta_general">Consulta general</option>
            <option value="primera_vez">Primera vez</option>
            <option value="seguimiento">Seguimiento</option>
            <option value="evaluacion">Evaluación</option>
            <option value="tratamiento">Tratamiento</option>
            <option value="urgencia">Urgencia</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Notas clínicas */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ✏️ Notas de la sesión
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Escribe aquí las notas de la sesión, observaciones, evolución del paciente, etc..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue min-h-[150px] resize-y"
          />
        </div>

        {/* Materiales utilizados */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">💊 Materiales utilizados</h3>
          
          {/* Lista de materiales */}
          {materiales.length > 0 && (
            <div className="space-y-2 mb-4">
              {materiales.map((material, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <div className="flex-1">
                    <span className="font-medium">{material.nombre}</span>
                    <span className="text-gray-600 ml-2">x{material.cantidad}</span>
                    {material.costo && material.costo > 0 && (
                      <span className="text-gray-500 ml-2">${material.costo.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEliminarMaterial(idx)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form agregar material */}
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevoMaterial.nombre}
              onChange={(e) => setNuevoMaterial(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del material"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
              onKeyPress={(e) => e.key === 'Enter' && handleAgregarMaterial()}
            />
            <input
              type="number"
              value={nuevoMaterial.cantidad}
              onChange={(e) => setNuevoMaterial(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
              min="1"
              className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
            <button
              onClick={handleAgregarMaterial}
              className="px-4 py-2 bg-saludvalpa-blue text-white rounded hover:bg-saludvalpa-blue/90 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Medios físicos */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🔧 Medios físicos aplicados</h3>
          
          {/* Lista de medios */}
          {mediosFisicos.length > 0 && (
            <div className="space-y-2 mb-4">
              {mediosFisicos.map((medio, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="font-medium">{medio}</span>
                  <button
                    onClick={() => handleEliminarMedio(idx)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form agregar medio */}
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevoMedio}
              onChange={(e) => setNuevoMedio(e.target.value)}
              placeholder="Ej: Ultrasonido, Electroestimulación, Masaje..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
              onKeyPress={(e) => e.key === 'Enter' && handleAgregarMedio()}
            />
            <button
              onClick={handleAgregarMedio}
              className="px-4 py-2 bg-saludvalpa-blue text-white rounded hover:bg-saludvalpa-blue/90 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Campos específicos de cada profesión */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📋 Información específica
          </h3>
          
          {profesion === 'fisioterapia' && (
            <CamposFisioterapia
              datos={datosEspecificos}
              onChange={setDatosEspecificos}
            />
          )}

          {profesion === 'psicologia' && (
            <CamposPsicologia
              datos={datosEspecificos}
              onChange={setDatosEspecificos}
            />
          )}

          {profesion === 'nutricion' && (
            <CamposManicurista
              datos={datosEspecificos}
              onChange={setDatosEspecificos}
            />
          )}

          {profesion === 'medicina_general' && (
            <CamposMedicina
              datos={datosEspecificos}
              onChange={setDatosEspecificos}
            />
          )}

          {profesion === 'odontologia' && (
            <CamposOdontologia
              datos={datosEspecificos}
              onChange={setDatosEspecificos}
            />
          )}
        </div>

        {/* Costo de la sesión */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💵 Costo de la sesión (opcional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">$</span>
            <input
              type="number"
              value={costo}
              onChange={(e) => setCosto(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
            <span className="text-gray-500 text-sm">MXN</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={cancelarSesion}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={guardarBorrador}
            disabled={guardando || !sesionId}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50"
          >
            {guardando ? '💾 Guardando...' : '💾 Guardar borrador'}
          </button>
          <button
            onClick={finalizarSesion}
            disabled={generandoPDF || !sesionId}
            className="flex-1 px-6 py-3 bg-saludvalpa-lime text-white rounded-lg hover:bg-saludvalpa-lime/90 font-semibold disabled:opacity-50"
          >
            {generandoPDF ? '⏳ Finalizando...' : '✅ Finalizar y generar reporte'}
          </button>
        </div>
      </div>
    </div>
  );
}
