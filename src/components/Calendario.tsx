// ============================================================================
// saludvalpa 3.0 - CALENDARIO
// Componente de calendario con vistas día, semana, mes
// ============================================================================

import { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths,
  addWeeks,
  isSameDay,
  isSameMonth,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { Cita } from '../types';
import Button from './shared/Button';

type VistaCalendario = 'dia' | 'semana' | 'mes';

interface CalendarioProps {
  citas: Cita[];
  fechaSeleccionada: Date;
  onFechaChange: (fecha: Date) => void;
  onClickCita?: (cita: Cita) => void;
  onClickHorario?: (fecha: Date) => void;
}

const Calendario = ({
  citas,
  fechaSeleccionada,
  onFechaChange,
  onClickCita,
  onClickHorario,
}: CalendarioProps) => {
  const [vista, setVista] = useState<VistaCalendario>('semana');

  const navegarAnterior = () => {
    if (vista === 'dia') {
      onFechaChange(addDays(fechaSeleccionada, -1));
    } else if (vista === 'semana') {
      onFechaChange(addWeeks(fechaSeleccionada, -1));
    } else {
      onFechaChange(addMonths(fechaSeleccionada, -1));
    }
  };

  const navegarSiguiente = () => {
    if (vista === 'dia') {
      onFechaChange(addDays(fechaSeleccionada, 1));
    } else if (vista === 'semana') {
      onFechaChange(addWeeks(fechaSeleccionada, 1));
    } else {
      onFechaChange(addMonths(fechaSeleccionada, 1));
    }
  };

  const irHoy = () => {
    onFechaChange(new Date());
  };

  const obtenerTituloVista = () => {
    if (vista === 'dia') {
      return format(fechaSeleccionada, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    } else if (vista === 'semana') {
      const inicio = startOfWeek(fechaSeleccionada, { weekStartsOn: 1 });
      const fin = endOfWeek(fechaSeleccionada, { weekStartsOn: 1 });
      return `${format(inicio, 'd MMM', { locale: es })} - ${format(fin, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
    } else {
      return format(fechaSeleccionada, "MMMM 'de' yyyy", { locale: es });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del calendario */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button onClick={navegarAnterior} variant="outline" className="px-3 py-1">
              ←
            </Button>
            <Button onClick={navegarSiguiente} variant="outline" className="px-3 py-1">
              →
            </Button>
            <Button onClick={irHoy} variant="outline" className="px-3 py-2 text-sm">
              Hoy
            </Button>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {obtenerTituloVista()}
          </h2>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setVista('dia')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                vista === 'dia'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setVista('semana')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                vista === 'semana'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setVista('mes')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                vista === 'mes'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Vista del calendario */}
      <div className="p-4">
        {vista === 'dia' && (
          <VistaDia
            fecha={fechaSeleccionada}
            citas={citas}
            onClickCita={onClickCita}
            onClickHorario={onClickHorario}
          />
        )}
        {vista === 'semana' && (
          <VistaSemana
            fecha={fechaSeleccionada}
            citas={citas}
            onClickCita={onClickCita}
            onClickHorario={onClickHorario}
          />
        )}
        {vista === 'mes' && (
          <VistaMes
            fecha={fechaSeleccionada}
            citas={citas}
            onClickCita={onClickCita}
            onClickDia={(dia) => {
              onFechaChange(dia);
              setVista('dia');
            }}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// VISTA DÍA
// ============================================================================

const VistaDia = ({
  fecha,
  citas,
  onClickCita,
  onClickHorario,
}: {
  fecha: Date;
  citas: Cita[];
  onClickCita?: (cita: Cita) => void;
  onClickHorario?: (fecha: Date) => void;
}) => {
  const horas = Array.from({ length: 14 }, (_, i) => i + 7); // 7am - 8pm

  const citasDelDia = citas.filter(cita => 
    isSameDay(new Date(cita.fechaHora), fecha)
  );

  const obtenerCitasEnHora = (hora: number) => {
    return citasDelDia.filter(cita => {
      const horaCita = new Date(cita.fechaHora).getHours();
      return horaCita === hora;
    });
  };

  return (
    <div className="space-y-1">
      {horas.map(hora => {
        const citasEnHora = obtenerCitasEnHora(hora);
        
        return (
          <div key={hora} className="flex gap-2">
            <div className="w-16 text-sm text-gray-600 pt-1">
              {hora.toString().padStart(2, '0')}:00
            </div>
            
            <div className="flex-1">
              {citasEnHora.length > 0 ? (
                <div className="space-y-1">
                  {citasEnHora.map(cita => (
                    <CitaCard
                      key={cita.id}
                      cita={cita}
                      onClick={() => onClickCita?.(cita)}
                    />
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => {
                    const fechaHora = new Date(fecha);
                    fechaHora.setHours(hora, 0, 0, 0);
                    onClickHorario?.(fechaHora);
                  }}
                  className="w-full h-14 border-2 border-dashed border-gray-200 rounded-lg hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// VISTA SEMANA
// ============================================================================

const VistaSemana = ({
  fecha,
  citas,
  onClickCita,
  onClickHorario,
}: {
  fecha: Date;
  citas: Cita[];
  onClickCita?: (cita: Cita) => void;
  onClickHorario?: (fecha: Date) => void;
}) => {
  const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 });
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const obtenerCitasDia = (dia: Date) => {
    return citas.filter(cita => isSameDay(new Date(cita.fechaHora), dia));
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Headers de días */}
      {dias.map(dia => (
        <div key={dia.toString()} className="text-center pb-2 border-b border-gray-200">
          <div className="text-xs text-gray-600 uppercase">
            {format(dia, 'EEE', { locale: es })}
          </div>
          <div className={`text-lg font-semibold mt-1 ${
            isSameDay(dia, new Date()) ? 'text-saludvalpa-blue' : 'text-gray-900'
          }`}>
            {format(dia, 'd')}
          </div>
        </div>
      ))}

      {/* Citas por día */}
      {dias.map(dia => {
        const citasDia = obtenerCitasDia(dia);
        
        return (
          <div key={dia.toString()} className="min-h-32 space-y-1">
            {citasDia.length > 0 ? (
              citasDia.slice(0, 3).map(cita => (
                <button
                  key={cita.id}
                  onClick={() => onClickCita?.(cita)}
                  className={`w-full p-2 rounded text-left text-xs ${obtenerColorEstado(cita.estado)}`}
                >
                  <div className="font-medium truncate">
                    {format(new Date(cita.fechaHora), 'HH:mm')}
                  </div>
                  <div className="text-xs truncate opacity-90">
                    {cita.tipo}
                  </div>
                </button>
              ))
            ) : (
              <button
                onClick={() => {
                  const fechaHora = new Date(dia);
                  fechaHora.setHours(9, 0, 0, 0);
                  onClickHorario?.(fechaHora);
                }}
                className="w-full h-full min-h-24 border border-dashed border-gray-200 rounded hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors"
              />
            )}
            
            {citasDia.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{citasDia.length - 3} más
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// VISTA MES
// ============================================================================

const VistaMes = ({
  fecha,
  citas,
  onClickCita,
  onClickDia,
}: {
  fecha: Date;
  citas: Cita[];
  onClickCita?: (cita: Cita) => void;
  onClickDia?: (dia: Date) => void;
}) => {
  const inicioMes = startOfMonth(fecha);
  const finMes = endOfMonth(fecha);
  const inicioCalendario = startOfWeek(inicioMes, { weekStartsOn: 1 });
  const finCalendario = endOfWeek(finMes, { weekStartsOn: 1 });

  const dias: Date[] = [];
  let diaActual = inicioCalendario;
  while (diaActual <= finCalendario) {
    dias.push(diaActual);
    diaActual = addDays(diaActual, 1);
  }

  const obtenerCitasDia = (dia: Date) => {
    return citas.filter(cita => isSameDay(new Date(cita.fechaHora), dia));
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Headers de días de la semana */}
      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
        <div key={dia} className="text-center text-xs font-semibold text-gray-600 py-2">
          {dia}
        </div>
      ))}

      {/* Días del mes */}
      {dias.map(dia => {
        const citasDia = obtenerCitasDia(dia);
        const esMesActual = isSameMonth(dia, fecha);
        const esHoy = isSameDay(dia, new Date());

        return (
          <button
            key={dia.toString()}
            onClick={() => onClickDia?.(dia)}
            className={`
              min-h-20 p-2 rounded-lg border transition-colors text-left
              ${!esMesActual ? 'bg-gray-50 text-gray-400' : 'bg-white'}
              ${esHoy ? 'border-saludvalpa-blue ring-2 ring-saludvalpa-blue ring-opacity-20' : 'border-gray-200'}
              hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light
            `}
          >
            <div className={`text-sm font-medium mb-1 ${
              esHoy ? 'text-saludvalpa-blue' : esMesActual ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {format(dia, 'd')}
            </div>
            
            {citasDia.length > 0 && (
              <div className="space-y-0.5">
                {citasDia.slice(0, 2).map(cita => (
                  <div
                    key={cita.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickCita?.(cita);
                    }}
                    className={`text-xs px-1 py-0.5 rounded truncate ${obtenerColorEstado(cita.estado)}`}
                  >
                    {format(new Date(cita.fechaHora), 'HH:mm')}
                  </div>
                ))}
                {citasDia.length > 2 && (
                  <div className="text-xs text-gray-500">+{citasDia.length - 2}</div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - CARD DE CITA
// ============================================================================

const CitaCard = ({ cita, onClick }: { cita: Cita; onClick: () => void }) => {
  const [paciente, setPaciente] = useState<any>(null);

  // Cargar datos del paciente
  useLiveQuery(async () => {
    const p = await db.pacientes.get(cita.pacienteId);
    setPaciente(p);
    return p;
  }, [cita.pacienteId]);

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg text-left border-l-4 ${obtenerColorEstado(cita.estado)}`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-semibold text-sm">
          {format(new Date(cita.fechaHora), 'HH:mm')} - {cita.duracion} min
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${obtenerBadgeEstado(cita.estado)}`}>
          {obtenerTextoEstado(cita.estado)}
        </span>
      </div>
      
      {paciente && (
        <div className="text-sm text-gray-900 font-medium mb-1">
          {paciente.nombre} {paciente.apellidos}
        </div>
      )}
      
      <div className="text-xs text-gray-600">{cita.tipo}</div>
      
      {cita.notas && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          {cita.notas}
        </div>
      )}
    </button>
  );
};

// ============================================================================
// UTILIDADES
// ============================================================================

const obtenerColorEstado = (estado: string) => {
  switch (estado) {
    case EstadoCita.PROGRAMADA:
      return 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100';
    case EstadoCita.CONFIRMADA:
      return 'bg-blue-50 border-blue-400 hover:bg-blue-100';
    case EstadoCita.COMPLETADA:
      return 'bg-green-50 border-green-400 hover:bg-green-100';
    case EstadoCita.CANCELADA:
      return 'bg-gray-50 border-gray-400 hover:bg-gray-100';
    default:
      return 'bg-gray-50 border-gray-300 hover:bg-gray-100';
  }
};

const obtenerBadgeEstado = (estado: string) => {
  switch (estado) {
    case EstadoCita.PROGRAMADA:
      return 'bg-yellow-100 text-yellow-800';
    case EstadoCita.CONFIRMADA:
      return 'bg-blue-100 text-blue-800';
    case EstadoCita.COMPLETADA:
      return 'bg-green-100 text-green-800';
    case EstadoCita.CANCELADA:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const obtenerTextoEstado = (estado: string) => {
  switch (estado) {
    case EstadoCita.PROGRAMADA: return 'Programada';
    case EstadoCita.CONFIRMADA: return 'Confirmada';
    case EstadoCita.COMPLETADA: return 'Completada';
    case EstadoCita.CANCELADA: return 'Cancelada';
    default: return estado;
  }
};

// Importaciones necesarias para CitaCard
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { EstadoCita } from '../types';

export default Calendario;
