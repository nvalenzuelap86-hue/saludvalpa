// ============================================================================
// saludvalpa 3.0 - INTERACTIVE TOUR COMPONENT
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import Button from './shared/Button';
import Card from './shared/Card';

type TourStep = {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  completed?: boolean;
};

type TourStage = 'welcome' | 'dashboard' | 'patients' | 'appointments' | 'documents' | 'finances' | 'configuration' | 'complete';

interface InteractiveTourProps {
  open?: boolean;
  onClose?: () => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ open = false, onClose }) => {
  const navigate = useNavigate();
  const { configuracion } = useAppStore();
  const [isOpen, setIsOpen] = useState(open);
  const [currentStage, setCurrentStage] = useState<TourStage>('welcome');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync with open prop
  useEffect(() => {
    if (open !== isOpen) {
      setIsOpen(open);
    }
  }, [open]);

  const profesion = configuracion?.profesion;
  const onboardingCompleted = !!configuracion;

  // Tour steps configuration
  const stages: TourStage[] = ['welcome', 'dashboard', 'patients', 'appointments', 'documents', 'finances', 'configuration', 'complete'];
  
  const tourSteps: Record<TourStage, TourStep[]> = {
    welcome: [
      {
        id: 'welcome-1',
        title: '¡Bienvenido a SaludValpa!',
        description: 'Te guiaremos por las principales funcionalidades de la plataforma para que puedas aprovecharla al máximo.',
        position: 'bottom'
      },
      {
        id: 'welcome-2',
        title: 'Tu especialidad: ' + (profesion ?
          profesion === 'fisioterapia' ? 'Fisioterapia' :
          profesion === 'psicologia' ? 'Psicología' :
          profesion === 'medicina_general' ? 'Medicina General' :
          profesion === 'odontologia' ? 'Odontología' :
          profesion === 'nutricion' ? 'Nutrición' : 'Profesional'
          : 'No seleccionada'),
        description: 'La plataforma se ha personalizado con herramientas específicas para tu área profesional.',
        position: 'bottom'
      }
    ],
    dashboard: [
      {
        id: 'dashboard-1',
        title: 'Dashboard Principal',
        description: 'Aquí tienes una vista general de tu práctica: pacientes activos, citas próximas y métricas clave.',
        targetSelector: '.dashboard-stats',
        position: 'bottom'
      },
      {
        id: 'dashboard-2',
        title: 'Acceso Rápido',
        description: 'Usa estos botones para acceder rápidamente a las funciones más utilizadas.',
        targetSelector: '.quick-actions',
        position: 'right'
      },
      {
        id: 'dashboard-3',
        title: 'Calendario',
        description: 'Visualiza y gestiona todas tus citas en un calendario interactivo.',
        targetSelector: '.calendar-section',
        position: 'left',
        action: () => navigate('/agenda')
      }
    ],
    patients: [
      {
        id: 'patients-1',
        title: 'Gestión de Pacientes',
        description: 'Registra y organiza la información de todos tus pacientes en un solo lugar.',
        targetSelector: '.patients-section',
        position: 'bottom',
        action: () => navigate('/pacientes')
      },
      {
        id: 'patients-2',
        title: 'Historial Clínico',
        description: 'Accede al historial completo de cada paciente, incluyendo evaluaciones, tratamientos y documentos.',
        position: 'bottom'
      }
    ],
    appointments: [
      {
        id: 'appointments-1',
        title: 'Agenda Inteligente',
        description: 'Programa citas, establece recordatorios y gestiona tu disponibilidad.',
        position: 'bottom',
        action: () => navigate('/agenda')
      },
      {
        id: 'appointments-2',
        title: 'Confirmaciones Automáticas',
        description: 'Configura recordatorios automáticos por SMS o email para reducir las inasistencias.',
        position: 'bottom'
      }
    ],
    documents: [
      {
        id: 'documents-1',
        title: 'Generador de Documentos',
        description: 'Crea documentos profesionales en segundos: historias clínicas, recetas, informes, etc.',
        position: 'bottom',
        action: () => navigate('/documentos')
      },
      {
        id: 'documents-2',
        title: 'Plantillas Personalizadas',
        description: 'Usa plantillas predefinidas o crea las tuyas propias con tu logo y branding.',
        position: 'bottom'
      }
    ],
    finances: [
      {
        id: 'finances-1',
        title: 'Gestión Financiera',
        description: 'Registra pagos, genera recibos y lleva el control de tus ingresos y gastos.',
        position: 'bottom',
        action: () => navigate('/economia')
      },
      {
        id: 'finances-2',
        title: 'Reportes Automáticos',
        description: 'Obtén reportes detallados de tu desempeño financiero con gráficos y análisis.',
        position: 'bottom'
      }
    ],
    configuration: [
      {
        id: 'configuration-1',
        title: 'Configuración Unificada',
        description: 'Gestiona toda tu configuración desde un solo lugar con nuestro nuevo sistema unificado de 9 pestañas.',
        position: 'bottom',
        action: () => navigate('/configuracion-unificada')
      },
      {
        id: 'configuration-2',
        title: 'Preferencias Avanzadas',
        description: 'Personaliza formato de fechas, economía, agenda y recordatorios según tus necesidades.',
        position: 'bottom'
      },
      {
        id: 'configuration-3',
        title: 'Documentos y Branding',
        description: 'Configura el formato de tus documentos, marca de agua y pie de página profesional.',
        position: 'bottom'
      },
      {
        id: 'configuration-4',
        title: 'Personalización Completa',
        description: 'Elige temas, colores y ajusta la apariencia de la plataforma a tu estilo.',
        position: 'bottom'
      },
      {
        id: 'configuration-5',
        title: 'Sincronización en la Nube',
        description: 'Conecta con Google Drive para respaldos automáticos y acceso desde cualquier dispositivo.',
        position: 'bottom'
      }
    ],
    complete: [
      {
        id: 'complete-1',
        title: '¡Tour Completado!',
        description: 'Ya conoces las principales funcionalidades de SaludValpa. ¡Comienza a usarlas ahora!',
        position: 'bottom'
      }
    ]
  };

  const currentSteps = tourSteps[currentStage];
  const currentStep = currentSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStep.action) {
      currentStep.action();
    }

    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Move to next stage
      const currentIndex = stages.indexOf(currentStage);
      
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1]);
        setCurrentStepIndex(0);
      } else {
        setIsCompleted(true);
        // Mark tour as completed in store
        // TODO: Add store method to mark tour as completed
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      const currentIndex = stages.indexOf(currentStage);
      
      if (currentIndex > 0) {
        setCurrentStage(stages[currentIndex - 1]);
        const prevSteps = tourSteps[stages[currentIndex - 1]];
        setCurrentStepIndex(prevSteps.length - 1);
      }
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    // Mark tour as skipped in localStorage
    localStorage.setItem('valpa_tour_skipped', 'true');
    if (onClose) onClose();
  };

  // Effect to highlight target element
  useEffect(() => {
    if (!isOpen || !currentStep.targetSelector) {
      // Remove any existing highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      return;
    }

    // Find the target element
    const targetElement = document.querySelector(currentStep.targetSelector);
    if (targetElement) {
      // Add highlight class
      targetElement.classList.add('tour-highlight');
      
      // Scroll element into view if needed
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Cleanup function
    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, isOpen]);

  const handleComplete = () => {
    setIsOpen(false);
    setIsCompleted(true);
    // Mark tour as completed in localStorage
    localStorage.setItem('valpa_tour_completed', 'true');
    if (onClose) onClose();
  };

  const startTour = () => {
    setIsOpen(true);
    setCurrentStage('welcome');
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  // Auto-start tour for new users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('valpa_tour_completed');
    if (!hasSeenTour && onboardingCompleted) {
      const timer = setTimeout(() => {
        startTour();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onboardingCompleted]);

  // Only show floating button if tour is not open AND we're not being controlled externally
  if (!isOpen && !onClose) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 z-50 bg-saludvalpa-blue text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Iniciar tour interactivo"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  // If tour is not open and we're being controlled externally, return null
  if (!isOpen) {
    return null;
  }

  // Calculate progress
  const totalSteps = Object.values(tourSteps).reduce((sum, steps) => sum + steps.length, 0);
  const completedSteps = Object.entries(tourSteps).reduce((sum, [stage, steps]) => {
    if (stages.indexOf(stage as TourStage) < stages.indexOf(currentStage)) {
      return sum + steps.length;
    } else if (stage === currentStage) {
      return sum + currentStepIndex;
    }
    return sum;
  }, 0);
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const stageLabels: Record<TourStage, string> = {
    welcome: 'Bienvenida',
    dashboard: 'Dashboard',
    patients: 'Pacientes',
    appointments: 'Citas',
    documents: 'Documentos',
    finances: 'Finanzas',
    configuration: 'Configuración',
    complete: 'Completado'
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Tour modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <Card className="relative bg-white shadow-2xl">
          {/* Progress bar */}
          <div className="px-6 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {stageLabels[currentStage]} ({currentStepIndex + 1}/{currentSteps.length})
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% completado
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-saludvalpa-blue rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentStep.title}</h3>
                <p className="text-gray-600 mt-2">{currentStep.description}</p>
              </div>
            </div>

            {/* Stage indicators */}
            <div className="flex justify-between mt-6 mb-8">
              {stages.map((stage) => (
                <div key={stage} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stages.indexOf(stage) < stages.indexOf(currentStage)
                      ? 'bg-green-500 text-white'
                      : stages.indexOf(stage) === stages.indexOf(currentStage)
                      ? 'bg-saludvalpa-blue text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stages.indexOf(stage) < stages.indexOf(currentStage) ? '✓' : stages.indexOf(stage) + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{stageLabels[stage]}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <div>
                {currentStepIndex > 0 || stages.indexOf(currentStage) > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    ← Anterior
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                  >
                    Saltar Tour
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                {currentStage === 'complete' ? (
                  <Button
                    variant="primary"
                    onClick={handleComplete}
                  >
                    Comenzar a Usar SaludValpa
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                  >
                    {currentStepIndex === currentSteps.length - 1 ? 'Continuar →' : 'Siguiente →'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveTour;