// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE NOTA DE SESIÓN PSICOLÓGICA
// ============================================================================

import { useState } from 'react';
import type { DatosPsicologia } from '../../../types';

interface NotaSesionPsicologicaProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
}

export default function NotaSesionPsicologica({ datos, onChange }: NotaSesionPsicologicaProps) {
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

  const estadosEmocionales = [
    'Estable', 'Ansioso', 'Deprimido', 'Irritable', 'Eufórico', 'Calmado', 'Angustiado', 'Motivado', 'Cansado', 'Agitado'
  ];

  const tecnicasComunes = [
    'Reestructuración cognitiva',
    'Mindfulness',
    'Relajación progresiva',
    'Técnicas de respiración',
    'Psicoeducación',
    'Role playing',
    'Diálogo socrático',
    'Visualización guiada',
    'Activación conductual',
    'Registro de pensamientos'
  ];

  const tareasComunes = [
    'Registro de pensamientos automáticos',
    'Ejercicio de respiración 2x día',
    'Actividad placentera diaria',
    'Práctica de mindfulness 10 min',
    'Ejercicio de exposición gradual',
    'Registro de emociones',
    'Lectura psicoeducativa',
    'Ejercicio de gratitud',
    'Planificación de actividades',
    'Práctica de asertividad'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Nota de Sesión Psicológica</h3>
        <p className="text-sm text-amber-600">
          Registre los detalles de la sesión actual, incluyendo estado emocional, técnicas aplicadas y tareas asignadas.
        </p>
      </div>

      {/* Estado emocional y mental */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">1. Estado del paciente en sesión</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado emocional predominante
            </label>
            <select
              value={datos.estadoEmocional || ''}
              onChange={(e) => handleChange('estadoEmocional', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Seleccionar estado...</option>
              {estadosEmocionales.map((estado) => (
                <option key={estado} value={estado.toLowerCase()}>{estado}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado mental / cognitivo
            </label>
            <textarea
              value={datos.estadoMental || ''}
              onChange={(e) => handleChange('estadoMental', e.target.value)}
              placeholder="Orientación, memoria, atención, concentración, pensamiento..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Técnicas terapéuticas aplicadas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">2. Técnicas terapéuticas aplicadas</h4>
        
        {/* Lista de técnicas */}
        {datos.tecnicasAplicadas && datos.tecnicasAplicadas.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.tecnicasAplicadas.map((tecnica, idx) => (
              <div key={idx} className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-lg border border-purple-100">
                <div className="flex-1">
                  <div className="font-medium text-purple-800">{tecnica}</div>
                </div>
                <button
                  onClick={() => eliminarTecnica(idx)}
                  className="ml-4 text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar técnica */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevaTecnica}
              onChange={(e) => setNuevaTecnica(e.target.value)}
              placeholder="Ej: Reestructuración cognitiva, Mindfulness..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && agregarTecnica()}
            />
            <button
              onClick={agregarTecnica}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Técnicas comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Técnicas comunes:</p>
          <div className="flex flex-wrap gap-2">
            {tecnicasComunes.map((tecnica) => (
              <button
                key={tecnica}
                onClick={() => setNuevaTecnica(tecnica)}
                className="px-3 py-1.5 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs rounded"
              >
                {tecnica}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tareas asignadas al paciente */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">3. Tareas asignadas para casa</h4>
        
        {/* Lista de tareas */}
        {datos.tareasAsignadas && datos.tareasAsignadas.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.tareasAsignadas.map((tarea, idx) => (
              <div key={idx} className="flex items-center justify-between bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-100">
                <div className="flex-1">
                  <div className="font-medium text-yellow-800">{tarea}</div>
                </div>
                <button
                  onClick={() => eliminarTarea(idx)}
                  className="ml-4 text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar tarea */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Ej: Registro de pensamientos, Ejercicio de respiración..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
            />
            <button
              onClick={agregarTarea}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Tareas comunes */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Tareas comunes:</p>
          <div className="flex flex-wrap gap-2">
            {tareasComunes.map((tarea) => (
              <button
                key={tarea}
                onClick={() => setNuevaTarea(tarea)}
                className="px-3 py-1.5 bg-white border border-yellow-200 hover:bg-yellow-50 text-yellow-700 text-xs rounded"
              >
                {tarea}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Observaciones y progreso */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">4. Observaciones y progreso terapéutico</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido de la sesión
            </label>
            <textarea
              placeholder="Temas discutidos, insights importantes, resistencias, avances..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progreso observado
            </label>
            <textarea
              value={datos.evolucion?.progreso || ''}
              onChange={(e) => handleChange('evolucion', { 
                ...(datos.evolucion || {}), 
                progreso: e.target.value 
              })}
              placeholder="Cambios observados, logros, dificultades persistentes..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan para próxima sesión
            </label>
            <textarea
              placeholder="Temas a trabajar, técnicas a aplicar, objetivos específicos..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-3">Resumen rápido de la sesión</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {datos.tecnicasAplicadas?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Técnicas aplicadas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {datos.tareasAsignadas?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Tareas asignadas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {datos.estadoEmocional ? '✓' : '—'}
            </div>
            <div className="text-sm text-gray-600">Estado registrado</div>
          </div>
        </div>
      </div>
    </div>
  );
}