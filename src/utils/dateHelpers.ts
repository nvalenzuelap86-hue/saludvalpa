// ============================================================================
// saludvalpa 3.0 - DATE HELPERS
// Utilidades específicas para fechas y calendario
// ============================================================================

import { format, isToday, isTomorrow, isYesterday, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha de forma relativa
 */
export const formatearFechaRelativa = (fecha: Date): string => {
  if (isToday(fecha)) return 'Hoy';
  if (isTomorrow(fecha)) return 'Mañana';
  if (isYesterday(fecha)) return 'Ayer';
  
  return format(fecha, "d 'de' MMMM", { locale: es });
};

/**
 * Formatea fecha y hora para mostrar en UI
 */
export const formatearFechaHora = (fecha: Date): string => {
  return format(fecha, "d 'de' MMMM 'a las' HH:mm", { locale: es });
};

/**
 * Obtiene el rango de horas laborales
 */
export const obtenerHorasLaborales = (inicio: number = 7, fin: number = 20): number[] => {
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
};

/**
 * Verifica si una fecha/hora ya pasó
 */
export const esFechaAntigua = (fecha: Date): boolean => {
  return isPast(fecha) && !isToday(fecha);
};

/**
 * Verifica si una fecha/hora está en el futuro
 */
export const esFechaFutura = (fecha: Date): boolean => {
  return isFuture(fecha);
};

/**
 * Calcula la hora de fin de una cita
 */
export const calcularHoraFin = (inicio: Date, duracionMinutos: number): Date => {
  const fin = new Date(inicio);
  fin.setMinutes(fin.getMinutes() + duracionMinutos);
  return fin;
};

/**
 * Verifica si dos citas se solapan
 */
export const citasSeSolapan = (
  cita1Inicio: Date,
  cita1Duracion: number,
  cita2Inicio: Date,
  cita2Duracion: number
): boolean => {
  const cita1Fin = calcularHoraFin(cita1Inicio, cita1Duracion);
  const cita2Fin = calcularHoraFin(cita2Inicio, cita2Duracion);

  return (
    (cita1Inicio >= cita2Inicio && cita1Inicio < cita2Fin) ||
    (cita2Inicio >= cita1Inicio && cita2Inicio < cita1Fin)
  );
};

/**
 * Obtiene el color según el estado de la cita
 */
export const obtenerColorCita = (estado: string): string => {
  switch (estado) {
    case 'pendiente':
      return 'border-yellow-400 bg-yellow-50';
    case 'confirmada':
      return 'border-blue-400 bg-blue-50';
    case 'completada':
      return 'border-green-400 bg-green-50';
    case 'cancelada':
      return 'border-gray-400 bg-gray-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
};
