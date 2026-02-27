// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE MATERIALES DENTALES
// Hook personalizado para manejar materiales dentales comunes
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import type { MaterialOdontologico } from '../../../types';

// Materiales dentales comunes precargados
const MATERIALES_PRECARGADOS: MaterialOdontologico[] = [
  // Materiales de restauración
  { nombre: 'Composite A2', cantidad: 1, unidad: 'kit', costo: 800 },
  { nombre: 'Composite A3', cantidad: 1, unidad: 'kit', costo: 800 },
  { nombre: 'Composite B1', cantidad: 1, unidad: 'kit', costo: 800 },
  { nombre: 'Amalgama dental', cantidad: 1, unidad: 'kit', costo: 600 },
  { nombre: 'Ionómero de vidrio', cantidad: 1, unidad: 'kit', costo: 700 },
  { nombre: 'Cemento de fosfato de zinc', cantidad: 1, unidad: 'kit', costo: 400 },
  { nombre: 'Cemento de ionómero de vidrio', cantidad: 1, unidad: 'kit', costo: 500 },
  
  // Materiales de impresión
  { nombre: 'Alginato', cantidad: 1, unidad: 'kg', costo: 1200 },
  { nombre: 'Silicona de adición', cantidad: 1, unidad: 'kit', costo: 2500 },
  { nombre: 'Silicona de condensación', cantidad: 1, unidad: 'kit', costo: 1800 },
  { nombre: 'Yeso tipo III', cantidad: 1, unidad: 'kg', costo: 300 },
  { nombre: 'Yeso tipo IV', cantidad: 1, unidad: 'kg', costo: 500 },
  
  // Materiales de prótesis
  { nombre: 'Acrílico para base', cantidad: 1, unidad: 'kg', costo: 800 },
  { nombre: 'Acrílico para dientes', cantidad: 1, unidad: 'kit', costo: 1200 },
  { nombre: 'Cerámica feldespática', cantidad: 1, unidad: 'kg', costo: 3500 },
  { nombre: 'Aleación para metal-porcelana', cantidad: 1, unidad: 'g', costo: 150 },
  { nombre: 'Aleación para corona', cantidad: 1, unidad: 'g', costo: 200 },
  
  // Materiales de endodoncia
  { nombre: 'Gutapercha', cantidad: 1, unidad: 'paquete', costo: 400 },
  { nombre: 'Cemento endodóntico', cantidad: 1, unidad: 'kit', costo: 600 },
  { nombre: 'Limas endodónticas', cantidad: 1, unidad: 'juego', costo: 1200 },
  { nombre: 'Hipoclorito de sodio 5.25%', cantidad: 1, unidad: 'L', costo: 300 },
  { nombre: 'EDTA 17%', cantidad: 1, unidad: 'ml', costo: 250 },
  
  // Materiales de periodoncia
  { nombre: 'Gel de clorhexidina 2%', cantidad: 1, unidad: 'tubo', costo: 350 },
  { nombre: 'Hilo periodontal', cantidad: 1, unidad: 'rollo', costo: 150 },
  { nombre: 'Curetas Gracey', cantidad: 1, unidad: 'juego', costo: 2800 },
  
  // Materiales de anestesia
  { nombre: 'Lidocaína 2% con epinefrina', cantidad: 1, unidad: 'cartucho', costo: 25 },
  { nombre: 'Mepivacaína 3%', cantidad: 1, unidad: 'cartucho', costo: 28 },
  { nombre: 'Articaína 4%', cantidad: 1, unidad: 'cartucho', costo: 30 },
  
  // Materiales de higiene y prevención
  { nombre: 'Pasta profiláctica', cantidad: 1, unidad: 'tubo', costo: 200 },
  { nombre: 'Cepillos profilácticos', cantidad: 1, unidad: 'paquete', costo: 150 },
  { nombre: 'Tiras de pulido', cantidad: 1, unidad: 'paquete', costo: 180 },
  { nombre: 'Sellante de fosas y fisuras', cantidad: 1, unidad: 'kit', costo: 450 },
  { nombre: 'Gel de fluoruro', cantidad: 1, unidad: 'tubo', costo: 280 },
  
  // Materiales diversos
  { nombre: 'Guantes de látex', cantidad: 1, unidad: 'caja', costo: 120 },
  { nombre: 'Mascarillas quirúrgicas', cantidad: 1, unidad: 'caja', costo: 80 },
  { nombre: 'Gorros desechables', cantidad: 1, unidad: 'paquete', costo: 60 },
  { nombre: 'Batas desechables', cantidad: 1, unidad: 'paquete', costo: 200 },
  { nombre: 'Agujas esterilizadas', cantidad: 1, unidad: 'caja', costo: 180 },
];

interface UseMaterialesDentalesReturn {
  // Lista de materiales
  materiales: MaterialOdontologico[];
  materialesPrecargados: MaterialOdontologico[];
  
  // Métodos de búsqueda
  buscarPorNombre: (nombre: string) => MaterialOdontologico | undefined;
  buscarPorCategoria: (categoria: string) => MaterialOdontologico[];
  
  // Métodos de gestión
  agregarMaterial: (material: MaterialOdontologico) => void;
  eliminarMaterial: (nombre: string) => void;
  actualizarMaterial: (nombre: string, material: MaterialOdontologico) => void;
  actualizarCantidad: (nombre: string, nuevaCantidad: number) => void;
  
  // Métodos de cálculo
  calcularCostoTotal: (materiales: MaterialOdontologico[]) => number;
  calcularInventarioValor: () => number;
  verificarStockBajo: (umbral: number) => MaterialOdontologico[];
  
  // Métodos de importación/exportación
  exportarMateriales: () => string;
  importarMateriales: (json: string) => void;
  
  // Métodos de categorización
  categorizarMateriales: () => Record<string, MaterialOdontologico[]>;
}

export function useMaterialesDentales(
  materialesIniciales: MaterialOdontologico[] = []
): UseMaterialesDentalesReturn {
  const [materiales, setMateriales] = useState<MaterialOdontologico[]>(materialesIniciales);
  const [materialesPrecargados] = useState<MaterialOdontologico[]>(MATERIALES_PRECARGADOS);

  // Buscar material por nombre exacto
  const buscarPorNombre = useCallback((nombre: string): MaterialOdontologico | undefined => {
    const nombreLower = nombre.toLowerCase();
    return [...materiales, ...materialesPrecargados].find(m =>
      m.nombre.toLowerCase() === nombreLower
    );
  }, [materiales, materialesPrecargados]);

  // Buscar materiales por categoría (basado en palabras clave en el nombre)
  const buscarPorCategoria = useCallback((categoria: string): MaterialOdontologico[] => {
    const categoriaLower = categoria.toLowerCase();
    const categorias: Record<string, string[]> = {
      'restauracion': ['composite', 'amalgama', 'ionómero', 'cemento'],
      'impresion': ['alginato', 'silicona', 'yeso'],
      'protesis': ['acrílico', 'cerámica', 'aleación', 'corona'],
      'endodoncia': ['gutapercha', 'endodóntico', 'limas', 'hipoclorito', 'edta'],
      'periodoncia': ['clorhexidina', 'hilo', 'curetas'],
      'anestesia': ['lidocaína', 'mepivacaína', 'articaína'],
      'higiene': ['pasta', 'cepillo', 'sellante', 'fluoruro'],
      'desechables': ['guantes', 'mascarilla', 'gorro', 'bata', 'aguja'],
    };

    const palabrasClave = categorias[categoriaLower] || [categoriaLower];
    
    return [...materiales, ...materialesPrecargados].filter(material =>
      palabrasClave.some(palabra =>
        material.nombre.toLowerCase().includes(palabra)
      )
    );
  }, [materiales, materialesPrecargados]);

  // Agregar nuevo material
  const agregarMaterial = useCallback((material: MaterialOdontologico) => {
    setMateriales(prev => {
      // Verificar si ya existe un material con el mismo nombre
      const existe = prev.some(m => m.nombre.toLowerCase() === material.nombre.toLowerCase());
      if (existe) {
        console.warn(`Ya existe un material con nombre ${material.nombre}`);
        return prev;
      }
      return [...prev, material];
    });
  }, []);

  // Eliminar material por nombre
  const eliminarMaterial = useCallback((nombre: string) => {
    setMateriales(prev => prev.filter(m => m.nombre !== nombre));
  }, []);

  // Actualizar material existente
  const actualizarMaterial = useCallback((nombre: string, material: MaterialOdontologico) => {
    setMateriales(prev => prev.map(m => m.nombre === nombre ? material : m));
  }, []);

  // Actualizar solo la cantidad de un material
  const actualizarCantidad = useCallback((nombre: string, nuevaCantidad: number) => {
    setMateriales(prev => prev.map(m =>
      m.nombre === nombre ? { ...m, cantidad: nuevaCantidad } : m
    ));
  }, []);

  // Calcular costo total de una lista de materiales
  const calcularCostoTotal = useCallback((materialesLista: MaterialOdontologico[]): number => {
    return materialesLista.reduce((total, m) => total + ((m.costo || 0) * m.cantidad), 0);
  }, []);

  // Calcular valor total del inventario
  const calcularInventarioValor = useCallback((): number => {
    return calcularCostoTotal(materiales);
  }, [materiales, calcularCostoTotal]);

  // Verificar materiales con stock bajo
  const verificarStockBajo = useCallback((umbral: number = 5): MaterialOdontologico[] => {
    return materiales.filter(m => m.cantidad <= umbral);
  }, [materiales]);

  // Exportar materiales a JSON
  const exportarMateriales = useCallback((): string => {
    return JSON.stringify({
      version: '1.0',
      fechaExportacion: new Date().toISOString(),
      materiales,
    }, null, 2);
  }, [materiales]);

  // Importar materiales desde JSON
  const importarMateriales = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.materiales && Array.isArray(data.materiales)) {
        setMateriales(data.materiales);
        return { success: true, count: data.materiales.length };
      }
      return { success: false, error: 'Formato inválido' };
    } catch (error) {
      console.error('Error importando materiales:', error);
      return { success: false, error: 'JSON inválido' };
    }
  }, []);

  // Categorizar materiales automáticamente
  const categorizarMateriales = useCallback((): Record<string, MaterialOdontologico[]> => {
    const categorias: Record<string, MaterialOdontologico[]> = {
      'Restauración': [],
      'Impresión': [],
      'Prótesis': [],
      'Endodoncia': [],
      'Periodoncia': [],
      'Anestesia': [],
      'Higiene': [],
      'Desechables': [],
      'Otros': [],
    };

    materiales.forEach(material => {
      const nombreLower = material.nombre.toLowerCase();
      
      if (nombreLower.includes('composite') || nombreLower.includes('amalgama') || nombreLower.includes('ionómero') || nombreLower.includes('cemento')) {
        categorias['Restauración'].push(material);
      } else if (nombreLower.includes('alginato') || nombreLower.includes('silicona') || nombreLower.includes('yeso')) {
        categorias['Impresión'].push(material);
      } else if (nombreLower.includes('acrílico') || nombreLower.includes('cerámica') || nombreLower.includes('aleación') || nombreLower.includes('corona')) {
        categorias['Prótesis'].push(material);
      } else if (nombreLower.includes('gutapercha') || nombreLower.includes('endodóntico') || nombreLower.includes('limas') || nombreLower.includes('hipoclorito') || nombreLower.includes('edta')) {
        categorias['Endodoncia'].push(material);
      } else if (nombreLower.includes('clorhexidina') || nombreLower.includes('hilo') || nombreLower.includes('curetas')) {
        categorias['Periodoncia'].push(material);
      } else if (nombreLower.includes('lidocaína') || nombreLower.includes('mepivacaína') || nombreLower.includes('articaína')) {
        categorias['Anestesia'].push(material);
      } else if (nombreLower.includes('pasta') || nombreLower.includes('cepillo') || nombreLower.includes('sellante') || nombreLower.includes('fluoruro')) {
        categorias['Higiene'].push(material);
      } else if (nombreLower.includes('guantes') || nombreLower.includes('mascarilla') || nombreLower.includes('gorro') || nombreLower.includes('bata') || nombreLower.includes('aguja')) {
        categorias['Desechables'].push(material);
      } else {
        categorias['Otros'].push(material);
      }
    });

    // Eliminar categorías vacías
    Object.keys(categorias).forEach(categoria => {
      if (categorias[categoria].length === 0) {
        delete categorias[categoria];
      }
    });

    return categorias;
  }, [materiales]);

  // Cargar materiales precargados si no hay materiales iniciales
  useEffect(() => {
    if (materiales.length === 0) {
      // Podríamos cargar algunos materiales precargados por defecto
      // Pero por ahora solo inicializamos vacío
    }
  }, [materiales.length]);

  return {
    materiales,
    materialesPrecargados,
    buscarPorNombre,
    buscarPorCategoria,
    agregarMaterial,
    eliminarMaterial,
    actualizarMaterial,
    actualizarCantidad,
    calcularCostoTotal,
    calcularInventarioValor,
    verificarStockBajo,
    exportarMateriales,
    importarMateriales,
    categorizarMateriales,
  };
}

export default useMaterialesDentales;