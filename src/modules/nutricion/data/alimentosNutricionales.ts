// Base de datos de alimentos con información nutricional completa
// Basada en tablas de composición de alimentos (INCAP, USDA, FAO)

export interface AlimentoNutricional {
  id: string;
  nombre: string;
  categoria: 'cereales' | 'legumbres' | 'frutas' | 'verduras' | 'lacteos' | 'carnes' | 'pescados' | 'huevos' | 'grasas' | 'azucares' | 'bebidas';
  porcion: string; // Porción estándar
  calorias: number; // kcal por porción
  proteinas: number; // g por porción
  carbohidratos: number; // g por porción
  grasas: number; // g por porción
  fibra: number; // g por porción
  azucares: number; // g por porción
  sodio: number; // mg por porción
  calcio: number; // mg por porción
  hierro: number; // mg por porción
  vitaminaC: number; // mg por porción
  vitaminaA: number; // UI por porción
  indiceGlucemico?: number; // Opcional
  alergenos: string[]; // Lista de alergenos comunes
  notas?: string; // Información adicional
}

export const alimentosNutricionales: AlimentoNutricional[] = [
  // CEREALES Y GRANOS
  {
    id: 'cereal-001',
    nombre: 'Arroz blanco cocido',
    categoria: 'cereales',
    porcion: '1 taza (158g)',
    calorias: 205,
    proteinas: 4.3,
    carbohidratos: 44.5,
    grasas: 0.4,
    fibra: 0.6,
    azucares: 0.1,
    sodio: 2,
    calcio: 16,
    hierro: 1.9,
    vitaminaC: 0,
    vitaminaA: 0,
    indiceGlucemico: 73,
    alergenos: [],
    notas: 'Alto índice glucémico, preferir integral'
  },
  {
    id: 'cereal-002',
    nombre: 'Avena en hojuelas',
    categoria: 'cereales',
    porcion: '1/2 taza (40g)',
    calorias: 150,
    proteinas: 5,
    carbohidratos: 27,
    grasas: 3,
    fibra: 4,
    azucares: 1,
    sodio: 0,
    calcio: 20,
    hierro: 1.5,
    vitaminaC: 0,
    vitaminaA: 0,
    indiceGlucemico: 55,
    alergenos: ['gluten'],
    notas: 'Excelente fuente de fibra soluble (beta-glucanos)'
  },
  {
    id: 'cereal-003',
    nombre: 'Pan integral',
    categoria: 'cereales',
    porcion: '1 rebanada (28g)',
    calorias: 69,
    proteinas: 3.6,
    carbohidratos: 12,
    grasas: 1.2,
    fibra: 2,
    azucares: 1.4,
    sodio: 132,
    calcio: 20,
    hierro: 0.9,
    vitaminaC: 0,
    vitaminaA: 0,
    indiceGlucemico: 71,
    alergenos: ['gluten'],
    notas: 'Mejor opción que pan blanco por mayor fibra'
  },

  // FRUTAS
  {
    id: 'fruta-001',
    nombre: 'Manzana',
    categoria: 'frutas',
    porcion: '1 mediana (182g)',
    calorias: 95,
    proteinas: 0.5,
    carbohidratos: 25,
    grasas: 0.3,
    fibra: 4.4,
    azucares: 19,
    sodio: 2,
    calcio: 11,
    hierro: 0.2,
    vitaminaC: 8.4,
    vitaminaA: 98,
    indiceGlucemico: 36,
    alergenos: [],
    notas: 'Rica en pectina, antioxidantes y quercetina'
  },
  {
    id: 'fruta-002',
    nombre: 'Plátano',
    categoria: 'frutas',
    porcion: '1 mediano (118g)',
    calorias: 105,
    proteinas: 1.3,
    carbohidratos: 27,
    grasas: 0.4,
    fibra: 3.1,
    azucares: 14,
    sodio: 1,
    calcio: 6,
    hierro: 0.3,
    vitaminaC: 10.3,
    vitaminaA: 81,
    indiceGlucemico: 51,
    alergenos: [],
    notas: 'Excelente fuente de potasio (422mg) y energía rápida'
  },
  {
    id: 'fruta-003',
    nombre: 'Naranja',
    categoria: 'frutas',
    porcion: '1 mediana (131g)',
    calorias: 62,
    proteinas: 1.2,
    carbohidratos: 15.4,
    grasas: 0.2,
    fibra: 3.1,
    azucares: 12.2,
    sodio: 0,
    calcio: 52,
    hierro: 0.1,
    vitaminaC: 69.7,
    vitaminaA: 295,
    indiceGlucemico: 40,
    alergenos: [],
    notas: 'Excelente fuente de vitamina C, folato y potasio'
  },

  // VERDURAS
  {
    id: 'verdura-001',
    nombre: 'Brócoli cocido',
    categoria: 'verduras',
    porcion: '1 taza (156g)',
    calorias: 55,
    proteinas: 3.7,
    carbohidratos: 11.2,
    grasas: 0.6,
    fibra: 5.1,
    azucares: 2.2,
    sodio: 64,
    calcio: 62,
    hierro: 1,
    vitaminaC: 101.2,
    vitaminaA: 1207,
    indiceGlucemico: 10,
    alergenos: [],
    notas: 'Rico en sulforafano (compuesto anticancerígeno)'
  },
  {
    id: 'verdura-002',
    nombre: 'Espinaca cruda',
    categoria: 'verduras',
    porcion: '1 taza (30g)',
    calorias: 7,
    proteinas: 0.9,
    carbohidratos: 1.1,
    grasas: 0.1,
    fibra: 0.7,
    azucares: 0.1,
    sodio: 24,
    calcio: 30,
    hierro: 0.8,
    vitaminaC: 8.4,
    vitaminaA: 2813,
    indiceGlucemico: 15,
    alergenos: [],
    notas: 'Excelente fuente de hierro no hemo, vitamina K y luteína'
  },
  {
    id: 'verdura-003',
    nombre: 'Zanahoria cruda',
    categoria: 'verduras',
    porcion: '1 mediana (61g)',
    calorias: 25,
    proteinas: 0.6,
    carbohidratos: 6,
    grasas: 0.1,
    fibra: 1.7,
    azucares: 2.9,
    sodio: 42,
    calcio: 20,
    hierro: 0.2,
    vitaminaC: 3.6,
    vitaminaA: 10191,
    indiceGlucemico: 35,
    alergenos: [],
    notas: 'Excelente fuente de beta-caroteno (provitamina A)'
  },

  // PROTEÍNAS ANIMALES
  {
    id: 'proteina-001',
    nombre: 'Pechuga de pollo sin piel',
    categoria: 'carnes',
    porcion: '100g cocida',
    calorias: 165,
    proteinas: 31,
    carbohidratos: 0,
    grasas: 3.6,
    fibra: 0,
    azucares: 0,
    sodio: 74,
    calcio: 13,
    hierro: 1,
    vitaminaC: 0,
    vitaminaA: 20,
    alergenos: [],
    notas: 'Proteína magra de alta calidad, bajo en grasas saturadas'
  },
  {
    id: 'proteina-002',
    nombre: 'Salmón cocido',
    categoria: 'pescados',
    porcion: '100g',
    calorias: 206,
    proteinas: 22,
    carbohidratos: 0,
    grasas: 13,
    fibra: 0,
    azucares: 0,
    sodio: 59,
    calcio: 15,
    hierro: 0.8,
    vitaminaC: 0,
    vitaminaA: 40,
    alergenos: ['pescado'],
    notas: 'Excelente fuente de omega-3 (EPA y DHA), vitamina D'
  },
  {
    id: 'proteina-003',
    nombre: 'Huevo entero',
    categoria: 'huevos',
    porcion: '1 grande (50g)',
    calorias: 72,
    proteinas: 6.3,
    carbohidratos: 0.4,
    grasas: 4.8,
    fibra: 0,
    azucares: 0.2,
    sodio: 71,
    calcio: 28,
    hierro: 0.9,
    vitaminaC: 0,
    vitaminaA: 270,
    alergenos: ['huevo'],
    notas: 'Proteína completa, contiene colina para salud cerebral'
  },

  // LÁCTEOS
  {
    id: 'lacteo-001',
    nombre: 'Leche entera',
    categoria: 'lacteos',
    porcion: '1 taza (244g)',
    calorias: 149,
    proteinas: 7.7,
    carbohidratos: 11.7,
    grasas: 8,
    fibra: 0,
    azucares: 12.3,
    sodio: 105,
    calcio: 276,
    hierro: 0.1,
    vitaminaC: 0,
    vitaminaA: 395,
    alergenos: ['lactosa'],
    notas: 'Buena fuente de calcio, vitamina D y proteína completa'
  },
  {
    id: 'lacteo-002',
    nombre: 'Yogur natural',
    categoria: 'lacteos',
    porcion: '1 taza (245g)',
    calorias: 149,
    proteinas: 8.5,
    carbohidratos: 11.4,
    grasas: 8,
    fibra: 0,
    azucares: 11.4,
    sodio: 113,
    calcio: 296,
    hierro: 0.1,
    vitaminaC: 1.5,
    vitaminaA: 243,
    alergenos: ['lactosa'],
    notas: 'Contiene probióticos para salud intestinal'
  },
  {
    id: 'lacteo-003',
    nombre: 'Queso fresco',
    categoria: 'lacteos',
    porcion: '30g',
    calorias: 72,
    proteinas: 5,
    carbohidratos: 1,
    grasas: 5,
    fibra: 0,
    azucares: 1,
    sodio: 180,
    calcio: 150,
    hierro: 0.1,
    vitaminaC: 0,
    vitaminaA: 150,
    alergenos: ['lactosa'],
    notas: 'Menos procesado que quesos maduros, menor sodio'
  },

  // GRASAS SALUDABLES
  {
    id: 'grasa-001',
    nombre: 'Aguacate',
    categoria: 'grasas',
    porcion: '1/2 mediano (68g)',
    calorias: 114,
    proteinas: 1.3,
    carbohidratos: 6,
    grasas: 10.5,
    fibra: 4.6,
    azucares: 0.2,
    sodio: 5,
    calcio: 12,
    hierro: 0.4,
    vitaminaC: 6,
    vitaminaA: 126,
    alergenos: [],
    notas: 'Rico en grasas monoinsaturadas, potasio y fibra'
  },
  {
    id: 'grasa-002',
    nombre: 'Aceite de oliva extra virgen',
    categoria: 'grasas',
    porcion: '1 cucharada (14g)',
    calorias: 119,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 14,
    fibra: 0,
    azucares: 0,
    sodio: 0,
    calcio: 0,
    hierro: 0.1,
    vitaminaC: 0,
    vitaminaA: 0,
    alergenos: [],
    notas: 'Rico en ácido oleico y antioxidantes (polifenoles)'
  },
  {
    id: 'grasa-003',
    nombre: 'Almendras',
    categoria: 'grasas',
    porcion: '1/4 taza (28g)',
    calorias: 164,
    proteinas: 6,
    carbohidratos: 6,
    grasas: 14,
    fibra: 3.5,
    azucares: 1,
    sodio: 0,
    calcio: 76,
    hierro: 1,
    vitaminaC: 0,
    vitaminaA: 0,
    alergenos: ['frutos secos'],
    notas: 'Ricas en vitamina E, magnesio y grasas saludables'
  },

  // LEGUMBRES
  {
    id: 'legumbre-001',
    nombre: 'Frijoles negros cocidos',
    categoria: 'legumbres',
    porcion: '1/2 taza (86g)',
    calorias: 114,
    proteinas: 7.6,
    carbohidratos: 20,
    grasas: 0.5,
    fibra: 7.5,
    azucares: 0.3,
    sodio: 1,
    calcio: 23,
    hierro: 1.8,
    vitaminaC: 0,
    vitaminaA: 5,
    indiceGlucemico: 30,
    alergenos: [],
    notas: 'Excelente fuente de proteína vegetal, hierro y fibra'
  },
  {
    id: 'legumbre-002',
    nombre: 'Lentejas cocidas',
    categoria: 'legumbres',
    porcion: '1/2 taza (99g)',
    calorias: 115,
    proteinas: 9,
    carbohidratos: 20,
    grasas: 0.4,
    fibra: 8,
    azucares: 1.8,
    sodio: 2,
    calcio: 19,
    hierro: 3.3,
    vitaminaC: 1.5,
    vitaminaA: 8,
    indiceGlucemico: 32,
    alergenos: [],
    notas: 'Ricas en folato, hierro y proteína vegetal'
  }
];

// Funciones de utilidad para trabajar con alimentos
export const buscarAlimentosPorCategoria = (categoria: AlimentoNutricional['categoria']): AlimentoNutricional[] => {
  return alimentosNutricionales.filter(alimento => alimento.categoria === categoria);
};

export const buscarAlimentosPorNombre = (nombre: string): AlimentoNutricional[] => {
  const termino = nombre.toLowerCase();
  return alimentosNutricionales.filter(alimento => 
    alimento.nombre.toLowerCase().includes(termino)
  );
};

export const calcularNutrientesTotales = (alimentos: {id: string, cantidad: number}[]): {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra: number;
} => {
  let calorias = 0;
  let proteinas = 0;
  let carbohidratos = 0;
  let grasas = 0;
  let fibra = 0;

  alimentos.forEach(item => {
    const alimento = alimentosNutricionales.find(a => a.id === item.id);
    if (alimento) {
      // Asumiendo que cantidad es multiplicador de porción estándar
      calorias += alimento.calorias * item.cantidad;
      proteinas += alimento.proteinas * item.cantidad;
      carbohidratos += alimento.carbohidratos * item.cantidad;
      grasas += alimento.grasas * item.cantidad;
      fibra += alimento.fibra * item.cantidad;
    }
  });

  return { calorias, proteinas, carbohidratos, grasas, fibra };
};

export const obtenerAlimentoPorId = (id: string): AlimentoNutricional | undefined => {
  return alimentosNutricionales.find(alimento => alimento.id === id);
};

export const obtenerAlimentosPorAlergeno = (alergeno: string): AlimentoNutricional[] => {
  return alimentosNutricionales.filter(alimento =>
    alimento.alergenos.includes(alergeno)
  );
};

export const obtenerAlimentosBajoIndiceGlucemico = (limite: number = 55): AlimentoNutricional[] => {
  return alimentosNutricionales.filter(alimento =>
    alimento.indiceGlucemico !== undefined && alimento.indiceGlucemico <= limite
  );
};

export const obtenerAlimentosRicosEnNutriente = (nutriente: keyof AlimentoNutricional, limite: number): AlimentoNutricional[] => {
  return alimentosNutricionales.filter(alimento => {
    const valor = alimento[nutriente];
    return typeof valor === 'number' && valor >= limite;
  });
};