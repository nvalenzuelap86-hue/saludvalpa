// ============================================================================
// saludvalpa 3.0 - CAMPOS NUTRICIÓN SOAP
// Nota SOAP (Subjective, Objective, Assessment, Plan) para sesiones de nutrición
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { DatosNutricion } from '../../../types';

// ----------------------------------------------------------------------------
// INTERFACES
// ----------------------------------------------------------------------------

interface SignosVitales {
  paSistolica: number;
  paDiastolica: number;
  fc: number;
  fr: number;
  temperatura: number;
  spo2: number;
}

interface Antropometria {
  peso: number;
  talla: number;
  imc: number;
  circunferenciaCintura: number;
  circunferenciaCadera: number;
  relacionCinturaCadera: number;
  porcentajeGrasa: number;
  porcentajeMusculo: number;
}

interface DiagnosticoNutricional {
  diagnostico: string;
  cie10: string;
  interpretacion: string;
  riesgos: string[];
}

interface PlanNutricionalSOAP {
  objetivo: string;
  requerimientos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
    fibra: number;
  };
  tipoDieta: string;
  recomendaciones: string[];
  proximaCita: string;
  notasAdicionales: string;
}

interface DatosNutricionSOAP {
  subjetivo: {
    motivoConsulta: string;
    historiaEnfermedad: string;
    sintomasGI: string[];
    cambiosApetito: string;
    cambiosPeso: number;
    medicamentosActuales: string;
    actividadFisica: string;
  };
  objetivo: {
    signosVitales: SignosVitales;
    antropometria: Antropometria;
    composicionCorporal: {
      disponible: boolean;
      porcentajeGrasa: number;
      porcentajeMusculo: number;
    };
    examenFisico: string;
  };
  evaluacion: DiagnosticoNutricional;
  plan: PlanNutricionalSOAP;
}

interface CamposNutricionSOAPProps {
  datos: any;
  onChange: (datos: any) => void;
}

// ----------------------------------------------------------------------------
// CONSTANTES
// ----------------------------------------------------------------------------

const SINTOMAS_GASTROINTESTINALES = [
  { value: 'nausea', label: 'Náusea' },
  { value: 'vomito', label: 'Vómito' },
  { value: 'diarrea', label: 'Diarrea' },
  { value: 'estrenimiento', label: 'Estreñimiento' },
  { value: 'distension_abdominal', label: 'Distensión abdominal' },
  { value: 'acidez', label: 'Acidez' },
  { value: 'dolor_abdominal', label: 'Dolor abdominal' },
];

const OPCIONES_APETITO = [
  { value: 'normal', label: 'Normal' },
  { value: 'aumentado', label: 'Aumentado' },
  { value: 'disminuido', label: 'Disminuido' },
];

const DIAGNOSTICOS_NUTRICIONALES = [
  { value: 'desnutricion', label: 'Desnutrición' },
  { value: 'sobrepeso', label: 'Sobrepeso' },
  { value: 'obesidad_grado1', label: 'Obesidad Grado 1' },
  { value: 'obesidad_grado2', label: 'Obesidad Grado 2' },
  { value: 'obesidad_grado3', label: 'Obesidad Grado 3' },
  { value: 'riesgo_metabolico', label: 'Riesgo metabólico' },
  { value: 'trastorno_alimenticio', label: 'Trastorno alimenticio' },
  { value: 'deficiencia_nutricional', label: 'Deficiencia nutricional' },
  { value: 'otro', label: 'Otro' },
];

const RIESGOS_IDENTIFICADOS = [
  { value: 'riesgo_cardiovascular', label: 'Riesgo cardiovascular' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'hipertension', label: 'Hipertensión' },
  { value: 'dislipidemia', label: 'Dislipidemia' },
  { value: 'osteoporosis', label: 'Osteoporosis' },
  { value: 'anemia', label: 'Anemia' },
];

const OBJETIVOS_PLAN = [
  { value: 'perder_peso', label: 'Perder peso' },
  { value: 'ganar_musculo', label: 'Ganar músculo' },
  { value: 'mantener', label: 'Mantener peso' },
  { value: 'control_enfermedad', label: 'Control de enfermedad' },
  { value: 'rendimiento', label: 'Rendimiento deportivo' },
];

const TIPOS_DIETA = [
  { value: 'normocalorica', label: 'Normocalórica' },
  { value: 'hipocalorica', label: 'Hipocalórica' },
  { value: 'hipercalorica', label: 'Hipercalórica' },
  { value: 'hipoproteica', label: 'Hipoproteica' },
  { value: 'hiperproteica', label: 'Hiperproteica' },
  { value: 'hipoglucemica', label: 'Hipoglucémica' },
  { value: 'dash', label: 'DASH' },
  { value: 'mediterranea', label: 'Mediterránea' },
  { value: 'vegetariana', label: 'Vegetariana' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'cetogenica', label: 'Cetogénica' },
];

// ----------------------------------------------------------------------------
// ESTADO INICIAL
// ----------------------------------------------------------------------------

const estadoInicial = (datos: any): DatosNutricionSOAP => ({
  subjetivo: {
    motivoConsulta: datos?.subjetivo?.motivoConsulta || '',
    historiaEnfermedad: datos?.subjetivo?.historiaEnfermedad || '',
    sintomasGI: datos?.subjetivo?.sintomasGI || [],
    cambiosApetito: datos?.subjetivo?.cambiosApetito || '',
    cambiosPeso: datos?.subjetivo?.cambiosPeso || 0,
    medicamentosActuales: datos?.subjetivo?.medicamentosActuales || '',
    actividadFisica: datos?.subjetivo?.actividadFisica || '',
  },
  objetivo: {
    signosVitales: datos?.objetivo?.signosVitales || {
      paSistolica: 0,
      paDiastolica: 0,
      fc: 0,
      fr: 0,
      temperatura: 0,
      spo2: 0,
    },
    antropometria: datos?.objetivo?.antropometria || {
      peso: 0,
      talla: 0,
      imc: 0,
      circunferenciaCintura: 0,
      circunferenciaCadera: 0,
      relacionCinturaCadera: 0,
      porcentajeGrasa: 0,
      porcentajeMusculo: 0,
    },
    composicionCorporal: datos?.objetivo?.composicionCorporal || {
      disponible: false,
      porcentajeGrasa: 0,
      porcentajeMusculo: 0,
    },
    examenFisico: datos?.objetivo?.examenFisico || '',
  },
  evaluacion: datos?.evaluacion || {
    diagnostico: '',
    cie10: '',
    interpretacion: '',
    riesgos: [],
  },
  plan: datos?.plan || {
    objetivo: '',
    requerimientos: {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0,
    },
    tipoDieta: '',
    recomendaciones: [],
    proximaCita: '',
    notasAdicionales: '',
  },
});

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------------

export default function CamposNutricionSOAP({ datos, onChange }: CamposNutricionSOAPProps) {
  const [formData, setFormData] = useState<DatosNutricionSOAP>(estadoInicial(datos));
  const [nuevaRecomendacion, setNuevaRecomendacion] = useState('');

  // Calcular IMC automáticamente
  useEffect(() => {
    const { peso, talla } = formData.objetivo.antropometria;
    if (peso > 0 && talla > 0) {
      const tallaMetros = talla / 100;
      const imcCalculado = peso / (tallaMetros * tallaMetros);
      setFormData(prev => ({
        ...prev,
        objetivo: {
          ...prev.objetivo,
          antropometria: {
            ...prev.objetivo.antropometria,
            imc: parseFloat(imcCalculado.toFixed(1)),
          },
        },
      }));
    }
  }, [formData.objetivo.antropometria.peso, formData.objetivo.antropometria.talla]);

  // Calcular relación cintura-cadera automáticamente
  useEffect(() => {
    const { circunferenciaCintura, circunferenciaCadera } = formData.objetivo.antropometria;
    if (circunferenciaCintura > 0 && circunferenciaCadera > 0) {
      const relacion = circunferenciaCintura / circunferenciaCadera;
      setFormData(prev => ({
        ...prev,
        objetivo: {
          ...prev.objetivo,
          antropometria: {
            ...prev.objetivo.antropometria,
            relacionCinturaCadera: parseFloat(relacion.toFixed(2)),
          },
        },
      }));
    }
  }, [formData.objetivo.antropometria.circunferenciaCintura, formData.objetivo.antropometria.circunferenciaCadera]);

  // Sincronizar con el padre
  useEffect(() => {
    onChange({
      ...datos,
      soapNutricion: formData,
    });
  }, [formData]);

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  const actualizarSubjetivo = useCallback((campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      subjetivo: { ...prev.subjetivo, [campo]: valor },
    }));
  }, []);

  const actualizarSignosVitales = useCallback((campo: keyof SignosVitales, valor: number) => {
    setFormData(prev => ({
      ...prev,
      objetivo: {
        ...prev.objetivo,
        signosVitales: { ...prev.objetivo.signosVitales, [campo]: valor },
      },
    }));
  }, []);

  const actualizarAntropometria = useCallback((campo: keyof Antropometria, valor: number) => {
    setFormData(prev => ({
      ...prev,
      objetivo: {
        ...prev.objetivo,
        antropometria: { ...prev.objetivo.antropometria, [campo]: valor },
      },
    }));
  }, []);

  const toggleSintoma = useCallback((sintoma: string) => {
    setFormData(prev => {
      const sintomas = prev.subjetivo.sintomasGI.includes(sintoma)
        ? prev.subjetivo.sintomasGI.filter(s => s !== sintoma)
        : [...prev.subjetivo.sintomasGI, sintoma];
      return { ...prev, subjetivo: { ...prev.subjetivo, sintomasGI: sintomas } };
    });
  }, []);

  const toggleRiesgo = useCallback((riesgo: string) => {
    setFormData(prev => {
      const riesgos = prev.evaluacion.riesgos.includes(riesgo)
        ? prev.evaluacion.riesgos.filter(r => r !== riesgo)
        : [...prev.evaluacion.riesgos, riesgo];
      return { ...prev, evaluacion: { ...prev.evaluacion, riesgos } };
    });
  }, []);

  const agregarRecomendacion = useCallback(() => {
    if (!nuevaRecomendacion.trim()) return;
    setFormData(prev => ({
      ...prev,
      plan: {
        ...prev.plan,
        recomendaciones: [...prev.plan.recomendaciones, nuevaRecomendacion.trim()],
      },
    }));
    setNuevaRecomendacion('');
  }, [nuevaRecomendacion]);

  const eliminarRecomendacion = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      plan: {
        ...prev.plan,
        recomendaciones: prev.plan.recomendaciones.filter((_, i) => i !== index),
      },
    }));
  }, []);

  const actualizarRequerimiento = useCallback((campo: string, valor: number) => {
    setFormData(prev => ({
      ...prev,
      plan: {
        ...prev.plan,
        requerimientos: { ...prev.plan.requerimientos, [campo]: valor },
      },
    }));
  }, []);

  // --------------------------------------------------------------------------
  // RENDER: SECCIÓN SUBJETIVO (S)
  // --------------------------------------------------------------------------

  const renderSubjetivo = () => (
    <div className="mb-8">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center gap-2">
        <span className="text-lg font-bold">S</span>
        <span className="font-semibold">Subjetivo</span>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-4">
        {/* Motivo de consulta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de consulta
          </label>
          <textarea
            value={formData.subjetivo.motivoConsulta}
            onChange={(e) => actualizarSubjetivo('motivoConsulta', e.target.value)}
            placeholder="Describa el motivo principal de la consulta..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>

        {/* Historia de la enfermedad actual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Historia de la enfermedad actual
          </label>
          <textarea
            value={formData.subjetivo.historiaEnfermedad}
            onChange={(e) => actualizarSubjetivo('historiaEnfermedad', e.target.value)}
            placeholder="Describa la evolución del padecimiento actual..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>

        {/* Síntomas gastrointestinales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Síntomas gastrointestinales
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {SINTOMAS_GASTROINTESTINALES.map((sintoma) => (
              <label
                key={sintoma.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                  formData.subjetivo.sintomasGI.includes(sintoma.value)
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.subjetivo.sintomasGI.includes(sintoma.value)}
                  onChange={() => toggleSintoma(sintoma.value)}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  formData.subjetivo.sintomasGI.includes(sintoma.value)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300'
                }`}>
                  {formData.subjetivo.sintomasGI.includes(sintoma.value) ? '✓' : ''}
                </span>
                {sintoma.label}
              </label>
            ))}
          </div>
        </div>

        {/* Cambios en el apetito y peso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cambios en el apetito
            </label>
            <select
              value={formData.subjetivo.cambiosApetito}
              onChange={(e) => actualizarSubjetivo('cambiosApetito', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
            >
              <option value="">Seleccionar...</option>
              {OPCIONES_APETITO.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cambios en el peso reciente (kg)
            </label>
            <input
              type="number"
              value={formData.subjetivo.cambiosPeso || ''}
              onChange={(e) => actualizarSubjetivo('cambiosPeso', parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
            />
          </div>
        </div>

        {/* Medicamentos actuales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicamentos actuales
          </label>
          <textarea
            value={formData.subjetivo.medicamentosActuales}
            onChange={(e) => actualizarSubjetivo('medicamentosActuales', e.target.value)}
            placeholder="Liste los medicamentos que el paciente toma actualmente (dosis y frecuencia)..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>

        {/* Actividad física */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actividad física
          </label>
          <textarea
            value={formData.subjetivo.actividadFisica}
            onChange={(e) => actualizarSubjetivo('actividadFisica', e.target.value)}
            placeholder="Describa el tipo, frecuencia e intensidad de actividad física..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // RENDER: SECCIÓN OBJETIVO (O)
  // --------------------------------------------------------------------------

  const renderObjetivo = () => (
    <div className="mb-8">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg flex items-center gap-2">
        <span className="text-lg font-bold">O</span>
        <span className="font-semibold">Objetivo</span>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-4">
        {/* Signos vitales */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🩺</span> Signos vitales
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">PA Sistólica (mmHg)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.paSistolica || ''}
                onChange={(e) => actualizarSignosVitales('paSistolica', parseInt(e.target.value) || 0)}
                placeholder="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">PA Diastólica (mmHg)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.paDiastolica || ''}
                onChange={(e) => actualizarSignosVitales('paDiastolica', parseInt(e.target.value) || 0)}
                placeholder="80"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">FC (lpm)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.fc || ''}
                onChange={(e) => actualizarSignosVitales('fc', parseInt(e.target.value) || 0)}
                placeholder="72"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">FR (rpm)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.fr || ''}
                onChange={(e) => actualizarSignosVitales('fr', parseInt(e.target.value) || 0)}
                placeholder="16"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Temperatura (°C)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.temperatura || ''}
                onChange={(e) => actualizarSignosVitales('temperatura', parseFloat(e.target.value) || 0)}
                placeholder="36.5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SpO₂ (%)</label>
              <input
                type="number"
                value={formData.objetivo.signosVitales.spo2 || ''}
                onChange={(e) => actualizarSignosVitales('spo2', parseInt(e.target.value) || 0)}
                placeholder="98"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Antropometría */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📏</span> Antropometría
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Peso (kg)</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.peso || ''}
                onChange={(e) => actualizarAntropometria('peso', parseFloat(e.target.value) || 0)}
                placeholder="70.0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Talla (cm)</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.talla || ''}
                onChange={(e) => actualizarAntropometria('talla', parseFloat(e.target.value) || 0)}
                placeholder="165"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">IMC (calculado)</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.imc || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Circ. cintura (cm)</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.circunferenciaCintura || ''}
                onChange={(e) => actualizarAntropometria('circunferenciaCintura', parseFloat(e.target.value) || 0)}
                placeholder="80"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Circ. cadera (cm)</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.circunferenciaCadera || ''}
                onChange={(e) => actualizarAntropometria('circunferenciaCadera', parseFloat(e.target.value) || 0)}
                placeholder="95"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Relación cintura-cadera</label>
              <input
                type="number"
                value={formData.objetivo.antropometria.relacionCinturaCadera || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Composición corporal */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>⚖️</span> Composición corporal
          </h4>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.objetivo.composicionCorporal.disponible}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    objetivo: {
                      ...prev.objetivo,
                      composicionCorporal: {
                        ...prev.objetivo.composicionCorporal,
                        disponible: e.target.checked,
                      },
                    },
                  }))
                }
                className="rounded border-gray-300 text-saludvalpa-blue focus:ring-saludvalpa-blue"
              />
              <span>Datos de composición corporal disponibles</span>
            </label>
          </div>
          {formData.objetivo.composicionCorporal.disponible && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">% Grasa corporal</label>
                <input
                  type="number"
                  value={formData.objetivo.composicionCorporal.porcentajeGrasa || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      objetivo: {
                        ...prev.objetivo,
                        composicionCorporal: {
                          ...prev.objetivo.composicionCorporal,
                          porcentajeGrasa: parseFloat(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                  placeholder="25.0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">% Músculo</label>
                <input
                  type="number"
                  value={formData.objetivo.composicionCorporal.porcentajeMusculo || ''}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      objetivo: {
                        ...prev.objetivo,
                        composicionCorporal: {
                          ...prev.objetivo.composicionCorporal,
                          porcentajeMusculo: parseFloat(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                  placeholder="35.0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Examen físico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Examen físico relevante
          </label>
          <textarea
            value={formData.objetivo.examenFisico}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                objetivo: { ...prev.objetivo, examenFisico: e.target.value },
              }))
            }
            placeholder="Describa hallazgos del examen físico relevantes para la evaluación nutricional..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // RENDER: SECCIÓN EVALUACIÓN (A)
  // --------------------------------------------------------------------------

  const renderEvaluacion = () => (
    <div className="mb-8">
      {/* Header */}
      <div className="bg-amber-600 text-white px-4 py-3 rounded-t-lg flex items-center gap-2">
        <span className="text-lg font-bold">A</span>
        <span className="font-semibold">Evaluación (Assessment)</span>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-4">
        {/* Diagnóstico nutricional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnóstico nutricional
            </label>
            <select
              value={formData.evaluacion.diagnostico}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  evaluacion: { ...prev.evaluacion, diagnostico: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
            >
              <option value="">Seleccionar diagnóstico...</option>
              {DIAGNOSTICOS_NUTRICIONALES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código CIE-10 <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={formData.evaluacion.cie10}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  evaluacion: { ...prev.evaluacion, cie10: e.target.value },
                }))
              }
              placeholder="Ej: E66.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
            />
          </div>
        </div>

        {/* Interpretación de indicadores */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interpretación de indicadores
          </label>
          <textarea
            value={formData.evaluacion.interpretacion}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                evaluacion: { ...prev.evaluacion, interpretacion: e.target.value },
              }))
            }
            placeholder="Interprete los indicadores antropométricos, bioquímicos y clínicos..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>

        {/* Riesgos identificados */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Riesgos identificados
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {RIESGOS_IDENTIFICADOS.map((riesgo) => (
              <label
                key={riesgo.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                  formData.evaluacion.riesgos.includes(riesgo.value)
                    ? 'bg-amber-50 border-amber-400 text-amber-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.evaluacion.riesgos.includes(riesgo.value)}
                  onChange={() => toggleRiesgo(riesgo.value)}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  formData.evaluacion.riesgos.includes(riesgo.value)
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-gray-300'
                }`}>
                  {formData.evaluacion.riesgos.includes(riesgo.value) ? '✓' : ''}
                </span>
                {riesgo.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // RENDER: SECCIÓN PLAN (P)
  // --------------------------------------------------------------------------

  const renderPlan = () => (
    <div className="mb-8">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex items-center gap-2">
        <span className="text-lg font-bold">P</span>
        <span className="font-semibold">Plan</span>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-4">
        {/* Objetivo del plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo del plan nutricional
          </label>
          <select
            value={formData.plan.objetivo}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                plan: { ...prev.plan, objetivo: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          >
            <option value="">Seleccionar objetivo...</option>
            {OBJETIVOS_PLAN.map((obj) => (
              <option key={obj.value} value={obj.value}>{obj.label}</option>
            ))}
          </select>
        </div>

        {/* Requerimientos */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Requerimientos nutricionales</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Calorías (kcal)</label>
              <input
                type="number"
                value={formData.plan.requerimientos.calorias || ''}
                onChange={(e) => actualizarRequerimiento('calorias', parseInt(e.target.value) || 0)}
                placeholder="2000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Proteínas (g)</label>
              <input
                type="number"
                value={formData.plan.requerimientos.proteinas || ''}
                onChange={(e) => actualizarRequerimiento('proteinas', parseInt(e.target.value) || 0)}
                placeholder="75"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Carbohidratos (g)</label>
              <input
                type="number"
                value={formData.plan.requerimientos.carbohidratos || ''}
                onChange={(e) => actualizarRequerimiento('carbohidratos', parseInt(e.target.value) || 0)}
                placeholder="250"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Grasas (g)</label>
              <input
                type="number"
                value={formData.plan.requerimientos.grasas || ''}
                onChange={(e) => actualizarRequerimiento('grasas', parseInt(e.target.value) || 0)}
                placeholder="65"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fibra (g)</label>
              <input
                type="number"
                value={formData.plan.requerimientos.fibra || ''}
                onChange={(e) => actualizarRequerimiento('fibra', parseInt(e.target.value) || 0)}
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tipo de dieta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de dieta
          </label>
          <select
            value={formData.plan.tipoDieta}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                plan: { ...prev.plan, tipoDieta: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          >
            <option value="">Seleccionar tipo de dieta...</option>
            {TIPOS_DIETA.map((dieta) => (
              <option key={dieta.value} value={dieta.value}>{dieta.label}</option>
            ))}
          </select>
        </div>

        {/* Recomendaciones específicas (dynamic list) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recomendaciones específicas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevaRecomendacion}
              onChange={(e) => setNuevaRecomendacion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarRecomendacion())}
              placeholder="Escriba una recomendación..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
            />
            <button
              type="button"
              onClick={agregarRecomendacion}
              disabled={!nuevaRecomendacion.trim()}
              className="px-4 py-2 bg-saludvalpa-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              + Agregar
            </button>
          </div>
          {formData.plan.recomendaciones.length > 0 ? (
            <ul className="space-y-1">
              {formData.plan.recomendaciones.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  <span>{rec}</span>
                  <button
                    type="button"
                    onClick={() => eliminarRecomendacion(index)}
                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                    title="Eliminar recomendación"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No hay recomendaciones agregadas.</p>
          )}
        </div>

        {/* Próxima cita */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Próxima cita
          </label>
          <input
            type="date"
            value={formData.plan.proximaCita}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                plan: { ...prev.plan, proximaCita: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            value={formData.plan.notasAdicionales}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                plan: { ...prev.plan, notasAdicionales: e.target.value },
              }))
            }
            placeholder="Cualquier nota adicional relevante para el plan nutricional..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue text-sm"
          />
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------------------------

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-400 mb-4 px-1">
        Nota SOAP - Subjetivo / Objetivo / Evaluación / Plan
      </div>

      {renderSubjetivo()}
      {renderObjetivo()}
      {renderEvaluacion()}
      {renderPlan()}
    </div>
  );
}
