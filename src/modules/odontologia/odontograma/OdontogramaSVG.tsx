// ============================================================================
// saludvalpa 3.0 - COMPONENTE ODONTOGRAMA SVG
// Odontograma interactivo completo con arcadas dentales superior e inferior
// ============================================================================

import React, { useState, useEffect } from 'react';
import { PiezaDental } from './PiezaDental';
import { LeyendaEstadosDentales } from './EstadoDental';
import type { EstadoDental } from './EstadoDental';
import type { PiezaDental as PiezaDentalType } from '../../../types/index';

// Props del componente Odontograma
interface OdontogramaSVGProps {
  datosOdontograma?: {
    piezas: PiezaDentalType[];
    notas: string;
  };
  onOdontogramaChange?: (piezas: PiezaDentalType[]) => void;
  modoEdicion?: boolean;
  mostrarLeyenda?: boolean;
}

export const OdontogramaSVG: React.FC<OdontogramaSVGProps> = ({
  datosOdontograma,
  onOdontogramaChange,
  modoEdicion = true,
  mostrarLeyenda = true,
}) => {
  // Estado inicial de las piezas dentales
  const [piezas, setPiezas] = useState<PiezaDentalType[]>(() => {
    if (datosOdontograma?.piezas?.length) {
      return datosOdontograma.piezas;
    }
    
    // Crear piezas dentales iniciales (1-32) todas sanas
    return Array.from({ length: 32 }, (_, i) => ({
      numero: i + 1,
      estado: 'sano' as EstadoDental,
      tratamientos: [],
      notas: '',
    }));
  });

  const [notas, setNotas] = useState(datosOdontograma?.notas || '');

  // Actualizar cuando cambien los datos externos
  useEffect(() => {
    if (datosOdontograma?.piezas) {
      setPiezas(datosOdontograma.piezas);
      setNotas(datosOdontograma.notas || '');
    }
  }, [datosOdontograma]);

  // Manejar cambio de estado de una pieza
  const handleEstadoChange = (numero: number, nuevoEstado: EstadoDental) => {
    if (!modoEdicion) return;

    const nuevasPiezas = piezas.map(pieza =>
      pieza.numero === numero
        ? { ...pieza, estado: nuevoEstado }
        : pieza
    );

    setPiezas(nuevasPiezas);
    if (onOdontogramaChange) {
      onOdontogramaChange(nuevasPiezas);
    }
  };

  // Agregar tratamiento a una pieza
  const handleTratamientoAdd = (numero: number, tratamiento: string) => {
    if (!modoEdicion) return;

    const nuevasPiezas = piezas.map(pieza => {
      if (pieza.numero === numero) {
        const tratamientos = [...(pieza.tratamientos || []), tratamiento];
        return { ...pieza, tratamientos };
      }
      return pieza;
    });

    setPiezas(nuevasPiezas);
    if (onOdontogramaChange) {
      onOdontogramaChange(nuevasPiezas);
    }
  };

  // Resetear odontograma (todas sanas)
  const handleReset = () => {
    const nuevasPiezas = piezas.map(pieza => ({
      ...pieza,
      estado: 'sano' as EstadoDental,
      tratamientos: [],
      movilidad: undefined,
      notas: '',
    }));

    setPiezas(nuevasPiezas);
    setNotas('');
    if (onOdontogramaChange) {
      onOdontogramaChange(nuevasPiezas);
    }
  };

  // Exportar datos del odontograma
  const exportarDatos = () => {
    return {
      piezas,
      notas,
      fecha: new Date().toISOString(),
    };
  };

  // Obtener pieza por número
  const getPieza = (numero: number) => {
    return piezas.find(p => p.numero === numero);
  };

  // Renderizar arcada superior
  const renderArcadaSuperior = () => {
    const piezasSuperiores = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    
    return (
      <div className="flex flex-col items-center mb-8">
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-700">Arcada Superior</h3>
          <div className="text-xs text-gray-500">Cuadrantes 1 y 2</div>
        </div>
        
        <div className="relative">
          {/* Línea de la arcada */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded-full transform -translate-y-1/2" />
          
          <div className="flex justify-center items-center gap-1 relative z-10">
            {piezasSuperiores.map(numero => {
              const pieza = getPieza(numero);
              return (
                <div key={numero} className="flex flex-col items-center">
                  <PiezaDental
                    numero={numero}
                    estado={pieza?.estado || 'sano'}
                    tratamientos={pieza?.tratamientos}
                    movilidad={pieza?.movilidad}
                    notas={pieza?.notas}
                    interactivo={modoEdicion}
                    onEstadoChange={handleEstadoChange}
                    onTratamientoAdd={handleTratamientoAdd}
                    tamaño="mediano"
                  />
                  <span className="text-xs mt-1 font-medium">{numero}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar arcada inferior
  const renderArcadaInferior = () => {
    const piezasInferiores = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    
    return (
      <div className="flex flex-col items-center mt-8">
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-700">Arcada Inferior</h3>
          <div className="text-xs text-gray-500">Cuadrantes 3 y 4</div>
        </div>
        
        <div className="relative">
          {/* Línea de la arcada */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded-full transform -translate-y-1/2" />
          
          <div className="flex justify-center items-center gap-1 relative z-10">
            {piezasInferiores.map(numero => {
              const pieza = getPieza(numero);
              return (
                <div key={numero} className="flex flex-col items-center">
                  <PiezaDental
                    numero={numero}
                    estado={pieza?.estado || 'sano'}
                    tratamientos={pieza?.tratamientos}
                    movilidad={pieza?.movilidad}
                    notas={pieza?.notas}
                    interactivo={modoEdicion}
                    onEstadoChange={handleEstadoChange}
                    onTratamientoAdd={handleTratamientoAdd}
                    tamaño="mediano"
                  />
                  <span className="text-xs mt-1 font-medium">{numero}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar cuadrantes
  const renderCuadrantes = () => {
    const cuadrantes = [
      { numero: 1, nombre: 'Superior Derecha', piezas: [18, 17, 16, 15, 14, 13, 12, 11] },
      { numero: 2, nombre: 'Superior Izquierda', piezas: [21, 22, 23, 24, 25, 26, 27, 28] },
      { numero: 3, nombre: 'Inferior Izquierda', piezas: [31, 32, 33, 34, 35, 36, 37, 38] },
      { numero: 4, nombre: 'Inferior Derecha', piezas: [41, 42, 43, 44, 45, 46, 47, 48] },
    ];

    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {cuadrantes.map(cuadrante => (
          <div key={cuadrante.numero} className="border rounded-lg p-3">
            <h4 className="font-bold text-sm mb-2">
              Cuadrante {cuadrante.numero}: {cuadrante.nombre}
            </h4>
            <div className="flex flex-wrap gap-1">
              {cuadrante.piezas.map(numero => {
                const pieza = getPieza(numero);
                return (
                  <div key={numero} className="flex flex-col items-center">
                    <PiezaDental
                      numero={numero}
                      estado={pieza?.estado || 'sano'}
                      tamaño="pequeño"
                      interactivo={modoEdicion}
                      onEstadoChange={handleEstadoChange}
                    />
                    <span className="text-xs">{numero}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="odontograma-container p-4 bg-white rounded-lg border border-gray-200">
      {/* Encabezado con controles */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Odontograma Interactivo</h2>
          <p className="text-sm text-gray-500">
            Sistema FDI • {modoEdicion ? 'Modo edición' : 'Modo visualización'}
          </p>
        </div>
        
        {modoEdicion && (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border"
            >
              Reiniciar
            </button>
            <button
              onClick={() => console.log('Exportar:', exportarDatos())}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded border border-blue-300"
            >
              Exportar
            </button>
          </div>
        )}
      </div>

      {/* Odontograma principal */}
      <div className="mb-8">
        {renderArcadaSuperior()}
        {renderArcadaInferior()}
      </div>

      {/* Cuadrantes detallados */}
      {renderCuadrantes()}

      {/* Notas del odontograma */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas del odontograma:
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          disabled={!modoEdicion}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          rows={3}
          placeholder="Observaciones, diagnósticos, tratamientos planeados..."
        />
      </div>

      {/* Leyenda de estados */}
      {mostrarLeyenda && (
        <div className="mt-8">
          <h3 className="font-bold text-gray-700 mb-3">Leyenda de Estados Dentales</h3>
          <LeyendaEstadosDentales />
        </div>
      )}

      {/* Resumen estadístico */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            {piezas.filter(p => p.estado === 'sano').length}
          </div>
          <div className="text-sm text-blue-600">Piezas sanas</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-700">
            {piezas.filter(p => p.estado === 'cariado').length}
          </div>
          <div className="text-sm text-red-600">Piezas cariadas</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-700">
            {piezas.filter(p => p.estado === 'obturado').length}
          </div>
          <div className="text-sm text-green-600">Piezas obturadas</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">
            {piezas.filter(p => p.estado === 'ausente').length}
          </div>
          <div className="text-sm text-gray-600">Piezas ausentes</div>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="mt-6 text-xs text-gray-500 border-t pt-3">
        <p>
          <strong>Sistema de numeración FDI:</strong> Primer dígito = cuadrante (1-4), 
          Segundo dígito = posición (1-8). Ejemplo: 11 = Incisivo central superior derecho.
        </p>
        <p className="mt-1">
          <strong>Instrucciones:</strong> {modoEdicion 
            ? 'Haz clic en cualquier pieza dental para cambiar su estado o agregar tratamientos.'
            : 'Modo de solo visualización. Para editar, activa el modo edición.'}
        </p>
      </div>
    </div>
  );
};

export default OdontogramaSVG;