// ============================================================================
// saludvalpa 3.0 - DATOS PRECARGADOS DE ESCALAS PSICOLÓGICAS
// ============================================================================

export interface EscalaPsicologica {
  id: string;
  nombre: string;
  categoria: 'depresion' | 'ansiedad' | 'estres' | 'personalidad' | 'cognitiva' | 'otra';
  descripcion: string;
  items: number;
  rangoMin: number;
  rangoMax: number;
  puntosCorte: Array<{min: number, max: number, interpretacion: string}>;
  tiempoAplicacion: number; // en minutos
  validacion: string;
  referencia: string;
  usoRecomendado: string[];
}

export const escalasPsicologicas: EscalaPsicologica[] = [
  {
    id: 'phq9',
    nombre: 'PHQ-9 (Patient Health Questionnaire-9)',
    categoria: 'depresion',
    descripcion: 'Escala de 9 ítems para evaluar síntomas depresivos según criterios DSM-5. Evalúa frecuencia de síntomas en las últimas 2 semanas.',
    items: 9,
    rangoMin: 0,
    rangoMax: 27,
    puntosCorte: [
      { min: 0, max: 4, interpretacion: 'Depresión mínima o ausente' },
      { min: 5, max: 9, interpretacion: 'Depresión leve' },
      { min: 10, max: 14, interpretacion: 'Depresión moderada' },
      { min: 15, max: 19, interpretacion: 'Depresión moderadamente severa' },
      { min: 20, max: 27, interpretacion: 'Depresión severa' }
    ],
    tiempoAplicacion: 5,
    validacion: 'Alta sensibilidad (88%) y especificidad (88%) para diagnóstico de depresión mayor',
    referencia: 'Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001)',
    usoRecomendado: ['Detección de depresión', 'Seguimiento de tratamiento', 'Investigación clínica']
  },
  {
    id: 'gad7',
    nombre: 'GAD-7 (Generalized Anxiety Disorder-7)',
    categoria: 'ansiedad',
    descripcion: 'Escala de 7 ítems para evaluar síntomas de ansiedad generalizada. Evalúa frecuencia de síntomas en las últimas 2 semanas.',
    items: 7,
    rangoMin: 0,
    rangoMax: 21,
    puntosCorte: [
      { min: 0, max: 4, interpretacion: 'Ansiedad mínima' },
      { min: 5, max: 9, interpretacion: 'Ansiedad leve' },
      { min: 10, max: 14, interpretacion: 'Ansiedad moderada' },
      { min: 15, max: 21, interpretacion: 'Ansiedad severa' }
    ],
    tiempoAplicacion: 3,
    validacion: 'Buena sensibilidad (89%) y especificidad (82%) para trastorno de ansiedad generalizada',
    referencia: 'Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006)',
    usoRecomendado: ['Detección de ansiedad', 'Seguimiento de tratamiento', 'Atención primaria']
  },
  {
    id: 'bdiii',
    nombre: 'BDI-II (Beck Depression Inventory-II)',
    categoria: 'depresion',
    descripcion: 'Inventario de depresión de Beck, versión revisada. 21 ítems que evalúan síntomas cognitivos, afectivos, somáticos y vegetativos.',
    items: 21,
    rangoMin: 0,
    rangoMax: 63,
    puntosCorte: [
      { min: 0, max: 13, interpretacion: 'Depresión mínima' },
      { min: 14, max: 19, interpretacion: 'Depresión leve' },
      { min: 20, max: 28, interpretacion: 'Depresión moderada' },
      { min: 29, max: 63, interpretacion: 'Depresión severa' }
    ],
    tiempoAplicacion: 10,
    validacion: 'Alta consistencia interna (α = 0.91) y validez convergente',
    referencia: 'Beck, A. T., Steer, R. A., & Brown, G. K. (1996)',
    usoRecomendado: ['Evaluación clínica detallada', 'Investigación', 'Psicoterapia']
  },
  {
    id: 'bai',
    nombre: 'BAI (Beck Anxiety Inventory)',
    categoria: 'ansiedad',
    descripcion: 'Inventario de ansiedad de Beck. 21 ítems que evalúan síntomas somáticos y cognitivos de ansiedad.',
    items: 21,
    rangoMin: 0,
    rangoMax: 63,
    puntosCorte: [
      { min: 0, max: 7, interpretacion: 'Ansiedad mínima' },
      { min: 8, max: 15, interpretacion: 'Ansiedad leve' },
      { min: 16, max: 25, interpretacion: 'Ansiedad moderada' },
      { min: 26, max: 63, interpretacion: 'Ansiedad severa' }
    ],
    tiempoAplicacion: 10,
    validacion: 'Alta consistencia interna (α = 0.92) y validez discriminante',
    referencia: 'Beck, A. T., Epstein, N., Brown, G., & Steer, R. A. (1988)',
    usoRecomendado: ['Evaluación clínica de ansiedad', 'Diferenciación ansiedad-depresión', 'Investigación']
  },
  {
    id: 'pss',
    nombre: 'PSS (Perceived Stress Scale)',
    categoria: 'estres',
    descripcion: 'Escala de estrés percibido. Evalúa el grado en que situaciones de la vida son percibidas como estresantes en el último mes.',
    items: 10,
    rangoMin: 0,
    rangoMax: 40,
    puntosCorte: [
      { min: 0, max: 13, interpretacion: 'Estrés bajo' },
      { min: 14, max: 26, interpretacion: 'Estrés moderado' },
      { min: 27, max: 40, interpretacion: 'Estrés alto' }
    ],
    tiempoAplicacion: 5,
    validacion: 'Buena consistencia interna (α = 0.78-0.91) y validez predictiva',
    referencia: 'Cohen, S., Kamarck, T., & Mermelstein, R. (1983)',
    usoRecomendado: ['Evaluación de estrés percibido', 'Investigación en salud', 'Intervenciones de manejo de estrés']
  },
  {
    id: 'iesr',
    nombre: 'IES-R (Impact of Event Scale-Revised)',
    categoria: 'estres',
    descripcion: 'Escala de impacto de eventos revisada. Evalúa síntomas de estrés postraumático (intrusión, evitación, hiperactivación).',
    items: 22,
    rangoMin: 0,
    rangoMax: 88,
    puntosCorte: [
      { min: 0, max: 23, interpretacion: 'Reacción normal' },
      { min: 24, max: 32, interpretacion: 'Reacción leve' },
      { min: 33, max: 36, interpretacion: 'Reacción moderada' },
      { min: 37, max: 88, interpretacion: 'Reacción severa (posible TEPT)' }
    ],
    tiempoAplicacion: 10,
    validacion: 'Alta consistencia interna (α = 0.96) y validez convergente',
    referencia: 'Weiss, D. S., & Marmar, C. R. (1997)',
    usoRecomendado: ['Evaluación de TEPT', 'Investigación en trauma', 'Intervenciones post-trauma']
  },
  {
    id: 'who5',
    nombre: 'WHO-5 (Well-Being Index)',
    categoria: 'otra',
    descripcion: 'Índice de bienestar de la OMS. Evalúa bienestar psicológico positivo en las últimas 2 semanas.',
    items: 5,
    rangoMin: 0,
    rangoMax: 25,
    puntosCorte: [
      { min: 0, max: 13, interpretacion: 'Bienestar bajo (posible depresión)' },
      { min: 14, max: 25, interpretacion: 'Bienestar adecuado' }
    ],
    tiempoAplicacion: 2,
    validacion: 'Alta validez para detección de depresión (sensibilidad 93%)',
    referencia: 'World Health Organization (1998)',
    usoRecomendado: ['Evaluación de bienestar', 'Detección de depresión', 'Investigación en salud mental']
  },
  {
    id: 'dass21',
    nombre: 'DASS-21 (Depression Anxiety Stress Scales)',
    categoria: 'depresion',
    descripcion: 'Escalas de depresión, ansiedad y estrés. 21 ítems que evalúan tres dimensiones: depresión, ansiedad y estrés.',
    items: 21,
    rangoMin: 0,
    rangoMax: 63,
    puntosCorte: [
      { min: 0, max: 9, interpretacion: 'Normal' },
      { min: 10, max: 13, interpretacion: 'Leve' },
      { min: 14, max: 20, interpretacion: 'Moderado' },
      { min: 21, max: 27, interpretacion: 'Severo' },
      { min: 28, max: 63, interpretacion: 'Extremadamente severo' }
    ],
    tiempoAplicacion: 7,
    validacion: 'Excelente consistencia interna (α = 0.94-0.97) y validez factorial',
    referencia: 'Lovibond, S. H., & Lovibond, P. F. (1995)',
    usoRecomendado: ['Evaluación dimensional', 'Investigación transdiagnóstica', 'Psicoterapia']
  }
];

// Funciones auxiliares
export const obtenerEscalaPorId = (id: string): EscalaPsicologica | undefined => {
  return escalasPsicologicas.find(escala => escala.id === id);
};

export const obtenerEscalasPorCategoria = (categoria: string): EscalaPsicologica[] => {
  return escalasPsicologicas.filter(escala => escala.categoria === categoria);
};

export const interpretarPuntuacion = (escalaId: string, puntuacion: number): string => {
  const escala = obtenerEscalaPorId(escalaId);
  if (!escala) return 'Escala no encontrada';
  
  const puntoCorte = escala.puntosCorte.find(pc => 
    puntuacion >= pc.min && puntuacion <= pc.max
  );
  
  return puntoCorte ? puntoCorte.interpretacion : 'Puntuación fuera de rango';
};

export const calcularCambioClinico = (
  puntuacionInicial: number,
  puntuacionFinal: number,
  escalaId: string
): { cambioAbsoluto: number; cambioPorcentual: number; significativo: boolean } => {
  const escala = obtenerEscalaPorId(escalaId);
  if (!escala) return { cambioAbsoluto: 0, cambioPorcentual: 0, significativo: false };
  
  const cambioAbsoluto = puntuacionFinal - puntuacionInicial;
  const rango = escala.rangoMax - escala.rangoMin;
  const cambioPorcentual = parseFloat(((cambioAbsoluto / rango) * 100).toFixed(1));
  
  // Cambio clínicamente significativo: ≥30% del rango total
  const significativo = Math.abs(cambioPorcentual) >= 30;
  
  return { cambioAbsoluto, cambioPorcentual, significativo };
};

export const sugerirEscalasPorSintomas = (sintomas: string[]): EscalaPsicologica[] => {
  const sintomasLower = sintomas.map(s => s.toLowerCase());
  const escalasRecomendadas: EscalaPsicologica[] = [];
  
  // Mapeo de síntomas a categorías
  const mapeoSintomas: Record<string, string[]> = {
    depresion: ['tristeza', 'anhedonia', 'desesperanza', 'culpa', 'suicidio', 'depresión'],
    ansiedad: ['ansiedad', 'preocupación', 'nerviosismo', 'pánico', 'miedo', 'angustia'],
    estres: ['estrés', 'tensión', 'agobio', 'presión', 'burnout', 'agotamiento'],
    trauma: ['trauma', 'abus', 'violencia', 'accidente', 'desastre', 'ptsd'],
    obsesivo: ['obsesión', 'compulsión', 'ritual', 'perfeccionismo', 'control'],
    alimentacion: ['comida', 'peso', 'imagen corporal', 'dieta', 'bulimia', 'anorexia']
  };
  
  // Identificar categorías relevantes
  const categoriasRelevantes = new Set<string>();
  
  Object.entries(mapeoSintomas).forEach(([categoria, palabrasClave]) => {
    if (palabrasClave.some(palabra => 
      sintomasLower.some(sintoma => sintoma.includes(palabra))
    )) {
      categoriasRelevantes.add(categoria);
    }
  });
  
  // Agregar escalas de categorías relevantes
  categoriasRelevantes.forEach(categoria => {
    const escalasCategoria = obtenerEscalasPorCategoria(categoria as any);
    escalasRecomendadas.push(...escalasCategoria.slice(0, 2)); // Máximo 2 por categoría
  });
  
  // Si no se identificaron categorías, sugerir escalas generales
  if (escalasRecomendadas.length === 0) {
    escalasRecomendadas.push(
      escalasPsicologicas.find(e => e.id === 'phq9')!,
      escalasPsicologicas.find(e => e.id === 'gad7')!,
      escalasPsicologicas.find(e => e.id === 'pss')!
    );
  }
  
  // Eliminar duplicados
  return [...new Map(escalasRecomendadas.map(item => [item.id, item])).values()];
};