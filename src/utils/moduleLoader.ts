// ============================================================================
// saludvalpa 3.0 - Cargador de Módulos por Profesión
// Sistema de lazy loading para cargar dinámicamente módulos específicos
// ============================================================================

import { TipoProfesion } from '../types';

/**
 * Interfaz que todos los módulos de profesión deben exportar
 * Define la estructura común para el sistema de lazy loading
 */
export interface ProfessionModule {
  CamposEspecificos: React.ComponentType<any>;
  DocumentosEspecificos: Record<string, React.ComponentType<any>>;
  BibliotecaEspecifica?: React.ComponentType<any>;
  hooks?: Record<string, Function>;
}

/**
 * Carga dinámicamente el módulo correspondiente a la profesión especificada
 * @param profession - La profesión para la cual cargar el módulo
 * @returns Promise con el módulo cargado
 */
export async function getProfessionModule(profession: TipoProfesion): Promise<ProfessionModule> {
  switch (profession) {
    case 'fisioterapia':
      // El módulo de fisioterapia ya está desarrollado
      return import('../modules/fisioterapia').then(module => ({
        CamposEspecificos: module.CamposFisioterapia || (() => null),
        DocumentosEspecificos: {
          evaluacion_fisioterapeutica: module.GenerarEvaluacionFisioterapeutica || (() => null),
          plan_tratamiento: module.GenerarPlanTratamiento || (() => null),
          nota_evolucion: module.GenerarNotaEvolucion || (() => null),
        },
        BibliotecaEspecifica: undefined, // Se cargará por separado si es necesario
      }));

    case 'psicologia':
      // Módulo de psicología COMPLETO - Implementado en Fase 4
      return import('../modules/psicologia').then(module => ({
        CamposEspecificos: module.CamposPsicologiaCompleto || (() => null),
        DocumentosEspecificos: {
          evaluacion_psicologica: module.EvaluacionPsicologica || (() => null),
          historia_clinica_psicologica: module.HistoriaClinicaPsicologica || (() => null),
          plan_terapeutico: module.PlanTerapeutico || (() => null),
          nota_sesion_psicologica: module.NotaSesionPsicologica || (() => null),
          informe_psicologico: module.InformePsicologico || (() => null),
        },
        hooks: {
          useEvaluacionesPsicologicas: module.useEvaluacionesPsicologicas,
          useIntervenciones: module.useIntervenciones,
          useEscalasPsicologicas: module.useEscalasPsicologicas,
        },
      }));

    case 'nutricion':
      // Módulo de nutrición COMPLETO - Implementado en Fase 5
      return import('../modules/nutricion').then(module => ({
        CamposEspecificos: module.CamposNutricionCompleto || (() => null),
        DocumentosEspecificos: {
          evaluacion_nutricional: module.EvaluacionNutricional || (() => null),
          historia_clinica_nutricional: module.HistoriaClinicaNutricional || (() => null),
          plan_nutricional: module.PlanNutricional || (() => null),
          seguimiento_nutricional: module.SeguimientoNutricional || (() => null),
          calculadora_nutricional: module.CalculadoraNutricional || (() => null),
          ficha_cliente_nutricional: module.GenerarFichaCliente || (() => null),
          instrucciones_cuidado_nutricional: module.GenerarInstruccionesCuidado || (() => null),
        },
        hooks: {
          useAlimentos: module.useAlimentos,
          usePlanesNutricionales: module.usePlanesNutricionales,
        },
      }));

    case 'medicina_general':
      // Módulo de medicina general (nuevo)
      return import('../modules/medicina').then(module => ({
        CamposEspecificos: module.CamposMedicinaGeneral || (() => null),
        DocumentosEspecificos: {
          receta_medica: module.GenerarRecetaMedica || (() => null),
          historia_clinica_medica: module.GenerarHistoriaClinicaMedica || (() => null),
          certificado_medico: module.GenerarCertificadoMedico || (() => null),
          nota_evolucion_medica: module.GenerarNotaEvolucionMedica || (() => null),
        },
      }));

    case 'odontologia':
      // Módulo de odontología (nuevo)
      return import('../modules/odontologia').then(module => ({
        CamposEspecificos: module.CamposOdontologia || (() => null),
        DocumentosEspecificos: {
          historia_clinica_odontologica: module.GenerarHistoriaClinicaOdontologica || (() => null),
          odontograma: module.GenerarOdontograma || (() => null),
          plan_tratamiento_odontologico: module.GenerarPlanTratamientoOdontologico || (() => null),
          presupuesto_odontologico: module.GenerarPresupuestoOdontologico || (() => null),
        },
      }));

    default:
      throw new Error(`Profesión no soportada: ${profession}`);
  }
}

/**
 * Obtiene los tipos de documento disponibles para una profesión específica
 * @param profession - La profesión
 * @returns Array con los tipos de documento soportados
 */
export function getDocumentTypesForProfession(profession: TipoProfesion): string[] {
  const documentTypes: Record<TipoProfesion, string[]> = {
    fisioterapia: ['evaluacion_fisioterapeutica', 'plan_tratamiento', 'nota_evolucion'],
    psicologia: ['historia_clinica_psicologica', 'nota_sesion_psicologica', 'plan_terapeutico'],
    nutricion: [
      'evaluacion_nutricional',
      'historia_clinica_nutricional',
      'plan_nutricional',
      'seguimiento_nutricional',
      'calculadora_nutricional',
      'ficha_cliente_nutricional',
      'instrucciones_cuidado_nutricional'
    ],
    medicina_general: ['receta_medica', 'historia_clinica_medica', 'certificado_medico', 'nota_evolucion_medica'],
    odontologia: ['historia_clinica_odontologica', 'odontograma', 'plan_tratamiento_odontologico', 'presupuesto_odontologico'],
  };

  return documentTypes[profession] || [];
}

/**
 * Verifica si un tipo de documento es válido para la profesión actual
 * @param profession - La profesión
 * @param documentType - El tipo de documento a verificar
 * @returns true si el tipo de documento es válido para la profesión
 */
export function isValidDocumentTypeForProfession(profession: TipoProfesion, documentType: string): boolean {
  return getDocumentTypesForProfession(profession).includes(documentType);
}

/**
 * Mapeo de nombres de componentes generadores a sus rutas de importación
 */
const COMPONENT_MAP: Record<string, () => Promise<any>> = {
  // Componentes de fisioterapia
  'GenerarEvaluacionFisioterapeutica': () => import('../modules/fisioterapia/components/GenerarEvaluacionFisioterapeutica'),
  'GenerarPlanTratamiento': () => import('../modules/fisioterapia/components/GenerarPlanTratamiento'),
  'GenerarNotaEvolucion': () => import('../modules/fisioterapia/components/GenerarNotaEvolucion'),
  
  // Componentes de psicología
  'EvaluacionPsicologica': () => import('../modules/psicologia/components/EvaluacionPsicologica'),
  'InformePsicologico': () => import('../modules/psicologia/components/InformePsicologico'),
  'PlanTerapeutico': () => import('../modules/psicologia/components/PlanTerapeutico'),
  'NotaSesionPsicologica': () => import('../modules/psicologia/components/NotaSesionPsicologica'),
  'HistoriaClinicaPsicologica': () => import('../modules/psicologia/components/HistoriaClinicaPsicologica'),
  
  // Componentes de nutrición
  'EvaluacionNutricional': () => import('../modules/nutricion/components/EvaluacionNutricional'),
  'PlanNutricional': () => import('../modules/nutricion/components/PlanNutricional'),
  'GenerarFichaCliente': () => import('../modules/nutricion/components/GenerarFichaCliente'),
  'GenerarInstruccionesCuidado': () => import('../modules/nutricion/components/GenerarInstruccionesCuidado'),
  'HistoriaClinicaNutricional': () => import('../modules/nutricion/components/HistoriaClinicaNutricional'),
  'SeguimientoNutricional': () => import('../modules/nutricion/components/SeguimientoNutricional'),
  'CalculadoraNutricional': () => import('../modules/nutricion/components/CalculadoraNutricional'),
  
  // Componentes de medicina
  'GenerarRecetaMedica': () => import('../modules/medicina/components/GenerarRecetaMedica'),
  'HistoriaClinicaMedica': () => import('../modules/medicina/components/HistoriaClinicaMedica'),
  
  // Componentes de odontología
  'HistoriaClinicaOdontologica': () => import('../modules/odontologia/documentos/GenerarHistoriaOdontologica'),
  
  // Componentes comunes
  'GenerarConsentimiento': () => import('../components/common/GenerarConsentimiento'),
  'GenerarHojaBlanco': () => import('../components/common/GenerarHojaBlanco'),
  'GenerarRecibo': () => import('../components/common/GenerarRecibo'),
};

/**
 * Carga dinámicamente un componente generador por su nombre
 * @param nombreComponente - Nombre del componente a cargar
 * @returns Promise con el componente cargado o null si no se encuentra
 */
export async function cargarComponenteGenerador(nombreComponente: string): Promise<React.ComponentType<any> | null> {
  try {
    if (!COMPONENT_MAP[nombreComponente]) {
      console.warn(`Componente generador no encontrado: ${nombreComponente}`);
      return null;
    }
    
    const module = await COMPONENT_MAP[nombreComponente]();
    // El componente es la exportación por defecto o la exportación con el mismo nombre
    const component = module.default || module[nombreComponente] || Object.values(module)[0];
    
    if (!component) {
      console.warn(`No se pudo extraer el componente de: ${nombreComponente}`);
      return null;
    }
    
    return component;
  } catch (error) {
    console.error(`Error al cargar el componente ${nombreComponente}:`, error);
    return null;
  }
}

/**
 * Resultado de la carga de un componente generador
 */
export interface ComponenteGeneradorResultado {
  success: boolean;
  componente: React.ComponentType<any> | null;
  error?: string;
  documento: { componenteGenerador: string; nombre: string };
}

/**
 * Ejecuta la generación de un documento usando el componente correspondiente
 * @param documento - Documento a generar
 * @param pacienteId - ID del paciente (opcional)
 * @returns Promise con el resultado de la carga del componente
 */
export async function ejecutarGeneracionDocumento(
  documento: { componenteGenerador: string; nombre: string },
  pacienteId?: string
): Promise<ComponenteGeneradorResultado> {
  try {
    console.log(`Cargando componente generador: ${documento.componenteGenerador} para paciente: ${pacienteId}`);
    
    const ComponenteGenerador = await cargarComponenteGenerador(documento.componenteGenerador);
    
    if (!ComponenteGenerador) {
      const errorMsg = `No se pudo cargar el componente generador: ${documento.componenteGenerador}`;
      console.error(errorMsg);
      return {
        success: false,
        componente: null,
        error: errorMsg,
        documento
      };
    }
    
    console.log(`Componente cargado exitosamente: ${documento.componenteGenerador}`);
    
    return {
      success: true,
      componente: ComponenteGenerador,
      documento
    };
  } catch (error) {
    const errorMsg = `Error al ejecutar generación de documento: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    console.error(errorMsg, error);
    return {
      success: false,
      componente: null,
      error: errorMsg,
      documento
    };
  }
}