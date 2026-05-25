// ============================================================================
// saludvalpa 3.0 - TARJETA DE PACIENTE
// Componente con modo dual: Revisión / Ejecución
// ============================================================================

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Paciente } from '../types';
import { TipoDocumento, TipoProfesion } from '../types';
import { formatearFecha, obtenerIniciales } from '../utils/helpers';
import { descargarDocumento } from '../services/pdfService';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import GenerarRecibo from './common/GenerarRecibo';
import GenerarConsentimiento from './common/GenerarConsentimiento';
import GenerarHojaBlanco from './common/GenerarHojaBlanco';
import VisorPDF from './common/VisorPDF';
import SesionEnVivo from './SesionEnVivo';
import HistorialClinicoPaciente from './HistorialClinicoPaciente';
import { useAppStore } from '../stores/appStore';
import { useSesiones } from '../hooks/useSesiones';

// Lazy load del componente de rutinas (solo para fisioterapia)
const RutinasPaciente = lazy(() => import('../modules/fisioterapia/rutinas/RutinasPaciente'));

interface TarjetaPacienteProps {
  paciente: Paciente;
  onEditar?: () => void;
  onEliminar?: () => void;
  onActualizar?: () => void;
  onAbrirModalSesion?: () => void;
}

type Modo = 'revision' | 'ejecucion';

const TarjetaPaciente = ({ paciente, onEditar, onEliminar, onActualizar, onAbrirModalSesion }: TarjetaPacienteProps) => {
  const [modo, setModo] = useState<Modo>('revision');
  const [sesionActiva, setSesionActiva] = useState(false);
  const { configuracion } = useAppStore();

  const iniciarSesionEnVivo = () => {
    setModo('ejecucion');
    // Si hay un callback para abrir el modal de tipo de sesión, usarlo
    // El modal se maneja desde PerfilPaciente (padre)
    if (onAbrirModalSesion) {
      onAbrirModalSesion();
    } else {
      // Fallback: ir directo a SesionEnVivo (sin modal de selección)
      setSesionActiva(true);
    }
  };

  const cerrarSesion = () => {
    setSesionActiva(false);
    setModo('revision');
  };

  // Si hay una sesión activa en modo ejecución, mostrar SesionEnVivo
  if (sesionActiva && modo === 'ejecucion') {
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
              onClick={() => setModo('ejecucion')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                modo === 'ejecucion'
                  ? 'bg-white text-saludvalpa-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏃 Ejecución
            </button>
          </div>
        </div>
      </Card>

      {/* Contenido según modo */}
      {modo === 'revision' ? (
        <ModoRevision 
          paciente={paciente} 
          onIniciarSesion={iniciarSesionEnVivo} 
          onEliminar={onEliminar}
          onActualizar={onActualizar}
        />
      ) : (
        <ModoEjecucion
          paciente={paciente}
          onVolverRevision={() => setModo('revision')}
          onIniciarSesion={iniciarSesionEnVivo}
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
  onIniciarSesion,
  onEliminar,
  onActualizar
}: { 
  paciente: Paciente; 
  onIniciarSesion?: () => void;
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

      {/* Historial clínico - Diagnósticos y signos vitales */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Historial clínico</h3>
        <HistorialClinicoPaciente
          pacienteId={paciente.id}
          profesion={configuracion?.profesion}
          motivoConsulta={paciente.motivoConsulta}
        />
      </Card>

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

      {/* Documentos generados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documentos generados</h3>
          <details className="relative">
            <summary className="bg-saludvalpa-blue text-white px-3 py-1 rounded-lg cursor-pointer list-none text-sm">
              ➕ Nuevo
            </summary>
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10 min-w-48">
              <button
                onClick={() => setModalDocumento('recibo')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                💵 Recibo
              </button>
              <button
                onClick={() => setModalDocumento('consentimiento')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-t text-sm"
              >
                📋 Consentimiento
              </button>
              <button
                onClick={() => setModalDocumento('hoja')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-t text-sm"
              >
                📄 Hoja
              </button>
            </div>
          </details>
        </div>

        {!documentos || documentos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📄</span>
            <p className="text-sm">No hay documentos generados</p>
            <p className="text-xs mt-2">Click en "➕ Nuevo" para generar un documento</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-saludvalpa-blue transition-colors"
              >
                <span className="text-2xl">{obtenerIconoTipo(doc.tipo)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {doc.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatearFecha(doc.fechaCreacion)}
                    {doc.firmado && <span className="ml-2 text-green-600">✍️ Firmado</span>}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleVerDocumento(doc.id)}
                    className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors text-sm"
                    title="Ver PDF"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDescargar(doc.id)}
                    className="text-saludvalpa-blue hover:bg-saludvalpa-blue-light p-2 rounded-lg transition-colors text-sm"
                    title="Descargar"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modales para generar documentos */}
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

        {/* Modal para visualizar PDF */}
        <Modal
          isOpen={visorAbierto}
          onClose={cerrarVisor}
          title=""
          size="xl"
        >
          {documentoViendoId && (
            <VisorPDF
              documentoId={documentoViendoId}
              onCerrar={cerrarVisor}
              permitirDescarga={true}
              permitirImpresion={true}
            />
          )}
        </Modal>
      </Card>

      {/* Historial de sesiones */}
      <HistorialSesiones paciente={paciente} />

      {/* Acciones */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-3">
          {onEliminar && (
            <Button variant="danger" onClick={onEliminar}>
              🗑️ Eliminar paciente
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// MODO EJECUCIÓN
// ============================================================================

const ModoEjecucion = ({
  paciente,
  onVolverRevision,
  onIniciarSesion
}: {
  paciente: Paciente;
  onVolverRevision: () => void;
  onIniciarSesion: () => void;
}) => {
  const { configuracion } = useAppStore();
  const [sesionActiva, setSesionActiva] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Temporizador: se activa cuando sesionActiva es true
  useEffect(() => {
    if (sesionActiva) {
      intervalRef.current = window.setInterval(() => {
        setSegundos(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sesionActiva]);

  const formatearTiempo = (s: number): string => {
    const horas = Math.floor(s / 3600);
    const minutos = Math.floor((s % 3600) / 60);
    const segs = s % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleIniciarSesion = () => {
    // Llamar al callback del padre para abrir el modal de tipo de sesión
    // El padre (PerfilPaciente) manejará la creación de la sesión real
    onIniciarSesion();
  };

  const handlePausarReanudar = () => {
    setSesionActiva(prev => !prev);
  };

  return (
    <div className="space-y-4">
      {/* Grid superior: Info del paciente + Temporizador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card izquierda: Información del paciente + Iniciar Sesión */}
        <Card className="p-6 bg-gradient-to-r from-saludvalpa-blue-light to-saludvalpa-green-light border-2 border-saludvalpa-blue">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">👤</span>
            <div className="flex-1">
              <h3 className="font-bold text-saludvalpa-blue text-lg">Iniciar Sesión</h3>
              <p className="text-sm text-gray-700">
                Comienza una nueva consulta
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-base mb-1">
                {paciente.nombre} {paciente.apellidos}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                {paciente.edad} años
              </p>
              <p className="text-gray-500 text-sm mb-4">
                📞 {paciente.telefono}
              </p>

              <button
                onClick={handleIniciarSesion}
                className="w-full bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-saludvalpa-blue-dark font-bold text-base shadow-lg hover:shadow-xl transition-all"
              >
                ▶️ Iniciar Sesión
              </button>
            </div>
          </div>
        </Card>

        {/* Card derecha: Temporizador */}
        <Card className="p-6 bg-gradient-to-r from-saludvalpa-blue-light to-saludvalpa-green-light border-2 border-saludvalpa-blue">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⏱️</span>
            <div className="flex-1">
              <h3 className="font-bold text-saludvalpa-blue text-lg">Sesión en vivo</h3>
              <p className="text-sm text-gray-700">
                Tiempo y controles de la sesión
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            {sesionActiva ? (
              <div className="text-center">
                <div className="inline-block p-3 bg-saludvalpa-blue-light rounded-full mb-3">
                  <span className="text-3xl">🔴</span>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  Sesión en curso
                </h4>
                <div className="text-3xl font-mono font-bold text-saludvalpa-teal mb-4">
                  {formatearTiempo(segundos)}
                </div>
                <button
                  onClick={handlePausarReanudar}
                  className="w-full px-4 py-2 rounded-lg font-medium text-sm transition-all border border-gray-300 hover:bg-gray-100"
                >
                  ⏸ Pausar
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
                  <span className="text-3xl">⏸️</span>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  Sin sesión activa
                </h4>
                <p className="text-gray-500 text-sm">
                  Inicia una sesión desde la card izquierda para ver el temporizador aquí
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Última sesión */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Última sesión</h3>
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">📋</span>
          <p className="text-sm">No hay sesiones registradas aún</p>
          <p className="text-xs mt-1 text-gray-400">Inicia tu primera sesión arriba</p>
        </div>
      </Card>

      {/* Botón volver */}
      <Card className="p-6">
        <Button variant="outline" onClick={onVolverRevision} className="w-full">
          ← Volver a modo revisión
        </Button>
      </Card>
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
