// ============================================================================
// COMPONENTE: RutinasPaciente
// Gestión de rutinas desde el perfil del paciente
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../../../types';
import { TipoProfesion } from '../../../types';
import { useRutinas } from '../hooks/useRutinas';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { useAppStore } from '../../../stores/appStore';
import { formatearFecha } from '../../../utils/helpers';
import Card from '../../../components/shared/Card';
import Modal from '../../../components/shared/Modal';
import EditorRutinaSimple from './EditorRutinaSimple';
import VistaPrevia from './VistaPrevia';
import { generarPDFRutina } from './generadorPDFRutina';
import { db } from '../../../db/database';

interface RutinasPacienteProps {
  paciente: Paciente;
}

const RutinasPaciente = ({ paciente }: RutinasPacienteProps) => {
  const { configuracion } = useAppStore();
  const { rutinas, eliminarRutina, calcularDuracion } = useRutinas();
  const { obtenerEjercicio } = useBiblioteca();
  
  // Estados para modales
  const [modalEditorAbierto, setModalEditorAbierto] = useState(false);
  const [modalVistaAbierto, setModalVistaAbierto] = useState(false);
  const [rutinaEditando, setRutinaEditando] = useState<string | null>(null);
  const [rutinaViendo, setRutinaViendo] = useState<string | null>(null);

  // Filtrar rutinas del paciente
  const rutinasPaciente = rutinas?.filter(r => r.pacienteId === paciente.id) || [];

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleNuevaRutina = () => {
    setRutinaEditando(null);
    setModalEditorAbierto(true);
  };

  const handleEditarRutina = (rutinaId: string) => {
    setRutinaEditando(rutinaId);
    setModalEditorAbierto(true);
  };

  const handleVerRutina = (rutinaId: string) => {
    setRutinaViendo(rutinaId);
    setModalVistaAbierto(true);
  };

  const handleEliminarRutina = async (rutinaId: string, nombreRutina: string) => {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar la rutina "${nombreRutina}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    try {
      await eliminarRutina(rutinaId);
    } catch (error) {
      alert('Error al eliminar rutina: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleGenerarPDF = async (rutinaId: string) => {
    const rutina = rutinas?.find(r => r.id === rutinaId);
    if (!rutina || !configuracion) {
      alert('Error: No se pudo obtener la información necesaria');
      return;
    }

    try {
      // Obtener ejercicios completos
      const ejerciciosCompletos = await Promise.all(
        rutina.ejercicios.map(async (ej) => {
          return await obtenerEjercicio(ej.ejercicioId);
        })
      );

      const ejerciciosValidos = ejerciciosCompletos.filter((e): e is NonNullable<typeof e> => e !== null);

      if (ejerciciosValidos.length === 0) {
        alert('Error: No se pudieron cargar los ejercicios de la rutina');
        return;
      }

      // Generar PDF con el nombre completo del paciente
      const pdfBlob = await generarPDFRutina(
        rutina,
        ejerciciosValidos,
        configuracion,
        `${paciente.nombre} ${paciente.apellidos}`
      );

      // Convertir PDF a base64 para guardar en IndexedDB
      const contenidoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Quitar el prefijo "data:application/pdf;base64,"
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // Guardar en base de datos
      const documento = {
        id: crypto.randomUUID(),
        tipo: 'plan_tratamiento' as const,
        nombre: `Rutina - ${rutina.nombre}`,
        fechaCreacion: new Date(),
        contenidoBase64,
        pacienteId: paciente.id,
        profesionalId: '1',
        profesion: TipoProfesion.FISIOTERAPIA,
        firmado: false,
        metadata: {
          rutinaId: rutina.id,
          rutinaNombre: rutina.nombre,
        },
      };

      await db.documentos.add(documento);

      // Descargar automáticamente
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${rutina.nombre.replace(/\s+/g, '_')}_${paciente.nombre}_${paciente.apellidos}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ PDF generado y guardado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  const cerrarEditor = () => {
    setModalEditorAbierto(false);
    setRutinaEditando(null);
  };

  const cerrarVista = () => {
    setModalVistaAbierto(false);
    setRutinaViendo(null);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const obtenerBadgeNivel = (nivel: string) => {
    const colores = {
      principiante: 'bg-green-100 text-green-700',
      intermedio: 'bg-yellow-100 text-yellow-700',
      avanzado: 'bg-red-100 text-red-700',
    };
    return colores[nivel as keyof typeof colores] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rutinas de Ejercicios</h3>
            <p className="text-sm text-gray-500 mt-1">
              {rutinasPaciente.length === 0 
                ? 'No hay rutinas asignadas' 
                : `${rutinasPaciente.length} rutina${rutinasPaciente.length !== 1 ? 's' : ''} asignada${rutinasPaciente.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <button
            onClick={handleNuevaRutina}
            className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors flex items-center gap-2 text-sm"
          >
            ➕ Nueva Rutina
          </button>
        </div>

        {rutinasPaciente.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-4xl block mb-2">🗓️</span>
            <p className="text-sm">No hay rutinas de ejercicios asignadas</p>
            <p className="text-xs mt-2">Crea una rutina personalizada para {paciente.nombre}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rutinasPaciente.map((rutina) => (
              <div
                key={rutina.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-saludvalpa-blue transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{rutina.nombre}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${obtenerBadgeNivel(rutina.nivel)}`}>
                        {rutina.nivel}
                      </span>
                      {!rutina.activa && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          Inactiva
                        </span>
                      )}
                    </div>

                    {rutina.objetivo && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Objetivo:</strong> {rutina.objetivo}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>📋 {rutina.ejercicios.length} ejercicio{rutina.ejercicios.length !== 1 ? 's' : ''}</span>
                      <span>📅 {rutina.frecuencia.diasPorSemana}x/semana</span>
                      <span>⏱️ ~{calcularDuracion(rutina)} min</span>
                      <span>📆 {formatearFecha(rutina.fechaCreacion)}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleVerRutina(rutina.id)}
                      className="p-2 text-saludvalpa-blue hover:bg-saludvalpa-blue-light rounded transition-colors"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEditarRutina(rutina.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleGenerarPDF(rutina.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Generar PDF"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleEliminarRutina(rutina.id, rutina.nombre)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Editor */}
      {modalEditorAbierto && (
        <Modal
          isOpen={modalEditorAbierto}
          onClose={cerrarEditor}
          title={rutinaEditando ? 'Editar Rutina' : 'Nueva Rutina'}
          size="xl"
        >
          <EditorRutinaSimple
            rutinaId={rutinaEditando || undefined}
            pacienteIdInicial={paciente.id}
            onGuardar={cerrarEditor}
            onCancelar={cerrarEditor}
          />
        </Modal>
      )}

      {/* Modal Vista Previa */}
      {rutinaViendo && rutinas && (() => {
        const rutina = rutinas.find(r => r.id === rutinaViendo);
        if (!rutina) return null;
        
        return (
          <VistaPrevia
            rutina={rutina}
            isOpen={modalVistaAbierto}
            onClose={cerrarVista}
            onEditar={() => {
              cerrarVista();
              handleEditarRutina(rutinaViendo);
            }}
            onGenerarPDF={() => {
              handleGenerarPDF(rutinaViendo);
            }}
          />
        );
      })()}
    </>
  );
};

export default RutinasPaciente;
