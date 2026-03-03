// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE NUTRICIÓN
// ============================================================================

import { useState } from 'react';
import type { DatosNutricion } from '../types';

interface CamposNutricionProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function CamposNutricion({ datos, onChange }: CamposNutricionProps) {
  const [nuevoHabito, setNuevoHabito] = useState('');
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [nuevaPreferencia, setNuevaPreferencia] = useState('');

  const handleChange = (campo: keyof DatosNutricion, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  // -------------------------------------------------------------------------
  // HÁBITOS ALIMENTICIOS
  // -------------------------------------------------------------------------
  const agregarHabito = () => {
    if (!nuevoHabito.trim()) return;
    const habitos = datos.evaluacionNutricional?.habitosAlimenticios || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      habitosAlimenticios: [...habitos, nuevoHabito],
    });
    setNuevoHabito('');
  };

  const eliminarHabito = (indice: number) => {
    const habitos = datos.evaluacionNutricional?.habitosAlimenticios || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      habitosAlimenticios: habitos.filter((_, i) => i !== indice),
    });
  };

  // -------------------------------------------------------------------------
  // ALERGIAS ALIMENTARIAS
  // -------------------------------------------------------------------------
  const agregarAlergia = () => {
    if (!nuevaAlergia.trim()) return;
    const alergias = datos.evaluacionNutricional?.alergiasAlimentarias || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      alergiasAlimentarias: [...alergias, nuevaAlergia],
    });
    setNuevaAlergia('');
  };

  const eliminarAlergia = (indice: number) => {
    const alergias = datos.evaluacionNutricional?.alergiasAlimentarias || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      alergiasAlimentarias: alergias.filter((_, i) => i !== indice),
    });
  };

  // -------------------------------------------------------------------------
  // PREFERENCIAS ALIMENTARIAS
  // -------------------------------------------------------------------------
  const agregarPreferencia = () => {
    if (!nuevaPreferencia.trim()) return;
    const preferencias = datos.evaluacionNutricional?.preferenciasAlimentarias || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      preferenciasAlimentarias: [...preferencias, nuevaPreferencia],
    });
    setNuevaPreferencia('');
  };

  const eliminarPreferencia = (indice: number) => {
    const preferencias = datos.evaluacionNutricional?.preferenciasAlimentarias || [];
    handleChange('evaluacionNutricional', {
      ...datos.evaluacionNutricional,
      preferenciasAlimentarias: preferencias.filter((_, i) => i !== indice),
    });
  };

  return (
    <div className="space-y-4">
      {/* Antropometría básica */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={datos.evaluacionNutricional?.antropometria?.peso || 0}
            onChange={(e) => handleChange('evaluacionNutricional', {
              ...datos.evaluacionNutricional,
              antropometria: {
                ...datos.evaluacionNutricional?.antropometria,
                peso: parseFloat(e.target.value) || 0,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: 65.5"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Talla (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={datos.evaluacionNutricional?.antropometria?.talla || 0}
            onChange={(e) => handleChange('evaluacionNutricional', {
              ...datos.evaluacionNutricional,
              antropometria: {
                ...datos.evaluacionNutricional?.antropometria,
                talla: parseFloat(e.target.value) || 0,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: 170"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            IMC
          </label>
          <input
            type="number"
            step="0.1"
            value={datos.evaluacionNutricional?.antropometria?.imc || 0}
            onChange={(e) => handleChange('evaluacionNutricional', {
              ...datos.evaluacionNutricional,
              antropometria: {
                ...datos.evaluacionNutricional?.antropometria,
                imc: parseFloat(e.target.value) || 0,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Calculado automáticamente"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Circunferencia cintura (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={datos.evaluacionNutricional?.antropometria?.circunferenciaCintura || 0}
            onChange={(e) => handleChange('evaluacionNutricional', {
              ...datos.evaluacionNutricional,
              antropometria: {
                ...datos.evaluacionNutricional?.antropometria,
                circunferenciaCintura: parseFloat(e.target.value) || 0,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: 85"
          />
        </div>
      </div>

      {/* Hábitos alimenticios */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">🍽️ Hábitos alimenticios</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nuevoHabito}
            onChange={(e) => setNuevoHabito(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: Desayuna todos los días"
          />
          <button
            type="button"
            onClick={agregarHabito}
            className="px-3 py-2 bg-saludvalpa-green text-white rounded hover:bg-saludvalpa-green/90 text-sm font-medium"
          >
            + Agregar
          </button>
        </div>
        <div className="space-y-1">
          {datos.evaluacionNutricional?.habitosAlimenticios?.map((habito, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span className="text-sm">{habito}</span>
              <button
                type="button"
                onClick={() => eliminarHabito(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alergias alimentarias */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">⚠️ Alergias alimentarias</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nuevaAlergia}
            onChange={(e) => setNuevaAlergia(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: Lactosa, gluten, etc."
          />
          <button
            type="button"
            onClick={agregarAlergia}
            className="px-3 py-2 bg-saludvalpa-green text-white rounded hover:bg-saludvalpa-green/90 text-sm font-medium"
          >
            + Agregar
          </button>
        </div>
        <div className="space-y-1">
          {datos.evaluacionNutricional?.alergiasAlimentarias?.map((alergia, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span className="text-sm">{alergia}</span>
              <button
                type="button"
                onClick={() => eliminarAlergia(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferencias alimentarias */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">❤️ Preferencias alimentarias</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nuevaPreferencia}
            onChange={(e) => setNuevaPreferencia(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Ej: Vegetariano, sin azúcar, etc."
          />
          <button
            type="button"
            onClick={agregarPreferencia}
            className="px-3 py-2 bg-saludvalpa-green text-white rounded hover:bg-saludvalpa-green/90 text-sm font-medium"
          >
            + Agregar
          </button>
        </div>
        <div className="space-y-1">
          {datos.evaluacionNutricional?.preferenciasAlimentarias?.map((preferencia: string, index: number) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span className="text-sm">{preferencia}</span>
              <button
                type="button"
                onClick={() => eliminarPreferencia(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Requerimientos nutricionales */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Requerimientos nutricionales</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Calorías (kcal)
            </label>
            <input
              type="number"
              value={datos.planNutricional?.requerimientos?.calorias || 0}
              onChange={(e) => handleChange('planNutricional', {
                ...datos.planNutricional,
                requerimientos: {
                  ...datos.planNutricional?.requerimientos,
                  calorias: parseInt(e.target.value) || 0,
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Proteínas (g)
            </label>
            <input
              type="number"
              value={datos.planNutricional?.requerimientos?.proteinas || 0}
              onChange={(e) => handleChange('planNutricional', {
                ...datos.planNutricional,
                requerimientos: {
                  ...datos.planNutricional?.requerimientos,
                  proteinas: parseInt(e.target.value) || 0,
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Carbohidratos (g)
            </label>
            <input
              type="number"
              value={datos.planNutricional?.requerimientos?.carbohidratos || 0}
              onChange={(e) => handleChange('planNutricional', {
                ...datos.planNutricional,
                requerimientos: {
                  ...datos.planNutricional?.requerimientos,
                  carbohidratos: parseInt(e.target.value) || 0,
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Grasas (g)
            </label>
            <input
              type="number"
              value={datos.planNutricional?.requerimientos?.grasas || 0}
              onChange={(e) => handleChange('planNutricional', {
                ...datos.planNutricional,
                requerimientos: {
                  ...datos.planNutricional?.requerimientos,
                  grasas: parseInt(e.target.value) || 0,
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}