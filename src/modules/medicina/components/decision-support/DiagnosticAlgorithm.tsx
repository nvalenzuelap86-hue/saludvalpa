import { useState } from 'react';
import Card from '../../../../components/shared/Card';
import Button from '../../../../components/shared/Button';

interface AlgorithmStep {
  id: string;
  question: string;
  type: 'question' | 'decision' | 'result';
  options?: {
    id: string;
    label: string;
    nextStepId: string;
    condition?: string;
  }[];
  result?: {
    diagnosis: string;
    confidence: 'alta' | 'media' | 'baja';
    recommendations: string[];
    nextSteps: string[];
  };
}

export default function DiagnosticAlgorithm() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dolor-toracico');
  const [currentStepId, setCurrentStepId] = useState<string>('step1');
  const [patientAnswers, setPatientAnswers] = useState<Record<string, string>>({});
  const [algorithmHistory, setAlgorithmHistory] = useState<string[]>(['step1']);

  // Mock algorithms
  const algorithms = {
    'dolor-toracico': {
      name: 'Dolor Torácico Agudo',
      description: 'Algoritmo para evaluación de dolor torácico en urgencias',
      steps: {
        'step1': {
          id: 'step1',
          question: '¿El paciente presenta dolor torácico?',
          type: 'question',
          options: [
            { id: 'yes', label: 'Sí', nextStepId: 'step2' },
            { id: 'no', label: 'No', nextStepId: 'result-no-pain' }
          ]
        },
        'step2': {
          id: 'step2',
          question: '¿El dolor es de características isquémicas? (opresivo, irradiado, >20 min)',
          type: 'question',
          options: [
            { id: 'yes', label: 'Sí', nextStepId: 'step3' },
            { id: 'no', label: 'No', nextStepId: 'step4' }
          ]
        },
        'step3': {
          id: 'step3',
          question: '¿Hay cambios en el ECG?',
          type: 'question',
          options: [
            { id: 'yes', label: 'Sí (elevación ST)', nextStepId: 'result-stemi' },
            { id: 'no-st', label: 'No elevación ST', nextStepId: 'step5' },
            { id: 'normal', label: 'ECG normal', nextStepId: 'step6' }
          ]
        },
        'step4': {
          id: 'step4',
          question: '¿Hay signos de inestabilidad hemodinámica?',
          type: 'question',
          options: [
            { id: 'yes', label: 'Sí (TA < 90, FC > 120)', nextStepId: 'result-unstable' },
            { id: 'no', label: 'No', nextStepId: 'step7' }
          ]
        },
        'step5': {
          id: 'step5',
          question: '¿Marcadores cardíacos elevados?',
          type: 'question',
          options: [
            { id: 'yes', label: 'Sí', nextStepId: 'result-nstemi' },
            { id: 'no', label: 'No', nextStepId: 'result-angina' }
          ]
        },
        'step6': {
          id: 'step6',
          question: '¿Factores de riesgo cardiovascular?',
          type: 'decision',
          options: [
            { id: 'high', label: 'Alto riesgo (≥3 factores)', nextStepId: 'result-high-risk' },
            { id: 'low', label: 'Bajo riesgo', nextStepId: 'result-low-risk' }
          ]
        },
        'step7': {
          id: 'step7',
          question: '¿Características pleuríticas o reproducible?',
          type: 'question',
          options: [
            { id: 'pleuritic', label: 'Pleurítico', nextStepId: 'result-pleuritic' },
            { id: 'reproducible', label: 'Reproducible a la palpación', nextStepId: 'result-musculoskeletal' },
            { id: 'neither', label: 'Ninguna de las anteriores', nextStepId: 'result-other' }
          ]
        },
        'result-stemi': {
          id: 'result-stemi',
          type: 'result',
          result: {
            diagnosis: 'Infarto Agudo de Miocardio con Elevación del ST (STEMI)',
            confidence: 'alta',
            recommendations: [
              'Activación inmediata de código infarto',
              'Aspirina 325 mg masticable',
              'Clopidogrel 600 mg o Ticagrelor 180 mg',
              'Heparina no fraccionada o enoxaparina',
              'Transferencia urgente a hemodinamia'
            ],
            nextSteps: [
              'ECG cada 10-15 minutos',
              'Monitorización continua',
              'Acceso venoso periférico',
              'Analgesia con morfina si necesario'
            ]
          }
        },
        'result-nstemi': {
          id: 'result-nstemi',
          type: 'result',
          result: {
            diagnosis: 'Síndrome Coronario Agudo sin Elevación del ST (NSTEMI)',
            confidence: 'alta',
            recommendations: [
              'Ingreso a unidad coronaria',
              'Doble antiagregación (Aspirina + Clopidogrel/Ticagrelor)',
              'Anticoagulación con enoxaparina',
              'Evaluación para cateterismo en 24-72 horas'
            ],
            nextSteps: [
              'Seriación de troponinas',
              'ECG seriado',
              'Ecocardiograma transtorácico',
              'Estratificación de riesgo (score GRACE)'
            ]
          }
        },
        'result-angina': {
          id: 'result-angina',
          type: 'result',
          result: {
            diagnosis: 'Angina Estable',
            confidence: 'media',
            recommendations: [
              'Evaluación ambulatoria programada',
              'Nitratos sublinguales para alivio sintomático',
              'Betabloqueador o calcioantagonista',
              'Modificación de factores de riesgo'
            ],
            nextSteps: [
              'Prueba de esfuerzo',
              'Ecocardiograma de estrés',
              'Consulta con cardiología',
              'Educación sobre síntomas de alarma'
            ]
          }
        },
        'result-unstable': {
          id: 'result-unstable',
          type: 'result',
          result: {
            diagnosis: 'Dolor Torácico con Inestabilidad Hemodinámica',
            confidence: 'alta',
            recommendations: [
              'Estabilización hemodinámica inmediata',
              'Ecocardiograma de urgencia',
              'Exclusión de taponamiento cardíaco',
              'Evaluación para embolia pulmonar masiva'
            ],
            nextSteps: [
              'Monitorización invasiva',
              'Gasometría arterial',
              'AngioTAC de tórax',
              'Consulta con cuidados intensivos'
            ]
          }
        },
        'result-high-risk': {
          id: 'result-high-risk',
          type: 'result',
          result: {
            diagnosis: 'Dolor Torácico de Alto Riesgo',
            confidence: 'media',
            recommendations: [
              'Observación en urgencias 6-12 horas',
              'Seriación de troponinas a 0, 3 y 6 horas',
              'ECG seriado',
              'Considerar prueba de esfuerzo precoz'
            ],
            nextSteps: [
              'Registro de Holter si síntomas recurrentes',
              'Evaluación de función ventricular',
              'Control estricto de factores de riesgo',
              'Seguimiento cercano'
            ]
          }
        },
        'result-low-risk': {
          id: 'result-low-risk',
          type: 'result',
          result: {
            diagnosis: 'Dolor Torácico de Bajo Riesgo',
            confidence: 'baja',
            recommendations: [
              'Alta con seguimiento ambulatorio',
              'Reevaluación si síntomas persisten o empeoran',
              'Explicación de síntomas de alarma',
              'Modificación de estilo de vida'
            ],
            nextSteps: [
              'Consulta médica en 1-2 semanas',
              'Prueba de esfuerzo electiva',
              'Control de factores de riesgo',
              'Regreso inmediato si síntomas cambian'
            ]
          }
        },
        'result-pleuritic': {
          id: 'result-pleuritic',
          type: 'result',
          result: {
            diagnosis: 'Dolor Pleurítico (Sospecha de Embolia Pulmonar o Neumonía)',
            confidence: 'media',
            recommendations: [
              'Evaluación para tromboembolismo pulmonar',
              'Radiografía de tórax',
              'Gasometría arterial',
              'Dímero D si baja probabilidad clínica'
            ],
            nextSteps: [
              'AngioTAC de tórax si alta probabilidad',
              'Ecografía pulmonar',
              'Cultivos si fiebre',
              'Anticoagulación si confirmado TEP'
            ]
          }
        },
        'result-musculoskeletal': {
          id: 'result-musculoskeletal',
          type: 'result',
          result: {
            diagnosis: 'Dolor Musculoesquelético',
            confidence: 'alta',
            recommendations: [
              'Analgesia con AINEs',
              'Aplicación de calor local',
              'Reposo relativo',
              'Fisioterapia si persiste'
            ],
            nextSteps: [
              'Reevaluación en 1 semana',
              'Estudios de imagen si no mejora',
              'Evaluación reumatológica si indicado',
              'Ejercicios de estiramiento'
            ]
          }
        },
        'result-other': {
          id: 'result-other',
          type: 'result',
          result: {
            diagnosis: 'Dolor Torácico de Etiología por Definir',
            confidence: 'baja',
            recommendations: [
              'Evaluación adicional según características',
              'Considerar causas gastrointestinales',
              'Evaluación psiquiátrica si ansiedad prominente',
              'Seguimiento cercano'
            ],
            nextSteps: [
              'Endoscopia si síntomas digestivos',
              'Evaluación psicológica',
              'Monitorización ambulatoria',
              'Reevaluación en 48-72 horas'
            ]
          }
        },
        'result-no-pain': {
          id: 'result-no-pain',
          type: 'result',
          result: {
            diagnosis: 'Sin Dolor Torácico Actual',
            confidence: 'alta',
            recommendations: [
              'Evaluación de otros síntomas',
              'Examen físico completo',
              'Considerar causas alternativas',
              'Seguimiento según hallazgos'
            ],
            nextSteps: [
              'Reevaluación de queja principal',
              'Estudios según síntomas asociados',
              'Consulta especializada si indicado',
              'Educación sobre síntomas cardiovasculares'
            ]
          }
        }
      }
    },
    'dolor-abdominal': {
      name: 'Dolor Abdominal Agudo',
      description: 'Algoritmo para evaluación de dolor abdominal en urgencias',
      steps: {}
    },
    'cefalea': {
      name: 'Cefalea Aguda',
      description: 'Algoritmo para evaluación de cefalea en urgencias',
      steps: {}
    }
  };

  const currentAlgorithm = algorithms[selectedAlgorithm as keyof typeof algorithms];
  const currentStep = currentAlgorithm.steps[currentStepId as keyof typeof currentAlgorithm.steps];

  const handleAnswer = (optionId: string, nextStepId: string) => {
    setPatientAnswers(prev => ({
      ...prev,
      [currentStepId]: optionId
    }));
    setAlgorithmHistory(prev => [...prev, nextStepId]);
    setCurrentStepId(nextStepId);
  };

  const handleBack = () => {
    if (algorithmHistory.length > 1) {
      const newHistory = [...algorithmHistory];
      newHistory.pop();
      const previousStepId = newHistory[newHistory.length - 1];
      setAlgorithmHistory(newHistory);
      setCurrentStepId(previousStepId);
    }
  };

  const handleReset = () => {
    setCurrentStepId('step1');
    setPatientAnswers({});
    setAlgorithmHistory(['step1']);
  };

  const handleAlgorithmChange = (algorithmId: string) => {
    setSelectedAlgorithm(algorithmId);
    handleReset();
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'alta': return 'bg-green-100 text-green-800 border-green-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baja': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Algoritmos Diagnósticos</h2>
            <p className="text-gray-600">Sistemas de apoyo para diagnóstico paso a paso basados en evidencia</p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Reiniciar Algoritmo
          </Button>
        </div>

        {/* Algorithm Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Seleccionar Algoritmo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(algorithms).map(([id, algo]) => (
              <button
                key={id}
                onClick={() => handleAlgorithmChange(id)}
                className={`p-4 rounded-lg border text-left ${
                  selectedAlgorithm === id
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold text-gray-800">{algo.name}</div>
                <div className="text-sm text-gray-600 mt-1">{algo.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {Object.keys(algo.steps).length} pasos
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentAlgorithm.name} - Paso {algorithmHistory.length} de {Object.keys(currentAlgorithm.steps).length}
            </h3>
            <div className="text-sm text-gray-500">
              Respuestas: {Object.keys(patientAnswers).length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(algorithmHistory.length / Object.keys(currentAlgorithm.steps).length) * 100}%` }}
            ></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 mb-6">
            {algorithmHistory.map((stepId, index) => {
              const step = currentAlgorithm.steps[stepId as keyof typeof currentAlgorithm.steps];
              return (
                <div key={index} className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    stepId === currentStepId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {step.type === 'result' ? 'Resultado' : `Paso ${index + 1}`}
                  </span>
                  {index < algorithmHistory.length - 1 && (
                    <span className="mx-2 text-gray-400">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          {currentStep.type === 'question' || currentStep.type === 'decision' ? (
            <>
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">
                  {currentStep.type === 'question' ? 'PREGUNTA CLÍNICA' : 'DECISIÓN DIAGNÓSTICA'}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{currentStep.question}</h3>
              </div>
              
              <div className="space-y-3">
                {currentStep.options?.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id, option.nextStepId)}
                    className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{option.label}</div>
                    {option.condition && (
                      <div className="text-sm text-gray-600 mt-1">{option.condition}</div>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">DIAGNÓSTICO SUGERIDO</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentStep.result?.diagnosis}</h3>
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getConfidenceColor(currentStep.result?.confidence || 'baja')}`}>
                    Confianza: {currentStep.result?.confidence?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones Inmediatas</h4>
                <ul className="space-y-2">
                  {currentStep.result?.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Próximos Pasos</h4>
                <ul className="space-y-2">
                  {currentStep.result?.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">→</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack}>
                  Volver
                </Button>
                <Button variant="primary" onClick={handleReset}>
                  Nuevo Caso
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={algorithmHistory.length <= 1}
          >
            ← Paso Anterior
          </Button>
          <div className="text-sm text-gray-500">
            Use el algoritmo como guía, no sustituye el criterio clínico
          </div>
        </div>
      </Card>

      {/* Algorithm Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Algoritmo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Fuentes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Guías ACC/AHA para Síndromes Coronarios Agudos</li>
              <li>• Protocolos de la Sociedad Europea de Cardiología</li>
              <li>• Algoritmos validados en urgencias</li>
              <li>• Evidencia nivel A-B</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Limitaciones</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• No aplicable a pacientes pediátricos</li>
              <li>• Requiere confirmación con estudios complementarios</li>
              <li>• Considerar comorbilidades individuales</li>
              <li>• Actualizado a 2024</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}