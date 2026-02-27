// ============================================================================
// saludvalpa 3.0 - FORMULARIO DE PACIENTE
// ============================================================================

import { useState } from 'react';
import type { Paciente, Genero } from '../types';
import { esEmailValido, esTelefonoValido } from '../utils/helpers';
import Input from './shared/Input';
import Button from './shared/Button';

interface FormularioPacienteProps {
  paciente?: Paciente;
  onSubmit: (datos: Omit<Paciente, 'id' | 'fechaCreacion' | 'edad'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const FormularioPaciente = ({ paciente, onSubmit, onCancel, isLoading }: FormularioPacienteProps) => {
  const [formData, setFormData] = useState({
    nombre: paciente?.nombre || '',
    apellidos: paciente?.apellidos || '',
    fechaNacimiento: paciente?.fechaNacimiento?.toISOString().split('T')[0] || '',
    genero: paciente?.genero || 'otro' as Genero,
    telefono: paciente?.telefono || '',
    email: paciente?.email || '',
    direccion: paciente?.direccion || '',
    profesion: paciente?.profesion || '',
    motivoConsulta: paciente?.motivoConsulta || '',
    historialMedico: paciente?.historialMedico || '',
    alergias: paciente?.alergias?.join(', ') || '',
    medicamentos: paciente?.medicamentos?.join(', ') || '',
    contactoEmergenciaNombre: paciente?.contactoEmergencia?.nombre || '',
    contactoEmergenciaTelefono: paciente?.contactoEmergencia?.telefono || '',
    contactoEmergenciaRelacion: paciente?.contactoEmergencia?.relacion || '',
    activo: paciente?.activo ?? true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const fecha = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      if (fecha > hoy) {
        nuevosErrores.fechaNacimiento = 'La fecha no puede ser futura';
      }
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!esTelefonoValido(formData.telefono)) {
      nuevosErrores.telefono = 'Teléfono inválido (mínimo 10 dígitos)';
    }

    if (formData.email && !esEmailValido(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const datos: Omit<Paciente, 'id' | 'fechaCreacion' | 'edad'> = {
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      fechaNacimiento: new Date(formData.fechaNacimiento),
      genero: formData.genero,
      telefono: formData.telefono.trim(),
      email: formData.email.trim() || undefined,
      direccion: formData.direccion.trim() || undefined,
      profesion: formData.profesion.trim() || undefined,
      profesionPrincipal: paciente?.profesionPrincipal || 'medicina_general', // Usar profesión del paciente existente o default
      motivoConsulta: formData.motivoConsulta.trim() || undefined,
      historialMedico: formData.historialMedico.trim() || undefined,
      alergias: formData.alergias.split(',').map(a => a.trim()).filter(Boolean),
      medicamentos: formData.medicamentos.split(',').map(m => m.trim()).filter(Boolean),
      contactoEmergencia: formData.contactoEmergenciaNombre.trim() ? {
        nombre: formData.contactoEmergenciaNombre.trim(),
        telefono: formData.contactoEmergenciaTelefono.trim(),
        relacion: formData.contactoEmergenciaRelacion.trim(),
      } : undefined,
      activo: formData.activo,
      documentosIds: paciente?.documentosIds || [],
      citasIds: paciente?.citasIds || [],
      sesionesIds: paciente?.sesionesIds || [],
    };

    await onSubmit(datos);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[field]) {
      setErrores(prev => {
        const nuevos = { ...prev };
        delete nuevos[field];
        return nuevos;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos personales básicos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            error={errores.nombre}
            placeholder="Ej: Juan"
            autoFocus
          />
          
          <Input
            label="Apellidos *"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            error={errores.apellidos}
            placeholder="Ej: Pérez González"
          />

          <Input
            label="Fecha de nacimiento *"
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
            error={errores.fechaNacimiento}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={formData.genero}
              onChange={(e) => handleChange('genero', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            >
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono *"
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            error={errores.telefono}
            placeholder="+52 555 123 4567"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errores.email}
            placeholder="ejemplo@correo.com"
          />

          <div className="md:col-span-2">
            <Input
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Calle, número, colonia, ciudad"
            />
          </div>
        </div>
      </div>

      {/* Información médica */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información clínica</h3>
        <div className="space-y-4">
          <Input
            label="Profesión/Ocupación"
            value={formData.profesion}
            onChange={(e) => handleChange('profesion', e.target.value)}
            placeholder="Ej: Ingeniero, Estudiante, etc."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de consulta
            </label>
            <textarea
              value={formData.motivoConsulta}
              onChange={(e) => handleChange('motivoConsulta', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={3}
              placeholder="Descripción breve del motivo por el cual consulta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historial médico
            </label>
            <textarea
              value={formData.historialMedico}
              onChange={(e) => handleChange('historialMedico', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={3}
              placeholder="Enfermedades previas, cirugías, tratamientos anteriores..."
            />
          </div>

          <Input
            label="Alergias"
            value={formData.alergias}
            onChange={(e) => handleChange('alergias', e.target.value)}
            placeholder="Separadas por comas: polen, penicilina, etc."
            helperText="Separa cada alergia con una coma"
          />

          <Input
            label="Medicamentos actuales"
            value={formData.medicamentos}
            onChange={(e) => handleChange('medicamentos', e.target.value)}
            placeholder="Separados por comas: ibuprofeno, omeprazol, etc."
            helperText="Separa cada medicamento con una coma"
          />
        </div>
      </div>

      {/* Contacto de emergencia */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto de emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nombre"
            value={formData.contactoEmergenciaNombre}
            onChange={(e) => handleChange('contactoEmergenciaNombre', e.target.value)}
            placeholder="María Pérez"
          />

          <Input
            label="Teléfono"
            type="tel"
            value={formData.contactoEmergenciaTelefono}
            onChange={(e) => handleChange('contactoEmergenciaTelefono', e.target.value)}
            placeholder="+52 555 987 6543"
          />

          <Input
            label="Relación"
            value={formData.contactoEmergenciaRelacion}
            onChange={(e) => handleChange('contactoEmergenciaRelacion', e.target.value)}
            placeholder="Madre, Esposo, etc."
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {paciente ? 'Actualizar paciente' : 'Crear paciente'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        * Campos requeridos
      </p>
    </form>
  );
};

export default FormularioPaciente;
