// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE DOCUMENTOS ORGANIZADOS
// Componente para organizar documentos en pestañas (médicos/administrativos)
// ============================================================================

import { useState, useMemo } from 'react';
import type { Documento, TipoProfesion, DocumentCategory } from '../types';
import { DocumentCategory as DocCategory } from '../types';
import { useDocumentosEspecialidad } from '../hooks/useDocumentosEspecialidad';
import DocumentCategoryBadge from './shared/DocumentCategoryBadge';
import Button from './shared/Button';
import Modal from './shared/Modal';
import VisorPDF from './common/VisorPDF';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentosOrganizadosProps {
  pacienteId: string;
  especialidad: TipoProfesion;
  onGenerarDocumento?: () => void;
  modoCompacto?: boolean;
}

const DocumentosOrganizados = ({
  pacienteId,
  especialidad,
  onGenerarDocumento,
  modoCompacto = false
}: DocumentosOrganizadosProps) => {
  const [categoriaActiva, setCategoriaActiva] = useState<DocumentCategory>(DocCategory.MEDICO);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null);
  const [mostrarVisorPDF, setMostrarVisorPDF] = useState(false);

  // Obtener documentos organizados
  const {
    documentosOrganizados,
    documentosAgrupadosPorFecha,
    estadisticas,
    cargando,
    error
  } = useDocumentosEspecialidad({
    pacienteId,
    especialidad
  });

  // Documentos filtrados por categoría activa
  const documentosFiltrados = useMemo(() => {
    return categoriaActiva === DocCategory.MEDICO 
      ? documentosOrganizados.medicos 
      : documentosOrganizados.administrativos;
  }, [categoriaActiva, documentosOrganizados]);

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: Date) => {
    return format(fecha, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Formatear fecha relativa
  const formatearFechaRelativa = (fecha: Date) => {
    const ahora = new Date();
    const diffDias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
    
    return formatearFecha(fecha);
  };

  // Manejar ver documento
  const handleVerDocumento = (documento: Documento) => {
    setDocumentoSeleccionado(documento);
    setMostrarVisorPDF(true);
  };

  // Manejar descargar documento
  const handleDescargarDocumento = (documento: Documento) => {
    try {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${documento.contenidoBase64}`;
      link.download = `${documento.nombre.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al descargar documento:', error);
    }
  };

  // Renderizar documento individual
  const renderDocumento = (documento: Documento) => {
    const fecha = new Date(documento.fechaCreacion);
    
    return (
      <div
        key={documento.id}
        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-800 truncate">
                {documento.nombre}
              </h4>
              <DocumentCategoryBadge
                categoria={documento.categoria || DocCategory.MEDICO}
                size="sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                📅 {formatearFechaRelativa(fecha)}
              </span>
              <span className="flex items-center gap-1">
                📋 {documento.tipo}
              </span>
              {documento.firmado && (
                <span className="flex items-center gap-1 text-green-600">
                  ✍️ Firmado
                </span>
              )}
            </div>

            {documento.metadata?.folio && (
              <div className="text-xs text-gray-500 mb-3">
                Folio: <span className="font-medium">{documento.metadata.folio}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVerDocumento(documento)}
              className="whitespace-nowrap"
            >
              👁️ Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDescargarDocumento(documento)}
              className="whitespace-nowrap"
            >
              ⬇️ Descargar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista compacta
  if (modoCompacto) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            📄 Documentos ({estadisticas.total})
          </h3>
          {onGenerarDocumento && (
            <Button variant="primary" size="sm" onClick={onGenerarDocumento}>
              + Nuevo documento
            </Button>
          )}
        </div>

        {cargando ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando documentos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error al cargar documentos: {error}</p>
          </div>
        ) : documentosOrganizados.todos.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-3">📭</div>
            <h4 className="font-medium text-gray-700 mb-1">No hay documentos</h4>
            <p className="text-gray-500 text-sm mb-4">
              Aún no se han generado documentos para este paciente.
            </p>
            {onGenerarDocumento && (
              <Button variant="primary" onClick={onGenerarDocumento}>
                Generar primer documento
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pestañas */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  categoriaActiva === DocCategory.MEDICO
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setCategoriaActiva(DocCategory.MEDICO)}
              >
                🏥 Médicos ({estadisticas.medicos})
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${
                  categoriaActiva === DocCategory.ADMINISTRATIVO
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setCategoriaActiva(DocCategory.ADMINISTRATIVO)}
              >
                📋 Administrativos ({estadisticas.administrativos})
              </button>
            </div>

            {/* Lista de documentos */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {documentosFiltrados.slice(0, 5).map(renderDocumento)}
              
              {documentosFiltrados.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    ... y {documentosFiltrados.length - 5} documentos más
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visor de PDF */}
        {mostrarVisorPDF && documentoSeleccionado && (
          <Modal
            isOpen={mostrarVisorPDF}
            onClose={() => setMostrarVisorPDF(false)}
            title={documentoSeleccionado.nombre}
            size="xl"
          >
            <VisorPDF
              pdfBlob={new Blob([atob(documentoSeleccionado.contenidoBase64)], { type: 'application/pdf' })}
              onCerrar={() => setMostrarVisorPDF(false)}
              permitirDescarga={true}
              permitirImpresion={true}
              nombreArchivo={`${documentoSeleccionado.nombre.replace(/\s+/g, '_')}.pdf`}
            />
          </Modal>
        )}
      </div>
    );
  }

  // Renderizar vista completa
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            📄 Documentos Generados
          </h2>
          <p className="text-gray-600 mt-1">
            Documentos médicos y administrativos del paciente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              🏥 {estadisticas.medicos} médicos
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              📋 {estadisticas.administrativos} administrativos
            </span>
          </div>
          
          {onGenerarDocumento && (
            <Button variant="primary" onClick={onGenerarDocumento}>
              + Nuevo documento
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium text-lg ${
            categoriaActiva === DocCategory.MEDICO
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setCategoriaActiva(DocCategory.MEDICO)}
        >
          🏥 Documentos Médicos ({estadisticas.medicos})
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium text-lg ${
            categoriaActiva === DocCategory.ADMINISTRATIVO
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setCategoriaActiva(DocCategory.ADMINISTRATIVO)}
        >
          📋 Documentos Administrativos ({estadisticas.administrativos})
        </button>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documentos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-red-800">Error al cargar documentos</h4>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : documentosFiltrados.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay documentos {categoriaActiva === DocCategory.MEDICO ? 'médicos' : 'administrativos'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {categoriaActiva === DocCategory.MEDICO
              ? 'Aún no se han generado documentos médicos para este paciente.'
              : 'Aún no se han generado documentos administrativos para este paciente.'
            }
          </p>
          {onGenerarDocumento && (
            <Button variant="primary" size="lg" onClick={onGenerarDocumento}>
              Generar primer documento
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Agrupado por fecha */}
          {documentosAgrupadosPorFecha
            .filter(grupo => 
              grupo.documentos.some(doc => 
                (doc.categoria || DocCategory.MEDICO) === categoriaActiva
              )
            )
            .map(grupo => {
              const documentosDelGrupo = grupo.documentos.filter(
                doc => (doc.categoria || DocCategory.MEDICO) === categoriaActiva
              );

              if (documentosDelGrupo.length === 0) return null;

              return (
                <div key={grupo.clave} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {format(grupo.fecha, "MMMM 'de' yyyy", { locale: es })}
                    </h3>
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                      {documentosDelGrupo.length} documentos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {documentosDelGrupo.map(renderDocumento)}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Visor de PDF */}
      {mostrarVisorPDF && documentoSeleccionado && (
        <Modal
          isOpen={mostrarVisorPDF}
          onClose={() => setMostrarVisorPDF(false)}
          title={documentoSeleccionado.nombre}
          size="xl"
        >
          <VisorPDF
            pdfBlob={new Blob([atob(documentoSeleccionado.contenidoBase64)], { type: 'application/pdf' })}
            onCerrar={() => setMostrarVisorPDF(false)}
            permitirDescarga={true}
            permitirImpresion={true}
            nombreArchivo={`${documentoSeleccionado.nombre.replace(/\s+/g, '_')}.pdf`}
          />
        </Modal>
      )}
    </div>
  );
};

export default DocumentosOrganizados;