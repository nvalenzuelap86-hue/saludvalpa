# Documentación del Flujo de Usuario - SaludValpa.app

## Resumen Ejecutivo

Esta documentación completa describe el flujo de experiencia del usuario diseñado e implementado en SaludValpa.app versión 3.0. La documentación está organizada en tres documentos separados para diferentes audiencias, cubriendo todos los aspectos solicitados:

1. **Guía de Usuario** (`FLUJO_USUARIO_SALUDVALPA_GUIA_USUARIO.md`) - Para nuevos usuarios y equipo de soporte
2. **Guía de Desarrollador** (`FLUJO_USUARIO_SALUDVALPA_GUIA_DESARROLLADOR.md`) - Para el equipo de desarrollo
3. **Especificación de Producto** (`FLUJO_USUARIO_SALUDVALPA_ESPECIFICACION_PRODUCTO.md`) - Para diseñadores y product managers

## Contenido Cubierto

### 1. Mapa Completo del Viaje del Usuario
- **Fase 1**: Descubrimiento (Landing Page, selección de especialidad)
- **Fase 2**: Configuración inicial (Onboarding de 4 pasos)
- **Fase 3**: Uso diario (Dashboard, módulos principales)
- **Fase 4**: Funcionalidades avanzadas (con licencia)

### 2. Desglose Pantalla por Pantalla
- Landing Page (`/`) con 6 especialidades
- Onboarding de 4 pasos (`/onboarding`)
- Dashboard principal (`/app/dashboard`)
- Módulos: Pacientes, Agenda, Economía, Documentos
- Funcionalidades por especialidad (5 profesiones)

### 3. Interacciones Clave y Respuestas del Sistema
- Selección de especialidad → Personalización de experiencia
- Creación de paciente → Validación de límites (5 máximo en gratis)
- Generación de documentos → Plantillas por especialidad
- Activación de licencia → Desbloqueo instantáneo de funciones

### 4. Transiciones de Estado
- Estados: No inicializado → Sin onboarding → Onboarding en progreso → Onboarding completado
- Estados de licencia: Gratuita (siempre) → Pagada (opcional)
- Restricciones dinámicas basadas en estado de licencia

### 5. Caminos Específicos por Especialidad
- **Medicina General**: Recetas, historias clínicas médicas, certificados
- **Fisioterapia**: Evaluaciones, planes de tratamiento, biblioteca de ejercicios*
- **Psicología**: Notas de sesión, planes terapéuticos, escalas psicológicas
- **Odontología**: Odontograma, presupuestos, historias clínicas odontológicas
- **Nutrición**: Planes nutricionales, calculadoras, seguimiento

*Requiere licencia

### 6. Puntos de Integración de Licencia
- Verificación en LandingPage y Layout
- Modal `FeatureUnlockModal` para funciones bloqueadas
- Ruta `/app/activar-licencia` para activación
- Restricciones: 5 pacientes máximo, sin eliminación, sin biblioteca/rutinas
- Modelo freemium perpetuo (siempre gratis con límites)

### 7. Métricas de Éxito Definidas
- **Onboarding**: Tasa de completitud, tiempo hasta primer valor
- **Engagement**: Retención D1/D7/D30, frecuencia de uso
- **Conversión**: Tasa a licencia, tiempo hasta conversión
- **Satisfacción**: NPS, calificaciones, tasa de abandono
- **Técnicas**: Performance, accesibilidad, tasa de error

## Estructura Técnica Implementada

### Componentes Clave Analizados
1. **`LandingPage.tsx`** - Punto de entrada con selección de especialidad
2. **`Onboarding.tsx`** - Flujo de 4 pasos con estado persistente
3. **`App.tsx`** - Enrutamiento inteligente basado en estado
4. **`Layout.tsx`** - Navegación principal con estado de licencia
5. **`appStore.ts`** - Estado global con Zustand
6. **`licenseService.ts`** - Validación y gestión de licencias
7. **Módulos por especialidad** - Carga dinámica basada en profesión

### Flujo de Datos Documentado
- Inicialización: DB → Configuración → Redirección inteligente
- Onboarding: Datos → appStore → Base de datos local
- Licencias: Validación → Actualización estado → Aplicación restricciones
- Módulos: Carga dinámica según especialidad seleccionada

## Decisiones de Diseño Documentadas

### Modelo de Licencias
- **Versión gratuita**: Siempre disponible, 5 pacientes máximo, sin tiempo límite
- **Versión premium**: Pago único/anual, pacientes ilimitados, todas las funciones
- **Activación**: Opcional, en cualquier momento, sin pérdida de datos

### Experiencia de Onboarding
- **Simplificado**: 4 pasos esenciales (was 7+ en versiones anteriores)
- **Personalizado**: Según especialidad seleccionada
- **Sin fricción**: Puede saltarse pasos, guardado automático

### Navegación Responsive
- **Desktop**: Sidebar completa
- **Mobile**: Bottom navigation con 4 accesos principales
- **Progresiva**: Funciones avanzadas se revelan según competencia

## Próximos Pasos Recomendados

### Mejoras de Experiencia Inmediatas
1. **Tour interactivo** para nuevos usuarios
2. **Plantillas personalizables** de documentos
3. **Recordatorios automáticos** por SMS/email
4. **Integración con calendarios** externos

### Expansión de Especialidades
1. **Fase 2**: Medicina especializada (pediatría, ginecología)
2. **Fase 3**: Terapias alternativas
3. **Fase 4**: Veterinaria
4. **Fase 5**: Coaching y bienestar

### Métricas a Implementar
1. **Seguimiento de eventos** para análisis de flujos
2. **Feedback in-app** para recolección de insights
3. **A/B testing** para optimización de conversión

---

**Estado**: Documentación completa generada  
**Fecha**: Febrero 2026  
**Versión SaludValpa**: 3.0  
**Audiencias cubiertas**: Usuarios, desarrolladores, diseñadores, product managers

## Archivos Generados

1. `FLUJO_USUARIO_VALPA_GUIA_USUARIO.md` (Guía completa para usuarios)
2. `FLUJO_USUARIO_VALPA_GUIA_DESARROLLADOR.md` (Implementación técnica)
3. `FLUJO_USUARIO_VALPA_ESPECIFICACION_PRODUCTO.md` (Especificación de producto)
4. `README_DOCUMENTACION_FLUJO_USUARIO.md` (Este resumen ejecutivo)

La documentación está lista para revisión y puede servir como base para:
- Entrenamiento de nuevos usuarios
- Desarrollo de nuevas características
- Diseño de mejoras de experiencia
- Planificación de producto