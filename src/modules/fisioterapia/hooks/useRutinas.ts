// ============================================================================
// HOOK: useRutinas
// Hook personalizado para gestionar rutinas de ejercicios
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import type { 
  RutinaEjercicios,
  FiltrosRutinas,
} from '../../../types';

/**
 * Hook para gestionar rutinas de ejercicios
 */
export function useRutinas() {
  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Obtener todas las rutinas
   */
  const rutinas = useLiveQuery(
    async () => {
      return await db.rutinas
        .orderBy('fechaCreacion')
        .reverse()
        .toArray();
    },
    []
  );

  /**
   * Obtener solo rutinas activas
   */
  const rutinasActivas = useLiveQuery(
    async () => {
      return await db.rutinas
        .where('activa')
        .equals(1)
        .sortBy('fechaCreacion');
    },
    []
  );

  /**
   * Obtener solo plantillas
   */
  const plantillas = useLiveQuery(
    async () => {
      return await db.rutinas
        .where('esPlantilla')
        .equals(1)
        .sortBy('nombre');
    },
    []
  );

  /**
   * Obtener rutinas de un paciente específico
   */
  const obtenerRutinasPaciente = async (pacienteId: string): Promise<RutinaEjercicios[]> => {
    return await db.rutinas
      .where('pacienteId')
      .equals(pacienteId)
      .and(r => r.activa)
      .sortBy('fechaCreacion');
  };

  // ============================================================================
  // OPERACIONES CRUD
  // ============================================================================

  /**
   * Obtener una rutina por ID
   */
  const obtenerRutina = async (id: string): Promise<RutinaEjercicios | undefined> => {
    return await db.rutinas.get(id);
  };

  /**
   * Obtener rutina con ejercicios completos (populada)
   */
  const obtenerRutinaCompleta = async (id: string) => {
    const rutina = await db.rutinas.get(id);
    if (!rutina) return null;

    // Obtener todos los ejercicios de la rutina
    const ejerciciosIds = rutina.ejercicios.map(e => e.ejercicioId);
    const ejercicios = await db.ejercicios.bulkGet(ejerciciosIds);

    // Combinar datos
    const ejerciciosCompletos = rutina.ejercicios.map(ejEnRutina => {
      const ejercicio = ejercicios.find(e => e?.id === ejEnRutina.ejercicioId);
      return {
        ...ejEnRutina,
        ejercicio,
      };
    });

    return {
      ...rutina,
      ejerciciosCompletos,
    };
  };

  /**
   * Crear nueva rutina
   */
  const crearRutina = async (
    rutina: Omit<RutinaEjercicios, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
  ): Promise<string> => {
    const ahora = new Date();
    const nuevaRutina: RutinaEjercicios = {
      ...rutina,
      id: crypto.randomUUID(),
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };

    await db.rutinas.add(nuevaRutina);
    return nuevaRutina.id;
  };

  /**
   * Actualizar rutina existente
   */
  const actualizarRutina = async (
    id: string,
    cambios: Partial<RutinaEjercicios>
  ): Promise<void> => {
    await db.rutinas.update(id, {
      ...cambios,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Eliminar rutina
   */
  const eliminarRutina = async (id: string): Promise<void> => {
    // Verificar si tiene seguimientos
    const seguimientos = await db.seguimientoRutinas
      .where('rutinaId')
      .equals(id)
      .toArray();

    if (seguimientos.length > 0) {
      throw new Error(
        `Esta rutina tiene ${seguimientos.length} registro(s) de seguimiento. ` +
        'No se puede eliminar. Considera desactivarla en su lugar.'
      );
    }

    await db.rutinas.delete(id);
  };

  /**
   * Duplicar rutina (clonar)
   */
  const duplicarRutina = async (id: string): Promise<string> => {
    const rutinaOriginal = await db.rutinas.get(id);
    if (!rutinaOriginal) {
      throw new Error('Rutina no encontrada');
    }

    const ahora = new Date();
    const rutinaDuplicada: RutinaEjercicios = {
      ...rutinaOriginal,
      id: crypto.randomUUID(),
      nombre: `${rutinaOriginal.nombre} (Copia)`,
      pacienteId: undefined, // Desasignar
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
      fechaAsignacion: undefined,
    };

    await db.rutinas.add(rutinaDuplicada);
    return rutinaDuplicada.id;
  };

  /**
   * Asignar rutina a paciente
   */
  const asignarAPaciente = async (rutinaId: string, pacienteId: string): Promise<void> => {
    await db.rutinas.update(rutinaId, {
      pacienteId,
      fechaAsignacion: new Date(),
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Desasignar rutina de paciente
   */
  const desasignarDePaciente = async (rutinaId: string): Promise<void> => {
    await db.rutinas.update(rutinaId, {
      pacienteId: undefined,
      fechaAsignacion: undefined,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Activar/desactivar rutina
   */
  const toggleActiva = async (id: string): Promise<void> => {
    const rutina = await db.rutinas.get(id);
    if (!rutina) {
      throw new Error('Rutina no encontrada');
    }

    await db.rutinas.update(id, {
      activa: !rutina.activa,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Convertir rutina en plantilla
   */
  const convertirEnPlantilla = async (id: string): Promise<void> => {
    await db.rutinas.update(id, {
      esPlantilla: true,
      pacienteId: undefined, // Las plantillas no tienen paciente
      fechaAsignacion: undefined,
      fechaActualizacion: new Date(),
    });
  };

  // ============================================================================
  // BÚSQUEDA Y FILTRADO
  // ============================================================================

  /**
   * Filtrar rutinas según criterios
   */
  const filtrarRutinas = async (filtros: FiltrosRutinas): Promise<RutinaEjercicios[]> => {
    let resultados = await db.rutinas.toArray();

    // Filtro por plantillas
    if (filtros.soloPlantillas) {
      resultados = resultados.filter(r => r.esPlantilla);
    }

    // Filtro por paciente
    if (filtros.soloPaciente) {
      resultados = resultados.filter(r => r.pacienteId === filtros.soloPaciente);
    }

    // Filtro por activas
    if (filtros.soloActivas) {
      resultados = resultados.filter(r => r.activa);
    }

    // Filtro por nivel
    if (filtros.nivel) {
      resultados = resultados.filter(r => r.nivel === filtros.nivel);
    }

    // Búsqueda por texto
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(r =>
        r.nombre.toLowerCase().includes(termino) ||
        r.objetivo.toLowerCase().includes(termino) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(termino))
      );
    }

    // Ordenar por fecha de creación (más recientes primero)
    resultados.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());

    return resultados;
  };

  // ============================================================================
  // CÁLCULOS Y UTILIDADES
  // ============================================================================

  /**
   * Calcular duración total estimada de una rutina
   */
  const calcularDuracion = (rutina: RutinaEjercicios): number => {
    let totalMinutos = 0;

    for (const ejEnRutina of rutina.ejercicios) {
      // Duración del ejercicio en minutos
      if (ejEnRutina.duracionSegundos) {
        totalMinutos += (ejEnRutina.duracionSegundos / 60);
      }

      // Descanso entre series
      if (ejEnRutina.series && ejEnRutina.descansoSegundos) {
        const descansoTotal = (ejEnRutina.series - 1) * ejEnRutina.descansoSegundos;
        totalMinutos += (descansoTotal / 60);
      }

      // Si no tiene duración específica, estimar 2 minutos por ejercicio
      if (!ejEnRutina.duracionSegundos && (!ejEnRutina.series || !ejEnRutina.descansoSegundos)) {
        totalMinutos += 2;
      }
    }

    return Math.ceil(totalMinutos);
  };

  /**
   * Obtener equipo consolidado de una rutina
   */
  const obtenerEquipoConsolidado = async (rutina: RutinaEjercicios): Promise<string[]> => {
    const ejerciciosIds = rutina.ejercicios.map(e => e.ejercicioId);
    const ejercicios = await db.ejercicios.bulkGet(ejerciciosIds);

    const equipoSet = new Set<string>();
    ejercicios.forEach(ejercicio => {
      if (ejercicio) {
        ejercicio.equipoNecesario.forEach(equipo => equipoSet.add(equipo));
      }
    });

    return Array.from(equipoSet);
  };

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  /**
   * Obtener estadísticas de rutinas
   */
  const obtenerEstadisticas = useLiveQuery(
    async () => {
      const todas = await db.rutinas.toArray();
      const activas = todas.filter(r => r.activa);
      const plantillasCount = todas.filter(r => r.esPlantilla);
      const asignadas = todas.filter(r => r.pacienteId);

      // Por nivel
      const porNivel = todas.reduce((acc, r) => {
        acc[r.nivel] = (acc[r.nivel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: todas.length,
        activas: activas.length,
        plantillas: plantillasCount.length,
        asignadas: asignadas.length,
        porNivel,
      };
    },
    []
  );

  /**
   * Obtener estadísticas de adherencia de una rutina
   */
  const obtenerAdherencia = async (rutinaId: string) => {
    const seguimientos = await db.seguimientoRutinas
      .where('rutinaId')
      .equals(rutinaId)
      .toArray();

    if (seguimientos.length === 0) {
      return null;
    }

    const totalSesiones = seguimientos.length;
    const sesionesCompletadas = seguimientos.filter(s =>
      s.ejerciciosCompletados.every(e => e.completado)
    ).length;

    const porcentajeAdherencia = (sesionesCompletadas / totalSesiones) * 100;

    // Promedio de dolor y esfuerzo
    const dolores = seguimientos.filter(s => s.nivelDolor !== undefined).map(s => s.nivelDolor!);
    const esfuerzos = seguimientos.filter(s => s.nivelEsfuerzo !== undefined).map(s => s.nivelEsfuerzo!);

    const promedioDolor = dolores.length > 0
      ? dolores.reduce((a, b) => a + b, 0) / dolores.length
      : undefined;

    const promedioEsfuerzo = esfuerzos.length > 0
      ? esfuerzos.reduce((a, b) => a + b, 0) / esfuerzos.length
      : undefined;

    return {
      totalSesiones,
      sesionesCompletadas,
      porcentajeAdherencia: Math.round(porcentajeAdherencia),
      promedioDolor: promedioDolor ? Math.round(promedioDolor * 10) / 10 : undefined,
      promedioEsfuerzo: promedioEsfuerzo ? Math.round(promedioEsfuerzo * 10) / 10 : undefined,
      ultimaSesion: seguimientos[seguimientos.length - 1]?.fecha,
    };
  };

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Queries
    rutinas: rutinas || [],
    rutinasActivas: rutinasActivas || [],
    plantillas: plantillas || [],
    estadisticas: obtenerEstadisticas,

    // CRUD
    obtenerRutina,
    obtenerRutinaCompleta,
    obtenerRutinasPaciente,
    crearRutina,
    actualizarRutina,
    eliminarRutina,
    duplicarRutina,

    // Asignación
    asignarAPaciente,
    desasignarDePaciente,
    toggleActiva,
    convertirEnPlantilla,

    // Búsqueda y filtrado
    filtrarRutinas,

    // Utilidades
    calcularDuracion,
    obtenerEquipoConsolidado,
    obtenerAdherencia,

    // Estado de carga
    isLoading: rutinas === undefined,
  };
}
