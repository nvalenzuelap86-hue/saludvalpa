// Requerimientos nutricionales por edad, sexo, condición fisiológica
// Basados en Dietary Reference Intakes (DRI), OMS, FAO

export interface RequerimientoNutricional {
  grupo: string;
  edadMin: number; // años
  edadMax: number; // años
  sexo: 'masculino' | 'femenino' | 'ambos';
  condicion?: 'embarazo' | 'lactancia' | 'actividad_intensa' | 'enfermedad';
  calorias: number; // kcal/día (promedio para actividad moderada)
  proteinas: number; // g/kg peso/día
  carbohidratos: number; // % del total calórico
  grasas: number; // % del total calórico
  fibra: number; // g/día
  agua: number; // ml/día
  micronutrientes: {
    calcio: number; // mg/día
    hierro: number; // mg/día
    zinc: number; // mg/día
    vitaminaA: number; // μg/día
    vitaminaC: number; // mg/día
    vitaminaD: number; // UI/día
    vitaminaB12: number; // μg/día
    folato: number; // μg/día
  };
  notas?: string;
}

export const requerimientosNutricionales: RequerimientoNutricional[] = [
  // NIÑOS 1-3 AÑOS
  {
    grupo: 'Niños pequeños',
    edadMin: 1,
    edadMax: 3,
    sexo: 'ambos',
    calorias: 1000,
    proteinas: 1.2,
    carbohidratos: 50,
    grasas: 40,
    fibra: 19,
    agua: 1300,
    micronutrientes: {
      calcio: 700,
      hierro: 7,
      zinc: 3,
      vitaminaA: 300,
      vitaminaC: 15,
      vitaminaD: 600,
      vitaminaB12: 0.9,
      folato: 150
    },
    notas: 'Período de crecimiento rápido. Necesidades altas de grasa para desarrollo cerebral.'
  },

  // NIÑOS 4-8 AÑOS
  {
    grupo: 'Niños',
    edadMin: 4,
    edadMax: 8,
    sexo: 'ambos',
    calorias: 1400,
    proteinas: 1.1,
    carbohidratos: 55,
    grasas: 35,
    fibra: 25,
    agua: 1700,
    micronutrientes: {
      calcio: 1000,
      hierro: 10,
      zinc: 5,
      vitaminaA: 400,
      vitaminaC: 25,
      vitaminaD: 600,
      vitaminaB12: 1.2,
      folato: 200
    },
    notas: 'Aumento de actividad física. Importante para desarrollo óseo y cognitivo.'
  },

  // NIÑOS 9-13 AÑOS
  {
    grupo: 'Preadolescentes',
    edadMin: 9,
    edadMax: 13,
    sexo: 'ambos',
    calorias: 2000,
    proteinas: 1.0,
    carbohidratos: 55,
    grasas: 30,
    fibra: 31,
    agua: 2400,
    micronutrientes: {
      calcio: 1300,
      hierro: 8,
      zinc: 8,
      vitaminaA: 600,
      vitaminaC: 45,
      vitaminaD: 600,
      vitaminaB12: 1.8,
      folato: 300
    },
    notas: 'Inicio de pubertad. Necesidades aumentadas para crecimiento acelerado.'
  },

  // ADOLESCENTES 14-18 AÑOS (MASCULINO)
  {
    grupo: 'Adolescentes',
    edadMin: 14,
    edadMax: 18,
    sexo: 'masculino',
    calorias: 2800,
    proteinas: 0.9,
    carbohidratos: 55,
    grasas: 30,
    fibra: 38,
    agua: 3300,
    micronutrientes: {
      calcio: 1300,
      hierro: 11,
      zinc: 11,
      vitaminaA: 900,
      vitaminaC: 75,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Pico de crecimiento. Alta demanda de energía y nutrientes para desarrollo muscular y óseo.'
  },

  // ADOLESCENTES 14-18 AÑOS (FEMENINO)
  {
    grupo: 'Adolescentes',
    edadMin: 14,
    edadMax: 18,
    sexo: 'femenino',
    calorias: 2200,
    proteinas: 0.9,
    carbohidratos: 55,
    grasas: 30,
    fibra: 26,
    agua: 2300,
    micronutrientes: {
      calcio: 1300,
      hierro: 15,
      zinc: 9,
      vitaminaA: 700,
      vitaminaC: 65,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Inicio de menstruación. Necesidades aumentadas de hierro. Importante para desarrollo óseo.'
  },

  // ADULTOS 19-30 AÑOS (MASCULINO)
  {
    grupo: 'Adultos jóvenes',
    edadMin: 19,
    edadMax: 30,
    sexo: 'masculino',
    calorias: 2600,
    proteinas: 0.8,
    carbohidratos: 50,
    grasas: 30,
    fibra: 38,
    agua: 3700,
    micronutrientes: {
      calcio: 1000,
      hierro: 8,
      zinc: 11,
      vitaminaA: 900,
      vitaminaC: 90,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Mantenimiento de masa muscular y ósea. Prevención de enfermedades crónicas.'
  },

  // ADULTOS 19-30 AÑOS (FEMENINO)
  {
    grupo: 'Adultos jóvenes',
    edadMin: 19,
    edadMax: 30,
    sexo: 'femenino',
    calorias: 2000,
    proteinas: 0.8,
    carbohidratos: 50,
    grasas: 30,
    fibra: 25,
    agua: 2700,
    micronutrientes: {
      calcio: 1000,
      hierro: 18,
      zinc: 8,
      vitaminaA: 700,
      vitaminaC: 75,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Edad reproductiva. Importante ingesta de hierro y folato para posibles embarazos.'
  },

  // ADULTOS 31-50 AÑOS (MASCULINO)
  {
    grupo: 'Adultos medios',
    edadMin: 31,
    edadMax: 50,
    sexo: 'masculino',
    calorias: 2400,
    proteinas: 0.8,
    carbohidratos: 50,
    grasas: 30,
    fibra: 38,
    agua: 3700,
    micronutrientes: {
      calcio: 1000,
      hierro: 8,
      zinc: 11,
      vitaminaA: 900,
      vitaminaC: 90,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Prevención de ganancia de peso. Mantenimiento de masa muscular y densidad ósea.'
  },

  // ADULTOS 31-50 AÑOS (FEMENINO)
  {
    grupo: 'Adultos medios',
    edadMin: 31,
    edadMax: 50,
    sexo: 'femenino',
    calorias: 1900,
    proteinas: 0.8,
    carbohidratos: 50,
    grasas: 30,
    fibra: 25,
    agua: 2700,
    micronutrientes: {
      calcio: 1000,
      hierro: 18,
      zinc: 8,
      vitaminaA: 700,
      vitaminaC: 75,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Perimenopausia. Importante para mantener densidad ósea y prevenir osteoporosis.'
  },

  // ADULTOS 51-70 AÑOS (MASCULINO)
  {
    grupo: 'Adultos mayores',
    edadMin: 51,
    edadMax: 70,
    sexo: 'masculino',
    calorias: 2200,
    proteinas: 1.0,
    carbohidratos: 50,
    grasas: 30,
    fibra: 30,
    agua: 3700,
    micronutrientes: {
      calcio: 1000,
      hierro: 8,
      zinc: 11,
      vitaminaA: 900,
      vitaminaC: 90,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Aumento de necesidades proteicas para prevenir sarcopenia. Mayor requerimiento de vitamina D.'
  },

  // ADULTOS 51-70 AÑOS (FEMENINO)
  {
    grupo: 'Adultos mayores',
    edadMin: 51,
    edadMax: 70,
    sexo: 'femenino',
    calorias: 1800,
    proteinas: 1.0,
    carbohidratos: 50,
    grasas: 30,
    fibra: 21,
    agua: 2700,
    micronutrientes: {
      calcio: 1200,
      hierro: 8,
      zinc: 8,
      vitaminaA: 700,
      vitaminaC: 75,
      vitaminaD: 600,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Postmenopausia. Alta necesidad de calcio y vitamina D para prevenir osteoporosis.'
  },

  // ADULTOS >70 AÑOS (MASCULINO)
  {
    grupo: 'Adultos muy mayores',
    edadMin: 71,
    edadMax: 120,
    sexo: 'masculino',
    calorias: 2000,
    proteinas: 1.2,
    carbohidratos: 50,
    grasas: 30,
    fibra: 30,
    agua: 3700,
    micronutrientes: {
      calcio: 1200,
      hierro: 8,
      zinc: 11,
      vitaminaA: 900,
      vitaminaC: 90,
      vitaminaD: 800,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Alta necesidad de proteína para prevenir sarcopenia. Suplementación de vitamina D recomendada.'
  },

  // ADULTOS >70 AÑOS (FEMENINO)
  {
    grupo: 'Adultos muy mayores',
    edadMin: 71,
    edadMax: 120,
    sexo: 'femenino',
    calorias: 1600,
    proteinas: 1.2,
    carbohidratos: 50,
    grasas: 30,
    fibra: 21,
    agua: 2700,
    micronutrientes: {
      calcio: 1200,
      hierro: 8,
      zinc: 8,
      vitaminaA: 700,
      vitaminaC: 75,
      vitaminaD: 800,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Alto riesgo de desnutrición. Necesidad aumentada de proteína, calcio y vitamina D.'
  },

  // EMBARAZO (2do y 3er trimestre)
  {
    grupo: 'Embarazo',
    edadMin: 18,
    edadMax: 45,
    sexo: 'femenino',
    condicion: 'embarazo',
    calorias: 2400,
    proteinas: 1.1,
    carbohidratos: 50,
    grasas: 30,
    fibra: 28,
    agua: 3000,
    micronutrientes: {
      calcio: 1000,
      hierro: 27,
      zinc: 11,
      vitaminaA: 770,
      vitaminaC: 85,
      vitaminaD: 600,
      vitaminaB12: 2.6,
      folato: 600
    },
    notas: 'Aumento de 300 kcal/día en 2do y 3er trimestre. Suplementación de hierro y folato esencial.'
  },

  // LACTANCIA
  {
    grupo: 'Lactancia',
    edadMin: 18,
    edadMax: 45,
    sexo: 'femenino',
    condicion: 'lactancia',
    calorias: 2600,
    proteinas: 1.3,
    carbohidratos: 50,
    grasas: 30,
    fibra: 29,
    agua: 3800,
    micronutrientes: {
      calcio: 1000,
      hierro: 9,
      zinc: 12,
      vitaminaA: 1300,
      vitaminaC: 120,
      vitaminaD: 600,
      vitaminaB12: 2.8,
      folato: 500
    },
    notas: 'Aumento de 500 kcal/día. Alta demanda de calcio, vitamina A y líquidos.'
  },

  // ATLETAS DE RESISTENCIA
  {
    grupo: 'Atletas resistencia',
    edadMin: 18,
    edadMax: 50,
    sexo: 'ambos',
    condicion: 'actividad_intensa',
    calorias: 3500,
    proteinas: 1.4,
    carbohidratos: 60,
    grasas: 25,
    fibra: 38,
    agua: 5000,
    micronutrientes: {
      calcio: 1000,
      hierro: 18,
      zinc: 15,
      vitaminaA: 900,
      vitaminaC: 200,
      vitaminaD: 1000,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Alto requerimiento de carbohidratos para glucógeno. Mayor necesidad de hierro y antioxidantes.'
  },

  // ATLETAS DE FUERZA
  {
    grupo: 'Atletas fuerza',
    edadMin: 18,
    edadMax: 50,
    sexo: 'ambos',
    condicion: 'actividad_intensa',
    calorias: 3200,
    proteinas: 1.8,
    carbohidratos: 50,
    grasas: 30,
    fibra: 38,
    agua: 4500,
    micronutrientes: {
      calcio: 1000,
      hierro: 18,
      zinc: 15,
      vitaminaA: 900,
      vitaminaC: 200,
      vitaminaD: 1000,
      vitaminaB12: 2.4,
      folato: 400
    },
    notas: 'Alta demanda de proteína para síntesis muscular. Mayor necesidad de creatina y aminoácidos.'
  }
];

// Funciones de utilidad para trabajar con requerimientos
export const obtenerRequerimientoPorEdadSexo = (
  edad: number, 
  sexo: 'masculino' | 'femenino', 
  condicion?: RequerimientoNutricional['condicion']
): RequerimientoNutricional | undefined => {
  return requerimientosNutricionales.find(req => {
    const edadOk = edad >= req.edadMin && edad <= req.edadMax;
    const sexoOk = req.sexo === 'ambos' || req.sexo === sexo;
    const condicionOk = !condicion || req.condicion === condicion;
    
    return edadOk && sexoOk && condicionOk;
  });
};

export const calcularRequerimientosPersonalizados = (
  peso: number,
  altura: number,
  edad: number,
  sexo: 'masculino' | 'femenino',
  nivelActividad: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo',
  objetivo: 'mantenimiento' | 'perdida_peso' | 'ganancia_peso' = 'mantenimiento'
): {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
} => {
  // Cálculo de TMB (Mifflin-St Jeor)
  let tmb: number;
  if (sexo === 'masculino') {
    tmb = 10 * peso + 6.25 * altura - 5 * edad + 5;
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * edad - 161;
  }
  
  // Factores de actividad
  const factores = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    activo: 1.725,
    muy_activo: 1.9
  };
  
  const factor = factores[nivelActividad];
  let calorias = Math.round(tmb * factor);
  
  // Ajuste según objetivo
  if (objetivo === 'perdida_peso') {
    calorias = Math.round(calorias * 0.85); // Déficit del 15%
  } else if (objetivo === 'ganancia_peso') {
    calorias = Math.round(calorias * 1.15); // Superávit del 15%
  }
  
  // Distribución de macronutrientes según objetivo
  let distribucionProteinas: number;
  let distribucionCarbohidratos: number;
  let distribucionGrasas: number;
  
  if (objetivo === 'perdida_peso') {
    distribucionProteinas = 30;
    distribucionCarbohidratos = 40;
    distribucionGrasas = 30;
  } else if (objetivo === 'ganancia_peso') {
    distribucionProteinas = 25;
    distribucionCarbohidratos = 50;
    distribucionGrasas = 25;
  } else {
    distribucionProteinas = 20;
    distribucionCarbohidratos = 50;
    distribucionGrasas = 30;
  }
  
  // Calcular gramos de cada macronutriente
  const proteinas = Math.round((calorias * distribucionProteinas / 100) / 4);
  const carbohidratos = Math.round((calorias * distribucionCarbohidratos / 100) / 4);
  const grasas = Math.round((calorias * distribucionGrasas / 100) / 9);
  
  return {
    calorias,
    proteinas,
    carbohidratos,
    grasas
  };
};

export const calcularRequerimientosMicronutrientes = (
  edad: number,
  sexo: 'masculino' | 'femenino',
  condicion?: RequerimientoNutricional['condicion']
): RequerimientoNutricional['micronutrientes'] | undefined => {
  const requerimiento = obtenerRequerimientoPorEdadSexo(edad, sexo, condicion);
  return requerimiento?.micronutrientes;
};

export const obtenerRecomendacionesEspeciales = (
  edad: number,
  sexo: 'masculino' | 'femenino',
  condicion?: RequerimientoNutricional['condicion']
): string[] => {
  const recomendaciones: string[] = [];
  const requerimiento = obtenerRequerimientoPorEdadSexo(edad, sexo, condicion);
  
  if (requerimiento) {
    if (requerimiento.notas) {
      recomendaciones.push(requerimiento.notas);
    }
    
    // Recomendaciones generales según grupo
    if (requerimiento.grupo.includes('Niños') || requerimiento.grupo.includes('Adolescentes')) {
      recomendaciones.push('Importante para crecimiento y desarrollo. Asegurar variedad de alimentos.');
    }
    
    if (requerimiento.grupo.includes('Adultos mayores')) {
      recomendaciones.push('Mayor riesgo de desnutrición. Priorizar alimentos ricos en nutrientes.');
      recomendaciones.push('Considerar suplementación de vitamina D y B12 si hay deficiencia.');
    }
    
    if (requerimiento.condicion === 'embarazo') {
      recomendaciones.push('Suplementación de ácido fólico esencial desde antes de la concepción.');
      recomendaciones.push('Evitar alimentos crudos y alto contenido de mercurio.');
    }
    
    if (requerimiento.condicion === 'lactancia') {
      recomendaciones.push('Aumentar ingesta de líquidos a 3-4 litros diarios.');
      recomendaciones.push('Evitar alcohol y limitar cafeína.');
    }
    
    if (requerimiento.condicion === 'actividad_intensa') {
      recomendaciones.push('Adecuar hidratación según duración e intensidad del ejercicio.');
      recomendaciones.push('Consumir carbohidratos antes y proteínas después del ejercicio.');
    }
  }
  
  return recomendaciones;
};