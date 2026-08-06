// ============================================================================
// saludvalpa 3.0 - SELECTOR DE COMIDAS
// Modal para seleccionar comidas desde el catálogo de comidas precargadas
// Sigue el patrón de SelectorEjercicios.tsx de fisioterapia
// ============================================================================

import { useState, useMemo } from 'react';
import Modal from '../../../components/shared/Modal';
import type { ComidaPrecargada, RecetaPersonalizada } from '../../../types/nutricion';
import { comidasPrecargadas } from '../data/comidasPrecargadas';
import FormularioReceta from './FormularioReceta';

interface SelectorComidasProps {
  open: boolean;
  onClose: () => void;
  onSeleccionar: (comida: ComidaPrecargada) => void;
  comidasYaSeleccionadas?: string[]; // IDs of already selected meals
  categoria?: 'desayuno' | 'colacion' | 'comida' | 'cena'; // optional filter
  // Tipo de colación a asignar cuando se agrega una colación (matutina o vespertina)
  colacionTipo?: 'colacion1' | 'colacion2';
  onCambiarColacionTipo?: (tipo: 'colacion1' | 'colacion2') => void;
  // Recetas personalizadas del usuario
  recetasPersonalizadas?: RecetaPersonalizada[];
  onCrearReceta?: (receta: Omit<RecetaPersonalizada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  onEditarReceta?: (receta: RecetaPersonalizada) => void;
  onEliminarReceta?: (id: string) => void;
}

const CATEGORIAS: { value: string; label: string; icon: string }[] = [
  { value: 'todas', label: 'Todas', icon: '🍽️' },
  { value: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { value: 'colacion', label: 'Colación', icon: '🍎' },
  { value: 'comida', label: 'Comida', icon: '🍽️' },
  { value: 'cena', label: 'Cena', icon: '🌙' },
];

const DIFICULTAD_COLORS: Record<string, string> = {
  facil: 'bg-green-100 text-green-700',
  media: 'bg-amber-100 text-amber-700',
  avanzada: 'bg-red-100 text-red-700',
};

export default function SelectorComidas({
  open,
  onClose,
  onSeleccionar,
  comidasYaSeleccionadas = [],
  categoria,
  colacionTipo = 'colacion1',
  onCambiarColacionTipo,
  recetasPersonalizadas = [],
  onCrearReceta,
  onEditarReceta,
  onEliminarReceta,
}: SelectorComidasProps) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>(categoria || 'todas');
  const [filtroAlergeno, setFiltroAlergeno] = useState<string>('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState<string>('');
  const [comidaDetalle, setComidaDetalle] = useState<ComidaPrecargada | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [tabActiva, setTabActiva] = useState<'precargadas' | 'misRecetas'>('precargadas');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [recetaEnEdicion, setRecetaEnEdicion] = useState<RecetaPersonalizada | null>(null);

  // Reset filters when categoria prop changes
  useState(() => {
    if (categoria) {
      setFiltroCategoria(categoria);
    }
  });

  // Convertir recetas personalizadas al formato de ComidaPrecargada para su visualización
  const recetasComoComidas = useMemo<ComidaPrecargada[]>(() => {
    return recetasPersonalizadas.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      categoria: r.categoria,
      descripcion: r.descripcion,
      ingredientes: r.ingredientes,
      preparacion: r.preparacion,
      tiempoPreparacion: r.tiempoPreparacion,
      dificultad: r.dificultad,
      nutrientes: r.nutrientes,
      porciones: r.porciones,
      alergenos: r.alergenos,
      etiquetas: r.etiquetas,
      aptoPara: r.aptoPara,
      foto: r.foto,
      esRecetaPersonalizada: true,
    }));
  }, [recetasPersonalizadas]);

  // Filtrar comidas disponibles
  const comidasDisponibles = useMemo(() => {
    // Seleccionar la fuente según la pestaña activa
    let resultados: ComidaPrecargada[] =
      tabActiva === 'misRecetas' ? recetasComoComidas : comidasPrecargadas;

    // Filtrar por categoría
    if (filtroCategoria !== 'todas') {
      resultados = resultados.filter(c => c.categoria === filtroCategoria);
    }

    // Filtrar por búsqueda
    if (busqueda.trim().length >= 2) {
      const termino = busqueda.toLowerCase().trim();
      resultados = resultados.filter(c =>
        c.nombre.toLowerCase().includes(termino) ||
        (c.descripcion || '').toLowerCase().includes(termino) ||
        (c.etiquetas || []).some(tag => tag.toLowerCase().includes(termino))
      );
    }

    // Filtrar por alérgeno
    if (filtroAlergeno) {
      resultados = resultados.filter(c => !c.alergenos?.includes(filtroAlergeno));
    }

    // Filtrar por etiqueta
    if (filtroEtiqueta) {
      resultados = resultados.filter(c => c.etiquetas?.includes(filtroEtiqueta));
    }

    // NOTA: No se excluyen las comidas ya seleccionadas. El menú seleccionado
    // permanece visible y se marca con el número de veces que se ha usado esta semana.

    return resultados;
  }, [busqueda, filtroCategoria, filtroAlergeno, filtroEtiqueta, tabActiva, recetasComoComidas]);

  // Contar cuántas veces se ha usado cada comida esta semana (para marcarla como "usada").
  const usosPorComida = useMemo(() => {
    const conteo = new Map<string, number>();
    comidasYaSeleccionadas.forEach((id) => {
      conteo.set(id, (conteo.get(id) || 0) + 1);
    });
    return conteo;
  }, [comidasYaSeleccionadas]);

  const handleSeleccionar = (comida: ComidaPrecargada) => {
    onSeleccionar(comida);
    // No cerrar el modal para permitir selección múltiple
  };

  const handleVerDetalle = (comida: ComidaPrecargada) => {
    setComidaDetalle(comida);
    setModalDetalleAbierto(true);
  };

  const handleCerrarDetalle = () => {
    setModalDetalleAbierto(false);
    setComidaDetalle(null);
  };

  // Abrir formulario para crear una nueva receta
  const handleNuevaReceta = () => {
    setRecetaEnEdicion(null);
    setFormularioAbierto(true);
  };

  // Abrir formulario para editar una receta existente
  const handleEditarReceta = (comida: ComidaPrecargada) => {
    const receta = recetasPersonalizadas.find(r => r.id === comida.id);
    if (receta) {
      setRecetaEnEdicion(receta);
      setFormularioAbierto(true);
    }
  };

  // Guardar receta (crear o editar)
  const handleGuardarReceta = (datos: Omit<RecetaPersonalizada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    if (recetaEnEdicion && onEditarReceta) {
      onEditarReceta({ ...recetaEnEdicion, ...datos });
    } else if (onCrearReceta) {
      onCrearReceta(datos);
    }
    setFormularioAbierto(false);
    setRecetaEnEdicion(null);
  };

  // Eliminar receta personalizada
  const handleEliminarReceta = (comida: ComidaPrecargada) => {
    if (onEliminarReceta && window.confirm(`¿Eliminar la receta "${comida.nombre}"?`)) {
      onEliminarReceta(comida.id);
    }
  };

  // Obtener todas las etiquetas únicas para el filtro
  const todasLasEtiquetas = useMemo(() => {
    const etiquetas = new Set<string>();
    comidasPrecargadas.forEach(c => c.etiquetas?.forEach(e => etiquetas.add(e)));
    recetasPersonalizadas.forEach(r => r.etiquetas?.forEach(e => etiquetas.add(e)));
    return Array.from(etiquetas).sort();
  }, [recetasPersonalizadas]);

  return (
    <>
      <Modal
        isOpen={open}
        onClose={onClose}
        title="Seleccionar Comidas"
        size="xl"
      >
        <div className="space-y-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Selecciona las comidas que deseas agregar al plan.
              Puedes agregar varias seguidas. El modal se mantendrá abierto.
            </p>
          </div>

          {/* Selector de tipo de colación (matutina / vespertina) */}
          {(categoria === 'colacion' || !categoria) && onCambiarColacionTipo && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs font-medium text-orange-800 mb-2">
                🥜 Las colaciones se agregarán como:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onCambiarColacionTipo('colacion1')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    colacionTipo === 'colacion1'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  🍎 Colación matutina
                </button>
                <button
                  type="button"
                  onClick={() => onCambiarColacionTipo('colacion2')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    colacionTipo === 'colacion2'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  🥜 Colación vespertina
                </button>
              </div>
            </div>
          )}

          {/* Pestañas: Precargadas / Mis recetas */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setTabActiva('precargadas')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tabActiva === 'precargadas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🍽️ Precargadas
            </button>
            <button
              type="button"
              onClick={() => setTabActiva('misRecetas')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tabActiva === 'misRecetas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📝 Mis recetas
              {recetasPersonalizadas.length > 0 && (
                <span className="ml-1 text-xs opacity-80">({recetasPersonalizadas.length})</span>
              )}
            </button>
            {tabActiva === 'misRecetas' && onCrearReceta && (
              <button
                type="button"
                onClick={handleNuevaReceta}
                className="ml-auto px-3 py-1.5 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                + Nueva receta
              </button>
            )}
          </div>

          {/* Contador */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {comidasDisponibles.length} comida{comidasDisponibles.length !== 1 ? 's' : ''} disponible{comidasDisponibles.length !== 1 ? 's' : ''}
            </span>
            {comidasYaSeleccionadas.length > 0 && (
              <span className="text-gray-500">
                ({comidasYaSeleccionadas.length} ya en el plan)
              </span>
            )}
          </div>

          {/* Filtros */}
          <div className="space-y-3">
            {/* Búsqueda */}
            <div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar comidas por nombre o ingrediente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFiltroCategoria(cat.value)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    filtroCategoria === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Filtros avanzados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Sin alérgeno
                </label>
                <select
                  value={filtroAlergeno}
                  onChange={(e) => setFiltroAlergeno(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="">Todos</option>
                  <option value="huevo">Sin huevo</option>
                  <option value="lacteos">Sin lácteos</option>
                  <option value="gluten">Sin gluten</option>
                  <option value="nueces">Sin nueces</option>
                  <option value="pescado">Sin pescado</option>
                  <option value="cacahuate">Sin cacahuate</option>
                  <option value="soya">Sin soya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Etiqueta
                </label>
                <select
                  value={filtroEtiqueta}
                  onChange={(e) => setFiltroEtiqueta(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="">Todas</option>
                  {todasLasEtiquetas.map((etiqueta) => (
                    <option key={etiqueta} value={etiqueta}>
                      {etiqueta.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid de comidas */}
          <div className="max-h-[50vh] overflow-y-auto">
            {comidasDisponibles.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-gray-600 mb-2">No se encontraron comidas</p>
                <p className="text-xs text-gray-400">
                  Intenta con otros filtros o términos de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {comidasDisponibles.map((comida) => (
                  <div
                    key={comida.id}
                    className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {comida.nombre}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            comida.categoria === 'desayuno' ? 'bg-amber-100 text-amber-700' :
                            comida.categoria === 'colacion' ? 'bg-green-100 text-green-700' :
                            comida.categoria === 'comida' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {comida.categoria}
                          </span>
                          {(() => {
                            const usos = usosPorComida.get(comida.id) || 0;
                            if (usos > 0) {
                              return (
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                  ✓ Usada {usos} {usos === 1 ? 'vez' : 'veces'} esta semana
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        DIFICULTAD_COLORS[comida.dificultad] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {comida.dificultad}
                      </span>
                    </div>

                    {/* Nutrientes rápidos */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span>🔥 {comida.nutrientes.calorias} kcal</span>
                      <span>🥩 {comida.nutrientes.proteinas}g</span>
                      <span>⏱️ {comida.tiempoPreparacion || '?'} min</span>
                    </div>

                    {/* Alérgenos */}
                    {comida.alergenos && comida.alergenos.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {comida.alergenos.map((al) => (
                          <span key={al} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-xs">
                            {al}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Etiquetas */}
                    {comida.etiquetas && comida.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {comida.etiquetas.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {comida.etiquetas.length > 3 && (
                          <span className="text-xs text-gray-400">+{comida.etiquetas.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleVerDetalle(comida)}
                        className="flex-1 px-2 py-1.5 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        📋 Detalle
                      </button>
                      {comida.esRecetaPersonalizada && onEditarReceta && (
                        <button
                          type="button"
                          onClick={() => handleEditarReceta(comida)}
                          className="px-2 py-1.5 text-xs text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                      )}
                      {comida.esRecetaPersonalizada && onEliminarReceta && (
                        <button
                          type="button"
                          onClick={() => handleEliminarReceta(comida)}
                          className="px-2 py-1.5 text-xs text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSeleccionar(comida)}
                        className="flex-1 px-2 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Modal de Detalle de Comida */}
      <Modal
        isOpen={modalDetalleAbierto}
        onClose={handleCerrarDetalle}
        title={comidaDetalle?.nombre || 'Detalle de comida'}
        size="lg"
      >
        {comidaDetalle && (
          <div className="space-y-4">
            {/* Header con categoría y dificultad */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                comidaDetalle.categoria === 'desayuno' ? 'bg-amber-100 text-amber-700' :
                comidaDetalle.categoria === 'colacion' ? 'bg-green-100 text-green-700' :
                comidaDetalle.categoria === 'comida' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {comidaDetalle.categoria}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                DIFICULTAD_COLORS[comidaDetalle.dificultad] || 'bg-gray-100 text-gray-600'
              }`}>
                {comidaDetalle.dificultad}
              </span>
              {comidaDetalle.tiempoPreparacion && (
                <span className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-600">
                  ⏱️ {comidaDetalle.tiempoPreparacion} min
                </span>
              )}
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-600">{comidaDetalle.descripcion}</p>

            {/* Nutrientes */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Información Nutricional</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-700">{comidaDetalle.nutrientes.calorias}</div>
                  <div className="text-xs text-blue-600">kcal</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-red-700">{comidaDetalle.nutrientes.proteinas}g</div>
                  <div className="text-xs text-red-600">Proteínas</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">{comidaDetalle.nutrientes.carbohidratos}g</div>
                  <div className="text-xs text-amber-600">Carbohidratos</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-700">{comidaDetalle.nutrientes.grasas}g</div>
                  <div className="text-xs text-green-600">Grasas</div>
                </div>
              </div>
              {comidaDetalle.nutrientes.fibra && (
                <div className="mt-2 text-xs text-gray-500">
                  Fibra: {comidaDetalle.nutrientes.fibra}g
                </div>
              )}
            </div>

            {/* Ingredientes */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredientes</h5>
              <ul className="list-disc list-inside space-y-1">
                {comidaDetalle.ingredientes.map((ing, idx) => (
                  <li key={idx} className="text-sm text-gray-600">{ing}</li>
                ))}
              </ul>
            </div>

            {/* Preparación */}
            {comidaDetalle.preparacion && comidaDetalle.preparacion.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparación</h5>
                <ol className="list-decimal list-inside space-y-1">
                  {comidaDetalle.preparacion.map((paso, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{paso}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Alérgenos */}
            {comidaDetalle.alergenos && comidaDetalle.alergenos.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Alérgenos</h5>
                <div className="flex flex-wrap gap-2">
                  {comidaDetalle.alergenos.map((al) => (
                    <span key={al} className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm">
                      ⚠️ {al}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Etiquetas */}
            {comidaDetalle.etiquetas && comidaDetalle.etiquetas.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Etiquetas</h5>
                <div className="flex flex-wrap gap-2">
                  {comidaDetalle.etiquetas.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Porciones */}
            <div className="text-sm text-gray-500">
              Porciones: {comidaDetalle.porciones}
            </div>

            {/* Botón de acción */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  handleSeleccionar(comidaDetalle);
                  handleCerrarDetalle();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Agregar esta comida al plan
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Formulario de Receta Personalizada */}
      <FormularioReceta
        isOpen={formularioAbierto}
        onClose={() => {
          setFormularioAbierto(false);
          setRecetaEnEdicion(null);
        }}
        onGuardar={handleGuardarReceta}
        recetaExistente={recetaEnEdicion}
      />
    </>
  );
}
