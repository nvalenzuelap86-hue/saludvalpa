// ============================================================================
// COMPONENTE: EditorRutina
// Editor completo para crear y editar rutinas de ejercicios
// ============================================================================

import { useState, useEffect } from 'react';
import Modal from '../../../components/shared/Modal';
import SelectorEjercicios from './SelectorEjercicios';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePacientes } from '../../../hooks/usePacientes';
import {
  NivelRutina,
  type RutinaEjercicios,
  type Ejercicio,
  type EjercicioEnRutina,
} from '../../../types';

interface EditorRutinaProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (rutina: Omit<RutinaEjercicios, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  rutinaEditar?: RutinaEjercicios;
}

export default function EditorRutina({
  isOpen,
  onClose,
  onGuardar,
  rutinaEditar,
}: EditorRutinaProps) {
  const { pacientes } = usePacientes();
  const esEdicion = !!rutinaEditar;

  // Estado del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState<string>(NivelRutina.INTERMEDIO);
  const [diasPorSemana, setDiasPorSemana] = useState<number>(3);
  const [duracionSemanas, setDuracionSemanas] = useState<number | ''>('');
  const [esPlantilla, setEsPlantilla] = useState(false);
  const [pacienteId, setPacienteId] = useState<string>('');
  const [ejercicios, setEjercicios] = useState<EjercicioEnRutina[]>([]);
  const [notasGenerales, setNotasGenerales] = useState('');

  // Estado de modales y UI
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (rutinaEditar && isOpen) {
      setNombre(rutinaEditar.nombre);
      setDescripcion(rutinaEditar.descripcion || '');
      setObjetivo(rutinaEditar.objetivo);
      setNivel(rutinaEditar.nivel);
      setDiasPorSemana(rutinaEditar.frecuencia.diasPorSemana);
      setDuracionSemanas(rutinaEditar.frecuencia.duracionSemanas || '');
      setEsPlantilla(rutinaEditar.esPlantilla);
      setPacienteId(rutinaEditar.pacienteId || '');
      setEjercicios([...rutinaEditar.ejercicios]);
      setNotasGenerales(rutinaEditar.notasGenerales || '');
    } else if (!esEdicion && isOpen) {
      resetearFormulario();
    }
  }, [rutinaEditar, isOpen, esEdicion]);

  const resetearFormulario = () => {
    setNombre('');
    setDescripcion('');
    setObjetivo('');
    setNivel(NivelRutina.INTERMEDIO);
    setDiasPorSemana(3);
    setDuracionSemanas('');
    setEsPlantilla(false);
    setPacienteId('');
    setEjercicios([]);
    setNotasGenerales('');
    setError('');
  };

  // ============================================================================
  // MANEJO DE EJERCICIOS
  // ============================================================================

  const handleAgregarEjercicio = (ejercicio: Ejercicio) => {
    const nuevoEjercicio: EjercicioEnRutina = {
      ejercicioId: ejercicio.id,
      orden: ejercicios.length + 1,
      series: 3,
      repeticiones: 10,
      duracionSegundos: undefined,
      descansoSegundos: 60,
      notasEspeciales: '',
    };

    setEjercicios([...ejercicios, nuevoEjercicio]);
  };

  const handleEliminarEjercicio = (index: number) => {
    const nuevosEjercicios = ejercicios.filter((_, i) => i !== index);
    // Reordenar
    nuevosEjercicios.forEach((ej, i) => {
      ej.orden = i + 1;
    });
    setEjercicios(nuevosEjercicios);
  };

  const handleMoverEjercicio = (index: number, direccion: 'arriba' | 'abajo') => {
    const nuevosEjercicios = [...ejercicios];
    const targetIndex = direccion === 'arriba' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= nuevosEjercicios.length) {
      return;
    }

    // Intercambiar
    [nuevosEjercicios[index], nuevosEjercicios[targetIndex]] = 
    [nuevosEjercicios[targetIndex], nuevosEjercicios[index]];

    // Reordenar
    nuevosEjercicios.forEach((ej, i) => {
      ej.orden = i + 1;
    });

    setEjercicios(nuevosEjercicios);
  };

  const handleActualizarEjercicio = (index: number, cambios: Partial<EjercicioEnRutina>) => {
    const nuevosEjercicios = [...ejercicios];
    nuevosEjercicios[index] = { ...nuevosEjercicios[index], ...cambios };
    setEjercicios(nuevosEjercicios);
  };

  // ============================================================================
  // CÁLCULOS
  // ============================================================================

  const calcularDuracionTotal = (): number => {
    let totalMinutos = 0;

    for (const ej of ejercicios) {
      // Duración del ejercicio
      if (ej.duracionSegundos) {
        totalMinutos += (ej.duracionSegundos / 60);
      }

      // Descanso entre series
      if (ej.series && ej.descansoSegundos) {
        const descansoTotal = (ej.series - 1) * ej.descansoSegundos;
        totalMinutos += (descansoTotal / 60);
      }

      // Si no tiene duración, estimar 2 minutos
      if (!ej.duracionSegundos && (!ej.series || !ej.descansoSegundos)) {
        totalMinutos += 2;
      }
    }

    return Math.ceil(totalMinutos);
  };

  // ============================================================================
  // VALIDACIÓN Y GUARDADO
  // ============================================================================

  const validarFormulario = (): boolean => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }

    if (!objetivo.trim()) {
      setError('El objetivo es obligatorio');
      return false;
    }

    if (ejercicios.length === 0) {
      setError('Debes agregar al menos un ejercicio a la rutina');
      return false;
    }

    if (diasPorSemana < 1 || diasPorSemana > 7) {
      setError('Los días por semana deben estar entre 1 y 7');
      return false;
    }

    // Si es plantilla, no puede tener paciente asignado
    if (esPlantilla && pacienteId) {
      setError('Una plantilla no puede tener un paciente asignado');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      const rutina: Omit<RutinaEjercicios, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        objetivo: objetivo.trim(),
        duracionEstimadaMinutos: calcularDuracionTotal(),
        frecuencia: {
          diasPorSemana,
          duracionSemanas: duracionSemanas ? Number(duracionSemanas) : undefined,
        },
        ejercicios,
        nivel: nivel as any,
        equipoNecesario: [], // Se calculará en el hook
        esPlantilla,
        pacienteId: pacienteId || undefined,
        notasGenerales: notasGenerales.trim() || undefined,
        usuarioCreadorId: '1', // TODO: Obtener del usuario actual
        fechaAsignacion: pacienteId ? new Date() : undefined,
        activa: true,
      };

      await onGuardar(rutina);
      resetearFormulario();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la rutina');
    } finally {
      setGuardando(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={esEdicion ? 'Editar Rutina' : 'Nueva Rutina de Ejercicios'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              📋 Información General
            </h3>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nombre de la Rutina <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: Rehabilitación de hombro post-operatorio"
                required
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Objetivo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: Recuperar movilidad y fuerza del hombro"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Descripción adicional de la rutina..."
              />
            </div>

            {/* Nivel y Frecuencia */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nivel <span className="text-red-500">*</span>
                </label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  required
                >
                  <option value={NivelRutina.PRINCIPIANTE}>Principiante</option>
                  <option value={NivelRutina.INTERMEDIO}>Intermedio</option>
                  <option value={NivelRutina.AVANZADO}>Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Días/Semana <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={diasPorSemana}
                  onChange={(e) => setDiasPorSemana(Number(e.target.value))}
                  min="1"
                  max="7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Duración (semanas)
                </label>
                <input
                  type="number"
                  value={duracionSemanas}
                  onChange={(e) => setDuracionSemanas(e.target.value ? Number(e.target.value) : '')}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Opciones */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esPlantilla}
                  onChange={(e) => {
                    setEsPlantilla(e.target.checked);
                    if (e.target.checked) {
                      setPacienteId(''); // Limpiar paciente si se marca como plantilla
                    }
                  }}
                  className="rounded text-saludvalpa-blue focus:ring-saludvalpa-blue"
                />
                <span className="text-sm text-gray-700">
                  Guardar como plantilla reutilizable
                </span>
              </label>
            </div>

            {/* Selector de Paciente */}
            {!esPlantilla && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Asignar a Paciente
                </label>
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                >
                  <option value="">Sin asignar</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellidos}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Ejercicios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                💪 Ejercicios ({ejercicios.length})
              </h3>
              <button
                type="button"
                onClick={() => setSelectorAbierto(true)}
                className="bg-saludvalpa-blue text-white px-3 py-1 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors text-sm"
              >
                + Agregar Ejercicio
              </button>
            </div>

            {/* Lista de ejercicios */}
            {ejercicios.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">💪</div>
                <p className="text-gray-600 mb-3">No hay ejercicios en la rutina</p>
                <button
                  type="button"
                  onClick={() => setSelectorAbierto(true)}
                  className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark font-medium"
                >
                  Agregar primer ejercicio
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {ejercicios.map((ejercicio, index) => (
                  <EjercicioEnRutinaItem
                    key={index}
                    ejercicio={ejercicio}
                    index={index}
                    totalEjercicios={ejercicios.length}
                    onActualizar={(cambios) => handleActualizarEjercicio(index, cambios)}
                    onMover={(dir) => handleMoverEjercicio(index, dir)}
                    onEliminar={() => handleEliminarEjercicio(index)}
                  />
                ))}
              </div>
            )}

            {/* Resumen */}
            {ejercicios.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-900">
                    Duración estimada:
                  </span>
                  <span className="text-blue-800">
                    ⏱️ {calcularDuracionTotal()} minutos
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notas Generales */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Notas Generales
            </label>
            <textarea
              value={notasGenerales}
              onChange={(e) => setNotasGenerales(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="Indicaciones generales, precauciones, observaciones..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={guardando || ejercicios.length === 0}
              className="flex-1 bg-saludvalpa-blue text-white py-2 px-4 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Rutina' : 'Crear Rutina'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetearFormulario();
                onClose();
              }}
              disabled={guardando}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Selector de Ejercicios */}
      <SelectorEjercicios
        isOpen={selectorAbierto}
        onClose={() => setSelectorAbierto(false)}
        onSeleccionar={handleAgregarEjercicio}
        ejerciciosYaSeleccionados={ejercicios.map(e => e.ejercicioId)}
      />
    </>
  );
}

// ============================================================================
// COMPONENTE AUXILIAR: Item de Ejercicio en Rutina
// ============================================================================

interface EjercicioEnRutinaItemProps {
  ejercicio: EjercicioEnRutina;
  index: number;
  totalEjercicios: number;
  onActualizar: (cambios: Partial<EjercicioEnRutina>) => void;
  onMover: (direccion: 'arriba' | 'abajo') => void;
  onEliminar: () => void;
}

function EjercicioEnRutinaItem({
  ejercicio,
  index,
  totalEjercicios,
  onActualizar,
  onMover,
  onEliminar,
}: EjercicioEnRutinaItemProps) {
  const { obtenerEjercicio } = useBiblioteca();
  const [ejercicioInfo, setEjercicioInfo] = useState<Ejercicio | null>(null);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    obtenerEjercicio(ejercicio.ejercicioId).then(ej => {
      if (ej) setEjercicioInfo(ej);
    });
  }, [ejercicio.ejercicioId]);

  if (!ejercicioInfo) {
    return <div className="p-3 bg-gray-50 rounded-lg animate-pulse">Cargando...</div>;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-saludvalpa-blue transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Número de orden */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onMover('arriba')}
            disabled={index === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover arriba"
          >
            ▲
          </button>
          <span className="text-sm font-bold text-gray-600 text-center">
            {ejercicio.orden}
          </span>
          <button
            type="button"
            onClick={() => onMover('abajo')}
            disabled={index === totalEjercicios - 1}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover abajo"
          >
            ▼
          </button>
        </div>

        {/* Información del ejercicio */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{ejercicioInfo.nombre}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {ejercicioInfo.categoria} • {ejercicioInfo.intensidad}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setExpandido(!expandido)}
                className="text-gray-600 hover:text-gray-800 px-2"
                title={expandido ? 'Contraer' : 'Expandir'}
              >
                {expandido ? '▼' : '▶'}
              </button>
              <button
                type="button"
                onClick={onEliminar}
                className="text-red-600 hover:text-red-700 px-2"
                title="Eliminar"
              >
                ✗
              </button>
            </div>
          </div>

          {/* Parámetros rápidos (siempre visibles) */}
          {!expandido && (
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              {ejercicio.series && ejercicio.repeticiones && (
                <span>{ejercicio.series} x {ejercicio.repeticiones}</span>
              )}
              {ejercicio.duracionSegundos && (
                <span>{ejercicio.duracionSegundos}s</span>
              )}
              {ejercicio.descansoSegundos && (
                <span>Descanso: {ejercicio.descansoSegundos}s</span>
              )}
            </div>
          )}

          {/* Configuración expandida */}
          {expandido && (
            <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
              {/* Series y Repeticiones */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Series
                  </label>
                  <input
                    type="number"
                    value={ejercicio.series || ''}
                    onChange={(e) => onActualizar({ series: e.target.value ? Number(e.target.value) : undefined })}
                    min="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Repeticiones
                  </label>
                  <input
                    type="number"
                    value={ejercicio.repeticiones || ''}
                    onChange={(e) => onActualizar({ repeticiones: e.target.value ? Number(e.target.value) : undefined })}
                    min="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Duración y Descanso */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Duración (segundos)
                  </label>
                  <input
                    type="number"
                    value={ejercicio.duracionSegundos || ''}
                    onChange={(e) => onActualizar({ duracionSegundos: e.target.value ? Number(e.target.value) : undefined })}
                    min="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Descanso (segundos)
                  </label>
                  <input
                    type="number"
                    value={ejercicio.descansoSegundos || ''}
                    onChange={(e) => onActualizar({ descansoSegundos: e.target.value ? Number(e.target.value) : undefined })}
                    min="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Notas especiales */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notas Especiales
                </label>
                <input
                  type="text"
                  value={ejercicio.notasEspeciales || ''}
                  onChange={(e) => onActualizar({ notasEspeciales: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder="Indicaciones específicas para este ejercicio..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
