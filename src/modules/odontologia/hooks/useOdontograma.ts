// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE ODONTOGRAMA
// Hook personalizado para manejar el odontograma interactivo
// ============================================================================

import { useState, useCallback } from 'react';
import type { PiezaDental } from '../../../types';
import { ESTADOS_DENTALES } from '../odontograma/EstadoDental';

// Información de piezas dentales según sistema FDI (1-32)
const PIEZAS_DENTALES_INICIALES: PiezaDental[] = Array.from({ length: 32 }, (_, i) => ({
  numero: i + 1,
  estado: 'sano',
  tratamientos: [],
  notas: '',
}));

interface UseOdontogramaReturn {
  // Estado del odontograma
  piezas: PiezaDental[];
  notas: string;
  
  // Métodos de manipulación de piezas
  actualizarPieza: (numero: number, cambios: Partial<PiezaDental>) => void;
  actualizarEstado: (numero: number, estado: PiezaDental['estado']) => void;
  agregarTratamiento: (numero: number, tratamiento: string) => void;
  eliminarTratamiento: (numero: number, tratamiento: string) => void;
  actualizarMovilidad: (numero: number, movilidad?: number) => void;
  actualizarNotasPieza: (numero: number, notas: string) => void;
  
  // Métodos de manipulación del odontograma completo
  resetearOdontograma: () => void;
  cargarOdontograma: (piezas: PiezaDental[], notas?: string) => void;
  
  // Métodos de consulta
  obtenerPieza: (numero: number) => PiezaDental | undefined;
  obtenerPiezasPorEstado: (estado: PiezaDental['estado']) => PiezaDental[];
  obtenerPiezasPorCuadrante: (cuadrante: 1 | 2 | 3 | 4) => PiezaDental[];
  obtenerPiezasSuperiores: () => PiezaDental[];
  obtenerPiezasInferiores: () => PiezaDental[];
  
  // Métodos de análisis
  contarPorEstado: () => Record<PiezaDental['estado'], number>;
  calcularIndiceCPOD: () => { c: number; p: number; o: number; d: number; total: number };
  calcularIndiceCEO: () => { c: number; e: number; o: number; total: number };
  generarResumen: () => Record<string, any>;
  
  // Métodos de exportación/importación
  exportarOdontograma: () => string;
  importarOdontograma: (json: string) => void;
  generarReporteTexto: () => string;
  
  // Métodos de utilidad
  esPiezaSuperior: (numero: number) => boolean;
  esPiezaInferior: (numero: number) => boolean;
  obtenerCuadrante: (numero: number) => 1 | 2 | 3 | 4 | null;
  obtenerInfoPieza: (numero: number) => { nombre: string; tipo: string; posicion: string } | null;
}

export function useOdontograma(
  piezasIniciales: PiezaDental[] = PIEZAS_DENTALES_INICIALES,
  notasIniciales: string = ''
): UseOdontogramaReturn {
  const [piezas, setPiezas] = useState<PiezaDental[]>(piezasIniciales);
  const [notas, setNotas] = useState<string>(notasIniciales);

  // Información de piezas dentales según sistema FDI
  const INFO_PIEZAS: Record<number, { nombre: string; tipo: string; posicion: 'superior' | 'inferior' }> = {
    // Cuadrante 1 (Superior derecha)
    11: { nombre: 'Incisivo central superior derecho', tipo: 'incisivo', posicion: 'superior' },
    12: { nombre: 'Incisivo lateral superior derecho', tipo: 'incisivo', posicion: 'superior' },
    13: { nombre: 'Canino superior derecho', tipo: 'canino', posicion: 'superior' },
    14: { nombre: 'Primer premolar superior derecho', tipo: 'premolar', posicion: 'superior' },
    15: { nombre: 'Segundo premolar superior derecho', tipo: 'premolar', posicion: 'superior' },
    16: { nombre: 'Primer molar superior derecho', tipo: 'molar', posicion: 'superior' },
    17: { nombre: 'Segundo molar superior derecho', tipo: 'molar', posicion: 'superior' },
    18: { nombre: 'Tercer molar superior derecho', tipo: 'molar', posicion: 'superior' },
    
    // Cuadrante 2 (Superior izquierda)
    21: { nombre: 'Incisivo central superior izquierdo', tipo: 'incisivo', posicion: 'superior' },
    22: { nombre: 'Incisivo lateral superior izquierdo', tipo: 'incisivo', posicion: 'superior' },
    23: { nombre: 'Canino superior izquierdo', tipo: 'canino', posicion: 'superior' },
    24: { nombre: 'Primer premolar superior izquierdo', tipo: 'premolar', posicion: 'superior' },
    25: { nombre: 'Segundo premolar superior izquierdo', tipo: 'premolar', posicion: 'superior' },
    26: { nombre: 'Primer molar superior izquierdo', tipo: 'molar', posicion: 'superior' },
    27: { nombre: 'Segundo molar superior izquierdo', tipo: 'molar', posicion: 'superior' },
    28: { nombre: 'Tercer molar superior izquierdo', tipo: 'molar', posicion: 'superior' },
    
    // Cuadrante 3 (Inferior izquierda)
    31: { nombre: 'Incisivo central inferior izquierdo', tipo: 'incisivo', posicion: 'inferior' },
    32: { nombre: 'Incisivo lateral inferior izquierdo', tipo: 'incisivo', posicion: 'inferior' },
    33: { nombre: 'Canino inferior izquierdo', tipo: 'canino', posicion: 'inferior' },
    34: { nombre: 'Primer premolar inferior izquierdo', tipo: 'premolar', posicion: 'inferior' },
    35: { nombre: 'Segundo premolar inferior izquierdo', tipo: 'premolar', posicion: 'inferior' },
    36: { nombre: 'Primer molar inferior izquierdo', tipo: 'molar', posicion: 'inferior' },
    37: { nombre: 'Segundo molar inferior izquierdo', tipo: 'molar', posicion: 'inferior' },
    38: { nombre: 'Tercer molar inferior izquierdo', tipo: 'molar', posicion: 'inferior' },
    
    // Cuadrante 4 (Inferior derecha)
    41: { nombre: 'Incisivo central inferior derecho', tipo: 'incisivo', posicion: 'inferior' },
    42: { nombre: 'Incisivo lateral inferior derecho', tipo: 'incisivo', posicion: 'inferior' },
    43: { nombre: 'Canino inferior derecho', tipo: 'canino', posicion: 'inferior' },
    44: { nombre: 'Primer premolar inferior derecho', tipo: 'premolar', posicion: 'inferior' },
    45: { nombre: 'Segundo premolar inferior derecho', tipo: 'premolar', posicion: 'inferior' },
    46: { nombre: 'Primer molar inferior derecho', tipo: 'molar', posicion: 'inferior' },
    47: { nombre: 'Segundo molar inferior derecho', tipo: 'molar', posicion: 'inferior' },
    48: { nombre: 'Tercer molar inferior derecho', tipo: 'molar', posicion: 'inferior' },
  };

  // Actualizar una pieza específica
  const actualizarPieza = useCallback((numero: number, cambios: Partial<PiezaDental>) => {
    setPiezas(prev => prev.map(pieza =>
      pieza.numero === numero ? { ...pieza, ...cambios } : pieza
    ));
  }, []);

  // Actualizar solo el estado de una pieza
  const actualizarEstado = useCallback((numero: number, estado: PiezaDental['estado']) => {
    actualizarPieza(numero, { estado });
  }, [actualizarPieza]);

  // Agregar tratamiento a una pieza
  const agregarTratamiento = useCallback((numero: number, tratamiento: string) => {
    setPiezas(prev => prev.map(pieza => {
      if (pieza.numero === numero) {
        const tratamientos = [...pieza.tratamientos, tratamiento];
        return { ...pieza, tratamientos };
      }
      return pieza;
    }));
  }, []);

  // Eliminar tratamiento de una pieza
  const eliminarTratamiento = useCallback((numero: number, tratamiento: string) => {
    setPiezas(prev => prev.map(pieza => {
      if (pieza.numero === numero) {
        const tratamientos = pieza.tratamientos.filter(t => t !== tratamiento);
        return { ...pieza, tratamientos };
      }
      return pieza;
    }));
  }, []);

  // Actualizar movilidad de una pieza
  const actualizarMovilidad = useCallback((numero: number, movilidad?: number) => {
    actualizarPieza(numero, { movilidad });
  }, [actualizarPieza]);

  // Actualizar notas de una pieza específica
  const actualizarNotasPieza = useCallback((numero: number, notas: string) => {
    actualizarPieza(numero, { notas });
  }, [actualizarPieza]);

  // Resetear odontograma a estado inicial
  const resetearOdontograma = useCallback(() => {
    setPiezas(PIEZAS_DENTALES_INICIALES);
    setNotas('');
  }, []);

  // Cargar un odontograma completo
  const cargarOdontograma = useCallback((nuevasPiezas: PiezaDental[], nuevasNotas?: string) => {
    setPiezas(nuevasPiezas);
    if (nuevasNotas !== undefined) {
      setNotas(nuevasNotas);
    }
  }, []);

  // Obtener información de una pieza específica
  const obtenerPieza = useCallback((numero: number): PiezaDental | undefined => {
    return piezas.find(p => p.numero === numero);
  }, [piezas]);

  // Obtener piezas por estado
  const obtenerPiezasPorEstado = useCallback((estado: PiezaDental['estado']): PiezaDental[] => {
    return piezas.filter(p => p.estado === estado);
  }, [piezas]);

  // Obtener piezas por cuadrante
  const obtenerPiezasPorCuadrante = useCallback((cuadrante: 1 | 2 | 3 | 4): PiezaDental[] => {
    const rangos: Record<number, [number, number]> = {
      1: [11, 18], // Superior derecha
      2: [21, 28], // Superior izquierda
      3: [31, 38], // Inferior izquierda
      4: [41, 48], // Inferior derecha
    };
    
    const [inicio, fin] = rangos[cuadrante];
    return piezas.filter(p => p.numero >= inicio && p.numero <= fin);
  }, [piezas]);

  // Obtener todas las piezas superiores
  const obtenerPiezasSuperiores = useCallback((): PiezaDental[] => {
    return piezas.filter(p => p.numero >= 11 && p.numero <= 28);
  }, [piezas]);

  // Obtener todas las piezas inferiores
  const obtenerPiezasInferiores = useCallback((): PiezaDental[] => {
    return piezas.filter(p => p.numero >= 31 && p.numero <= 48);
  }, [piezas]);

  // Contar piezas por estado
  const contarPorEstado = useCallback((): Record<PiezaDental['estado'], number> => {
    const conteo: Record<string, number> = {};
    
    Object.values(ESTADOS_DENTALES).forEach(estado => {
      conteo[estado] = 0;
    });
    
    piezas.forEach(pieza => {
      conteo[pieza.estado] = (conteo[pieza.estado] || 0) + 1;
    });
    
    return conteo as Record<PiezaDental['estado'], number>;
  }, [piezas]);

  // Calcular índice CPOD (Cariados, Perdidos, Obturados, Dientes)
  const calcularIndiceCPOD = useCallback(() => {
    const piezasAdultas = piezas.filter(p => p.numero >= 11); // Solo dientes permanentes
    
    const c = piezasAdultas.filter(p => p.estado === 'cariado').length;
    const p = piezasAdultas.filter(p => p.estado === 'ausente').length;
    const o = piezasAdultas.filter(p => p.estado === 'obturado').length;
    const d = c + p + o;
    
    return { c, p, o, d, total: piezasAdultas.length };
  }, [piezas]);

  // Calcular índice CEO (Cariados, Extraídos, Obturados) para dientes temporales
  const calcularIndiceCEO = useCallback(() => {
    // Para este ejemplo, asumimos que los dientes temporales son 51-85
    // En un sistema real, necesitaríamos identificar dientes temporales vs permanentes
    const c = 0; // Dientes temporales cariados
    const e = 0; // Dientes temporales extraídos
    const o = 0; // Dientes temporales obturados
    
    return { c, e, o, total: c + e + o };
  }, []);

  // Generar resumen completo del odontograma
  const generarResumen = useCallback((): Record<string, any> => {
    const conteoEstados = contarPorEstado();
    const cpod = calcularIndiceCPOD();
    const ceo = calcularIndiceCEO();
    
    const piezasConTratamientos = piezas.filter(p => p.tratamientos.length > 0);
    const piezasConMovilidad = piezas.filter(p => p.movilidad && p.movilidad > 0);
    
    return {
      fecha: new Date().toISOString(),
      totalPiezas: piezas.length,
      conteoEstados,
      indices: { cpod, ceo },
      tratamientos: {
        total: piezasConTratamientos.length,
        piezas: piezasConTratamientos.map(p => ({
          numero: p.numero,
          tratamientos: p.tratamientos,
        })),
      },
      movilidad: {
        total: piezasConMovilidad.length,
        piezas: piezasConMovilidad.map(p => ({
          numero: p.numero,
          grado: p.movilidad,
        })),
      },
      notas,
    };
  }, [piezas, notas, contarPorEstado, calcularIndiceCPOD, calcularIndiceCEO]);

  // Exportar odontograma a JSON
  const exportarOdontograma = useCallback((): string => {
    return JSON.stringify({
      version: '1.0',
      fechaExportacion: new Date().toISOString(),
      piezas,
      notas,
      resumen: generarResumen(),
    }, null, 2);
  }, [piezas, notas, generarResumen]);

  // Importar odontograma desde JSON
  const importarOdontograma = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.piezas && Array.isArray(data.piezas)) {
        setPiezas(data.piezas);
        if (data.notas !== undefined) {
          setNotas(data.notas);
        }
        return { success: true, count: data.piezas.length };
      }
      return { success: false, error: 'Formato inválido' };
    } catch (error) {
      console.error('Error importando odontograma:', error);
      return { success: false, error: 'JSON inválido' };
    }
  }, []);

  // Verificar si una pieza es superior
  const esPiezaSuperior = useCallback((numero: number): boolean => {
    return numero >= 11 && numero <= 28;
  }, []);

  // Verificar si una pieza es inferior
  const esPiezaInferior = useCallback((numero: number): boolean => {
    return numero >= 31 && numero <= 48;
  }, []);

  // Obtener cuadrante de una pieza
  const obtenerCuadrante = useCallback((numero: number): 1 | 2 | 3 | 4 | null => {
    if (numero >= 11 && numero <= 18) return 1;
    if (numero >= 21 && numero <= 28) return 2;
    if (numero >= 31 && numero <= 38) return 3;
    if (numero >= 41 && numero <= 48) return 4;
    return null;
  }, []);

  // Obtener información detallada de una pieza
  const obtenerInfoPieza = useCallback((numero: number): { nombre: string; tipo: string; posicion: string } | null => {
    return INFO_PIEZAS[numero] || null;
  }, []);

  // Generar reporte en texto plano
  const generarReporteTexto = useCallback((): string => {
    const resumen = generarResumen();
    const conteo = resumen.conteoEstados as Record<string, number>;
    
    let reporte = `REPORTE DE ODONTOGRAMA\n`;
    reporte += `Fecha: ${new Date().toLocaleDateString('es-MX')}\n`;
    reporte += `Total de piezas: ${resumen.totalPiezas}\n\n`;
    
    reporte += `ESTADOS DENTALES:\n`;
    Object.entries(conteo).forEach(([estado, cantidad]) => {
      if (cantidad > 0) {
        reporte += `  ${estado}: ${cantidad} piezas\n`;
      }
    });
    
    reporte += `\nÍNDICE CPOD:\n`;
    reporte += `  Cariados: ${resumen.indices.cpod.c}\n`;
    reporte += `  Perdidos: ${resumen.indices.cpod.p}\n`;
    reporte += `  Obturados: ${resumen.indices.cpod.o}\n`;
    reporte += `  Total CPOD: ${resumen.indices.cpod.d}\n`;
    
    if (resumen.tratamientos.total > 0) {
      reporte += `\nTRATAMIENTOS REGISTRADOS:\n`;
      resumen.tratamientos.piezas.forEach((p: any) => {
        reporte += `  Pieza ${p.numero}: ${p.tratamientos.join(', ')}\n`;
      });
    }
    
    if (resumen.movilidad.total > 0) {
      reporte += `\nMOVILIDAD DENTAL:\n`;
      resumen.movilidad.piezas.forEach((p: any) => {
        reporte += `  Pieza ${p.numero}: Grado ${p.grado}\n`;
      });
    }
    
    if (notas) {
      reporte += `\nNOTAS:\n${notas}\n`;
    }
    
    return reporte;
  }, [generarResumen, notas]);
  return {
    piezas,
    notas,
    actualizarPieza,
    actualizarEstado,
    agregarTratamiento,
    eliminarTratamiento,
    actualizarMovilidad,
    actualizarNotasPieza,
    resetearOdontograma,
    cargarOdontograma,
    obtenerPieza,
    obtenerPiezasPorEstado,
    obtenerPiezasPorCuadrante,
    obtenerPiezasSuperiores,
    obtenerPiezasInferiores,
    contarPorEstado,
    calcularIndiceCPOD,
    calcularIndiceCEO,
    generarResumen,
    exportarOdontograma,
    importarOdontograma,
    generarReporteTexto,
    esPiezaSuperior,
    esPiezaInferior,
    obtenerCuadrante,
    obtenerInfoPieza,
  };
}

export default useOdontograma;
