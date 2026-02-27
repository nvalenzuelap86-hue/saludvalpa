// ============================================================================
// saludvalpa 3.0 - RECORDATORIOS SERVICE
// Sistema de notificaciones y recordatorios para citas
// ============================================================================

import { db } from '../db/database';
import { EstadoCita } from '../types';
import type { Cita } from '../types';
import { differenceInHours, differenceInMinutes, isPast } from 'date-fns';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const HORAS_ANTICIPACION = 24; // Enviar recordatorio 24 horas antes

// ============================================================================
// NOTIFICACIONES DEL NAVEGADOR
// ============================================================================

/**
 * Solicita permiso para notificaciones del navegador
 */
export const solicitarPermisoNotificaciones = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Muestra una notificación del navegador
 */
export const mostrarNotificacion = async (
  titulo: string,
  opciones?: NotificationOptions
): Promise<void> => {
  const tienePermiso = await solicitarPermisoNotificaciones();
  
  if (!tienePermiso) {
    console.warn('No se tienen permisos para notificaciones');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(titulo, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'saludvalpa-recordatorio',
      requireInteraction: true,
      ...opciones,
    });
  } catch (error) {
    // Fallback: notificación básica sin service worker
    new Notification(titulo, opciones);
  }
};

// ============================================================================
// RECORDATORIOS DE CITAS
// ============================================================================

/**
 * Envía recordatorio para una cita específica
 */
export const enviarRecordatorioCita = async (cita: Cita): Promise<void> => {
  const paciente = await db.pacientes.get(cita.pacienteId);
  if (!paciente) return;

  const fechaCita = new Date(cita.fechaHora);
  const horaFormato = fechaCita.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  await mostrarNotificacion(
    `Recordatorio de cita`,
    {
      body: `${paciente.nombre} ${paciente.apellidos} - ${cita.tipo}\nMañana a las ${horaFormato}`,
      data: { citaId: cita.id },
    }
  );

  // Marcar como enviado
  await db.citas.update(cita.id, {
    recordatorioEnviado: true,
    fechaActualizacion: new Date(),
  });
};

/**
 * Procesa recordatorios pendientes
 */
export const procesarRecordatoriosPendientes = async (): Promise<void> => {
  const ahora = new Date();

  // Obtener citas programadas o confirmadas que no han enviado recordatorio
  const citasPendientes = await db.citas
    .where('estado')
    .anyOf([EstadoCita.PROGRAMADA, EstadoCita.CONFIRMADA])
    .toArray();

  const citasParaRecordar = citasPendientes.filter(cita => {
    if (cita.recordatorioEnviado) return false;

    const fechaCita = new Date(cita.fechaHora);
    if (isPast(fechaCita)) return false;

    const horasRestantes = differenceInHours(fechaCita, ahora);
    
    // Enviar recordatorio si falta entre 24 y 23 horas
    return horasRestantes <= HORAS_ANTICIPACION && horasRestantes > (HORAS_ANTICIPACION - 1);
  });

  for (const cita of citasParaRecordar) {
    try {
      await enviarRecordatorioCita(cita);
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
    }
  }
};

/**
 * Obtiene citas próximas (siguientes 7 días)
 */
export const obtenerCitasProximas = async (dias: number = 7): Promise<Cita[]> => {
  const ahora = new Date();
  const limite = new Date();
  limite.setDate(limite.getDate() + dias);

  const todasCitas = await db.citas.toArray();
  
  return todasCitas
    .filter(cita => {
      const fechaCita = new Date(cita.fechaHora);
      return (
        fechaCita >= ahora &&
        fechaCita <= limite &&
        (cita.estado === EstadoCita.PROGRAMADA || cita.estado === EstadoCita.CONFIRMADA)
      );
    })
    .sort((a, b) => 
      new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );
};

/**
 * Notifica sobre citas que empiezan pronto (dentro de 30 minutos)
 */
export const notificarCitasInminentes = async (): Promise<void> => {
  const ahora = new Date();
  const limite = new Date();
  limite.setMinutes(limite.getMinutes() + 30);

  const todasCitas = await db.citas.toArray();
  
  const citasInminentes = todasCitas.filter(cita => {
    const fechaCita = new Date(cita.fechaHora);
    return (
      fechaCita >= ahora &&
      fechaCita <= limite &&
      (cita.estado === EstadoCita.PROGRAMADA || cita.estado === EstadoCita.CONFIRMADA)
    );
  });

  for (const cita of citasInminentes) {
    const paciente = await db.pacientes.get(cita.pacienteId);
    if (!paciente) continue;

    const minutosRestantes = differenceInMinutes(new Date(cita.fechaHora), ahora);

    await mostrarNotificacion(
      `Cita en ${minutosRestantes} minutos`,
      {
        body: `${paciente.nombre} ${paciente.apellidos} - ${cita.tipo}`,
        data: { citaId: cita.id },
      }
    );
  }
};

/**
 * Inicializa el sistema de recordatorios
 */
export const inicializarRecordatorios = async (): Promise<void> => {
  // Solicitar permisos
  await solicitarPermisoNotificaciones();

  // Procesar recordatorios cada hora
  setInterval(async () => {
    await procesarRecordatoriosPendientes();
  }, 60 * 60 * 1000); // 1 hora

  // Procesar citas inminentes cada 10 minutos
  setInterval(async () => {
    await notificarCitasInminentes();
  }, 10 * 60 * 1000); // 10 minutos

  // Ejecutar inmediatamente
  await procesarRecordatoriosPendientes();
  await notificarCitasInminentes();
};

/**
 * Verifica si una cita necesita recordatorio
 */
export const necesitaRecordatorio = (cita: Cita): boolean => {
  if (cita.recordatorioEnviado) return false;
  if (cita.estado === EstadoCita.CANCELADA || cita.estado === EstadoCita.COMPLETADA) return false;

  const ahora = new Date();
  const fechaCita = new Date(cita.fechaHora);
  
  if (isPast(fechaCita)) return false;

  const horasRestantes = differenceInHours(fechaCita, ahora);
  return horasRestantes <= HORAS_ANTICIPACION && horasRestantes > 0;
};
