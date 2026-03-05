// ============================================================================
// saludvalpa 3.0 - Configuración Redirection Component
// Redirige automáticamente desde configuraciones antiguas a la unificada
// basado en feature flags y estado de migración
// ============================================================================

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';

interface ConfigRedirectionProps {
  children?: React.ReactNode;
}

/**
 * Componente que maneja la redirección automática desde configuraciones antiguas
 * a la configuración unificada basado en feature flags.
 * 
 * Se usa como wrapper en rutas o como componente independiente.
 */
export const ConfigRedirection: React.FC<ConfigRedirectionProps> = ({ children }) => {
  const location = useLocation();
  const { 
    configuracion, 
    isFeatureEnabled,
    cargarFeatureFlags 
  } = useAppStore();
  
  // Cargar feature flags al montar
  useEffect(() => {
    cargarFeatureFlags();
  }, [cargarFeatureFlags]);
  
  // Determinar si debemos redirigir
  const shouldRedirect = (): boolean => {
    // Verificar si el feature flag de redirección automática está habilitado
    const autoRedirectEnabled = isFeatureEnabled('enableAutoRedirect');
    
    if (!autoRedirectEnabled) {
      return false;
    }
    
    // Verificar si estamos en una ruta de configuración antigua
    const isOldConfigRoute = 
      location.pathname.includes('/app/configuracion') && 
      !location.pathname.includes('/app/configuracion-unificada') &&
      !location.pathname.includes('/app/configuracion-avanzada');
    
    const isOldAdvancedConfigRoute = 
      location.pathname.includes('/app/configuracion-avanzada');
    
    return isOldConfigRoute || isOldAdvancedConfigRoute;
  };
  
  // Determinar a dónde redirigir
  const getRedirectPath = (): string => {
    const { pathname, search, hash } = location;
    
    // Mapear rutas antiguas a pestañas específicas en la configuración unificada
    if (pathname.includes('/app/configuracion-avanzada')) {
      // Redirigir a la pestaña "avanzada" de la configuración unificada
      return `/app/configuracion-unificada?tab=avanzada${search}${hash}`;
    }
    
    // Para configuración básica, redirigir a la pestaña "general"
    return `/app/configuracion-unificada?tab=general${search}${hash}`;
  };
  
  // Si debemos redirigir, hacerlo
  if (shouldRedirect()) {
    const redirectPath = getRedirectPath();
    console.log(`🔀 ConfigRedirection: Redirigiendo de ${location.pathname} a ${redirectPath}`);
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // Si no hay redirección, renderizar children o null
  return children ? <>{children}</> : null;
};

/**
 * Hook para usar la lógica de redirección en componentes personalizados
 */
export const useConfigRedirection = () => {
  const location = useLocation();
  const { isFeatureEnabled, cargarFeatureFlags } = useAppStore();
  
  // Cargar feature flags al usar el hook
  useEffect(() => {
    cargarFeatureFlags();
  }, [cargarFeatureFlags]);
  
  const checkRedirection = () => {
    const autoRedirectEnabled = isFeatureEnabled('enableAutoRedirect');
    
    if (!autoRedirectEnabled) {
      return { shouldRedirect: false, redirectPath: '' };
    }
    
    const isOldConfigRoute = 
      location.pathname.includes('/app/configuracion') && 
      !location.pathname.includes('/app/configuracion-unificada') &&
      !location.pathname.includes('/app/configuracion-avanzada');
    
    const isOldAdvancedConfigRoute = 
      location.pathname.includes('/app/configuracion-avanzada');
    
    if (!isOldConfigRoute && !isOldAdvancedConfigRoute) {
      return { shouldRedirect: false, redirectPath: '' };
    }
    
    let redirectPath = '/app/configuracion-unificada';
    
    if (isOldAdvancedConfigRoute) {
      redirectPath += '?tab=avanzada';
    } else {
      redirectPath += '?tab=general';
    }
    
    // Preservar query parameters y hash
    const { search, hash } = location;
    if (search && !redirectPath.includes('?')) {
      redirectPath += search;
    } else if (search) {
      // Ya hay query parameters, agregar con &
      redirectPath += search.replace('?', '&');
    }
    
    redirectPath += hash;
    
    return { 
      shouldRedirect: true, 
      redirectPath,
      sourcePath: location.pathname
    };
  };
  
  return { checkRedirection };
};

/**
 * Componente para redirigir desde rutas específicas
 */
export const OldConfigRedirect: React.FC<{ type?: 'basic' | 'advanced' }> = ({ type = 'basic' }) => {
  const location = useLocation();
  const { search, hash } = location;
  
  const tab = type === 'advanced' ? 'avanzada' : 'general';
  const redirectPath = `/app/configuracion-unificada?tab=${tab}${search}${hash}`;
  
  console.log(`🔀 OldConfigRedirect: Redirigiendo configuración ${type} a ${redirectPath}`);
  
  return <Navigate to={redirectPath} replace />;
};

/**
 * Componente de redirección condicional basado en feature flags
 */
export const ConditionalConfigRedirect: React.FC = () => {
  const { checkRedirection } = useConfigRedirection();
  const { shouldRedirect, redirectPath } = checkRedirection();
  
  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return null;
};

export default ConfigRedirection;