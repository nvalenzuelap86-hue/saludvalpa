// ============================================================================
// SERVICIO: Generador de PDF de Rutinas
// Genera PDFs profesionales de rutinas de ejercicios
// ============================================================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RutinaEjercicios, Ejercicio, Configuracion } from '../../../types';

/**
 * Genera PDF de una rutina de ejercicios
 */
export async function generarPDFRutina(
  rutina: RutinaEjercicios,
  ejercicios: Ejercicio[],
  configuracion: Configuracion,
  pacienteNombre?: string
): Promise<Blob> {
  const doc = new jsPDF();
  const margen = 20;
  let y = margen;

  // ============================================================================
  // FUNCIÓN AUXILIAR: Agregar marca de agua si es gratuita
  // ============================================================================
  const agregarMarcaDeAgua = () => {
    if (configuracion.licencia.tipo === 'gratuita' && configuracion.branding.mostrarMarcaDeAgua) {
      doc.setFontSize(50);
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'bold');
      
      // Rotar y centrar
      doc.saveGraphicsState();
      doc.text('saludvalpa', 105, 148, {
        align: 'center',
        angle: 45,
      });
      doc.restoreGraphicsState();
      
      // Restaurar color
      doc.setTextColor(0, 0, 0);
    }
  };

  agregarMarcaDeAgua();

  // ============================================================================
  // ENCABEZADO
  // ============================================================================

  // Logo (si existe)
  if (configuracion.branding.logo) {
    try {
      doc.addImage(
        configuracion.branding.logo,
        'PNG',
        margen,
        y,
        30,
        30
      );
    } catch (error) {
      console.error('Error al agregar logo:', error);
    }
  }

  // Información del profesional (a la derecha del logo)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(configuracion.branding.nombreProfesional, 200 - margen, y + 5, { align: 'right' });
  
  if (configuracion.branding.credenciales) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(configuracion.branding.credenciales, 200 - margen, y + 10, { align: 'right' });
  }

  if (configuracion.branding.especialidad) {
    doc.text(configuracion.branding.especialidad, 200 - margen, y + 15, { align: 'right' });
  }

  // Datos de contacto
  doc.setFontSize(8);
  y += 22;
  if (configuracion.datosContacto.telefono) {
    doc.text(`Tel: ${configuracion.datosContacto.telefono}`, 200 - margen, y, { align: 'right' });
    y += 4;
  }
  if (configuracion.datosContacto.email) {
    doc.text(`Email: ${configuracion.datosContacto.email}`, 200 - margen, y, { align: 'right' });
    y += 4;
  }
  if (configuracion.datosContacto.direccion) {
    doc.text(configuracion.datosContacto.direccion, 200 - margen, y, { align: 'right' });
  }

  y += 15;

  // ============================================================================
  // TÍTULO DE LA RUTINA
  // ============================================================================

  // Línea separadora
  doc.setDrawColor(2, 132, 199); // saludvalpa-blue
  doc.setLineWidth(0.5);
  doc.line(margen, y, 200 - margen, y);
  y += 10;

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('RUTINA DE EJERCICIOS', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(rutina.nombre, 105, y, { align: 'center' });
  y += 8;

  // Paciente asignado
  if (pacienteNombre) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Paciente: ${pacienteNombre}`, 105, y, { align: 'center' });
    y += 8;
  }

  // Línea separadora
  doc.setDrawColor(2, 132, 199);
  doc.line(margen, y, 200 - margen, y);
  y += 10;

  // ============================================================================
  // INFORMACIÓN DE LA RUTINA
  // ============================================================================

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Objetivo
  doc.setFont('helvetica', 'bold');
  doc.text('Objetivo:', margen, y);
  doc.setFont('helvetica', 'normal');
  doc.text(rutina.objetivo, margen + 25, y);
  y += 6;

  // Nivel
  doc.setFont('helvetica', 'bold');
  doc.text('Nivel:', margen, y);
  doc.setFont('helvetica', 'normal');
  doc.text(rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1), margen + 25, y);
  y += 6;

  // Frecuencia
  doc.setFont('helvetica', 'bold');
  doc.text('Frecuencia:', margen, y);
  doc.setFont('helvetica', 'normal');
  const frecuenciaTexto = `${rutina.frecuencia.diasPorSemana} días por semana${
    rutina.frecuencia.duracionSemanas ? ` durante ${rutina.frecuencia.duracionSemanas} semanas` : ''
  }`;
  doc.text(frecuenciaTexto, margen + 25, y);
  y += 6;

  // Duración estimada
  doc.setFont('helvetica', 'bold');
  doc.text('Duración estimada:', margen, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${rutina.duracionEstimadaMinutos} minutos por sesión`, margen + 25, y);
  y += 6;

  // Descripción (si existe)
  if (rutina.descripcion) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción:', margen, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const descripcionLineas = doc.splitTextToSize(rutina.descripcion, 200 - margen * 2);
    doc.text(descripcionLineas, margen, y);
    y += descripcionLineas.length * 5;
  }

  y += 5;

  // ============================================================================
  // TABLA DE EJERCICIOS
  // ============================================================================

  // Preparar datos para la tabla
  const datosTabla = rutina.ejercicios.map((ejEnRutina) => {
    const ejercicioInfo = ejercicios.find(e => e.id === ejEnRutina.ejercicioId);
    if (!ejercicioInfo) return null;

    const parametros: string[] = [];
    if (ejEnRutina.series && ejEnRutina.repeticiones) {
      parametros.push(`${ejEnRutina.series} x ${ejEnRutina.repeticiones}`);
    }
    if (ejEnRutina.duracionSegundos) {
      parametros.push(`${ejEnRutina.duracionSegundos}s`);
    }
    if (ejEnRutina.descansoSegundos) {
      parametros.push(`Descanso: ${ejEnRutina.descansoSegundos}s`);
    }

    return [
      ejEnRutina.orden.toString(),
      ejercicioInfo.nombre,
      ejercicioInfo.categoria.charAt(0).toUpperCase() + ejercicioInfo.categoria.slice(1),
      parametros.join('\n') || '-',
      ejEnRutina.notasEspeciales || '-',
    ];
  }).filter(Boolean);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Ejercicio', 'Categoría', 'Parámetros', 'Notas']],
    body: datosTabla as any,
    theme: 'striped',
    headStyles: {
      fillColor: [2, 132, 199], // saludvalpa-blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 50 },
    },
    margin: { left: margen, right: margen },
  });

  // Obtener posición Y después de la tabla
  y = (doc as any).lastAutoTable.finalY + 10;

  // ============================================================================
  // EQUIPO NECESARIO
  // ============================================================================

  if (rutina.equipoNecesario.length > 0) {
    // Nueva página si no hay espacio
    if (y > 250) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = margen;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipo Necesario:', margen, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    rutina.equipoNecesario.forEach((equipo) => {
      doc.text(`• ${equipo}`, margen + 5, y);
      y += 5;
    });

    y += 5;
  }

  // ============================================================================
  // NOTAS GENERALES
  // ============================================================================

  if (rutina.notasGenerales) {
    // Nueva página si no hay espacio
    if (y > 250) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = margen;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas Generales:', margen, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const notasLineas = doc.splitTextToSize(rutina.notasGenerales, 200 - margen * 2);
    doc.text(notasLineas, margen, y);
    y += notasLineas.length * 5;
  }

  // ============================================================================
  // DETALLES DE EJERCICIOS (Nueva página)
  // ============================================================================

  doc.addPage();
  agregarMarcaDeAgua();
  y = margen;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('DETALLES DE EJERCICIOS', 105, y, { align: 'center' });
  y += 10;

  doc.setTextColor(0, 0, 0);

  // Iterar por cada ejercicio
  for (const ejEnRutina of rutina.ejercicios) {
    const ejercicioInfo = ejercicios.find(e => e.id === ejEnRutina.ejercicioId);
    if (!ejercicioInfo) continue;

    // Nueva página si no hay espacio
    if (y > 250) {
      doc.addPage();
      agregarMarcaDeAgua();
      y = margen;
    }

    // Número y nombre
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${ejEnRutina.orden}. ${ejercicioInfo.nombre}`, margen, y);
    y += 6;

    // Descripción
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLineas = doc.splitTextToSize(ejercicioInfo.descripcion, 200 - margen * 2);
    doc.text(descLineas, margen, y);
    y += descLineas.length * 4 + 3;

    // Instrucciones
    doc.setFont('helvetica', 'bold');
    doc.text('Instrucciones:', margen, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    ejercicioInfo.instrucciones.forEach((instruccion, i) => {
      const instruccionTexto = `${i + 1}. ${instruccion}`;
      const lineas = doc.splitTextToSize(instruccionTexto, 200 - margen * 2 - 5);
      doc.text(lineas, margen + 5, y);
      y += lineas.length * 4;
    });

    // Parámetros
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.text('Parámetros:', margen, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    if (ejEnRutina.series && ejEnRutina.repeticiones) {
      doc.text(`• Series y Repeticiones: ${ejEnRutina.series} x ${ejEnRutina.repeticiones}`, margen + 5, y);
      y += 4;
    }
    if (ejEnRutina.duracionSegundos) {
      doc.text(`• Duración: ${ejEnRutina.duracionSegundos} segundos`, margen + 5, y);
      y += 4;
    }
    if (ejEnRutina.descansoSegundos) {
      doc.text(`• Descanso entre series: ${ejEnRutina.descansoSegundos} segundos`, margen + 5, y);
      y += 4;
    }

    // Notas especiales
    if (ejEnRutina.notasEspeciales) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.text('Notas especiales:', margen, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const notasLineas = doc.splitTextToSize(ejEnRutina.notasEspeciales, 200 - margen * 2 - 5);
      doc.text(notasLineas, margen + 5, y);
      y += notasLineas.length * 4;
    }

    // Contraindicaciones
    if (ejercicioInfo.contraindicaciones.length > 0) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 100, 0);
      doc.text('⚠ Contraindicaciones:', margen, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      ejercicioInfo.contraindicaciones.forEach((contraindicacion) => {
        doc.text(`• ${contraindicacion}`, margen + 5, y);
        y += 4;
      });
    }

    // Videos de referencia
    if (ejercicioInfo.videosUrls && ejercicioInfo.videosUrls.length > 0) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 200);
      doc.setFontSize(9);

      if (ejercicioInfo.videosUrls.length === 1) {
        doc.text('🎬 Ver video:', margen, y);
        const videoUrl = ejercicioInfo.videosUrls[0];
        const urlWidth = doc.getTextWidth(videoUrl);
        doc.textWithLink(videoUrl, margen + 28, y, { url: videoUrl });
        y += 5;
      } else {
        ejercicioInfo.videosUrls.forEach((videoUrl, idx) => {
          // Nueva página si no hay espacio
          if (y > 270) {
            doc.addPage();
            agregarMarcaDeAgua();
            y = margen;
          }
          doc.text(`🎬 Video ${idx + 1}:`, margen, y);
          const urlWidth = doc.getTextWidth(videoUrl);
          doc.textWithLink(videoUrl, margen + 28, y, { url: videoUrl });
          y += 5;
        });
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
    }

    y += 8; // Espacio antes del siguiente ejercicio
  }

  // ============================================================================
  // PIE DE PÁGINA (en todas las páginas)
  // ============================================================================

  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    
    // Línea superior
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margen, 285, 200 - margen, 285);

    // Pie de página
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const piePagina = configuracion.branding.piePagina || 
      'Documento generado con saludvalpa - Tu movimiento, nuestra ciencia';
    doc.text(piePagina, margen, 290);
    
    // Número de página
    doc.text(`Página ${i} de ${totalPaginas}`, 200 - margen, 290, { align: 'right' });
    
    // Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Generado: ${fechaGeneracion}`, 105, 290, { align: 'center' });
  }

  // ============================================================================
  // RETORNAR BLOB
  // ============================================================================

  return doc.output('blob');
}
