// ============================================================================
// HOOK: useBiblioteca
// Hook personalizado para gestionar la biblioteca de ejercicios
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import type { 
  Ejercicio, 
  FiltrosEjercicios,
  CategoriaEjercicio,
  IntensidadEjercicio,
  ZonaCorporal,
} from '../../../types';

/**
 * Hook para gestionar ejercicios de la biblioteca
 */
export function useBiblioteca() {
  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Obtener todos los ejercicios
   */
  const ejercicios = useLiveQuery(
    async () => {
      return await db.ejercicios
        .orderBy('nombre')
        .toArray();
    },
    []
  );

  /**
   * Obtener solo ejercicios precargados
   */
  const ejerciciosPrecargados = useLiveQuery(
    async () => {
      return await db.ejercicios
        .where('precargado')
        .equals(1)
        .sortBy('nombre');
    },
    []
  );

  /**
   * Obtener solo ejercicios personalizados
   */
  const ejerciciosPersonalizados = useLiveQuery(
    async () => {
      return await db.ejercicios
        .where('precargado')
        .equals(0)
        .sortBy('nombre');
    },
    []
  );

  /**
   * Obtener ejercicios favoritos
   */
  const ejerciciosFavoritos = useLiveQuery(
    async () => {
      return await db.ejercicios
        .where('favorito')
        .equals(1)
        .sortBy('nombre');
    },
    []
  );

  // ============================================================================
  // OPERACIONES CRUD
  // ============================================================================

  /**
   * Obtener un ejercicio por ID
   */
  const obtenerEjercicio = async (id: string): Promise<Ejercicio | undefined> => {
    return await db.ejercicios.get(id);
  };

  /**
   * Crear nuevo ejercicio personalizado
   */
  const crearEjercicio = async (ejercicio: Omit<Ejercicio, 'id' | 'fechaCreacion' | 'precargado'>): Promise<string> => {
    const nuevoEjercicio: Ejercicio = {
      ...ejercicio,
      id: crypto.randomUUID(),
      precargado: false,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    await db.ejercicios.add(nuevoEjercicio);
    return nuevoEjercicio.id;
  };

  /**
   * Actualizar ejercicio personalizado
   * Para ejercicios precargados, solo se permite actualizar videosUrls
   */
  const actualizarEjercicio = async (id: string, cambios: Partial<Ejercicio>): Promise<void> => {
    const ejercicio = await db.ejercicios.get(id);
    
    if (!ejercicio) {
      throw new Error('Ejercicio no encontrado');
    }

    if (ejercicio.precargado) {
      // Para precargados, solo permitir actualizar videosUrls
      const camposPermitidos = ['videosUrls'];
      const camposNoPermitidos = Object.keys(cambios).filter(
        key => !camposPermitidos.includes(key)
      );
      
      if (camposNoPermitidos.length > 0) {
        throw new Error(
          `No se pueden editar ejercicios precargados. Campos no permitidos: ${camposNoPermitidos.join(', ')}`
        );
      }
    }

    await db.ejercicios.update(id, {
      ...cambios,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Eliminar ejercicio personalizado
   */
  const eliminarEjercicio = async (id: string): Promise<void> => {
    const ejercicio = await db.ejercicios.get(id);
    
    if (!ejercicio) {
      throw new Error('Ejercicio no encontrado');
    }

    if (ejercicio.precargado) {
      throw new Error('No se pueden eliminar ejercicios precargados');
    }

    // Verificar si el ejercicio está en alguna rutina
    const rutinasConEjercicio = await db.rutinas
      .filter(rutina => 
        rutina.ejercicios.some(e => e.ejercicioId === id)
      )
      .toArray();

    if (rutinasConEjercicio.length > 0) {
      throw new Error(
        `Este ejercicio está siendo usado en ${rutinasConEjercicio.length} rutina(s). ` +
        'Elimínalo de las rutinas primero.'
      );
    }

    await db.ejercicios.delete(id);
  };

  /**
   * Marcar/desmarcar ejercicio como favorito
   */
  const toggleFavorito = async (id: string): Promise<void> => {
    const ejercicio = await db.ejercicios.get(id);
    
    if (!ejercicio) {
      throw new Error('Ejercicio no encontrado');
    }

    await db.ejercicios.update(id, {
      favorito: !ejercicio.favorito,
    });
  };

  // ============================================================================
  // BÚSQUEDA Y FILTRADO
  // ============================================================================

  /**
   * Filtrar ejercicios según criterios
   */
  const filtrarEjercicios = async (filtros: FiltrosEjercicios): Promise<Ejercicio[]> => {
    let query = db.ejercicios.toCollection();

    // Filtro por precargados/personalizados
    if (filtros.soloPrecargados) {
      query = db.ejercicios.where('precargado').equals(1);
    } else if (filtros.soloPersonalizados) {
      query = db.ejercicios.where('precargado').equals(0);
    }

    // Filtro por favoritos
    if (filtros.soloFavoritos) {
      query = db.ejercicios.where('favorito').equals(1);
    }

    let resultados = await query.toArray();

    // Filtro por categoría
    if (filtros.categoria) {
      resultados = resultados.filter(e => e.categoria === filtros.categoria);
    }

    // Filtro por zonas corporales
    if (filtros.zonasCorporales && filtros.zonasCorporales.length > 0) {
      resultados = resultados.filter(e => 
        filtros.zonasCorporales!.some(zona => 
          e.zonasCorporales.includes(zona)
        )
      );
    }

    // Filtro por intensidad
    if (filtros.intensidad) {
      resultados = resultados.filter(e => e.intensidad === filtros.intensidad);
    }

    // Búsqueda por texto
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(e => 
        e.nombre.toLowerCase().includes(termino) ||
        e.descripcion.toLowerCase().includes(termino) ||
        e.instrucciones.some(i => i.toLowerCase().includes(termino))
      );
    }

    // Ordenar por nombre
    resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return resultados;
  };

  /**
   * Buscar ejercicios por texto
   */
  const buscarEjercicios = async (termino: string): Promise<Ejercicio[]> => {
    if (!termino || termino.trim() === '') {
      return await db.ejercicios.orderBy('nombre').toArray();
    }

    return filtrarEjercicios({ busqueda: termino });
  };

  /**
   * Obtener ejercicios por categoría
   */
  const obtenerPorCategoria = async (categoria: CategoriaEjercicio): Promise<Ejercicio[]> => {
    return filtrarEjercicios({ categoria });
  };

  /**
   * Obtener ejercicios por zona corporal
   */
  const obtenerPorZona = async (zona: ZonaCorporal): Promise<Ejercicio[]> => {
    return filtrarEjercicios({ zonasCorporales: [zona] });
  };

  /**
   * Obtener ejercicios por intensidad
   */
  const obtenerPorIntensidad = async (intensidad: IntensidadEjercicio): Promise<Ejercicio[]> => {
    return filtrarEjercicios({ intensidad });
  };

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  /**
   * Obtener estadísticas de la biblioteca
   */
  const obtenerEstadisticas = useLiveQuery(
    async () => {
      const todos = await db.ejercicios.toArray();
      const precargados = todos.filter(e => e.precargado);
      const personalizados = todos.filter(e => !e.precargado);
      const favoritos = todos.filter(e => e.favorito);

      // Por categoría
      const porCategoria = todos.reduce((acc, e) => {
        acc[e.categoria] = (acc[e.categoria] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Por intensidad
      const porIntensidad = todos.reduce((acc, e) => {
        acc[e.intensidad] = (acc[e.intensidad] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: todos.length,
        precargados: precargados.length,
        personalizados: personalizados.length,
        favoritos: favoritos.length,
        porCategoria,
        porIntensidad,
      };
    },
    []
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Queries
    ejercicios: ejercicios || [],
    ejerciciosPrecargados: ejerciciosPrecargados || [],
    ejerciciosPersonalizados: ejerciciosPersonalizados || [],
    ejerciciosFavoritos: ejerciciosFavoritos || [],
    estadisticas: obtenerEstadisticas,
    
    // CRUD
    obtenerEjercicio,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicio,
    toggleFavorito,
    
    // Búsqueda y filtrado
    filtrarEjercicios,
    buscarEjercicios,
    obtenerPorCategoria,
    obtenerPorZona,
    obtenerPorIntensidad,
    
    // Estado de carga
    isLoading: ejercicios === undefined,
  };
}
