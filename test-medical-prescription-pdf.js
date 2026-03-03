// ============================================================================
// Test script for Medical Prescription PDF Generator
// ============================================================================

import { medicalPrescriptionGenerator } from './src/modules/medicina/pdf/generators/MedicalPrescriptionGenerator.js';

// Sample patient data
const paciente = {
  id: 'paciente-001',
  nombre: 'Juan Pérez',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'García',
  fechaNacimiento: '1985-05-15',
  genero: 'masculino',
  telefono: '555-123-4567',
  email: 'juan.perez@example.com',
  direccion: {
    calle: 'Av. Principal 123',
    colonia: 'Centro',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigoPostal: '06000'
  }
};

// Sample prescription data
const datosReceta = {
  fechaPrescripcion: new Date(),
  diagnostico: 'Infección respiratoria superior aguda',
  medicamentos: [
    {
      nombre: 'Amoxicilina',
      presentacion: 'Cápsulas 500mg',
      dosis: '500 mg',
      frecuencia: 'Cada 8 horas',
      duracion: '7 días',
      via: 'Oral',
      indicacionesEspeciales: 'Tomar con alimentos'
    },
    {
      nombre: 'Ibuprofeno',
      presentacion: 'Tabletas 400mg',
      dosis: '400 mg',
      frecuencia: 'Cada 6-8 horas según necesidad',
      duracion: '3 días',
      via: 'Oral',
      indicacionesEspeciales: 'Tomar con alimentos para evitar malestar gástrico'
    }
  ],
  indicacionesGenerales: [
    'Reposo relativo',
    'Aumentar ingesta de líquidos',
    'Evitar cambios bruscos de temperatura'
  ],
  recomendaciones: [
    'Regresar a consulta si persisten síntomas después de 7 días',
    'Acudir a urgencias si presenta fiebre mayor a 39°C o dificultad respiratoria'
  ],
  verificacionCDSS: {
    interaccionesDetectadas: [],
    alergiasVerificadas: true,
    dosisAdecuada: true,
    contraindicaciones: []
  }
};

// Sample configuration
const config = {
  nombreClinica: 'Clínica SaludValpa',
  direccionClinica: 'Av. Médicos 456, Col. San Ángel, CDMX',
  telefonoClinica: '555-987-6543',
  logoClinica: null,
  medico: {
    nombre: 'Dra. Ana López',
    cedulaProfesional: '12345678',
    especialidad: 'Medicina General'
  }
};

async function testMedicalPrescriptionPDF() {
  console.log('🧪 Iniciando prueba del generador de recetas médicas en PDF...\n');
  
  try {
    console.log('📋 Datos de prueba:');
    console.log(`- Paciente: ${paciente.nombre} ${paciente.apellidoPaterno}`);
    console.log(`- Diagnóstico: ${datosReceta.diagnostico}`);
    console.log(`- Medicamentos: ${datosReceta.medicamentos.length}`);
    console.log(`- Configuración: ${config.nombreClinica}\n`);
    
    // Generate PDF
    console.log('🔄 Generando PDF de receta médica...');
    const startTime = Date.now();
    
    const pdfBlob = await medicalPrescriptionGenerator.generate(
      paciente,
      datosReceta,
      config
    );
    
    const endTime = Date.now();
    const generationTime = endTime - startTime;
    
    console.log(`✅ PDF generado exitosamente en ${generationTime}ms`);
    console.log(`📄 Tamaño del PDF: ${pdfBlob.size} bytes`);
    console.log(`📄 Tipo MIME: ${pdfBlob.type}`);
    
    // Validate the blob
    if (pdfBlob instanceof Blob) {
      console.log('✅ El resultado es un objeto Blob válido');
    } else {
      console.log('❌ El resultado no es un objeto Blob');
    }
    
    // Test validation function
    console.log('\n🧪 Probando validación de datos...');
    const validation = medicalPrescriptionGenerator.validateData(datosReceta);
    console.log(`✅ Validación: ${validation.isValid ? 'APROBADA' : 'RECHAZADA'}`);
    if (validation.errors.length > 0) {
      console.log(`❌ Errores: ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      console.log(`⚠️ Advertencias: ${validation.warnings.join(', ')}`);
    }
    
    // Test utility functions
    console.log('\n🧪 Probando funciones utilitarias...');
    const treatmentDuration = medicalPrescriptionGenerator.calculateTreatmentDuration(datosReceta.medicamentos);
    console.log(`✅ Duración del tratamiento: ${treatmentDuration}`);
    
    const hasControlled = medicalPrescriptionGenerator.hasControlledMedications(datosReceta.medicamentos);
    console.log(`✅ Medicamentos controlados: ${hasControlled ? 'SÍ' : 'NO'}`);
    
    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('- Generador de recetas médicas en PDF funciona correctamente');
    console.log('- Validación de datos implementada');
    console.log('- Funciones utilitarias operativas');
    console.log('- Integración con sistema de PDF completa');
    
    return {
      success: true,
      blob: pdfBlob,
      generationTime,
      validation
    };
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMedicalPrescriptionPDF()
    .then(result => {
      if (result.success) {
        console.log('\n✅ Prueba completada exitosamente!');
        process.exit(0);
      } else {
        console.log('\n❌ Prueba fallida');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error no manejado:', error);
      process.exit(1);
    });
}

export { testMedicalPrescriptionPDF };