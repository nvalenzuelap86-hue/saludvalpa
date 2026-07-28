// ============================================================================
// saludvalpa 3.0 - EDITOR DE PLAN DE ALIMENTACIÓN
// Formulario para crear/editar planes de alimentación
// Soporta modo Simple (lista plana) y Semanal (cuadrícula de 7 días)
// ============================================================================

import { useState, useEffect } from 'react';
import type { PlanAlimentacion, ComidaEnPlan, ComidaPrecargada, ComidaEnDia, DiaSemana } from '../../../types/nutricion';
import { buscarComidasPorCategoria, buscarComidasPorNombre } from '../data/comidasPrecargadas';
import PlanSemanal from './PlanSemanal';

interface EditorPlanAlimentacionProps {
  plan?: PlanAlimentacion;
  onGuardar: (nombre: string, descripcion: string, objetivo: PlanAlimentacion['objetivo'], opciones?: {
    pacienteId?: string;
    esPlantilla?: boolean;
    requerimientos?: PlanAlimentacion['requerimientos'];
    distribucionComidas?: PlanAlimentacion['distribucionComidas'];
    comidasPorDia?: ComidaEnDia[];
    recomendaciones?: string[];
  }) => void;
  onCancelar: () => void;
}

const OBJETIVOS: { value: PlanAlimentacion['objetivo']; label: string }[] = [
  { value: 'perder_peso', label: 'Pérdida de peso' },
  { value: 'ganar_musculo', label: 'Ganancia muscular' },
  { value: 'mantener', label: 'Mantenimiento' },
  { value: 'control_enfermedad', label: 'Control de enfermedad' },
  { value: 'rendimiento', label: 'Rendimiento deportivo' },
];

const TIPOS_COMIDA: { key: ComidaEnPlan['tipo']; label: string; icon: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { key: 'colacion1', label: 'Colación matutina', icon: '🍎' },
  { key: 'comida', label: 'Comida', icon: '🍽️' },
  { key: 'colacion2', label: 'Colación vespertina', icon: '🥜' },
  { key: 'cena', label: 'Cena', icon: '🌙' },
];

export default function EditorPlanAlimentacion({ plan, onGuardar, onCancelar }: EditorPlanAlimentacionProps) {
  const [nombre, setNombre] = useState(plan?.nombre || '');
  const [descripcion, setDescripcion] = useState(plan?.descripcion || '');
  const [objetivo, setObjetivo] = useState<PlanAlimentacion['objetivo']>(plan?.objetivo || 'mantener');
  const [esPlantilla, setEsPlantilla] = useState(plan?.esPlantilla || false);
  const [calorias, setCalorias] = useState(plan?.requerimientos.calorias || 0);
  const [proteinas, setProteinas] = useState(plan?.requerimientos.proteinas || 0);
  const [carbohidratos, setCarbohidratos] = useState(plan?.requerimientos.carbohidratos || 0);
  const [grasas, setGrasas] = useState(plan?.requerimientos.grasas || 0);
  const [recomendaciones, setRecomendaciones] = useState<string[]>(plan?.recomendaciones || []);
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  // Modo de edición: Simple (lista plana) vs Semanal (cuadrícula de 7 días)
  const [modoSemanal, setModoSemanal] = useState(!!plan?.comidasPorDia);

  // Distribución de comidas (modo Simple)
  const [distribucion, setDistribucion] = useState<PlanAlimentacion['distribucionComidas']>(
    plan?.distribucionComidas || {
      desayuno: [],
      colacion1: [],
      comida: [],
      colacion2: [],
      cena: [],
    }
  );

  // Comidas por día (modo Semanal)
  const [comidasPorDia, setComidasPorDia] = useState<ComidaEnDia[]>(
    plan?.comidasPorDia || []
  );

  // Búsqueda de comidas precargadas
  const [busquedaComida, setBusquedaComida] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<ComidaPrecargada[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<ComidaEnPlan['tipo']>('desayuno');

  // Buscar comidas precargadas
  useEffect(() => {
    if (busquedaComida.trim().length >= 2) {
      const resultados = buscarComidasPorNombre(busquedaComida);
      setResultadosBusqueda(resultados.slice(0, 10));
    } else {
      setResultadosBusqueda([]);
    }
  }, [busquedaComida]);

  const agregarRecomendacion = () => {
    if (nuevaRecomendacion.trim()) {
      setRecomendaciones([...recomendaciones, nuevaRecomendacion.trim()]);
      setNuevaRecomendacion('');
    }
  };

  const eliminarRecomendacion = (idx: number) => {
    setRecomendaciones(recomendaciones.filter((_, i) => i !== idx));
  };

  const agregarComidaPrecargada = (comida: ComidaPrecargada) => {
    const nuevaComida: ComidaEnPlan = {
      id: crypto.randomUUID(),
      comidaPrecargadaId: comida.id,
      nombre: comida.nombre,
      tipo: tipoSeleccionado,
      horario: obtenerHorarioPorDefecto(tipoSeleccionado),
      ingredientes: comida.ingredientes,
      porcion: `${comida.porciones} porción(es)`,
      porcionMultiplicador: 1,
      nutrientes: {
        calorias: comida.nutrientes.calorias,
        proteinas: comida.nutrientes.proteinas,
        carbohidratos: comida.nutrientes.carbohidratos,
        grasas: comida.nutrientes.grasas,
        fibra: comida.nutrientes.fibra,
      },
      orden: distribucion[tipoSeleccionado].length,
    };

    setDistribucion({
      ...distribucion,
      [tipoSeleccionado]: [...distribucion[tipoSeleccionado], nuevaComida],
    });
    setBusquedaComida('');
    setResultadosBusqueda([]);
  };

  const eliminarComida = (tipo: ComidaEnPlan['tipo'], comidaId: string) => {
    setDistribucion({
      ...distribucion,
      [tipo]: distribucion[tipo].filter(c => c.id !== comidaId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const opciones: Parameters<typeof onGuardar>[3] = {
      esPlantilla,
      requerimientos: { calorias, proteinas, carbohidratos, grasas },
      recomendaciones,
    };

    if (modoSemanal) {
      opciones.comidasPorDia = comidasPorDia;
      // Keep distribucionComidas for backward compatibility
      opciones.distribucionComidas = distribucion;
    } else {
      opciones.distribucionComidas = distribucion;
    }

    onGuardar(nombre.trim(), descripcion.trim(), objetivo, opciones);
  };

  const totalComidas = modoSemanal
    ? comidasPorDia.reduce((sum, d) => sum + d.comidas.length, 0)
    : Object.values(distribucion).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del plan *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Plan de pérdida de peso - Juan"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del plan..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
          <select
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value as PlanAlimentacion['objetivo'])}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {OBJETIVOS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={esPlantilla}
              onChange={(e) => setEsPlantilla(e.target.checked)}
              className="rounded"
            />
            Usar como plantilla
          </label>
        </div>
      </div>

      {/* Requerimientos calóricos */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">Requerimientos nutricionales</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calorías (kcal)</label>
            <input
              type="number"
              value={calorias || ''}
              onChange={(e) => setCalorias(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g)</label>
            <input
              type="number"
              value={proteinas || ''}
              onChange={(e) => setProteinas(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carbohidratos (g)</label>
            <input
              type="number"
              value={carbohidratos || ''}
              onChange={(e) => setCarbohidratos(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grasas (g)</label>
            <input
              type="number"
              value={grasas || ''}
              onChange={(e) => setGrasas(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Toggle de modo: Simple / Semanal */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Modo de edición:</span>
            <span className="ml-2 text-sm text-gray-500">
              {modoSemanal ? '📅 Plan semanal (Lun-Dom)' : '📋 Lista simple de comidas'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setModoSemanal(!modoSemanal)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              modoSemanal ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                modoSemanal ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {modoSemanal
            ? 'Planifica las comidas de cada día de la semana con una cuadrícula visual'
            : 'Agrega comidas en una lista plana organizada por tipo (desayuno, comida, cena)'}
        </p>
      </div>

      {/* Distribución de comidas - Modo Simple */}
      {!modoSemanal && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-gray-800">Comidas ({totalComidas})</h4>
          </div>

          {/* Selector de tipo y búsqueda */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {TIPOS_COMIDA.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTipoSeleccionado(key)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    tipoSeleccionado === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={busquedaComida}
                onChange={(e) => setBusquedaComida(e.target.value)}
                placeholder={`Buscar comidas precargadas para ${TIPOS_COMIDA.find(t => t.key === tipoSeleccionado)?.label.toLowerCase()}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {resultadosBusqueda.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {resultadosBusqueda.map((comida) => (
                    <button
                      key={comida.id}
                      type="button"
                      onClick={() => agregarComidaPrecargada(comida)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium">{comida.nombre}</div>
                      <div className="text-xs text-gray-500">
                        {comida.nutrientes.calorias} kcal • {comida.tiempoPreparacion || '?'} min
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lista de comidas por tipo */}
          <div className="space-y-4">
            {TIPOS_COMIDA.map(({ key, label, icon }) => (
              <div key={key} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 rounded-t-lg border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{icon} {label}</span>
                  <span className="text-xs text-gray-500 ml-2">({distribucion[key].length} comidas)</span>
                </div>
                {distribucion[key].length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {distribucion[key].map((comida) => (
                      <div key={comida.id} className="px-4 py-2 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{comida.nombre}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {comida.nutrientes.calorias} kcal • {comida.porcion}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarComida(key, comida.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    Sin comidas agregadas
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribución de comidas - Modo Semanal */}
      {modoSemanal && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-gray-800">
              📅 Plan Semanal ({totalComidas} comida{totalComidas !== 1 ? 's' : ''})
            </h4>
          </div>
          <PlanSemanal
            comidasPorDia={comidasPorDia}
            onChange={setComidasPorDia}
          />
        </div>
      )}

      {/* Recomendaciones */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">Recomendaciones</h4>
        {recomendaciones.length > 0 && (
          <div className="space-y-1 mb-2">
            {recomendaciones.map((rec, idx) => (
              <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-1.5 rounded">
                <span className="text-sm">{rec}</span>
                <button
                  type="button"
                  onClick={() => eliminarRecomendacion(idx)}
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
            value={nuevaRecomendacion}
            onChange={(e) => setNuevaRecomendacion(e.target.value)}
            placeholder="Agregar recomendación..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarRecomendacion())}
          />
          <button
            type="button"
            onClick={agregarRecomendacion}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!nombre.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {plan ? 'Actualizar plan' : 'Crear plan'}
        </button>
      </div>
    </form>
  );
}

function obtenerHorarioPorDefecto(tipo: ComidaEnPlan['tipo']): string {
  const horarios: Record<ComidaEnPlan['tipo'], string> = {
    desayuno: '07:00 - 08:00',
    colacion1: '10:00 - 10:30',
    comida: '13:00 - 14:00',
    colacion2: '16:30 - 17:00',
    cena: '19:30 - 20:30',
  };
  return horarios[tipo];
}
