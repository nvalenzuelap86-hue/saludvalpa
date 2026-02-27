import { useState } from 'react';
import type { DatosMedicinaGeneral, MedicamentoPrescrito } from '../../../types';

interface PrescripcionMedicaProps {
  datos: DatosMedicinaGeneral;
  onChange: (datos: DatosMedicinaGeneral) => void;
}

export default function PrescripcionMedica({ datos, onChange }: PrescripcionMedicaProps) {
  const [nuevoMedicamento, setNuevoMedicamento] = useState<MedicamentoPrescrito>({
    nombre: '',
    presentacion: 'tabletas',
    dosis: '',
    frecuencia: '',
    duracion: '',
    via: 'oral',
    indicacionesEspeciales: '',
  });

  const handleChange = (campo: keyof DatosMedicinaGeneral, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const handleTratamientoChange = (campo: keyof DatosMedicinaGeneral['tratamiento'], valor: any) => {
    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };
    
    handleChange('tratamiento', {
      ...tratamientoActual,
      [campo]: valor,
    });
  };

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.nombre.trim() || !nuevoMedicamento.dosis.trim() || !nuevoMedicamento.frecuencia.trim()) {
      return;
    }

    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };

    const medicamentosActualizados = [...tratamientoActual.medicamentos, { ...nuevoMedicamento }];
    
    handleTratamientoChange('medicamentos', medicamentosActualizados);
    
    // Reset form
    setNuevoMedicamento({
      nombre: '',
      presentacion: 'tabletas',
      dosis: '',
      frecuencia: '',
      duracion: '',
      via: 'oral',
      indicacionesEspeciales: '',
    });
  };

  const eliminarMedicamento = (indice: number) => {
    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };

    const medicamentosActualizados = tratamientoActual.medicamentos.filter((_, idx) => idx !== indice);
    handleTratamientoChange('medicamentos', medicamentosActualizados);
  };

  const actualizarMedicamento = (indice: number, campo: keyof MedicamentoPrescrito, valor: string) => {
    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };

    const medicamentosActualizados = [...tratamientoActual.medicamentos];
    medicamentosActualizados[indice] = {
      ...medicamentosActualizados[indice],
      [campo]: valor,
    };

    handleTratamientoChange('medicamentos', medicamentosActualizados);
  };

  const agregarIndicacion = () => {
    const input = document.getElementById('nueva-indicacion') as HTMLInputElement;
    if (!input || !input.value.trim()) return;

    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };

    const indicacionesActualizadas = [...tratamientoActual.indicaciones, input.value.trim()];
    handleTratamientoChange('indicaciones', indicacionesActualizadas);
    input.value = '';
  };

  const eliminarIndicacion = (indice: number) => {
    const tratamientoActual = datos.tratamiento || {
      medicamentos: [],
      indicaciones: [],
      estudiosSolicitados: [],
      interconsultas: [],
    };

    const indicacionesActualizadas = tratamientoActual.indicaciones.filter((_, idx) => idx !== indice);
    handleTratamientoChange('indicaciones', indicacionesActualizadas);
  };

  const presentaciones = [
    'tabletas', 'cápsulas', 'jarabe', 'suspensión', 'crema', 'ungüento', 'pomada',
    'inyección', 'ampolla', 'supositorio', 'óvulo', 'colirio', 'gotas', 'spray'
  ];

  const viasAdministracion = [
    'oral', 'sublingual', 'intramuscular', 'intravenosa', 'subcutánea', 'tópica',
    'oftálmica', 'ótica', 'nasal', 'inhalatoria', 'rectal', 'vaginal'
  ];

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Prescripción Médica</h2>
        <p className="text-gray-600 mt-1">Gestión de medicamentos y tratamiento farmacológico</p>
      </div>

      {/* Formulario para agregar nuevo medicamento */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Agregar Nuevo Medicamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Medicamento *
            </label>
            <input
              type="text"
              value={nuevoMedicamento.nombre}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ej: Amoxicilina, Ibuprofeno..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presentación
            </label>
            <select
              value={nuevoMedicamento.presentacion}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, presentacion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {presentaciones.map((pres) => (
                <option key={pres} value={pres}>
                  {pres.charAt(0).toUpperCase() + pres.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosis *
            </label>
            <input
              type="text"
              value={nuevoMedicamento.dosis}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ej: 500mg, 10ml..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia *
            </label>
            <input
              type="text"
              value={nuevoMedicamento.frecuencia}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ej: Cada 8 horas, 1 vez al día..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración
            </label>
            <input
              type="text"
              value={nuevoMedicamento.duracion}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, duracion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Ej: 7 días, 10 días..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vía de Administración
            </label>
            <select
              value={nuevoMedicamento.via}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, via: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {viasAdministracion.map((via) => (
                <option key={via} value={via}>
                  {via.charAt(0).toUpperCase() + via.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Indicaciones Especiales
          </label>
          <textarea
            value={nuevoMedicamento.indicacionesEspeciales || ''}
            onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, indicacionesEspeciales: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={2}
            placeholder="Ej: Tomar con alimentos, Evitar exposición al sol..."
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={agregarMedicamento}
            disabled={!nuevoMedicamento.nombre.trim() || !nuevoMedicamento.dosis.trim() || !nuevoMedicamento.frecuencia.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Medicamento
          </button>
        </div>
      </div>

      {/* Lista de medicamentos prescritos */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Medicamentos Prescritos</h3>
        
        {(!datos.tratamiento?.medicamentos || datos.tratamiento.medicamentos.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay medicamentos prescritos aún.</p>
            <p className="text-sm mt-1">Agrega medicamentos usando el formulario superior.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {datos.tratamiento.medicamentos.map((medicamento, idx) => (
              <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{medicamento.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      {medicamento.dosis} • {medicamento.presentacion} • {medicamento.via}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarMedicamento(idx)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Frecuencia</label>
                    <input
                      type="text"
                      value={medicamento.frecuencia}
                      onChange={(e) => actualizarMedicamento(idx, 'frecuencia', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duración</label>
                    <input
                      type="text"
                      value={medicamento.duracion}
                      onChange={(e) => actualizarMedicamento(idx, 'duracion', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Indicaciones</label>
                    <input
                      type="text"
                      value={medicamento.indicacionesEspeciales || ''}
                      onChange={(e) => actualizarMedicamento(idx, 'indicacionesEspeciales', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Indicaciones especiales..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicaciones generales del tratamiento */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Indicaciones Generales del Tratamiento</h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              id="nueva-indicacion"
              type="text"
              placeholder="Ej: Reposo relativo, Dieta blanda, Control de signos vitales..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  agregarIndicacion();
                }
              }}
            />
            <button
              type="button"
              onClick={agregarIndicacion}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Agregar
            </button>
          </div>
          
          <div className="space-y-2">
            {(datos.tratamiento?.indicaciones || []).map((indicacion, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{indicacion}</span>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarIndicacion(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de la prescripción */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Resumen de la Prescripción</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Medicamentos ({datos.tratamiento?.medicamentos?.length || 0})</h4>
            <ul className="space-y-1">
              {(datos.tratamiento?.medicamentos || []).map((med, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  • {med.nombre} - {med.dosis} {med.presentacion}, {med.frecuencia} ({med.duracion})
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Indicaciones ({datos.tratamiento?.indicaciones?.length || 0})</h4>
            <ul className="space-y-1">
              {(datos.tratamiento?.indicaciones || []).map((ind, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  • {ind}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total de medicamentos: <span className="font-semibold">{datos.tratamiento?.medicamentos?.length || 0}</span></p>
              <p className="text-sm text-gray-600">Total de indicaciones: <span className="font-semibold">{datos.tratamiento?.indicaciones?.length || 0}</span></p>
            </div>
            <button
              type="button"
              onClick={() => {
                // Función para generar receta (se implementará más adelante)
                alert('Función de generación de receta médica en desarrollo');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Generar Receta Médica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}