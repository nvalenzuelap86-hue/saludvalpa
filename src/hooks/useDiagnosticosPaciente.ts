// ============================================================================
// saludvalpa 3.0 - DIAGNÓSTICOS DEL PACIENTE HOOK
// Hook personalizado para gestionar diagnósticos del historial clínico
// ============================================================================

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { DiagnosticoEntry, TipoProfesion } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UseDiagnosticosPacienteReturn {
  diagnosticos: DiagnosticoEntry[] | undefined;
  cargando: boolean;
  agregarDiagnostico: (datos: Omit<DiagnosticoEntry, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  actualizarDiagnostico: (id: string, datos: Partial<DiagnosticoEntry>) => Promise<void>;
  eliminarDiagnostico: (id: string) => Promise<void>;
  toggleDiagnosticoActivo: (id: string, activo: boolean) => Promise<void>;
  obtenerDiagnosticosActivos: () => DiagnosticoEntry[];
  error: string | null;
}

export function useDiagnosticosPaciente(pacienteId: string, profesion?: TipoProfesion): UseDiagnosticosPacienteReturn {
  const [error, setError] = useState<string | null>(null);

  const diagnosticos = useLiveQuery(
    async () => {
      try {
        let query = db.diagnosticos
          .where('pacienteId')
          .equals(pacienteId);

        if (profesion) {
          query = query.and(d => d.profesion === profesion) as any;
        }

        return await query
          .reverse()
          .sortBy('fecha');
      } catch (err) {
        console.error('Error al cargar diagnósticos:', err);
        setError('Error al cargar diagnósticos');
        return [];
      }
    },
    [pacienteId, profesion]
  );

  const agregarDiagnostico = useCallback(async (
    datos: Omit<DiagnosticoEntry, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
  ) => {
    try {
      const now = new Date();
      const nuevoDiagnostico: DiagnosticoEntry = {
        ...datos,
        id: uuidv4(),
        fechaCreacion: now,
        fechaActualizacion: now,
      };
      await db.diagnosticos.add(nuevoDiagnostico);
      setError(null);
    } catch (err) {
      console.error('Error al agregar diagnóstico:', err);
      setError('Error al agregar diagnóstico');
      throw err;
    }
  }, []);

  const actualizarDiagnostico = useCallback(async (
    id: string,
    datos: Partial<DiagnosticoEntry>
  ) => {
    try {
      await db.diagnosticos.update(id, {
        ...datos,
        fechaActualizacion: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar diagnóstico:', err);
      setError('Error al actualizar diagnóstico');
      throw err;
    }
  }, []);

  const eliminarDiagnostico = useCallback(async (id: string) => {
    try {
      await db.diagnosticos.delete(id);
      setError(null);
    } catch (err) {
      console.error('Error al eliminar diagnóstico:', err);
      setError('Error al eliminar diagnóstico');
      throw err;
    }
  }, []);

  const toggleDiagnosticoActivo = useCallback(async (id: string, activo: boolean) => {
    try {
      await db.diagnosticos.update(id, {
        activo,
        fechaActualizacion: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Error al cambiar estado del diagnóstico:', err);
      setError('Error al cambiar estado del diagnóstico');
      throw err;
    }
  }, []);

  const obtenerDiagnosticosActivos = useCallback((): DiagnosticoEntry[] => {
    if (!diagnosticos) return [];
    return diagnosticos.filter(d => d.activo);
  }, [diagnosticos]);

  return {
    diagnosticos,
    cargando: diagnosticos === undefined,
    agregarDiagnostico,
    actualizarDiagnostico,
    eliminarDiagnostico,
    toggleDiagnosticoActivo,
    obtenerDiagnosticosActivos,
    error,
  };
}
