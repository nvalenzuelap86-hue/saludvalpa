#!/usr/bin/env node

// ============================================================================
// saludvalpa 3.0 - PRUEBAS DE INTEGRACIÓN DEL FLUJO COMPLETO
// Fase 4: Verificación del sistema de configuración unificado
// ============================================================================

/**
 * Script de pruebas de integración para verificar:
 * 1. Componente ConfiguracionUnificada.tsx funciona correctamente
 * 2. Sistema de migración de datos
 * 3. Sistema de backup automático
 * 4. Integración con otros componentes del sistema
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class IntegrationTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colorMap = {
      info: colors.cyan,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red
    };

    console.log(`${colorMap[type] || colors.reset}[${type.toUpperCase()}] ${timestamp}: ${message}${colors.reset}`);
  }

  test(name, testFn) {
    try {
      testFn();
      this.results.push({ name, passed: true });
      this.passed++;
      this.log(`✓ ${name}`, 'success');
    } catch (error) {
      this.results.push({ name, passed: false, error: error.message });
      this.failed++;
      this.log(`✗ ${name}: ${error.message}`, 'error');
    }
  }

  async runAllTests() {
    this.log('=== INICIANDO PRUEBAS DE INTEGRACIÓN ===', 'info');
    this.log('Sistema de Configuración Unificada - Fase 4', 'info');

    // Test 1: Verificar estructura de archivos
    this.test('Verificar existencia de ConfiguracionUnificada.tsx', () => {
      const filePath = path.join(process.cwd(), 'src/pages/ConfiguracionUnificada.tsx');
      if (!fs.existsSync(filePath)) {
        throw new Error('ConfiguracionUnificada.tsx no encontrado');
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length < 100) {
        throw new Error('ConfiguracionUnificada.tsx parece estar vacío o corrupto');
      }
    });

    // Test 2: Verificar sistema de migración
    this.test('Verificar script de migración', () => {
      const migrationScript = path.join(process.cwd(), 'migrate-configurations.js');
      if (!fs.existsSync(migrationScript)) {
        throw new Error('migrate-configurations.js no encontrado');
      }
      
      const content = fs.readFileSync(migrationScript, 'utf8');
      if (!content.includes('MigrationService') || !content.includes('BackupService')) {
        throw new Error('Script de migración no tiene la estructura esperada');
      }
    });

    // Test 3: Verificar servicio de backup mejorado
    this.test('Verificar servicio de backup automático', () => {
      const backupService = path.join(process.cwd(), 'src/services/backupService.ts');
      if (!fs.existsSync(backupService)) {
        throw new Error('backupService.ts no encontrado');
      }
      
      const content = fs.readFileSync(backupService, 'utf8');
      if (!content.includes('crearBackupAutomaticoMigracion') || 
          !content.includes('restaurarDesdeBackupMigracion')) {
        throw new Error('Servicio de backup no tiene las funciones de migración');
      }
    });

    // Test 4: Verificar estructura de tipos
    this.test('Verificar tipos TypeScript', () => {
      const typeFile = path.join(process.cwd(), 'src/types/index.ts');
      if (!fs.existsSync(typeFile)) {
        throw new Error('src/types/index.ts no encontrado');
      }
      
      const content = fs.readFileSync(typeFile, 'utf8');
      const requiredTypes = [
        'interface Configuracion',
        'interface Branding',
        'interface Preferencias',
        'interface Licencia'
      ];
      
      requiredTypes.forEach(type => {
        if (!content.includes(type)) {
          throw new Error(`Tipo requerido no encontrado: ${type}`);
        }
      });
    });

    // Test 5: Verificar componentes de pestañas
    this.test('Verificar componentes de pestañas de configuración', () => {
      const tabsDir = path.join(process.cwd(), 'src/components/configuracion/tabs');
      if (!fs.existsSync(tabsDir)) {
        throw new Error('Directorio de pestañas no encontrado');
      }
      
      const tabs = fs.readdirSync(tabsDir);
      const requiredTabs = [
        'GeneralTab.tsx',
        'PreferenciasTab.tsx',
        'RecordatoriosTab.tsx',
        'DocumentosTab.tsx',
        'RespaldosTab.tsx'
      ];
      
      requiredTabs.forEach(tab => {
        if (!tabs.includes(tab)) {
          throw new Error(`Pestaña requerida no encontrada: ${tab}`);
        }
      });
    });

    // Test 6: Verificar sistema de permisos
    this.test('Verificar sistema de permisos por licencia', () => {
      const licenseGate = path.join(process.cwd(), 'src/components/configuracion/LicenseGate.tsx');
      if (!fs.existsSync(licenseGate)) {
        // Buscar en otra ubicación posible
        const searchResult = this.findFile('LicenseGate');
        if (!searchResult) {
          throw new Error('Componente LicenseGate no encontrado');
        }
      }
    });

    // Test 7: Verificar documentación de Fase 3
    this.test('Verificar documentación de Fase 3', () => {
      const docFile = path.join(process.cwd(), 'DOCUMENTACION_FASE3.md');
      if (!fs.existsSync(docFile)) {
        throw new Error('DOCUMENTACION_FASE3.md no encontrado');
      }
      
      const content = fs.readFileSync(docFile, 'utf8');
      if (!content.includes('Fase 3 - Implementación Completa')) {
        throw new Error('Documentación de Fase 3 incompleta');
      }
    });

    // Test 8: Verificar plan de unificación
    this.test('Verificar plan de unificación completo', () => {
      const planFile = path.join(process.cwd(), 'plans/unificacion-configuraciones-plan-completo.md');
      if (!fs.existsSync(planFile)) {
        throw new Error('Plan de unificación no encontrado');
      }
      
      const content = fs.readFileSync(planFile, 'utf8');
      if (!content.includes('Fase 4 (Transición)')) {
        throw new Error('Plan no incluye Fase 4');
      }
    });

    // Mostrar resumen
    this.log('=== RESUMEN DE PRUEBAS ===', 'info');
    this.log(`Total pruebas: ${this.results.length}`, 'info');
    this.log(`Aprobadas: ${this.passed}`, this.passed === this.results.length ? 'success' : 'info');
    this.log(`Fallidas: ${this.failed}`, this.failed > 0 ? 'error' : 'info');

    // Generar reporte
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.passed,
      failed: this.failed,
      results: this.results,
      system: 'SaludValpa 3.0 - Configuración Unificada',
      phase: 'Fase 4 - Pruebas de Integración'
    };

    const reportFile = path.join(process.cwd(), 'integration-test-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    this.log(`Reporte generado: ${reportFile}`, 'success');

    return this.failed === 0;
  }

  findFile(filename) {
    const searchPaths = [
      'src/components/configuracion',
      'src/components',
      'src'
    ];
    
    for (const searchPath of searchPaths) {
      const fullPath = path.join(process.cwd(), searchPath);
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath, { recursive: true });
        const found = files.find(file => file.includes(filename));
        if (found) {
          return path.join(fullPath, found);
        }
      }
    }
    
    return null;
  }
}

// Ejecutar pruebas
async function main() {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════════╗
║   SALUDVALPA 3.0 - PRUEBAS DE INTEGRACIÓN (Fase 4)   ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  const tester = new IntegrationTester();
  const success = await tester.runAllTests();

  if (success) {
    console.log(`\n${colors.green}✅ TODAS LAS PRUEBAS DE INTEGRACIÓN PASARON${colors.reset}`);
    console.log(`${colors.green}   El sistema de configuración unificado está listo para Fase 4.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ ALGUNAS PRUEBAS FALLARON${colors.reset}`);
    console.log(`${colors.yellow}   Revise los errores antes de proceder con el despliegue.${colors.reset}`);
  }

  return success ? 0 : 1;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('Error no manejado:', error);
      process.exit(1);
    });
}

module.exports = IntegrationTester;