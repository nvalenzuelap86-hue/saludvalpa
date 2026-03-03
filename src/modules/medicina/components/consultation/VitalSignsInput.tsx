// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE ENTRADA DE SIGNOS VITALES
// Componente para capturar signos vitales con validación y rangos normales
// ============================================================================

import React, { useState } from 'react';
import Button from '../../../../components/shared/Button';
import Card from '../../../../components/shared/Card';

interface VitalSignsInputProps {
  initialValues?: Partial<VitalSigns>;
  onSave?: (signos: VitalSigns) => void;
  onCancel?: () => void;
}

interface VitalSigns {
  temperatura: number | null;
  presionArterialSistolica: number | null;
  presionArterialDiastolica: number | null;
  frecuenciaCardiaca: number | null;
  frecuenciaRespiratoria: number | null;
  saturacionOxigeno: number | null;
  peso: number | null;
  talla: number | null;
  imc: number | null;
  glucemia: number | null;
}

const RANGOS_NORMALES = {
  temperatura: { min: 36.0, max: 37.5, unidad: '°C' },
  presionArterialSistolica: { min: 90, max: 120, unidad: 'mmHg' },
  presionArterialDiastolica: { min: 60, max: 80, unidad: 'mmHg' },
  frecuenciaCardiaca: { min: 60, max: 100, unidad: 'lpm' },
  frecuenciaRespiratoria: { min: 12, max: 20, unidad: 'rpm' },
  saturacionOxigeno: { min: 95, max: 100, unidad: '%' },
  peso: { min: 40, max: 150, unidad: 'kg' },
  talla: { min: 140, max: 200, unidad: 'cm' },
  imc: { min: 18.5, max: 24.9, unidad: 'kg/m²' },
  glucemia: { min: 70, max: 100, unidad: 'mg/dL' }
};

export default function VitalSignsInput({ 
  initialValues, 
  onSave, 
  onCancel 
}: VitalSignsInputProps) {
  const [signos, setSignos] = useState<VitalSigns>({
    temperatura: initialValues?.temperatura || null,
    presionArterialSistolica: initialValues?.presionArterialSistolica || null,
    presionArterialDiastolica: initialValues?.presionArterialDiastolica || null,
    frecuenciaCardiaca: initialValues?.frecuenciaCardiaca || null,
    frecuenciaRespiratoria: initialValues?.frecuenciaRespiratoria || null,
    saturacionOxigeno: initialValues?.saturacionOxigeno || null,
    peso: initialValues?.peso || null,
    talla: initialValues?.talla || null,
    imc: initialValues?.imc || null,
    glucemia: initialValues?.glucemia || null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcularIMC = () => {
    if (signos.peso && signos.talla) {
      const tallaMetros = signos.talla / 100;
      const imc = signos.peso / (tallaMetros * tallaMetros);
      setSignos(prev => ({ ...prev, imc: parseFloat(imc.toFixed(1)) }));
    }
  };

  const handleChange = (field: keyof VitalSigns, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setSignos(prev => ({ ...prev, [field]: numValue }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate IMC if weight or height changes
    if (field === 'peso' || field === 'talla') {
      setTimeout(calcularIMC, 100);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(signos).forEach(([key, value]) => {
      if (value !== null) {
        const rango = RANGOS_NORMALES[key as keyof typeof RANGOS_NORMALES];
        if (rango && (value < rango.min || value > rango.max)) {
          newErrors[key] = `Valor fuera de rango normal (${rango.min}-${rango.max} ${rango.unidad})`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave?.(signos);
    }
  };

  const isValueNormal = (field: keyof VitalSigns, value: number | null): boolean => {
    if (value === null) return true;
    const rango = RANGOS_NORMALES[field];
    return value >= rango.min && value <= rango.max;
  };

  const renderInput = (
    field: keyof VitalSigns, 
    label: string, 
    placeholder: string
  ) => {
    const rango = RANGOS_NORMALES[field];
    const value = signos[field];
    const isNormal = isValueNormal(field, value);
    
    return (
      <div className="border p-3 rounded">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-xs text-gray-500">
            {rango.min}-{rango.max} {rango.unidad}
          </span>
        </div>
        <input
          type="number"
          step={field === 'temperatura' ? '0.1' : '1'}
          className={`w-full p-1 border-b text-lg ${isNormal ? '' : 'border-red-500 text-red-700'}`}
          placeholder={placeholder}
          value={value === null ? '' : value}
          onChange={(e) => handleChange(field, e.target.value)}
        />
        {errors[field] && (
          <p className="text-xs text-red-600 mt-1">{errors[field]}</p>
        )}
        {value !== null && !isNormal && !errors[field] && (
          <p className="text-xs text-yellow-600 mt-1">
            Valor anormal - verificar
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Signos Vitales</h2>
        <p className="text-gray-600">Registre los signos vitales del paciente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {renderInput('temperatura', 'Temperatura', '36.5')}
        {renderInput('presionArterialSistolica', 'PA Sistólica', '120')}
        {renderInput('presionArterialDiastolica', 'PA Diastólica', '80')}
        {renderInput('frecuenciaCardiaca', 'Frecuencia Cardíaca', '75')}
        {renderInput('frecuenciaRespiratoria', 'Frecuencia Respiratoria', '16')}
        {renderInput('saturacionOxigeno', 'Saturación O₂', '98')}
        {renderInput('peso', 'Peso', '70')}
        {renderInput('talla', 'Talla', '170')}
        {renderInput('glucemia', 'Glucemia', '90')}
        
        {/* IMC Display (calculated) */}
        <div className="border p-3 rounded">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">IMC</label>
            <span className="text-xs text-gray-500">18.5-24.9 kg/m²</span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              step="0.1"
              className="w-full p-1 border-b text-lg"
              value={signos.imc === null ? '' : signos.imc}
              readOnly
              placeholder="Calculado automáticamente"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="ml-2"
              onClick={calcularIMC}
            >
              Calcular
            </Button>
          </div>
          {signos.imc !== null && (
            <div className="mt-2">
              <div className="text-xs font-medium mb-1">Clasificación:</div>
              <div className={`text-xs px-2 py-1 rounded ${
                signos.imc < 18.5 ? 'bg-yellow-100 text-yellow-800' :
                signos.imc <= 24.9 ? 'bg-green-100 text-green-800' :
                signos.imc <= 29.9 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {signos.imc < 18.5 ? 'Bajo peso' :
                 signos.imc <= 24.9 ? 'Normal' :
                 signos.imc <= 29.9 ? 'Sobrepeso' :
                 'Obesidad'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Resumen</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(signos).map(([key, value]) => {
            if (value === null) return null;
            const rango = RANGOS_NORMALES[key as keyof typeof RANGOS_NORMALES];
            const isNormal = isValueNormal(key as keyof VitalSigns, value);
            return (
              <div key={key} className="text-sm">
                <span className="font-medium">{key}: </span>
                <span className={isNormal ? 'text-green-700' : 'text-red-700'}>
                  {value} {rango.unidad}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              // Clear all values
              setSignos({
                temperatura: null,
                presionArterialSistolica: null,
                presionArterialDiastolica: null,
                frecuenciaCardiaca: null,
                frecuenciaRespiratoria: null,
                saturacionOxigeno: null,
                peso: null,
                talla: null,
                imc: null,
                glucemia: null
              });
              setErrors({});
            }}
          >
            Limpiar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Signos Vitales
          </Button>
        </div>
      </div>
    </Card>
  );
}