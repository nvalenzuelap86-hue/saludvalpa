// ============================================================================
// saludvalpa 3.0 - LICENSE GATE
// Componente para control de acceso basado en licencia
// ============================================================================

import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { TipoLicencia } from '../../types';

export type AccessLevel = 'free' | 'paid' | 'enterprise';

interface LicenseGateProps {
  requiredLevel: AccessLevel;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Verifica si el usuario tiene acceso según su nivel de licencia
 */
const checkLicenseAccess = (userLicenseType: TipoLicencia | undefined, requiredLevel: AccessLevel): boolean => {
  if (!userLicenseType) return false;
  
  const levelHierarchy = {
    'free': 0,
    'paid': 1,
    'enterprise': 2
  };

  const userLevel = userLicenseType === 'gratuita' ? 'free' :
                    userLicenseType === 'pagada' ? 'paid' :
                    userLicenseType === 'enterprise' ? 'enterprise' : 'free';
  
  return levelHierarchy[userLevel] >= levelHierarchy[requiredLevel];
};

/**
 * Componente que muestra contenido solo si el usuario tiene el nivel de licencia requerido
 */
export const LicenseGate: React.FC<LicenseGateProps> = ({
  requiredLevel,
  fallback,
  children
}) => {
  const { configuracion } = useAppStore();
  const licenseType = configuracion?.licencia.tipo;
  const hasAccess = checkLicenseAccess(licenseType, requiredLevel);

  if (!hasAccess) {
    return fallback || (
      <div className="license-gate bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
        <span className="text-4xl block mb-3">🔒</span>
        <h3 className="font-semibold text-orange-900 text-lg mb-2">
          Característica Bloqueada
        </h3>
        <p className="text-orange-700 mb-4">
          Esta característica requiere una licencia {
            requiredLevel === 'free' ? 'gratuita' :
            requiredLevel === 'paid' ? 'pagada' :
            'enterprise'
          }.
        </p>
        <a
          href="/app/activar-licencia"
          className="inline-block bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          {requiredLevel === 'enterprise' ? 'Contactar para Enterprise' : 'Actualizar Licencia'}
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Hook para verificar permisos de licencia
 */
export const useLicenseCheck = () => {
  const { configuracion } = useAppStore();
  const licenseType = configuracion?.licencia.tipo;

  const isFree = licenseType === 'gratuita';
  const isPaid = licenseType === 'pagada';
  const isEnterprise = licenseType === 'enterprise';

  return {
    licenseType,
    isFree,
    isPaid,
    isEnterprise,
    hasAccess: (requiredLevel: AccessLevel) => checkLicenseAccess(licenseType, requiredLevel),
    getFeaturePermissions: () => {
      const hasPaidAccess = isPaid || isEnterprise;
      const hasEnterpriseAccess = isEnterprise;
      
      return {
        branding: {
          logo: hasPaidAccess,
          themes: hasPaidAccess,
          customColors: hasPaidAccess,
          advancedThemes: hasEnterpriseAccess,
        },
        documentos: {
          customTemplates: hasPaidAccess,
          watermark: !hasPaidAccess, // Marca de agua solo en gratuita
          advancedTemplates: hasEnterpriseAccess,
          batchProcessing: hasEnterpriseAccess,
        },
        sincronizacion: {
          cloudSync: hasPaidAccess,
          googleDrive: hasPaidAccess,
          multiDevice: hasEnterpriseAccess,
          automaticBackup: hasEnterpriseAccess,
        },
        multiUser: hasEnterpriseAccess,
        analytics: {
          basic: hasPaidAccess,
          advanced: hasEnterpriseAccess,
          realTime: hasEnterpriseAccess,
        },
        advancedSettings: hasPaidAccess,
        apiAccess: hasEnterpriseAccess,
        whiteLabel: hasEnterpriseAccess,
        prioritySupport: hasEnterpriseAccess,
      };
    }
  };
};

export default LicenseGate;