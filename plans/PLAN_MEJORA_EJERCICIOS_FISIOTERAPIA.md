# PLAN DE MEJORA: Ejercicios de Fisioterapia y Soporte de Videos

> **Versión:** 1.0  
> **Fecha:** 2026-05-04  
> **Especialidad:** Fisioterapia  
> **Propósito:** Documento de planificación — sin implementación de código

---

## 1. Resumen Ejecutivo

Este plan aborda dos problemas principales detectados en el módulo de Fisioterapia de SaludValpa:

1. **Calidad de los ejercicios precargados:** Aproximadamente el 75% de los ~200 ejercicios (unos ~150) son plantillas genéricas generadas automáticamente, con nombres poco descriptivos, instrucciones repetitivas, combinaciones ilógicas de zonas corporales y nombres duplicados. Esto afecta la experiencia del profesional al buscar y asignar ejercicios a sus pacientes.

2. **Funcionalidad de video ausente:** El tipo [`Ejercicio`](saludvalpa-app/src/types/biblioteca.ts:74) ya define el campo opcional `videosUrls?: string[]`, pero este no se utiliza en ningún componente de la UI (formulario, detalle, tarjeta) ni en la generación de PDFs de rutinas.

El plan propone reescribir los ~150 ejercicios genéricos con contenido específico y de calidad, e implementar el soporte completo de URLs de video en el formulario de creación/edición, la vista de detalle, la tarjeta de ejercicio y el PDF de rutinas. Todo limitado exclusivamente a la especialidad de Fisioterapia.

---

## 2. Diagnóstico Actual

### 2.1 Problemas en Ejercicios Precargados

Tras analizar el archivo [`ejerciciosPrecargados.ts`](saludvalpa-app/src/data/ejerciciosPrecargados.ts), se identificaron los siguientes problemas:

| Problema | Ejemplo | Impacto |
|----------|---------|---------|
| **Nombres genéricos** | `"Circunducción de [parte]"`, `"Movilidad de [parte]"`, `"Fortalecimiento de [parte]"` | Dificulta identificar el ejercicio específico |
| **Instrucciones idénticas por categoría** | En Movilidad: `"Posición estable"`, `"Realizar círculos pequeños con [parte]"`, `"Aumentar gradualmente el tamaño"`, `"Cambiar dirección después de 10 repeticiones"`, `"Mantener respiración constante"` | ~30 ejercicios de Movilidad comparten exactamente las mismas 5 instrucciones |
| **Descripciones repetitivas** | `"Movimientos circulares para aumentar movilidad articular."` o `"Ejercicio para mejorar el rango de movimiento de [parte]."` | Sin valor informativo real |
| **Combinaciones ilógicas de zonas corporales** | `ZonaCorporal.RODILLA + ZonaCorporal.ANTEBRAZO`, `ZonaCorporal.MUNECA + ZonaCorporal.CADERA + ZonaCorporal.PIE`, `ZonaCorporal.PIE + ZonaCorporal.MUNECA + ZonaCorporal.CODO` | Nonsensical desde el punto de vista fisioterapéutico |
| **Nombres duplicados** | `"Circunducción de Brazo avanzado"` aparece dos veces con diferentes zonas corporales (BRAZO+MUSLO vs BRAZO+ESPALDA_BAJA) | Confusión y datos inconsistentes |
| **Contraindicaciones genéricas** | `"Problemas cardíacos"`, `"Lesión reciente"`, `"Inflamación activa"` sin especificar | Poco útiles para la práctica clínica |
| **Equipo necesario aleatorio** | Ejercicios de movilidad de muñeca que requieren `"Pelota de estabilidad"` o `"Cojín de equilibrio"` | Sin relación con el ejercicio |

### 2.2 Distribución Actual

| Categoría | Ejercicios Artesanales (primeros ~10) | Ejercicios Genéricos (resto) | Total |
|-----------|--------------------------------------|------------------------------|-------|
| Movilidad | ~10 | ~30 | ~40 |
| Fuerza | ~10 | ~30 | ~40 |
| Equilibrio | ~10 | ~30 | ~40 |
| Estiramiento | ~10 | ~30 | ~40 |
| Cardio | ~10 | ~30 | ~40 |
| **Total** | **~50** | **~150** | **~200** |

### 2.3 Problemas con Videos

- El campo [`videosUrls`](saludvalpa-app/src/types/biblioteca.ts:112) existe en la interfaz `Ejercicio` pero **no se utiliza en ningún lado**.
- [`FormularioEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/FormularioEjercicio.tsx) no tiene campo para ingresar URLs de video.
- [`DetalleEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/DetalleEjercicio.tsx) no muestra ningún video ni enlace.
- [`TarjetaEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/TarjetaEjercicio.tsx) no indica si el ejercicio tiene video asociado.
- [`generadorPDFRutina.ts`](saludvalpa-app/src/modules/fisioterapia/rutinas/generadorPDFRutina.ts) no incluye enlaces a video en el PDF generado.
- La función [`inicializarEjerciciosPrecargados`](saludvalpa-app/src/db/database.ts:201) asigna `videosUrls: []` solo condicionalmente (si existe `imagenUrl`), lo cual es incorrecto.

---

## 3. Alcance del Plan

### 3.1 Incluido

- ✅ **Reescritura completa** de los ~150 ejercicios genéricos con nombres específicos, descripciones únicas, instrucciones detalladas y zonas corporales correctas.
- ✅ **Campo de URLs de video** en el formulario de creación/edición de ejercicios.
- ✅ **Visualización de videos** en la vista de detalle del ejercicio.
- ✅ **Indicador visual** en la tarjeta del ejercicio cuando tenga video asociado.
- ✅ **Enlaces clickeables a video** en el PDF generado de rutinas.
- ✅ **Migración de datos** para ejercicios existentes en IndexedDB.
- ✅ **Aplicación a ejercicios personalizados** (creados por el usuario).
- ✅ **Solo para Fisioterapia** — sin cambios en otras especialidades.

### 3.2 Excluido

- ❌ No se implementará reproducción de video embebido en la app (solo enlaces).
- ❌ No se modificará el tipo `Ejercicio` (ya tiene `videosUrls`).
- ❌ No se agregará carga/almacenamiento de archivos de video.
- ❌ No se modificarán otras especialidades (Medicina, Nutrición, Odontología, Psicología).
- ❌ No se cambiará la estructura de la base de datos (solo migración de datos).

---

## 4. Fases de Implementación

### Fase 1: Mejora de Ejercicios Precargados

**Objetivo:** Reescribir ~150 ejercicios genéricos con contenido específico y de calidad fisioterapéutica.

#### 4.1.1 Patrón de Mejora por Categoría

**Movilidad (~30 ejercicios a reescribir)**
- **Problema actual:** Nombres como `"Circunducción de [parte]"`, instrucciones genéricas de 5 pasos idénticos.
- **Mejora:** Nombres específicos como `"Movilidad Articular de Tobillo en Descarga"`, `"Círculos Controlados de Cadera en Decúbito Lateral"`. Descripciones que expliquen el objetivo terapéutico. Instrucciones detalladas con posiciones iniciales claras, número de repeticiones, velocidad y dirección del movimiento. Zonas corporales correctas y específicas.

**Fuerza (~30 ejercicios a reescribir)**
- **Problema actual:** Nombres como `"Fortalecimiento de [parte]"`, instrucciones genéricas.
- **Mejora:** Nombres como `"Fortalecimiento de Glúteo Medio con Banda Elástica"`, `"Press de Hombro con Mancuernas en Banco Inclinado"`. Incluir progresiones (principiante/intermedio/avanzado). Especificar tipo de contracción (concéntrica, excéntrica, isométrica).

**Equilibrio (~30 ejercicios a reescribir)**
- **Problema actual:** Nombres genéricos, instrucciones que no especifican nivel de dificultad.
- **Mejora:** Nombres como `"Equilibrio Unipodal sobre Superficie Estable"`, `"Transferencia de Peso en Base Estrecha"`. Especificar nivel de dificultad, superficie, apoyo visual y modificaciones.

**Estiramiento (~30 ejercicios a reescribir)**
- **Problema actual:** Instrucciones genéricas, duraciones inconsistentes.
- **Mejora:** Nombres como `"Estiramiento de Isquiotibiales en Sedestación con Cinta"`, `"Estiramiento de Pectoral en Marco de Puerta"`. Incluir tiempo de mantenimiento, respiración, sensación objetivo y contraindicaciones específicas.

**Cardio (~30 ejercicios a reescribir)**
- **Problema actual:** Ejercicios sin progresión ni métricas claras.
- **Mejora:** Nombres como `"Marcha en Sitio con Elevación de Rodillas"`, `"Step Ups en Banco Bajo Controlado"`. Incluir rangos de frecuencia cardíaca objetivo, escalas de esfuerzo percibido (Borg), y contraindicaciones cardiovasculares específicas.

#### 4.1.2 Criterios de Calidad para Cada Ejercicio Reescribir

1. **Nombre único y descriptivo** que permita identificar el ejercicio sin ambigüedad.
2. **Descripción terapéutica** que explique el propósito clínico.
3. **Instrucciones paso a paso** específicas para ese ejercicio (no plantillas).
4. **Zonas corporales correctas** y relevantes (máximo 2-3 zonas).
5. **Contraindicaciones específicas** relacionadas con el ejercicio.
6. **Equipo necesario** realista y justificado.
7. **Sin nombres duplicados** en toda la base de datos.

#### 4.1.3 Estimación de Esfuerzo

| Actividad | Tiempo Estimado |
|-----------|-----------------|
| Análisis y planificación de reescritura por categoría | 2 horas |
| Reescritura de ~30 ejercicios de Movilidad | 4 horas |
| Reescritura de ~30 ejercicios de Fuerza | 4 horas |
| Reescritura de ~30 ejercicios de Equilibrio | 4 horas |
| Reescritura de ~30 ejercicios de Estiramiento | 4 horas |
| Reescritura de ~30 ejercicios de Cardio | 4 horas |
| Revisión y validación cruzada | 2 horas |
| **Total estimado** | **~24 horas** |

---

### Fase 2: Soporte de URLs de Video en UI

**Objetivo:** Implementar el campo `videosUrls` en el formulario, detalle y tarjeta de ejercicios.

#### 4.2.1 FormularioEjercicio.tsx — Agregar campo de URLs de video

**Archivo:** [`FormularioEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/FormularioEjercicio.tsx)

**Cambios necesarios:**

1. **Nuevo estado:** `videosUrls: string[]` inicializado como `[]`.
2. **Carga en edición:** En el `useEffect` que carga datos de `ejercicioEditar`, agregar `setVideosUrls(ejercicioEditar.videosUrls || [])`.
3. **Reseteo:** En `resetearFormulario()`, agregar `setVideosUrls([])`.
4. **Validación:** Validar que las URLs tengan formato válido (opcional, solo advertir si son inválidas).
5. **Submit:** Incluir `videosUrls` en el objeto enviado a `onGuardar`.
6. **UI:** Agregar sección en el formulario con:
   - Input para agregar una nueva URL de video.
   - Botón "Agregar video".
   - Lista de URLs agregadas con opción de eliminar cada una.
   - Validación básica de formato URL.
   - Placeholder: `"https://www.youtube.com/watch?v=..."` o `"https://vimeo.com/..."`.

**Especificación de UI:**

```
┌─────────────────────────────────────────────┐
│  📹 Videos Demostrativos (Opcional)          │
│                                              │
│  [Input: URL del video            ] [+ Agregar] │
│                                              │
│  URLs agregadas:                             │
│  • https://youtube.com/watch?v=abc123 [✕]   │
│  • https://vimeo.com/123456       [✕]       │
│                                              │
│  Formatos soportados: YouTube, Vimeo         │
└─────────────────────────────────────────────┘
```

#### 4.2.2 DetalleEjercicio.tsx — Mostrar videos

**Archivo:** [`DetalleEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/DetalleEjercicio.tsx)

**Cambios necesarios:**

1. Después de la sección de "Contraindicaciones" (o "Notas Personales"), agregar una nueva sección condicional:
   - Si `ejercicio.videosUrls` existe y tiene longitud > 0, mostrar "📹 Videos Demostrativos".
   - Cada URL renderizada como un enlace clickeable (`<a href="..." target="_blank" rel="noopener noreferrer">`).
   - Mostrar un ícono de video junto a cada enlace.
   - Si la URL es de YouTube, mostrar un texto como "Ver en YouTube".
   - Si la URL es de Vimeo, mostrar "Ver en Vimeo".
   - Para otras URLs, mostrar "Ver video" genérico.

**Especificación de UI:**

```
┌─────────────────────────────────────────────┐
│  📹 Videos Demostrativos                     │
│                                              │
│  ▶ Ver en YouTube                            │
│  ▶ Ver en Vimeo                              │
└─────────────────────────────────────────────┘
```

#### 4.2.3 TarjetaEjercicio.tsx — Indicador de video

**Archivo:** [`TarjetaEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/TarjetaEjercicio.tsx)

**Cambios necesarios:**

1. En el área de badges (junto a intensidad y zonas corporales), agregar un badge condicional:
   - Si `ejercicio.videosUrls` existe y tiene longitud > 0, mostrar un badge `"📹 Video"`.
   - Color: fondo rojo claro (`bg-red-100`) con texto rojo (`text-red-800`).

**Especificación de UI:**

```
┌──────────────────────────────┐
│  🔄                          │
│  Rotación de Hombro          │
│  movilidad                   │
│                              │
│  Descripción del ejercicio   │
│                              │
│  [Media] [Hombro] [📹 Video] │
└──────────────────────────────┘
```

---

### Fase 3: Integración de Videos en PDF

**Objetivo:** Incluir enlaces a video clickeables en el PDF de rutinas.

**Archivo:** [`generadorPDFRutina.ts`](saludvalpa-app/src/modules/fisioterapia/rutinas/generadorPDFRutina.ts)

#### 4.3.1 Cambios en la sección "Detalles de Ejercicios"

En el bucle que itera sobre `rutina.ejercicios` (línea 311), después de mostrar las instrucciones y antes de los parámetros, agregar:

1. Verificar si `ejercicioInfo.videosUrls` existe y tiene elementos.
2. Si tiene videos, mostrar:
   - Título: `"📹 Videos:"` en negrita.
   - Cada URL como texto clickeable usando `doc.textWithLink()` de jsPDF.
   - Formato: `"• Ver video [n]: [URL]"`.
   - Si hay múltiples videos, numerarlos.

**Código conceptual:**

```typescript
// Después de instrucciones, antes de parámetros
if (ejercicioInfo.videosUrls && ejercicioInfo.videosUrls.length > 0) {
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.text('📹 Videos:', margen, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  ejercicioInfo.videosUrls.forEach((url, i) => {
    const textoVideo = `Ver video ${i + 1}`;
    doc.textWithLink(textoVideo, margen + 5, y, { url });
    y += 4;
  });
}
```

#### 4.3.2 Consideraciones de Layout

- Si el PDF está muy lleno, los videos podrían ocupar espacio adicional. Considerar:
  - Acortar el texto del enlace a `"Ver video [n]"` en lugar de mostrar la URL completa.
  - Si hay más de 3 videos, mostrar solo los primeros 3 con un "y [n] más...".
  - Agregar lógica de salto de página si `y > 250`.

---

### Fase 4: Migración de Datos

**Objetivo:** Asegurar que todos los ejercicios existentes en IndexedDB tengan el campo `videosUrls`.

#### 4.4.1 Migración en Base de Datos

**Archivo:** [`database.ts`](saludvalpa-app/src/db/database.ts)

**Opción A — Migración en inicialización (recomendada):**

Modificar la función [`inicializarEjerciciosPrecargados`](saludvalpa-app/src/db/database.ts:201) para:

1. Después de verificar que ya existen ejercicios precargados, ejecutar una migración:
   ```typescript
   // Migrar ejercicios existentes que no tengan videosUrls
   const ejerciciosSinVideos = await db.ejercicios
     .filter(e => e.videosUrls === undefined)
     .toArray();
   
   if (ejerciciosSinVideos.length > 0) {
     await db.ejercicios
       .where('id')
       .anyOf(ejerciciosSinVideos.map(e => e.id))
       .modify({ videosUrls: [] });
     console.log(`✅ Migrados ${ejerciciosSinVideos.length} ejercicios con videosUrls: []`);
   }
   ```

**Opción B — Nueva versión de esquema (si se requiere):**

Si se necesita un cambio de esquema más profundo, agregar `version(4)` en la clase [`SaludValpaDatabase`](saludvalpa-app/src/db/database.ts:24) con un `upgrade` que añada `videosUrls` a los ejercicios existentes.

**Recomendación:** Usar Opción A por ser menos invasiva, a menos que se requieran otros cambios de esquema.

#### 4.4.2 Migración en Hook useBiblioteca

**Archivo:** [`useBiblioteca.ts`](saludvalpa-app/src/modules/fisioterapia/hooks/useBiblioteca.ts)

No se requieren cambios en el hook, ya que:
- El tipo `Ejercicio` ya tiene `videosUrls?: string[]`.
- Dexie almacena el objeto completo; al leerlo, si el campo existe (aunque sea `[]`), se incluirá.
- La migración en `database.ts` garantiza que todos los ejercicios tengan el campo.

#### 4.4.3 Corrección en inicialización de precargados

En [`database.ts`](saludvalpa-app/src/db/database.ts:219), la línea:
```typescript
videosUrls: e.imagenUrl ? [] : undefined,
```
Es incorrecta porque asigna `undefined` cuando no hay `imagenUrl`. Debe cambiarse a:
```typescript
videosUrls: [],
```
Para que todos los ejercicios nuevos tengan el campo `videosUrls` inicializado como arreglo vacío.

---

## 5. Archivos a Modificar

| # | Archivo | Cambios Específicos |
|---|---------|---------------------|
| 1 | [`src/data/ejerciciosPrecargados.ts`](saludvalpa-app/src/data/ejerciciosPrecargados.ts) | Reescribir ~150 ejercicios genéricos (~3000 líneas) con nombres específicos, descripciones únicas, instrucciones detalladas, zonas corporales correctas, contraindicaciones específicas y equipo necesario realista. Mantener intactos los ~50 ejercicios artesanales. |
| 2 | [`src/modules/fisioterapia/biblioteca/FormularioEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/FormularioEjercicio.tsx) | Agregar estado `videosUrls`, campo de entrada en UI, validación de URLs, inclusión en submit. Aprox. +60 líneas. |
| 3 | [`src/modules/fisioterapia/biblioteca/DetalleEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/DetalleEjercicio.tsx) | Agregar sección condicional para mostrar enlaces a videos clickeables. Aprox. +25 líneas. |
| 4 | [`src/modules/fisioterapia/biblioteca/TarjetaEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/TarjetaEjercicio.tsx) | Agregar badge condicional "📹 Video" cuando el ejercicio tenga videosUrls. Aprox. +10 líneas. |
| 5 | [`src/modules/fisioterapia/rutinas/generadorPDFRutina.ts`](saludvalpa-app/src/modules/fisioterapia/rutinas/generadorPDFRutina.ts) | Agregar en la sección de detalles de cada ejercicio los enlaces a video usando `textWithLink()`. Aprox. +20 líneas. |
| 6 | [`src/db/database.ts`](saludvalpa-app/src/db/database.ts) | Corregir línea 219 para asignar `videosUrls: []` siempre. Agregar migración para ejercicios existentes sin `videosUrls`. Aprox. +15 líneas. |
| 7 | [`src/types/biblioteca.ts`](saludvalpa-app/src/types/biblioteca.ts) | **Sin cambios** — el campo `videosUrls?: string[]` ya existe en la línea 112. Solo verificar. |
| 8 | [`src/modules/fisioterapia/hooks/useBiblioteca.ts`](saludvalpa-app/src/modules/fisioterapia/hooks/useBiblioteca.ts) | **Sin cambios** — el hook ya maneja objetos `Ejercicio` completos. La migración en DB garantiza consistencia. |

---

## 6. Riesgos y Consideraciones

### 6.1 Preservación de Datos de Usuario

| Riesgo | Mitigación |
|--------|------------|
| Usuarios con ejercicios personalizados existentes podrían perder el campo `videosUrls` al actualizar | La migración en Fase 4 garantiza que todos los ejercicios (precargados y personalizados) reciban `videosUrls: []` si no lo tienen |
| Ejercicios precargados ya almacenados en IndexedDB con datos antiguos | La migración solo agrega el campo faltante, no sobrescribe datos existentes |
| Duplicados de nombres en precargados podrían causar confusión al actualizar | La reescritura (Fase 1) eliminará duplicados; la migración no afecta nombres |

### 6.2 Compatibilidad hacia Atrás

| Aspecto | Consideración |
|---------|---------------|
| Ejercicios en rutinas existentes | No se ven afectados — las rutinas almacenan solo `ejercicioId`, no el contenido completo |
| PDFs ya generados | No se modifican — los PDFs son estáticos una vez generados |
| Tipo `Ejercicio` | No cambia — solo se usa el campo existente `videosUrls` |
| API de hooks | No cambia — `crearEjercicio`, `actualizarEjercicio` ya aceptan `Partial<Ejercicio>` |

### 6.3 Layout de PDF

| Riesgo | Mitigación |
|--------|------------|
| Los enlaces de video pueden ocupar espacio adicional en el PDF | Usar texto corto como `"Ver video 1"` en lugar de la URL completa |
| Múltiples videos pueden desbordar la página | Agregar lógica de salto de página y límite de videos mostrados |
| La función `textWithLink` puede no estar disponible en todas las versiones de jsPDF | Verificar que la versión instalada soporte enlaces; si no, mostrar la URL como texto plano |

### 6.4 Validación de URLs

| Riesgo | Mitigación |
|--------|------------|
| Usuarios ingresan URLs inválidas | Validación básica de formato URL en el formulario (regex simple) |
| URLs de video rotas con el tiempo | No es responsabilidad de la app — el usuario gestiona sus enlaces |
| Enlaces a contenido no seguro (HTTP vs HTTPS) | Forzar HTTPS en la validación o mostrar advertencia |

---

## 7. Criterios de Aceptación

### 7.1 Fase 1 — Ejercicios Precargados

- [ ] Todos los ~150 ejercicios genéricos han sido reescritos con nombres específicos y únicos.
- [ ] No existen nombres duplicados en el archivo de ejercicios precargados.
- [ ] Cada ejercicio tiene una descripción única que explica su propósito terapéutico.
- [ ] Las instrucciones son específicas para cada ejercicio (no plantillas idénticas).
- [ ] Las zonas corporales son correctas y relevantes (sin combinaciones ilógicas).
- [ ] Las contraindicaciones son específicas y relevantes para cada ejercicio.
- [ ] Los ~50 ejercicios artesanales originales se mantienen intactos.
- [ ] El archivo [`ejerciciosPrecargados.ts`](saludvalpa-app/src/data/ejerciciosPrecargados.ts) compila sin errores de tipo.

### 7.2 Fase 2 — Soporte de URLs de Video en UI

- [ ] [`FormularioEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/FormularioEjercicio.tsx) permite agregar múltiples URLs de video.
- [ ] Las URLs se pueden eliminar individualmente.
- [ ] Al editar un ejercicio existente, las URLs de video se cargan correctamente.
- [ ] Al crear un nuevo ejercicio, las URLs de video se guardan correctamente.
- [ ] [`DetalleEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/DetalleEjercicio.tsx) muestra enlaces clickeables a los videos.
- [ ] Los enlaces se abren en una nueva pestaña (`target="_blank"`).
- [ ] [`TarjetaEjercicio.tsx`](saludvalpa-app/src/modules/fisioterapia/biblioteca/TarjetaEjercicio.tsx) muestra un badge "📹 Video" cuando el ejercicio tiene videos.
- [ ] El badge no se muestra cuando el ejercicio no tiene videos.

### 7.3 Fase 3 — PDF con Videos

- [ ] [`generadorPDFRutina.ts`](saludvalpa-app/src/modules/fisioterapia/rutinas/generadorPDFRutina.ts) incluye enlaces a video en la sección de detalles de cada ejercicio.
- [ ] Los enlaces son clickeables en el PDF generado.
- [ ] Si un ejercicio tiene múltiples videos, todos se muestran numerados.
- [ ] Si no hay videos, no se muestra la sección de videos.
- [ ] El layout del PDF no se rompe por la inclusión de enlaces.

### 7.4 Fase 4 — Migración de Datos

- [ ] Todos los ejercicios existentes en IndexedDB (precargados y personalizados) tienen `videosUrls` inicializado como `[]`.
- [ ] La migración se ejecuta automáticamente al iniciar la app sin intervención del usuario.
- [ ] No se pierden datos existentes de ningún ejercicio durante la migración.
- [ ] La línea 219 de [`database.ts`](saludvalpa-app/src/db/database.ts) está corregida para asignar `videosUrls: []` siempre.
- [ ] Los logs de consola confirman la migración exitosa.

### 7.5 Generales

- [ ] Todos los cambios aplican solo a la especialidad de Fisioterapia.
- [ ] No hay regresiones en otras especialidades.
- [ ] La app compila sin errores de TypeScript.
- [ ] Las pruebas existantes pasan sin fallos.
- [ ] Los ejercicios personalizados creados por el usuario también tienen soporte de video.

---

## Apéndice A: Ejemplo de Transformación (Movilidad)

### Estado Actual (Genérico)

```typescript
{
  nombre: "Circunducción de Rodilla avanzado",
  categoria: CategoriaEjercicio.MOVILIDAD,
  zonasCorporales: [ZonaCorporal.RODILLA, ZonaCorporal.ANTEBRAZO],
  descripcion: "Movimientos circulares para aumentar movilidad articular.",
  instrucciones: [
    "Posición estable",
    "Realizar círculos pequeños con rodilla",
    "Aumentar gradualmente el tamaño",
    "Cambiar dirección después de 10 repeticiones",
    "Mantener respiración constante",
  ],
  repeticionesSugeridas: "4 series de 15 repeticiones",
  duracionSugerida: 8,
  intensidad: IntensidadEjercicio.BAJA,
  equipoNecesario: ["Banda elástica"],
  contraindicaciones: ["Lesión de rodilla", "Problemas cardíacos", "Lesión reciente"],
}
```

### Estado Deseado (Específico)

```typescript
{
  nombre: "Movilidad Rotacional de Rodilla en Descarga",
  categoria: CategoriaEjercicio.MOVILIDAD,
  zonasCorporales: [ZonaCorporal.RODILLA, ZonaCorporal.PIERNA],
  descripcion: "Movilidad articular de rodilla en posición sentada, realizando rotaciones controladas de la pierna para mejorar el rango de movimiento rotacional y reducir rigidez articular.",
  instrucciones: [
    "Sentado en una silla con la espalda recta y los pies apoyados en el suelo",
    "Extender la pierna derecha hacia adelante sin bloquear la rodilla",
    "Realizar círculos pequeños con la pierna, moviendo desde la rodilla",
    "Completar 10 círculos en sentido horario de forma lenta y controlada",
    "Invertir el sentido y realizar 10 círculos en sentido antihorario",
    "Repetir el proceso con la pierna izquierda",
  ],
  repeticionesSugeridas: "10 círculos por sentido en cada pierna",
  duracionSugerida: 6,
  intensidad: IntensidadEjercicio.BAJA,
  equipoNecesario: [],
  contraindicaciones: [
    "Derrame articular activo de rodilla",
    "Postoperatorio inmediato de ligamento cruzado anterior (LCA)",
    "Inestabilidad rotuliana severa",
  ],
}
```

---

## Apéndice B: Ejemplo de Transformación (Fuerza)

### Estado Actual (Genérico)

```typescript
{
  nombre: "Fortalecimiento de Codo",
  categoria: CategoriaEjercicio.FUERZA,
  zonasCorporales: [ZonaCorporal.CODO, ZonaCorporal.MUNECA, ZonaCorporal.PIE],
  descripcion: "Ejercicio para fortalecer codo.",
  instrucciones: [
    "Posición inicial cómoda",
    "Realizar el movimiento de fortalecimiento",
    "Mantener la contracción 3 segundos",
    "Repetir 10 veces",
    "Descansar 30 segundos entre series",
  ],
  repeticionesSugeridas: "3 series de 10 repeticiones",
  duracionSugerida: 5,
  intensidad: IntensidadEjercicio.MEDIA,
  equipoNecesario: ["Mancuerna", "Banda elástica"],
  contraindicaciones: ["Lesión de codo", "Problemas cardíacos"],
}
```

### Estado Deseado (Específico)

```typescript
{
  nombre: "Flexión de Codo con Banda Elástica (Bíceps)",
  categoria: CategoriaEjercicio.FUERZA,
  zonasCorporales: [ZonaCorporal.BRAZO, ZonaCorporal.ANTEBRAZO],
  descripcion: "Fortalecimiento isotónico de bíceps braquial usando banda elástica de resistencia progresiva. Ideal para fase media de rehabilitación de codo.",
  instrucciones: [
    "De pie con la banda elástica bajo el pie derecho y sosteniendo el extremo con la mano derecha",
    "Mantener el codo pegado al costado del cuerpo durante todo el movimiento",
    "Flexionar lentamente el codo llevando la mano hacia el hombro",
    "Mantener la contracción máxima por 2 segundos",
    "Extender el codo de forma controlada (3 segundos) hasta la posición inicial",
    "Realizar 12 repeticiones y cambiar de brazo",
  ],
  repeticionesSugeridas: "3 series de 12 repeticiones por brazo",
  duracionSugerida: 10,
  intensidad: IntensidadEjercicio.MEDIA,
  equipoNecesario: ["Banda elástica de resistencia media"],
  contraindicaciones: [
    "Epicondilitis lateral aguda (codo de tenista)",
    "Desgarro de bíceps distal no tratado",
    "Inestabilidad de codo post-luxación (fase inicial)",
  ],
}
```
