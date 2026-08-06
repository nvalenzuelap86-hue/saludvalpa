// ============================================================================
// saludvalpa 3.0 - HOOK: usePlanesAlimentacion
// Gestión de planes de alimentación con persistencia en IndexedDB
// Sigue el patrón de useRutinas.ts para consistencia
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import type { PlanAlimentacion, ComidaEnPlan, ComidaEnDia, SeguimientoNutricional, FiltrosPlanes, EstadisticasPlanes, CrearPlanOptions, RecetaPersonalizada, MenuCycle } from '../../../types/nutricion';
import { v4 as uuidv4 } from 'uuid';

export function usePlanesAlimentacion() {
  // ============================================================================
  // QUERIES REACTIVAS (useLiveQuery)
  // ============================================================================

  const planes = useLiveQuery(
    () => db.planesAlimentacion
      .orderBy('fechaCreacion')
      .reverse()
      .toArray(),
    []
  ) || [];

  const planesActivos = useLiveQuery(
    () => db.planesAlimentacion
      .where('activo').equals(1)
      .toArray(),
    []
  ) || [];

  const plantillas = useLiveQuery(
    () => db.planesAlimentacion
      .where('esPlantilla').equals(1)
      .toArray(),
    []
  ) || [];

  // Recetas personalizadas del usuario
  const recetas = useLiveQuery(
    () => db.recetas
      .orderBy('fechaCreacion')
      .reverse()
      .toArray(),
    []
  ) || [];

  // Ciclos de menú (repetición semanal)
  const menuCycles = useLiveQuery(
    () => db.menuCycles
      .orderBy('fechaCreacion')
      .reverse()
      .toArray(),
    []
  ) || [];

  // ============================================================================
  // FUNCIONES CRUD
  // ============================================================================

  /**
   * Obtener planes asignados a un paciente específico
   */
  const obtenerPlanesPaciente = async (pacienteId: string): Promise<PlanAlimentacion[]> => {
    return db.planesAlimentacion
      .where('pacienteId').equals(pacienteId)
      .reverse()
      .sortBy('fechaCreacion');
  };

  /**
   * Obtener un plan completo con todas sus comidas
   */
  const obtenerPlanCompleto = async (id: string) => {
    const plan = await db.planesAlimentacion.get(id);
    if (!plan) return null;

    const comidas = await db.comidas
      .where('planId').equals(id)
      .sortBy('orden');

    // Organizar comidas por tipo
    const distribucionComidas = {
      desayuno: comidas.filter(c => c.tipo === 'desayuno'),
      colacion1: comidas.filter(c => c.tipo === 'colacion1'),
      comida: comidas.filter(c => c.tipo === 'comida'),
      colacion2: comidas.filter(c => c.tipo === 'colacion2'),
      cena: comidas.filter(c => c.tipo === 'cena'),
    };

    return { ...plan, distribucionComidas };
  };

  /**
   * Crear un nuevo plan de alimentación
   */
  const crearPlan = async (
    nombre: string,
    descripcion: string,
    objetivo: PlanAlimentacion['objetivo'],
    opciones?: {
      pacienteId?: string;
      esPlantilla?: boolean;
      requerimientos?: PlanAlimentacion['requerimientos'];
      distribucionComidas?: PlanAlimentacion['distribucionComidas'];
      comidasPorDia?: ComidaEnDia[];
      recomendaciones?: string[];
    }
  ): Promise<string> => {
    const id = uuidv4();
    const now = new Date();

    const nuevoPlan: PlanAlimentacion = {
      id,
      nombre,
      descripcion,
      objetivo,
      pacienteId: opciones?.pacienteId,
      esPlantilla: opciones?.esPlantilla || false,
      activo: true,
      requerimientos: opciones?.requerimientos || {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
      },
      distribucionComidas: opciones?.distribucionComidas || {
        desayuno: [],
        colacion1: [],
        comida: [],
        colacion2: [],
        cena: [],
      },
      comidasPorDia: opciones?.comidasPorDia,
      recomendaciones: opciones?.recomendaciones || [],
      fechaCreacion: now,
      fechaActualizacion: now,
      profesion: 'nutricion',
    };

    await db.planesAlimentacion.add(nuevoPlan);

    // Guardar comidas individualmente en la tabla comidas
    const todasLasComidas = [
      ...nuevoPlan.distribucionComidas.desayuno,
      ...nuevoPlan.distribucionComidas.colacion1,
      ...nuevoPlan.distribucionComidas.comida,
      ...nuevoPlan.distribucionComidas.colacion2,
      ...nuevoPlan.distribucionComidas.cena,
    ];

    if (todasLasComidas.length > 0) {
      await db.comidas.bulkAdd(todasLasComidas.map(c => ({
        ...c,
        planId: id,
        fechaCreacion: now,
      })));
    }

    return id;
  };

  /**
   * Actualizar un plan existente
   */
  const actualizarPlan = async (
    id: string,
    datosActualizados: Partial<PlanAlimentacion>
  ): Promise<void> => {
    const updates = {
      ...datosActualizados,
      fechaActualizacion: new Date(),
    };
    await db.planesAlimentacion.update(id, updates);
  };

  /**
   * Eliminar un plan y todas sus comidas asociadas
   */
  const eliminarPlan = async (id: string): Promise<void> => {
    await db.planesAlimentacion.delete(id);
    await db.comidas.where('planId').equals(id).delete();
    await db.seguimientoNutricional.where('planId').equals(id).delete();
  };

  /**
   * Duplicar un plan (como plantilla o copia)
   */
  const duplicarPlan = async (id: string, nuevoNombre: string): Promise<string> => {
    const original = await db.planesAlimentacion.get(id);
    if (!original) throw new Error('Plan no encontrado');

    const nuevoId = uuidv4();
    const now = new Date();

    const copia: PlanAlimentacion = {
      ...original,
      id: nuevoId,
      nombre: nuevoNombre,
      pacienteId: undefined,
      esPlantilla: true,
      activo: false,
      fechaCreacion: now,
      fechaActualizacion: now,
    };

    await db.planesAlimentacion.add(copia);

    // Duplicar comidas
    const comidasOriginales = await db.comidas.where('planId').equals(id).toArray();
    if (comidasOriginales.length > 0) {
      const nuevasComidas = comidasOriginales.map(c => ({
        ...c,
        id: uuidv4(),
        planId: nuevoId,
        fechaCreacion: now,
      }));
      await db.comidas.bulkAdd(nuevasComidas);
    }

    return nuevoId;
  };

  // ============================================================================
  // ASIGNACIÓN A PACIENTES
  // ============================================================================

  /**
   * Asignar un plan a un paciente
   */
  const asignarAPaciente = async (planId: string, pacienteId: string): Promise<void> => {
    await db.planesAlimentacion.update(planId, {
      pacienteId,
      activo: true,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Desasignar un plan de un paciente
   */
  const desasignarDePaciente = async (planId: string): Promise<void> => {
    await db.planesAlimentacion.update(planId, {
      pacienteId: undefined,
      activo: false,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Activar o desactivar un plan
   */
  const toggleActivo = async (id: string): Promise<void> => {
    const plan = await db.planesAlimentacion.get(id);
    if (plan) {
      await db.planesAlimentacion.update(id, {
        activo: !plan.activo,
        fechaActualizacion: new Date(),
      });
    }
  };

  /**
   * Convertir un plan en plantilla
   */
  const convertirEnPlantilla = async (id: string): Promise<void> => {
    await db.planesAlimentacion.update(id, {
      esPlantilla: true,
      pacienteId: undefined,
      fechaActualizacion: new Date(),
    });
  };

  // ============================================================================
  // GESTIÓN DE COMIDAS DENTRO DE UN PLAN
  // ============================================================================

  /**
   * Agregar una comida a un plan
   */
  const agregarComida = async (
    planId: string,
    tipo: ComidaEnPlan['tipo'],
    comida: Omit<ComidaEnPlan, 'id' | 'tipo'>
  ): Promise<void> => {
    const plan = await db.planesAlimentacion.get(planId);
    if (!plan) throw new Error('Plan no encontrado');

    const nuevaComida: ComidaEnPlan = {
      ...comida,
      id: uuidv4(),
      tipo,
    };

    // Guardar en tabla de comidas
    await db.comidas.add({
      ...nuevaComida,
      planId,
      fechaCreacion: new Date(),
    });

    // Actualizar distribución en el plan
    const distribucion = { ...plan.distribucionComidas };
    distribucion[tipo] = [...(distribucion[tipo] || []), nuevaComida];

    await db.planesAlimentacion.update(planId, {
      distribucionComidas: distribucion,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Eliminar una comida de un plan
   */
  const eliminarComida = async (planId: string, comidaId: string): Promise<void> => {
    const plan = await db.planesAlimentacion.get(planId);
    if (!plan) throw new Error('Plan no encontrado');

    // Eliminar de tabla de comidas
    await db.comidas.delete(comidaId);

    // Actualizar distribución en el plan
    const distribucion = { ...plan.distribucionComidas };
    for (const tipo of Object.keys(distribucion) as ComidaEnPlan['tipo'][]) {
      distribucion[tipo] = distribucion[tipo].filter(c => c.id !== comidaId);
    }

    await db.planesAlimentacion.update(planId, {
      distribucionComidas: distribucion,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Personalizar una comida (sustituir ingredientes, ajustar porciones)
   */
  const personalizarComida = async (
    planId: string,
    comidaId: string,
    cambios: Partial<ComidaEnPlan>
  ): Promise<void> => {
    const plan = await db.planesAlimentacion.get(planId);
    if (!plan) throw new Error('Plan no encontrado');

    // Actualizar en tabla de comidas
    await db.comidas.update(comidaId, cambios);

    // Actualizar en la distribución del plan
    const distribucion = { ...plan.distribucionComidas };
    for (const tipo of Object.keys(distribucion) as ComidaEnPlan['tipo'][]) {
      const index = distribucion[tipo].findIndex(c => c.id === comidaId);
      if (index !== -1) {
        distribucion[tipo][index] = { ...distribucion[tipo][index], ...cambios };
        break;
      }
    }

    await db.planesAlimentacion.update(planId, {
      distribucionComidas: distribucion,
      personalizacionesActivas: true,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Recalcular nutrientes totales de un plan basado en sus comidas
   */
  const calcularNutrientesPlan = async (planId: string) => {
    const plan = await db.planesAlimentacion.get(planId);
    if (!plan) return null;

    const todasLasComidas = [
      ...plan.distribucionComidas.desayuno,
      ...plan.distribucionComidas.colacion1,
      ...plan.distribucionComidas.comida,
      ...plan.distribucionComidas.colacion2,
      ...plan.distribucionComidas.cena,
    ];

    const totales = todasLasComidas.reduce(
      (acc, comida) => {
        const mult = comida.porcionMultiplicador || 1;
        acc.calorias += Math.round((comida.nutrientes.calorias || 0) * mult);
        acc.proteinas += Math.round((comida.nutrientes.proteinas || 0) * mult);
        acc.carbohidratos += Math.round((comida.nutrientes.carbohidratos || 0) * mult);
        acc.grasas += Math.round((comida.nutrientes.grasas || 0) * mult);
        return acc;
      },
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );

    return totales;
  };

  // ============================================================================
  // FILTROS
  // ============================================================================

  /**
   * Filtrar planes según criterios
   */
  const filtrarPlanes = async (filtros: FiltrosPlanes): Promise<PlanAlimentacion[]> => {
    let resultados = [...planes];

    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
      );
    }

    if (filtros.objetivo) {
      resultados = resultados.filter(p => p.objetivo === filtros.objetivo);
    }

    if (filtros.activo !== undefined) {
      resultados = resultados.filter(p => p.activo === filtros.activo);
    }

    if (filtros.esPlantilla !== undefined) {
      resultados = resultados.filter(p => p.esPlantilla === filtros.esPlantilla);
    }

    if (filtros.pacienteId) {
      resultados = resultados.filter(p => p.pacienteId === filtros.pacienteId);
    }

    // Ordenar
    const direccion = filtros.ordenDireccion === 'asc' ? 1 : -1;
    switch (filtros.ordenarPor) {
      case 'nombre':
        resultados.sort((a, b) => direccion * a.nombre.localeCompare(b.nombre));
        break;
      case 'calorias':
        resultados.sort((a, b) => direccion * (a.requerimientos.calorias - b.requerimientos.calorias));
        break;
      case 'fecha':
      default:
        resultados.sort((a, b) => direccion * (new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()));
        break;
    }

    return resultados;
  };

  // ============================================================================
  // SEGUIMIENTO NUTRICIONAL
  // ============================================================================

  /**
   * Registrar seguimiento de un plan
   */
  const registrarSeguimiento = async (
    planId: string,
    pacienteId: string,
    datos: {
      cumplimiento: number;
      comidasRealizadas: string[];
      comidasSaltadas: string[];
      dificultades: string[];
      peso?: number;
      observaciones?: string;
    }
  ): Promise<void> => {
    const seguimiento: SeguimientoNutricional = {
      id: uuidv4(),
      planId,
      pacienteId,
      fecha: new Date(),
      cumplimiento: datos.cumplimiento,
      comidasRealizadas: datos.comidasRealizadas,
      comidasSaltadas: datos.comidasSaltadas,
      dificultades: datos.dificultades,
      peso: datos.peso,
      observaciones: datos.observaciones,
      profesion: 'nutricion',
      fechaCreacion: new Date(),
    };

    await db.seguimientoNutricional.add(seguimiento);
  };

  /**
   * Obtener seguimiento de un plan
   */
  const obtenerSeguimiento = async (planId: string): Promise<SeguimientoNutricional[]> => {
    return db.seguimientoNutricional
      .where('planId').equals(planId)
      .reverse()
      .sortBy('fecha');
  };

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  /**
   * Obtener estadísticas generales de planes
   */
  const obtenerEstadisticas = async (): Promise<EstadisticasPlanes> => {
    const todosPlanes = planes;
    const pacientesConPlan = new Set(
      todosPlanes.filter(p => p.pacienteId).map(p => p.pacienteId)
    );

    const planesPorObjetivo: Record<string, number> = {};
    todosPlanes.forEach(p => {
      planesPorObjetivo[p.objetivo] = (planesPorObjetivo[p.objetivo] || 0) + 1;
    });

    // Calcular cumplimiento promedio
    const seguimientos = await db.seguimientoNutricional.toArray();
    const cumplimientoPromedio = seguimientos.length > 0
      ? Math.round(seguimientos.reduce((sum, s) => sum + s.cumplimiento, 0) / seguimientos.length)
      : 0;

    return {
      totalPlanes: todosPlanes.length,
      planesActivos: todosPlanes.filter(p => p.activo).length,
      plantillas: todosPlanes.filter(p => p.esPlantilla).length,
      planesPorObjetivo,
      cumplimientoPromedio,
      pacientesConPlan: pacientesConPlan.size,
    };
  };

  /**
   * Obtener adherencia de un paciente a un plan específico
   */
  const obtenerAdherencia = async (planId: string) => {
    const seguimientos = await db.seguimientoNutricional
      .where('planId').equals(planId)
      .toArray();

    if (seguimientos.length === 0) {
      return {
        total: 0,
        promedio: 0,
        tendencia: 'sin_datos' as const,
        historial: [],
      };
    }

    const historial = seguimientos
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .map(s => ({
        fecha: s.fecha,
        cumplimiento: s.cumplimiento,
        peso: s.peso,
        dificultades: s.dificultades,
      }));

    const promedio = Math.round(
      seguimientos.reduce((sum, s) => sum + s.cumplimiento, 0) / seguimientos.length
    );

    // Determinar tendencia (comparar últimos 3 vs primeros 3)
    let tendencia: 'mejorando' | 'estable' | 'empeorando' | 'sin_datos' = 'sin_datos';
    if (seguimientos.length >= 3) {
      const recientes = seguimientos.slice(-3);
      const antiguos = seguimientos.slice(0, 3);
      const promReciente = recientes.reduce((s, r) => s + r.cumplimiento, 0) / 3;
      const promAntiguo = antiguos.reduce((s, r) => s + r.cumplimiento, 0) / 3;
      
      if (promReciente > promAntiguo + 5) tendencia = 'mejorando';
      else if (promReciente < promAntiguo - 5) tendencia = 'empeorando';
      else tendencia = 'estable';
    }

    return {
      total: seguimientos.length,
      promedio,
      tendencia,
      historial,
    };
  };

  // ============================================================================
  // LISTA DE COMPRAS (desde plan semanal)
  // ============================================================================

  /**
   * Generar lista de compras a partir de las comidas de un plan semanal
   * Agrega todos los ingredientes de todas las comidas de todos los días
   * y los agrupa por categoría
   */
  const generarListaCompras = async (planId: string): Promise<{
    ingredientes: { nombre: string; cantidad: string; categoria: string }[];
    totalCalorias: number;
    totalProteinas: number;
    totalCarbohidratos: number;
    totalGrasas: number;
  }> => {
    const plan = await db.planesAlimentacion.get(planId);
    if (!plan) {
      throw new Error('Plan no encontrado');
    }

    // Obtener todas las comidas del plan (de comidasPorDia o distribucionComidas)
    let todasLasComidas: ComidaEnPlan[] = [];

    if (plan.comidasPorDia && plan.comidasPorDia.length > 0) {
      // Usar estructura semanal
      plan.comidasPorDia.forEach((dia: ComidaEnDia) => {
        todasLasComidas = [...todasLasComidas, ...dia.comidas];
      });
    } else {
      // Usar estructura plana (backward compatibility)
      const distribucion = plan.distribucionComidas;
      todasLasComidas = [
        ...distribucion.desayuno,
        ...distribucion.colacion1,
        ...distribucion.comida,
        ...distribucion.colacion2,
        ...distribucion.cena,
      ];
    }

    // Agrupar ingredientes por nombre
    const ingredientesMap = new Map<string, { nombre: string; cantidad: string; categoria: string; count: number }>();

    // Categorías de ingredientes para agrupar
    const categoriasIngredientes: { patrones: RegExp[]; categoria: string }[] = [
      { patrones: [/pollo/i, /pavo/i, /pescado/i, /salmón/i, /atún/i, /res/i, /cerdo/i, /carne/i, /huevo/i, /claras/i], categoria: 'Proteinas' },
      { patrones: [/brócoli/i, /espinaca/i, /lechuga/i, /jitomate/i, /tomate/i, /cebolla/i, /pimiento/i, /calabacín/i, /zanahoria/i, /apio/i, /pepino/i, /coliflor/i, /repollo/i, /calabaza/i, /champiñón/i, /verdura/i, /espárrago/i], categoria: 'Verduras' },
      { patrones: [/manzana/i, /plátano/i, /fresa/i, /arándano/i, /mango/i, /limón/i, /aguacate/i, /fruta/i, /berry/i], categoria: 'Frutas' },
      { patrones: [/arroz/i, /pasta/i, /pan/i, /tortilla/i, /avena/i, /quinoa/i, /amaranto/i, /granola/i, /hotcake/i], categoria: 'Cereales y Tubérculos' },
      { patrones: [/lenteja/i, /garbanzo/i, /frijol/i, /tofu/i, /soya/i], categoria: 'Leguminosas' },
      { patrones: [/leche/i, /yogurt/i, /queso/i, /crema/i, /mantequilla/i, /parmesano/i], categoria: 'Lácteos' },
      { patrones: [/aceite/i, /nuez/i, /almendra/i, /cacahuate/i, /pistache/i, /piñón/i, /coco/i, /chía/i, /ajonjolí/i], categoria: 'Aceites y Semillas' },
      { patrones: [/miel/i, /azúcar/i, /chocolate/i, /cacao/i], categoria: 'Endulzantes' },
      { patrones: [/sal/i, /pimienta/i, /canela/i, /comino/i, /orégano/i, /laurel/i, /romero/i, /tomillo/i, /eneldo/i, /jengibre/i, /ajo/i, /vainilla/i, /chile/i, /especia/i, /hierba/i], categoria: 'Especias y Condimentos' },
    ];

    todasLasComidas.forEach((comida) => {
      const mult = comida.porcionMultiplicador || 1;
      (comida.ingredientes || []).forEach((ingrediente) => {
        // Limpiar cantidad del ingrediente (ej: "1 taza de espinacas" -> "espinacas")
        const nombreLimpio = ingrediente.replace(/^[\d\/\s\.]+(taza|cdas|cdta|cda|pieza|unidad|pizca|rebanada|rodaja|trozos|filete|scoop|ramita|diente|hoja|puñado|manojo|bolsa|paquete|lata|frasco|botella|vaso)?(s)?\s+(de\s+)?/i, '').trim();
        
        // Extraer cantidad si existe
        const cantidadMatch = ingrediente.match(/^([\d\/\s\.]+)/);
        const cantidadBase = cantidadMatch ? cantidadMatch[1].trim() : '1';
        const unidadMatch = ingrediente.match(/^[\d\/\s\.]+\s*([a-zA-Záéíóúñ]+)/);
        const unidad = unidadMatch ? unidadMatch[1] : '';

        // Determinar categoría
        let categoria = 'Otros';
        for (const grupo of categoriasIngredientes) {
          if (grupo.patrones.some(p => p.test(nombreLimpio) || p.test(ingrediente))) {
            categoria = grupo.categoria;
            break;
          }
        }

        const key = nombreLimpio.toLowerCase();
        const existing = ingredientesMap.get(key);
        if (existing) {
          existing.count += mult;
        } else {
          ingredientesMap.set(key, {
            nombre: nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1),
            cantidad: `${cantidadBase} ${unidad}`.trim(),
            categoria,
            count: mult,
          });
        }
      });
    });

    // Calcular totales de nutrientes
    const totalCalorias = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.calorias || 0) * (c.porcionMultiplicador || 1)), 0);
    const totalProteinas = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.proteinas || 0) * (c.porcionMultiplicador || 1)), 0);
    const totalCarbohidratos = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.carbohidratos || 0) * (c.porcionMultiplicador || 1)), 0);
    const totalGrasas = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.grasas || 0) * (c.porcionMultiplicador || 1)), 0);

    // Ordenar por categoría
    const ingredientes = Array.from(ingredientesMap.values())
      .sort((a, b) => {
        if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
        return a.nombre.localeCompare(b.nombre);
      });

    return {
      ingredientes: ingredientes.map(i => ({
        nombre: i.nombre,
        cantidad: i.count > 1 ? `${i.cantidad} (x${Math.round(i.count)})` : i.cantidad,
        categoria: i.categoria,
      })),
      totalCalorias,
      totalProteinas,
      totalCarbohidratos,
      totalGrasas,
    };
  };

  // ============================================================================
  // RECETAS PERSONALIZADAS (CRUD)
  // ============================================================================

  /**
   * Crear una nueva receta personalizada
   */
  const crearReceta = async (
    datos: Omit<RecetaPersonalizada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
  ): Promise<string> => {
    const ahora = new Date();
    const id = uuidv4();
    const receta: RecetaPersonalizada = {
      ...datos,
      id,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
    await db.recetas.add(receta);
    return id;
  };

  /**
   * Actualizar una receta personalizada existente
   */
  const actualizarReceta = async (receta: RecetaPersonalizada): Promise<void> => {
    await db.recetas.update(receta.id, {
      ...receta,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Eliminar una receta personalizada
   */
  const eliminarReceta = async (id: string): Promise<void> => {
    await db.recetas.delete(id);
  };

  /**
   * Obtener una receta personalizada por su id
   */
  const obtenerReceta = async (id: string): Promise<RecetaPersonalizada | undefined> => {
    return db.recetas.get(id);
  };

  /**
   * Marcar/desmarcar una receta como favorita
   */
  const toggleRecetaFavorita = async (id: string): Promise<void> => {
    const receta = await db.recetas.get(id);
    if (receta) {
      await db.recetas.update(id, {
        favorita: !receta.favorita,
        fechaActualizacion: new Date(),
      });
    }
  };

  // ============================================================================
  // CICLOS DE MENÚ (Repetición semanal)
  // ============================================================================

  /**
   * Crear un ciclo de menú para un plan
   */
  const crearMenuCycle = async (
    planId: string,
    nombre: string,
    semanas: MenuCycle['semanas']
  ): Promise<string> => {
    const ahora = new Date();
    const id = uuidv4();
    const ciclo: MenuCycle = {
      id,
      nombre,
      planId,
      semanas,
      activo: false,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
    await db.menuCycles.add(ciclo);
    return id;
  };

  /**
   * Actualizar un ciclo de menú existente
   */
  const actualizarMenuCycle = async (ciclo: MenuCycle): Promise<void> => {
    await db.menuCycles.update(ciclo.id, {
      ...ciclo,
      fechaActualizacion: new Date(),
    });
  };

  /**
   * Eliminar un ciclo de menú
   */
  const eliminarMenuCycle = async (id: string): Promise<void> => {
    await db.menuCycles.delete(id);
  };

  /**
   * Obtener los ciclos de menú de un plan
   */
  const obtenerMenuCyclesDePlan = async (planId: string): Promise<MenuCycle[]> => {
    return db.menuCycles
      .where('planId').equals(planId)
      .reverse()
      .sortBy('fechaCreacion');
  };

  /**
   * Activar un ciclo de menú (desactiva los demás del mismo plan)
   */
  const activarMenuCycle = async (id: string, planId: string): Promise<void> => {
    await db.transaction('rw', db.menuCycles, async () => {
      // Desactivar todos los ciclos del plan
      const ciclos = await db.menuCycles.where('planId').equals(planId).toArray();
      for (const c of ciclos) {
        await db.menuCycles.update(c.id, { activo: false, fechaActualizacion: new Date() });
      }
      // Activar el ciclo seleccionado
      await db.menuCycles.update(id, { activo: true, fechaActualizacion: new Date() });
    });
  };

  /**
   * Obtener el ciclo de menú activo de un plan
   */
  const obtenerMenuCycleActivo = async (planId: string): Promise<MenuCycle | undefined> => {
    return db.menuCycles
      .where('planId').equals(planId)
      .and(c => c.activo === true)
      .first();
  };

  // ============================================================================
  // RETORNO
  // ============================================================================

  return {
    // Queries
    planes,
    planesActivos,
    plantillas,
    recetas,
    menuCycles,
    obtenerPlanesPaciente,
    obtenerPlanCompleto,
    obtenerEstadisticas,
    obtenerAdherencia,
    obtenerSeguimiento,

    // CRUD
    crearPlan,
    actualizarPlan,
    eliminarPlan,
    duplicarPlan,

    // Asignación
    asignarAPaciente,
    desasignarDePaciente,
    toggleActivo,
    convertirEnPlantilla,

    // Comidas
    agregarComida,
    eliminarComida,
    personalizarComida,
    calcularNutrientesPlan,

    // Filtros
    filtrarPlanes,

    // Seguimiento
    registrarSeguimiento,

    // Recetas personalizadas
    crearReceta,
    actualizarReceta,
    eliminarReceta,
    obtenerReceta,
    toggleRecetaFavorita,

    // Ciclos de menú
    crearMenuCycle,
    actualizarMenuCycle,
    eliminarMenuCycle,
    obtenerMenuCyclesDePlan,
    activarMenuCycle,
    obtenerMenuCycleActivo,

    // Lista de compras
    generarListaCompras,
  };
}
