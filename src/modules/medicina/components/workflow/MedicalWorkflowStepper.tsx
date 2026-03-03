// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE FLUJO DE TRABAJO MÉDICO
// Componente que guía al médico a través del proceso clínico completo
// ============================================================================

import React, { useState } from 'react';
import Button from '../../../../components/shared/Button';
import Card from '../../../../components/shared/Card';
import useMedicalHistory from '../../hooks/useMedicalHistory';
import usePrescriptions from '../../hooks/usePrescriptions';
import useClinicalExams from '../../hooks/useClinicalExams';
import useDiagnoses from '../../hooks/useDiagnoses';
import type { Paciente } from '../../../../types';

interface MedicalWorkflowStepperProps {
  paciente: Paciente;
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
}

type WorkflowStep = 
  | 'reception' 
  | 'triage' 
  | 'consultation' 
  | 'diagnosis' 
  | 'treatment' 
  | 'documentation' 
  | 'follow-up';

const STEP_LABELS: Record<WorkflowStep, string> = {
  'reception': 'Recepción',
  'triage': 'Triaje',
  'consultation': 'Consulta',
  'diagnosis': 'Diagnóstico',
  'treatment': 'Tratamiento',
  'documentation': 'Documentación',
  'follow-up': 'Seguimiento'
};

const STEP_DESCRIPTIONS: Record<WorkflowStep, string> = {
  'reception': 'Verificar datos del paciente y motivo de consulta',
  'triage': 'Evaluar signos vitales y urgencia',
  'consultation': 'Historia clínica y examen físico',
  'diagnosis': 'Establecer diagnóstico diferencial y definitivo',
  'treatment': 'Prescribir tratamiento y estudios',
  'documentation': 'Completar nota SOAP y documentos',
  'follow-up': 'Programar seguimiento y recomendaciones'
};

export default function MedicalWorkflowStepper({ 
  paciente, 
  onComplete, 
  onStepChange 
}: MedicalWorkflowStepperProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('reception');
  const [completedSteps, setCompletedSteps] = useState<Set<WorkflowStep>>(new Set());
  
  const medicalHistory = useMedicalHistory();
  const prescriptions = usePrescriptions();
  const clinicalExams = useClinicalExams();
  const diagnoses = useDiagnoses();

  const steps: WorkflowStep[] = [
    'reception', 'triage', 'consultation', 'diagnosis', 'treatment', 'documentation', 'follow-up'
  ];

  const currentStepIndex = steps.indexOf(currentStep);

  const handleNextStep = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStep(nextStep);
      onStepChange?.(currentStepIndex + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep);
      onStepChange?.(currentStepIndex - 1);
    }
  };

  const handleStepClick = (step: WorkflowStep) => {
    setCurrentStep(step);
    onStepChange?.(steps.indexOf(step));
  };

  const isStepCompleted = (step: WorkflowStep) => completedSteps.has(step);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'reception':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recepción del Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Datos del Paciente</p>
                <p>{paciente.nombre} {paciente.apellidos}</p>
                <p>Edad: {paciente.edad || 'No registrada'} años</p>
                <p>Género: {paciente.genero}</p>
              </div>
              <div>
                <p className="font-medium">Información de Contacto</p>
                <p>Teléfono: {paciente.telefono}</p>
                <p>Email: {paciente.email || 'No registrado'}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Motivo de Consulta</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Describa el motivo principal de la consulta..."
              />
            </div>
          </div>
        );

      case 'triage':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Triaje y Signos Vitales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Temperatura</p>
                <input type="number" className="w-full p-1 border-b" placeholder="°C" />
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Presión Arterial</p>
                <div className="flex gap-1">
                  <input type="number" className="w-1/2 p-1 border-b" placeholder="Sistólica" />
                  <span>/</span>
                  <input type="number" className="w-1/2 p-1 border-b" placeholder="Diastólica" />
                </div>
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Frecuencia Cardíaca</p>
                <input type="number" className="w-full p-1 border-b" placeholder="lpm" />
              </div>
              <div className="border p-3 rounded">
                <p className="text-sm text-gray-600">Frecuencia Respiratoria</p>
                <input type="number" className="w-full p-1 border-b" placeholder="rpm" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Nivel de Urgencia</label>
              <select className="w-full p-2 border rounded">
                <option value="routine">Rutina</option>
                <option value="urgent">Urgente</option>
                <option value="emergency">Emergencia</option>
              </select>
            </div>
          </div>
        );

      case 'consultation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consulta Médica</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Historia de la Enfermedad Actual</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describa la evolución de los síntomas, tiempo de inicio, características..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Revisión por Sistemas</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Sistema cardiovascular, respiratorio, digestivo, neurológico, etc..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Examen Físico</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Hallazgos del examen físico por sistemas..."
                />
              </div>
            </div>
          </div>
        );

      case 'diagnosis':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Diagnóstico</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diagnóstico Presuntivo</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="Ej: Hipertensión arterial esencial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Código CIE-10</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="Ej: I10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Diagnóstico Diferencial</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Lista de diagnósticos diferenciales considerados..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Justificación Diagnóstica</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Criterios clínicos, hallazgos de apoyo, pruebas realizadas..."
                />
              </div>
            </div>
          </div>
        );

      case 'treatment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tratamiento</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Medicamentos Prescritos</h4>
                <div className="border rounded p-3">
                  <p className="text-sm text-gray-600">Usar el componente de prescripción para agregar medicamentos</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => console.log('Abrir prescripción')}
                  >
                    Agregar Medicamento
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Estudios Solicitados</h4>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Laboratorios, imágenes, otros estudios..."
                />
              </div>
              <div>
                <h4 className="font-medium">Recomendaciones</h4>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Recomendaciones de estilo de vida, dieta, actividad física..."
                />
              </div>
            </div>
          </div>
        );

      case 'documentation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documentación</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Nota SOAP</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subjetivo</label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      rows={4}
                      placeholder="Queja principal, síntomas, historia..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Objetivo</label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      rows={4}
                      placeholder="Signos vitales, hallazgos examen físico..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Análisis</label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      rows={4}
                      placeholder="Interpretación, diagnóstico diferencial..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      rows={4}
                      placeholder="Tratamiento, estudios, seguimiento..."
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Documentos a Generar</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Receta Médica</Button>
                  <Button variant="outline" size="sm">Orden de Estudios</Button>
                  <Button variant="outline" size="sm">Certificado Médico</Button>
                  <Button variant="outline" size="sm">Nota de Evolución</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'follow-up':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seguimiento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Seguimiento</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Seguimiento</label>
                <select className="w-full p-2 border rounded">
                  <option value="consultation">Consulta de seguimiento</option>
                  <option value="phone">Llamada telefónica</option>
                  <option value="results">Revisión de resultados</option>
                  <option value="none">No requiere seguimiento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Instrucciones para el Paciente</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Qué hacer en caso de empeoramiento, signos de alarma, cuándo regresar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Recordatorios</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Recordatorio de medicación</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Recordatorio de estudios</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Recordatorio de cita de seguimiento</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Flujo de Trabajo Médico</h2>
        <p className="text-gray-600">Complete cada paso del proceso clínico para {paciente.nombre} {paciente.apellidos}</p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => handleStepClick(step)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === step 
                  ? 'bg-blue-100 text-blue-700' 
                  : isStepCompleted(step)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                currentStep === step 
                  ? 'bg-blue-500 text-white' 
                  : isStepCompleted(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {isStepCompleted(step) ? '✓' : index + 1}
              </div>
              <span className="text-sm font-medium">{STEP_LABELS[step]}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                isStepCompleted(step) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{STEP_LABELS[currentStep]}</h3>
          <p className="text-gray-600">{STEP_DESCRIPTIONS[currentStep]}</p>
        </div>
        <div className="border rounded-lg p-4">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
            >
              Anterior: {STEP_LABELS[steps[currentStepIndex - 1]]}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentStepIndex < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNextStep}
            >
              Siguiente: {STEP_LABELS[steps[currentStepIndex + 1]]}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNextStep}
            >
              Completar Consulta
            </Button>
          )}
        </div>
      </div>
    </Card>
