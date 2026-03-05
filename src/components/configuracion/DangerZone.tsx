// ============================================================================
// saludvalpa 3.0 - DANGER ZONE
// Componente para operaciones peligrosas o destructivas
// ============================================================================

import React from 'react';

interface DangerZoneProps {
  title: string;
  description: string;
  buttonText: string;
  onConfirm: () => void;
  confirmText?: string;
  warningText?: string;
  className?: string;
}

/**
 * Componente para operaciones peligrosas o destructivas
 */
export const DangerZone: React.FC<DangerZoneProps> = ({
  title,
  description,
  buttonText,
  onConfirm,
  confirmText = '¿Estás seguro? Esta acción no se puede deshacer.',
  warningText = 'Esta acción es irreversible.',
  className = ''
}) => {
  const handleClick = () => {
    const confirmacion = confirm(confirmText);
    if (confirmacion) {
      onConfirm();
    }
  };

  return (
    <div className={`border-2 border-red-200 rounded-lg p-6 bg-red-50 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl text-red-600">🚨</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{description}</p>
        </div>
      </div>

      <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-red-800">
          ⚠️ <strong>Advertencia:</strong> {warningText}
        </p>
      </div>

      <button
        onClick={handleClick}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
      >
        <span>🗑️</span>
        <span>{buttonText}</span>
      </button>
    </div>
  );
};

export default DangerZone;