// ============================================================================
// saludvalpa 3.0 - MÓDULO DE MEDICINA GENERAL
// Exporta todos los componentes específicos de medicina general
// ============================================================================

// Componentes de campos médicos
import CamposMedicina from './components/CamposMedicina';
import HistoriaClinicaMedica from './components/HistoriaClinicaMedica';
import PrescripcionMedica from './components/PrescripcionMedica';

// Hooks personalizados
import useMedicamentos from './hooks/useMedicamentos';
import useDiagnosticos from './hooks/useDiagnosticos';
import useEstudios from './hooks/useEstudios';

// Datos precargados
import medicamentosPrecargados from './data/medicamentosPrecargados';
import diagnosticosCIE10 from './data/diagnosticosCIE10';
import estudiosLaboratorio from './data/estudiosLaboratorio';

// Exportar componentes principales
export { CamposMedicina, HistoriaClinicaMedica, PrescripcionMedica };

// Exportar hooks
export { useMedicamentos, useDiagnosticos, useEstudios };

// Exportar datos precargados
export { medicamentosPrecargados, diagnosticosCIE10, estudiosLaboratorio };

// Alias para compatibilidad con el sistema existente
export const CamposMedicinaGeneral = CamposMedicina;
export const GenerarRecetaMedica = () => null; // En desarrollo
export const GenerarHistoriaClinicaMedica = () => null; // En desarrollo
export const GenerarCertificadoMedico = () => null; // En desarrollo
export const GenerarNotaEvolucionMedica = () => null; // En desarrollo

// Exportar tipos
export type { DatosMedicinaGeneral, MedicamentoPrescrito } from '../../types';