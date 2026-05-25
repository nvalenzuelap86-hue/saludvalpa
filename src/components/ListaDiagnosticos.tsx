// ============================================================================
// saludvalpa 3.0 - LISTA DE DIAGNÓSTICOS
// Componente para listar y gestionar diagnósticos del paciente
// ============================================================================

import { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import Input from './shared/Input';
import { useDiagnosticosPaciente } from '../hooks/useDiagnosticosPaciente';
import type { TipoProfesion, DiagnosticoEntry } from '../types';

interface ListaDiagnosticosProps {
  pacienteId: string;
  profesion?: TipoProfesion;
}

interface FormularioDiagnostico {
  codigo: string;
  descripcion: string;
  tipo: string;
  notas: string;
  activo: boolean;
}

const formularioVacio: FormularioDiagnostico = {
  codigo: '',
  descripcion: '',
  tipo: 'principal',
  notas: '',
  activo: true,
};

const TIPOS_DIAGNOSTICO = [
  { value: 'principal', label: 'Principal' },
  { value: 'secundario', label: 'Secundario' },
  { value: 'diferencial', label: 'Diferencial' },
];

export default function ListaDiagnosticos({ pacienteId, profesion }: ListaDiagnosticosProps) {
  const {
    diagnosticos,
    cargando,
    agregarDiagnostico,
    actualizarDiagnostico,
    eliminarDiagnostico,
    toggleDiagnosticoActivo,
    error,
  } = useDiagnosticosPaciente(pacienteId, profesion);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<FormularioDiagnostico>(formularioVacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.descripcion.trim()) return;

    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarDiagnostico(editandoId, {
          codigo: formulario.codigo || undefined,
          descripcion: formulario.descripcion,
          tipo: formulario.tipo,
          notas: formulario.notas || undefined,
          activo: formulario.activo,
        });
      } else {
        await agregarDiagnostico({
          pacienteId,
          profesion: profesion || 'fisioterapia',
          fecha: new Date(),
          codigo: formulario.codigo || undefined,
          descripcion: formulario.descripcion,
          tipo: formulario.tipo,
          notas: formulario.notas || undefined,
          activo: formulario.activo,
          creadoPor: undefined,
        });
      }
      setFormulario(formularioVacio);
      setEditandoId(null);
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar diagnóstico:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (diagnostico: DiagnosticoEntry) => {
    setFormulario({
      codigo: diagnostico.codigo || '',
      descripcion: diagnostico.descripcion,
      tipo: diagnostico.tipo || 'principal',
      notas: diagnostico.notas || '',
      activo: diagnostico.activo,
    });
    setEditandoId(diagnostico.id);
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setFormulario(formularioVacio);
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Cargando diagnósticos...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Diagnósticos</h3>
        <Button
          size="sm"
          onClick={() => {
            setFormulario(formularioVacio);
            setEditandoId(null);
            setMostrarFormulario(true);
          }}
        >
          + Agregar diagnóstico
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!diagnosticos || diagnosticos.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay diagnósticos registrados. Agrega el primer diagnóstico.
        </p>
      ) : (
        <div className="space-y-3">
          {diagnosticos.map((diagnostico) => (
            <div
              key={diagnostico.id}
              className={`p-4 rounded-lg border ${
                diagnostico.activo
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {diagnostico.codigo && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {diagnostico.codigo}
                      </span>
                    )}
                    {diagnostico.tipo && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {TIPOS_DIAGNOSTICO.find(t => t.value === diagnostico.tipo)?.label || diagnostico.tipo}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        diagnostico.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {diagnostico.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800">{diagnostico.descripcion}</p>
                  {diagnostico.notas && (
                    <p className="text-sm text-gray-600 mt-1">{diagnostico.notas}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {formatearFecha(diagnostico.fecha)}
                    {diagnostico.profesion && ` · ${diagnostico.profesion}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleEditar(diagnostico)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleDiagnosticoActivo(diagnostico.id, !diagnostico.activo)}
                    className={`p-1.5 rounded transition-colors ${
                      diagnostico.activo
                        ? 'text-green-400 hover:text-green-600 hover:bg-green-100'
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-100'
                    }`}
                    title={diagnostico.activo ? 'Desactivar' : 'Activar'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={diagnostico.activo ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
                    </svg>
                  </button>
                  <button
                    onClick={() => eliminarDiagnostico(diagnostico.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={mostrarFormulario}
        onClose={handleCancelar}
        title={editandoId ? 'Editar diagnóstico' : 'Agregar diagnóstico'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Código (CIE-10, DSM-5, etc.)"
            placeholder="Ej: I10, M54.5, F32.0"
            value={formulario.codigo}
            onChange={(e) => setFormulario(prev => ({ ...prev, codigo: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del diagnóstico *
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={3}
              placeholder="Describe el diagnóstico..."
              value={formulario.descripcion}
              onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de diagnóstico
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              value={formulario.tipo}
              onChange={(e) => setFormulario(prev => ({ ...prev, tipo: e.target.value }))}
            >
              {TIPOS_DIAGNOSTICO.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={2}
              placeholder="Notas adicionales..."
              value={formulario.notas}
              onChange={(e) => setFormulario(prev => ({ ...prev, notas: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formulario.activo}
              onChange={(e) => setFormulario(prev => ({ ...prev, activo: e.target.checked }))}
              className="w-4 h-4 text-saludvalpa-blue border-gray-300 rounded focus:ring-saludvalpa-blue"
            />
            <span className="text-sm text-gray-700">Diagnóstico activo</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={guardando}>
              {editandoId ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
