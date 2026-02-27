// ============================================================================
// saludvalpa 3.0 - GESTIÓN DE RECIBOS
// ============================================================================

import { useState } from 'react';
import { useEconomia } from '../hooks/useEconomia';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Recibo, EstadoPago as EstadoPagoType } from '../types';
import { EstadoPago, TipoDocumento } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/helpers';
import { Card, Button, Modal } from './';
import GenerarRecibo from './common/GenerarRecibo';
import VisorPDF from './common/VisorPDF';

const GestionRecibos = () => {
  const { recibos, marcarComoPagado } = useEconomia();
  const [filtroEstado, setFiltroEstado] = useState<EstadoPagoType | 'todos'>('todos');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState<Recibo | null>(null);
  
  // Estado para el visor de PDF
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [documentoViendoId, setDocumentoViendoId] = useState<string | null>(null);

  // Filtrar recibos
  const recibosFiltrados = filtroEstado === 'todos'
    ? recibos
    : recibos.filter(r => r.estadoPago === filtroEstado);

  const obtenerColorEstado = (estado: EstadoPagoType) => {
    switch (estado) {
      case EstadoPago.PAGADO_COMPLETO: return 'bg-green-100 text-green-800';
      case EstadoPago.PAGADO_PARCIAL: return 'bg-yellow-100 text-yellow-800';
      case EstadoPago.PENDIENTE: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarcarPagado = async (reciboId: string) => {
    if (!confirm('¿Marcar este recibo como pagado completamente?')) return;

    try {
      await marcarComoPagado(reciboId);
      alert('Recibo marcado como pagado');
    } catch (error) {
      alert('Error al actualizar el recibo');
    }
  };

  const handleVerRecibo = async (recibo: Recibo) => {
    // Buscar el documento PDF asociado al recibo
    // Los recibos se guardan con el folio en metadata
    const recibosNum = await db.documentos
      .where('tipo')
      .equals(TipoDocumento.RECIBO_PAGO)
      .and(doc => doc.pacienteId === recibo.pacienteId)
      .toArray();
    
    // Buscar por fecha cercana (mismo día)
    const fechaRecibo = new Date(recibo.fecha).toDateString();
    const documentoRecibo = recibosNum.find(doc => 
      new Date(doc.fechaCreacion).toDateString() === fechaRecibo
    );

    if (documentoRecibo) {
      setDocumentoViendoId(documentoRecibo.id);
      setVisorAbierto(true);
    } else {
      alert('No se encontró el PDF del recibo. Puede que se haya eliminado.');
    }
  };

  const cerrarVisor = () => {
    setVisorAbierto(false);
    setDocumentoViendoId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === 'todos'
                ? 'bg-saludvalpa-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({recibos.length})
          </button>
          <button
            onClick={() => setFiltroEstado(EstadoPago.PENDIENTE)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === EstadoPago.PENDIENTE
                ? 'bg-red-500 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Pendientes ({recibos.filter(r => r.estadoPago === EstadoPago.PENDIENTE).length})
          </button>
          <button
            onClick={() => setFiltroEstado(EstadoPago.PAGADO_COMPLETO)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === EstadoPago.PAGADO_COMPLETO
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Pagados ({recibos.filter(r => r.estadoPago === EstadoPago.PAGADO_COMPLETO).length})
          </button>
        </div>
        
        <Button onClick={() => setMostrarModalNuevo(true)}>
          ➕ Nuevo Recibo
        </Button>
      </div>

      {/* Lista de recibos */}
      {recibosFiltrados.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🧾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay recibos {filtroEstado !== 'todos' ? `con estado "${filtroEstado}"` : ''}
          </h3>
          <p className="text-gray-600 mb-4">
            Los recibos aparecerán aquí cuando los generes
          </p>
          {filtroEstado === 'todos' && (
            <Button onClick={() => setMostrarModalNuevo(true)}>
              Generar primer recibo
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {recibosFiltrados.map((recibo) => (
            <ReciboCard
              key={recibo.id}
              recibo={recibo}
              onVerDetalle={setReciboSeleccionado}
              onVerPDF={handleVerRecibo}
              onMarcarPagado={handleMarcarPagado}
              colorEstado={obtenerColorEstado(recibo.estadoPago)}
            />
          ))}
        </div>
      )}

      {/* Modal para nuevo recibo */}
      <Modal
        isOpen={mostrarModalNuevo}
        onClose={() => setMostrarModalNuevo(false)}
        title="Generar Recibo de Pago"
        size="lg"
      >
        <GenerarRecibo
          paciente={null}
          onExito={() => setMostrarModalNuevo(false)}
          onCancelar={() => setMostrarModalNuevo(false)}
        />
      </Modal>

      {/* Modal de detalle */}
      <Modal
        isOpen={!!reciboSeleccionado}
        onClose={() => setReciboSeleccionado(null)}
        title={`Recibo #${reciboSeleccionado?.numero}`}
        size="lg"
      >
        {reciboSeleccionado && (
          <DetalleRecibo
            recibo={reciboSeleccionado}
            onMarcarPagado={() => {
              handleMarcarPagado(reciboSeleccionado.id);
              setReciboSeleccionado(null);
            }}
            onCerrar={() => setReciboSeleccionado(null)}
          />
        )}
      </Modal>

      {/* Modal para visualizar PDF del recibo */}
      <Modal
        isOpen={visorAbierto}
        onClose={cerrarVisor}
        title=""
        size="xl"
      >
        {documentoViendoId && (
          <VisorPDF
            documentoId={documentoViendoId}
            onCerrar={cerrarVisor}
            permitirDescarga={true}
            permitirImpresion={true}
          />
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// CARD DE RECIBO
// ============================================================================

const ReciboCard = ({
  recibo,
  onVerDetalle,
  onVerPDF,
  onMarcarPagado,
  colorEstado,
}: {
  recibo: Recibo;
  onVerDetalle: (r: Recibo) => void;
  onVerPDF: (r: Recibo) => void;
  onMarcarPagado: (id: string) => void;
  colorEstado: string;
}) => {
  const paciente = useLiveQuery(
    () => db.pacientes.get(recibo.pacienteId),
    [recibo.pacienteId]
  );

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-gray-900">
              #{recibo.numero.toString().padStart(4, '0')}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${colorEstado}`}>
              {recibo.estadoPago}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Cargando...'}
          </h3>
          <p className="text-sm text-gray-600">
            {formatearFecha(recibo.fecha)} • {recibo.servicios.length} servicios
          </p>
          <p className="text-sm text-gray-500 capitalize mt-1">
            Pago: {recibo.metodoPago}
          </p>
        </div>
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-saludvalpa-blue mb-2">
            {formatearMoneda(recibo.total)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onVerPDF(recibo)}
              className="text-sm text-green-600 hover:underline flex items-center gap-1"
              title="Ver PDF"
            >
              👁️ Ver PDF
            </button>
            <button
              onClick={() => onVerDetalle(recibo)}
              className="text-sm text-saludvalpa-blue hover:underline"
            >
              📋 Detalle
            </button>
            {recibo.estadoPago !== EstadoPago.PAGADO_COMPLETO && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarcarPagado(recibo.id);
                }}
                className="text-sm text-green-600 hover:underline"
              >
                ✓ Pagado
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// DETALLE DE RECIBO
// ============================================================================

const DetalleRecibo = ({
  recibo,
  onMarcarPagado,
  onCerrar,
}: {
  recibo: Recibo;
  onMarcarPagado: () => void;
  onCerrar: () => void;
}) => {
  const paciente = useLiveQuery(
    () => db.pacientes.get(recibo.pacienteId),
    [recibo.pacienteId]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recibo #{recibo.numero.toString().padStart(4, '0')}
          </h2>
          <p className="text-sm text-gray-600">{formatearFecha(recibo.fecha)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          recibo.estadoPago === EstadoPago.PAGADO_COMPLETO
            ? 'bg-green-100 text-green-800'
            : recibo.estadoPago === EstadoPago.PAGADO_PARCIAL
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {recibo.estadoPago}
        </span>
      </div>

      {/* Paciente */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">Paciente</h3>
        <p className="text-lg font-semibold text-gray-900">
          {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Cargando...'}
        </p>
      </div>

      {/* Servicios */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Servicios</h3>
        <div className="space-y-2">
          {recibo.servicios.map((item, idx) => (
            <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.nombre}</div>
                {item.descripcion && (
                  <div className="text-sm text-gray-600">{item.descripcion}</div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-sm text-gray-600">
                  {item.cantidad} × {formatearMoneda(item.precioUnitario)}
                </div>
                <div className="font-semibold">{formatearMoneda(item.total)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatearMoneda(recibo.subtotal)}</span>
        </div>
        {recibo.descuento && recibo.descuento > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Descuento:</span>
            <span className="text-red-600">-{formatearMoneda(recibo.descuento)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span className="text-saludvalpa-blue">{formatearMoneda(recibo.total)}</span>
        </div>
      </div>

      {/* Información de pago */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Método de pago:</span>
            <p className="font-medium text-gray-900 capitalize">{recibo.metodoPago}</p>
          </div>
          {recibo.fechaPago && (
            <div>
              <span className="text-gray-600">Fecha de pago:</span>
              <p className="font-medium text-gray-900">{formatearFecha(recibo.fechaPago)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notas */}
      {recibo.notas && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Notas</h3>
          <p className="text-sm text-gray-900">{recibo.notas}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-4">
        {recibo.estadoPago !== EstadoPago.PAGADO_COMPLETO && (
          <Button onClick={onMarcarPagado} className="flex-1">
            ✓ Marcar como Pagado
          </Button>
        )}
        <Button variant="outline" onClick={onCerrar} className="flex-1">
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default GestionRecibos;
