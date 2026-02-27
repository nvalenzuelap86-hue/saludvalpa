// ============================================================================
// saludvalpa 3.0 - HOOK: usePlanesNutricionales
// Gestión de planes de alimentación personalizados
// ============================================================================

import { useState, useCallback, useEffect } from 'react';

export interface PlanNutricionalCompleto {
  id: string;
  nombre: string;
  descripcion: string;
  objetivo: 'perder_peso' | 'ganar_musculo' | 'mantener' | 'control_enfermedad' | 'rendimiento';
  requerimientos: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  comidas: ComidaPlan[];
  recomendaciones: string[];
  creadoEn: Date;
  actualizadoEn: Date;
  activo: boolean;
}

export interface ComidaPlan {
  id: string;
  nombre: string;
  horario: string;
  alimentos: AlimentoComida[];
  notas?: string;
}

export interface AlimentoComida {
  alimentoId: string;
  nombre: string;
  porcion: string;
  cantidad: number;
  nutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

export interface CrearPlanOptions {
  nombre: string;
  descripcion: string;
  objetivo: PlanNutricionalCompleto['objetivo'];
  datosPaciente: {
    edad: number;
    sexo: 'masculino' | 'femenino';
    peso: number;
    talla: number;
    actividad: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta';
  };
}

export default function usePlanesNutricionales() {
  // Estado para planes
  const [planes, setPlanes] = useState<PlanNutricionalCompleto[]>([]);
  const [planActivo, setPlanActivo] = useState<PlanNutricionalCompleto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar planes iniciales
  useEffect(() => {
    cargarPlanesIniciales();
  }, []);

  const cargarPlanesIniciales = useCallback(async () => {
    setCargando(true);
    try {
      // En una implementación real, esto cargaría desde una API o base de datos
      // Por ahora usamos datos de ejemplo
      const planesEjemplo: PlanNutricionalCompleto[] = [
        {
          id: '1',
          nombre: 'Plan Pérdida de Peso Moderada',
          descripcion: 'Plan equilibrado para pérdida de peso sostenible',
          objetivo: 'perder_peso',
          requerimientos: {
            calorias: 1800,
            proteinas: 120,
            carbohidratos: 180,
            grasas: 60,
          },
          comidas: [
            {
              id: 'c1',
              nombre: 'Desayuno',
              horario: '08:00',
              alimentos: [
                {
                  alimentoId: '1',
                  nombre: 'Huevos revueltos',
                  porcion: '2 unidades',
                  cantidad: 1,
                  nutrientes: { calorias: 140, proteinas: 12, carbohidratos: 1, grasas: 10 },
                },
                {
                  alimentoId: '2',
                  nombre: 'Pan integral',
                  porcion: '1 rebanada',
                  cantidad: 1,
                  nutrientes: { calorias: 80, proteinas: 4, carbohidratos: 15, grasas: 1 },
                },
              ],
              notas: 'Preparar con aceite de oliva en spray',
            },
            {
              id: 'c2',
              nombre: 'Colación Mañana',
              horario: '11:00',
              alimentos: [
                {
                  alimentoId: '3',
                  nombre: 'Yogurt griego',
                  porcion: '1 envase',
                  cantidad: 1,
                  nutrientes: { calorias: 100, proteinas: 17, carbohidratos: 6, grasas: 0 },
                },
              ],
            },
          ],
          recomendaciones: [
            'Beber 2L de agua diariamente',
            'Evitar alimentos procesados',
            'Realizar actividad física 3-4 veces por semana',
          ],
          creadoEn: new Date('2024-01-15'),
          actualizadoEn: new Date('2024-01-20'),
          activo: true,
        },
        {
          id: '2',
          nombre: 'Plan Ganancia Muscular',
          descripcion: 'Plan alto en proteínas para desarrollo muscular',
          objetivo: 'ganar_musculo',
          requerimientos: {
            calorias: 2800,
            proteinas: 180,
            carbohidratos: 300,
            grasas: 80,
          },
          comidas: [
            {
              id: 'c1',
              nombre: 'Desayuno',
              horario: '07:00',
              alimentos: [
                {
                  alimentoId: '4',
                  nombre: 'Avena',
                  porcion: '1 taza',
                  cantidad: 1,
                  nutrientes: { calorias: 150, proteinas: 6, carbohidratos: 27, grasas: 3 },
                },
                {
                  alimentoId: '5',
                  nombre: 'Claras de huevo',
                  porcion: '4 unidades',
                  cantidad: 1,
                  nutrientes: { calorias: 68, proteinas: 16, carbohidratos: 0, grasas: 0 },
                },
              ],
            },
          ],
          recomendaciones: [
            'Consumir proteína dentro de los 30 minutos post-entreno',
            'Dividir las comidas en 5-6 tomas al día',
            'Suplementar con creatina si es necesario',
          ],
          creadoEn: new Date('2024-02-01'),
          actualizadoEn: new Date('2024-02-05'),
          activo: false,
        },
      ];

      setPlanes(planesEjemplo);
      const activo = planesEjemplo.find(p => p.activo);
      setPlanActivo(activo || null);
      setError(null);
    } catch (err) {
      setError('Error al cargar los planes nutricionales');
      console.error('Error en cargarPlanesIniciales:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Crear nuevo plan
  const crearPlan = useCallback((options: CrearPlanOptions): PlanNutricionalCompleto => {
    const { nombre, descripcion, objetivo, datosPaciente } = options;
    
    // Calcular requerimientos basados en datos del paciente
    const requerimientos = calcularRequerimientos(datosPaciente, objetivo);
    
    const nuevoPlan: PlanNutricionalCompleto = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      objetivo,
      requerimientos,
      comidas: generarComidasIniciales(requerimientos, objetivo),
      recomendaciones: generarRecomendaciones(objetivo),
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      activo: false,
    };

    setPlanes(prev => [...prev, nuevoPlan]);
    return nuevoPlan;
  }, []);

  // Calcular requerimientos basados en datos del paciente
  const calcularRequerimientos = useCallback((
    datosPaciente: CrearPlanOptions['datosPaciente'],
    objetivo: PlanNutricionalCompleto['objetivo']
  ) => {
    const { edad, sexo, peso, talla, actividad } = datosPaciente;
    
    // Calcular TMB (Fórmula de Mifflin-St Jeor)
    let tmb;
    if (sexo === 'masculino') {
      tmb = (10 * peso) + (6.25 * talla) - (5 * edad) + 5;
    } else {
      tmb = (10 * peso) + (6.25 * talla) - (5 * edad) - 161;
    }

    // Factor de actividad
    const factoresActividad = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      atleta: 1.9,
    };

    const get = tmb * factoresActividad[actividad];

    // Ajustar según objetivo
    let caloriasObjetivo = get;
    switch (objetivo) {
      case 'perder_peso':
        caloriasObjetivo = get * 0.85; // Déficit del 15%
        break;
      case 'ganar_musculo':
        caloriasObjetivo = get * 1.15; // Superávit del 15%
        break;
      case 'control_enfermedad':
        caloriasObjetivo = get * 0.9; // Déficit leve del 10%
        break;
      case 'rendimiento':
        caloriasObjetivo = get * 1.1; // Superávit del 10%
        break;
      // 'mantener' usa GET sin ajuste
    }

    // Distribución de macronutrientes según objetivo
    let distribucion = { proteinas: 0.3, carbohidratos: 0.5, grasas: 0.2 };
    switch (objetivo) {
      case 'ganar_musculo':
        distribucion = { proteinas: 0.35, carbohidratos: 0.45, grasas: 0.2 };
        break;
      case 'perder_peso':
        distribucion = { proteinas: 0.35, carbohidratos: 0.4, grasas: 0.25 };
        break;
      case 'control_enfermedad':
        distribucion = { proteinas: 0.3, carbohidratos: 0.45, grasas: 0.25 };
        break;
    }

    const proteinas = Math.round((caloriasObjetivo * distribucion.proteinas) / 4);
    const carbohidratos = Math.round((caloriasObjetivo * distribucion.carbohidratos) / 4);
    const grasas = Math.round((caloriasObjetivo * distribucion.grasas) / 9);

    return {
      calorias: Math.round(caloriasObjetivo),
      proteinas,
      carbohidratos,
      grasas,
    };
  }, []);

  // Generar comidas iniciales basadas en requerimientos
  const generarComidasIniciales = useCallback((
    requerimientos: PlanNutricionalCompleto['requerimientos'],
    _objetivo: PlanNutricionalCompleto['objetivo']
  ): ComidaPlan[] => {
    // Distribución estándar de calorías por comida
    const distribucionCalorias = {
      desayuno: 0.25,
      colacion1: 0.1,
      comida: 0.35,
      colacion2: 0.1,
      cena: 0.2,
    };

    return [
      {
        id: 'desayuno',
        nombre: 'Desayuno',
        horario: '08:00',
        alimentos: [],
        notas: `Aprox. ${Math.round(requerimientos.calorias * distribucionCalorias.desayuno)} kcal`,
      },
      {
        id: 'colacion1',
        nombre: 'Colación Mañana',
        horario: '11:00',
        alimentos: [],
        notas: `Aprox. ${Math.round(requerimientos.calorias * distribucionCalorias.colacion1)} kcal`,
      },
      {
        id: 'comida',
        nombre: 'Comida',
        horario: '14:00',
        alimentos: [],
        notas: `Aprox. ${Math.round(requerimientos.calorias * distribucionCalorias.comida)} kcal`,
      },
      {
        id: 'colacion2',
        nombre: 'Colación Tarde',
        horario: '17:00',
        alimentos: [],
        notas: `Aprox. ${Math.round(requerimientos.calorias * distribucionCalorias.colacion2)} kcal`,
      },
      {
        id: 'cena',
        nombre: 'Cena',
        horario: '20:00',
        alimentos: [],
        notas: `Aprox. ${Math.round(requerimientos.calorias * distribucionCalorias.cena)} kcal`,
      },
    ];
  }, []);

  // Generar recomendaciones según objetivo
  const generarRecomendaciones = useCallback((objetivo: PlanNutricionalCompleto['objetivo']): string[] => {
    const recomendacionesBase = [
      'Beber al menos 2 litros de agua diariamente',
      'Consumir 5 porciones de frutas y verduras al día',
      'Limitar el consumo de alimentos ultraprocesados',
    ];

    const recomendacionesEspecificas: Record<PlanNutricionalCompleto['objetivo'], string[]> = {
      perder_peso: [
        'Controlar el tamaño de las porciones',
        'Evitar bebidas azucaradas',
        'Incluir fibra en cada comida',
      ],
      ganar_musculo: [
        'Consumir proteína en cada comida',
        'Realizar entrenamiento de fuerza regularmente',
        'Descansar adecuadamente entre entrenamientos',
      ],
      mantener: [
        'Mantener un equilibrio calórico',
        'Variar los alimentos para obtener todos los nutrientes',
        'Realizar actividad física regular',
      ],
      control_enfermedad: [
        'Seguir las indicaciones del profesional de salud',
        'Monitorear regularmente los parámetros de salud',
        'Mantener horarios regulares de comidas',
      ],
      rendimiento: [
        'Adecuar la ingesta al tipo y volumen de entrenamiento',
        'Consumir carbohidratos antes del ejercicio',
        'Reponer nutrientes post-ejercicio',
      ],
    };

    return [...recomendacionesBase, ...(recomendacionesEspecificas[objetivo] || [])];
  }, []);

  // Actualizar plan
  const actualizarPlan = useCallback((id: string, datosActualizados: Partial<PlanNutricionalCompleto>) => {
    setPlanes(prev => 
      prev.map(plan => {
        if (plan.id === id) {
          return {
            ...plan,
            ...datosActualizados,
            actualizadoEn: new Date(),
          };
        }
        return plan;
      })
    );

    if (planActivo?.id === id) {
      setPlanActivo(prev => 
        prev ? { ...prev, ...datosActualizados, actualizadoEn: new Date() } : null
      );
    }

    return true;
  }, [planActivo]);

  // Eliminar plan
  const eliminarPlan = useCallback((id: string) => {
    setPlanes(prev => prev.filter(plan => plan.id !== id));
    
    if (planActivo?.id === id) {
      setPlanActivo(null);
    }

    return true;
  }, [planActivo]);

  // Activar plan
  const activarPlan = useCallback((id: string) => {
    // Desactivar todos los planes primero
    const planesActualizados = planes.map(plan => ({
      ...plan,
      activo: plan.id === id,
    }));

    setPlanes(planesActualizados);
    
    const nuevoActivo = planesActualizados.find(p => p.id === id) || null;
    setPlanActivo(nuevoActivo);

    return true;
  }, [planes]);

  // Agregar comida a un plan
  const agregarComida = useCallback((planId: string, comida: Omit<ComidaPlan, 'id'>) => {
    const comidaConId: ComidaPlan = {
      ...comida,
      id: Date.now().toString(),
    };

    setPlanes(prev => 
      prev.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            comidas: [...plan.comidas, comidaConId],
            actualizadoEn: new Date(),
          };
        }
        return plan;
      })
    );

    if (planActivo?.id === planId) {
      setPlanActivo(prev => 
        prev ? {
          ...prev,
          comidas: [...prev.comidas, comidaConId],
          actualizadoEn: new Date(),
        } : null
      );
    }

    return comidaConId;
  }, [planActivo]);

  // Eliminar comida de un plan
  const eliminarComida = useCallback((planId: string, comidaId: string) => {
    setPlanes(prev => 
      prev.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            comidas: plan.comidas.filter(c => c.id !== comidaId),
            actualizadoEn: new Date(),
          };
        }
        return plan;
      })
    );

    if (planActivo?.id === planId) {
      setPlanActivo(prev => 
        prev ? {
          ...prev,
          comidas: prev.comidas.filter(c => c.id !== comidaId),
          actualizadoEn: new Date(),
        } : null
      );
    }

    return true;
  }, [planActivo]);

  // Calcular nutrientes totales de un plan
  const calcularNutrientesPlan = useCallback((planId: string) => {
    const plan = planes.find(p => p.id === planId);
    if (!plan) return null;

    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalCarbohidratos = 0;
    let totalGrasas = 0;

    plan.comidas.forEach(comida => {
      comida.alimentos.forEach(alimento => {
        totalCalorias += alimento.nutrientes.calorias * alimento.cantidad;
        totalProteinas += alimento.nutrientes.proteinas * alimento.cantidad;
        totalCarbohidratos += alimento.nutrientes.carbohidratos * alimento.cantidad;
        totalGrasas += alimento.nutrientes.grasas * alimento.cantidad;
      });
    });

    return {
      calorias: Math.round(totalCalorias),
      proteinas: Math.round(totalProteinas * 10) / 10,
      carbohidratos: Math.round(totalCarbohidratos * 10) / 10,
      grasas: Math.round(totalGrasas * 10) / 10,
    };
  }, [planes]);

  // Obtener planes por objetivo
  const obtenerPlanesPorObjetivo = useCallback((objetivo: PlanNutricionalCompleto['objetivo']) => {
    return planes.filter(plan => plan.objetivo === objetivo);
  }, [planes]);

  // Clonar plan existente
  const clonarPlan = useCallback((planId: string, nuevoNombre: string) => {
    const planOriginal = planes.find(p => p.id === planId);
    if (!planOriginal) return null;

    const planClonado: PlanNutricionalCompleto = {
      ...planOriginal,
      id: Date.now().toString(),
      nombre: nuevoNombre,
      descripcion: `${planOriginal.descripcion} (copia)`,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      activo: false,
    };

    setPlanes(prev => [...prev, planClonado]);
    return planClonado;
  }, [planes]);

  // Exportar plan a formato legible
  const exportarPlan = useCallback((planId: string) => {
    const plan = planes.find(p => p.id === planId);
    if (!plan) return null;

    const nutrientes = calcularNutrientesPlan(planId);
    
    return {
      ...plan,
      nutrientesCalculados: nutrientes,
      exportadoEn: new Date().toISOString(),
    };
  }, [planes, calcularNutrientesPlan]);

  return {
    // Estado
    planes,
    planActivo,
    cargando,
    error,
    
    // Acciones
    crearPlan,
    actualizarPlan,
    eliminarPlan,
    activarPlan,
    agregarComida,
    eliminarComida,
    calcularNutrientesPlan,
    obtenerPlanesPorObjetivo,
    clonarPlan,
    exportarPlan,
    
    // Utilidades
    recargarPlanes: cargarPlanesIniciales,
  };
}