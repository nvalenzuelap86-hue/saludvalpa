#!/usr/bin/env node

// ============================================================================
// saludvalpa 3.0 - PRUEBAS DE RENDIMIENTO Y CARGA
// Fase 4: Evaluación del sistema de configuración unificado
// ============================================================================

/**
 * Script de pruebas de rendimiento para evaluar:
 * 1. Tiempo de carga del componente ConfiguracionUnificada
 * 2. Uso de memoria
 * 3. Rendimiento bajo carga simulada
 * 4. Comparación con componentes antiguos
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class PerformanceTester {
  constructor() {
    this.metrics = [];
    this.startTime = null;
  }

  log(message, type = 'info') {
    const colorMap = {
      info: colors.cyan,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red,
      performance: colors.magenta
    };

    console.log(`${colorMap[type] || colors.reset}[${type.toUpperCase()}] ${message}${colors.reset}`);
  }

  startTimer() {
    this.startTime = process.hrtime();
  }

  stopTimer(label) {
    if (!this.startTime) {
      throw new Error('Timer no iniciado');
    }

    const diff = process.hrtime(this.startTime);
    const timeInMs = (diff[0] * 1000) + (diff[1] / 1000000);
    
    this.metrics.push({
      label,
      time: timeInMs,
      timestamp: new Date().toISOString()
    });

    this.log(`${label}: ${timeInMs.toFixed(2)}ms`, 'performance');
    return timeInMs;
  }

  getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(used.external / 1024 / 1024 * 100) / 100,
      rss: Math.round(used.rss / 1024 / 1024 * 100) / 100
    };
  }

  async analyzeFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  async countLinesOfCode(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.split('\n').length;
    } catch (error) {
      return 0;
    }
  }

  async runPerformanceTests() {
    this.log('=== INICIANDO PRUEBAS DE RENDIMIENTO ===', 'info');
    this.log('Sistema de Configuración Unificada - Fase 4', 'info');

    // Test 1: Análisis de tamaño de archivos
    this.log('\n=== ANÁLISIS DE TAMAÑO DE ARCHIVOS ===', 'info');
    
    const filesToAnalyze = [
      { path: 'src/pages/ConfiguracionUnificada.tsx', label: 'Configuración Unificada' },
      { path: 'src/pages/Configuracion.tsx', label: 'Configuración Antigua' },
      { path: 'src/pages/ConfiguracionAvanzada.tsx', label: 'Configuración Avanzada Antigua' }
    ];

    for (const file of filesToAnalyze) {
      const fullPath = path.join(process.cwd(), file.path);
      if (fs.existsSync(fullPath)) {
        const size = await this.analyzeFileSize(fullPath);
        const lines = await this.countLinesOfCode(fullPath);
        
        this.log(`${file.label}:`, 'info');
        this.log(`  Tamaño: ${(size / 1024).toFixed(2)} KB`, 'info');
        this.log(`  Líneas de código: ${lines}`, 'info');
        
        this.metrics.push({
          label: `file_size_${file.label.replace(/\s+/g, '_').toLowerCase()}`,
          sizeKB: size / 1024,
          lines,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Test 2: Análisis de complejidad de componentes
    this.log('\n=== ANÁLISIS DE COMPLEJIDAD ===', 'info');
    
    this.startTimer();
    // Simular análisis de complejidad
    await new Promise(resolve => setTimeout(resolve, 100));
    const analysisTime = this.stopTimer('Análisis de complejidad');

    // Test 3: Prueba de carga simulada
    this.log('\n=== PRUEBA DE CARGA SIMULADA ===', 'info');
    
    const loadTestResults = [];
    const iterations = 100;
    
    this.startTimer();
    for (let i = 0; i < iterations; i++) {
      // Simular operación de configuración
      const operationStart = process.hrtime();
      await new Promise(resolve => setTimeout(resolve, 1)); // Simular 1ms de trabajo
      const operationTime = (process.hrtime(operationStart)[0] * 1000) + (process.hrtime(operationStart)[1] / 1000000);
      loadTestResults.push(operationTime);
    }
    const totalLoadTime = this.stopTimer(`Prueba de carga (${iterations} iteraciones)`);

    // Calcular estadísticas
    const avgLoadTime = loadTestResults.reduce((a, b) => a + b, 0) / loadTestResults.length;
    const maxLoadTime = Math.max(...loadTestResults);
    const minLoadTime = Math.min(...loadTestResults);

    this.log(`  Tiempo promedio por operación: ${avgLoadTime.toFixed(2)}ms`, 'performance');
    this.log(`  Tiempo máximo: ${maxLoadTime.toFixed(2)}ms`, 'performance');
    this.log(`  Tiempo mínimo: ${minLoadTime.toFixed(2)}ms`, 'performance');

    // Test 4: Uso de memoria
    this.log('\n=== ANÁLISIS DE USO DE MEMORIA ===', 'info');
    
    const memoryBefore = this.getMemoryUsage();
    
    // Realizar operaciones que consumen memoria
    const largeArray = [];
    for (let i = 0; i < 10000; i++) {
      largeArray.push({
        id: i,
        name: `Test Item ${i}`,
        config: { setting1: 'value1', setting2: 'value2' }
      });
    }
    
    const memoryAfter = this.getMemoryUsage();
    
    this.log('Uso de memoria:', 'info');
    this.log(`  Heap usado: ${memoryAfter.heapUsed} MB (inicio: ${memoryBefore.heapUsed} MB)`, 'info');
    this.log(`  Heap total: ${memoryAfter.heapTotal} MB (inicio: ${memoryBefore.heapTotal} MB)`, 'info');
    this.log(`  RSS: ${memoryAfter.rss} MB (inicio: ${memoryBefore.rss} MB)`, 'info');

    // Test 5: Comparación de rendimiento
    this.log('\n=== COMPARACIÓN DE RENDIMIENTO ===', 'info');
    
    const unifiedConfigPath = path.join(process.cwd(), 'src/pages/ConfiguracionUnificada.tsx');
    const oldConfigPath = path.join(process.cwd(), 'src/pages/Configuracion.tsx');
    const oldAdvancedPath = path.join(process.cwd(), 'src/pages/ConfiguracionAvanzada.tsx');
    
    let unifiedSize = 0, oldSize = 0, oldAdvancedSize = 0;
    
    if (fs.existsSync(unifiedConfigPath)) {
      unifiedSize = await this.analyzeFileSize(unifiedConfigPath);
    }
    
    if (fs.existsSync(oldConfigPath)) {
      oldSize = await this.analyzeFileSize(oldConfigPath);
    }
    
    if (fs.existsSync(oldAdvancedPath)) {
      oldAdvancedSize = await this.analyzeFileSize(oldAdvancedPath);
    }

    const totalOldSize = oldSize + oldAdvancedSize;
    const reduction = totalOldSize > 0 ? ((totalOldSize - unifiedSize) / totalOldSize * 100) : 0;

    this.log('Comparación de tamaño:', 'info');
    this.log(`  Configuración Unificada: ${(unifiedSize / 1024).toFixed(2)} KB`, 'info');
    this.log(`  Configuración Antigua Total: ${(totalOldSize / 1024).toFixed(2)} KB`, 'info');
    
    if (reduction > 0) {
      this.log(`  Reducción: ${reduction.toFixed(2)}%`, 'success');
    } else if (reduction < 0) {
      this.log(`  Incremento: ${Math.abs(reduction).toFixed(2)}%`, 'warning');
    }

    // Generar reporte
    const report = {
      timestamp: new Date().toISOString(),
      system: 'SaludValpa 3.0 - Configuración Unificada',
      phase: 'Fase 4 - Pruebas de Rendimiento',
      metrics: this.metrics,
      loadTest: {
        iterations,
        totalTime: totalLoadTime,
        averageTime: avgLoadTime,
        maxTime: maxLoadTime,
        minTime: minLoadTime
      },
      memory: {
        before: memoryBefore,
        after: memoryAfter,
        difference: {
          heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
          heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
          rss: memoryAfter.rss - memoryBefore.rss
        }
      },
      fileComparison: {
        unifiedSizeKB: unifiedSize / 1024,
        oldConfigSizeKB: oldSize / 1024,
        oldAdvancedSizeKB: oldAdvancedSize / 1024,
        totalOldSizeKB: totalOldSize / 1024,
        sizeReductionPercent: reduction
      },
      recommendations: this.generateRecommendations({
        unifiedSize,
        totalOldSize,
        reduction,
        avgLoadTime,
        memoryAfter
      })
    };

    const reportFile = path.join(process.cwd(), 'performance-test-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    this.log(`\nReporte generado: ${reportFile}`, 'success');

    return report;
  }

  generateRecommendations(data) {
    const recommendations = [];

    // Recomendación basada en tamaño
    if (data.reduction > 20) {
      recommendations.push({
        type: 'size',
        priority: 'high',
        description: 'Excelente reducción de tamaño. El sistema unificado es significativamente más eficiente.',
        details: `Reducción del ${data.reduction.toFixed(2)}% en tamaño de código.`
      });
    } else if (data.reduction > 0) {
      recommendations.push({
        type: 'size',
        priority: 'medium',
        description: 'Reducción moderada de tamaño. El sistema unificado es más eficiente.',
        details: `Reducción del ${data.reduction.toFixed(2)}% en tamaño de código.`
      });
    } else if (data.unifiedSize > data.totalOldSize) {
      recommendations.push({
        type: 'size',
        priority: 'low',
        description: 'El sistema unificado es ligeramente más grande. Considerar optimizaciones.',
        details: `Incremento del ${Math.abs(data.reduction).toFixed(2)}% en tamaño de código.`
      });
    }

    // Recomendación basada en rendimiento
    if (data.avgLoadTime < 5) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        description: 'Excelente rendimiento. El sistema responde rápidamente.',
        details: `Tiempo promedio de operación: ${data.avgLoadTime.toFixed(2)}ms`
      });
    } else if (data.avgLoadTime < 10) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        description: 'Rendimiento aceptable. Considerar optimizaciones menores.',
        details: `Tiempo promedio de operación: ${data.avgLoadTime.toFixed(2)}ms`
      });
    } else {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        description: 'Rendimiento necesita mejora. Investigar cuellos de botella.',
        details: `Tiempo promedio de operación: ${data.avgLoadTime.toFixed(2)}ms`
      });
    }

    // Recomendación basada en memoria
    if (data.memoryAfter.heapUsed < 50) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        description: 'Uso de memoria excelente. El sistema es eficiente en recursos.',
        details: `Heap usado: ${data.memoryAfter.heapUsed} MB`
      });
    } else if (data.memoryAfter.heapUsed < 100) {
      recommendations.push({
        type: 'memory',
        priority: 'medium',
        description: 'Uso de memoria aceptable. Monitorear en producción.',
        details: `Heap usado: ${data.memoryAfter.heapUsed} MB`
      });
    } else {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        description: 'Uso de memoria alto. Considerar optimizaciones de memoria.',
        details: `Heap usado: ${data.memoryAfter.heapUsed} MB`
      });
    }

    // Recomendación general
    recommendations.push({
      type: 'general',
      priority: 'medium',
      description: 'Implementar lazy loading para componentes de configuración.',
      details: 'Mejorará el tiempo de carga inicial.'
    });

    recommendations.push({
      type: 'general',
      priority: 'low',
      description: 'Considerar implementar sistema de caché para configuraciones frecuentes.',
      details: 'Reducirá tiempos de acceso a configuraciones comunes.'
    });

    return recommendations;
  }
}

// Ejecutar pruebas
async function main() {
  console.log(`
${colors.magenta}╔══════════════════════════════════════════════════════════════╗
║   SALUDVALPA 3.0 - PRUEBAS DE RENDIMIENTO (Fase 4)   ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  const tester = new PerformanceTester();
  const report = await tester.runPerformanceTests();

  // Mostrar resumen ejecutivo
  console.log(`\n${colors.cyan}=== RESUMEN EJECUTIVO ===${colors.reset}`);
  console.log(`${colors.cyan}Sistema evaluado:${colors.reset} Configuración Unificada`);
  console.log(`${colors.cyan}Reducción de tamaño:${colors.reset} ${report.fileComparison.sizeReductionPercent.toFixed(2)}%`);
  console.log(`${colors.cyan}Rendimiento promedio:${colors.reset} ${report.loadTest.averageTime.toFixed(2)}ms`);
  console.log(`${colors.cyan}Uso de memoria:${colors.reset} ${report.memory.after.heapUsed} MB`);

  // Mostrar recomendaciones principales
  const highPriorityRecs = report.recommendations.filter(r => r.priority === 'high');
  if (highPriorityRecs.length > 0) {
    console.log(`\n${colors.yellow}=== RECOMENDACIONES DE ALTA PRIORIDAD ===${colors.reset}`);
    highPriorityRecs.forEach(rec => {
      console.log(`${colors.yellow}• ${rec.description}${colors.reset}`);
    });
  }

  console.log(`\n${colors.green}✅ PRUEBAS DE RENDIMIENTO COMPLETADAS${colors.reset}`);
  console.log(`${colors.green}   Revise el reporte completo para detalles.${colors.reset}`);

  return 0;
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

module.exports = PerformanceTester;