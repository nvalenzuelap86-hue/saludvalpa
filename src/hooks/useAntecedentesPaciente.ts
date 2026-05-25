// ============================================================================
// saludvalpa 3.0 - ANTECEDENTES DEL PACIENTE HOOK
// Hook personalizado para gestionar antecedentes del historial clínico
// ============================================================================

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { AntecedenteEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

type TipoAntecedente = AntecedenteEntry['tipo'];

interface UseAntecedentesPacienteReturn {
  antecedentes: AntecedenteEntry[] | undefined;
  cargando: boolean;
  agregarAntecedente: (datos: Omit<AntecedenteEntry, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  actualizarAntecedente: (id: string, datos: Partial<AntecedenteEntry>) => Promise<void>;
  eliminarAntecedente: (id: string) => Promise<void>;
  toggleAntecedenteActivo: (id: string, activo: boolean) => Promise<void>;
  obtenerAntecedentesPorTipo: (tipo: TipoAntecedente) => AntecedenteEntry[];
  obtenerAntecedentesAgrupados: () => Record<TipoAntecedente, AntecedenteEntry[]>;
  error: string | null;
}

const TIPOS_ANTECEDENTES: TipoAntecedente[] = [
  'patologico',
  'quirurgico',
  'alergico',
  'toxicos',
  'familiares',
  'farmacologicos',
  'traumaticos',
  'otros',
];

export const ETIQUETAS_TIPOS_ANTECEDENTES: Record<TipoAntecedente, string> = {
  patologico: 'Patológicos',
  quirurgico: 'Quirúrgicos',
  alergico: 'Alérgicos',
  toxicos: 'Tóxicos',
  familiares: 'Familiares',
  farmacologicos: 'Farmacológicos',
  traumaticos: 'Traumáticos',
  otros: 'Otros',
};

export const ICONOS_TIPOS_ANTECEDENTES: Record<TipoAntecedente, string> = {
  patologico: '🏥',
  quirurgico: '🔪',
  alergico: '💊',
  toxicos: '🚬',
  familiares: '👨‍👩‍👧‍👦',
  farmacologicos: '💉',
  traumaticos: '🩹',
  otros: '📋',
};

export function useAntecedentesPaciente(pacienteId: string): UseAntecedentesPacienteReturn {
  const [error, setError] = useState<string | null>(null);

  const antecedentes = useLiveQuery(
    async () => {
      try {
        return await db.antecedentes
          .where('pacienteId')
          .equals(pacienteId)
          .reverse()
          .sortBy('fechaCreacion');
      } catch (err) {
        console.error('Error al cargar antecedentes:', err);
        setError('Error al cargar antecedentes');
        return [];
      }
    },
    [pacienteId]
  );

  const agregarAntecedente = useCallback(async (
    datos: Omit<AntecedenteEntry, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
  ) => {
    try {
      const now = new Date();
      const nuevoAntecedente: AntecedenteEntry = {
        ...datos,
        id: uuidv4(),
        fechaCreacion: now,
        fechaActualizacion: now,
      };
      await db.antecedentes.add(nuevoAntecedente);
      setError(null);
    } catch (err) {
      console.error('Error al agregar antecedente:', err);
      setError('Error al agregar antecedente');
      throw err;
    }
  }, []);

  const actualizarAntecedente = useCallback(async (
    id: string,
    datos: Partial<AntecedenteEntry>
  ) => {
    try {
      await db.antecedentes.update(id, {
        ...datos,
        fechaActualizacion: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar antecedente:', err);
      setError('Error al actualizar antecedente');
      throw err;
    }
  }, []);

  const eliminarAntecedente = useCallback(async (id: string) => {
    try {
      await db.antecedentes.delete(id);
      setError(null);
    } catch (err) {
      console.error('Error al eliminar antecedente:', err);
      setError('Error al eliminar antecedente');
      throw err;
    }
  }, []);

  const toggleAntecedenteActivo = useCallback(async (id: string, activo: boolean) => {
    try {
      await db.antecedentes.update(id, {
        activo,
        fechaActualizacion: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Error al cambiar estado del antecedente:', err);
      setError('Error al cambiar estado del antecedente');
      throw err;
    }
  }, []);

  const obtenerAntecedentesPorTipo = useCallback((tipo: TipoAntecedente): AntecedenteEntry[] => {
    if (!antecedentes) return [];
    return antecedentes.filter(a => a.tipo === tipo);
  }, [antecedentes]);

  const obtenerAntecedentesAgrupados = useCallback((): Record<TipoAntecedente, AntecedenteEntry[]> => {
    const agrupados = {} as Record<TipoAntecedente, AntecedenteEntry[]>;
    for (const tipo of TIPOS_ANTECEDENTES) {
      agrupados[tipo] = obtenerAntecedentesPorTipo(tipo);
    }
    return agrupados;
  }, [obtenerAntecedentesPorTipo]);

  return {
    antecedentes,
    cargando: antecedentes === undefined,
    agregarAntecedente,
    actualizarAntecedente,
    eliminarAntecedente,
    toggleAntecedenteActivo,
    obtenerAntecedentesPorTipo,
    obtenerAntecedentesAgrupados,
    error,
  };
}
