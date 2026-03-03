import { useState } from 'react';
import type { DatosMedicinaGeneral } from '../../../types';

interface HistoriaClinicaMedicaProps {
  datos?: DatosMedicinaGeneral;
  onChange: (datos: DatosMedicinaGeneral) => void;
}

const defaultDatos: DatosMedicinaGeneral = {
  diagnostico: [],
  tratamiento: {
    medicamentos: [],
    indicaciones: [],
    estudiosSolicitados: [],
    interconsultas: [],
  },
  recomendaciones: [],
};

export default function HistoriaClinicaMedica({ datos = defaultDatos, onChange }: HistoriaClinicaMedicaProps) {
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [enfermedadActual, setEnfermedadActual] = useState('');
  const [revisionPorSistemas, setRevisionPorSistemas] = useState('');

  // Safe datos access - ensure datos is never undefined
  const safeDatos = datos || defaultDatos;

  const handleChange = (campo: keyof DatosMedicinaGeneral, valor: any) => {
    onChange({
      ...safeDatos,
      [campo]: valor,
    });
  };

  const handleAntecedentesChange = (tipo: keyof NonNullable<DatosMedicinaGeneral['antecedentesPersonales']>, valor: string[]) => {
    const antecedentesActuales = safeDatos.antecedentesPersonales || {
      patologicos: [],
      quirurgicos: [],
      alergicos: [],
      toxicos: [],
      ginecologicos: [],
    };
    
    handleChange('antecedentesPersonales', {
      ...antecedentesActuales,
      [tipo]: valor,
    });
  };

  const handleExploracionChange = (sistema: keyof NonNullable<DatosMedicinaGeneral['exploracionFisica']>, valor: string) => {
    const exploracionActual = safeDatos.exploracionFisica || {
      cabezaCuello: '',
      torax: '',
      abdomen: '',
      extremidades: '',
      neurologico: '',
    };
    
    handleChange('exploracionFisica', {
      ...exploracionActual,
      [sistema]: valor,
    });
  };

  const agregarAntecedente = (tipo: keyof NonNullable<DatosMedicinaGeneral['antecedentesPersonales']>, valor: string) => {
    if (!valor.trim()) return;
    
    const antecedentesActuales = safeDatos.antecedentesPersonales || {
      patologicos: [],
      quirurgicos: [],
      alergicos: [],
      toxicos: [],
      ginecologicos: [],
    };
    
    const listaActual = antecedentesActuales[tipo] || [];
    handleAntecedentesChange(tipo, [...listaActual, valor.trim()]);
  };

  const eliminarAntecedente = (tipo: keyof NonNullable<DatosMedicinaGeneral['antecedentesPersonales']>, indice: number) => {
    const antecedentesActuales = safeDatos.antecedentesPersonales || {
      patologicos: [],
      quirurgicos: [],
      alergicos: [],
      toxicos: [],
      ginecologicos: [],
    };
    
    const listaActual = antecedentesActuales[tipo] || [];
    const nuevaLista = listaActual.filter((_, idx) => idx !== indice);
    handleAntecedentesChange(tipo, nuevaLista);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Historia Clínica Médica</h2>
        <p className="text-gray-600 mt-1">Registro completo según metodología SOAP</p>
      </div>

      {/* Sección S - Subjetivo */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">S - Subjetivo</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Consulta
            </label>
            <textarea
              value={motivoConsulta}
              onChange={(e) => setMotivoConsulta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describa el motivo principal de la consulta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enfermedad Actual (HPI)
            </label>
            <textarea
              value={enfermedadActual}
              onChange={(e) => setEnfermedadActual(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Incluya: inicio, localización, duración, características, factores agravantes/mejorantes, tratamientos previos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revisión por Sistemas
            </label>
            <textarea
              value={revisionPorSistemas}
              onChange={(e) => setRevisionPorSistemas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Sistema cardiovascular, respiratorio, gastrointestinal, genitourinario, musculoesquelético, neurológico, etc..."
            />
          </div>
        </div>
      </div>

      {/* Sección O - Objetivo (Antecedentes Personales) */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">O - Objetivo: Antecedentes Personales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Antecedentes Patológicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antecedentes Patológicos
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Hipertensión, Diabetes..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      agregarAntecedente('patologicos', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Patológicos"]') as HTMLInputElement;
                    if (input) {
                      agregarAntecedente('patologicos', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-1">
                {(safeDatos.antecedentesPersonales?.patologicos || []).map((antecedente, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm">{antecedente}</span>
                    <button
                      type="button"
                      onClick={() => eliminarAntecedente('patologicos', idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Antecedentes Quirúrgicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antecedentes Quirúrgicos
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Apendicectomía 2018..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      agregarAntecedente('quirurgicos', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Quirúrgicos"]') as HTMLInputElement;
                    if (input) {
                      agregarAntecedente('quirurgicos', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-1">
                {(safeDatos.antecedentesPersonales?.quirurgicos || []).map((antecedente, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm">{antecedente}</span>
                    <button
                      type="button"
                      onClick={() => eliminarAntecedente('quirurgicos', idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Antecedentes Alérgicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antecedentes Alérgicos
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Penicilina, Ibuprofeno..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      agregarAntecedente('alergicos', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Alérgicos"]') as HTMLInputElement;
                    if (input) {
                      agregarAntecedente('alergicos', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-1">
                {(safeDatos.antecedentesPersonales?.alergicos || []).map((antecedente, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm">{antecedente}</span>
                    <button
                      type="button"
                      onClick={() => eliminarAntecedente('alergicos', idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Antecedentes Tóxicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antecedentes Tóxicos
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Tabaco 10 cig/día, Alcohol ocasional..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      agregarAntecedente('toxicos', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Tóxicos"]') as HTMLInputElement;
                    if (input) {
                      agregarAntecedente('toxicos', input.value);
                      input.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-1">
                {(safeDatos.antecedentesPersonales?.toxicos || []).map((antecedente, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm">{antecedente}</span>
                    <button
                      type="button"
                      onClick={() => eliminarAntecedente('toxicos', idx)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección O - Objetivo (Exploración Física) */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">O - Objetivo: Exploración Física</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabeza y Cuello
            </label>
            <textarea
              value={safeDatos.exploracionFisica?.cabezaCuello || ''}
              onChange={(e) => handleExploracionChange('cabezaCuello', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
              placeholder="Inspección, palpación, movilidad, ganglios, tiroides..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tórax
            </label>
            <textarea
              value={safeDatos.exploracionFisica?.torax || ''}
              onChange={(e) => handleExploracionChange('torax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
              placeholder="Auscultación cardiopulmonar, percusión, palpación..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abdomen
            </label>
            <textarea
              value={safeDatos.exploracionFisica?.abdomen || ''}
              onChange={(e) => handleExploracionChange('abdomen', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
              placeholder="Inspección, auscultación, percusión, palpación, signos de irritación peritoneal..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extremidades
            </label>
            <textarea
              value={safeDatos.exploracionFisica?.extremidades || ''}
              onChange={(e) => handleExploracionChange('extremidades', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
              placeholder="Inspección, movilidad, fuerza, reflejos, pulsos periféricos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Examen Neurológico
            </label>
            <textarea
              value={safeDatos.exploracionFisica?.neurologico || ''}
              onChange={(e) => handleExploracionChange('neurologico', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
              placeholder="Estado mental, pares craneales, fuerza muscular, sensibilidad, reflejos, coordinación..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}