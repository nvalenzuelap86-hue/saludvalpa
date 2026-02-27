// ============================================================================
// saludvalpa 3.0 - HOOK DE GESTIÓN DE SESIONES
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Sesion, Material } from '../types';

interface FiltrosSesiones {
  pacienteId?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  profesionalId?: string;
}

export const useSesiones = (filtros?: FiltrosSesiones) => {
  // Live query para sesiones con filtros
  const sesiones = useLiveQuery(async () => {
    let query = db.sesiones.toArray();
    let resultado = await query;

    // Aplicar filtros
    if (filtros?.pacienteId) {
      resultado = resultado.filter(s => s.pacienteId === filtros.pacienteId);
    }

    if (filtros?.profesionalId) {
      resultado = resultado.filter(s => s.profesionalId === filtros.profesionalId);
    }

    if (filtros?.fechaInicio || filtros?.fechaFin) {
      resultado = resultado.filter(s => {
        const fecha = new Date(s.fecha);
        const inicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date(0);
        const fin = filtros.fechaFin ? new Date(filtros.fechaFin) : new Date(8640000000000000);
        return fecha >= inicio && fecha <= fin;
      });
    }

    // Ordenar por fecha descendente (más reciente primero)
    return resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [filtros?.pacienteId, filtros?.fechaInicio, filtros?.fechaFin, filtros?.profesionalId]);

  // -------------------------------------------------------------------------
  // CREAR SESIÓN
  // -------------------------------------------------------------------------
  const crearSesion = async (datosSesion: Omit<Sesion, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<string> => {
    try {
      const ahora = new Date();
      const nuevaSesion: Sesion = {
        ...datosSesion,
        id: crypto.randomUUID(),
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      };

      // Guardar sesión
      await db.sesiones.add(nuevaSesion);

      // Actualizar referencia en paciente
      const paciente = await db.pacientes.get(datosSesion.pacienteId);
      if (paciente) {
        await db.pacientes.update(datosSesion.pacienteId, {
          sesionesIds: [...paciente.sesionesIds, nuevaSesion.id],
          ultimaConsulta: nuevaSesion.fecha,
        });
      }

      // Si hay una cita asociada, actualizarla
      if (datosSesion.pacienteId) {
        const pacienteData = await db.pacientes.get(datosSesion.pacienteId);
        if (pacienteData && pacienteData.citasIds.length > 0) {
          // Buscar si hay alguna cita completada sin sesión asociada
          const citas = await db.citas.bulkGet(pacienteData.citasIds);
          const citaSinSesion = citas.find(c => c && c.estado === 'completada' && !c.sesionId);
          if (citaSinSesion) {
            await db.citas.update(citaSinSesion.id, { sesionId: nuevaSesion.id });
          }
        }
      }

      return nuevaSesion.id;
    } catch (error) {
      console.error('Error al crear sesión:', error);
      throw new Error('No se pudo crear la sesión');
    }
  };

  // -------------------------------------------------------------------------
  // ACTUALIZAR SESIÓN
  // -------------------------------------------------------------------------
  const actualizarSesion = async (id: string, cambios: Partial<Sesion>): Promise<void> => {
    try {
      await db.sesiones.update(id, {
        ...cambios,
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al actualizar sesión:', error);
      throw new Error('No se pudo actualizar la sesión');
    }
  };

  // -------------------------------------------------------------------------
  // ELIMINAR SESIÓN
  // -------------------------------------------------------------------------
  const eliminarSesion = async (id: string): Promise<void> => {
    try {
      const sesion = await db.sesiones.get(id);
      if (!sesion) {
        throw new Error('Sesión no encontrada');
      }

      // Eliminar sesión
      await db.sesiones.delete(id);

      // Actualizar referencia en paciente
      const paciente = await db.pacientes.get(sesion.pacienteId);
      if (paciente) {
        await db.pacientes.update(sesion.pacienteId, {
          sesionesIds: paciente.sesionesIds.filter(sid => sid !== id),
        });
      }

      // Si hay cita asociada, remover referencia
      const citasDelPaciente = await db.citas.where('pacienteId').equals(sesion.pacienteId).toArray();
      const citaConSesion = citasDelPaciente.find(c => c.sesionId === id);
      if (citaConSesion) {
        await db.citas.update(citaConSesion.id, { sesionId: undefined });
      }
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
      throw new Error('No se pudo eliminar la sesión');
    }
  };

  // -------------------------------------------------------------------------
  // OBTENER SESIÓN POR ID
  // -------------------------------------------------------------------------
  const obtenerSesion = async (id: string): Promise<Sesion | undefined> => {
    try {
      return await db.sesiones.get(id);
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      return undefined;
    }
  };

  // -------------------------------------------------------------------------
  // OBTENER SESIONES DE UN PACIENTE
  // -------------------------------------------------------------------------
  const obtenerSesionesPaciente = async (pacienteId: string): Promise<Sesion[]> => {
    try {
      const sesiones = await db.sesiones.where('pacienteId').equals(pacienteId).toArray();
      return sesiones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } catch (error) {
      console.error('Error al obtener sesiones del paciente:', error);
      return [];
    }
  };

  // -------------------------------------------------------------------------
  // AGREGAR MATERIAL A SESIÓN
  // -------------------------------------------------------------------------
  const agregarMaterial = async (sesionId: string, material: Material): Promise<void> => {
    try {
      const sesion = await db.sesiones.get(sesionId);
      if (!sesion) {
        throw new Error('Sesión no encontrada');
      }

      await db.sesiones.update(sesionId, {
        materialesUtilizados: [...sesion.materialesUtilizados, material],
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al agregar material:', error);
      throw new Error('No se pudo agregar el material');
    }
  };

  // -------------------------------------------------------------------------
  // ELIMINAR MATERIAL DE SESIÓN
  // -------------------------------------------------------------------------
  const eliminarMaterial = async (sesionId: string, indice: number): Promise<void> => {
    try {
      const sesion = await db.sesiones.get(sesionId);
      if (!sesion) {
        throw new Error('Sesión no encontrada');
      }

      const nuevosMateriales = sesion.materialesUtilizados.filter((_, i) => i !== indice);
      await db.sesiones.update(sesionId, {
        materialesUtilizados: nuevosMateriales,
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al eliminar material:', error);
      throw new Error('No se pudo eliminar el material');
    }
  };

  // -------------------------------------------------------------------------
  // AGREGAR MEDIO FÍSICO A SESIÓN
  // -------------------------------------------------------------------------
  const agregarMedioFisico = async (sesionId: string, medio: string): Promise<void> => {
    try {
      const sesion = await db.sesiones.get(sesionId);
      if (!sesion) {
        throw new Error('Sesión no encontrada');
      }

      await db.sesiones.update(sesionId, {
        mediosFisicos: [...sesion.mediosFisicos, medio],
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al agregar medio físico:', error);
      throw new Error('No se pudo agregar el medio físico');
    }
  };

  // -------------------------------------------------------------------------
  // ELIMINAR MEDIO FÍSICO DE SESIÓN
  // -------------------------------------------------------------------------
  const eliminarMedioFisico = async (sesionId: string, indice: number): Promise<void> => {
    try {
      const sesion = await db.sesiones.get(sesionId);
      if (!sesion) {
        throw new Error('Sesión no encontrada');
      }

      const nuevosMedios = sesion.mediosFisicos.filter((_, i) => i !== indice);
      await db.sesiones.update(sesionId, {
        mediosFisicos: nuevosMedios,
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al eliminar medio físico:', error);
      throw new Error('No se pudo eliminar el medio físico');
    }
  };

  // -------------------------------------------------------------------------
  // CALCULAR ESTADÍSTICAS DE SESIONES
  // -------------------------------------------------------------------------
  const calcularEstadisticas = async (pacienteId: string) => {
    try {
      const sesiones = await obtenerSesionesPaciente(pacienteId);
      
      const totalSesiones = sesiones.length;
      const totalCosto = sesiones.reduce((sum, s) => sum + (s.costo || 0), 0);
      const duracionPromedio = totalSesiones > 0
        ? Math.round(sesiones.reduce((sum, s) => sum + (s.duracion || 0), 0) / totalSesiones)
        : 0;

      const ultimaSesion = sesiones[0]; // Ya están ordenadas por fecha desc

      return {
        totalSesiones,
        totalCosto,
        duracionPromedio,
        ultimaSesion,
      };
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
      return {
        totalSesiones: 0,
        totalCosto: 0,
        duracionPromedio: 0,
        ultimaSesion: undefined,
      };
    }
  };

  return {
    sesiones: sesiones || [],
    crearSesion,
    actualizarSesion,
    eliminarSesion,
    obtenerSesion,
    obtenerSesionesPaciente,
    agregarMaterial,
    eliminarMaterial,
    agregarMedioFisico,
    eliminarMedioFisico,
    calcularEstadisticas,
  };
};
