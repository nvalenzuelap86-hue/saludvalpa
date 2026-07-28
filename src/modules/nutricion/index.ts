// ============================================================================
// saludvalpa 3.0 - MÓDULO DE NUTRICIÓN COMPLETO
// Exporta todos los componentes, hooks y datos del módulo de nutrición
// ============================================================================

// Componentes principales
import EvaluacionNutricional from './components/EvaluacionNutricional';
import HistoriaClinicaNutricional from './components/HistoriaClinicaNutricional';
import PlanNutricional from './components/PlanNutricional';
import SeguimientoNutricional from './components/SeguimientoNutricional';
import CalculadoraNutricional from './components/CalculadoraNutricional';

// Generadores de documentos PDF
import GenerarFichaCliente from './components/GenerarFichaCliente';
import GenerarInstruccionesCuidado from './components/GenerarInstruccionesCuidado';
import { generarPDFPlanAlimentacion } from './components/generadorPDFPlanAlimentacion';

// Nuevos componentes de planes de alimentación
import GestionPlanesAlimentacion from './components/GestionPlanesAlimentacion';
import EditorPlanAlimentacion from './components/EditorPlanAlimentacion';
import PlanAlimentacionPaciente from './components/PlanAlimentacionPaciente';
import TarjetaPlan from './components/TarjetaPlan';
import SelectorComidas from './components/SelectorComidas';
import PlanSemanal from './components/PlanSemanal';
import EditorPDFPlanAlimentacion from './components/EditorPDFPlanAlimentacion';

// Hooks para gestión de datos
import useAlimentos from './hooks/useAlimentos';
import usePlanesNutricionales from './hooks/usePlanesNutricionales';
import { usePlanesAlimentacion } from './hooks/usePlanesAlimentacion';

// Datos precargados
import { 
  alimentosNutricionales,
  buscarAlimentosPorCategoria,
  buscarAlimentosPorNombre,
  calcularNutrientesTotales,
  obtenerAlimentoPorId,
  obtenerAlimentosPorAlergeno,
  obtenerAlimentosBajoIndiceGlucemico,
  obtenerAlimentosRicosEnNutriente
} from './data/alimentosNutricionales';

import {
  planesNutricionales,
  buscarPlanesPorObjetivo,
  obtenerPlanPorId,
  calcularMacronutrientesEnGramos,
  adaptarPlanParaPaciente
} from './data/planesNutricionales';

import {
  requerimientosNutricionales,
  obtenerRequerimientoPorEdadSexo,
  calcularRequerimientosPersonalizados,
  calcularRequerimientosMicronutrientes,
  obtenerRecomendacionesEspeciales
} from './data/requerimientosNutricionales';

import {
  comidasPrecargadas,
  buscarComidasPorCategoria,
  buscarComidasPorNombre,
  obtenerComidaPorId,
  obtenerComidasAptasPara,
  obtenerComidasSinAlergeno,
  obtenerTotalComidasPrecargadas,
  obtenerResumenCategorias
} from './data/comidasPrecargadas';

// Exportaciones individuales
export { default as EvaluacionNutricional } from './components/EvaluacionNutricional';
export { default as HistoriaClinicaNutricional } from './components/HistoriaClinicaNutricional';
export { default as PlanNutricional } from './components/PlanNutricional';
export { default as SeguimientoNutricional } from './components/SeguimientoNutricional';
export { default as CalculadoraNutricional } from './components/CalculadoraNutricional';
export { default as GenerarFichaCliente } from './components/GenerarFichaCliente';
export { default as GenerarInstruccionesCuidado } from './components/GenerarInstruccionesCuidado';
export { generarPDFPlanAlimentacion } from './components/generadorPDFPlanAlimentacion';

// Nuevos componentes de planes de alimentación
export { default as GestionPlanesAlimentacion } from './components/GestionPlanesAlimentacion';
export { default as EditorPlanAlimentacion } from './components/EditorPlanAlimentacion';
export { default as PlanAlimentacionPaciente } from './components/PlanAlimentacionPaciente';
export { default as TarjetaPlan } from './components/TarjetaPlan';
export { default as SelectorComidas } from './components/SelectorComidas';
export { default as PlanSemanal } from './components/PlanSemanal';

export { default as useAlimentos } from './hooks/useAlimentos';
export { default as usePlanesNutricionales } from './hooks/usePlanesNutricionales';
export { usePlanesAlimentacion } from './hooks/usePlanesAlimentacion';

export { 
  alimentosNutricionales,
  buscarAlimentosPorCategoria,
  buscarAlimentosPorNombre,
  calcularNutrientesTotales,
  obtenerAlimentoPorId,
  obtenerAlimentosPorAlergeno,
  obtenerAlimentosBajoIndiceGlucemico,
  obtenerAlimentosRicosEnNutriente
};

export {
  planesNutricionales,
  buscarPlanesPorObjetivo,
  obtenerPlanPorId,
  calcularMacronutrientesEnGramos,
  adaptarPlanParaPaciente
};

export {
  requerimientosNutricionales,
  obtenerRequerimientoPorEdadSexo,
  calcularRequerimientosPersonalizados,
  calcularRequerimientosMicronutrientes,
  obtenerRecomendacionesEspeciales
};

export {
  comidasPrecargadas,
  buscarComidasPorCategoria,
  buscarComidasPorNombre,
  obtenerComidaPorId,
  obtenerComidasAptasPara,
  obtenerComidasSinAlergeno,
  obtenerTotalComidasPrecargadas,
  obtenerResumenCategorias
};

// Componente principal de campos para formularios
export const CamposNutricionCompleto = () => {
  // Este componente puede ser usado como contenedor para todos los formularios de nutrición
  // En una implementación real, esto podría ser un componente que renderiza todos los formularios
  return null;
};

// Interfaz para el módulo de nutrición
export interface ModuloNutricion {
  componentes: {
    EvaluacionNutricional: typeof EvaluacionNutricional;
    HistoriaClinicaNutricional: typeof HistoriaClinicaNutricional;
    PlanNutricional: typeof PlanNutricional;
    SeguimientoNutricional: typeof SeguimientoNutricional;
    CalculadoraNutricional: typeof CalculadoraNutricional;
    GenerarFichaCliente: typeof GenerarFichaCliente;
    GenerarInstruccionesCuidado: typeof GenerarInstruccionesCuidado;
    CamposNutricionCompleto: typeof CamposNutricionCompleto;
    GestionPlanesAlimentacion: typeof GestionPlanesAlimentacion;
    EditorPlanAlimentacion: typeof EditorPlanAlimentacion;
    PlanAlimentacionPaciente: typeof PlanAlimentacionPaciente;
    TarjetaPlan: typeof TarjetaPlan;
    SelectorComidas: typeof SelectorComidas;
    PlanSemanal: typeof PlanSemanal;
    EditorPDFPlanAlimentacion: typeof EditorPDFPlanAlimentacion;
  };
  generadores: {
    generarPDFPlanAlimentacion: typeof generarPDFPlanAlimentacion;
  };
  hooks: {
    useAlimentos: typeof useAlimentos;
    usePlanesNutricionales: typeof usePlanesNutricionales;
    usePlanesAlimentacion: typeof usePlanesAlimentacion;
  };
  datos: {
    alimentos: typeof alimentosNutricionales;
    planes: typeof planesNutricionales;
    requerimientos: typeof requerimientosNutricionales;
    comidasPrecargadas: typeof comidasPrecargadas;
  };
}

// Exportación del módulo completo
const moduloNutricion: ModuloNutricion = {
  componentes: {
    EvaluacionNutricional,
    HistoriaClinicaNutricional,
    PlanNutricional,
    SeguimientoNutricional,
    CalculadoraNutricional,
    GenerarFichaCliente,
    GenerarInstruccionesCuidado,
    CamposNutricionCompleto,
    GestionPlanesAlimentacion,
    EditorPlanAlimentacion,
    PlanAlimentacionPaciente,
    TarjetaPlan,
    SelectorComidas,
    PlanSemanal,
    EditorPDFPlanAlimentacion,
  },
  generadores: {
    generarPDFPlanAlimentacion,
  },
  hooks: {
    useAlimentos,
    usePlanesNutricionales,
    usePlanesAlimentacion,
  },
  datos: {
    alimentos: alimentosNutricionales,
    planes: planesNutricionales,
    requerimientos: requerimientosNutricionales,
    comidasPrecargadas,
  }
};

export default moduloNutricion;
