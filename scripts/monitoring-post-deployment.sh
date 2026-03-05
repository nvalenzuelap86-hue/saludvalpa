#!/bin/bash

# ============================================================================
# Sistema de Monitoreo Post-Despliegue
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
MONITORING_INTERVAL="${MONITORING_INTERVAL:-300}"  # 5 minutos por defecto
ALERT_THRESHOLD_RESPONSE_TIME="${ALERT_THRESHOLD_RESPONSE_TIME:-5000}"  # 5 segundos

# Archivos de logs
LOG_FILE="monitoring-$(date +%Y%m%d).log"
HEALTH_FILE="health-status.json"

# URLs a monitorear
MONITOR_URLS=(
    "https://saludvalpa.netlify.app"
    "https://saludvalpa.vercel.app"
    "https://saludvalpa.github.io"
)

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1" >> "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [SUCCESS] $1" >> "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [WARNING] $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" >> "$LOG_FILE"
}

# Inicializar sistema de monitoreo
initialize_monitoring() {
    log_info "Inicializando sistema de monitoreo post-despliegue..."
    
    # Crear directorio de logs si no existe
    mkdir -p monitoring-logs
    
    # Inicializar archivo de estado de salud
    cat > "$HEALTH_FILE" << EOF
{
  "overall_status": "healthy",
  "last_check": "$(date -Iseconds)",
  "endpoints": {}
}
EOF
    
    log_success "Sistema de monitoreo inicializado"
}

# Verificar salud de un endpoint
check_endpoint_health() {
    local url="$1"
    local start_time=$(date +%s%N)
    
    # Realizar request con timeout
    local http_code
    local response_time
    local size
    
    if response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}|%{size_download}" \
        --max-time 10 \
        "$url" 2>/dev/null); then
        http_code=$(echo "$response" | cut -d'|' -f1)
        response_time=$(echo "$response" | cut -d'|' -f2)
        size=$(echo "$response" | cut -d'|' -f3)
    else
        http_code="000"
        response_time="10.000"
        size="0"
    fi
    
    local end_time=$(date +%s%N)
    local total_time_ms=$(( (end_time - start_time) / 1000000 ))
    
    # Determinar estado
    local status="unknown"
    if [[ "$http_code" =~ ^2[0-9]{2}$ ]]; then
        status="healthy"
    elif [[ "$http_code" =~ ^3[0-9]{2}$ ]]; then
        status="redirecting"
    elif [[ "$http_code" =~ ^4[0-9]{2}$ ]]; then
        status="client_error"
    elif [[ "$http_code" =~ ^5[0-9]{2}$ ]]; then
        status="server_error"
    else
        status="unreachable"
    fi
    
    # Verificar contenido
    local content_check="failed"
    if [[ "$status" == "healthy" ]] || [[ "$status" == "redirecting" ]]; then
        if curl -s "$url" 2>/dev/null | grep -qi "saludvalpa"; then
            content_check="passed"
        fi
    fi
    
    echo "$http_code|$total_time_ms|$size|$status|$content_check"
}

# Monitorear todos los endpoints
monitor_endpoints() {
    log_info "Monitoreando endpoints..."
    
    local all_healthy=true
    local endpoints_status=""
    
    for url in "${MONITOR_URLS[@]}"; do
        log_info "Verificando: $url"
        
        local result
        result=$(check_endpoint_health "$url")
        
        local http_code=$(echo "$result" | cut -d'|' -f1)
        local response_time=$(echo "$result" | cut -d'|' -f2)
        local size=$(echo "$result" | cut -d'|' -f3)
        local status=$(echo "$result" | cut -d'|' -f4)
        local content_check=$(echo "$result" | cut -d'|' -f5)
        
        # Evaluar alertas
        if [[ "$http_code" == "000" ]]; then
            log_error "  ✗ $url - No accesible (timeout)"
            all_healthy=false
        elif [[ "$http_code" =~ ^5[0-9]{2}$ ]]; then
            log_error "  ✗ $url - Error del servidor ($http_code)"
            all_healthy=false
        elif [[ "$http_code" =~ ^4[0-9]{2}$ ]]; then
            log_warning "  ⚠ $url - Error del cliente ($http_code)"
        elif [[ "$status" == "healthy" ]] && [[ "$content_check" == "passed" ]]; then
            log_success "  ✓ $url - HTTP $http_code (${response_time}ms)"
        elif [[ "$status" == "healthy" ]]; then
            log_warning "  ⚠ $url - HTTP $http_code pero contenido no verificado"
        else
            log_error "  ✗ $url - Estado: $status (HTTP $http_code)"
            all_healthy=false
        fi
        
        # Almacenar estado para el reporte
        endpoints_status+="\"$url\": {\"status\": \"$status\", \"http_code\": $http_code, \"response_time_ms\": $response_time, \"content_check\": \"$content_check\"},"
    done
    
    # Actualizar estado general de salud
    local overall_status="healthy"
    if [[ "$all_healthy" == false ]]; then
        overall_status="degraded"
    fi
    
    # Remover última coma
    endpoints_status="${endpoints_status%,}"
    
    # Actualizar archivo de salud
    cat > "$HEALTH_FILE" << EOF
{
  "overall_status": "$overall_status",
  "last_check": "$(date -Iseconds)",
  "endpoints": {
    $endpoints_status
  }
}
EOF
    
    log_success "Monitoreo completado - Estado general: $overall_status"
}

# Generar reporte de monitoreo
generate_monitoring_report() {
    log_info "Generando reporte de monitoreo..."
    
    local report_file="monitoring-report-$(date +%Y%m%d-%H%M%S).md"
    
    # Leer estado actual
    local overall_status=$(jq -r '.overall_status' "$HEALTH_FILE" 2>/dev/null || echo "unknown")
    local last_check=$(jq -r '.last_check' "$HEALTH_FILE" 2>/dev/null || echo "unknown")
    
    cat > "$report_file" << EOF
# Reporte de Monitoreo - SaludValpa 3.0

## Resumen Ejecutivo
- **Fecha del reporte:** $(date)
- **Estado general:** $overall_status
- **Última verificación:** $last_check

## Endpoints Monitoreados

EOF
    
    # Añadir estado de cada endpoint
    for url in "${MONITOR_URLS[@]}"; do
        local endpoint_status=$(jq -r ".endpoints.\"$url\".status // \"unknown\"" "$HEALTH_FILE" 2>/dev/null || echo "unknown")
        local http_code=$(jq -r ".endpoints.\"$url\".http_code // \"unknown\"" "$HEALTH_FILE" 2>/dev/null || echo "unknown")
        local response_time=$(jq -r ".endpoints.\"$url\".response_time_ms // \"unknown\"" "$HEALTH_FILE" 2>/dev/null || echo "unknown")
        
        cat >> "$report_file" << EOF
### $url
- **Estado:** $endpoint_status
- **Código HTTP:** $http_code
- **Tiempo de respuesta:** ${response_time}ms
- **Última verificación:** $last_check

EOF
    done
    
    # Añadir recomendaciones
    cat >> "$report_file" << EOF
## Recomendaciones

1. **Monitoreo continuo:** Ejecutar este script cada $MONITORING_INTERVAL segundos
2. **Alertas:** Configurar notificaciones por email o Slack para alertas críticas
3. **Métricas:** Revisar logs en \`monitoring-logs/\` para análisis histórico
4. **Acción:** Contactar al equipo de desarrollo si el estado es "degraded" por más de 1 hora

## Comandos Útiles

\`\`\`bash
# Ejecutar monitoreo una vez
./scripts/monitoring-post-deployment.sh --run-once

# Ejecutar monitoreo continuo
./scripts/monitoring-post-deployment.sh --continuous

# Ver estado actual
cat $HEALTH_FILE | jq .

# Ver logs del día
tail -f $LOG_FILE
\`\`\`

---
*Reporte generado automáticamente por el sistema de monitoreo SaludValpa*
EOF
    
    log_success "Reporte generado: $report_file"
}

# Ejecutar monitoreo una vez
run_monitoring_once() {
    initialize_monitoring
    monitor_endpoints
    generate_monitoring_report
}

# Ejecutar monitoreo continuo
run_monitoring_continuous() {
    log_info "Iniciando monitoreo continuo (intervalo: ${MONITORING_INTERVAL}s)"
    
    initialize_monitoring
    
    while true; do
        echo ""
        log_info "Ciclo de monitoreo iniciado"
        monitor_endpoints
        
        # Generar reporte cada hora
        local current_minute=$(date +%M)
        if [[ "$current_minute" == "00" ]]; then
            generate_monitoring_report
        fi
        
        log_info "Esperando $MONITORING_INTERVAL segundos para el próximo ciclo..."
        sleep "$MONITORING_INTERVAL"
    done
}

# Mostrar ayuda
show_help() {
    cat << EOF
Sistema de Monitoreo Post-Despliegue - SaludValpa 3.0

Uso: $0 [OPCIONES]

Opciones:
  --run-once      Ejecutar monitoreo una vez y generar reporte
  --continuous    Ejecutar monitoreo continuo (por defecto)
  --help, -h      Mostrar este mensaje de ayuda

Variables de entorno:
  MONITORING_INTERVAL           Intervalo entre verificaciones (segundos, default: 300)
  ALERT_THRESHOLD_RESPONSE_TIME Umbral para alertas de tiempo de respuesta (ms, default: 5000)

Ejemplos:
  $0 --run-once
  MONITORING_INTERVAL=60 $0 --continuous
  $0 --help

EOF
}

# Función principal
main() {
    case "$1" in
        "--run-once")
            run_monitoring_once
            ;;
        "--continuous" | "")
            run_monitoring_continuous
            ;;
        "--help" | "-h")
            show_help
            ;;
        *)
            echo "Opción no reconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
