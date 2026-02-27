// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE ESCALAS PSICOLÓGICAS
// ============================================================================

import { useState, useCallback } from 'react';

interface EscalaPsicologica {
  id: string;
  nombre: string;
  categoria: 'depresion' | 'ansiedad' | 'estres' | 'personalidad' | 'cognitiva' | 'otra';
  rangoMin: number;
  rangoMax: number;
  puntosCorte: Array<{puntuacion: number, interpretacion: string}>;
  descripcion: string;
  tiempoAplicacion: number; // en minutos
  validacion: string;
  referencia: string;
}

interface PuntuacionEscala {
  id: string;
  escalaId: string;
  pacienteId: string;
  fecha: Date;
  puntuacion: number;
  observaciones: string;
  profesional: string;
}

interface UseEscalasPsicologicasReturn {
  escalas: EscalaPsicologica[];
  puntuaciones: PuntuacionEscala[];
  agregarEscala: (escala: Omit<EscalaPsicologica, 'id'>) => void;
  agregarPuntuacion: (puntuacion: Omit<PuntuacionEscala, 'id' | 'fecha'>) => void;
  eliminarPuntuacion: (id: string) => void;
  obtenerEscalaPorId: (id: string) => EscalaPsicologica | undefined;
  obtenerPuntuacionesPorEscala: (escalaId: string) => PuntuacionEscala[];
  obtenerPuntuacionesPorPaciente: (pacienteId: string) => PuntuacionEscala[];
  interpretarPuntuacion: (escalaId: string, puntuacion: number) => string;
  calcularEvolucion: (escalaId: string, pacienteId: string) => Array<{fecha: Date, puntuacion: number}>;
  generarReporteEscalas: () => string;
}

export default function useEscalasPsicologicas(): UseEscalasPsicologicasReturn {
  const [escalas, setEscalas] = useState<EscalaPsicologica[]>([
    {
      id: 'esc-001',
      nombre: 'PHQ-9 (Patient Health Questionnaire-9)',
      categoria: 'depresion',
      rangoMin: 0,
      rangoMax: 27,
      puntosCorte: [
        { puntuacion: 0, interpretacion: 'Ninguna depresión' },
        { puntuacion: 5, interpretacion: 'Depresión leve' },
        { puntuacion: 10, interpretacion: 'Depresión moderada' },
        { puntuacion: 15, interpretacion: 'Depresión moderadamente severa' },
        { puntuacion: 20, interpretacion: 'Depresión severa' }
      ],
      descripcion: 'Escala de 9 ítems para evaluar síntomas depresivos según criterios DSM-5.',
      tiempoAplicacion: 5,
      validacion: 'Validada en población hispanohablante',
      referencia: 'Kroenke et al., 2001'
    },
    {
      id: 'esc-002',
      nombre: 'GAD-7 (Generalized Anxiety Disorder-7)',
      categoria: 'ansiedad',
      rangoMin: 0,
      rangoMax: 21,
      puntosCorte: [
        { puntuacion: 0, interpretacion: 'Ansiedad mínima' },
        { puntuacion: 5, interpretacion: 'Ansiedad leve' },
        { puntuacion: 10, interpretacion: 'Ansiedad moderada' },
        { puntuacion: 15, interpretacion: 'Ansiedad severa' }
      ],
      descripcion: 'Escala de 7 ítems para evaluar síntomas de ansiedad generalizada.',
      tiempoAplicacion: 3,
      validacion: 'Buena sensibilidad y especificidad',
      referencia: 'Spitzer et al., 2006'
    },
    {
      id: 'esc-003',
      nombre: 'BDI-II (Beck Depression Inventory-II)',
      categoria: 'depresion',
      rangoMin: 0,
      rangoMax: 63,
      puntosCorte: [
        { puntuacion: 0, interpretacion: 'Depresión mínima' },
        { puntuacion: 14, interpretacion: 'Depresión leve' },
        { puntuacion: 20, interpretacion: 'Depresión moderada' },
        { puntuacion: 29, interpretacion: 'Depresión severa' }
      ],
      descripcion: 'Inventario de depresión de Beck, versión revisada. 21 ítems.',
      tiempoAplicacion: 10,
      validacion: 'Ampliamente validada internacionalmente',
      referencia: 'Beck et al., 1996'
    },
    {
      id: 'esc-004',
      nombre: 'BAI (Beck Anxiety Inventory)',
      categoria: 'ansiedad',
      rangoMin: 0,
      rangoMax: 63,
      puntosCorte: [
        { puntuacion: 0, interpretacion: 'Ansiedad mínima' },
        { puntuacion: 8, interpretacion: 'Ansiedad leve' },
        { puntuacion: 16, interpretacion: 'Ansiedad moderada' },
        { puntuacion: 26, interpretacion: 'Ansiedad severa' }
      ],
      descripcion: 'Inventario de ansiedad de Beck. 21 ítems que evalúan síntomas somáticos y cognitivos.',
      tiempoAplicacion: 10,
      validacion: 'Validada en población clínica',
      referencia: 'Beck et al., 1988'
    },
    {
      id: 'esc-005',
      nombre: 'PSS (Perceived Stress Scale)',
      categoria: 'estres',
      rangoMin: 0,
      rangoMax: 40,
      puntosCorte: [
        { puntuacion: 0, interpretacion: 'Estrés bajo' },
        { puntuacion: 14, interpretacion: 'Estrés moderado' },
        { puntuacion: 27, interpretacion: 'Estrés alto' }
      ],
      descripcion: 'Escala de estrés percibido. Evalúa el grado en que situaciones de la vida son percibidas como estresantes.',
      tiempoAplicacion: 5,
      validacion: 'Validada en múltiples culturas',
      referencia: 'Cohen et al., 1983'
    }
  ]);

  const [puntuaciones, setPuntuaciones] = useState<PuntuacionEscala[]>([
    {
      id: 'punt-001',
      escalaId: 'esc-001',
      pacienteId: 'pac-001',
      fecha: new Date('2024-01-15'),
      puntuacion: 15,
      observaciones: 'Paciente reporta síntomas depresivos moderadamente severos. Anhedonia marcada.',
      profesional: 'Dra. Ana López'
    },
    {
      id: 'punt-002',
      escalaId: 'esc-002',
      pacienteId: 'pac-001',
      fecha: new Date('2024-01-15'),
      puntuacion: 12,
      observaciones: 'Ansiedad moderada con predominio de preocupación excesiva.',
      profesional: 'Dra. Ana López'
    },
    {
      id: 'punt-003',
      escalaId: 'esc-001',
      pacienteId: 'pac-001',
      fecha: new Date('2024-02-15'),
      puntuacion: 10,
      observaciones: 'Mejoría significativa en síntomas depresivos tras 4 semanas de tratamiento.',
      profesional: 'Dra. Ana López'
    },
    {
      id: 'punt-004',
      escalaId: 'esc-002',
      pacienteId: 'pac-001',
      fecha: new Date('2024-02-15'),
      puntuacion: 8,
      observaciones: 'Reducción en síntomas ansiosos. Persiste preocupación laboral.',
      profesional: 'Dra. Ana López'
    }
  ]);

  const agregarEscala = useCallback((escala: Omit<EscalaPsicologica, 'id'>) => {
    const nuevaEscala: EscalaPsicologica = {
      ...escala,
      id: `esc-${Date.now()}`
    };
    
    setEscalas(prev => [...prev, nuevaEscala]);
  }, []);

  const agregarPuntuacion = useCallback((puntuacion: Omit<PuntuacionEscala, 'id' | 'fecha'>) => {
    const nuevaPuntuacion: PuntuacionEscala = {
      ...puntuacion,
      id: `punt-${Date.now()}`,
      fecha: new Date()
    };
    
    setPuntuaciones(prev => [...prev, nuevaPuntuacion]);
  }, []);

  const eliminarPuntuacion = useCallback((id: string) => {
    setPuntuaciones(prev => prev.filter(puntuacion => puntuacion.id !== id));
  }, []);

  const obtenerEscalaPorId = useCallback((id: string) => {
    return escalas.find(escala => escala.id === id);
  }, [escalas]);

  const obtenerPuntuacionesPorEscala = useCallback((escalaId: string) => {
    return puntuaciones.filter(puntuacion => puntuacion.escalaId === escalaId);
  }, [puntuaciones]);

  const obtenerPuntuacionesPorPaciente = useCallback((pacienteId: string) => {
    return puntuaciones.filter(puntuacion => puntuacion.pacienteId === pacienteId);
  }, [puntuaciones]);

  const interpretarPuntuacion = useCallback((escalaId: string, puntuacion: number): string => {
    const escala = obtenerEscalaPorId(escalaId);
    if (!escala) return 'Escala no encontrada';
    
    // Encontrar el punto de corte correspondiente
    for (let i = escala.puntosCorte.length - 1; i >= 0; i--) {
      if (puntuacion >= escala.puntosCorte[i].puntuacion) {
        return escala.puntosCorte[i].interpretacion;
      }
    }
    
    return 'Puntuación fuera de rango';
  }, [obtenerEscalaPorId]);

  const calcularEvolucion = useCallback((escalaId: string, pacienteId: string) => {
    const puntuacionesFiltradas = puntuaciones
      .filter(p => p.escalaId === escalaId && p.pacienteId === pacienteId)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    
    return puntuacionesFiltradas.map(p => ({
      fecha: p.fecha,
      puntuacion: p.puntuacion
    }));
  }, [puntuaciones]);

  const generarReporteEscalas = useCallback((): string => {
    let reporte = `REPORTE DE ESCALAS PSICOLÓGICAS\n`;
    reporte += `================================\n\n`;
    reporte += `Total de escalas disponibles: ${escalas.length}\n`;
    reporte += `Total de puntuaciones registradas: ${puntuaciones.length}\n\n`;

    // Distribución por categoría
    const porCategoria = escalas.reduce((acc, escala) => {
      acc[escala.categoria] = (acc[escala.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    reporte += `Escalas por categoría:\n`;
    Object.entries(porCategoria).forEach(([categoria, cantidad]) => {
      reporte += `  ${categoria}: ${cantidad} escala(s)\n`;
    });

    reporte += `\n`;

    // Escalas más utilizadas
    const usoEscalas: Record<string, number> = {};
    puntuaciones.forEach(puntuacion => {
      const escala = obtenerEscalaPorId(puntuacion.escalaId);
      if (escala) {
        usoEscalas[escala.nombre] = (usoEscalas[escala.nombre] || 0) + 1;
      }
    });

    const escalasPopulares = Object.entries(usoEscalas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    reporte += `Escalas más utilizadas:\n`;
    escalasPopulares.forEach(([nombre, count]) => {
      reporte += `  ${nombre}: ${count} evaluación(es)\n`;
    });

    reporte += `\n`;

    // Evolución de pacientes
    const pacientesUnicos = [...new Set(puntuaciones.map(p => p.pacienteId))];
    reporte += `Pacientes evaluados: ${pacientesUnicos.length}\n`;

    return reporte;
  }, [escalas, puntuaciones, obtenerEscalaPorId]);

  return {
    escalas,
    puntuaciones,
    agregarEscala,
    agregarPuntuacion,
    eliminarPuntuacion,
    obtenerEscalaPorId,
    obtenerPuntuacionesPorEscala,
    obtenerPuntuacionesPorPaciente,
    interpretarPuntuacion,
    calcularEvolucion,
    generarReporteEscalas
  };
}

// Funciones auxiliares para escalas psicológicas
export const calcularCambioPorcentual = (
  puntuacionInicial: number,
  puntuacionFinal: number,
  escalaId: string
): number => {
  const escala = useEscalasPsicologicas().escalas.find(e => e.id === escalaId);
  if (!escala) return 0;
  
  const rango = escala.rangoMax - escala.rangoMin;
  const cambioAbsoluto = puntuacionFinal - puntuacionInicial;
  
  // Para escalas donde menor es mejor (como depresión, ansiedad)
  // Un cambio negativo indica mejoría
  return parseFloat(((cambioAbsoluto / rango) * 100).toFixed(1));
};

export const determinarSignificanciaClinica = (
  cambioPorcentual: number,
  _escala: string
): { significativo: boolean; interpretacion: string } => {
  // Basado en criterios de cambio clínicamente significativo
  const umbral = 30; // 30% de cambio considerado clínicamente significativo
  
  if (Math.abs(cambioPorcentual) >= umbral) {
    return {
      significativo: true,
      interpretacion: cambioPorcentual < 0 
        ? 'Mejoría clínicamente significativa'
        : 'Empeoramiento clínicamente significativo'
    };
  } else if (Math.abs(cambioPorcentual) >= 15) {
    return {
      significativo: true,
      interpretacion: cambioPorcentual < 0 
        ? 'Mejoría moderada'
        : 'Empeoramiento moderado'
    };
  } else {
    return {
      significativo: false,
      interpretacion: 'Cambio no clínicamente significativo'
    };
  }
};

export const sugerirEscalasPorSintoma = (sintomas: string[]): string[] => {
  const sugerencias: Record<string, string[]> = {
    'depresion': ['PHQ-9', 'BDI-II', 'HAM-D', 'MADRS'],
    'ansiedad': ['GAD-7', 'BAI', 'HAM-A', 'STAI'],
    'estres': ['PSS', 'IES-R', 'DASS-21'],
    'trauma': ['IES-R', 'PCL-5', 'CAPS-5'],
    'obsesivo': ['Y-BOCS', 'OCI-R'],
    'alimentacion': ['EDI-3', 'EAT-26'],
    'sueño': ['PSQI', 'ISI'],
    'personalidad': ['MMPI-2', 'MCMI-IV', 'PID-5']
  };

  const escalasRecomendadas: string[] = [];
  
  sintomas.forEach(sintoma => {
    const sintomaLower = sintoma.toLowerCase();
    
    if (sintomaLower.includes('depres') || sintomaLower.includes('tristeza')) {
      escalasRecomendadas.push(...sugerencias.depresion);
    }
    if (sintomaLower.includes('ansiedad') || sintomaLower.includes('preocupación')) {
      escalasRecomendadas.push(...sugerencias.ansiedad);
    }
    if (sintomaLower.includes('estrés') || sintomaLower.includes('tensión')) {
      escalasRecomendadas.push(...sugerencias.estres);
    }
    if (sintomaLower.includes('trauma') || sintomaLower.includes('abus')) {
      escalasRecomendadas.push(...sugerencias.trauma);
    }
  });

  // Eliminar duplicados
  return [...new Set(escalasRecomendadas)].slice(0, 5);
};