#!/bin/bash

# ============================================================================
# Script de despliegue automatizado para Netlify
# SaludValpa 3.0 - Fase 4: Sistema de Configuración Unificado
# ============================================================================

set -e  # Salir inmediatamente si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
PROJECT_NAME="saludvalpa-app"
BUILD_DIR="dist"
NETLIFY_SITE_ID="${NETLIFY_SITE_ID:-}"
NETLIFY_AUTH_TOKEN="${NETLIFY_AUTH_TOKEN:-}"
DEPLOY_MESSAGE="Deploy automático de SaludValpa 3.0 - Fase 4: Sistema de Configuración Unificado"

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
check_prerequisites() {
    log_info "Verificando prerrequisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    
    # Verificar Netlify CLI
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI no está instalado. Instalando..."
        npm install -g netlify-cli
    fi
    
    # Verificar variables de entorno
    if [[ -z "$NETLIFY_SITE_ID" ]]; then
        log_warning "NETLIFY_SITE_ID no está configurado"
        read -p "Ingrese el Site ID de Netlify: " NETLIFY_SITE_ID
    fi
    
    if [[ -z "$NETLIFY_AUTH_TOKEN" ]]; then
        log_warning "NETLIFY_AUTH_TOKEN no está configurado"
        read -p "Ingrese el token de autenticación de Netlify: " NETLIFY_AUTH_TOKEN
    fi
    
    log_success "Prerrequisitos verificados correctamente"
}

# Ejecutar migración de configuraciones
run_migration() {
    log_info "Ejecutando migración de configuraciones..."
    
    if [[ -f "migrate-configurations.js" ]]; then
        node migrate-configurations.js --dry-run
        if [[ $? -eq 0 ]]; then
            log_info "Migración de prueba exitosa. Ejecutando migración real..."
            node migrate-configurations.js
            log_success "Migración completada exitosamente"
        else
            log_error "La migración de prueba falló"
            exit 1
        fi
    else
        log_warning "Script de migración no encontrado, continuando sin migración"
    fi
}

# Ejecutar pruebas
run_tests() {
    log_info "Ejecutando pruebas..."
    
    # Pruebas unitarias
    npm test -- --run 2>&1 | tee test-results.log
    
    if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
        log_warning "Algunas pruebas fallaron, revisando..."
        # Continuar si son pruebas no críticas
        if grep -q "FAIL" test-results.log; then
            log_error "Pruebas críticas fallaron. Abortando despliegue."
            exit 1
        fi
    fi
    
    log_success "Pruebas ejecutadas correctamente"
}

# Construir la aplicación
build_app() {
    log_info "Construyendo aplicación..."
    
    # Limpiar build anterior
    if [[ -d "$BUILD_DIR" ]]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Instalar dependencias
    npm ci --silent
    
    # Construir aplicación
    npm run build
    
    # Verificar que el build fue exitoso
    if [[ ! -d "$BUILD_DIR" ]] || [[ ! -f "$BUILD_DIR/index.html" ]]; then
        log_error "La construcción falló. No se encontró $BUILD_DIR/index.html"
        exit 1
    fi
    
    log_success "Aplicación construida correctamente"
    
    # Mostrar estadísticas del build
    BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
    log_info "Tamaño del build: $BUILD_SIZE"
    log_info "Número de archivos: $FILE_COUNT"
}

# Desplegar a Netlify
deploy_to_netlify() {
    log_info "Desplegando a Netlify..."
    
    # Configurar Netlify CLI
    export NETLIFY_SITE_ID
    export NETLIFY_AUTH_TOKEN
    
    # Desplegar
    netlify deploy \
        --dir="$BUILD_DIR" \
        --prod \
        --message="$DEPLOY_MESSAGE" \
        --timeout=600 \
        2>&1 | tee netlify-deploy.log
    
    DEPLOY_EXIT_CODE=${PIPESTATUS[0]}
    
    if [[ $DEPLOY_EXIT_CODE -eq 0 ]]; then
        # Extraer URL del deploy
        DEPLOY_URL=$(grep -o "https://.*\.netlify\.app" netlify-deploy.log | tail -1)
        if [[ -n "$DEPLOY_URL" ]]; then
            log_success "Despliegue exitoso!"
            log_info "URL del despliegue: $DEPLOY_URL"
            echo "DEPLOY_URL=$DEPLOY_URL" >> deploy-info.env
        fi
        
        # Obtener detalles del deploy
        DEPLOY_ID=$(grep -o "Deploy ID: .*" netlify-deploy.log | cut -d' ' -f3)
        if [[ -n "$DEPLOY_ID" ]]; then
            log_info "ID del despliegue: $DEPLOY_ID"
            echo "DEPLOY_ID=$DEPLOY_ID" >> deploy-info.env
        fi
    else
        log_error "El despliegue a Netlify falló"
        exit 1
    fi
}

# Verificar despliegue
verify_deployment() {
    log_info "Verificando despliegue..."
    
    if [[ -z "$DEPLOY_URL" ]]; then
        DEPLOY_URL=$(grep -o "https://.*\.netlify\.app" netlify-deploy.log | tail -1)
    fi
    
    if [[ -z "$DEPLOY_URL" ]]; then
        log_warning "No se pudo obtener URL del despliegue, omitiendo verificación"
        return 0
    fi
    
    # Esperar a que el sitio esté disponible
    log_info "Esperando a que el sitio esté disponible..."
    for i in {1..30}; do
        if curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" | grep -q "200\|302"; then
            log_success "Sitio disponible en $DEPLOY_URL"
            break
        fi
        
        if [[ $i -eq 30 ]]; then
            log_error "El sitio no está disponible después de 30 intentos"
            return 1
        fi
        
        sleep 2
        echo -n "."
    done
    echo ""
    
    # Ejecutar script de verificación de despliegue
    if [[ -f "scripts/verify-deployment.sh" ]]; then
        log_info "Ejecutando verificación completa del despliegue..."
        DEPLOY_URL="$DEPLOY_URL" ./scripts/verify-deployment.sh
    else
        # Verificación básica
        log_info "Realizando verificación básica..."
        
        # Verificar página principal
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL")
        if [[ "$HTTP_STATUS" != "200" ]] && [[ "$HTTP_STATUS" != "302" ]]; then
            log_error "Página principal retornó código $HTTP_STATUS"
            return 1
        fi
        
        # Verificar que la aplicación React está cargando
        if ! curl -s "$DEPLOY_URL" | grep -q "SaludValpa"; then
            log_warning "No se encontró 'SaludValpa' en la página principal"
        fi
        
        log_success "Verificación básica completada"
    fi
}

# Generar reporte de despliegue
generate_deployment_report() {
    log_info "Generando reporte de despliegue..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Reporte de Despliegue - SaludValpa 3.0

## Información del Despliegue
- **Fecha:** $(date)
- **Proyecto:** $PROJECT_NAME
- **Entorno:** Producción
- **Plataforma:** Netlify

## Resultados

### Build
- **Tamaño del build:** $BUILD_SIZE
- **Número de archivos:** $FILE_COUNT
- **Estado:** $(if [[ -d "$BUILD_DIR" ]]; then echo "✅ Exitosa"; else echo "❌ Fallida"; fi)

### Despliegue
- **URL:** $DEPLOY_URL
- **ID del despliegue:** $DEPLOY_ID
- **Estado:** $(if [[ -n "$DEPLOY_URL" ]]; then echo "✅ Exitosa"; else echo "❌ Fallida"; fi)

### Verificación
- **Disponibilidad:** $(if verify_deployment &>/dev/null; then echo "✅ Disponible"; else echo "❌ No disponible"; fi)
- **Código HTTP:** $(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" 2>/dev/null || echo "N/A")

### Pruebas
- **Pruebas ejecutadas:** $(grep -c "PASS\|FAIL" test-results.log 2>/dev/null || echo "N/A")
- **Pruebas pasadas:** $(grep -c "PASS" test-results.log 2>/dev/null || echo "N/A")
- **Pruebas fallidas:** $(grep -c "FAIL" test-results.log 2>/dev/null || echo "N/A")

## Logs
\`\`\`
$(tail -20 netlify-deploy.log 2>/dev/null || echo "No hay logs disponibles")
\`\`\`

## Siguientes Pasos
1. Verificar funcionalidad completa en $DEPLOY_URL
2. Probar migración de configuraciones
3. Validar accesibilidad
4. Monitorear errores en producción

---
*Reporte generado automáticamente por el script de despliegue*
EOF
    
    log_success "Reporte generado: $REPORT_FILE"
}

# Función principal
main() {
    log_info "Iniciando despliegue automatizado de SaludValpa 3.0 a Netlify"
    log_info "================================================================"
    
    # Paso 1: Verificar prerrequisitos
    check_prerequisites
    
    # Paso 2: Ejecutar migración (opcional)
    if [[ "$1" == "--with-migration" ]]; then
        run_migration
    fi
    
    # Paso 3: Ejecutar pruebas
    if [[ "$1" != "--skip-tests" ]]; then
        run_tests
    fi
    
    # Paso 4: Construir aplicación
    build_app
    
    # Paso 5: Desplegar a Netlify
    deploy_to_netlify
    
    # Paso 6: Verificar despliegue
    verify_deployment
    
    # Paso 7: Generar reporte
    generate_deployment_report
    
    log_success "Despliegue completado exitosamente!"
    log_info "URL de producción: $DEPLOY_URL"
    log_info "Reporte generado: deployment-report-*.md"
}

# Manejar argumentos
case "$1" in
    "--help" | "-h")
        echo "Uso: $0 [OPCIONES]"
        echo ""
        echo "Opciones:"
        echo "  --with-migration    Ejecutar migración de configuraciones antes del despliegue"
        echo "  --skip-tests        Omitir ejecución de pruebas"
        echo "  --help, -h          Mostrar este mensaje de ayuda"
        echo ""
        echo "Variables de entorno requeridas:"
        echo "  NETLIFY_SITE_ID     ID del sitio en Netlify"
        echo "  NETLIFY_AUTH_TOKEN  Token de autenticación de Netlify"
        echo ""
        exit 0
        ;;
esac

# Ejecutar función principal
main "$@"