// ============================================================================
// saludvalpa 3.0 - GENERAR CONSENTIMIENTO
// Modal para generar consentimiento informado con firma
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../../types';
import { TipoDocumento } from '../../types';
import { generarConsentimiento, guardarDocumento, generarFolio } from '../../services/pdfService';
import { descargarArchivo } from '../../utils/helpers';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FirmaDigital from '../shared/FirmaDigital';

interface GenerarConsentimientoProps {
  paciente: Paciente;
  onExito: () => void;
  onCancelar: () => void;
}

const GenerarConsentimiento = ({ paciente, onExito, onCancelar }: GenerarConsentimientoProps) => {
  const [paso, setPaso] = useState<'formulario' | 'firma'>('formulario');
  const [generando, setGenerando] = useState(false);
  
  const [formData, setFormData] = useState({
    tipoConsentimiento: 'Tratamiento de Fisioterapia',
    descripcionTratamiento: '',
    riesgos: '',
    beneficios: '',
    alternativas: '',
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.tipoConsentimiento.trim()) {
      nuevosErrores.tipoConsentimiento = 'El tipo de consentimiento es requerido';
    }

    if (!formData.descripcionTratamiento.trim()) {
      nuevosErrores.descripcionTratamiento = 'La descripción del tratamiento es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleContinuar = () => {
    if (!validarFormulario()) return;
    setPaso('firma');
  };

  const handleGuardarFirma = async (firma: string) => {
    await handleGenerar(firma);
  };

  const handleGenerar = async (firma: string) => {
    setGenerando(true);
    try {
      const folio = generarFolio(TipoDocumento.CONSENTIMIENTO_INFORMADO);
      
      const pdfBlob = await generarConsentimiento(paciente, {
        tipoConsentimiento: formData.tipoConsentimiento.trim(),
        descripcionTratamiento: formData.descripcionTratamiento.trim(),
        riesgos: formData.riesgos.trim() || undefined,
        beneficios: formData.beneficios.trim() || undefined,
        alternativas: formData.alternativas.trim() || undefined,
        firmaBase64: firma,
      });

      // Guardar en base de datos
      await guardarDocumento(
        paciente.id,
        TipoDocumento.CONSENTIMIENTO_INFORMADO,
        `Consentimiento ${folio}`,
        pdfBlob,
        {
          folio,
          firmado: true,
          firmaBase64: firma,
          tipo: formData.tipoConsentimiento,
        }
      );

      // Descargar automáticamente
      descargarArchivo(
        pdfBlob, 
        `Consentimiento_${folio}_${paciente.apellidos}.pdf`
      );

      onExito();
    } catch (error) {
      console.error('Error al generar consentimiento:', error);
      alert('Error al generar el consentimiento');
    } finally {
      setGenerando(false);
    }
  };

  if (paso === 'firma') {
    return (
      <div>
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Información del consentimiento completada
          </p>
        </div>

        <FirmaDigital
          titulo="Firma del paciente"
          onGuardar={handleGuardarFirma}
          onCancelar={() => setPaso('formulario')}
        />

        {generando && (
          <div className="mt-4 text-center">
            <div className="inline-block w-8 h-8 border-4 border-saludvalpa-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 mt-2">Generando PDF...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
        <p className="text-sm text-saludvalpa-blue">
          <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
        </p>
      </div>

      <Input
        label="Tipo de consentimiento *"
        value={formData.tipoConsentimiento}
        onChange={(e) => setFormData(prev => ({ ...prev, tipoConsentimiento: e.target.value }))}
        error={errores.tipoConsentimiento}
        placeholder="Ej: Tratamiento de fisioterapia manual"
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del tratamiento *
        </label>
        <textarea
          value={formData.descripcionTratamiento}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcionTratamiento: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent ${
            errores.descripcionTratamiento ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
          placeholder="Describe en qué consiste el tratamiento que se realizará..."
        />
        {errores.descripcionTratamiento && (
          <p className="text-xs text-red-600 mt-1">{errores.descripcionTratamiento}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Riesgos y complicaciones (opcional)
        </label>
        <textarea
          value={formData.riesgos}
          onChange={(e) => setFormData(prev => ({ ...prev, riesgos: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          placeholder="Posibles riesgos o efectos secundarios del tratamiento..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beneficios esperados (opcional)
        </label>
        <textarea
          value={formData.beneficios}
          onChange={(e) => setFormData(prev => ({ ...prev, beneficios: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          placeholder="Beneficios esperados del tratamiento..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alternativas de tratamiento (opcional)
        </label>
        <textarea
          value={formData.alternativas}
          onChange={(e) => setFormData(prev => ({ ...prev, alternativas: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          rows={3}
          placeholder="Otras opciones de tratamiento disponibles..."
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleContinuar}
          className="flex-1"
        >
          Continuar a firma →
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancelar}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default GenerarConsentimiento;
