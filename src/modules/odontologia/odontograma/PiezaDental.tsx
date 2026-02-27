// ============================================================================
// saludvalpa 3.0 - COMPONENTE PIEZA DENTAL
// Componente individual para representar una pieza dental en el odontograma
// ============================================================================

import React, { useState } from 'react';
import { ESTADOS_DENTALES, COLORES_ESTADOS } from './EstadoDental';
import type { EstadoDental } from './EstadoDental';

// Sistema de numeración dental (FDI)
export const SISTEMA_NUMERACION = {
  FDI: 'fdi', // Sistema internacional (1-32)
  UNIVERSAL: 'universal', // Sistema americano (1-32)
  PALMER: 'palmer', // Sistema Palmer (cuadrantes)
} as const;

export type SistemaNumeracion = typeof SISTEMA_NUMERACION[keyof typeof SISTEMA_NUMERACION];

// Información de cada pieza dental según sistema FDI
export const INFO_PIEZAS_DENTALES: Record<number, {
  nombre: string;
  tipo: 'incisivo' | 'canino' | 'premolar' | 'molar';
  cuadrante: 1 | 2 | 3 | 4;
  posicion: 'superior' | 'inferior';
  erupcion: number; // Edad aproximada de erupción (meses/años)
}> = {
  // Cuadrante 1 (Superior derecha)
  11: { nombre: 'Incisivo central superior derecho', tipo: 'incisivo', cuadrante: 1, posicion: 'superior', erupcion: 7 },
  12: { nombre: 'Incisivo lateral superior derecho', tipo: 'incisivo', cuadrante: 1, posicion: 'superior', erupcion: 8 },
  13: { nombre: 'Canino superior derecho', tipo: 'canino', cuadrante: 1, posicion: 'superior', erupcion: 11 },
  14: { nombre: 'Primer premolar superior derecho', tipo: 'premolar', cuadrante: 1, posicion: 'superior', erupcion: 10 },
  15: { nombre: 'Segundo premolar superior derecho', tipo: 'premolar', cuadrante: 1, posicion: 'superior', erupcion: 10 },
  16: { nombre: 'Primer molar superior derecho', tipo: 'molar', cuadrante: 1, posicion: 'superior', erupcion: 6 },
  17: { nombre: 'Segundo molar superior derecho', tipo: 'molar', cuadrante: 1, posicion: 'superior', erupcion: 12 },
  18: { nombre: 'Tercer molar superior derecho', tipo: 'molar', cuadrante: 1, posicion: 'superior', erupcion: 18 },
  
  // Cuadrante 2 (Superior izquierda)
  21: { nombre: 'Incisivo central superior izquierdo', tipo: 'incisivo', cuadrante: 2, posicion: 'superior', erupcion: 7 },
  22: { nombre: 'Incisivo lateral superior izquierdo', tipo: 'incisivo', cuadrante: 2, posicion: 'superior', erupcion: 8 },
  23: { nombre: 'Canino superior izquierdo', tipo: 'canino', cuadrante: 2, posicion: 'superior', erupcion: 11 },
  24: { nombre: 'Primer premolar superior izquierdo', tipo: 'premolar', cuadrante: 2, posicion: 'superior', erupcion: 10 },
  25: { nombre: 'Segundo premolar superior izquierdo', tipo: 'premolar', cuadrante: 2, posicion: 'superior', erupcion: 10 },
  26: { nombre: 'Primer molar superior izquierdo', tipo: 'molar', cuadrante: 2, posicion: 'superior', erupcion: 6 },
  27: { nombre: 'Segundo molar superior izquierdo', tipo: 'molar', cuadrante: 2, posicion: 'superior', erupcion: 12 },
  28: { nombre: 'Tercer molar superior izquierdo', tipo: 'molar', cuadrante: 2, posicion: 'superior', erupcion: 18 },
  
  // Cuadrante 3 (Inferior izquierda)
  31: { nombre: 'Incisivo central inferior izquierdo', tipo: 'incisivo', cuadrante: 3, posicion: 'inferior', erupcion: 6 },
  32: { nombre: 'Incisivo lateral inferior izquierdo', tipo: 'incisivo', cuadrante: 3, posicion: 'inferior', erupcion: 7 },
  33: { nombre: 'Canino inferior izquierdo', tipo: 'canino', cuadrante: 3, posicion: 'inferior', erupcion: 9 },
  34: { nombre: 'Primer premolar inferior izquierdo', tipo: 'premolar', cuadrante: 3, posicion: 'inferior', erupcion: 10 },
  35: { nombre: 'Segundo premolar inferior izquierdo', tipo: 'premolar', cuadrante: 3, posicion: 'inferior', erupcion: 11 },
  36: { nombre: 'Primer molar inferior izquierdo', tipo: 'molar', cuadrante: 3, posicion: 'inferior', erupcion: 6 },
  37: { nombre: 'Segundo molar inferior izquierdo', tipo: 'molar', cuadrante: 3, posicion: 'inferior', erupcion: 12 },
  38: { nombre: 'Tercer molar inferior izquierdo', tipo: 'molar', cuadrante: 3, posicion: 'inferior', erupcion: 18 },
  
  // Cuadrante 4 (Inferior derecha)
  41: { nombre: 'Incisivo central inferior derecho', tipo: 'incisivo', cuadrante: 4, posicion: 'inferior', erupcion: 6 },
  42: { nombre: 'Incisivo lateral inferior derecho', tipo: 'incisivo', cuadrante: 4, posicion: 'inferior', erupcion: 7 },
  43: { nombre: 'Canino inferior derecho', tipo: 'canino', cuadrante: 4, posicion: 'inferior', erupcion: 9 },
  44: { nombre: 'Primer premolar inferior derecho', tipo: 'premolar', cuadrante: 4, posicion: 'inferior', erupcion: 10 },
  45: { nombre: 'Segundo premolar inferior derecho', tipo: 'premolar', cuadrante: 4, posicion: 'inferior', erupcion: 11 },
  46: { nombre: 'Primer molar inferior derecho', tipo: 'molar', cuadrante: 4, posicion: 'inferior', erupcion: 6 },
  47: { nombre: 'Segundo molar inferior derecho', tipo: 'molar', cuadrante: 4, posicion: 'inferior', erupcion: 12 },
  48: { nombre: 'Tercer molar inferior derecho', tipo: 'molar', cuadrante: 4, posicion: 'inferior', erupcion: 18 },
};

// Props del componente PiezaDental
interface PiezaDentalProps {
  numero: number; // Número FDI (1-32)
  estado: EstadoDental;
  tratamientos?: string[];
  movilidad?: number;
  notas?: string;
  interactivo?: boolean;
  onEstadoChange?: (numero: number, nuevoEstado: EstadoDental) => void;
  onTratamientoAdd?: (numero: number, tratamiento: string) => void;
  tamaño?: 'pequeño' | 'mediano' | 'grande';
}

export const PiezaDental: React.FC<PiezaDentalProps> = ({
  numero,
  estado = ESTADOS_DENTALES.SANO,
  tratamientos = [],
  movilidad,
  notas,
  interactivo = true,
  onEstadoChange,
  onTratamientoAdd: _onTratamientoAdd,
  tamaño = 'mediano',
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const infoPieza = INFO_PIEZAS_DENTALES[numero];
  
  if (!infoPieza) {
    console.warn(`Número dental ${numero} no válido`);
    return null;
  }

  // Tamaños en píxeles
  const dimensiones = {
    pequeño: { width: 24, height: 36, fontSize: 10 },
    mediano: { width: 32, height: 48, fontSize: 12 },
    grande: { width: 40, height: 60, fontSize: 14 },
  }[tamaño];

  // Forma de la pieza según tipo
  const getFormaSVG = () => {
    const { width, height } = dimensiones;
    const mitadWidth = width / 2;
    const cuartoHeight = height / 4;
    
    switch (infoPieza.tipo) {
      case 'incisivo':
        // Forma rectangular con bordes redondeados
        return (
          <rect
            x="1"
            y="1"
            width={width - 2}
            height={height - 2}
            rx={mitadWidth / 3}
            ry={cuartoHeight / 2}
            fill={COLORES_ESTADOS[estado]}
            stroke="#333"
            strokeWidth="1"
          />
        );
      case 'canino':
        // Forma más puntiaguda
        return (
          <path
            d={`M ${mitadWidth} 1 L ${width - 1} ${cuartoHeight} L ${width - 1} ${height - cuartoHeight} L ${mitadWidth} ${height - 1} L 1 ${height - cuartoHeight} L 1 ${cuartoHeight} Z`}
            fill={COLORES_ESTADOS[estado]}
            stroke="#333"
            strokeWidth="1"
          />
        );
      case 'premolar':
        // Forma rectangular con protuberancias
        return (
          <rect
            x="1"
            y="1"
            width={width - 2}
            height={height - 2}
            rx={mitadWidth / 4}
            ry={cuartoHeight / 3}
            fill={COLORES_ESTADOS[estado]}
            stroke="#333"
            strokeWidth="1"
          />
        );
      case 'molar':
        // Forma más cuadrada con múltiples cúspides
        return (
          <rect
            x="1"
            y="1"
            width={width - 2}
            height={height - 2}
            rx={mitadWidth / 6}
            ry={cuartoHeight / 4}
            fill={COLORES_ESTADOS[estado]}
            stroke="#333"
            strokeWidth="1"
          />
        );
      default:
        return (
          <rect
            x="1"
            y="1"
            width={width - 2}
            height={height - 2}
            rx="4"
            fill={COLORES_ESTADOS[estado]}
            stroke="#333"
            strokeWidth="1"
          />
        );
    }
  };

  const handleClick = () => {
    if (interactivo) {
      setMostrarDetalles(!mostrarDetalles);
    }
  };

  const handleEstadoClick = (nuevoEstado: EstadoDental) => {
    if (interactivo && onEstadoChange) {
      onEstadoChange(numero, nuevoEstado);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={handleClick}
        title={`${numero}: ${infoPieza.nombre} - ${estado}`}
      >
        <svg
          width={dimensiones.width}
          height={dimensiones.height}
          viewBox={`0 0 ${dimensiones.width} ${dimensiones.height}`}
        >
          {getFormaSVG()}
          <text
            x={dimensiones.width / 2}
            y={dimensiones.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={dimensiones.fontSize}
            fill="#000"
            fontWeight="bold"
          >
            {numero}
          </text>
          
          {/* Indicador de movilidad */}
          {movilidad && movilidad > 0 && (
            <circle
              cx={dimensiones.width - 6}
              cy={6}
              r="3"
              fill="#FFEB3B"
              stroke="#333"
              strokeWidth="0.5"
            />
          )}
          
          {/* Indicador de tratamientos */}
          {tratamientos.length > 0 && (
            <circle
              cx={6}
              cy={6}
              r="3"
              fill="#2196F3"
              stroke="#333"
              strokeWidth="0.5"
            />
          )}
        </svg>
      </div>

      {/* Detalles emergentes */}
      {mostrarDetalles && interactivo && (
        <div className="absolute z-10 mt-2 w-64 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-sm">
                Pieza {numero}: {infoPieza.nombre}
              </h4>
              <p className="text-xs text-gray-500">
                {infoPieza.posicion} {infoPieza.tipo} • Cuadrante {infoPieza.cuadrante}
              </p>
            </div>
            <button
              onClick={() => setMostrarDetalles(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Estado actual */}
          <div className="mb-3">
            <p className="text-xs font-medium mb-1">Estado actual:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(ESTADOS_DENTALES).map(([key, estadoValue]) => (
                <button
                  key={estadoValue}
                  onClick={() => handleEstadoClick(estadoValue)}
                  className={`px-2 py-1 text-xs rounded ${
                    estado === estadoValue
                      ? 'ring-2 ring-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: COLORES_ESTADOS[estadoValue],
                    color: estadoValue === ESTADOS_DENTALES.SANO ? '#000' : '#fff',
                  }}
                >
                  {key.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Tratamientos */}
          {tratamientos.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium mb-1">Tratamientos:</p>
              <ul className="text-xs">
                {tratamientos.map((tratamiento, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {tratamiento}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Movilidad */}
          {movilidad && (
            <div className="mb-3">
              <p className="text-xs font-medium mb-1">
                Movilidad: Grado {movilidad}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3].map((grado) => (
                  <div
                    key={grado}
                    className={`w-6 h-2 rounded ${
                      grado <= movilidad ? 'bg-yellow-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {notas && (
            <div>
              <p className="text-xs font-medium mb-1">Notas:</p>
              <p className="text-xs text-gray-600">{notas}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PiezaDental;