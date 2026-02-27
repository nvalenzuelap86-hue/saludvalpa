// ============================================================================
// saludvalpa 3.0 - HOOK DE GESTIÓN DE BIBLIOTECA
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { RecursoBiblioteca, TipoProfesion } from '../types';

interface FiltrosBiblioteca {
  profesion?: TipoProfesion;
  categoria?: string;
  favoritos?: boolean;
  busqueda?: string;
}

export const useBiblioteca = (filtros?: FiltrosBiblioteca) => {
  // -------------------------------------------------------------------------
  // OBTENER RECURSOS
  // -------------------------------------------------------------------------

  const recursos = useLiveQuery(async () => {
    let query = db.biblioteca.toArray();
    let resultado = await query;

    // Aplicar filtros
    if (filtros?.profesion) {
      resultado = resultado.filter(r => r.profesion === filtros.profesion);
    }

    if (filtros?.categoria) {
      resultado = resultado.filter(r => r.categoria === filtros.categoria);
    }

    if (filtros?.favoritos) {
      resultado = resultado.filter(r => r.favorito === true);
    }

    if (filtros?.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(r =>
        r.titulo.toLowerCase().includes(busquedaLower) ||
        r.descripcion.toLowerCase().includes(busquedaLower) ||
        r.etiquetas.some((e: string) => e.toLowerCase().includes(busquedaLower))
      );
    }

    // Ordenar por fecha de actualización (más recientes primero)
    return resultado.sort((a, b) => 
      new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime()
    );
  }, [filtros?.profesion, filtros?.categoria, filtros?.favoritos, filtros?.busqueda]);

  // -------------------------------------------------------------------------
  // OBTENER CATEGORÍAS DISPONIBLES
  // -------------------------------------------------------------------------

  const categoriasDisponibles = useLiveQuery(async () => {
    const todosRecursos = await db.biblioteca.toArray();
    const categoriasSet = new Set(todosRecursos.map(r => r.categoria));
    return Array.from(categoriasSet).sort();
  }, []);

  // -------------------------------------------------------------------------
  // CRUD DE RECURSOS
  // -------------------------------------------------------------------------

  const crearRecurso = async (datos: Omit<RecursoBiblioteca, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<string> => {
    try {
      const nuevoRecurso: RecursoBiblioteca = {
        ...datos,
        id: crypto.randomUUID(),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      };

      await db.biblioteca.add(nuevoRecurso);
      return nuevoRecurso.id;
    } catch (error) {
      console.error('Error al crear recurso:', error);
      throw new Error('No se pudo crear el recurso');
    }
  };

  const actualizarRecurso = async (id: string, cambios: Partial<RecursoBiblioteca>): Promise<void> => {
    try {
      await db.biblioteca.update(id, {
        ...cambios,
        fechaActualizacion: new Date(),
      });
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      throw new Error('No se pudo actualizar el recurso');
    }
  };

  const eliminarRecurso = async (id: string): Promise<void> => {
    try {
      await db.biblioteca.delete(id);
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      throw new Error('No se pudo eliminar el recurso');
    }
  };

  const toggleFavorito = async (id: string): Promise<void> => {
    try {
      const recurso = await db.biblioteca.get(id);
      if (recurso) {
        await db.biblioteca.update(id, {
          favorito: !recurso.favorito,
          fechaActualizacion: new Date(),
        });
      }
    } catch (error) {
      console.error('Error al marcar favorito:', error);
      throw new Error('No se pudo marcar como favorito');
    }
  };

  // -------------------------------------------------------------------------
  // OBTENER RECURSO POR ID
  // -------------------------------------------------------------------------

  const obtenerRecursoPorId = async (id: string): Promise<RecursoBiblioteca | undefined> => {
    try {
      return await db.biblioteca.get(id);
    } catch (error) {
      console.error('Error al obtener recurso:', error);
      return undefined;
    }
  };

  // -------------------------------------------------------------------------
  // ESTADÍSTICAS
  // -------------------------------------------------------------------------

  const obtenerEstadisticas = async () => {
    try {
      const todosRecursos = await db.biblioteca.toArray();
      
      const totalRecursos = todosRecursos.length;
      const favoritos = todosRecursos.filter(r => r.favorito).length;
      const precargados = todosRecursos.filter(r => r.esContenidoPrecargado).length;
      const personalizados = totalRecursos - precargados;

      // Recursos por profesión
      const porProfesion: { [key: string]: number } = {};
      todosRecursos.forEach(r => {
        porProfesion[r.profesion] = (porProfesion[r.profesion] || 0) + 1;
      });

      // Recursos por categoría
      const porCategoria: { [key: string]: number } = {};
      todosRecursos.forEach(r => {
        porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + 1;
      });

      return {
        totalRecursos,
        favoritos,
        precargados,
        personalizados,
        porProfesion,
        porCategoria,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalRecursos: 0,
        favoritos: 0,
        precargados: 0,
        personalizados: 0,
        porProfesion: {},
        porCategoria: {},
      };
    }
  };

  return {
    recursos: recursos || [],
    categoriasDisponibles: categoriasDisponibles || [],
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso,
    toggleFavorito,
    obtenerRecursoPorId,
    obtenerEstadisticas,
  };
};
