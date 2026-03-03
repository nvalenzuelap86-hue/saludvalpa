// ============================================================================
// saludvalpa 3.0 - MÓDULO DE MEDICINA GENERAL
// Exporta todos los componentes específicos de medicina general
// ============================================================================

// Componentes de campos médicos
import CamposMedicina from './components/CamposMedicina';
import HistoriaClinicaMedica from './components/HistoriaClinicaMedica';
import PrescripcionMedica from './components/PrescripcionMedica';
import GenerarRecetaMedica from './components/GenerarRecetaMedica';

// Hooks personalizados
import useMedicamentos from './hooks/useMedicamentos';
import useDiagnosticos from './hooks/useDiagnosticos';
import useEstudios from './hooks/useEstudios';
import useMedicalHistory from './hooks/useMedicalHistory';
import usePrescriptions from './hooks/usePrescriptions';
import useClinicalExams from './hooks/useClinicalExams';
import useDiagnoses from './hooks/useDiagnoses';

// Datos precargados
import medicamentosPrecargados from './data/medicamentosPrecargados';
import diagnosticosCIE10 from './data/diagnosticosCIE10';
import estudiosLaboratorio from './data/estudiosLaboratorio';

// Generadores de PDF
import { medicalPrescriptionGenerator } from './pdf/generators/MedicalPrescriptionGenerator';
import { medicalReferralLetterGenerator } from './pdf/generators/MedicalReferralLetterGenerator';
import { medicalCertificateGenerator } from './pdf/generators/MedicalCertificateGenerator';

// Exportar componentes principales
export { CamposMedicina, HistoriaClinicaMedica, PrescripcionMedica, GenerarRecetaMedica };

// Exportar hooks
export {
  useMedicamentos,
  useDiagnosticos,
  useEstudios,
  useMedicalHistory,
  usePrescriptions,
  useClinicalExams,
  useDiagnoses
};

// Exportar datos precargados
export { medicamentosPrecargados, diagnosticosCIE10, estudiosLaboratorio };

// Exportar generadores de PDF
export {
  medicalPrescriptionGenerator,
  medicalReferralLetterGenerator,
  medicalCertificateGenerator
};

// Alias para compatibilidad con el sistema existente
export const CamposMedicinaGeneral = CamposMedicina;
export const GenerarHistoriaClinicaMedica = () => null; // En desarrollo
export const GenerarCertificadoMedico = () => null; // En desarrollo
export const GenerarNotaEvolucionMedica = () => null; // En desarrollo

// Exportar tipos
export type {
  DatosMedicinaGeneral,
  MedicamentoPrescrito,
  HistoriaClinicaMedicaCompleta,
  NotaSOAP,
  DiagnosticoCIE10,
  MedicamentoPrescritoDetallado,
  EstudioSolicitado,
  SignosVitales,
  ExamenFisicoCompleto,
  TratamientoCompleto,
  TipoAntecedente,
  ViaAdministracion,
  FrecuenciaMedicacion,
  UnidadDosis
} from '../../types';