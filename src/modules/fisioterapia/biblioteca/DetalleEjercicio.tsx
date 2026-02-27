// ============================================================================
// COMPONENTE: DetalleEjercicio
// Vista detallada de un ejercicio en modal
// ============================================================================

import { useState } from 'react';
import Modal from '../../../components/shared/Modal';
import type { Ejercicio } from '../../../types';

interface DetalleEjercicioProps {
  ejercicio: Ejercicio | null;
  isOpen: boolean;
  onClose: () => void;
  onEditar?: (ejercicio: Ejercicio) => void;
  onEliminar?: (id: string) => void;
  onToggleFavorito: (id: string) => void;
  onAgregarARutina?: (ejercicio: Ejercicio) => void;
}

export default function DetalleEjercicio({
  ejercicio,
  isOpen,
  onClose,
  onEditar,
  onEliminar,
  onToggleFavorito,
  onAgregarARutina,
}: DetalleEjercicioProps) {
  const [mostrandoConfirmacion, setMostrandoConfirmacion] = useState(false);

  if (!ejercicio) return null;

  const handleEliminar = async () => {
    if (!onEliminar) return;
    
    try {
      await onEliminar(ejercicio.id);
      setMostrandoConfirmacion(false);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el ejercicio');
    }
  };

  // Mapeo de categorías a emojis
  const categoriasEmojis: Record<string, string> = {
    movilidad: '🔄',
    fuerza: '💪',
    equilibrio: '⚖️',
    estiramiento: '🧘',
    cardio: '🏃',
    otro: '🎯',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      <div className="space-y-6">
        {/* Header con título y acciones */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {categoriasEmojis[ejercicio.categoria] || '🎯'}
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {ejercicio.nombre}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {ejercicio.categoria} • Intensidad {ejercicio.intensidad}
              </p>
            </div>
          </div>

          {/* Botón favorito */}
          <button
            onClick={() => onToggleFavorito(ejercicio.id)}
            className="text-2xl hover:scale-110 transition-transform"
            title={ejercicio.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {ejercicio.favorito ? '⭐' : '☆'}
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {!ejercicio.precargado && (
            <span className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-800">
              Personalizado
            </span>
          )}
          {ejercicio.favorito && (
            <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
              ⭐ Favorito
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Descripción
          </h3>
          <p className="text-gray-700">
            {ejercicio.descripcion}
          </p>
        </div>

        {/* Instrucciones */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Instrucciones
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {ejercicio.instrucciones.map((instruccion, index) => (
              <li key={index} className="text-gray-700">
                {instruccion}
              </li>
            ))}
          </ol>
        </div>

        {/* Zonas corporales */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Zonas Corporales
          </h3>
          <div className="flex flex-wrap gap-2">
            {ejercicio.zonasCorporales.map((zona, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm capitalize"
              >
                {zona.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-2 gap-4">
          {ejercicio.repeticionesSugeridas && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Repeticiones sugeridas
              </h4>
              <p className="text-gray-600">
                {ejercicio.repeticionesSugeridas}
              </p>
            </div>
          )}

          {ejercicio.duracionSugerida && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Duración sugerida
              </h4>
              <p className="text-gray-600">
                {ejercicio.duracionSugerida} minutos
              </p>
            </div>
          )}
        </div>

        {/* Equipo necesario */}
        {ejercicio.equipoNecesario.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Equipo Necesario
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {ejercicio.equipoNecesario.map((equipo, index) => (
                <li key={index} className="text-gray-700">
                  {equipo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contraindicaciones */}
        {ejercicio.contraindicaciones.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              ⚠️ Contraindicaciones
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {ejercicio.contraindicaciones.map((contraindicacion, index) => (
                <li key={index} className="text-yellow-800">
                  {contraindicacion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notas personales */}
        {ejercicio.notasPersonales && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Notas Personales
            </h3>
            <p className="text-blue-800 text-sm">
              {ejercicio.notasPersonales}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {/* Agregar a rutina */}
          {onAgregarARutina && (
            <button
              onClick={() => {
                onAgregarARutina(ejercicio);
                onClose();
              }}
              className="flex-1 bg-saludvalpa-blue text-white py-2 px-4 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors"
            >
              + Agregar a Rutina
            </button>
          )}

          {/* Editar (solo personalizados) */}
          {!ejercicio.precargado && onEditar && (
            <button
              onClick={() => {
                onEditar(ejercicio);
                onClose();
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ✎ Editar
            </button>
          )}

          {/* Eliminar (solo personalizados) */}
          {!ejercicio.precargado && onEliminar && (
            <>
              {!mostrandoConfirmacion ? (
                <button
                  onClick={() => setMostrandoConfirmacion(true)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Eliminar
                </button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={handleEliminar}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    ✓ Confirmar
                  </button>
                  <button
                    onClick={() => setMostrandoConfirmacion(false)}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                  >
                    ✗ Cancelar
                  </button>
                </div>
              )}
            </>
          )}

          {/* Cerrar */}
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
