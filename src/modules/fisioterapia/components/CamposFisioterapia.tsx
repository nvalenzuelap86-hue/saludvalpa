// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE FISIOTERAPIA
// ============================================================================

import { useState } from 'react';
import type { DatosFisioterapia } from '../../../types';

interface CamposFisioterapiaProps {
  datos: DatosFisioterapia;
  onChange: (datos: DatosFisioterapia) => void;
}

export default function CamposFisioterapia({ datos, onChange }: CamposFisioterapiaProps) {
  const [nuevaTecnica, setNuevaTecnica] = useState('');
  const [nuevoEjercicio, setNuevoEjercicio] = useState('');

  const handleChange = (campo: keyof DatosFisioterapia, valor: any) => {
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

  const agregarEjercicio = () => {
    if (!nuevoEjercicio.trim()) return;
    const ejercicios = datos.ejerciciosRealizados || [];
    handleChange('ejerciciosRealizados', [...ejercicios, nuevoEjercicio]);
    setNuevoEjercicio('');
  };

  const eliminarEjercicio = (indice: number) => {
    const ejercicios = datos.ejerciciosRealizados || [];
    handleChange('ejerciciosRealizados', ejercicios.filter((_, i) => i !== indice));
  };

  return (
    <div className="space-y-4">
      
      {/* Escala de dolor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escala de dolor (0-10)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="10"
            value={datos.escalaDolor || 0}
            onChange={(e) => handleChange('escalaDolor', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-2xl font-bold text-saludvalpa-blue w-12 text-center">
            {datos.escalaDolor || 0}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Sin dolor</span>
          <span>Dolor máximo</span>
        </div>
      </div>

      {/* Área de dolor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Área de dolor / molestia
        </label>
        <input
          type="text"
          value={datos.areaDolor || ''}
          onChange={(e) => handleChange('areaDolor', e.target.value)}
          placeholder="Ej: Zona lumbar L4-L5, Hombro derecho..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
        />
      </div>

      {/* Técnicas aplicadas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Técnicas fisioterapéuticas aplicadas
        </label>
        
        {/* Lista de técnicas */}
        {datos.tecnicasAplicadas && datos.tecnicasAplicadas.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.tecnicasAplicadas.map((tecnica, idx) => (
              <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-1.5 rounded">
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
            placeholder="Ej: Movilización articular, Masaje terapéutico..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarTecnica()}
          />
          <button
            onClick={agregarTecnica}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Ejercicios realizados */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ejercicios realizados / indicados
        </label>
        
        {/* Lista de ejercicios */}
        {datos.ejerciciosRealizados && datos.ejerciciosRealizados.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.ejerciciosRealizados.map((ejercicio, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded">
                <span className="text-sm">{ejercicio}</span>
                <button
                  onClick={() => eliminarEjercicio(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar ejercicio */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoEjercicio}
            onChange={(e) => setNuevoEjercicio(e.target.value)}
            placeholder="Ej: Estiramiento de isquiotibiales, Fortalecimiento de core..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarEjercicio()}
          />
          <button
            onClick={agregarEjercicio}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Técnicas predefinidas (botones rápidos) */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Técnicas comunes (click para agregar):</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Ultrasonido terapéutico',
            'TENS',
            'Masaje terapéutico',
            'Movilización articular',
            'Estiramientos',
            'Fortalecimiento muscular',
            'Electroestimulación',
            'Calor superficial',
            'Crioterapia',
            'Punción seca',
          ].map((tecnica) => (
            <button
              key={tecnica}
              onClick={() => {
                const tecnicas = datos.tecnicasAplicadas || [];
                if (!tecnicas.includes(tecnica)) {
                  handleChange('tecnicasAplicadas', [...tecnicas, tecnica]);
                }
              }}
              className="px-2 py-1 bg-gray-100 hover:bg-saludvalpa-blue hover:text-white text-xs rounded transition-colors"
            >
              {tecnica}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
