// ============================================================================
// saludvalpa 3.0 - PLAN NUTRICIONAL PERSONALIZADO
// Sistema de planes de alimentación personalizados según necesidades
// ============================================================================

import { useState, useEffect } from 'react';
import type { DatosNutricion } from '../../../types';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface PlanNutricionalProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function PlanNutricional({ datos, onChange }: PlanNutricionalProps) {
  const [plan, setPlan] = useState(datos.planNutricional || {
    requerimientos: {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    },
    distribucionComidas: {
      desayuno: '',
      colacion1: '',
      comida: '',
      colacion2: '',
      cena: '',
    },
    recomendacionesEspecificas: [],
  });

  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  // Calcular requerimientos basados en datos antropométricos si están disponibles
  useEffect(() => {
    if (datos.evaluacionNutricional?.antropometria) {
      const { peso } = datos.evaluacionNutricional.antropometria;
      
      if (peso > 0) {
        // Fórmula básica para calcular calorías (Harris-Benedict simplificado)
        const caloriasBase = peso * 30; // Estimación básica
        const proteinasBase = peso * 1.8; // g/kg para actividad moderada
        const carbohidratosBase = (caloriasBase * 0.5) / 4; // 50% de calorías
        const grasasBase = (caloriasBase * 0.3) / 9; // 30% de calorías
        
        setPlan(prev => ({
          ...prev,
          requerimientos: {
            calorias: Math.round(caloriasBase),
            proteinas: Math.round(proteinasBase),
            carbohidratos: Math.round(carbohidratosBase),
            grasas: Math.round(grasasBase),
          }
        }));
      }
    }
  }, [datos.evaluacionNutricional?.antropometria]);

  // Actualizar datos principales cuando cambia el plan
  useEffect(() => {
    onChange({
      ...datos,
      planNutricional: plan
    });
  }, [plan]);

  const handleRequerimientoChange = (nutriente: keyof typeof plan.requerimientos, valor: number) => {
    setPlan(prev => ({
      ...prev,
      requerimientos: {
        ...prev.requerimientos,
        [nutriente]: valor
      }
    }));
  };

  const handleComidaChange = (comida: keyof typeof plan.distribucionComidas, valor: string) => {
    setPlan(prev => ({
      ...prev,
      distribucionComidas: {
        ...prev.distribucionComidas,
        [comida]: valor
      }
    }));
  };

  const agregarRecomendacion = () => {
    if (nuevaRecomendacion.trim()) {
      setPlan(prev => ({
        ...prev,
        recomendacionesEspecificas: [...prev.recomendacionesEspecificas, nuevaRecomendacion.trim()]
      }));
      setNuevaRecomendacion('');
    }
  };

  const eliminarRecomendacion = (index: number) => {
    setPlan(prev => ({
      ...prev,
      recomendacionesEspecificas: prev.recomendacionesEspecificas.filter((_, i) => i !== index)
    }));
  };

  const calcularDistribucion = () => {
    const { calorias } = plan.requerimientos;
    
    if (calorias > 0) {
      // Distribución estándar de calorías por comida
      const desayuno = Math.round(calorias * 0.25);
      const colacion1 = Math.round(calorias * 0.1);
      const comida = Math.round(calorias * 0.35);
      const colacion2 = Math.round(calorias * 0.1);
      const cena = Math.round(calorias * 0.2);
      
      setPlan(prev => ({
        ...prev,
        distribucionComidas: {
          desayuno: `Aprox. ${desayuno} kcal`,
          colacion1: `Aprox. ${colacion1} kcal`,
          comida: `Aprox. ${comida} kcal`,
          colacion2: `Aprox. ${colacion2} kcal`,
          cena: `Aprox. ${cena} kcal`,
        }
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Sección: Requerimientos Nutricionales */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">⚖️ Requerimientos Nutricionales Diarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Calorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calorías (kcal)
            </label>
            <Input
              type="number"
              value={plan.requerimientos.calorias || ''}
              onChange={(e) => handleRequerimientoChange('calorias', parseInt(e.target.value) || 0)}
              placeholder="Ej: 2000"
            />
          </div>

          {/* Proteínas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proteínas (g)
            </label>
            <Input
              type="number"
              value={plan.requerimientos.proteinas || ''}
              onChange={(e) => handleRequerimientoChange('proteinas', parseInt(e.target.value) || 0)}
              placeholder="Ej: 120"
            />
          </div>

          {/* Carbohidratos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbohidratos (g)
            </label>
            <Input
              type="number"
              value={plan.requerimientos.carbohidratos || ''}
              onChange={(e) => handleRequerimientoChange('carbohidratos', parseInt(e.target.value) || 0)}
              placeholder="Ej: 250"
            />
          </div>

          {/* Grasas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grasas (g)
            </label>
            <Input
              type="number"
              value={plan.requerimientos.grasas || ''}
              onChange={(e) => handleRequerimientoChange('grasas', parseInt(e.target.value) || 0)}
              placeholder="Ej: 65"
            />
          </div>
        </div>

        {/* Distribución porcentual */}
        {plan.requerimientos.calorias > 0 && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Distribución de Macronutrientes</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Proteínas</span>
                <span className="font-medium text-blue-600">
                  {((plan.requerimientos.proteinas * 4) / plan.requerimientos.calorias * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Carbohidratos</span>
                <span className="font-medium text-green-600">
                  {((plan.requerimientos.carbohidratos * 4) / plan.requerimientos.calorias * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Grasas</span>
                <span className="font-medium text-yellow-600">
                  {((plan.requerimientos.grasas * 9) / plan.requerimientos.calorias * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección: Distribución de Comidas */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">🍽️ Distribución de Comidas</h3>
        
        <div className="mb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={calcularDistribucion}
            disabled={plan.requerimientos.calorias === 0}
          >
            Calcular Distribución Automática
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Calcula la distribución calórica recomendada basada en los requerimientos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Desayuno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desayuno
            </label>
            <textarea
              value={plan.distribucionComidas.desayuno}
              onChange={(e) => handleComidaChange('desayuno', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 2 huevos, 1 rebanada de pan integral, 1 fruta..."
            />
          </div>

          {/* Colación 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colación Mañana
            </label>
            <textarea
              value={plan.distribucionComidas.colacion1}
              onChange={(e) => handleComidaChange('colacion1', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 1 yogurt, 10 almendras..."
            />
          </div>

          {/* Comida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comida
            </label>
            <textarea
              value={plan.distribucionComidas.comida}
              onChange={(e) => handleComidaChange('comida', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 150g de pollo, 1 taza de arroz, ensalada..."
            />
          </div>

          {/* Colación 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colación Tarde
            </label>
            <textarea
              value={plan.distribucionComidas.colacion2}
              onChange={(e) => handleComidaChange('colacion2', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 1 fruta, 1 rebanada de queso..."
            />
          </div>

          {/* Cena */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cena
            </label>
            <textarea
              value={plan.distribucionComidas.cena}
              onChange={(e) => handleComidaChange('cena', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 120g de pescado, vegetales al vapor..."
            />
          </div>
        </div>
      </div>

      {/* Sección: Recomendaciones Específicas */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">💡 Recomendaciones Específicas</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar recomendación específica
          </label>
          <div className="flex gap-2">
            <Input
              value={nuevaRecomendacion}
              onChange={(e) => setNuevaRecomendacion(e.target.value)}
              placeholder="Ej: Consumir 2L de agua diario, Evitar alimentos procesados..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarRecomendacion}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de recomendaciones */}
        {plan.recomendacionesEspecificas.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Recomendaciones registradas:</h4>
            <ul className="space-y-2">
              {plan.recomendacionesEspecificas.map((recomendacion, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700">{recomendacion}</span>
                  <button
                    type="button"
                    onClick={() => eliminarRecomendacion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay recomendaciones registradas aún.</p>
        )}
      </div>

      {/* Resumen del Plan */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumen del Plan Nutricional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Requerimientos Diarios</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Calorías: {plan.requerimientos.calorias || 'No definidas'} kcal</li>
              <li>• Proteínas: {plan.requerimientos.proteinas || 'No definidas'} g</li>
              <li>• Carbohidratos: {plan.requerimientos.carbohidratos || 'No definidas'} g</li>
              <li>• Grasas: {plan.requerimientos.grasas || 'No definidas'} g</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Distribución de Comidas</h4>
            <p className="text-sm text-gray-600">
              {Object.values(plan.distribucionComidas).filter(v => v.trim()).length} comida(s) definida(s)
            </p>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Recomendaciones</h4>
            <p className="text-sm text-gray-600">
              {plan.recomendacionesEspecificas.length} recomendación(es) específica(s)
            </p>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Estado del Plan</h4>
            <p className="text-sm text-gray-600">
              {plan.requerimientos.calorias > 0 ? 'Plan completo' : 'Plan en desarrollo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}