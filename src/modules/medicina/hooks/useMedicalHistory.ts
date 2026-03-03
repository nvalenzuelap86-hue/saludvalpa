// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE HISTORIA CLÍNICA MÉDICA
// Hook personalizado para gestionar historias clínicas médicas completas
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import type { 
  HistoriaClinicaMedicaCompleta, 
  AntecedenteMedico, 
  AlergiaMedica,
  MedicamentoActual,
  DiagnosticoCIE10 
} from '../../../types';

interface UseMedicalHistoryReturn {
  // Estado
  historiaClinica: HistoriaClinicaMedicaCompleta | null;
  historiasPaciente: HistoriaClinicaMedicaCompleta[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  cargarHistoriaClinica: (pacienteId: string) => Promise<void>;
  crearHistoriaClinica: (historia: Omit<HistoriaClinicaMedicaCompleta, 'id' | 'metadata'>) => Promise<string>;
  actualizarHistoriaClinica: (id: string, actualizaciones: Partial<HistoriaClinicaMedicaCompleta>) => Promise<void>;
  agregarAntecedente: (pacienteId: string, antecedente: AntecedenteMedico) => Promise<void>;
  agregarAlergia: (pacienteId: string, alergia: AlergiaMedica) => Promise<void>;
  agregarMedicamentoActual: (pacienteId: string, medicamento: MedicamentoActual) => Promise<void>;
  agregarDiagnostico: (pacienteId: string, diagnostico: DiagnosticoCIE10) => Promise<void>;
  obtenerHistorialCompleto: (pacienteId: string) => Promise<HistoriaClinicaMedicaCompleta[]>;
  buscarPorDiagnostico: (codigoCIE10: string) => Promise<HistoriaClinicaMedicaCompleta[]>;
}

export default function useMedicalHistory(): UseMedicalHistoryReturn {
  const [historiaClinica, setHistoriaClinica] = useState<HistoriaClinicaMedicaCompleta | null>(null);
  const [historiasPaciente, setHistoriasPaciente] = useState<HistoriaClinicaMedicaCompleta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarHistoriaClinica = useCallback(async (pacienteId: string) => {
    try {
      setCargando(true);
      setError(null);

      // Buscar la historia clínica más reciente del paciente
      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaActualizacion');

      if (historias.length > 0) {
        const historiaMasReciente = historias[historias.length - 1];
        setHistoriaClinica(historiaMasReciente);
        setHistoriasPaciente(historias);
      } else {
        setHistoriaClinica(null);
        setHistoriasPaciente([]);
      }
    } catch (err) {
      setError('Error al cargar historia clínica');
      console.error('Error cargando historia clínica:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearHistoriaClinica = useCallback(async (historiaData: Omit<HistoriaClinicaMedicaCompleta, 'id' | 'metadata'>): Promise<string> => {
    try {
      setCargando(true);
      setError(null);

      const ahora = new Date();
      const historiaCompleta: HistoriaClinicaMedicaCompleta = {
        ...historiaData,
        id: crypto.randomUUID(),
        metadata: {
          fechaCreacion: ahora,
          fechaActualizacion: ahora,
          version: 1,
        },
      };

      await db.historiasClinicasMedicas.add(historiaCompleta);
      setHistoriaClinica(historiaCompleta);
      
      return historiaCompleta.id;
    } catch (err) {
      setError('Error al crear historia clínica');
      console.error('Error creando historia clínica:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarHistoriaClinica = useCallback(async (id: string, actualizaciones: Partial<HistoriaClinicaMedicaCompleta>) => {
    try {
      setCargando(true);
      setError(null);

      const historiaExistente = await db.historiasClinicasMedicas.get(id);
      if (!historiaExistente) {
        throw new Error('Historia clínica no encontrada');
      }

      const updateData = {
        ...actualizaciones,
        metadata: {
          ...historiaExistente.metadata,
          ...actualizaciones.metadata,
          fechaActualizacion: new Date(),
          version: (historiaExistente.metadata.version || 1) + 1,
        },
      };

      await db.historiasClinicasMedicas.update(id, updateData);
      
      if (historiaClinica?.id === id) {
        const historiaActualizada = { ...historiaExistente, ...updateData };
        setHistoriaClinica(historiaActualizada);
      }
    } catch (err) {
      setError('Error al actualizar historia clínica');
      console.error('Error actualizando historia clínica:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [historiaClinica]);

  const agregarAntecedente = useCallback(async (pacienteId: string, antecedente: AntecedenteMedico) => {
    try {
      setCargando(true);
      setError(null);

      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaActualizacion');

      if (historias.length === 0) {
        throw new Error('No existe historia clínica para este paciente');
      }

      const historiaActual = historias[historias.length - 1];
      const antecedentesActualizados = [...historiaActual.antecedentes.personales, antecedente];

      await actualizarHistoriaClinica(historiaActual.id, {
        antecedentes: {
          ...historiaActual.antecedentes,
          personales: antecedentesActualizados,
        },
      });
    } catch (err) {
      setError('Error al agregar antecedente');
      console.error('Error agregando antecedente:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarHistoriaClinica]);

  const agregarAlergia = useCallback(async (pacienteId: string, alergia: AlergiaMedica) => {
    try {
      setCargando(true);
      setError(null);

      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaActualizacion');

      if (historias.length === 0) {
        throw new Error('No existe historia clínica para este paciente');
      }

      const historiaActual = historias[historias.length - 1];
      const alergiasActualizadas = [...historiaActual.antecedentes.alergicos, alergia];

      await actualizarHistoriaClinica(historiaActual.id, {
        antecedentes: {
          ...historiaActual.antecedentes,
          alergicos: alergiasActualizadas,
        },
      });
    } catch (err) {
      setError('Error al agregar alergia');
      console.error('Error agregando alergia:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarHistoriaClinica]);

  const agregarMedicamentoActual = useCallback(async (pacienteId: string, medicamento: MedicamentoActual) => {
    try {
      setCargando(true);
      setError(null);

      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaActualizacion');

      if (historias.length === 0) {
        throw new Error('No existe historia clínica para este paciente');
      }

      const historiaActual = historias[historias.length - 1];
      const medicamentosActualizados = [...historiaActual.medicamentosActuales, medicamento];

      await actualizarHistoriaClinica(historiaActual.id, {
        medicamentosActuales: medicamentosActualizados,
      });
    } catch (err) {
      setError('Error al agregar medicamento actual');
      console.error('Error agregando medicamento actual:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarHistoriaClinica]);

  const agregarDiagnostico = useCallback(async (pacienteId: string, diagnostico: DiagnosticoCIE10) => {
    try {
      setCargando(true);
      setError(null);

      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaActualizacion');

      if (historias.length === 0) {
        throw new Error('No existe historia clínica para este paciente');
      }

      const historiaActual = historias[historias.length - 1];
      const diagnosticosActualizados = [...historiaActual.diagnosticosActivos, diagnostico];

      await actualizarHistoriaClinica(historiaActual.id, {
        diagnosticosActivos: diagnosticosActualizados,
      });
    } catch (err) {
      setError('Error al agregar diagnóstico');
      console.error('Error agregando diagnóstico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarHistoriaClinica]);

  const obtenerHistorialCompleto = useCallback(async (pacienteId: string): Promise<HistoriaClinicaMedicaCompleta[]> => {
    try {
      setCargando(true);
      setError(null);

      const historias = await db.historiasClinicasMedicas
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('metadata.fechaCreacion');

      return historias;
    } catch (err) {
      setError('Error al obtener historial completo');
      console.error('Error obteniendo historial completo:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarPorDiagnostico = useCallback(async (codigoCIE10: string): Promise<HistoriaClinicaMedicaCompleta[]> => {
    try {
      setCargando(true);
      setError(null);

      // Esta es una búsqueda simple; en producción se necesitaría un índice mejor
      const todasHistorias = await db.historiasClinicasMedicas.toArray();
      const historiasFiltradas = todasHistorias.filter(historia =>
        historia.diagnosticosActivos.some(d => d.codigo === codigoCIE10)
      );

      return historiasFiltradas;
    } catch (err) {
      setError('Error al buscar por diagnóstico');
      console.error('Error buscando por diagnóstico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    // Estado
    historiaClinica,
    historiasPaciente,
    cargando,
    error,
    
    // Acciones
    cargarHistoriaClinica,
    crearHistoriaClinica,
    actualizarHistoriaClinica,
    agregarAntecedente,
    agregarAlergia,
    agregarMedicamentoActual,
    agregarDiagnostico,
    obtenerHistorialCompleto,
    buscarPorDiagnostico,
  };
}