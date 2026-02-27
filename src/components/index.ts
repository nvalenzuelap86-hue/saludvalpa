// ============================================================================
// saludvalpa 3.0 - COMPONENTS EXPORTS
// ============================================================================

// Layout y protección
export { default as Layout } from './Layout';
export { default as RequireSetup } from './RequireSetup';

// Componentes UI compartidos
export { default as Button } from './shared/Button';
export { default as Card } from './shared/Card';
export { default as Input } from './shared/Input';
export { default as Modal } from './shared/Modal';
export { default as FirmaDigital } from './shared/FirmaDigital';

// Componentes generales
export { default as FormularioPaciente } from './FormularioPaciente';
export { default as TarjetaPaciente } from './TarjetaPaciente';
export { default as SelectorPaciente } from './SelectorPaciente';
export { default as Calendario } from './Calendario';
export { default as FormularioCita } from './FormularioCita';
export { default as SesionEnVivo } from './SesionEnVivo';

// Campos específicos de profesiones (estos quedan aquí temporalmente)
export { default as CamposPsicologia } from './CamposPsicologia';
export { default as CamposManicurista } from './CamposManicurista';

// Economía
export { default as GestionServicios } from './GestionServicios';
export { default as GestionCotizaciones } from './GestionCotizaciones';
export { default as GestionRecibos } from './GestionRecibos';
export { default as ReportesFinancieros } from './ReportesFinancieros';

// Documentos comunes (todas las profesiones)
export { default as GenerarRecibo } from './common/GenerarRecibo';
export { default as GenerarConsentimiento } from './common/GenerarConsentimiento';
export { default as GenerarHojaBlanco } from './common/GenerarHojaBlanco';
export { default as VisorPDF } from './common/VisorPDF';

// Re-exportar módulos de profesiones
export { 
  GenerarEvaluacionFisioterapeutica,
  GenerarPlanTratamiento,
  GenerarNotaEvolucion,
  CamposFisioterapia,
} from '../modules/fisioterapia';

export {
  GenerarFichaCliente,
  GenerarInstruccionesCuidado,
} from '../modules/nutricion';
