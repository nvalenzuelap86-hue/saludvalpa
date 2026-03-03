import React from 'react';
import { MedicalTouchButton } from './src/modules/medicina/components/tablet/MedicalTouchButton';
import { GestureAwareView } from './src/modules/medicina/components/tablet/GestureAwareView';
import { MedicalQuickActions } from './src/modules/medicina/components/tablet/MedicalQuickActions';
import { OptimizedConsultationView } from './src/modules/medicina/components/consultation-optimized/OptimizedConsultationView';
import { MedicalDashboard } from './src/modules/medicina/components/dashboard/MedicalDashboard';

/**
 * Test de componentes de la Fase 4: Interfaz y Experiencia
 * 
 * Este archivo prueba los componentes principales desarrollados en la Fase 4:
 * 1. MedicalTouchButton - Botón optimizado para tablet
 * 2. GestureAwareView - Componente con detección de gestos
 * 3. MedicalQuickActions - Panel de acciones rápidas
 * 4. OptimizedConsultationView - Vista de consulta optimizada
 * 5. MedicalDashboard - Dashboard médico con CDSS
 */

// Datos de prueba para el dashboard
const testMetrics = [
  {
    id: 'consultations',
    label: 'Consultas Hoy',
    value: 15,
    change: 3,
    trend: 'up' as const,
    icon: '🩺'
  },
  {
    id: 'alerts',
    label: 'Alertas CDSS',
    value: 4,
    change: -1,
    trend: 'down' as const,
    icon: '🚨'
  },
  {
    id: 'patients',
    label: 'Pacientes en Espera',
    value: 8,
    change: 0,
    trend: 'stable' as const,
    icon: '👥'
  },
  {
    id: 'satisfaction',
    label: 'Satisfacción',
    value: '96%',
    change: 2,
    trend: 'up' as const,
    icon: '⭐'
  }
];

const testAlerts = [
  {
    id: 'alert-1',
    type: 'critical' as const,
    title: 'Presión Arterial Crítica',
    message: 'Paciente Juan Pérez con PA 190/110 mmHg',
    patientId: '123',
    patientName: 'Juan Pérez',
    timestamp: new Date(),
    acknowledged: false,
    source: 'cdss' as const,
    actionRequired: true,
    actionLabel: 'Revisar'
  },
  {
    id: 'alert-2',
    type: 'warning' as const,
    title: 'Interacción Medicamentosa',
    message: 'Posible interacción entre Warfarina y Amiodarona',
    patientId: '456',
    patientName: 'María González',
    timestamp: new Date(),
    acknowledged: false,
    source: 'cdss' as const,
    actionRequired: true,
    actionLabel: 'Ver Detalles'
  }
];

const testPatients = [
  {
    id: '1',
    name: 'Juan Pérez',
    age: 65,
    gender: 'Masculino',
    status: 'in-consultation' as const,
    priority: 'critical' as const,
    appointmentTime: '10:30 AM',
    doctor: 'Dr. Rodríguez',
    room: 'Consultorio 3'
  },
  {
    id: '2',
    name: 'María González',
    age: 42,
    gender: 'Femenino',
    status: 'waiting' as const,
    priority: 'high' as const,
    appointmentTime: '11:15 AM',
    doctor: 'Dr. Martínez',
    room: 'Consultorio 2'
  },
  {
    id: '3',
    name: 'Carlos López',
    age: 38,
    gender: 'Masculino',
    status: 'waiting' as const,
    priority: 'medium' as const,
    appointmentTime: '11:45 AM',
    doctor: 'Dr. Rodríguez',
    room: 'Consultorio 3'
  }
];

// Componente de prueba principal
export const Phase4TestComponent: React.FC = () => {
  const handleButtonPress = (label: string) => {
    console.log(`Botón presionado: ${label}`);
  };

  const handleGesture = (type: string) => {
    console.log(`Gesto detectado: ${type}`);
  };

  const handleQuickAction = (actionId: string) => {
    console.log(`Acción rápida: ${actionId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🧪 Test de Componentes - Fase 4: Interfaz y Experiencia
      </h1>
      
      {/* Sección 1: MedicalTouchButton */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          1. MedicalTouchButton - Botones Táctiles Optimizados
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MedicalTouchButton
            label="Primario"
            variant="primary"
            onPress={() => handleButtonPress('Primario')}
            size="medium"
          />
          
          <MedicalTouchButton
            label="Secundario"
            variant="secondary"
            onPress={() => handleButtonPress('Secundario')}
            size="medium"
          />
          
          <MedicalTouchButton
            label="Alerta"
            variant="alert"
            onPress={() => handleButtonPress('Alerta')}
            size="medium"
          />
          
          <MedicalTouchButton
            label="Éxito"
            variant="success"
            onPress={() => handleButtonPress('Éxito')}
            size="medium"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MedicalTouchButton
            label="Pequeño"
            variant="primary"
            onPress={() => handleButtonPress('Pequeño')}
            size="small"
          />
          
          <MedicalTouchButton
            label="Mediano"
            variant="primary"
            onPress={() => handleButtonPress('Mediano')}
            size="medium"
          />
          
          <MedicalTouchButton
            label="Grande"
            variant="primary"
            onPress={() => handleButtonPress('Grande')}
            size="large"
          />
        </div>
        
        <div className="mt-6">
          <MedicalTouchButton
            label="Botón con Icono"
            icon="💊"
            variant="primary"
            onPress={() => handleButtonPress('Con Icono')}
            fullWidth
          />
        </div>
      </section>
      
      {/* Sección 2: GestureAwareView */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          2. GestureAwareView - Detección de Gestos
        </h2>
        
        <GestureAwareView
          onSwipeLeft={() => handleGesture('swipeLeft')}
          onSwipeRight={() => handleGesture('swipeRight')}
          onSwipeUp={() => handleGesture('swipeUp')}
          onSwipeDown={() => handleGesture('swipeDown')}
          onDoubleTap={() => handleGesture('doubleTap')}
          onLongPress={() => handleGesture('longPress')}
          showVisualFeedback={true}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">👆</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Área Sensible a Gestos
            </h3>
            <p className="text-gray-600">
              Prueba gestos como:
            </p>
            <ul className="mt-2 text-gray-600 list-disc list-inside">
              <li>Swipe izquierda/derecha</li>
              <li>Swipe arriba/abajo</li>
              <li>Doble tap</li>
              <li>Long press (mantener)</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Los gestos se registrarán en la consola
            </p>
          </div>
        </GestureAwareView>
      </section>
      
      {/* Sección 3: MedicalQuickActions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          3. MedicalQuickActions - Acciones Rápidas
        </h2>
        
        <MedicalQuickActions
          actions={[
            {
              id: 'new-consultation',
              label: 'Nueva Consulta',
              icon: '🩺',
              action: () => handleQuickAction('new-consultation'),
              variant: 'primary',
              shortcut: 'N',
              description: 'Iniciar nueva consulta médica'
            },
            {
              id: 'prescribe',
              label: 'Prescribir',
              icon: '💊',
              action: () => handleQuickAction('prescribe'),
              variant: 'secondary',
              shortcut: 'P',
              description: 'Prescribir medicamentos'
            },
            {
              id: 'vital-signs',
              label: 'Signos Vitales',
              icon: '❤️',
              action: () => handleQuickAction('vital-signs'),
              variant: 'alert',
              shortcut: 'V',
              description: 'Registrar signos vitales'
            },
            {
              id: 'lab-orders',
              label: 'Estudios',
              icon: '🧪',
              action: () => handleQuickAction('lab-orders'),
              variant: 'success',
              shortcut: 'E',
              description: 'Solicitar estudios'
            },
            {
              id: 'soap-note',
              label: 'Nota SOAP',
              icon: '📝',
              action: () => handleQuickAction('soap-note'),
              variant: 'neutral',
              shortcut: 'S',
              description: 'Crear nota SOAP'
            },
            {
              id: 'cdss-check',
              label: 'CDSS',
              icon: '🔍',
              action: () => handleQuickAction('cdss-check'),
              variant: 'warning',
              shortcut: 'C',
              description: 'Revisar con CDSS'
            }
          ]}
          columns={3}
          compact={false}
          showLabels={true}
          showShortcuts={true}
          title="Acciones Médicas Rápidas"
          showTitle={true}
        />
      </section>
      
      {/* Sección 4: OptimizedConsultationView */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          4. OptimizedConsultationView - Consulta Optimizada
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <OptimizedConsultationView
            patient={{
              id: '123',
              name: 'Juan Pérez',
              age: 65,
              gender: 'Masculino',
              priority: 'critical'
            }}
            onSave={(data) => console.log('Consulta guardada:', data)}
            onCancel={() => console.log('Consulta cancelada')}
            tabletOptimized={true}
            showQuickActions={true}
            style={{ height: '600px' }}
          />
        </div>
      </section>
      
      {/* Sección 5: MedicalDashboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          5. MedicalDashboard - Dashboard con CDSS
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <MedicalDashboard
            metrics={testMetrics}
            alerts={testAlerts}
            patients={testPatients}
            date={new Date()}
            doctor="Dr. Alejandro Rodríguez"
            room="Consultorio 1"
            tabletOptimized={true}
            onRefresh={() => console.log('Dashboard actualizado')}
            onAcknowledgeAlert={(alertId) => console.log('Alerta acusada:', alertId)}
            onPatientSelect={(patientId) => console.log('Paciente seleccionado:', patientId)}
          />
        </div>
      </section>
      
      {/* Resumen de pruebas */}
      <section className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          ✅ Resumen de Componentes Implementados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Componentes Touch-First</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>MedicalTouchButton - Botón optimizado para tablet</li>
              <li>GestureAwareView - Detección de gestos táctiles</li>
              <li>MedicalQuickActions - Panel de acciones rápidas</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Vistas Optimizadas</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>OptimizedConsultationView - Consulta para tablet</li>
              <li>MedicalDashboard - Dashboard médico integral</li>
              <li>Integración CDSS en tiempo real</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Características Implementadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-sm">
              <span className="font-medium">🎯 Touch-First Design</span>
              <p className="text-green-700">Elementos mínimos 44x44px, feedback háptico</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">📱 Tablet Optimized</span>
              <p className="text-green-700">Layout responsive, navegación por gestos</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">⚡ CDSS Integration</span>
              <p className="text-green-700">Alertas en tiempo real, recomendaciones</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Instrucciones de uso */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">📋 Instrucciones de Prueba</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1">
          <li>Prueba los botones táctiles con diferentes variantes y tamaños</li>
          <li>Interactúa con el área de gestos (swipe, tap, long press)</li>
          <li>Usa las acciones rápidas para funciones médicas comunes</li>
          <li>Navega por la vista de consulta optimizada</li>
          <li>Explora el dashboard médico con alertas CDSS</li>
          <li>Revisa la consola del navegador para ver los logs</li>
        </ol>
      </div>
    </div>
  );
};

export default Phase4TestComponent;