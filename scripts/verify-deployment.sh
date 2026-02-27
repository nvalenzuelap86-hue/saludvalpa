#!/bin/bash

# Deployment Verification Script for SaludValpa App
# This script verifies that a deployment was successful

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== SaludValpa App Deployment Verification ===${NC}"

# Configuration
DEPLOYMENT_URL="${1:-https://saludvalpa-app.vercel.app}"
MAX_RETRIES=5
RETRY_DELAY=10

# Function to check HTTP status
check_http_status() {
    local url=$1
    echo -e "${YELLOW}Checking HTTP status for: $url${NC}"
    
    for i in $(seq 1 $MAX_RETRIES); do
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            echo -e "${GREEN}✓ HTTP Status: $HTTP_STATUS OK${NC}"
            return 0
        elif [ "$HTTP_STATUS" = "000" ]; then
            echo -e "${YELLOW}Attempt $i/$MAX_RETRIES: Connection failed, retrying in ${RETRY_DELAY}s...${NC}"
        else
            echo -e "${YELLOW}Attempt $i/$MAX_RETRIES: HTTP Status: $HTTP_STATUS, retrying in ${RETRY_DELAY}s...${NC}"
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e "${RED}✗ Failed to get HTTP 200 status after $MAX_RETRIES attempts${NC}"
    return 1
}

# Function to check page content
check_page_content() {
    local url=$1
    echo -e "${YELLOW}Checking page content for: $url${NC}"
    
    CONTENT=$(curl -s "$url" | grep -i "saludvalpa\|valpa" || true)
    
    if [ -n "$CONTENT" ]; then
        echo -e "${GREEN}✓ Page contains 'SaludValpa' or 'Valpa' content${NC}"
        return 0
    else
        echo -e "${RED}✗ Page does not contain expected 'SaludValpa' content${NC}"
        return 1
    fi
}

# Function to check JavaScript loading
check_js_loading() {
    local url=$1
    echo -e "${YELLOW}Checking JavaScript loading for: $url${NC}"
    
    # Get the page and look for script tags
    SCRIPTS=$(curl -s "$url" | grep -c "<script" || true)
    
    if [ "$SCRIPTS" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $SCRIPTS script tags${NC}"
        
        # Check if main JavaScript file is referenced
        MAIN_JS=$(curl -s "$url" | grep -i "index.*\.js" | head -1 || true)
        if [ -n "$MAIN_JS" ]; then
            echo -e "${GREEN}✓ Main JavaScript file referenced${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ No main JavaScript file found in page${NC}"
            return 0  # Not critical
        fi
    else
        echo -e "${RED}✗ No script tags found in page${NC}"
        return 1
    fi
}

# Function to check PWA manifest
check_pwa_manifest() {
    local url=$1
    echo -e "${YELLOW}Checking PWA manifest for: $url${NC}"
    
    # Try to get manifest
    MANIFEST_URL="$url/manifest.webmanifest"
    MANIFEST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$MANIFEST_URL" || echo "000")
    
    if [ "$MANIFEST_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ PWA manifest found (HTTP $MANIFEST_STATUS)${NC}"
        
        # Check manifest content
        MANIFEST_CONTENT=$(curl -s "$MANIFEST_URL" | grep -i "name" || true)
        if [ -n "$MANIFEST_CONTENT" ]; then
            echo -e "${GREEN}✓ PWA manifest contains app name${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ PWA manifest exists but may be empty${NC}"
            return 0  # Not critical
        fi
    else
        echo -e "${YELLOW}⚠ PWA manifest not found (HTTP $MANIFEST_STATUS)${NC}"
        return 0  # Not critical for basic functionality
    fi
}

# Function to check service worker
check_service_worker() {
    local url=$1
    echo -e "${YELLOW}Checking service worker for: $url${NC}"
    
    # Try to get service worker
    SW_URL="$url/sw.js"
    SW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SW_URL" || echo "000")
    
    if [ "$SW_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Service worker found (HTTP $SW_STATUS)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Service worker not found (HTTP $SW_STATUS)${NC}"
        return 0  # Not critical for basic functionality
    fi
}

# Function to check critical routes
check_critical_routes() {
    local base_url=$1
    echo -e "${YELLOW}Checking critical routes${NC}"
    
    # List of critical routes to check
    declare -a ROUTES=(
        "/"
        "/dashboard"
        "/pacientes"
        "/agenda"
        "/configuracion"
        "/activar-licencia"
    )
    
    ALL_ROUTES_OK=true
    
    for route in "${ROUTES[@]}"; do
        ROUTE_URL="${base_url}${route}"
        echo -n "  Checking $route... "
        
        ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$ROUTE_URL" || echo "000")
        
        if [ "$ROUTE_STATUS" = "200" ] || [ "$ROUTE_STATUS" = "302" ] || [ "$ROUTE_STATUS" = "301" ]; then
            echo -e "${GREEN}✓ (HTTP $ROUTE_STATUS)${NC}"
        else
            echo -e "${RED}✗ (HTTP $ROUTE_STATUS)${NC}"
            ALL_ROUTES_OK=false
        fi
    done
    
    if $ALL_ROUTES_OK; then
        echo -e "${GREEN}✓ All critical routes accessible${NC}"
        return 0
    else
        echo -e "${RED}✗ Some critical routes failed${NC}"
        return 1
    fi
}

# Function to check build artifacts
check_build_artifacts() {
    echo -e "${YELLOW}Checking build artifacts${NC}"
    
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓ Build directory exists${NC}"
        
        # Check for essential files
        ESSENTIAL_FILES=("index.html" "assets/" "manifest.webmanifest")
        ALL_FILES_OK=true
        
        for file in "${ESSENTIAL_FILES[@]}"; do
            if [ -e "dist/$file" ] || [ -d "dist/$file" ]; then
                echo -e "  ${GREEN}✓ $file exists${NC}"
            else
                echo -e "  ${RED}✗ $file missing${NC}"
                ALL_FILES_OK=false
            fi
        done
        
        if $ALL_FILES_OK; then
            echo -e "${GREEN}✓ All essential build artifacts present${NC}"
            return 0
        else
            echo -e "${RED}✗ Some build artifacts missing${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Build directory 'dist' not found${NC}"
        return 1
    fi
}

# Main verification function
verify_deployment() {
    local url=$1
    local exit_on_failure=$2
    
    echo -e "\n${GREEN}Starting deployment verification for: $url${NC}"
    
    # Track results
    declare -A RESULTS
    ALL_PASSED=true
    
    # Run checks
    echo -e "\n${YELLOW}=== Running Verification Checks ===${NC}"
    
    check_http_status "$url" && RESULTS["HTTP_STATUS"]="PASS" || RESULTS["HTTP_STATUS"]="FAIL"
    check_page_content "$url" && RESULTS["PAGE_CONTENT"]="PASS" || RESULTS["PAGE_CONTENT"]="FAIL"
    check_js_loading "$url" && RESULTS["JS_LOADING"]="PASS" || RESULTS["JS_LOADING"]="FAIL"
    check_pwa_manifest "$url" && RESULTS["PWA_MANIFEST"]="PASS" || RESULTS["PWA_MANIFEST"]="FAIL"
    check_service_worker "$url" && RESULTS["SERVICE_WORKER"]="PASS" || RESULTS["SERVICE_WORKER"]="FAIL"
    check_critical_routes "$url" && RESULTS["CRITICAL_ROUTES"]="PASS" || RESULTS["CRITICAL_ROUTES"]="FAIL"
    check_build_artifacts && RESULTS["BUILD_ARTIFACTS"]="PASS" || RESULTS["BUILD_ARTIFACTS"]="FAIL"
    
    # Print summary
    echo -e "\n${GREEN}=== Verification Summary ===${NC}"
    for check in "${!RESULTS[@]}"; do
        if [ "${RESULTS[$check]}" = "PASS" ]; then
            echo -e "${GREEN}✓ $check: PASS${NC}"
        else
            echo -e "${RED}✗ $check: FAIL${NC}"
            ALL_PASSED=false
        fi
    done
    
    # Overall result
    echo -e "\n${GREEN}=== Overall Result ===${NC}"
    if $ALL_PASSED; then
        echo -e "${GREEN}✅ DEPLOYMENT VERIFICATION PASSED${NC}"
        echo -e "All critical checks passed. Deployment appears to be successful."
        return 0
    else
        echo -e "${RED}❌ DEPLOYMENT VERIFICATION FAILED${NC}"
        echo -e "Some checks failed. Please investigate the deployment."
        
        if [ "$exit_on_failure" = "true" ]; then
            exit 1
        else
            return 1
        fi
    fi
}

# Parse command line arguments
VERBOSE=false
EXIT_ON_FAILURE=false
URL="$DEPLOYMENT_URL"

while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            URL="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -e|--exit-on-failure)
            EXIT_ON_FAILURE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -u, --url URL           Deployment URL to verify (default: $DEPLOYMENT_URL)"
            echo "  -v, --verbose           Enable verbose output"
            echo "  -e, --exit-on-failure   Exit with error code if verification fails"
            echo "  -h, --help              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --url https://saludvalpa-app.vercel.app"
            echo "  $0 --url https://saludvalpa-app-git-feature-branch.vercel.app --exit-on-failure"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run verification
verify_deployment "$URL" "$EXIT_ON_FAILURE"