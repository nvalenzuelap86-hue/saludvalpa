// ============================================================================
// saludvalpa 3.0 - HOOK DE GESTIÓN DE ECONOMÍA
// ============================================================================

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Servicio, Cotizacion, Recibo } from '../types';
import { EstadoPago } from '../types';

interface FiltrosEconomia {
  pacienteId?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estadoPago?: typeof EstadoPago[keyof typeof EstadoPago];
}

export const useEconomia = (filtros?: FiltrosEconomia) => {
  // -------------------------------------------------------------------------
  // SERVICIOS
  // -------------------------------------------------------------------------

  const servicios = useLiveQuery(async () => {
    const todosServicios = await db.servicios.toArray();
    const serviciosActivos = todosServicios.filter(s => s.activo);
    return serviciosActivos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, []);

  const crearServicio = async (datos: Omit<Servicio, 'id'>): Promise<string> => {
    try {
      const nuevoServicio: Servicio = {
        ...datos,
        id: crypto.randomUUID(),
      };

      await db.servicios.add(nuevoServicio);
      return nuevoServicio.id;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw new Error('No se pudo crear el servicio');
    }
  };

  const actualizarServicio = async (id: string, cambios: Partial<Servicio>): Promise<void> => {
    try {
      await db.servicios.update(id, cambios);
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw new Error('No se pudo actualizar el servicio');
    }
  };

  const eliminarServicio = async (id: string): Promise<void> => {
    try {
      // Marcar como inactivo en lugar de eliminar
      await db.servicios.update(id, { activo: false });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw new Error('No se pudo eliminar el servicio');
    }
  };

  // -------------------------------------------------------------------------
  // COTIZACIONES
  // -------------------------------------------------------------------------

  const cotizaciones = useLiveQuery(async () => {
    let query = db.cotizaciones.toArray();
    let resultado = await query;

    // Aplicar filtros
    if (filtros?.pacienteId) {
      resultado = resultado.filter(c => c.pacienteId === filtros.pacienteId);
    }

    if (filtros?.fechaInicio || filtros?.fechaFin) {
      resultado = resultado.filter(c => {
        const fecha = new Date(c.fecha);
        const inicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date(0);
        const fin = filtros.fechaFin ? new Date(filtros.fechaFin) : new Date(8640000000000000);
        return fecha >= inicio && fecha <= fin;
      });
    }

    // Ordenar por fecha descendente
    return resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [filtros?.pacienteId, filtros?.fechaInicio, filtros?.fechaFin]);

  const crearCotizacion = async (datos: Omit<Cotizacion, 'id'>): Promise<string> => {
    try {
      const nuevaCotizacion: Cotizacion = {
        ...datos,
        id: crypto.randomUUID(),
      };

      await db.cotizaciones.add(nuevaCotizacion);
      return nuevaCotizacion.id;
    } catch (error) {
      console.error('Error al crear cotización:', error);
      throw new Error('No se pudo crear la cotización');
    }
  };

  const actualizarCotizacion = async (id: string, cambios: Partial<Cotizacion>): Promise<void> => {
    try {
      await db.cotizaciones.update(id, cambios);
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      throw new Error('No se pudo actualizar la cotización');
    }
  };

  const aceptarCotizacion = async (id: string): Promise<void> => {
    try {
      await db.cotizaciones.update(id, { estado: 'aceptada' });
    } catch (error) {
      console.error('Error al aceptar cotización:', error);
      throw new Error('No se pudo aceptar la cotización');
    }
  };

  const rechazarCotizacion = async (id: string): Promise<void> => {
    try {
      await db.cotizaciones.update(id, { estado: 'rechazada' });
    } catch (error) {
      console.error('Error al rechazar cotización:', error);
      throw new Error('No se pudo rechazar la cotización');
    }
  };

  const cotizacionARecibo = async (cotizacionId: string): Promise<string> => {
    try {
      const cotizacion = await db.cotizaciones.get(cotizacionId);
      if (!cotizacion) throw new Error('Cotización no encontrada');

      // Obtener el siguiente número de recibo
      const recibos = await db.recibos.toArray();
      const ultimoNumero = recibos.reduce((max, r) => Math.max(max, r.numero), 0);

      const nuevoRecibo: Recibo = {
        id: crypto.randomUUID(),
        numero: ultimoNumero + 1,
        pacienteId: cotizacion.pacienteId,
        fecha: new Date(),
        servicios: cotizacion.servicios,
        subtotal: cotizacion.subtotal,
        descuento: cotizacion.descuento,
        total: cotizacion.total,
        profesion: cotizacion.profesion,
        metodoPago: 'efectivo',
        estadoPago: EstadoPago.PENDIENTE,
        notas: `Generado desde cotización #${cotizacionId.substring(0, 8)}`,
      };

      await db.recibos.add(nuevoRecibo);
      await db.cotizaciones.update(cotizacionId, { estado: 'aceptada' });

      return nuevoRecibo.id;
    } catch (error) {
      console.error('Error al convertir cotización a recibo:', error);
      throw new Error('No se pudo convertir la cotización a recibo');
    }
  };

  // -------------------------------------------------------------------------
  // RECIBOS
  // -------------------------------------------------------------------------

  const recibos = useLiveQuery(async () => {
    let query = db.recibos.toArray();
    let resultado = await query;

    // Aplicar filtros
    if (filtros?.pacienteId) {
      resultado = resultado.filter(r => r.pacienteId === filtros.pacienteId);
    }

    if (filtros?.estadoPago) {
      resultado = resultado.filter(r => r.estadoPago === filtros.estadoPago);
    }

    if (filtros?.fechaInicio || filtros?.fechaFin) {
      resultado = resultado.filter(r => {
        const fecha = new Date(r.fecha);
        const inicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date(0);
        const fin = filtros.fechaFin ? new Date(filtros.fechaFin) : new Date(8640000000000000);
        return fecha >= inicio && fecha <= fin;
      });
    }

    // Ordenar por fecha descendente
    return resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [filtros?.pacienteId, filtros?.estadoPago, filtros?.fechaInicio, filtros?.fechaFin]);

  const crearRecibo = async (datos: Omit<Recibo, 'id' | 'numero'>): Promise<string> => {
    try {
      // Obtener el siguiente número
      const todosRecibos = await db.recibos.toArray();
      const ultimoNumero = todosRecibos.reduce((max, r) => Math.max(max, r.numero), 0);

      const nuevoRecibo: Recibo = {
        ...datos,
        id: crypto.randomUUID(),
        numero: ultimoNumero + 1,
      };

      await db.recibos.add(nuevoRecibo);
      return nuevoRecibo.id;
    } catch (error) {
      console.error('Error al crear recibo:', error);
      throw new Error('No se pudo crear el recibo');
    }
  };

  const actualizarRecibo = async (id: string, cambios: Partial<Recibo>): Promise<void> => {
    try {
      await db.recibos.update(id, cambios);
    } catch (error) {
      console.error('Error al actualizar recibo:', error);
      throw new Error('No se pudo actualizar el recibo');
    }
  };

  const marcarComoPagado = async (id: string, fechaPago?: Date): Promise<void> => {
    try {
      await db.recibos.update(id, {
        estadoPago: EstadoPago.PAGADO_COMPLETO,
        fechaPago: fechaPago || new Date(),
      });
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
      throw new Error('No se pudo marcar como pagado');
    }
  };

  // -------------------------------------------------------------------------
  // REPORTES Y ESTADÍSTICAS
  // -------------------------------------------------------------------------

  const calcularEstadisticas = useCallback(async (fechaInicio?: Date, fechaFin?: Date) => {
    try {
      const recibosQuery = await db.recibos.toArray();
      const sesionesQuery = await db.sesiones.toArray();
      
      // Filtrar recibos por fechas si se proporcionan
      let recibosEnPeriodo = recibosQuery;
      if (fechaInicio || fechaFin) {
        recibosEnPeriodo = recibosQuery.filter(r => {
          const fecha = new Date(r.fecha);
          const inicio = fechaInicio ? new Date(fechaInicio) : new Date(0);
          const fin = fechaFin ? new Date(fechaFin) : new Date(8640000000000000);
          return fecha >= inicio && fecha <= fin;
        });
      }

      // Filtrar sesiones por fechas
      let sesionesEnPeriodo = sesionesQuery;
      if (fechaInicio || fechaFin) {
        sesionesEnPeriodo = sesionesQuery.filter(s => {
          const fecha = new Date(s.fecha);
          const inicio = fechaInicio ? new Date(fechaInicio) : new Date(0);
          const fin = fechaFin ? new Date(fechaFin) : new Date(8640000000000000);
          return fecha >= inicio && fecha <= fin;
        });
      }

      // Calcular ingresos de recibos pagados
      const ingresosRecibos = recibosEnPeriodo
        .filter(r => r.estadoPago === EstadoPago.PAGADO_COMPLETO)
        .reduce((sum, r) => sum + r.total, 0);

      // Calcular costos de sesiones (materiales + medios físicos)
      const costosSesiones = sesionesEnPeriodo
        .reduce((sum, s) => sum + (s.costo || 0), 0);

      // Total de ingresos incluye recibos + sesiones
      const totalIngresos = ingresosRecibos + costosSesiones;

      const totalPendiente = recibosEnPeriodo
        .filter(r => r.estadoPago === EstadoPago.PENDIENTE)
        .reduce((sum, r) => sum + r.total, 0);

      const totalParcial = recibosEnPeriodo
        .filter(r => r.estadoPago === EstadoPago.PAGADO_PARCIAL)
        .reduce((sum, r) => sum + r.total, 0);

      // Servicios más solicitados
      const serviciosContador: { [nombre: string]: { cantidad: number; total: number } } = {};
      recibosEnPeriodo.forEach(recibo => {
        recibo.servicios.forEach(item => {
          if (!serviciosContador[item.nombre]) {
            serviciosContador[item.nombre] = { cantidad: 0, total: 0 };
          }
          serviciosContador[item.nombre].cantidad += item.cantidad;
          serviciosContador[item.nombre].total += item.total;
        });
      });

      const serviciosMasSolicitados = Object.entries(serviciosContador)
        .map(([nombre, data]) => ({ nombre, ...data }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

      // Ingresos por método de pago
      const ingresosPorMetodo: { [metodo: string]: number } = {};
      recibosEnPeriodo
        .filter(r => r.estadoPago === EstadoPago.PAGADO_COMPLETO)
        .forEach(r => {
          if (!ingresosPorMetodo[r.metodoPago]) {
            ingresosPorMetodo[r.metodoPago] = 0;
          }
          ingresosPorMetodo[r.metodoPago] += r.total;
        });

      return {
        totalIngresos,
        totalPendiente,
        totalParcial,
        totalRecibos: recibosEnPeriodo.length,
        recibosPagados: recibosEnPeriodo.filter(r => r.estadoPago === EstadoPago.PAGADO_COMPLETO).length,
        recibosPendientes: recibosEnPeriodo.filter(r => r.estadoPago === EstadoPago.PENDIENTE).length,
        totalSesiones: sesionesEnPeriodo.length,
        ingresosSesiones: costosSesiones,
        ingresosRecibos: ingresosRecibos,
        serviciosMasSolicitados,
        ingresosPorMetodo,
      };
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
      return {
        totalIngresos: 0,
        totalPendiente: 0,
        totalParcial: 0,
        totalRecibos: 0,
        recibosPagados: 0,
        recibosPendientes: 0,
        totalSesiones: 0,
        ingresosSesiones: 0,
        ingresosRecibos: 0,
        serviciosMasSolicitados: [],
        ingresosPorMetodo: {},
      };
    }
  }, []);

  const obtenerDeudasPorPaciente = useCallback(async () => {
    try {
      const recibos = await db.recibos.toArray();
      const recibosPendientes = recibos.filter(
        r => r.estadoPago === EstadoPago.PENDIENTE || r.estadoPago === EstadoPago.PAGADO_PARCIAL
      );

      const deudasPorPaciente: { [pacienteId: string]: number } = {};
      recibosPendientes.forEach(r => {
        if (!deudasPorPaciente[r.pacienteId]) {
          deudasPorPaciente[r.pacienteId] = 0;
        }
        deudasPorPaciente[r.pacienteId] += r.total;
      });

      // Obtener nombres de pacientes
      const resultado = await Promise.all(
        Object.entries(deudasPorPaciente).map(async ([pacienteId, deuda]) => {
          const paciente = await db.pacientes.get(pacienteId);
          return {
            pacienteId,
            nombrePaciente: paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Desconocido',
            deuda,
          };
        })
      );

      return resultado.sort((a, b) => b.deuda - a.deuda);
    } catch (error) {
      console.error('Error al obtener deudas por paciente:', error);
      return [];
    }
  }, []);

  return {
    // Servicios
    servicios: servicios || [],
    crearServicio,
    actualizarServicio,
    eliminarServicio,

    // Cotizaciones
    cotizaciones: cotizaciones || [],
    crearCotizacion,
    actualizarCotizacion,
    aceptarCotizacion,
    rechazarCotizacion,
    cotizacionARecibo,

    // Recibos
    recibos: recibos || [],
    crearRecibo,
    actualizarRecibo,
    marcarComoPagado,

    // Reportes
    calcularEstadisticas,
    obtenerDeudasPorPaciente,
  };
};
