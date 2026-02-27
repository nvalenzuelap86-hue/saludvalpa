// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE MANICURISTA
// ============================================================================

import { useState } from 'react';
import type { DatosManicurista, ServicioManicura } from '../types';

interface CamposManicuristaProps {
  datos: DatosManicurista;
  onChange: (datos: DatosManicurista) => void;
}

export default function CamposManicurista({ datos, onChange }: CamposManicuristaProps) {
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [nuevoColor, setNuevoColor] = useState({ nombre: '', codigo: '' });
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  const handleChange = (campo: keyof DatosManicurista, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  // -------------------------------------------------------------------------
  // SERVICIOS
  // -------------------------------------------------------------------------
  const agregarServicio = (tipo: ServicioManicura['tipo']) => {
    const servicios = datos.serviciosAplicados || [];
    if (!servicios.some(s => s.tipo === tipo)) {
      handleChange('serviciosAplicados', [...servicios, { tipo }]);
    }
  };

  const eliminarServicio = (indice: number) => {
    const servicios = datos.serviciosAplicados || [];
    handleChange('serviciosAplicados', servicios.filter((_, i) => i !== indice));
  };

  // -------------------------------------------------------------------------
  // PRODUCTOS
  // -------------------------------------------------------------------------
  const agregarProducto = () => {
    if (!nuevoProducto.trim()) return;
    const productos = datos.productosUtilizados || [];
    handleChange('productosUtilizados', [...productos, nuevoProducto]);
    setNuevoProducto('');
  };

  const eliminarProducto = (indice: number) => {
    const productos = datos.productosUtilizados || [];
    handleChange('productosUtilizados', productos.filter((_, i) => i !== indice));
  };

  // -------------------------------------------------------------------------
  // COLORES
  // -------------------------------------------------------------------------
  const agregarColor = () => {
    if (!nuevoColor.nombre.trim()) return;
    const colores = datos.coloresAplicados || [];
    handleChange('coloresAplicados', [...colores, { ...nuevoColor }]);
    setNuevoColor({ nombre: '', codigo: '' });
  };

  const eliminarColor = (indice: number) => {
    const colores = datos.coloresAplicados || [];
    handleChange('coloresAplicados', colores.filter((_, i) => i !== indice));
  };

  // -------------------------------------------------------------------------
  // RECOMENDACIONES
  // -------------------------------------------------------------------------
  const agregarRecomendacion = () => {
    if (!nuevaRecomendacion.trim()) return;
    const recomendaciones = datos.recomendacionesCuidado || [];
    handleChange('recomendacionesCuidado', [...recomendaciones, nuevaRecomendacion]);
    setNuevaRecomendacion('');
  };

  const eliminarRecomendacion = (indice: number) => {
    const recomendaciones = datos.recomendacionesCuidado || [];
    handleChange('recomendacionesCuidado', recomendaciones.filter((_, i) => i !== indice));
  };

  return (
    <div className="space-y-4">
      
      {/* Servicios aplicados */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Servicios aplicados
        </label>
        
        {/* Servicios seleccionados */}
        {datos.serviciosAplicados && datos.serviciosAplicados.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {datos.serviciosAplicados.map((servicio, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
              >
                {servicio.tipo}
                <button
                  onClick={() => eliminarServicio(idx)}
                  className="text-pink-600 hover:text-pink-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Botones de servicios */}
        <div className="flex flex-wrap gap-2">
          {[
            { tipo: 'manicure' as const, label: 'Manicure' },
            { tipo: 'pedicure' as const, label: 'Pedicure' },
            { tipo: 'acrilicas' as const, label: 'Acrílicas' },
            { tipo: 'gel' as const, label: 'Gel' },
            { tipo: 'nail_art' as const, label: 'Nail Art' },
            { tipo: 'otro' as const, label: 'Otro' },
          ].map((servicio) => (
            <button
              key={servicio.tipo}
              onClick={() => agregarServicio(servicio.tipo)}
              className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
            >
              + {servicio.label}
            </button>
          ))}
        </div>
      </div>

      {/* Productos utilizados */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Productos utilizados
        </label>
        
        {/* Lista de productos */}
        {datos.productosUtilizados && datos.productosUtilizados.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.productosUtilizados.map((producto, idx) => (
              <div key={idx} className="flex items-center justify-between bg-purple-50 px-3 py-1.5 rounded">
                <span className="text-sm">{producto}</span>
                <button
                  onClick={() => eliminarProducto(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar producto */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoProducto}
            onChange={(e) => setNuevoProducto(e.target.value)}
            placeholder="Ej: Esmalte OPI, Base coat, Top coat, Aceite de cutículas..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarProducto()}
          />
          <button
            onClick={agregarProducto}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Colores aplicados */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colores aplicados
        </label>
        
        {/* Lista de colores */}
        {datos.coloresAplicados && datos.coloresAplicados.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {datos.coloresAplicados.map((color, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full"
              >
                {color.codigo && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.codigo }}
                  />
                )}
                <span className="text-sm font-medium">{color.nombre}</span>
                <button
                  onClick={() => eliminarColor(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar color */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoColor.nombre}
            onChange={(e) => setNuevoColor(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre del color"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
          />
          <input
            type="color"
            value={nuevoColor.codigo || '#ff69b4'}
            onChange={(e) => setNuevoColor(prev => ({ ...prev, codigo: e.target.value }))}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <button
            onClick={agregarColor}
            className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Duración del procedimiento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duración del procedimiento (minutos)
        </label>
        <input
          type="number"
          value={datos.duracionProcedimiento || 0}
          onChange={(e) => handleChange('duracionProcedimiento', parseInt(e.target.value) || 0)}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
        />
      </div>

      {/* Recomendaciones de cuidado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recomendaciones de cuidado
        </label>
        
        {/* Lista de recomendaciones */}
        {datos.recomendacionesCuidado && datos.recomendacionesCuidado.length > 0 && (
          <div className="space-y-1 mb-2">
            {datos.recomendacionesCuidado.map((recomendacion, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded">
                <span className="text-sm">{recomendacion}</span>
                <button
                  onClick={() => eliminarRecomendacion(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agregar recomendación */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaRecomendacion}
            onChange={(e) => setNuevaRecomendacion(e.target.value)}
            placeholder="Ej: Evitar agua caliente por 24h, No usar acetona..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
            onKeyPress={(e) => e.key === 'Enter' && agregarRecomendacion()}
          />
          <button
            onClick={agregarRecomendacion}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            + Agregar
          </button>
        </div>

        {/* Recomendaciones predefinidas */}
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-2">Recomendaciones comunes:</p>
          <div className="flex flex-wrap gap-1">
            {[
              'Evitar agua caliente 24h',
              'No usar acetona',
              'Hidratar cutículas diariamente',
              'Usar guantes para limpiar',
              'Aplicar aceite de cutículas 2x día',
              'No morder uñas',
              'Evitar golpes',
              'Regresar en 2-3 semanas',
            ].map((rec) => (
              <button
                key={rec}
                onClick={() => {
                  const recomendaciones = datos.recomendacionesCuidado || [];
                  if (!recomendaciones.includes(rec)) {
                    handleChange('recomendacionesCuidado', [...recomendaciones, rec]);
                  }
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-green-500 hover:text-white text-xs rounded transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Próxima cita sugerida */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Próxima cita sugerida (opcional)
        </label>
        <input
          type="datetime-local"
          value={datos.proximaCitaSugerida ? new Date(datos.proximaCitaSugerida).toISOString().slice(0, 16) : ''}
          onChange={(e) => handleChange('proximaCitaSugerida', e.target.value ? new Date(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
        />
      </div>
    </div>
  );
}
