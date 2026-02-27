// ============================================================================
// saludvalpa 3.0 - DATOS PRECARGADOS DE PROCEDIMIENTOS DENTALES
// Códigos CDT (Code on Dental Procedures and Nomenclature) organizados por categoría
// ============================================================================

import type { ProcedimientoOdontologico } from '../../../types';

export const CATEGORIAS_PROCEDIMIENTOS = {
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

export type CategoriaProcedimiento = typeof CATEGORIAS_PROCEDIMIENTOS[keyof typeof CATEGORIAS_PROCEDIMIENTOS];

export interface ProcedimientoDentalCategoria extends ProcedimientoOdontologico {
  categoria: CategoriaProcedimiento;
  subcategoria?: string;
  requiereMateriales?: string[];
  indicaciones?: string[];
  contraindicaciones?: string[];
}

// Procedimientos dentales precargados con códigos CDT
export const PROCEDIMIENTOS_DENTALES: ProcedimientoDentalCategoria[] = [
  // ============================================================================
  // DIAGNÓSTICO
  // ============================================================================
  {
    codigo: 'D0120',
    descripcion: 'Examen periódico oral',
    categoria: CATEGORIAS_PROCEDIMIENTOS.DIAGNOSTICO,
    subcategoria: 'Examen básico',
    piezas: [],
    costo: 300,
    duracion: 30,
    prioridad: 'media',
    indicaciones: ['Control rutinario', 'Revisión anual'],
  },
  {
    codigo: 'D0140',
    descripcion: 'Examen de emergencia limitado',
    categoria: CATEGORIAS_PROCEDIMIENTOS.DIAGNOSTICO,
    subcategoria: 'Urgencia',
    piezas: [],
    costo: 200,
    duracion: 20,
    prioridad: 'alta',
    indicaciones: ['Dolor agudo', 'Traumatismo', 'Infección'],
  },
  {
    codigo: 'D0150',
    descripcion: 'Examen oral completo',
    categoria: CATEGORIAS_PROCEDIMIENTOS.DIAGNOSTICO,
    subcategoria: 'Examen completo',
    piezas: [],
    costo: 500,
    duracion: 45,
    prioridad: 'media',
    indicaciones: ['Primera visita', 'Evaluación integral'],
  },
  {
    codigo: 'D0160',
    descripcion: 'Examen oral detallado y extenso',
    categoria: CATEGORIAS_PROCEDIMIENTOS.DIAGNOSTICO,
    subcategoria: 'Examen especializado',
    piezas: [],
    costo: 800,
    duracion: 60,
    prioridad: 'media',
    indicaciones: ['Caso complejo', 'Evaluación prequirúrgica'],
  },

  // ============================================================================
  // PREVENCIÓN
  // ============================================================================
  {
    codigo: 'D1110',
    descripcion: 'Profilaxis dental adulto',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PREVENCION,
    subcategoria: 'Limpieza dental',
    piezas: [],
    costo: 400,
    duracion: 45,
    prioridad: 'media',
    requiereMateriales: ['Pasta profiláctica', 'Cepillos profilácticos'],
  },
  {
    codigo: 'D1120',
    descripcion: 'Profilaxis dental niño',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PREVENCION,
    subcategoria: 'Limpieza dental',
    piezas: [],
    costo: 300,
    duracion: 30,
    prioridad: 'media',
    requiereMateriales: ['Pasta profiláctica', 'Cepillos profilácticos'],
  },
  {
    codigo: 'D1206',
    descripcion: 'Aplicación tópica de fluoruro',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PREVENCION,
    subcategoria: 'Fluorización',
    piezas: [],
    costo: 200,
    duracion: 15,
    prioridad: 'media',
    requiereMateriales: ['Gel de fluoruro'],
  },
  {
    codigo: 'D1351',
    descripcion: 'Sellante de fosas y fisuras por diente',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PREVENCION,
    subcategoria: 'Sellantes',
    piezas: [],
    costo: 250,
    duracion: 20,
    prioridad: 'media',
    requiereMateriales: ['Sellante de fosas y fisuras'],
  },

  // ============================================================================
  // RESTAURACIÓN
  // ============================================================================
  {
    codigo: 'D2140',
    descripcion: 'Amalgama de 1 superficie',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RESTAURACION,
    subcategoria: 'Amalgama',
    piezas: [],
    costo: 600,
    duracion: 45,
    prioridad: 'media',
    requiereMateriales: ['Amalgama dental', 'Matriz', 'Cuña'],
  },
  {
    codigo: 'D2150',
    descripcion: 'Amalgama de 2 superficies',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RESTAURACION,
    subcategoria: 'Amalgama',
    piezas: [],
    costo: 800,
    duracion: 60,
    prioridad: 'media',
    requiereMateriales: ['Amalgama dental', 'Matriz', 'Cuña'],
  },
  {
    codigo: 'D2330',
    descripcion: 'Resina de 1 superficie anterior',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RESTAURACION,
    subcategoria: 'Resina',
    piezas: [],
    costo: 700,
    duracion: 50,
    prioridad: 'media',
    requiereMateriales: ['Composite', 'Grabador ácido', 'Adhesivo'],
  },
  {
    codigo: 'D2391',
    descripcion: 'Resina de 1 superficie posterior',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RESTAURACION,
    subcategoria: 'Resina',
    piezas: [],
    costo: 750,
    duracion: 55,
    prioridad: 'media',
    requiereMateriales: ['Composite', 'Grabador ácido', 'Adhesivo'],
  },
  {
    codigo: 'D2392',
    descripcion: 'Resina de 2 superficies posterior',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RESTAURACION,
    subcategoria: 'Resina',
    piezas: [],
    costo: 950,
    duracion: 75,
    prioridad: 'media',
    requiereMateriales: ['Composite', 'Grabador ácido', 'Adhesivo'],
  },

  // ============================================================================
  // ENDODONCIA
  // ============================================================================
  {
    codigo: 'D3310',
    descripcion: 'Endodoncia anterior',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ENDODONCIA,
    subcategoria: 'Unirradicular',
    piezas: [],
    costo: 2500,
    duracion: 90,
    prioridad: 'alta',
    requiereMateriales: ['Limas endodónticas', 'Gutapercha', 'Cemento endodóntico'],
  },
  {
    codigo: 'D3320',
    descripcion: 'Endodoncia premolar',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ENDODONCIA,
    subcategoria: 'Birradicular',
    piezas: [],
    costo: 3000,
    duracion: 120,
    prioridad: 'alta',
    requiereMateriales: ['Limas endodónticas', 'Gutapercha', 'Cemento endodóntico'],
  },
  {
    codigo: 'D3330',
    descripcion: 'Endodoncia molar',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ENDODONCIA,
    subcategoria: 'Multirradicular',
    piezas: [],
    costo: 4000,
    duracion: 150,
    prioridad: 'alta',
    requiereMateriales: ['Limas endodónticas', 'Gutapercha', 'Cemento endodóntico'],
  },
  {
    codigo: 'D3346',
    descripcion: 'Retratamiento endodóntico',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ENDODONCIA,
    subcategoria: 'Retratamiento',
    piezas: [],
    costo: 3500,
    duracion: 120,
    prioridad: 'alta',
    requiereMateriales: ['Limas endodónticas', 'Gutapercha', 'Cemento endodóntico'],
  },

  // ============================================================================
  // PERIODONCIA
  // ============================================================================
  {
    codigo: 'D4341',
    descripcion: 'Raspado y alisado radicular por cuadrante',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PERIODONCIA,
    subcategoria: 'Terapia básica',
    piezas: [],
    costo: 1200,
    duracion: 60,
    prioridad: 'alta',
    requiereMateriales: ['Curetas Gracey', 'Anestesia local'],
  },
  {
    codigo: 'D4910',
    descripcion: 'Mantenimiento periodontal',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PERIODONCIA,
    subcategoria: 'Mantenimiento',
    piezas: [],
    costo: 800,
    duracion: 45,
    prioridad: 'media',
    requiereMateriales: ['Curetas Gracey'],
  },
  {
    codigo: 'D4260',
    descripcion: 'Injerto de tejido blando',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PERIODONCIA,
    subcategoria: 'Cirugía periodontal',
    piezas: [],
    costo: 3500,
    duracion: 90,
    prioridad: 'alta',
    requiereMateriales: ['Material de sutura', 'Anestesia local'],
  },

  // ============================================================================
  // CIRUGÍA ORAL
  // ============================================================================
  {
    codigo: 'D7111',
    descripcion: 'Extracción simple',
    categoria: CATEGORIAS_PROCEDIMIENTOS.CIRUGIA,
    subcategoria: 'Extracción',
    piezas: [],
    costo: 800,
    duracion: 30,
    prioridad: 'media',
    requiereMateriales: ['Fórceps', 'Anestesia local', 'Material de sutura'],
  },
  {
    codigo: 'D7210',
    descripcion: 'Extracción quirúrgica',
    categoria: CATEGORIAS_PROCEDIMIENTOS.CIRUGIA,
    subcategoria: 'Extracción',
    piezas: [],
    costo: 1500,
    duracion: 60,
    prioridad: 'alta',
    requiereMateriales: ['Fórceps', 'Osteótomo', 'Anestesia local', 'Material de sutura'],
  },
  {
    codigo: 'D7240',
    descripcion: 'Extracción de molar incluido',
    categoria: CATEGORIAS_PROCEDIMIENTOS.CIRUGIA,
    subcategoria: 'Extracción',
    piezas: [],
    costo: 2500,
    duracion: 90,
    prioridad: 'alta',
    requiereMateriales: ['Fórceps', 'Osteótomo', 'Anestesia local', 'Material de sutura'],
  },
  {
    codigo: 'D7310',
    descripcion: 'Alveoloplastia',
    categoria: CATEGORIAS_PROCEDIMIENTOS.CIRUGIA,
    subcategoria: 'Cirugía alveolar',
    piezas: [],
    costo: 1200,
    duracion: 45,
    prioridad: 'media',
    requiereMateriales: ['Fresa quirúrgica', 'Anestesia local', 'Material de sutura'],
  },

  // ============================================================================
  // PRÓTESIS
  // ============================================================================
  {
    codigo: 'D5110',
    descripcion: 'Corona completa de resina',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PROTESIS,
    subcategoria: 'Corona',
    piezas: [],
    costo: 3000,
    duracion: 120,
    prioridad: 'media',
    requiereMateriales: ['Acrílico para corona', 'Yeso tipo IV'],
  },
  {
    codigo: 'D5120',
    descripcion: 'Corona completa de porcelana',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PROTESIS,
    subcategoria: 'Corona',
    piezas: [],
    costo: 5000,
    duracion: 150,
    prioridad: 'media',
    requiereMateriales: ['Cerámica feldespática', 'Yeso tipo IV'],
  },
  {
    codigo: 'D5130',
    descripcion: 'Corona de metal-porcelana',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PROTESIS,
    subcategoria: 'Corona',
    piezas: [],
    costo: 4500,
    duracion: 140,
    prioridad: 'media',
    requiereMateriales: ['Aleación para metal-porcelana', 'Cerámica', 'Yeso tipo IV'],
  },
  {
    codigo: 'D5211',
    descripcion: 'Puente de resina por unidad',
    categoria: CATEGORIAS_PROCEDIMIENTOS.PROTESIS,
    subcategoria: 'Puente',
    piezas: [],
    costo: 4000,
    duracion: 180,
    prioridad: 'media',
    requiereMateriales: ['Acrílico para puente', 'Yeso tipo IV'],
  },

  // ============================================================================
  // ORTODONCIA
  // ============================================================================
  {
    codigo: 'D8010',
    descripcion: 'Consulta de ortodoncia',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ORTODONCIA,
    subcategoria: 'Consulta',
    piezas: [],
    costo: 500,
    duracion: 60,
    prioridad: 'media',
  },
  {
    codigo: 'D8080',
    descripcion: 'Tratamiento de ortodoncia completo',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ORTODONCIA,
    subcategoria: 'Tratamiento completo',
    piezas: [],
    costo: 30000,
    duracion: 720,
    prioridad: 'baja',
    requiereMateriales: ['Brackets', 'Arcos', 'Bandas'],
  },
  {
    codigo: 'D8210',
    descripcion: 'Aparato removible',
    categoria: CATEGORIAS_PROCEDIMIENTOS.ORTODONCIA,
    subcategoria: 'Aparatología',
    piezas: [],
    costo: 5000,
    duracion: 120,
    prioridad: 'media',
    requiereMateriales: ['Acrílico', 'Alambre'],
  },

  // ============================================================================
  // RADIOLOGÍA
  // ============================================================================
  {
    codigo: 'D0210',
    descripcion: 'Radiografía intraoral completa',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RADIOLOGIA,
    subcategoria: 'Serie completa',
    piezas: [],
    costo: 400,
    duracion: 20,
    prioridad: 'media',
  },
  {
    codigo: 'D0220',
    descripcion: 'Radiografía periapical',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RADIOLOGIA,
    subcategoria: 'Individual',
    piezas: [],
    costo: 150,
    duracion: 10,
    prioridad: 'media',
  },
  {
    codigo: 'D0270',
    descripcion: 'Radiografía bitewing',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RADIOLOGIA,
    subcategoria: 'Interproximal',
    piezas: [],
    costo: 200,
    duracion: 15,
    prioridad: 'media',
  },
  {
    codigo: 'D0330',
    descripcion: 'Radiografía panorámica',
    categoria: CATEGORIAS_PROCEDIMIENTOS.RADIOLOGIA,
    subcategoria: 'Panorámica',
    piezas: [],
    costo: 600,
    duracion: 15,
    prioridad: 'media',
  },
];

// Funciones de utilidad
export function obtenerProcedimientosPorCategoria(categoria: CategoriaProcedimiento): ProcedimientoDentalCategoria[] {
  return PROCEDIMIENTOS_DENTALES.filter(proc => proc.categoria === categoria);
}

export function obtenerProcedimientoPorCodigo(codigo: string): ProcedimientoDentalCategoria | undefined {
  return PROCEDIMIENTOS_DENTALES.find(proc => proc.codigo === codigo);
}

export function obtenerProcedimientosPorPrioridad(prioridad: 'alta' | 'media' | 'baja'): ProcedimientoDentalCategoria[] {
  return PROCEDIMIENTOS_DENTALES.filter(proc => proc.prioridad === prioridad);
}

export function obtenerProcedimientosPorSubcategoria(subcategoria: string): ProcedimientoDentalCategoria[] {
  return PROCEDIMIENTOS_DENTALES.filter(proc => proc.subcategoria === subcategoria);
}

export function obtenerProcedimientosConMateriales(): ProcedimientoDentalCategoria[] {
  return PROCEDIMIENTOS_DENTALES.filter(proc => proc.requiereMateriales && proc.requiereMateriales.length > 0);
}

export function obtenerCategoriasDisponibles(): CategoriaProcedimiento[] {
  const categorias = new Set<CategoriaProcedimiento>();
  PROCEDIMIENTOS_DENTALES.forEach(proc => categorias.add(proc.categoria));
  return Array.from(categorias);
}

export function obtenerSubcategoriasPorCategoria(categoria: CategoriaProcedimiento): string[] {
  const subcategorias = new Set<string>();
  PROCEDIMIENTOS_DENTALES
    .filter(proc => proc.categoria === categoria && proc.subcategoria)
    .forEach(proc => subcategorias.add(proc.subcategoria!));
  return Array.from(subcategorias);
}

export function buscarProcedimientosPorTexto(texto: string): ProcedimientoDentalCategoria[] {
  const textoBusqueda = texto.toLowerCase();
  return PROCEDIMIENTOS_DENTALES.filter(proc =>
    proc.codigo.toLowerCase().includes(textoBusqueda) ||
    proc.descripcion.toLowerCase().includes(textoBusqueda) ||
    proc.subcategoria?.toLowerCase().includes(textoBusqueda) ||
    proc.categoria.toLowerCase().includes(textoBusqueda)
  );
}

export function calcularCostoTotalProcedimientos(codigos: string[]): number {
  return codigos.reduce((total, codigo) => {
    const procedimiento = obtenerProcedimientoPorCodigo(codigo);
    return total + (procedimiento?.costo || 0);
  }, 0);
}

export function obtenerProcedimientosRecomendadosPorEstado(_piezas: number[], estado: string): ProcedimientoDentalCategoria[] {
  // Lógica para recomendar procedimientos basados en el estado dental
  const recomendaciones: ProcedimientoDentalCategoria[] = [];
  
  if (estado === 'cariado') {
    recomendaciones.push(
      ...PROCEDIMIENTOS_DENTALES.filter(proc =>
        proc.categoria === CATEGORIAS_PROCEDIMIENTOS.RESTAURACION ||
        proc.categoria === CATEGORIAS_PROCEDIMIENTOS.ENDODONCIA
      )
    );
  } else if (estado === 'ausente') {
    recomendaciones.push(
      ...PROCEDIMIENTOS_DENTALES.filter(proc =>
        proc.categoria === CATEGORIAS_PROCEDIMIENTOS.PROTESIS ||
        proc.categoria === CATEGORIAS_PROCEDIMIENTOS.CIRUGIA
      )
    );
  } else if (estado === 'periodontal') {
    recomendaciones.push(
      ...PROCEDIMIENTOS_DENTALES.filter(proc =>
        proc.categoria === CATEGORIAS_PROCEDIMIENTOS.PERIODONCIA
      )
    );
  }
  
  return recomendaciones;
}

export default PROCEDIMIENTOS_DENTALES;
