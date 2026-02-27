// ============================================================================
// saludvalpa 3.0 - SEGUIMIENTO NUTRICIONAL
// Sistema de seguimiento de progreso y cumplimiento del plan nutricional
// ============================================================================

import { useState, useEffect } from 'react';
import type { DatosNutricion } from '../../../types';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface SeguimientoNutricionalProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function SeguimientoNutricional({ datos, onChange }: SeguimientoNutricionalProps) {
  const [seguimientos, setSeguimientos] = useState(datos.seguimiento || []);
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    peso: 0,
    fecha: new Date().toISOString().split('T')[0],
    cumplimiento: 50,
    dificultades: [] as string[],
  });
  const [nuevaDificultad, setNuevaDificultad] = useState('');

  // Actualizar datos principales cuando cambian los seguimientos
  useEffect(() => {
    onChange({
      ...datos,
      seguimiento: seguimientos
    });
  }, [seguimientos]);

  const agregarSeguimiento = () => {
    if (nuevoSeguimiento.peso > 0) {
      setSeguimientos(prev => [
        ...prev,
        {
          ...nuevoSeguimiento,
          fecha: new Date(nuevoSeguimiento.fecha),
          dificultades: [...nuevoSeguimiento.dificultades]
        }
      ]);
      
      // Resetear formulario
      setNuevoSeguimiento({
        peso: 0,
        fecha: new Date().toISOString().split('T')[0],
        cumplimiento: 50,
        dificultades: [],
      });
      setNuevaDificultad('');
    }
  };

  const eliminarSeguimiento = (index: number) => {
    setSeguimientos(prev => prev.filter((_, i) => i !== index));
  };

  const agregarDificultad = () => {
    if (nuevaDificultad.trim()) {
      setNuevoSeguimiento(prev => ({
        ...prev,
        dificultades: [...prev.dificultades, nuevaDificultad.trim()]
      }));
      setNuevaDificultad('');
    }
  };

  const eliminarDificultad = (index: number) => {
    setNuevoSeguimiento(prev => ({
      ...prev,
      dificultades: prev.dificultades.filter((_, i) => i !== index)
    }));
  };

  const calcularProgreso = () => {
    if (seguimientos.length < 2) return null;
    
    const primerPeso = seguimientos[0].peso;
    const ultimoPeso = seguimientos[seguimientos.length - 1].peso;
    const diferencia = ultimoPeso - primerPeso;
    const porcentaje = primerPeso > 0 ? ((diferencia / primerPeso) * 100).toFixed(1) : '0.0';
    
    return {
      diferencia,
      porcentaje,
      tendencia: diferencia < 0 ? 'bajando' : diferencia > 0 ? 'subiendo' : 'estable'
    };
  };

  const calcularPromedioCumplimiento = () => {
    if (seguimientos.length === 0) return 0;
    const total = seguimientos.reduce((sum, seg) => sum + seg.cumplimiento, 0);
    return Math.round(total / seguimientos.length);
  };

  const progreso = calcularProgreso();

  return (
    <div className="space-y-8">
      {/* Sección: Nuevo Registro de Seguimiento */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Nuevo Registro de Seguimiento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso Actual (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={nuevoSeguimiento.peso || ''}
              onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
              placeholder="Ej: 68.5"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <Input
              type="date"
              value={nuevoSeguimiento.fecha}
              onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, fecha: e.target.value }))}
            />
          </div>

          {/* Cumplimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cumplimiento (%)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="range"
                min="0"
                max="100"
                value={nuevoSeguimiento.cumplimiento}
                onChange={(e) => setNuevoSeguimiento(prev => ({ ...prev, cumplimiento: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {nuevoSeguimiento.cumplimiento}%
              </span>
            </div>
          </div>

          {/* Botón agregar */}
          <div className="flex items-end">
            <Button
              type="button"
              onClick={agregarSeguimiento}
              disabled={nuevoSeguimiento.peso === 0}
              className="w-full"
            >
              Agregar Seguimiento
            </Button>
          </div>
        </div>

        {/* Dificultades */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificultades Encontradas
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={nuevaDificultad}
              onChange={(e) => setNuevaDificultad(e.target.value)}
              placeholder="Ej: Hambre entre comidas, Falta de tiempo para cocinar..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarDificultad}
            >
              Agregar
            </Button>
          </div>
          
          {nuevoSeguimiento.dificultades.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {nuevoSeguimiento.dificultades.map((dificultad, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                >
                  {dificultad}
                  <button
                    type="button"
                    onClick={() => eliminarDificultad(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección: Historial de Seguimientos */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📈 Historial de Seguimientos</h3>
        
        {seguimientos.length > 0 ? (
          <div className="space-y-4">
            {[...seguimientos].reverse().map((seguimiento, index) => {
              const fecha = new Date(seguimiento.fecha);
              const fechaFormateada = fecha.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Registro del {fechaFormateada}</h4>
                      <p className="text-sm text-gray-500">
                        {seguimiento.dificultades.length} dificultad(es) reportada(s)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarSeguimiento(seguimientos.length - 1 - index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-gray-900">{seguimiento.peso} kg</div>
                      <div className="text-sm text-gray-500">Peso</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-gray-900">{seguimiento.cumplimiento}%</div>
                      <div className="text-sm text-gray-500">Cumplimiento</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-700 mb-1">Dificultades:</div>
                      {seguimiento.dificultades.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {seguimiento.dificultades.map((dificultad, idx) => (
                            <li key={idx}>• {dificultad}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">Sin dificultades reportadas</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay registros de seguimiento aún.</p>
            <p className="text-sm text-gray-400 mt-1">
              Agrega tu primer registro para comenzar a monitorear tu progreso
            </p>
          </div>
        )}
      </div>

      {/* Sección: Análisis de Progreso */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">📊 Análisis de Progreso</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumen general */}
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Resumen General</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Total de registros: {seguimientos.length}</li>
              <li>• Promedio de cumplimiento: {calcularPromedioCumplimiento()}%</li>
              <li>• Período monitoreado: {seguimientos.length > 0 ? 'Sí' : 'No'}</li>
            </ul>
          </div>

          {/* Progreso de peso */}
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Progreso de Peso</h4>
            {progreso ? (
              <div className="space-y-2">
                <div className={`text-lg font-bold ${
                  progreso.tendencia === 'bajando' ? 'text-green-600' :
                  progreso.tendencia === 'subiendo' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {progreso.diferencia > 0 ? '+' : ''}{progreso.diferencia.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-600">
                  {progreso.tendencia === 'bajando' ? 'Bajando' :
                   progreso.tendencia === 'subiendo' ? 'Subiendo' :
                   'Estable'} ({progreso.porcentaje}%)
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Se necesitan al menos 2 registros</p>
            )}
          </div>

          {/* Cumplimiento promedio */}
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Cumplimiento</h4>
            <div className="space-y-2">
              <div className="text-lg font-bold text-gray-900">
                {calcularPromedioCumplimiento()}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${calcularPromedioCumplimiento()}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {calcularPromedioCumplimiento() >= 80 ? 'Excelente cumplimiento' :
                 calcularPromedioCumplimiento() >= 60 ? 'Buen cumplimiento' :
                 calcularPromedioCumplimiento() >= 40 ? 'Cumplimiento regular' :
                 'Cumplimiento bajo'}
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones basadas en análisis */}
        {seguimientos.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Recomendaciones</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {calcularPromedioCumplimiento() < 60 && (
                <li>• Considera ajustar el plan nutricional para mejorar la adherencia</li>
              )}
              {progreso?.tendencia === 'subiendo' && datos.planNutricional?.requerimientos.calorias && (
                <li>• Revisa la ingesta calórica, podría ser necesario un ajuste</li>
              )}
              {seguimientos.some(s => s.dificultades.length > 2) && (
                <li>• Identifica patrones en las dificultades para abordarlas sistemáticamente</li>
              )}
              {calcularPromedioCumplimiento() >= 80 && (
                <li>• ¡Excelente trabajo! Mantén la consistencia en el seguimiento</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}