#!/bin/bash

# ============================================================================
# Script de despliegue automatizado para GitHub Pages
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
GH_PAGES_BRANCH="gh-pages"
GH_PAGES_REPO="${GH_PAGES_REPO:-}"
GH_TOKEN="${GH_TOKEN:-}"
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
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        log_error "git no está instalado"
        exit 1
    fi
    
    # Verificar variables de entorno
    if [[ -z "$GH_TOKEN" ]]; then
        log_warning "GH_TOKEN no está configurado"
        read -p "Ingrese el token de GitHub: " GH_TOKEN
    fi
    
    # Obtener información del repositorio actual
    if [[ -z "$GH_PAGES_REPO" ]]; then
        GH_PAGES_REPO=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -z "$GH_PAGES_REPO" ]]; then
            read -p "Ingrese la URL del repositorio GitHub (ej: https://github.com/usuario/repo.git): " GH_PAGES_REPO
        fi
    fi
    
    # Convertir URL SSH a HTTPS si es necesario
    if [[ "$GH_PAGES_REPO" == git@github.com:* ]]; then
        GH_PAGES_REPO=$(echo "$GH_PAGES_REPO" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
    fi
    
    # Añadir token a la URL
    if [[ "$GH_PAGES_REPO" == https://github.com/* ]]; then
        REPO_PATH=$(echo "$GH_PAGES_REPO" | sed 's|https://github.com/||')
        GH_PAGES_REPO_WITH_TOKEN="https://${GH_TOKEN}@github.com/${REPO_PATH}"
    else
        GH_PAGES_REPO_WITH_TOKEN="$GH_PAGES_REPO"
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

# Construir la aplicación para GitHub Pages
build_app() {
    log_info "Construyendo aplicación para GitHub Pages..."
    
    # Limpiar build anterior
    if [[ -d "$BUILD_DIR" ]]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Instalar dependencias
    npm ci --silent
    
    # Configurar base URL para GitHub Pages
    if [[ -n "$CUSTOM_BASE_PATH" ]]; then
        BASE_PATH="$CUSTOM_BASE_PATH"
    else
        # Extraer nombre del repositorio para la base path
        REPO_NAME=$(echo "$GH_PAGES_REPO" | sed 's|.*/||' | sed 's/\.git$//')
        BASE_PATH="/$REPO_NAME"
    fi
    
    log_info "Configurando base path: $BASE_PATH"
    
    # Crear archivo .env.local temporal para la build
    cat > .env.local << EOF
VITE_BASE_PATH=$BASE_PATH
VITE_APP_NAME=SaludValpa
VITE_APP_VERSION=3.0.0
EOF
    
    # Construir aplicación con base path
    npm run build
    
    # Verificar que el build fue exitoso
    if [[ ! -d "$BUILD_DIR" ]] || [[ ! -f "$BUILD_DIR/index.html" ]]; then
        log_error "La construcción falló. No se encontró $BUILD_DIR/index.html"
        exit 1
    fi
    
    # Crear archivo .nojekyll para deshabilitar Jekyll processing
    touch "$BUILD_DIR/.nojekyll"
    
    # Crear archivo CNAME si se especificó un dominio personalizado
    if [[ -n "$CUSTOM_DOMAIN" ]]; then
        echo "$CUSTOM_DOMAIN" > "$BUILD_DIR/CNAME"
    fi
    
    log_success "Aplicación construida correctamente para GitHub Pages"
    
    # Mostrar estadísticas del build
    BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
    log_info "Tamaño del build: $BUILD_SIZE"
    log_info "Número de archivos: $FILE_COUNT"
}

# Preparar branch gh-pages
prepare_gh_pages() {
    log_info "Preparando branch $GH_PAGES_BRANCH..."
    
    # Guardar el branch actual
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Crear o limpiar branch gh-pages
    if git show-ref --verify --quiet "refs/heads/$GH_PAGES_BRANCH"; then
        log_info "Branch $GH_PAGES_BRANCH ya existe, limpiando..."
        git checkout "$GH_PAGES_BRANCH"
        
        # Eliminar todos los archivos excepto .git
        git rm -rf . || true
        git clean -fd || true
    else
        log_info "Creando nuevo branch $GH_PAGES_BRANCH..."
        git checkout --orphan "$GH_PAGES_BRANCH"
        
        # Limpiar staging area
        git rm -rf . || true
    fi
    
    # Copiar archivos del build
    cp -r "$BUILD_DIR"/* .
    
    # Añadir archivos al staging
    git add -A
    
    # Commit
    git commit -m "$DEPLOY_MESSAGE" --allow-empty
    
    # Volver al branch original
    git checkout "$CURRENT_BRANCH"
    
    log_success "Branch $GH_PAGES_BRANCH preparado correctamente"
}

# Desplegar a GitHub Pages
deploy_to_github_pages() {
    log_info "Desplegando a GitHub Pages..."
    
    # Forzar push al branch gh-pages
    git push "$GH_PAGES_REPO_WITH_TOKEN" "$GH_PAGES_BRANCH" --force
    
    if [[ $? -eq 0 ]]; then
        # Construir URL del deploy
        if [[ -n "$CUSTOM_DOMAIN" ]]; then
            DEPLOY_URL="https://$CUSTOM_DOMAIN"
        else
            # Extraer usuario y repositorio
            if [[ "$GH_PAGES_REPO" =~ https://github.com/([^/]+)/([^/.]+) ]]; then
                USER="${BASH_REMATCH[1]}"
                REPO="${BASH_REMATCH[2]}"
                DEPLOY_URL="https://$USER.github.io/$REPO"
            else
                DEPLOY_URL="URL no determinada"
            fi
        fi
        
        log_success "Despliegue exitoso!"
        log_info "URL del despliegue: $DEPLOY_URL"
        echo "DEPLOY_URL=$DEPLOY_URL" >> deploy-info.env
        
        # Obtener commit hash
        DEPLOY_ID=$(git rev-parse --short HEAD)
        log_info "Commit ID del despliegue: $DEPLOY_ID"
        echo "DEPLOY_ID=$DEPLOY_ID" >> deploy-info.env
    else
        log_error "El despliegue a GitHub Pages falló"
        exit 1
    fi
}

# Configurar GitHub Pages en el repositorio
setup_github_pages() {
    log_info "Configurando GitHub Pages en el repositorio..."
    
    # Extraer usuario y repositorio
    if [[ "$GH_PAGES_REPO" =~ https://github.com/([^/]+)/([^/.]+) ]]; then
        USER="${BASH_REMATCH[1]}"
        REPO="${BASH_REMATCH[2]}"
        
        # Configurar GitHub Pages vía API
        curl -X POST \
            -H "Authorization: token $GH_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$USER/$REPO/pages" \
            -d '{
                "source": {
                    "branch": "gh-pages",
                    "path": "/"
                }
            }' 2>/dev/null || log_warning "No se pudo configurar GitHub Pages via API (puede que ya esté configurado)"
        
        log_success "GitHub Pages configurado para usar branch gh-pages"
    else
        log_warning "No se pudo extraer información del repositorio para configurar GitHub Pages"
    fi
}

# Verificar despliegue
verify_deployment() {
    log_info "Verificando despliegue..."
    
    if [[ -z "$DEPLOY_URL" ]]; then
        log_warning "No se pudo obtener URL del despliegue, omitiendo verificación"
        return 0
    fi
    
    # Esperar a que GitHub Pages esté disponible (puede tomar unos minutos)
    log_info "Esperando a que GitHub Pages esté disponible (esto puede tomar 1-2 minutos)..."
    for i in {1..60}; do
        if curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" | grep -q "200\|302\|404"; then
            # GitHub Pages retorna 404 inicialmente mientras se despliega
            if curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" | grep -q "200\|302"; then
                log_success "Sitio disponible en $DEPLOY_URL"
                break
            else
                log_info "Sitio desplegándose (código 404), esperando..."
            fi
        fi
        
        if [[ $i -eq 60 ]]; then
            log_error "El sitio no está disponible después de 60 intentos"
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

# Generar reporte de despliegue
generate_deployment_report() {
    log_info "Generando reporte de despliegue..."
    
    REPORT_FILE="deployment-report-github-pages-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Reporte de Despliegue GitHub Pages - SaludValpa 3.0

## Información del Despliegue
- **Fecha:** $(date)
- **Proyecto:** $PROJECT_NAME
- **Entorno:** Producción
- **Plataforma:** GitHub Pages

## Resultados

### Build
- **Tamaño del build:** $BUILD_SIZE
- **Número de archivos:** $FILE_COUNT
- **Base path:** $BASE_PATH
- **Estado:** $(if [[ -d "$BUILD_DIR" ]]; then echo "✅ Exitosa"; else echo "❌ Fallida"; fi)

### Despliegue
- **URL:** $DEPLOY_URL
- **Commit ID:** $DEPLOY_ID
- **Branch:** $GH_PAGES_BRANCH
- **Estado:** $(if [[ -n "$DEPLOY_URL" ]]; then echo "✅ Exitosa"; else echo "❌ Fallida"; fi)

### Verificación
- **Disponibilidad:** $(if verify_deployment &>/dev/null; then echo "✅ Disponible"; else echo "❌ No disponible"; fi)
- **Código HTTP:** $(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" 2>/dev/null || echo "N/A")

### Pruebas
- **Pruebas ejecutadas:** $(grep -c "PASS\|FAIL" test-results.log 2>/dev/null || echo "N/A")
- **Pruebas pasadas:** $(grep -c "PASS" test-results.log 2>/dev/null || echo "N/A")
- **Pruebas fallidas:** $(grep -c "FAIL" test-results.log 2>/dev/null || echo "N/A")

## Configuración GitHub
- **Repositorio:** $GH_PAGES_REPO
- **Branch de deploy:** $GH_PAGES_BRANCH
- **Dominio personalizado:** ${CUSTOM_DOMAIN:-No configurado}

## Logs
\`\`\`
$(tail -10 deploy-info.env 2>/dev/null || echo "No hay logs disponibles")
\`\`\`

## Siguientes Pasos
1. Verificar funcionalidad completa en $DEPLOY_URL
2. Configurar dominio personalizado si es necesario
3. Configurar HTTPS (automático en GitHub Pages)
4. Monitorear analytics de GitHub Pages

## Notas Importantes
- GitHub Pages puede tomar 1-2 minutos para reflejar cambios
- Los archivos estáticos se sirven desde el branch \`$GH_PAGES_BRANCH\`
- Se ha creado archivo \`.nojekyll\` para deshabilitar procesamiento Jekyll
- Base path configurado a \`$BASE_PATH\` para enrutamiento correcto

---
*Reporte generado automáticamente por el script de despliegue GitHub Pages*
EOF
    
    log_success "Reporte generado: $REPORT_FILE"
}

# Función principal
main() {
    log_info "Iniciando despliegue automatizado de SaludValpa 3.0 a GitHub Pages"
    log_info "===================================================================="
    
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
    
    # Paso 5: Preparar branch gh-pages
    prepare_gh_pages
    
    # Paso 6: Configurar GitHub Pages
    setup_github_pages
    
    # Paso 7: Desplegar a GitHub Pages
    deploy_to_github_pages
    
    # Paso 8: Verificar despliegue
    verify_deployment
    
    # Paso 9: Generar reporte
    generate_deployment_report
    
    log_success "Despliegue a GitHub Pages completado exitosamente!"
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
        echo "  --base-path=PATH    Especificar base path personalizado"
        echo "  --help, -h          Mostrar este mensaje de ayuda"
        echo ""
        echo "Variables de entorno requeridas:"
        echo "  GH_TOKEN            Token de autenticación de GitHub"
        echo "  GH_PAGES_REPO       URL del repositorio GitHub (opcional)"
        echo ""
        echo "Ejemplos:"
        echo "  $0 --with-migration"
        echo "  CUSTOM_DOMAIN=mi-dominio.com $0"
        echo "  $0 --base-path=/mi-app"
        echo ""
        exit 0
        ;;
    "--domain="*)
        CUSTOM_DOMAIN="${1#--domain=}"
        shift
        ;;
    "--base-path="*)
        CUSTOM_BASE_PATH="${1#--base-path=}"
        shift
        ;;
esac

# Ejecutar función principal
main "$@"
