// ============================================================================
// saludvalpa 3.0 - CONTEXTUAL HELP COMPONENT
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import Button from './shared/Button';

type HelpTopic = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  content: string;
  relatedTopics: string[];
  videoUrl?: string;
  articleUrl?: string;
};

type HelpContext = {
  page: string;
  section?: string;
  action?: string;
};

const ContextualHelp = () => {
  const location = useLocation();
  const { configuracion } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<HelpTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpTopic[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  const profesion = configuracion?.profesion;

  // Help topics database
  const helpTopics: HelpTopic[] = [
    {
      id: 'getting_started',
      title: 'Comenzando con SaludValpa',
      description: 'Guía rápida para configurar y usar SaludValpa por primera vez',
      keywords: ['inicio', 'configuración', 'primeros pasos', 'onboarding'],
      content: `
        <h3>¡Bienvenido a SaludValpa!</h3>
        <p>Sigue estos pasos para comenzar:</p>
        <ol>
          <li><strong>Completa tu perfil:</strong> Configura tu información profesional y especialidad</li>
          <li><strong>Explora el dashboard:</strong> Familiarízate con las secciones principales</li>
          <li><strong>Registra tu primer paciente:</strong> Comienza a gestionar tu práctica</li>
          <li><strong>Programa citas:</strong> Usa la agenda para organizar tu tiempo</li>
          <li><strong>Genera documentos:</strong> Crea historias clínicas, recetas y más</li>
        </ol>
        <p>💡 <strong>Consejo:</strong> Usa el tour interactivo para una guía paso a paso.</p>
      `,
      relatedTopics: ['patients_management', 'appointments', 'documents']
    },
    {
      id: 'patients_management',
      title: 'Gestión de Pacientes',
      description: 'Cómo registrar, organizar y gestionar pacientes',
      keywords: ['pacientes', 'registro', 'historial', 'fichas'],
      content: `
        <h3>Gestión de Pacientes</h3>
        <p>SaludValpa te permite gestionar todos tus pacientes en un solo lugar:</p>
        
        <h4>Registrar un nuevo paciente:</h4>
        <ol>
          <li>Ve a la sección <strong>Pacientes</strong></li>
          <li>Haz clic en <strong>+ Nuevo Paciente</strong></li>
          <li>Completa la información básica y la historia clínica</li>
          <li>Guarda para agregar a tu lista</li>
        </ol>
        
        <h4>Funciones disponibles:</h4>
        <ul>
          <li><strong>Historial completo:</strong> Accede a toda la información del paciente</li>
          <li><strong>Documentos asociados:</strong> Ve todos los documentos generados</li>
          <li><strong>Citas programadas:</strong> Visualiza el historial de citas</li>
          <li><strong>Notas y evoluciones:</strong> Registra el progreso del tratamiento</li>
        </ul>
        
        <p>🎯 <strong>Para ${profesion === 'fisioterapia' ? 'fisioterapeutas' : 
          profesion === 'psicologia' ? 'psicólogos' :
          profesion === 'medicina_general' ? 'médicos' :
          profesion === 'odontologia' ? 'odontólogos' :
          profesion === 'nutricion' ? 'nutriólogos' : 'profesionales'}:</strong> 
          Usa los campos específicos de tu especialidad para documentación detallada.
        </p>
      `,
      relatedTopics: ['documents', 'appointments', 'specialty_tools']
    },
    {
      id: 'appointments',
      title: 'Agenda y Citas',
      description: 'Cómo programar, gestionar y recordar citas',
      keywords: ['citas', 'agenda', 'calendario', 'recordatorios'],
      content: `
        <h3>Gestión de Citas</h3>
        <p>Organiza tu tiempo eficientemente con la agenda de SaludValpa:</p>
        
        <h4>Programar una cita:</h4>
        <ol>
          <li>Ve a la sección <strong>Agenda</strong></li>
          <li>Selecciona la fecha y hora deseada</li>
          <li>Asocia la cita con un paciente existente o crea uno nuevo</li>
          <li>Agrega notas o recordatorios específicos</li>
          <li>Guarda para programar la cita</li>
        </ol>
        
        <h4>Características de la agenda:</h4>
        <ul>
          <li><strong>Vistas múltiples:</strong> Día, semana o mes</li>
          <li><strong>Recordatorios automáticos:</strong> Configura notificaciones por SMS o email</li>
          <li><strong>Bloqueos de tiempo:</strong> Marca horarios no disponibles</li>
          <li><strong>Confirmaciones:</strong> Envía confirmaciones automáticas a pacientes</li>
        </ul>
        
        <p>⚡ <strong>Productividad:</strong> Usa la función de cita rápida desde el dashboard para agilizar el proceso.</p>
      `,
      relatedTopics: ['patients_management', 'notifications']
    },
    {
      id: 'documents',
      title: 'Generación de Documentos',
      description: 'Cómo crear y personalizar documentos profesionales',
      keywords: ['documentos', 'plantillas', 'recetas', 'informes', 'certificados'],
      content: `
        <h3>Documentos Profesionales</h3>
        <p>Crea documentos personalizados en segundos:</p>
        
        <h4>Generar un documento:</h4>
        <ol>
          <li>Ve a la sección <strong>Documentos</strong></li>
          <li>Selecciona el tipo de documento que necesitas</li>
          <li>Elige una plantilla o comienza desde cero</li>
          <li>Completa los campos con la información del paciente</li>
          <li>Previsualiza y genera el documento final</li>
        </ol>
        
        <h4>Tipos de documentos disponibles:</h4>
        <ul>
          <li><strong>Historias clínicas:</strong> Formatos específicos por especialidad</li>
          <li><strong>Recetas y prescripciones:</strong> Con catálogos de medicamentos/procedimientos</li>
          <li><strong>Certificados médicos:</strong> Plantillas personalizables</li>
          <li><strong>Informes y evoluciones:</strong> Seguimiento del tratamiento</li>
          <li><strong>Consentimientos informados:</strong> Formatos legales</li>
        </ul>
        
        <p>🎨 <strong>Personalización:</strong> Agrega tu logo, colores y pie de página personalizado.</p>
      `,
      relatedTopics: ['patients_management', 'specialty_tools']
    },
    {
      id: 'specialty_tools',
      title: 'Herramientas Especializadas',
      description: 'Funciones específicas para tu especialidad',
      keywords: ['especialidad', 'herramientas', 'específico', 'profesión'],
      content: `
        <h3>Herramientas para ${profesion === 'fisioterapia' ? 'Fisioterapia' : 
          profesion === 'psicologia' ? 'Psicología' :
          profesion === 'medicina_general' ? 'Medicina General' :
          profesion === 'odontologia' ? 'Odontología' :
          profesion === 'nutricion' ? 'Nutrición' : 'tu especialidad'}</h3>
        
        ${profesion === 'fisioterapia' ? `
          <h4>Funciones específicas para fisioterapeutas:</h4>
          <ul>
            <li><strong>Evaluaciones fisioterapéuticas:</strong> Formatos completos con mediciones</li>
            <li><strong>Planes de tratamiento:</strong> Diseña rutinas personalizadas</li>
            <li><strong>Biblioteca de ejercicios:</strong> Catálogo con imágenes y descripciones</li>
            <li><strong>Seguimiento de evolución:</strong> Gráficos de progreso</li>
            <li><strong>Generador de rutinas:</strong> Crea planes de ejercicio detallados</li>
          </ul>
        ` : ''}
        
        ${profesion === 'psicologia' ? `
          <h4>Funciones específicas para psicólogos:</h4>
          <ul>
            <li><strong>Historia clínica psicológica:</strong> Formatos especializados</li>
            <li><strong>Escalas de evaluación:</strong> Catálogo DSM-5 y otras escalas</li>
            <li><strong>Notas de sesión:</strong> Plantillas para documentación terapéutica</li>
            <li><strong>Planes terapéuticos:</strong> Diseña intervenciones personalizadas</li>
            <li><strong>Seguimiento emocional:</strong> Registro de progreso y metas</li>
          </ul>
        ` : ''}
        
        ${profesion === 'medicina_general' ? `
          <h4>Funciones específicas para médicos:</h4>
          <ul>
            <li><strong>Historia clínica médica:</strong> Formatos completos</li>
            <li><strong>Generador de recetas:</strong> Con catálogo de medicamentos</li>
            <li><strong>Certificados médicos:</strong> Plantillas personalizables</li>
            <li><strong>Control de medicamentos:</strong> Seguimiento de tratamientos</li>
            <li><strong>Referencias y contrareferencias:</strong> Formatos especializados</li>
          </ul>
        ` : ''}
        
        ${profesion === 'odontologia' ? `
          <h4>Funciones específicas para odontólogos:</h4>
          <ul>
            <li><strong>Historia odontológica:</strong> Formatos especializados</li>
            <li><strong>Odontograma interactivo:</strong> Mapeo dental digital</li>
            <li><strong>Plan de tratamientos:</strong> Presupuestos y secuencias</li>
            <li><strong>Control de materiales:</strong> Inventario dental</li>
            <li><strong>Presupuestos dentales:</strong> Generación automática</li>
          </ul>
        ` : ''}
        
        ${profesion === 'nutricion' ? `
          <h4>Funciones específicas para nutriólogos:</h4>
          <ul>
            <li><strong>Evaluación nutricional:</strong> Antropometría y hábitos</li>
            <li><strong>Planes alimenticios:</strong> Diseño de dietas personalizadas</li>
            <li><strong>Seguimiento de peso:</strong> Gráficos de progreso</li>
            <li><strong>Calculadora nutricional:</strong> Requerimientos calóricos</li>
            <li><strong>Educación nutricional:</strong> Material educativo para pacientes</li>
          </ul>
        ` : ''}
        
        <p>🔧 <strong>Acceso rápido:</strong> Estas herramientas están disponibles en el menú de tu especialidad.</p>
      `,
      relatedTopics: ['documents', 'patients_management']
    },
    {
      id: 'license_upgrade',
      title: 'Actualizar a Premium',
      description: 'Beneficios y proceso para actualizar tu licencia',
      keywords: ['licencia', 'premium', 'pago', 'actualizar', 'características'],
      content: `
        <h3>Actualizar a SaludValpa Premium</h3>
        <p>Desbloquea todo el potencial de SaludValpa con una licencia premium:</p>
        
        <h4>Beneficios de Premium:</h4>
        <ul>
          <li><strong>Pacientes ilimitados:</strong> Sin restricciones en el número de pacientes</li>
          <li><strong>Documentos avanzados:</strong> Plantillas personalizadas y firma digital</li>
          <li><strong>Backup en la nube:</strong> Copias de seguridad automáticas</li>
          <li><strong>Branding personalizado:</strong> Logo propio y eliminación de marca de agua</li>
          <li><strong>Soporte prioritario:</strong> Atención rápida y dedicada</li>
          <li><strong>Analíticas avanzadas:</strong> Reportes detallados y métricas</li>
        </ul>
        
        <h4>Cómo actualizar:</h4>
        <ol>
          <li>Ve a <strong>Configuración → Licencia</strong></li>
          <li>Haz clic en <strong>Actualizar a Premium</strong></li>
          <li>Ingresa tu código de licencia o selecciona un plan</li>
          <li>Confirma la activación</li>
        </ol>
        
        <p>💰 <strong>Plan disponible:</strong> Licencia Anual ($999 MXN)</p>
        <p>❓ <strong>¿Preguntas?</strong> Contacta a soporte@valpa.app para asistencia personalizada.</p>
      `,
      relatedTopics: ['getting_started']
    }
  ];

  // Map routes to help topics
  const routeToTopicMap: Record<string, string> = {
    '/': 'getting_started',
    '/app/dashboard': 'getting_started',
    '/app/pacientes': 'patients_management',
    '/app/agenda': 'appointments',
    '/app/documentos': 'documents',
    '/app/configuracion': 'getting_started',
    '/activar-licencia': 'license_upgrade',
    '/app/biblioteca': 'specialty_tools',
    '/app/economia': 'getting_started'
  };

  // Auto-detect context based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const topicId = routeToTopicMap[currentPath] || 'getting_started';
    const topic = helpTopics.find(t => t.id === topicId);
    
    if (topic) {
      setCurrentTopic(topic);
    }
  }, [location.pathname]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = helpTopics.filter(topic => 
      topic.title.toLowerCase().includes(query) ||
      topic.description.toLowerCase().includes(query) ||
      topic.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );

    setSearchResults(results);
  }, [searchQuery]);

  const openHelp = () => {
    setIsOpen(true);
    setShowSearch(false);
    setSearchQuery('');
  };

  const closeHelp = () => {
    setIsOpen(false);
  };

  const handleSearch = () => {
    setShowSearch(true);
    setSearchQuery('');
  };

  const selectTopic = (topic: HelpTopic) => {
    setCurrentTopic(topic);
    setShowSearch(false);
  };

  const handleBackToTopics = () => {
    setCurrentTopic(null);
    setShowSearch(false);
  };

  // Floating help button (always visible)
  if (!isOpen) {
    return (
      <button
        ref={helpButtonRef}
        onClick={openHelp}
        className="fixed bottom-6 left-6 z-50 bg-saludvalpa-blue text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Ayuda contextual"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeHelp}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {showSearch ? 'Buscar ayuda' : currentTopic?.title || 'Centro de ayuda'}
              </h2>
              <p className="text-gray-600 mt-1">
                {showSearch ? 'Encuentra respuestas a tus preguntas' : currentTopic?.description || 'Guías y tutoriales para usar SaludValpa'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSearch}
                className="p-2 text-gray-600 hover:text-saludvalpa-blue transition-colors"
                title="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={closeHelp}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                title="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {showSearch ? (
              <div className="space-y-4">
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿En qué necesitas ayuda? Ej: pacientes, citas, documentos..."
                    className="w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Search results */}
                {searchQuery && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-3">
                      {searchResults.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => selectTopic(topic)}
                          className="w-full text-left p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{topic.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {topic.keywords.slice(0, 3).map((keyword) => (
                              <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* All topics */}
                {!searchQuery && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Temas de ayuda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {helpTopics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => selectTopic(topic)}
                          className="text-left p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{topic.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : currentTopic ? (
              <div className="space-y-6">
                {/* Topic content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                />
                
                {/* Related topics */}
                {currentTopic.relatedTopics.length > 0 && (
                  <div className="pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Temas relacionados</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTopic.relatedTopics.map((topicId) => {
                        const topic = helpTopics.find(t => t.id === topicId);
                        return topic ? (
                          <button
                            key={topic.id}
                            onClick={() => selectTopic(topic)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {topic.title}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleBackToTopics}
                  >
                    Volver a temas
                  </Button>
                  <div className="flex gap-3">
                    {currentTopic.videoUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(currentTopic.videoUrl, '_blank')}
                      >
                        Ver video tutorial
                      </Button>
                    )}
                    <Button
                      onClick={closeHelp}
                    >
                      Entendido
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-saludvalpa-blue">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Centro de ayuda de SaludValpa</h3>
                <p className="text-gray-600 mb-6">
                  Encuentra respuestas a tus preguntas y guías paso a paso para usar todas las funciones de SaludValpa.
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleSearch}>
                    Buscar ayuda
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => selectTopic(helpTopics[0])}
                  >
                    Ver guía de inicio
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualHelp;
