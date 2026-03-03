import React, { useState, useEffect, useRef } from 'react';

// Types for user testing
export interface TestTask {
  id: string;
  title: string;
  description: string;
  category: 'workflow' | 'interface' | 'documentation' | 'decision-support';
  expectedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  successCriteria: string[];
}

export interface TestParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'medical-student' | 'administrative';
  experience: 'novice' | 'intermediate' | 'expert';
  startTime: Date;
  endTime?: Date;
  completedTasks: string[];
  taskTimes: Record<string, number>;
  feedback: string[];
  issues: TestIssue[];
}

export interface TestIssue {
  id: string;
  taskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export interface TestSession {
  id: string;
  participant: TestParticipant;
  tasks: TestTask[];
  startTime: Date;
  endTime?: Date;
  status: 'not-started' | 'in-progress' | 'paused' | 'completed';
  metrics: TestMetrics;
}

export interface TestMetrics {
  totalTasks: number;
  completedTasks: number;
  averageTimePerTask: number;
  successRate: number;
  issuesCount: number;
  criticalIssues: number;
}

// Predefined test tasks
const MEDICAL_TEST_TASKS: TestTask[] = [
  {
    id: 'task-1',
    title: 'Crear nueva consulta médica',
    description: 'Iniciar una nueva consulta para un paciente existente',
    category: 'workflow',
    expectedTime: 2,
    difficulty: 'easy',
    steps: ['Navegar a pacientes', 'Seleccionar paciente', 'Crear consulta'],
    successCriteria: ['Consulta creada', 'Redirección correcta']
  },
  {
    id: 'task-2',
    title: 'Registrar signos vitales',
    description: 'Ingresar signos vitales del paciente',
    category: 'interface',
    expectedTime: 3,
    difficulty: 'easy',
    steps: ['Ir a signos vitales', 'Ingresar datos', 'Guardar'],
    successCriteria: ['Datos guardados', 'Valores mostrados']
  },
  {
    id: 'task-3',
    title: 'Generar nota SOAP',
    description: 'Completar una nota SOAP completa',
    category: 'documentation',
    expectedTime: 5,
    difficulty: 'medium',
    steps: ['Completar SOAP', 'Generar PDF'],
    successCriteria: ['SOAP completado', 'PDF generado']
  },
  {
    id: 'task-4',
    title: 'Prescribir medicamentos',
    description: 'Usar sistema de prescripción inteligente',
    category: 'decision-support',
    expectedTime: 4,
    difficulty: 'medium',
    steps: ['Acceder prescripción', 'Verificar interacciones', 'Generar receta'],
    successCriteria: ['Interacciones detectadas', 'Receta generada']
  }
];

const UserTestingFramework: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [selectedTask, setSelectedTask] = useState<TestTask | null>(null);
  const [taskTimer, setTaskTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [testResults, setTestResults] = useState<TestSession[]>([]);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    role: 'doctor' as const,
    experience: 'intermediate' as const
  });
  
  const timerRef = useRef<number | null>(null);

  // Start new session
  const startNewSession = () => {
    if (!newParticipant.name.trim()) {
      alert('Ingrese nombre del participante');
      return;
    }

    const participant: TestParticipant = {
      id: `participant-${Date.now()}`,
      name: newParticipant.name,
      role: newParticipant.role,
      experience: newParticipant.experience,
      startTime: new Date(),
      completedTasks: [],
      taskTimes: {},
      feedback: [],
      issues: []
    };

    const session: TestSession = {
      id: `session-${Date.now()}`,
      participant,
      tasks: MEDICAL_TEST_TASKS,
      startTime: new Date(),
      status: 'in-progress',
      metrics: {
        totalTasks: MEDICAL_TEST_TASKS.length,
        completedTasks: 0,
        averageTimePerTask: 0,
        successRate: 0,
        issuesCount: 0,
        criticalIssues: 0
      }
    };

    setCurrentSession(session);
    setSelectedTask(MEDICAL_TEST_TASKS[0]);
    setTaskTimer(0);
    setIsTimerRunning(true);
  };

  // Timer management
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTaskTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Complete current task
  const completeCurrentTask = () => {
    if (!currentSession || !selectedTask) return;

    const updatedParticipant = {
      ...currentSession.participant,
      completedTasks: [...currentSession.participant.completedTasks, selectedTask.id],
      taskTimes: {
        ...currentSession.participant.taskTimes,
        [selectedTask.id]: taskTimer
      }
    };

    const nextTaskIndex = MEDICAL_TEST_TASKS.findIndex(task => task.id === selectedTask.id) + 1;
    const nextTask = nextTaskIndex < MEDICAL_TEST_TASKS.length ? MEDICAL_TEST_TASKS[nextTaskIndex] : null;

    const updatedSession: TestSession = {
      ...currentSession,
      participant: updatedParticipant,
      metrics: {
        ...currentSession.metrics,
        completedTasks: updatedParticipant.completedTasks.length,
        averageTimePerTask: calculateAverageTime(updatedParticipant.taskTimes)
      }
    };

    setCurrentSession(updatedSession);
    setSelectedTask(nextTask);
    setTaskTimer(0);

    if (!nextTask) {
      endSession();
    }
  };

  // Report issue
  const reportIssue = (severity: TestIssue['severity'], description: string) => {
    if (!currentSession || !selectedTask) return;

    const newIssue: TestIssue = {
      id: `issue-${Date.now()}`,
      taskId: selectedTask.id,
      severity,
      description,
      timestamp: new Date(),
      resolved: false
    };

    const updatedParticipant = {
      ...currentSession.participant,
      issues: [...currentSession.participant.issues, newIssue]
    };

    const updatedSession: TestSession = {
      ...currentSession,
      participant: updatedParticipant,
      metrics: {
        ...currentSession.metrics,
        issuesCount: updatedParticipant.issues.length,
        criticalIssues: updatedParticipant.issues.filter(issue => issue.severity === 'critical').length
      }
    };

    setCurrentSession(updatedSession);
  };

  // Add feedback
  const addFeedback = () => {
    if (!currentSession || !feedbackText.trim()) return;

    const updatedParticipant = {
      ...currentSession.participant,
      feedback: [...currentSession.participant.feedback, feedbackText]
    };

    setCurrentSession({
      ...currentSession,
      participant: updatedParticipant
    });

    setFeedbackText('');
  };

  // End session
  const endSession = () => {
    if (!currentSession) return;

    const completedSession: TestSession = {
      ...currentSession,
      endTime: new Date(),
      status: 'completed',
      metrics: {
        ...currentSession.metrics,
        successRate: (currentSession.metrics.completedTasks / currentSession.metrics.totalTasks) * 100
      }
    };

    setTestResults([...testResults, completedSession]);
    setCurrentSession(null);
    setSelectedTask(null);
    setIsTimerRunning(false);
  };

  // Helper functions
  const calculateAverageTime = (taskTimes: Record<string, number>): number => {
    const times = Object.values(taskTimes);
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportResults = () => {
    const data = {
      sessions: testResults,
      summary: {
        totalSessions: testResults.length,
        averageCompletionRate: testResults.reduce((sum, session) => 
          sum + (session.metrics.completedTasks / session.metrics.totalTasks), 0) / testResults.length * 100
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render
  if (!currentSession) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Framework de Pruebas de Usuario</h1>
            <p className="text-gray-600 mb-6">Valide el módulo médico con usuarios reales</p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Iniciar Nueva Sesión</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Participante
                  </label>
                  <input
                    type="text"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Dr. Juan Pérez"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <select
                      value={newParticipant.role}
                      onChange={(e) => setNewParticipant({...newParticipant, role: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="doctor">Médico</option>
                      <option value="nurse">Enfermero/a</option>
                      <option value="medical-student">Estudiante</option>
                      <option value="administrative">Administrativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiencia
                    </label>
                    <select
                      value={newParticipant.experience}
                      onChange={(e) => setNewParticipant({...newParticipant, experience: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="novice">Novato</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="expert">Experto</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={startNewSession}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Iniciar Sesión de Pruebas
                </button>
              </div>
            </div>
            
            {testResults.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Resultados Anteriores</h2>
                  <button
                    onClick={exportResults}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Exportar Resultados
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testResults.map((session, index) => (
                    <div key={session.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">Sesión {index + 1}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {session.participant.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{session.participant.name}</p>
                      <div className="text-sm text-gray-700">
                        <div>✅ {session.metrics.completedTasks}/{session.metrics.totalTasks} tareas</div>
                        <div>⏱️ Tiempo promedio: {formatTime(session.metrics.averageTimePerTask)}</div>
                        <div>📊 Éxito: {session.metrics.successRate.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active session view
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sesión de Pruebas en Curso</h1>
              <p className="text-gray-600">
                Participante: {currentSession.participant.name} ({currentSession.participant.role})
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                Tiempo: {formatTime(taskTimer)}
              </div>
              <div className="text-sm text-gray-600">
                Tarea {MEDICAL_TEST_TASKS.findIndex(t => t.id === selectedTask?.id) + 1} de {MEDICAL_TEST_TASKS.length}
              </div>
            </div>
          </div>
          
          {selectedTask && (
            <div className="mb-8">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{selectedTask.title}</h2>
                <p className="text-gray-700 mb-4">{selectedTask.description}</p>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Pasos:</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {selectedTask.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Criterios de éxito:</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {selectedTask.successCriteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={completeCurrentTask}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Completar Tarea
                </button>
                
                <button
                  onClick={() => reportIssue('medium', 'Problema encontrado en esta tarea')}
                  className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Reportar Problema
                </button>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Feedback</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Escriba su feedback aquí..."
              />
              <button
                onClick={addFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {isTimerRunning ? 'Pausar' : 'Reanudar'}
            </button>
            <button
              onClick={endSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Finalizar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTestingFramework;