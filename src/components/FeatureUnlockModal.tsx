// ============================================================================
// saludvalpa 3.0 - FEATURE UNLOCK MODAL
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import Button from './shared/Button';
import Modal from './shared/Modal';

type FeatureType = 'advanced_documents' | 'unlimited_patients' | 'cloud_backup' | 'team_collaboration' | 'custom_branding' | 'analytics';

interface Feature {
  id: FeatureType;
  title: string;
  description: string;
  icon: string;
  color: string;
  requiresLicense: boolean;
  licenseType?: 'pagada' | 'enterprise';
  action?: () => void;
}

interface FeatureUnlockModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const FeatureUnlockModal: React.FC<FeatureUnlockModalProps> = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
  const navigate = useNavigate();
  const { configuracion, licencia } = useAppStore();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(null);

  // Use external props if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose ? (value: boolean) => {
    if (!value && externalOnClose) {
      externalOnClose();
    }
    setInternalIsOpen(value);
  } : setInternalIsOpen;

  const features: Feature[] = [
    {
      id: 'advanced_documents',
      title: 'Documentos Avanzados',
      description: 'Plantillas personalizadas, firma digital, historial de versiones y exportación a múltiples formatos.',
      icon: '📄',
      color: 'from-blue-500 to-cyan-500',
      requiresLicense: true,
      licenseType: 'pagada',
      action: () => navigate('/documentos')
    },
    {
      id: 'unlimited_patients',
      title: 'Pacientes Ilimitados',
      description: 'Sin límites en el número de pacientes. Gestiona una práctica en crecimiento sin restricciones.',
      icon: '👥',
      color: 'from-green-500 to-emerald-500',
      requiresLicense: true,
      licenseType: 'pagada',
      action: () => navigate('/pacientes')
    },
    {
      id: 'cloud_backup',
      title: 'Backup en la Nube',
      description: 'Copia de seguridad automática, sincronización entre dispositivos y recuperación de datos.',
      icon: '☁️',
      color: 'from-purple-500 to-pink-500',
      requiresLicense: true,
      licenseType: 'pagada',
      action: () => navigate('/configuracion/avanzada')
    },
    {
      id: 'team_collaboration',
      title: 'Colaboración en Equipo',
      description: 'Agrega asistentes, comparte pacientes y gestiona permisos por rol.',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-orange-500 to-red-500',
      requiresLicense: true,
      licenseType: 'enterprise',
      action: () => navigate('/configuracion')
    },
    {
      id: 'custom_branding',
      title: 'Branding Personalizado',
      description: 'Logo propio, colores personalizados, pie de página personalizado y eliminación de marca de agua.',
      icon: '🎨',
      color: 'from-indigo-500 to-purple-500',
      requiresLicense: true,
      licenseType: 'pagada',
      action: () => navigate('/configuracion')
    },
    {
      id: 'analytics',
      title: 'Analíticas Avanzadas',
      description: 'Reportes detallados, métricas de crecimiento, análisis de ingresos y predicciones.',
      icon: '📊',
      color: 'from-teal-500 to-green-500',
      requiresLicense: true,
      licenseType: 'enterprise',
      action: () => navigate('/economia')
    }
  ];

  const isPaid = licencia?.tipo === 'pagada';
  const isEnterprise = false; // Currently no enterprise tier in TipoLicencia

  const handleFeatureClick = (feature: Feature) => {
    if (!feature.requiresLicense || (feature.requiresLicense &&
        ((feature.licenseType === 'pagada' && isPaid) ||
         (feature.licenseType === 'enterprise' && isEnterprise)))) {
      // Feature is unlocked or user has required license
      if (feature.action) {
        feature.action();
      }
      closeModal();
    } else {
      // Feature is locked - show upgrade modal
      setSelectedFeature(feature.id);
    }
  };

  const handleUpgrade = () => {
    navigate('/app/activar-licencia', {
      state: {
        feature: selectedFeature,
        upgradeRequired: true
      }
    });
    closeModal();
  };

  const openModal = () => {
    if (externalOnClose) {
      // If external control, we need to inform parent
      // For external control, we rely on parent to manage isOpen
      // Just call the internal setter
      setInternalIsOpen(true);
    } else {
      setIsOpen(true);
    }
  };
  
  const closeModal = () => {
    if (externalOnClose) {
      // Call external onClose if provided
      externalOnClose();
    }
    setIsOpen(false);
    setSelectedFeature(null);
  };

  // Check if user should see feature unlock prompts
  const shouldShowPrompts = () => {
    if (!configuracion) return false;
    
    // Show prompts for free users after certain milestones
    const patientCount = 0; // TODO: Get actual patient count from store
    const daysSinceOnboarding = configuracion?.fechaCreacion
      ? Math.floor((Date.now() - new Date(configuracion.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    return !isPaid && (patientCount >= 5 || daysSinceOnboarding >= 7);
  };

  // Auto-show modal based on user behavior
  // useEffect(() => {
  //   if (shouldShowPrompts()) {
  //     const hasSeenPrompt = localStorage.getItem('valpa_feature_prompt_seen');
  //     if (!hasSeenPrompt) {
  //       const timer = setTimeout(() => {
  //         openModal();
  //         localStorage.setItem('valpa_feature_prompt_seen', 'true');
  //       }, 5000);
  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [configuracion, licencia]);

  const selectedFeatureData = features.find(f => f.id === selectedFeature);

  return (
    <>
      {/* Trigger button (can be placed in dashboard or settings) */}
      <button
        onClick={openModal}
        className="hidden" // Hidden by default, can be shown conditionally
      >
        Ver características premium
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={selectedFeature ? "Desbloquear Característica" : "Características Premium"}
        size={selectedFeature ? "md" : "lg"}
      >
        {selectedFeature ? (
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${selectedFeatureData?.color} flex items-center justify-center mb-6`}>
              <span className="text-4xl">{selectedFeatureData?.icon}</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">{selectedFeatureData?.title}</h3>
            <p className="text-gray-600 mb-6">{selectedFeatureData?.description}</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold mb-3">Para acceder a esta característica necesitas:</h4>
              <ul className="space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Licencia {selectedFeatureData?.licenseType === 'enterprise' ? 'Enterprise' : 'Premium'}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Actualización inmediata</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full"
              >
                Quizás más tarde
              </Button>
              <Button
                variant="primary"
                onClick={handleUpgrade}
                className="w-full"
              >
                Actualizar a {selectedFeatureData?.licenseType === 'enterprise' ? 'Enterprise' : 'Pagada'}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Precio desde $299 MXN/mes • Cancelación en cualquier momento
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-gray-600 text-center mb-6">
                Descubre cómo SaludValpa Premium puede potenciar tu práctica profesional
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature) => {
                  const isUnlocked = !feature.requiresLicense ||
                    (feature.requiresLicense &&
                     ((feature.licenseType === 'pagada' && isPaid) ||
                      (feature.licenseType === 'enterprise' && isEnterprise)));
                  
                  return (
                    <div
                      key={feature.id}
                      onClick={() => handleFeatureClick(feature)}
                      className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        isUnlocked ? 'border-green-200 hover:border-green-400' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mr-4`}>
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{feature.title}</h4>
                          {!isUnlocked && (
                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mt-1">
                              {feature.licenseType === 'enterprise' ? 'ENTERPRISE' : 'PAGADA'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                      
                      <div className="flex items-center justify-between">
                        {isUnlocked ? (
                          <span className="text-green-600 text-sm font-medium flex items-center">
                            <span className="mr-1">✓</span> Disponible
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Requiere actualización</span>
                        )}
                        
                        {!isUnlocked && (
                          <span className="text-xs text-gray-400">→</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-xl p-6 text-white mb-6">
              <h4 className="text-xl font-bold mb-2">¿Por qué actualizar a Premium?</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">⚡</span>
                  <span>Aumenta tu productividad en un 40%</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💰</span>
                  <span>Gestiona más pacientes, genera más ingresos</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🛡️</span>
                  <span>Protege tus datos con backup automático</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎯</span>
                  <span>Herramientas específicas para tu especialidad</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Actualmente usando: <span className="font-semibold">
                    {isEnterprise ? 'Enterprise' : isPaid ? 'Pagada' : 'Gratuita'}
                  </span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closeModal}
                >
                  Continuar con versión gratuita
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedFeature('advanced_documents');
                  }}
                >
                  Ver planes
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default FeatureUnlockModal;