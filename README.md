# SaludValpa - Sistema de Gestión Profesional para Salud y Belleza

**Tu movimiento, nuestra ciencia**

[![License](https://img.shields.io/badge/Licencia-Propietaria-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

Sistema de gestión profesional completo para Fisioterapeutas, Psicólogos, Manicuristas y profesionales de la salud y belleza. Aplicación web progresiva (PWA) que funciona 100% offline con almacenamiento local.

## 🎯 Características Principales

### 📋 Gestión de Pacientes
- Registro completo de pacientes con historial médico
- Fotos de perfil y documentación adjunta
- Seguimiento de tratamientos y progreso

### 📅 Agenda Inteligente
- 3 vistas: día, semana y mes
- Sistema de recordatorios configurables
- Bloqueo de horarios y disponibilidad
- Integración con temporizador de sesiones

### 💼 Sistema Económico
- Cotizaciones profesionales con múltiples servicios
- Generación de recibos y facturas
- Reportes financieros (ingresos, gastos, balances)
- Multi-moneda: MXN, USD, COP, EUR, ARS

### 📚 Biblioteca Profesional
- 12 recursos profesionales precargados
- Catálogo de ejercicios para fisioterapia
- Plantillas de documentos personalizables
- Sistema de categorías y etiquetas

### 📄 Documentación Digital
- Generación de 6 tipos de documentos PDF:
  - Historias clínicas
  - Consentimientos informados
  - Reportes de progreso
  - Planes de tratamiento
  - Recetas y prescripciones
  - Informes financieros
- Firmas digitales integradas
- Almacenamiento local seguro

### ⚙️ Sistema de Configuración Unificado (SaludValpa 3.0)
- **14 pestañas organizadas por funcionalidad:**
  - **General**: Perfil profesional, datos de contacto
  - **Branding**: Logo, colores, temas personalizables
  - **Preferencias**: Formato fecha, moneda, zona horaria
  - **Recordatorios**: Configuración de notificaciones
  - **Documentos**: Plantillas, firmas, formatos
  - **Respaldos**: Sistema automático de copias de seguridad
  - **Sincronización**: Integración con servicios en la nube
  - **Usuarios**: Gestión multi-usuario con permisos granulares
  - **Integraciones**: APIs, webhooks, servicios externos
  - **Seguridad**: 2FA, políticas de retención, encriptación
  - **Analíticas**: Métricas, dashboards, reportes
  - **Personalización Avanzada**: Temas personalizados, flujos de trabajo
  - **Instalación**: Guía PWA, optimizaciones
  - **Avanzado**: Operaciones del sistema, limpieza

- **Sistema de permisos por licencia:**
  - **Gratuita**: Funcionalidades básicas
  - **Pagada**: Branding completo, temas personalizados
  - **Enterprise**: Multi-usuario, analíticas avanzadas, integraciones

- **Características avanzadas:**
  - Migración automática de configuraciones existentes
  - Backup automático pre-migración
  - Sistema de rollback en caso de errores
  - Lazy loading para optimización de rendimiento
  - Caché inteligente para configuraciones frecuentes

### 📱 PWA (Progressive Web App)
- Instalable en desktop y móvil
- Funciona 100% offline
- Datos persisten localmente
- Service Worker para caching
- Actualizaciones automáticas

## 🚀 Tech Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19 | Framework UI |
| **TypeScript** | 5.0 | Tipado estático |
| **Vite** | 5.0 | Build tool y dev server |
| **Tailwind CSS** | 4.0 | Estilos y diseño |
| **Dexie.js** | 4.0 | Base de datos IndexedDB |
| **Zustand** | 5.0 | Gestión de estado |
| **React Router** | 7.0 | Navegación |
| **jsPDF + html2canvas** | Latest | Generación de PDFs |
| **Vite PWA Plugin** | Latest | Capacidades PWA |
| **Lucide React** | Latest | Iconos |

## 📦 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 18+ 
- npm 9+ o yarn 1.22+
- Git

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/nvalenzuelap86-hue/saludvalpa.git
cd saludvalpa

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run type-check` | Verifica tipos TypeScript |

## 🌐 Despliegue

### Netlify (Recomendado)
1. Conectar repositorio GitHub a Netlify
2. Configurar:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Variables de entorno (opcional)
4. Desplegar

### Vercel
1. Importar repositorio en Vercel
2. Configuración automática detectada
3. Desplegar

### GitHub Pages
```bash
# Build y deploy a GitHub Pages
npm run build
npm run deploy
```

## 📱 Uso como PWA

1. Visita la aplicación en tu navegador
2. Haz clic en "Instalar" o en el ícono de instalación
3. La aplicación se instalará como una app nativa
4. Funciona completamente offline

## 🔒 Privacidad y Seguridad

- **Sin backend**: Todos los datos se guardan localmente en tu dispositivo
- **Sin cloud**: No se envía ningún dato a servidores externos
- **100% privado**: Solo tú tienes acceso a tus datos
- **Encriptación**: Datos almacenados de forma segura
- **Respaldos locales**: Control total de tus datos

## 📚 Documentación

La documentación completa está disponible en el directorio `docs/`:

- [Guía de Usuario](docs/FLUJO_USUARIO_SALUDVALPA_GUIA_USUARIO.md) - Instrucciones detalladas para usuarios
- [Guía de Desarrollador](docs/FLUJO_USUARIO_SALUDVALPA_GUIA_DESARROLLADOR.md) - Documentación técnica
- [Guía de Despliegue](docs/AUTOMATED_DEPLOYMENT_GUIDE.md) - Instrucciones de despliegue
- [Especificación de Producto](docs/FLUJO_USUARIO_SALUDVALPA_ESPECIFICACION_PRODUCTO.md) - Requisitos y funcionalidades

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Revisa los [issues existentes](https://github.com/nvalenzuelap86-hue/saludvalpa/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Copyright © 2026 SaludValpa. Todos los derechos reservados.

Este software es propietario y no es de código abierto. Está prohibida la distribución, modificación o uso comercial sin autorización expresa.

## 🎉 Estado del Proyecto

**Versión: 3.0.0** - Estable y lista para producción

### ✅ Completado
- [x] Migración completa de Valpa a SaludValpa
- [x] 14 fases de desarrollo completadas
- [x] Testing exhaustivo
- [x] 0 bugs críticos
- [x] Performance optimizado
- [x] Configuración avanzada completa
- [x] Sistema multi-moneda
- [x] Recordatorios configurables
- [x] PWA instalable

### 🔄 Próximas Características
- [ ] Sincronización en la nube (opcional)
- [ ] API para integraciones
- [ ] App móvil nativa
- [ ] Más profesiones (nutriólogos, entrenadores)

---

**Desarrollado con ❤️ para profesionales de la salud y belleza.**

*SaludValpa - Tu movimiento, nuestra ciencia*
