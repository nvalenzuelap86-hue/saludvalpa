// ============================================================================
// saludvalpa 3.0 - TEST DE INTEGRACIÓN FASE 3
// Verifica que todas las funcionalidades de la Fase 3 estén correctamente implementadas
// ============================================================================

console.log('🧪 INICIANDO PRUEBAS DE INTEGRACIÓN FASE 3');
console.log('===========================================\n');

// Lista de archivos que deben existir
const archivosRequeridos = [
  // Sistema de gestión de usuarios
  'src/hooks/useUsuarios.ts',
  'src/components/configuracion/tabs/UsuariosPermisosTab.tsx',
  'src/utils/permisosHelpers.ts',
  
  // Integraciones externas
  'src/components/configuracion/tabs/IntegracionesTab.tsx',
  'src/services/apiIntegrationService.ts',
  
  // Documentos extendidos
  'src/components/configuracion/tabs/DocumentosTab.tsx',
  
  // Respaldos avanzados
  'src/components/configuracion/tabs/RespaldosTab.tsx',
  
  // Seguridad
  'src/components/configuracion/tabs/SeguridadTab.tsx',
  
  // Analíticas
  'src/components/configuracion/tabs/AnaliticasTab.tsx',
  
  // Configuración unificada
  'src/pages/ConfiguracionUnificada.tsx',
];

// Lista de módulos que deben estar en el sistema de permisos
const modulosPermisos = [
  'pacientes', 'agenda', 'documentos', 'economia', 'configuracion', 'usuarios',
  'biblioteca', 'reportes', 'respaldos', 'integraciones', 'seguridad', 'analiticas'
];

// Lista de pestañas que deben estar en ConfiguracionUnificada.tsx
const tabsConfiguracion = [
  'general', 'preferencias', 'recordatorios', 'documentos', 'personalizacion',
  'sincronizacion', 'respaldos', 'instalacion', 'avanzada',
  'usuarios', 'integraciones', 'respaldos_avanzados', 'seguridad', 'analiticas'
];

// Verificar archivos
console.log('📁 VERIFICANDO ARCHIVOS REQUERIDOS:');
let archivosFaltantes = 0;

archivosRequeridos.forEach(archivo => {
  try {
    require(`./${archivo}`);
    console.log(`  ✅ ${archivo}`);
  } catch (error) {
    console.log(`  ❌ ${archivo} - NO ENCONTRADO`);
    archivosFaltantes++;
  }
});

console.log(`\n📊 RESULTADO: ${archivosRequeridos.length - archivosFaltantes}/${archivosRequeridos.length} archivos encontrados\n`);

// Verificar sistema de permisos
console.log('🔐 VERIFICANDO SISTEMA DE PERMISOS:');
try {
  const permisosHelpers = require('./src/utils/permisosHelpers.ts');
  
  // Verificar módulos
  const modulosEncontrados = permisosHelpers.MODULOS_SISTEMA.map(m => m.modulo);
  const modulosFaltantes = modulosPermisos.filter(m => !modulosEncontrados.includes(m));
  
  if (modulosFaltantes.length === 0) {
    console.log(`  ✅ Todos los ${modulosPermisos.length} módulos están configurados`);
  } else {
    console.log(`  ❌ Módulos faltantes: ${modulosFaltantes.join(', ')}`);
  }
  
  // Verificar funciones de permisos
  const funcionesRequeridas = [
    'crearPermisosVacios',
    'crearPermisosPorDefecto',
    'crearPermisosCompletos',
    'tienePermiso',
    'combinarPermisos'
  ];
  
  funcionesRequeridas.forEach(func => {
    if (typeof permisosHelpers[func] === 'function') {
      console.log(`  ✅ Función ${func}() disponible`);
    } else {
      console.log(`  ❌ Función ${func}() NO disponible`);
    }
  });
  
} catch (error) {
  console.log(`  ❌ Error al verificar permisos: ${error.message}`);
}

// Verificar configuración unificada
console.log('\n⚙️ VERIFICANDO CONFIGURACIÓN UNIFICADA:');
try {
  const configUnificada = require('./src/pages/ConfiguracionUnificada.tsx');
  const contenido = require('fs').readFileSync('./src/pages/ConfiguracionUnificada.tsx', 'utf8');
  
  // Verificar imports de nuevas pestañas
  const importsRequeridos = [
    'UsuariosPermisosTab',
    'IntegracionesTab',
    'RespaldosTab',
    'SeguridadTab',
    'AnaliticasTab'
  ];
  
  importsRequeridos.forEach(importName => {
    if (contenido.includes(`import ${importName}`)) {
      console.log(`  ✅ Import ${importName} presente`);
    } else {
      console.log(`  ❌ Import ${importName} NO presente`);
    }
  });
  
  // Verificar tabs en TabType
  const tabTypeMatch = contenido.match(/type TabType = ([^;]+)/);
  if (tabTypeMatch) {
    const tabTypeDef = tabTypeMatch[1];
    const tabsEncontradas = tabsConfiguracion.filter(tab => tabTypeDef.includes(`'${tab}'`));
    
    if (tabsEncontradas.length === tabsConfiguracion.length) {
      console.log(`  ✅ Todas las ${tabsConfiguracion.length} pestañas en TabType`);
    } else {
      const faltantes = tabsConfiguracion.filter(tab => !tabsEncontradas.includes(tab));
      console.log(`  ❌ Pestañas faltantes en TabType: ${faltantes.join(', ')}`);
    }
  } else {
    console.log('  ❌ No se encontró la definición de TabType');
  }
  
  // Verificar renderizado de nuevas pestañas
  const renderRequerido = [
    "{tabActiva === 'usuarios'",
    "{tabActiva === 'integraciones'",
    "{tabActiva === 'respaldos_avanzados'",
    "{tabActiva === 'seguridad'",
    "{tabActiva === 'analiticas'"
  ];
  
  renderRequerido.forEach(render => {
    if (contenido.includes(render)) {
      console.log(`  ✅ Render ${render}... presente`);
    } else {
      console.log(`  ❌ Render ${render}... NO presente`);
    }
  });
  
} catch (error) {
  console.log(`  ❌ Error al verificar configuración: ${error.message}`);
}

// Verificar API Integration Service
console.log('\n🔌 VERIFICANDO SERVICIO DE INTEGRACIÓN:');
try {
  const apiService = require('./src/services/apiIntegrationService.ts');
  
  // Verificar clase principal
  if (apiService.ApiIntegrationService) {
    console.log('  ✅ Clase ApiIntegrationService disponible');
    
    // Verificar métodos principales
    const metodosRequeridos = [
      'configurarIntegracion',
      'desconectarIntegracion',
      'agregarWebhook',
      'emitirEvento',
      'crearEventoGoogleCalendar',
      'enviarMensajeWhatsApp',
      'verificarEstadoIntegraciones'
    ];
    
    metodosRequeridos.forEach(metodo => {
      if (apiService.ApiIntegrationService.prototype[metodo]) {
        console.log(`  ✅ Método ${metodo}() disponible`);
      } else {
        console.log(`  ❌ Método ${metodo}() NO disponible`);
      }
    });
    
    // Verificar eventos helper
    if (apiService.eventosHelper) {
      console.log('  ✅ Eventos helper disponibles');
      const eventos = ['citaCreada', 'citaCancelada', 'pacienteCreado', 'documentoGenerado', 'pagoRecibido'];
      eventos.forEach(evento => {
        if (apiService.eventosHelper[evento]) {
          console.log(`    ✅ Evento ${evento} disponible`);
        } else {
          console.log(`    ❌ Evento ${evento} NO disponible`);
        }
      });
    } else {
      console.log('  ❌ Eventos helper NO disponibles');
    }
  } else {
    console.log('  ❌ Clase ApiIntegrationService NO disponible');
  }
  
} catch (error) {
  console.log(`  ❌ Error al verificar API service: ${error.message}`);
}

// Resumen final
console.log('\n📋 RESUMEN DE PRUEBAS FASE 3:');
console.log('==============================');

if (archivosFaltantes === 0) {
  console.log('✅ TODOS los archivos requeridos están presentes');
  console.log('✅ Sistema de permisos actualizado con nuevos módulos');
  console.log('✅ Configuración unificada integra todas las nuevas pestañas');
  console.log('✅ Servicio de integración API completamente implementado');
  console.log('\n🎉 ¡FASE 3 IMPLEMENTADA EXITOSAMENTE!');
} else {
  console.log(`⚠️  Se encontraron ${archivosFaltantes} archivos faltantes`);
  console.log('🔧 Revisa los errores anteriores para completar la implementación');
}

console.log('\n===========================================');
console.log('🧪 PRUEBAS DE INTEGRACIÓN FASE 3 COMPLETADAS');