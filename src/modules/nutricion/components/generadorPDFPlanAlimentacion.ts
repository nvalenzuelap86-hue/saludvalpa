// ============================================================================
// saludvalpa 3.0 - GENERADOR PDF PLAN DE ALIMENTACIÓN
// Genera PDFs profesionales de planes de alimentación
// Sigue el patrón de generadorPDFRutina.ts
// ============================================================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PlanAlimentacion, ComidaEnPlan } from '../../../types/nutricion';
import type { Configuracion } from '../../../types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface OpcionesPDFPlan {
  incluirRecetas?: boolean;
  incluirListaCompras?: boolean;
  incluirRecomendaciones?: boolean;
  mensajePersonalizado?: string;
  recomendacionesEditadas?: string[];
  notasAdicionales?: string;
}

export interface DatosPacientePDF {
  nombre: string;
  edad?: number;
}

export interface DatosProfesionalPDF {
  nombre: string;
  cedula?: string;
}

export interface ListaComprasPDF {
  ingredientes: { nombre: string; cantidad: string; categoria: string }[];
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const MARGEN = 20;
const COLOR_PRIMARIO: [number, number, number] = [2, 132, 199];
const COLOR_GRIS: [number, number, number] = [100, 100, 100];
const COLOR_FONDO_TABLA: [number, number, number] = [245, 247, 250];

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

const OBJETIVO_LABELS: Record<string, string> = {
  perder_peso: 'Pérdida de peso',
  ganar_musculo: 'Ganancia muscular',
  mantener: 'Mantenimiento',
  control_enfermedad: 'Control de enfermedad',
  rendimiento: 'Rendimiento deportivo',
};

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Genera un PDF de un plan de alimentación
 */
export async function generarPDFPlanAlimentacion(
  plan: PlanAlimentacion,
  paciente: DatosPacientePDF,
  configuracion: Configuracion,
  opciones?: OpcionesPDFPlan
): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = MARGEN;

  // ============================================================================
  // FUNCIÓN AUXILIAR: Marca de agua
  // ============================================================================
  const agregarMarcaDeAgua = () => {
    if (configuracion.licencia.tipo === 'gratuita' && configuracion.branding.mostrarMarcaDeAgua) {
      doc.setFontSize(50);
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'bold');
      doc.saveGraphicsState();
      doc.text('saludvalpa', pageWidth / 2, doc.internal.pageSize.getHeight() / 2, {
        align: 'center',
        angle: 45,
      });
      doc.restoreGraphicsState();
      doc.setTextColor(0, 0, 0);
    }
  };

  // ============================================================================
  // FUNCIÓN AUXILIAR: Footer
  // ============================================================================
  const agregarFooter = () => {
    const totalPaginas = doc.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(MARGEN, 285, pageWidth - MARGEN, 285);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);

      const piePagina = configuracion.branding.piePagina ||
        'Documento generado con saludvalpa - Tu salud, nuestra prioridad';
      doc.text(piePagina, MARGEN, 290);
      doc.text(`Página ${i} de ${totalPaginas}`, pageWidth - MARGEN, 290, { align: 'right' });

      const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.text(`Generado: ${fechaGeneracion}`, pageWidth / 2, 290, { align: 'center' });
    }
  };

  // ============================================================================
  // FUNCIÓN AUXILIAR: Verificar espacio y nueva página
  // ============================================================================
  const checkSpace = (needed: number = 20) => {
    if (y > 260) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = MARGEN;
    }
  };

  agregarMarcaDeAgua();

  // ============================================================================
  // 1. HEADER: Logo + Información profesional
  // ============================================================================
  if (configuracion.branding.logo) {
    try {
      doc.addImage(configuracion.branding.logo, 'PNG', MARGEN, y, 30, 30);
    } catch (error) {
      console.error('Error al agregar logo:', error);
    }
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(configuracion.branding.nombreProfesional, pageWidth - MARGEN, y + 5, { align: 'right' });

  if (configuracion.branding.credenciales) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(configuracion.branding.credenciales, pageWidth - MARGEN, y + 10, { align: 'right' });
  }

  if (configuracion.branding.especialidad) {
    doc.text(configuracion.branding.especialidad, pageWidth - MARGEN, y + 15, { align: 'right' });
  }

  doc.setFontSize(8);
  y += 22;
  if (configuracion.datosContacto.telefono) {
    doc.text(`Tel: ${configuracion.datosContacto.telefono}`, pageWidth - MARGEN, y, { align: 'right' });
    y += 4;
  }
  if (configuracion.datosContacto.email) {
    doc.text(`Email: ${configuracion.datosContacto.email}`, pageWidth - MARGEN, y, { align: 'right' });
    y += 4;
  }
  if (configuracion.datosContacto.direccion) {
    doc.text(configuracion.datosContacto.direccion, pageWidth - MARGEN, y, { align: 'right' });
  }

  y += 15;

  // ============================================================================
  // 2. TÍTULO
  // ============================================================================
  doc.setDrawColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
  doc.setLineWidth(0.5);
  doc.line(MARGEN, y, pageWidth - MARGEN, y);
  y += 10;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
  doc.text('PLAN DE ALIMENTACIÓN', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(plan.nombre, pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Paciente
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Paciente: ${paciente.nombre}${paciente.edad ? ` (${paciente.edad} años)` : ''}`, pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setDrawColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
  doc.line(MARGEN, y, pageWidth - MARGEN, y);
  y += 10;

  // ============================================================================
  // 3. INFORMACIÓN DEL PLAN
  // ============================================================================
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Objetivo
  doc.setFont('helvetica', 'bold');
  doc.text('Objetivo:', MARGEN, y);
  doc.setFont('helvetica', 'normal');
  doc.text(OBJETIVO_LABELS[plan.objetivo] || plan.objetivo, MARGEN + 25, y);
  y += 6;

  // Descripción
  if (plan.descripcion) {
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción:', MARGEN, y);
    doc.setFont('helvetica', 'normal');
    const descLineas = doc.splitTextToSize(plan.descripcion, pageWidth - MARGEN * 2 - 25);
    doc.text(descLineas, MARGEN + 25, y);
    y += descLineas.length * 5 + 2;
  }

  y += 3;

  // Requerimientos calóricos - caja de macros
  doc.setFont('helvetica', 'bold');
  doc.text('Requerimientos diarios:', MARGEN, y);
  y += 6;

  const macroStartY = y;
  const macroBoxW = (pageWidth - MARGEN * 2) / 4;

  // Calorías
  doc.setFillColor(COLOR_FONDO_TABLA[0], COLOR_FONDO_TABLA[1], COLOR_FONDO_TABLA[2]);
  doc.rect(MARGEN, y, macroBoxW - 3, 18, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
  doc.text(`${plan.requerimientos.calorias}`, MARGEN + (macroBoxW - 3) / 2, y + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
  doc.text('kcal/día', MARGEN + (macroBoxW - 3) / 2, y + 14, { align: 'center' });

  // Proteínas
  doc.rect(MARGEN + macroBoxW, y, macroBoxW - 3, 18, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text(`${plan.requerimientos.proteinas}g`, MARGEN + macroBoxW + (macroBoxW - 3) / 2, y + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
  doc.text('Proteínas', MARGEN + macroBoxW + (macroBoxW - 3) / 2, y + 14, { align: 'center' });

  // Carbohidratos
  doc.rect(MARGEN + macroBoxW * 2, y, macroBoxW - 3, 18, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11);
  doc.text(`${plan.requerimientos.carbohidratos}g`, MARGEN + macroBoxW * 2 + (macroBoxW - 3) / 2, y + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
  doc.text('Carbohidratos', MARGEN + macroBoxW * 2 + (macroBoxW - 3) / 2, y + 14, { align: 'center' });

  // Grasas
  doc.rect(MARGEN + macroBoxW * 3, y, macroBoxW - 3, 18, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text(`${plan.requerimientos.grasas}g`, MARGEN + macroBoxW * 3 + (macroBoxW - 3) / 2, y + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
  doc.text('Grasas', MARGEN + macroBoxW * 3 + (macroBoxW - 3) / 2, y + 14, { align: 'center' });

  y = macroStartY + 25;

  // ============================================================================
  // 4. MENSAJE PERSONALIZADO (opcional)
  // ============================================================================
  if (opciones?.mensajePersonalizado) {
    checkSpace(30);
    y += 3;
    doc.setDrawColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, y, pageWidth - MARGEN, y);
    y += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    const msgLineas = doc.splitTextToSize(opciones.mensajePersonalizado, pageWidth - MARGEN * 2);
    doc.text(msgLineas, MARGEN, y);
    y += msgLineas.length * 5 + 5;

    doc.setDrawColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, y, pageWidth - MARGEN, y);
    y += 8;
  }

  // ============================================================================
  // 5. TABLA SEMANAL DE COMIDAS
  // ============================================================================
  checkSpace(40);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
  doc.text('PLAN SEMANAL DE COMIDAS', pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setTextColor(0, 0, 0);

  const diasData = prepararDatosSemanales(plan);

  const headRow = ['Día', 'Desayuno', 'Col. Mat.', 'Comida', 'Col. Vesp.', 'Cena'];
  const bodyRows = diasData.map((dia) => [
    dia.dia,
    dia.desayuno,
    dia.colacion1,
    dia.comida,
    dia.colacion2,
    dia.cena,
  ]);

  autoTable(doc, {
    startY: y,
    head: [headRow],
    body: bodyRows,
    theme: 'striped',
    headStyles: {
      fillColor: [COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1.5,
    },
    columnStyles: {
      0: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 30 },
      2: { cellWidth: 28 },
      3: { cellWidth: 30 },
      4: { cellWidth: 28 },
      5: { cellWidth: 30 },
    },
    margin: { left: MARGEN, right: MARGEN },
    didParseCell: (data) => {
      if (data.section === 'body' && data.cell.raw === '—') {
        data.cell.styles.textColor = [180, 180, 180];
        data.cell.styles.fontStyle = 'normal';
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ============================================================================
  // 6. RECETAS (opcional)
  // ============================================================================
  if (opciones?.incluirRecetas !== false) {
    const recetasUnicas = extraerRecetasUnicas(plan);

    if (recetasUnicas.length > 0) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = MARGEN;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
      doc.text('RECETAS', pageWidth / 2, y, { align: 'center' });
      y += 10;
      doc.setTextColor(0, 0, 0);

      for (const receta of recetasUnicas) {
        checkSpace(35);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(receta.nombre, MARGEN, y);
        y += 6;

        // Ingredientes
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Ingredientes:', MARGEN, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        receta.ingredientes.forEach((ing) => {
          checkSpace(5);
          doc.text(`• ${ing}`, MARGEN + 5, y);
          y += 4.5;
        });

        // Preparación
        if (receta.preparacion) {
          y += 2;
          checkSpace(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Preparación:', MARGEN, y);
          y += 5;
          doc.setFont('helvetica', 'normal');
          const prepLineas = doc.splitTextToSize(receta.preparacion, pageWidth - MARGEN * 2 - 5);
          doc.text(prepLineas, MARGEN + 5, y);
          y += prepLineas.length * 4.5 + 3;
        }

        // Nutrientes
        y += 1;
        checkSpace(8);
        doc.setFontSize(8);
        doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
        doc.text(
          `🔥 ${receta.calorias} kcal | 🥩 ${receta.proteinas}g prot. | 🍚 ${receta.carbohidratos}g carb. | 🧈 ${receta.grasas}g gras.`,
          MARGEN,
          y
        );
        y += 3;
        doc.setTextColor(0, 0, 0);

        // Separador
        y += 3;
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(MARGEN, y, pageWidth - MARGEN, y);
        y += 5;
      }
    }
  }

  // ============================================================================
  // 7. LISTA DE COMPRAS (opcional)
  // ============================================================================
  const incluirLista = opciones?.incluirListaCompras !== undefined ? opciones.incluirListaCompras : true;
  if (incluirLista) {
    const listaCompras = generarListaComprasDesdePlan(plan);

    if (listaCompras.ingredientes.length > 0) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = MARGEN;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
      doc.text('LISTA DE COMPRAS', pageWidth / 2, y, { align: 'center' });
      y += 8;
      doc.setTextColor(0, 0, 0);

      // Totales rápidos
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLOR_GRIS[0], COLOR_GRIS[1], COLOR_GRIS[2]);
      doc.text(
        `Totales semanales: ${listaCompras.totalCalorias} kcal | ${listaCompras.totalProteinas}g prot. | ${listaCompras.totalCarbohidratos}g carb. | ${listaCompras.totalGrasas}g gras.`,
        pageWidth / 2,
        y,
        { align: 'center' }
      );
      y += 8;

      // Agrupar por categoría
      const categorias = agruparPorCategoria(listaCompras.ingredientes);
      const categoriaKeys = Object.keys(categorias);

      for (const categoria of categoriaKeys) {
        const items = categorias[categoria];
        checkSpace(20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
        doc.text(categoria, MARGEN, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        for (const item of items) {
          checkSpace(5);
          doc.text(`• ${item.nombre}`, MARGEN + 5, y);
          doc.text(item.cantidad, pageWidth - MARGEN, y, { align: 'right' });
          y += 4.5;
        }

        y += 3;
      }
    }
  }

  // ============================================================================
  // 8. RECOMENDACIONES (opcional)
  // ============================================================================
  const recomendaciones = opciones?.recomendacionesEditadas || plan.recomendaciones;
  const mostrarRecomendaciones = opciones?.incluirRecomendaciones !== false;

  if (mostrarRecomendaciones && recomendaciones.length > 0) {
    checkSpace(30);

    if (y > 230) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = MARGEN;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLOR_PRIMARIO[0], COLOR_PRIMARIO[1], COLOR_PRIMARIO[2]);
    doc.text('RECOMENDACIONES NUTRICIONALES', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    for (const rec of recomendaciones) {
      checkSpace(6);
      const recLineas = doc.splitTextToSize(`• ${rec}`, pageWidth - MARGEN * 2);
      doc.text(recLineas, MARGEN, y);
      y += recLineas.length * 4.5 + 2;
    }

    y += 5;
  }

  // ============================================================================
  // 9. NOTAS ADICIONALES (opcional)
  // ============================================================================
  if (opciones?.notasAdicionales) {
    checkSpace(20);

    if (y > 250) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = MARGEN;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas adicionales:', MARGEN, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const notasLineas = doc.splitTextToSize(opciones.notasAdicionales, pageWidth - MARGEN * 2);
    doc.text(notasLineas, MARGEN, y);
    y += notasLineas.length * 5;
  }

  // ============================================================================
  // FOOTER
  // ============================================================================
  agregarFooter();

  return doc.output('blob');
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

interface DiaSemanaData {
  dia: string;
  desayuno: string;
  colacion1: string;
  comida: string;
  colacion2: string;
  cena: string;
}

/**
 * Prepara los datos semanales para la tabla
 */
function prepararDatosSemanales(plan: PlanAlimentacion): DiaSemanaData[] {
  if (plan.comidasPorDia && plan.comidasPorDia.length > 0) {
    return plan.comidasPorDia.map((dia) => {
      const getComida = (tipo: string) => {
        const comidas = dia.comidas.filter((c) => c.tipo === tipo);
        if (comidas.length === 0) return '—';
        return comidas
          .map((c) => `${c.nombre}${c.porcionMultiplicador !== 1 ? ` (x${c.porcionMultiplicador})` : ''}`)
          .join('\n');
      };

      const diaMap: Record<string, string> = {
        lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
        jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
      };
      const diaLabel = diaMap[dia.dia] || dia.dia;

      return {
        dia: diaLabel,
        desayuno: getComida('desayuno'),
        colacion1: getComida('colacion1'),
        comida: getComida('comida'),
        colacion2: getComida('colacion2'),
        cena: getComida('cena'),
      };
    });
  }

  const getComidasStr = (tipo: ComidaEnPlan['tipo']) => {
    const comidas = plan.distribucionComidas[tipo] || [];
    if (comidas.length === 0) return '—';
    return comidas
      .map((c) => `${c.nombre}${c.porcionMultiplicador !== 1 ? ` (x${c.porcionMultiplicador})` : ''}`)
      .join('\n');
  };

  return [{
    dia: 'Diario',
    desayuno: getComidasStr('desayuno'),
    colacion1: getComidasStr('colacion1'),
    comida: getComidasStr('comida'),
    colacion2: getComidasStr('colacion2'),
    cena: getComidasStr('cena'),
  }];
}

interface RecetaData {
  nombre: string;
  ingredientes: string[];
  preparacion?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

/**
 * Extrae recetas únicas de un plan
 */
function extraerRecetasUnicas(plan: PlanAlimentacion): RecetaData[] {
  const todasLasComidas = obtenerTodasLasComidas(plan);
  const vistas = new Set<string>();
  const recetas: RecetaData[] = [];

  for (const comida of todasLasComidas) {
    if (vistas.has(comida.nombre.toLowerCase())) continue;
    vistas.add(comida.nombre.toLowerCase());

    recetas.push({
      nombre: comida.nombre,
      ingredientes: comida.ingredientes || [],
      preparacion: comida.preparacion,
      calorias: comida.nutrientes?.calorias || 0,
      proteinas: comida.nutrientes?.proteinas || 0,
      carbohidratos: comida.nutrientes?.carbohidratos || 0,
      grasas: comida.nutrientes?.grasas || 0,
    });
  }

  return recetas;
}

/**
 * Obtiene todas las comidas del plan
 */
function obtenerTodasLasComidas(plan: PlanAlimentacion): ComidaEnPlan[] {
  if (plan.comidasPorDia && plan.comidasPorDia.length > 0) {
    return plan.comidasPorDia.flatMap((dia) => dia.comidas);
  }

  return [
    ...plan.distribucionComidas.desayuno,
    ...plan.distribucionComidas.colacion1,
    ...plan.distribucionComidas.comida,
    ...plan.distribucionComidas.colacion2,
    ...plan.distribucionComidas.cena,
  ];
}

/**
 * Agrupa ingredientes por categoría
 */
function agruparPorCategoria(
  ingredientes: { nombre: string; cantidad: string; categoria: string }[]
): Record<string, { nombre: string; cantidad: string; categoria: string }[]> {
  const agrupado: Record<string, { nombre: string; cantidad: string; categoria: string }[]> = {};
  for (const ing of ingredientes) {
    if (!agrupado[ing.categoria]) {
      agrupado[ing.categoria] = [];
    }
    agrupado[ing.categoria].push(ing);
  }
  return agrupado;
}

/**
 * Genera lista de compras desde los datos del plan
 */
function generarListaComprasDesdePlan(plan: PlanAlimentacion): {
  ingredientes: { nombre: string; cantidad: string; categoria: string }[];
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
} {
  const todasLasComidas = obtenerTodasLasComidas(plan);
  const ingredientesMap = new Map<string, { nombre: string; cantidad: string; categoria: string; count: number }>();

  const categoriasIngredientes: { patrones: RegExp[]; categoria: string }[] = [
    { patrones: [/pollo/i, /pavo/i, /pescado/i, /salmón/i, /atún/i, /res/i, /cerdo/i, /carne/i, /huevo/i, /claras/i], categoria: 'Proteínas' },
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
      const nombreLimpio = ingrediente.replace(/^[\d\/\s\.]+(taza|cdas|cdta|cda|pieza|unidad|pizca|rebanada|rodaja|trozos|filete|scoop|ramita|diente|hoja|puñado|manojo|bolsa|paquete|lata|frasco|botella|vaso)?(s)?\s+(de\s+)?/i, '').trim();
      const cantidadMatch = ingrediente.match(/^([\d\/\s\.]+)/);
      const cantidadBase = cantidadMatch ? cantidadMatch[1].trim() : '1';
      const unidadMatch = ingrediente.match(/^[\d\/\s\.]+\s*([a-zA-Záéíóúñ]+)/);
      const unidad = unidadMatch ? unidadMatch[1] : '';

      let categoria = 'Otros';
      for (const grupo of categoriasIngredientes) {
        if (grupo.patrones.some((p) => p.test(nombreLimpio) || p.test(ingrediente))) {
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

  // Calcular totales
  const totalCalorias = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.calorias || 0) * (c.porcionMultiplicador || 1)), 0);
  const totalProteinas = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.proteinas || 0) * (c.porcionMultiplicador || 1)), 0);
  const totalCarbohidratos = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.carbohidratos || 0) * (c.porcionMultiplicador || 1)), 0);
  const totalGrasas = todasLasComidas.reduce((sum, c) => sum + Math.round((c.nutrientes?.grasas || 0) * (c.porcionMultiplicador || 1)), 0);

  const ingredientes = Array.from(ingredientesMap.values())
    .sort((a, b) => {
      if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
      return a.nombre.localeCompare(b.nombre);
    });

  return {
    ingredientes: ingredientes.map((i) => ({
      nombre: i.nombre,
      cantidad: i.count > 1 ? `${i.cantidad} (x${Math.round(i.count)})` : i.cantidad,
      categoria: i.categoria,
    })),
    totalCalorias,
    totalProteinas,
    totalCarbohidratos,
    totalGrasas,
  };
}