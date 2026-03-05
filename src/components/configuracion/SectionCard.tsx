// ============================================================================
// saludvalpa 3.0 - SECTION CARD
// Componente reutilizable para secciones de configuración
// ============================================================================

import React from 'react';

export type SectionCardVariant =
  | 'default'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'premium'
  | 'enterprise'
  | 'disabled'
  | 'highlight';

export type SectionCardSize = 'sm' | 'md' | 'lg';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: SectionCardVariant;
  size?: SectionCardSize;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: string;
  badgeVariant?: SectionCardVariant;
  actionButton?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Componente de tarjeta de sección reutilizable para configuración
 */
export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
  variant = 'default',
  size = 'md',
  collapsible = false,
  defaultCollapsed = false,
  badge,
  badgeVariant = 'default',
  actionButton,
  footer,
  loading = false,
  disabled = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const variantStyles = {
    default: 'border-gray-200 bg-white',
    danger: 'border-red-200 bg-red-50',
    warning: 'border-orange-200 bg-orange-50',
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50',
    premium: 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50',
    enterprise: 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50',
    disabled: 'border-gray-200 bg-gray-50 opacity-60',
    highlight: 'border-saludvalpa-blue bg-gradient-to-r from-saludvalpa-blue-light to-saludvalpa-teal-light'
  };

  const variantIconColors = {
    default: 'text-saludvalpa-blue',
    danger: 'text-red-600',
    warning: 'text-orange-600',
    success: 'text-green-600',
    info: 'text-blue-600',
    premium: 'text-purple-600',
    enterprise: 'text-indigo-600',
    disabled: 'text-gray-500',
    highlight: 'text-saludvalpa-blue'
  };

  const badgeStyles = {
    default: 'bg-gray-100 text-gray-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-indigo-100 text-indigo-800',
    disabled: 'bg-gray-100 text-gray-500',
    highlight: 'bg-saludvalpa-blue-light text-saludvalpa-blue'
  };

  const sizeStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const titleSizeStyles = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-semibold'
  };

  const handleToggleCollapse = () => {
    if (collapsible && !disabled) {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (loading) {
    return (
      <div className={`border rounded-lg ${sizeStyles[size]} bg-gray-50 animate-pulse ${className}`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        border rounded-lg ${sizeStyles[size]} ${variantStyles[variant]}
        ${disabled ? 'cursor-not-allowed' : ''}
        ${collapsible ? 'cursor-pointer hover:shadow-sm transition-shadow' : ''}
        ${className}
      `}
      onClick={collapsible ? handleToggleCollapse : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && (
            <div className={`text-xl ${variantIconColors[variant]} ${disabled ? 'opacity-50' : ''}`}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`${titleSizeStyles[size]} text-gray-900 ${disabled ? 'opacity-60' : ''}`}>
                {title}
              </h3>
              {badge && (
                <span className={`text-xs px-2 py-1 rounded-full ${badgeStyles[badgeVariant]}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className={`text-sm text-gray-600 mt-1 ${disabled ? 'opacity-50' : ''}`}>
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {actionButton}
          {collapsible && (
            <button
              className={`p-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={handleToggleCollapse}
              disabled={disabled}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          <div className={`space-y-4 ${disabled ? 'opacity-60' : ''}`}>
            {children}
          </div>
          
          {footer && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionCard;