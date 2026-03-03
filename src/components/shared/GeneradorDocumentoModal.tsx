// ============================================================================
// saludvalpa 3.0 - MODAL GENERADOR DE DOCUMENTOS
// Modal para generar documentos dinámicamente cargando componentes específicos
// ============================================================================

import { useState, useEffect, Suspense, lazy } from 'react';
import type { ReactNode, ComponentType } from 'react';
import type { DocumentoEspecialidad, TipoProfesion } from '../../types';
import Modal from './Modal';
import Button from './Button';

interface GeneradorDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoEspecialidad;
  pacienteId?: string;
  especialidad?: TipoProfesion;
  onDocumentoGenerado?: (documentoData: any) => void;
}

const GeneradorDocumentoModal = ({
  isOpen,
  onClose,
  documento,
  pacienteId,
  especialidad,
  onDocumentoGenerado
}: GeneradorDocumentoModalProps) => {
  const [ComponenteGenerador, setComponenteGenerador] = useState<ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<any>(null);

  // Cargar el componente generador dinámicamente
  useEffect(() => {
    if (!isOpen || !documento.componenteGenerador) {
      return;
    }

    const cargarComponente = async () => {
      setLoading(true);
      setError(null);
      setComponenteGenerador(null);

      try {
        // Intentar cargar el componente usando el mapeo existente en moduleLoader
        const { cargarComponenteGenerador } = await import('../../utils/moduleLoader');
        const componente = await cargarComponenteGenerador(documento.componenteGenerador);
        
        if (!componente) {
          throw new Error(`No se pudo cargar el componente: ${documento.componenteGenerador}`);
        }
        
        setComponenteGenerador(() => componente);
      } catch (err) {
        console.error('Error al cargar componente generador:', err);
        setError(`Error al cargar el generador de documentos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    cargarComponente();
  }, [isOpen, documento.componenteGenerador]);

  // Manejar la generación exitosa del documento
  const handleGeneracionExitosa = (documentoData: any) => {
    console.log('Documento generado exitosamente:', documentoData);
    setGenerationResult(documentoData);
    
    if (onDocumentoGenerado) {
      onDocumentoGenerado(documentoData);
    }
    
    // Cerrar el modal después de un breve delay para mostrar mensaje de éxito
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Manejar error en la generación
  const handleGeneracionError = (error: Error) => {
    console.error('Error en generación de documento:', error);
    setError(`Error al generar el documento: ${error.message}`);
  };

  // Renderizar contenido del modal
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando generador de documentos...</p>
          <p className="text-sm text-gray-500 mt-2">{documento.componenteGenerador}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      );
    }

    if (ComponenteGenerador) {
      return (
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span>Renderizando componente...</span>
          </div>
        }>
          <div className="p-1">
            <ComponenteGenerador
              pacienteId={pacienteId}
              especialidad={especialidad}
              onGeneracionExitosa={handleGeneracionExitosa}
              onGeneracionError={handleGeneracionError}
              onCancelar={onClose}
            />
          </div>
        </Suspense>
      );
    }

    return (
      <div className="p-6">
        <p className="text-gray-600">No se pudo cargar el generador de documentos.</p>
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={generationResult ? "Documento Generado" : `Generar: ${documento.nombre}`}
      size="xl"
    >
      {renderContent()}
      
      {generationResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Documento generado exitosamente</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            El documento ha sido generado y guardado en la base de datos.
          </p>
        </div>
      )}
    </Modal>
  );
};

export default GeneradorDocumentoModal;