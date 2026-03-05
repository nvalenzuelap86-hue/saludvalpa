// ============================================================================
// saludvalpa 3.0 - USE CONFIGURACION
// Hook personalizado para lógica de configuración unificada
// ============================================================================

import { useAppStore } from '../stores/appStore';
import { useLicenseCheck } from '../components/configuracion/LicenseGate';
import type { Configuracion } from '../types';

/**
 * Hook personalizado para manejar la lógica de configuración unificada
 */
export const useConfiguracion = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();
  const { hasAccess, getFeaturePermissions } = useLicenseCheck();

  /**
   * Actualiza un campo específico de la configuración
   */
  const updateField = <K extends keyof Configuracion>(
    field: K,
    value: Configuracion[K]
  ) => {
    if (!configuracion) return;
    
    actualizarConfiguracion({
      [field]: value
    } as Partial<Configuracion>);
  };

  /**
   * Actualiza un campo anidado dentro de la configuración
   */
  const updateNestedField = <
    T extends keyof Configuracion,
    K extends keyof Configuracion[T]
  >(
    section: T,
    field: K,
    value: Configuracion[T][K]
  ) => {
    if (!configuracion) return;
    
    const sectionData = configuracion[section];
    if (typeof sectionData !== 'object' || sectionData === null) return;
    
    actualizarConfiguracion({
      [section]: {
        ...(sectionData as object),
        [field]: value
      }
    } as Partial<Configuracion>);
  };

  /**
   * Verifica si una pestaña debe ser visible según la licencia
   */
  const isTabVisible = (tabId: string): boolean => {
    const tabVisibility = {
      'general': true, // Siempre visible
      'branding': true, // Siempre visible (con restricciones)
      'respaldos': true, // Siempre visible
      'instalacion': true, // Siempre visible
      'preferencias': hasAccess('paid'),
      'recordatorios': hasAccess('paid'),
      'documentos': hasAccess('paid'),
      'sincronizacion': hasAccess('paid'),
      'avanzado': hasAccess('paid'),
      'licencia': true // Siempre visible
    };

    return tabVisibility[tabId as keyof typeof tabVisibility] ?? true;
  };

  /**
   * Obtiene la lista de pestañas disponibles según la licencia
   */
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'general', label: '👤 General', icon: '👤', description: 'Datos profesionales' },
      { id: 'branding', label: '🎨 Personalización', icon: '🎨', description: 'Personalización de marca' },
      { id: 'preferencias', label: '⚙️ Preferencias', icon: '⚙️', description: 'Preferencias del sistema' },
      { id: 'recordatorios', label: '🔔 Recordatorios', icon: '🔔', description: 'Recordatorios y notificaciones' },
      { id: 'documentos', label: '📄 Documentos', icon: '📄', description: 'Configuración de documentos' },
      { id: 'respaldos', label: '💾 Respaldos', icon: '💾', description: 'Copias de seguridad' },
      { id: 'sincronizacion', label: '☁️ Sincronización', icon: '☁️', description: 'Sincronización en la nube' },
      { id: 'instalacion', label: '📱 Instalación', icon: '📱', description: 'Instalación PWA' },
      { id: 'licencia', label: '🔑 Licencia', icon: '🔑', description: 'Gestión de licencia' }
    ];

    return allTabs.filter(tab => isTabVisible(tab.id));
  };

  /**
   * Obtiene la configuración consolidada (combinando datos de ambas configuraciones)
   */
  const getConsolidatedConfig = () => {
    if (!configuracion) return null;

    // Aquí se puede agregar lógica para consolidar datos de Configuracion.tsx y ConfiguracionAvanzada.tsx
    // Por ahora, simplemente devolvemos la configuración actual
    return configuracion;
  };

  /**
   * Reinicia la configuración a valores por defecto
   */
  const resetToDefaults = async () => {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas restaurar la configuración a valores por defecto? Esto no afectará tus datos.'
    );

    if (!confirmacion) return;

    try {
      // Aquí se implementaría la lógica para restaurar valores por defecto
      // Por ahora, solo mostramos un mensaje
      alert('Función de restauración a valores por defecto será implementada en la Fase 2');
    } catch (error) {
      console.error('Error al restaurar configuración:', error);
      alert('Error al restaurar la configuración');
    }
  };

  return {
    // Estado
    configuracion,
    isLoading: !configuracion,
    
    // Acciones
    updateField,
    updateNestedField,
    actualizarConfiguracion,
    resetToDefaults,
    
    // Utilidades
    isTabVisible,
    getAvailableTabs,
    getConsolidatedConfig,
    getFeaturePermissions,
    
    // Atajos comunes
    branding: configuracion?.branding,
    datosContacto: configuracion?.datosContacto,
    preferencias: configuracion?.preferencias,
    licencia: configuracion?.licencia
  };
};

export default useConfiguracion;