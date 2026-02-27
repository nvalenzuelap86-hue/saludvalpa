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