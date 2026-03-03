import React, { useState } from 'react';

// Types for documentation
export interface DocumentationSection {
  id: string;
  title: string;
  category: 'getting-started' | 'workflow' | 'features' | 'troubleshooting' | 'advanced';
  content: string;
  lastUpdated: Date;
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  sections: string[];
  duration: number; // in minutes
  completed: boolean;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  completedSections: string[];
  completedModules: string[];
  quizScores: Record<string, number>;
  totalTimeSpent: number; // in minutes
}

const UserDocumentationSystem: React.FC = () => {
  const [sections, setSections] = useState<DocumentationSection[]>([
    {
      id: 'doc-1',
      title: 'Introducción al Módulo de Medicina',
      category: 'getting-started',
      content: 'El módulo de medicina está diseñado específicamente para médicos generales y especialistas. Proporciona herramientas completas para la gestión de consultas, prescripción médica, historial clínico y soporte a decisiones clínicas.',
      lastUpdated: new Date('2026-03-01'),
      author: 'Equipo de Desarrollo',
      difficulty: 'beginner',
      estimatedTime: 5
    },
    {
      id: 'doc-2',
      title: 'Flujo de Trabajo de Consulta Médica',
      category: 'workflow',
      content: '1. Seleccionar paciente\n2. Iniciar nueva consulta\n3. Registrar signos vitales\n4. Completar nota SOAP\n5. Prescribir medicamentos\n6. Generar documentos\n7. Finalizar consulta',
      lastUpdated: new Date('2026-03-01'),
      author: 'Dr. Ana García',
      difficulty: 'beginner',
      estimatedTime: 10
    },
    {
      id: 'doc-3',
      title: 'Sistema de Prescripción Inteligente',
      category: 'features',
      content: 'El sistema de prescripción incluye:\n- Verificación de interacciones medicamentosas\n- Ajuste de dosis por función renal\n- Plantillas de medicamentos comunes\n- Generación automática de recetas',
      lastUpdated: new Date('2026-03-02'),
      author: 'Equipo Farmacología',
      difficulty: 'intermediate',
      estimatedTime: 15
    },
    {
      id: 'doc-4',
      title: 'Soporte a Decisiones Clínicas (CDSS)',
      category: 'advanced',
      content: 'El CDSS proporciona:\n- Diagnósticos diferenciales\n- Guías clínicas actualizadas\n- Calculadoras médicas\n- Alertas de interacciones\n- Recomendaciones de tratamiento',
      lastUpdated: new Date('2026-03-02'),
      author: 'Equipo CDSS',
      difficulty: 'advanced',
      estimatedTime: 20
    },
    {
      id: 'doc-5',
      title: 'Interfaz Optimizada para Tablet',
      category: 'features',
      content: 'Características de la interfaz tablet:\n- Botones táctiles de 44x44px\n- Gestos de navegación\n- Acciones rápidas\n- Vista optimizada de consulta\n- Dashboard médico',
      lastUpdated: new Date('2026-03-02'),
      author: 'Equipo UX',
      difficulty: 'intermediate',
      estimatedTime: 10
    }
  ]);

  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([
    {
      id: 'module-1',
      title: 'Módulo Básico: Consulta Médica',
      description: 'Aprenda a realizar una consulta médica completa usando el sistema',
      sections: ['doc-1', 'doc-2'],
      duration: 15,
      completed: true
    },
    {
      id: 'module-2',
      title: 'Módulo Intermedio: Prescripción Médica',
      description: 'Domine el sistema de prescripción inteligente y verificación de interacciones',
      sections: ['doc-3'],
      duration: 20,
      completed: false
    },
    {
      id: 'module-3',
      title: 'Módulo Avanzado: CDSS',
      description: 'Utilice el sistema de soporte a decisiones clínicas para diagnósticos complejos',
      sections: ['doc-4'],
      duration: 25,
      completed: false
    },
    {
      id: 'module-4',
      title: 'Módulo Tablet: Interfaz Táctil',
      description: 'Optimice su flujo de trabajo usando la interfaz tablet',
      sections: ['doc-5'],
      duration: 15,
      completed: false
    }
  ]);

  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSections: ['doc-1', 'doc-2'],
    completedModules: ['module-1'],
    quizScores: {},
    totalTimeSpent: 15
  });

  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(sections[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mark section as completed
  const markSectionCompleted = (sectionId: string) => {
    if (!userProgress.completedSections.includes(sectionId)) {
      setUserProgress({
        ...userProgress,
        completedSections: [...userProgress.completedSections, sectionId],
        totalTimeSpent: userProgress.totalTimeSpent + (sections.find(s => s.id === sectionId)?.estimatedTime || 0)
      });
    }
  };

  // Mark module as completed
  const markModuleCompleted = (moduleId: string) => {
    if (!userProgress.completedModules.includes(moduleId)) {
      const module = trainingModules.find(m => m.id === moduleId);
      if (module) {
        // Mark all module sections as completed
        const newCompletedSections = [...userProgress.completedSections];
        module.sections.forEach(sectionId => {
          if (!newCompletedSections.includes(sectionId)) {
            newCompletedSections.push(sectionId);
          }
        });

        setUserProgress({
          ...userProgress,
          completedModules: [...userProgress.completedModules, moduleId],
          completedSections: newCompletedSections,
          totalTimeSpent: userProgress.totalTimeSpent + module.duration
        });

        // Update module completion status
        setTrainingModules(trainingModules.map(m => 
          m.id === moduleId ? { ...m, completed: true } : m
        ));
      }
    }
  };

  // Filter sections by search query
  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting-started': return 'bg-blue-100 text-blue-800';
      case 'workflow': return 'bg-green-100 text-green-800';
      case 'features': return 'bg-purple-100 text-purple-800';
      case 'troubleshooting': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSections = sections.length;
    const completedSections = userProgress.completedSections.length;
    return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Documentación y Capacitación</h1>
              <p className="text-gray-600 mt-2">Guías, tutoriales y materiales de entrenamiento para el módulo médico</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700">{calculateProgress()}%</div>
              <div className="text-sm text-gray-600">Progreso Total</div>
            </div>
          </div>

          {/* Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-700">
                {userProgress.completedSections.length}/{sections.length}
              </div>
              <div className="text-sm text-gray-600">Secciones Completadas</div>
              <div className="text-xs text-gray-500 mt-1">Documentación</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-700">
                {userProgress.completedModules.length}/{trainingModules.length}
              </div>
              <div className="text-sm text-gray-600">Módulos Completados</div>
              <div className="text-xs text-gray-500 mt-1">Capacitación</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-700">
                {userProgress.totalTimeSpent} min
              </div>
              <div className="text-sm text-gray-600">Tiempo Total</div>
              <div className="text-xs text-gray-500 mt-1">Dedicado a aprendizaje</div>
            </div>
          </div>

          {/* Search and filter */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar en documentación..."
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredSections.length} resultados
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Documentation sections */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Documentación</h2>
              
              <div className="space-y-4">
                {filteredSections.map((section) => (
                  <div 
                    key={section.id}
                    className={`bg-white border rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedSection?.id === section.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{section.title}</h3>
                        <p className="text-sm text-gray-600">
                          Por {section.author} • {section.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                          {section.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                          {section.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{section.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        ⏱️ {section.estimatedTime} min • 📖 {section.id}
                      </div>
                      <div className="flex items-center space-x-2">
                        {userProgress.completedSections.includes(section.id) ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            ✅ Completado
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markSectionCompleted(section.id);
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                          >
                            Marcar como Completado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column: Training modules and progress */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Módulos de Capacitación</h2>
              
              <div className="space-y-4 mb-8">
                {trainingModules.map((module) => (
                  <div key={module.id} className="bg-white border rounded-xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      {module.completed && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          ✅
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>
                          {module.sections.filter(s => userProgress.completedSections.includes(s)).length}/{module.sections.length} secciones
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ 
                            width: `${(module.sections.filter(s => userProgress.completedSections.includes(s)).length / module.sections.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      ⏱️ {module.duration} min • 📚 {module.sections.length} secciones
                    </div>
                    
                    {!module.completed && (
                      <button
                        onClick={() => markModuleCompleted(module.id)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Completar Módulo
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Quick start guide */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Guía Rápida de Inicio</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Completar módulo básico de consulta médica</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Practicar con pacientes de prueba</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Explorar sistema de prescripción</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <span>Utilizar CDSS para casos complejos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">5.</span>
                    <span>Optimizar flujo con interfaz tablet</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Export progress */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Progreso de Aprendizaje</h3>
                <p className="text-sm text-gray-600">Exporte su progreso o reinicie el entrenamiento</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const data = {
                      progress: userProgress,
                      sections: sections.filter(s => userProgress.completedSections.includes(s.id)),
                      modules: trainingModules.filter(m => userProgress.completedModules.includes(m.id)),
                      exportDate: new Date().toISOString()
                    };
                    
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Exportar Progreso
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('¿Está seguro de reiniciar todo su progreso?')) {
                      setUserProgress({
                        completedSections: [],
                        completedModules: [],
                        quizScores: {},
                        totalTimeSpent: 0
                      });
                      setTrainingModules(trainingModules.map(m => ({ ...m, completed: false })));
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Reiniciar Progreso
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDocumentationSystem;