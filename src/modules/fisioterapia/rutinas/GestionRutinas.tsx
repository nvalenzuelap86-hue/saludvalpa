// ============================================================================
// PÁGINA: Gestión de Rutinas
// Sistema completo de gestión de rutinas de ejercicios
// ============================================================================

import { useState } from 'react';
import Card from '../../../components/shared/Card';
import Modal from '../../../components/shared/Modal';
import TarjetaRutina from './TarjetaRutina';
import EditorRutina from './EditorRutina';
import VistaPrevia from './VistaPrevia';
import { useRutinas } from '../hooks/useRutinas';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePacientes } from '../../../hooks/usePacientes';
import { useAppStore } from '../../../stores/appStore';
import { db } from '../../../db/database';
import { generarPDFRutina } from './generadorPDFRutina';
import type { RutinaEjercicios, TipoDocumento } from '../../../types';
import { TipoProfesion } from '../../../types';

export default function GestionRutinas() {
  const { configuracion } = useAppStore();
  const { pacientes } = usePacientes();
  const { obtenerEjercicio } = useBiblioteca();
  const {
    rutinas,
    estadisticas,
    isLoading,
    crearRutina,
    actualizarRutina,
    eliminarRutina,
    duplicarRutina,
  } = useRutinas();

  // Estado de modales
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<RutinaEjercicios | null>(null);
  const [rutinaEditando, setRutinaEditando] = useState<RutinaEjercicios | undefined>(undefined);
  const [modalVistaAbierto, setModalVistaAbierto] = useState(false);
  const [modalEditorAbierto, setModalEditorAbierto] = useState(false);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState<string | null>(null);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'plantillas' | 'asignadas'>('todas');
  const [busqueda, setBusqueda] = useState('');

  // Aplicar filtros
  const rutinasFiltradas = rutinas.filter((rutina) => {
    // Filtro por tipo
    if (filtroTipo === 'plantillas' && !rutina.esPlantilla) return false;
    if (filtroTipo === 'asignadas' && !rutina.pacienteId) return false;

    // Filtro por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      const coincide =
        rutina.nombre.toLowerCase().includes(termino) ||
        rutina.objetivo.toLowerCase().includes(termino) ||
        (rutina.descripcion && rutina.descripcion.toLowerCase().includes(termino));
      
      if (!coincide) return false;
    }

    return true;
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleNuevaRutina = () => {
    setRutinaEditando(undefined);
    setModalEditorAbierto(true);
  };

  const handleVerRutina = (rutina: RutinaEjercicios) => {
    setRutinaSeleccionada(rutina);
    setModalVistaAbierto(true);
  };

  const handleEditarRutina = (rutina: RutinaEjercicios) => {
    setRutinaEditando(rutina);
    setModalEditorAbierto(true);
  };

  const handleGuardarRutina = async (rutinaData: Omit<RutinaEjercicios, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      // Calcular equipo consolidado
      const ejerciciosInfo = await Promise.all(
        rutinaData.ejercicios.map(e => obtenerEjercicio(e.ejercicioId))
      );

      const equipoSet = new Set<string>();
      ejerciciosInfo.forEach(ejercicio => {
        if (ejercicio) {
          ejercicio.equipoNecesario.forEach(equipo => equipoSet.add(equipo));
        }
      });

      const rutinaCompleta = {
        ...rutinaData,
        equipoNecesario: Array.from(equipoSet),
      };

      if (rutinaEditando) {
        await actualizarRutina(rutinaEditando.id, rutinaCompleta);
      } else {
        await crearRutina(rutinaCompleta);
      }

      setModalEditorAbierto(false);
      setRutinaEditando(undefined);
    } catch (error) {
      throw error;
    }
  };

  const handleDuplicarRutina = async (rutina: RutinaEjercicios) => {
    try {
      await duplicarRutina(rutina.id);
      alert('Rutina duplicada exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al duplicar rutina');
    }
  };

  const handleEliminarRutina = async (id: string) => {
    setConfirmacionEliminar(id);
  };

  const confirmarEliminarRutina = async () => {
    if (!confirmacionEliminar) return;

    try {
      await eliminarRutina(confirmacionEliminar);
      setConfirmacionEliminar(null);
    } catch (error: any) {
      alert(error.message || 'Error al eliminar rutina');
      setConfirmacionEliminar(null);
    }
  };

  const handleGenerarPDF = async (rutina: RutinaEjercicios) => {
    if (!configuracion) {
      alert('No se pudo obtener la configuración');
      return;
    }

    try {
      // Obtener información completa de todos los ejercicios
      const ejerciciosInfo = await Promise.all(
        rutina.ejercicios.map(e => obtenerEjercicio(e.ejercicioId))
      );

      const ejerciciosFiltrados = ejerciciosInfo.filter(e => e !== undefined) as any[];

      // Obtener nombre del paciente si está asignado
      let pacienteNombre: string | undefined;
      if (rutina.pacienteId) {
        const paciente = await db.pacientes.get(rutina.pacienteId);
        if (paciente) {
          pacienteNombre = `${paciente.nombre} ${paciente.apellidos}`;
        }
      }

      // Generar PDF
      const pdfBlob = await generarPDFRutina(
        rutina,
        ejerciciosFiltrados,
        configuracion,
        pacienteNombre
      );

      // Guardar como documento
      const contenidoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      await db.documentos.add({
        id: crypto.randomUUID(),
        tipo: 'plan_tratamiento' as TipoDocumento,
        nombre: `Rutina - ${rutina.nombre}`,
        pacienteId: rutina.pacienteId || 'sin-paciente',
        profesionalId: '1',
        profesion: TipoProfesion.FISIOTERAPIA,
        fechaCreacion: new Date(),
        contenidoBase64,
        firmado: false,
        metadata: {
          rutinaId: rutina.id,
          tipoRutina: 'ejercicios',
        },
      });

      // Descargar
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rutina_${rutina.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      alert('PDF generado y guardado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saludvalpa-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🗓️ Rutinas de Ejercicios
          </h1>
          <p className="text-gray-600 mt-1">
            Crea y gestiona rutinas personalizadas para tus pacientes
          </p>
        </div>
        <button
          onClick={handleNuevaRutina}
          className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Nueva Rutina</span>
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-3xl font-bold text-saludvalpa-blue">
              {estadisticas.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Total Rutinas
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {estadisticas.activas}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Activas
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {estadisticas.plantillas}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              📋 Plantillas
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {estadisticas.asignadas}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              👤 Asignadas
            </div>
          </Card>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar rutina por nombre, objetivo..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="plantillas">📋 Solo Plantillas</option>
              <option value="asignadas">👤 Solo Asignadas</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {rutinasFiltradas.length === 0 ? (
              'No se encontraron rutinas'
            ) : rutinasFiltradas.length === 1 ? (
              '1 rutina encontrada'
            ) : (
              `${rutinasFiltradas.length} rutinas encontradas`
            )}
          </div>
        </div>
      </Card>

      {/* Lista de rutinas */}
      {rutinasFiltradas.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗓️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {rutinas.length === 0 ? 'No hay rutinas creadas' : 'No hay rutinas que coincidan'}
            </h3>
            <p className="text-gray-600 mb-4">
              {rutinas.length === 0
                ? 'Crea tu primera rutina de ejercicios para empezar'
                : 'Intenta ajustar los filtros o la búsqueda'}
            </p>
            {rutinas.length === 0 && (
              <button
                onClick={handleNuevaRutina}
                className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors"
              >
                + Crear Primera Rutina
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rutinasFiltradas.map((rutina) => {
            const paciente = pacientes.find(p => p.id === rutina.pacienteId);
            const nombrePaciente = paciente ? `${paciente.nombre} ${paciente.apellidos}` : undefined;

            return (
              <TarjetaRutina
                key={rutina.id}
                rutina={rutina}
                onVer={handleVerRutina}
                onEditar={handleEditarRutina}
                onDuplicar={handleDuplicarRutina}
                onEliminar={handleEliminarRutina}
                nombrePaciente={nombrePaciente}
              />
            );
          })}
        </div>
      )}

      {/* Modal de Vista Previa */}
      {rutinaSeleccionada && (
        <VistaPrevia
          rutina={rutinaSeleccionada}
          isOpen={modalVistaAbierto}
          onClose={() => {
            setModalVistaAbierto(false);
            setRutinaSeleccionada(null);
          }}
          onEditar={() => {
            handleEditarRutina(rutinaSeleccionada);
            setModalVistaAbierto(false);
          }}
          onGenerarPDF={() => handleGenerarPDF(rutinaSeleccionada)}
        />
      )}

      {/* Modal de Editor */}
      <EditorRutina
        isOpen={modalEditorAbierto}
        onClose={() => {
          setModalEditorAbierto(false);
          setRutinaEditando(undefined);
        }}
        onGuardar={handleGuardarRutina}
        rutinaEditar={rutinaEditando}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={confirmacionEliminar !== null}
        onClose={() => setConfirmacionEliminar(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar esta rutina?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmarEliminarRutina}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => setConfirmacionEliminar(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
