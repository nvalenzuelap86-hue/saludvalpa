// ============================================================================
// COMPONENTE: VistaPrevia
// Vista detallada de una rutina completa
// ============================================================================

import { useState, useEffect } from 'react';
import Modal from '../../../components/shared/Modal';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePacientes } from '../../../hooks/usePacientes';
import type { RutinaEjercicios, Ejercicio } from '../../../types';

interface VistaPreviaProps {
  rutina: RutinaEjercicios;
  isOpen: boolean;
  onClose: () => void;
  onEditar: () => void;
  onGenerarPDF: () => void;
}

export default function VistaPrevia({
  rutina,
  isOpen,
  onClose,
  onEditar,
  onGenerarPDF,
}: VistaPreviaProps) {
  const { obtenerEjercicio } = useBiblioteca();
  const { pacientes } = usePacientes();
  const [ejerciciosInfo, setEjerciciosInfo] = useState<(Ejercicio | undefined)[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar información de ejercicios
  useEffect(() => {
    const cargarEjercicios = async () => {
      setCargando(true);
      const ejercicios = await Promise.all(
        rutina.ejercicios.map(e => obtenerEjercicio(e.ejercicioId))
      );
      setEjerciciosInfo(ejercicios);
      setCargando(false);
    };

    if (isOpen) {
      cargarEjercicios();
    }
  }, [rutina, isOpen]);

  const paciente = rutina.pacienteId
    ? pacientes.find(p => p.id === rutina.pacienteId)
    : undefined;

  const pacienteNombre = paciente
    ? `${paciente.nombre} ${paciente.apellidos}`
    : undefined;

  if (cargando) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cargando..." size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saludvalpa-blue"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {rutina.nombre}
          </h2>
          <p className="text-gray-600">
            🎯 {rutina.objetivo}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {rutina.esPlantilla && (
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
              📋 Plantilla
            </span>
          )}
          {!rutina.activa && (
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm">
              Inactiva
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm capitalize">
            Nivel: {rutina.nivel}
          </span>
        </div>

        {/* Información general */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          {rutina.descripcion && (
            <div>
              <span className="font-semibold text-gray-700">Descripción:</span>
              <p className="text-gray-600 mt-1">{rutina.descripcion}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span className="font-semibold text-gray-700">📅 Frecuencia:</span>
              <p className="text-gray-600">
                {rutina.frecuencia.diasPorSemana} días por semana
                {rutina.frecuencia.duracionSemanas && ` durante ${rutina.frecuencia.duracionSemanas} semanas`}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-700">⏱️ Duración:</span>
              <p className="text-gray-600">
                {rutina.duracionEstimadaMinutos} minutos por sesión
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-700">💪 Ejercicios:</span>
              <p className="text-gray-600">
                {rutina.ejercicios.length} ejercicio{rutina.ejercicios.length !== 1 ? 's' : ''}
              </p>
            </div>

            {pacienteNombre && (
              <div>
                <span className="font-semibold text-gray-700">👤 Paciente:</span>
                <p className="text-gray-600">{pacienteNombre}</p>
              </div>
            )}
          </div>

          {rutina.equipoNecesario.length > 0 && (
            <div className="mt-3">
              <span className="font-semibold text-gray-700">🏋️ Equipo necesario:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {rutina.equipoNecesario.map((equipo, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    {equipo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de ejercicios */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Ejercicios de la Rutina
          </h3>
          <div className="space-y-3">
            {rutina.ejercicios.map((ejEnRutina, index) => {
              const ejercicioInfo = ejerciciosInfo[index];
              if (!ejercicioInfo) return null;

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                      {ejEnRutina.orden}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{ejercicioInfo.nombre}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {ejercicioInfo.categoria} • {ejercicioInfo.intensidad}
                      </p>
                      
                      {/* Parámetros */}
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        {ejEnRutina.series && ejEnRutina.repeticiones && (
                          <span className="text-gray-700">
                            <strong>Series x Reps:</strong> {ejEnRutina.series} x {ejEnRutina.repeticiones}
                          </span>
                        )}
                        {ejEnRutina.duracionSegundos && (
                          <span className="text-gray-700">
                            <strong>Duración:</strong> {ejEnRutina.duracionSegundos}s
                          </span>
                        )}
                        {ejEnRutina.descansoSegundos && (
                          <span className="text-gray-700">
                            <strong>Descanso:</strong> {ejEnRutina.descansoSegundos}s
                          </span>
                        )}
                      </div>

                      {/* Notas especiales */}
                      {ejEnRutina.notasEspeciales && (
                        <div className="mt-2 text-sm bg-blue-50 border border-blue-200 rounded p-2">
                          <span className="font-medium text-blue-900">Notas:</span>{' '}
                          <span className="text-blue-800">{ejEnRutina.notasEspeciales}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notas generales */}
        {rutina.notasGenerales && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">
              📝 Notas Generales
            </h4>
            <p className="text-yellow-800 text-sm">
              {rutina.notasGenerales}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-4">
          <p>Creada: {new Date(rutina.fechaCreacion).toLocaleDateString()}</p>
          {rutina.fechaAsignacion && (
            <p>Asignada: {new Date(rutina.fechaAsignacion).toLocaleDateString()}</p>
          )}
          <p>Última modificación: {new Date(rutina.fechaActualizacion).toLocaleDateString()}</p>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onGenerarPDF}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            📄 Generar PDF
          </button>
          <button
            onClick={onEditar}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✎ Editar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
