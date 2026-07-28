// ============================================================================
// saludvalpa 3.0 - TARJETA PLAN DE ALIMENTACIÓN
// Componente de presentación para un plan de alimentación
// ============================================================================

import type { PlanAlimentacion } from '../../../types/nutricion';

interface TarjetaPlanProps {
  plan: PlanAlimentacion;
  onClick?: () => void;
  onEditar?: () => void;
  onEliminar?: () => void;
  onDuplicar?: () => void;
  onToggleActivo?: () => void;
  onAsignar?: () => void;
}

const OBJETIVOS: Record<string, { label: string; color: string }> = {
  perder_peso: { label: 'Pérdida de peso', color: 'bg-orange-100 text-orange-800' },
  ganar_musculo: { label: 'Ganancia muscular', color: 'bg-red-100 text-red-800' },
  mantener: { label: 'Mantenimiento', color: 'bg-blue-100 text-blue-800' },
  control_enfermedad: { label: 'Control de enfermedad', color: 'bg-purple-100 text-purple-800' },
  rendimiento: { label: 'Rendimiento deportivo', color: 'bg-green-100 text-green-800' },
};

const ICONOS_COMIDAS: Record<string, string> = {
  desayuno: '🌅',
  colacion1: '🍎',
  comida: '🍽️',
  colacion2: '🥜',
  cena: '🌙',
};

export default function TarjetaPlan({
  plan,
  onClick,
  onEditar,
  onEliminar,
  onDuplicar,
  onToggleActivo,
  onAsignar,
}: TarjetaPlanProps) {
  const objetivo = OBJETIVOS[plan.objetivo] || { label: plan.objetivo, color: 'bg-gray-100 text-gray-800' };

  const totalComidas = Object.values(plan.distribucionComidas).reduce(
    (sum, comidas) => sum + comidas.length, 0
  );

  const calorias = plan.requerimientos.calorias;

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
        !plan.activo ? 'opacity-75 border-gray-200' : 'border-gray-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{plan.nombre}</h3>
            {plan.descripcion && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.descripcion}</p>
            )}
          </div>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${objetivo.color}`}>
            {objetivo.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Métricas principales */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">🔥</span>
            <span className="font-medium">{calorias} kcal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">🍽️</span>
            <span className="font-medium">{totalComidas} comidas</span>
          </div>
          {plan.pacienteId && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">👤</span>
              <span className="font-medium text-blue-600">Asignado</span>
            </div>
          )}
        </div>

        {/* Distribución de comidas */}
        {totalComidas > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(plan.distribucionComidas).map(([tipo, comidas]) =>
              comidas.length > 0 ? (
                <span
                  key={tipo}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-xs text-gray-600"
                >
                  <span>{ICONOS_COMIDAS[tipo] || '🍴'}</span>
                  <span>{comidas.length}</span>
                </span>
              ) : null
            )}
          </div>
        )}

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 rounded p-1.5 text-center">
            <span className="text-blue-700 font-medium">{plan.requerimientos.proteinas}g</span>
            <span className="text-blue-500 block">Proteínas</span>
          </div>
          <div className="bg-amber-50 rounded p-1.5 text-center">
            <span className="text-amber-700 font-medium">{plan.requerimientos.carbohidratos}g</span>
            <span className="text-amber-500 block">Carbohidratos</span>
          </div>
          <div className="bg-red-50 rounded p-1.5 text-center">
            <span className="text-red-700 font-medium">{plan.requerimientos.grasas}g</span>
            <span className="text-red-500 block">Grasas</span>
          </div>
        </div>
      </div>

      {/* Footer / Acciones */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plan.esPlantilla && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                📋 Plantilla
              </span>
            )}
            {!plan.activo && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                Inactivo
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onToggleActivo && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleActivo(); }}
                className={`p-1.5 rounded text-xs transition-colors ${
                  plan.activo
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={plan.activo ? 'Desactivar' : 'Activar'}
              >
                {plan.activo ? '✓ Activo' : '○ Inactivo'}
              </button>
            )}
            {onEditar && (
              <button
                onClick={(e) => { e.stopPropagation(); onEditar(); }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs transition-colors"
                title="Editar"
              >
                ✏️
              </button>
            )}
            {onDuplicar && (
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicar(); }}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded text-xs transition-colors"
                title="Duplicar"
              >
                📋
              </button>
            )}
            {onAsignar && (
              <button
                onClick={(e) => { e.stopPropagation(); onAsignar(); }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs transition-colors"
                title="Asignar a paciente"
              >
                👤
              </button>
            )}
            {onEliminar && (
              <button
                onClick={(e) => { e.stopPropagation(); onEliminar(); }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded text-xs transition-colors"
                title="Eliminar"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
