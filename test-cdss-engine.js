/**
 * Test del Motor CDSS (Sistema de Soporte a Decisiones Clínicas)
 * 
 * Este test verifica la funcionalidad básica del motor CDSS implementado.
 */

// Importar el motor CDSS
const { CDSSEngine } = require('./src/modules/medicina/cdss/CDSSEngine.ts');

async function testCDSSEngine() {
  console.log('🧪 Iniciando pruebas del Motor CDSS...\n');
  
  try {
    // Crear instancia del motor
    const engine = new CDSSEngine();
    
    // Datos de prueba para un paciente
    const request = {
      pacienteId: 'test-paciente-001',
      contexto: {
        id: 'test-paciente-001',
        edad: 55,
        sexo: 'masculino',
        peso: 85,
        talla: 1.75,
        alergias: ['penicilina'],
        condicionesCronicas: ['hipertension_arterial'],
        medicamentosActuales: ['Lisinopril', 'Hidroclorotiazida'],
        factoresRiesgo: ['tabaquismo', 'obesidad']
      },
      datosClinicos: {
        signosVitales: {
          presionArterial: { sistolica: 150, diastolica: 95 },
          frecuenciaCardiaca: 85,
          temperatura: 36.8,
          saturacionOxigeno: 96,
          peso: 85,
          talla: 1.75,
          imc: 27.8
        },
        medicamentosActuales: [
          {
            id: 'med-001',
            nombre: 'Lisinopril',
            dosis: '10 mg',
            frecuencia: 'una_vez_dia',
            via: 'oral',
            fechaInicio: new Date('2024-01-15'),
            duracion: 30
          },
          {
            id: 'med-002',
            nombre: 'Hidroclorotiazida',
            dosis: '25 mg',
            frecuencia: 'una_vez_dia',
            via: 'oral',
            fechaInicio: new Date('2024-01-15'),
            duracion: 30
          }
        ],
        alergias: [
          {
            sustancia: 'Penicilina',
            tipoReaccion: 'rash cutáneo',
            severidad: 'moderada'
          }
        ],
        diagnosticoPrincipal: 'hipertension_arterial',
        diagnosticosSecundarios: ['obesidad']
      },
      accionesSolicitadas: [
        'evaluarInteracciones',
        'evaluarRiesgos',
        'generarDiagnosticos',
        'recomendarTratamientos',
        'verificarGuías',
        'generarAlertas'
      ]
    };
    
    console.log('📋 Ejecutando evaluación CDSS...');
    const resultado = await engine.evaluate(request);
    
    // Mostrar resultados
    console.log('\n✅ Evaluación CDSS completada exitosamente');
    console.log(`📊 Resumen:`);
    console.log(`   - Total alertas: ${resultado.resumen.totalAlertas}`);
    console.log(`   - Alertas críticas: ${resultado.resumen.alertasCriticas}`);
    console.log(`   - Alertas altas: ${resultado.resumen.alertasAltas}`);
    console.log(`   - Recomendaciones generadas: ${resultado.resumen.recomendacionesGeneradas}`);
    console.log(`   - Riesgos identificados: ${resultado.resumen.riesgosIdentificados}`);
    console.log(`   - Interacciones detectadas: ${resultado.resumen.interaccionesDetectadas}`);
    console.log(`   - Guías aplicadas: ${resultado.resumen.guiasAplicadas}`);
    console.log(`   - Resumen ejecutivo: ${resultado.resumen.resumenEjecutivo}`);
    
    // Mostrar alertas si existen
    if (resultado.alertas.length > 0) {
      console.log('\n🚨 Alertas generadas:');
      resultado.alertas.forEach((alerta, index) => {
        console.log(`   ${index + 1}. [${alerta.severidad.toUpperCase()}] ${alerta.titulo}`);
        console.log(`      ${alerta.descripcion}`);
        console.log(`      Acciones: ${alerta.accionesRecomendadas.join(', ')}`);
      });
    }
    
    // Mostrar recomendaciones si existen
    if (resultado.recomendaciones.length > 0) {
      console.log('\n💡 Recomendaciones de tratamiento:');
      resultado.recomendaciones.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.medicamento} (${rec.dosis}) - ${rec.justificacion}`);
      });
    }
    
    // Mostrar evaluaciones de riesgo si existen
    if (resultado.evaluacionesRiesgo.length > 0) {
      console.log('\n📈 Evaluaciones de riesgo:');
      resultado.evaluacionesRiesgo.forEach((riesgo, index) => {
        console.log(`   ${index + 1}. ${riesgo.calculadora}: ${riesgo.resultado} (${riesgo.interpretacion})`);
        console.log(`      Seguimiento: ${riesgo.seguimientoRecomendado}`);
      });
    }
    
    // Mostrar diagnósticos diferenciales si existen
    if (resultado.diagnosticosDiferenciales.length > 0) {
      console.log('\n🔍 Diagnósticos diferenciales:');
      resultado.diagnosticosDiferenciales.forEach((dx, index) => {
        console.log(`   ${index + 1}. ${dx.diagnostico} (${dx.codigoCIE10}) - Probabilidad: ${dx.probabilidad}`);
      });
    }
    
    // Mostrar guías clínicas si existen
    if (resultado.guiasAplicables.length > 0) {
      console.log('\n📚 Guías clínicas aplicables:');
      resultado.guiasAplicables.forEach((guia, index) => {
        console.log(`   ${index + 1}. ${guia.organizacion} (${guia.año}): ${guia.recomendacion}`);
      });
    }
    
    console.log('\n🎉 Prueba del Motor CDSS completada exitosamente!');
    return true;
    
  } catch (error) {
    console.error('❌ Error en la prueba del Motor CDSS:', error);
    return false;
  }
}

// Ejecutar la prueba
testCDSSEngine().then(success => {
  if (success) {
    console.log('\n✅ Todas las pruebas pasaron correctamente!');
    process.exit(0);
  } else {
    console.log('\n❌ Algunas pruebas fallaron');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Error inesperado:', error);
  process.exit(1);
});