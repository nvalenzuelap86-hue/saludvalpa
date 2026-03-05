# API Reference - Sistema de Configuración Unificado
## SaludValpa 3.0 - Fase 4

**Versión:** 1.0  
**Fecha:** 5 de marzo de 2026  
**Audiencia:** Desarrolladores

---

## 📋 Introducción

Esta documentación describe la API del sistema de configuración unificado de SaludValpa 3.0. Incluye interfaces TypeScript, hooks, servicios y componentes disponibles para desarrolladores.

---

## 🏗️ Arquitectura General

### Estructura de Archivos

```
src/
├── pages/
│   └── ConfiguracionUnificada.tsx          # Componente principal
├── components/configuracion/
│   ├── tabs/                               # Pestañas individuales (14)
│   ├── LicenseGate.tsx                     # Control de acceso
│   ├── SectionCard.tsx                     # Contenedor de secciones
│   └── DangerZone.tsx                      # Operaciones peligrosas
├── hooks/
│   ├── useConfiguration.ts                 # Lógica de configuración
│   └── useLicenseCheck.ts                  # Verificación de licencia
├── services/
│   ├── backupService.ts                    # Sistema de respaldos
│   └── migrationService.ts                 # Servicio de migración
└── types/
    └── index.ts                            # Definiciones TypeScript
```

---

## 📦 Tipos TypeScript

### Interfaces Principales

#### Configuracion
```typescript
interface Configuracion {
  id: string; // Siempre '1' para singleton
  profesion: TipoProfesion;
  tipoCuenta: 'personal' | 'clinica';
  licencia: Licencia;
  branding: Branding;
  datosContacto: DatosContacto;
  preferencias: Preferencias;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
```

#### Branding
```typescript
interface Branding {
  logo?: string; // Base64
  nombreProfesional: string;
  nombreClinica?: string;
  credenciales?: string;
  especialidad?: string;
  colores: {
    primario: string;
    secundario: string;
    acento: string;
  };
  tema: 'saludvalpa' | 'minimalista' | 'profesional' | 'moderno' | 'personalizado';
  piePagina: string;
  mostrarMarcaDeAgua: boolean;
  formatoDocumentos: 'formal' | 'informal' | 'moderno';
}
```

#### Preferencias
```typescript
interface Preferencias {
  formatoFecha: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  zonaHoraria: string;
  idioma: 'es' | 'en';
  notificaciones: boolean;
  recordatorios: {
    habilitados: boolean;
    anticipacionCitas: number; // Minutos antes
    anticipacionDia: number; // Horas antes
    sonido: boolean;
  };
  agenda: {
    vistaInicial: 'dia' | 'semana' | 'mes';
    horaInicio: string; // Ej: "08:00"
    horaFin: string; // Ej: "20:00"
    duracionCitaDefault: number; // Minutos
  };
  economia: {
    moneda: string; // Ej: "MXN", "USD", "COP"
    mostrarImpuestos: boolean;
    iva: number; // Porcentaje
  };
}
```

#### Licencia
```typescript
interface Licencia {
  tipo: 'gratuita' | 'pagada' | 'enterprise';
  estado: 'activa' | 'expirada' | 'invalida';
  fechaExpiracion?: Date;
  codigo?: string;
  caracteristicasHabilitadas: string[];
}
```

### Tipos de Enumeración

```typescript
// Tipos de profesión
type TipoProfesion = 
  | 'fisioterapia'
  | 'psicologia'
  | 'nutricion'
  | 'medicina_general'
  | 'odontologia';

// Tipos de pestañas
type TabType = 
  | 'general'
  | 'branding'
  | 'preferencias'
  | 'recordatorios'
  | 'documentos'
  | 'respaldos'
  | 'sincronizacion'
  | 'usuarios'
  | 'integraciones'
  | 'seguridad'
  | 'analiticas'
  | 'personalizacion'
  | 'instalacion'
  | 'avanzada';
```

---

## 🪝 Hooks Personalizados

### useConfiguration

Hook principal para manejar la configuración del sistema.

```typescript
import useConfiguration from '../hooks/useConfiguration';

// Uso básico
const { 
  configuracion, 
  actualizarConfiguracion, 
  updateNestedField,
  isLoading,
  error 
} = useConfiguration();

// Métodos disponibles
interface UseConfigurationReturn {
  // Estado
  configuracion: Configuracion | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  actualizarConfiguracion: (config: Partial<Configuracion>) => Promise<void>;
  updateNestedField: <K extends keyof Configuracion>(
    section: K,
    field: string,
    value: any
  ) => Promise<void>;
  cargarConfiguracion: () => Promise<void>;
  reiniciarConfiguracion: () => Promise<void>;
}
```

#### Ejemplos de Uso

```typescript
// Actualizar configuración completa
await actualizarConfiguracion({
  branding: {
    ...configuracion.branding,
    nombreProfesional: 'Dr. Juan Pérez'
  }
});

// Actualizar campo anidado
await updateNestedField('preferencias', 'economia.moneda', 'USD');

// Cargar configuración
useEffect(() => {
  cargarConfiguracion();
}, []);
```

### useLicenseCheck

Hook para verificar permisos basados en licencia.

```typescript
import { useLicenseCheck } from '../components/configuracion/LicenseGate';

// Uso básico
const { 
  isPaid, 
  isEnterprise, 
  hasFeature,
  checkPermission 
} = useLicenseCheck();

// Métodos disponibles
interface UseLicenseCheckReturn {
  // Estado de licencia
  isPaid: boolean;
  isEnterprise: boolean;
  licenseType: 'gratuita' | 'pagada' | 'enterprise';
  
  // Verificaciones
  hasFeature: (feature: string) => boolean;
  checkPermission: (module: string, action: string) => boolean;
  requireLicense: (minLicense: 'pagada' | 'enterprise') => boolean;
}
```

#### Ejemplos de Uso

```typescript
// Verificar si tiene una característica
if (hasFeature('customBranding')) {
  // Mostrar opciones de branding personalizado
}

// Verificar permiso específico
const puedeEditarPacientes = checkPermission('pacientes', 'editar');

// Requerir licencia mínima
if (requireLicense('pagada')) {
  // Mostrar características premium
}
```

---

## 🔧 Servicios

### backupService.ts

Servicio para manejo de respaldos y migración.

#### Funciones Principales

```typescript
// Exportar/Importar datos
export async function exportarDatos(): Promise<RespaldoCompleto>;
export async function importarRespaldo(datos: RespaldoCompleto): Promise<ImportResult>;

// Backup automático para migración
export async function crearBackupAutomaticoMigracion(): Promise<BackupResult>;
export async function restaurarDesdeBackupMigracion(backupId: string): Promise<RestoreResult>;

// Gestión de backups
export function listarBackupsAutomaticos(): BackupMetadata[];
export function eliminarBackupAutomatico(backupId: string): boolean;
export async function verificarIntegridadBackup(backupId: string): Promise<IntegrityCheck>;

// Utilidades
export async function obtenerEstadisticasRespaldo(): Promise<BackupStats>;
export async function descargarRespaldo(): Promise<void>;
export async function importarRespaldoDesdeArchivo(file: File): Promise<ImportResult>;
```

#### Tipos Relacionados

```typescript
interface BackupResult {
  success: boolean;
  backupId: string;
  timestamp: Date;
  size: number;
  error?: string;
}

interface RestoreResult {
  success: boolean;
  message: string;
  restoredItems?: number;
}

interface BackupMetadata {
  backupId: string;
  timestamp: string;
  size: number;
  type: string;
  version: string;
}

interface IntegrityCheck {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata: any;
}
```

#### Ejemplos de Uso

```typescript
// Crear backup automático
const backup = await crearBackupAutomaticoMigracion();
if (backup.success) {
  console.log(`Backup creado: ${backup.backupId}`);
}

// Listar backups disponibles
const backups = listarBackupsAutomaticos();
backups.forEach(backup => {
  console.log(`${backup.backupId} - ${backup.timestamp}`);
});

// Restaurar desde backup
const restore = await restaurarDesdeBackupMigracion('backup-123456789');
if (restore.success) {
  alert(`Restaurados ${restore.restoredItems} items`);
}
```

### migrationService.ts

Servicio para migración de configuraciones.

```typescript
// Detectar necesidad de migración
export const detectarNecesidadMigracion = async (): Promise<MigrationDetection>;

// Ejecutar migración
export const ejecutarMigracionCompleta = async (): Promise<MigrationResult>;

// Tipos relacionados
interface MigrationDetection {
  necesitaMigracion: boolean;
  tipoMigracion: 'configuracion_avanzada' | 'preferencias' | 'ninguna';
  detalles: string;
}

interface MigrationResult {
  success: boolean;
  migratedItems: number;
  errors: string[];
  warnings: string[];
  backupId?: string;
}
```

---

## 🧩 Componentes

### ConfiguracionUnificada.tsx

Componente principal de configuración.

#### Props
```typescript
interface ConfiguracionUnificadaProps {
  // Props opcionales
  initialTab?: TabType;           // Pestaña inicial
  onTabChange?: (tab: TabType) => void; // Callback al cambiar pestaña
  onSave?: (config: Configuracion) => void; // Callback al guardar
  readOnly?: boolean;             // Modo solo lectura
  showLicenseAlerts?: boolean;    // Mostrar alertas de licencia
}
```

#### Uso Básico
```typescript
import ConfiguracionUnificada from './pages/ConfiguracionUnificada';

function App() {
  return (
    <ConfiguracionUnificada
      initialTab="general"
      onTabChange={(tab) => console.log(`Cambió a pestaña: ${tab}`)}
      onSave={(config) => console.log('Configuración guardada:', config)}
    />
  );
}
```

### LicenseGate.tsx

Componente para control de acceso basado en licencia.

#### Props
```typescript
interface LicenseGateProps {
  children: React.ReactNode;
  requiredLicense: 'gratuita' | 'pagada' | 'enterprise';
  feature?: string; // Característica específica a verificar
  fallback?: React.ReactNode; // Componente a mostrar si no tiene acceso
  showUpgradePrompt?: boolean; // Mostrar prompt para upgrade
}
```

#### Uso Básico
```typescript
import { LicenseGate } from './components/configuracion/LicenseGate';

function BrandingSettings() {
  return (
    <LicenseGate requiredLicense="pagada" feature="customBranding">
      <BrandingTab />
    </LicenseGate>
  );
}
```

### SectionCard.tsx

Componente contenedor para secciones de configuración.

#### Props
```typescript
interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}
```

#### Uso Básico
```typescript
import SectionCard from './components/configuracion/SectionCard';

function GeneralSection() {
  return (
    <SectionCard 
      title="Datos Profesionales"
      description="Información básica de tu práctica"
      icon={<UserIcon />}
      collapsible={true}
    >
      <Input label="Nombre" />
      <Input label="Especialidad" />
    </SectionCard>
  );
}
```

---

## 📁 Estructura de Pestañas

Cada pestaña sigue la misma estructura básica:

```typescript
// Ejemplo: GeneralTab.tsx
const GeneralTab: React.FC = () => {
  const { configuracion, updateNestedField } = useConfiguration();
  
  return (
    <div className="space-y-6">
      <SectionCard title="Datos Profesionales">
        {/* Campos del formulario */}
      </SectionCard>
      
      <SectionCard title="Datos de Contacto">
        {/* Más campos */}
      </SectionCard>
    </div>
  );
};

export default GeneralTab;
```

### Props Comunes para Pestañas

```typescript
interface TabProps {
  config: Configuracion;           // Configuración actual
  onUpdate: (updates: Partial<Configuracion>) => void; // Callback para actualizar
  licenseType: 'gratuita' | 'pagada' | 'enterprise'; // Tipo de licencia
  isReadOnly?: boolean;            // Modo solo lectura
}
```

---

## 🔄 Sistema de Migración

### Script de Migración

El sistema incluye un script de migración completo:

```javascript
// migrate-configurations.js
const { MigrationLogger, BackupService, MigrationService } = require('./migrate-configurations');

// Uso programático
async function migrate() {
  const logger = new MigrationLogger();
  const backupService = new BackupService();
  const migrationService = new MigrationService();
  
  backupService.setLogger(logger);
  migrationService.setLogger(logger);
  
  // Ejecutar migración
  const result = await migrationService.runMigration();
  
  return result;
}
```

### API del Script

```typescript
// Clases exportadas
class MigrationLogger {
  log(message: string, type: 'info' | 'success' | 'warning' | 'error'): void;
  save(): void;
  generateSummary(): Summary;
}

class BackupService {
  createBackup(): Promise<BackupResult>;
  cleanupOldBackups(): void;
}

class MigrationService {
  runMigration(): Promise<MigrationResult>;
  detectExistingConfigurations(): Promise<DetectionResults>;
  validateDataStructure(): Promise<boolean>;
}
```

---

## 🧪 Testing API

### Configuración de Pruebas

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Configuración básica
afterEach(() => {
  cleanup();
});
```

### Utilidades de Testing

```typescript
// Mock de configuración para pruebas
export const mockConfiguracion: Configuracion = {
  id: '1',
  profesion: 'fisioterapia',
  tipoCuenta: 'personal',
  licencia: {
    tipo: 'pagada',
    estado: 'activa',
    caracteristicasHabilitadas: ['customBranding', 'cloudSync']
  },
  branding: { /* ... */ },
  datosContacto: { /* ... */ },
  preferencias: { /* ... */ },
  fechaCreacion: new Date(),
  fechaActualizacion: new Date()
};

// Helper para pruebas de componentes
export function renderWithConfig(component: React.ReactElement, config = mockConfiguracion) {
  return render(
    <ConfigProvider value={config}>
      {component}
    </ConfigProvider>
  );
}
```

### Ejemplos de Pruebas

```typescript
// Prueba de componente
import { render, screen } from '@testing-library/react';
import GeneralTab from './GeneralTab';
import { mockConfiguracion } from '../test/utils';

describe('GeneralTab', () => {
  it('debe mostrar el nombre profesional', () => {
    renderWithConfig(<GeneralTab />, {
      ...mockConfiguracion,
      branding: { ...mockConfiguracion.branding, nombreProfesional: 'Dr. Test' }
    });
    
    expect(screen.getByDisplayValue('Dr. Test')).toBeInTheDocument();
  });
  
  it('debe actualizar el nombre profesional', async () => {
    const onUpdate = vi.fn();
    render(<GeneralTab config={mockConfiguracion} onUpdate={onUpdate} />);
    
    const input = screen.getByLabelText('Nombre Profesional');
    await userEvent.type(input, 'Nuevo Nombre');
    
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        branding: expect.objectContaining({
          nombreProfesional: 'Nuevo Nombre'
        })
      })
    );
  });
});
```

---

## 🚀 Integración con Otros Módulos

### App Store (Zustand)

```typescript
import { useAppStore } from '../stores/appStore';

// Acceder a configuración desde cualquier componente
function SomeComponent() {
  const { configuracion, actualizarConfiguracion } = useAppStore();
  
  // La configuración está sincronizada automáticamente
  return (
    <div>
      <p>Profesión: {configuracion?.profesion}</p>
      <p>Licencia: {configuracion?.licencia.tipo}</p>
    </div>
  );
}
```

### Base de Datos (IndexedDB)

```typescript
import { db } from '../db/database';

// Leer configuración directamente
async function getConfigFromDB() {
  return await db.configuracion.get('1');
}

// Actualizar configuración
async function updateConfigInDB(updates: Partial<Configuracion>) {
  await db.configuracion.update('1', {
    ...updates,
    fechaActualizacion: new Date()
  });
}
```

### Servicios de Documentos

```typescript
import { generarDocumento } from '../services/pdfService';

// Usar configuración en generación de documentos
async function generarReciboConConfig() {
  const config = await getConfigFromDB();
  
  return await generarDocumento('recibo', {
    ...config.branding,
    fecha: new Date(),
    // ... otros datos
  });
}
```

---

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```env
# .env.local
VITE_APP_VERSION=3.1.0
VITE_ENABLE_MIGRATION=true
VITE_BACKUP_ENABLED=true
VITE_TEST_MODE=false
```

### Configuración de Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // Configuración para PWA
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'SaludValpa',
        short_name: 'SaludValpa',
        description: 'Sistema de gestión profesional para salud y belleza',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // Configuración de testing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```

---

## 📊 Monitoreo y Logging

### Sistema de Logging

```typescript
// src/utils/logger.ts
export class MigrationLogger {
  private logs: LogEntry[] = [];
  
  log(message: string, type: LogType = 'info') {
    const entry: LogEntry = {
      timestamp: new Date(),
      message,
      type,
      context: 'migration'
    };
    
    this.logs.push(entry);
    console[type](`[Migration] ${message}`);
    
    // Enviar a servicio de monitoreo si está configurado
    if (process.env.VITE_ENABLE_MONITORING) {
      sendToMonitoring(entry);
    }
  }
  
  save() {
    localStorage.setItem('migration-logs', JSON.stringify(this.logs));
  }
  
  generateReport(): MigrationReport {
    return {
      totalLogs: this.logs.length,
      errors: this.logs.filter(l => l.type === 'error').length,
      warnings: this.logs.filter(l => l.type === 'warning').length,
      duration: this.calculateDuration(),
      logs: this.logs
    };
  }
}
```

### Métricas de Performance

```typescript
// src/utils/metrics.ts
export interface PerformanceMetrics {
  migrationDuration: number;
  backupSize: number;
  validationTime: number;
  memoryUsage: number;
  errors: number;
}

export async function collectMigrationMetrics(): Promise<PerformanceMetrics> {
  const startTime = performance.now();
  
  // Ejecutar migración
  const result = await executeMigration();
  
  const endTime = performance.now();
  
  return {
    migrationDuration: endTime - startTime,
    backupSize: result.backupSize,
    validationTime: result.validationTime,
    memoryUsage: performance.memory?.usedJSHeapSize || 0,
    errors: result.errors.length
  };
}
```

---

## 🛡️ Seguridad y Validación

### Validación de Datos

```typescript
// src/utils/validation.ts
export function validateConfiguration(config: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validar estructura básica
  if (!config.id || config.id !== '1') {
    errors.push('ID de configuración inválido');
  }
  
  // Validar licencia
  if (!['gratuita', 'pagada', 'enterprise'].includes(config.licencia?.tipo)) {
    errors.push('Tipo de licencia inválido');
  }
  
  // Validar branding
  if (!config.branding?.nombreProfesional) {
    warnings.push('Nombre profesional no especificado');
  }
  
  // Validar preferencias
  if (!config.preferencias?.formatoFecha) {
    config.preferencias.formatoFecha = 'DD/MM/YYYY';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    correctedConfig: config
  };
}
```

### Encriptación de Backups

```typescript
// src/services/encryption.ts
export async function encryptBackup(data: any): Promise<EncryptedBackup> {
  const key = await generateEncryptionKey();
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array(12) },
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );
  
  return {
    encryptedData: arrayBufferToBase64(encryptedData),
    keyId: await generateKeyId(key),
    timestamp: new Date(),
    version: '1.0'
  };
}

export async function decryptBackup(encryptedBackup: EncryptedBackup): Promise<any> {
  const key = await retrieveEncryptionKey(encryptedBackup.keyId);
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(12) },
    key,
    base64ToArrayBuffer(encryptedBackup.encryptedData)
  );
  
  return JSON.parse(new TextDecoder().decode(decryptedData));
}
```

---

## 🔄 Flujos de Trabajo Comunes

### Migración Completa

```typescript
// Ejemplo: Flujo de migración completo
async function executeFullMigration() {
  const logger = new MigrationLogger();
  
  try {
    logger.log('Iniciando migración completa', 'info');
    
    // 1. Crear backup
    const backupService = new BackupService();
    const backupResult = await backupService.createBackup();
    
    if (!backupResult.success) {
      throw new Error('Fallo al crear backup');
    }
    
    logger.log(`Backup creado: ${backupResult.backupId}`, 'success');
    
    // 2. Detectar configuraciones existentes
    const migrationService = new MigrationService();
    const detection = await migrationService.detectExistingConfigurations();
    
    logger.log(`Configuraciones detectadas: ${JSON.stringify(detection)}`, 'info');
    
    // 3. Validar estructura
    const isValid = await migrationService.validateDataStructure();
    
    if (!isValid) {
      throw new Error('Estructura de datos inválida');
    }
    
    // 4. Ejecutar migración
    const migrationResult = await migrationService.runMigration();
    
    if (!migrationResult.success) {
      // Intentar rollback
      await migrationService.attemptRollback();
      throw new Error('Fallo en migración, rollback ejecutado');
    }
    
    logger.log(`Migración completada: ${migrationResult.migratedItems} items migrados`, 'success');
    
    // 5. Validar migración
    const validationResult = await migrationService.validateMigration();
    
    if (!validationResult.valid) {
      logger.log('Problemas encontrados en validación', 'warning');
    }
    
    // 6. Generar reporte
    const report = await migrationService.generateMigrationReport();
    
    logger.save();
    return {
      success: true,
      report,
      backupId: backupResult.backupId
    };
    
  } catch (error) {
    logger.log(`Error en migración: ${error.message}`, 'error');
    logger.save();
    
    return {
      success: false,
      error: error.message
    };
  }
}
```

### Actualización de Configuración

```typescript
// Ejemplo: Actualizar configuración con validación
async function updateConfigurationSafely(updates: Partial<Configuracion>) {
  // 1. Validar datos
  const validation = validateConfiguration(updates);
  
  if (!validation.isValid) {
    throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
  }
  
  // 2. Crear backup incremental
  const backupId = await crearBackupAutomaticoMigracion();
  
  // 3. Aplicar actualización
  const result = await actualizarConfiguracion(validation.correctedConfig);
  
  // 4. Verificar integridad
  const integrityCheck = await verificarIntegridadConfiguracion();
  
  if (!integrityCheck.valid) {
    // Restaurar desde backup
    await restaurarDesdeBackupMigracion(backupId);
    throw new Error('Problemas de integridad después de actualizar');
  }
  
  return {
    success: true,
    backupId,
    warnings: validation.warnings
  };
}
```

---

## 📚 Recursos Adicionales

### Enlaces Útiles

- **Documentación Completa:** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Plan de Implementación:** [unificacion-configuraciones-plan-completo.md](./plans/unificacion-configuraciones-plan-completo.md)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)
- **Repositorio:** [GitHub](https://github.com/tu-usuario/saludvalpa)

### Comunidad y Soporte

- **Issues:** Reportar problemas en GitHub Issues
- **Discusiones:** Foro de desarrolladores
- **Soporte Técnico:** soporte@saludvalpa.com

### Herramientas de Desarrollo

```bash
# Scripts disponibles
npm run migrate          # Ejecutar migración
npm run test:config      # Probar componentes de configuración
npm run backup:create    # Crear backup manual
npm run backup:list      # Listar backups disponibles
npm run docs:generate    # Generar documentación
```

---

## 🎯 Mejores Prácticas

### 1. Manejo de Errores

```typescript
// BUENA PRÁCTICA: Manejo completo de errores
try {
  await executeMigration();
} catch (error) {
  // Registrar error
  logger.log(`Error: ${error.message}`, 'error');
  
  // Intentar recuperación
  await attemptRecovery();
  
  // Notificar al usuario
  showUserNotification('Error en migración', 'error');
  
  // Enviar métricas
  sendErrorMetrics(error);
}
```

### 2. Performance

```typescript
// BUENA PRÁCTICA: Optimizar carga
function ConfiguracionUnificada() {
  // Cargar configuración de forma lazy
  const { configuracion, isLoading } = useConfiguration();
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // Dividir pestañas en chunks
  const tabs = {
    general: React.lazy(() => import('./tabs/GeneralTab')),
    branding: React.lazy(() => import('./tabs/BrandingTab')),
    // ... otras pestañas
  };
  
  return (
    <Suspense fallback={<TabLoading />}>
      <tabs.general />
    </Suspense>
  );
}
```

### 3. Accesibilidad

```typescript
// BUENA PRÁCTICA: Componentes accesibles
function AccessibleInput({ label, ...props }) {
  const id = useId();
  
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        aria-label={label}
        {...props}
      />
    </div>
  );
}
```

---

## 📄 Conclusión

Esta API reference proporciona toda la información necesaria para trabajar con el sistema de configuración unificado de SaludValpa 3.0. El sistema está diseñado para ser:

1. **Robusto:** Con validación completa y sistema de backup/restore
2. **Escalable:** Arquitectura modular que soporta crecimiento
3. **Mantenible:** Código bien documentado y testeado
4. **Seguro:** Con encriptación y validación de datos
5. **Accesible:** Cumpliendo estándares WCAG 2.1

Para cualquier pregunta o problema, consultar la documentación completa o contactar al equipo de desarrollo.

---

**Última actualización:** 5 de marzo de 2026
**Versión del documento:** 1.0
**Estado:** Completado ✅

> **Nota:** Esta documentación se actualizará con cada nueva versión del sistema. Mantener una copia local para referencia durante el desarrollo.