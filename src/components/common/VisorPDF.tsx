// ============================================================================
// saludvalpa 3.0 - VISOR PDF INTEGRADO
// Componente para visualizar PDFs sin necesidad de descargar
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { db } from '../../db/database';
import type { Documento } from '../../types';
import { Button } from '../';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Estilos para react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface VisorPDFProps {
  documentoId?: string;      // Cargar desde IndexedDB
  pdfBlob?: Blob;            // O usar Blob directamente
  pdfUrl?: string;           // O usar URL directa
  onCerrar: () => void;
  permitirDescarga?: boolean;
  permitirImpresion?: boolean;
  nombreArchivo?: string;
}

const VisorPDF = ({
  documentoId,
  pdfBlob,
  pdfUrl,
  onCerrar,
  permitirDescarga = true,
  permitirImpresion = true,
  nombreArchivo = 'documento.pdf',
}: VisorPDFProps) => {
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [pdfData, setPdfData] = useState<string | Blob | null>(null);
  const [numPaginas, setNumPaginas] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0); // 1.0 = 100%
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputPagina, setInputPagina] = useState<string>('1');

  // Cargar documento desde IndexedDB si se proporciona documentoId
  useEffect(() => {
    const cargarDocumento = async () => {
      if (!documentoId) return;

      try {
        setCargando(true);
        const doc = await db.documentos.get(documentoId);
        
        if (!doc) {
          setError('Documento no encontrado');
          return;
        }

        setDocumento(doc);
        
        // Convertir base64 a Blob
        if (doc.contenidoBase64) {
          const base64Data = doc.contenidoBase64.split(',')[1] || doc.contenidoBase64;
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          setPdfData(blob);
        } else {
          setError('Documento sin contenido');
        }
      } catch (err) {
        console.error('Error al cargar documento:', err);
        setError('Error al cargar el documento');
      } finally {
        setCargando(false);
      }
    };

    cargarDocumento();
  }, [documentoId]);

  // Usar Blob o URL directamente si se proporciona
  useEffect(() => {
    if (pdfBlob) {
      setPdfData(pdfBlob);
      setCargando(false);
    } else if (pdfUrl) {
      setPdfData(pdfUrl);
      setCargando(false);
    }
  }, [pdfBlob, pdfUrl]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPaginas(numPages);
    setCargando(false);
    setPaginaActual(1);
    setInputPagina('1');
  };

  const handleDocumentLoadError = (err: Error) => {
    console.error('Error al cargar PDF:', err);
    setError('Error al cargar el PDF. Intenta descargarlo.');
    setCargando(false);
  };

  const handleDescargar = () => {
    if (!pdfData) return;

    const blob = pdfData instanceof Blob ? pdfData : null;
    if (!blob) {
      alert('No se puede descargar este documento');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImprimir = () => {
    if (!pdfData) return;

    const blob = pdfData instanceof Blob ? pdfData : null;
    if (!blob) {
      alert('No se puede imprimir este documento');
      return;
    }

    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };
  };

  // ========================================================================
  // FASE 2: CONTROLES DE NAVEGACIÓN Y ZOOM
  // ========================================================================

  const irAPaginaAnterior = useCallback(() => {
    if (paginaActual > 1) {
      const nuevaPagina = paginaActual - 1;
      setPaginaActual(nuevaPagina);
      setInputPagina(String(nuevaPagina));
    }
  }, [paginaActual]);

  const irAPaginaSiguiente = useCallback(() => {
    if (paginaActual < numPaginas) {
      const nuevaPagina = paginaActual + 1;
      setPaginaActual(nuevaPagina);
      setInputPagina(String(nuevaPagina));
    }
  }, [paginaActual, numPaginas]);

  const irAPagina = useCallback((pagina: number) => {
    if (pagina >= 1 && pagina <= numPaginas) {
      setPaginaActual(pagina);
      setInputPagina(String(pagina));
    }
  }, [numPaginas]);

  const handleInputPaginaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPagina(e.target.value);
  };

  const handleInputPaginaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pagina = parseInt(inputPagina, 10);
    if (!isNaN(pagina) && pagina >= 1 && pagina <= numPaginas) {
      setPaginaActual(pagina);
    } else {
      setInputPagina(String(paginaActual));
    }
  };

  const zoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 3.0)); // Máximo 300%
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 0.5)); // Mínimo 50%
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1.0);
  }, []);

  // Atajos de teclado - con cleanup mejorado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar atajos si hay inputs enfocados
      if (document.activeElement?.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          irAPaginaAnterior();
          break;
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          irAPaginaSiguiente();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetZoom();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onCerrar();
          break;
        case 'Home':
          e.preventDefault();
          irAPagina(1);
          break;
        case 'End':
          e.preventDefault();
          irAPagina(numPaginas);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function que se ejecuta siempre
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    paginaActual,
    numPaginas,
    onCerrar,
    irAPaginaAnterior,
    irAPaginaSiguiente,
    zoomIn,
    zoomOut,
    resetZoom,
    irAPagina
  ]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saludvalpa-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            {permitirDescarga && pdfData && (
              <Button onClick={handleDescargar} variant="primary">
                Descargar PDF
              </Button>
            )}
            <Button onClick={onCerrar} variant="secondary">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No hay documento para mostrar</p>
          <Button onClick={onCerrar} variant="secondary">
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar superior */}
      <div className="bg-gray-100 border-b border-gray-300">
        {/* Fila 1: Título y acciones principales */}
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold text-gray-900 truncate max-w-md">
            {documento?.nombre || nombreArchivo}
          </h3>
          
          <div className="flex items-center gap-2">
            {permitirDescarga && (
              <Button
                onClick={handleDescargar}
                variant="outline"
                size="sm"
                title="Descargar PDF"
              >
                ⬇️
              </Button>
            )}
            {permitirImpresion && (
              <Button
                onClick={handleImprimir}
                variant="outline"
                size="sm"
                title="Imprimir"
              >
                🖨️
              </Button>
            )}
            <Button
              onClick={onCerrar}
              variant="secondary"
              size="sm"
              title="Cerrar (Esc)"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Fila 2: Controles de navegación y zoom */}
        {numPaginas > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
            {/* Controles de navegación */}
            <div className="flex items-center gap-2">
              <Button
                onClick={irAPaginaAnterior}
                disabled={paginaActual <= 1}
                variant="outline"
                size="sm"
                title="Anterior (←)"
              >
                ◀️
              </Button>
              
              <form onSubmit={handleInputPaginaSubmit} className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Página</span>
                <input
                  type="number"
                  value={inputPagina}
                  onChange={handleInputPaginaChange}
                  min={1}
                  max={numPaginas}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                />
                <span className="text-sm text-gray-600">de {numPaginas}</span>
              </form>

              <Button
                onClick={irAPaginaSiguiente}
                disabled={paginaActual >= numPaginas}
                variant="outline"
                size="sm"
                title="Siguiente (→)"
              >
                ▶️
              </Button>
            </div>

            {/* Controles de zoom */}
            <div className="flex items-center gap-2">
              <Button
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                variant="outline"
                size="sm"
                title="Alejar (-)"
              >
                🔍-
              </Button>
              
              <button
                onClick={resetZoom}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-saludvalpa-blue transition-colors"
                title="Restablecer zoom (Ctrl+0)"
              >
                {Math.round(zoom * 100)}%
              </button>

              <Button
                onClick={zoomIn}
                disabled={zoom >= 3.0}
                variant="outline"
                size="sm"
                title="Acercar (+)"
              >
                🔍+
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Área de visualización del PDF */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div className="flex justify-center">
          <Document
            file={pdfData}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saludvalpa-blue"></div>
              </div>
            }
          >
            {/* FASE 2: Navegación entre páginas con zoom */}
            <Page
              pageNumber={paginaActual}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg bg-white"
              scale={zoom}
              width={Math.min(window.innerWidth - 100, 800) / zoom}
            />
          </Document>
        </div>
      </div>

      {/* Información adicional */}
      {documento && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-300 text-xs text-gray-600">
          <span>Generado el {new Date(documento.fechaCreacion).toLocaleString('es-MX')}</span>
          {documento.metadata?.folio && (
            <span className="ml-4">Folio: {documento.metadata.folio}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VisorPDF;
