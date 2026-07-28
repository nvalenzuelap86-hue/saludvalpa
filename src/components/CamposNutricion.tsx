// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE NUTRICIÓN
// Componente principal para formularios de sesión en nutrición
// ============================================================================

import { useState } from 'react';
import type { DatosNutricion } from '../types';

interface CamposNutricionProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function CamposNutricion({ datos, onChange }: CamposNutricionProps) {
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  const handleChange = (campo: keyof DatosNutricion, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const actualizarAntropometria = (campo: string, valor: number) => {
    const evaluacion = { ...datos.evaluacionNutricional };
    evaluacion.antropometria = {
      ...evaluacion.antropometria,
      peso: evaluacion.antropometria?.peso || 0,
      talla: evaluacion.antropometria?.talla || 0,
      imc: evaluacion.antropometria?.imc || 0,
      circunferenciaCintura: evaluacion.antropometria?.circunferenciaCintura || 0,
      [campo]: valor,
    };
    handleChange('evaluacionNutricional', evaluacion);
  };

  const actualizarDistribucion = (comida: keyof NonNullable<DatosNutricion['planNutricional']>['distribucionComidas'], valor: string) => {
    const plan = { ...datos.planNutricional } as NonNullable<DatosNutricion['planNutricional']>;
    plan.distribucionComidas = {
      ...plan.distribucionComidas,
      [comida]: valor,
    };
    handleChange('planNutricional', plan);
  };

  const actualizarRequerimiento = (nutriente: keyof NonNullable<DatosNutricion['planNutricional']>['requerimientos'], valor: number) => {
    const plan = { ...datos.planNutricional } as NonNullable<DatosNutricion['planNutricional']>;
    plan.requerimientos = {
      ...plan.requerimientos,
      [nutriente]: valor,
    };
    handleChange('planNutricional', plan);
  };

  const agregarRecomendacion = () => {
    if (!nuevaRecomendacion.trim()) return;
    const plan = { ...datos.planNutricional } as NonNullable<DatosNutricion['planNutricional']>;
    plan.recomendacionesEspecificas = [...(plan.recomendacionesEspecificas || []), nuevaRecomendacion];
    handleChange('planNutricional', plan);
    setNuevaRecomendacion('');
  };

  const eliminarRecomendacion = (indice: number) => {
    const plan = { ...datos.planNutricional } as NonNullable<DatosNutricion['planNutricional']>;
    plan.recomendacionesEspecificas = (plan.recomendacionesEspecificas || []).filter((_, i) => i !== indice);
    handleChange('planNutricional', plan);
  };

  const antropometria = datos.evaluacionNutricional?.antropometria;
  const planNutricional = datos.planNutricional;

  return (
    <div className="space-y-6">
      {/* Evaluación nutricional rápida */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Evaluación nutricional</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso actual (kg)</label>
            <input
              type="number"
              step="0.1"
              value={antropometria?.peso || ''}
              onChange={(e) => actualizarAntropometria('peso', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 70.5"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Talla (cm)</label>
            <input
              type="number"
              step="0.5"
              value={antropometria?.talla || ''}
              onChange={(e) => actualizarAntropometria('talla', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 165"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IMC</label>
            <input
              type="number"
              step="0.1"
              value={antropometria?.imc || ''}
              onChange={(e) => actualizarAntropometria('imc', parseFloat(e.target.value) || 0)}
              placeholder="Calculado automáticamente"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Circunferencia cintura (cm)</label>
            <input
              type="number"
              step="0.5"
              value={antropometria?.circunferenciaCintura || ''}
              onChange={(e) => actualizarAntropometria('circunferenciaCintura', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 80"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
        </div>
      </div>

      {/* Distribución de comidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Distribución de comidas</h3>
        
        <div className="space-y-3">
          {([
            { key: 'desayuno' as const, label: 'Desayuno', icon: '🌅' },
            { key: 'colacion1' as const, label: 'Colación matutina', icon: '🍎' },
            { key: 'comida' as const, label: 'Comida', icon: '🍽️' },
            { key: 'colacion2' as const, label: 'Colación vespertina', icon: '🥜' },
            { key: 'cena' as const, label: 'Cena', icon: '🌙' },
          ]).map(({ key, label, icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {icon} {label}
              </label>
              <textarea
                value={planNutricional?.distribucionComidas?.[key] || ''}
                onChange={(e) => actualizarDistribucion(key, e.target.value)}
                placeholder={`Describir ${label.toLowerCase()}...`}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Requerimientos calóricos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Requerimientos calóricos</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calorías diarias</label>
            <input
              type="number"
              value={planNutricional?.requerimientos?.calorias || ''}
              onChange={(e) => actualizarRequerimiento('calorias', parseInt(e.target.value) || 0)}
              placeholder="Ej: 2000"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g)</label>
            <input
              type="number"
              value={planNutricional?.requerimientos?.proteinas || ''}
              onChange={(e) => actualizarRequerimiento('proteinas', parseInt(e.target.value) || 0)}
              placeholder="Ej: 80"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carbohidratos (g)</label>
            <input
              type="number"
              value={planNutricional?.requerimientos?.carbohidratos || ''}
              onChange={(e) => actualizarRequerimiento('carbohidratos', parseInt(e.target.value) || 0)}
              placeholder="Ej: 250"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grasas (g)</label>
            <input
              type="number"
              value={planNutricional?.requerimientos?.grasas || ''}
              onChange={(e) => actualizarRequerimiento('grasas', parseInt(e.target.value) || 0)}
              placeholder="Ej: 65"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            />
          </div>
        </div>
      </div>

      {/* Recomendaciones específicas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones específicas</h3>
        
        {planNutricional?.recomendacionesEspecificas && planNutricional.recomendacionesEspecificas.length > 0 && (
          <div className="space-y-1 mb-2">
            {planNutricional.recomendacionesEspecificas.map((rec, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded">
                <span className="text-sm">{rec}</span>
                <button
                  onClick={() => eliminarRecomendacion(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaRecomendacion}
            onChange={(e) => setNuevaRecomendacion(e.target.value)}
            placeholder="Ej: Aumentar consumo de fibra, Reducir sodio..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarRecomendacion()}
          />
          <button
            onClick={agregarRecomendacion}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Recomendaciones predefinidas (botones rápidos) */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Recomendaciones comunes (click para agregar):</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Aumentar consumo de agua (2-3L/día)',
            'Reducir consumo de sodio',
            'Incrementar fibra dietética',
            'Evitar azúcares refinados',
            'Consumir proteínas magras',
            'Incluir grasas saludables (aguacate, nueces)',
            'Priorizar carbohidratos complejos',
            'Realizar 5 comidas al día',
            'No saltarse el desayuno',
            'Cenar 2-3 horas antes de dormir',
          ].map((rec) => (
            <button
              key={rec}
              onClick={() => {
                const plan = { ...datos.planNutricional } as NonNullable<DatosNutricion['planNutricional']>;
                if (!(plan.recomendacionesEspecificas || []).includes(rec)) {
                  plan.recomendacionesEspecificas = [...(plan.recomendacionesEspecificas || []), rec];
                  handleChange('planNutricional', plan);
                }
              }}
              className="px-2 py-1 bg-gray-100 hover:bg-saludvalpa-blue hover:text-white text-xs rounded transition-colors"
            >
              {rec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
