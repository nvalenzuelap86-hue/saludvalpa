// ============================================================================
// saludvalpa 3.0 - GENERAR INSTRUCCIONES DE CUIDADO (MANICURISTA)
// Hoja con recomendaciones para el cuidado de uñas
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../../../types';
import Button from '../../../components/shared/Button';

interface DatosInstrucciones {
  tipoTrabajo: string;
  instruccionesEspecificas: string;
  duracionEstimada: string;
  recomendacionesGenerales: boolean[];
}

interface Props {
  paciente: Paciente | null;
  onExito: () => void;
  onCancelar: () => void;
}

const recomendacionesBase = [
  'Evitar contacto prolongado con agua en las primeras 24 horas',
  'Usar guantes al realizar tareas de limpieza',
  'Aplicar aceite para cutículas diariamente',
  'No usar las uñas como herramientas',
  'Programar retoque en 2-3 semanas',
  'Mantener las manos hidratadas',
];

const GenerarInstruccionesCuidado = ({ paciente, onExito, onCancelar }: Props) => {
  const [generando, setGenerando] = useState(false);
  
  const [datos, setDatos] = useState<DatosInstrucciones>({
    tipoTrabajo: 'Manicure',
    instruccionesEspecificas: '',
    duracionEstimada: '2-3 semanas',
    recomendacionesGenerales: [true, true, true, false, true, true],
  });

  const toggleRecomendacion = (index: number) => {
    const nuevas = [...datos.recomendacionesGenerales];
    nuevas[index] = !nuevas[index];
    setDatos({...datos, recomendacionesGenerales: nuevas});
  };

  const handleGenerar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paciente) {
      alert('Selecciona un cliente primero');
      return;
    }

    setGenerando(true);
    try {
      alert(`Instrucciones generadas para ${paciente.nombre} ${paciente.apellidos}`);
      onExito();
    } catch (error) {
      console.error('Error al generar instrucciones:', error);
      alert('Error al generar el documento');
    } finally {
      setGenerando(false);
    }
  };

  if (!paciente) {
    return (
      <div className="text-center py-8 text-gray-500">
        Selecciona un cliente para generar las instrucciones
      </div>
    );
  }

  return (
    <form onSubmit={handleGenerar} className="space-y-6">
      {/* Información del cliente */}
      <div className="bg-pink-50 p-4 rounded-lg">
        <h3 className="font-semibold text-pink-900 mb-2">Cliente</h3>
        <p className="text-pink-800">{paciente.nombre} {paciente.apellidos}</p>
      </div>

      {/* Tipo de trabajo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Trabajo Realizado
        </label>
        <select
          value={datos.tipoTrabajo}
          onChange={(e) => setDatos({...datos, tipoTrabajo: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option>Manicure</option>
          <option>Pedicure</option>
          <option>Uñas Acrílicas</option>
          <option>Uñas de Gel</option>
          <option>Diseño de Uñas</option>
        </select>
      </div>

      {/* Duración estimada */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duración Estimada
        </label>
        <select
          value={datos.duracionEstimada}
          onChange={(e) => setDatos({...datos, duracionEstimada: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
        >
          <option>1 semana</option>
          <option>2-3 semanas</option>
          <option>3-4 semanas</option>
          <option>1 mes</option>
        </select>
      </div>

      {/* Recomendaciones generales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recomendaciones (selecciona las que aplican)
        </label>
        <div className="space-y-2">
          {recomendacionesBase.map((rec, idx) => (
            <label key={idx} className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={datos.recomendacionesGenerales[idx]}
                onChange={() => toggleRecomendacion(idx)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">{rec}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Instrucciones específicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instrucciones Específicas Adicionales
        </label>
        <textarea
          value={datos.instruccionesEspecificas}
          onChange={(e) => setDatos({...datos, instruccionesEspecificas: e.target.value})}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Recomendaciones especiales para este cliente..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancelar}
          disabled={generando}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={generando}
        >
          {generando ? 'Generando...' : '📄 Generar Instrucciones'}
        </Button>
      </div>
    </form>
  );
};

export default GenerarInstruccionesCuidado;
