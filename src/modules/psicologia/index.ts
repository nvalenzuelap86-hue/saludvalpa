// ============================================================================
// saludvalpa 3.0 - MÓDULO DE PSICOLOGÍA COMPLETO
// Exporta todos los componentes específicos de psicología
// ============================================================================

// Componentes principales
export { default as EvaluacionPsicologica } from './components/EvaluacionPsicologica';
export { default as HistoriaClinicaPsicologica } from './components/HistoriaClinicaPsicologica';
export { default as PlanTerapeutico } from './components/PlanTerapeutico';
export { default as NotaSesionPsicologica } from './components/NotaSesionPsicologica';
export { default as InformePsicologico } from './components/InformePsicologico';

// Hooks (importados como default)
import useEvaluacionesPsicologicas from './hooks/useEvaluacionesPsicologicas';
import useIntervenciones from './hooks/useIntervenciones';
import useEscalasPsicologicas from './hooks/useEscalasPsicologicas';

// Datos precargados
export { escalasPsicologicas } from './data/escalasPsicologicas';
export { intervencionesTerapeuticas } from './data/intervencionesTerapeuticas';
export { diagnosticosDSM5 } from './data/diagnosticosDSM5';

// Componente principal que integra todos los subcomponentes
// Importamos el componente existente de CamposPsicologia
import CamposPsicologia from '../../components/CamposPsicologia';

// Re-exportamos el componente existente como CamposPsicologiaCompleto
// En una implementación futura, esto podría ser un componente más complejo
// que integre todos los subcomponentes de psicología
export const CamposPsicologiaCompleto = CamposPsicologia;

// Funciones de generación de documentos
export const GenerarEvaluacionPsicologica = () => {
  // Función para generar documentos PDF de evaluación psicológica
  return null;
};

export const GenerarPlanTerapeutico = () => {
  // Función para generar documentos PDF de plan terapéutico
  return null;
};

export const SeguimientoSintomas = () => {
  // Componente para seguimiento de síntomas y escalas psicológicas
  return null;
};

// Re-exportar hooks
export { useEvaluacionesPsicologicas, useIntervenciones, useEscalasPsicologicas };

// Tipo para el módulo de psicología
export type PsicologiaModule = {
  CamposPsicologiaCompleto: React.ComponentType;
  GenerarEvaluacionPsicologica: () => React.ReactElement;
  GenerarPlanTerapeutico: () => React.ReactElement;
  SeguimientoSintomas: () => React.ReactElement;
};