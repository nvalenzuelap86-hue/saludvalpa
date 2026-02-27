// ============================================================================
// PÁGINA: Biblioteca de Ejercicios
// Sistema completo de gestión de ejercicios para fisioterapia
// ============================================================================

import { useState } from 'react';
import Card from '../../../components/shared/Card';
import CatalogoEjercicios from './CatalogoEjercicios';
import DetalleEjercicio from './DetalleEjercicio';
import FormularioEjercicio from './FormularioEjercicio';
import { useBiblioteca } from '../hooks/useBiblioteca';
import type { Ejercicio } from '../../../types';

export default function Biblioteca() {
  const {
    ejercicios,
    estadisticas,
    isLoading,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicio,
    toggleFavorito,
  } = useBiblioteca();

  // Estado de modales
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);
  const [ejercicioEditando, setEjercicioEditando] = useState<Ejercicio | undefined>(undefined);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);

  // Handlers
  const handleVerDetalle = (ejercicio: Ejercicio) => {
    setEjercicioSeleccionado(ejercicio);
    setModalDetalleAbierto(true);
  };

  const handleCerrarDetalle = () => {
    setModalDetalleAbierto(false);
    setEjercicioSeleccionado(null);
  };

  const handleNuevoEjercicio = () => {
    setEjercicioEditando(undefined);
    setModalFormularioAbierto(true);
  };

  const handleEditarEjercicio = (ejercicio: Ejercicio) => {
    setEjercicioEditando(ejercicio);
    setModalFormularioAbierto(true);
  };

  const handleGuardarEjercicio = async (ejercicioData: Omit<Ejercicio, 'id' | 'fechaCreacion' | 'precargado'>) => {
    try {
      if (ejercicioEditando) {
        // Editar existente
        await actualizarEjercicio(ejercicioEditando.id, ejercicioData);
      } else {
        // Crear nuevo
        await crearEjercicio(ejercicioData);
      }
      setModalFormularioAbierto(false);
      setEjercicioEditando(undefined);
    } catch (error) {
      throw error;
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await eliminarEjercicio(id);
    } catch (error: any) {
      throw error;
    }
  };

  const handleToggleFavorito = async (id: string) => {
    try {
      await toggleFavorito(id);
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saludvalpa-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📚 Biblioteca de Ejercicios
          </h1>
          <p className="text-gray-600 mt-1">
            Catálogo de ejercicios para crear rutinas personalizadas
          </p>
        </div>
        <button
          onClick={handleNuevoEjercicio}
          className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Nuevo Ejercicio</span>
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-3xl font-bold text-saludvalpa-blue">
              {estadisticas.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Total Ejercicios
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {estadisticas.precargados}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Precargados
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {estadisticas.personalizados}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Personalizados
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {estadisticas.favoritos}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              ⭐ Favoritos
            </div>
          </Card>
        </div>
      )}

      {/* Mensaje informativo si no hay ejercicios */}
      {ejercicios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Biblioteca vacía
            </h3>
            <p className="text-gray-600 mb-4">
              Parece que los ejercicios precargados no se han cargado aún.
            </p>
            <p className="text-sm text-gray-500">
              Recarga la página o contacta al soporte si el problema persiste.
            </p>
          </div>
        </Card>
      ) : (
        /* Catálogo de ejercicios */
        <Card>
          <CatalogoEjercicios
            ejercicios={ejercicios}
            onVerDetalle={handleVerDetalle}
            onToggleFavorito={handleToggleFavorito}
          />
        </Card>
      )}

      {/* Modal de Detalle */}
      <DetalleEjercicio
        ejercicio={ejercicioSeleccionado}
        isOpen={modalDetalleAbierto}
        onClose={handleCerrarDetalle}
        onEditar={handleEditarEjercicio}
        onEliminar={handleEliminar}
        onToggleFavorito={handleToggleFavorito}
      />

      {/* Modal de Formulario */}
      <FormularioEjercicio
        isOpen={modalFormularioAbierto}
        onClose={() => {
          setModalFormularioAbierto(false);
          setEjercicioEditando(undefined);
        }}
        onGuardar={handleGuardarEjercicio}
        ejercicioEditar={ejercicioEditando}
      />
    </div>
  );
}
