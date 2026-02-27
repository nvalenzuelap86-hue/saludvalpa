# SaludValpa.app - Especificación de Producto y Flujo de Usuario

## Documento para Diseñadores y Product Managers

### Visión del Producto
SaludValpa.app es una plataforma profesional todo-en-uno diseñada específicamente para profesionales de la salud que buscan simplificar su gestión diaria, automatizar tareas repetitivas y enfocarse en lo que realmente importa: sus pacientes.

## 1. Personas y Segmentos Objetivo

### Persona Principal: Profesional de la Salud Independiente
**Características**:
- Edad: 28-55 años
- Formación: Licenciatura o especialidad en salud
- Contexto laboral: Consultorio privado, clínica pequeña, práctica independiente
- Volumen: 5-50 pacientes activos
- Necesidad tecnológica: Media-alta, pero con limitaciones de tiempo

**Pain Points**:
1. Gestión manual de pacientes en papel o Excel
2. Tiempo excesivo en documentación administrativa
3. Dificultad para mantener historiales organizados
4. Pérdida de ingresos por falta de seguimiento de pagos
5. Desorganización en agenda de citas

**Goals**:
1. Reducir tiempo administrativo en 50%
2. Mejorar experiencia del paciente
3. Aumentar ingresos mediante mejor seguimiento
4. Cumplir normativas de documentación
5. Acceder a información desde cualquier lugar

### Persona Secundaria: Profesional en Transición Digital
**Características**:
- Menos experiencia tecnológica
- Necesita guía paso a paso
- Prefiere soluciones simples y confiables
- Valora soporte humano disponible

## 2. Mapa de Experiencia del Usuario (User Journey Map)

### Fase 0: Descubrimiento (Día 0)
**Touchpoints**:
- Búsqueda en Google: "software gestión pacientes"
- Recomendación de colegas
- Redes sociales profesionales

**Emociones**: Curiosidad, escepticismo, esperanza
**Puntos de dolor**: Sobrecarga de opciones, desconfianza en soluciones digitales

### Fase 1: Primer Contacto (Minutos 0-5)
**Touchpoint**: Landing Page (saludvalpa.app)

**Objetivos de diseño**:
- Comunicar valor rápidamente (menos de 5 segundos)
- Establecer confianza (estadísticas, testimonios implícitos)
- Guiar hacia acción clara (Comenzar Gratis)

**Métricas de éxito**:
- Tasa de rebote < 40%
- Tiempo en página > 1 minuto
- CTR en "Comenzar Gratis" > 15%

### Fase 2: Onboarding (Minutos 5-15)
**Touchpoints**: 4 pasos guiados

**Principios de diseño**:
1. **Progreso visible**: Barra de progreso siempre visible
2. **Carga cognitiva mínima**: Un concepto por pantalla
3. **Retroalimentación inmediata**: Confirmaciones visuales
4. **Salida fácil**: Puede pausar y retomar

**Pasos del onboarding**:
1. **Bienvenida** → Establece expectativas, muestra valor
2. **Selección de especialidad** → Personalización temprana
3. **Perfil profesional** → Información esencial mínima
4. **Completado** → Celebración, siguiente paso claro

### Fase 3: Primer Valor (Minutos 15-30)
**Touchpoint**: Dashboard principal

**Objetivos de diseño**:
- Demostrar valor inmediato (estadísticas, accesos rápidos)
- Guiar hacia primera acción exitosa (crear paciente)
- Reducir ansiedad de "pantalla vacía"

**Patrones de onboarding contextual**:
- Tooltips en elementos importantes
- Tour interactivo opcional
- Ejemplos pre-cargados según especialidad

### Fase 4: Uso Regular (Días 1-7)
**Touchpoints**: Módulos principales

**Flujos de trabajo comunes**:
1. **Nuevo paciente** → Historia clínica → Primera cita → Documentos
2. **Cita programada** → Recordatorio → Check-in → Nota de sesión → Pago
3. **Seguimiento mensual** → Reportes → Planificación → Facturación

### Fase 5: Adopción Avanzada (Semanas 2-4)
**Touchpoints**: Funcionalidades avanzadas

**Activación de características**:
- Biblioteca de contenidos (semana 2)
- Rutinas personalizadas (semana 3)
- Sincronización en nube (semana 4)
- Branding personalizado (cuando esté listo)

## 3. Arquitectura de Información

### Estructura de Navegación
```
Nivel 1 (Principal)
├── Dashboard (Inicio)
├── Pacientes
├── Agenda
├── Economía
└── Más
    ├── Biblioteca* (licencia)
    ├── Rutinas* (licencia)
    ├── Documentos
    ├── Configuración
    ├── Acerca de SaludValpa
    └── Activar Licencia*
```

*Funcionalidades que requieren licencia

### Jerarquía de Contenido por Especialidad
```
Medicina General
├── Pacientes
│   ├── Historia clínica médica
│   ├── Recetas médicas
│   └── Certificados
├── Agenda
│   ├── Consultas
│   └── Procedimientos
└── Documentos
    ├── Formatos médicos
    └── Reportes

Fisioterapia
├── Pacientes
│   ├── Evaluación fisioterapéutica
│   └── Plan de tratamiento
├── Biblioteca* (licencia)
│   ├── Ejercicios
│   ├── Educación
│   └── Cuidados
└── Rutinas* (licencia)
    ├── Crear rutina
    ├── Asignar a paciente
    └── Seguimiento

[Estructuras similares para otras especialidades]
```

## 4. Principios de Diseño de Interfaz

### Sistema de Diseño SaludValpa
**Paleta de colores**:
- Primario: `#2C5D7D` (SaludValpa Blue) - Confianza, profesionalismo
- Secundario: `#5FB4B4` (SaludValpa Teal) - Salud, calma
- Acento: `#9BCB56` (SaludValpa Lime) - Crecimiento, vitalidad
- Neutrales: Escala de grises con suficiente contraste

**Tipografía**:
- Primaria: Inter (sans-serif) - Legibilidad excelente
- Tamaños: Sistema de escala modular (1.25 ratio)
- Pesos: Regular (400), Medium (500), Semibold (600), Bold (700)

**Espaciado**:
- Unidad base: 4px
- Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

**Componentes**:
- Sistema de diseño atómico (átomos → moléculas → organismos)
- Biblioteca de componentes en `src/components/shared/`
- Estados consistentes para todos los componentes

### Patrones de Interacción
1. **Formularios**:
   - Validación en tiempo real
   - Mensajes de error específicos
   - Guardado automático donde aplica
   - Progreso en formularios largos

2. **Listados**:
   - Búsqueda y filtros visibles
   - Ordenamiento por columnas clicables
   - Vista tarjeta/lista intercambiable
   - Acciones rápidas por elemento

3. **Modales**:
   - Foco en tarea única
   - Acciones primarias claras
   - Cierre fácil (ESC, click fuera)
   - Transiciones suaves

4. **Feedback**:
   - Toast notifications para acciones exitosas
   - Alertas para advertencias importantes
   - Confirmaciones para acciones destructivas
   - Estados de carga contextuales

## 5. Flujos de Usuario Críticos

### Flujo 1: Registro de Nuevo Paciente
**Objetivo**: Capturar información esencial en menos de 2 minutos

**Pasos**:
1. Click "Nuevo Paciente" en dashboard o módulo Pacientes
2. Modal con pestañas:
   - Información básica (nombre, teléfono, email) → REQUERIDO
   - Datos demográficos (edad, género, ocupación) → OPCIONAL
   - Antecedentes médicos → OPCIONAL (especialidad-dependiente)
3. Validación en tiempo real
4. Confirmación y opciones de siguiente paso:
   - Agendar primera cita
   - Completar historia clínica
   - Volver a listado

**Consideraciones de diseño**:
- Formulario progresivo (no abrumar)
- Campos inteligentes (autocompletado donde aplica)
- Plantillas por especialidad

### Flujo 2: Agendamiento de Cita
**Objetivo**: Programar cita en menos de 1 minuto

**Pasos**:
1. Desde múltiples puntos de entrada:
   - Dashboard (acceso rápido)
   - Perfil de paciente ("Nueva cita")
   - Módulo Agenda ("Nueva cita")
2. Modal con:
   - Selección de paciente (búsqueda rápida)
   - Fecha y hora (calendario interactivo)
   - Tipo de consulta (dropdown con opciones comunes)
   - Notas opcionales
3. Confirmación con:
   - Resumen de cita
   - Opción de enviar recordatorio
   - Acceso a generar documentación previa

**Patrones de UI**:
- Calendario visual con disponibilidad
- Sugerencias de horarios comunes
- Prevención de conflictos

### Flujo 3: Generación de Documento
**Objetivo**: Crear documento profesional en menos de 3 minutos

**Pasos**:
1. Seleccionar tipo de documento desde:
   - Perfil de paciente ("Generar documento")
   - Módulo Documentos ("Nuevo documento")
   - Dashboard (accesos rápidos por especialidad)
2. Formulario contextual:
   - Campos pre-llenados (paciente, profesional, fecha)
   - Contenido específico por tipo de documento
   - Opciones de formato y estilo
3. Vista previa en tiempo real
4. Opciones de exportación:
   - Descargar PDF
   - Compartir por email
   - Imprimir directamente
   - Guardar en historial

**Características especiales**:
- Plantillas profesionales por especialidad
- Campos inteligentes (calculados automáticamente)
- Firma digital integrada
- Marcado de agua en versión gratuita

### Flujo 4: Activación de Licencia
**Objetivo**: Convertir usuario gratuito en premium sin fricción

**Pasos**:
1. Punto de entrada contextual:
   - Al intentar acceder a función premium
   - Desde alerta de límite alcanzado
   - Desde menú de configuración
2. Pantalla de activación:
   - Explicación clara de beneficios
   - Campo para código de licencia
   - Validación en tiempo real
   - Opciones de obtención de licencia (link externo)
3. Activación instantánea:
   - Feedback visual de éxito
   - Desbloqueo inmediato de funciones
   - Tour de nuevas funcionalidades

**Principios de conversión**:
- No interrumpir flujo de trabajo
- Mostrar valor antes de pedir pago
- Proceso simple y rápido

## 6. Sistema de Licencias y Modelo de Negocio

### Estrategia de Monetización
**Freemium perpetuo**:
- Base: Siempre gratis con funcionalidades esenciales
- Premium: Pago único o suscripción anual por funciones avanzadas

**Límites de versión gratuita**:
1. **Pacientes**: Máximo 5 (sin eliminación)
2. **Biblioteca**: No disponible
3. **Rutinas**: No disponible
4. **Sincronización nube**: No disponible
5. **Branding**: Marcado de agua en documentos
6. **Exportación**: Básica (PDF sin personalización avanzada)

**Beneficios de licencia**:
1. **Pacientes ilimitados** con gestión completa
2. **Biblioteca completa** de contenidos por especialidad
3. **Sistema de rutinas** personalizadas
4. **Sincronización en nube** multi-dispositivo
5. **Branding personalizado** completo
6. **Exportación avanzada** (Excel, CSV, PDF personalizado)
7. **Soporte prioritario** por email y chat

### Puntos de Conversión
**Naturales** (usuario los busca):
- Al alcanzar límite de 5 pacientes
- Al necesitar biblioteca de contenidos
- Al querer usar en múltiples dispositivos

**Inducidos** (sistema los sugiere):
- Después de 7 días de uso consistente
- Al usar funciones básicas frecuentemente
- Al exportar varios documentos

**Emocionales** (valor percibido):
- Después de ahorrar tiempo significativo
- Al mejorar experiencia de pacientes
- Al generar ingresos adicionales mediante mejor gestión

## 7. Métricas y KPIs del Producto

### Métricas de Salud del Producto
**Adquisición**:
- Visitas únicas a landing page
- Tasa de conversión a registro (landing → onboarding)
- Costo por adquisición (CPA)

**Activación**:
- Tasa de completitud de onboarding (% que completa los 4 pasos)
- Tiempo hasta primer valor (minutos hasta crear primer paciente)
- % que crea paciente en primera sesión

**Retención**:
- Retención D1, D7, D30 (% que regresa después de X días)
- Frecuencia de uso (sesiones por semana)
- Profundidad de uso (módulos utilizados)

**Conversión**:
- Tasa de conversión a licencia (% de usuarios gratuitos que pagan)
- Tiempo hasta conversión (días desde registro hasta pago)
- Valor de vida del cliente (LTV)

**Satisfacción**:
- Net Promoter Score (NPS)
- Calificación en tiendas de aplicaciones
- Tasa de abandono (churn)

### Puntos de Medición Técnicos
**Performance**:
- Tiempo de carga inicial (objetivo: < 3s)
- Tiempo de interacción (objetivo: < 100ms)
- Tasa de error (objetivo: < 0.1%)

**Usabilidad**:
- Tarea completada con éxito (%)
- Tiempo para completar tareas clave
- Errores por tarea

**Accesibilidad**:
- Puntuación Lighthouse (objetivo: > 90)
- Compatibilidad con lectores de pantalla
- Cumplimiento WCAG 2.1 AA

## 8. Consideraciones de Experiencia de Usuario

### Onboarding Progresivo
**Nivel 1 (Día 1)**: Funciones básicas
- Crear paciente, agendar cita, generar documento básico

**Nivel 2 (Semana 1)**: Funciones intermedias
- Historia clínica completa, seguimiento económico, múltiples documentos

**Nivel 3 (Mes 1)**: Funciones avanzadas
- Biblioteca, rutinas, reportes avanzados, personalización

**Nivel 4 (Continuo)**: Maestría
- Flujos de trabajo personalizados, automatizaciones, integraciones

### Reducción de Fricción
**Técnicas implementadas**:
1. **Guardado automático**: No perder trabajo nunca
2. **Plantillas inteligentes**: Reducir entrada manual
3. **Valores predeterminados**: Basados en especialidad y uso previo
4. **Accesos rápidos**: Atajos a acciones frecuentes
5. **Búsqueda omnipresente**: Encontrar cualquier cosa rápidamente

### Gestión de Errores
**Enfoque proactivo**:
- Validación antes de enviar
- Sugerencias de corrección
- Ejemplos claros de formato esperado
- Opción de "deshacer" para acciones importantes

**Enfoque reactivo**:
- Mensajes de error claros y constructivos
- Soluciones sugeridas
- Acceso a ayuda contextual
- Registro de errores para mejora continua

## 9. Roadmap de Experiencia de Usuario

### Fase Actual (Q1 2026): Fundación
- ✅ Onboarding simplificado de 4 pasos
- ✅ Dashboard unificado con estadísticas
- ✅ Sistema de licencias básico
- ✅ Módulos principales estables

### Fase 2 (Q2 2026): Personalización
- Tour interactivo para nuevos usuarios
- Plantillas personalizables de documentos
- Preferencias de flujo de trabajo por usuario
- Temas visuales adicionales

### Fase 3 (Q3 2026): Automatización
- Recordatorios automáticos inteligentes
- Plantillas de mensajes para pacientes
- Flujos de trabajo automatizados por especialidad
- Integración con calendarios externos

### Fase 4 (Q4 2026): Inteligencia
