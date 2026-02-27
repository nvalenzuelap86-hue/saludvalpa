// ============================================================================
// COMPONENTE: TarjetaRutina
// Card individual de rutina en la lista
// ============================================================================

import type { RutinaEjercicios } from '../../../types';

interface TarjetaRutinaProps {
  rutina: RutinaEjercicios;
  onVer: (rutina: RutinaEjercicios) => void;
  onEditar: (rutina: RutinaEjercicios) => void;
  onDuplicar: (rutina: RutinaEjercicios) => void;
  onEliminar: (id: string) => void;
  nombrePaciente?: string;
}

export default function TarjetaRutina({
  rutina,
  onVer,
  onEditar,
  onDuplicar,
  onEliminar,
  nombrePaciente,
}: TarjetaRutinaProps) {

  // Mapeo de niveles a colores
  const nivelColors: Record<string, string> = {
    principiante: 'bg-green-100 text-green-800',
    intermedio: 'bg-yellow-100 text-yellow-800',
    avanzado: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-saludvalpa-blue transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
              {rutina.nombre}
            </h3>
            {rutina.objetivo && (
              <p className="text-sm text-gray-600 line-clamp-1">
                🎯 {rutina.objetivo}
              </p>
            )}
          </div>

          {/* Indicador de estado */}
          <div className="flex flex-col gap-1 items-end ml-2">
            {!rutina.activa && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                Inactiva
              </span>
            )}
            {rutina.esPlantilla && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                📋 Plantilla
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {rutina.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {rutina.descripcion}
          </p>
        )}

        {/* Badges de información */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Nivel */}
          <span className={`text-xs px-2 py-1 rounded-full ${nivelColors[rutina.nivel]}`}>
            {rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1)}
          </span>

          {/* Número de ejercicios */}
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {rutina.ejercicios.length} ejercicio{rutina.ejercicios.length !== 1 ? 's' : ''}
          </span>

          {/* Duración */}
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            ⏱️ {rutina.duracionEstimadaMinutos} min
          </span>

          {/* Frecuencia */}
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            📅 {rutina.frecuencia.diasPorSemana}x/semana
          </span>
        </div>

        {/* Paciente asignado */}
        {nombrePaciente && (
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2 bg-blue-50 rounded-lg px-3 py-2">
            <span>👤</span>
            <span className="font-medium">{nombrePaciente}</span>
            {rutina.fechaAsignacion && (
              <span className="text-xs text-gray-500">
                desde {new Date(rutina.fechaAsignacion).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            Creada: {new Date(rutina.fechaCreacion).toLocaleDateString()}
          </span>
          {rutina.equipoNecesario.length > 0 && (
            <span>
              🏋️ {rutina.equipoNecesario.length} equipo(s)
            </span>
          )}
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onVer(rutina)}
          className="text-sm text-saludvalpa-blue hover:text-saludvalpa-blue-dark font-medium transition-colors"
        >
          👁️ Ver
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEditar(rutina)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            title="Editar"
          >
            ✎
          </button>
          <button
            onClick={() => onDuplicar(rutina)}
            className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
            title="Duplicar"
          >
            📋
          </button>
          <button
            onClick={() => onEliminar(rutina.id)}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
