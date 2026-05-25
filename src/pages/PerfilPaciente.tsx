// ============================================================================
// saludvalpa 3.0 - PERFIL DE PACIENTE
// Vista individual del paciente con modo dual
// ============================================================================

import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db/database';
import type { Paciente } from '../types';
import TarjetaPaciente from '../components/TarjetaPaciente';
import Modal from '../components/shared/Modal';
import FormularioPaciente from '../components/FormularioPaciente';
import SesionEnVivo from '../components/SesionEnVivo';
import { usePacientes } from '../hooks/usePacientes';
import { useAppStore } from '../stores/appStore';

// Lazy load de componentes de fisioterapia
const GenerarEvaluacionFisioterapeutica = lazy(() => import('../modules/fisioterapia/components/GenerarEvaluacionFisioterapeutica'));
const GenerarPlanTratamiento = lazy(() => import('../modules/fisioterapia/components/GenerarPlanTratamiento'));
const GenerarNotaEvolucion = lazy(() => import('../modules/fisioterapia/components/GenerarNotaEvolucion'));

type TipoSesion = 'general' | 'evaluacion' | 'plan' | 'nota' | null;

const PerfilPaciente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { configuracion } = useAppStore();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [cargando, setCargando] = useState(true);
  const { actualizarPaciente, eliminarPaciente } = usePacientes();
  
  // Estado para el modal de sesión
  const [modalSesionAbierto, setModalSesionAbierto] = useState(false);
  const [tipoSesionActiva, setTipoSesionActiva] = useState<TipoSesion>(null);
  const [sesionEnVivoActiva, setSesionEnVivoActiva] = useState(false);

  useEffect(() => {
    const cargarPaciente = async () => {
      if (!id) return;
      
      try {
        const p = await db.pacientes.get(id);
        if (p) {
          setPaciente(p);
        } else {
          navigate('/pacientes');
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPaciente();
  }, [id, navigate]);

  const handleActualizar = async (datos: Omit<Paciente, 'id' | 'fechaCreacion' | 'edad'>) => {
    if (!id) return;
    
    const resultado = await actualizarPaciente(id, datos);
    if (resultado.success) {
      setMostrarEditar(false);
      // Recargar paciente
      const actualizado = await db.pacientes.get(id);
      if (actualizado) setPaciente(actualizado);
    }
  };

  const handleEliminar = async () => {
    if (!paciente) return;

    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar a ${paciente.nombre} ${paciente.apellidos}?\n\n` +
      'Esta acción no se puede deshacer. Se eliminarán también todas las sesiones, citas y documentos asociados.'
    );

    if (!confirmacion) return;

    const resultado = await eliminarPaciente(paciente.id);
    if (resultado.success) {
      navigate('/pacientes');
    } else {
      alert('Error al eliminar paciente: ' + resultado.error);
    }
  };

  const handleSeleccionarTipoSesion = (tipo: TipoSesion) => {
    setTipoSesionActiva(tipo);
    setModalSesionAbierto(false);
    // Para consulta general, activar SesionEnVivo directamente
    if (tipo === 'general') {
      setSesionEnVivoActiva(true);
    }
  };

  const cerrarSesion = () => {
    setTipoSesionActiva(null);
    setSesionEnVivoActiva(false);
  };

  const handleAbrirModalSesion = () => {
    setModalSesionAbierto(true);
  };


  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-saludvalpa-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">❌</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Paciente no encontrado</h2>
          <button
            onClick={() => navigate('/pacientes')}
            className="text-saludvalpa-blue hover:underline"
          >
            ← Volver a pacientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate('/pacientes')}
        className="text-saludvalpa-blue hover:underline mb-4 flex items-center gap-1"
      >
        ← Volver a pacientes
      </button>

      {/* Tarjeta de paciente */}
      <TarjetaPaciente
        paciente={paciente}
        onEditar={() => setMostrarEditar(true)}
        onEliminar={handleEliminar}
        onAbrirModalSesion={handleAbrirModalSesion}
      />


      {/* Sesión en vivo para Consulta General */}
      {sesionEnVivoActiva && (
        <div className="mt-6">
          <SesionEnVivo
            paciente={paciente}
            profesion={configuracion?.profesion || 'fisioterapia'}
            onCerrar={cerrarSesion}
          />
        </div>
      )}

      {/* Modal selector de tipo de sesión */}
      <Modal
        isOpen={modalSesionAbierto}
        onClose={() => setModalSesionAbierto(false)}
        title="Seleccionar tipo de sesión"
        size="md"
      >
        <div className="space-y-3">
          <button
            onClick={() => handleSeleccionarTipoSesion('general')}
            className="w-full bg-white border-2 border-gray-200 hover:border-saludvalpa-blue hover:bg-blue-50 p-4 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏥</span>
              <div>
                <div className="font-medium text-gray-900">Consulta General</div>
                <div className="text-sm text-gray-600">Sesión estándar sin documento específico</div>
              </div>
            </div>
          </button>

          {configuracion?.profesion === 'fisioterapia' && (
            <>
              <button
                onClick={() => handleSeleccionarTipoSesion('evaluacion')}
                className="w-full bg-white border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 p-4 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🩺</span>
                  <div>
                    <div className="font-medium text-gray-900">Evaluación Fisioterapéutica</div>
                    <div className="text-sm text-gray-600">Valoración inicial completa</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSeleccionarTipoSesion('plan')}
                className="w-full bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 p-4 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-medium text-gray-900">Plan de Tratamiento</div>
                    <div className="text-sm text-gray-600">Definir objetivos y estrategias</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSeleccionarTipoSesion('nota')}
                className="w-full bg-white border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 p-4 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-900">Nota de Evolución</div>
                    <div className="text-sm text-gray-600">Registro de progreso y cambios</div>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Modales de documentos activos */}
      {tipoSesionActiva === 'evaluacion' && configuracion?.profesion === 'fisioterapia' && (
        <Modal
          isOpen={true}
          onClose={cerrarSesion}
          title="Evaluación Fisioterapéutica"
          size="xl"
        >
          <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
            <GenerarEvaluacionFisioterapeutica
              paciente={paciente}
              onExito={cerrarSesion}
              onCancelar={cerrarSesion}
            />
          </Suspense>
        </Modal>
      )}

      {tipoSesionActiva === 'plan' && configuracion?.profesion === 'fisioterapia' && (
        <Modal
          isOpen={true}
          onClose={cerrarSesion}
          title="Plan de Tratamiento"
          size="xl"
        >
          <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
            <GenerarPlanTratamiento
              paciente={paciente}
              onExito={cerrarSesion}
              onCancelar={cerrarSesion}
            />
          </Suspense>
        </Modal>
      )}

      {tipoSesionActiva === 'nota' && configuracion?.profesion === 'fisioterapia' && (
        <Modal
          isOpen={true}
          onClose={cerrarSesion}
          title="Nota de Evolución"
          size="xl"
        >
          <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
            <GenerarNotaEvolucion
              paciente={paciente}
              onExito={cerrarSesion}
              onCancelar={cerrarSesion}
            />
          </Suspense>
        </Modal>
      )}


      {/* Modal de edición de paciente */}
      <Modal
        isOpen={mostrarEditar}
        onClose={() => setMostrarEditar(false)}
        title="Editar paciente"
        size="xl"
      >
        <FormularioPaciente
          paciente={paciente}
          onSubmit={handleActualizar}
          onCancel={() => setMostrarEditar(false)}
        />
      </Modal>
    </div>
  );
};

export default PerfilPaciente;
