// ============================================================================
// saludvalpa 3.0 - GESTIÓN DE COTIZACIONES
// ============================================================================

import { useState } from 'react';
import { useEconomia } from '../hooks/useEconomia';
import { usePacientes } from '../hooks/usePacientes';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Cotizacion, ItemCotizacion } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/helpers';
import { Card, Button, Modal, Input } from './';

const GestionCotizaciones = () => {
  const { cotizaciones, crearCotizacion, aceptarCotizacion, rechazarCotizacion, cotizacionARecibo } = useEconomia();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<Cotizacion | null>(null);

  const handleNueva = () => {
    setCotizacionSeleccionada(null);
    setMostrarModal(true);
  };

  const handleVerDetalle = (cotizacion: Cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarModal(true);
  };

  const handleConvertirARecibo = async (cotizacionId: string) => {
    if (!confirm('¿Convertir esta cotización en recibo?')) return;

    try {
      await cotizacionARecibo(cotizacionId);
      alert('Recibo generado exitosamente');
      setMostrarModal(false);
    } catch (error) {
      alert('Error al generar el recibo');
    }
  };

  const obtenerColorEstado = (estado: Cotizacion['estado']) => {
    switch (estado) {
      case 'vigente': return 'bg-blue-100 text-blue-800';
      case 'aceptada': return 'bg-green-100 text-green-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      case 'expirada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cotizaciones</h2>
          <p className="text-sm text-gray-600">
            {cotizaciones.length} cotizaciones registradas
          </p>
        </div>
        <Button onClick={handleNueva}>
          ➕ Nueva Cotización
        </Button>
      </div>

      {/* Lista de cotizaciones */}
      {cotizaciones.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cotizaciones registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea cotizaciones para enviar a tus pacientes
          </p>
          <Button onClick={handleNueva}>
            Crear primera cotización
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {cotizaciones.map((cotizacion) => (
            <CotizacionCard
              key={cotizacion.id}
              cotizacion={cotizacion}
              onVerDetalle={handleVerDetalle}
              colorEstado={obtenerColorEstado(cotizacion.estado)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={cotizacionSeleccionada ? 'Detalle de Cotización' : 'Nueva Cotización'}
        size="xl"
      >
        {cotizacionSeleccionada ? (
          <DetalleCotizacion
            cotizacion={cotizacionSeleccionada}
            onConvertirARecibo={handleConvertirARecibo}
            onAceptar={async () => {
              await aceptarCotizacion(cotizacionSeleccionada.id);
              setMostrarModal(false);
            }}
            onRechazar={async () => {
              await rechazarCotizacion(cotizacionSeleccionada.id);
              setMostrarModal(false);
            }}
            onCerrar={() => setMostrarModal(false)}
          />
        ) : (
          <FormularioCotizacion
            onGuardar={async (datos) => {
              await crearCotizacion(datos);
              setMostrarModal(false);
            }}
            onCancelar={() => setMostrarModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// CARD DE COTIZACIÓN
// ============================================================================

const CotizacionCard = ({ 
  cotizacion, 
  onVerDetalle,
  colorEstado 
}: { 
  cotizacion: Cotizacion;
  onVerDetalle: (c: Cotizacion) => void;
  colorEstado: string;
}) => {
  const paciente = useLiveQuery(
    () => db.pacientes.get(cotizacion.pacienteId),
    [cotizacion.pacienteId]
  );

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onVerDetalle(cotizacion)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">
              {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Cargando...'}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${colorEstado}`}>
              {cotizacion.estado}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {formatearFecha(cotizacion.fecha)} • {cotizacion.servicios.length} servicios
          </p>
          {cotizacion.notas && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-1">
              {cotizacion.notas}
            </p>
          )}
        </div>
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-saludvalpa-blue">
            {formatearMoneda(cotizacion.total)}
          </div>
          <div className="text-xs text-gray-500">
            Válida {cotizacion.validezDias} días
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// DETALLE DE COTIZACIÓN
// ============================================================================

const DetalleCotizacion = ({
  cotizacion,
  onConvertirARecibo,
  onAceptar,
  onRechazar,
  onCerrar,
}: {
  cotizacion: Cotizacion;
  onConvertirARecibo: (id: string) => void;
  onAceptar: () => void;
  onRechazar: () => void;
  onCerrar: () => void;
}) => {
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const paciente = useLiveQuery(
    () => db.pacientes.get(cotizacion.pacienteId),
    [cotizacion.pacienteId]
  );

  const handleGenerarPDF = async () => {
    if (!paciente) return;
    
    setGenerandoPDF(true);
    try {
      const { generarCotizacion } = await import('../services/pdfService');
      await generarCotizacion(cotizacion, paciente);
      alert('Cotización generada exitosamente');
    } catch (error) {
      alert('Error al generar la cotización');
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Información del paciente */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">Paciente</h3>
        <p className="text-lg font-semibold text-gray-900">
          {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Cargando...'}
        </p>
        <p className="text-sm text-gray-600">
          {formatearFecha(cotizacion.fecha)}
        </p>
      </div>

      {/* Servicios */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Servicios</h3>
        <div className="space-y-2">
          {cotizacion.servicios.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
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
                <div className="font-semibold text-gray-900">
                  {formatearMoneda(item.total)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatearMoneda(cotizacion.subtotal)}</span>
        </div>
        {cotizacion.descuento && cotizacion.descuento > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento:</span>
            <span className="text-red-600">-{formatearMoneda(cotizacion.descuento)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-saludvalpa-blue">{formatearMoneda(cotizacion.total)}</span>
        </div>
      </div>

      {/* Notas */}
      {cotizacion.notas && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Notas</h3>
          <p className="text-sm text-gray-900">{cotizacion.notas}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col gap-2 pt-4">
        <Button 
          onClick={handleGenerarPDF} 
          disabled={generandoPDF}
          className="w-full"
        >
          {generandoPDF ? '⏳ Generando...' : '📄 Generar PDF'}
        </Button>
        
        {cotizacion.estado === 'vigente' && (
          <>
            <Button onClick={() => onConvertirARecibo(cotizacion.id)} className="w-full">
              💵 Convertir a Recibo
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onAceptar}>
                ✓ Aceptada
              </Button>
              <Button variant="danger" onClick={onRechazar}>
                ✕ Rechazada
              </Button>
            </div>
          </>
        )}
        <Button variant="outline" onClick={onCerrar} className="w-full">
          Cerrar
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// FORMULARIO DE COTIZACIÓN
// ============================================================================

const FormularioCotizacion = ({
  onGuardar,
  onCancelar,
}: {
  onGuardar: (datos: Omit<Cotizacion, 'id'>) => void;
  onCancelar: () => void;
}) => {
  const { pacientes } = usePacientes({ activo: true });
  const { servicios } = useEconomia();

  const [pacienteId, setPacienteId] = useState('');
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [validezDias, setValidezDias] = useState(30);
  const [descuento, setDescuento] = useState(0);
  const [notas, setNotas] = useState('');

  // Item temporal para agregar
  const [nuevoItem, setNuevoItem] = useState({
    servicioId: '',
    nombre: '',
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
  });

  const agregarItem = () => {
    if (!nuevoItem.nombre || nuevoItem.precioUnitario <= 0) {
      alert('Completa los datos del servicio');
      return;
    }

    const item: ItemCotizacion = {
      servicioId: nuevoItem.servicioId || undefined,
      nombre: nuevoItem.nombre,
      descripcion: nuevoItem.descripcion || undefined,
      cantidad: nuevoItem.cantidad,
      precioUnitario: nuevoItem.precioUnitario,
      total: nuevoItem.cantidad * nuevoItem.precioUnitario,
    };

    setItems([...items, item]);
    setNuevoItem({
      servicioId: '',
      nombre: '',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    });
  };

  const eliminarItem = (indice: number) => {
    setItems(items.filter((_, i) => i !== indice));
  };

  const seleccionarServicio = (servicioId: string) => {
    const servicio = servicios.find(s => s.id === servicioId);
    if (servicio) {
      setNuevoItem({
        servicioId: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        cantidad: 1,
        precioUnitario: servicio.precio,
      });
    }
  };

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - descuento;
    return { subtotal, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pacienteId) {
      alert('Selecciona un paciente');
      return;
    }

    if (items.length === 0) {
      alert('Agrega al menos un servicio');
      return;
    }

    const { subtotal, total } = calcularTotales();
    
    // Obtener profesión del paciente seleccionado o usar default
    const pacienteSeleccionado = pacientes.find(p => p.id === pacienteId);
    const profesion = pacienteSeleccionado?.profesionPrincipal || 'medicina_general';

    onGuardar({
      pacienteId,
      fecha: new Date(),
      servicios: items,
      subtotal,
      descuento: descuento || undefined,
      total,
      validezDias,
      profesion,
      notas: notas.trim() || undefined,
      estado: 'vigente',
    });
  };

  const { subtotal, total } = calcularTotales();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de paciente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paciente *
        </label>
        <select
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-saludvalpa-blue"
          required
        >
          <option value="">Seleccionar paciente...</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellidos}
            </option>
          ))}
        </select>
      </div>

      {/* Servicios agregados */}
      {items.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Servicios</h3>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {item.cantidad} × {formatearMoneda(item.precioUnitario)} = {formatearMoneda(item.total)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarItem(idx)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agregar servicio */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Agregar servicio</h3>
        
        {/* Selector de servicio del catálogo */}
        {servicios.length > 0 && (
          <div className="mb-3">
            <select
              value={nuevoItem.servicioId}
              onChange={(e) => seleccionarServicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Seleccionar del catálogo...</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} - {formatearMoneda(s.precio)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={nuevoItem.nombre}
            onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
            placeholder="Nombre del servicio"
            className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="number"
            value={nuevoItem.cantidad}
            onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: parseInt(e.target.value) || 1 })}
            min="1"
            placeholder="Cant."
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="number"
            value={nuevoItem.precioUnitario}
            onChange={(e) => setNuevoItem({ ...nuevoItem, precioUnitario: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            placeholder="Precio"
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <button
          type="button"
          onClick={agregarItem}
          className="w-full mt-2 px-3 py-2 bg-saludvalpa-blue text-white rounded hover:bg-saludvalpa-blue/90 text-sm"
        >
          + Agregar
        </button>
      </div>

      {/* Totales */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatearMoneda(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Descuento:</span>
          <input
            type="number"
            value={descuento}
            onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-right"
          />
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total:</span>
          <span className="text-saludvalpa-blue">{formatearMoneda(total)}</span>
        </div>
      </div>

      {/* Configuración adicional */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Validez (días)
          </label>
          <Input
            type="number"
            value={validezDias}
            onChange={(e) => setValidezDias(parseInt(e.target.value) || 30)}
            min="1"
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Observaciones adicionales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancelar} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Crear Cotización
        </Button>
      </div>
    </form>
  );
};

export default GestionCotizaciones;
