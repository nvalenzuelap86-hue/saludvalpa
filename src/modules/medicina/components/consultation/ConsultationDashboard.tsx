// ============================================================================
// saludvalpa 3.0 - DASHBOARD DE CONSULTA MÉDICA
// Vista principal para médicos durante la consulta activa
// ============================================================================

import React, { useState } from 'react';
import Button from '../../../../components/shared/Button';
import Card from '../../../../components/shared/Card';
import ConsultaTimer from '../../../../components/ConsultaTimer';
import useMedicalHistory from '../../hooks/useMedicalHistory';
import usePrescriptions from '../../hooks/usePrescriptions';
import useClinicalExams from '../../hooks/useClinicalExams';
import useDiagnoses from '../../hooks/useDiagnoses';
import type { Paciente } from '../../../../types';

interface ConsultationDashboardProps {
  paciente: Paciente;
  onStartWorkflow?: () => void;
  onViewHistory?: () => void;
  onPrescribe?: () => void;
  onOrderTests?: () => void;
  /** Si la consulta actual tiene marcador de tiempo */
  conMarcadorTiempo?: boolean;
  /** Callback para generar PDF de la consulta */
  onGenerarPDF?: () => void;
}

export default function ConsultationDashboard({
  paciente,
  onStartWorkflow,
  onViewHistory,
  onPrescribe,
  onOrderTests,
  conMarcadorTiempo = false,
  onGenerarPDF
}: ConsultationDashboardProps) {
  const medicalHistory = useMedicalHistory();
  const prescriptions = usePrescriptions();
  const clinicalExams = useClinicalExams();
  const diagnoses = useDiagnoses();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'medications' | 'allergies' | 'timer'>('overview');
  const [duracionConsulta, setDuracionConsulta] = useState(0);

  // Mock data for demonstration
  const patientData = {
    lastVisit: '2024-01-15',
    activeConditions: ['Hipertensión arterial', 'Diabetes tipo 2'],
    currentMedications: [
      { name: 'Losartán', dose: '50mg', frequency: '1x día' },
      { name: 'Metformina', dose: '850mg', frequency: '2x día' }
    ],
    allergies: ['Penicilina', 'Sulfas'],
    recentVitals: {
      bloodPressure: '130/85',
      heartRate: '78',
      temperature: '36.8',
      weight: '75kg'
    },
    pendingTests: ['Hemoglobina glicosilada', 'Perfil lipídico']
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header con información del paciente */}
      <Card className="p-6 bg-gradient-to-br from-saludvalpa-blue/5 to-saludvalpa-teal/5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{paciente.nombre} {paciente.apellidos}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">{paciente.edad || 'N/A'} años • {paciente.genero}</span>
              <span className="text-sm text-gray-600">ID: {paciente.id.substring(0, 8)}...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conMarcadorTiempo && (
              <div className="px-3 py-1 bg-saludvalpa-lime/20 text-saludvalpa-lime rounded-full text-sm font-medium">
                ⏱️ Con temporizador
              </div>
            )}
            <div className="px-3 py-1 bg-saludvalpa-blue/10 text-saludvalpa-blue rounded-full text-sm font-medium">
              🏥 Consulta activa
            </div>
          </div>
        </div>
      </Card>

      {/* Timer si la consulta tiene marcador de tiempo */}
      {conMarcadorTiempo && (
        <ConsultaTimer
          duracionInicial={0}
          activoPorDefecto={true}
          onTiempoCambiado={setDuracionConsulta}
          onFinalizar={(duracion) => {
            console.log('Consulta finalizada con duración:', duracion);
            if (onGenerarPDF) onGenerarPDF();
          }}
          color="lime"
        />
      )}

      {/* Quick Actions - Diseño mejorado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="primary"
          onClick={onStartWorkflow}
          className="flex flex-col items-center justify-center p-4 h-auto"
        >
          <span className="text-2xl mb-2">🩺</span>
          <span className="font-medium">Iniciar Consulta</span>
        </Button>
        <Button
          variant="outline"
          onClick={onPrescribe}
          className="flex flex-col items-center justify-center p-4 h-auto"
        >
          <span className="text-2xl mb-2">💊</span>
          <span className="font-medium">Prescribir</span>
        </Button>
        <Button
          variant="outline"
          onClick={onOrderTests}
          className="flex flex-col items-center justify-center p-4 h-auto"
        >
          <span className="text-2xl mb-2">🔬</span>
          <span className="font-medium">Ordenar Estudios</span>
        </Button>
        <Button
          variant="outline"
          onClick={onViewHistory}
          className="flex flex-col items-center justify-center p-4 h-auto"
        >
          <span className="text-2xl mb-2">📋</span>
          <span className="font-medium">Ver Historial</span>
        </Button>
      </div>

      {/* Patient Summary - Diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-saludvalpa-blue/10 rounded-lg flex items-center justify-center">
              <span className="text-saludvalpa-blue text-xl">👤</span>
            </div>
            <h3 className="font-bold text-gray-900">Información del Paciente</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Edad</span>
              <span className="font-medium">{paciente.edad || 'N/A'} años</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Género</span>
              <span className="font-medium">{paciente.genero}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Última visita</span>
              <span className="font-medium">{patientData.lastVisit}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-saludvalpa-green/10 rounded-lg flex items-center justify-center">
              <span className="text-saludvalpa-green text-xl">❤️</span>
            </div>
            <h3 className="font-bold text-gray-900">Signos Vitales</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">{patientData.recentVitals.bloodPressure}</div>
              <div className="text-xs text-gray-600 mt-1">Presión</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">{patientData.recentVitals.heartRate}</div>
              <div className="text-xs text-gray-600 mt-1">Cardíaca</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-700">{patientData.recentVitals.temperature}°C</div>
              <div className="text-xs text-gray-600 mt-1">Temp.</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-700">{patientData.recentVitals.weight}</div>
              <div className="text-xs text-gray-600 mt-1">Peso</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="font-bold text-gray-900">Alertas</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm">Alergia a Penicilina</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm">Hemoglobina glicosilada pendiente</span>
            </div>
            {patientData.activeConditions.includes('Diabetes tipo 2') && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Diabetes - Monitorear glucemia</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Current Medications - Diseño mejorado */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-saludvalpa-teal/10 rounded-lg flex items-center justify-center">
              <span className="text-saludvalpa-teal text-xl">💊</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Medicamentos Actuales</h3>
              <p className="text-sm text-gray-600">Regimen farmacológico del paciente</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={onPrescribe}>
            Modificar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patientData.currentMedications.map((med, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium block">{med.name}</span>
                <span className="text-sm text-gray-600">{med.dose}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{med.frequency}</span>
                <div className="text-xs text-green-600 mt-1">Activo</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="font-bold">Historial de Consultas</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">Consulta #{item}</div>
                <div className="text-sm text-gray-600">15/01/2024 - Dr. García</div>
                <div className="mt-2 text-sm">Revisión de rutina, ajuste de medicación</div>
              </div>
              <Button size="sm" variant="outline">
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMedications = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Historial de Medicamentos</h3>
        <Button variant="primary" onClick={onPrescribe}>
          Nueva Prescripción
        </Button>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Losartán', start: '01/01/2023', status: 'Activo', dose: '50mg/día' },
          { name: 'Metformina', start: '01/01/2023', status: 'Activo', dose: '1700mg/día' },
          { name: 'Atorvastatina', start: '15/06/2023', status: 'Suspendido', dose: '20mg/día' }
        ].map((med, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{med.name}</div>
                <div className="text-sm text-gray-600">Iniciado: {med.start} • {med.dose}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                med.status === 'Activo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {med.status}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAllergies = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Alergias y Reacciones Adversas</h3>
        <Button variant="outline" size="sm">
          Agregar Alergia
        </Button>
      </div>
      <div className="space-y-3">
        {patientData.allergies.map((allergy, index) => (
          <Card key={index} className="p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-red-700">{allergy}</div>
                <div className="text-sm text-gray-600">Reacción: Anafilaxia • Severidad: Alta</div>
              </div>
              <div className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                Contraindicado
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTimer = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">⏱️ Temporizador de Consulta</h3>
          <p className="text-sm text-gray-600">Control y seguimiento del tiempo de consulta</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Duración actual:</span>
          <span className="font-mono font-bold text-saludvalpa-lime text-xl">
            {Math.floor(duracionConsulta / 3600)}:
            {Math.floor((duracionConsulta % 3600) / 60).toString().padStart(2, '0')}:
            {(duracionConsulta % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <ConsultaTimer
        duracionInicial={duracionConsulta}
        activoPorDefecto={true}
        onTiempoCambiado={setDuracionConsulta}
        onFinalizar={(duracion) => {
          console.log('Consulta finalizada con duración:', duracion);
          if (onGenerarPDF) onGenerarPDF();
        }}
        color="lime"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h4 className="font-bold mb-4">📊 Estadísticas de Tiempo</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo transcurrido</span>
              <span className="font-bold">
                {Math.floor(duracionConsulta / 60)} minutos
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Costo estimado</span>
              <span className="font-bold text-saludvalpa-blue">
                ${((duracionConsulta / 3600) * 500).toFixed(2)} MXN
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo promedio consulta</span>
              <span className="font-bold">45 minutos</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="font-bold mb-4">⚡ Acciones Rápidas</h4>
          <div className="space-y-3">
            <button
              onClick={() => navigator.clipboard.writeText(Math.floor(duracionConsulta / 60).toString())}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-3"
            >
              <span className="text-xl">📋</span>
              <div>
                <div className="font-medium">Copiar duración</div>
                <div className="text-sm text-gray-600">Copiar minutos a portapapeles</div>
              </div>
            </button>
            <button
              onClick={onGenerarPDF}
              className="w-full text-left p-3 bg-saludvalpa-blue/10 rounded-lg hover:bg-saludvalpa-blue/20 flex items-center gap-3"
            >
              <span className="text-xl">📄</span>
              <div>
                <div className="font-medium text-saludvalpa-blue">Generar PDF con tiempo</div>
                <div className="text-sm text-gray-600">Incluir duración en reporte</div>
              </div>
            </button>
            <button
              onClick={() => setDuracionConsulta(0)}
              className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-3"
            >
              <span className="text-xl">🔄</span>
              <div>
                <div className="font-medium text-red-700">Reiniciar temporizador</div>
                <div className="text-sm text-gray-600">Comenzar desde cero</div>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consulta Médica</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-600">Paciente: {paciente.nombre} {paciente.apellidos}</p>
            {conMarcadorTiempo && (
              <span className="px-2 py-1 bg-saludvalpa-lime/20 text-saludvalpa-lime text-xs rounded-full">
                ⏱️ Con temporizador
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onGenerarPDF}>
            📄 Generar PDF
          </Button>
          <Button variant="outline" size="sm">
            🖨️ Imprimir
          </Button>
          <Button variant="primary" size="sm">
            ✅ Finalizar Consulta
          </Button>
        </div>
      </div>

      {/* Navigation Tabs - Diseño mejorado */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Resumen', icon: '📋' },
            { id: 'history', label: 'Historial', icon: '📚' },
            { id: 'medications', label: 'Medicamentos', icon: '💊' },
            { id: 'allergies', label: 'Alergias', icon: '⚠️' },
            ...(conMarcadorTiempo ? [{ id: 'timer', label: 'Temporizador', icon: '⏱️' }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? `border-saludvalpa-blue text-saludvalpa-blue bg-saludvalpa-blue/5`
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'medications' && renderMedications()}
        {activeTab === 'allergies' && renderAllergies()}
        {activeTab === 'timer' && renderTimer()}
      </div>
    </div>
  );
}