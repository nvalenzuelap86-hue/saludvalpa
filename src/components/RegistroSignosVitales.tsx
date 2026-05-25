// ============================================================================
// saludvalpa 3.0 - REGISTRO DE SIGNOS VITALES
// Componente para listar y registrar signos vitales del paciente
// ============================================================================

import { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import Input from './shared/Input';
import { useSignosVitales } from '../hooks/useSignosVitales';
import type { TipoProfesion } from '../types';

interface RegistroSignosVitalesProps {
  pacienteId: string;
  profesion?: TipoProfesion;
}

interface FormularioSignosVitales {
  peso: string;
  talla: string;
  circunferenciaCintura: string;
  circunferenciaCadera: string;
  presionArterialSistolica: string;
  presionArterialDiastolica: string;
  frecuenciaCardiaca: string;
  frecuenciaRespiratoria: string;
  temperatura: string;
  saturacionOxigeno: string;
  glucosaCapilar: string;
  notas: string;
}

const formularioVacio: FormularioSignosVitales = {
  peso: '',
  talla: '',
  circunferenciaCintura: '',
  circunferenciaCadera: '',
  presionArterialSistolica: '',
  presionArterialDiastolica: '',
  frecuenciaCardiaca: '',
  frecuenciaRespiratoria: '',
  temperatura: '',
  saturacionOxigeno: '',
  glucosaCapilar: '',
  notas: '',
};

export default function RegistroSignosVitales({ pacienteId, profesion }: RegistroSignosVitalesProps) {
  const {
    registros,
    cargando,
    agregarRegistro,
    eliminarRegistro,
    error,
  } = useSignosVitales(pacienteId, profesion);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState<FormularioSignosVitales>(formularioVacio);
  const [guardando, setGuardando] = useState(false);

  const handleChange = (campo: keyof FormularioSignosVitales, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await agregarRegistro({
        pacienteId,
        profesion: profesion || 'fisioterapia',
        fecha: new Date(),
        peso: formulario.peso ? parseFloat(formulario.peso) : undefined,
        talla: formulario.talla ? parseFloat(formulario.talla) : undefined,
        circunferenciaCintura: formulario.circunferenciaCintura ? parseFloat(formulario.circunferenciaCintura) : undefined,
        circunferenciaCadera: formulario.circunferenciaCadera ? parseFloat(formulario.circunferenciaCadera) : undefined,
        presionArterialSistolica: formulario.presionArterialSistolica ? parseInt(formulario.presionArterialSistolica) : undefined,
        presionArterialDiastolica: formulario.presionArterialDiastolica ? parseInt(formulario.presionArterialDiastolica) : undefined,
        frecuenciaCardiaca: formulario.frecuenciaCardiaca ? parseInt(formulario.frecuenciaCardiaca) : undefined,
        frecuenciaRespiratoria: formulario.frecuenciaRespiratoria ? parseInt(formulario.frecuenciaRespiratoria) : undefined,
        temperatura: formulario.temperatura ? parseFloat(formulario.temperatura) : undefined,
        saturacionOxigeno: formulario.saturacionOxigeno ? parseInt(formulario.saturacionOxigeno) : undefined,
        glucosaCapilar: formulario.glucosaCapilar ? parseInt(formulario.glucosaCapilar) : undefined,
        notas: formulario.notas || undefined,
        creadoPor: undefined,
      });
      setFormulario(formularioVacio);
      setMostrarFormulario(false);
    } catch (err) {
      console.error('Error al guardar signos vitales:', err);
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Cargando signos vitales...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Signos Vitales</h3>
        <Button size="sm" onClick={() => setMostrarFormulario(true)}>
          + Registrar signos vitales
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!registros || registros.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay registros de signos vitales. Realiza el primer registro.
        </p>
      ) : (
        <div className="space-y-3">
          {registros.map((registro) => (
            <div key={registro.id} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  {formatearFecha(registro.fecha)}
                </span>
                <button
                  onClick={() => eliminarRegistro(registro.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {registro.peso && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Peso</div>
                    <div className="font-semibold text-gray-800">{registro.peso} kg</div>
                  </div>
                )}
                {registro.talla && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Talla</div>
                    <div className="font-semibold text-gray-800">{registro.talla} cm</div>
                  </div>
                )}
                {registro.imc && (
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-xs text-gray-500">IMC</div>
                    <div className="font-semibold text-blue-700">{registro.imc}</div>
                  </div>
                )}
                {registro.presionArterialSistolica && registro.presionArterialDiastolica && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">PA</div>
                    <div className="font-semibold text-gray-800">
                      {registro.presionArterialSistolica}/{registro.presionArterialDiastolica}
                    </div>
                  </div>
                )}
                {registro.frecuenciaCardiaca && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">FC</div>
                    <div className="font-semibold text-gray-800">{registro.frecuenciaCardiaca} bpm</div>
                  </div>
                )}
                {registro.frecuenciaRespiratoria && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">FR</div>
                    <div className="font-semibold text-gray-800">{registro.frecuenciaRespiratoria} rpm</div>
                  </div>
                )}
                {registro.temperatura && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Temp.</div>
                    <div className="font-semibold text-gray-800">{registro.temperatura} °C</div>
                  </div>
                )}
                {registro.saturacionOxigeno && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">SatO₂</div>
                    <div className="font-semibold text-gray-800">{registro.saturacionOxigeno}%</div>
                  </div>
                )}
                {registro.glucosaCapilar && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Glucosa</div>
                    <div className="font-semibold text-gray-800">{registro.glucosaCapilar} mg/dL</div>
                  </div>
                )}
                {registro.circunferenciaCintura && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">C. Cintura</div>
                    <div className="font-semibold text-gray-800">{registro.circunferenciaCintura} cm</div>
                  </div>
                )}
                {registro.circunferenciaCadera && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">C. Cadera</div>
                    <div className="font-semibold text-gray-800">{registro.circunferenciaCadera} cm</div>
                  </div>
                )}
              </div>

              {registro.notas && (
                <p className="text-sm text-gray-600 mt-2">{registro.notas}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Registrar signos vitales"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b">Antropometría</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Peso (kg)"
                type="number"
                step="0.1"
                placeholder="Ej: 72.5"
                value={formulario.peso}
                onChange={(e) => handleChange('peso', e.target.value)}
              />
              <Input
                label="Talla (cm)"
                type="number"
                step="0.1"
                placeholder="Ej: 170"
                value={formulario.talla}
                onChange={(e) => handleChange('talla', e.target.value)}
              />
              <Input
                label="Circunferencia cintura (cm)"
                type="number"
                step="0.1"
                placeholder="Ej: 85"
                value={formulario.circunferenciaCintura}
                onChange={(e) => handleChange('circunferenciaCintura', e.target.value)}
              />
              <Input
                label="Circunferencia cadera (cm)"
                type="number"
                step="0.1"
                placeholder="Ej: 95"
                value={formulario.circunferenciaCadera}
                onChange={(e) => handleChange('circunferenciaCadera', e.target.value)}
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b">Signos Vitales</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="PA Sistólica (mmHg)"
                type="number"
                placeholder="Ej: 120"
                value={formulario.presionArterialSistolica}
                onChange={(e) => handleChange('presionArterialSistolica', e.target.value)}
              />
              <Input
                label="PA Diastólica (mmHg)"
                type="number"
                placeholder="Ej: 80"
                value={formulario.presionArterialDiastolica}
                onChange={(e) => handleChange('presionArterialDiastolica', e.target.value)}
              />
              <Input
                label="Frecuencia cardíaca (bpm)"
                type="number"
                placeholder="Ej: 72"
                value={formulario.frecuenciaCardiaca}
                onChange={(e) => handleChange('frecuenciaCardiaca', e.target.value)}
              />
              <Input
                label="Frecuencia respiratoria (rpm)"
                type="number"
                placeholder="Ej: 16"
                value={formulario.frecuenciaRespiratoria}
                onChange={(e) => handleChange('frecuenciaRespiratoria', e.target.value)}
              />
              <Input
                label="Temperatura (°C)"
                type="number"
                step="0.1"
                placeholder="Ej: 36.5"
                value={formulario.temperatura}
                onChange={(e) => handleChange('temperatura', e.target.value)}
              />
              <Input
                label="SatO₂ (%)"
                type="number"
                placeholder="Ej: 98"
                value={formulario.saturacionOxigeno}
                onChange={(e) => handleChange('saturacionOxigeno', e.target.value)}
              />
              <Input
                label="Glucosa capilar (mg/dL)"
                type="number"
                placeholder="Ej: 95"
                value={formulario.glucosaCapilar}
                onChange={(e) => handleChange('glucosaCapilar', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              rows={2}
              placeholder="Notas adicionales..."
              value={formulario.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={guardando}>
              Guardar registro
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
