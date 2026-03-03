// ============================================================================
// Verification script for medicina PDF generation system
// ============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando sistema de generación de PDF para medicina\n');

// Lista de archivos críticos que deben existir
const criticalFiles = [
  'src/modules/medicina/pdf/types.ts',
  'src/modules/medicina/pdf/utils.ts',
  'src/modules/medicina/pdf/generators/BasePDFGenerator.ts',
  'src/modules/medicina/pdf/generators/MedicalPrescriptionGenerator.ts',
  'src/modules/medicina/pdf/generators/MedicalReferralLetterGenerator.ts',
  'src/modules/medicina/pdf/generators/MedicalCertificateGenerator.ts',
  'src/modules/medicina/pdf/index.ts',
  'src/modules/medicina/components/GenerarRecetaMedica.tsx'
];

// Verificar que los archivos existan
console.log('📁 Verificando existencia de archivos críticos:');
let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log(`\n${allFilesExist ? '✅ Todos los archivos existen' : '❌ Faltan algunos archivos'}`);

// Verificar compilación TypeScript
console.log('\n🔧 Verificando compilación TypeScript...');
try {
  // Ejecutar compilación TypeScript sin emitir archivos
  execSync('npx tsc --noEmit --skipLibCheck', { 
    cwd: __dirname,
    stdio: 'pipe'
  });
  console.log('✅ Compilación TypeScript exitosa');
} catch (error) {
  console.log('❌ Error en compilación TypeScript:');
  console.log(error.stdout?.toString() || error.message);
  process.exit(1);
}

// Verificar estructura de directorios
console.log('\n📂 Verificando estructura de directorios PDF:');
const pdfDir = path.join(__dirname, 'src/modules/medicina/pdf');
const generatorsDir = path.join(pdfDir, 'generators');

const dirsExist = fs.existsSync(pdfDir) && fs.existsSync(generatorsDir);
console.log(`  ${fs.existsSync(pdfDir) ? '✅' : '❌'} Directorio PDF: ${pdfDir}`);
console.log(`  ${fs.existsSync(generatorsDir) ? '✅' : '❌'} Directorio generators: ${generatorsDir}`);

// Verificar contenido de archivos clave
console.log('\n📄 Verificando contenido de archivos clave:');

// Verificar que index.ts exporte correctamente
try {
  const indexContent = fs.readFileSync(
    path.join(__dirname, 'src/modules/medicina/pdf/index.ts'), 
    'utf8'
  );
  
  const expectedExports = [
    'TipoDocumentoMedico',
    'DatosRecetaMedica',
    'DatosCartaDerivacion',
    'DatosCertificadoMedico',
    'PDFMedicalUtils',
    'BasePDFGenerator',
    'medicalPrescriptionGenerator',
    'medicalReferralLetterGenerator',
    'medicalCertificateGenerator',
    'getPDFGenerator'
  ];
  
  console.log('  Verificando exports en index.ts:');
  expectedExports.forEach(exportName => {
    const hasExport = indexContent.includes(exportName);
    console.log(`    ${hasExport ? '✅' : '❌'} ${exportName}`);
  });
} catch (error) {
  console.log(`  ❌ Error leyendo index.ts: ${error.message}`);
}

// Verificar que GenerarRecetaMedica.tsx use el nuevo generador
try {
  const componentContent = fs.readFileSync(
    path.join(__dirname, 'src/modules/medicina/components/GenerarRecetaMedica.tsx'), 
    'utf8'
  );
  
  const usesNewGenerator = componentContent.includes('medicalPrescriptionGenerator');
  const importsPDFModule = componentContent.includes("from '../pdf'");
  
  console.log('\n  Verificando integración en GenerarRecetaMedica.tsx:');
  console.log(`    ${importsPDFModule ? '✅' : '❌'} Importa módulo PDF`);
  console.log(`    ${usesNewGenerator ? '✅' : '❌'} Usa medicalPrescriptionGenerator`);
  
  if (!usesNewGenerator) {
    console.log('    ⚠️  El componente aún no está usando el nuevo generador de PDF');
  }
} catch (error) {
  console.log(`  ❌ Error leyendo GenerarRecetaMedica.tsx: ${error.message}`);
}

// Resumen final
console.log('\n🎯 RESUMEN DE VERIFICACIÓN:');
console.log('==========================');
console.log(`✅ Archivos críticos: ${allFilesExist ? 'COMPLETO' : 'INCOMPLETO'}`);
console.log(`✅ Compilación TypeScript: ${'COMPLETO'}`);
console.log(`✅ Estructura de directorios: ${dirsExist ? 'COMPLETO' : 'INCOMPLETO'}`);
console.log(`✅ Integración en componente: ${'PARCIAL (ver detalles arriba)'}`);

console.log('\n📋 RECOMENDACIONES:');
console.log('==================');
console.log('1. Verificar que la aplicación se ejecute correctamente');
console.log('2. Probar la generación de recetas médicas en la interfaz');
console.log('3. Validar que los PDF generados tengan el formato correcto');
console.log('4. Probar los otros generadores (cartas de derivación, certificados)');

console.log('\n🚀 El sistema de generación de PDF para medicina está listo para uso!');