// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE MEDICAMENTOS
// Hook personalizado para gestionar medicamentos y prescripciones
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { MedicamentoPrescrito } from '../../../types';

interface UseMedicamentosReturn {
  // Estado
  medicamentos: MedicamentoPrescrito[];
  medicamentosPrecargados: MedicamentoPrescrito[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  agregarMedicamento: (medicamento: MedicamentoPrescrito) => Promise<void>;
  eliminarMedicamento: (indice: number) => Promise<void>;
  actualizarMedicamento: (indice: number, medicamento: MedicamentoPrescrito) => Promise<void>;
  buscarMedicamentos: (termino: string) => MedicamentoPrescrito[];
  cargarMedicamentosPrecargados: () => Promise<void>;
  guardarPrescripcion: (pacienteId: string, medicamentos: MedicamentoPrescrito[]) => Promise<void>;
  cargarPrescripcionAnterior: (pacienteId: string) => Promise<MedicamentoPrescrito[]>;
}

export default function useMedicamentos(): UseMedicamentosReturn {
  const [medicamentos, setMedicamentos] = useState<MedicamentoPrescrito[]>([]);
  const [medicamentosPrecargados, setMedicamentosPrecargados] = useState<MedicamentoPrescrito[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar medicamentos precargados al iniciar
  useEffect(() => {
    cargarMedicamentosPrecargados();
  }, []);

  const cargarMedicamentosPrecargados = useCallback(async () => {
    try {
      setCargando(true);
      
      // En una implementación real, esto cargaría desde una API o archivo JSON
      // Por ahora, usamos datos de ejemplo
      const medicamentosEjemplo: MedicamentoPrescrito[] = [
        {
          nombre: 'Amoxicilina',
          presentacion: 'tabletas',
          dosis: '500mg',
          frecuencia: 'cada 8 horas',
          duracion: '7 días',
          via: 'oral',
          indicacionesEspeciales: 'Tomar con alimentos',
        },
        {
          nombre: 'Ibuprofeno',
          presentacion: 'tabletas',
          dosis: '400mg',
          frecuencia: 'cada 6-8 horas',
          duracion: '5 días',
          via: 'oral',
          indicacionesEspeciales: 'Tomar con alimentos, máximo 3 días',
        },
        {
          nombre: 'Omeprazol',
          presentacion: 'cápsulas',
          dosis: '20mg',
          frecuencia: '1 vez al día',
          duracion: '30 días',
          via: 'oral',
          indicacionesEspeciales: 'Tomar en ayunas',
        },
        {
          nombre: 'Loratadina',
          presentacion: 'tabletas',
          dosis: '10mg',
          frecuencia: '1 vez al día',
          duracion: '10 días',
          via: 'oral',
          indicacionesEspeciales: 'Tomar por la mañana',
        },
        {
          nombre: 'Salbutamol',
          presentacion: 'inhalador',
          dosis: '100mcg',
          frecuencia: 'cada 4-6 horas según necesidad',
          duracion: '30 días',
          via: 'inhalatoria',
          indicacionesEspeciales: 'Usar antes de ejercicio si hay asma',
        },
      ];

      setMedicamentosPrecargados(medicamentosEjemplo);
      setError(null);
    } catch (err) {
      setError('Error al cargar medicamentos precargados');
      console.error('Error cargando medicamentos precargados:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarMedicamento = useCallback(async (medicamento: MedicamentoPrescrito) => {
    try {
      // Validar medicamento
      if (!medicamento.nombre.trim() || !medicamento.dosis.trim() || !medicamento.frecuencia.trim()) {
        throw new Error('Nombre, dosis y frecuencia son requeridos');
      }

      const nuevoMedicamento: MedicamentoPrescrito = {
        ...medicamento,
        nombre: medicamento.nombre.trim(),
        dosis: medicamento.dosis.trim(),
        frecuencia: medicamento.frecuencia.trim(),
        duracion: medicamento.duracion.trim(),
        indicacionesEspeciales: medicamento.indicacionesEspeciales?.trim(),
      };

      setMedicamentos(prev => [...prev, nuevoMedicamento]);
      setError(null);
      
      // En una implementación real, guardaríamos en la base de datos
      // await db.medicamentos.add(nuevoMedicamento);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar medicamento');
      throw err;
    }
  }, []);

  const eliminarMedicamento = useCallback(async (indice: number) => {
    try {
      if (indice < 0 || indice >= medicamentos.length) {
        throw new Error('Índice de medicamento inválido');
      }

      setMedicamentos(prev => prev.filter((_, idx) => idx !== indice));
      setError(null);
      
      // En una implementación real, eliminaríamos de la base de datos
      // await db.medicamentos.delete(indice);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar medicamento');
      throw err;
    }
  }, [medicamentos.length]);

  const actualizarMedicamento = useCallback(async (indice: number, medicamento: MedicamentoPrescrito) => {
    try {
      if (indice < 0 || indice >= medicamentos.length) {
        throw new Error('Índice de medicamento inválido');
      }

      if (!medicamento.nombre.trim() || !medicamento.dosis.trim() || !medicamento.frecuencia.trim()) {
        throw new Error('Nombre, dosis y frecuencia son requeridos');
      }

      const medicamentoActualizado: MedicamentoPrescrito = {
        ...medicamento,
        nombre: medicamento.nombre.trim(),
        dosis: medicamento.dosis.trim(),
        frecuencia: medicamento.frecuencia.trim(),
        duracion: medicamento.duracion.trim(),
        indicacionesEspeciales: medicamento.indicacionesEspeciales?.trim(),
      };

      setMedicamentos(prev => {
        const nuevos = [...prev];
        nuevos[indice] = medicamentoActualizado;
        return nuevos;
      });
      
      setError(null);
      
      // En una implementación real, actualizaríamos en la base de datos
      // await db.medicamentos.update(indice, medicamentoActualizado);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar medicamento');
      throw err;
    }
  }, [medicamentos.length]);

  const buscarMedicamentos = useCallback((termino: string): MedicamentoPrescrito[] => {
    if (!termino.trim()) {
      return medicamentosPrecargados;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    return medicamentosPrecargados.filter(med => 
      med.nombre.toLowerCase().includes(terminoLower) ||
      med.presentacion.toLowerCase().includes(terminoLower) ||
      med.dosis.toLowerCase().includes(terminoLower)
    );
  }, [medicamentosPrecargados]);

  const guardarPrescripcion = useCallback(async (pacienteId: string, medicamentos: MedicamentoPrescrito[]) => {
    try {
      if (!pacienteId) {
        throw new Error('ID de paciente requerido');
      }

      setCargando(true);
      
      // En una implementación real, guardaríamos en la base de datos
      // const prescripcion = {
      //   pacienteId,
      //   medicamentos,
      //   fecha: new Date().toISOString(),
      //   activa: true,
      // };
      // await db.prescripciones.add(prescripcion);
      
      console.log(`Prescripción guardada para paciente ${pacienteId}:`, medicamentos);
      setError(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar prescripción');
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarPrescripcionAnterior = useCallback(async (pacienteId: string): Promise<MedicamentoPrescrito[]> => {
    try {
      if (!pacienteId) {
        return [];
      }

      setCargando(true);
      
      // En una implementación real, cargaríamos de la base de datos
      // const prescripciones = await db.prescripciones
      //   .where('pacienteId')
      //   .equals(pacienteId)
      //   .and(p => p.activa)
      //   .sortBy('fecha');
      
      // return prescripciones[0]?.medicamentos || [];
      
      // Por ahora, retornamos datos de ejemplo
      return [
        {
          nombre: 'Amoxicilina',
          presentacion: 'tabletas',
          dosis: '500mg',
          frecuencia: 'cada 8 horas',
          duracion: '7 días',
          via: 'oral',
          indicacionesEspeciales: 'Tomar con alimentos',
        },
        {
          nombre: 'Ibuprofeno',
          presentacion: 'tabletas',
          dosis: '400mg',
          frecuencia: 'cada 8 horas',
          duracion: '3 días',
          via: 'oral',
          indicacionesEspeciales: 'Solo si hay dolor',
        },
      ];
      
    } catch (err) {
      setError('Error al cargar prescripción anterior');
      console.error('Error cargando prescripción anterior:', err);
      return [];
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    // Estado
    medicamentos,
    medicamentosPrecargados,
    cargando,
    error,
    
    // Acciones
    agregarMedicamento,
    eliminarMedicamento,
    actualizarMedicamento,
    buscarMedicamentos,
    cargarMedicamentosPrecargados,
    guardarPrescripcion,
    cargarPrescripcionAnterior,
  };
}