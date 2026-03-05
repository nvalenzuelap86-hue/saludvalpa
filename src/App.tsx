// ============================================================================
// saludvalpa 3.0 - MAIN APP
// ============================================================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { inicializarDB } from './db/database';
import { useAppStore } from './stores/appStore';

// Páginas
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import PerfilPaciente from './pages/PerfilPaciente';
import Agenda from './pages/Agenda';
import Economia from './pages/Economia';
import Biblioteca from './pages/Biblioteca';
import Documentos from './pages/Documentos';
import Configuracion from './pages/Configuracion';
import ConfiguracionAvanzada from './pages/ConfiguracionAvanzada';
import ConfiguracionUnificada from './pages/ConfiguracionUnificada';
import ActivarLicencia from './pages/ActivarLicencia';
import Onboarding from './pages/Onboarding';
import AcercaDeSaludValpa from './pages/AcercaDeSaludValpa';
import InstalacionPWA from './pages/InstalacionPWA';

// Componentes de redirección
import { ConfigRedirection, OldConfigRedirect } from './components/configuracion/ConfigRedirection';

// Módulos de fisioterapia (será reemplazado por sistema dinámico en Fase 2)
import GestionRutinas from './modules/fisioterapia/rutinas/GestionRutinas';

// Layout y protección
import Layout from './components/Layout';
import RequireSetup from './components/RequireSetup';

// Componente para redirigir pacientes con parámetros
const RedirectPaciente = () => {
  const { id } = useParams<{ id: string }>();
  console.log('🔀 RedirectPaciente: Redirigiendo paciente ID:', id);
  return <Navigate to={`/app/pacientes/${id}`} replace />;
};

function App() {
  const { cargarConfiguracion, isLoading, isInitialized, configuracion } = useAppStore();

  useEffect(() => {
    // Inicializar la base de datos al montar la app
    const init = async () => {
      try {
        await inicializarDB();
        await cargarConfiguracion();

        // Inicializar sistema de recordatorios
        const { inicializarRecordatorios } = await import('./services/recordatoriosService');
        await inicializarRecordatorios();
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
      }
    };

    init();
  }, [cargarConfiguracion]);

  // Pantalla de carga mientras se inicializa
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">saludvalpa</h2>
          <p className="text-sm opacity-90">Tu movimiento, nuestra ciencia</p>
        </div>
      </div>
    );
  }

  // Determinar la ruta inicial basada en el estado de onboarding
  // Usar un enfoque más robusto que maneje mejor el estado de carga
  const isOnboardingCompleted = configuracion?.profesion !== undefined;
  
  // Debug logging para diagnóstico
  console.log('🔍 App.tsx - Estado de redirección:', {
    isLoading,
    isInitialized,
    hasConfig: !!configuracion,
    configProfesion: configuracion?.profesion,
    isOnboardingCompleted,
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta pública: Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Ruta pública: Acerca de SaludValpa */}
        <Route path="/acerca-de-saludvalpa" element={<AcercaDeSaludValpa />} />
        
        {/* Ruta pública: Instalación PWA */}
        <Route path="/instalacion-pwa" element={<InstalacionPWA />} />

        {/* Rutas protegidas: Requieren onboarding completo */}
        <Route element={<RequireSetup />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="pacientes/:id" element={<PerfilPaciente />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="economia" element={<Economia />} />
            <Route path="biblioteca" element={<Biblioteca />} />
            <Route path="rutinas" element={<GestionRutinas />} />
            <Route path="documentos" element={<Documentos />} />
            
            {/* Rutas de configuración con redirección automática basada en feature flags */}
            <Route path="configuracion" element={
              <ConfigRedirection>
                <Configuracion />
              </ConfigRedirection>
            } />
            <Route path="configuracion-avanzada" element={
              <ConfigRedirection>
                <ConfiguracionAvanzada />
              </ConfigRedirection>
            } />
            <Route path="configuracion-unificada" element={<ConfiguracionUnificada />} />
            <Route path="activar-licencia" element={<ActivarLicencia />} />
          </Route>
        </Route>

        {/* Redirección para rutas antiguas */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/pacientes" element={<Navigate to="/app/pacientes" replace />} />
        <Route path="/pacientes/:id" element={<RedirectPaciente />} />
        <Route path="/agenda" element={<Navigate to="/app/agenda" replace />} />
        <Route path="/economia" element={<Navigate to="/app/economia" replace />} />
        <Route path="/biblioteca" element={<Navigate to="/app/biblioteca" replace />} />
        <Route path="/rutinas" element={<Navigate to="/app/rutinas" replace />} />
        <Route path="/documentos" element={<Navigate to="/app/documentos" replace />} />
        
        {/* Redirección externa de configuración con soporte para feature flags */}
        <Route path="/configuracion" element={
          <ConfigRedirection>
            <Navigate to="/app/configuracion" replace />
          </ConfigRedirection>
        } />
        <Route path="/configuracion-avanzada" element={
          <ConfigRedirection>
            <Navigate to="/app/configuracion-avanzada" replace />
          </ConfigRedirection>
        } />

        {/* Redirección inteligente basada en estado de onboarding */}
        {/* Mejorada: Solo redirigir cuando estamos seguros del estado */}
        <Route
          path="*"
          element={
            // Si todavía estamos cargando, no redirigir (ya se muestra pantalla de carga)
            isLoading || !isInitialized ? (
              <div className="min-h-screen bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">saludvalpa</h2>
                  <p className="text-sm opacity-90">Cargando redirección...</p>
                </div>
              </div>
            ) : isOnboardingCompleted ? (
              <Navigate to="/app/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
