// ============================================================================
// saludvalpa 3.0 - FORMULARIO CITA
// Componente para crear/editar citas
// ============================================================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Cita } from '../types';
import { EstadoCita } from '../types';
import { format } from 'date-fns';
import Input from './shared/Input';
import Button from './shared/Button';

interface FormularioCitaProps {
  cita?: Cita;
  fechaHoraInicial?: Date;
  pacienteIdInicial?: string;
  onSubmit: (datosCita: Omit<Cita, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'recordatorioEnviado'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FormularioCita = ({
  cita,
  fechaHoraInicial,
  pacienteIdInicial,
  onSubmit,
  onCancel,
  isLoading = false,
}: FormularioCitaProps) => {
  const fechaInicial = cita?.fechaHora || fechaHoraInicial || new Date();
  
  const [formData, setFormData] = useState({
    pacienteId: cita?.pacienteId || pacienteIdInicial || '',
    fecha: format(fechaInicial, 'yyyy-MM-dd'),
    hora: format(fechaInicial, 'HH:mm'),
    duracion: cita?.duracion || 60,
    tipo: cita?.tipo || 'Consulta general',
    estado: cita?.estado || EstadoCita.PROGRAMADA,
    notas: cita?.notas || '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  // Cargar pacientes activos
  const pacientes = useLiveQuery(() => 
    db.pacientes.toArray().then(todos => todos.filter(p => p.activo))
  );

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.pacienteId) {
      nuevosErrores.pacienteId = 'Debes seleccionar un paciente';
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida';
    }

    if (!formData.hora) {
      nuevosErrores.hora = 'La hora es requerida';
    }

    if (!formData.duracion || formData.duracion <= 0) {
      nuevosErrores.duracion = 'La duración debe ser mayor a 0';
    }

    if (!formData.tipo.trim()) {
      nuevosErrores.tipo = 'El tipo de cita es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validar()) return;

    // Combinar fecha y hora
    const [año, mes, dia] = formData.fecha.split('-').map(Number);
    const [hora, minuto] = formData.hora.split(':').map(Number);
    const fechaHora = new Date(año, mes - 1, dia, hora, minuto);

    onSubmit({
      pacienteId: formData.pacienteId,
      profesionalId: undefined, // Para futura implementación multiusuario
      fechaHora,
      duracion: formData.duracion,
      tipo: formData.tipo.trim(),
      estado: formData.estado,
      profesion: cita?.profesion || 'medicina_general', // Usar profesión de la cita existente o default
      notas: formData.notas.trim() || undefined,
      sesionId: cita?.sesionId,
    });
  };

  const tiposCita = [
    'Consulta general',
    'Primera vez',
    'Seguimiento',
    'Evaluación',
    'Tratamiento',
    'Revisión',
    'Control',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de paciente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paciente *
        </label>
        <select
          value={formData.pacienteId}
          onChange={(e) => setFormData(prev => ({ ...prev, pacienteId: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent ${
            errores.pacienteId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={!!cita} // No cambiar paciente al editar
          autoFocus
        >
          <option value="">Seleccionar paciente...</option>
          {pacientes?.map(paciente => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombre} {paciente.apellidos} - {paciente.telefono}
            </option>
          ))}
        </select>
        {errores.pacienteId && (
          <p className="text-xs text-red-600 mt-1">{errores.pacienteId}</p>
        )}
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fecha *"
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
          error={errores.fecha}
        />
        
        <Input
          label="Hora *"
          type="time"
          value={formData.hora}
          onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
          error={errores.hora}
        />
      </div>

      {/* Tipo y duración */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de cita *
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent ${
              errores.tipo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {tiposCita.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && (
            <p className="text-xs text-red-600 mt-1">{errores.tipo}</p>
          )}
        </div>

        <Input
          label="Duración (minutos) *"
          type="number"
          min="15"
          step="15"
          value={formData.duracion}
          onChange={(e) => setFormData(prev => ({ ...prev, duracion: parseInt(e.target.value) }))}
          error={errores.duracion}
        />
      </div>

      {/* Estado (solo al editar) */}
      {cita && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={formData.estado}
            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as any }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          >
            <option value={EstadoCita.PROGRAMADA}>Programada</option>
            <option value={EstadoCita.CONFIRMADA}>Confirmada</option>
            <option value={EstadoCita.COMPLETADA}>Completada</option>
            <option value={EstadoCita.CANCELADA}>Cancelada</option>
          </select>
        </div>
      )}

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          placeholder="Notas o indicaciones especiales para esta cita..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {cita ? 'Actualizar cita' : 'Crear cita'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default FormularioCita;
