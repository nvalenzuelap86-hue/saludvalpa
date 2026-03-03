// ============================================================================
// saludvalpa 3.0 - BADGE DE CATEGORÍA DE DOCUMENTO
// Componente para mostrar categorías de documentos (Administrativo/Médico)
// ============================================================================

import { DocumentCategory } from '../../types';

interface DocumentCategoryBadgeProps {
  categoria: DocumentCategory;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DocumentCategoryBadge = ({
  categoria,
  className = '',
  showIcon = true,
  size = 'md'
}: DocumentCategoryBadgeProps) => {
  // Configuración por categoría
  const config = {
    administrativo: {
      label: 'Administrativo',
      icon: '📋',
      colorClasses: 'bg-blue-100 text-blue-800 border-blue-200',
      iconColor: 'text-blue-500'
    },
    medico: {
      label: 'Médico',
      icon: '🏥',
      colorClasses: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-500'
    }
  };

  const categoryConfig = config[categoria] || config.administrativo;
  
  // Tamaños
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border
        font-medium
        ${sizeClasses[size]}
        ${categoryConfig.colorClasses}
        ${className}
      `}
      title={`Documento ${categoryConfig.label.toLowerCase()}`}
    >
      {showIcon && (
        <span className={categoryConfig.iconColor}>
          {categoryConfig.icon}
        </span>
      )}
      {categoryConfig.label}
    </span>
  );
};

// Componente para mostrar múltiples badges (si en el futuro hay más categorías)
interface DocumentCategoryBadgesProps {
  categorias: DocumentCategory[];
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DocumentCategoryBadges = ({
  categorias,
  className = '',
  showIcon = true,
  size = 'md'
}: DocumentCategoryBadgesProps) => {
  if (categorias.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {categorias.map((categoria, index) => (
        <DocumentCategoryBadge
          key={index}
          categoria={categoria}
          showIcon={showIcon}
          size={size}
        />
      ))}
    </div>
  );
};

export default DocumentCategoryBadge;