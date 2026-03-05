// ============================================================================
// saludvalpa 3.0 - HELPERS PARA GESTIÓN DE PERMISOS
// Utilidades para manejo de permisos granulares por módulo y rol
// ============================================================================

import type { PermisosModulo } from '../hooks/useUsuarios';

// Tipos de módulos disponibles en el sistema
export type ModuloSistema = 
  | 'pacientes' 
  | 'agenda' 
  | 'documentos' 
  | 'economia' 
  | 'configuracion' 
  | 'usuarios'
  | 'biblioteca'
  | 'reportes'
  | 'respaldos'
  | 'integraciones'
  | 'seguridad'
  | 'analiticas';

// Tipos de acciones disponibles por módulo
export type AccionPermiso = 
  | 'ver' 
  | 'crear' 
  | 'editar' 
  | 'eliminar' 
  | 'firmar' 
  | 'exportar' 
  | 'importar' 
  | 'configurar'
  | 'aprobar'
  | 'rechazar';

// Interfaz para configuración de permisos por módulo
export interface ConfiguracionPermisosModulo {
  modulo: ModuloSistema;
  nombre: string;
  descripcion: string;
  accionesDisponibles: AccionPermiso[];
  accionesPorDefecto: AccionPermiso[];
}

// Configuración de todos los módulos del sistema
export const MODULOS_SISTEMA: ConfiguracionPermisosModulo[] = [
  {
    modulo: 'pacientes',
    nombre: 'Pacientes',
    descripcion: 'Gestión de pacientes, historiales clínicos y datos personales',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'exportar', 'importar'],
    accionesPorDefecto: ['ver', 'crear', 'editar'],
  },
  {
    modulo: 'agenda',
    nombre: 'Agenda',
    descripcion: 'Gestión de citas, horarios y recordatorios',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'exportar'],
    accionesPorDefecto: ['ver', 'crear', 'editar'],
  },
  {
    modulo: 'documentos',
    nombre: 'Documentos',
    descripcion: 'Generación, firma y gestión de documentos clínicos',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'firmar', 'exportar', 'aprobar', 'rechazar'],
    accionesPorDefecto: ['ver', 'crear', 'editar', 'firmar'],
  },
  {
    modulo: 'economia',
    nombre: 'Economía',
    descripcion: 'Gestión de pagos, recibos, cotizaciones y reportes financieros',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'exportar', 'aprobar'],
    accionesPorDefecto: ['ver'],
  },
  {
    modulo: 'configuracion',
    nombre: 'Configuración',
    descripcion: 'Configuración del sistema, preferencias y personalización',
    accionesDisponibles: ['ver', 'editar', 'configurar'],
    accionesPorDefecto: ['ver'],
  },
  {
    modulo: 'usuarios',
    nombre: 'Usuarios',
    descripcion: 'Gestión de usuarios, roles y permisos del sistema',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'configurar'],
    accionesPorDefecto: [],
  },
  {
    modulo: 'biblioteca',
    nombre: 'Biblioteca',
    descripcion: 'Contenidos educativos, ejercicios y recursos para pacientes',
    accionesDisponibles: ['ver', 'crear', 'editar', 'eliminar', 'exportar', 'importar'],
    accionesPorDefecto: ['ver', 'crear', 'editar'],
  },
  {
    modulo: 'reportes',
    nombre: 'Reportes',
    descripcion: 'Generación de reportes estadísticos y análisis de datos',
    accionesDisponibles: ['ver', 'crear', 'exportar', 'configurar'],
    accionesPorDefecto: ['ver'],
  },
  {
    modulo: 'respaldos',
    nombre: 'Respaldos',
    descripcion: 'Copia de seguridad y restauración de datos',
    accionesDisponibles: ['ver', 'crear', 'exportar', 'importar', 'configurar'],
    accionesPorDefecto: ['ver', 'crear', 'exportar'],
  },
  {
    modulo: 'integraciones',
    nombre: 'Integraciones',
    descripcion: 'Conexión con APIs externas y servicios de terceros',
    accionesDisponibles: ['ver', 'configurar'],
    accionesPorDefecto: ['ver'],
  },
  {
    modulo: 'seguridad',
    nombre: 'Seguridad',
    descripcion: 'Configuración de seguridad, autenticación y privacidad',
    accionesDisponibles: ['ver', 'configurar'],
    accionesPorDefecto: ['ver'],
  },
  {
    modulo: 'analiticas',
    nombre: 'Analíticas',
    descripcion: 'Métricas, dashboards y análisis de uso del sistema',
    accionesDisponibles: ['ver', 'configurar', 'exportar'],
    accionesPorDefecto: ['ver'],
  },
];

// Función para crear permisos vacíos para un módulo
export function crearPermisosVacios(modulo: ModuloSistema): Record<AccionPermiso, boolean> {
  const moduloConfig = MODULOS_SISTEMA.find(m => m.modulo === modulo);
  if (!moduloConfig) {
    return {} as Record<AccionPermiso, boolean>;
  }

  const permisos: Record<string, boolean> = {};
  moduloConfig.accionesDisponibles.forEach(accion => {
    permisos[accion] = false;
  });
  
  return permisos as Record<AccionPermiso, boolean>;
}

// Función para crear permisos por defecto para un módulo
export function crearPermisosPorDefecto(modulo: ModuloSistema): Record<AccionPermiso, boolean> {
  const moduloConfig = MODULOS_SISTEMA.find(m => m.modulo === modulo);
  if (!moduloConfig) {
    return crearPermisosVacios(modulo);
  }

  const permisos: Record<string, boolean> = {};
  moduloConfig.accionesDisponibles.forEach(accion => {
    permisos[accion] = moduloConfig.accionesPorDefecto.includes(accion);
  });
  
  return permisos as Record<AccionPermiso, boolean>;
}

// Función para crear permisos completos para todos los módulos
export function crearPermisosCompletos(): Record<ModuloSistema, Record<AccionPermiso, boolean>> {
  const permisosCompletos: Record<string, any> = {};
  
  MODULOS_SISTEMA.forEach(moduloConfig => {
    permisosCompletos[moduloConfig.modulo] = {};
    moduloConfig.accionesDisponibles.forEach(accion => {
      permisosCompletos[moduloConfig.modulo][accion] = true;
    });
  });
  
  return permisosCompletos as Record<ModuloSistema, Record<AccionPermiso, boolean>>;
}

// Función para verificar si un usuario tiene un permiso específico
export function tienePermiso(
  permisosUsuario: PermisosModulo | Record<ModuloSistema, Record<AccionPermiso, boolean>>,
  modulo: ModuloSistema,
  accion: AccionPermiso
): boolean {
  // Si el módulo no existe en los permisos del usuario, retornar false
  if (!permisosUsuario[modulo as keyof typeof permisosUsuario]) {
    return false;
  }

  const moduloPermisos = permisosUsuario[modulo as keyof typeof permisosUsuario] as Record<string, boolean>;
  return moduloPermisos[accion] === true;
}

// Función para combinar permisos (útil para herencia de roles)
export function combinarPermisos(
  permisosBase: Record<ModuloSistema, Record<AccionPermiso, boolean>>,
  permisosAdicionales: Partial<Record<ModuloSistema, Partial<Record<AccionPermiso, boolean>>>>
): Record<ModuloSistema, Record<AccionPermiso, boolean>> {
  const resultado = { ...permisosBase };
  
  Object.entries(permisosAdicionales).forEach(([modulo, acciones]) => {
    if (!resultado[modulo as ModuloSistema]) {
      resultado[modulo as ModuloSistema] = crearPermisosVacios(modulo as ModuloSistema);
    }
    
    Object.entries(acciones || {}).forEach(([accion, valor]) => {
      if (valor !== undefined) {
        resultado[modulo as ModuloSistema][accion as AccionPermiso] = valor;
      }
    });
  });
  
  return resultado;
}

// Función para exportar permisos a formato legible
export function exportarPermisosLegibles(
  permisos: Record<ModuloSistema, Record<AccionPermiso, boolean>>
): string[] {
  const legibles: string[] = [];
  
  Object.entries(permisos).forEach(([modulo, acciones]) => {
    const moduloConfig = MODULOS_SISTEMA.find(m => m.modulo === modulo);
    const nombreModulo = moduloConfig?.nombre || modulo;
    
    const accionesHabilitadas = Object.entries(acciones)
      .filter(([_, habilitada]) => habilitada)
      .map(([accion]) => accion);
    
    if (accionesHabilitadas.length > 0) {
      legibles.push(`${nombreModulo}: ${accionesHabilitadas.join(', ')}`);
    }
  });
  
  return legibles;
}

// Función para importar permisos desde configuración JSON
export function importarPermisosDesdeJSON(
  json: string
): Record<ModuloSistema, Record<AccionPermiso, boolean>> | null {
  try {
    const data = JSON.parse(json);
    const permisos: Record<string, any> = {};
    
    MODULOS_SISTEMA.forEach(moduloConfig => {
      if (data[moduloConfig.modulo]) {
        permisos[moduloConfig.modulo] = {};
        moduloConfig.accionesDisponibles.forEach(accion => {
          permisos[moduloConfig.modulo][accion] = data[moduloConfig.modulo][accion] || false;
        });
      } else {
        permisos[moduloConfig.modulo] = crearPermisosPorDefecto(moduloConfig.modulo);
      }
    });
    
    return permisos as Record<ModuloSistema, Record<AccionPermiso, boolean>>;
  } catch (error) {
    console.error('Error al importar permisos desde JSON:', error);
    return null;
  }
}

// Función para validar permisos (útil para migraciones)
export function validarPermisos(
  permisos: Record<ModuloSistema, Record<AccionPermiso, boolean>>
): { valido: boolean; errores: string[] } {
  const errores: string[] = [];
  
  // Verificar que todos los módulos existan
  Object.keys(permisos).forEach(modulo => {
    if (!MODULOS_SISTEMA.find(m => m.modulo === modulo)) {
      errores.push(`Módulo desconocido: ${modulo}`);
    }
  });
  
  // Verificar que todas las acciones sean válidas para cada módulo
  Object.entries(permisos).forEach(([modulo, acciones]) => {
    const moduloConfig = MODULOS_SISTEMA.find(m => m.modulo === modulo);
    if (moduloConfig) {
      Object.keys(acciones).forEach(accion => {
        if (!moduloConfig.accionesDisponibles.includes(accion as AccionPermiso)) {
          errores.push(`Acción no válida para módulo ${modulo}: ${accion}`);
        }
      });
    }
  });
  
  return {
    valido: errores.length === 0,
    errores,
  };
}

// Función para obtener el resumen de permisos por módulo
export function obtenerResumenPermisos(
  permisos: Record<ModuloSistema, Record<AccionPermiso, boolean>>
): Record<string, { total: number; habilitadas: number; porcentaje: number }> {
  const resumen: Record<string, { total: number; habilitadas: number; porcentaje: number }> = {};
  
  Object.entries(permisos).forEach(([modulo, acciones]) => {
    const totalAcciones = Object.keys(acciones).length;
    const habilitadas = Object.values(acciones).filter(v => v).length;
    const porcentaje = totalAcciones > 0 ? Math.round((habilitadas / totalAcciones) * 100) : 0;
    
    resumen[modulo] = { total: totalAcciones, habilitadas, porcentaje };
  });
  
  return resumen;
}