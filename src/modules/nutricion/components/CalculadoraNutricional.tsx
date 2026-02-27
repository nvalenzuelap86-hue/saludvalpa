// ============================================================================
// saludvalpa 3.0 - CALCULADORA NUTRICIONAL
// Calculadora de requerimientos nutricionales y herramientas de cálculo
// ============================================================================

import { useState, useEffect } from 'react';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface CalculadoraNutricionalProps {
  onCalculoCompletado?: (requerimientos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  }) => void;
}

export default function CalculadoraNutricional({ onCalculoCompletado }: CalculadoraNutricionalProps) {
  const [datos, setDatos] = useState({
    edad: 30,
    sexo: 'masculino' as 'masculino' | 'femenino',
    peso: 70,
    talla: 170,
    actividad: 'moderado' as 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta',
    objetivo: 'mantener' as 'perder' | 'mantener' | 'ganar',
  });

  const [resultados, setResultados] = useState({
    tmb: 0,
    get: 0,
    caloriasObjetivo: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    imc: 0,
    clasificacionIMC: '',
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Calcular resultados cuando cambian los datos
  useEffect(() => {
    calcularResultados();
  }, [datos]);

  const calcularResultados = () => {
    const { edad, sexo, peso, talla, actividad, objetivo } = datos;
    
    // Calcular TMB (Tasa Metabólica Basal) - Fórmula de Mifflin-St Jeor
    let tmb;
    if (sexo === 'masculino') {
      tmb = (10 * peso) + (6.25 * talla) - (5 * edad) + 5;
    } else {
      tmb = (10 * peso) + (6.25 * talla) - (5 * edad) - 161;
    }

    // Factor de actividad
    const factoresActividad = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      atleta: 1.9,
    };

    const get = tmb * factoresActividad[actividad];

    // Ajustar según objetivo
    let caloriasObjetivo = get;
    if (objetivo === 'perder') {
      caloriasObjetivo = get * 0.85; // Déficit del 15%
    } else if (objetivo === 'ganar') {
      caloriasObjetivo = get * 1.15; // Superávit del 15%
    }

    // Distribución de macronutrientes
    const proteinas = Math.round((caloriasObjetivo * 0.3) / 4); // 30% de calorías
    const carbohidratos = Math.round((caloriasObjetivo * 0.5) / 4); // 50% de calorías
    const grasas = Math.round((caloriasObjetivo * 0.2) / 9); // 20% de calorías

    // Calcular IMC
    const tallaMetros = talla / 100;
    const imc = peso / (tallaMetros * tallaMetros);
    
    // Clasificación IMC
    let clasificacionIMC = '';
    if (imc < 18.5) clasificacionIMC = 'Bajo peso';
    else if (imc < 25) clasificacionIMC = 'Peso normal';
    else if (imc < 30) clasificacionIMC = 'Sobrepeso';
    else if (imc < 35) clasificacionIMC = 'Obesidad grado I';
    else if (imc < 40) clasificacionIMC = 'Obesidad grado II';
    else clasificacionIMC = 'Obesidad grado III';

    setResultados({
      tmb: Math.round(tmb),
      get: Math.round(get),
      caloriasObjetivo: Math.round(caloriasObjetivo),
      proteinas,
      carbohidratos,
      grasas,
      imc: parseFloat(imc.toFixed(1)),
      clasificacionIMC,
    });
  };

  const handleInputChange = (campo: keyof typeof datos, valor: any) => {
    setDatos(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarResultados = () => {
    if (onCalculoCompletado) {
      onCalculoCompletado({
        calorias: resultados.caloriasObjetivo,
        proteinas: resultados.proteinas,
        carbohidratos: resultados.carbohidratos,
        grasas: resultados.grasas,
      });
    }
    setMostrarResultados(true);
  };

  const resetearCalculadora = () => {
    setDatos({
      edad: 30,
      sexo: 'masculino',
      peso: 70,
      talla: 170,
      actividad: 'moderado',
      objetivo: 'mantener',
    });
    setMostrarResultados(false);
  };

  return (
    <div className="space-y-8">
      {/* Sección: Datos de Entrada */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📝 Datos Personales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Edad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad (años)
            </label>
            <Input
              type="number"
              value={datos.edad}
              onChange={(e) => handleInputChange('edad', parseInt(e.target.value) || 0)}
              min="18"
              max="100"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexo
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sexo"
                  checked={datos.sexo === 'masculino'}
                  onChange={() => handleInputChange('sexo', 'masculino')}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Masculino</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sexo"
                  checked={datos.sexo === 'femenino'}
                  onChange={() => handleInputChange('sexo', 'femenino')}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Femenino</span>
              </label>
            </div>
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={datos.peso}
              onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
              min="30"
              max="200"
            />
          </div>

          {/* Talla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talla (cm)
            </label>
            <Input
              type="number"
              value={datos.talla}
              onChange={(e) => handleInputChange('talla', parseInt(e.target.value) || 0)}
              min="100"
              max="250"
            />
          </div>

          {/* Nivel de actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Actividad
            </label>
            <select
              value={datos.actividad}
              onChange={(e) => handleInputChange('actividad', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
              <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
              <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
              <option value="intenso">Intenso (ejercicio 6-7 días/semana)</option>
              <option value="atleta">Atleta (ejercicio intenso diario)</option>
            </select>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <select
              value={datos.objetivo}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="perder">Perder peso</option>
              <option value="mantener">Mantener peso</option>
              <option value="ganar">Ganar peso/músculo</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-center mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={resetearCalculadora}
          >
            Reiniciar
          </Button>
          <Button
            type="button"
            onClick={aplicarResultados}
          >
            Calcular Requerimientos
          </Button>
        </div>
      </div>

      {/* Sección: Resultados */}
      {mostrarResultados && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Resultados Calculados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* TMB */}
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-blue-600">{resultados.tmb}</div>
              <div className="text-sm text-gray-500">TMB (kcal/día)</div>
              <div className="text-xs text-gray-400 mt-1">Tasa Metabólica Basal</div>
            </div>

            {/* GET */}
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-green-600">{resultados.get}</div>
              <div className="text-sm text-gray-500">GET (kcal/día)</div>
              <div className="text-xs text-gray-400 mt-1">Gasto Energético Total</div>
            </div>

            {/* Calorías objetivo */}
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-purple-600">{resultados.caloriasObjetivo}</div>
              <div className="text-sm text-gray-500">Calorías Objetivo</div>
              <div className="text-xs text-gray-400 mt-1">Para {datos.objetivo === 'perder' ? 'perder' : datos.objetivo === 'ganar' ? 'ganar' : 'mantener'} peso</div>
            </div>

            {/* IMC */}
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-orange-600">{resultados.imc}</div>
              <div className="text-sm text-gray-500">Índice de Masa Corporal</div>
              <div className={`text-xs font-medium mt-1 ${
                resultados.clasificacionIMC === 'Peso normal' ? 'text-green-600' :
                resultados.clasificacionIMC === 'Bajo peso' ? 'text-yellow-600' :
                resultados.clasificacionIMC.includes('Sobrepeso') ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {resultados.clasificacionIMC}
              </div>
            </div>
          </div>

          {/* Distribución de macronutrientes */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Distribución de Macronutrientes Diarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Proteínas */}
              <div className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Proteínas</span>
                  <span className="text-lg font-bold text-blue-600">{resultados.proteinas}g</span>
                </div>
                <div className="text-sm text-gray-600">
                  {((resultados.proteinas * 4) / resultados.caloriasObjetivo * 100).toFixed(1)}% de las calorías
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>

              {/* Carbohidratos */}
              <div className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Carbohidratos</span>
                  <span className="text-lg font-bold text-green-600">{resultados.carbohidratos}g</span>
                </div>
                <div className="text-sm text-gray-600">
                  {((resultados.carbohidratos * 4) / resultados.caloriasObjetivo * 100).toFixed(1)}% de las calorías
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>

              {/* Grasas */}
              <div className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Grasas</span>
                  <span className="text-lg font-bold text-yellow-600">{resultados.grasas}g</span>
                </div>
                <div className="text-sm text-gray-600">
                  {((resultados.grasas * 9) / resultados.caloriasObjetivo * 100).toFixed(1)}% de las calorías
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: '20%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interpretación */}
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Interpretación de Resultados</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>TMB ({resultados.tmb} kcal)</strong>: Calorías que tu cuerpo quema en reposo completo.</li>
              <li>• <strong>GET ({resultados.get} kcal)</strong>: Calorías totales que quemas considerando tu actividad.</li>
              <li>• <strong>Objetivo ({resultados.caloriasObjetivo} kcal)</strong>: Calorías diarias recomendadas para {datos.objetivo === 'perder' ? 'perder peso (déficit del 15%)' : datos.objetivo === 'ganar' ? 'ganar peso/músculo (superávit del 15%)' : 'mantener tu peso actual'}.</li>
              <li>• <strong>IMC ({resultados.imc})</strong>: {resultados.clasificacionIMC}. {resultados.imc < 18.5 ? 'Considera consultar con un profesional.' : resultados.imc >= 25 ? 'Podría indicar necesidad de ajustes en alimentación y actividad.' : 'Dentro del rango saludable.'}</li>
            </ul>
          </div>

          {/* Sección: Información Adicional */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Información Adicional</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Los cálculos se basan en la fórmula de Mifflin-St Jeor para TMB.</p>
              <p>• Los factores de actividad siguen las recomendaciones de la OMS.</p>
              <p>• La distribución de macronutrientes es: 30% proteínas, 50% carbohidratos, 20% grasas.</p>
              <p>• Para objetivos específicos (ej. diabetes, embarazo), consulta con un profesional.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}