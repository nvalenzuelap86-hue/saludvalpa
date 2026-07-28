// ============================================================================
// saludvalpa 3.0 - SELECTOR DE PROFESIÓN
// Componente reutilizable para seleccionar una profesión
// Usado en Onboarding y Configuración
// ============================================================================

import type { TipoProfesion } from '../types';

// Definición de las profesiones disponibles con metadatos
export interface ProfesionOption {
  id: TipoProfesion;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string; // Color de fondo del icono
  disponible: boolean; // Si el módulo está completamente implementado
}

export const PROFESIONES_DISPONIBLES: ProfesionOption[] = [
  {
    id: 'fisioterapia',
    nombre: 'Fisioterapia',
    descripcion: 'Evaluación, tratamiento y rehabilitación física',
    icono: '💪',
    color: 'from-blue-500 to-teal-500',
    disponible: true,
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    descripcion: 'Salud mental, evaluación y terapia psicológica',
    icono: '🧠',
    color: 'from-purple-500 to-pink-500',
    disponible: true,
  },
  {
    id: 'nutricion',
    nombre: 'Nutrición',
    descripcion: 'Planes alimenticios, evaluación nutricional y seguimiento',
    icono: '🥗',
    color: 'from-green-500 to-emerald-500',
    disponible: true,
  },
  {
    id: 'medicina_general',
    nombre: 'Medicina General',
    descripcion: 'Consultas, diagnósticos, recetas y certificados médicos',
    icono: '🩺',
    color: 'from-red-500 to-rose-500',
    disponible: true,
  },
  {
    id: 'odontologia',
    nombre: 'Odontología',
    descripcion: 'Salud dental, odontogramas y procedimientos',
    icono: '🦷',
    color: 'from-cyan-500 to-blue-500',
    disponible: true,
  },
];

interface ProfessionSelectorProps {
  selectedProfession?: TipoProfesion;
  onSelect: (profession: TipoProfesion) => void;
  showTitle?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
}

const ProfessionSelector: React.FC<ProfessionSelectorProps> = ({
  selectedProfession,
  onSelect,
  showTitle = true,
  showDescription = true,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selecciona tu profesión
        </h2>
      )}
      {showDescription && (
        <p className="text-gray-600 mb-6">
          Elige la especialidad que practicas para personalizar tu experiencia
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROFESIONES_DISPONIBLES.map((prof) => {
          const isSelected = selectedProfession === prof.id;
          const isDisabled = disabled || !prof.disponible;

          return (
            <button
              key={prof.id}
              onClick={() => !isDisabled && onSelect(prof.id)}
              disabled={isDisabled}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                ${isSelected
                  ? 'border-saludvalpa-blue bg-saludvalpa-blue/5 shadow-lg shadow-saludvalpa-blue/10'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icono */}
              <div className={`
                w-14 h-14 rounded-xl bg-gradient-to-br ${prof.color}
                flex items-center justify-center text-2xl mb-4
                ${isSelected ? 'ring-2 ring-offset-2 ring-saludvalpa-blue' : ''}
              `}>
                {prof.icono}
              </div>

              {/* Nombre */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {prof.nombre}
              </h3>

              {/* Descripción */}
              <p className="text-sm text-gray-600">
                {prof.descripcion}
              </p>

              {/* Indicador de selección */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-saludvalpa-blue rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Badge de no disponible */}
              {!prof.disponible && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                  Próximamente
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionSelector;
