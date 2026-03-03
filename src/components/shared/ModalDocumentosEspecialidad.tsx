// ============================================================================
// saludvalpa 3.0 - MODAL DE DOCUMENTOS POR ESPECIALIDAD
// Modal para seleccionar y generar documentos médicos por especialidad
// ============================================================================

import { useState, useMemo } from 'react';
import type { TipoProfesion, DocumentoEspecialidad, DocumentCategory } from '../../types';
import { DOCUMENTOS_POR_ESPECIALIDAD, DocumentCategory as DocCategory } from '../../types';
import { useDocumentosEspecialidad } from '../../hooks/useDocumentosEspecialidad';
import Modal from './Modal';
import Button from './Button';
import DocumentCategoryBadge from './DocumentCategoryBadge';

interface ModalDocumentosEspecialidadProps {
  isOpen: boolean;
  onClose: () => void;
  especialidad: TipoProfesion;
  pacienteId?: string;
  onSeleccionarDocumento: (documento: DocumentoEspecialidad) => void;
  titulo?: string;
}

const ModalDocumentosEspecialidad = ({
  isOpen,
  onClose,
  especialidad,
  pacienteId,
  onSeleccionarDocumento,
  titulo = 'Generar Documento Médico'
}: ModalDocumentosEspecialidadProps) => {
  const [categoriaFiltro, setCategoriaFiltro] = useState<DocumentCategory | 'todas'>('todas');
  const [busqueda, setBusqueda] = useState('');

  // Obtener documentos de la especialidad
  const documentosEspecialidad = useMemo(() => {
    return DOCUMENTOS_POR_ESPECIALIDAD[especialidad] || [];
  }, [especialidad]);

  // Obtener documentos existentes del paciente
  const { documentosOrganizados } = useDocumentosEspecialidad({
    especialidad,
    pacienteId
  });

  // Filtrar documentos por categoría y búsqueda
  const documentosFiltrados = useMemo(() => {
    let filtrados = documentosEspecialidad;

    // Filtrar por categoría
    if (categoriaFiltro !== 'todas') {
      filtrados = filtrados.filter(doc => doc.categoria === categoriaFiltro);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      filtrados = filtrados.filter(doc =>
        doc.nombre.toLowerCase().includes(termino) ||
        doc.descripcion.toLowerCase().includes(termino)
      );
    }

    return filtrados;
  }, [documentosEspecialidad, categoriaFiltro, busqueda]);

  // Agrupar documentos por categoría
  const documentosPorCategoria = useMemo(() => {
    const grupos: Record<DocumentCategory, DocumentoEspecialidad[]> = {
      [DocCategory.MEDICO]: [],
      [DocCategory.ADMINISTRATIVO]: []
    };

    documentosFiltrados.forEach(doc => {
      grupos[doc.categoria].push(doc);
    });

    return grupos;
  }, [documentosFiltrados]);

  // Verificar si un documento ya fue generado para este paciente
  const documentoYaGenerado = (tipoDocumento: string) => {
    if (!pacienteId) return false;
    return documentosOrganizados.todos.some(doc => doc.tipo === tipoDocumento);
  };

  // Obtener nombre de especialidad para mostrar
  const nombreEspecialidad = useMemo(() => {
    const nombres: Record<TipoProfesion, string> = {
      fisioterapia: 'Fisioterapia',
      psicologia: 'Psicología',
      nutricion: 'Nutrición',
      medicina_general: 'Medicina General',
      odontologia: 'Odontología'
    };
    return nombres[especialidad] || especialidad;
  }, [especialidad]);

  // Manejar selección de documento
  const handleSeleccionarDocumento = (documento: DocumentoEspecialidad) => {
    onSeleccionarDocumento(documento);
    onClose();
  };

  // Obtener estadísticas
  const estadisticas = useMemo(() => {
    const total = documentosEspecialidad.length;
    const medicos = documentosEspecialidad.filter(d => d.categoria === DocCategory.MEDICO).length;
    const administrativos = documentosEspecialidad.filter(d => d.categoria === DocCategory.ADMINISTRATIVO).length;
    
    return { total, medicos, administrativos };
  }, [documentosEspecialidad]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      size="lg"
    >
      <div className="p-6">
        {/* Información de especialidad */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Especialidad: {nombreEspecialidad}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona el tipo de documento que deseas generar para el paciente.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{estadisticas.total}</span> documentos disponibles
              </div>
              <div className="flex gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  🏥 {estadisticas.medicos} médicos
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📋 {estadisticas.administrativos} administrativos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar documento..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={categoriaFiltro === 'todas' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoriaFiltro('todas')}
            >
              Todas
            </Button>
            <Button
              variant={categoriaFiltro === DocCategory.MEDICO ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoriaFiltro(DocCategory.MEDICO)}
            >
              🏥 Médicos
            </Button>
            <Button
              variant={categoriaFiltro === DocCategory.ADMINISTRATIVO ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoriaFiltro(DocCategory.ADMINISTRATIVO)}
            >
              📋 Administrativos
            </Button>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="space-y-4">
          {categoriaFiltro === 'todas' ? (
            // Mostrar agrupados por categoría
            <>
              {/* Documentos Médicos */}
              {documentosPorCategoria[DocCategory.MEDICO].length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-lg">
                      🏥
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Documentos Médicos
                    </h3>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {documentosPorCategoria[DocCategory.MEDICO].length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentosPorCategoria[DocCategory.MEDICO].map((documento) => (
                      <DocumentoCard
                        key={documento.id}
                        documento={documento}
                        yaGenerado={documentoYaGenerado(documento.tipoDocumento)}
                        onSeleccionar={handleSeleccionarDocumento}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos Administrativos */}
              {documentosPorCategoria[DocCategory.ADMINISTRATIVO].length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-lg">
                      📋
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Documentos Administrativos
                    </h3>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {documentosPorCategoria[DocCategory.ADMINISTRATIVO].length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentosPorCategoria[DocCategory.ADMINISTRATIVO].map((documento) => (
                      <DocumentoCard
                        key={documento.id}
                        documento={documento}
                        yaGenerado={documentoYaGenerado(documento.tipoDocumento)}
                        onSeleccionar={handleSeleccionarDocumento}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Mostrar filtrados por categoría específica
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentosFiltrados.map((documento) => (
                <DocumentoCard
                  key={documento.id}
                  documento={documento}
                  yaGenerado={documentoYaGenerado(documento.tipoDocumento)}
                  onSeleccionar={handleSeleccionarDocumento}
                />
              ))}
            </div>
          )}

          {/* Mensaje si no hay documentos */}
          {documentosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-gray-500">
                {busqueda.trim() 
                  ? `No hay documentos que coincidan con "${busqueda}"`
                  : `No hay documentos disponibles para la categoría seleccionada`
                }
              </p>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {pacienteId ? (
              <span>Se mostrarán documentos ya generados para este paciente.</span>
            ) : (
              <span>Selecciona un paciente para ver documentos generados.</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {documentosFiltrados.length === 1 && (
              <Button 
                variant="primary"
                onClick={() => handleSeleccionarDocumento(documentosFiltrados[0])}
              >
                Generar "{documentosFiltrados[0].nombre}"
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Componente de tarjeta de documento
interface DocumentoCardProps {
  documento: DocumentoEspecialidad;
  yaGenerado: boolean;
  onSeleccionar: (documento: DocumentoEspecialidad) => void;
}

const DocumentoCard = ({ documento, yaGenerado, onSeleccionar }: DocumentoCardProps) => {
  return (
    <div className={`
      border rounded-lg p-4 hover:shadow-md transition-shadow duration-200
      ${yaGenerado ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:border-blue-300'}
    `}>
      <div className="flex items-start gap-3">
        {/* Icono */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-lg">
          {documento.icono}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-800 truncate">
              {documento.nombre}
            </h4>
            <DocumentCategoryBadge categoria={documento.categoria} />
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {documento.descripcion}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {documento.requiereSesion && (
                <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 mr-2">
                  📝 Requiere sesión
                </span>
              )}
              <span>Tipo: {documento.tipoDocumento}</span>
            </div>

            <Button
              variant={yaGenerado ? 'outline' : 'primary'}
              size="sm"
              onClick={() => onSeleccionar(documento)}
              disabled={yaGenerado}
            >
              {yaGenerado ? '✅ Ya generado' : 'Seleccionar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDocumentosEspecialidad;