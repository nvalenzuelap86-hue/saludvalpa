// ============================================================================
// saludvalpa 3.0 - DOCUMENTOS
// Página de gestión de documentos generados
// ============================================================================

import { useState, lazy, Suspense } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Documento, DocumentCategory } from '../types';
import { TipoDocumento, DocumentCategory as DocumentCategoryConst } from '../types';
import { formatearFecha } from '../utils/helpers';
import { descargarDocumento, eliminarDocumento } from '../services/pdfService';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import DocumentCategoryBadge from '../components/shared/DocumentCategoryBadge';
import { useAppStore } from '../stores/appStore';

// Documentos comunes (siempre cargados)
import GenerarRecibo from '../components/common/GenerarRecibo';
import GenerarConsentimiento from '../components/common/GenerarConsentimiento';
import GenerarHojaBlanco from '../components/common/GenerarHojaBlanco';
import VisorPDF from '../components/common/VisorPDF';

// Componentes de fisioterapia con lazy loading
const GenerarEvaluacionFisioterapeutica = lazy(() => import('../modules/fisioterapia/components/GenerarEvaluacionFisioterapeutica'));
const GenerarPlanTratamiento = lazy(() => import('../modules/fisioterapia/components/GenerarPlanTratamiento'));
const GenerarNotaEvolucion = lazy(() => import('../modules/fisioterapia/components/GenerarNotaEvolucion'));

// Componentes de medicina con lazy loading
const GenerarRecetaMedica = lazy(() => import('../modules/medicina/components/GenerarRecetaMedica'));

// Componente de loading
const LoadingDocumento = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-saludvalpa-blue border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-gray-600">Cargando...</span>
  </div>
);

const Documentos = () => {
  const { configuracion: config } = useAppStore();
  const [modalActivo, setModalActivo] = useState<'recibo' | 'consentimiento' | 'hoja' | 'evaluacion' | 'plan' | 'nota' | 'receta_medica' | null>(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<typeof TipoDocumento[keyof typeof TipoDocumento] | 'todos'>('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<DocumentCategory | 'todos'>('todos');
  
  // Estado para el visor de PDF
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [documentoViendoId, setDocumentoViendoId] = useState<string | null>(null);

  // Cargar todos los documentos con live query
  const documentos = useLiveQuery(async () => {
    let query = db.documentos.toCollection();

    if (tipoFiltro !== 'todos') {
      query = db.documentos.where('tipo').equals(tipoFiltro);
    }

    let docs = await query.reverse().toArray(); // Más recientes primero

    // Filtrar por categoría
    if (categoriaFiltro !== 'todos') {
      docs = docs.filter(doc => {
        // Si el documento tiene categoría definida, filtrar por ella
        if (doc.categoria) {
          return doc.categoria === categoriaFiltro;
        }
        // Si no tiene categoría definida, inferirla basada en el tipo de documento
        const tipo = doc.tipo;
        const tiposMedicos = [
          TipoDocumento.HISTORIA_CLINICA_MEDICA,
          TipoDocumento.RECETA_MEDICA,
          TipoDocumento.CERTIFICADO_MEDICO,
          TipoDocumento.EVALUACION_FISIOTERAPEUTICA,
          TipoDocumento.PLAN_TRATAMIENTO,
          TipoDocumento.NOTA_SESION
        ];
        const tiposAdministrativos = [
          TipoDocumento.RECIBO_PAGO,
          TipoDocumento.CONSENTIMIENTO_INFORMADO,
          TipoDocumento.HOJA_BLANCO,
          TipoDocumento.REPORTE_SESION,
          TipoDocumento.CONFIRMACION_CITA
        ];
        
        if (categoriaFiltro === DocumentCategoryConst.MEDICO && tiposMedicos.includes(tipo as any)) {
          return true;
        }
        if (categoriaFiltro === DocumentCategoryConst.ADMINISTRATIVO && tiposAdministrativos.includes(tipo as any)) {
          return true;
        }
        return false;
      });
    }

    // Filtrar por búsqueda
    if (busqueda) {
      return docs.filter(doc =>
        doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        doc.id.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return docs;
  }, [tipoFiltro, categoriaFiltro, busqueda]);

  // Cargar pacientes para el selector
  const pacientes = useLiveQuery(() => db.pacientes.toArray());

  const handleDescargar = async (documentoId: string) => {
    try {
      await descargarDocumento(documentoId);
    } catch (error) {
      alert('Error al descargar documento');
    }
  };

  const handleEliminar = async (documentoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;

    try {
      await eliminarDocumento(documentoId);
    } catch (error) {
      alert('Error al eliminar documento');
    }
  };

  const handleVerDocumento = (documentoId: string) => {
    setDocumentoViendoId(documentoId);
    setVisorAbierto(true);
  };

  const cerrarVisor = () => {
    setVisorAbierto(false);
    setDocumentoViendoId(null);
  };

  const handleNuevoDocumento = (tipo: 'recibo' | 'consentimiento' | 'hoja' | 'evaluacion' | 'plan' | 'nota' | 'receta_medica') => {
    setModalActivo(tipo);
  };

  const cerrarModal = () => {
    setModalActivo(null);
    setPacienteSeleccionado(null);
  };

  const obtenerIconoTipo = (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]) => {
    switch (tipo) {
      case TipoDocumento.RECIBO_PAGO: return '💵';
      case TipoDocumento.CONSENTIMIENTO_INFORMADO: return '📋';
      case TipoDocumento.REPORTE_SESION: return '📊';
      case TipoDocumento.CONFIRMACION_CITA: return '📅';
      case TipoDocumento.EVALUACION_FISIOTERAPEUTICA: return '🩺';
      case TipoDocumento.PLAN_TRATAMIENTO: return '📝';
      case TipoDocumento.NOTA_SESION: return '📈';
      case TipoDocumento.HISTORIA_CLINICA_MEDICA: return '🏥';
      case TipoDocumento.RECETA_MEDICA: return '💊';
      case TipoDocumento.CERTIFICADO_MEDICO: return '📜';
      default: return '📄';
    }
  };

  const obtenerColorTipo = (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]) => {
    switch (tipo) {
      case TipoDocumento.RECIBO_PAGO: return 'bg-green-50 text-green-700 border-green-200';
      case TipoDocumento.CONSENTIMIENTO_INFORMADO: return 'bg-blue-50 text-blue-700 border-blue-200';
      case TipoDocumento.REPORTE_SESION: return 'bg-purple-50 text-purple-700 border-purple-200';
      case TipoDocumento.CONFIRMACION_CITA: return 'bg-orange-50 text-orange-700 border-orange-200';
      case TipoDocumento.EVALUACION_FISIOTERAPEUTICA: return 'bg-purple-50 text-purple-700 border-purple-200';
      case TipoDocumento.PLAN_TRATAMIENTO: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case TipoDocumento.NOTA_SESION: return 'bg-teal-50 text-teal-700 border-teal-200';
      case TipoDocumento.HISTORIA_CLINICA_MEDICA: return 'bg-red-50 text-red-700 border-red-200';
      case TipoDocumento.RECETA_MEDICA: return 'bg-amber-50 text-amber-700 border-amber-200';
      case TipoDocumento.CERTIFICADO_MEDICO: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Documentos</h1>
          
          <div className="flex gap-2">
            {/* Menú desplegable único con todas las opciones */}
            <details className="relative">
              <summary className="bg-saludvalpa-blue hover:bg-opacity-90 text-white px-6 py-2.5 rounded-lg cursor-pointer list-none transition-colors flex items-center gap-2 font-medium">
                ➕ Nuevo documento
              </summary>
              <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-10 min-w-64">
                <button
                  onClick={() => handleNuevoDocumento('recibo')}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 flex items-center gap-3 transition-colors rounded-t-lg"
                >
                  <span className="text-xl">💵</span>
                  <span className="font-medium">Recibo de pago</span>
                </button>
                <button
                  onClick={() => handleNuevoDocumento('consentimiento')}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 border-t transition-colors"
                >
                  <span className="text-xl">📋</span>
                  <span className="font-medium">Consentimiento informado</span>
                </button>
                <button
                  onClick={() => handleNuevoDocumento('hoja')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-t transition-colors"
                >
                  <span className="text-xl">📄</span>
                  <span className="font-medium">Hoja en blanco</span>
                </button>
                
                {config?.profesion === 'fisioterapia' && (
                  <>
                    <div className="border-t-2 border-gray-300 my-1"></div>
                    <button
                      onClick={() => handleNuevoDocumento('evaluacion')}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">🩺</span>
                      <span className="font-medium">Evaluación Fisioterapéutica</span>
                    </button>
                    <button
                      onClick={() => handleNuevoDocumento('plan')}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 border-t transition-colors"
                    >
                      <span className="text-xl">📝</span>
                      <span className="font-medium">Plan de Tratamiento</span>
                    </button>
                    <button
                      onClick={() => handleNuevoDocumento('nota')}
                      className="w-full text-left px-4 py-3 hover:bg-teal-50 flex items-center gap-3 border-t transition-colors rounded-b-lg"
                    >
                      <span className="text-xl">📊</span>
                      <span className="font-medium">Nota de Evolución</span>
                    </button>
                  </>
                )}
                
                {config?.profesion === 'medicina_general' && (
                  <>
                    <div className="border-t-2 border-gray-300 my-1"></div>
                    <button
                      onClick={() => handleNuevoDocumento('receta_medica')}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">💊</span>
                      <span className="font-medium">Receta Médica</span>
                    </button>
                  </>
                )}
              </div>
            </details>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar documento por nombre o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          />
          
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          >
            <option value="todos">Todos los tipos</option>
            <option value={TipoDocumento.RECIBO_PAGO}>Recibos</option>
            <option value={TipoDocumento.CONSENTIMIENTO_INFORMADO}>Consentimientos</option>
            <option value={TipoDocumento.HOJA_BLANCO}>Hojas en blanco</option>
            <option value={TipoDocumento.REPORTE_SESION}>Reportes</option>
            {config?.profesion === 'fisioterapia' && (
              <>
                <option value={TipoDocumento.EVALUACION_FISIOTERAPEUTICA}>Evaluaciones Fisio</option>
                <option value={TipoDocumento.PLAN_TRATAMIENTO}>Planes de Tratamiento</option>
                <option value={TipoDocumento.NOTA_SESION}>Notas de Evolución</option>
              </>
            )}
            {config?.profesion === 'medicina_general' && (
              <>
                <option value={TipoDocumento.HISTORIA_CLINICA_MEDICA}>Historias Clínicas Médicas</option>
                <option value={TipoDocumento.RECETA_MEDICA}>Recetas Médicas</option>
                <option value={TipoDocumento.CERTIFICADO_MEDICO}>Certificados Médicos</option>
              </>
            )}
          </select>
          
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value as DocumentCategory | 'todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          >
            <option value="todos">Todas las categorías</option>
            <option value={DocumentCategoryConst.ADMINISTRATIVO}>Administrativo</option>
            <option value={DocumentCategoryConst.MEDICO}>Médico</option>
          </select>
        </div>
      </div>

      {/* Lista de documentos */}
      {!documentos || documentos.length === 0 ? (
        <Card className="p-12 text-center">
          <span className="text-6xl mb-4 block">📄</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {busqueda ? 'No se encontraron documentos' : 'No hay documentos generados'}
          </h3>
          <p className="text-gray-600 mb-6">
            {busqueda 
              ? 'Intenta con otro término de búsqueda' 
              : 'Comienza generando tu primer documento'}
          </p>
          {!busqueda && (
            <div className="flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button onClick={() => handleNuevoDocumento('recibo')} variant="primary">
                💵 Recibo
              </Button>
              <Button onClick={() => handleNuevoDocumento('consentimiento')}>
                📋 Consentimiento
              </Button>
              <Button onClick={() => handleNuevoDocumento('hoja')} variant="outline">
                📄 Hoja
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {documentos.map((doc) => (
            <DocumentoCard
              key={doc.id}
              documento={doc}
              onVer={handleVerDocumento}
              onDescargar={handleDescargar}
              onEliminar={handleEliminar}
              obtenerIconoTipo={obtenerIconoTipo}
              obtenerColorTipo={obtenerColorTipo}
            />
          ))}
          
          <p className="text-center text-sm text-gray-500 pt-4">
            Mostrando {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Modales de generación */}
      <Modal
        isOpen={modalActivo === 'recibo'}
        onClose={cerrarModal}
        title="Generar recibo de pago"
        size="lg"
      >
        {pacienteSeleccionado ? (
          <GenerarRecibo
            paciente={pacienteSeleccionado}
            onExito={cerrarModal}
            onCancelar={cerrarModal}
          />
        ) : (
          <SelectorPaciente
            pacientes={pacientes || []}
            onSeleccionar={(p) => setPacienteSeleccionado(p)}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalActivo === 'consentimiento'}
        onClose={cerrarModal}
        title="Generar consentimiento informado"
        size="xl"
      >
        {pacienteSeleccionado ? (
          <GenerarConsentimiento
            paciente={pacienteSeleccionado}
            onExito={cerrarModal}
            onCancelar={cerrarModal}
          />
        ) : (
          <SelectorPaciente
            pacientes={pacientes || []}
            onSeleccionar={(p) => setPacienteSeleccionado(p)}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalActivo === 'hoja'}
        onClose={cerrarModal}
        title="Generar documento personalizado"
        size="lg"
      >
        {pacienteSeleccionado !== null ? (
          <GenerarHojaBlanco
            paciente={pacienteSeleccionado || undefined}
            onExito={cerrarModal}
            onCancelar={cerrarModal}
          />
        ) : (
          <SelectorPaciente
            pacientes={pacientes || []}
            onSeleccionar={(p) => setPacienteSeleccionado(p)}
            onCancelar={cerrarModal}
            permitirSinPaciente
            onSinPaciente={() => setPacienteSeleccionado(null)}
          />
        )}
      </Modal>

      {/* Modales específicos de Fisioterapia */}
      <Modal
        isOpen={modalActivo === 'evaluacion'}
        onClose={cerrarModal}
        title="Generar evaluación fisioterapéutica"
        size="xl"
      >
        <Suspense fallback={<LoadingDocumento />}>
          {pacienteSeleccionado ? (
            <GenerarEvaluacionFisioterapeutica
              paciente={pacienteSeleccionado}
              onExito={cerrarModal}
              onCancelar={cerrarModal}
            />
          ) : (
            <SelectorPaciente
              pacientes={pacientes || []}
              onSeleccionar={(p) => setPacienteSeleccionado(p)}
              onCancelar={cerrarModal}
            />
          )}
        </Suspense>
      </Modal>

      <Modal
        isOpen={modalActivo === 'plan'}
        onClose={cerrarModal}
        title="Generar plan de tratamiento"
        size="xl"
      >
        <Suspense fallback={<LoadingDocumento />}>
          {pacienteSeleccionado ? (
            <GenerarPlanTratamiento
              paciente={pacienteSeleccionado}
              onExito={cerrarModal}
              onCancelar={cerrarModal}
            />
          ) : (
            <SelectorPaciente
              pacientes={pacientes || []}
              onSeleccionar={(p) => setPacienteSeleccionado(p)}
              onCancelar={cerrarModal}
            />
          )}
        </Suspense>
      </Modal>

      <Modal
        isOpen={modalActivo === 'nota'}
        onClose={cerrarModal}
        title="Generar nota de evolución"
        size="xl"
      >
        <Suspense fallback={<LoadingDocumento />}>
          {pacienteSeleccionado ? (
            <GenerarNotaEvolucion
              paciente={pacienteSeleccionado}
              onExito={cerrarModal}
              onCancelar={cerrarModal}
            />
          ) : (
            <SelectorPaciente
              pacientes={pacientes || []}
              onSeleccionar={(p) => setPacienteSeleccionado(p)}
              onCancelar={cerrarModal}
            />
          )}
        </Suspense>
      </Modal>

      {/* Modal para receta médica */}
      <Modal
        isOpen={modalActivo === 'receta_medica'}
        onClose={cerrarModal}
        title="Generar receta médica"
        size="xl"
      >
        <Suspense fallback={<LoadingDocumento />}>
          {pacienteSeleccionado ? (
            <GenerarRecetaMedica
              paciente={pacienteSeleccionado}
              datosMedicina={{
                diagnostico: [],
                tratamiento: {
                  medicamentos: [],
                  indicaciones: [],
                  estudiosSolicitados: [],
                  interconsultas: []
                },
                signosVitales: {
                  presionArterial: '',
                  frecuenciaCardiaca: 0,
                  frecuenciaRespiratoria: 0,
                  temperatura: 0,
                  saturacionOxigeno: 0,
                  peso: 0,
                  talla: 0
                },
                exploracionFisica: {
                  cabezaCuello: '',
                  torax: '',
                  abdomen: '',
                  extremidades: '',
                  neurologico: ''
                },
                antecedentesPersonales: {
                  patologicos: [],
                  quirurgicos: [],
                  alergicos: [],
                  toxicos: [],
                  ginecologicos: []
                },
                recomendaciones: [],
                cie10: [],
                proximaCita: undefined
              }}
              onExito={cerrarModal}
              onCancelar={cerrarModal}
            />
          ) : (
            <SelectorPaciente
              pacientes={pacientes || []}
              onSeleccionar={(p) => setPacienteSeleccionado(p)}
              onCancelar={cerrarModal}
            />
          )}
        </Suspense>
      </Modal>

      {/* Modal para visualizar PDF */}
      <Modal
        isOpen={visorAbierto}
        onClose={cerrarVisor}
        title=""
        size="xl"
      >
        {documentoViendoId && (
          <VisorDocumento
            documentoId={documentoViendoId}
            onCerrar={cerrarVisor}
          />
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - CARD DE DOCUMENTO
// ============================================================================

const DocumentoCard = ({
  documento,
  onVer,
  onDescargar,
  onEliminar,
  obtenerIconoTipo,
  obtenerColorTipo,
}: {
  documento: Documento;
  onVer: (id: string) => void;
  onDescargar: (id: string) => void;
  onEliminar: (id: string) => void;
  obtenerIconoTipo: (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]) => string;
  obtenerColorTipo: (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]) => string;
}) => {
  const [paciente, setPaciente] = useState<any>(null);

  // Cargar nombre del paciente
  useLiveQuery(async () => {
    const p = await db.pacientes.get(documento.pacienteId);
    setPaciente(p);
    return p;
  }, [documento.pacienteId]);

  // Determinar la categoría del documento (si no está definida, inferirla)
  const determinarCategoria = (): DocumentCategory | undefined => {
    if (documento.categoria) {
      return documento.categoria;
    }
    
    // Inferir categoría basada en el tipo de documento
    const tipo = documento.tipo;
    const tiposMedicos = [
      TipoDocumento.HISTORIA_CLINICA_MEDICA,
      TipoDocumento.RECETA_MEDICA,
      TipoDocumento.CERTIFICADO_MEDICO,
      TipoDocumento.EVALUACION_FISIOTERAPEUTICA,
      TipoDocumento.PLAN_TRATAMIENTO,
      TipoDocumento.NOTA_SESION
    ];
    const tiposAdministrativos = [
      TipoDocumento.RECIBO_PAGO,
      TipoDocumento.CONSENTIMIENTO_INFORMADO,
      TipoDocumento.HOJA_BLANCO,
      TipoDocumento.REPORTE_SESION,
      TipoDocumento.CONFIRMACION_CITA
    ];
    
    if (tiposMedicos.includes(tipo as any)) {
      return DocumentCategoryConst.MEDICO;
    }
    if (tiposAdministrativos.includes(tipo as any)) {
      return DocumentCategoryConst.ADMINISTRATIVO;
    }
    
    return undefined;
  };

  const categoria = determinarCategoria();

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icono del tipo */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${obtenerColorTipo(documento.tipo)} border`}>
          {obtenerIconoTipo(documento.tipo)}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {documento.nombre}
            </h3>
            <div className="flex items-center gap-2">
              {categoria && (
                <DocumentCategoryBadge
                  categoria={categoria}
                  size="sm"
                  showIcon={true}
                  className="mr-2"
                />
              )}
              <span className={`text-xs px-2 py-1 rounded border ${obtenerColorTipo(documento.tipo)}`}>
                {documento.tipo}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            {paciente && (
              <p>
                👤 {paciente.nombre} {paciente.apellidos}
              </p>
            )}
            <p>📅 {formatearFecha(documento.fechaCreacion)}</p>
            {documento.firmado && (
              <p className="text-green-600 text-xs">✍️ Firmado digitalmente</p>
            )}
            {documento.metadata && 'folio' in documento.metadata && documento.metadata.folio && (
              <p className="text-xs text-gray-500">Folio: {documento.metadata.folio as string}</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onVer(documento.id)}
            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
            title="Ver PDF"
          >
            👁️
          </button>
          <button
            onClick={() => onDescargar(documento.id)}
            className="text-saludvalpa-blue hover:bg-saludvalpa-blue-light p-2 rounded-lg transition-colors"
            title="Descargar PDF"
          >
            ⬇️
          </button>
          <button
            onClick={() => onEliminar(documento.id)}
            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Eliminar documento"
          >
            🗑️
          </button>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - SELECTOR DE PACIENTE
// ============================================================================

const SelectorPaciente = ({
  pacientes,
  onSeleccionar,
  onCancelar,
  permitirSinPaciente = false,
  onSinPaciente,
}: {
  pacientes: any[];
  onSeleccionar: (paciente: any) => void;
  onCancelar: () => void;
  permitirSinPaciente?: boolean;
  onSinPaciente?: () => void;
}) => {
  const [busqueda, setBusqueda] = useState('');

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Selecciona el paciente para el cual generar el documento:
      </p>

      <input
        type="text"
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
        autoFocus
      />

      <div className="max-h-96 overflow-y-auto space-y-2">
        {pacientesFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No se encontraron pacientes</p>
          </div>
        ) : (
          pacientesFiltrados.map((paciente) => (
            <button
              key={paciente.id}
              onClick={() => onSeleccionar(paciente)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors"
            >
              <p className="font-medium text-gray-900">
                {paciente.nombre} {paciente.apellidos}
              </p>
              <p className="text-sm text-gray-600">
                {paciente.edad} años • {paciente.telefono}
              </p>
            </button>
          ))
        )}
      </div>

      {permitirSinPaciente && onSinPaciente && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={onSinPaciente}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors text-gray-600 hover:text-saludvalpa-blue"
          >
            📄 Generar documento sin paciente
          </button>
        </div>
      )}

      <div className="flex justify-end pt-3 border-t border-gray-200">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE AUXILIAR - VISOR DE PDF
// ============================================================================

const VisorDocumento = ({
  documentoId,
  onCerrar,
}: {
  documentoId: string;
  onCerrar: () => void;
}) => {
  const [documento, setDocumento] = useState<Documento | null>(null);

  useLiveQuery(async () => {
    const doc = await db.documentos.get(documentoId);
    setDocumento(doc || null);
    return doc;
  }, [documentoId]);

  return (
    <VisorPDF
      documentoId={documentoId}
      onCerrar={onCerrar}
      nombreArchivo={documento?.nombre || 'documento.pdf'}
      permitirDescarga={true}
      permitirImpresion={true}
    />
  );
};

export default Documentos;
