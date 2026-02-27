// ============================================================================
// saludvalpa 3.0 - DATOS PRECARGADOS DE CÓDIGOS DENTALES
// Códigos CDT (Code on Dental Procedures and Nomenclature) organizados
// ============================================================================

export interface CodigoDental {
  codigo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  notas?: string;
  activo: boolean;
}

export const CATEGORIAS_CODIGOS = {
  DIAGNOSTICO: 'Diagnóstico',
  PREVENCION: 'Prevención',
  RESTAURACION: 'Restauración',
  ENDODONCIA: 'Endodoncia',
  PERIODONCIA: 'Periodoncia',
  CIRUGIA: 'Cirugía Oral',
  PROTESIS: 'Prótesis',
  ORTODONCIA: 'Ortodoncia',
  RADIOLOGIA: 'Radiología',
  OTROS: 'Otros',
} as const;

export type CategoriaCodigo = typeof CATEGORIAS_CODIGOS[keyof typeof CATEGORIAS_CODIGOS];

// Códigos dentales CDT precargados
export const CODIGOS_DENTALES: CodigoDental[] = [
  // ============================================================================
  // DIAGNÓSTICO (D0100-D0999)
  // ============================================================================
  {
    codigo: 'D0120',
    descripcion: 'Examen periódico oral',
    categoria: CATEGORIAS_CODIGOS.DIAGNOSTICO,
    subcategoria: 'Examen básico',
    notas: 'Incluye evaluación de tejidos blandos y duros',
    activo: true,
  },
  {
    codigo: 'D0140',
    descripcion: 'Examen de emergencia limitado',
    categoria: CATEGORIAS_CODIGOS.DIAGNOSTICO,
    subcategoria: 'Urgencia',
    notas: 'Para dolor agudo o traumatismo',
    activo: true,
  },
  {
    codigo: 'D0150',
    descripcion: 'Examen oral completo',
    categoria: CATEGORIAS_CODIGOS.DIAGNOSTICO,
    subcategoria: 'Examen completo',
    notas: 'Primera visita o evaluación integral',
    activo: true,
  },
  {
    codigo: 'D0160',
    descripcion: 'Examen oral detallado y extenso',
    categoria: CATEGORIAS_CODIGOS.DIAGNOSTICO,
    subcategoria: 'Examen especializado',
    notas: 'Caso complejo o evaluación prequirúrgica',
    activo: true,
  },

  // ============================================================================
  // PREVENCIÓN (D1000-D1999)
  // ============================================================================
  {
    codigo: 'D1110',
    descripcion: 'Profilaxis dental adulto',
    categoria: CATEGORIAS_CODIGOS.PREVENCION,
    subcategoria: 'Limpieza dental',
    notas: 'Limpieza profesional completa',
    activo: true,
  },
  {
    codigo: 'D1120',
    descripcion: 'Profilaxis dental niño',
    categoria: CATEGORIAS_CODIGOS.PREVENCION,
    subcategoria: 'Limpieza dental',
    notas: 'Para pacientes menores de 14 años',
    activo: true,
  },
  {
    codigo: 'D1206',
    descripcion: 'Aplicación tópica de fluoruro',
    categoria: CATEGORIAS_CODIGOS.PREVENCION,
    subcategoria: 'Fluorización',
    notas: 'Prevención de caries',
    activo: true,
  },
  {
    codigo: 'D1351',
    descripcion: 'Sellante de fosas y fisuras por diente',
    categoria: CATEGORIAS_CODIGOS.PREVENCION,
    subcategoria: 'Sellantes',
    notas: 'Prevención de caries en fosas y fisuras',
    activo: true,
  },

  // ============================================================================
  // RESTAURACIÓN (D2000-D2999)
  // ============================================================================
  {
    codigo: 'D2140',
    descripcion: 'Amalgama de 1 superficie',
    categoria: CATEGORIAS_CODIGOS.RESTAURACION,
    subcategoria: 'Amalgama',
    notas: 'Restauración de amalgama en una superficie',
    activo: true,
  },
  {
    codigo: 'D2150',
    descripcion: 'Amalgama de 2 superficies',
    categoria: CATEGORIAS_CODIGOS.RESTAURACION,
    subcategoria: 'Amalgama',
    notas: 'Restauración de amalgama en dos superficies',
    activo: true,
  },
  {
    codigo: 'D2330',
    descripcion: 'Resina de 1 superficie anterior',
    categoria: CATEGORIAS_CODIGOS.RESTAURACION,
    subcategoria: 'Resina',
    notas: 'Restauración de resina en diente anterior',
    activo: true,
  },
  {
    codigo: 'D2391',
    descripcion: 'Resina de 1 superficie posterior',
    categoria: CATEGORIAS_CODIGOS.RESTAURACION,
    subcategoria: 'Resina',
    notas: 'Restauración de resina en diente posterior',
    activo: true,
  },
  {
    codigo: 'D2392',
    descripcion: 'Resina de 2 superficies posterior',
    categoria: CATEGORIAS_CODIGOS.RESTAURACION,
    subcategoria: 'Resina',
    notas: 'Restauración de resina en dos superficies posteriores',
    activo: true,
  },

  // ============================================================================
  // ENDODONCIA (D3000-D3999)
  // ============================================================================
  {
    codigo: 'D3310',
    descripcion: 'Endodoncia anterior',
    categoria: CATEGORIAS_CODIGOS.ENDODONCIA,
    subcategoria: 'Unirradicular',
    notas: 'Tratamiento de conducto en diente anterior',
    activo: true,
  },
  {
    codigo: 'D3320',
    descripcion: 'Endodoncia premolar',
    categoria: CATEGORIAS_CODIGOS.ENDODONCIA,
    subcategoria: 'Birradicular',
    notas: 'Tratamiento de conducto en premolar',
    activo: true,
  },
  {
    codigo: 'D3330',
    descripcion: 'Endodoncia molar',
    categoria: CATEGORIAS_CODIGOS.ENDODONCIA,
    subcategoria: 'Multirradicular',
    notas: 'Tratamiento de conducto en molar',
    activo: true,
  },
  {
    codigo: 'D3346',
    descripcion: 'Retratamiento endodóntico',
    categoria: CATEGORIAS_CODIGOS.ENDODONCIA,
    subcategoria: 'Retratamiento',
    notas: 'Retratamiento de conducto',
    activo: true,
  },

  // ============================================================================
  // PERIODONCIA (D4000-D4999)
  // ============================================================================
  {
    codigo: 'D4341',
    descripcion: 'Raspado y alisado radicular por cuadrante',
    categoria: CATEGORIAS_CODIGOS.PERIODONCIA,
    subcategoria: 'Terapia básica',
    notas: 'Tratamiento periodontal no quirúrgico',
    activo: true,
  },
  {
    codigo: 'D4910',
    descripcion: 'Mantenimiento periodontal',
    categoria: CATEGORIAS_CODIGOS.PERIODONCIA,
    subcategoria: 'Mantenimiento',
    notas: 'Control periodontal post-tratamiento',
    activo: true,
  },
  {
    codigo: 'D4260',
    descripcion: 'Injerto de tejido blando',
    categoria: CATEGORIAS_CODIGOS.PERIODONCIA,
    subcategoria: 'Cirugía periodontal',
    notas: 'Cirugía de tejidos blandos',
    activo: true,
  },

  // ============================================================================
  // CIRUGÍA ORAL (D7000-D7999)
  // ============================================================================
  {
    codigo: 'D7111',
    descripcion: 'Extracción simple',
    categoria: CATEGORIAS_CODIGOS.CIRUGIA,
    subcategoria: 'Extracción',
    notas: 'Extracción de diente erupcionado',
    activo: true,
  },
  {
    codigo: 'D7210',
    descripcion: 'Extracción quirúrgica',
    categoria: CATEGORIAS_CODIGOS.CIRUGIA,
    subcategoria: 'Extracción',
    notas: 'Extracción que requiere elevación de colgajo',
    activo: true,
  },
  {
    codigo: 'D7240',
    descripcion: 'Extracción de molar incluido',
    categoria: CATEGORIAS_CODIGOS.CIRUGIA,
    subcategoria: 'Extracción',
    notas: 'Extracción de molar retenido',
    activo: true,
  },
  {
    codigo: 'D7310',
    descripcion: 'Alveoloplastia',
    categoria: CATEGORIAS_CODIGOS.CIRUGIA,
    subcategoria: 'Cirugía alveolar',
    notas: 'Remodelación del reborde alveolar',
    activo: true,
  },

  // ============================================================================
  // PRÓTESIS (D5000-D5999)
  // ============================================================================
  {
    codigo: 'D5110',
    descripcion: 'Corona completa de resina',
    categoria: CATEGORIAS_CODIGOS.PROTESIS,
    subcategoria: 'Corona',
    notas: 'Corona provisional o definitiva de resina',
    activo: true,
  },
  {
    codigo: 'D5120',
    descripcion: 'Corona completa de porcelana',
    categoria: CATEGORIAS_CODIGOS.PROTESIS,
    subcategoria: 'Corona',
    notas: 'Corona de cerámica feldespática',
    activo: true,
  },
  {
    codigo: 'D5130',
    descripcion: 'Corona de metal-porcelana',
    categoria: CATEGORIAS_CODIGOS.PROTESIS,
    subcategoria: 'Corona',
    notas: 'Corona de porcelana fusionada a metal',
    activo: true,
  },
  {
    codigo: 'D5211',
    descripcion: 'Puente de resina por unidad',
    categoria: CATEGORIAS_CODIGOS.PROTESIS,
    subcategoria: 'Puente',
    notas: 'Puente fijo de resina acrílica',
    activo: true,
  },

  // ============================================================================
  // ORTODONCIA (D8000-D8999)
  // ============================================================================
  {
    codigo: 'D8010',
    descripcion: 'Consulta de ortodoncia',
    categoria: CATEGORIAS_CODIGOS.ORTODONCIA,
    subcategoria: 'Consulta',
    notas: 'Evaluación inicial ortodóncica',
    activo: true,
  },
  {
    codigo: 'D8080',
    descripcion: 'Tratamiento de ortodoncia completo',
    categoria: CATEGORIAS_CODIGOS.ORTODONCIA,
    subcategoria: 'Tratamiento completo',
    notas: 'Tratamiento ortodóncico integral',
    activo: true,
  },
  {
    codigo: 'D8210',
    descripcion: 'Aparato removible',
    categoria: CATEGORIAS_CODIGOS.ORTODONCIA,
    subcategoria: 'Aparatología',
    notas: 'Aparato ortodóncico removible',
    activo: true,
  },

  // ============================================================================
  // RADIOLOGÍA (D0200-D0399)
  // ============================================================================
  {
    codigo: 'D0210',
    descripcion: 'Radiografía intraoral completa',
    categoria: CATEGORIAS_CODIGOS.RADIOLOGIA,
    subcategoria: 'Serie completa',
    notas: 'Serie completa de radiografías periapicales',
    activo: true,
  },
  {
    codigo: 'D0220',
    descripcion: 'Radiografía periapical',
    categoria: CATEGORIAS_CODIGOS.RADIOLOGIA,
    subcategoria: 'Individual',
    notas: 'Radiografía de un diente específico',
    activo: true,
  },
  {
    codigo: 'D0270',
    descripcion: 'Radiografía bitewing',
    categoria: CATEGORIAS_CODIGOS.RADIOLOGIA,
    subcategoria: 'Interproximal',
    notas: 'Radiografía para detectar caries interproximales',
    activo: true,
  },
  {
    codigo: 'D0330',
    descripcion: 'Radiografía panorámica',
    categoria: CATEGORIAS_CODIGOS.RADIOLOGIA,
    subcategoria: 'Panorámica',
    notas: 'Radiografía panorámica de ambos maxilares',
    activo: true,
  },
];

// Funciones de utilidad
export function obtenerCodigosPorCategoria(categoria: CategoriaCodigo): CodigoDental[] {
  return CODIGOS_DENTALES.filter(cod => cod.categoria === categoria && cod.activo);
}

export function obtenerCodigoPorCodigo(codigo: string): CodigoDental | undefined {
  return CODIGOS_DENTALES.find(cod => cod.codigo === codigo && cod.activo);
}

export function obtenerCodigosPorSubcategoria(subcategoria: string): CodigoDental[] {
  return CODIGOS_DENTALES.filter(cod => cod.subcategoria === subcategoria && cod.activo);
}

export function buscarCodigosPorTexto(texto: string): CodigoDental[] {
  const textoBusqueda = texto.toLowerCase();
  return CODIGOS_DENTALES.filter(cod => 
    (cod.codigo.toLowerCase().includes(textoBusqueda) ||
    cod.descripcion.toLowerCase().includes(textoBusqueda) ||
    cod.subcategoria?.toLowerCase().includes(textoBusqueda) ||
    cod.categoria.toLowerCase().includes(textoBusqueda)) &&
    cod.activo
  );
}

export function obtenerCategoriasCodigos(): CategoriaCodigo[] {
  const categorias = new Set<CategoriaCodigo>();
  CODIGOS_DENTALES.forEach(cod => {
    // Type assertion since categoria is typed as string but we know it's a valid CategoriaCodigo
    categorias.add(cod.categoria as CategoriaCodigo);
  });
  return Array.from(categorias);
}

export function obtenerSubcategoriasPorCategoria(categoria: CategoriaCodigo): string[] {
  const subcategorias = new Set<string>();
  CODIGOS_DENTALES
    .filter(cod => cod.categoria === categoria && cod.subcategoria && cod.activo)
    .forEach(cod => subcategorias.add(cod.subcategoria!));
  return Array.from(subcategorias);
}

export function validarCodigoCDT(codigo: string): boolean {
  const patronCDT = /^D\d{4}$/;
  return patronCDT.test(codigo);
}

export function obtenerCodigosActivos(): CodigoDental[] {
  return CODIGOS_DENTALES.filter(cod => cod.activo);
}

export default CODIGOS_DENTALES;