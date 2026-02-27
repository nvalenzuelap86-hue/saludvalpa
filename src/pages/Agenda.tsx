// ============================================================================
// saludvalpa 3.0 - AGENDA
// Sistema de gestión de citas y calendario
// ============================================================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAgenda } from '../hooks/useAgenda';
import { EstadoCita, TipoDocumento } from '../types';
import type { Cita } from '../types';
import { formatearFechaHora } from '../utils/dateHelpers';
import { generarConfirmacionCita, guardarDocumento, generarFolio } from '../services/pdfService';
import { descargarArchivo } from '../utils/helpers';
import Calendario from '../components/Calendario';
import Modal from '../components/shared/Modal';
import FormularioCita from '../components/FormularioCita';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';

const Agenda = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [modalCita, setModalCita] = useState<'crear' | 'editar' | 'detalle' | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [fechaHoraInicial, setFechaHoraInicial] = useState<Date | undefined>();
  const [cargando, setCargando] = useState(false);
  const [vistaLista, setVistaLista] = useState<'todas' | 'hoy' | 'proximas'>('proximas');

  // Obtener rango de fechas para filtros
  const obtenerRangoFechas = () => {
    const inicio = startOfWeek(fechaSeleccionada, { weekStartsOn: 1 });
    const fin = endOfWeek(fechaSeleccionada, { weekStartsOn: 1 });
    return { fechaInicio: inicio, fechaFin: fin };
  };

  const { fechaInicio, fechaFin } = obtenerRangoFechas();

  const {
    citas,
    crearCita,
    actualizarCita,
    cancelarCita,
    confirmarCita,
    completarCita,
    eliminarCita,
  } = useAgenda({ fechaInicio, fechaFin });

  // Cargar todas las citas para la lista
  const todasCitas = useLiveQuery(() => db.citas.orderBy('fechaHora').toArray());

  // Filtrar citas para la lista
  const citasLista = (() => {
    if (!todasCitas) return [];
    
    const ahora = new Date();
    
    if (vistaLista === 'hoy') {
      return todasCitas.filter(c => {
        const fecha = new Date(c.fechaHora);
        return fecha.toDateString() === ahora.toDateString();
      });
    }
    
    if (vistaLista === 'proximas') {
      return todasCitas.filter(c => {
        const fecha = new Date(c.fechaHora);
        return fecha >= ahora && c.estado !== EstadoCita.CANCELADA;
      }).slice(0, 10);
    }
    
    return todasCitas;
  })();

  const handleCrearCita = async (datosCita: any) => {
    setCargando(true);
    try {
      await crearCita(datosCita);
      setModalCita(null);
      setFechaHoraInicial(undefined);
    } catch (error) {
      alert('Error al crear cita');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarCita = async (datosCita: any) => {
    if (!citaSeleccionada) return;
    
    setCargando(true);
    try {
      await actualizarCita(citaSeleccionada.id, datosCita);
      setModalCita(null);
      setCitaSeleccionada(null);
    } catch (error) {
      alert('Error al actualizar cita');
    } finally {
      setCargando(false);
    }
  };

  const handleClickCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModalCita('detalle');
  };

  const handleClickHorario = (fechaHora: Date) => {
    setFechaHoraInicial(fechaHora);
    setModalCita('crear');
  };

  const handleEditarCita = () => {
    setModalCita('editar');
  };

  const handleCancelarCita = async () => {
    if (!citaSeleccionada) return;
    
    if (!confirm('¿Estás seguro de cancelar esta cita?')) return;

    try {
      await cancelarCita(citaSeleccionada.id);
      setModalCita(null);
      setCitaSeleccionada(null);
    } catch (error) {
      alert('Error al cancelar cita');
    }
  };

  const handleConfirmarCita = async () => {
    if (!citaSeleccionada) return;

    try {
      await confirmarCita(citaSeleccionada.id);
    } catch (error) {
      alert('Error al confirmar cita');
    }
  };

  const handleGenerarConfirmacion = async () => {
    if (!citaSeleccionada) return;

    setCargando(true);
    try {
      const paciente = await db.pacientes.get(citaSeleccionada.pacienteId);
      if (!paciente) throw new Error('Paciente no encontrado');

      const pdfBlob = await generarConfirmacionCita(paciente, {
        fechaHora: new Date(citaSeleccionada.fechaHora),
        duracion: citaSeleccionada.duracion,
        tipo: citaSeleccionada.tipo,
        notas: citaSeleccionada.notas,
      });

      const folio = generarFolio(TipoDocumento.CONFIRMACION_CITA);

      await guardarDocumento(
        paciente.id,
        TipoDocumento.CONFIRMACION_CITA,
        `Confirmación ${folio}`,
        pdfBlob,
        {
          folio,
          citaId: citaSeleccionada.id,
          fechaCita: citaSeleccionada.fechaHora,
        }
      );

      descargarArchivo(pdfBlob, `Confirmacion_${folio}_${paciente.apellidos}.pdf`);

      alert('Confirmación generada y descargada');
    } catch (error) {
      alert('Error al generar confirmación');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarCita = async () => {
    if (!citaSeleccionada) return;
    
    if (!confirm('¿Estás seguro de eliminar esta cita permanentemente?')) return;

    try {
      await eliminarCita(citaSeleccionada.id);
      setModalCita(null);
      setCitaSeleccionada(null);
    } catch (error) {
      alert('Error al eliminar cita');
    }
  };

  const cerrarModal = () => {
    setModalCita(null);
    setCitaSeleccionada(null);
    setFechaHoraInicial(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agenda</h1>
        
        <Button onClick={() => setModalCita('crear')} variant="primary">
          ➕ Nueva cita
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario (2 columnas) */}
        <div className="lg:col-span-2">
          <Calendario
            citas={citas}
            fechaSeleccionada={fechaSeleccionada}
            onFechaChange={setFechaSeleccionada}
            onClickCita={handleClickCita}
            onClickHorario={handleClickHorario}
          />
        </div>

        {/* Lista de citas (1 columna) */}
        <div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Próximas citas</h3>
              
              <select
                value={vistaLista}
                onChange={(e) => setVistaLista(e.target.value as any)}
                className="text-xs px-2 py-1 border border-gray-300 rounded"
              >
                <option value="proximas">Próximas</option>
                <option value="hoy">Hoy</option>
                <option value="todas">Todas</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {citasLista && citasLista.length > 0 ? (
                citasLista.map(cita => (
                  <CitaMiniCard
                    key={cita.id}
                    cita={cita}
                    onClick={() => handleClickCita(cita)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">📅</span>
                  <p className="text-sm">No hay citas {vistaLista === 'hoy' ? 'hoy' : 'próximas'}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal crear cita */}
      <Modal
        isOpen={modalCita === 'crear'}
        onClose={cerrarModal}
        title="Nueva cita"
        size="lg"
      >
        <FormularioCita
          fechaHoraInicial={fechaHoraInicial}
          onSubmit={handleCrearCita}
          onCancel={cerrarModal}
          isLoading={cargando}
        />
      </Modal>

      {/* Modal editar cita */}
      <Modal
        isOpen={modalCita === 'editar'}
        onClose={cerrarModal}
        title="Editar cita"
        size="lg"
      >
        {citaSeleccionada && (
          <FormularioCita
            cita={citaSeleccionada}
            onSubmit={handleActualizarCita}
            onCancel={cerrarModal}
            isLoading={cargando}
          />
        )}
      </Modal>

      {/* Modal detalle cita */}
      <Modal
        isOpen={modalCita === 'detalle'}
        onClose={cerrarModal}
        title="Detalle de cita"
        size="lg"
      >
        {citaSeleccionada && (
          <DetalleCita
            cita={citaSeleccionada}
            onEditar={handleEditarCita}
            onCancelar={handleCancelarCita}
            onConfirmar={handleConfirmarCita}
            onCompletar={() => completarCita(citaSeleccionada.id)}
            onEliminar={handleEliminarCita}
            onGenerarConfirmacion={handleGenerarConfirmacion}
            cargando={cargando}
          />
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - MINI CARD DE CITA
// ============================================================================

const CitaMiniCard = ({ cita, onClick }: { cita: Cita; onClick: () => void }) => {
  const paciente = useLiveQuery(() => db.pacientes.get(cita.pacienteId), [cita.pacienteId]);

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case EstadoCita.PROGRAMADA: return '⏳';
      case EstadoCita.CONFIRMADA: return '✓';
      case EstadoCita.COMPLETADA: return '✅';
      case EstadoCita.CANCELADA: return '❌';
      default: return '📅';
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors"
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs text-gray-600">
          {formatearFechaHora(new Date(cita.fechaHora))}
        </span>
        <span className="text-sm">{obtenerIconoEstado(cita.estado)}</span>
      </div>
      
      {paciente && (
        <div className="font-medium text-sm text-gray-900">
          {paciente.nombre} {paciente.apellidos}
        </div>
      )}
      
      <div className="text-xs text-gray-600 mt-1">
        {cita.tipo} • {cita.duracion} min
      </div>
    </button>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - DETALLE DE CITA
// ============================================================================

const DetalleCita = ({
  cita,
  onEditar,
  onCancelar,
  onConfirmar,
  onCompletar,
  onEliminar,
  onGenerarConfirmacion,
  cargando,
}: {
  cita: Cita;
  onEditar: () => void;
  onCancelar: () => void;
  onConfirmar: () => void;
  onCompletar: () => void;
  onEliminar: () => void;
  onGenerarConfirmacion: () => void;
  cargando: boolean;
}) => {
  const paciente = useLiveQuery(() => db.pacientes.get(cita.pacienteId), [cita.pacienteId]);

  const obtenerColorBadge = (estado: string) => {
    switch (estado) {
      case EstadoCita.PROGRAMADA: return 'bg-yellow-100 text-yellow-800';
      case EstadoCita.CONFIRMADA: return 'bg-blue-100 text-blue-800';
      case EstadoCita.COMPLETADA: return 'bg-green-100 text-green-800';
      case EstadoCita.CANCELADA: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const obtenerTextoEstado = (estado: string) => {
    switch (estado) {
      case EstadoCita.PROGRAMADA: return 'Programada';
      case EstadoCita.CONFIRMADA: return 'Confirmada';
      case EstadoCita.COMPLETADA: return 'Completada';
      case EstadoCita.CANCELADA: return 'Cancelada';
      default: return estado;
    }
  };

  return (
    <div className="space-y-4">
      {/* Estado */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorBadge(cita.estado)}`}>
          {obtenerTextoEstado(cita.estado)}
        </span>
        
        <span className="text-xs text-gray-500">
          Creada: {format(new Date(cita.fechaCreacion), "d 'de' MMM, HH:mm", { locale: es })}
        </span>
      </div>

      {/* Información del paciente */}
      {paciente && (
        <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">
              {paciente.nombre[0]}{paciente.apellidos[0]}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {paciente.nombre} {paciente.apellidos}
              </div>
              <div className="text-sm text-gray-600">
                {paciente.telefono}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detalles de la cita */}
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-600">Fecha y hora:</span>
          <p className="font-medium text-gray-900">
            {formatearFechaHora(new Date(cita.fechaHora))}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-sm text-gray-600">Duración:</span>
            <p className="font-medium text-gray-900">{cita.duracion} minutos</p>
          </div>
          
          <div>
            <span className="text-sm text-gray-600">Tipo:</span>
            <p className="font-medium text-gray-900">{cita.tipo}</p>
          </div>
        </div>

        {cita.notas && (
          <div>
            <span className="text-sm text-gray-600">Notas:</span>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
              {cita.notas}
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        {cita.estado === EstadoCita.PROGRAMADA && (
          <Button
            onClick={onConfirmar}
            variant="primary"
            className="w-full"
          >
            ✓ Confirmar cita
          </Button>
        )}

        {cita.estado === EstadoCita.CONFIRMADA && (
          <Button
            onClick={onCompletar}
            variant="primary"
            className="w-full"
          >
            ✅ Marcar como completada
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onGenerarConfirmacion}
            isLoading={cargando}
            variant="outline"
          >
            📄 Confirmación PDF
          </Button>

          <Button
            onClick={onEditar}
            variant="outline"
          >
            ✏️ Editar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {cita.estado !== EstadoCita.CANCELADA && (
            <Button
              onClick={onCancelar}
              variant="outline"
              className="text-orange-600 hover:bg-orange-50"
            >
              🚫 Cancelar
            </Button>
          )}
          
          <Button
            onClick={onEliminar}
            variant="outline"
            className="text-red-600 hover:bg-red-50"
          >
            🗑️ Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
