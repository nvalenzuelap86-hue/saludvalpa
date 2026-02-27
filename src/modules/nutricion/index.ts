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

// Hooks para gestión de datos
import useAlimentos from './hooks/useAlimentos';
import usePlanesNutricionales from './hooks/usePlanesNutricionales';

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

// Exportaciones individuales
export { default as EvaluacionNutricional } from './components/EvaluacionNutricional';
export { default as HistoriaClinicaNutricional } from './components/HistoriaClinicaNutricional';
export { default as PlanNutricional } from './components/PlanNutricional';
export { default as SeguimientoNutricional } from './components/SeguimientoNutricional';
export { default as CalculadoraNutricional } from './components/CalculadoraNutricional';
export { default as GenerarFichaCliente } from './components/GenerarFichaCliente';
export { default as GenerarInstruccionesCuidado } from './components/GenerarInstruccionesCuidado';

export { default as useAlimentos } from './hooks/useAlimentos';
export { default as usePlanesNutricionales } from './hooks/usePlanesNutricionales';

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
  };
  hooks: {
    useAlimentos: typeof useAlimentos;
    usePlanesNutricionales: typeof usePlanesNutricionales;
  };
  datos: {
    alimentos: typeof alimentosNutricionales;
    planes: typeof planesNutricionales;
    requerimientos: typeof requerimientosNutricionales;
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
    CamposNutricionCompleto
  },
  hooks: {
    useAlimentos,
    usePlanesNutricionales
  },
  datos: {
    alimentos: alimentosNutricionales,
    planes: planesNutricionales,
    requerimientos: requerimientosNutricionales
  }
};

export default moduloNutricion;
