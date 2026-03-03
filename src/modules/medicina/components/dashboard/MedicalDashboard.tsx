import React, { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { MedicalTouchButton } from '../tablet/MedicalTouchButton';
import { MedicalQuickActions } from '../tablet/MedicalQuickActions';

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  icon?: string;
}

export interface ClinicalAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  timestamp: Date;
  acknowledged: boolean;
  source: 'cdss' | 'system' | 'manual';
  actionRequired?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface PatientStatus {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  appointmentTime?: string;
  doctor?: string;
  room?: string;
  photo?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  minWidth?: number;
  removable?: boolean;
  movable?: boolean;
  configurable?: boolean;
}

export interface MedicalDashboardProps {
  /** Métricas del dashboard */
  metrics?: DashboardMetric[];
  /** Alertas clínicas */
  alerts?: ClinicalAlert[];
  /** Estado de pacientes */
  patients?: PatientStatus[];
  /** Widgets personalizables */
  widgets?: DashboardWidget[];
  /** Fecha del dashboard */
  date?: Date;
  /** Médico actual */
  doctor?: string;
  /** Consultorio actual */
  room?: string;
  /** Modo tablet optimizado */
  tabletOptimized?: boolean;
  /** Mostrar modo claro/oscuro */
  darkMode?: boolean;
  /** Habilitar personalización */
  customizable?: boolean;
  /** Función llamada al actualizar dashboard */
  onRefresh?: () => void;
  /** Función llamada al cambiar layout */
  onLayoutChange?: (widgets: DashboardWidget[]) => void;
  /** Función llamada al acusar recibo de alerta */
  onAcknowledgeAlert?: (alertId: string) => void;
  /** Función llamada al seleccionar paciente */
  onPatientSelect?: (patientId: string) => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilo inline adicional */
  style?: React.CSSProperties;
}

/**
 * Dashboard médico principal con integración CDSS
 * 
 * Características:
 * - Vista consolidada del día para médicos
 * - Integración con alertas CDSS en tiempo real
 * - Widgets configurables y personalizables
 * - Optimizado para tablet y desktop
 * - Modos claro/oscuro para consultorio
 */
// Métricas por defecto
const defaultMetricsArray: DashboardMetric[] = [
  {
    id: 'consultations-today',
    label: 'Consultas Hoy',
    value: 12,
    change: 5,
    trend: 'up',
    icon: '🩺',
    color: 'blue'
  },
  {
    id: 'pending-tasks',
    label: 'Tareas Pendientes',
    value: 8,
    change: -2,
    trend: 'down',
    icon: '📋',
    color: 'orange'
  },
  {
    id: 'critical-alerts',
    label: 'Alertas Críticas',
    value: 3,
    change: 1,
    trend: 'up',
    icon: '🚨',
    color: 'red'
  },
  {
    id: 'patient-satisfaction',
    label: 'Satisfacción',
    value: '94%',
    change: 2,
    trend: 'up',
    icon: '⭐',
    color: 'green'
  }
];

// Widgets por defecto
const defaultWidgetsArray: DashboardWidget[] = [
  {
    id: 'quick-actions',
    title: 'Acciones Rápidas',
    component: <div>Widget de acciones rápidas</div>,
    colSpan: 1,
    removable: false,
    movable: true
  },
  {
    id: 'today-appointments',
    title: 'Citas de Hoy',
    component: <div>Widget de citas</div>,
    colSpan: 2,
    removable: true,
    movable: true
  },
  {
    id: 'cdss-alerts',
    title: 'Alertas CDSS',
    component: <div>Widget de alertas CDSS</div>,
    colSpan: 1,
    removable: false,
    movable: true
  },
  {
    id: 'clinical-metrics',
    title: 'Métricas Clínicas',
    component: <div>Widget de métricas</div>,
    colSpan: 1,
    removable: true,
    movable: true
  },
  {
    id: 'patient-status',
    title: 'Estado de Pacientes',
    component: <div>Widget de pacientes</div>,
    colSpan: 2,
    removable: true,
    movable: true
  }
];

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({
  metrics = defaultMetricsArray,
  alerts = [],
  patients = [],
  widgets = defaultWidgetsArray,
  date = new Date(),
  doctor = 'Dr. Médico',
  room = 'Consultorio 1',
  tabletOptimized = true,
  darkMode = false,
  customizable = false,
  onRefresh,
  onLayoutChange,
  onAcknowledgeAlert,
  onPatientSelect,
  className = '',
  style = {}
}) => {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets);
  const [localAlerts, setLocalAlerts] = useState<ClinicalAlert[]>(alerts);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'alerts' | 'patients' | 'metrics'>('overview');
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  // Actualizar alertas no leídas
  useEffect(() => {
    const unread = localAlerts.filter(alert => !alert.acknowledged).length;
    setUnreadAlerts(unread);
  }, [localAlerts]);

  // Manejar acuse de recibo de alerta
  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setLocalAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    
    onAcknowledgeAlert?.(alertId);
  }, [onAcknowledgeAlert]);

  // Manejar acción de alerta
  const handleAlertAction = useCallback((alert: ClinicalAlert) => {
    if (alert.onAction) {
      alert.onAction();
    }
    
    if (alert.actionRequired) {
      handleAcknowledgeAlert(alert.id);
    }
  }, [handleAcknowledgeAlert]);

  // Manejar inicio de arrastre de widget
  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    if (!customizable) return;
    
    e.dataTransfer.setData('text/plain', widgetId);
    setIsDragging(widgetId);
    e.currentTarget.classList.add('dragging');
  };

  // Manejar soltar widget
  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    if (!customizable) return;
    
    e.preventDefault();
    const draggedWidgetId = e.dataTransfer.getData('text/plain');
    
    if (draggedWidgetId && draggedWidgetId !== targetWidgetId) {
      const draggedIndex = localWidgets.findIndex(w => w.id === draggedWidgetId);
      const targetIndex = localWidgets.findIndex(w => w.id === targetWidgetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newWidgets = [...localWidgets];
        const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(targetIndex, 0, draggedWidget);
        
        setLocalWidgets(newWidgets);
        onLayoutChange?.(newWidgets);
      }
    }
    
    setDragOver(null);
  };

  // Renderizar métricas
  const renderMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {metrics.map(metric => (
        <div
          key={metric.id}
          className={clsx(
            'bg-white rounded-xl p-4 shadow-sm',
            'border-l-4',
            {
              'border-blue-500': !metric.color,
              'border-green-500': metric.trend === 'up',
              'border-red-500': metric.trend === 'down',
              'border-gray-500': metric.trend === 'stable'
            }
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{metric.label}</span>
            {metric.icon && <span className="text-xl">{metric.icon}</span>}
          </div>
          
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">{metric.value}</span>
            {metric.unit && (
              <span className="ml-1 text-sm text-gray-500">{metric.unit}</span>
            )}
            
            {metric.change !== undefined && (
              <span className={clsx(
                'ml-2 text-sm font-medium',
                {
                  'text-green-600': metric.change > 0,
                  'text-red-600': metric.change < 0,
                  'text-gray-600': metric.change === 0
                }
              )}>
                {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '→'} {Math.abs(metric.change)}%
              </span>
            )}
          </div>
          
          {metric.trend && (
            <div className="mt-2 text-xs text-gray-500">
              Tendencia: {metric.trend === 'up' ? 'Alza' : metric.trend === 'down' ? 'Baja' : 'Estable'}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Renderizar alertas
  const renderAlerts = () => {
    const criticalAlerts = localAlerts.filter(a => a.type === 'critical' && !a.acknowledged);
    const warningAlerts = localAlerts.filter(a => a.type === 'warning' && !a.acknowledged);
    const infoAlerts = localAlerts.filter(a => a.type === 'info' && !a.acknowledged);
    
    return (
      <div className="space-y-4">
        {/* Alertas críticas */}
        {criticalAlerts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center">
              <span className="mr-2">🚨</span>
              Alertas Críticas ({criticalAlerts.length})
            </h3>
            
            <div className="space-y-2">
              {criticalAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-red-800">{alert.title}</div>
                      <div className="text-red-700 mt-1">{alert.message}</div>
                      
                      {alert.patientName && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Paciente:</span> {alert.patientName}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {alert.actionRequired && alert.actionLabel && (
                        <MedicalTouchButton
                          label={alert.actionLabel}
                          variant="alert"
                          size="small"
                          onPress={() => handleAlertAction(alert)}
                        />
                      )}
                      
                      <MedicalTouchButton
                        label="Entendido"
                        variant="secondary"
                        size="small"
                        onPress={() => handleAcknowledgeAlert(alert.id)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-red-600">
                    {alert.timestamp.toLocaleTimeString()} • {alert.source === 'cdss' ? 'CDSS' : 'Sistema'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Alertas de advertencia */}
        {warningAlerts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              Advertencias ({warningAlerts.length})
            </h3>
            
            <div className="space-y-2">
              {warningAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-yellow-800">{alert.title}</div>
                      <div className="text-yellow-700">{alert.message}</div>
                    </div>
                    
                    <MedicalTouchButton
                      label="OK"
                      variant="warning"
                      size="small"
                      onPress={() => handleAcknowledgeAlert(alert.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Alertas informativas */}
        {infoAlerts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
              <span className="mr-2">ℹ️</span>
              Informativas ({infoAlerts.length})
            </h3>
            
            <div className="space-y-2">
              {infoAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-blue-800">{alert.title}</div>
                      <div className="text-blue-700">{alert.message}</div>
                    </div>
                    
                    <MedicalTouchButton
                      label="Visto"
                      variant="neutral"
                      size="small"
                      onPress={() => handleAcknowledgeAlert(alert.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar estado de pacientes
  const renderPatients = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map(patient => (
        <div
          key={patient.id}
          className={clsx(
            'bg-white rounded-xl p-4 shadow-sm cursor-pointer',
            'transition-all duration-200 hover:shadow-md',
            'border-l-4',
            {
              'border-gray-300': patient.priority === 'low',
              'border-yellow-300': patient.priority === 'medium',
              'border-orange-300': patient.priority === 'high',
              'border-red-300': patient.priority === 'critical'
            }
          )}
          onClick={() => onPatientSelect?.(patient.id)}
        >
          <div className="flex items-center space-x-3">
            {/* Foto del paciente */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {patient.photo ? (
                  <img 
                    src={patient.photo} 
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              
              {/* Indicador de estado */}
              <div className={clsx(
                'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                {
                  'bg-gray-400': patient.status === 'waiting',
                  'bg-blue-500': patient.status === 'in-consultation',
                  'bg-green-500': patient.status === 'completed',
                  'bg-red-500': patient.status === 'cancelled'
                }
              )} />
            </div>
            
            {/* Información del paciente */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800">{patient.name}</h4>
                <span className={clsx(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  {
                    'bg-gray-100 text-gray-800': patient.priority === 'low',
                    'bg-yellow-100 text-yellow-800': patient.priority === 'medium',
                    'bg-orange-100 text-orange-800': patient.priority === 'high',
                    'bg-red-100 text-red-800': patient.priority === 'critical'
                  }
                )}>
                  {patient.priority === 'low' ? 'Baja' : 
                   patient.priority === 'medium' ? 'Media' : 
                   patient.priority === 'high' ? 'Alta' : 'Crítica'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {patient.age} años • {patient.gender}
              </div>
              
              {patient.appointmentTime && (
                <div className="text-sm text-gray-500 mt-1">
                  ⏰ {patient.appointmentTime}
                </div>
              )}
              
              {patient.doctor && (
                <div className="text-sm text-gray-500">
                  👨‍⚕️ {patient.doctor}
                </div>
              )}
            </div>
          </div>
          
          {/* Estado */}
          <div className="mt-3 flex items-center justify-between">
            <span className={clsx(
              'text-sm font-medium',
              {
                'text-gray-600': patient.status === 'waiting',
                'text-blue-600': patient.status === 'in-consultation',
                'text-green-600': patient.status === 'completed',
                'text-red-600': patient.status === 'cancelled'
              }
            )}>
              {patient.status === 'waiting' ? 'En espera' :
               patient.status === 'in-consultation' ? 'En consulta' :
               patient.status === 'completed' ? 'Completado' : 'Cancelado'}
            </span>
            
            {patient.room && (
              <span className="text-sm text-gray-500">
                🏥 {patient.room}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar widgets
  const renderWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localWidgets.map(widget => {
        const isBeingDragged = isDragging === widget.id;
        const isDragOver = dragOver === widget.id;
        
        return (
          <div
            key={widget.id}
            className={clsx(
              'bg-white rounded-xl shadow-sm p-4',
              'transition-all duration-200',
              {
                'opacity-50': isBeingDragged,
                'border-2 border-blue-300 border-dashed': isDragOver,
                'cursor-move': customizable && widget.movable,
                'col-span-2': widget.colSpan === 2,
                'row-span-2': widget.rowSpan === 2
              }
            )}
            draggable={customizable && widget.movable}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={(e) => {
              if (customizable && widget.movable) {
                e.preventDefault();
                setDragOver(widget.id);
              }
            }}
            onDragEnd={() => {
              setIsDragging(null);
              setDragOver(null);
            }}
            onDrop={(e) => handleDrop(e, widget.id)}
          >
            {/* Header del widget */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{widget.title}</h3>
              
              <div className="flex items-center space-x-1">
                {customizable && widget.configurable && (
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => console.log('Configurar widget', widget.id)}
                  >
                    ⚙️
                  </button>
                )}
                
                {customizable && widget.removable && (
                  <button
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => {
                      const newWidgets = localWidgets.filter(w => w.id !== widget.id);
                      setLocalWidgets(newWidgets);
                      onLayoutChange?.(newWidgets);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Contenido del widget */}
            <div className="widget-content">
              {widget.component}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Renderizar navegación
  const renderNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Médico</h1>
        <div className="text-gray-600">
          {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {doctor && ` • ${doctor}`}
          {room && ` • ${room}`}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Contador de alertas */}
        {unreadAlerts > 0 && (
          <div className="relative">
            <MedicalTouchButton
              label={`Alertas (${unreadAlerts})`}
              icon="🚨"
              variant="alert"
              size="small"
              onPress={() => setActiveView('alerts')}
            />
          </div>
        )}
        
        {/* Botón de refresh */}
        <MedicalTouchButton
          label=""
          icon="🔄"
          variant="neutral"
          size="small"
          onPress={() => onRefresh?.()}
        />
        
        {/* Selector de vista */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['overview', 'alerts', 'patients', 'metrics'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={clsx(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                {
                  'bg-white shadow-sm text-blue-600': activeView === view,
                  'text-gray-600 hover:text-gray-900': activeView !== view
                }
              )}
            >
              {view === 'overview' ? 'Resumen' :
               view === 'alerts' ? 'Alertas' :
               view === 'patients' ? 'Pacientes' : 'Métricas'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar vista activa
  const renderActiveView = () => {
    switch (activeView) {
      case 'alerts':
        return renderAlerts();
      case 'patients':
        return renderPatients();
      case 'metrics':
        return renderMetrics();
      case 'overview':
      default:
        return (
          <>
            {renderMetrics()}
            {renderWidgets()}
          </>
        );
    }
  };

  // Clases para el contenedor principal
  const containerClasses = clsx(
    'min-h-screen p-4 md:p-6',
    {
      'bg-gray-50': !darkMode,
      'bg-gray-900 text-white': darkMode,
      'text-base': tabletOptimized,
      'text-sm': !tabletOptimized
    },
    className
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Navegación */}
      {renderNavigation()}
      
      {/* Vista activa */}
      <div className="mt-6">
        {renderActiveView()}
      </div>
      
      {/* Acciones rápidas (solo en vista overview) */}
      {activeView === 'overview' && (
        <div className="mt-8">
          <MedicalQuickActions
            actions={[
              {
                id: 'new-consultation',
                label: 'Nueva Consulta',
                icon: '🩺',
                action: () => console.log('Nueva consulta'),
                variant: 'primary'
              },
              {
                id: 'quick-prescription',
                label: 'Receta Rápida',
                icon: '💊',
                action: () => console.log('Receta rápida'),
                variant: 'secondary'
              },
              {
                id: 'lab-orders',
                label: 'Estudios',
                icon: '🧪',
                action: () => console.log('Estudios'),
                variant: 'success'
              },
              {
                id: 'patient-search',
                label: 'Buscar Paciente',
                icon: '🔍',
                action: () => console.log('Buscar paciente'),
                variant: 'neutral'
              }
            ]}
            columns={4}
            compact={true}
            showLabels={true}
            className="bg-white rounded-xl shadow-sm"
          />
        </div>
      )}
      
      {/* Estilos CSS adicionales */}
      <style>{`
        .widget-content {
          min-height: 200px;
        }
        
        .dragging {
          cursor: grabbing !important;
        }
        
        @media (pointer: coarse) {
          .dashboard-widget {
            min-height: 220px !important;
            padding: 16px !important;
          }
          
          .metric-card {
            padding: 12px !important;
          }
        }
        
        /* Transiciones suaves */
        .view-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .view-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        
        /* Modo oscuro */
        .dark-mode .metric-card {
          background-color: #2d3748 !important;
          border-color: #4a5568 !important;
        }
        
        .dark-mode .widget {
          background-color: #2d3748 !important;
          border-color: #4a5568 !important;
        }
      `}</style>
    </div>
  );
};

export default MedicalDashboard;