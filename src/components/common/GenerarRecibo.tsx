// ============================================================================
// saludvalpa 3.0 - GENERAR RECIBO
// Modal para generar recibo de pago
// ============================================================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { Paciente } from '../../types';
import { TipoDocumento, EstadoPago } from '../../types';
import { generarRecibo, guardarDocumento, generarFolio } from '../../services/pdfService';
import { descargarArchivo } from '../../utils/helpers';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface GenerarReciboProps {
  paciente?: Paciente | null;
  onExito: () => void;
  onCancelar: () => void;
}

const GenerarRecibo = ({ paciente: pacienteInicial, onExito, onCancelar }: GenerarReciboProps) => {
  const [pacienteId, setPacienteId] = useState<string | null>(pacienteInicial?.id || null);
  const pacientes = useLiveQuery(() => db.pacientes.toArray(), []);
  
  const paciente = pacienteInicial || pacientes?.find(p => p.id === pacienteId);
  const [generando, setGenerando] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    concepto: 'Consulta de fisioterapia',
    metodoPago: 'efectivo',
    notas: '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      nuevosErrores.monto = 'El monto debe ser mayor a 0';
    }

    if (!formData.concepto.trim()) {
      nuevosErrores.concepto = 'El concepto es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGenerar = async () => {
    if (!paciente) {
      alert('Debe seleccionar un paciente');
      return;
    }
    
    if (!validar()) return;

    setGenerando(true);
    try {
      const folio = generarFolio(TipoDocumento.RECIBO_PAGO);
      const fechaGeneracion = new Date();
      const monto = parseFloat(formData.monto);
      
      const pdfBlob = await generarRecibo(paciente, {
        folio,
        monto,
        concepto: formData.concepto.trim(),
        metodoPago: formData.metodoPago,
        fecha: fechaGeneracion,
        notas: formData.notas.trim() || undefined,
      });

      // 1. Guardar PDF en tabla de documentos
      await guardarDocumento(
        paciente.id,
        TipoDocumento.RECIBO_PAGO,
        `Recibo ${folio}`,
        pdfBlob,
        {
          folio,
          monto,
          concepto: formData.concepto,
          metodoPago: formData.metodoPago,
        }
      );

      // 2. 🔧 FIX: Crear entrada en tabla de recibos (Economía)
      const recibosExistentes = await db.recibos.toArray();
      const ultimoNumero = recibosExistentes.reduce((max, r) => Math.max(max, r.numero), 0);

      await db.recibos.add({
        id: crypto.randomUUID(),
        numero: ultimoNumero + 1,
        pacienteId: paciente.id,
        fecha: fechaGeneracion,
        servicios: [{
          nombre: formData.concepto.trim(),
          precioUnitario: monto,
          cantidad: 1,
          total: monto,
        }],
        subtotal: monto,
        descuento: 0,
        total: monto,
        profesion: paciente.profesionPrincipal || 'medicina_general',
        metodoPago: formData.metodoPago as 'efectivo' | 'tarjeta' | 'transferencia' | 'otro',
        estadoPago: EstadoPago.PAGADO_COMPLETO,
        notas: formData.notas.trim() || undefined,
      });

      // Descargar automáticamente
      descargarArchivo(pdfBlob, `Recibo_${folio}_${paciente.apellidos}.pdf`);

      onExito();
    } catch (error) {
      console.error('Error al generar recibo:', error);
      alert('Error al generar el recibo');
    } finally {
      setGenerando(false);
    }
  };

  // Si no hay paciente inicial, mostrar selector
  if (!pacienteInicial && !paciente) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Seleccionar Paciente</h3>
        <p className="text-sm text-gray-600">Primero selecciona el paciente para generar el recibo:</p>
        
        <select
          value={pacienteId || ''}
          onChange={(e) => setPacienteId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
        >
          <option value="">Seleccionar paciente...</option>
          {pacientes?.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellidos}
            </option>
          ))}
        </select>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (!paciente) return null;

  return (
    <div className="space-y-4">
      <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
        <p className="text-sm text-saludvalpa-blue">
          <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
        </p>
      </div>

      <Input
        label="Monto *"
        type="number"
        step="0.01"
        min="0"
        value={formData.monto}
        onChange={(e) => setFormData(prev => ({ ...prev, monto: e.target.value }))}
        error={errores.monto}
        placeholder="500.00"
        autoFocus
      />

      <Input
        label="Concepto *"
        value={formData.concepto}
        onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
        error={errores.concepto}
        placeholder="Consulta de fisioterapia"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Método de pago
        </label>
        <select
          value={formData.metodoPago}
          onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta débito/crédito</option>
          <option value="transferencia">Transferencia bancaria</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          placeholder="Notas opcionales que aparecerán en el recibo..."
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleGenerar}
          isLoading={generando}
          className="flex-1"
        >
          📄 Generar recibo
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancelar}
          disabled={generando}
        >
          Cancelar
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        El recibo se generará, guardará y descargará automáticamente
      </p>
    </div>
  );
};

export default GenerarRecibo;
