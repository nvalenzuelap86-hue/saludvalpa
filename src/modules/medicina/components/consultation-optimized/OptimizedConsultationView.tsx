import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { MedicalTouchButton } from '../tablet/MedicalTouchButton';
import { GestureAwareView } from '../tablet/GestureAwareView';
import { MedicalQuickActions } from '../tablet/MedicalQuickActions';

export interface ConsultationSection {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  color: string;
  order: number;
  visible: boolean;
  required?: boolean;
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit?: string;
  photo?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface OptimizedConsultationViewProps {
  /** Información del paciente */
  patient: PatientInfo;
  /** Secciones de la consulta */
  sections?: ConsultationSection[];
  /** Función llamada al guardar consulta */
  onSave?: (consultationData: any) => void;
  /** Función llamada al cancelar consulta */
  onCancel?: () => void;
  /** Función llamada al cambiar sección */
  onSectionChange?: (sectionId: string) => void;
  /** Sección activa inicial */
  initialActiveSection?: string;
  /** Modo pantalla completa */
  fullscreen?: boolean;
  /** Habilitar modo tablet optimizado */
  tabletOptimized?: boolean;
  /** Mostrar panel de acciones rápidas */
  showQuickActions?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilo inline adicional */
  style?: React.CSSProperties;
  /** Datos de consulta existentes */
  existingData?: any;
  /** Habilitar validación en tiempo real */
  realTimeValidation?: boolean;
  /** Integración con CDSS */
  cdssIntegration?: boolean;
}

/**
 * Vista de consulta médica optimizada para tablet
 * 
 * Características:
 * - Layout dividido en paneles deslizables
 * - Navegación por gestos entre secciones
 * - Acceso rápido a todas las funciones
 * - Modo pantalla completa para concentración
 * - Integración con CDSS en tiempo real
 */
export const OptimizedConsultationView: React.FC<OptimizedConsultationViewProps> = ({
  patient,
  sections = [],
  onSave,
  onCancel,
  onSectionChange,
  initialActiveSection = 'subjective',
  fullscreen = false,
  tabletOptimized = true,
  showQuickActions = true,
  className = '',
  style = {},
  existingData,
  realTimeValidation = true,
  cdssIntegration = true
}) => {
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [consultationData, setConsultationData] = useState<any>(existingData || {});
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [cdssAlerts, setCdssAlerts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Secciones por defecto
  const defaultSectionsArray: ConsultationSection[] = [
    {
      id: 'subjective',
      title: 'Subjetivo',
      icon: '🗣️',
      component: <div>Componente Subjetivo - Motivo de consulta, síntomas, etc.</div>,
      color: 'blue',
      order: 1,
      visible: true,
      required: true
    },
    {
      id: 'objective',
      title: 'Objetivo',
      icon: '📊',
      component: <div>Componente Objetivo - Signos vitales, examen físico, etc.</div>,
      color: 'green',
      order: 2,
      visible: true,
      required: true
    },
    {
      id: 'assessment',
      title: 'Evaluación',
      icon: '🔍',
      component: <div>Componente Evaluación - Diagnósticos, impresión clínica, etc.</div>,
      color: 'purple',
      order: 3,
      visible: true,
      required: true
    },
    {
      id: 'plan',
      title: 'Plan',
      icon: '📋',
      component: <div>Componente Plan - Tratamiento, medicamentos, seguimiento, etc.</div>,
      color: 'orange',
      order: 4,
      visible: true,
      required: true
    }
  ];

  // Usar secciones proporcionadas o las por defecto
  const effectiveSections = sections.length > 0 ? sections : defaultSectionsArray;

  // Ordenar secciones por orden
  const sortedSections = [...effectiveSections]
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  // Encontrar sección activa
  const activeSectionData = sortedSections.find(s => s.id === activeSection) || sortedSections[0];

  // Manejar cambio de sección
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    onSectionChange?.(sectionId);
    
    // Scroll suave a la sección
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Manejar gestos de swipe para cambiar sección
  const handleSwipeLeft = () => {
    const currentIndex = sortedSections.findIndex(s => s.id === activeSection);
    if (currentIndex < sortedSections.length - 1) {
      handleSectionChange(sortedSections[currentIndex + 1].id);
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = sortedSections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      handleSectionChange(sortedSections[currentIndex - 1].id);
    }
  };

  // Manejar toggle de pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Manejar guardado de consulta
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validar datos requeridos
      const errors: Record<string, string[]> = {};
      sortedSections.forEach(section => {
        if (section.required && !consultationData[section.id]) {
          errors[section.id] = ['Esta sección es requerida'];
        }
      });
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsSaving(false);
        return;
      }
      
      // Llamar a la función de guardado
      await onSave?.(consultationData);
      
      // Limpiar errores
      setValidationErrors({});
    } catch (error) {
      console.error('Error al guardar consulta:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Manejar actualización de datos de sección
  const handleSectionDataUpdate = (sectionId: string, data: any) => {
    setConsultationData((prev: any) => ({
      ...prev,
      [sectionId]: data
    }));
    
    // Validación en tiempo real
    if (realTimeValidation) {
      validateSection(sectionId, data);
    }
    
    // Integración con CDSS
    if (cdssIntegration && sectionId === 'objective') {
      checkCdssAlerts(data);
    }
  };

  // Validar sección
  const validateSection = (sectionId: string, data: any) => {
    // Implementar validación específica por sección
    const errors: string[] = [];
    
    switch (sectionId) {
      case 'subjective':
        if (!data?.chiefComplaint) {
          errors.push('Motivo de consulta es requerido');
        }
        break;
      case 'objective':
        if (!data?.vitalSigns) {
          errors.push('Signos vitales son requeridos');
        }
        break;
      // Agregar más validaciones según sea necesario
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [sectionId]: errors
    }));
  };

  // Verificar alertas CDSS
  const checkCdssAlerts = (data: any) => {
    // Simular integración con CDSS
    const alerts = [];
    
    if (data?.vitalSigns?.bloodPressure?.systolic > 180) {
      alerts.push({
        id: 'bp-high',
        type: 'critical',
        message: 'Presión arterial sistólica muy elevada (>180 mmHg)',
        recommendation: 'Considerar tratamiento antihipertensivo urgente'
      });
    }
    
    if (data?.vitalSigns?.heartRate > 120) {
      alerts.push({
        id: 'hr-high',
        type: 'warning',
        message: 'Frecuencia cardíaca elevada (>120 lpm)',
        recommendation: 'Evaluar posibles causas de taquicardia'
      });
    }
    
    setCdssAlerts(alerts);
  };

  // Clases para el contenedor principal
  const containerClasses = clsx(
    'flex flex-col h-full bg-gray-50',
    {
      'fixed inset-0 z-50': isFullscreen,
      'rounded-xl shadow-lg': !isFullscreen,
      'border border-gray-200': !isFullscreen
    },
    className
  );

  // Clases para el header
  const headerClasses = clsx(
    'flex items-center justify-between p-4 bg-white border-b border-gray-200',
    {
      'sticky top-0 z-10': !isFullscreen
    }
  );

  // Clases para el contenido
  const contentClasses = clsx(
    'flex-1 overflow-auto',
    {
      'p-4': !tabletOptimized,
      'p-2': tabletOptimized
    }
  );

  // Clases para la navegación de secciones
  const navClasses = clsx(
    'flex overflow-x-auto bg-white border-b border-gray-200',
    {
      'sticky top-14 z-10': !isFullscreen,
      'px-2': tabletOptimized
    }
  );

  // Renderizar header del paciente
  const renderPatientHeader = () => (
    <div className="flex items-center space-x-3">
      {/* Foto del paciente */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          {patient.photo ? (
            <img 
              src={patient.photo} 
              alt={patient.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
        
        {/* Indicador de prioridad */}
        {patient.priority && (
          <div className={clsx(
            'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
            {
              'bg-green-500': patient.priority === 'low',
              'bg-yellow-500': patient.priority === 'medium',
              'bg-orange-500': patient.priority === 'high',
              'bg-red-500': patient.priority === 'critical'
            }
          )} />
        )}
      </div>
      
      {/* Información del paciente */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <span>{patient.age} años</span>
          <span>•</span>
          <span>{patient.gender}</span>
          {patient.lastVisit && (
            <>
              <span>•</span>
              <span>Última visita: {patient.lastVisit}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar navegación de secciones
  const renderSectionNavigation = () => (
    <div className={navClasses}>
      {sortedSections.map(section => {
        const isActive = section.id === activeSection;
        const hasError = validationErrors[section.id]?.length > 0;
        
        return (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={clsx(
              'flex items-center space-x-2 px-4 py-3 whitespace-nowrap transition-colors',
              'border-b-2',
              {
                'border-blue-500 text-blue-600 bg-blue-50': isActive,
                'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50': !isActive,
                'border-red-500 text-red-600': hasError && !isActive,
                'border-red-600': hasError && isActive
              }
            )}
            title={section.title}
          >
            <span className="text-lg">{section.icon}</span>
            <span className="font-medium">{section.title}</span>
            
            {/* Indicador de error */}
            {hasError && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
            
            {/* Indicador de completado */}
            {consultationData[section.id] && !hasError && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        );
      })}
    </div>
  );

  // Renderizar alertas CDSS
  const renderCdssAlerts = () => {
    if (cdssAlerts.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <span className="mr-2">⚠️</span>
          Alertas CDSS
        </h3>
        
        <div className="space-y-2">
          {cdssAlerts.map(alert => (
            <div
              key={alert.id}
              className={clsx(
                'p-3 rounded-lg border-l-4',
                {
                  'bg-red-50 border-red-500': alert.type === 'critical',
                  'bg-yellow-50 border-yellow-500': alert.type === 'warning',
                  'bg-blue-50 border-blue-500': alert.type === 'info'
                }
              )}
            >
              <div className="font-medium">{alert.message}</div>
              <div className="text-sm mt-1">{alert.recommendation}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar acciones rápidas
  const renderQuickActions = () => {
    if (!showQuickActions) return null;
    
    const quickActions = [
      {
        id: 'vitals',
        label: 'Signos Vitales',
        icon: '❤️',
        action: () => handleSectionChange('objective'),
        variant: 'alert' as const
      },
      {
        id: 'prescribe',
        label: 'Prescribir',
        icon: '💊',
        action: () => handleSectionChange('plan'),
        variant: 'secondary' as const
      },
      {
        id: 'lab',
        label: 'Laboratorio',
        icon: '🧪',
        action: () => handleSectionChange('objective'),
        variant: 'success' as const
      },
      {
        id: 'soap',
        label: 'Nota SOAP',
        icon: '📝',
        action: () => console.log('Generar nota SOAP'),
        variant: 'neutral' as const
      }
    ];
    
    return (
      <div className="mb-4">
        <MedicalQuickActions
          actions={quickActions}
          columns={4}
          compact={true}
          showLabels={true}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    );
  };

  // Renderizar contenido de la sección activa
  const renderActiveSection = () => (
    <GestureAwareView
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      gestureConfig={{
        swipeThreshold: 50,
        detectionArea: 'full'
      }}
      showVisualFeedback={tabletOptimized}
      className="h-full"
    >
      <div className="space-y-4">
        {/* Título de la sección */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">
            {activeSectionData.icon} {activeSectionData.title}
          </h3>
          
          {/* Indicador de progreso */}
          <div className="text-sm text-gray-500">
            {sortedSections.findIndex(s => s.id === activeSection) + 1} de {sortedSections.length}
          </div>
        </div>
        
        {/* Errores de validación */}
        {validationErrors[activeSection]?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="font-medium text-red-800">Errores de validación:</div>
            <ul className="mt-1 text-sm text-red-600">
              {validationErrors[activeSection].map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Componente de la sección */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          {activeSectionData.component}
        </div>
      </div>
    </GestureAwareView>
  );

  // Renderizar controles de acción
  const renderActionControls = () => (
    <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
      <div className="flex space-x-2">
        <MedicalTouchButton
          label="Cancelar"
          variant="neutral"
          onPress={onCancel || (() => window.history.back())}
          disabled={isSaving}
        />
        
        <MedicalTouchButton
          label={isFullscreen ? 'Salir Pantalla Completa' : 'Pantalla Completa'}
          icon={isFullscreen ? '📱' : '🖥️'}
          variant="secondary"
          onPress={toggleFullscreen}
        />
      </div>
      
      <div className="flex space-x-2">
        <MedicalTouchButton
          label="Guardar Borrador"
          variant="secondary"
          onPress={() => console.log('Guardar borrador')}
          disabled={isSaving}
        />
        
        <MedicalTouchButton
          label={isSaving ? 'Guardando...' : 'Finalizar Consulta'}
          variant="primary"
          onPress={handleSave}
          disabled={isSaving}
          loading={isSaving}
        />
      </div>
    </div>
  );

  // Renderizar vista completa
  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      {/* Header con información del paciente */}
      <div className={headerClasses}>
        {renderPatientHeader()}
        
        {/* Controles del header */}
        <div className="flex items-center space-x-2">
          {cdssAlerts.length > 0 && (
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {cdssAlerts.length}
              </div>
            </div>
          )}
          
          <MedicalTouchButton
            label=""
            icon="⚙️"
            variant="neutral"
            size="small"
            onPress={() => console.log('Abrir configuración')}
          />
        </div>
      </div>
      
      {/* Navegación de secciones */}
      {renderSectionNavigation()}
      
      {/* Contenido principal */}
      <div className={contentClasses}>
        {/* Alertas CDSS */}
        {renderCdssAlerts()}
        
        {/* Acciones rápidas */}
        {renderQuickActions()}
        
        {/* Sección activa */}
        {renderActiveSection()}
      </div>
      
      {/* Controles de acción */}
      {renderActionControls()}
      
      {/* Estilos CSS adicionales */}
      <style>{`
        @media (pointer: coarse) {
          .optimized-consultation-view {
            font-size: 16px !important;
          }
          
          .section-nav-button {
            min-width: 80px !important;
            padding: 12px 16px !important;
          }
        }
        
        /* Animaciones para transiciones de sección */
        .section-transition-enter {
          opacity: 0;
          transform: translateX(20px);
        }
        
        .section-transition-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        
        .section-transition-exit {
          opacity: 1;
          transform: translateX(0);
        }
        
        .section-transition-exit-active {
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 300ms, transform 300ms;
        }
        
        /* Mejoras para alto contraste */
        @media (prefers-contrast: high) {
          .consultation-section {
            border: 2px solid #000 !important;
          }
          
          .section-nav-button {
            border: 2px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedConsultationView;
