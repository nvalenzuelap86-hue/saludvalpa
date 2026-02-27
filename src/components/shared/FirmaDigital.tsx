// ============================================================================
// saludvalpa 3.0 - FIRMA DIGITAL
// Componente para capturar firmas con touch/mouse
// ============================================================================

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from './Button';

const COLORES = {
  primario: '#2C5D7D',
};

interface FirmaDigitalProps {
  onGuardar: (firmaBase64: string) => void;
  onCancelar?: () => void;
  titulo?: string;
}

const FirmaDigital = ({ onGuardar, onCancelar, titulo = 'Firma del paciente' }: FirmaDigitalProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [firmando, setFirmando] = useState(false);
  const [hayFirma, setHayFirma] = useState(false);

  const limpiar = () => {
    sigCanvas.current?.clear();
    setHayFirma(false);
  };

  const guardar = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert('Por favor, firma antes de guardar');
      return;
    }

    const firmaBase64 = sigCanvas.current.toDataURL('image/png');
    onGuardar(firmaBase64);
  };

  const handleBegin = () => {
    setFirmando(true);
    setHayFirma(true);
  };

  const handleEnd = () => {
    setFirmando(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {titulo}
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Firma aquí usando tu dedo (móvil/tablet) o mouse (desktop)
        </p>

        {/* Canvas de firma */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'w-full h-48 touch-none',
              style: { touchAction: 'none' },
            }}
            backgroundColor="white"
            penColor={COLORES.primario}
            minWidth={1}
            maxWidth={3}
            onBegin={handleBegin}
            onEnd={handleEnd}
          />
        </div>

        {/* Indicador de estado */}
        {firmando && (
          <p className="text-xs text-saludvalpa-blue mt-2">✍️ Firmando...</p>
        )}
        {!firmando && hayFirma && (
          <p className="text-xs text-green-600 mt-2">✓ Firma capturada</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={limpiar}
          disabled={!hayFirma}
          className="flex-1"
        >
          🗑️ Limpiar
        </Button>
        
        <Button
          variant="primary"
          onClick={guardar}
          className="flex-1"
        >
          ✓ Guardar firma
        </Button>

        {onCancelar && (
          <Button
            variant="outline"
            onClick={onCancelar}
          >
            Cancelar
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        La firma será incluida en el documento PDF
      </p>
    </div>
  );
};

export default FirmaDigital;
