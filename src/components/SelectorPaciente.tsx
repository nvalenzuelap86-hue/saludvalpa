// ============================================================================
// saludvalpa 3.0 - SELECTOR DE PACIENTE
// Componente simple para seleccionar un paciente de una lista
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../types';
import Button from './shared/Button';

interface SelectorPacienteProps {
  pacientes: Paciente[];
  onSeleccionar: (paciente: Paciente) => void;
  onCancelar: () => void;
}

const SelectorPaciente = ({ pacientes, onSeleccionar, onCancelar }: SelectorPacienteProps) => {
  const [pacienteId, setPacienteId] = useState<string>('');

  const handleContinuar = () => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
      onSeleccionar(paciente);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">Selecciona el paciente para generar el documento:</p>
      
      <select
        value={pacienteId}
        onChange={(e) => setPacienteId(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
        autoFocus
      >
        <option value="">Seleccionar paciente...</option>
        {pacientes.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre} {p.apellidos}
          </option>
        ))}
      </select>

      {pacientes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay pacientes registrados. Crea uno primero en la sección Pacientes.
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button
          onClick={handleContinuar}
          disabled={!pacienteId}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
};

export default SelectorPaciente;
