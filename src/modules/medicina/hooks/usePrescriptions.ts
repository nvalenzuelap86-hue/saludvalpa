// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE PRESCRIPCIONES MÉDICAS
// Hook personalizado para gestionar prescripciones de medicamentos
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import type { MedicamentoPrescritoDetallado } from '../../../types';
import { ViaAdministracion, FrecuenciaMedicacion, UnidadDosis } from '../../../types';

interface UsePrescriptionsReturn {
  // Estado
  prescripciones: MedicamentoPrescritoDetallado[];
  prescripcionesActivas: MedicamentoPrescritoDetallado[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  cargarPrescripcionesPaciente: (pacienteId: string) => Promise<void>;
  crearPrescripcion: (prescripcion: Omit<MedicamentoPrescritoDetallado, 'id'>) => Promise<string>;
  actualizarPrescripcion: (id: string, actualizaciones: Partial<MedicamentoPrescritoDetallado>) => Promise<void>;
  suspenderPrescripcion: (id: string, motivo: string) => Promise<void>;
  buscarPrescripcionesPorMedicamento: (nombreMedicamento: string) => Promise<MedicamentoPrescritoDetallado[]>;
  verificarInteracciones: (medicamentos: MedicamentoPrescritoDetallado[]) => Promise<{ medicamentoA: string; medicamentoB: string; interaccion: string }[]>;
  calcularDosis: (peso: number, dosisBase: number, unidad: UnidadDosis, ajusteRenal?: number) => number;
  generarInstruccionesPaciente: (prescripcion: MedicamentoPrescritoDetallado) => string;
}

export default function usePrescriptions(): UsePrescriptionsReturn {
  const [prescripciones, setPrescripciones] = useState<MedicamentoPrescritoDetallado[]>([]);
  const [prescripcionesActivas, setPrescripcionesActivas] = useState<MedicamentoPrescritoDetallado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPrescripcionesPaciente = useCallback(async (pacienteId: string) => {
    try {
      setCargando(true);
      setError(null);

      const todasPrescripciones = await db.medicamentosPrescritos
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fechaPrescripcion');

      setPrescripciones(todasPrescripciones);
      
      // Filtrar prescripciones activas (sin fecha de fin o con fecha futura)
      const ahora = new Date();
      const activas = todasPrescripciones.filter(p => {
        // En una implementación real, verificaríamos la duración
        return true; // Por ahora, todas se consideran activas
      });
      
      setPrescripcionesActivas(activas);
    } catch (err) {
      setError('Error al cargar prescripciones del paciente');
      console.error('Error cargando prescripciones:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearPrescripcion = useCallback(async (prescripcionData: Omit<MedicamentoPrescritoDetallado, 'id'>): Promise<string> => {
    try {
      setCargando(true);
      setError(null);

      // Validar datos requeridos
      if (!prescripcionData.nombre.trim() || !prescripcionData.pacienteId) {
        throw new Error('Nombre del medicamento y ID del paciente son requeridos');
      }

      if (prescripcionData.dosis <= 0) {
        throw new Error('La dosis debe ser mayor a cero');
      }

      if (prescripcionData.duracionDias <= 0) {
        throw new Error('La duración debe ser mayor a cero');
      }

      const prescripcionCompleta: MedicamentoPrescritoDetallado = {
        ...prescripcionData,
        id: crypto.randomUUID(),
      };

      await db.medicamentosPrescritos.add(prescripcionCompleta);
      
      // Actualizar estado local
      setPrescripciones(prev => [...prev, prescripcionCompleta]);
      setPrescripcionesActivas(prev => [...prev, prescripcionCompleta]);
      
      return prescripcionCompleta.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear prescripción');
      console.error('Error creando prescripción:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarPrescripcion = useCallback(async (id: string, actualizaciones: Partial<MedicamentoPrescritoDetallado>) => {
    try {
      setCargando(true);
      setError(null);

      const prescripcionExistente = await db.medicamentosPrescritos.get(id);
      if (!prescripcionExistente) {
        throw new Error('Prescripción no encontrada');
      }

      await db.medicamentosPrescritos.update(id, actualizaciones);
      
      // Actualizar estado local
      setPrescripciones(prev => 
        prev.map(p => p.id === id ? { ...p, ...actualizaciones } : p)
      );
      setPrescripcionesActivas(prev => 
        prev.map(p => p.id === id ? { ...p, ...actualizaciones } : p)
      );
    } catch (err) {
      setError('Error al actualizar prescripción');
      console.error('Error actualizando prescripción:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const suspenderPrescripcion = useCallback(async (id: string, motivo: string) => {
    try {
      setCargando(true);
      setError(null);

      await actualizarPrescripcion(id, {
        // En una implementación real, agregaríamos campo de suspensión
        justificacion: motivo ? `SUSPENDIDA: ${motivo}` : 'SUSPENDIDA',
      });

      // Remover de prescripciones activas
      setPrescripcionesActivas(prev => prev.filter(p => p.id !== id));
      
    } catch (err) {
      setError('Error al suspender prescripción');
      console.error('Error suspendiendo prescripción:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarPrescripcion]);

  const buscarPrescripcionesPorMedicamento = useCallback(async (nombreMedicamento: string): Promise<MedicamentoPrescritoDetallado[]> => {
    try {
      setCargando(true);
      setError(null);

      if (!nombreMedicamento.trim()) {
        return [];
      }

      const termino = nombreMedicamento.toLowerCase().trim();
      const todasPrescripciones = await db.medicamentosPrescritos.toArray();
      
      const resultados = todasPrescripciones.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.principioActivo?.toLowerCase().includes(termino)
      );

      return resultados;
    } catch (err) {
      setError('Error al buscar prescripciones');
      console.error('Error buscando prescripciones:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const verificarInteracciones = useCallback(async (medicamentos: MedicamentoPrescritoDetallado[]): Promise<{ medicamentoA: string; medicamentoB: string; interaccion: string }[]> => {
    try {
      // En una implementación real, esto consultaría una base de datos de interacciones
      // Por ahora, retornamos un ejemplo estático
      
      const interaccionesConocidas = [
        { medicamentoA: 'Warfarina', medicamentoB: 'Amiodarona', interaccion: 'Aumento del riesgo de sangrado' },
        { medicamentoA: 'Digoxina', medicamentoB: 'Furosemida', interaccion: 'Hipokalemia que potencia toxicidad digitálica' },
        { medicamentoA: 'Teofilina', medicamentoB: 'Ciprofloxacino', interaccion: 'Aumento de niveles de teofilina' },
      ];

      const interaccionesEncontradas: { medicamentoA: string; medicamentoB: string; interaccion: string }[] = [];
      
      for (let i = 0; i < medicamentos.length; i++) {
        for (let j = i + 1; j < medicamentos.length; j++) {
          const medA = medicamentos[i].nombre;
          const medB = medicamentos[j].nombre;
          
          const interaccion = interaccionesConocidas.find(
            int => 
              (int.medicamentoA === medA && int.medicamentoB === medB) ||
              (int.medicamentoA === medB && int.medicamentoB === medA)
          );
          
          if (interaccion) {
            interaccionesEncontradas.push(interaccion);
          }
        }
      }
      
      return interaccionesEncontradas;
    } catch (err) {
      console.error('Error verificando interacciones:', err);
      return [];
    }
  }, []);

  const calcularDosis = useCallback((peso: number, dosisBase: number, unidad: UnidadDosis, ajusteRenal?: number): number => {
    // Cálculo básico de dosis por peso
    let dosisCalculada = dosisBase;
    
    if (unidad === UnidadDosis.MG_KG) {
      dosisCalculada = dosisBase * peso;
    } else if (unidad === UnidadDosis.MCG_KG) {
      dosisCalculada = dosisBase * peso;
    }
    
    // Ajuste por función renal si se proporciona
    if (ajusteRenal && ajusteRenal < 1) {
      dosisCalculada *= ajusteRenal;
    }
    
    return Math.round(dosisCalculada * 100) / 100; // Redondear a 2 decimales
  }, []);

  const generarInstruccionesPaciente = useCallback((prescripcion: MedicamentoPrescritoDetallado): string => {
    const instrucciones: string[] = [];
    
    // Instrucción básica
    instrucciones.push(`Tome ${prescripcion.dosis} ${prescripcion.unidadDosis} de ${prescripcion.nombre}`);
    
    // Frecuencia
    const frecuenciaMap: Record<FrecuenciaMedicacion, string> = {
      [FrecuenciaMedicacion.UNA_VEZ_DIA]: 'una vez al día',
      [FrecuenciaMedicacion.DOS_VECES_DIA]: 'dos veces al día',
      [FrecuenciaMedicacion.TRES_VECES_DIA]: 'tres veces al día',
      [FrecuenciaMedicacion.CADA_4_HORAS]: 'cada 4 horas',
      [FrecuenciaMedicacion.CADA_6_HORAS]: 'cada 6 horas',
      [FrecuenciaMedicacion.CADA_8_HORAS]: 'cada 8 horas',
      [FrecuenciaMedicacion.CADA_12_HORAS]: 'cada 12 horas',
      [FrecuenciaMedicacion.CADA_24_HORAS]: 'cada 24 horas',
      [FrecuenciaMedicacion.SEMANAL]: 'una vez por semana',
      [FrecuenciaMedicacion.MENSUAL]: 'una vez al mes',
      [FrecuenciaMedicacion.SEGUN_NECESIDAD]: 'según sea necesario',
      [FrecuenciaMedicacion.ANTES_COMIDA]: 'antes de las comidas',
      [FrecuenciaMedicacion.DESPUES_COMIDA]: 'después de las comidas',
      [FrecuenciaMedicacion.CON_COMIDA]: 'con las comidas',
    };
    
    instrucciones.push(frecuenciaMap[prescripcion.frecuencia] || prescripcion.frecuencia);
    
    // Duración
    instrucciones.push(`durante ${prescripcion.duracionDias} días`);
    
    // Vía de administración
    const viaMap: Record<ViaAdministracion, string> = {
      [ViaAdministracion.ORAL]: 'por vía oral',
      [ViaAdministracion.INTRAVENOSA]: 'por vía intravenosa',
      [ViaAdministracion.INTRAMUSCULAR]: 'por vía intramuscular',
      [ViaAdministracion.SUBCUTANEA]: 'por vía subcutánea',
      [ViaAdministracion.TOPICA]: 'por vía tópica',
      [ViaAdministracion.INHALATORIA]: 'por vía inhalatoria',
      [ViaAdministracion.OFTALMICA]: 'por vía oftálmica',
      [ViaAdministracion.OTICA]: 'por vía ótica',
      [ViaAdministracion.RECTAL]: 'por vía rectal',
      [ViaAdministracion.VAGINAL]: 'por vía vaginal',
      [ViaAdministracion.TRANSDERMICA]: 'por vía transdérmica',
    };
    
    instrucciones.push(viaMap[prescripcion.via] || prescripcion.via);
    
    // Instrucciones especiales
    if (prescripcion.indicacionesEspeciales) {
      instrucciones.push(`Instrucciones especiales: ${prescripcion.indicacionesEspeciales}`);
    }
    
    return instrucciones.join(', ');
  }, []);

  return {
    // Estado
    prescripciones,
    prescripcionesActivas,
    cargando,
    error,
    
    // Acciones
    cargarPrescripcionesPaciente,
    crearPrescripcion,
    actualizarPrescripcion,
    suspenderPrescripcion,
    buscarPrescripcionesPorMedicamento,
    verificarInteracciones,
    calcularDosis,
    generarInstruccionesPaciente,
  };
}