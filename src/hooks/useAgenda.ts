// ============================================================================
// saludvalpa 3.0 - USE AGENDA HOOK
// Hook personalizado para gestión de citas
// ============================================================================

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Cita } from '../types';
import { EstadoCita } from '../types';

export interface FiltrosAgenda {
  fechaInicio?: Date;
  fechaFin?: Date;
  pacienteId?: string;
  estado?: typeof EstadoCita[keyof typeof EstadoCita];
}

export const useAgenda = (filtros?: FiltrosAgenda) => {
  const [error, setError] = useState<string | null>(null);

  // Cargar citas con live query
  const citas = useLiveQuery(async () => {
    try {
      let query = db.citas.toCollection();

      // Aplicar filtros
      if (filtros?.pacienteId) {
        query = db.citas.where('pacienteId').equals(filtros.pacienteId);
      }

      let resultado = await query.toArray();

      // Filtrar por rango de fechas
      if (filtros?.fechaInicio && filtros?.fechaFin) {
        resultado = resultado.filter(cita => {
          const fechaCita = new Date(cita.fechaHora);
          return fechaCita >= filtros.fechaInicio! && fechaCita <= filtros.fechaFin!;
        });
      }

      // Filtrar por estado
      if (filtros?.estado) {
        resultado = resultado.filter(cita => cita.estado === filtros.estado);
      }

      // Ordenar por fecha/hora
      resultado.sort((a, b) => 
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      );

      return resultado;
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('Error al cargar citas');
      return [];
    }
  }, [filtros?.fechaInicio, filtros?.fechaFin, filtros?.pacienteId, filtros?.estado]);

  // Crear cita
  const crearCita = useCallback(async (
    datosCita: Omit<Cita, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'recordatorioEnviado'>
  ): Promise<string> => {
    try {
      setError(null);

      const nuevaCita: Cita = {
        id: crypto.randomUUID(),
        ...datosCita,
        recordatorioEnviado: false,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      };

      await db.citas.add(nuevaCita);

      // Actualizar array de citas del paciente
      const paciente = await db.pacientes.get(datosCita.pacienteId);
      if (paciente) {
        await db.pacientes.update(datosCita.pacienteId, {
          citasIds: [...paciente.citasIds, nuevaCita.id],
        });
      }

      return nuevaCita.id;
    } catch (err) {
      console.error('Error al crear cita:', err);
      setError('Error al crear la cita');
      throw err;
    }
  }, []);

  // Actualizar cita
  const actualizarCita = useCallback(async (
    citaId: string,
    cambios: Partial<Omit<Cita, 'id' | 'fechaCreacion'>>
  ): Promise<void> => {
    try {
      setError(null);

      await db.citas.update(citaId, {
        ...cambios,
        fechaActualizacion: new Date(),
      });
    } catch (err) {
      console.error('Error al actualizar cita:', err);
      setError('Error al actualizar la cita');
      throw err;
    }
  }, []);

  // Cancelar cita
  const cancelarCita = useCallback(async (citaId: string): Promise<void> => {
    try {
      setError(null);

      await db.citas.update(citaId, {
        estado: EstadoCita.CANCELADA,
        fechaActualizacion: new Date(),
      });
    } catch (err) {
      console.error('Error al cancelar cita:', err);
      setError('Error al cancelar la cita');
      throw err;
    }
  }, []);

  // Confirmar cita
  const confirmarCita = useCallback(async (citaId: string): Promise<void> => {
    try {
      setError(null);

      await db.citas.update(citaId, {
        estado: EstadoCita.CONFIRMADA,
        fechaActualizacion: new Date(),
      });
    } catch (err) {
      console.error('Error al confirmar cita:', err);
      setError('Error al confirmar la cita');
      throw err;
    }
  }, []);

  // Completar cita
  const completarCita = useCallback(async (citaId: string, sesionId?: string): Promise<void> => {
    try {
      setError(null);

      await db.citas.update(citaId, {
        estado: EstadoCita.COMPLETADA,
        sesionId: sesionId || undefined,
        fechaActualizacion: new Date(),
      });
    } catch (err) {
      console.error('Error al completar cita:', err);
      setError('Error al completar la cita');
      throw err;
    }
  }, []);

  // Eliminar cita
  const eliminarCita = useCallback(async (citaId: string): Promise<void> => {
    try {
      setError(null);

      const cita = await db.citas.get(citaId);
      if (!cita) throw new Error('Cita no encontrada');

      // Eliminar de la base de datos
      await db.citas.delete(citaId);

      // Actualizar array del paciente
      const paciente = await db.pacientes.get(cita.pacienteId);
      if (paciente) {
        await db.pacientes.update(cita.pacienteId, {
          citasIds: paciente.citasIds.filter(id => id !== citaId),
        });
      }
    } catch (err) {
      console.error('Error al eliminar cita:', err);
      setError('Error al eliminar la cita');
      throw err;
    }
  }, []);

  // Obtener cita por ID
  const obtenerCita = useCallback(async (citaId: string): Promise<Cita | undefined> => {
    try {
      return await db.citas.get(citaId);
    } catch (err) {
      console.error('Error al obtener cita:', err);
      return undefined;
    }
  }, []);

  // Obtener citas de un día específico
  const obtenerCitasDia = useCallback(async (fecha: Date): Promise<Cita[]> => {
    try {
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);

      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);

      const todasCitas = await db.citas.toArray();
      
      return todasCitas
        .filter(cita => {
          const fechaCita = new Date(cita.fechaHora);
          return fechaCita >= inicio && fechaCita <= fin;
        })
        .sort((a, b) => 
          new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        );
    } catch (err) {
      console.error('Error al obtener citas del día:', err);
      return [];
    }
  }, []);

  return {
    citas: citas || [],
    crearCita,
    actualizarCita,
    cancelarCita,
    confirmarCita,
    completarCita,
    eliminarCita,
    obtenerCita,
    obtenerCitasDia,
    error,
  };
};
