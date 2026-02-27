// ============================================================================
// saludvalpa 3.0 - EVALUACIÓN NUTRICIONAL COMPLETA
// Formulario completo para evaluación nutricional clínica
// ============================================================================

import { useState, useEffect } from 'react';
import type { DatosNutricion } from '../../../types';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface EvaluacionNutricionalProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function EvaluacionNutricional({ datos, onChange }: EvaluacionNutricionalProps) {
  const [evaluacion, setEvaluacion] = useState(datos.evaluacionNutricional || {
    antropometria: {
      peso: 0,
      talla: 0,
      imc: 0,
      circunferenciaCintura: 0,
      plieguesCutaneos: {}
    },
    habitosAlimenticios: [],
    alergiasAlimentarias: [],
    preferenciasAlimentarias: []
  });

  const [nuevoHabito, setNuevoHabito] = useState('');
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [nuevaPreferencia, setNuevaPreferencia] = useState('');

  // Calcular IMC automáticamente cuando cambian peso o talla
  useEffect(() => {
    if (evaluacion.antropometria.peso > 0 && evaluacion.antropometria.talla > 0) {
      const tallaMetros = evaluacion.antropometria.talla / 100;
      const imcCalculado = evaluacion.antropometria.peso / (tallaMetros * tallaMetros);
      
      setEvaluacion(prev => ({
        ...prev,
        antropometria: {
          ...prev.antropometria,
          imc: parseFloat(imcCalculado.toFixed(1))
        }
      }));
    }
  }, [evaluacion.antropometria.peso, evaluacion.antropometria.talla]);

  // Actualizar datos principales cuando cambia la evaluación
  useEffect(() => {
    onChange({
      ...datos,
      evaluacionNutricional: evaluacion
    });
  }, [evaluacion]);

  const handleAntropometriaChange = (campo: keyof typeof evaluacion.antropometria, valor: number) => {
    setEvaluacion(prev => ({
      ...prev,
      antropometria: {
        ...prev.antropometria,
        [campo]: valor
      }
    }));
  };

  const agregarHabito = () => {
    if (nuevoHabito.trim()) {
      setEvaluacion(prev => ({
        ...prev,
        habitosAlimenticios: [...prev.habitosAlimenticios, nuevoHabito.trim()]
      }));
      setNuevoHabito('');
    }
  };

  const eliminarHabito = (index: number) => {
    setEvaluacion(prev => ({
      ...prev,
      habitosAlimenticios: prev.habitosAlimenticios.filter((_, i) => i !== index)
    }));
  };

  const agregarAlergia = () => {
    if (nuevaAlergia.trim()) {
      setEvaluacion(prev => ({
        ...prev,
        alergiasAlimentarias: [...prev.alergiasAlimentarias, nuevaAlergia.trim()]
      }));
      setNuevaAlergia('');
    }
  };

  const eliminarAlergia = (index: number) => {
    setEvaluacion(prev => ({
      ...prev,
      alergiasAlimentarias: prev.alergiasAlimentarias.filter((_, i) => i !== index)
    }));
  };

  const agregarPreferencia = () => {
    if (nuevaPreferencia.trim()) {
      setEvaluacion(prev => ({
        ...prev,
        preferenciasAlimentarias: [...prev.preferenciasAlimentarias, nuevaPreferencia.trim()]
      }));
      setNuevaPreferencia('');
    }
  };

  const eliminarPreferencia = (index: number) => {
    setEvaluacion(prev => ({
      ...prev,
      preferenciasAlimentarias: prev.preferenciasAlimentarias.filter((_, i) => i !== index)
    }));
  };

  const interpretarIMC = (imc: number) => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad grado I';
    if (imc < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  };

  return (
    <div className="space-y-8">
      {/* Sección: Antropometría */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">📏 Antropometría</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={evaluacion.antropometria.peso || ''}
              onChange={(e) => handleAntropometriaChange('peso', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 68.5"
            />
          </div>

          {/* Talla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talla (cm)
            </label>
            <Input
              type="number"
              value={evaluacion.antropometria.talla || ''}
              onChange={(e) => handleAntropometriaChange('talla', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 170"
            />
          </div>

          {/* IMC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IMC
            </label>
            <div className="flex items-center">
              <Input
                type="number"
                step="0.1"
                value={evaluacion.antropometria.imc || ''}
                readOnly
                className="bg-gray-100"
              />
              {evaluacion.antropometria.imc > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                  evaluacion.antropometria.imc < 18.5 ? 'bg-blue-100 text-blue-800' :
                  evaluacion.antropometria.imc < 25 ? 'bg-green-100 text-green-800' :
                  evaluacion.antropometria.imc < 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {interpretarIMC(evaluacion.antropometria.imc)}
                </span>
              )}
            </div>
          </div>

          {/* Circunferencia de cintura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cintura (cm)
            </label>
            <Input
              type="number"
              value={evaluacion.antropometria.circunferenciaCintura || ''}
              onChange={(e) => handleAntropometriaChange('circunferenciaCintura', parseFloat(e.target.value) || 0)}
              placeholder="Ej: 85"
            />
          </div>
        </div>

        {/* Interpretación de medidas */}
        {evaluacion.antropometria.imc > 0 && (
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-medium text-gray-700 mb-1">Interpretación:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• IMC: {evaluacion.antropometria.imc} ({interpretarIMC(evaluacion.antropometria.imc)})</li>
              {evaluacion.antropometria.circunferenciaCintura > 0 && (
                <li>• Circunferencia de cintura: {evaluacion.antropometria.circunferenciaCintura} cm</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Sección: Hábitos Alimenticios */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">🍽️ Hábitos Alimenticios</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar hábito alimenticio
          </label>
          <div className="flex gap-2">
            <Input
              value={nuevoHabito}
              onChange={(e) => setNuevoHabito(e.target.value)}
              placeholder="Ej: Desayuna todos los días, Consume 2L de agua diario..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarHabito}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de hábitos */}
        {evaluacion.habitosAlimenticios.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Hábitos registrados:</h4>
            <ul className="space-y-2">
              {evaluacion.habitosAlimenticios.map((habito, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700">{habito}</span>
                  <button
                    type="button"
                    onClick={() => eliminarHabito(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay hábitos registrados aún.</p>
        )}
      </div>

      {/* Sección: Alergias Alimentarias */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Alergias e Intolerancias Alimentarias</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar alergia o intolerancia
          </label>
          <div className="flex gap-2">
            <Input
              value={nuevaAlergia}
              onChange={(e) => setNuevaAlergia(e.target.value)}
              placeholder="Ej: Lactosa, Gluten, Mariscos, Frutos secos..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarAlergia}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de alergias */}
        {evaluacion.alergiasAlimentarias.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Alergias registradas:</h4>
            <ul className="space-y-2">
              {evaluacion.alergiasAlimentarias.map((alergia, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700">{alergia}</span>
                  <button
                    type="button"
                    onClick={() => eliminarAlergia(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay alergias registradas.</p>
        )}
      </div>

      {/* Sección: Preferencias Alimentarias */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">❤️ Preferencias Alimentarias</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar preferencia alimentaria
          </label>
          <div className="flex gap-2">
            <Input
              value={nuevaPreferencia}
              onChange={(e) => setNuevaPreferencia(e.target.value)}
              placeholder="Ej: Vegetariano, Sin azúcar, Bajo en sodio..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarPreferencia}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de preferencias */}
        {evaluacion.preferenciasAlimentarias.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Preferencias registradas:</h4>
            <ul className="space-y-2">
              {evaluacion.preferenciasAlimentarias.map((preferencia, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700">{preferencia}</span>
                  <button
                    type="button"
                    onClick={() => eliminarPreferencia(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay preferencias registradas.</p>
        )}
      </div>

      {/* Resumen de evaluación */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumen de Evaluación Nutricional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Antropometría</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Peso: {evaluacion.antropometria.peso || 'No registrado'} kg</li>
              <li>• Talla: {evaluacion.antropometria.talla || 'No registrado'} cm</li>
              <li>• IMC: {evaluacion.antropometria.imc || 'No calculado'}</li>
              <li>• Cintura: {evaluacion.antropometria.circunferenciaCintura || 'No registrada'} cm</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Hábitos</h4>
            <p className="text-sm text-gray-600">
              {evaluacion.habitosAlimenticios.length} hábito(s) registrado(s)
            </p>
            {evaluacion.habitosAlimenticios.length > 0 && (
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                {evaluacion.habitosAlimenticios.slice(0, 3).map((habito, idx) => (
                  <li key={idx}>• {habito}</li>
                ))}
                {evaluacion.habitosAlimenticios.length > 3 && (
                  <li>... y {evaluacion.habitosAlimenticios.length - 3} más</li>
                )}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Restricciones</h4>
            <p className="text-sm text-gray-600">
              {evaluacion.alergiasAlimentarias.length} alergia(s) registrada(s)
            </p>
            <p className="text-sm text-gray-600">
              {evaluacion.preferenciasAlimentarias.length} preferencia(s) registrada(s)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}