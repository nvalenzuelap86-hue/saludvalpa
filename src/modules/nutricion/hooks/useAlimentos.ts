// ============================================================================
// saludvalpa 3.0 - HOOK: useAlimentos
// Gestión de alimentos, nutrientes y base de datos nutricional
// ============================================================================

import { useState, useCallback, useEffect } from 'react';

export interface Alimento {
  id: string;
  nombre: string;
  grupo: string;
  porcion: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
  azucares?: number;
  sodio?: number;
  notas?: string;
}

export interface GrupoAlimentario {
  id: string;
  nombre: string;
  descripcion: string;
  alimentos: Alimento[];
}

export interface BusquedaAlimentosOptions {
  grupo?: string;
  nombre?: string;
  caloriasMax?: number;
  proteinasMin?: number;
}

export default function useAlimentos() {
  // Estado para alimentos cargados
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [gruposAlimentarios, setGruposAlimentarios] = useState<GrupoAlimentario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar alimentos iniciales
  useEffect(() => {
    cargarAlimentosIniciales();
  }, []);

  const cargarAlimentosIniciales = useCallback(async () => {
    setCargando(true);
    try {
      // En una implementación real, esto cargaría desde una API o base de datos
      // Por ahora usamos datos de ejemplo
      const alimentosEjemplo: Alimento[] = [
        {
          id: '1',
          nombre: 'Pechuga de pollo',
          grupo: 'proteinas',
          porcion: '100g',
          calorias: 165,
          proteinas: 31,
          carbohidratos: 0,
          grasas: 3.6,
        },
        {
          id: '2',
          nombre: 'Salmón',
          grupo: 'proteinas',
          porcion: '100g',
          calorias: 208,
          proteinas: 20,
          carbohidratos: 0,
          grasas: 13,
        },
        {
          id: '3',
          nombre: 'Arroz integral',
          grupo: 'cereales',
          porcion: '1 taza cocido',
          calorias: 216,
          proteinas: 5,
          carbohidratos: 45,
          grasas: 1.8,
          fibra: 3.5,
        },
        {
          id: '4',
          nombre: 'Aguacate',
          grupo: 'grasas_saludables',
          porcion: '1/2 unidad',
          calorias: 160,
          proteinas: 2,
          carbohidratos: 9,
          grasas: 15,
          fibra: 7,
        },
        {
          id: '5',
          nombre: 'Espinacas',
          grupo: 'verduras',
          porcion: '1 taza cruda',
          calorias: 7,
          proteinas: 0.9,
          carbohidratos: 1.1,
          grasas: 0.1,
          fibra: 0.7,
        },
        {
          id: '6',
          nombre: 'Manzana',
          grupo: 'frutas',
          porcion: '1 unidad mediana',
          calorias: 95,
          proteinas: 0.5,
          carbohidratos: 25,
          grasas: 0.3,
          fibra: 4.4,
        },
        {
          id: '7',
          nombre: 'Yogurt griego',
          grupo: 'lacteos',
          porcion: '170g',
          calorias: 100,
          proteinas: 17,
          carbohidratos: 6,
          grasas: 0,
        },
        {
          id: '8',
          nombre: 'Almendras',
          grupo: 'frutos_secos',
          porcion: '28g (23 almendras)',
          calorias: 164,
          proteinas: 6,
          carbohidratos: 6,
          grasas: 14,
          fibra: 3.5,
        },
      ];

      const gruposEjemplo: GrupoAlimentario[] = [
        {
          id: 'proteinas',
          nombre: 'Proteínas',
          descripcion: 'Carnes, pescados, huevos, legumbres',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'proteinas'),
        },
        {
          id: 'cereales',
          nombre: 'Cereales y granos',
          descripcion: 'Arroz, pasta, pan, cereales integrales',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'cereales'),
        },
        {
          id: 'verduras',
          nombre: 'Verduras',
          descripcion: 'Vegetales frescos y cocidos',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'verduras'),
        },
        {
          id: 'frutas',
          nombre: 'Frutas',
          descripcion: 'Frutas frescas y secas',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'frutas'),
        },
        {
          id: 'lacteos',
          nombre: 'Lácteos',
          descripcion: 'Leche, yogurt, queso',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'lacteos'),
        },
        {
          id: 'grasas_saludables',
          nombre: 'Grasas saludables',
          descripcion: 'Aceites, aguacate, frutos secos',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'grasas_saludables'),
        },
        {
          id: 'frutos_secos',
          nombre: 'Frutos secos',
          descripcion: 'Nueces, almendras, semillas',
          alimentos: alimentosEjemplo.filter(a => a.grupo === 'frutos_secos'),
        },
      ];

      setAlimentos(alimentosEjemplo);
      setGruposAlimentarios(gruposEjemplo);
      setError(null);
    } catch (err) {
      setError('Error al cargar los alimentos');
      console.error('Error en cargarAlimentosIniciales:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Buscar alimentos
  const buscarAlimentos = useCallback((options: BusquedaAlimentosOptions): Alimento[] => {
    let resultados = [...alimentos];

    if (options.grupo) {
      resultados = resultados.filter(alimento => alimento.grupo === options.grupo);
    }

    if (options.nombre) {
      const nombreLower = options.nombre.toLowerCase();
      resultados = resultados.filter(alimento => 
        alimento.nombre.toLowerCase().includes(nombreLower)
      );
    }

    if (options.caloriasMax !== undefined) {
      resultados = resultados.filter(alimento => alimento.calorias <= options.caloriasMax!);
    }

    if (options.proteinasMin !== undefined) {
      resultados = resultados.filter(alimento => alimento.proteinas >= options.proteinasMin!);
    }

    return resultados;
  }, [alimentos]);

  // Agregar nuevo alimento
  const agregarAlimento = useCallback((nuevoAlimento: Omit<Alimento, 'id'>) => {
    const alimentoConId: Alimento = {
      ...nuevoAlimento,
      id: Date.now().toString(),
    };

    setAlimentos(prev => [...prev, alimentoConId]);
    
    // Actualizar grupo correspondiente
    setGruposAlimentarios(prev => 
      prev.map(grupo => {
        if (grupo.id === nuevoAlimento.grupo) {
          return {
            ...grupo,
            alimentos: [...grupo.alimentos, alimentoConId],
          };
        }
        return grupo;
      })
    );

    return alimentoConId;
  }, []);

  // Eliminar alimento
  const eliminarAlimento = useCallback((id: string) => {
    const alimentoAEliminar = alimentos.find(a => a.id === id);
    if (!alimentoAEliminar) return false;

    setAlimentos(prev => prev.filter(a => a.id !== id));
    
    // Actualizar grupo correspondiente
    setGruposAlimentarios(prev => 
      prev.map(grupo => {
        if (grupo.id === alimentoAEliminar.grupo) {
          return {
            ...grupo,
            alimentos: grupo.alimentos.filter(a => a.id !== id),
          };
        }
        return grupo;
      })
    );

    return true;
  }, [alimentos]);

  // Actualizar alimento
  const actualizarAlimento = useCallback((id: string, datosActualizados: Partial<Alimento>) => {
    const alimentoIndex = alimentos.findIndex(a => a.id === id);
    if (alimentoIndex === -1) return false;

    const alimentoOriginal = alimentos[alimentoIndex];
    const alimentoActualizado: Alimento = {
      ...alimentoOriginal,
      ...datosActualizados,
      id, // Mantener el mismo ID
    };

    const nuevosAlimentos = [...alimentos];
    nuevosAlimentos[alimentoIndex] = alimentoActualizado;
    setAlimentos(nuevosAlimentos);

    // Si cambió el grupo, actualizar grupos
    if (datosActualizados.grupo && datosActualizados.grupo !== alimentoOriginal.grupo) {
      setGruposAlimentarios(prev => 
        prev.map(grupo => {
          // Remover del grupo anterior
          if (grupo.id === alimentoOriginal.grupo) {
            return {
              ...grupo,
              alimentos: grupo.alimentos.filter(a => a.id !== id),
            };
          }
          // Agregar al nuevo grupo
          if (grupo.id === datosActualizados.grupo) {
            return {
              ...grupo,
              alimentos: [...grupo.alimentos, alimentoActualizado],
            };
          }
          return grupo;
        })
      );
    } else {
      // Solo actualizar dentro del mismo grupo
      setGruposAlimentarios(prev => 
        prev.map(grupo => {
          if (grupo.id === alimentoOriginal.grupo) {
            return {
              ...grupo,
              alimentos: grupo.alimentos.map(a => 
                a.id === id ? alimentoActualizado : a
              ),
            };
          }
          return grupo;
        })
      );
    }

    return true;
  }, [alimentos]);

  // Calcular nutrientes de una combinación de alimentos
  const calcularNutrientesCombinacion = useCallback((alimentosIds: string[], porciones: number[] = []) => {
    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalCarbohidratos = 0;
    let totalGrasas = 0;
    let totalFibra = 0;

    alimentosIds.forEach((id, index) => {
      const alimento = alimentos.find(a => a.id === id);
      if (alimento) {
        const factorPorcion = porciones[index] || 1;
        totalCalorias += alimento.calorias * factorPorcion;
        totalProteinas += alimento.proteinas * factorPorcion;
        totalCarbohidratos += alimento.carbohidratos * factorPorcion;
        totalGrasas += alimento.grasas * factorPorcion;
        totalFibra += (alimento.fibra || 0) * factorPorcion;
      }
    });

    return {
      calorias: Math.round(totalCalorias),
      proteinas: Math.round(totalProteinas * 10) / 10,
      carbohidratos: Math.round(totalCarbohidratos * 10) / 10,
      grasas: Math.round(totalGrasas * 10) / 10,
      fibra: Math.round(totalFibra * 10) / 10,
    };
  }, [alimentos]);

  // Obtener alimentos por grupo
  const obtenerAlimentosPorGrupo = useCallback((grupoId: string): Alimento[] => {
    const grupo = gruposAlimentarios.find(g => g.id === grupoId);
    return grupo ? grupo.alimentos : [];
  }, [gruposAlimentarios]);

  // Obtener recomendaciones basadas en objetivos
  const obtenerRecomendaciones = useCallback((objetivo: 'perder_peso' | 'ganar_musculo' | 'mantener'): Alimento[] => {
    switch (objetivo) {
      case 'perder_peso':
        return alimentos.filter(a => 
          a.calorias < 150 && 
          (a.fibra || 0) > 2
        );
      case 'ganar_musculo':
        return alimentos.filter(a => 
          a.proteinas > 15
        );
      case 'mantener':
        return alimentos.filter(a => 
          a.calorias < 300
        );
      default:
        return alimentos.slice(0, 10);
    }
  }, [alimentos]);

  return {
    // Estado
    alimentos,
    gruposAlimentarios,
    cargando,
    error,
    
    // Acciones
    buscarAlimentos,
    agregarAlimento,
    eliminarAlimento,
    actualizarAlimento,
    calcularNutrientesCombinacion,
    obtenerAlimentosPorGrupo,
    obtenerRecomendaciones,
    
    // Utilidades
    recargarAlimentos: cargarAlimentosIniciales,
  };
}