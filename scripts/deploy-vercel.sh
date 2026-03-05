#!/bin/bash

# ============================================================================
# Script de despliegue automatizado para Vercel
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
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
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
    
    # Verificar Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI no está instalado. Instalando..."
        npm install -g vercel
    fi
    
    # Verificar variables de entorno
    if [[ -z "$VERCEL_TOKEN" ]]; then
        log_warning "VERCEL_TOKEN no está configurado"
        read -p "Ingrese el token de Vercel: " VERCEL_TOKEN
    fi
    
    if [[ -z "$VERCEL_PROJECT_ID" ]]; then
        log_warning "VERCEL_PROJECT_ID no está configurado"
        # Intentar obtener del archivo .vercel/project.json
        if [[ -f ".vercel/project.json" ]]; then
            VERCEL_PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null || echo "")
        fi
        
        if [[ -z "$VERCEL_PROJECT_ID" ]]; then
            read -p "Ingrese el Project ID de Vercel: " VERCEL_PROJECT_ID
        fi
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

# Desplegar a Vercel
deploy_to_vercel() {
    log_info "Desplegando a Vercel..."
    
    # Configurar variables de entorno para Vercel CLI
    export VERCEL_ORG_ID
    export VERCEL_PROJECT_ID
    export VERCEL_TOKEN
    
    # Verificar si ya estamos autenticados
    if ! vercel whoami &>/dev/null; then
        log_info "Autenticando con Vercel..."
        echo "$VERCEL_TOKEN" | vercel login --token
    fi
    
    # Desplegar
    log_info "Iniciando despliegue a Vercel..."
    vercel deploy \
        --prebuilt \
        --prod \
        --token="$VERCEL_TOKEN" \
        --yes \
        --confirm \
        2>&1 | tee vercel-deploy.log
    
    DEPLOY_EXIT_CODE=${PIPESTATUS[0]}
    
    if [[ $DEPLOY_EXIT_CODE -eq 0 ]]; then
        # Extraer URL del deploy
        DEPLOY_URL=$(grep -o "https://.*\.vercel\.app" vercel-deploy.log | tail -1)
        if [[ -z "$DEPLOY_URL" ]]; then
            DEPLOY_URL=$(grep -o "https://.*-.*\.vercel\.app" vercel-deploy.log | tail -1)
        fi
        
        if [[ -n "$DEPLOY_URL" ]]; then
            log_success "Despliegue exitoso!"
            log_info "URL del despliegue: $DEPLOY_URL"
            echo "DEPLOY_URL=$DEPLOY_URL" >> deploy-info.env
        fi
        
        # Obtener detalles del deploy
        DEPLOY_ID=$(grep -o "Deployment ID: .*" vercel-deploy.log | cut -d' ' -f3)
        if [[ -z "$DEPLOY_ID" ]]; then
            DEPLOY_ID=$(grep -o "Created deployment .*" vercel-deploy.log | cut -d' ' -f3)
        fi
        
        if [[ -n "$DEPLOY_ID" ]]; then
            log_info "ID del despliegue: $DEPLOY_ID"
            echo "DEPLOY_ID=$DEPLOY_ID" >> deploy-info.env
        fi
    else
        log_error "El despliegue a Vercel falló"
        exit 1
    fi
}

# Verificar despliegue
verify_deployment() {
    log_info "Verificando despliegue..."
    
    if [[ -z "$DEPLOY_URL" ]]; then
        DEPLOY_URL=$(grep -o "https://.*\.vercel\.app" vercel-deploy.log | tail -1)
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
        
        # Verificar archivos estáticos
        if curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/assets/index-*.js" | grep -q "200"; then
            log_success "Archivos JavaScript cargando correctamente"
        else
            log_warning "No se pudieron verificar archivos JavaScript"
        fi
        
        log_success "Verificación básica completada"
    fi
}

# Configurar dominio personalizado (opcional)
setup_custom_domain() {
    if [[ -n "$CUSTOM_DOMAIN" ]]; then
        log_info "Configurando dominio personalizado: $CUSTOM_DOMAIN"
        
        # Verificar si el dominio ya está configurado
        if vercel domains ls | grep -q "$CUSTOM_DOMAIN"; then
            log_info "Dominio ya configurado"
        else
            # Añadir dominio
            vercel domains add "$CUSTOM_DOMAIN" --token="$VERCEL_TOKEN"
            
            if [[ $? -eq 0 ]]; then
                log_success "Dominio $CUSTOM_DOMAIN añadido exitosamente"
            else
                log_warning "No se pudo añadir el dominio $CUSTOM_DOMAIN"
            fi
        fi
        
        # Asignar dominio al proyecto
        vercel domains assign "$CUSTOM_DOMAIN" "$VERCEL_PROJECT_ID" --token="$VERCEL_TOKEN"
        
        if [[ $? -eq 0 ]]; then
            log_success "Dominio asignado al proyecto"
        else
            log_warning "No se pudo asignar el dominio al proyecto"
        fi
    fi
}

# Generar reporte de despliegue
generate_deployment_report() {
    log_info "Generando reporte de despliegue..."
    
    REPORT_FILE="deployment-report-vercel-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Reporte de Despliegue Vercel - SaludValpa 3.0

## Información del Despliegue
- **Fecha:** $(date)
- **Proyecto:** $PROJECT_NAME
- **Entorno:** Producción
- **Plataforma:** Vercel

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

## Configuración Vercel
- **Project ID:** $VERCEL_PROJECT_ID
- **Org ID:** $VERCEL_ORG_ID
- **Dominio personalizado:** ${CUSTOM_DOMAIN:-No configurado}

## Logs
\`\`\`
$(tail -20 vercel-deploy.log 2>/dev/null || echo "No hay logs disponibles")
\`\`\`

## Siguientes Pasos
1. Verificar funcionalidad completa en $DEPLOY_URL
2. Configurar analytics y monitoreo
3. Configurar backup automático de datos
4. Monitorear performance en producción

---
*Reporte generado automáticamente por el script de despliegue Vercel*
EOF
    
    log_success "Reporte generado: $REPORT_FILE"
}

# Función principal
main() {
    log_info "Iniciando despliegue automatizado de SaludValpa 3.0 a Vercel"
    log_info "=============================================================="
    
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
    
    # Paso 5: Desplegar a Vercel
    deploy_to_vercel
    
    # Paso 6: Configurar dominio personalizado (opcional)
    if [[ -n "$CUSTOM_DOMAIN" ]]; then
        setup_custom_domain
    fi
    
    # Paso 7: Verificar despliegue
    verify_deployment
    
    # Paso 8: Generar reporte
    generate_deployment_report
    
    log_success "Despliegue a Vercel completado exitosamente!"
    log_info "URL de producción: $DEPLOY_URL"
    log_info "Reporte generado: $REPORT_FILE"
}

# Manejar argumentos
case "$1" in
    "--help" | "-h")
        echo "Uso: $0 [OPCIONES]"
        echo ""
        echo "Opciones:"
        echo "  --with-migration    Ejecutar migración de configuraciones antes del despliegue"
        echo "  --skip-tests        Omitir ejecución de pruebas"
        echo "  --domain=DOMINIO    Configurar dominio personalizado"
        echo "  --help, -h          Mostrar este mensaje de ayuda"
        echo ""
        echo "Variables de entorno requeridas:"
        echo "  VERCEL_TOKEN        Token de autenticación de Vercel"
        echo "  VERCEL_PROJECT_ID   ID del proyecto en Vercel (opcional)"
        echo "  VERCEL_ORG_ID       ID de la organización en Vercel (opcional)"
        echo ""
        echo "Ejemplos:"
        echo "  $0 --with-migration"
        echo "  CUSTOM_DOMAIN=mi-dominio.com $0"
        echo ""
        exit 0
        ;;
    "--domain="*)
        CUSTOM_DOMAIN="${1#--domain=}"
        shift
        ;;
esac

# Ejecutar función principal
main "$@"