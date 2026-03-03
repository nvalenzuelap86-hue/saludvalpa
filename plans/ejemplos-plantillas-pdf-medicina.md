# 🎨 Ejemplos Visuales de Plantillas PDF - Módulo de Medicina

## 📋 Introducción

Este documento muestra ejemplos visuales de cómo se verán las plantillas de PDF para los documentos médicos esenciales en el módulo de medicina de SaludValpa. Cada plantilla está diseñada para ser profesional, legible y cumplir con los requisitos normativos mexicanos.

## 🏥 1. Receta Médica (`RECETA_MEDICA`)

### **Estado**: ✅ Implementado

### **Diseño Visual**
```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLÍNICA MÉDICA SALUDVALPA                     │
│                   Dr. Juan Pérez Rodríguez                          │
│                   Cédula Profesional: 1234567                       │
│                                                                     │
│ Folio: REC-260302-4587                    Fecha: 02/03/2026        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ PACIENTE: María González López                                      │
│ Edad: 45 años • Sexo: Femenino • ID: PAC-001234                    │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ DIAGNÓSTICO                                                         │
│ Hipertensión arterial esencial (I10), Diabetes mellitus tipo 2      │
│ (E11.9)                                                             │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ MEDICAMENTOS PRESCRITOS                                             │
│                                                                     │
│ • Losartán 50 mg                                                    │
│   Presentación: Tabletas • Dosis: 1 tableta                         │
│   Frecuencia: Cada 24 horas • Vía: Oral                             │
│   Duración: 30 días • Indicaciones: Tomar en la mañana              │
│                                                                     │
│ • Metformina 850 mg                                                 │
│   Presentación: Tabletas • Dosis: 1 tableta                         │
│   Frecuencia: Cada 12 horas • Vía: Oral                             │
│   Duración: 30 días • Indicaciones: Con alimentos                   │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ INDICACIONES GENERALES                                              │
│ • Controlar presión arterial diariamente                            │
│ • Monitorear glucosa en ayunas                                      │
│ • Dieta baja en sodio y azúcares                                    │
│ • Ejercicio moderado 30 minutos/día                                 │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ PRÓXIMA CITA                                                        │
│ Fecha: 02/04/2026 - Control de presión y glucosa                    │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│                        _______________________                      │
│                        Firma del Médico                             │
│                                                                     │
│ Documento generado por SaludValpa • Válido por 30 días              │
└─────────────────────────────────────────────────────────────────────┘
```

### **Características Clave**
- **Integración con CDSS**: Verificación automática de interacciones medicamentosas
- **Código de barras**: Para farmacias (QR code con datos de la receta)
- **Firma digital**: Espacio para firma del médico
- **Folio único**: Para trazabilidad y control
- **Información completa**: Incluye diagnóstico, medicamentos, indicaciones

## 📨 2. Carta de Derivación/Referencia (`CARTA_DERIVACION`)

### **Estado**: 📋 Planificado

### **Diseño Visual**
```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLÍNICA MÉDICA SALUDVALPA                     │
│                   Dr. Juan Pérez Rodríguez                          │
│                   Medicina General                                  │
│                                                                     │
│ Folio: DER-260302-7890                    Fecha: 02/03/2026        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ A: Dr. Carlos Martínez - Cardiología                               │
│ Hospital General de la Ciudad, Piso 5, Consultorio 502             │
│ Tel: 555-987-6543 • Email: cardiologia@hospital.com                │
│                                                                     │
│ De: Dr. Juan Pérez Rodríguez - Medicina General                    │
│ Clínica SaludValpa, Av. Principal 123                              │
│ Tel: 555-123-4567 • Email: jperez@saludvalpa.com                   │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ DATOS DEL PACIENTE                                                  │
│                                                                     │
│ Nombre: María González López                                        │
│ Edad: 45 años • Sexo: Femenino • ID: PAC-001234                    │
│ Teléfono: 555-123-4567 • Email: maria.gonzalez@email.com           │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ MOTIVO DE LA REFERENCIA                                             │
│                                                                     │
│ Paciente con hipertensión arterial de difícil control a pesar de   │
│ tratamiento triple. Presiones arteriales persistentemente >160/100  │
│ mmHg. Requiere evaluación cardiológica completa.                   │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ RESUMEN CLÍNICO                                                     │
│                                                                     │
│ • Hipertensión diagnosticada hace 5 años                           │
│ • Tratamiento actual: Losartán 50 mg, Amlodipino 5 mg,             │
│   Hidroclorotiazida 25 mg                                           │
│ • Estudios previos: ECG normal, Eco abdominal sin hallazgos        │
│ • Comorbilidades: Diabetes mellitus tipo 2 controlada              │
│ • Alergias: Ninguna conocida                                        │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ ESTUDIOS SOLICITADOS                                                │
│                                                                     │
│ • Ecocardiograma transtorácico                                     │
│ • Monitoreo ambulatorio de presión arterial (MAPA)                 │
│ • Perfil lipídico completo                                         │
│ • Creatinina y filtrado glomerular                                 │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ URGENCIA: Moderada • Se solicita cita prioritaria                  │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│                        _______________________                      │
│                        Firma del Médico Referente                   │
│                                                                     │
│ Documento generado por SaludValpa • Copia al expediente            │
└─────────────────────────────────────────────────────────────────────┘
```

### **Características Clave**
- **Datos completos del especialista**: Nombre, especialidad, contacto
- **Resumen clínico estructurado**: Antecedentes, tratamiento, estudios
- **Nivel de urgencia**: Especificado claramente
- **Estudios solicitados**: Lista detallada
- **Información de contacto**: Para seguimiento

## 📜 3. Certificado Médico (`CERTIFICADO_MEDICO`)

### **Estado**: 📋 Planificado

### **Diseño Visual**
```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLÍNICA MÉDICA SALUDVALPA                     │
│                   Dr. Juan Pérez Rodríguez                          │
│                   Especialista en Medicina General                  │
│                   Cédula Profesional: 1234567                       │
│                   Registro SSA: ABC-123456-XYZ                      │
│                                                                     │
│ Folio: CERT-260302-1234                   Fecha: 02/03/2026        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         CERTIFICADO MÉDICO                          │
│                    DE INCAPACIDAD LABORAL                          │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│                                                                     │
│ El que suscribe, Dr. Juan Pérez Rodríguez, médico titulado con     │
│ cédula profesional 1234567, certifica que ha atendido a la         │
│ paciente María González López, con identificación PAC-001234, de    │
│ 45 años de edad, y después de una evaluación médica completa,      │
│ determina que:                                                      │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ DIAGNÓSTICO:                                                        │
│ • Infección respiratoria aguda (J06.9)                             │
│ • Fiebre de 38.5°C                                                  │
│ • Tos productiva                                                    │
│ • Malestar general                                                  │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ RECOMENDACIONES MÉDICAS:                                            │
│ • Reposo absoluto por 3 días (del 02/03/2026 al 04/03/2026)        │
│ • Hidratación abundante                                            │
│ • Tratamiento sintomático                                           │
│ • Evitar esfuerzos físicos                                          │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ FECHA DE REINCORPORACIÓN LABORAL: 05/03/2026                       │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ Este certificado se expide a petición de la interesada para los    │
│ fines que estime convenientes.                                      │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│                        _______________________                      │
│                        Firma y Sello del Médico                     │
│                                                                     │
│ Documento generado por SaludValpa • Válido con firma y sello       │
└─────────────────────────────────────────────────────────────────────┘
```

### **Tipos de Certificados**
1. **Certificado de incapacidad laboral**
2. **Certificado de aptitud física**
3. **Certificado de salud general**
4. **Certificado de vacunación**
5. **Certificado de enfermedad**

### **Características Clave**
- **Formato oficial**: Cumple con requisitos laborales
- **Diagnóstico codificado**: CIE-10 incluido
- **Período específico**: Fechas exactas de incapacidad
- **Sello profesional**: Espacio para sello del consultorio
- **Validez legal**: Información completa para validez

## 🧪 4. Orden de Laboratorio/Estudios (`ORDEN_LABORATORIO`)

### **Estado**: 📋 Planificado

### **Diseño Visual**
```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLÍNICA MÉDICA SALUDVALPA                     │
│                   Dr. Juan Pérez Rodríguez                          │
│                   Medicina General                                  │
│                                                                     │
│ Folio: LAB-260302-5678                    Fecha: 02/03/2026        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ PACIENTE: María González López                                      │
│ Edad: 45 años • Sexo: Femenino • ID: PAC-001234                    │
│ Teléfono: 555-123-4567 • Email: maria.gonzalez@email.com           │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ LABORATORIO DESTINO:                                                │
│ Laboratorio Clínico Central                                         │
│ Av. de los Estudios 456, Col. Diagnóstico                          │
│ Tel: 555-789-0123 • Horario: 7:00 - 20:00 hrs                      │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ ESTUDIOS SOLICITADOS                                                │
│                                                                     │
│ [X] BIOQUÍMICA SANGUÍNEA                                            │
│     • Glucosa en ayunas                                             │
│     • Hemoglobina glucosilada (HbA1c)                               │
│     • Perfil lipídico completo                                      │
│     • Función renal (creatinina, BUN)                               │
│     • Función hepática (transaminasas)                              │
│                                                                     │
│ [X] HEMATOLOGÍA                                                     │
│     • Hemograma completo                                            │
│     • Velocidad de sedimentación globular                           │
│                                                                     │
│ [X] EXAMEN GENERAL DE ORINA                                         │
│     • Con sedimento                                                 │
│                                                                     │
│ [ ] OTROS ESTUDIOS                                                  │
│     • TSH                                                           │
│     • Ácido úrico                                                   │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ PREPARACIÓN ESPECIAL                                                │
│                                                                     │
│ • Ayuno de 8-12 horas                                               │
│ • Suspender medicamentos antihipertensivos el día del estudio      │
│ • Traer estudios previos para comparación                           │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ JUSTIFICACIÓN CLÍNICA                                               │
│                                                                     │
│ Control de paciente con diabetes mellitus tipo 2 e hipertensión    │
│ arterial. Evaluación de control metabólico y función renal.        │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ URGENCIA: Rutina • Resultados en 24-48 horas                       │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│                        _______________________                      │
│                        Firma del Médico                             │
│                                                                     │
│ Documento generado por SaludValpa • Presentar en recepción         │
└─────────────────────────────────────────────────────────────────────┘
```

### **Características Clave**
- **Lista de estudios**: Con checkboxes para selección
- **Preparación especial**: Instrucciones claras
- **Laboratorio destino**: Información completa
- **Urgencia especificada**: Rutina/Urgente
- **Justificación clínica**: Para fines de auditoría

## 📝 5. Nota SOAP (`NOTA_SOAP`)

### **Estado**: 📋 Planificado

### **Diseño Visual**
```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLÍNICA MÉDICA SALUDVALPA                     │
│                   Dr. Juan Pérez Rodríguez                          │
│                   Medicina General                                  │
│                                                                     │
│ Folio: SOAP-260302-9012                   Fecha: 02/03/2026        │
│ Consulta: Control de hipertensión y diabetes                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ PACIENTE: María González López                                      │
│ Edad: 45 años • Sexo: Femenino • ID: PAC-001234                    │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ S - SUBJETIVO (Lo que el paciente refiere)                         │
│                                                                     │
│ • "Me siento bien, pero noto que la presión se me sube en las      │
│   tardes"                                                           │
│ • Refiere cefalea occipital leve ocasional                         │
│ • Control glucémico adecuado según automonitoreo                    │
│ • Cumple tratamiento farmacológico                                  │
│ • Sin otros síntomas                                                │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ O - OBJETIVO (Hallazgos del examen físico)                         │
│                                                                     │
│ • Signos vitales:                                                   │
│   - PA: 145/92 mmHg (brazo derecho, sentado)                       │
│   - FC: 78 lpm, regular                                             │
│   - FR: 16 rpm                                                      │
│   - Temp: 36.8°C                                                    │
│   - SatO2: 98%                                                      │
│                                                                     │
│ • Examen físico:                                                    │
│   - Peso: 68 kg (IMC: 26.2 - Sobrepeso)                            │
│   - Talla: 1.62 m                                                   │
│   - Cardiopulmonar: RCV sin soplos, RCP clear                      │
│   - Abdomen: blando, no doloroso, no masas                         │
│   - Extremidades: sin edemas                                        │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ A - ANÁLISIS (Evaluación y diagnóstico)                            │
│                                                                     │
│ • Hipertensión arterial grado 1, no controlada adecuadamente       │
│ • Diabetes mellitus tipo 2 en control aceptable (HbA1c: 7.2%)      │
│ • Sobrepeso grado I                                                 │
│ • Riesgo cardiovascular moderado                                    │
│                                                                     │
│ ────────────────────────────────────────────────────────────────── │
│ P - PLAN (Tratamiento y seguimiento)                               │
│                                                                     │
│ • Ajustar dosis de Losartán a 100 mg/día                           │
│ • Mantener Metformina 850 mg cada 12 horas                         │
│ • Iniciar terapia con Estatinas (Atorvastatina 20 mg/día)          │
│ • Recomendaciones no farmacológicas:                               │
│   - Dieta DASH (baja en sodio)                                     │
│   - Ejercicio aeróbico 150 min/semana                              │
│   - Reducción de peso 5% en 3 meses                                │
│ • Próxima cita: 02/04/2026                                         │
│ • Estudios solicitados: