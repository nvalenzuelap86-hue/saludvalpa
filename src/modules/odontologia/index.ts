// ============================================================================
// saludvalpa 3.0 - MÓDULO DE ODONTOLOGÍA
// Exporta todos los componentes específicos de odontología
// ============================================================================

// Componentes principales
export { default as CamposOdontologia } from './components/CamposOdontologia';
export { default as HistoriaClinicaOdontologica } from './components/HistoriaClinicaOdontologica';

// Documentos PDF
export { default as GenerarHistoriaClinicaOdontologica } from './documentos/GenerarHistoriaOdontologica';

// Componentes de odontograma
export { default as OdontogramaSVG } from './odontograma/OdontogramaSVG';
export { default as PiezaDental } from './odontograma/PiezaDental';
export { default as EstadoDental } from './odontograma/EstadoDental';

// Hooks
export { default as useProcedimientosDentales } from './hooks/useProcedimientosDentales';
export { default as useMaterialesDentales } from './hooks/useMaterialesDentales';
export { default as useOdontograma } from './hooks/useOdontograma';

// Datos precargados - exportar selectivamente para evitar conflictos
export {
  CATEGORIAS_PROCEDIMIENTOS,
  PROCEDIMIENTOS_DENTALES,
  obtenerProcedimientosPorCategoria,
  obtenerProcedimientoPorCodigo,
  obtenerProcedimientosPorPrioridad,
  obtenerProcedimientosConMateriales,
  obtenerCategoriasDisponibles,
  buscarProcedimientosPorTexto,
  calcularCostoTotalProcedimientos,
} from './data/procedimientosDentales';

export {
  CATEGORIAS_MATERIALES,
  MATERIALES_DENTALES,
  obtenerMaterialesPorCategoria,
  obtenerMaterialPorNombre,
  obtenerMaterialesPorSubcategoria,
  obtenerMaterialesBajoStock,
  obtenerCategoriasMateriales,
  buscarMaterialesPorTexto,
  calcularValorTotalInventario,
} from './data/materialesDentales';

export {
  CATEGORIAS_CODIGOS,
  CODIGOS_DENTALES,
  obtenerCodigosPorCategoria,
  obtenerCodigoPorCodigo,
  obtenerCodigosPorSubcategoria,
  buscarCodigosPorTexto,
  obtenerCategoriasCodigos,
  validarCodigoCDT,
  obtenerCodigosActivos,
} from './data/codigosDentales';

// Placeholders para componentes pendientes (se implementarán en fases futuras)
export const GenerarOdontograma = () => null;
export const GenerarPlanTratamientoOdontologico = () => null;
export const GenerarPresupuestoOdontologico = () => null;