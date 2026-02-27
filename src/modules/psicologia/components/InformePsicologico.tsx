// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE INFORME PSICOLÓGICO
// ============================================================================

import { useState } from 'react';
import type { DatosPsicologia } from '../../../types';

interface InformePsicologicoProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
  onGenerarPDF?: () => void;
}

export default function InformePsicologico({ datos, onChange, onGenerarPDF }: InformePsicologicoProps) {
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState('');
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  const handleChange = (campo: keyof DatosPsicologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const diagnosticosDSM5 = [
    'F32.9 - Trastorno depresivo mayor',
    'F41.1 - Trastorno de ansiedad generalizada',
    'F41.0 - Trastorno de pánico',
    'F43.10 - Trastorno de estrés postraumático',
    'F42 - Trastorno obsesivo-compulsivo',
    'F60.3 - Trastorno límite de la personalidad',
    'F60.0 - Trastorno paranoide de la personalidad',
    'F60.1 - Trastorno esquizoide de la personalidad',
    'F60.2 - Trastorno antisocial de la personalidad',
    'F90.0 - Trastorno por déficit de atención/hiperactividad',
    'F50.00 - Anorexia nerviosa',
    'F50.2 - Bulimia nerviosa',
    'F31.9 - Trastorno bipolar',
    'F20.9 - Esquizofrenia',
    'F84.0 - Trastorno del espectro autista',
    'F91.9 - Trastorno de conducta',
    'F63.9 - Trastorno del control de impulsos',
    'F52.9 - Disfunción sexual',
    'F51.9 - Trastorno del sueño',
    'F45.9 - Trastorno de síntomas somáticos'
  ];

  const recomendacionesComunes = [
    'Continuar psicoterapia semanal',
    'Valoración psiquiátrica para medicación',
    'Participar en grupo de apoyo',
    'Implementar rutina de autocuidado',
    'Realizar ejercicio físico regular',
    'Practicar técnicas de relajación diaria',
    'Mantener registro de síntomas',
    'Evitar consumo de sustancias',
    'Mejorar higiene del sueño',
    'Desarrollar red de apoyo social',
    'Participar en actividades placenteras',
    'Establecer límites saludables',
    'Practicar habilidades de comunicación',
    'Manejo del estrés laboral',
    'Terapia familiar complementaria'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Informe Psicológico Integral</h3>
            <p className="text-sm text-red-600">
              Síntesis diagnóstica, pronóstico y recomendaciones terapéuticas.
            </p>
          </div>
          {onGenerarPDF && (
            <button
              onClick={onGenerarPDF}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              Generar PDF
            </button>
          )}
        </div>
      </div>

      {/* Síntesis diagnóstica */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">1. Síntesis diagnóstica</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Impresión diagnóstica (DSM-5)
          </label>
          <div className="space-y-2">
            <div className="flex gap-3">
              <input
                type="text"
                value={nuevoDiagnostico}
                onChange={(e) => setNuevoDiagnostico(e.target.value)}
                placeholder="Agregar diagnóstico DSM-5..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => {
                  if (nuevoDiagnostico.trim()) {
                    // Aquí se agregaría el diagnóstico a los datos
                    setNuevoDiagnostico('');
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Diagnósticos DSM-5 comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Diagnósticos DSM-5 comunes:</p>
          <div className="flex flex-wrap gap-2">
            {diagnosticosDSM5.map((diagnostico) => (
              <button
                key={diagnostico}
                onClick={() => setNuevoDiagnostico(diagnostico)}
                className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs rounded"
              >
                {diagnostico}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hallazgos relevantes */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">2. Hallazgos relevantes de la evaluación</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Síntomas principales
            </label>
            <textarea
              placeholder="Describa los síntomas más relevantes, duración, intensidad, impacto funcional..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Factores predisponentes, precipitantes y mantenedores
            </label>
            <textarea
              placeholder="Factores biológicos, psicológicos, sociales, eventos desencadenantes, factores de mantenimiento..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultados de pruebas psicológicas
            </label>
            <textarea
              value={datos.evaluacionPsicologica?.observaciones || ''}
              onChange={(e) => handleChange('evaluacionPsicologica', {
                ...(datos.evaluacionPsicologica || { pruebasAplicadas: [], resultados: {}, observaciones: '' }),
                observaciones: e.target.value
              })}
              placeholder="Resumen de pruebas aplicadas, resultados, interpretación..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Pronóstico */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">3. Pronóstico</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pronóstico a corto plazo (1-3 meses)
            </label>
            <textarea
              placeholder="Expectativas de mejoría, riesgos inmediatos..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pronóstico a mediano plazo (3-12 meses)
            </label>
            <textarea
              placeholder="Objetivos terapéuticos, cambios esperados..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pronóstico a largo plazo (más de 1 año)
            </label>
            <textarea
              placeholder="Mantenimiento de logros, prevención de recaídas..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Factores que influyen en el pronóstico
          </label>
          <textarea
            placeholder="Motivación, apoyo social, recursos económicos, comorbilidades, adherencia al tratamiento..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[80px]"
          />
        </div>
      </div>

      {/* Recomendaciones terapéuticas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">4. Recomendaciones terapéuticas</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan de tratamiento recomendado
          </label>
          <div className="space-y-2">
            <div className="flex gap-3">
              <input
                type="text"
                value={nuevaRecomendacion}
                onChange={(e) => setNuevaRecomendacion(e.target.value)}
                placeholder="Agregar recomendación..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => {
                  if (nuevaRecomendacion.trim()) {
                    // Aquí se agregaría la recomendación a los datos
                    setNuevaRecomendacion('');
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Recomendaciones comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Recomendaciones comunes:</p>
          <div className="flex flex-wrap gap-2">
            {recomendacionesComunes.map((recomendacion) => (
              <button
                key={recomendacion}
                onClick={() => setNuevaRecomendacion(recomendacion)}
                className="px-3 py-1.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 text-xs rounded"
              >
                {recomendacion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consideraciones éticas y legales */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-3">5. Consideraciones éticas y legales</h4>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Confidencialidad:</strong> La información contenida en este informe es confidencial y está protegida por la ley de protección de datos.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Consentimiento informado:</strong> El paciente ha sido informado sobre el propósito de esta evaluación y ha dado su consentimiento.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Limitaciones:</strong> Este informe se basa en la información disponible al momento de la evaluación y puede requerir actualización.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Uso apropiado:</strong> Este informe está destinado únicamente para fines clínicos y no debe ser utilizado para otros propósitos sin autorización.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}