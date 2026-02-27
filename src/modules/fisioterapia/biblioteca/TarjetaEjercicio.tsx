// ============================================================================
// COMPONENTE: TarjetaEjercicio
// Card individual de ejercicio en la biblioteca
// ============================================================================

import type { Ejercicio } from '../../../types';

interface TarjetaEjercicioProps {
  ejercicio: Ejercicio;
  onVer: (ejercicio: Ejercicio) => void;
  onToggleFavorito: (id: string) => void;
  onAgregarARutina?: (ejercicio: Ejercicio) => void;
}

export default function TarjetaEjercicio({
  ejercicio,
  onVer,
  onToggleFavorito,
  onAgregarARutina,
}: TarjetaEjercicioProps) {
  
  // Mapeo de categorías a emojis
  const categoriasEmojis: Record<string, string> = {
    movilidad: '🔄',
    fuerza: '💪',
    equilibrio: '⚖️',
    estiramiento: '🧘',
    cardio: '🏃',
    otro: '🎯',
  };

  // Mapeo de intensidades a colores
  const intensidadColors: Record<string, string> = {
    baja: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-saludvalpa-blue transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Header con categoría e intensidad */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {categoriasEmojis[ejercicio.categoria] || '🎯'}
            </span>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {ejercicio.nombre}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {ejercicio.categoria}
              </p>
            </div>
          </div>
          
          {/* Botón favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorito(ejercicio.id);
            }}
            className="text-xl hover:scale-110 transition-transform"
            title={ejercicio.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {ejercicio.favorito ? '⭐' : '☆'}
          </button>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {ejercicio.descripcion}
        </p>

        {/* Badges de información */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Intensidad */}
          <span className={`text-xs px-2 py-1 rounded-full ${intensidadColors[ejercicio.intensidad]}`}>
            {ejercicio.intensidad.charAt(0).toUpperCase() + ejercicio.intensidad.slice(1)}
          </span>

          {/* Zonas corporales (máximo 2) */}
          {ejercicio.zonasCorporales.slice(0, 2).map((zona, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize"
            >
              {zona.replace(/_/g, ' ')}
            </span>
          ))}
          
          {ejercicio.zonasCorporales.length > 2 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              +{ejercicio.zonasCorporales.length - 2}
            </span>
          )}

          {/* Badge de precargado/personalizado */}
          {!ejercicio.precargado && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
              Personalizado
            </span>
          )}
        </div>

        {/* Información adicional */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {ejercicio.duracionSugerida && (
            <span className="flex items-center gap-1">
              ⏱️ {ejercicio.duracionSugerida} min
            </span>
          )}
          {ejercicio.equipoNecesario.length > 0 && (
            <span className="flex items-center gap-1">
              🏋️ {ejercicio.equipoNecesario.length} equipo(s)
            </span>
          )}
          {ejercicio.contraindicaciones.length > 0 && (
            <span className="flex items-center gap-1">
              ⚠️ {ejercicio.contraindicaciones.length}
            </span>
          )}
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => onVer(ejercicio)}
          className="text-sm text-saludvalpa-blue hover:text-saludvalpa-blue-dark font-medium transition-colors"
        >
          Ver detalles
        </button>

        {onAgregarARutina && (
          <button
            onClick={() => onAgregarARutina(ejercicio)}
            className="text-sm bg-saludvalpa-blue text-white px-3 py-1 rounded hover:bg-saludvalpa-blue-dark transition-colors"
          >
            + Agregar a rutina
          </button>
        )}
      </div>
    </div>
  );
}
