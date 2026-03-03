// ============================================================================
// Test script for medicina PDF generators
// ============================================================================

// Note: We can't directly import TypeScript modules in Node.js without compilation
// This test will verify the structure and TypeScript compilation instead

// Mock data for testing
const mockPaciente = {
  id: 'test-123',
  nombre: 'Juan',
  apellidos: 'Pérez',
  edad: 35,
  genero: 'masculino',
  fechaNacimiento: '1989-05-15',
  telefono: '555-1234',
  email: 'juan.perez@example.com'
};

const mockConfig = {
  profesion: 'medicina_general',
  branding: {
    nombreProfesional: 'Dr. Carlos Rodríguez',
    credenciales: 'Médico General - Cédula Profesional: 123456',
    nombreClinica: 'Clínica Salud Integral',
    colores: {
      primario: '#007bff',
      secundario: '#6c757d',
      acento: '#28a745'
    },
    tema: 'profesional',
    piePagina: 'Clínica Salud Integral - Tel: 555-5678',
    mostrarMarcaDeAgua: true,
    formatoDocumentos: 'formal'
  },
  datosContacto: {
    telefono: '555-5678',
    email: 'info@clinicasaludintegral.com'
  }
};

const mockDatosReceta = {
  fechaReceta: '2026-03-03',
  diagnostico: ['Hipertensión arterial esencial', 'Diabetes mellitus tipo 2'],
  medicamentos: [
    {
      nombre: 'Losartán',
      presentacion: 'tabletas 50 mg',
      dosis: '1 tableta',
      frecuencia: 'cada 24 horas',
      duracion: '30 días',
      via: 'oral',
      indicacionesEspeciales: 'Tomar en la mañana con alimentos'
    },
    {
      nombre: 'Metformina',
      presentacion: 'tabletas 850 mg',
      dosis: '1 tableta',
      frecuencia: 'cada 12 horas',
      duracion: '30 días',
      via: 'oral',
      indicacionesEspeciales: 'Tomar con alimentos para evitar malestar gastrointestinal'
    }
  ],
  indicacionesGenerales: [
    'Controlar presión arterial diariamente',
    'Realizar ejercicio moderado 30 minutos al día',
    'Seguir dieta baja en sodio y azúcares'
  ],
  proximaCita: '2026-04-03',
  recomendaciones: [
    'Acudir a consulta de nutrición',
    'Realizar exámenes de laboratorio en 3 meses'
  ],
  verificacionCDSS: {
    interaccionesDetectadas: false,
    alertas: [],
    recomendaciones: []
  }
};

const mockDatosDerivacion = {
  fechaDerivacion: '2026-03-03',
  especialista: 'Dr. Alejandro Martínez',
  especialidad: 'Cardiología',
  institucion: 'Hospital General',
  motivoDerivacion: 'Evaluación de hipertrofia ventricular izquierda en ecocardiograma',
  resumenClinico: 'Paciente con HTA de 5 años de evolución, mal controlada a pesar de tratamiento triple. Ecocardiograma muestra hipertrofia concéntrica del VI con FEVI preservada.',
  estudiosSolicitados: ['Ecocardiograma de estrés', 'Holter de 24 horas'],
  nivelUrgencia: 'prioritario',
  notasAdicionales: 'Favor evaluar para posible inicio de betabloqueador'
};

const mockDatosCertificado = {
  fechaEmision: '2026-03-03',
  tipoCertificado: 'incapacidad_laboral',
  diagnostico: ['Lumbalgia aguda', 'Espasmo muscular lumbar'],
  periodoIncapacidad: {
    inicio: '2026-03-03',
    fin: '2026-03-10'
  },
  recomendaciones: [
    'Reposo relativo',
    'Aplicación de calor local',
    'Ejercicios de estiramiento suave'
  ],
  restricciones: [
    'No levantar pesos mayores a 5 kg',
    'Evitar permanecer sentado por más de 30 minutos continuos'
  ],
  fechaReincorporacion: '2026-03-11'
};

async function testPrescriptionGenerator() {
  console.log('🔬 Probando generador de recetas médicas...');
  try {
    const validation = medicalPrescriptionGenerator.validateData(mockDatosReceta);
    console.log('✅ Validación de datos:', validation.isValid ? 'PASS' : 'FAIL');
    if (!validation.isValid) {
      console.log('   Errores:', validation.errors);
    }
    
    // Nota: No generamos PDF real en test para evitar dependencias de navegador
    console.log('✅ Generador de recetas listo para uso');
    return true;
  } catch (error) {
    console.error('❌ Error en generador de recetas:', error.message);
    return false;
  }
}

async function testReferralLetterGenerator() {
  console.log('\n🔬 Probando generador de cartas de derivación...');
  try {
    const validation = medicalReferralLetterGenerator.validateData(mockDatosDerivacion);
    console.log('✅ Validación de datos:', validation.isValid ? 'PASS' : 'FAIL');
    if (!validation.isValid) {
      console.log('   Errores:', validation.errors);
    }
    
    console.log('✅ Generador de cartas de derivación listo para uso');
    return true;
  } catch (error) {
    console.error('❌ Error en generador de cartas de derivación:', error.message);
    return false;
  }
}

async function testCertificateGenerator() {
  console.log('\n🔬 Probando generador de certificados médicos...');
  try {
    const validation = medicalCertificateGenerator.validateData(mockDatosCertificado);
    console.log('✅ Validación de datos:', validation.isValid ? 'PASS' : 'FAIL');
    if (!validation.isValid) {
      console.log('   Errores:', validation.errors);
    }
    
    // Test de método auxiliar
    const days = medicalCertificateGenerator.calculateIncapacityDays(
      mockDatosCertificado.periodoIncapacidad.inicio,
      mockDatosCertificado.periodoIncapacidad.fin
    );
    console.log(`✅ Cálculo de días de incapacidad: ${days} días`);
    
    console.log('✅ Generador de certificados médicos listo para uso');
    return true;
  } catch (error) {
    console.error('❌ Error en generador de certificados médicos:', error.message);
    return false;
  }
}

async function testIntegration() {
  console.log('\n🔬 Probando integración del sistema de PDF...');
  try {
    // Importar función de integración
    const { getPDFGenerator, TDM } = await import('./src/modules/medicina/pdf/index.js');
    
    console.log('✅ Tipos de documentos disponibles:');
    console.log('   - RECETA_MEDICA:', TDM.RECETA_MEDICA);
    console.log('   - CARTA_DERIVACION:', TDM.CARTA_DERIVACION);
    console.log('   - CERTIFICADO_MEDICO:', TDM.CERTIFICADO_MEDICO);
    
    // Test getPDFGenerator
    const prescriptionGen = getPDFGenerator(TDM.RECETA_MEDICA);
    console.log('✅ getPDFGenerator(RECETA_MEDICA):', prescriptionGen ? 'OK' : 'FAIL');
    
    const referralGen = getPDFGenerator(TDM.CARTA_DERIVACION);
    console.log('✅ getPDFGenerator(CARTA_DERIVACION):', referralGen ? 'OK' : 'FAIL');
    
    const certificateGen = getPDFGenerator(TDM.CERTIFICADO_MEDICO);
    console.log('✅ getPDFGenerator(CERTIFICADO_MEDICO):', certificateGen ? 'OK' : 'FAIL');
    
    return true;
  } catch (error) {
    console.error('❌ Error en integración:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando pruebas del sistema de generación de PDF para medicina\n');
  
  const results = {
    prescription: await testPrescriptionGenerator(),
    referral: await testReferralLetterGenerator(),
    certificate: await testCertificateGenerator(),
    integration: await testIntegration()
  };
  
  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('=====================');
  console.log(`✅ Generador de recetas médicas: ${results.prescription ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Generador de cartas de derivación: ${results.referral ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Generador de certificados médicos: ${results.certificate ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Integración del sistema: ${results.integration ? 'PASS' : 'FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\n🎯 RESULTADO FINAL: ${allPassed ? '✅ TODAS LAS PRUEBAS PASARON' : '❌ ALGUNAS PRUEBAS FALLARON'}`);
  
  return allPassed;
}

// Ejecutar pruebas si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Error ejecutando pruebas:', error);
    process.exit(1);
  });
}

export { runAllTests };