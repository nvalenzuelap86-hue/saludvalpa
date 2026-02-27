// ============================================================================
// saludvalpa 3.0 - GENERADOR DE HISTORIA CLÍNICA ODONTOLÓGICA PDF
// Componente para generar PDF de historia clínica dental
// ============================================================================

import type { DatosOdontologia } from '../../../types';
import { usePacientes } from '../../../hooks/usePacientes';

interface GenerarHistoriaOdontologicaProps {
  datosOdontologia: DatosOdontologia;
  pacienteId?: string;
  onGenerarPDF?: (pdfBlob: Blob) => void;
}

export default function GenerarHistoriaOdontologica({ 
  datosOdontologia, 
  pacienteId,
  onGenerarPDF 
}: GenerarHistoriaOdontologicaProps) {
  const { pacientes } = usePacientes();
  const paciente = pacientes.find(p => p.id === pacienteId);

  const generarPDF = async () => {
    try {
      // En una implementación real, aquí se generaría el PDF usando una librería como jsPDF
      // Por ahora, simulamos la generación
      const folio = `ODO-${Date.now().toString().slice(-6)}`;
      
      // Crear contenido HTML para el PDF
      const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Historia Clínica Odontológica - ${folio}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .folio { font-size: 14px; color: #666; }
            .section { margin-bottom: 25px; }
            .section-title { background-color: #f0f0f0; padding: 8px; font-weight: bold; margin-bottom: 10px; }
            .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .info-item { margin-bottom: 5px; }
            .label { font-weight: bold; color: #555; }
            .odontograma-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
            .summary-item { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .treatment-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .treatment-table th, .treatment-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .treatment-table th { background-color: #f5f5f5; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-line { width: 300px; border-top: 1px solid #000; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Historia Clínica Odontológica</h1>
            <div class="folio">Folio: ${folio}</div>
            <div>Fecha: ${new Date().toLocaleDateString('es-MX')}</div>
          </div>

          <div class="section">
            <div class="section-title">Datos del Paciente</div>
            <div class="patient-info">
              <div class="info-item"><span class="label">Nombre:</span> ${paciente?.nombre || 'No especificado'} ${paciente?.apellidos || ''}</div>
              <div class="info-item"><span class="label">Edad:</span> ${paciente?.edad || 'No especificado'}</div>
              <div class="info-item"><span class="label">Género:</span> ${paciente?.genero || 'No especificado'}</div>
              <div class="info-item"><span class="label">Teléfono:</span> ${paciente?.telefono || 'No especificado'}</div>
              <div class="info-item"><span class="label">Email:</span> ${paciente?.email || 'No especificado'}</div>
              <div class="info-item"><span class="label">Fecha de nacimiento:</span> ${paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-MX') : 'No especificado'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Motivo de Consulta</div>
            <p>${datosOdontologia.motivoConsulta || 'No especificado'}</p>
          </div>

          <div class="section">
            <div class="section-title">Antecedentes Odontológicos</div>
            <p><strong>Tratamientos previos:</strong> ${datosOdontologia.antecedentesOdontologicos?.tratamientosPrevios.join(', ') || 'Ninguno'}</p>
            <p><strong>Traumatismos:</strong> ${datosOdontologia.antecedentesOdontologicos?.traumatismos.join(', ') || 'Ninguno'}</p>
            <p><strong>Hábitos:</strong> ${datosOdontologia.antecedentesOdontologicos?.habitos.join(', ') || 'Ninguno'}</p>
            <p><strong>Prótesis:</strong> ${datosOdontologia.antecedentesOdontologicos?.protesis.join(', ') || 'Ninguna'}</p>
          </div>

          <div class="section">
            <div class="section-title">Resumen del Odontograma</div>
            <div class="odontograma-summary">
              <div class="summary-item">
                <div style="font-size: 24px; color: #4CAF50;">${datosOdontologia.odontograma?.piezas.filter(p => p.estado === 'sano').length || 0}</div>
                <div>Piezas sanas</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 24px; color: #F44336;">${datosOdontologia.odontograma?.piezas.filter(p => p.estado === 'cariado').length || 0}</div>
                <div>Piezas cariadas</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 24px; color: #2196F3;">${datosOdontologia.odontograma?.piezas.filter(p => p.estado === 'obturado').length || 0}</div>
                <div>Piezas obturadas</div>
              </div>
              <div class="summary-item">
                <div style="font-size: 24px; color: #9E9E9E;">${datosOdontologia.odontograma?.piezas.filter(p => p.estado === 'ausente').length || 0}</div>
                <div>Piezas ausentes</div>
              </div>
            </div>
            <p><strong>Notas del odontograma:</strong> ${datosOdontologia.odontograma?.notas || 'Sin notas'}</p>
          </div>

          <div class="section">
            <div class="section-title">Diagnóstico</div>
            <p><strong>Caries:</strong> ${datosOdontologia.diagnostico.caries.join(', ') || 'No detectadas'}</p>
            <p><strong>Enfermedad periodontal:</strong> ${datosOdontologia.diagnostico.enfermedadPeriodontal.join(', ') || 'No detectada'}</p>
            <p><strong>Maloclusión:</strong> ${datosOdontologia.diagnostico.maloclusion.join(', ') || 'No detectada'}</p>
            <p><strong>Otros diagnósticos:</strong> ${datosOdontologia.diagnostico.otros.join(', ') || 'Ninguno'}</p>
          </div>

          <div class="section">
            <div class="section-title">Plan de Tratamiento</div>
            ${datosOdontologia.tratamientoPlanificado.length > 0 ? `
              <table class="treatment-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Piezas</th>
                    <th>Costo</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  ${datosOdontologia.tratamientoPlanificado.map(proc => `
                    <tr>
                      <td>${proc.codigo}</td>
                      <td>${proc.descripcion}</td>
                      <td>${proc.piezas.join(', ')}</td>
                      <td>$${proc.costo.toFixed(2)}</td>
                      <td>${proc.prioridad}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p><strong>Total estimado:</strong> $${datosOdontologia.tratamientoPlanificado.reduce((sum, p) => sum + p.costo, 0).toFixed(2)}</p>
            ` : '<p>No hay procedimientos planificados</p>'}
          </div>

          <div class="section">
            <div class="section-title">Higiene y Prevención</div>
            <p><strong>Índice de placa:</strong> ${datosOdontologia.indicePlaca || 0}/3</p>
            <p><strong>Índice de sangrado:</strong> ${datosOdontologia.indiceSangrado || 0}/3</p>
            <p><strong>Instrucciones de higiene:</strong></p>
            <ul>
              ${datosOdontologia.instruccionesHigiene.map(inst => `<li>${inst}</li>`).join('') || '<li>No se proporcionaron instrucciones específicas</li>'}
            </ul>
          </div>

          <div class="footer">
            <p>Documento generado por saludvalpa 3.0 - Sistema de gestión odontológica</p>
            <p>Este documento tiene validez legal y debe ser conservado en el expediente clínico del paciente.</p>
          </div>

          <div class="signature">
            <div class="signature-line">
              <br>
              Firma del Odontólogo
            </div>
            <div class="signature-line">
              <br>
              Firma del Paciente o Tutor
            </div>
          </div>
        </body>
        </html>
      `;

      // En una implementación real, convertiríamos el HTML a PDF
      // Por ahora, creamos un blob de texto simulado
      const blob = new Blob([contenidoHTML], { type: 'text/html' });
      
      if (onGenerarPDF) {
        onGenerarPDF(blob);
      }

      // Descargar el archivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historia_odontologica_${folio}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, folio };
    } catch (error) {
      console.error('Error generando PDF:', error);
      return { success: false, error };
    }
  };

  return (
    <div className="generar-historia-odontologica p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Historia Clínica Odontológica</h3>
          <p className="text-sm text-gray-600">
            Generar documento PDF completo con todos los datos registrados
          </p>
        </div>
        <button
          onClick={generarPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>📋</span>
          Generar PDF
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded text-sm">
        <p className="font-medium mb-1">Contenido incluido en el PDF:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Datos completos del paciente</li>
          <li>Motivo de consulta y antecedentes</li>
          <li>Resumen del odontograma</li>
          <li>Diagnóstico odontológico</li>
          <li>Plan de tratamiento detallado</li>
          <li>Instrucciones de higiene</li>
          <li>Espacios para firmas</li>
        </ul>
      </div>

      {paciente && (
        <div className="mt-4 p-3 bg-green-50 rounded text-sm">
          <p className="font-medium">Paciente asociado:</p>
          <p>{paciente.nombre} {paciente.apellidos} • {paciente.edad} años • {paciente.genero}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Nota:</strong> En producción, este componente usaría una librería como jsPDF 
          para generar un PDF real. Actualmente genera un archivo HTML que puede ser convertido.
        </p>
      </div>
    </div>
  );
}