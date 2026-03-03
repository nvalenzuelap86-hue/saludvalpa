// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE EXAMENES CLÍNICOS
// Hook personalizado para gestionar exámenes físicos y signos vitales
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import type { 
  ExamenFisicoCompleto,
  SignosVitales,
  ExamenFisicoPorSistema
} from '../../../types';

interface UseClinicalExamsReturn {
  // Estado
  examenesFisicos: ExamenFisicoCompleto[];
  signosVitales: SignosVitales[];
  examenActual: ExamenFisicoCompleto | null;
  cargando: boolean;
  error: string | null;
  
  // Acciones
  cargarExamenesPaciente: (pacienteId: string) => Promise<void>;
  cargarSignosVitalesPaciente: (pacienteId: string) => Promise<void>;
  crearExamenFisico: (examen: Omit<ExamenFisicoCompleto, 'id'>) => Promise<string>;
  crearSignosVitales: (signos: Omit<SignosVitales, 'id'>) => Promise<string>;
  actualizarExamenFisico: (id: string, actualizaciones: Partial<ExamenFisicoCompleto>) => Promise<void>;
  buscarExamenesPorSistema: (pacienteId: string, sistema: string) => Promise<ExamenFisicoCompleto[]>;
  obtenerTendenciasSignosVitales: (pacienteId: string, dias: number) => Promise<SignosVitales[]>;
  calcularIMC: (peso: number, talla: number) => number;
  interpretarSignosVitales: (signos: SignosVitales) => { normal: boolean; alertas: string[] };
  generarResumenExamen: (examen: ExamenFisicoCompleto) => string;
}

export default function useClinicalExams(): UseClinicalExamsReturn {
  const [examenesFisicos, setExamenesFisicos] = useState<ExamenFisicoCompleto[]>([]);
  const [signosVitales, setSignosVitales] = useState<SignosVitales[]>([]);
  const [examenActual, setExamenActual] = useState<ExamenFisicoCompleto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarExamenesPaciente = useCallback(async (pacienteId: string) => {
    try {
      setCargando(true);
      setError(null);

      const examenes = await db.examenesFisicos
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fecha');

      setExamenesFisicos(examenes);
      
      // Establecer el examen más reciente como actual
      if (examenes.length > 0) {
        const examenMasReciente = examenes.reduce((masReciente, examen) => 
          new Date(examen.fecha) > new Date(masReciente.fecha) ? examen : masReciente
        );
        setExamenActual(examenMasReciente);
      } else {
        setExamenActual(null);
      }
    } catch (err) {
      setError('Error al cargar exámenes físicos del paciente');
      console.error('Error cargando exámenes físicos:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarSignosVitalesPaciente = useCallback(async (pacienteId: string) => {
    try {
      setCargando(true);
      setError(null);

      const signos = await db.signosVitales
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fecha');

      setSignosVitales(signos);
    } catch (err) {
      setError('Error al cargar signos vitales del paciente');
      console.error('Error cargando signos vitales:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearExamenFisico = useCallback(async (examenData: Omit<ExamenFisicoCompleto, 'id'>): Promise<string> => {
    try {
      setCargando(true);
      setError(null);

      // Validar datos requeridos
      if (!examenData.pacienteId) {
        throw new Error('ID del paciente es requerido');
      }

      if (!examenData.fecha) {
        throw new Error('Fecha del examen es requerida');
      }

      const examenCompleto: ExamenFisicoCompleto = {
        ...examenData,
        id: crypto.randomUUID(),
      };

      await db.examenesFisicos.add(examenCompleto);
      
      // Actualizar estado local
      setExamenesFisicos(prev => [...prev, examenCompleto]);
      setExamenActual(examenCompleto);
      
      return examenCompleto.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear examen físico');
      console.error('Error creando examen físico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearSignosVitales = useCallback(async (signosData: Omit<SignosVitales, 'id'>): Promise<string> => {
    try {
      setCargando(true);
      setError(null);

      // Validar datos requeridos
      if (!signosData.pacienteId) {
        throw new Error('ID del paciente es requerido');
      }

      if (!signosData.fecha) {
        throw new Error('Fecha de los signos vitales es requerida');
      }

      // Calcular IMC si se proporcionan peso y talla
      let signosConIMC = { ...signosData };
      if (signosData.peso && signosData.talla && signosData.talla > 0) {
        const imc = calcularIMC(signosData.peso, signosData.talla / 100); // Convertir cm a m
        signosConIMC = { ...signosConIMC, imc };
      }

      const signosCompletos: SignosVitales = {
        ...signosConIMC,
        id: crypto.randomUUID(),
      };

      await db.signosVitales.add(signosCompletos);
      
      // Actualizar estado local
      setSignosVitales(prev => [...prev, signosCompletos]);
      
      return signosCompletos.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear signos vitales');
      console.error('Error creando signos vitales:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarExamenFisico = useCallback(async (id: string, actualizaciones: Partial<ExamenFisicoCompleto>) => {
    try {
      setCargando(true);
      setError(null);

      const examenExistente = await db.examenesFisicos.get(id);
      if (!examenExistente) {
        throw new Error('Examen físico no encontrado');
      }

      await db.examenesFisicos.update(id, actualizaciones);
      
      // Actualizar estado local
      setExamenesFisicos(prev => 
        prev.map(e => e.id === id ? { ...e, ...actualizaciones } : e)
      );
      
      if (examenActual?.id === id) {
        setExamenActual(prev => prev ? { ...prev, ...actualizaciones } : null);
      }
    } catch (err) {
      setError('Error al actualizar examen físico');
      console.error('Error actualizando examen físico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [examenActual]);

  const buscarExamenesPorSistema = useCallback(async (pacienteId: string, sistema: string): Promise<ExamenFisicoCompleto[]> => {
    try {
      setCargando(true);
      setError(null);

      const examenes = await db.examenesFisicos
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fecha');

      // Filtrar exámenes que tengan datos en el sistema especificado
      const examenesFiltrados = examenes.filter(examen => {
        // Buscar en sistemas específicos
        if (sistema.toLowerCase() === 'general' && examen.general) {
          const tieneDatos = Object.values(examen.general).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        if (sistema.toLowerCase() === 'cabeza y cuello' && examen.cabezaCuello) {
          const tieneDatos = Object.values(examen.cabezaCuello).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        if (sistema.toLowerCase() === 'torax' && examen.torax) {
          const tieneDatos = Object.values(examen.torax).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        if (sistema.toLowerCase() === 'abdomen' && examen.abdomen) {
          const tieneDatos = Object.values(examen.abdomen).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        if (sistema.toLowerCase() === 'extremidades' && examen.extremidades) {
          const tieneDatos = Object.values(examen.extremidades).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        if (sistema.toLowerCase() === 'neurologico' && examen.neurologico) {
          const tieneDatos = Object.values(examen.neurologico).some(val =>
            val && val.toString().trim().length > 0 && val.toString().trim() !== 'normal'
          );
          return tieneDatos;
        }
        
        // Buscar en la lista de sistemas
        return examen.sistemas.some(s =>
          s.sistema.toLowerCase().includes(sistema.toLowerCase()) &&
          s.hallazgos && s.hallazgos.trim().length > 0
        );
      });

      return examenesFiltrados;
    } catch (err) {
      setError('Error al buscar exámenes por sistema');
      console.error('Error buscando exámenes por sistema:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerTendenciasSignosVitales = useCallback(async (pacienteId: string, dias: number): Promise<SignosVitales[]> => {
    try {
      setCargando(true);
      setError(null);

      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      const todosSignos = await db.signosVitales
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fecha');

      // Filtrar por fecha
      const signosRecientes = todosSignos.filter(signo => 
        new Date(signo.fecha) >= fechaLimite
      );

      return signosRecientes;
    } catch (err) {
      setError('Error al obtener tendencias de signos vitales');
      console.error('Error obteniendo tendencias de signos vitales:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const calcularIMC = useCallback((peso: number, tallaMetros: number): number => {
    if (peso <= 0 || tallaMetros <= 0) {
      return 0;
    }
    const imc = peso / (tallaMetros * tallaMetros);
    return Math.round(imc * 10) / 10; // Redondear a 1 decimal
  }, []);

  const interpretarSignosVitales = useCallback((signos: SignosVitales): { normal: boolean; alertas: string[] } => {
    const alertas: string[] = [];
    
    // Presión arterial
    if (signos.presionArterialSistolica > 140 || signos.presionArterialDiastolica > 90) {
      alertas.push(`Presión arterial elevada: ${signos.presionArterialSistolica}/${signos.presionArterialDiastolica} mmHg`);
    }
    if (signos.presionArterialSistolica < 90 || signos.presionArterialDiastolica < 60) {
      alertas.push(`Presión arterial baja: ${signos.presionArterialSistolica}/${signos.presionArterialDiastolica} mmHg`);
    }
    
    // Frecuencia cardíaca
    if (signos.frecuenciaCardiaca > 100) {
      alertas.push(`Taquicardia: ${signos.frecuenciaCardiaca} lpm`);
    }
    if (signos.frecuenciaCardiaca < 60) {
      alertas.push(`Bradicardia: ${signos.frecuenciaCardiaca} lpm`);
    }
    
    // Frecuencia respiratoria
    if (signos.frecuenciaRespiratoria > 20) {
      alertas.push(`Taquipnea: ${signos.frecuenciaRespiratoria} rpm`);
    }
    if (signos.frecuenciaRespiratoria < 12) {
      alertas.push(`Bradipnea: ${signos.frecuenciaRespiratoria} rpm`);
    }
    
    // Temperatura
    if (signos.temperatura > 38) {
      alertas.push(`Fiebre: ${signos.temperatura} °C`);
    }
    if (signos.temperatura < 36) {
      alertas.push(`Hipotermia: ${signos.temperatura} °C`);
    }
    
    // Saturación de oxígeno
    if (signos.saturacionOxigeno < 95) {
      alertas.push(`Hipoxemia: ${signos.saturacionOxigeno}%`);
    }
    if (signos.saturacionOxigeno < 90) {
      alertas.push(`Hipoxemia severa: ${signos.saturacionOxigeno}%`);
    }
    
    // IMC
    if (signos.imc) {
      if (signos.imc < 18.5) {
        alertas.push(`Bajo peso: IMC ${signos.imc}`);
      } else if (signos.imc >= 25 && signos.imc < 30) {
        alertas.push(`Sobrepeso: IMC ${signos.imc}`);
      } else if (signos.imc >= 30) {
        alertas.push(`Obesidad: IMC ${signos.imc}`);
      }
    }
    
    // Glucemia
    if (signos.glucemia && signos.glucemia > 126) {
      alertas.push(`Hiperglucemia: ${signos.glucemia} mg/dL`);
    }
    if (signos.glucemia && signos.glucemia < 70) {
      alertas.push(`Hipoglucemia: ${signos.glucemia} mg/dL`);
    }
    
    return {
      normal: alertas.length === 0,
      alertas,
    };
  }, []);

  const generarResumenExamen = useCallback((examen: ExamenFisicoCompleto): string => {
    const resumen: string[] = [];
    
    resumen.push(`Examen físico realizado el ${new Date(examen.fecha).toLocaleDateString()}`);
    
    // Función para agregar sección si tiene datos significativos
    const agregarSeccion = (titulo: string, datos: Record<string, any> | undefined) => {
      if (!datos) return;
      
      const valores = Object.entries(datos)
        .filter(([key, value]) => value && value.toString().trim().length > 0 && value.toString().trim() !== 'normal')
        .map(([key, value]) => `${key}: ${value}`);
      
      if (valores.length > 0) {
        resumen.push(`${titulo}: ${valores.join(', ')}`);
      }
    };
    
    // Agregar secciones
    agregarSeccion('General', examen.general);
    agregarSeccion('Cabeza y cuello', examen.cabezaCuello);
    agregarSeccion('Tórax', examen.torax);
    agregarSeccion('Abdomen', examen.abdomen);
    agregarSeccion('Extremidades', examen.extremidades);
    agregarSeccion('Neurológico', examen.neurologico);
    
    // Agregar sistemas con hallazgos
    const sistemasConHallazgos = examen.sistemas.filter(s => s.hallazgos && s.hallazgos.trim().length > 0);
    if (sistemasConHallazgos.length > 0) {
      resumen.push('Hallazgos por sistema:');
      sistemasConHallazgos.forEach(s => {
        resumen.push(`  - ${s.sistema}: ${s.hallazgos}`);
      });
    }
    
    if (examen.notas) {
      resumen.push(`Notas: ${examen.notas}`);
    }
    
    return resumen.join('\n');
  }, []);

  return {
    // Estado
    examenesFisicos,
    signosVitales,
    examenActual,
    cargando,
    error,
    
    // Acciones
    cargarExamenesPaciente,
    cargarSignosVitalesPaciente,
    crearExamenFisico,
    crearSignosVitales,
    actualizarExamenFisico,
    buscarExamenesPorSistema,
    obtenerTendenciasSignosVitales,
    calcularIMC,
    interpretarSignosVitales,
    generarResumenExamen,
  };
}