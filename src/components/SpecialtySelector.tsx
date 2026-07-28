// ============================================================================
// saludvalpa 3.0 - SELECTOR DE ESPECIALIDADES
// Componente para cambiar entre especialidades/profesiones disponibles
// ============================================================================

import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { PROFESIONES_DISPONIBLES } from './ProfessionSelector';
import type { TipoProfesion } from '../types';

interface SpecialtySelectorProps {
  onClose?: () => void;
  variant?: 'dropdown' | 'modal' | 'inline';
}

/**
 * Componente que permite al usuario cambiar entre todas las especialidades disponibles.
 * Se integra con appStore.cambiarProfesion() para cambiar la profesión activa.
 */
export default function SpecialtySelector({ onClose, variant = 'dropdown' }: SpecialtySelectorProps) {
  const { configuracion, cambiarProfesion } = useAppStore();
  const [cambiando, setCambiando] = useState(false);
  const [confirmarCambio, setConfirmarCambio] = useState<TipoProfesion | null>(null);

  const profesionActual = configuracion?.profesion;

  const handleSelectProfesion = async (profesion: TipoProfesion) => {
    if (profesion === profesionActual) {
      onClose?.();
      return;
    }

    try {
      setCambiando(true);
      await cambiarProfesion(profesion, false);
      console.log(`✅ Especialidad cambiada a: ${profesion}`);
      onClose?.();
    } catch (error) {
      console.error('Error al cambiar especialidad:', error);
    } finally {
      setCambiando(false);
      setConfirmarCambio(null);
    }
  };

  // ============================================================================
  // VARIANTE: MODAL
  // ============================================================================
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cambiar especialidad</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona la especialidad a la que deseas cambiar
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de especialidades */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFESIONES_DISPONIBLES.map((prof) => {
                const isActive = profesionActual === prof.id;
                const isDisabled = !prof.disponible || cambiando;

                return (
                  <button
                    key={prof.id}
                    onClick={() => {
                      if (isActive) {
                        onClose?.();
                      } else {
                        setConfirmarCambio(prof.id);
                      }
                    }}
                    disabled={isDisabled}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isActive && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                        Actual
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${prof.color} flex items-center justify-center text-2xl mb-3`}>
                      {prof.icono}
                    </div>
                    <h3 className="font-semibold text-gray-900">{prof.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">{prof.descripcion}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500">
              Al cambiar de especialidad, los datos específicos de la especialidad anterior
              se conservan pero no se mostrarán hasta que regreses a ella.
            </p>
          </div>
        </div>

        {/* Modal de confirmación */}
        {confirmarCambio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cambiar a {PROFESIONES_DISPONIBLES.find(p => p.id === confirmarCambio)?.nombre}?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Se cambiará la especialidad activa. Los datos de la especialidad actual
                se conservarán para cuando regreses.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmarCambio(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSelectProfesion(confirmarCambio)}
                  disabled={cambiando}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {cambiando ? 'Cambiando...' : 'Cambiar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VARIANTE: DROPDOWN (por defecto)
  // ============================================================================
  return (
    <div className="relative">
      <div className="space-y-1">
        {PROFESIONES_DISPONIBLES.map((prof) => {
          const isActive = profesionActual === prof.id;
          const isDisabled = !prof.disponible || cambiando;

          return (
            <button
              key={prof.id}
              onClick={() => {
                if (!isActive) {
                  setConfirmarCambio(prof.id);
                }
              }}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">{prof.icono}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm truncate block">{prof.nombre}</span>
              </div>
              {isActive && (
                <span className="text-xs text-blue-600 font-medium">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal de confirmación para dropdown */}
      {confirmarCambio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Cambiar a {PROFESIONES_DISPONIBLES.find(p => p.id === confirmarCambio)?.nombre}?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Se cambiará la especialidad activa. Los datos de la especialidad actual
              se conservarán para cuando regreses.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarCambio(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSelectProfesion(confirmarCambio)}
                disabled={cambiando}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {cambiando ? 'Cambiando...' : 'Cambiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
