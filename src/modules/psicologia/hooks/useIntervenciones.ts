// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE INTERVENCIONES TERAPÉUTICAS
// ============================================================================

import { useState, useCallback } from 'react';

interface IntervencionTerapeutica {
  id: string;
  fecha: Date;
  tipo: 'individual' | 'grupal' | 'familiar' | 'pareja';
  tecnica: string;
  duracion: number; // en minutos
  objetivos: string[];
  contenido: string;
  observaciones: string;
  tareasAsignadas: string[];
  efectividad: number; // 1-5
  profesional: string;
}

interface UseIntervencionesReturn {
  intervenciones: IntervencionTerapeutica[];
  agregarIntervencion: (intervencion: Omit<IntervencionTerapeutica, 'id' | 'fecha'>) => void;
  eliminarIntervencion: (id: string) => void;
  actualizarIntervencion: (id: string, datos: Partial<IntervencionTerapeutica>) => void;
  obtenerIntervencionPorId: (id: string) => IntervencionTerapeutica | undefined;
  obtenerIntervencionesPorPaciente: (pacienteId: string) => IntervencionTerapeutica[];
  calcularEfectividadPromedio: () => number;
  obtenerTecnicasMasUtilizadas: (limite?: number) => Array<{tecnica: string, count: number}>;
  generarReporteIntervenciones: () => string;
}

export default function useIntervenciones(): UseIntervencionesReturn {
  const [intervenciones, setIntervenciones] = useState<IntervencionTerapeutica[]>([
    {
      id: 'int-001',
      fecha: new Date('2024-01-10'),
      tipo: 'individual',
      tecnica: 'Reestructuración cognitiva',
      duracion: 50,
      objetivos: ['Identificar pensamientos automáticos negativos', 'Desarrollar pensamientos alternativos'],
      contenido: 'Se trabajó en identificar pensamientos automáticos relacionados con fracaso laboral.',
      observaciones: 'Paciente mostró buena comprensión de la técnica. Resistencia inicial.',
      tareasAsignadas: ['Registro de pensamientos automáticos', 'Ejercicio de reestructuración'],
      efectividad: 4,
      profesional: 'Dra. Ana López'
    },
    {
      id: 'int-002',
      fecha: new Date('2024-01-17'),
      tipo: 'individual',
      tecnica: 'Mindfulness',
      duracion: 50,
      objetivos: ['Reducir reactividad emocional', 'Aumentar conciencia corporal'],
      contenido: 'Introducción a la práctica de mindfulness. Ejercicio de respiración consciente.',
      observaciones: 'Paciente reportó mayor calma después de la sesión.',
      tareasAsignadas: ['Práctica de mindfulness 10 min/día', 'Registro de estados emocionales'],
      efectividad: 5,
      profesional: 'Dra. Ana López'
    },
    {
      id: 'int-003',
      fecha: new Date('2024-01-24'),
      tipo: 'individual',
      tecnica: 'Exposición gradual',
      duracion: 50,
      objetivos: ['Reducir evitación social', 'Aumentar tolerancia a la ansiedad'],
      contenido: 'Jerarquía de situaciones sociales. Exposición imaginaria a situación de menor ansiedad.',
      observaciones: 'Paciente mostró ansiedad moderada durante el ejercicio. Buena colaboración.',
      tareasAsignadas: ['Exposición a una situación social simple', 'Registro de niveles de ansiedad'],
      efectividad: 3,
      profesional: 'Dra. Ana López'
    }
  ]);

  const agregarIntervencion = useCallback((intervencion: Omit<IntervencionTerapeutica, 'id' | 'fecha'>) => {
    const nuevaIntervencion: IntervencionTerapeutica = {
      ...intervencion,
      id: `int-${Date.now()}`,
      fecha: new Date()
    };
    
    setIntervenciones(prev => [...prev, nuevaIntervencion]);
  }, []);

  const eliminarIntervencion = useCallback((id: string) => {
    setIntervenciones(prev => prev.filter(intervencion => intervencion.id !== id));
  }, []);

  const actualizarIntervencion = useCallback((id: string, datos: Partial<IntervencionTerapeutica>) => {
    setIntervenciones(prev => prev.map(intervencion => 
      intervencion.id === id ? { ...intervencion, ...datos } : intervencion
    ));
  }, []);

  const obtenerIntervencionPorId = useCallback((id: string) => {
    return intervenciones.find(intervencion => intervencion.id === id);
  }, [intervenciones]);

  const obtenerIntervencionesPorPaciente = useCallback((_pacienteId: string) => {
    // En una implementación real, esto filtraría por pacienteId
    return intervenciones;
  }, [intervenciones]);

  const calcularEfectividadPromedio = useCallback((): number => {
    if (intervenciones.length === 0) return 0;
    
    const suma = intervenciones.reduce((acc, intervencion) => acc + intervencion.efectividad, 0);
    return parseFloat((suma / intervenciones.length).toFixed(2));
  }, [intervenciones]);

  const obtenerTecnicasMasUtilizadas = useCallback((limite: number = 5) => {
    const tecnicaCount: Record<string, number> = {};
    
    intervenciones.forEach(intervencion => {
      tecnicaCount[intervencion.tecnica] = (tecnicaCount[intervencion.tecnica] || 0) + 1;
    });
    
    return Object.entries(tecnicaCount)
      .map(([tecnica, count]) => ({ tecnica, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limite);
  }, [intervenciones]);

  const generarReporteIntervenciones = useCallback((): string => {
    if (intervenciones.length === 0) {
      return 'No hay intervenciones registradas.';
    }

    let reporte = `REPORTE DE INTERVENCIONES TERAPÉUTICAS\n`;
    reporte += `==========================================\n\n`;
    reporte += `Total de intervenciones: ${intervenciones.length}\n`;
    reporte += `Efectividad promedio: ${calcularEfectividadPromedio()}/5\n\n`;

    // Distribución por tipo
    const porTipo = intervenciones.reduce((acc, intervencion) => {
      acc[intervencion.tipo] = (acc[intervencion.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    reporte += `Distribución por tipo:\n`;
    Object.entries(porTipo).forEach(([tipo, cantidad]) => {
      reporte += `  ${tipo}: ${cantidad} intervención(es)\n`;
    });

    reporte += `\n`;

    // Técnicas más utilizadas
    const tecnicasPopulares = obtenerTecnicasMasUtilizadas(5);
    reporte += `Técnicas más utilizadas:\n`;
    tecnicasPopulares.forEach(({ tecnica, count }) => {
      reporte += `  ${tecnica}: ${count} vez(es)\n`;
    });

    reporte += `\n`;

    // Duración total
    const duracionTotal = intervenciones.reduce((acc, intervencion) => acc + intervencion.duracion, 0);
    const horasTotales = (duracionTotal / 60).toFixed(1);
    reporte += `Duración total de intervenciones: ${duracionTotal} min (${horasTotales} horas)\n`;

    // Tareas asignadas
    const totalTareas = intervenciones.reduce((acc, intervencion) => acc + intervencion.tareasAsignadas.length, 0);
    reporte += `Total de tareas asignadas: ${totalTareas}\n`;

    return reporte;
  }, [intervenciones, calcularEfectividadPromedio, obtenerTecnicasMasUtilizadas]);

  return {
    intervenciones,
    agregarIntervencion,
    eliminarIntervencion,
    actualizarIntervencion,
    obtenerIntervencionPorId,
    obtenerIntervencionesPorPaciente,
    calcularEfectividadPromedio,
    obtenerTecnicasMasUtilizadas,
    generarReporteIntervenciones
  };
}

// Funciones auxiliares para intervenciones terapéuticas
export const categorizarTecnica = (tecnica: string): string => {
  const tecnicasCognitivas = [
    'Reestructuración cognitiva',
    'Diálogo socrático',
    'Registro de pensamientos',
    'Terapia racional emotiva'
  ];
  
  const tecnicasConductuales = [
    'Exposición gradual',
    'Activación conductual',
    'Entrenamiento en habilidades sociales',
    'Role playing'
  ];
  
  const tecnicasMindfulness = [
    'Mindfulness',
    'Meditación',
    'Aceptación',
    'Terapia de aceptación y compromiso'
  ];
  
  const tecnicasRelajacion = [
    'Relajación progresiva',
    'Respiración diafragmática',
    'Visualización guiada',
    'Biofeedback'
  ];

  if (tecnicasCognitivas.includes(tecnica)) return 'Cognitiva';
  if (tecnicasConductuales.includes(tecnica)) return 'Conductual';
  if (tecnicasMindfulness.includes(tecnica)) return 'Mindfulness/Aceptación';
  if (tecnicasRelajacion.includes(tecnica)) return 'Relajación';
  return 'Otra';
};

export const evaluarEfectividad = (
  efectividad: number,
  _tipoIntervencion: string
): { nivel: string; recomendacion: string } => {
  if (efectividad >= 4.5) {
    return {
      nivel: 'Excelente',
      recomendacion: 'Continuar con esta línea de intervención.'
    };
  } else if (efectividad >= 3.5) {
    return {
      nivel: 'Buena',
      recomendacion: 'Mantener la técnica, considerar ajustes menores.'
    };
  } else if (efectividad >= 2.5) {
    return {
      nivel: 'Moderada',
      recomendacion: 'Reevaluar la técnica o el enfoque terapéutico.'
    };
  } else {
    return {
      nivel: 'Baja',
      recomendacion: 'Considerar cambio de técnica o abordaje terapéutico.'
    };
  }
};

export const sugerirTecnicaAlternativa = (tecnicaActual: string, efectividad: number): string[] => {
  const sugerencias: Record<string, string[]> = {
    'Reestructuración cognitiva': ['Terapia de esquemas', 'Terapia de aceptación y compromiso', 'Mindfulness'],
    'Exposición gradual': ['Desensibilización sistemática', 'Terapia de exposición prolongada', 'Terapia de realidad virtual'],
    'Mindfulness': ['Meditación trascendental', 'Yoga terapéutico', 'Terapia de compasión'],
    'Relajación progresiva': ['Biofeedback', 'Entrenamiento autógeno', 'Visualización guiada']
  };

  if (efectividad >= 4) {
    return ['Continuar con técnica actual', 'Profundizar en la misma línea terapéutica'];
  } else if (efectividad >= 3) {
    return sugerencias[tecnicaActual] || ['Variar el enfoque', 'Combinar con otras técnicas'];
  } else {
    return ['Cambiar completamente de técnica', 'Reevaluar diagnóstico y plan terapéutico'];
  }
};