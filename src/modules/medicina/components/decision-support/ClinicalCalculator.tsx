import { useState } from 'react';
import Card from '../../../../components/shared/Card';
import Button from '../../../../components/shared/Button';

export default function ClinicalCalculator() {
  const [selectedCalculator, setSelectedCalculator] = useState<string>('bmi');
  
  // BMI Calculator
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(1.70);
  const [bmi, setBmi] = useState<number | null>(null);
  
  const calculateBMI = () => {
    if (weight > 0 && height > 0) {
      const bmiValue = weight / (height * height);
      setBmi(bmiValue);
    }
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: 'Bajo peso', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Peso normal', color: 'text-green-600' };
    if (bmiValue < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
    if (bmiValue < 35) return { category: 'Obesidad grado I', color: 'text-orange-600' };
    return { category: 'Obesidad grado II+', color: 'text-red-600' };
  };

  const calculators = [
    { id: 'bmi', name: 'Índice de Masa Corporal', description: 'Calcula IMC' },
    { id: 'gfr', name: 'Tasa de Filtración Glomerular', description: 'Función renal' },
    { id: 'wells', name: 'Score de Wells', description: 'Probabilidad TEP' },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculadoras Clínicas</h2>
      <p className="text-gray-600 mb-6">Herramientas para cálculos clínicos comunes</p>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {calculators.map(calc => (
            <button
              key={calc.id}
              onClick={() => setSelectedCalculator(calc.id)}
              className={`px-4 py-2 rounded-lg border ${
                selectedCalculator === calc.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {calc.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCalculator === 'bmi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (m)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0.5"
                max="2.5"
                step="0.01"
              />
            </div>
          </div>
          
          <Button variant="primary" onClick={calculateBMI} className="w-full">
            Calcular IMC
          </Button>
          
          {bmi !== null && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{bmi.toFixed(1)} kg/m²</div>
                <div className={`text-lg font-medium mt-2 ${getBMICategory(bmi).color}`}>
                  {getBMICategory(bmi).category}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedCalculator === 'gfr' && (
        <div className="text-center py-8">
          <p className="text-gray-500">Calculadora de TFG - En desarrollo</p>
          <p className="text-sm text-gray-400">Próximamente disponible</p>
        </div>
      )}

      {selectedCalculator === 'wells' && (
        <div className="text-center py-8">
          <p className="text-gray-500">Score de Wells - En desarrollo</p>
          <p className="text-sm text-gray-400">Próximamente disponible</p>
        </div>
      )}
    </Card>
  );
}