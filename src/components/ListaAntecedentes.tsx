// ============================================================================
// saludvalpa 3.0 - LISTA DE ANTECEDENTES
// Componente para listar y gestionar antecedentes del paciente
// ============================================================================

import { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import Input from './shared/Input';
import { useAntecedentesPaciente, ETIQUETAS_TIPOS_ANTECEDENTES, ICONOS_TIPOS_ANTECEDENTES } from '../hooks/useAntecedentesPaciente';
import type { AntecedenteEntry } from '../types';

interface ListaAntecedentesProps {
  pacienteId: string;
}

interface FormularioAntecedente {
  tipo: AntecedenteEntry['tipo'];
  descripcion: string;
  fechaRegistro: string;
  notas: string;
  activo: boolean;
}

const formularioVacio: FormularioAntecedente = {
  tipo: 'patologico',
  descripcion: '',
  fechaRegistro: '',
  notas: '',
  activo: true,
};

const TIPOS_ANTECEDENTES_OPCIONES: { value: AntecedenteEntry['tipo']; label: string; icono: string }[] = [
  { value: 'patologico', label: 'Patológicos', icono: '🏥' },
  { value: 'quirurgico', label: 'Quirúrgicos', icono: '🔪' },
  { value: 'alergico', label: 'Alérgicos', icono: '💊' },
  { value: 'toxicos', label: 'Tóxicos', icono: '🚬' },
  { value: 'familiares', label: 'Familiares', icono: '👨‍👩‍👧‍👦' },
  { value: 'farmacologicos', label: 'Farmacológicos', icono: '💉' },
  { value: 'traumaticos', label: 'Traumáticos', icono: '🩹' },
  { value: 'otros', label: 'Otros', icono: '📋' },
];

export default function ListaAntecedentes({ pacienteId }: ListaAntecedentesProps) {
  const {
    antecedentes,
    cargando,
    agregarAntecedente,
    actualizarAntecedente,
    eliminarAntecedente,
    toggleAntecedenteActivo,
    obtenerAntecedentesAgrupados,
    error,
  } = useAntecedentesPaciente(pacienteId);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<FormularioAntecedente>(formularioVacio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<AntecedenteEntry['tipo'] | 'todos'>('todos');

  const antecedentesAgrupados = obtenerAntecedentesAgrupados();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.descripcion.trim()) return;

    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarAntecedente(editandoId, {
          tipo: formulario.tipo,
          descripcion: formulario.descripcion,
          fechaRegistro: formulario.fechaRegistro ? new Date(formulario.fechaRegistro) : undefined,
          notas: formulario.notas || undefined,
          activo: formulario.activo,
        });
      } else {
        await agregarAntecedente({
          pacienteId,
          tipo: formulario.tipo,
          descripcion: formulario.descripcion,
          fechaRegistro: formulario.fechaRegistro ? new Date(formulario.fechaRegistro) : undefined,
          notas: formulario.notas || undefined,
          activo: formulario.activo,
          creadoPor: undefined,
        });
      }
      setFormulario(formularioVacio);
      setEditandoId(null);
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar antecedente:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (antecedente: AntecedenteEntry) => {
    setFormulario({
      tipo: antecedente.tipo,
      descripcion: antecedente.descripcion,
      fechaRegistro: antecedente.fechaRegistro
        ? new Date(antecedente.fechaRegistro).toISOString().split('T')[0]
        : '',
      notas: antecedente.notas || '',
      activo: antecedente.activo,
    });
    setEditandoId(antecedente.id);
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
        <div className="text-center text-gray-500">Cargando antecedentes...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Antecedentes</h3>
        <Button
          size="sm"
          onClick={() => {
            setFormulario(formularioVacio);
            setEditandoId(null);
            setMostrarFormulario(true);
          }}
        >
          + Agregar antecedente
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filtro por tipo */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setTipoSeleccionado('todos')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            tipoSeleccionado === 'todos'
              ? 'bg-saludvalpa-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {TIPOS_ANTECEDENTES_OPCIONES.map((tipo) => (
          <button
            key={tipo.value}
            onClick={() => setTipoSeleccionado(tipo.value)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              tipoSeleccionado === tipo.value
                ? 'bg-saludvalpa-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tipo.icono} {tipo.label}
          </button>
        ))}
      </div>

      {!antecedentes || antecedentes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay antecedentes registrados. Agrega el primer antecedente.
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(antecedentesAgrupados).map(([tipo, items]) => {
            if (tipoSeleccionado !== 'todos' && tipoSeleccionado !== tipo) return null;
            if (items.length === 0) return null;

            const tipoInfo = TIPOS_ANTECEDENTES_OPCIONES.find(t => t.value === tipo);
            return (
              <div key={tipo}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>{tipoInfo?.icono}</span>
                  <span>{tipoInfo?.label}</span>
                  <span className="text-xs text-gray-400 font-normal">({items.length})</span>
                </h4>
                <div className="space-y-2">
                  {items.map((antecedente) => (
                    <div
                      key={antecedente.id}
                      className={`p-3 rounded-lg border ${
                        antecedente.activo
                          ? 'border-gray-200 bg-white'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-gray-800 ${!antecedente.activo ? 'line-through text-gray-400' : ''}`}>
                            {antecedente.descripcion}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {antecedente.fechaRegistro && (
                              <span className="text-xs text-gray-400">
                                {formatearFecha(antecedente.fechaRegistro)}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 text-xs rounded ${
                                antecedente.activo
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {antecedente.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          {antecedente.notas && (
                            <p className="text-sm text-gray-500 mt-1">{antecedente.notas}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => handleEditar(antecedente)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleAntecedenteActivo(antecedente.id, !antecedente.activo)}
                            className={`p-1.5 rounded transition-colors ${
                              antecedente.activo
                                ? 'text-green-400 hover:text-green-600 hover:bg-green-100'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-100'
                            }`}
                            title={antecedente.activo ? 'Desactivar' : 'Activar'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={antecedente.activo ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarAntecedente(antecedente.id)}
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
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={mostrarFormulario}
        onClose={handleCancelar}
        title={editandoId ? 'Editar antecedente' : 'Agregar antecedente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de antecedente
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              value={formulario.tipo}
              onChange={(e) => setFormulario(prev => ({ ...prev, tipo: e.target.value as AntecedenteEntry['tipo'] }))}
            >
              {TIPOS_ANTECEDENTES_OPCIONES.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.icono} {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={2}
              placeholder="Describe el antecedente..."
              value={formulario.descripcion}
              onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Fecha del registro"
            type="date"
            value={formulario.fechaRegistro}
            onChange={(e) => setFormulario(prev => ({ ...prev, fechaRegistro: e.target.value }))}
          />

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
            <span className="text-sm text-gray-700">Antecedente activo</span>
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
