// ============================================================================
// saludvalpa 3.0 - PACIENTES HOOK
// Hook personalizado para gestión de pacientes
// ============================================================================

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Paciente, FiltrosPacientes } from '../types';
import { calcularEdad } from '../utils/helpers';
import { puedeAgregarPaciente } from '../services/licenseService';

export const usePacientes = (filtros?: FiltrosPacientes) => {
  const [error, setError] = useState<string | null>(null);

  // Query en vivo de pacientes con Dexie React Hooks
  const pacientes = useLiveQuery(async () => {
    try {
      let query = db.pacientes.toCollection();

      // Filtrar por búsqueda
      if (filtros?.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        return await db.pacientes
          .filter(p => 
            p.nombre.toLowerCase().includes(busqueda) ||
            p.apellidos.toLowerCase().includes(busqueda) ||
            p.id.toLowerCase().includes(busqueda)
          )
          .toArray();
      }

      // Filtrar por activo
      if (filtros?.activo !== undefined) {
        query = query.filter(p => p.activo === filtros.activo);
      }

      // Ordenar
      if (filtros?.ordenarPor) {
        const todos = await query.toArray();
        return todos.sort((a, b) => {
          const direccion = filtros.ordenDireccion === 'desc' ? -1 : 1;
          
          switch (filtros.ordenarPor) {
            case 'nombre':
              return direccion * a.nombre.localeCompare(b.nombre);
            case 'fechaCreacion':
              return direccion * (a.fechaCreacion.getTime() - b.fechaCreacion.getTime());
            case 'ultimaConsulta':
              const fechaA = a.ultimaConsulta?.getTime() || 0;
              const fechaB = b.ultimaConsulta?.getTime() || 0;
              return direccion * (fechaA - fechaB);
            default:
              return 0;
          }
        });
      }

      return await query.toArray();
    } catch (err) {
      setError('Error al cargar pacientes');
      console.error(err);
      return [];
    }
  }, [filtros]);

  const crearPaciente = useCallback(async (datos: Omit<Paciente, 'id' | 'fechaCreacion' | 'edad'>) => {
    try {
      // Verificar límite de licencia
      const { puede, razon } = await puedeAgregarPaciente();
      if (!puede) {
        throw new Error(razon);
      }

      const nuevoPaciente: Paciente = {
        ...datos,
        id: crypto.randomUUID(),
        edad: calcularEdad(datos.fechaNacimiento),
        fechaCreacion: new Date(),
        documentosIds: [],
        citasIds: [],
        sesionesIds: [],
      };

      await db.pacientes.add(nuevoPaciente);
      return { success: true, paciente: nuevoPaciente };
    } catch (err: any) {
      setError(err.message || 'Error al crear paciente');
      return { success: false, error: err.message };
    }
  }, []);

  const actualizarPaciente = useCallback(async (id: string, datos: Partial<Paciente>) => {
    try {
      // Recalcular edad si cambió fecha de nacimiento
      if (datos.fechaNacimiento) {
        datos.edad = calcularEdad(datos.fechaNacimiento);
      }

      await db.pacientes.update(id, datos);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar paciente');
      return { success: false, error: err.message };
    }
  }, []);

  const eliminarPaciente = useCallback(async (id: string) => {
    try {
      await db.pacientes.delete(id);
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al eliminar paciente');
      return { success: false, error: err.message };
    }
  }, []);

  const obtenerPaciente = useCallback(async (id: string) => {
    try {
      const paciente = await db.pacientes.get(id);
      return paciente;
    } catch (err) {
      setError('Error al obtener paciente');
      console.error(err);
      return null;
    }
  }, []);

  return {
    pacientes: pacientes || [],
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    obtenerPaciente,
    error,
  };
};
