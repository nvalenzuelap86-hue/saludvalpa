// ============================================================================
// saludvalpa 3.0 - PÁGINA DE BIBLIOTECA
// ============================================================================

import { useState } from 'react';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { useAppStore } from '../stores/appStore';
import { Card, Button, Modal, Input } from '../components';
import type { RecursoBiblioteca } from '../types';
import { TipoProfesion } from '../types';

// Importar biblioteca de ejercicios de fisioterapia
import BibliotecaEjercicios from '../modules/fisioterapia/biblioteca/Biblioteca';

const Biblioteca = () => {
  const { configuracion } = useAppStore();
  const profesion = configuracion?.profesion;

  // Si es fisioterapia, mostrar biblioteca de ejercicios
  if (profesion === TipoProfesion.FISIOTERAPIA) {
    return <BibliotecaEjercicios />;
  }

  // Para otras profesiones, mostrar biblioteca de recursos educativos

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState<RecursoBiblioteca | null>(null);

  const {
    recursos,
    categoriasDisponibles,
    toggleFavorito,
    eliminarRecurso,
  } = useBiblioteca({
    profesion,
    categoria: categoriaSeleccionada || undefined,
    busqueda: busqueda || undefined,
    favoritos: soloFavoritos || undefined,
  });

  const handleVerDetalle = (recurso: RecursoBiblioteca) => {
    setRecursoSeleccionado(recurso);
    setMostrarModal(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este recurso?')) return;
    try {
      await eliminarRecurso(id);
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📚 Biblioteca</h1>
        <p className="text-gray-600 mt-2">
          Recursos educativos y ejercicios para compartir con pacientes
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="🔍 Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue"
        >
          <option value="">Todas las categorías</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSoloFavoritos(!soloFavoritos)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            soloFavoritos
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⭐ {soloFavoritos ? 'Todos' : 'Solo Favoritos'}
        </button>
      </div>

      {/* Contador */}
      <div className="mb-4 text-sm text-gray-600">
        {recursos.length} recursos encontrados
      </div>

      {/* Lista de recursos */}
      {recursos.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay recursos disponibles
          </h3>
          <p className="text-gray-600">
            {busqueda || categoriaSeleccionada || soloFavoritos
              ? 'Intenta ajustar los filtros'
              : 'Los recursos precargados se cargarán automáticamente'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recursos.map((recurso) => (
            <Card key={recurso.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg flex-1">
                  {recurso.titulo}
                </h3>
                <button
                  onClick={async () => await toggleFavorito(recurso.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {recurso.favorito ? '⭐' : '☆'}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {recurso.descripcion}
              </p>

              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="px-2 py-1 bg-saludvalpa-blue-light text-saludvalpa-blue text-xs rounded">
                  {recurso.categoria}
                </span>
                {recurso.esContenidoPrecargado && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                    ✓ Precargado
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleVerDetalle(recurso)}
                  className="flex-1 text-sm"
                >
                  👁️ Ver
                </Button>
                {!recurso.esContenidoPrecargado && (
                  <Button
                    variant="danger"
                    onClick={() => handleEliminar(recurso.id)}
                    className="text-sm"
                  >
                    🗑️
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setRecursoSeleccionado(null);
        }}
        title={recursoSeleccionado?.titulo || ''}
        size="xl"
      >
        {recursoSeleccionado && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-saludvalpa-blue-light text-saludvalpa-blue text-sm rounded-full">
                {recursoSeleccionado.categoria}
              </span>
              {recursoSeleccionado.etiquetas.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <p className="text-gray-700">{recursoSeleccionado.descripcion}</p>

            <div
              className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: recursoSeleccionado.contenido }}
            />

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setMostrarModal(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Biblioteca;
