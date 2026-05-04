// ============================================================================
// COMPONENTE: SelectorEjercicios
// Modal para seleccionar ejercicios desde la biblioteca
// ============================================================================

import { useState } from 'react';
import Modal from '../../../components/shared/Modal';
import CatalogoEjercicios from '../biblioteca/CatalogoEjercicios';
import DetalleEjercicio from '../biblioteca/DetalleEjercicio';
import { useBiblioteca } from '../hooks/useBiblioteca';
import type { Ejercicio } from '../../../types';

interface SelectorEjerciciosProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionar: (ejercicio: Ejercicio) => void;
  ejerciciosYaSeleccionados: string[]; // IDs de ejercicios ya en la rutina
}

export default function SelectorEjercicios({
  isOpen,
  onClose,
  onSeleccionar,
  ejerciciosYaSeleccionados,
}: SelectorEjerciciosProps) {
  const { ejercicios, toggleFavorito } = useBiblioteca();

  // Estado para el modal de detalle
  const [ejercicioDetalle, setEjercicioDetalle] = useState<Ejercicio | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);

  // Filtrar ejercicios que ya están en la rutina
  const ejerciciosDisponibles = ejercicios.filter(
    e => !ejerciciosYaSeleccionados.includes(e.id)
  );

  const handleSeleccionar = (ejercicio: Ejercicio) => {
    onSeleccionar(ejercicio);
    // No cerrar el modal para permitir agregar múltiples ejercicios
  };

  const handleVerDetalle = (ejercicio: Ejercicio) => {
    setEjercicioDetalle(ejercicio);
    setModalDetalleAbierto(true);
  };

  const handleCerrarDetalle = () => {
    setModalDetalleAbierto(false);
    setEjercicioDetalle(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Seleccionar Ejercicios"
        size="xl"
      >
        <div className="space-y-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Selecciona los ejercicios que deseas agregar a la rutina.
              Puedes agregar varios seguidos. El modal se mantendrá abierto.
            </p>
          </div>

          {/* Contador */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {ejerciciosDisponibles.length} ejercicio{ejerciciosDisponibles.length !== 1 ? 's' : ''} disponible{ejerciciosDisponibles.length !== 1 ? 's' : ''}
            </span>
            {ejerciciosYaSeleccionados.length > 0 && (
              <span className="text-gray-500">
                ({ejerciciosYaSeleccionados.length} ya en la rutina)
              </span>
            )}
          </div>

          {/* Catálogo con búsqueda y filtros */}
          <div className="max-h-[60vh] overflow-y-auto">
            <CatalogoEjercicios
              ejercicios={ejerciciosDisponibles}
              onVerDetalle={handleVerDetalle}
              onToggleFavorito={toggleFavorito}
              onAgregarARutina={handleSeleccionar}
            />
          </div>

          {/* Botón cerrar */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalle de Ejercicio */}
      <DetalleEjercicio
        ejercicio={ejercicioDetalle}
        isOpen={modalDetalleAbierto}
        onClose={handleCerrarDetalle}
        onToggleFavorito={toggleFavorito}
        onAgregarARutina={(ejercicio) => {
          handleSeleccionar(ejercicio);
          handleCerrarDetalle();
        }}
      />
    </>
  );
}
