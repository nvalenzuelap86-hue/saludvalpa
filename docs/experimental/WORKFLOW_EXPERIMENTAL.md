# Workflow Experimental - Rama `experimental/rediseno-inicio-fisioterapia`

## Objetivo
Rediseñar la experiencia inicial de usuario (onboarding, landing page y enrutamiento) para enfocarse exclusivamente en **Fisioterapia** como profesión principal. Esta rama experimental restringe la aplicación a solo fisioterapeutas, manteniendo las demás especialidades como "Próximamente".

## Alcance
- **Onboarding simplificado**: Solo fisioterapia como opción activa, selección automática de la profesión
- **Landing Page**: Hero section y botones de especialidad enfocados en fisioterapia
- **ProfessionRouter**: Solo enruta a módulos de fisioterapia; otras profesiones muestran mensaje de no disponible
- **Feature Flag**: `experimentalPhysioRedesign = true` en el appStore

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/Onboarding.tsx` | Eliminado paso de selección de especialidad; fisioterapia es automática |
| `src/pages/LandingPage.tsx` | Hero section enfocado en fisioterapia; especialidades no-fisio deshabilitadas |
| `src/components/ProfessionRouter.tsx` | Validación de profesión disponible; solo fisioterapia permitida |
| `src/stores/appStore.ts` | `completarOnboarding()` fuerza fisioterapia; feature flag añadido |

## Flujo de Trabajo

### 1. Desarrollo en esta Rama
```bash
# Ya estás en la rama experimental
git checkout experimental/rediseno-inicio-fisioterapia

# Para crear una sub-rama de feature
git checkout -b feature/mejora-onboarding-fisio

# Desarrollo...
```

### 2. Desarrollo Diario
```bash
# Actualizar desde main (si es necesario)
git fetch origin
git rebase origin/main

# Hacer commits pequeños y frecuentes
git add .
git commit -m "feat: descripción concisa"

# Subir cambios
git push origin experimental/rediseno-inicio-fisioterapia
```

### 3. Pruebas y Validación
```bash
# Ejecutar pruebas existentes
npm test

# Build de verificación
npm run build

# Pruebas manuales
npm run dev
```

### 4. Integración con Rama Experimental
```bash
# Ya trabajas directamente en la rama experimental
# Para integrar cambios de sub-rama:
git checkout experimental/rediseno-inicio-fisioterapia
git merge --no-ff feature/mejora-onboarding-fisio
```

### 5. Backup Diario
```bash
# Crear backup del estado experimental
./scripts/backup_experimental.sh

# El backup incluye:
# - Código fuente
# - Dependencias (package.json)
# - Base de datos de desarrollo
# - Documentación
```

## Estructura de Directorios

### `docs/experimental/`
- `WORKFLOW_EXPERIMENTAL.md` - Este documento
- `FEATURE_TEMPLATE.md` - Plantilla para nuevas características
- `TESTING_GUIDELINES.md` - Guías de pruebas
- `REVIEW_CHECKLIST.md` - Checklist para revisiones

### `tests/experimental/`
- `unit/` - Pruebas unitarias para características experimentales
- `integration/` - Pruebas de integración
- `e2e/` - Pruebas end-to-end
- `mocks/` - Datos y mocks para pruebas

## Checklist de Calidad

### Antes de Cada Commit
- [ ] Código compila sin errores (`npm run build`)
- [ ] Pruebas existentes pasan (`npm test`)
- [ ] Linter pasa (`npm run lint`)
- [ ] Formato consistente (`npm run format`)
- [ ] Documentación actualizada

### Antes de Merge a Main
- [ ] Revisión de código completada
- [ ] Pruebas de integración pasadas
- [ ] No hay regresiones en funcionalidad existente (fisioterapia)
- [ ] Performance aceptable
- [ ] Documentación de usuario actualizada
- [ ] Feature flag `experimentalPhysioRedesign` removido o desactivado

### Semanalmente
- [ ] Backup completo del estado
- [ ] Revisión de métricas (coverage, bundle size)
- [ ] Limpieza de branches obsoletas
- [ ] Actualización desde main (si aplica)

## Herramientas y Scripts

### Scripts Disponibles
```bash
# Backup del estado experimental
./scripts/backup_experimental.sh

# Restauración desde backup
./scripts/restore_experimental.sh

# Ejecutar todas las pruebas experimentales
npm run test:experimental

# Generar reporte de coverage
npm run coverage:experimental

# Limpiar datos de desarrollo
npm run clean:experimental
```

### Configuración Recomendada
```json
{
  "scripts": {
    "test:experimental": "jest tests/experimental/",
    "coverage:experimental": "jest tests/experimental/ --coverage",
    "clean:experimental": "rm -rf .experimental-data/"
  }
}
```

## Gestión de Riesgos

### Riesgos Identificados
1. **Inestabilidad** → Mantener en rama separada
2. **Conflictos con main** → Rebase regular
3. **Pérdida de datos** → Backups diarios
4. **Scope creep** → Definición clara de alcance
5. **Usuarios no-fisioterapia confundidos** → Mensajes claros de "Próximamente"

### Plan de Contingencia
```bash
# Rollback rápido (último commit)
git reset --hard HEAD~1

# Restauración desde backup
./scripts/restore_experimental.sh

# Abandonar rama experimental
git checkout main
git branch -D experimental/rediseno-inicio-fisioterapia
```

## Comunicación y Colaboración

### Canales
- **Issues de GitHub** - Seguimiento de tareas
- **Pull Requests** - Revisión de código
- **Documentación** - Registro de decisiones
- **Reuniones** - Sincronización semanal

### Convenciones
- **Commits:** Mensajes en español o inglés, descriptivos
- **Branches:** `feature/`, `fix/`, `docs/`, `test/` prefixes
- **Código:** Seguir convenciones existentes del proyecto
- **Documentación:** Mantener actualizada en tiempo real

## Métricas de Seguimiento

### Técnicas
- **Coverage de pruebas:** >80% para código nuevo
- **Tamaño de bundle:** <10% de aumento por feature
- **Tiempo de build:** <2 minutos
- **Errores de lint:** 0

### Proceso
- **Velocidad:** 2-3 features por mes
- **Calidad:** <5 bugs críticos por feature
- **Documentación:** 100% de features documentadas
- **Retroalimentación:** Ciclo semanal de revisión

## Plantillas y Recursos

### Plantilla de Feature
Ver `docs/experimental/FEATURE_TEMPLATE.md`

### Checklist de Revisión
Ver `docs/experimental/REVIEW_CHECKLIST.md`

### Guía de Testing
Ver `docs/experimental/TESTING_GUIDELINES.md`

## Estado Actual
✅ **Rama experimental creada:** `experimental/rediseno-inicio-fisioterapia`
✅ **Onboarding simplificado:** Selección automática de fisioterapia
✅ **Landing Page:** Hero y especialidades enfocados en fisioterapia
✅ **ProfessionRouter:** Solo fisioterapia permitida
✅ **Feature Flag:** `experimentalPhysioRedesign = true`
🚀 **Listo para pruebas y validación**

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-02-26 | Creación inicial del workflow experimental |
| 1.0 | 2026-02-26 | Integración con estructura del proyecto |
| 2.0 | 2026-05-18 | Nueva rama: `experimental/rediseno-inicio-fisioterapia` - Rediseño de onboarding y landing para fisioterapia exclusiva |

## Próximos Pasos
1. Probar el flujo completo de onboarding con fisioterapia
2. Verificar que las demás especialidades muestren "Próximamente" correctamente
3. Validar que el feature flag funcione correctamente
4. Recibir feedback y ajustar según sea necesario
5. Preparar para merge a main (remover feature flag)