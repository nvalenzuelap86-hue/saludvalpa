// ============================================================================
// saludvalpa 3.0 - LICENSE ALERT
// Componente mejorado para alertas de licencia
// ============================================================================

import React from 'react';
import { useLicenseCheck } from './LicenseGate';

interface LicenseAlertProps {
  requiredLevel: 'free' | 'paid';
  title?: string;
  message?: string;
  showUpgradeButton?: boolean;
  variant?: 'info' | 'warning' | 'danger';
  className?: string;
}

/**
 * Componente mejorado para alertas de licencia
 */
export const LicenseAlert: React.FC<LicenseAlertProps> = ({
  requiredLevel,
  title,
  message,
  showUpgradeButton = true,
  variant = 'warning',
  className = ''
}) => {
  const { hasAccess, licenseType } = useLicenseCheck();
  
  // Si el usuario ya tiene acceso, no mostrar nada
  if (hasAccess(requiredLevel)) {
    return null;
  }

  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  };

  const variantIcons = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '🔒'
  };

  const defaultTitles = {
    free: 'Licencia Gratuita',
    paid: 'Licencia Requerida'
  };

  const defaultMessages = {
    free: 'Esta característica está disponible en la versión gratuita.',
    paid: 'Esta característica requiere una licencia pagada.'
  };

  const displayTitle = title || defaultTitles[requiredLevel];
  const displayMessage = message || defaultMessages[requiredLevel];

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="text-xl">{variantIcons[variant]}</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{displayTitle}</h4>
          <p className="text-sm mb-2">{displayMessage}</p>
          
          {showUpgradeButton && requiredLevel === 'paid' && (
            <div className="mt-3">
              <a
                href="/app/activar-licencia"
                className="inline-flex items-center gap-2 bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                <span>⚡</span>
                <span>Actualizar a Licencia Pagada</span>
              </a>
              <p className="text-xs mt-2 opacity-80">
                Tu licencia actual: <strong>{licenseType === 'gratuita' ? 'Gratuita' : 'Pagada'}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseAlert;