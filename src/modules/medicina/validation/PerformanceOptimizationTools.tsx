import React, { useState, useEffect } from 'react';

// Types for performance metrics
export interface PerformanceMetric {
  id: string;
  name: string;
  category: 'load-time' | 'render-time' | 'memory' | 'network' | 'database';
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  timestamp: Date;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface PerformanceIssue {
  id: string;
  metricId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  recommendation: string;
  estimatedImpact: string;
  status: 'identified' | 'investigating' | 'fixing' | 'resolved';
  detectedAt: Date;
  resolvedAt?: Date;
}

export interface PerformanceReport {
  id: string;
  timestamp: Date;
  overallScore: number;
  metrics: PerformanceMetric[];
  issues: PerformanceIssue[];
  recommendations: string[];
}

const PerformanceOptimizationTools: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleMetrics: PerformanceMetric[] = [
      {
        id: 'metric-1',
        name: 'Tiempo de carga inicial',
        category: 'load-time',
        value: 2.3,
        unit: 's',
        threshold: 3,
        status: 'good',
        timestamp: new Date(),
        trend: 'stable'
      },
      {
        id: 'metric-2',
        name: 'Render de consulta médica',
        category: 'render-time',
        value: 450,
        unit: 'ms',
        threshold: 500,
        status: 'good',
        timestamp: new Date(),
        trend: 'improving'
      },
      {
        id: 'metric-3',
        name: 'Uso de memoria',
        category: 'memory',
        value: 85,
        unit: 'MB',
        threshold: 100,
        status: 'warning',
        timestamp: new Date(),
        trend: 'degrading'
      },
      {
        id: 'metric-4',
        name: 'Latencia de base de datos',
        category: 'database',
        value: 120,
        unit: 'ms',
        threshold: 100,
        status: 'critical',
        timestamp: new Date(),
        trend: 'degrading'
      },
      {
        id: 'metric-5',
        name: 'Tamaño de bundle',
        category: 'load-time',
        value: 1.8,
        unit: 'MB',
        threshold: 2,
        status: 'good',
        timestamp: new Date(),
        trend: 'stable'
      }
    ];

    const sampleIssues: PerformanceIssue[] = [
      {
        id: 'issue-1',
        metricId: 'metric-4',
        title: 'Alta latencia en consultas de historial médico',
        description: 'Las consultas al historial médico completo toman más de 100ms en promedio',
        severity: 'high',
        component: 'MedicalHistory.tsx',
        recommendation: 'Implementar paginación y lazy loading para historiales extensos',
        estimatedImpact: 'Reducción del 60% en tiempo de carga',
        status: 'investigating',
        detectedAt: new Date('2026-03-01T09:00:00')
      },
      {
        id: 'issue-2',
        metricId: 'metric-3',
        title: 'Aumento progresivo de uso de memoria',
        description: 'El uso de memoria aumenta con el tiempo de uso de la aplicación',
        severity: 'medium',
        component: 'MedicalDashboard.tsx',
        recommendation: 'Revisar y limpiar event listeners y suscripciones no utilizadas',
        estimatedImpact: 'Reducción del 30% en uso de memoria',
        status: 'identified',
        detectedAt: new Date('2026-02-28T14:30:00')
      },
      {
        id: 'issue-3',
        metricId: 'metric-2',
        title: 'Render lento en vista de tablet optimizada',
        description: 'La vista optimizada para tablet tiene múltiples re-renders innecesarios',
        severity: 'medium',
        component: 'OptimizedConsultationView.tsx',
        recommendation: 'Implementar memoización y useCallback para handlers',
        estimatedImpact: 'Mejora del 40% en tiempo de render',
        status: 'fixing',
        detectedAt: new Date('2026-02-27T11:15:00')
      }
    ];

    const sampleReports: PerformanceReport[] = [
      {
        id: 'report-1',
        timestamp: new Date('2026-03-02T10:00:00'),
        overallScore: 78,
        metrics: sampleMetrics,
        issues: sampleIssues,
        recommendations: [
          'Implementar paginación en historial médico',
          'Optimizar consultas a base de datos',
          'Reducir tamaño de bundle con code splitting'
        ]
      }
    ];

    setMetrics(sampleMetrics);
    setIssues(sampleIssues);
    setReports(sampleReports);
  }, []);

  // Start/stop performance monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Simulate collecting new metrics
      setTimeout(() => {
        const newMetrics = metrics.map(metric => ({
          ...metric,
          value: metric.value * (0.9 + Math.random() * 0.2), // Random variation
          timestamp: new Date(),
          trend: (Math.random() > 0.5 ? 'improving' : 'degrading') as 'improving' | 'degrading'
        }));
        setMetrics(newMetrics);
      }, 1000);
    }
  };

  // Generate performance report
  const generateReport = () => {
    const overallScore = Math.floor(
      metrics.reduce((sum, metric) => {
        const score = metric.status === 'good' ? 100 : metric.status === 'warning' ? 70 : 40;
        return sum + score;
      }, 0) / metrics.length
    );

    const newReport: PerformanceReport = {
      id: `report-${Date.now()}`,
      timestamp: new Date(),
      overallScore,
      metrics: [...metrics],
      issues: [...issues],
      recommendations: [
        'Monitorizar métricas críticas continuamente',
        'Priorizar issues de alta severidad',
        'Realizar pruebas de carga periódicas'
      ]
    };

    setReports([newReport, ...reports]);
    alert(`Reporte generado: Score ${overallScore}/100`);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'degrading': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Herramientas de Optimización de Rendimiento</h1>
              <p className="text-gray-600 mt-2">Monitoree y optimice el rendimiento del módulo médico</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleMonitoring}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isMonitoring 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isMonitoring ? '⏸️ Detener Monitoreo' : '▶️ Iniciar Monitoreo'}
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                📊 Generar Reporte
              </button>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-700">
                {metrics.filter(m => m.status === 'good').length}/{metrics.length}
              </div>
              <div className="text-sm text-gray-600">Métricas Óptimas</div>
              <div className="text-xs text-gray-500 mt-1">Estado actual</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-orange-700">
                {issues.filter(i => i.severity === 'critical' || i.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Issues Críticos</div>
              <div className="text-xs text-gray-500 mt-1">Alta prioridad</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-700">
                {reports.length > 0 ? reports[0].overallScore : 0}/100
              </div>
              <div className="text-sm text-gray-600">Score General</div>
              <div className="text-xs text-gray-500 mt-1">Último reporte</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-700">
                {isMonitoring ? 'Activo' : 'Inactivo'}
              </div>
              <div className="text-sm text-gray-600">Monitoreo</div>
              <div className="text-xs text-gray-500 mt-1">Estado actual</div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: Performance metrics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas de Rendimiento</h2>
              
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div 
                    key={metric.id}
                    className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedMetric?.id === metric.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">{metric.name}</h3>
                        <p className="text-sm text-gray-600">{metric.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                        <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {metric.value} {metric.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        Límite: {metric.threshold} {metric.unit}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'good' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (metric.value / metric.threshold) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column: Performance issues and recommendations */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Issues y Recomendaciones</h2>
              
              <div className="space-y-4 mb-8">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-white border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{issue.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Componente:</span> {issue.component}
                      </div>
                      <div>
                        <span className="font-medium">Estado:</span> {issue.status}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <h4 className="font-medium text-blue-800 mb-1">Recomendación:</h4>
                      <p className="text-sm text-blue-700">{issue.recommendation}</p>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Impacto estimado:</span> {issue.estimatedImpact}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Optimization recommendations */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones de Optimización</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Implementar lazy loading para componentes pesados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Usar memoización para componentes que se re-renderizan frecuentemente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Optimizar consultas a base de datos con índices apropiados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Reducir tamaño de bundle con code splitting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">Implementar paginación para listas largas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent reports */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reportes Recientes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">Reporte de Rendimiento</h3>
                      <p className="text-sm text-gray-600">
                        {report.timestamp.toLocaleDateString()} {report.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {report.overallScore}/100
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                        style={{ width: `${report.overallScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Métricas:</span> {report.metrics.length}
                    </div>
                    <div>
                      <span className="font-medium">Issues:</span> {report.issues.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationTools;
