// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE PROCEDIMIENTOS DENTALES
// Hook personalizado para manejar procedimientos dentales con códigos CDT
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import type { ProcedimientoOdontologico } from '../../../types';

// Códigos CDT comunes (Códigos de Tratamiento Dental)
const CODIGOS_CDT_PRECARGADOS: ProcedimientoOdontologico[] = [
  // Diagnóstico
  { codigo: 'D0120', descripcion: 'Examen periódico oral', piezas: [], costo: 300, duracion: 30, prioridad: 'media' },
  { codigo: 'D0140', descripcion: 'Examen de emergencia limitado', piezas: [], costo: 200, duracion: 20, prioridad: 'alta' },
  { codigo: 'D0150', descripcion: 'Examen oral completo', piezas: [], costo: 500, duracion: 45, prioridad: 'media' },
  
  // Radiografías
  { codigo: 'D0210', descripcion: 'Radiografía intraoral completa', piezas: [], costo: 400, duracion: 20, prioridad: 'media' },
  { codigo: 'D0220', descripcion: 'Radiografía periapical', piezas: [], costo: 150, duracion: 10, prioridad: 'media' },
  { codigo: 'D0270', descripcion: 'Radiografía bitewing', piezas: [], costo: 200, duracion: 15, prioridad: 'media' },
  
  // Profilaxis y prevención
  { codigo: 'D1110', descripcion: 'Profilaxis dental adulto', piezas: [], costo: 400, duracion: 45, prioridad: 'media' },
  { codigo: 'D1120', descripcion: 'Profilaxis dental niño', piezas: [], costo: 300, duracion: 30, prioridad: 'media' },
  { codigo: 'D1351', descripcion: 'Sellante de fosas y fisuras', piezas: [], costo: 250, duracion: 20, prioridad: 'media' },
  { codigo: 'D1206', descripcion: 'Aplicación tópica de fluoruro', piezas: [], costo: 200, duracion: 15, prioridad: 'media' },
  
  // Restauraciones
  { codigo: 'D2140', descripcion: 'Amalgama de 1 superficie', piezas: [], costo: 600, duracion: 45, prioridad: 'media' },
  { codigo: 'D2150', descripcion: 'Amalgama de 2 superficies', piezas: [], costo: 800, duracion: 60, prioridad: 'media' },
  { codigo: 'D2330', descripcion: 'Resina de 1 superficie anterior', piezas: [], costo: 700, duracion: 50, prioridad: 'media' },
  { codigo: 'D2331', descripcion: 'Resina de 2 superficies anterior', piezas: [], costo: 900, duracion: 70, prioridad: 'media' },
  { codigo: 'D2391', descripcion: 'Resina de 1 superficie posterior', piezas: [], costo: 750, duracion: 55, prioridad: 'media' },
  { codigo: 'D2392', descripcion: 'Resina de 2 superficies posterior', piezas: [], costo: 950, duracion: 75, prioridad: 'media' },
  
  // Endodoncia
  { codigo: 'D3310', descripcion: 'Endodoncia anterior', piezas: [], costo: 2500, duracion: 90, prioridad: 'alta' },
  { codigo: 'D3320', descripcion: 'Endodoncia premolar', piezas: [], costo: 3000, duracion: 120, prioridad: 'alta' },
  { codigo: 'D3330', descripcion: 'Endodoncia molar', piezas: [], costo: 4000, duracion: 150, prioridad: 'alta' },
  
  // Periodoncia
  { codigo: 'D4341', descripcion: 'Raspado y alisado radicular por cuadrante', piezas: [], costo: 1200, duracion: 60, prioridad: 'alta' },
  { codigo: 'D4910', descripcion: 'Mantenimiento periodontal', piezas: [], costo: 800, duracion: 45, prioridad: 'media' },
  
  // Cirugía
  { codigo: 'D7111', descripcion: 'Extracción simple', piezas: [], costo: 800, duracion: 30, prioridad: 'media' },
  { codigo: 'D7210', descripcion: 'Extracción quirúrgica', piezas: [], costo: 1500, duracion: 60, prioridad: 'alta' },
  { codigo: 'D7240', descripcion: 'Extracción de molar incluido', piezas: [], costo: 2500, duracion: 90, prioridad: 'alta' },
  
  // Prótesis
  { codigo: 'D5110', descripcion: 'Corona completa de resina', piezas: [], costo: 3000, duracion: 120, prioridad: 'media' },
  { codigo: 'D5120', descripcion: 'Corona completa de porcelana', piezas: [], costo: 5000, duracion: 150, prioridad: 'media' },
  { codigo: 'D5130', descripcion: 'Corona de metal-porcelana', piezas: [], costo: 4500, duracion: 140, prioridad: 'media' },
  { codigo: 'D5211', descripcion: 'Puente de resina por unidad', piezas: [], costo: 4000, duracion: 180, prioridad: 'media' },
  { codigo: 'D5212', descripcion: 'Puente de porcelana por unidad', piezas: [], costo: 6000, duracion: 210, prioridad: 'media' },
  
  // Ortodoncia
  { codigo: 'D8010', descripcion: 'Consulta de ortodoncia', piezas: [], costo: 500, duracion: 60, prioridad: 'media' },
  { codigo: 'D8080', descripcion: 'Tratamiento de ortodoncia completo', piezas: [], costo: 30000, duracion: 720, prioridad: 'baja' },
];

interface UseProcedimientosDentalesReturn {
  // Lista de procedimientos
  procedimientos: ProcedimientoOdontologico[];
  procedimientosPrecargados: ProcedimientoOdontologico[];
  
  // Métodos de búsqueda
  buscarPorCodigo: (codigo: string) => ProcedimientoOdontologico | undefined;
  buscarPorDescripcion: (termino: string) => ProcedimientoOdontologico[];
  buscarPorPieza: (numeroPieza: number) => ProcedimientoOdontologico[];
  
  // Métodos de gestión
  agregarProcedimiento: (procedimiento: ProcedimientoOdontologico) => void;
  eliminarProcedimiento: (codigo: string) => void;
  actualizarProcedimiento: (codigo: string, procedimiento: ProcedimientoOdontologico) => void;
  
  // Métodos de cálculo
  calcularCostoTotal: (procedimientos: ProcedimientoOdontologico[]) => number;
  calcularDuracionTotal: (procedimientos: ProcedimientoOdontologico[]) => number;
  filtrarPorPrioridad: (prioridad: 'alta' | 'media' | 'baja') => ProcedimientoOdontologico[];
  
  // Métodos de importación/exportación
  exportarProcedimientos: () => string;
  importarProcedimientos: (json: string) => void;
}

export function useProcedimientosDentales(
  procedimientosIniciales: ProcedimientoOdontologico[] = []
): UseProcedimientosDentalesReturn {
  const [procedimientos, setProcedimientos] = useState<ProcedimientoOdontologico[]>(procedimientosIniciales);
  const [procedimientosPrecargados] = useState<ProcedimientoOdontologico[]>(CODIGOS_CDT_PRECARGADOS);

  // Buscar procedimiento por código
  const buscarPorCodigo = useCallback((codigo: string): ProcedimientoOdontologico | undefined => {
    return [...procedimientos, ...procedimientosPrecargados].find(p => p.codigo === codigo);
  }, [procedimientos, procedimientosPrecargados]);

  // Buscar procedimientos por término en descripción
  const buscarPorDescripcion = useCallback((termino: string): ProcedimientoOdontologico[] => {
    const terminoLower = termino.toLowerCase();
    return [...procedimientos, ...procedimientosPrecargados].filter(p =>
      p.descripcion.toLowerCase().includes(terminoLower) ||
      p.codigo.toLowerCase().includes(terminoLower)
    );
  }, [procedimientos, procedimientosPrecargados]);

  // Buscar procedimientos que afecten una pieza específica
  const buscarPorPieza = useCallback((numeroPieza: number): ProcedimientoOdontologico[] => {
    return procedimientos.filter(p => p.piezas.includes(numeroPieza));
  }, [procedimientos]);

  // Agregar nuevo procedimiento
  const agregarProcedimiento = useCallback((procedimiento: ProcedimientoOdontologico) => {
    setProcedimientos(prev => {
      // Verificar si ya existe un procedimiento con el mismo código
      const existe = prev.some(p => p.codigo === procedimiento.codigo);
      if (existe) {
        console.warn(`Ya existe un procedimiento con código ${procedimiento.codigo}`);
        return prev;
      }
      return [...prev, procedimiento];
    });
  }, []);

  // Eliminar procedimiento por código
  const eliminarProcedimiento = useCallback((codigo: string) => {
    setProcedimientos(prev => prev.filter(p => p.codigo !== codigo));
  }, []);

  // Actualizar procedimiento existente
  const actualizarProcedimiento = useCallback((codigo: string, procedimiento: ProcedimientoOdontologico) => {
    setProcedimientos(prev => prev.map(p => p.codigo === codigo ? procedimiento : p));
  }, []);

  // Calcular costo total de una lista de procedimientos
  const calcularCostoTotal = useCallback((procedimientosLista: ProcedimientoOdontologico[]): number => {
    return procedimientosLista.reduce((total, p) => total + p.costo, 0);
  }, []);

  // Calcular duración total de una lista de procedimientos
  const calcularDuracionTotal = useCallback((procedimientosLista: ProcedimientoOdontologico[]): number => {
    return procedimientosLista.reduce((total, p) => total + p.duracion, 0);
  }, []);

  // Filtrar procedimientos por prioridad
  const filtrarPorPrioridad = useCallback((prioridad: 'alta' | 'media' | 'baja'): ProcedimientoOdontologico[] => {
    return procedimientos.filter(p => p.prioridad === prioridad);
  }, [procedimientos]);

  // Exportar procedimientos a JSON
  const exportarProcedimientos = useCallback((): string => {
    return JSON.stringify({
      version: '1.0',
      fechaExportacion: new Date().toISOString(),
      procedimientos,
    }, null, 2);
  }, [procedimientos]);

  // Importar procedimientos desde JSON
  const importarProcedimientos = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.procedimientos && Array.isArray(data.procedimientos)) {
        setProcedimientos(data.procedimientos);
        return { success: true, count: data.procedimientos.length };
      }
      return { success: false, error: 'Formato inválido' };
    } catch (error) {
      console.error('Error importando procedimientos:', error);
      return { success: false, error: 'JSON inválido' };
    }
  }, []);

  // Cargar procedimientos precargados si no hay procedimientos iniciales
  useEffect(() => {
    if (procedimientos.length === 0) {
      // Podríamos cargar algunos procedimientos precargados por defecto
      // Pero por ahora solo inicializamos vacío
    }
  }, [procedimientos.length]);

  return {
    procedimientos,
    procedimientosPrecargados,
    buscarPorCodigo,
    buscarPorDescripcion,
    buscarPorPieza,
    agregarProcedimiento,
    eliminarProcedimiento,
    actualizarProcedimiento,
    calcularCostoTotal,
    calcularDuracionTotal,
    filtrarPorPrioridad,
    exportarProcedimientos,
    importarProcedimientos,
  };
}

export default useProcedimientosDentales;