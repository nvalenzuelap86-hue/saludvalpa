// ============================================================================
// saludvalpa 3.0 - DATOS PRECARGADOS DE MATERIALES DENTALES
// Materiales odontológicos organizados por categoría
// ============================================================================

import type { MaterialOdontologico } from '../../../types';

export const CATEGORIAS_MATERIALES = {
  RESTAURACION: 'Restauración',
  ENDODONCIA: 'Endodoncia',
  PROTESIS: 'Prótesis',
  ORTODONCIA: 'Ortodoncia',
  PERIODONCIA: 'Periodoncia',
  CIRUGIA: 'Cirugía',
  PREVENCION: 'Prevención',
  DESINFECCION: 'Desinfección',
  CONSUMIBLES: 'Consumibles',
} as const;

export type CategoriaMaterial = typeof CATEGORIAS_MATERIALES[keyof typeof CATEGORIAS_MATERIALES];

export interface MaterialDentalCategoria extends MaterialOdontologico {
  categoria: CategoriaMaterial;
  subcategoria?: string;
  unidadMedida?: string;
  proveedor?: string;
  codigoProveedor?: string;
}

// Materiales dentales precargados (versión simplificada)
export const MATERIALES_DENTALES: MaterialDentalCategoria[] = [
  {
    nombre: 'Composite universal A2',
    descripcion: 'Resina compuesta universal color A2',
    categoria: CATEGORIAS_MATERIALES.RESTAURACION,
    subcategoria: 'Composite',
    unidad: 'kit',
    cantidad: 10,
    costo: 850,
    proveedor: '3M ESPE',
    codigoProveedor: '3M-Z350-A2',
  },
  {
    nombre: 'Grabador ácido 37%',
    descripcion: 'Ácido fosfórico al 37% para grabado dental',
    categoria: CATEGORIAS_MATERIALES.RESTAURACION,
    subcategoria: 'Adhesivos',
    unidad: 'botella',
    cantidad: 5,
    costo: 450,
    proveedor: 'Bisco',
    codigoProveedor: 'BIS-ACID-37',
  },
  {
    nombre: 'Adhesivo universal',
    descripcion: 'Sistema adhesivo universal',
    categoria: CATEGORIAS_MATERIALES.RESTAURACION,
    subcategoria: 'Adhesivos',
    unidad: 'kit',
    cantidad: 6,
    costo: 1200,
    proveedor: '3M ESPE',
    codigoProveedor: '3M-SB-UNI',
  },
  {
    nombre: 'Limas endodónticas K-file #25',
    descripcion: 'Juego de limas para conductometría',
    categoria: CATEGORIAS_MATERIALES.ENDODONCIA,
    subcategoria: 'Instrumental',
    unidad: 'paquete',
    cantidad: 20,
    costo: 350,
    proveedor: 'Dentsply Maillefer',
    codigoProveedor: 'DEN-K25',
  },
  {
    nombre: 'Gutapercha cono #25',
    descripcion: 'Conos de gutapercha para obturación',
    categoria: CATEGORIAS_MATERIALES.ENDODONCIA,
    subcategoria: 'Obturación',
    unidad: 'paquete',
    cantidad: 15,
    costo: 280,
    proveedor: 'Dentsply',
    codigoProveedor: 'DEN-GUTA-25',
  },
  {
    nombre: 'Acrílico para prótesis',
    descripcion: 'Resina acrílica autopolimerizable',
    categoria: CATEGORIAS_MATERIALES.PROTESIS,
    subcategoria: 'Acrílicos',
    unidad: 'kit',
    cantidad: 12,
    costo: 650,
    proveedor: 'Ivoclar',
    codigoProveedor: 'IVO-ACRYL',
  },
  {
    nombre: 'Cerámica feldespática A2',
    descripcion: 'Cerámica para coronas y puentes',
    categoria: CATEGORIAS_MATERIALES.PROTESIS,
    subcategoria: 'Cerámica',
    unidad: 'kit',
    cantidad: 6,
    costo: 1800,
    proveedor: 'Ivoclar',
    codigoProveedor: 'IVO-CERAM',
  },
  {
    nombre: 'Brackets metálicos',
    descripcion: 'Brackets de ortodoncia metálicos',
    categoria: CATEGORIAS_MATERIALES.ORTODONCIA,
    subcategoria: 'Brackets',
    unidad: 'kit',
    cantidad: 5,
    costo: 2200,
    proveedor: '3M Unitek',
    codigoProveedor: '3M-MBT',
  },
  {
    nombre: 'Arcos de níquel-titanio .014',
    descripcion: 'Arcos superelásticos para alineación',
    categoria: CATEGORIAS_MATERIALES.ORTODONCIA,
    subcategoria: 'Arcos',
    unidad: 'paquete',
    cantidad: 12,
    costo: 380,
    proveedor: '3M Unitek',
    codigoProveedor: '3M-NITI-014',
  },
  {
    nombre: 'Curetas Gracey 1/2',
    descripcion: 'Curetas para raspado y alisado radicular',
    categoria: CATEGORIAS_MATERIALES.PERIODONCIA,
    subcategoria: 'Instrumental',
    unidad: 'unidad',
    cantidad: 8,
    costo: 450,
    proveedor: 'Hu-Friedy',
    codigoProveedor: 'HU-GRACEY-12',
  },
  {
    nombre: 'Anestesia local lidocaína 2%',
    descripcion: 'Cartuchos de anestesia local',
    categoria: CATEGORIAS_MATERIALES.CIRUGIA,
    subcategoria: 'Anestesia',
    unidad: 'caja',
    cantidad: 10,
    costo: 850,
    proveedor: 'Septodont',
    codigoProveedor: 'SEP-LIDO',
  },
  {
    nombre: 'Pasta profiláctica',
    descripcion: 'Pasta para profilaxis dental con fluoruro',
    categoria: CATEGORIAS_MATERIALES.PREVENCION,
    subcategoria: 'Profilaxis',
    unidad: 'tubo',
    cantidad: 15,
    costo: 280,
    proveedor: '3M ESPE',
    codigoProveedor: '3M-PROPHY',
  },
  {
    nombre: 'Sellante de fosas y fisuras',
    descripcion: 'Sellante resinoso para prevención',
    categoria: CATEGORIAS_MATERIALES.PREVENCION,
    subcategoria: 'Sellantes',
    unidad: 'kit',
    cantidad: 10,
    costo: 520,
    proveedor: '3M ESPE',
    codigoProveedor: '3M-SEALANT',
  },
  {
    nombre: 'Glutaraldehído 2.4%',
    descripcion: 'Solución desinfectante de alto nivel',
    categoria: CATEGORIAS_MATERIALES.DESINFECCION,
    subcategoria: 'Desinfectantes',
    unidad: 'litro',
    cantidad: 5,
    costo: 420,
    proveedor: 'Cidex',
    codigoProveedor: 'CIDEX',
  },
  {
    nombre: 'Guantes de látex talla M',
    descripcion: 'Guantes estériles de látex sin polvo',
    categoria: CATEGORIAS_MATERIALES.CONSUMIBLES,
    subcategoria: 'Guantes',
    unidad: 'caja',
    cantidad: 8,
    costo: 320,
    proveedor: 'Ansell',
    codigoProveedor: 'ANS-GLOVES',
  },
  {
    nombre: 'Mascarillas quirúrgicas',
    descripcion: 'Mascarillas de tres pliegues',
    categoria: CATEGORIAS_MATERIALES.CONSUMIBLES,
    subcategoria: 'Mascarillas',
    unidad: 'caja',
    cantidad: 10,
    costo: 280,
    proveedor: '3M',
    codigoProveedor: '3M-MASK',
  },
];

// Funciones de utilidad
export function obtenerMaterialesPorCategoria(categoria: CategoriaMaterial): MaterialDentalCategoria[] {
  return MATERIALES_DENTALES.filter(mat => mat.categoria === categoria);
}

export function obtenerMaterialPorNombre(nombre: string): MaterialDentalCategoria | undefined {
  return MATERIALES_DENTALES.find(mat => mat.nombre === nombre);
}

export function obtenerMaterialesPorSubcategoria(subcategoria: string): MaterialDentalCategoria[] {
  return MATERIALES_DENTALES.filter(mat => mat.subcategoria === subcategoria);
}

export function obtenerMaterialesPorProveedor(proveedor: string): MaterialDentalCategoria[] {
  return MATERIALES_DENTALES.filter(mat => mat.proveedor === proveedor);
}

export function obtenerMaterialesBajoStock(umbral: number = 5): MaterialDentalCategoria[] {
  return MATERIALES_DENTALES.filter(mat => mat.cantidad < umbral);
}

export function obtenerCategoriasMateriales(): CategoriaMaterial[] {
  const categorias = new Set<CategoriaMaterial>();
  MATERIALES_DENTALES.forEach(mat => categorias.add(mat.categoria));
  return Array.from(categorias);
}

export function obtenerSubcategoriasPorCategoria(categoria: CategoriaMaterial): string[] {
  const subcategorias = new Set<string>();
  MATERIALES_DENTALES
    .filter(mat => mat.categoria === categoria && mat.subcategoria)
    .forEach(mat => subcategorias.add(mat.subcategoria!));
  return Array.from(subcategorias);
}

export function buscarMaterialesPorTexto(texto: string): MaterialDentalCategoria[] {
  const textoBusqueda = texto.toLowerCase();
  return MATERIALES_DENTALES.filter(mat => 
    mat.nombre.toLowerCase().includes(textoBusqueda) ||
    (mat.descripcion && mat.descripcion.toLowerCase().includes(textoBusqueda)) ||
    mat.subcategoria?.toLowerCase().includes(textoBusqueda) ||
    mat.categoria.toLowerCase().includes(textoBusqueda) ||
    mat.proveedor?.toLowerCase().includes(textoBusqueda)
  );
}

export function calcularValorTotalInventario(): number {
  return MATERIALES_DENTALES.reduce((total, mat) => {
    return total + (mat.cantidad * (mat.costo || 0));
  }, 0);
}

export function actualizarStockMaterial(nombre: string, cantidadUtilizada: number): boolean {
  const material = obtenerMaterialPorNombre(nombre);
  if (material && material.cantidad >= cantidadUtilizada) {
    material.cantidad -= cantidadUtilizada;
    return true;
  }
  return false;
}

export default MATERIALES_DENTALES;