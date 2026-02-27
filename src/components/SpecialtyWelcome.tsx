// ============================================================================
// saludvalpa 3.0 - SPECIALTY WELCOME COMPONENT
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import type { TipoProfesion } from '../types';
import Button from './shared/Button';
import Card from './shared/Card';

interface SpecialtyInfo {
  id: TipoProfesion;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  quickActions: Array<{
    label: string;
    icon: string;
    path: string;
    description: string;
  }>;
  resources: Array<{
    title: string;
    description: string;
    type: 'template' | 'guide' | 'tool';
  }>;
}

const SpecialtyWelcome = () => {
  const navigate = useNavigate();
  const { configuracion } = useAppStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  const profesion = configuracion?.profesion;

  const specialtyData: Record<TipoProfesion, SpecialtyInfo> = {
    fisioterapia: {
      id: 'fisioterapia',
      name: 'Fisioterapia',
      icon: '💪',
      color: 'from-blue-500 to-cyan-500',
      description: 'Herramientas especializadas para evaluación, tratamiento y seguimiento de pacientes.',
      features: [
        'Evaluaciones fisioterapéuticas',
        'Planes de tratamiento personalizados',
        'Biblioteca de ejercicios',
        'Seguimiento de evolución',
        'Generación de rutinas'
      ],
      quickActions: [
        {
          label: 'Nueva Evaluación',
          icon: '📋',
          path: '/pacientes/nuevo',
          description: 'Crea una evaluación fisioterapéutica completa'
        },
        {
          label: 'Biblioteca de Ejercicios',
          icon: '📚',
          path: '/app/biblioteca',
          description: 'Accede a ejercicios y rutinas predefinidas'
        },
        {
          label: 'Generar Plan de Tratamiento',
          icon: '📝',
          path: '/documentos/nuevo',
          description: 'Crea un plan de tratamiento personalizado'
        }
      ],
      resources: [
        {
          title: 'Plantilla de Evaluación',
          description: 'Formato estándar para evaluación inicial',
          type: 'template'
        },
        {
          title: 'Guía de Ejercicios',
          description: 'Catálogo de ejercicios por patología',
          type: 'guide'
        },
        {
          title: 'Calculadora de ROM',
          description: 'Herramienta para medir rangos de movimiento',
          type: 'tool'
        }
      ]
    },
    psicologia: {
      id: 'psicologia',
      name: 'Psicología',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      description: 'Herramientas para evaluación psicológica, sesiones terapéuticas y seguimiento emocional.',
      features: [
        'Historia clínica psicológica',
        'Notas de sesión',
        'Escalas de evaluación',
        'Planes terapéuticos',
        'Seguimiento de progreso'
      ],
      quickActions: [
        {
          label: 'Nueva Historia Clínica',
          icon: '📋',
          path: '/pacientes/nuevo',
          description: 'Inicia una historia clínica psicológica'
        },
        {
          label: 'Registrar Sesión',
          icon: '📝',
          path: '/agenda/nueva',
          description: 'Registra notas de la sesión actual'
        },
        {
          label: 'Aplicar Escala',
          icon: '📊',
          path: '/documentos/nuevo',
          description: 'Aplica escalas de evaluación psicológica'
        }
      ],
      resources: [
        {
          title: 'Escalas DSM-5',
          description: 'Catálogo de escalas diagnósticas',
          type: 'template'
        },
        {
          title: 'Guía de Intervenciones',
          description: 'Técnicas terapéuticas por trastorno',
          type: 'guide'
        },
        {
          title: 'Formulario Consentimiento',
          description: 'Plantilla de consentimiento informado',
          type: 'template'
        }
      ]
    },
    medicina_general: {
      id: 'medicina_general',
      name: 'Medicina General',
      icon: '🩺',
      color: 'from-red-500 to-orange-500',
      description: 'Herramientas para historia clínica médica, recetas, certificados y seguimiento de pacientes.',
      features: [
        'Historia clínica médica',
        'Generador de recetas',
        'Certificados médicos',
        'Seguimiento de tratamientos',
        'Control de medicamentos'
      ],
      quickActions: [
        {
          label: 'Nueva Historia Clínica',
          icon: '📋',
          path: '/pacientes/nuevo',
          description: 'Crea una historia clínica médica completa'
        },
        {
          label: 'Generar Receta',
          icon: '💊',
          path: '/documentos/nuevo',
          description: 'Crea una receta médica personalizada'
        },
        {
          label: 'Certificado Médico',
          icon: '📄',
          path: '/documentos/nuevo',
          description: 'Genera un certificado médico'
        }
      ],
      resources: [
        {
          title: 'Catálogo CIE-10',
          description: 'Códigos diagnósticos internacionales',
          type: 'tool'
        },
        {
          title: 'Plantilla Receta',
          description: 'Formato estándar para recetas médicas',
          type: 'template'
        },
        {
          title: 'Guía de Dosificación',
          description: 'Dosificaciones comunes por medicamento',
          type: 'guide'
        }
      ]
    },
    odontologia: {
      id: 'odontologia',
      name: 'Odontología',
      icon: '🦷',
      color: 'from-teal-500 to-emerald-500',
      description: 'Herramientas para historia odontológica, odontogramas, tratamientos y control de materiales.',
      features: [
        'Historia odontológica',
        'Odontograma interactivo',
        'Plan de tratamientos',
        'Control de materiales',
        'Presupuestos dentales'
      ],
      quickActions: [
        {
          label: 'Nueva Historia Odontológica',
          icon: '📋',
          path: '/pacientes/nuevo',
          description: 'Inicia una historia odontológica completa'
        },
        {
          label: 'Odontograma',
          icon: '🦷',
          path: '/pacientes/odontograma',
          description: 'Accede al odontograma interactivo'
        },
        {
          label: 'Presupuesto Dental',
          icon: '💰',
          path: '/documentos/nuevo',
          description: 'Genera un presupuesto dental detallado'
        }
      ],
      resources: [
        {
          title: 'Odontograma Digital',
          description: 'Herramienta para mapeo dental',
          type: 'tool'
        },
        {
          title: 'Catálogo Procedimientos',
          description: 'Procedimientos dentales con códigos',
          type: 'guide'
        },
        {
          title: 'Plantilla Consentimiento',
          description: 'Consentimiento para tratamientos dentales',
          type: 'template'
        }
      ]
    },
    nutricion: {
      id: 'nutricion',
      name: 'Nutrición',
      icon: '🥗',
      color: 'from-green-500 to-lime-500',
      description: 'Herramientas para evaluación nutricional, planes alimenticios, seguimiento y educación.',
      features: [
        'Evaluación nutricional',
        'Planes alimenticios',
        'Seguimiento de peso',
        'Educación nutricional',
        'Calculadora de requerimientos'
      ],
      quickActions: [
        {
          label: 'Nueva Evaluación Nutricional',
          icon: '📋',
          path: '/pacientes/nuevo',
          description: 'Realiza una evaluación nutricional completa'
        },
        {
          label: 'Crear Plan Alimenticio',
          icon: '🥗',
          path: '/documentos/nuevo',
          description: 'Diseña un plan alimenticio personalizado'
        },
        {
          label: 'Calculadora Nutricional',
          icon: '🧮',
          path: '/herramientas/calculadora',
          description: 'Calcula requerimientos nutricionales'
        }
      ],
      resources: [
        {
          title: 'Tabla de Alimentos',
          description: 'Valores nutricionales por alimento',
          type: 'tool'
        },
        {
          title: 'Plantilla Plan Alimenticio',
          description: 'Formato para planes de alimentación',
          type: 'template'
        },
        {
          title: 'Guía de Porciones',
          description: 'Guía visual de porciones recomendadas',
          type: 'guide'
        }
      ]
    }
  };

  const currentSpecialty = profesion ? specialtyData[profesion] : null;

  useEffect(() => {
    if (profesion && !hasSeenWelcome) {
      const welcomeKey = `valpa_welcome_${profesion}_seen`;
      const hasSeen = localStorage.getItem(welcomeKey);
      
      if (!hasSeen) {
        setShowWelcome(true);
        localStorage.setItem(welcomeKey, 'true');
      }
      setHasSeenWelcome(true);
    }
  }, [profesion, hasSeenWelcome]);

  const handleClose = () => {
    setShowWelcome(false);
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
    setShowWelcome(false);
  };

  const handleExploreResources = () => {
    navigate('/app/biblioteca');
    setShowWelcome(false);
  };

  if (!showWelcome || !currentSpecialty) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentSpecialty.color} flex items-center justify-center mr-6`}>
                <span className="text-4xl">{currentSpecialty.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido, {currentSpecialty.name}!
                </h1>
                <p className="text-gray-600 mt-2">{currentSpecialty.description}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Features */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Características para {currentSpecialty.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentSpecialty.features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {currentSpecialty.quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.path)}
                    className="bg-white border-2 border-gray-100 rounded-xl p-4 text-left hover:border-saludvalpa-blue hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right column: Resources & Tips */}
            <div>
              <div className="bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-xl p-6 text-white mb-6">
                <h3 className="text-lg font-bold mb-3">💡 Consejo Profesional</h3>
                <p className="text-sm">
                  {profesion === 'fisioterapia' && 'Utiliza la biblioteca de ejercicios para crear rutinas personalizadas basadas en las necesidades específicas de cada paciente.'}
                  {profesion === 'psicologia' && 'Documenta cada sesión inmediatamente después para capturar detalles importantes y observar patrones a lo largo del tiempo.'}
                  {profesion === 'medicina_general' && 'Mantén un registro actualizado de medicamentos y alergias para cada paciente para evitar interacciones peligrosas.'}
                  {profesion === 'odontologia' && 'Utiliza el odontograma interactivo para documentar el estado dental y planificar tratamientos de manera visual.'}
                  {profesion === 'nutricion' && 'Combina planes alimenticios con educación nutricional para lograr cambios sostenibles en los hábitos de tus pacientes.'}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Recursos Disponibles</h3>
                <div className="space-y-4">
                  {currentSpecialty.resources.map((resource, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        resource.type === 'template' ? 'bg-blue-100 text-blue-600' :
                        resource.type === 'guide' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {resource.type === 'template' && '📄'}
                        {resource.type === 'guide' && '📚'}
                        {resource.type === 'tool' && '🛠️'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleExploreResources}
                  className="w-full mt-6"
                >
                  Explorar todos los recursos
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Esta bienvenida solo se mostrará una vez. Puedes acceder a estas herramientas desde el menú principal.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                ¿Necesitas ayuda? <button className="text-saludvalpa-blue hover:underline">Ver tutorial</button>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Saltar introducción
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
              >
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpecialtyWelcome;