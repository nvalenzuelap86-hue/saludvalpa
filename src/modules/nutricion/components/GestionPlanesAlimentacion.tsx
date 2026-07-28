// ============================================================================
// saludvalpa 3.0 - GESTIÓN DE PLANES DE ALIMENTACIÓN
// Componente principal para administrar planes de alimentación
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { usePlanesAlimentacion } from '../hooks/usePlanesAlimentacion';
import TarjetaPlan from './TarjetaPlan';
import EditorPlanAlimentacion from './EditorPlanAlimentacion';
import PlanAlimentacionPaciente from './PlanAlimentacionPaciente';
import type { PlanAlimentacion, FiltrosPlanes } from '../../../types/nutricion';
import type { Paciente } from '../../../types';

type Vista = 'lista' | 'crear' | 'editar' | 'detalle';

interface GestionPlanesAlimentacionProps {
  paciente: Paciente;
}

export default function GestionPlanesAlimentacion({ paciente }: GestionPlanesAlimentacionProps) {
  const pacienteId = paciente.id;
  const pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
  const {
    planes,
    planesActivos,
    plantillas,
    crearPlan,
    actualizarPlan,
    eliminarPlan,
    duplicarPlan,
    toggleActivo,
    asignarAPaciente,
    desasignarDePaciente,
    convertirEnPlantilla,
    filtrarPlanes,
    obtenerEstadisticas,
    obtenerPlanesPaciente,
  } = usePlanesAlimentacion();

  const [vista, setVista] = useState<Vista>('lista');
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanAlimentacion | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroObjetivo, setFiltroObjetivo] = useState<string>('');
  const [filtroActivo, setFiltroActivo] = useState<string>('todos');
  const [planesFiltrados, setPlanesFiltrados] = useState<PlanAlimentacion[]>([]);
  const [mostrarPlantillas, setMostrarPlantillas] = useState(false);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [planAsignar, setPlanAsignar] = useState<string | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null);
  const [planesPaciente, setPlanesPaciente] = useState<PlanAlimentacion[]>([]);

  // Cargar planes del paciente cuando se proporciona pacienteId
  useEffect(() => {
    if (pacienteId) {
      obtenerPlanesPaciente(pacienteId).then(setPlanesPaciente);
    }
  }, [pacienteId, obtenerPlanesPaciente]);

  // Aplicar filtros cuando cambian
  const aplicarFiltros = useCallback(async () => {
    const filtros: FiltrosPlanes = {};
    if (busqueda) filtros.busqueda = busqueda;
    if (filtroObjetivo) filtros.objetivo = filtroObjetivo as PlanAlimentacion['objetivo'];
    if (filtroActivo === 'activos') filtros.activo = true;
    else if (filtroActivo === 'inactivos') filtros.activo = false;
    if (mostrarPlantillas) filtros.esPlantilla = true;

    const resultados = await filtrarPlanes(filtros);
    setPlanesFiltrados(resultados);
  }, [busqueda, filtroObjetivo, filtroActivo, mostrarPlantillas, filtrarPlanes]);

  const handleCrear = async (
    nombre: string,
    descripcion: string,
    objetivo: PlanAlimentacion['objetivo'],
    opciones?: {
      pacienteId?: string;
      esPlantilla?: boolean;
      requerimientos?: PlanAlimentacion['requerimientos'];
      distribucionComidas?: PlanAlimentacion['distribucionComidas'];
      recomendaciones?: string[];
    }
  ) => {
    // When pacienteId is provided, auto-assign the new plan to this patient
    const opcionesConPaciente = {
      ...opciones,
      pacienteId: opciones?.pacienteId || pacienteId,
    };
    await crearPlan(nombre, descripcion, objetivo, opcionesConPaciente);
    setVista('lista');
  };

  const handleActualizar = async (
    id: string,
    nombre: string,
    descripcion: string,
    objetivo: PlanAlimentacion['objetivo'],
    opciones?: {
      esPlantilla?: boolean;
      requerimientos?: PlanAlimentacion['requerimientos'];
      distribucionComidas?: PlanAlimentacion['distribucionComidas'];
      recomendaciones?: string[];
    }
  ) => {
    await actualizarPlan(id, {
      nombre,
      descripcion,
      objetivo,
      esPlantilla: opciones?.esPlantilla,
      requerimientos: opciones?.requerimientos,
      distribucionComidas: opciones?.distribucionComidas,
      recomendaciones: opciones?.recomendaciones,
    });
    setVista('lista');
    setPlanSeleccionado(null);
  };

  const handleEliminar = async (id: string) => {
    await eliminarPlan(id);
    setConfirmarEliminar(null);
  };

  const handleDuplicar = async (id: string) => {
    const plan = planes.find(p => p.id === id);
    if (plan) {
      await duplicarPlan(id, `${plan.nombre} (copia)`);
    }
  };

  // Determine which plans to display
  // When pacienteId is provided, show only this patient's plans
  const planesBase = pacienteId ? planesPaciente : planes;
  const planesAMostrar = planesFiltrados.length > 0 || busqueda || filtroObjetivo || filtroActivo !== 'todos'
    ? planesFiltrados
    : mostrarPlantillas
      ? plantillas
      : planesBase;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planes de Alimentación</h2>
          <p className="text-sm text-gray-500 mt-1">
            {planesBase.length} planes • {planesActivos.length} activos • {plantillas.length} plantillas
          </p>
        </div>
        <button
          onClick={() => { setVista('crear'); setPlanSeleccionado(null); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Nuevo plan
        </button>
      </div>

      {/* Editor/Creador */}
      {(vista === 'crear' || vista === 'editar') && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {vista === 'crear' ? 'Crear nuevo plan' : 'Editar plan'}
            </h3>
            <button
              onClick={() => { setVista('lista'); setPlanSeleccionado(null); }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <EditorPlanAlimentacion
            plan={vista === 'editar' ? planSeleccionado : undefined}
            onGuardar={(
              nombre: string,
              descripcion: string,
              objetivo: PlanAlimentacion['objetivo'],
              opciones?: {
                pacienteId?: string;
                esPlantilla?: boolean;
                requerimientos?: PlanAlimentacion['requerimientos'];
                distribucionComidas?: PlanAlimentacion['distribucionComidas'];
                recomendaciones?: string[];
              }
            ) => {
              if (vista === 'crear') {
                handleCrear(nombre, descripcion, objetivo, opciones);
              } else if (planSeleccionado) {
                handleActualizar(planSeleccionado.id, nombre, descripcion, objetivo, opciones);
              }
            }}
            onCancelar={() => { setVista('lista'); setPlanSeleccionado(null); }}
          />
        </div>
      )}

      {/* Detalle del plan */}
      {vista === 'detalle' && planSeleccionado && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{planSeleccionado.nombre}</h3>
            <button
              onClick={() => { setVista('lista'); setPlanSeleccionado(null); }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <PlanAlimentacionPaciente
            plan={planSeleccionado}
            onVolver={() => { setVista('lista'); setPlanSeleccionado(null); }}
            paciente={paciente}
          />
        </div>
      )}

      {/* Filtros y búsqueda */}
      {vista === 'lista' && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar planes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={filtroObjetivo}
                onChange={(e) => setFiltroObjetivo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los objetivos</option>
                <option value="perder_peso">Pérdida de peso</option>
                <option value="ganar_musculo">Ganancia muscular</option>
                <option value="mantener">Mantenimiento</option>
                <option value="control_enfermedad">Control de enfermedad</option>
                <option value="rendimiento">Rendimiento deportivo</option>
              </select>
              <select
                value={filtroActivo}
                onChange={(e) => setFiltroActivo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={mostrarPlantillas}
                  onChange={(e) => setMostrarPlantillas(e.target.checked)}
                  className="rounded"
                />
                Solo plantillas
              </label>
              <button
                onClick={aplicarFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
              >
                Filtrar
              </button>
            </div>
          </div>

          {/* Grid de planes */}
          {planesAMostrar.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planesAMostrar.map((plan) => (
                <TarjetaPlan
                  key={plan.id}
                  plan={plan}
                  onClick={() => {
                    setPlanSeleccionado(plan);
                    setVista('detalle');
                  }}
                  onEditar={() => {
                    setPlanSeleccionado(plan);
                    setVista('editar');
                  }}
                  onEliminar={() => setConfirmarEliminar(plan.id)}
                  onDuplicar={() => handleDuplicar(plan.id)}
                  onToggleActivo={() => toggleActivo(plan.id)}
                  onAsignar={() => {
                    setPlanAsignar(plan.id);
                    setMostrarAsignar(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No se encontraron planes</p>
              <p className="text-sm mt-1">Crea un nuevo plan o ajusta los filtros</p>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar plan?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción no se puede deshacer. Se eliminarán todas las comidas y seguimiento asociados.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(confirmarEliminar)}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
