// ============================================================================
// saludvalpa 3.0 - CONFIGURACION HELPERS
// Utilidades para la configuración unificada
// ============================================================================

import type { Configuracion } from '../types';

/**
 * Valida un campo de configuración
 */
export const validateConfigField = (field: string, value: any): { isValid: boolean; message?: string } => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        message: !emailRegex.test(value) ? 'Email inválido' : undefined
      };
    
    case 'telefono':
      const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
      return {
        isValid: phoneRegex.test(value),
        message: !phoneRegex.test(value) ? 'Teléfono inválido' : undefined
      };
    
    case 'sitioWeb':
      if (!value) return { isValid: true };
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/.*)?$/;
      return {
        isValid: urlRegex.test(value),
        message: !urlRegex.test(value) ? 'URL inválida' : undefined
      };
    
    default:
      return { isValid: true };
  }
};

/**
 * Combina configuraciones de Configuracion.tsx y ConfiguracionAvanzada.tsx
 */
export const mergeConfigurations = (
  basicConfig: Partial<Configuracion> | null,
  advancedConfig: Partial<Configuracion> | null
): Partial<Configuracion> => {
  const merged: Partial<Configuracion> = {};
  
  if (basicConfig) {
    // Priorizar configuración avanzada sobre básica
    merged.branding = {
      ...basicConfig.branding,
      ...advancedConfig?.branding
    };
    
    merged.datosContacto = {
      ...basicConfig.datosContacto,
      ...advancedConfig?.datosContacto
    };
    
    merged.licencia = basicConfig.licencia || advancedConfig?.licencia;
  }
  
  if (advancedConfig) {
    merged.preferencias = advancedConfig.preferencias;
  }
  
  return merged;
};

/**
 * Obtiene valores por defecto para la configuración
 */
export const getDefaultConfig = (): Partial<Configuracion> => ({
  branding: {
    nombreProfesional: '',
    nombreClinica: '',
    credenciales: '',
    especialidad: '',
    logo: '',
    tema: 'saludvalpa',
    colores: {
      primario: '#2C5D7D',
      secundario: '#5FB4B4',
      acento: '#9BCB56'
    },
    piePagina: '',
    mostrarMarcaDeAgua: false,
    formatoDocumentos: 'formal'
  },
  datosContacto: {
    telefono: '',
    email: '',
    direccion: '',
    sitioWeb: ''
  },
  preferencias: {
    formatoFecha: 'DD/MM/YYYY',
    economia: {
      moneda: 'MXN',
      mostrarImpuestos: false,
      iva: 16
    },
    agenda: {
      vistaInicial: 'semana',
      horaInicio: '08:00',
      horaFin: '20:00',
      duracionCitaDefault: 60
    },
    recordatorios: {
      habilitados: false,
      anticipacionCitas: 60,
      anticipacionDia: 24,
      sonido: false
    }
  },
  licencia: {
    tipo: 'gratuita',
    estado: 'activa',
    fechaExpiracion: null,
    codigo: ''
  }
});

/**
 * Formatea un valor para mostrar en la UI
 */
export const formatConfigValue = (field: string, value: any): string => {
  if (value === null || value === undefined) return '';
  
  switch (field) {
    case 'fecha':
      return new Date(value).toLocaleDateString();
    
    case 'moneda':
      const currencySymbols: Record<string, string> = {
        'MXN': '$',
        'USD': 'US$',
        'EUR': '€',
        'COP': 'COP$',
        'ARS': 'ARS$'
      };
      return currencySymbols[value] || value;
    
    case 'boolean':
      return value ? 'Sí' : 'No';
    
    default:
      return String(value);
  }
};

/**
 * Exporta la configuración a un archivo JSON
 */
export const exportConfigToFile = (config: Configuracion, filename: string = 'configuracion-saludvalpa.json') => {
  const dataStr = JSON.stringify(config, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

/**
 * Importa configuración desde un archivo JSON
 */
export const importConfigFromFile = (file: File): Promise<Partial<Configuracion>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const config = JSON.parse(content) as Partial<Configuracion>;
        resolve(config);
      } catch (error) {
        reject(new Error('Error al parsear el archivo JSON'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};