// ============================================================================
// saludvalpa 3.0 - CAMPOS ESPECÍFICOS DE MEDICINA GENERAL
// Componente para capturar datos específicos de consulta médica
// ============================================================================

import { useState } from 'react';
import type { DatosMedicinaGeneral, MedicamentoPrescrito } from '../../../types';

interface CamposMedicinaProps {
  datos: DatosMedicinaGeneral;
  onChange: (datos: DatosMedicinaGeneral) => void;
}

export default function CamposMedicina({ datos, onChange }: CamposMedicinaProps) {
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    presentacion: 'tabletas',
    dosis: '',
    frecuencia: '',
    duracion: '',
    via: 'oral',
  });
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState('');

  const handleChange = (campo: keyof DatosMedicinaGeneral, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const handleSignosVitalesChange = (campo: string, valor: any) => {
    const signosVitales = datos.signosVitales || {
      presionArterial: '',
      frecuenciaCardiaca: 0,
      frecuenciaRespiratoria: 0,
      temperatura: 0,
      saturacionOxigeno: 0,
      peso: 0,
      talla: 0,
    };
    
    handleChange('signosVitales', {
      ...signosVitales,
      [campo]: valor,
    });
  };

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.nombre.trim()) return;
    
    const medicamentos = datos.tratamiento?.medicamentos || [];
    const medicamentoCompleto: MedicamentoPrescrito = {
      nombre: nuevoMedicamento.nombre,
      presentacion: nuevoMedicamento.presentacion,
      dosis: nuevoMedicamento.dosis,
      frecuencia: nuevoMedicamento.frecuencia,
      duracion: nuevoMedicamento.duracion,
      via: nuevoMedicamento.via,
    };

    const tratamiento = datos.tratamiento || { medicamentos: [], indicaciones: [], estudiosSolicitados: [], interconsultas: [] };
    
    handleChange('tratamiento', {
      ...tratamiento,
      medicamentos: [...medicamentos, medicamentoCompleto],
    });

    setNuevoMedicamento({
      nombre: '',
      presentacion: 'tabletas',
      dosis: '',
      frecuencia: '',
      duracion: '',
      via: 'oral',
    });
  };

  const eliminarMedicamento = (indice: number) => {
    const medicamentos = datos.tratamiento?.medicamentos || [];
    const tratamiento = datos.tratamiento || { medicamentos: [], indicaciones: [], estudiosSolicitados: [], interconsultas: [] };
    
    handleChange('tratamiento', {
      ...tratamiento,
      medicamentos: medicamentos.filter((_, i) => i !== indice),
    });
  };

  const agregarDiagnostico = () => {
    if (!nuevoDiagnostico.trim()) return;
    
    const diagnosticos = datos.diagnostico || [];
    handleChange('diagnostico', [...diagnosticos, nuevoDiagnostico]);
    setNuevoDiagnostico('');
  };

  const eliminarDiagnostico = (indice: number) => {
    const diagnosticos = datos.diagnostico || [];
    handleChange('diagnostico', diagnosticos.filter((_, i) => i !== indice));
  };

  const calcularIMC = () => {
    const peso = datos.signosVitales?.peso || 0;
    const talla = datos.signosVitales?.talla || 0;
    
    if (peso > 0 && talla > 0) {
      const tallaMetros = talla / 100;
      return (peso / (tallaMetros * tallaMetros)).toFixed(1);
    }
    return null;
  };

  const imc = calcularIMC();

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Signos Vitales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presión Arterial (mmHg)
            </label>
            <input
              type="text"
              value={datos.signosVitales?.presionArterial || ''}
              onChange={(e) => handleSignosVitalesChange('presionArterial', e.target.value)}
              placeholder="Ej: 120/80"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia Cardíaca (lpm)
            </label>
            <input
              type="number"
              min="0"
              max="300"
              value={datos.signosVitales?.frecuenciaCardiaca || ''}
              onChange={(e) => handleSignosVitalesChange('frecuenciaCardiaca', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura (°C)
            </label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={datos.signosVitales?.temperatura || ''}
              onChange={(e) => handleSignosVitalesChange('temperatura', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saturación O₂ (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={datos.signosVitales?.saturacionOxigeno || ''}
              onChange={(e) => handleSignosVitalesChange('saturacionOxigeno', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="300"
              value={datos.signosVitales?.peso || ''}
              onChange={(e) => handleSignosVitalesChange('peso', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talla (cm)
            </label>
            <input
              type="number"
              min="0"
              max="250"
              value={datos.signosVitales?.talla || ''}
              onChange={(e) => handleSignosVitalesChange('talla', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IMC
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300">
              {imc ? (
                <span className={`font-bold ${parseFloat(imc) >= 30 ? 'text-red-600' : parseFloat(imc) >= 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {imc} kg/m²
                </span>
              ) : (
                <span className="text-gray-500">Ingrese peso y talla</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia Respiratoria (rpm)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={datos.signosVitales?.frecuenciaRespiratoria || ''}
              onChange={(e) => handleSignosVitalesChange('frecuenciaRespiratoria', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Diagnósticos</h3>
        
        {datos.diagnostico && datos.diagnostico.length > 0 && (
          <div className="space-y-2 mb-3">
            {datos.diagnostico.map((diagnostico, idx) => (
              <div key={idx} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-red-800">{diagnostico}</span>
                </div>
                <button
                  onClick={() => eliminarDiagnostico(idx)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={nuevoDiagnostico}
            onChange={(e) => setNuevoDiagnostico(e.target.value)}
            placeholder="Ej: Hipertensión arterial esencial, Diabetes mellitus tipo 2..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
            onKeyPress={(e) => e.key === 'Enter' && agregarDiagnostico()}
          />
          <button
            onClick={agregarDiagnostico}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            + Agregar
          </button>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Prescripción Médica</h3>
        
        {datos.tratamiento?.medicamentos && datos.tratamiento.medicamentos.length > 0 && (
          <div className="space-y-3 mb-4">
            {datos.tratamiento.medicamentos.map((med, idx) => (
              <div key={idx} className="bg-white p-3 rounded border border-green-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-green-800">{med.nombre}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {med.presentacion}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="mr-3"><strong>Dosis:</strong> {med.dosis}</span>
                      <span className="mr-3"><strong>Frecuencia:</strong> {med.frecuencia}</span>
                      <span className="mr-3"><strong>Duración:</strong> {med.duracion}</span>
                      <span><strong>Vía:</strong> {med.via}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarMedicamento(idx)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded border border-green-300">
          <h4 className="font-medium text-gray-800 mb-3">Agregar Nuevo Medicamento</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Medicamento *
              </label>
              <input
                type="text"
                value={nuevoMedicamento.nombre}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, nombre: e.target.value})}
                placeholder="Ej: Amoxicilina, Metformina..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentación
              </label>
              <select
                value={nuevoMedicamento.presentacion}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, presentacion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="tabletas">Tabletas</option>
                <option value="capsulas">Cápsulas</option>
                <option value="jarabe">Jarabe</option>
                <option value="inyectable">Inyectable</option>
                <option value="crema">Crema</option>
                <option value="unguento">Ungüento</option>
                <option value="supositorio">Supositorio</option>
                <option value="inhalador">Inhalador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosis
              </label>
              <input
                type="text"
                value={nuevoMedicamento.dosis}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, dosis: e.target.value})}
                placeholder="Ej: 500mg, 10ml"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia
              </label>
              <input
                type="text"
                value={nuevoMedicamento.frecuencia}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, frecuencia: e.target.value})}
                placeholder="Ej: Cada 8 horas, 1 vez al día"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                type="text"
                value={nuevoMedicamento.duracion}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, duracion: e.target.value})}
                placeholder="Ej: 7 días, 1 mes"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vía de administración
              </label>
              <select
                value={nuevoMedicamento.via}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, via: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="oral">Oral</option>
                <option value="intramuscular">Intramuscular</option>
                <option value="intravenosa">Intravenosa</option>
                <option value="subcutanea">Subcutánea</option>
                <option value="topica">Tópica</option>
                <option value="inhalatoria">Inhalatoria</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={agregarMedicamento}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Agregar Medicamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}