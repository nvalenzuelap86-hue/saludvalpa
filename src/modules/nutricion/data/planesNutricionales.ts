// Planes nutricionales predefinidos para diferentes objetivos
// Basados en guías de alimentación saludable (OMS, ADA, AHA)

export interface PlanNutricionalTemplate {
  id: string;
  nombre: string;
  objetivo: 'perdida_peso' | 'ganancia_muscular' | 'mantenimiento' | 'diabetes' | 'hipertension' | 'rendimiento_deportivo' | 'embarazo' | 'vegano';
  descripcion: string;
  caloriasDiarias: number; // Rango objetivo
  distribucionMacronutrientes: {
    proteinas: number; // % del total calórico
    carbohidratos: number; // % del total calórico
    grasas: number; // % del total calórico
  };
  comidasPorDia: number;
  recomendaciones: string[];
  alimentosRecomendados: string[]; // IDs de alimentos recomendados
  alimentosLimitados: string[]; // IDs de alimentos a limitar
  notasEspeciales?: string;
}

export const planesNutricionales: PlanNutricionalTemplate[] = [
  // PLAN PARA PÉRDIDA DE PESO
  {
    id: 'plan-001',
    nombre: 'Plan Mediterráneo para Pérdida de Peso',
    objetivo: 'perdida_peso',
    descripcion: 'Plan basado en la dieta mediterránea, rico en vegetales, grasas saludables y proteínas magras, diseñado para pérdida de peso sostenible.',
    caloriasDiarias: 1500,
    distribucionMacronutrientes: {
      proteinas: 25,
      carbohidratos: 40,
      grasas: 35
    },
    comidasPorDia: 5,
    recomendaciones: [
      'Consumir al menos 5 porciones de frutas y verduras al día',
      'Priorizar grasas saludables (aceite de oliva, aguacate, frutos secos)',
      'Incluir pescado al menos 2 veces por semana',
      'Limitar carnes rojas a 1-2 veces por semana',
      'Beber 2 litros de agua diariamente',
      'Evitar alimentos ultraprocesados y azúcares añadidos'
    ],
    alimentosRecomendados: ['verdura-001', 'verdura-002', 'fruta-001', 'fruta-003', 'proteina-002', 'grasa-001', 'grasa-002', 'legumbre-001'],
    alimentosLimitados: ['cereal-001', 'azucar-001', 'grasa-004'],
    notasEspeciales: 'Ideal para pérdida de 0.5-1kg por semana. Combinar con ejercicio moderado 150 minutos/semana.'
  },

  // PLAN PARA GANANCIA MUSCULAR
  {
    id: 'plan-002',
    nombre: 'Plan Hiperproteico para Ganancia Muscular',
    objetivo: 'ganancia_muscular',
    descripcion: 'Plan con mayor aporte proteico para soportar síntesis muscular, combinado con carbohidratos complejos para energía.',
    caloriasDiarias: 2800,
    distribucionMacronutrientes: {
      proteinas: 30,
      carbohidratos: 45,
      grasas: 25
    },
    comidasPorDia: 6,
    recomendaciones: [
      'Consumir 1.6-2.2g de proteína por kg de peso corporal',
      'Distribuir la proteína en 4-6 comidas diarias',
      'Incluir carbohidratos complejos en cada comida',
      'Consumir proteína dentro de los 30 minutos post-ejercicio',
      'Mantener hidratación adecuada (35ml/kg de peso)',
      'Suplementar con creatina si es necesario'
    ],
    alimentosRecomendados: ['proteina-001', 'proteina-003', 'lacteo-001', 'lacteo-002', 'cereal-002', 'legumbre-002', 'fruta-002', 'grasa-003'],
    alimentosLimitados: ['azucar-001', 'grasa-004', 'bebida-001'],
    notasEspeciales: 'Adecuado para entrenamiento de fuerza 3-5 veces por semana. Ajustar calorías según tasa metabólica.'
  },

  // PLAN PARA DIABETES TIPO 2
  {
    id: 'plan-003',
    nombre: 'Plan de Control Glucémico para Diabetes',
    objetivo: 'diabetes',
    descripcion: 'Plan diseñado para estabilizar niveles de glucosa en sangre, con bajo índice glucémico y control de carbohidratos.',
    caloriasDiarias: 1800,
    distribucionMacronutrientes: {
      proteinas: 20,
      carbohidratos: 45,
      grasas: 35
    },
    comidasPorDia: 6,
    recomendaciones: [
      'Controlar porciones de carbohidratos en cada comida',
      'Priorizar carbohidratos de bajo índice glucémico',
      'Incluir fibra soluble en cada comida',
      'Evitar azúcares simples y refinados',
      'Monitorear glucosa pre y postprandial',
      'Distribuir carbohidratos uniformemente durante el día'
    ],
    alimentosRecomendados: ['legumbre-001', 'legumbre-002', 'cereal-002', 'verdura-001', 'verdura-002', 'fruta-001', 'proteina-001', 'grasa-002'],
    alimentosLimitados: ['cereal-001', 'fruta-002', 'azucar-001', 'bebida-002'],
    notasEspeciales: 'Consultar con endocrinólogo para ajuste de medicación. Contar carbohidratos según prescripción médica.'
  },

  // PLAN PARA HIPERTENSIÓN
  {
    id: 'plan-004',
    nombre: 'Plan DASH para Control de Hipertensión',
    objetivo: 'hipertension',
    descripcion: 'Basado en el enfoque DASH (Dietary Approaches to Stop Hypertension), rico en potasio, magnesio, calcio y bajo en sodio.',
    caloriasDiarias: 2000,
    distribucionMacronutrientes: {
      proteinas: 18,
      carbohidratos: 55,
      grasas: 27
    },
    comidasPorDia: 4,
    recomendaciones: [
      'Limitar sodio a menos de 1500mg diarios',
      'Consumir 8-10 porciones de frutas y verduras al día',
      'Incluir lácteos bajos en grasa',
      'Priorizar granos enteros sobre refinados',
      'Limitar carnes rojas y procesadas',
      'Evitar alimentos enlatados y procesados altos en sodio'
    ],
    alimentosRecomendados: ['fruta-001', 'fruta-003', 'verdura-001', 'verdura-002', 'lacteo-002', 'cereal-002', 'legumbre-001', 'proteina-002'],
    alimentosLimitados: ['lacteo-001', 'queso-001', 'procesado-001', 'enlatado-001'],
    notasEspeciales: 'Efectivo para reducir presión arterial en 2-4 semanas. Combinar con reducción de peso si hay sobrepeso.'
  },

  // PLAN PARA RENDIMIENTO DEPORTIVO
  {
    id: 'plan-005',
    nombre: 'Plan de Carbohidratos para Rendimiento Deportivo',
    objetivo: 'rendimiento_deportivo',
    descripcion: 'Plan con periodización de carbohidratos para optimizar rendimiento en entrenamiento y competencia.',
    caloriasDiarias: 3200,
    distribucionMacronutrientes: {
      proteinas: 20,
      carbohidratos: 60,
      grasas: 20
    },
    comidasPorDia: 5,
    recomendaciones: [
      'Ajustar carbohidratos según intensidad del entrenamiento',
      'Consumir carbohidratos 2-4 horas antes del ejercicio',
      'Reponer carbohidratos dentro de los 30 minutos post-ejercicio',
      'Mantener hidratación con electrolitos durante ejercicio prolongado',
      'Incluir proteína de alta calidad para recuperación',
      'Periodizar nutrición según fase de entrenamiento'
    ],
    alimentosRecomendados: ['cereal-002', 'cereal-003', 'fruta-002', 'legumbre-002', 'proteina-001', 'proteina-003', 'lacteo-002', 'grasa-003'],
    alimentosLimitados: ['grasa-001', 'grasa-002', 'azucar-001'],
    notasEspeciales: 'Para atletas de resistencia o fuerza. Ajustar según volumen e intensidad del entrenamiento.'
  },

  // PLAN VEGANO
  {
    id: 'plan-006',
    nombre: 'Plan Vegano Balanceado',
    objetivo: 'vegano',
    descripcion: 'Plan 100% vegetal que asegura todos los nutrientes esenciales mediante combinación de alimentos vegetales.',
    caloriasDiarias: 2200,
    distribucionMacronutrientes: {
      proteinas: 15,
      carbohidratos: 60,
      grasas: 25
    },
    comidasPorDia: 4,
    recomendaciones: [
      'Combinar legumbres con cereales para proteína completa',
      'Incluir fuentes de hierro no hemo con vitamina C',
      'Consumir alimentos fortificados con B12 o suplementar',
      'Incluir fuentes de omega-3 (linaza, chía, nueces)',
      'Asegurar calcio de vegetales de hoja verde, tofu, bebidas fortificadas',
      'Exponerse al sol para vitamina D o suplementar'
    ],
    alimentosRecomendados: ['legumbre-001', 'legumbre-002', 'cereal-002', 'verdura-001', 'verdura-002', 'fruta-001', 'grasa-003', 'tofu-001'],
    alimentosLimitados: [],
    notasEspeciales: 'Recomendado suplementar B12. Monitorear niveles de hierro, B12, vitamina D y omega-3 regularmente.'
  },

  // PLAN PARA EMBARAZO
  {
    id: 'plan-007',
    nombre: 'Plan Nutricional para Embarazo',
    objetivo: 'embarazo',
    descripcion: 'Plan que cubre necesidades aumentadas de nutrientes durante el embarazo, con énfasis en folato, hierro, calcio y omega-3.',
    caloriasDiarias: 2400,
    distribucionMacronutrientes: {
      proteinas: 20,
      carbohidratos: 50,
      grasas: 30
    },
    comidasPorDia: 6,
    recomendaciones: [
      'Suplementar con ácido fólico desde antes de la concepción',
      'Aumentar ingesta de hierro (carnes rojas, legumbres, vegetales de hoja verde)',
      'Consumir calcio suficiente (1000mg/día)',
      'Incluir omega-3 para desarrollo cerebral del feto',
      'Evitar alimentos crudos, no pasteurizados y alto mercurio',
      'Mantener hidratación adecuada'
    ],
    alimentosRecomendados: ['proteina-001', 'proteina-002', 'lacteo-002', 'verdura-002', 'legumbre-001', 'fruta-001', 'grasa-002', 'cereal-002'],
    alimentosLimitados: ['pescado-002', 'queso-002', 'embutido-001'],
    notasEspeciales: 'Ajustar calorías según trimestre (+300kcal/día en 2do y 3er trimestre). Consultar con obstetra para suplementación específica.'
  }
];

// Funciones de utilidad para trabajar con planes
export const buscarPlanesPorObjetivo = (objetivo: PlanNutricionalTemplate['objetivo']): PlanNutricionalTemplate[] => {
  return planesNutricionales.filter(plan => plan.objetivo === objetivo);
};

export const obtenerPlanPorId = (id: string): PlanNutricionalTemplate | undefined => {
  return planesNutricionales.find(plan => plan.id === id);
};

export const calcularMacronutrientesEnGramos = (plan: PlanNutricionalTemplate): {
  proteinas: number;
  carbohidratos: number;
  grasas: number;
} => {
  const calorias = plan.caloriasDiarias;
  
  return {
    proteinas: Math.round((calorias * plan.distribucionMacronutrientes.proteinas / 100) / 4),
    carbohidratos: Math.round((calorias * plan.distribucionMacronutrientes.carbohidratos / 100) / 4),
    grasas: Math.round((calorias * plan.distribucionMacronutrientes.grasas / 100) / 9)
  };
};

export const adaptarPlanParaPaciente = (
  plan: PlanNutricionalTemplate, 
  peso: number, 
  nivelActividad: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo'
): PlanNutricionalTemplate => {
  // Factor de actividad para ajustar calorías
  const factoresActividad = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    activo: 1.725,
    muy_activo: 1.9
  };
  
  const factor = factoresActividad[nivelActividad];
  const caloriasAjustadas = Math.round(plan.caloriasDiarias * factor);
  
  return {
    ...plan,
    caloriasDiarias: caloriasAjustadas,
    nombre: `${plan.nombre} (Ajustado)`,
    notasEspeciales: `${plan.notasEspeciales || ''} Ajustado para peso ${peso}kg y nivel de actividad ${nivelActividad}.`
  };
};