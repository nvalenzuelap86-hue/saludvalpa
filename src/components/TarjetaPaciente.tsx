// ============================================================================
// saludvalpa 3.0 - TARJETA DE PACIENTE
// Componente con modo dual: Revisión / Consulta
// ============================================================================

import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Paciente, DocumentoEspecialidad } from '../types';
import { TipoDocumento, TipoProfesion } from '../types';
import { formatearFecha, obtenerIniciales, normalizarEspecialidad, obtenerEspecialidadConFallback } from '../utils/helpers';
import { descargarDocumento } from '../services/pdfService';
import { ejecutarGeneracionDocumento } from '../utils/moduleLoader';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import GenerarRecibo from './common/GenerarRecibo';
import GenerarConsentimiento from './common/GenerarConsentimiento';
import GenerarHojaBlanco from './common/GenerarHojaBlanco';
import VisorPDF from './common/VisorPDF';
import SesionEnVivo from './SesionEnVivo';
import DocumentosOrganizados from './DocumentosOrganizados';
import ModalDocumentosEspecialidad from './shared/ModalDocumentosEspecialidad';
import GeneradorDocumentoModal from './shared/GeneradorDocumentoModal';
import { useAppStore } from '../stores/appStore';
import { useSesiones } from '../hooks/useSesiones';

// Lazy load del componente de rutinas (solo para fisioterapia)
const RutinasPaciente = lazy(() => import('../modules/fisioterapia/rutinas/RutinasPaciente'));

interface TarjetaPacienteProps {
  paciente: Paciente;
  onEditar?: () => void;
  onEliminar?: () => void;
  onActualizar?: () => void;
}

type Modo = 'revision' | 'consulta';

const TarjetaPaciente = ({ paciente, onEditar, onEliminar, onActualizar }: TarjetaPacienteProps) => {
  const [modo, setModo] = useState<Modo>('revision');
  const [sesionActiva, setSesionActiva] = useState(false);
  const [modalDocumentosEspecialidadAbierto, setModalDocumentosEspecialidadAbierto] = useState(false);
  const [generadorDocumentoModalAbierto, setGeneradorDocumentoModalAbierto] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoEspecialidad | null>(null);
  const { configuracion } = useAppStore();

  // Calcular especialidad con fallback y normalización
  const especialidad = useMemo((): TipoProfesion => {
    const especialidadCalculada = obtenerEspecialidadConFallback(
      paciente.profesionPrincipal,
      configuracion?.profesion
    );
    console.log('ESPECIALIDAD CALCULADA:', {
      pacienteProfesion: paciente.profesionPrincipal,
      configuracionProfesion: configuracion?.profesion,
      especialidadFinal: especialidadCalculada
    });
    return especialidadCalculada as TipoProfesion;
  }, [paciente.profesionPrincipal, configuracion?.profesion]);

  const iniciarSesionEnVivo = (conMarcadorTiempo: boolean = true) => {
    setModo('consulta');
    setSesionActiva(true);
    // Aquí se podría guardar la preferencia de marcador de tiempo
    // para usarla en el componente SesionEnVivo
  };

  const cerrarSesion = () => {
    setSesionActiva(false);
    setModo('revision');
  };

  // Si hay una sesión activa en modo consulta, mostrar SesionEnVivo
  if (sesionActiva && modo === 'consulta') {
    return (
      <SesionEnVivo
        paciente={paciente}
        profesion={configuracion?.profesion || 'fisioterapia'}
        onCerrar={cerrarSesion}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header del paciente */}
      <Card className="mb-4">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {obtenerIniciales(paciente.nombre, paciente.apellidos)}
            </div>

            {/* Información básica */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {paciente.nombre} {paciente.apellidos}
                  </h2>
                  <p className="text-gray-600">
                    {paciente.edad} años • {paciente.genero}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {paciente.id.substring(0, 13)}...
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  {onEditar && (
                    <button
                      onClick={onEditar}
                      className="text-saludvalpa-blue hover:bg-saludvalpa-blue-light p-2 rounded-lg transition-colors"
                      title="Editar paciente"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>

              {/* Contacto rápido */}
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <a href={`tel:${paciente.telefono}`} className="text-saludvalpa-blue hover:underline flex items-center gap-1">
                  📞 {paciente.telefono}
                </a>
                {paciente.email && (
                  <a href={`mailto:${paciente.email}`} className="text-saludvalpa-blue hover:underline flex items-center gap-1">
                    📧 {paciente.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Toggle de modo */}
          <div className="mt-6 flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setModo('revision')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                modo === 'revision'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Revisión
            </button>
            <button
              onClick={() => setModo('consulta')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                modo === 'consulta'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏥 Consulta
            </button>
          </div>
        </div>
      </Card>

      {/* Contenido según modo */}
      {modo === 'revision' ? (
        <ModoRevision
          paciente={paciente}
          onIniciarConsultaConMarcador={() => iniciarSesionEnVivo(true)}
          onIniciarConsultaSinMarcador={() => setModalDocumentosEspecialidadAbierto(true)}
          onEliminar={onEliminar}
          onActualizar={onActualizar}
        />
      ) : (
        <ModoConsulta
          onVolverRevision={() => setModo('revision')}
          onIniciarConsultaConMarcador={() => iniciarSesionEnVivo(true)}
          onIniciarConsultaSinMarcador={() => setModalDocumentosEspecialidadAbierto(true)}
        />
      )}

      {/* Modal para generar documentos por especialidad */}
      <ModalDocumentosEspecialidad
        isOpen={modalDocumentosEspecialidadAbierto}
        onClose={() => setModalDocumentosEspecialidadAbierto(false)}
        especialidad={especialidad}
        pacienteId={paciente.id}
        onSeleccionarDocumento={(documento) => {
          console.log('Documento seleccionado:', documento);
          // Cerrar el modal de selección
          setModalDocumentosEspecialidadAbierto(false);
          
          // Guardar el documento seleccionado y abrir el modal generador
          setDocumentoSeleccionado(documento);
          setGeneradorDocumentoModalAbierto(true);
        }}
        titulo="Generar documento médico"
      />

      {/* Modal para generar documento específico */}
      {documentoSeleccionado && (
        <GeneradorDocumentoModal
          isOpen={generadorDocumentoModalAbierto}
          onClose={() => {
            setGeneradorDocumentoModalAbierto(false);
            setDocumentoSeleccionado(null);
          }}
          documento={documentoSeleccionado}
          pacienteId={paciente.id}
          especialidad={especialidad}
          onDocumentoGenerado={(documentoData) => {
            console.log('Documento generado exitosamente:', documentoData);
            // Aquí se podría actualizar la lista de documentos del paciente
            // o mostrar una notificación de éxito
            if (onActualizar) {
              onActualizar();
            }
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// MODO REVISIÓN
// ============================================================================

const ModoRevision = ({
  paciente,
  onIniciarConsultaConMarcador,
  onIniciarConsultaSinMarcador,
  onEliminar,
  onActualizar
}: {
  paciente: Paciente;
  onIniciarConsultaConMarcador?: () => void;
  onIniciarConsultaSinMarcador?: () => void;
  onEliminar?: () => void;
  onActualizar?: () => void;
}) => {
  const { configuracion } = useAppStore();
  const [modalDocumento, setModalDocumento] = useState<'recibo' | 'consentimiento' | 'hoja' | null>(null);
  
  // Estado para el visor de PDF
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [documentoViendoId, setDocumentoViendoId] = useState<string | null>(null);


  // Cargar documentos del paciente con live query
  const documentos = useLiveQuery(
    () => db.documentos.where('pacienteId').equals(paciente.id).reverse().toArray(),
    [paciente.id]
  );

  const handleDescargar = async (documentoId: string) => {
    try {
      await descargarDocumento(documentoId);
    } catch (error) {
      alert('Error al descargar documento');
    }
  };

  const cerrarModal = () => {
    setModalDocumento(null);
    if (onActualizar) onActualizar();
  };

  const handleVerDocumento = (documentoId: string) => {
    setDocumentoViendoId(documentoId);
    setVisorAbierto(true);
  };

  const cerrarVisor = () => {
    setVisorAbierto(false);
    setDocumentoViendoId(null);
  };

  const obtenerIconoTipo = (tipo: typeof TipoDocumento[keyof typeof TipoDocumento]) => {
    switch (tipo) {
      case TipoDocumento.RECIBO_PAGO: return '💵';
      case TipoDocumento.CONSENTIMIENTO_INFORMADO: return '📋';
      case TipoDocumento.REPORTE_SESION: return '📊';
      case TipoDocumento.CONFIRMACION_CITA: return '📅';
      default: return '📄';
    }
  };
  return (
    <div className="space-y-4">
      {/* Información general */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información general</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fecha de nacimiento:</span>
            <p className="font-medium text-gray-900">{formatearFecha(paciente.fechaNacimiento)}</p>
          </div>
          {paciente.profesion && (
            <div>
              <span className="text-gray-600">Profesión:</span>
              <p className="font-medium text-gray-900">{paciente.profesion}</p>
            </div>
          )}
          {paciente.direccion && (
            <div className="md:col-span-2">
              <span className="text-gray-600">Dirección:</span>
              <p className="font-medium text-gray-900">{paciente.direccion}</p>
            </div>
          )}
        </div>

        {/* Alergias y medicamentos */}
        {(paciente.alergias.length > 0 || paciente.medicamentos.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {paciente.alergias.length > 0 && (
              <div className="mb-3">
                <span className="text-gray-600 text-sm">Alergias:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {paciente.alergias.map((alergia, idx) => (
                    <span key={idx} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                      {alergia}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {paciente.medicamentos.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Medicamentos:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {paciente.medicamentos.map((med, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contacto de emergencia */}
        {paciente.contactoEmergencia && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-gray-600 text-sm">Contacto de emergencia:</span>
            <p className="font-medium text-gray-900 mt-1">
              {paciente.contactoEmergencia.nombre} ({paciente.contactoEmergencia.relacion})
              <a href={`tel:${paciente.contactoEmergencia.telefono}`} className="text-saludvalpa-blue hover:underline ml-2">
                📞 {paciente.contactoEmergencia.telefono}
              </a>
            </p>
          </div>
        )}
      </Card>

      {/* Historial médico */}
      {(paciente.motivoConsulta || paciente.historialMedico) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial clínico</h3>
          {paciente.motivoConsulta && (
            <div className="mb-4">
              <span className="text-gray-600 text-sm">Motivo de consulta:</span>
              <p className="text-gray-900 mt-1">{paciente.motivoConsulta}</p>
            </div>
          )}
          {paciente.historialMedico && (
            <div>
              <span className="text-gray-600 text-sm">Historial médico:</span>
              <p className="text-gray-900 mt-1">{paciente.historialMedico}</p>
            </div>
          )}
        </Card>
      )}

      {/* Historial de sesiones */}
      <HistorialSesiones paciente={paciente} />

      {/* Rutinas de Ejercicios - Solo para Fisioterapia */}
      {configuracion?.profesion === TipoProfesion.FISIOTERAPIA && (
        <Suspense fallback={
          <Card className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saludvalpa-blue"></div>
            </div>
          </Card>
        }>
          <RutinasPaciente paciente={paciente} />
        </Suspense>
      )}

      {/* Documentos organizados */}
      <DocumentosOrganizados
        pacienteId={paciente.id}
        especialidad={paciente.profesionPrincipal}
        onGenerarDocumento={onIniciarConsultaSinMarcador}
        modoCompacto={false}
      />


      {/* Modales para generar documentos (mantenidos para compatibilidad) */}
      <Modal
        isOpen={modalDocumento === 'recibo'}
        onClose={cerrarModal}
        title="Generar recibo de pago"
        size="lg"
      >
        <GenerarRecibo
          paciente={paciente}
          onExito={cerrarModal}
          onCancelar={cerrarModal}
        />
      </Modal>

      <Modal
        isOpen={modalDocumento === 'consentimiento'}
        onClose={cerrarModal}
        title="Generar consentimiento informado"
        size="xl"
      >
        <GenerarConsentimiento
          paciente={paciente}
          onExito={cerrarModal}
          onCancelar={cerrarModal}
        />
      </Modal>

      <Modal
        isOpen={modalDocumento === 'hoja'}
        onClose={cerrarModal}
        title="Generar documento personalizado"
        size="lg"
      >
        <GenerarHojaBlanco
          paciente={paciente}
          onExito={cerrarModal}
          onCancelar={cerrarModal}
        />
      </Modal>

      {/* Acciones */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {(onIniciarConsultaConMarcador || onIniciarConsultaSinMarcador) && (
              <div className="flex-1 space-y-2">
                <Button
                  variant="primary"
                  onClick={onIniciarConsultaConMarcador}
                  className="w-full"
                >
                  ⏱️ Consulta con marcador de tiempo
                </Button>
                <Button
                  variant="secondary"
                  onClick={onIniciarConsultaSinMarcador}
                  className="w-full"
                >
                  📝 Consulta sin marcador de tiempo
                </Button>
              </div>
            )}
            {onEliminar && (
              <Button variant="danger" onClick={onEliminar}>
                🗑️ Eliminar paciente
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Selecciona el tipo de consulta que deseas iniciar
          </p>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// MODO CONSULTA
// ============================================================================

const ModoConsulta = ({
  onVolverRevision,
  onIniciarConsultaConMarcador,
  onIniciarConsultaSinMarcador
}: {
  onVolverRevision: () => void;
  onIniciarConsultaConMarcador?: () => void;
  onIniciarConsultaSinMarcador?: () => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Header limpio y profesional */}
      <Card className="p-6 bg-gradient-to-br from-saludvalpa-blue/5 to-saludvalpa-teal/5 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">🏥</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl">Modo Consulta</h3>
            <p className="text-sm text-gray-600">
              Interfaz profesional para registrar consultas en tiempo real
            </p>
          </div>
        </div>

        {/* Explicación principal */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Selecciona el tipo de consulta</h4>
          <p className="text-gray-600 text-sm mb-4">
            Elige entre una consulta con temporizador para sesiones cronometradas o una consulta
            simple para registros rápidos sin seguimiento de tiempo.
          </p>
        </div>

        {/* Opciones de consulta - Diseño limpio */}
        <div className="space-y-4">
          {/* Consulta con marcador de tiempo */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-saludvalpa-blue transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saludvalpa-lime to-saludvalpa-green rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-white">⏱️</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-gray-900 mb-1">Consulta con marcador de tiempo</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Ideal para sesiones que requieren seguimiento de duración, facturación por tiempo
                  o evaluación de progreso. Incluye temporizador integrado y registro automático de duración.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-lime rounded-full"></span>
                    Temporizador visual
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-lime rounded-full"></span>
                    Registro automático
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-lime rounded-full"></span>
                    Facturación por tiempo
                  </span>
                </div>
              </div>
              <button
                onClick={onIniciarConsultaConMarcador}
                className="bg-gradient-to-r from-saludvalpa-lime to-saludvalpa-green text-white px-5 py-2.5 rounded-lg hover:opacity-90 font-medium transition-all shadow-sm hover:shadow"
              >
                Iniciar
              </button>
            </div>
          </div>

          {/* Consulta sin marcador de tiempo */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-saludvalpa-blue transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-white">📝</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-gray-900 mb-1">Consulta sin marcador de tiempo</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Perfecta para consultas rápidas, seguimientos breves o registros donde el tiempo
                  no es un factor crítico. Mantiene todas las funcionalidades excepto el temporizador.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-blue rounded-full"></span>
                    Notas clínicas completas
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-blue rounded-full"></span>
                    Materiales y medios
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-saludvalpa-blue rounded-full"></span>
                    Datos específicos
                  </span>
                </div>
              </div>
              <button
                onClick={onIniciarConsultaSinMarcador}
                className="bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal text-white px-5 py-2.5 rounded-lg hover:opacity-90 font-medium transition-all shadow-sm hover:shadow"
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>

        {/* Características comunes */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h6 className="font-medium text-gray-700 mb-3 text-sm">Ambas opciones incluyen:</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-saludvalpa-blue">✏️</span>
              <span className="text-xs font-medium">Notas SOAP</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-saludvalpa-blue">💊</span>
              <span className="text-xs font-medium">Materiales</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-saludvalpa-blue">🔧</span>
              <span className="text-xs font-medium">Medios físicos</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-saludvalpa-blue">📊</span>
              <span className="text-xs font-medium">Datos específicos</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Sección de historial mejorada */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">📚 Historial de consultas</h3>
            <p className="text-sm text-gray-600">Consulta sesiones anteriores y genera reportes</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Ver todas
            </button>
            <button className="text-xs px-3 py-1.5 bg-saludvalpa-blue/10 text-saludvalpa-blue rounded-lg hover:bg-saludvalpa-blue/20">
              Exportar
            </button>
          </div>
        </div>
        
        <div className="text-center py-10">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <span className="text-3xl text-gray-400">📋</span>
          </div>
          <h4 className="font-medium text-gray-700 mb-2">No hay consultas registradas</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Inicia tu primera consulta para comenzar a construir el historial médico del paciente.
            Todas las consultas se guardarán automáticamente y podrán exportarse como PDF.
          </p>
        </div>
      </Card>

      {/* Botón volver - diseño mejorado */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onVolverRevision}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ← Volver a modo revisión
        </Button>
        <button className="px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          🆘 Ayuda
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// HISTORIAL DE SESIONES
// ============================================================================

const HistorialSesiones = ({ paciente }: { paciente: Paciente }) => {
  const { obtenerSesionesPaciente } = useSesiones();
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const sesionesPaciente = await obtenerSesionesPaciente(paciente.id);
        setSesiones(sesionesPaciente);
      } catch (error) {
        console.error('Error al cargar sesiones:', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [paciente.id, obtenerSesionesPaciente]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historial de sesiones</h3>
        <span className="bg-saludvalpa-blue text-white px-3 py-1 rounded-full text-sm font-medium">
          {sesiones.length}
        </span>
      </div>

      {cargando ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Cargando...</p>
        </div>
      ) : sesiones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">📋</span>
          <p className="text-sm">No hay sesiones registradas</p>
          <p className="text-xs mt-1 text-gray-400">Inicia tu primera sesión desde el modo Ejecución</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sesiones.slice(0, 5).map((sesion) => (
            <div
              key={sesion.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-saludvalpa-blue transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{sesion.tipo}</span>
                    {sesion.duracion && (
                      <span className="text-xs text-gray-500">• {sesion.duracion} min</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatearFecha(sesion.fecha)}
                  </p>
                  {sesion.notas && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {sesion.notas}
                    </p>
                  )}
                </div>
                {sesion.costo && sesion.costo > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-saludvalpa-blue">
                      ${sesion.costo.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Materiales y medios si existen */}
              <div className="mt-3 flex flex-wrap gap-2">
                {sesion.materialesUtilizados && sesion.materialesUtilizados.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-600">💊 Materiales:</span>
                    <span className="ml-1 text-gray-900">
                      {sesion.materialesUtilizados.length}
                    </span>
                  </div>
                )}
                {sesion.mediosFisicos && sesion.mediosFisicos.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-600">🔧 Medios:</span>
                    <span className="ml-1 text-gray-900">
                      {sesion.mediosFisicos.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {sesiones.length > 5 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              + {sesiones.length - 5} sesiones más
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default TarjetaPaciente;
