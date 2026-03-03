import { useState } from 'react';
import usePrescriptions from '../../hooks/usePrescriptions';
import { UnidadDosis } from '../../../../types';
import Card from '../../../../components/shared/Card';
import Button from '../../../../components/shared/Button';

interface DosageCalculatorProps {
  patientWeight?: number;
  patientRenalFunction?: number;
  patientHepaticFunction?: 'normal' | 'leve' | 'moderado' | 'severa';
  onDoseCalculated?: (dose: number, unit: UnidadDosis, instructions: string) => void;
}

export default function DosageCalculator({
  patientWeight,
  patientRenalFunction,
  patientHepaticFunction = 'normal',
  onDoseCalculated
}: DosageCalculatorProps) {
  const { calcularDosis } = usePrescriptions();
  
  const [baseDose, setBaseDose] = useState<number>(10);
  const [unit, setUnit] = useState<UnidadDosis>(UnidadDosis.MG_KG);
  const [calculatedDose, setCalculatedDose] = useState<number | null>(null);
  const [weight, setWeight] = useState<number>(patientWeight || 70);
  const [renalFunction, setRenalFunction] = useState<number>(patientRenalFunction || 100);
  const [hepaticFunction, setHepaticFunction] = useState<'normal' | 'leve' | 'moderado' | 'severa'>(patientHepaticFunction);
  const [age, setAge] = useState<number>(40);
  const [isPediatric, setIsPediatric] = useState<boolean>(false);

  const calculateDose = () => {
    let adjustedRenalFunction = renalFunction;
    
    // Adjust for hepatic function
    let hepaticAdjustment = 1.0;
    switch (hepaticFunction) {
      case 'leve': hepaticAdjustment = 0.75; break;
      case 'moderado': hepaticAdjustment = 0.5; break;
      case 'severa': hepaticAdjustment = 0.25; break;
    }
    
    // Adjust for pediatric patients
    let pediatricAdjustment = 1.0;
    if (isPediatric && age < 12) {
      if (age < 2) pediatricAdjustment = 0.5;
      else if (age < 6) pediatricAdjustment = 0.75;
      else if (age < 12) pediatricAdjustment = 0.9;
    }
    
    // Calculate final adjustment
    const renalAdjustment = adjustedRenalFunction / 100;
    const finalAdjustment = renalAdjustment * hepaticAdjustment * pediatricAdjustment;
    
    const dose = calcularDosis(weight, baseDose, unit, finalAdjustment);
    setCalculatedDose(dose);
    
    if (onDoseCalculated) {
      const instructions = generateInstructions(dose, unit);
      onDoseCalculated(dose, unit, instructions);
    }
  };

  const generateInstructions = (dose: number, unit: UnidadDosis): string => {
    let instructions = `Dosis calculada: ${dose.toFixed(2)} `;
    
    switch (unit) {
      case UnidadDosis.MG_KG:
        instructions += `mg/kg (total: ${(dose * weight).toFixed(2)} mg para ${weight} kg)`;
        break;
      case UnidadDosis.MCG_KG:
        instructions += `mcg/kg (total: ${(dose * weight).toFixed(2)} mcg para ${weight} kg)`;
        break;
      default:
        instructions += unit;
    }
    
    if (renalFunction < 50) {
      instructions += `\nAjuste por función renal (${renalFunction}%): Reducir dosis en ${(100 - renalFunction)}%`;
    }
    
    if (hepaticFunction !== 'normal') {
      instructions += `\nAjuste por función hepática (${hepaticFunction}): Considerar reducción adicional`;
    }
    
    if (isPediatric) {
      instructions += `\nAjuste pediátrico (${age} años): Dosis ajustada para edad`;
    }
    
    return instructions;
  };

  const getRenalFunctionColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRenalFunctionLabel = (value: number) => {
    if (value >= 90) return 'Normal';
    if (value >= 60) return 'Leve';
    if (value >= 30) return 'Moderada';
    if (value >= 15) return 'Severa';
    return 'Falla Renal';
  };

  const getHepaticFunctionColor = (value: string) => {
    switch (value) {
      case 'normal': return 'text-green-600';
      case 'leve': return 'text-yellow-600';
      case 'moderado': return 'text-orange-600';
      case 'severa': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculadora de Dosis</h2>
      <p className="text-gray-600 mb-6">
        Calcula dosis ajustadas por peso, función renal, hepática y edad del paciente
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input Parameters */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Parámetros del Paciente</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg) *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    step="0.1"
                  />
                  <span className="ml-2 text-gray-500">kg</span>
                </div>
                {patientWeight && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor del paciente: {patientWeight} kg
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Función Renal (TFGe)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={renalFunction}
                    onChange={(e) => setRenalFunction(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="ml-4 min-w-[100px] text-right">
                    <span className={`font-semibold ${getRenalFunctionColor(renalFunction)}`}>
                      {renalFunction}%
                    </span>
                    <div className="text-xs text-gray-500">{getRenalFunctionLabel(renalFunction)}</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>30%</span>
                  <span>60%</span>
                  <span>90%</span>
                  <span>120%</span>
                </div>
                {patientRenalFunction && (
                  <p className="text-xs text-gray-500 mt-1">
                    Valor del paciente: {patientRenalFunction}%
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Función Hepática
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['normal', 'leve', 'moderado', 'severa'] as const).map((func) => (
                    <button
                      key={func}
                      onClick={() => setHepaticFunction(func)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        hepaticFunction === func
                          ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium'
                          : 'bg-gray-100 border-gray-300 text-gray-700'
                      }`}
                    >
                      {func.charAt(0).toUpperCase() + func.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pediatric"
                    checked={isPediatric}
                    onChange={(e) => setIsPediatric(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pediatric" className="ml-2 text-sm text-gray-700">
                    Paciente Pediátrico
                  </label>
                </div>
                
                {isPediatric && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edad (años)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="18"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dose Calculation */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Parámetros del Medicamento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosis Base
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={baseDose}
                    onChange={(e) => setBaseDose(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Dosis estándar por unidad seleccionada
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Dosis
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnidadDosis)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <optgroup label="Por peso">
                    <option value={UnidadDosis.MG_KG}>mg/kg</option>
                    <option value={UnidadDosis.MCG_KG}>mcg/kg</option>
                  </optgroup>
                  <optgroup label="Absolutas">
                    <option value={UnidadDosis.MG}>mg</option>
                    <option value={UnidadDosis.MCG}>mcg</option>
                    <option value={UnidadDosis.G}>g</option>
                    <option value={UnidadDosis.ML}>ml</option>
                    <option value={UnidadDosis.UI}>UI</option>
                    <option value={UnidadDosis.GOTAS}>gotas</option>
                    <option value={UnidadDosis.COMPRIMIDOS}>comprimidos</option>
                  </optgroup>
                </select>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  onClick={calculateDose}
                  className="w-full"
                >
                  Calcular Dosis
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {calculatedDose !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Resultado del Cálculo</h3>
              
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {calculatedDose.toFixed(2)} {unit}
                </div>
                <div className="text-gray-600">
                  Dosis ajustada para {weight} kg
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dosis base:</span>
                  <span className="font-medium">{baseDose} {unit}</span>
                </div>
                
                {unit === UnidadDosis.MG_KG || unit === UnidadDosis.MCG_KG ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dosis total:</span>
                    <span className="font-medium">
                      {(calculatedDose * weight).toFixed(2)} {unit.replace('_kg', '')}
                    </span>
                  </div>
                ) : null}
                
                {renalFunction < 100 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ajuste renal:</span>
                    <span className="font-medium text-orange-600">
                      -{(100 - renalFunction)}%
                    </span>
                  </div>
                )}
                
                {hepaticFunction !== 'normal' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ajuste hepático:</span>
                    <span className={`font-medium ${getHepaticFunctionColor(hepaticFunction)}`}>
                      {hepaticFunction.charAt(0).toUpperCase() + hepaticFunction.slice(1)}
                    </span>
                  </div>
                )}
                
                {isPediatric && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ajuste pediátrico:</span>
                    <span className="font-medium text-purple-600">
                      {age} años
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Instrucciones:</strong> {generateInstructions(calculatedDose, unit)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Guidelines */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Guías Clínicas de Ajuste</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Función Renal</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• TFGe ≥ 90%: Dosis normal</li>
              <li>• TFGe 60-89%: Reducir 25%</li>
              <li>• TFGe 30-59%: Reducir 50%</li>
              <li>• TFGe 15-29%: Reducir 75%</li>
              <li>• TFGe < 15%: Evitar o usar dosis mínima</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Función Hepática</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Normal: Dosis estándar</li>
              <li>• Leve (Child-Pugh A): Reducir 25%</li>
              <li>• Moderada (Child-Pugh B): Reducir 50%</li>
              <li>• Severa (Child-Pugh C): Evitar o reducir 75%</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Pacientes Pediátricos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 0-2 años: 50% de dosis adulto</li>
              <li>• 2-6 años: 75% de dosis adulto</li>
              <li>• 6-12 años: 90% de dosis adulto</li>
              <li>• 12+ años: Dosis adulto completa</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}