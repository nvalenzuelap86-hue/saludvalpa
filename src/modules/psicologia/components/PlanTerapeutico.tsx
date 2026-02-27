// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE PLAN TERAPÉUTICO PSICOLÓGICO
// ============================================================================

import { useState } from 'react';
import type { DatosPsicologia } from '../../../types';

interface PlanTerapeuticoProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
}

export default function PlanTerapeutico({ datos, onChange }: PlanTerapeuticoProps) {
  const [nuevoObjetivo, setNuevoObjetivo] = useState('');
  const [nuevaTecnica, setNuevaTecnica] = useState('');
  const [escalaSeleccionada, setEscalaSeleccionada] = useState('PHQ-9');

  const handleChange = (campo: keyof DatosPsicologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const agregarObjetivo = () => {
    if (!nuevoObjetivo.trim()) return;
    
    const plan = datos.planTerapeutico || {
      objetivosEspecificos: [],
      tecnicasTerapeuticas: [],
      frecuenciaSesiones: '',
      duracionEstimada: ''
    };
    
    handleChange('planTerapeutico', {
      ...plan,
      objetivosEspecificos: [...plan.objetivosEspecificos, nuevoObjetivo]
    });
    
    setNuevoObjetivo('');
  };

  const eliminarObjetivo = (indice: number) => {
    const plan = datos.planTerapeutico;
    if (!plan) return;
    
    handleChange('planTerapeutico', {
      ...plan,
      objetivosEspecificos: plan.objetivosEspecificos.filter((_, i) => i !== indice)
    });
  };

  const agregarTecnica = () => {
    if (!nuevaTecnica.trim()) return;
    
    const plan = datos.planTerapeutico || {
      objetivosEspecificos: [],
      tecnicasTerapeuticas: [],
      frecuenciaSesiones: '',
      duracionEstimada: ''
    };
    
    handleChange('planTerapeutico', {
      ...plan,
      tecnicasTerapeuticas: [...plan.tecnicasTerapeuticas, nuevaTecnica]
    });
    
    setNuevaTecnica('');
  };

  const eliminarTecnica = (indice: number) => {
    const plan = datos.planTerapeutico;
    if (!plan) return;
    
    handleChange('planTerapeutico', {
      ...plan,
      tecnicasTerapeuticas: plan.tecnicasTerapeuticas.filter((_, i) => i !== indice)
    });
  };

  const escalasPsicologicas = [
    { id: 'PHQ-9', nombre: 'PHQ-9 (Depresión)', rango: '0-27' },
    { id: 'GAD-7', nombre: 'GAD-7 (Ansiedad)', rango: '0-21' },
    { id: 'BDI-II', nombre: 'BDI-II (Beck Depression Inventory)', rango: '0-63' },
    { id: 'BAI', nombre: 'BAI (Beck Anxiety Inventory)', rango: '0-63' },
    { id: 'PSS', nombre: 'PSS (Perceived Stress Scale)', rango: '0-40' },
    { id: 'IES-R', nombre: 'IES-R (Impact of Event Scale)', rango: '0-88' },
    { id: 'WHO-5', nombre: 'WHO-5 (Bienestar)', rango: '0-25' }
  ];

  const objetivosComunes = [
    'Reducir síntomas de ansiedad en un 50% en 3 meses',
    'Mejorar habilidades de regulación emocional',
    'Aumentar actividades placenteras a 3 por semana',
    'Mejorar patrones de sueño (7-8 horas por noche)',
    'Reducir pensamientos negativos automáticos'
  ];

  const tecnicasComunes = [
    'Reestructuración cognitiva',
    'Exposición gradual',
    'Mindfulness y meditación',
    'Relajación progresiva de Jacobson',
    'Técnicas de respiración diafragmática',
    'Psicoeducación sobre el trastorno',
    'Registro de pensamientos automáticos'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Plan Terapéutico Psicológico</h3>
        <p className="text-sm text-green-600">
          Defina objetivos, técnicas y realice seguimiento de síntomas mediante escalas validadas.
        </p>
      </div>

      {/* Sección: Objetivos terapéuticos */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">1. Objetivos terapéuticos específicos</h4>
        
        {/* Lista de objetivos */}
        {datos.planTerapeutico?.objetivosEspecificos && datos.planTerapeutico.objetivosEspecificos.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.planTerapeutico.objetivosEspecificos.map((objetivo, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                <div className="flex-1">
                  <div className="font-medium text-green-800">{objetivo}</div>
                </div>
                <button
                  onClick={() => eliminarObjetivo(idx)}
                  className="ml-4 text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar nuevo objetivo */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevoObjetivo}
              onChange={(e) => setNuevoObjetivo(e.target.value)}
              placeholder="Nuevo objetivo terapéutico..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={agregarObjetivo}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Objetivos comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Objetivos comunes:</p>
          <div className="flex flex-wrap gap-2">
            {objetivosComunes.map((objetivo) => (
              <button
                key={objetivo}
                onClick={() => setNuevoObjetivo(objetivo)}
                className="px-3 py-1.5 bg-white border border-green-200 hover:bg-green-50 text-green-700 text-xs rounded"
              >
                {objetivo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sección: Técnicas terapéuticas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">2. Técnicas terapéuticas a utilizar</h4>
        
        {/* Lista de técnicas */}
        {datos.planTerapeutico?.tecnicasTerapeuticas && datos.planTerapeutico.tecnicasTerapeuticas.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.planTerapeutico.tecnicasTerapeuticas.map((tecnica, idx) => (
              <div key={idx} className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <div className="flex-1">
                  <div className="font-medium text-blue-800">{tecnica}</div>
                </div>
                <button
                  onClick={() => eliminarTecnica(idx)}
                  className="ml-4 text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar nueva técnica */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevaTecnica}
              onChange={(e) => setNuevaTecnica(e.target.value)}
              placeholder="Nueva técnica terapéutica..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={agregarTecnica}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Técnicas comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Técnicas comunes:</p>
          <div className="flex flex-wrap gap-2">
            {tecnicasComunes.map((tecnica) => (
              <button
                key={tecnica}
                onClick={() => setNuevaTecnica(tecnica)}
                className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs rounded"
              >
                {tecnica}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sección: Parámetros del tratamiento */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">3. Parámetros del tratamiento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de sesiones
            </label>
            <select
              value={datos.planTerapeutico?.frecuenciaSesiones || ''}
              onChange={(e) => handleChange('planTerapeutico', {
                ...(datos.planTerapeutico || { objetivosEspecificos: [], tecnicasTerapeuticas: [] }),
                frecuenciaSesiones: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar frecuencia...</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración estimada
            </label>
            <input
              type="text"
              value={datos.planTerapeutico?.duracionEstimada || ''}
              onChange={(e) => handleChange('planTerapeutico', {
                ...(datos.planTerapeutico || { objetivosEspecificos: [], tecnicasTerapeuticas: [] }),
                duracionEstimada: e.target.value
              })}
              placeholder="Ej: 6 meses, 12 sesiones..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Sección: Escalas psicológicas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">4. Escalas psicológicas para seguimiento</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar escala
            </label>
            <select
              value={escalaSeleccionada}
              onChange={(e) => setEscalaSeleccionada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {escalasPsicologicas.map((escala) => (
                <option key={escala.id} value={escala.id}>
                  {escala.nombre} ({escala.rango})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información sobre escalas
            </label>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium mb-1">Escalas psicológicas validadas:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>PHQ-9:</strong> Evaluación de síntomas depresivos (0-27 puntos)</li>
                <li><strong>GAD-7:</strong> Evaluación de síntomas de ansiedad (0-21 puntos)</li>
                <li><strong>BDI-II:</strong> Inventario de depresión de Beck (0-63 puntos)</li>
                <li><strong>BAI:</strong> Inventario de ansiedad de Beck (0-63 puntos)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}