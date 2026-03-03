# 📄 GUÍA RÁPIDA: USO DEL GENERADOR DE PDF PARA MEDICINA

## 🚀 Instrucciones Simplificadas

### 1. **Importar el Sistema de PDF**
```typescript
// En cualquier componente de medicina:
import { 
  medicalPrescriptionGenerator,
  medicalReferralLetterGenerator, 
  medicalCertificateGenerator,
  getPDFGenerator,
  TDM // TipoDocumentoMedico
} from '../pdf';
```

### 2. **Generar una Receta Médica (Ejemplo más común)**
```typescript
// 1. Preparar datos del paciente
const paciente = {
  id: '123',
  nombre: 'Juan',
  apellidos: 'Pérez',
  edad: 35,
  genero: 'masculino'
};

// 2. Preparar datos de la receta
const datosReceta = {
  fechaReceta: '2026-03-03',
  diagnostico: ['Hipertensión arterial'],
  medicamentos: [{
    nombre: 'Losartán',
    presentacion: 'tabletas 50 mg',
    dosis: '1 tableta',
    frecuencia: 'cada 24 horas',
    duracion: '30 días',
    via: 'oral'
  }],
  indicacionesGenerales: ['Controlar presión arterial diariamente'],
  recomendaciones: ['Seguir dieta baja en sodio']
};

// 3. Obtener configuración (normalmente del store)
const config = useAppStore.getState().configuracion;

// 4. Generar PDF
const pdfBlob = await medicalPrescriptionGenerator.generate(
  paciente,
  datosReceta,
  config,
  { includeQRCode: true, includeWatermark: true }
);

// 5. Descargar o guardar
descargarArchivo(pdfBlob, 'Receta_Medica_Juan_Perez.pdf');
```

### 3. **Usar el Sistema Unificado (Recomendado)**
```typescript
// Método más simple para cualquier documento
import { generarDocumentoMedico, TDM } from '../pdf';

const pdfBlob = await generarDocumentoMedico(
  TDM.RECETA_MEDICA,    // Tipo de documento
  paciente,             // Datos del paciente
  datosReceta,          // Datos específicos
  config,               // Configuración
  { includeQRCode: true } // Opciones
);
```

### 4. **Tipos de Documentos Disponibles**
```typescript
// Usar estas constantes:
TDM.RECETA_MEDICA           // Receta médica
TDM.CARTA_DERIVACION        // Carta de derivación a especialista  
TDM.CERTIFICADO_MEDICO      // Certificado médico (incapacidad, aptitud, etc.)
// Próximamente:
TDM.ORDEN_LABORATORIO      // Orden de laboratorio
TDM.NOTA_SOAP              // Nota SOAP
TDM.HISTORIA_CLINICA_MEDICA // Historia clínica completa
```

### 5. **Validar Datos Antes de Generar**
```typescript
import { validateDocumentData, TDM } from '../pdf';

// Validar antes de generar
const resultadoValidacion = validateDocumentData(
  TDM.RECETA_MEDICA,
  datosReceta
);

if (!resultadoValidacion.isValid) {
  console.error('Errores:', resultadoValidacion.errors);
  return;
}
```

## 📋 Ejemplos Prácticos por Tipo de Documento

### A. **Receta Médica**
```typescript
const datos = {
  fechaReceta: '2026-03-03',
  diagnostico: ['Diabetes mellitus tipo 2'],
  medicamentos: [{
    nombre: 'Metformina',
    presentacion: 'tabletas 850 mg',
    dosis: '1 tableta',
    frecuencia: 'cada 12 horas',
    duracion: '30 días',
    via: 'oral',
    indicacionesEspeciales: 'Tomar con alimentos'
  }],
  indicacionesGenerales: [
    'Controlar glucosa en ayunas',
    'Realizar ejercicio moderado'
  ],
  recomendaciones: ['Consulta con nutrición en 1 mes']
};
```

### B. **Carta de Derivación**
```typescript
const datos = {
  fechaDerivacion: '2026-03-03',
  especialista: 'Dr. Cardiología',
  especialidad: 'Cardiología',
  institucion: 'Hospital General',
  motivoDerivacion: 'Evaluación de arritmia',
  resumenClinico: 'Paciente con palpitaciones frecuentes...',
  nivelUrgencia: 'prioritario' // 'rutinario' | 'prioritario' | 'urgente'
};
```

### C. **Certificado Médico**
```typescript
const datos = {
  fechaEmision: '2026-03-03',
  tipoCertificado: 'incapacidad_laboral', // 'aptitud' | 'salud' | etc.
  diagnostico: ['Lumbalgia aguda'],
  periodoIncapacidad: {
    inicio: '2026-03-03',
    fin: '2026-03-10'
  },
  recomendaciones: ['Reposo relativo', 'Aplicar calor local']
};
```

## ⚡ Opciones de Configuración
```typescript
const opciones = {
  includeQRCode: true,      // Incluir código QR (default: true)
  includeWatermark: true,   // Incluir marca de agua (default: true)
  language: 'es',           // Idioma: 'es' | 'en' (default: 'es')
  paperSize: 'A4',          // Tamaño: 'A4' | 'letter' (default: 'A4')
  orientation: 'portrait'   // Orientación: 'portrait' | 'landscape'
};
```

## 🛠️ Utilidades Adicionales

### 1. **Obtener Generador por Tipo**
```typescript
const generator = getPDFGenerator(TDM.RECETA_MEDICA);
// generator será medicalPrescriptionGenerator
```

### 2. **Usar Utilidades de Formato**
```typescript
import { PDFMedicalUtils } from '../pdf';

const utils = new PDFMedicalUtils();
const textoFormateado = utils.wrapText(pdf, 'Texto largo', 150);
```

### 3. **Nombres y Descripciones para UI**
```typescript
import { NOMBRES_DOCUMENTOS, DESCRIPCIONES_DOCUMENTOS, ICONOS_DOCUMENTOS } from '../pdf';

// Para mostrar en interfaz:
const nombre = NOMBRES_DOCUMENTOS[TDM.RECETA_MEDICA]; // "Receta Médica"
const descripcion = DESCRIPCIONES_DOCUMENTOS[TDM.RECETA_MEDICA];
const icono = ICONOS_DOCUMENTOS[TDM.RECETA_MEDICA]; // "💊"
```

## 🚨 Errores Comunes y Soluciones

### **Error: "No se encontró configuración"**
```typescript
// Solución: Asegurarse de tener config
const config = useAppStore.getState().configuracion;
if (!config) {
  await useAppStore.getState().cargarConfiguracion();
}
```

### **Error: "Datos inválidos"**
```typescript
// Solución: Validar primero
const validacion = validateDocumentData(tipo, datos);
if (!validacion.isValid) {
  // Mostrar errores al usuario
  alert(validacion.errors.join(', '));
}
```

### **Error: "Tipo de documento no soportado"**
```typescript
// Solución: Usar constantes TDM
// ❌ MAL: getPDFGenerator('receta')
// ✅ BIEN: getPDFGenerator(TDM.RECETA_MEDICA)
```

## 📱 Integración con Componentes React

### **Componente Actualizado (GenerarRecetaMedica.tsx)**
El componente principal ya está actualizado. Solo necesita:
1. Datos del paciente
2. Datos de la receta  
3. Configuración de la app

### **Crear Nuevo Componente**
```typescript
import React from 'react';
import { generarDocumentoMedico, TDM } from '../pdf';

function MiComponentePDF({ paciente, datos, config }) {
  const generarPDF = async () => {
    try {
      const pdfBlob = await generarDocumentoMedico(
        TDM.RECETA_MEDICA,
        paciente,
        datos,
        config
      );
      // Procesar PDF...
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={generarPDF}>Generar PDF</button>;
}
```

## ✅ Checklist para Uso

1. [ ] **Importar** módulo PDF correctamente
2. [ ] **Tener** datos del paciente completos
3. [ ] **Preparar** datos específicos del documento
4. [ ] **Obtener** configuración de la app
5. [ ] **Validar** datos antes de generar
6. [ ] **Especificar** tipo de documento con `TDM`
7. [ ] **Manejar** errores y loading states
8. [ ] **Probar** con diferentes datos y configuraciones

## 🎯 Resumen de Flujo

```
1. IMPORTAR → from '../pdf'
2. PREPARAR → paciente + datos + config  
3. VALIDAR → validateDocumentData()
4. GENERAR → generarDocumentoMedico() o generator.generate()
5. PROCESAR → descargar/guardar el PDF blob
```

## 📞 Soporte y Referencia

- **Archivo principal**: `src/modules/medicina/pdf/index.ts`
- **Ejemplo implementado**: `GenerarRecetaMedica.tsx`
- **Tipos disponibles**: `types.ts`
- **Utilidades**: `utils.ts`
- **Generadores**: `generators/` directorio

El sistema está listo para producción y genera documentos médicos profesionales con formato específico para medicina, incluyendo características avanzadas como códigos QR, validación CDSS y branding personalizado.
