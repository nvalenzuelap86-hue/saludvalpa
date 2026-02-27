// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE PSICOLOGÍA
// ============================================================================

import { useState } from 'react';
import type { DatosPsicologia } from '../types';

interface CamposPsicologiaProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
}

export default function CamposPsicologia({ datos, onChange }: CamposPsicologiaProps) {
  const [nuevaTecnica, setNuevaTecnica] = useState('');
  const [nuevaTarea, setNuevaTarea] = useState('');

  const handleChange = (campo: keyof DatosPsicologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const agregarTecnica = () => {
    if (!nuevaTecnica.trim()) return;
    const tecnicas = datos.tecnicasAplicadas || [];
    handleChange('tecnicasAplicadas', [...tecnicas, nuevaTecnica]);
    setNuevaTecnica('');
  };

  const eliminarTecnica = (indice: number) => {
    const tecnicas = datos.tecnicasAplicadas || [];
    handleChange('tecnicasAplicadas', tecnicas.filter((_, i) => i !== indice));
  };

  const agregarTarea = () => {
    if (!nuevaTarea.trim()) return;
    const tareas = datos.tareasAsignadas || [];
    handleChange('tareasAsignadas', [...tareas, nuevaTarea]);
    setNuevaTarea('');
  };

  const eliminarTarea = (indice: number) => {
    const tareas = datos.tareasAsignadas || [];
    handleChange('tareasAsignadas', tareas.filter((_, i) => i !== indice));
  };

  return (
    <div className="space-y-4">
      
      {/* Estado emocional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado emocional
        </label>
        <select
          value={datos.estadoEmocional || ''}
          onChange={(e) => handleChange('estadoEmocional', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
        >
          <option value="">Seleccionar...</option>
          <option value="estable">Estable</option>
          <option value="ansioso">Ansioso</option>
          <option value="deprimido">Deprimido</option>
          <option value="irritable">Irritable</option>
          <option value="euforico">Eufórico</option>
          <option value="calmado">Calmado</option>
          <option value="angustiado">Angustiado</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Estado mental */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado mental / cognitivo
        </label>
        <textarea
          value={datos.estadoMental || ''}
          onChange={(e) => handleChange('estadoMental', e.target.value)}
          placeholder="Orientación, memoria, atención, concentración, pensamiento..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue min-h-[80px]"
        />
      </div>

      {/* Técnicas terapéuticas aplicadas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Técnicas terapéuticas aplicadas
        </label>
        
        {/* Lista de técnicas */}
        {datos.tecnicasAplicadas && datos.tecnicasAplicadas.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.tecnicasAplicadas.map((tecnica, idx) => (
              <div key={idx} className="flex items-center justify-between bg-purple-50 px-3 py-1.5 rounded">
                <span className="text-sm">{tecnica}</span>
                <button
                  onClick={() => eliminarTecnica(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar técnica */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaTecnica}
            onChange={(e) => setNuevaTecnica(e.target.value)}
            placeholder="Ej: Reestructuración cognitiva, Mindfulness..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarTecnica()}
          />
          <button
            onClick={agregarTecnica}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            + Agregar
          </button>
        </div>

        {/* Técnicas predefinidas */}
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-2">Técnicas comunes:</p>
          <div className="flex flex-wrap gap-1">
            {[
              'Terapia cognitivo-conductual',
              'Reestructuración cognitiva',
              'Exposición gradual',
              'Mindfulness',
              'Relajación progresiva',
              'Técnicas de respiración',
              'Psicoeducación',
              'Role playing',
              'Diálogo socrático',
              'Visualización guiada',
              'Terapia de aceptación y compromiso',
              'EMDR',
            ].map((tecnica) => (
              <button
                key={tecnica}
                onClick={() => {
                  const tecnicas = datos.tecnicasAplicadas || [];
                  if (!tecnicas.includes(tecnica)) {
                    handleChange('tecnicasAplicadas', [...tecnicas, tecnica]);
                  }
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-purple-500 hover:text-white text-xs rounded transition-colors"
              >
                {tecnica}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tareas asignadas al paciente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tareas asignadas para casa
        </label>
        
        {/* Lista de tareas */}
        {datos.tareasAsignadas && datos.tareasAsignadas.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.tareasAsignadas.map((tarea, idx) => (
              <div key={idx} className="flex items-center justify-between bg-yellow-50 px-3 py-1.5 rounded">
                <span className="text-sm">{tarea}</span>
                <button
                  onClick={() => eliminarTarea(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar tarea */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Ej: Registro de pensamientos, Ejercicio de respiración 2x día..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
          />
          <button
            onClick={agregarTarea}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Observaciones adicionales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones del proceso terapéutico
        </label>
        <textarea
          value={datos.evolucion?.progreso || ''}
          onChange={(e) => handleChange('evolucion', { 
            ...(datos.evolucion || {}), 
            progreso: e.target.value 
          })}
          placeholder="Describe el progreso, cambios observados, insights importantes..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue min-h-[100px]"
        />
      </div>
    </div>
  );
}
