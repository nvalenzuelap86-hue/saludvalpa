// ============================================================================
// saludvalpa 3.0 - SIGNOS VITALES HOOK
// Hook personalizado para gestionar registros de signos vitales
// ============================================================================

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { SignosVitalesEntry, TipoProfesion } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UseSignosVitalesReturn {
  registros: SignosVitalesEntry[] | undefined;
  cargando: boolean;
  agregarRegistro: (datos: Omit<SignosVitalesEntry, 'id' | 'imc' | 'relacionCinturaCadera' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  actualizarRegistro: (id: string, datos: Partial<SignosVitalesEntry>) => Promise<void>;
  eliminarRegistro: (id: string) => Promise<void>;
  obtenerUltimoRegistro: () => SignosVitalesEntry | undefined;
  error: string | null;
}

/**
 * Calcula el IMC a partir de peso (kg) y talla (cm)
 */
function calcularIMC(peso?: number, talla?: number): number | undefined {
  if (!peso || !talla) return undefined;
  const tallaM = talla / 100;
  return Math.round((peso / (tallaM * tallaM)) * 10) / 10;
}

/**
 * Calcula la relación cintura-cadera
 */
function calcularRelacionCinturaCadera(cintura?: number, cadera?: number): number | undefined {
  if (!cintura || !cadera) return undefined;
  return Math.round((cintura / cadera) * 100) / 100;
}

export function useSignosVitales(pacienteId: string, profesion?: TipoProfesion): UseSignosVitalesReturn {
  const [error, setError] = useState<string | null>(null);

  const registros = useLiveQuery(
    async () => {
      try {
        let query = db.signosVitales
          .where('pacienteId')
          .equals(pacienteId);

        if (profesion) {
          query = query.and(r => r.profesion === profesion) as any;
        }

        return await query
          .reverse()
          .sortBy('fecha');
      } catch (err) {
        console.error('Error al cargar signos vitales:', err);
        setError('Error al cargar signos vitales');
        return [];
      }
    },
    [pacienteId, profesion]
  );

  const agregarRegistro = useCallback(async (
    datos: Omit<SignosVitalesEntry, 'id' | 'imc' | 'relacionCinturaCadera' | 'fechaCreacion' | 'fechaActualizacion'>
  ) => {
    try {
      const now = new Date();
      const imc = calcularIMC(datos.peso, datos.talla);
      const relacionCinturaCadera = calcularRelacionCinturaCadera(
        datos.circunferenciaCintura,
        datos.circunferenciaCadera
      );

      const nuevoRegistro: SignosVitalesEntry = {
        ...datos,
        id: uuidv4(),
        imc,
        relacionCinturaCadera,
        fechaCreacion: now,
        fechaActualizacion: now,
      };
      await db.signosVitales.add(nuevoRegistro);
      setError(null);
    } catch (err) {
      console.error('Error al agregar registro de signos vitales:', err);
      setError('Error al agregar registro de signos vitales');
      throw err;
    }
  }, []);

  const actualizarRegistro = useCallback(async (
    id: string,
    datos: Partial<SignosVitalesEntry>
  ) => {
    try {
      // Recalcular IMC si cambiaron peso o talla
      let updateData: Partial<SignosVitalesEntry> = { ...datos };
      if (datos.peso !== undefined || datos.talla !== undefined) {
        // Necesitamos obtener los valores actuales para recalcular
        const actual = await db.signosVitales.get(id);
        if (actual) {
          const peso = datos.peso ?? actual.peso;
          const talla = datos.talla ?? actual.talla;
          updateData.imc = calcularIMC(peso, talla);
        }
      }
      if (datos.circunferenciaCintura !== undefined || datos.circunferenciaCadera !== undefined) {
        const actual = await db.signosVitales.get(id);
        if (actual) {
          const cintura = datos.circunferenciaCintura ?? actual.circunferenciaCintura;
          const cadera = datos.circunferenciaCadera ?? actual.circunferenciaCadera;
          updateData.relacionCinturaCadera = calcularRelacionCinturaCadera(cintura, cadera);
        }
      }

      await db.signosVitales.update(id, {
        ...updateData,
        fechaActualizacion: new Date(),
      });
      setError(null);
    } catch (err) {
      console.error('Error al actualizar registro de signos vitales:', err);
      setError('Error al actualizar registro de signos vitales');
      throw err;
    }
  }, []);

  const eliminarRegistro = useCallback(async (id: string) => {
    try {
      await db.signosVitales.delete(id);
      setError(null);
    } catch (err) {
      console.error('Error al eliminar registro de signos vitales:', err);
      setError('Error al eliminar registro de signos vitales');
      throw err;
    }
  }, []);

  const obtenerUltimoRegistro = useCallback((): SignosVitalesEntry | undefined => {
    if (!registros || registros.length === 0) return undefined;
    return registros[0]; // Ya están ordenados por fecha descendente
  }, [registros]);

  return {
    registros,
    cargando: registros === undefined,
    agregarRegistro,
    actualizarRegistro,
    eliminarRegistro,
    obtenerUltimoRegistro,
    error,
  };
}
