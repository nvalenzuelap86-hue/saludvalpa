// ============================================================================
// saludvalpa 3.0 - Accessibility Utilities
// Utilidades para mejorar accesibilidad (WCAG 2.1 compliance)
// ============================================================================

/**
 * Verifica si el contraste de color cumple con WCAG 2.1
 * @param foregroundColor Color de primer plano (hex, rgb, rgba)
 * @param backgroundColor Color de fondo (hex, rgb, rgba)
 * @param level Nivel de contraste requerido ('AA' o 'AAA')
 * @returns true si cumple con el contraste requerido
 */
export function checkColorContrast(
  foregroundColor: string,
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // Convertir colores a luminancia relativa
  const fgLuminance = getRelativeLuminance(foregroundColor);
  const bgLuminance = getRelativeLuminance(backgroundColor);
  
  // Calcular ratio de contraste
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);
  
  // Umbrales WCAG 2.1
  const thresholds = {
    'AA': { normal: 4.5, large: 3.0 },
    'AAA': { normal: 7.0, large: 4.5 }
  };
  
  return contrastRatio >= thresholds[level].normal;
}

/**
 * Calcula la luminancia relativa de un color
 */
function getRelativeLuminance(color: string): number {
  // Simplificación: para colores hex simples
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const rsrgb = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsrgb = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsrgb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
}

/**
 * Genera un ID único para asociar labels con inputs
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Maneja navegación por teclado en listas
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  currentIndex: number,
  itemCount: number,
  onSelect: (index: number) => void
): void {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      onSelect((currentIndex + 1) % itemCount);
      break;
      
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      onSelect((currentIndex - 1 + itemCount) % itemCount);
      break;
      
    case 'Home':
      event.preventDefault();
      onSelect(0);
      break;
      
    case 'End':
      event.preventDefault();
      onSelect(itemCount - 1);
      break;
      
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect(currentIndex);
      break;
  }
}

/**
 * Enfoca el primer elemento enfocable dentro de un contenedor
 */
export function focusFirstFocusable(element: HTMLElement | null): void {
  if (!element) return;
  
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
}

/**
 * Trap de foco para modales (evita que el foco salga del modal)
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Devolver función para limpiar
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Componente para anunciar cambios a lectores de pantalla
 */
export class LiveAnnouncer {
  private static container: HTMLElement | null = null;
  
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    // Crear contenedor si no existe
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      this.container.style.position = 'absolute';
      this.container.style.width = '1px';
      this.container.style.height = '1px';
      this.container.style.padding = '0';
      this.container.style.margin = '-1px';
      this.container.style.overflow = 'hidden';
      this.container.style.clip = 'rect(0, 0, 0, 0)';
      this.container.style.whiteSpace = 'nowrap';
      this.container.style.border = '0';
      document.body.appendChild(this.container);
    }
    
    // Actualizar prioridad si es necesario
    if (this.container.getAttribute('aria-live') !== priority) {
      this.container.setAttribute('aria-live', priority);
    }
    
    // Anunciar mensaje
    this.container.textContent = '';
    setTimeout(() => {
      if (this.container) {
        this.container.textContent = message;
      }
    }, 100);
  }
}

/**
 * Hook para manejar etiquetas ARIA en formularios
 */
export function useAccessibleForm() {
  const generateFieldId = (name: string) => {
    return `field-${name}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  return {
    /**
     * Crea props accesibles para un campo de formulario
     */
    createFieldProps: (name: string, error?: string) => {
      const id = generateFieldId(name);
      const errorId = error ? `${id}-error` : undefined;
      
      return {
        id,
        'aria-describedby': errorId,
        'aria-invalid': !!error,
        'aria-required': true,
      };
    },
    
    /**
     * Crea props para el label del campo
     */
    createLabelProps: (fieldId: string) => ({
      htmlFor: fieldId,
    }),
    
    /**
     * Crea props para el mensaje de error
     */
    createErrorProps: (fieldId: string, error?: string) => {
      if (!error) return {};
      
      return {
        id: `${fieldId}-error`,
        role: 'alert',
        'aria-live': 'assertive',
      };
    },
  };
}

/**
 * Colores accesibles predefinidos para SaludValpa
 */
export const accessibleColors = {
  primary: {
    main: '#2563eb', // Azul con buen contraste
    contrast: '#ffffff',
  },
  secondary: {
    main: '#7c3aed', // Violeta con buen contraste
    contrast: '#ffffff',
  },
  success: {
    main: '#059669', // Verde con buen contraste
    contrast: '#ffffff',
  },
  warning: {
    main: '#d97706', // Ámbar con buen contraste
    contrast: '#000000',
  },
  error: {
    main: '#dc2626', // Rojo con buen contraste
    contrast: '#ffffff',
  },
  background: {
    light: '#f8fafc',
    dark: '#0f172a',
  },
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
};

/**
 * Verifica la paleta de colores actual contra estándares WCAG
 */
export function validateColorPalette(colors: any): Array<{
  color1: string;
  color2: string;
  contrastRatio: number;
  passesAA: boolean;
  passesAAA: boolean;
}> {
  const results = [];
  
  // Verificar combinaciones comunes
  const combinations = [
    {
      foreground: (colors.text && colors.text.primary) || '#000000',
      background: (colors.background && colors.background.light) || '#ffffff'
    },
    {
      foreground: (colors.text && colors.text.secondary) || '#333333',
      background: (colors.background && colors.background.light) || '#ffffff'
    },
    {
      foreground: (colors.primary && colors.primary.main) || '#2563eb',
      background: (colors.background && colors.background.light) || '#ffffff'
    },
    {
      foreground: (colors.primary && colors.primary.contrast) || '#ffffff',
      background: (colors.primary && colors.primary.main) || '#2563eb'
    },
  ];
  
  for (const combo of combinations) {
    const fgLuminance = getRelativeLuminance(combo.foreground);
    const bgLuminance = getRelativeLuminance(combo.background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);
    
    results.push({
      color1: combo.foreground,
      color2: combo.background,
      contrastRatio: Math.round(contrastRatio * 10) / 10,
      passesAA: contrastRatio >= 4.5,
      passesAAA: contrastRatio >= 7.0,
    });
  }
  
  return results;
}

export default {
  checkColorContrast,
  generateAriaId,
  handleKeyboardNavigation,
  focusFirstFocusable,
  createFocusTrap,
  LiveAnnouncer,
  useAccessibleForm,
  accessibleColors,
  validateColorPalette,
};