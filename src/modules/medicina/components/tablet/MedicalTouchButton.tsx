import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export type TouchButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'alert' 
  | 'success'
  | 'warning'
  | 'neutral';

export type TouchButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface MedicalTouchButtonProps {
  /** Texto del botón */
  label: string;
  /** Icono opcional */
  icon?: React.ReactNode;
  /** Variante de color */
  variant?: TouchButtonVariant;
  /** Tamaño del botón */
  size?: TouchButtonSize;
  /** Función a ejecutar al presionar */
  onPress: () => void;
  /** Habilitar feedback háptico visual */
  hapticFeedback?: boolean;
  /** Deshabilitar el botón */
  disabled?: boolean;
  /** Mostrar estado de carga */
  loading?: boolean;
  /** Ancho completo */
  fullWidth?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilo inline adicional */
  style?: React.CSSProperties;
  /** Tooltip para el botón */
  tooltip?: string;
  /** Índice de accesibilidad */
  tabIndex?: number;
}

/**
 * Botón optimizado para uso táctil en tablet médica
 * 
 * Características:
 * - Tamaño mínimo de 44x44px para dedos
 * - Feedback visual inmediato
 * - Estados claros (normal, presionado, deshabilitado)
 * - Variantes médicas específicas
 * - Compatible con guantes médicos
 */
export const MedicalTouchButton: React.FC<MedicalTouchButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'medium',
  onPress,
  hapticFeedback = true,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  style = {},
  tooltip,
  tabIndex = 0
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  // Efecto para feedback háptico visual
  useEffect(() => {
    if (hapticFeedback && isPressed && buttonRef.current) {
      // Agregar clase de animación de pulsación
      buttonRef.current.classList.add('touch-feedback-active');
      
      const timer = setTimeout(() => {
        buttonRef.current?.classList.remove('touch-feedback-active');
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [hapticFeedback, isPressed]);

  // Manejar inicio de toque/presion
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    
    // Crear efecto de ripple para feedback visual
    if (rippleRef.current && buttonRef.current) {
      const button = buttonRef.current;
      const ripple = rippleRef.current;
      
      // Calcular posición del ripple
      const rect = button.getBoundingClientRect();
      let x, y;
      
      if ('touches' in e) {
        // Evento táctil
        const touch = e.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        // Evento de ratón
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      // Posicionar y animar el ripple
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-active');
      
      // Remover la clase después de la animación
      setTimeout(() => {
        ripple.classList.remove('ripple-active');
      }, 600);
    }
  };

  // Manejar fin de toque/presion
  const handleTouchEnd = () => {
    if (disabled || loading) return;
    
    setIsPressed(false);
    
    // Ejecutar la acción con un pequeño retraso para mejor feedback
    setTimeout(() => {
      onPress();
    }, 50);
  };

  // Manejar cancelación de toque
  const handleTouchCancel = () => {
    setIsPressed(false);
  };

  // Mapeo de variantes a clases CSS
  const variantClasses = {
    primary: 'bg-medical-primary text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-medical-secondary text-white hover:bg-green-600 active:bg-green-700',
    alert: 'bg-medical-alert text-white hover:bg-red-600 active:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    warning: 'bg-medical-warning text-gray-900 hover:bg-yellow-500 active:bg-yellow-600',
    neutral: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400'
  };

  // Mapeo de tamaños a clases CSS
  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[36px] min-w-[36px]',
    medium: 'px-4 py-3 text-base min-h-[44px] min-w-[44px]',
    large: 'px-6 py-4 text-lg min-h-[52px] min-w-[52px]',
    xlarge: 'px-8 py-6 text-xl min-h-[60px] min-w-[60px]'
  };

  // Clases para estado deshabilitado
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';

  // Clases para estado de carga
  const loadingClasses = loading ? 'relative overflow-hidden' : '';

  // Clases para ancho completo
  const widthClasses = fullWidth ? 'w-full' : '';

  // Clases combinadas
  const buttonClasses = clsx(
    'relative inline-flex items-center justify-center',
    'font-medium rounded-lg transition-all duration-200',
    'select-none touch-manipulation',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-primary',
    'active:scale-95',
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    loadingClasses,
    widthClasses,
    className
  );

  // Estilos inline adicionales
  const buttonStyles: React.CSSProperties = {
    ...style,
    // Asegurar tamaño mínimo para dedos (accesibilidad)
    minHeight: '44px',
    minWidth: '44px',
    // Mejorar contraste para guantes médicos
    border: '2px solid transparent',
    // Transición suave para todos los estados
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      style={buttonStyles}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => {
        handleTouchCancel();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      disabled={disabled || loading}
      aria-label={label}
      title={tooltip}
      tabIndex={tabIndex}
      role="button"
      aria-pressed={isPressed}
      aria-busy={loading}
    >
      {/* Efecto de ripple para feedback visual */}
      <span
        ref={rippleRef}
        className="absolute inset-0 rounded-lg bg-white/30 opacity-0 scale-0 transition-all duration-600 ease-out pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Estado de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Contenido del botón */}
      <div className={clsx(
        "flex items-center justify-center gap-2",
        loading ? "opacity-0" : "opacity-100"
      )}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="whitespace-nowrap font-semibold">{label}</span>
      </div>
      
      {/* Efecto de elevación en hover (solo desktop) */}
      {isHovered && !disabled && !loading && (
        <div className="absolute inset-0 rounded-lg shadow-lg -z-10" />
      )}
      
      {/* Indicador de foco para accesibilidad */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent ring-offset-2 transition-all duration-200 pointer-events-none" />
    </button>
  );
};

// Componente de grupo de botones táctiles
export interface TouchButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const TouchButtonGroup: React.FC<TouchButtonGroupProps> = ({
  children,
  direction = 'horizontal',
  spacing = 'medium',
  className = ''
}) => {
  const spacingClasses = {
    none: 'gap-0',
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3'
  };

  const directionClasses = direction === 'horizontal' 
    ? 'flex-row' 
    : 'flex-col';

  return (
    <div className={clsx(
      'flex',
      directionClasses,
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};

// Estilos CSS para el componente
export const medicalTouchButtonStyles = `
  .touch-feedback-active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  .ripple-active {
    animation: medical-ripple 0.6s ease-out;
  }
  
  @keyframes medical-ripple {
    0% {
      opacity: 0.5;
      transform: scale(0);
    }
    50% {
      opacity: 0.3;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
  
  @media (hover: hover) {
    .medical-touch-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .medical-touch-button:active:not(:disabled) {
    transform: scale(0.98);
    transition: transform 0.05s ease;
  }
  
  /* Mejoras para guantes médicos */
  @media (pointer: coarse) {
    .medical-touch-button {
      min-height: 48px !important;
      min-width: 48px !important;
      padding: 12px 20px !important;
    }
    
    .medical-touch-button .icon {
      width: 24px !important;
      height: 24px !important;
    }
  }
  
  /* Alto contraste para accesibilidad */
  @media (prefers-contrast: high) {
    .medical-touch-button {
      border-width: 3px !important;
    }
    
    .medical-touch-button:focus {
      outline: 3px solid #000 !important;
      outline-offset: 2px !important;
    }
  }
`;

export default MedicalTouchButton;