// ============================================================================
// saludvalpa 3.0 - GENERAR HOJA EN BLANCO
// Modal para generar documento personalizable
// ============================================================================

import { useState } from 'react';
import type { Paciente } from '../../types';
import { TipoDocumento } from '../../types';
import { generarHojaEnBlanco, guardarDocumento, generarFolio } from '../../services/pdfService';
import { descargarArchivo } from '../../utils/helpers';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface GenerarHojaBlancoProps {
  paciente?: Paciente;
  onExito: () => void;
  onCancelar: () => void;
}

const GenerarHojaBlanco = ({ paciente, onExito, onCancelar }: GenerarHojaBlancoProps) => {
  const [generando, setGenerando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: 'DOCUMENTO',
    contenido: '',
  });

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      const folio = generarFolio(TipoDocumento.HOJA_BLANCO);
      
      const pdfBlob = await generarHojaEnBlanco(paciente, {
        titulo: formData.titulo.trim() || 'DOCUMENTO',
        contenido: formData.contenido.trim() || undefined,
      });

      // Guardar en base de datos (solo si hay paciente asociado)
      if (paciente) {
        await guardarDocumento(
          paciente.id,
          TipoDocumento.HOJA_BLANCO,
          `${formData.titulo} ${folio}`,
          pdfBlob,
          { folio, titulo: formData.titulo }
        );
      }

      // Descargar automáticamente
      const nombreArchivo = paciente
        ? `${formData.titulo}_${folio}_${paciente.apellidos}.pdf`
        : `${formData.titulo}_${folio}.pdf`;
      
      descargarArchivo(pdfBlob, nombreArchivo);

      onExito();
    } catch (error) {
      console.error('Error al generar documento:', error);
      alert('Error al generar el documento');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="space-y-4">
      {paciente && (
        <div className="bg-saludvalpa-blue-light border border-saludvalpa-blue rounded-lg p-4">
          <p className="text-sm text-saludvalpa-blue">
            <strong>Paciente:</strong> {paciente.nombre} {paciente.apellidos}
          </p>
        </div>
      )}

      <Input
        label="Título del documento"
        value={formData.titulo}
        onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
        placeholder="INFORME MÉDICO"
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contenido (opcional)
        </label>
        <textarea
          value={formData.contenido}
          onChange={(e) => setFormData(prev => ({ ...prev, contenido: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent font-mono text-sm"
          rows={12}
          placeholder="Escribe aquí el contenido del documento...&#10;&#10;Puedes incluir cualquier texto que necesites.&#10;Se respetarán los saltos de línea."
        />
        <p className="text-xs text-gray-500 mt-1">
          También puedes dejar el contenido vacío y escribir a mano en el PDF impreso
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleGenerar}
          isLoading={generando}
          className="flex-1"
        >
          📄 Generar documento
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
        El documento se generará con tu logo y datos profesionales
      </p>
    </div>
  );
};

export default GenerarHojaBlanco;
