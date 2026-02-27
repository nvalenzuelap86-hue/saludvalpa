// ============================================================================
// saludvalpa 3.0 - GESTIÓN DE SERVICIOS
// ============================================================================

import { useState } from 'react';
import { useEconomia } from '../hooks/useEconomia';
import type { Servicio } from '../types';
import { formatearMoneda } from '../utils/helpers';
import { Card, Button, Modal, Input } from './';

const GestionServicios = () => {
  const { servicios, crearServicio, actualizarServicio, eliminarServicio } = useEconomia();
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar servicios por búsqueda
  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setServicioEditando(null);
    setMostrarModal(true);
  };

  const handleEditar = (servicio: Servicio) => {
    setServicioEditando(servicio);
    setMostrarModal(true);
  };

  const handleEliminar = async (servicio: Servicio) => {
    if (!confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) return;

    try {
      await eliminarServicio(servicio.id);
    } catch (error) {
      alert('Error al eliminar el servicio');
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setServicioEditando(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Buscar servicios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleNuevo}>
          ➕ Nuevo Servicio
        </Button>
      </div>

      {/* Lista de servicios */}
      {serviciosFiltrados.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🏷️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {busqueda ? 'No se encontraron servicios' : 'No hay servicios registrados'}
          </h3>
          <p className="text-gray-600 mb-4">
            {busqueda
              ? 'Intenta con otra búsqueda'
              : 'Crea tu catálogo de servicios para usarlo en cotizaciones y recibos'}
          </p>
          {!busqueda && (
            <Button onClick={handleNuevo}>
              Crear primer servicio
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviciosFiltrados.map((servicio) => (
            <Card key={servicio.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {servicio.nombre}
                  </h3>
                  {servicio.descripcion && (
                    <p className="text-sm text-gray-600 mb-2">
                      {servicio.descripcion}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="text-lg font-bold text-saludvalpa-blue">
                    {formatearMoneda(servicio.precio)}
                  </span>
                </div>
                
                {servicio.duracion && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm text-gray-900">
                      {servicio.duracion} min
                    </span>
                  </div>
                )}

                {servicio.categoria && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Categoría:</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {servicio.categoria}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEditar(servicio)}
                  className="flex-1 text-sm"
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleEliminar(servicio)}
                  className="text-sm"
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de crear/editar */}
      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title={servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio'}
        size="md"
      >
        <FormularioServicio
          servicio={servicioEditando}
          onGuardar={async (datos) => {
            try {
              if (servicioEditando) {
                await actualizarServicio(servicioEditando.id, datos);
              } else {
                await crearServicio({ ...datos, activo: true });
              }
              cerrarModal();
            } catch (error) {
              alert('Error al guardar el servicio');
            }
          }}
          onCancelar={cerrarModal}
        />
      </Modal>
    </div>
  );
};

// ============================================================================
// FORMULARIO DE SERVICIO
// ============================================================================

interface FormularioServicioProps {
  servicio: Servicio | null;
  onGuardar: (datos: Omit<Servicio, 'id' | 'activo'>) => void;
  onCancelar: () => void;
}

const FormularioServicio = ({ servicio, onGuardar, onCancelar }: FormularioServicioProps) => {
  const [nombre, setNombre] = useState(servicio?.nombre || '');
  const [descripcion, setDescripcion] = useState(servicio?.descripcion || '');
  const [precio, setPrecio] = useState(servicio?.precio || 0);
  const [duracion, setDuracion] = useState(servicio?.duracion || 0);
  const [categoria, setCategoria] = useState(servicio?.categoria || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (precio <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      precio,
      duracion: duracion || undefined,
      categoria: categoria.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del servicio *
        </label>
        <Input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Consulta general, Masaje terapéutico..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del servicio (opcional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="pl-8"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración (min)
          </label>
          <Input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(parseInt(e.target.value) || 0)}
            min="0"
            placeholder="Opcional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <Input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Ej: Fisioterapia, Consultas, Tratamientos..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {servicio ? 'Actualizar' : 'Crear'} Servicio
        </Button>
      </div>
    </form>
  );
};

export default GestionServicios;
