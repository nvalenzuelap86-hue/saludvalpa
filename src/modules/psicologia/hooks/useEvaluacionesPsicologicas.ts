// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE EVALUACIONES PSICOLÓGICAS
// ============================================================================

import { useState, useCallback } from 'react';

interface EvaluacionPsicologica {
  id: string;
  fecha: Date;
  tipo: 'inicial' | 'seguimiento' | 'final';
  pruebasAplicadas: string[];
  resultados: Record<string, any>;
  observaciones: string;
  profesional: string;
}

interface UseEvaluacionesPsicologicasReturn {
  evaluaciones: EvaluacionPsicologica[];
  agregarEvaluacion: (evaluacion: Omit<EvaluacionPsicologica, 'id' | 'fecha'>) => void;
  eliminarEvaluacion: (id: string) => void;
  actualizarEvaluacion: (id: string, datos: Partial<EvaluacionPsicologica>) => void;
  obtenerEvaluacionPorId: (id: string) => EvaluacionPsicologica | undefined;
  obtenerEvaluacionesPorPaciente: (pacienteId: string) => EvaluacionPsicologica[];
  calcularPromedioEscala: (escala: string) => number | null;
  generarReporteEvaluaciones: () => string;
}

export default function useEvaluacionesPsicologicas(): UseEvaluacionesPsicologicasReturn {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionPsicologica[]>([
    {
      id: 'eval-001',
      fecha: new Date('2024-01-15'),
      tipo: 'inicial',
      pruebasAplicadas: ['PHQ-9', 'GAD-7', 'BDI-II'],
      resultados: {
        'PHQ-9': 15,
        'GAD-7': 12,
        'BDI-II': 28
      },
      observaciones: 'Paciente presenta síntomas depresivos y ansiosos moderados. Buen insight.',
      profesional: 'Dra. Ana López'
    },
    {
      id: 'eval-002',
      fecha: new Date('2024-02-15'),
      tipo: 'seguimiento',
      pruebasAplicadas: ['PHQ-9', 'GAD-7'],
      resultados: {
        'PHQ-9': 10,
        'GAD-7': 8
      },
      observaciones: 'Mejoría significativa en síntomas depresivos. Ansiedad leve persistente.',
      profesional: 'Dra. Ana López'
    }
  ]);

  const agregarEvaluacion = useCallback((evaluacion: Omit<EvaluacionPsicologica, 'id' | 'fecha'>) => {
    const nuevaEvaluacion: EvaluacionPsicologica = {
      ...evaluacion,
      id: `eval-${Date.now()}`,
      fecha: new Date()
    };
    
    setEvaluaciones(prev => [...prev, nuevaEvaluacion]);
  }, []);

  const eliminarEvaluacion = useCallback((id: string) => {
    setEvaluaciones(prev => prev.filter(evaluacion => evaluacion.id !== id));
  }, []);

  const actualizarEvaluacion = useCallback((id: string, datos: Partial<EvaluacionPsicologica>) => {
    setEvaluaciones(prev => prev.map(evaluacion => 
      evaluacion.id === id ? { ...evaluacion, ...datos } : evaluacion
    ));
  }, []);

  const obtenerEvaluacionPorId = useCallback((id: string) => {
    return evaluaciones.find(evaluacion => evaluacion.id === id);
  }, [evaluaciones]);

  const obtenerEvaluacionesPorPaciente = useCallback((_pacienteId: string) => {
    // En una implementación real, esto filtraría por pacienteId
    // Por ahora retornamos todas las evaluaciones
    return evaluaciones;
  }, [evaluaciones]);

  const calcularPromedioEscala = useCallback((escala: string): number | null => {
    const resultados = evaluaciones
      .map(evaluacion => evaluacion.resultados[escala])
      .filter(val => typeof val === 'number');
    
    if (resultados.length === 0) return null;
    
    const suma = resultados.reduce((acc, val) => acc + val, 0);
    return parseFloat((suma / resultados.length).toFixed(2));
  }, [evaluaciones]);

  const generarReporteEvaluaciones = useCallback((): string => {
    if (evaluaciones.length === 0) {
      return 'No hay evaluaciones registradas.';
    }

    let reporte = `REPORTE DE EVALUACIONES PSICOLÓGICAS\n`;
    reporte += `=====================================\n\n`;
    reporte += `Total de evaluaciones: ${evaluaciones.length}\n\n`;

    // Resumen por tipo
    const porTipo = evaluaciones.reduce((acc, evaluacion) => {
      acc[evaluacion.tipo] = (acc[evaluacion.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    reporte += `Distribución por tipo:\n`;
    Object.entries(porTipo).forEach(([tipo, cantidad]) => {
      reporte += `  ${tipo}: ${cantidad} evaluación(es)\n`;
    });

    reporte += `\n`;

    // Escalas más utilizadas
    const escalasCount: Record<string, number> = {};
    evaluaciones.forEach(evaluacion => {
      evaluacion.pruebasAplicadas.forEach(prueba => {
        escalasCount[prueba] = (escalasCount[prueba] || 0) + 1;
      });
    });

    const escalasPopulares = Object.entries(escalasCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    reporte += `Escalas más utilizadas:\n`;
    escalasPopulares.forEach(([escala, count]) => {
      reporte += `  ${escala}: ${count} vez(es)\n`;
    });

    reporte += `\n`;

    // Evolución de puntuaciones
    const escalasUnicas = [...new Set(evaluaciones.flatMap(e => e.pruebasAplicadas))];
    
    escalasUnicas.forEach(escala => {
      const promedio = calcularPromedioEscala(escala);
      if (promedio !== null) {
        reporte += `Promedio ${escala}: ${promedio}\n`;
      }
    });

    return reporte;
  }, [evaluaciones, calcularPromedioEscala]);

  return {
    evaluaciones,
    agregarEvaluacion,
    eliminarEvaluacion,
    actualizarEvaluacion,
    obtenerEvaluacionPorId,
    obtenerEvaluacionesPorPaciente,
    calcularPromedioEscala,
    generarReporteEvaluaciones
  };
}

// Funciones auxiliares para escalas psicológicas
export const interpretarPHQ9 = (puntuacion: number): string => {
  if (puntuacion >= 0 && puntuacion <= 4) return 'Depresión mínima o ausente';
  if (puntuacion >= 5 && puntuacion <= 9) return 'Depresión leve';
  if (puntuacion >= 10 && puntuacion <= 14) return 'Depresión moderada';
  if (puntuacion >= 15 && puntuacion <= 19) return 'Depresión moderadamente severa';
  if (puntuacion >= 20 && puntuacion <= 27) return 'Depresión severa';
  return 'Puntuación fuera de rango';
};

export const interpretarGAD7 = (puntuacion: number): string => {
  if (puntuacion >= 0 && puntuacion <= 4) return 'Ansiedad mínima';
  if (puntuacion >= 5 && puntuacion <= 9) return 'Ansiedad leve';
  if (puntuacion >= 10 && puntuacion <= 14) return 'Ansiedad moderada';
  if (puntuacion >= 15 && puntuacion <= 21) return 'Ansiedad severa';
  return 'Puntuación fuera de rango';
};

export const interpretarBDI = (puntuacion: number): string => {
  if (puntuacion >= 0 && puntuacion <= 13) return 'Depresión mínima';
  if (puntuacion >= 14 && puntuacion <= 19) return 'Depresión leve';
  if (puntuacion >= 20 && puntuacion <= 28) return 'Depresión moderada';
  if (puntuacion >= 29 && puntuacion <= 63) return 'Depresión severa';
  return 'Puntuación fuera de rango';
};

export const calcularSeveridad = (escala: string, puntuacion: number): 'leve' | 'moderada' | 'severa' | 'muy severa' | 'ausente' => {
  switch (escala) {
    case 'PHQ-9':
      if (puntuacion <= 4) return 'ausente';
      if (puntuacion <= 9) return 'leve';
      if (puntuacion <= 14) return 'moderada';
      if (puntuacion <= 19) return 'severa';
      return 'muy severa';
    
    case 'GAD-7':
      if (puntuacion <= 4) return 'ausente';
      if (puntuacion <= 9) return 'leve';
      if (puntuacion <= 14) return 'moderada';
      return 'severa';
    
    case 'BDI-II':
      if (puntuacion <= 13) return 'ausente';
      if (puntuacion <= 19) return 'leve';
      if (puntuacion <= 28) return 'moderada';
      return 'severa';
    
    default:
      return 'ausente';
  }
};