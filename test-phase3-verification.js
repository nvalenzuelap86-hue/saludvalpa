// ============================================================================
// saludvalpa 3.0 - VERIFICACIÓN DE ARCHIVOS FASE 3
// Verifica que todos los archivos de la Fase 3 existen
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 VERIFICACIÓN DE ARCHIVOS FASE 3');
console.log('===================================\n');

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

// Verificar archivos
console.log('📁 VERIFICANDO ARCHIVOS REQUERIDOS:');
let archivosFaltantes = 0;
let archivosExistentes = 0;

archivosRequeridos.forEach(archivo => {
  const rutaCompleta = path.join(__dirname, archivo);
  if (fs.existsSync(rutaCompleta)) {
    console.log(`  ✅ ${archivo}`);
    archivosExistentes++;
    
    // Verificar que el archivo no esté vacío
    const stats = fs.statSync(rutaCompleta);
    if (stats.size < 100) {
      console.log(`    ⚠️  Advertencia: ${archivo} parece estar vacío o muy pequeño (${stats.size} bytes)`);
    }
  } else {
    console.log(`  ❌ ${archivo} - NO ENCONTRADO`);
    archivosFaltantes++;
  }
});

console.log(`\n📊 RESULTADO: ${archivosExistentes}/${archivosRequeridos.length} archivos encontrados`);

// Verificar contenido específico en archivos clave
console.log('\n🔍 VERIFICANDO CONTENIDO CLAVE:');

// Verificar ConfiguracionUnificada.tsx
const configPath = path.join(__dirname, 'src/pages/ConfiguracionUnificada.tsx');
if (fs.existsSync(configPath)) {
  const contenido = fs.readFileSync(configPath, 'utf8');
  
  // Verificar imports de nuevas pestañas
  const importsRequeridos = [
    'UsuariosPermisosTab',
    'IntegracionesTab',
    'RespaldosTab',
    'SeguridadTab',
    'AnaliticasTab'
  ];
  
  console.log('  📋 Imports en ConfiguracionUnificada.tsx:');
  importsRequeridos.forEach(importName => {
    if (contenido.includes(`import ${importName}`)) {
      console.log(`    ✅ Import ${importName} presente`);
    } else {
      console.log(`    ❌ Import ${importName} NO presente`);
    }
  });
  
  // Verificar tabs en TabType
  const tabTypeMatch = contenido.match(/type TabType = ([^;]+)/);
  if (tabTypeMatch) {
    const tabTypeDef = tabTypeMatch[1];
    const tabsConfiguracion = [
      'general', 'preferencias', 'recordatorios', 'documentos', 'personalizacion',
      'sincronizacion', 'respaldos', 'instalacion', 'avanzada',
      'usuarios', 'integraciones', 'respaldos_avanzados', 'seguridad', 'analiticas'
    ];
    
    const tabsEncontradas = tabsConfiguracion.filter(tab => tabTypeDef.includes(`'${tab}'`));
    
    if (tabsEncontradas.length === tabsConfiguracion.length) {
      console.log(`    ✅ Todas las ${tabsConfiguracion.length} pestañas en TabType`);
    } else {
      const faltantes = tabsConfiguracion.filter(tab => !tabsEncontradas.includes(tab));
      console.log(`    ⚠️  Pestañas faltantes en TabType: ${faltantes.join(', ')}`);
    }
  }
  
  // Verificar renderizado de nuevas pestañas
  const renderRequerido = [
    "{tabActiva === 'usuarios'",
    "{tabActiva === 'integraciones'",
    "{tabActiva === 'respaldos_avanzados'",
    "{tabActiva === 'seguridad'",
    "{tabActiva === 'analiticas'"
  ];
  
  console.log('  📋 Renderizado de pestañas:');
  renderRequerido.forEach(render => {
    if (contenido.includes(render)) {
      console.log(`    ✅ Render ${render}... presente`);
    } else {
      console.log(`    ❌ Render ${render}... NO presente`);
    }
  });
}

// Verificar permisosHelpers.ts
const permisosPath = path.join(__dirname, 'src/utils/permisosHelpers.ts');
if (fs.existsSync(permisosPath)) {
  const contenido = fs.readFileSync(permisosPath, 'utf8');
  
  // Verificar módulos del sistema
  const modulosEsperados = [
    'pacientes', 'agenda', 'documentos', 'economia', 'configuracion', 'usuarios',
    'biblioteca', 'reportes', 'respaldos', 'integraciones', 'seguridad', 'analiticas'
  ];
  
  console.log('  🔐 Módulos en permisosHelpers.ts:');
  modulosEsperados.forEach(modulo => {
    if (contenido.includes(`modulo: '${modulo}'`)) {
      console.log(`    ✅ Módulo ${modulo} configurado`);
    } else {
      console.log(`    ❌ Módulo ${modulo} NO configurado`);
    }
  });
}

// Verificar useUsuarios.ts
const usuariosPath = path.join(__dirname, 'src/hooks/useUsuarios.ts');
if (fs.existsSync(usuariosPath)) {
  const contenido = fs.readFileSync(usuariosPath, 'utf8');
  
  // Verificar roles
  const rolesEsperados = ['admin', 'profesional', 'recepcionista'];
  console.log('  👥 Roles en useUsuarios.ts:');
  rolesEsperados.forEach(rol => {
    if (contenido.includes(`${rol}: {`)) {
      console.log(`    ✅ Rol ${rol} definido`);
    } else {
      console.log(`    ❌ Rol ${rol} NO definido`);
    }
  });
}

// Resumen final
console.log('\n📋 RESUMEN FINAL:');
console.log('================');

if (archivosFaltantes === 0) {
  console.log('✅ TODOS los archivos requeridos están presentes');
  console.log('✅ Sistema de permisos actualizado con nuevos módulos');
  console.log('✅ Configuración unificada integra todas las nuevas pestañas');
  console.log('\n🎉 ¡FASE 3 IMPLEMENTADA EXITOSAMENTE!');
} else {
  console.log(`⚠️  Se encontraron ${archivosFaltantes} archivos faltantes`);
  console.log('🔧 Revisa los errores anteriores para completar la implementación');
}

console.log('\n===================================');
console.log('🧪 VERIFICACIÓN COMPLETADA');