import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { MedicalTouchButton } from './MedicalTouchButton';
import type { TouchButtonVariant } from './MedicalTouchButton';

export interface QuickAction {
  /** Identificador único de la acción */
  id: string;
  /** Texto de la acción */
  label: string;
  /** Icono de la acción */
  icon: React.ReactNode;
  /** Función a ejecutar */
  action: () => void;
  /** Color de la acción */
  color?: string;
  /** Variante del botón */
  variant?: TouchButtonVariant;
  /** Atajo de teclado/touch */
  shortcut?: string;
  /** Descripción de la acción */
  description?: string;
  /** Mostrar contador de uso */
  showUsageCount?: boolean;
  /** Deshabilitar la acción */
  disabled?: boolean;
  /** Requiere confirmación */
  requiresConfirmation?: boolean;
  /** Mensaje de confirmación */
  confirmationMessage?: string;
}

export interface MedicalQuickActionsProps {
  /** Lista de acciones rápidas */
  actions: QuickAction[];
  /** Número de columnas */
  columns?: number;
  /** Modo compacto */
  compact?: boolean;
  /** Espaciado entre acciones */
  spacing?: 'none' | 'small' | 'medium' | 'large';
  /** Mostrar etiquetas */
  showLabels?: boolean;
  /** Mostrar atajos */
  showShortcuts?: boolean;
  /** Habilitar personalización */
  customizable?: boolean;
  /** Función llamada al reordenar acciones */
  onReorder?: (actions: QuickAction[]) => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilo inline adicional */
  style?: React.CSSProperties;
  /** Título del panel */
  title?: string;
  /** Mostrar título */
  showTitle?: boolean;
  /** Máximo número de acciones visibles */
  maxVisible?: number;
  /** Habilitar modo scroll */
  scrollable?: boolean;
}

/**
 * Panel de acciones rápidas optimizado para tablet médica
 * 
 * Características:
 * - Grid de acciones optimizado para touch
 * - Personalización por médico
 * - Atajos rápidos para funciones comunes
 * - Feedback visual inmediato
 * - Compatible con guantes médicos
 */
export const MedicalQuickActions: React.FC<MedicalQuickActionsProps> = ({
  actions,
  columns = 3,
  compact = false,
  spacing = 'medium',
  showLabels = true,
  showShortcuts = true,
  customizable = false,
  onReorder,
  className = '',
  style = {},
  title = 'Acciones Rápidas',
  showTitle = false,
  maxVisible,
  scrollable = false
}) => {
  const [localActions, setLocalActions] = useState<QuickAction[]>(actions);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Inicializar contadores de uso desde localStorage
  useEffect(() => {
    const savedUsage = localStorage.getItem('medical-quick-actions-usage');
    if (savedUsage) {
      try {
        setUsageCounts(JSON.parse(savedUsage));
      } catch (error) {
        console.error('Error al cargar contadores de uso:', error);
      }
    }
  }, []);

  // Guardar contadores de uso en localStorage
  useEffect(() => {
    localStorage.setItem('medical-quick-actions-usage', JSON.stringify(usageCounts));
  }, [usageCounts]);

  // Actualizar acciones cuando cambian las props
  useEffect(() => {
    setLocalActions(actions);
  }, [actions]);

  // Manejar clic en una acción
  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;

    // Incrementar contador de uso
    setUsageCounts(prev => ({
      ...prev,
      [action.id]: (prev[action.id] || 0) + 1
    }));

    // Ejecutar acción
    action.action();
  };

  // Manejar inicio de arrastre
  const handleDragStart = (e: React.DragEvent, actionId: string) => {
    if (!customizable) return;
    
    e.dataTransfer.setData('text/plain', actionId);
    setIsDragging(actionId);
    
    // Feedback visual
    e.currentTarget.classList.add('dragging');
  };

  // Manejar arrastre sobre
  const handleDragOver = (e: React.DragEvent, actionId: string) => {
    if (!customizable) return;
    
    e.preventDefault();
    setDragOver(actionId);
  };

  // Manejar fin de arrastre
  const handleDragEnd = () => {
    setIsDragging(null);
    setDragOver(null);
    
    // Remover clase de feedback
    document.querySelectorAll('.quick-action-item').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
  };

  // Manejar soltar
  const handleDrop = (e: React.DragEvent, targetActionId: string) => {
    if (!customizable) return;
    
    e.preventDefault();
    const draggedActionId = e.dataTransfer.getData('text/plain');
    
    if (draggedActionId && draggedActionId !== targetActionId) {
      // Reordenar acciones
      const draggedIndex = localActions.findIndex(a => a.id === draggedActionId);
      const targetIndex = localActions.findIndex(a => a.id === targetActionId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newActions = [...localActions];
        const [draggedAction] = newActions.splice(draggedIndex, 1);
        newActions.splice(targetIndex, 0, draggedAction);
        
        setLocalActions(newActions);
        onReorder?.(newActions);
      }
    }
    
    setDragOver(null);
  };

  // Filtrar acciones si hay máximo visible
  const visibleActions = maxVisible 
    ? localActions.slice(0, maxVisible)
    : localActions;

  // Calcular grid columns
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[columns] || 'grid-cols-3';

  // Clases de espaciado
  const spacingClasses = {
    none: 'gap-0',
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3'
  };

  // Clases para modo compacto
  const compactClasses = compact 
    ? 'p-1' 
    : 'p-3';

  // Clases para scroll
  const scrollClasses = scrollable 
    ? 'overflow-y-auto max-h-96' 
    : '';

  // Clases combinadas
  const containerClasses = clsx(
    'bg-white rounded-xl shadow-sm',
    compactClasses,
    scrollClasses,
    className
  );

  // Clases del grid
  const gridClasses = clsx(
    'grid',
    gridColumns,
    spacingClasses[spacing],
    'auto-rows-fr'
  );

  // Renderizar acción individual
  const renderAction = (action: QuickAction, index: number) => {
    const usageCount = usageCounts[action.id] || 0;
    const isBeingDragged = isDragging === action.id;
    const isDragOver = dragOver === action.id;
    
    const actionClasses = clsx(
      'quick-action-item',
      'flex flex-col items-center justify-center',
      'p-2 rounded-lg transition-all duration-200',
      'hover:bg-gray-50 active:bg-gray-100',
      {
        'opacity-50': isBeingDragged,
        'bg-blue-50 border-2 border-blue-200 border-dashed': isDragOver,
        'cursor-move': customizable && !action.disabled,
        'cursor-not-allowed opacity-60': action.disabled
      }
    );

    return (
      <div
        key={action.id}
        className={actionClasses}
        draggable={customizable && !action.disabled}
        onDragStart={(e) => handleDragStart(e, action.id)}
        onDragOver={(e) => handleDragOver(e, action.id)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, action.id)}
        onClick={() => !customizable && handleActionClick(action)}
        title={action.description || action.label}
        role="button"
        tabIndex={0}
        aria-label={action.label}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActionClick(action);
          }
        }}
      >
        {/* Contenedor del icono */}
        <div className="relative mb-1">
          {/* Botón táctil para la acción */}
          <MedicalTouchButton
            label=""
            icon={action.icon}
            variant={action.variant || 'primary'}
            size={compact ? 'small' : 'medium'}
            onPress={() => handleActionClick(action)}
            disabled={action.disabled}
            className="w-12 h-12 rounded-full"
            style={action.color ? { backgroundColor: action.color } : undefined}
          />
          
          {/* Contador de uso */}
          {action.showUsageCount && usageCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {usageCount > 99 ? '99+' : usageCount}
            </div>
          )}
          
          {/* Indicador de atajo */}
          {showShortcuts && action.shortcut && (
            <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs rounded px-1 py-0.5">
              {action.shortcut}
            </div>
          )}
        </div>
        
        {/* Etiqueta de la acción */}
        {showLabels && (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700 block">
              {action.label}
            </span>
            
            {/* Descripción (solo en modo no compacto) */}
            {!compact && action.description && (
              <span className="text-xs text-gray-500 block mt-1">
                {action.description}
              </span>
            )}
          </div>
        )}
        
        {/* Indicador de arrastre (solo en modo personalizable) */}
        {customizable && !action.disabled && (
          <div className="mt-1 text-gray-400 text-xs">
            ⋮⋮
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={containerClasses} style={style}>
      {/* Título del panel */}
      {showTitle && (
        <div className="mb-3 pb-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {customizable && (
            <p className="text-sm text-gray-500 mt-1">
              Arrastra para reordenar las acciones
            </p>
          )}
        </div>
      )}
      
      {/* Grid de acciones */}
      <div className={gridClasses}>
        {visibleActions.map((action, index) => renderAction(action, index))}
      </div>
      
      {/* Indicador de más acciones (si hay máximo visible) */}
      {maxVisible && localActions.length > maxVisible && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-500">
            +{localActions.length - maxVisible} acciones más disponibles
          </span>
        </div>
      )}
      
      {/* Estilos CSS para el componente */}
      <style>{`
        .quick-action-item {
          min-height: ${compact ? '80px' : '100px'};
          transition: all 0.2s ease;
        }
        
        .quick-action-item:hover:not(.dragging) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .quick-action-item:active:not(.dragging) {
          transform: translateY(0);
        }
        
        .quick-action-item.dragging {
          opacity: 0.5;
          cursor: grabbing;
        }
        
        .quick-action-item.drag-over {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
        
        /* Mejoras para guantes médicos */
        @media (pointer: coarse) {
          .quick-action-item {
            min-height: ${compact ? '90px' : '110px'} !important;
            padding: 12px !important;
          }
          
          .medical-touch-button {
            min-width: 56px !important;
            min-height: 56px !important;
          }
        }
        
        /* Alto contraste */
        @media (prefers-contrast: high) {
          .quick-action-item {
            border: 2px solid #000 !important;
          }
          
          .quick-action-item:hover {
            border-color: #1a73e8 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Componente de acciones rápidas predefinidas para medicina
export const MedicalDefaultQuickActions: React.FC<{
  onActionSelect: (actionId: string) => void;
  compact?: boolean;
}> = ({ onActionSelect, compact = false }) => {
  const defaultActions: QuickAction[] = [
    {
      id: 'new-consultation',
      label: 'Nueva Consulta',
      icon: '🩺',
      action: () => onActionSelect('new-consultation'),
      variant: 'primary',
      shortcut: 'N',
      description: 'Iniciar nueva consulta médica'
    },
    {
      id: 'prescribe',
      label: 'Prescribir',
      icon: '💊',
      action: () => onActionSelect('prescribe'),
      variant: 'secondary',
      shortcut: 'P',
      description: 'Prescribir medicamentos'
    },
    {
      id: 'vital-signs',
      label: 'Signos Vitales',
      icon: '❤️',
      action: () => onActionSelect('vital-signs'),
      variant: 'alert',
      shortcut: 'V',
      description: 'Registrar signos vitales'
    },
    {
      id: 'lab-orders',
      label: 'Estudios',
      icon: '🧪',
      action: () => onActionSelect('lab-orders'),
      variant: 'success',
      shortcut: 'E',
      description: 'Solicitar estudios de laboratorio'
    },
    {
      id: 'soap-note',
      label: 'Nota SOAP',
      icon: '📝',
      action: () => onActionSelect('soap-note'),
      variant: 'neutral',
      shortcut: 'S',
      description: 'Crear nota SOAP'
    },
    {
      id: 'cdss-check',
      label: 'CDSS',
      icon: '🔍',
      action: () => onActionSelect('cdss-check'),
      variant: 'warning',
      shortcut: 'C',
      description: 'Revisar con sistema de soporte'
    },
    {
      id: 'patient-history',
      label: 'Historial',
      icon: '📋',
      action: () => onActionSelect('patient-history'),
      variant: 'primary',
      shortcut: 'H',
      description: 'Ver historial del paciente'
    },
    {
      id: 'quick-prescription',
      label: 'Receta Rápida',
      icon: '🏥',
      action: () => onActionSelect('quick-prescription'),
      variant: 'secondary',
      shortcut: 'R',
      description: 'Receta predefinida'
    },
    {
      id: 'emergency',
      label: 'Emergencia',
      icon: '🚨',
      action: () => onActionSelect('emergency'),
      variant: 'alert',
      shortcut: '!',
      description: 'Protocolo de emergencia',
      requiresConfirmation: true,
      confirmationMessage: '¿Activar protocolo de emergencia?'
    }
  ];

  return (
    <MedicalQuickActions
      actions={defaultActions}
      columns={compact ? 4 : 3}
      compact={compact}
      showLabels={true}
      showShortcuts={true}
      title="Acciones Médicas Rápidas"
      showTitle={!compact}
    />
  );
};

export default MedicalQuickActions;