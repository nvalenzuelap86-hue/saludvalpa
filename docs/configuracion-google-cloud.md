# Configuración de Google Cloud Console para Sincronización en la Nube

## 📋 Introducción

Esta guía explica cómo configurar Google Cloud Console para habilitar la sincronización con Google Drive en SaludValpa 3.0. La funcionalidad permite a los usuarios respaldar y restaurar sus datos en su propia cuenta de Google Drive, manteniendo el control total de sus datos.

## 🎯 Requisitos Previos

1. Una cuenta de Google (Gmail o Google Workspace)
2. Acceso a [Google Cloud Console](https://console.cloud.google.com/)
3. Proyecto SaludValpa desplegado o en desarrollo local

## 🚀 Pasos de Configuración

### Paso 1: Crear un Nuevo Proyecto

1. Accede a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos (parte superior izquierda)
3. Selecciona "NUEVO PROYECTO"
4. Asigna un nombre al proyecto, por ejemplo: `SaludValpa Cloud Sync`
5. Haz clic en "CREAR"

### Paso 2: Habilitar las APIs Necesarias

1. En el menú lateral, ve a "APIs y Servicios" > "Biblioteca"
2. Busca y habilita las siguientes APIs:
   - **Google Drive API** - Para acceso a Google Drive
   - **Google OAuth 2.0** - Para autenticación de usuarios

3. Para habilitar cada API:
   - Haz clic en la API
   - Haz clic en "HABILITAR"
   - Repite para la segunda API

### Paso 3: Configurar Pantalla de Consentimiento OAuth

1. Ve a "APIs y Servicios" > "Pantalla de consentimiento OAuth"
2. Selecciona "Externo" (para desarrollo) o "Interno" (para Google Workspace)
3. Haz clic en "CREAR"

4. Completa la información requerida:
   - **Nombre de la app**: `SaludValpa - Sincronización en la Nube`
   - **Correo electrónico de soporte**: Tu correo de desarrollador
   - **Logo** (opcional): Puedes subir el logo de SaludValpa
   - **Dominio de la app**: `localhost` (para desarrollo)

5. En "Ámbitos autorizados", haz clic en "AGREGAR O ELIMINAR ÁMBITOS"
   - Busca y selecciona: `../auth/drive.file`
   - Este ámbito permite a SaludValpa acceder solo a archivos que crea

6. En "Usuarios de prueba", agrega las cuentas de Google que usarán la app en desarrollo
7. Haz clic en "GUARDAR Y CONTINUAR" hasta completar

### Paso 4: Crear Credenciales OAuth 2.0

1. Ve a "APIs y Servicios" > "Credenciales"
2. Haz clic en "+ CREAR CREDENCIALES" > "ID de cliente OAuth"
3. Configura la aplicación:
   - **Tipo de aplicación**: Aplicación web
   - **Nombre**: `SaludValpa Web Client`

4. En "URI de redireccionamiento autorizados", agrega:
   - Para desarrollo local: `http://localhost:5173`
   - Para producción: `https://tudominio.com`
   - Para Vercel: `https://tu-app.vercel.app`

5. Haz clic en "CREAR"
6. **¡IMPORTANTE!** Copia el **ID de cliente** que se genera
   - Se verá como: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

### Paso 5: Configurar Clave API (Opcional)

1. En "Credenciales", haz clic en "+ CREAR CREDENCIALES" > "Clave API"
2. Copia la clave generada (se usará para algunas operaciones de la API)

## 🔧 Configuración en SaludValpa

### Variables de Entorno

Actualiza las siguientes variables en tu archivo `.env.local` o en las variables de entorno de producción:

```env
# Desarrollo local (.env.local)
VITE_GOOGLE_CLIENT_ID=TU_ID_DE_CLIENTE_AQUI.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=TU_CLAVE_API_AQUI

# Producción (Vercel, Netlify, etc.)
# Configurar en el panel de variables de entorno del hosting
```

### Verificación de Configuración

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Navega a Configuración Avanzada > Sincronización
3. Haz clic en "Conectar con Google Drive"
4. Deberías ver la pantalla de autorización de Google

## 🛠️ Troubleshooting

### Error: "redirect_uri_mismatch"

**Síntoma**: Al intentar conectar, Google muestra error de URI de redireccionamiento.

**Solución**:
1. Ve a Google Cloud Console > Credenciales
2. Edita el ID de cliente OAuth 2.0
3. Verifica que los URIs de redireccionamiento incluyan exactamente:
   - `http://localhost:5173` para desarrollo
   - Tu dominio de producción exacto

### Error: "API no habilitada"

**Síntoma**: Error 403 al intentar acceder a Google Drive.

**Solución**:
1. Verifica que las APIs estén habilitadas:
   - Google Drive API
   - Google OAuth 2.0 API
2. Asegúrate de que el proyecto correcto esté seleccionado

### Error: "Ámbito no autorizado"

**Síntoma**: La app solicita permisos adicionales no configurados.

**Solución**:
1. Ve a Pantalla de consentimiento OAuth
2. Agrega el ámbito `../auth/drive.file`
3. Publica los cambios en la pantalla de consentimiento

## 🔒 Consideraciones de Seguridad

### Ámbitos de Permisos

SaludValpa utiliza el ámbito `drive.file` que:
- Solo permite acceso a archivos creados por SaludValpa
- No permite acceso a todo Google Drive
- Los usuarios mantienen control total

### Almacenamiento de Credenciales

- **Nunca** commits las credenciales reales en el repositorio
- Usa variables de entorno para desarrollo y producción
- Rota las claves API periódicamente

### Limitaciones de Cuota

Google Drive API tiene límites de uso:
- 1,000,000,000 solicitudes por día por proyecto
- 1,000 solicitudes por 100 segundos por usuario

Para uso personal de SaludValpa, estos límites son más que suficientes.

## 📈 Configuración para Producción

### Dominios Autorizados

1. En Google Cloud Console, ve a "APIs y Servicios" > "Pantalla de consentimiento"
2. Agrega tus dominios de producción en "Dominios autorizados"
3. Publica la app para que esté disponible para todos los usuarios

### Restricciones de API

1. Ve a "APIs y Servicios" > "Credenciales"
2. Edita tu ID de cliente OAuth 2.0
3. En "Restricciones de la aplicación", configura:
   - **Restringir clave a sitios web HTTP**: Agrega tus dominios
   - **Restringir clave a direcciones IP**: Opcional para mayor seguridad

### Monitoreo y Logs

1. Ve a "APIs y Servicios" > "Dashboard"
2. Monitorea el uso de la API
3. Configura alertas para cuotas cercanas al límite

## 🤝 Soporte

Si encuentras problemas:

1. **Revisa los logs del navegador** (F12 > Consola)
2. **Verifica las credenciales** en Google Cloud Console
3. **Consulta la documentación oficial**:
   - [Google Drive API Documentation](https://developers.google.com/drive/api)
   - [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)

4. **Contacta al equipo de desarrollo** de SaludValpa si el problema persiste

## 📝 Notas Finales

- Esta configuración es necesaria solo una vez por proyecto
- Las credenciales de desarrollo y producción deben ser diferentes
- Realiza pruebas exhaustivas antes de desplegar a producción
- Mantén una copia de seguridad de tus credenciales en un lugar seguro

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0  
**Autor**: Equipo de Desarrollo SaludValpa 3.0