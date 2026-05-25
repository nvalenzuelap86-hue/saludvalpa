// ============================================================================
// saludvalpa 3.0 - HISTORIAL CLÍNICO DEL PACIENTE
// Componente unificado que agrupa diagnósticos, signos vitales y antecedentes
// ============================================================================

import { useState } from 'react';
import ListaDiagnosticos from './ListaDiagnosticos';
import RegistroSignosVitales from './RegistroSignosVitales';
import ListaAntecedentes from './ListaAntecedentes';
import type { TipoProfesion } from '../types';

interface HistorialClinicoPacienteProps {
  pacienteId: string;
  profesion?: TipoProfesion;
  motivoConsulta?: string;
}

type Pestana = 'diagnosticos' | 'signosVitales' | 'antecedentes';

const PESTANAS: { id: Pestana; label: string; icono: string }[] = [
  { id: 'diagnosticos', label: 'Diagnósticos', icono: '📋' },
  { id: 'signosVitales', label: 'Signos Vitales', icono: '❤️' },
  { id: 'antecedentes', label: 'Antecedentes', icono: '📝' },
];

export default function HistorialClinicoPaciente({ pacienteId, profesion, motivoConsulta }: HistorialClinicoPacienteProps) {
  const [pestanaActiva, setPestanaActiva] = useState<Pestana>('diagnosticos');

  return (
    <div className="space-y-4">
      {/* Motivo de consulta */}
      {motivoConsulta && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💬</span>
            <div>
              <span className="text-sm font-medium text-blue-800">Motivo de consulta</span>
              <p className="text-sm text-blue-700 mt-1">{motivoConsulta}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="flex border-b border-gray-200">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.id}
            onClick={() => setPestanaActiva(pestana.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              pestanaActiva === pestana.id
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{pestana.icono}</span>
            <span>{pestana.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido según pestaña activa */}
      <div>
        {pestanaActiva === 'diagnosticos' && (
          <ListaDiagnosticos pacienteId={pacienteId} profesion={profesion} />
        )}
        {pestanaActiva === 'signosVitales' && (
          <RegistroSignosVitales pacienteId={pacienteId} profesion={profesion} />
        )}
        {pestanaActiva === 'antecedentes' && (
          <ListaAntecedentes pacienteId={pacienteId} />
        )}
      </div>
    </div>
  );
}
