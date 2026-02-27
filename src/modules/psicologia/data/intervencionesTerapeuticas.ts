// ============================================================================
// ARCHIVO: intervencionesTerapeuticas.ts
// DESCRIPCIÓN: Datos precargados de intervenciones terapéuticas basadas en
//              evidencia científica para psicología clínica.
// ============================================================================

export interface IntervencionTerapeutica {
  id: string;
  nombre: string;
  categoria: 'Cognitiva' | 'Conductual' | 'Emocional' | 'Sistémica' | 'Integrativa';
  descripcion: string;
  indicaciones: string[];
  contraindicaciones: string[];
  duracionEstimada: string;
  frecuenciaRecomendada: string;
  evidenciaCientifica: {
    nivel: 'Alta' | 'Media' | 'Baja';
    estudios: string[];
  };
  tecnicasEspecificas: string[];
  materialesNecesarios: string[];
  objetivosTerapeuticos: string[];
  dificultad: 'Baja' | 'Media' | 'Alta';
}

export const intervencionesTerapeuticas: IntervencionTerapeutica[] = [
  {
    id: 'tcc-001',
    nombre: 'Reestructuración Cognitiva',
    categoria: 'Cognitiva',
    descripcion: 'Técnica central de la Terapia Cognitivo-Conductual que ayuda a identificar y modificar pensamientos automáticos negativos y creencias disfuncionales.',
    indicaciones: [
      'Trastornos depresivos',
      'Trastornos de ansiedad',
      'Pensamientos catastróficos',
      'Baja autoestima',
      'Perfeccionismo patológico'
    ],
    contraindicaciones: [
      'Pacientes con deterioro cognitivo severo',
      'Crisis psicótica aguda',
      'Pacientes con resistencia alta a la introspección'
    ],
    duracionEstimada: '8-12 sesiones',
    frecuenciaRecomendada: 'Semanal',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'Beck, J.S. (2011). Cognitive Behavior Therapy: Basics and Beyond',
        'Hofmann, S.G. et al. (2012). The efficacy of cognitive behavioral therapy',
        'Meta-análisis de 269 estudios sobre TCC para depresión'
      ]
    },
    tecnicasEspecificas: [
      'Registro de pensamientos automáticos',
      'Cuestionamiento socrático',
      'Experimentos conductuales',
      'Escala de creencias',
      'Reatribución de responsabilidad'
    ],
    materialesNecesarios: [
      'Formularios de registro cognitivo',
      'Escalas de pensamientos',
      'Diario terapéutico'
    ],
    objetivosTerapeuticos: [
      'Identificar distorsiones cognitivas',
      'Desarrollar pensamientos alternativos',
      'Reducir intensidad emocional negativa',
      'Mejorar funcionamiento diario'
    ],
    dificultad: 'Media'
  },
  {
    id: 'tcc-002',
    nombre: 'Exposición Gradual',
    categoria: 'Conductual',
    descripcion: 'Técnica conductual que implica enfrentar gradualmente situaciones temidas para reducir la respuesta de ansiedad mediante habituación.',
    indicaciones: [
      'Fobias específicas',
      'Trastorno de ansiedad social',
      'Trastorno de pánico con agorafobia',
      'TOC (rituales de evitación)',
      'Estrés postraumático'
    ],
    contraindicaciones: [
      'Pacientes con riesgo suicida',
      'Cardiopatías no controladas',
      'Sin motivación para el cambio',
      'Exposición podría causar daño real'
    ],
    duracionEstimada: '10-20 sesiones',
    frecuenciaRecomendada: '1-2 veces por semana',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'Foa, E.B. & Kozak, M.J. (1986). Emotional processing of fear',
        'Craske, M.G. et al. (2014). Maximizing exposure therapy',
        'Meta-análisis de exposición para fobias específicas'
      ]
    },
    tecnicasEspecificas: [
      'Jerarquía de exposición',
      'Exposición en imaginación',
      'Exposición en vivo',
      'Exposición interoceptiva',
      'Prevención de respuesta'
    ],
    materialesNecesarios: [
      'Escala de ansiedad subjetiva (0-100)',
      'Lista de situaciones temidas',
      'Registro de exposición'
    ],
    objetivosTerapeuticos: [
      'Reducir evitación conductual',
      'Disminuir respuesta de ansiedad',
      'Aumentar autoeficacia',
      'Generalizar aprendizaje'
    ],
    dificultad: 'Alta'
  },
  {
    id: 'act-001',
    nombre: 'Defusión Cognitiva',
    categoria: 'Cognitiva',
    descripcion: 'Técnica de Terapia de Aceptación y Compromiso que ayuda a distanciarse de los pensamientos problemáticos, viéndolos como eventos mentales en lugar de verdades absolutas.',
    indicaciones: [
      'Rumiación excesiva',
      'Fusión cognitiva',
      'Evitación experiencial',
      'Autocrítica severa',
      'Pensamientos intrusivos'
    ],
    contraindicaciones: [
      'Pacientes que requieren validación inmediata',
      'Fase aguda de psicosis',
      'Dificultades severas de abstracción'
    ],
    duracionEstimada: '4-8 sesiones',
    frecuenciaRecomendada: 'Semanal',
    evidenciaCientifica: {
      nivel: 'Media',
      estudios: [
        'Hayes, S.C. et al. (1999). Acceptance and Commitment Therapy',
        'Levin, M.E. et al. (2012). Examining defusion in clinical samples',
        'Estudios sobre eficacia de ACT para depresión'
      ]
    },
    tecnicasEspecificas: [
      'Pensamientos en una nube',
      'Nombrando la historia',
      'Repetición rápida de palabras',
      'Tarjetas de pensamientos',
      'Metáfora del autobús'
    ],
    materialesNecesarios: [
      'Tarjetas con pensamientos',
      'Metáforas visuales',
      'Ejercicios de mindfulness'
    ],
    objetivosTerapeuticos: [
      'Reducir fusión con pensamientos',
      'Aumentar flexibilidad psicológica',
      'Disminuir lucha interna',
      'Favorecer acción comprometida'
    ],
    dificultad: 'Media'
  },
  {
    id: 'emo-001',
    nombre: 'Regulación Emocional',
    categoria: 'Emocional',
    descripcion: 'Conjunto de estrategias para identificar, comprender y modular respuestas emocionales intensas o desadaptativas.',
    indicaciones: [
      'Desregulación emocional',
      'Trastorno límite de personalidad',
      'Ira explosiva',
      'Labilidad afectiva',
      'Dificultad para tolerar emociones'
    ],
    contraindicaciones: [
      'Crisis emocional aguda',
      'Pacientes que rechazan trabajo emocional',
      'Sin habilidades básicas de identificación emocional'
    ],
    duracionEstimada: '12-24 sesiones',
    frecuenciaRecomendada: 'Semanal',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'Linehan, M.M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder',
        'Gratz, K.L. & Roemer, L. (2004). Multidimensional assessment of emotion regulation',
        'DBT estudios de eficacia para desregulación emocional'
      ]
    },
    tecnicasEspecificas: [
      'Check the facts',
      'Opposite action',
      'PLEASE skills',
      'TIPP skills (temperatura, ejercicio, respiración)',
      'Mindfulness de emociones'
    ],
    materialesNecesarios: [
      'Diario de emociones',
      'Escala de intensidad emocional',
      'Tarjetas de habilidades'
    ],
    objetivosTerapeuticos: [
      'Identificar y nombrar emociones',
      'Reducir vulnerabilidad emocional',
      'Aumentar tolerancia al malestar',
      'Modular intensidad emocional'
    ],
    dificultad: 'Alta'
  },
  {
    id: 'sist-001',
    nombre: 'Genograma Familiar',
    categoria: 'Sistémica',
    descripcion: 'Herramienta gráfica que representa la estructura familiar, relaciones y patrones transgeneracionales para comprender dinámicas familiares.',
    indicaciones: [
      'Conflictos familiares',
      'Patrones relacionales repetitivos',
      'Problemas de comunicación familiar',
      'Transmisión intergeneracional',
      'Crisis familiares'
    ],
    contraindicaciones: [
      'Familias en negación total',
      'Situaciones de abuso no revelado',
      'Sin consentimiento de miembros familiares'
    ],
    duracionEstimada: '2-4 sesiones',
    frecuenciaRecomendada: 'Quincenal',
    evidenciaCientifica: {
      nivel: 'Media',
      estudios: [
        'McGoldrick, M. et al. (2008). Genograms: Assessment and Intervention',
        'Bowen, M. (1978). Family Therapy in Clinical Practice',
        'Estudios sobre eficacia de terapia familiar sistémica'
      ]
    },
    tecnicasEspecificas: [
      'Mapeo de relaciones',
      'Identificación de triángulos',
      'Patrones transgeneracionales',
      'Eventos críticos familiares',
      'Roles familiares'
    ],
    materialesNecesarios: [
      'Papel grande o pizarra',
      'Símbolos para genograma',
      'Marcadores de colores'
    ],
    objetivosTerapeuticos: [
      'Visualizar estructura familiar',
      'Identificar patrones problemáticos',
      'Contextualizar síntomas individuales',
      'Promover insight sistémico'
    ],
    dificultad: 'Baja'
  },
  {
    id: 'mind-001',
    nombre: 'Mindfulness para Reducción de Estrés',
    categoria: 'Integrativa',
    descripcion: 'Práctica de atención plena que entrena la capacidad de observar experiencias presentes sin juicio, reduciendo reactividad al estrés.',
    indicaciones: [
      'Estrés crónico',
      'Ansiedad generalizada',
      'Síntomas somáticos',
      'Dificultades de concentración',
      'Prevención de recaídas depresivas'
    ],
    contraindicaciones: [
      'Psicosis activa',
      'Disociación severa',
      'Trauma no procesado (sin preparación)',
      'Pacientes que rechazan prácticas contemplativas'
    ],
    duracionEstimada: '8 semanas (programa MBSR)',
    frecuenciaRecomendada: 'Diaria (práctica formal)',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'Kabat-Zinn, J. (1990). Full Catastrophe Living',
        'Hofmann, S.G. et al. (2010). The effect of mindfulness-based therapy on anxiety and depression',
        'Meta-análisis de 209 estudios sobre mindfulness'
      ]
    },
    tecnicasEspecificas: [
      'Escaneo corporal',
      'Meditación sentada',
      'Mindfulness en actividades diarias',
      'Yoga consciente',
      'Meditación caminando'
    ],
    materialesNecesarios: [
      'Grabaciones guiadas',
      'Cojín de meditación',
      'Diario de práctica',
      'Timer'
    ],
    objetivosTerapeuticos: [
      'Reducir reactividad al estrés',
      'Aumentar conciencia corporal',
      'Mejorar regulación emocional',
      'Desarrollar aceptación'
    ],
    dificultad: 'Media'
  },
  {
    id: 'sol-001',
    nombre: 'Entrenamiento en Solución de Problemas',
    categoria: 'Cognitiva',
    descripcion: 'Enfoque estructurado para identificar problemas, generar soluciones alternativas, evaluar consecuencias e implementar planes de acción.',
    indicaciones: [
      'Dificultades en toma de decisiones',
      'Sentimientos de impotencia',
      'Problemas interpersonales',
      'Estrés laboral',
      'Dificultades de adaptación'
    ],
    contraindicaciones: [
      'Problemas que requieren intervención inmediata',
      'Pacientes con pensamiento muy rígido',
      'Sin motivación para cambio conductual'
    ],
    duracionEstimada: '6-10 sesiones',
    frecuenciaRecomendada: 'Semanal',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'D\'Zurilla, T.J. & Nezu, A.M. (2007). Problem-Solving Therapy',
        'Nezu, A.M. (2004). Problem solving and behavior therapy revisited',
        'Meta-análisis para depresión y ansiedad'
      ]
    },
    tecnicasEspecificas: [
      'Definición operacional del problema',
      'Lluvia de ideas sin crítica',
      'Análisis de ventajas/desventajas',
      'Planificación de pasos concretos',
      'Evaluación de resultados'
    ],
    materialesNecesarios: [
      'Formularios de solución de problemas',
      'Listas de pros y contras',
      'Plan de acción'
    ],
    objetivosTerapeuticos: [
      'Desarrollar habilidades de afrontamiento',
      'Reducir evitación de problemas',
      'Aumentar autoeficacia',
      'Mejorar funcionamiento adaptativo'
    ],
    dificultad: 'Baja'
  },
  {
    id: 'tra-001',
    nombre: 'Procesamiento de Trauma (EMDR)',
    categoria: 'Integrativa',
    descripcion: 'Enfoque psicoterapéutico que utiliza estimulación bilateral (movimientos oculares, sonidos, tapping) para procesar recuerdos traumáticos.',
    indicaciones: [
      'Trastorno de estrés postraumático',
      'Traumas simples y complejos',
      'Memorias intrusivas',
      'Síntomas disociativos',
      'Duelo complicado'
    ],
    contraindicaciones: [
      'Epilepsia no controlada',
      'Desprendimiento de retina',
      'Psicosis activa',
      'Sin estabilización previa en trauma complejo'
    ],
    duracionEstimada: '8-12 sesiones (trauma simple)',
    frecuenciaRecomendada: 'Semanal',
    evidenciaCientifica: {
      nivel: 'Alta',
      estudios: [
        'Shapiro, F. (2001). Eye Movement Desensitization and Reprocessing',
        'Bisson, J.I. et al. (2007). Psychological treatments for chronic PTSD',
        'Guías NICE y OMS para tratamiento de TEPT'
      ]
    },
    tecnicasEspecificas: [
      'Historia clínica y preparación',
      'Identificación de diana',
      'Desensibilización con estimulación bilateral',
      'Instalación de creencia positiva',
      'Escaneo corporal'
    ],
    materialesNecesarios: [
      'Dispositivo de estimulación bilateral',
      'Escalas de unidades subjetivas de perturbación (SUD)',
      'Escala de validez de cognición (VoC)'
    ],
    objetivosTerapeuticos: [
      'Reducir carga emocional de recuerdos',
      'Integrar experiencias traumáticas',
      'Disminuir síntomas de TEPT',
      'Restaurar funcionamiento adaptativo'
    ],
    dificultad: 'Alta'
  }
];

// Funciones de utilidad para intervenciones terapéuticas
export function filtrarIntervencionesPorCategoria(categoria: IntervencionTerapeutica['categoria']): IntervencionTerapeutica[] {
  return intervencionesTerapeuticas.filter(intervencion => intervencion.categoria === categoria);
}

export function buscarIntervencionesPorIndicacion(indicacion: string): IntervencionTerapeutica[] {
  return intervencionesTerapeuticas.filter(intervencion =>
    intervencion.indicaciones.some(ind => ind.toLowerCase().includes(indicacion.toLowerCase()))
  );
}

export function obtenerIntervencionPorId(id: string): IntervencionTerapeutica | undefined {
  return intervencionesTerapeuticas.find(intervencion => intervencion.id === id);
}

export function sugerirIntervencionesParaSintomas(sintomas: string[]): IntervencionTerapeutica[] {
  const intervencionesRelevantes: IntervencionTerapeutica[] = [];
  
  // Mapeo de síntomas a categorías de intervención
  const mapeoSintomas: Record<string, IntervencionTerapeutica['categoria'][]> = {
    'depresión': ['Cognitiva', 'Integrativa'],
    'ansiedad': ['Cognitiva', 'Conductual', 'Integrativa'],
    'trauma': ['Integrativa', 'Emocional'],
    'ira': ['Emocional', 'Cognitiva'],
    'estrés': ['Integrativa', 'Cognitiva'],
    'obsesiones': ['Conductual', 'Cognitiva'],
    'relaciones': ['Sistémica', 'Emocional'],
    'autoestima': ['Cognitiva', 'Emocional'],
    'duelo': ['Integrativa', 'Emocional'],
    'adicciones': ['Conductual', 'Cognitiva']
  };
  
  // Recopilar categorías relevantes basadas en síntomas
  const categoriasRelevantes = new Set<IntervencionTerapeutica['categoria']>();
  
  sintomas.forEach(sintoma => {
    const sintomaLower = sintoma.toLowerCase();
    for (const [key, categorias] of Object.entries(mapeoSintomas)) {
      if (sintomaLower.includes(key.toLowerCase()) || key.toLowerCase().includes(sintomaLower)) {
        categorias.forEach(cat => categoriasRelevantes.add(cat));
      }
    }
  });
  
  // Si no se encontraron categorías específicas, usar todas
  if (categoriasRelevantes.size === 0) {
    return intervencionesTerapeuticas.slice(0, 3); // Devolver primeras 3 como sugerencia general
  }
  
  // Filtrar intervenciones por categorías relevantes
  intervencionesTerapeuticas.forEach(intervencion => {
    if (categoriasRelevantes.has(intervencion.categoria)) {
      intervencionesRelevantes.push(intervencion);
    }
  });
  
  // Ordenar por nivel de evidencia (Alta primero) y dificultad (Baja primero)
  return intervencionesRelevantes.sort((a: IntervencionTerapeutica, b: IntervencionTerapeutica) => {
    const nivelOrden: Record<string, number> = { 'Alta': 0, 'Media': 1, 'Baja': 2 };
    const dificultadOrden: Record<string, number> = { 'Baja': 0, 'Media': 1, 'Alta': 2 };
    
    if (nivelOrden[a.evidenciaCientifica.nivel] !== nivelOrden[b.evidenciaCientifica.nivel]) {
      return nivelOrden[a.evidenciaCientifica.nivel] - nivelOrden[b.evidenciaCientifica.nivel];
    }
    
    return dificultadOrden[a.dificultad] - dificultadOrden[b.dificultad];
  });
}
