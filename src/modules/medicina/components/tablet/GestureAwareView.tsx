import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export interface GestureConfig {
  /** Sensibilidad para gestos de swipe (px) */
  swipeThreshold?: number;
  /** Sensibilidad para gestos de tap (ms) */
  tapThreshold?: number;
  /** Sensibilidad para gestos de long press (ms) */
  longPressThreshold?: number;
  /** Habilitar gestos múltiples */
  multiTouch?: boolean;
  /** Área de detección de gestos */
  detectionArea?: 'full' | 'center' | 'edges';
}

export interface GestureEvent {
  type: 'swipeLeft' | 'swipeRight' | 'swipeUp' | 'swipeDown' | 'tap' | 'doubleTap' | 'longPress' | 'pinch' | 'rotate';
  position: { x: number; y: number };
  timestamp: number;
  touches?: number;
  distance?: number;
  velocity?: number;
}

export interface GestureAwareViewProps {
  /** Contenido del componente */
  children: React.ReactNode;
  /** Función llamada al detectar swipe izquierdo */
  onSwipeLeft?: (event: GestureEvent) => void;
  /** Función llamada al detectar swipe derecho */
  onSwipeRight?: (event: GestureEvent) => void;
  /** Función llamada al detectar swipe arriba */
  onSwipeUp?: (event: GestureEvent) => void;
  /** Función llamada al detectar swipe abajo */
  onSwipeDown?: (event: GestureEvent) => void;
  /** Función llamada al detectar doble tap */
  onDoubleTap?: (event: GestureEvent) => void;
  /** Función llamada al detectar long press */
  onLongPress?: (event: GestureEvent) => void;
  /** Función llamada al detectar pinch */
  onPinch?: (event: GestureEvent) => void;
  /** Función llamada al detectar rotación */
  onRotate?: (event: GestureEvent) => void;
  /** Configuración de gestos */
  gestureConfig?: GestureConfig;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilo inline adicional */
  style?: React.CSSProperties;
  /** Deshabilitar detección de gestos */
  disabled?: boolean;
  /** Mostrar feedback visual de gestos */
  showVisualFeedback?: boolean;
  /** Z-index para overlays de feedback */
  zIndex?: number;
}

/**
 * Componente que detecta y maneja gestos táctiles para tablet médica
 * 
 * Características:
 * - Detección de gestos comunes (swipe, tap, long press)
 * - Configuración de sensibilidad personalizable
 * - Feedback visual para gestos reconocidos
 * - Compatible con guantes médicos
 * - Optimizado para uso en consultorio
 */
export const GestureAwareView: React.FC<GestureAwareViewProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  onPinch,
  onRotate,
  gestureConfig = {},
  className = '',
  style = {},
  disabled = false,
  showVisualFeedback = true,
  zIndex = 50
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeGestures, setActiveGestures] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTap, setLastTap] = useState<{ time: number; x: number; y: number } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [visualFeedback, setVisualFeedback] = useState<{
    type: string;
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  // Configuración por defecto
  const config: Required<GestureConfig> = {
    swipeThreshold: gestureConfig.swipeThreshold ?? 50,
    tapThreshold: gestureConfig.tapThreshold ?? 300,
    longPressThreshold: gestureConfig.longPressThreshold ?? 500,
    multiTouch: gestureConfig.multiTouch ?? false,
    detectionArea: gestureConfig.detectionArea ?? 'full'
  };

  // Limpiar feedback visual después de un tiempo
  useEffect(() => {
    if (visualFeedback?.visible) {
      const timer = setTimeout(() => {
        setVisualFeedback(prev => prev ? { ...prev, visible: false } : null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [visualFeedback]);

  // Mostrar feedback visual para un gesto
  const showGestureFeedback = useCallback((type: string, x: number, y: number) => {
    if (!showVisualFeedback || disabled) return;
    
    setVisualFeedback({
      type,
      x,
      y,
      visible: true
    });
  }, [showVisualFeedback, disabled]);

  // Crear evento de gesto
  const createGestureEvent = useCallback((
    type: GestureEvent['type'],
    position: { x: number; y: number },
    touches = 1,
    distance = 0,
    velocity = 0
  ): GestureEvent => {
    return {
      type,
      position,
      timestamp: Date.now(),
      touches,
      distance,
      velocity
    };
  }, []);

  // Manejar inicio de toque
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    setTouchStart(startPos);
    
    // Iniciar timer para long press
    if (onLongPress) {
      const timer = setTimeout(() => {
        const event = createGestureEvent('longPress', { x: startPos.x, y: startPos.y });
        onLongPress(event);
        showGestureFeedback('longPress', startPos.x, startPos.y);
        setActiveGestures(prev => new Set(prev).add('longPress'));
      }, config.longPressThreshold);
      
      setLongPressTimer(timer);
    }
    
    // Manejar gestos multi-touch
    if (config.multiTouch && e.touches.length >= 2) {
      setActiveGestures(prev => new Set(prev).add('multiTouch'));
    }
  }, [disabled, onLongPress, createGestureEvent, showGestureFeedback, config.longPressThreshold, config.multiTouch]);

  // Manejar movimiento de toque
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart) return;
    
    // Cancelar long press si hay movimiento
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    const touch = e.touches[0];
    const currentPos = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    const deltaX = currentPos.x - touchStart.x;
    const deltaY = currentPos.y - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeElapsed = Date.now() - touchStart.time;
    
    // Detectar swipe si supera el umbral
    if (distance > config.swipeThreshold) {
      // Determinar dirección del swipe
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const velocity = distance / timeElapsed;
      
      if (isHorizontal) {
        if (deltaX > 0) {
          // Swipe derecho
          const event = createGestureEvent('swipeRight', currentPos, 1, distance, velocity);
          onSwipeRight?.(event);
          showGestureFeedback('swipeRight', currentPos.x, currentPos.y);
          setActiveGestures(prev => new Set(prev).add('swipeRight'));
        } else {
          // Swipe izquierdo
          const event = createGestureEvent('swipeLeft', currentPos, 1, distance, velocity);
          onSwipeLeft?.(event);
          showGestureFeedback('swipeLeft', currentPos.x, currentPos.y);
          setActiveGestures(prev => new Set(prev).add('swipeLeft'));
        }
      } else {
        if (deltaY > 0) {
          // Swipe abajo
          const event = createGestureEvent('swipeDown', currentPos, 1, distance, velocity);
          onSwipeDown?.(event);
          showGestureFeedback('swipeDown', currentPos.x, currentPos.y);
          setActiveGestures(prev => new Set(prev).add('swipeDown'));
        } else {
          // Swipe arriba
          const event = createGestureEvent('swipeUp', currentPos, 1, distance, velocity);
          onSwipeUp?.(event);
          showGestureFeedback('swipeUp', currentPos.x, currentPos.y);
          setActiveGestures(prev => new Set(prev).add('swipeUp'));
        }
      }
      
      // Resetear después de detectar swipe
      setTouchStart(null);
    }
    
    // Manejar gestos multi-touch
    if (config.multiTouch && e.touches.length >= 2) {
      // Detectar pinch y rotate
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calcular distancia entre dedos
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Aquí se podría implementar lógica para detectar pinch y rotate
      // Por simplicidad, solo marcamos que hay gesto multi-touch
      setActiveGestures(prev => new Set(prev).add('multiTouch'));
    }
  }, [
    disabled, touchStart, longPressTimer, config.swipeThreshold, config.multiTouch,
    onSwipeRight, onSwipeLeft, onSwipeDown, onSwipeUp, createGestureEvent, showGestureFeedback
  ]);

  // Manejar fin de toque
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart) return;
    
    // Cancelar long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    const touch = e.changedTouches[0];
    const endPos = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    const deltaX = endPos.x - touchStart.x;
    const deltaY = endPos.y - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeElapsed = Date.now() - touchStart.time;
    
    // Detectar tap (si no hubo movimiento significativo)
    if (distance < config.swipeThreshold && timeElapsed < config.tapThreshold) {
      // Verificar si es doble tap
      if (lastTap && onDoubleTap) {
        const timeSinceLastTap = Date.now() - lastTap.time;
        const distanceFromLastTap = Math.sqrt(
          Math.pow(endPos.x - lastTap.x, 2) +
          Math.pow(endPos.y - lastTap.y, 2)
        );
        
        if (timeSinceLastTap < config.tapThreshold * 2 && distanceFromLastTap < config.swipeThreshold) {
          // Es un doble tap
          const event = createGestureEvent('doubleTap', endPos);
          onDoubleTap(event);
          showGestureFeedback('doubleTap', endPos.x, endPos.y);
          setLastTap(null); // Resetear después de doble tap
          return;
        }
      }
      
      // Es un tap simple
      setLastTap({
        time: Date.now(),
        x: endPos.x,
        y: endPos.y
      });
    }
    
    // Limpiar gestos activos
    setActiveGestures(new Set());
    setTouchStart(null);
  }, [
    disabled, touchStart, longPressTimer, lastTap, config.swipeThreshold, config.tapThreshold,
    onDoubleTap, createGestureEvent, showGestureFeedback
  ]);

  // Manejar cancelación de toque
  const handleTouchCancel = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    setActiveGestures(new Set());
    setTouchStart(null);
  }, [longPressTimer]);

  // Clases CSS para el contenedor
  const containerClasses = clsx(
    'relative select-none touch-manipulation',
    {
      'cursor-pointer': !disabled,
      'cursor-not-allowed opacity-50': disabled
    },
    className
  );

  // Estilos para el contenedor
  const containerStyles: React.CSSProperties = {
    ...style,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    touchAction: 'manipulation'
  };

  // Renderizar feedback visual de gestos
  const renderGestureFeedback = () => {
    if (!visualFeedback?.visible || !showVisualFeedback) return null;
    
    const { type, x, y } = visualFeedback;
    
    // Iconos para diferentes tipos de gestos
    const gestureIcons = {
      swipeLeft: '←',
      swipeRight: '→',
      swipeUp: '↑',
      swipeDown: '↓',
      tap: '•',
      doubleTap: '••',
      longPress: '⏱️',
      pinch: '↔️',
      rotate: '↻'
    };
    
    const icon = gestureIcons[type as keyof typeof gestureIcons] || '•';
    
    return (
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          left: x - 24,
          top: y - 24,
          zIndex: zIndex + 1,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'rgba(26, 115, 232, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1a73e8',
          animation: 'gesture-feedback 0.6s ease-out'
        }}
      >
        {icon}
      </div>
    );
  };

  // Renderizar indicador de área de detección
  const renderDetectionArea = () => {
    if (config.detectionArea === 'full' || !showVisualFeedback) return null;
    
    const areaStyles = {
      center: {
        position: 'absolute' as const,
        top: '25%',
        left: '25%',
        right: '25%',
        bottom: '25%',
        border: '2px dashed rgba(26, 115, 232, 0.3)',
        borderRadius: '12px',
        pointerEvents: 'none' as const
      },
      edges: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '2px dashed rgba(26, 115, 232, 0.2)',
        pointerEvents: 'none' as const
      }
    };
    
    return (
      <div style={areaStyles[config.detectionArea]} />
    );
  };

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyles}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      aria-label="Gesture-aware view"
      role="region"
      aria-description="Área sensible a gestos táctiles"
    >
      {children}
      
      {/* Feedback visual de gestos */}
      {renderGestureFeedback()}
      
      {/* Indicador de área de detección */}
      {renderDetectionArea()}
      
      {/* Indicador de gestos activos (solo desarrollo) */}
      {process.env.NODE_ENV === 'development' && activeGestures.size > 0 && (
        <div
          className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
          style={{ zIndex: zIndex + 2 }}
        >
          Gestos activos: {Array.from(activeGestures).join(', ')}
        </div>
      )}
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes gesture-feedback {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .gesture-active {
          background-color: rgba(26, 115, 232, 0.1) !important;
          transition: background-color 0.2s ease;
        }
        
        @media (pointer: coarse) {
          .gesture-aware-view {
            min-height: 48px;
            min-width: 48px;
          }
        }
        
        /* Mejoras para alto contraste */
        @media (prefers-contrast: high) {
          .gesture-feedback {
            border: 3px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Hook para usar gestos en componentes personalizados
export const useGestureDetection = (config?: GestureConfig) => {
  const [gesture, setGesture] = useState<GestureEvent | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const handleGesture = useCallback((event: GestureEvent) => {
    setGesture(event);
    setIsDetecting(false);
    
    // Limpiar después de un tiempo
    setTimeout(() => {
      setGesture(null);
    }, 1000);
  }, []);
  
  return {
    gesture,
    isDetecting,
    handleGesture,
    gestureConfig: config
  };
};

export default GestureAwareView;
