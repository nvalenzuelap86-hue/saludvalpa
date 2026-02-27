// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE EVALUACIÓN PSICOLÓGICA
// ============================================================================

import { useState } from 'react';
import type { DatosPsicologia } from '../../../types';

interface EvaluacionPsicologicaProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
}

export default function EvaluacionPsicologica({ datos, onChange }: EvaluacionPsicologicaProps) {
  const [nuevaPrueba, setNuevaPrueba] = useState('');
  const [resultadoPrueba, setResultadoPrueba] = useState('');

  const handleChange = (campo: keyof DatosPsicologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const agregarPrueba = () => {
    if (!nuevaPrueba.trim()) return;
    
    const evaluacion = datos.evaluacionPsicologica || {
      pruebasAplicadas: [],
      resultados: {},
      observaciones: ''
    };
    
    const nuevasPruebas = [...evaluacion.pruebasAplicadas, nuevaPrueba];
    const nuevosResultados = { ...evaluacion.resultados };
    
    if (resultadoPrueba.trim()) {
      nuevosResultados[nuevaPrueba] = resultadoPrueba;
    }
    
    handleChange('evaluacionPsicologica', {
      ...evaluacion,
      pruebasAplicadas: nuevasPruebas,
      resultados: nuevosResultados
    });
    
    setNuevaPrueba('');
    setResultadoPrueba('');
  };

  const eliminarPrueba = (indice: number) => {
    const evaluacion = datos.evaluacionPsicologica;
    if (!evaluacion) return;
    
    const pruebaAEliminar = evaluacion.pruebasAplicadas[indice];
    const nuevasPruebas = evaluacion.pruebasAplicadas.filter((_, i) => i !== indice);
    const nuevosResultados = { ...evaluacion.resultados };
    delete nuevosResultados[pruebaAEliminar];
    
    handleChange('evaluacionPsicologica', {
      ...evaluacion,
      pruebasAplicadas: nuevasPruebas,
      resultados: nuevosResultados
    });
  };

  const pruebasComunes = [
    'PHQ-9 (Depresión)',
    'GAD-7 (Ansiedad)',
    'BDI-II (Inventario de Depresión de Beck)',
    'BAI (Inventario de Ansiedad de Beck)',
    'MMPI-2 (Inventario Multifásico de Personalidad de Minnesota)',
    'WAIS-IV (Escala de Inteligencia de Wechsler para Adultos)',
    'WISC-V (Escala de Inteligencia de Wechsler para Niños)',
    'Test de Rorschach',
    'TAT (Test de Apercepción Temática)',
    'HTP (Casa-Árbol-Persona)',
    'Test de Bender',
    'Escala de Hamilton para la Depresión',
    'Escala de Hamilton para la Ansiedad',
    'Inventario de Personalidad NEO-PI-R',
    '16PF (Cuestionario de Personalidad)',
    'Test de Stroop',
    'Test de Trail Making',
    'Escala de Inteligencia Emocional MSCEIT'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Evaluación Psicológica Integral</h3>
        <p className="text-sm text-purple-600">
          Registre las pruebas psicológicas aplicadas, resultados y observaciones clínicas.
        </p>
      </div>

      {/* Motivo de consulta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo de consulta principal
        </label>
        <textarea
          value={datos.historiaClinica?.motivoConsulta || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            motivoConsulta: e.target.value
          })}
          placeholder="Describa el motivo principal de consulta, síntomas, duración, impacto en la vida diaria..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
        />
      </div>

      {/* Antecedentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Antecedentes personales relevantes
          </label>
          <textarea
            value={datos.historiaClinica?.antecedentesPersonales || ''}
            onChange={(e) => handleChange('historiaClinica', {
              ...(datos.historiaClinica || {}),
              antecedentesPersonales: e.target.value
            })}
            placeholder="Historia médica, desarrollo, educación, relaciones, traumas..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Antecedentes familiares
          </label>
          <textarea
            value={datos.historiaClinica?.antecedentesFamiliares || ''}
            onChange={(e) => handleChange('historiaClinica', {
              ...(datos.historiaClinica || {}),
              antecedentesFamiliares: e.target.value
            })}
            placeholder="Historia psiquiátrica familiar, relaciones familiares, dinámicas..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
          />
        </div>
      </div>

      {/* Pruebas psicológicas aplicadas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pruebas psicológicas aplicadas
        </label>
        
        {/* Lista de pruebas */}
        {datos.evaluacionPsicologica?.pruebasAplicadas && datos.evaluacionPsicologica.pruebasAplicadas.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.evaluacionPsicologica.pruebasAplicadas.map((prueba, idx) => (
              <div key={idx} className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-lg border border-purple-100">
                <div className="flex-1">
                  <div className="font-medium text-purple-800">{prueba}</div>
                  {datos.evaluacionPsicologica?.resultados[prueba] && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Resultado:</span> {datos.evaluacionPsicologica.resultados[prueba]}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => eliminarPrueba(idx)}
                  className="ml-4 text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar nueva prueba */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nombre de la prueba
              </label>
              <input
                type="text"
                value={nuevaPrueba}
                onChange={(e) => setNuevaPrueba(e.target.value)}
                placeholder="Ej: PHQ-9, WAIS-IV, Test de Rorschach..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && agregarPrueba()}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Resultado / Puntuación
              </label>
              <input
                type="text"
                value={resultadoPrueba}
                onChange={(e) => setResultadoPrueba(e.target.value)}
                placeholder="Ej: 15 puntos (depresión moderada), Percentil 85..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && agregarPrueba()}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={agregarPrueba}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
            >
              + Agregar prueba
            </button>
            
            <div className="text-xs text-gray-500">
              {datos.evaluacionPsicologica?.pruebasAplicadas?.length || 0} pruebas registradas
            </div>
          </div>
        </div>

        {/* Pruebas comunes */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Pruebas psicológicas comunes:</p>
          <div className="flex flex-wrap gap-2">
            {pruebasComunes.map((prueba) => (
              <button
                key={prueba}
                onClick={() => {
                  setNuevaPrueba(prueba);
                }}
                className="px-3 py-1.5 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs rounded transition-colors"
              >
                {prueba}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Observaciones clínicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones clínicas y síntesis diagnóstica
        </label>
        <textarea
          value={datos.evaluacionPsicologica?.observaciones || ''}
          onChange={(e) => handleChange('evaluacionPsicologica', {
            ...(datos.evaluacionPsicologica || { pruebasAplicadas: [], resultados: {}, observaciones: '' }),
            observaciones: e.target.value
          })}
          placeholder="Síntesis de hallazgos, impresión diagnóstica, recomendaciones, pronóstico..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[120px]"
        />
      </div>

      {/* Historia psiquiátrica */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Historia psiquiátrica previa
        </label>
        <textarea
          value={datos.historiaClinica?.historiaPsiquiatrica || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            historiaPsiquiatrica: e.target.value
          })}
          placeholder="Diagnósticos previos, hospitalizaciones, tratamientos farmacológicos, psicoterapias anteriores..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
        />
      </div>

      {/* Estado mental actual */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-3">Estado mental actual (examen mental)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Apariencia y comportamiento
            </label>
            <textarea
              value={datos.estadoMental || ''}
              onChange={(e) => handleChange('estadoMental', e.target.value)}
              placeholder="Apariencia, actitud, comportamiento motor, contacto visual..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ánimo y afecto
            </label>
            <textarea
              value={datos.estadoEmocional || ''}
              onChange={(e) => handleChange('estadoEmocional', e.target.value)}
              placeholder="Estado de ánimo predominante, reactividad afectiva, congruencia..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}