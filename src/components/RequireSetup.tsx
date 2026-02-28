// ============================================================================
// saludvalpa 3.0 - REQUIRE SETUP
// Componente que verifica que el onboarding esté completo
// ============================================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

const RequireSetup = () => {
  const { configuracion, isLoading, isInitialized } = useAppStore();

  // Mientras carga la app por primera vez
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saludvalpa-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no existe configuración O no está completo el onboarding, redirigir
  // Usamos la misma lógica que App.tsx: configuracion?.profesion !== undefined
  if (configuracion?.profesion === undefined) {
    console.log('🔀 RequireSetup: Redirigiendo a onboarding (profesion no definida)');
    console.log('🔀 Configuración actual:', configuracion);
    return <Navigate to="/onboarding" replace />;
  }

  // Si todo está bien, renderizar las rutas protegidas
  console.log('✅ RequireSetup: Configuración OK, mostrando app');
  console.log('✅ Profesión configurada:', configuracion.profesion);
  return <Outlet />;
};

export default RequireSetup;
