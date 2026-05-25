// ============================================================================
// saludvalpa 3.0 - DASHBOARD
// ============================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db/database';
import { useAppStore } from '../stores/appStore';
import { useEconomia } from '../hooks/useEconomia';
import { formatearMoneda } from '../utils/helpers';
import { startOfMonth, endOfMonth } from 'date-fns';

// Componentes mejorados
import SpecialtyWelcome from '../components/SpecialtyWelcome';
import ProgressTracker from '../components/ProgressTracker';
import InteractiveTour from '../components/InteractiveTour';
import FeatureUnlockModal from '../components/FeatureUnlockModal';
import ContextualHelp from '../components/ContextualHelp';

const Dashboard = () => {
  const { configuracion, licencia, onboardingStep } = useAppStore();
  const { calcularEstadisticas: calcularEstadisticasEconomia } = useEconomia();
  const [stats, setStats] = useState({
    pacientes: 0,
    citasHoy: 0,
    sesionesEsteMes: 0,
    ingresosEsteMes: 0,
    pendientesCobro: 0,
  });
  const [citasHoyLista, setCitasHoyLista] = useState<any[]>([]);
  const [pacientesCitasHoy, setPacientesCitasHoy] = useState<Record<string, any>>({});
  const [showProgress, setShowProgress] = useState(true);
  const [showSpecialtyWelcome, setShowSpecialtyWelcome] = useState(false);
  const [showFeatureUnlock, setShowFeatureUnlock] = useState(false);
  const [showInteractiveTour, setShowInteractiveTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Verificar si es la primera visita después del onboarding
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('dashboard_visited');
    if (!hasVisitedBefore && onboardingStep === 'complete') {
      setIsFirstVisit(true);
      localStorage.setItem('dashboard_visited', 'true');
      // Mostrar welcome después de un breve delay
      const timer = setTimeout(() => {
        setShowSpecialtyWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingStep]);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      const cantidadPacientes = await db.pacientes.count();
      
      // Citas de hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      
      const citasHoyArr = await db.citas
        .where('fechaHora')
        .between(hoy, manana)
        .toArray();

      // Fetch patient data for each appointment
      const pacientesMap: Record<string, any> = {};
      for (const cita of citasHoyArr) {
        if (cita.pacienteId && !pacientesMap[cita.pacienteId]) {
          const paciente = await db.pacientes.get(cita.pacienteId);
          if (paciente) {
            pacientesMap[cita.pacienteId] = paciente;
          }
        }
      }
      setCitasHoyLista(citasHoyArr);
      setPacientesCitasHoy(pacientesMap);

      // Sesiones de este mes
      const inicioMes = startOfMonth(hoy);
      const finMes = endOfMonth(hoy);
      
      const sesionesEsteMes = await db.sesiones
        .where('fecha')
        .between(inicioMes, finMes)
        .count();

      // Estadísticas económicas del mes
      const statsEconomicas = await calcularEstadisticasEconomia(inicioMes, finMes);

      setStats({
        pacientes: cantidadPacientes,
        citasHoy: citasHoyArr.length,
        sesionesEsteMes,
        ingresosEsteMes: statsEconomicas.totalIngresos,
        pendientesCobro: statsEconomicas.totalPendiente,
      });
    };

    cargarEstadisticas();
    
    // Recargar estadísticas cada 30 segundos
    const interval = setInterval(cargarEstadisticas, 30000);
    return () => clearInterval(interval);
  }, [calcularEstadisticasEconomia]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Ayuda contextual (siempre disponible) */}
      <ContextualHelp />
      
      {/* Componentes mejorados */}
      {isFirstVisit && <SpecialtyWelcome />}
      {showProgress && <ProgressTracker onClose={() => setShowProgress(false)} />}
      
      {/* Bienvenida mejorada */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              ¡Bienvenido, {configuracion?.branding.nombreProfesional || 'Profesional'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {configuracion?.profesion && (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-saludvalpa-blue-light text-saludvalpa-blue text-sm font-medium rounded-full">
                  {configuracion.profesion === 'fisioterapia' ? 'Fisioterapeuta' :
                   configuracion.profesion === 'psicologia' ? 'Psicólogo' :
                   configuracion.profesion === 'medicina_general' ? 'Médico General' :
                   configuracion.profesion === 'odontologia' ? 'Odontólogo' :
                   configuracion.profesion === 'nutricion' ? 'Nutriólogo' : 'Profesional'}
                </span>
                {isFirstVisit && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    👋 Primera visita
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/onboarding?tour=true"
              className="px-4 py-2 bg-saludvalpa-blue text-white rounded-lg hover:bg-saludvalpa-blue-dark transition-colors text-sm font-medium"
            >
              🎬 Iniciar tour
            </Link>
            <Link
              to="/app/activar-licencia"
              className="px-4 py-2 border border-saludvalpa-blue text-saludvalpa-blue rounded-lg hover:bg-saludvalpa-blue-light transition-colors text-sm font-medium"
            >
              ⭐ Ver características premium
            </Link>
          </div>
        </div>
        
        {/* Mensaje de bienvenida personalizado */}
        {isFirstVisit && (
          <div className="mt-4 p-4 bg-gradient-to-r from-saludvalpa-blue-light to-saludvalpa-teal-light rounded-xl border border-saludvalpa-blue">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="font-semibold text-gray-900">¡Bienvenido a SaludValpa!</h3>
                <p className="text-gray-700 text-sm mt-1">
                  Estamos emocionados de tenerte aquí. Tu dashboard está listo para ayudarte a gestionar tu práctica de manera eficiente.
                  {configuracion?.profesion === 'fisioterapia' && ' Comienza registrando tus primeros pacientes y creando planes de tratamiento personalizados.'}
                  {configuracion?.profesion === 'psicologia' && ' Comienza registrando tus pacientes y documentando sesiones terapéuticas.'}
                  {configuracion?.profesion === 'medicina_general' && ' Comienza registrando pacientes y generando recetas médicas.'}
                  {configuracion?.profesion === 'odontologia' && ' Comienza registrando pacientes y utilizando el odontograma interactivo.'}
                  {configuracion?.profesion === 'nutricion' && ' Comienza registrando pacientes y creando planes alimenticios personalizados.'}
                </p>
                <div className="flex gap-3 mt-3">
                  <Link
                    to="/onboarding?tour=true"
                    className="px-3 py-1.5 bg-saludvalpa-blue text-white rounded-lg text-xs font-medium hover:bg-saludvalpa-blue-dark"
                  >
                    Tomar tour guiado
                  </Link>
                  <Link
                    to="/pacientes?action=nuevo"
                    className="px-3 py-1.5 border border-saludvalpa-blue text-saludvalpa-blue rounded-lg text-xs font-medium hover:bg-saludvalpa-blue-light"
                  >
                    Registrar primer paciente
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerta de licencia si está en versión gratuita */}
      {licencia?.tipo === 'gratuita' && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Versión gratuita</h3>
              <p className="text-sm text-orange-700 mt-1">
                Te quedan {licencia.diasRestantes || 0} días de prueba. 
                Máximo {licencia.limitePacientes} pacientes.
              </p>
              <Link
                to="/app/activar-licencia"
                className="inline-block mt-2 text-sm font-medium text-saludvalpa-blue hover:underline"
              >
                Activar licencia completa →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link 
          to="/pacientes"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pacientes</p>
              <p className="text-3xl font-bold text-saludvalpa-blue mt-1">{stats.pacientes}</p>
              {licencia?.limitePacientes && (
                <p className="text-xs text-gray-500 mt-1">
                  de {licencia.limitePacientes} permitidos
                </p>
              )}
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Citas hoy</p>
              <p className="text-3xl font-bold text-saludvalpa-teal mt-1">{stats.citasHoy}</p>
            </div>
            <span className="text-4xl">📅</span>
          </div>
          {citasHoyLista.length > 0 ? (
            <div className="space-y-2 mt-2 border-t border-gray-100 pt-3">
              {citasHoyLista.map(cita => {
                const paciente = pacientesCitasHoy[cita.pacienteId];
                return (
                  <div key={cita.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      {paciente ? (
                        <Link
                          to={`/app/pacientes/${cita.pacienteId}`}
                          className="font-medium text-saludvalpa-teal hover:underline truncate"
                        >
                          {paciente.nombre} {paciente.apellidos}
                        </Link>
                      ) : (
                        <span className="text-gray-500 truncate">Paciente #{cita.pacienteId}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • {cita.tipo}
                    </div>
                  </div>
                );
              })}
              <Link
                to="/agenda"
                className="block text-center text-xs text-saludvalpa-blue hover:underline pt-2 border-t border-gray-100 mt-2"
              >
                Ver todas en agenda →
              </Link>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">No hay citas programadas para hoy</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sesiones este mes</p>
              <p className="text-3xl font-bold text-saludvalpa-lime mt-1">{stats.sesionesEsteMes}</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>

        <Link 
          to="/economia"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos este mes</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {formatearMoneda(stats.ingresosEsteMes)}
              </p>
              {stats.pendientesCobro > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {formatearMoneda(stats.pendientesCobro)} pendientes
                </p>
              )}
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </Link>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/pacientes?action=nuevo"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-saludvalpa-blue hover:bg-saludvalpa-blue-light transition-colors"
          >
            <span className="text-3xl">➕</span>
            <span className="text-sm font-medium text-gray-700">Nuevo paciente</span>
          </Link>

          <Link
            to="/agenda?action=nueva-cita"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-saludvalpa-teal hover:bg-saludvalpa-blue-light transition-colors"
          >
            <span className="text-3xl">📅</span>
            <span className="text-sm font-medium text-gray-700">Nueva cita</span>
          </Link>

          <Link
            to="/documentos"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="text-3xl">📄</span>
            <span className="text-sm font-medium text-gray-700">Generar PDF</span>
          </Link>

          <Link
            to="/configuracion?tab=respaldos"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-saludvalpa-lime hover:bg-saludvalpa-blue-light transition-colors"
          >
            <span className="text-3xl">💾</span>
            <span className="text-sm font-medium text-gray-700">Respaldar datos</span>
          </Link>
        </div>
      </div>

      {/* Información de versión */}
      <div className="mt-6 text-center text-xs text-gray-500">
        SaludValpa v1.0.0 - {licencia?.tipo === 'gratuita' ? 'Versión gratuita' : 'Licencia activa'}
      </div>
    </div>
  );
};

export default Dashboard;
