// ============================================================================
// COMPONENTE: CatalogoEjercicios
// Catálogo con búsqueda, filtros y lista de ejercicios
// ============================================================================

import { useState, useEffect } from 'react';
import TarjetaEjercicio from './TarjetaEjercicio';
import {
  CategoriaEjercicio,
  IntensidadEjercicio,
  ZonaCorporal,
  type Ejercicio,
  type FiltrosEjercicios,
} from '../../../types';

interface CatalogoEjerciciosProps {
  ejercicios: Ejercicio[];
  onVerDetalle: (ejercicio: Ejercicio) => void;
  onToggleFavorito: (id: string) => void;
  onAgregarARutina?: (ejercicio: Ejercicio) => void;
  filtrosIniciales?: FiltrosEjercicios;
}

export default function CatalogoEjercicios({
  ejercicios,
  onVerDetalle,
  onToggleFavorito,
  onAgregarARutina,
  filtrosIniciales,
}: CatalogoEjerciciosProps) {
  // Estado de filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [intensidadFiltro, setIntensidadFiltro] = useState<string>('todas');
  const [zonaFiltro, setZonaFiltro] = useState<string>('todas');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'precargados' | 'personalizados' | 'favoritos'>('todos');

  // Aplicar filtros iniciales si se proporcionan
  useEffect(() => {
    if (filtrosIniciales) {
      if (filtrosIniciales.busqueda) setBusqueda(filtrosIniciales.busqueda);
      if (filtrosIniciales.categoria) setCategoriaFiltro(filtrosIniciales.categoria);
      if (filtrosIniciales.intensidad) setIntensidadFiltro(filtrosIniciales.intensidad);
      if (filtrosIniciales.soloFavoritos) setTipoFiltro('favoritos');
      else if (filtrosIniciales.soloPrecargados) setTipoFiltro('precargados');
      else if (filtrosIniciales.soloPersonalizados) setTipoFiltro('personalizados');
    }
  }, [filtrosIniciales]);

  // Aplicar filtros a los ejercicios
  const ejerciciosFiltrados = ejercicios.filter((ejercicio) => {
    // Filtro por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      const coincide =
        ejercicio.nombre.toLowerCase().includes(termino) ||
        ejercicio.descripcion.toLowerCase().includes(termino) ||
        ejercicio.instrucciones.some(i => i.toLowerCase().includes(termino));
      
      if (!coincide) return false;
    }

    // Filtro por categoría
    if (categoriaFiltro !== 'todas' && ejercicio.categoria !== categoriaFiltro) {
      return false;
    }

    // Filtro por intensidad
    if (intensidadFiltro !== 'todas' && ejercicio.intensidad !== intensidadFiltro) {
      return false;
    }

    // Filtro por zona corporal
    if (zonaFiltro !== 'todas' && !ejercicio.zonasCorporales.includes(zonaFiltro as any)) {
      return false;
    }

    // Filtro por tipo
    if (tipoFiltro === 'precargados' && !ejercicio.precargado) {
      return false;
    }
    if (tipoFiltro === 'personalizados' && ejercicio.precargado) {
      return false;
    }
    if (tipoFiltro === 'favoritos' && !ejercicio.favorito) {
      return false;
    }

    return true;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('todas');
    setIntensidadFiltro('todas');
    setZonaFiltro('todas');
    setTipoFiltro('todos');
  };

  const hayFiltrosActivos = 
    busqueda !== '' ||
    categoriaFiltro !== 'todas' ||
    intensidadFiltro !== 'todas' ||
    zonaFiltro !== 'todas' ||
    tipoFiltro !== 'todos';

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar ejercicio por nombre, descripción o instrucciones..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="text-sm text-saludvalpa-blue hover:text-saludvalpa-blue-dark"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filtro de Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent text-sm"
            >
              <option value="todos">Todos</option>
              <option value="precargados">Precargados</option>
              <option value="personalizados">Personalizados</option>
              <option value="favoritos">⭐ Favoritos</option>
            </select>
          </div>

          {/* Filtro de Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent text-sm"
            >
              <option value="todas">Todas</option>
              <option value={CategoriaEjercicio.MOVILIDAD}>🔄 Movilidad</option>
              <option value={CategoriaEjercicio.FUERZA}>💪 Fuerza</option>
              <option value={CategoriaEjercicio.EQUILIBRIO}>⚖️ Equilibrio</option>
              <option value={CategoriaEjercicio.ESTIRAMIENTO}>🧘 Estiramiento</option>
              <option value={CategoriaEjercicio.CARDIO}>🏃 Cardio</option>
              <option value={CategoriaEjercicio.OTRO}>🎯 Otro</option>
            </select>
          </div>

          {/* Filtro de Intensidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intensidad
            </label>
            <select
              value={intensidadFiltro}
              onChange={(e) => setIntensidadFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent text-sm"
            >
              <option value="todas">Todas</option>
              <option value={IntensidadEjercicio.BAJA}>Baja</option>
              <option value={IntensidadEjercicio.MEDIA}>Media</option>
              <option value={IntensidadEjercicio.ALTA}>Alta</option>
            </select>
          </div>

          {/* Filtro de Zona Corporal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona Corporal
            </label>
            <select
              value={zonaFiltro}
              onChange={(e) => setZonaFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent text-sm capitalize"
            >
              <option value="todas">Todas</option>
              {Object.values(ZonaCorporal).map((zona) => (
                <option key={zona} value={zona} className="capitalize">
                  {zona.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {ejerciciosFiltrados.length === 0 ? (
            'No se encontraron ejercicios'
          ) : ejerciciosFiltrados.length === 1 ? (
            '1 ejercicio encontrado'
          ) : (
            `${ejerciciosFiltrados.length} ejercicios encontrados`
          )}
        </p>
      </div>

      {/* Lista de ejercicios */}
      {ejerciciosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay ejercicios que coincidan
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros o la búsqueda
          </p>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark font-medium"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ejerciciosFiltrados.map((ejercicio) => (
            <TarjetaEjercicio
              key={ejercicio.id}
              ejercicio={ejercicio}
              onVer={onVerDetalle}
              onToggleFavorito={onToggleFavorito}
              onAgregarARutina={onAgregarARutina}
            />
          ))}
        </div>
      )}
    </div>
  );
}
