import React, { useState, useEffect } from 'react';

// Types for feedback collection
export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userRole: 'doctor' | 'nurse' | 'medical-student' | 'administrative' | 'patient';
  category: 'usability' | 'functionality' | 'performance' | 'design' | 'content' | 'bug' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  context: string;
  expectedBehavior: string;
  actualBehavior: string;
  timestamp: Date;
  status: 'new' | 'reviewed' | 'in-progress' | 'resolved' | 'wont-fix';
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: Date;
  impactScore: number;
  satisfactionScore?: number;
}

export interface FeedbackStats {
  totalFeedback: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  averageImpact: number;
  averageSatisfaction: number;
  unresolvedCount: number;
  criticalCount: number;
}

const FeedbackCollectionSystem: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [newFeedback, setNewFeedback] = useState<Partial<FeedbackItem>>({
    category: 'usability',
    priority: 'medium',
    impactScore: 5
  });
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedback: 0,
    byCategory: {},
    byPriority: {},
    byStatus: {},
    averageImpact: 0,
    averageSatisfaction: 0,
    unresolvedCount: 0,
    criticalCount: 0
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleFeedback: FeedbackItem[] = [
      {
        id: 'fb-1',
        userId: 'user-1',
        userName: 'Dr. Ana García',
        userRole: 'doctor',
        category: 'usability',
        priority: 'high',
        title: 'Dificultad para encontrar función de prescripción',
        description: 'El botón para prescribir medicamentos no es suficientemente visible',
        context: 'Intentando prescribir medicamentos durante una consulta',
        expectedBehavior: 'Botón de prescripción claramente visible',
        actualBehavior: 'Tuve que buscar en varios menús',
        timestamp: new Date('2026-03-01T10:30:00'),
        status: 'in-progress',
        assignedTo: 'Equipo UX',
        impactScore: 8,
        satisfactionScore: 2
      },
      {
        id: 'fb-2',
        userId: 'user-2',
        userName: 'Enf. Carlos López',
        userRole: 'nurse',
        category: 'functionality',
        priority: 'medium',
        title: 'Falta validación en campos de signos vitales',
        description: 'Permite ingresar valores imposibles para signos vitales',
        context: 'Registrando signos vitales de paciente',
        expectedBehavior: 'Validación de rangos razonables',
        actualBehavior: 'Puedo ingresar cualquier valor',
        timestamp: new Date('2026-03-01T14:15:00'),
        status: 'reviewed',
        impactScore: 6,
        satisfactionScore: 3
      },
      {
        id: 'fb-3',
        userId: 'user-3',
        userName: 'Dr. Miguel Torres',
        userRole: 'doctor',
        category: 'performance',
        priority: 'low',
        title: 'Lentitud al cargar historial médico extenso',
        description: 'Cuando un paciente tiene mucho historial, la carga tarda',
        context: 'Consultando historial de paciente',
        expectedBehavior: 'Carga rápida',
        actualBehavior: 'Tarda 5-7 segundos',
        timestamp: new Date('2026-02-28T09:45:00'),
        status: 'new',
        impactScore: 4,
        satisfactionScore: 4
      }
    ];

    setFeedbackItems(sampleFeedback);
    calculateStats(sampleFeedback);
  }, []);

  // Calculate statistics
  const calculateStats = (items: FeedbackItem[]) => {
    const newStats: FeedbackStats = {
      totalFeedback: items.length,
      byCategory: {},
      byPriority: {},
      byStatus: {},
      averageImpact: 0,
      averageSatisfaction: 0,
      unresolvedCount: 0,
      criticalCount: 0
    };

    let totalImpact = 0;
    let totalSatisfaction = 0;
    let satisfactionCount = 0;

    items.forEach(item => {
      newStats.byCategory[item.category] = (newStats.byCategory[item.category] || 0) + 1;
      newStats.byPriority[item.priority] = (newStats.byPriority[item.priority] || 0) + 1;
      newStats.byStatus[item.status] = (newStats.byStatus[item.status] || 0) + 1;
      
      totalImpact += item.impactScore;
      
      if (item.satisfactionScore) {
        totalSatisfaction += item.satisfactionScore;
        satisfactionCount++;
      }
      
      if (item.status !== 'resolved' && item.status !== 'wont-fix') {
        newStats.unresolvedCount++;
      }
      
      if (item.priority === 'critical') {
        newStats.criticalCount++;
      }
    });

    newStats.averageImpact = items.length > 0 ? totalImpact / items.length : 0;
    newStats.averageSatisfaction = satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0;

    setStats(newStats);
  };

  // Submit new feedback
  const submitFeedback = () => {
    if (!newFeedback.title || !newFeedback.description) {
      alert('Por favor complete título y descripción');
      return;
    }

    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      userId: 'current-user',
      userName: newFeedback.userName || 'Usuario Anónimo',
      userRole: newFeedback.userRole || 'doctor',
      category: newFeedback.category || 'usability',
      priority: newFeedback.priority || 'medium',
      title: newFeedback.title!,
      description: newFeedback.description!,
      context: newFeedback.context || 'No especificado',
      expectedBehavior: newFeedback.expectedBehavior || 'No especificado',
      actualBehavior: newFeedback.actualBehavior || 'No especificado',
      timestamp: new Date(),
      status: 'new',
      impactScore: newFeedback.impactScore || 5,
      satisfactionScore: newFeedback.satisfactionScore
    };

    const updatedItems = [...feedbackItems, newItem];
    setFeedbackItems(updatedItems);
    calculateStats(updatedItems);
    
    setNewFeedback({
      category: 'usability',
      priority: 'medium',
      impactScore: 5
    });
    
    alert('¡Feedback enviado exitosamente!');
  };

  // Update feedback status
  const updateFeedbackStatus = (id: string, status: FeedbackItem['status']) => {
    const updatedItems = feedbackItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          resolutionDate: status === 'resolved' ? new Date() : item.resolutionDate
        };
      }
      return item;
    });

    setFeedbackItems(updatedItems);
    calculateStats(updatedItems);
  };

  // Export feedback data
  const exportFeedback = () => {
    const data = {
      feedback: feedbackItems,
      stats,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'wont-fix': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sistema de Recolección de Feedback</h1>
              <p className="text-gray-600 mt-2">Recolecte y gestione feedback de usuarios</p>
            </div>
            <button
              onClick={exportFeedback}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Exportar Datos
            </button>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-700">{stats.totalFeedback}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-orange-700">{stats.criticalCount}</div>
              <div className="text-sm text-gray-600">Críticos</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-700">{stats.averageImpact.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Impacto Promedio</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-700">
                {stats.averageSatisfaction > 0 ? stats.averageSatisfaction.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: New feedback form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Enviar Nuevo Feedback</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre (opcional)
                    </label>
                    <input
                      type="text"
                      value={newFeedback.userName || ''}
                      onChange={(e) => setNewFeedback({...newFeedback, userName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Su nombre"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={newFeedback.userRole || 'doctor'}
                        onChange={(e) => setNewFeedback({...newFeedback, userRole: e.target.value as any})}
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
                        Categoría
                      </label>
                      <select
                        value={newFeedback.category || 'usability'}
                        onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="usability">Usabilidad</option>
                        <option value="functionality">Funcionalidad</option>
                        <option value="performance">Rendimiento</option>
                        <option value="design">Diseño</option>
                        <option value="bug">Error</option>
                        <option value="suggestion">Sugerencia</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridad
                      </label>
                      <select
                        value={newFeedback.priority || 'medium'}
                        onChange={(e) => setNewFeedback({...newFeedback, priority: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Impacto (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newFeedback.impactScore || 5}
                        onChange={(e) => setNewFeedback({...newFeedback, impactScore: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={newFeedback.title || ''}
                      onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Resumen del problema o sugerencia"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={newFeedback.description || ''}
                      onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
                      placeholder="Describa el problema o sugerencia en detalle..."
                    />
                  </div>
                  
                  <button
                    onClick={submitFeedback}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Enviar Feedback
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column: Feedback list */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Recibido</h2>
              
              <div className="space-y-4">
                {feedbackItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          Por {item.userName} ({item.userRole}) • {item.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Categoría:</span> {item.category}
                      </div>
                      <div>
                        <span className="font-medium">Impacto:</span> {item.impactScore}/10
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {item.context && `Contexto: ${item.context}`}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'in-progress')}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
                        >
                          En Progreso
                        </button>
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'resolved')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                        >
                          Resolver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollectionSystem;