// ============================================================================
// saludvalpa 3.0 - Feature Flags Service
// Sistema de feature flags para transición gradual entre configuraciones
// ============================================================================

import type { Configuracion } from '../types';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetUsers: 'all' | 'specific' | 'percentage';
  conditions?: FeatureFlagCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagCondition {
  type: 'license' | 'profession' | 'user' | 'date' | 'migration';
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains' | 'startsWith';
  value: any;
}

export interface FeatureFlagEvaluation {
  flagId: string;
  enabled: boolean;
  reason: string;
  evaluatedAt: Date;
}

export interface FeatureFlagsConfig {
  // Flags para transición gradual
  flags: {
    // Flag principal para habilitar configuración unificada
    enableUnifiedConfiguration: FeatureFlag;
    
    // Flag para redirección automática
    enableAutoRedirect: FeatureFlag;
    
    // Flag para mostrar ambas configuraciones (old + new)
    showBothConfigurations: FeatureFlag;
    
    // Flag para migración automática
    enableAutoMigration: FeatureFlag;
    
    // Flag para características específicas
    enableAdvancedBranding: FeatureFlag;
    enableCloudSync: FeatureFlag;
    enableAnalytics: FeatureFlag;
  };
  
  // Configuración global
  global: {
    environment: 'development' | 'staging' | 'production';
    defaultRolloutPercentage: number;
    enableLogging: boolean;
    version: string;
  };
}

// Flags predefinidos para la transición
const DEFAULT_FEATURE_FLAGS: FeatureFlagsConfig = {
  flags: {
    enableUnifiedConfiguration: {
      id: 'unified-config',
      name: 'Configuración Unificada',
      description: 'Habilita el nuevo sistema de configuración unificada con 14 pestañas',
      enabled: true,
      rolloutPercentage: 100,
      targetUsers: 'all',
      conditions: [
        {
          type: 'migration',
          operator: 'equals',
          value: 'completed'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    enableAutoRedirect: {
      id: 'auto-redirect',
      name: 'Redirección Automática',
      description: 'Redirige automáticamente desde configuraciones antiguas a la nueva',
      enabled: false,
      rolloutPercentage: 50,
      targetUsers: 'percentage',
      conditions: [
        {
          type: 'license',
          operator: 'equals',
          value: 'pagada'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    showBothConfigurations: {
      id: 'both-configs',
      name: 'Mostrar Ambas Configuraciones',
      description: 'Muestra tanto la configuración antigua como la nueva durante la transición',
      enabled: true,
      rolloutPercentage: 100,
      targetUsers: 'all',
      conditions: [],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    enableAutoMigration: {
      id: 'auto-migration',
      name: 'Migración Automática',
      description: 'Ejecuta automáticamente la migración de configuraciones antiguas',
      enabled: false,
      rolloutPercentage: 25,
      targetUsers: 'percentage',
      conditions: [
        {
          type: 'license',
          operator: 'equals',
          value: 'enterprise'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    enableAdvancedBranding: {
      id: 'advanced-branding',
      name: 'Branding Avanzado',
      description: 'Habilita características avanzadas de branding (solo licencias pagadas)',
      enabled: true,
      rolloutPercentage: 100,
      targetUsers: 'specific',
      conditions: [
        {
          type: 'license',
          operator: 'equals',
          value: 'pagada'
        },
        {
          type: 'license',
          operator: 'equals',
          value: 'enterprise'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    enableCloudSync: {
      id: 'cloud-sync',
      name: 'Sincronización en la Nube',
      description: 'Habilita sincronización de configuración en la nube',
      enabled: false,
      rolloutPercentage: 10,
      targetUsers: 'percentage',
      conditions: [
        {
          type: 'license',
          operator: 'equals',
          value: 'enterprise'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    },
    
    enableAnalytics: {
      id: 'analytics',
      name: 'Analíticas Avanzadas',
      description: 'Habilita panel de analíticas y métricas',
      enabled: true,
      rolloutPercentage: 100,
      targetUsers: 'specific',
      conditions: [
        {
          type: 'license',
          operator: 'equals',
          value: 'pagada'
        }
      ],
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05')
    }
  },
  
  global: {
    environment: 'development',
    defaultRolloutPercentage: 50,
    enableLogging: true,
    version: '3.1.0'
  }
};

class FeatureFlagsService {
  private config: FeatureFlagsConfig;
  private evaluations: FeatureFlagEvaluation[] = [];
  
  constructor(initialConfig?: Partial<FeatureFlagsConfig>) {
    this.config = {
      ...DEFAULT_FEATURE_FLAGS,
      ...initialConfig
    };
    
    // Cargar configuración desde localStorage si existe
    this.loadFromStorage();
  }
  
  /**
   * Evalúa si un feature flag está habilitado para el usuario actual
   */
  isEnabled(flagId: keyof FeatureFlagsConfig['flags'], context?: any): boolean {
    const flag = this.config.flags[flagId];
    
    if (!flag) {
      console.warn(`Feature flag ${flagId} no encontrado`);
      return false;
    }
    
    // Si el flag está completamente deshabilitado
    if (!flag.enabled) {
      this.logEvaluation(flagId, false, 'Flag globalmente deshabilitado');
      return false;
    }
    
    // Si el flag está habilitado para todos
    if (flag.targetUsers === 'all') {
      this.logEvaluation(flagId, true, 'Habilitado para todos los usuarios');
      return true;
    }
    
    // Evaluar condiciones
    if (flag.conditions && flag.conditions.length > 0) {
      const passesConditions = this.evaluateConditions(flag.conditions, context);
      
      if (!passesConditions) {
        this.logEvaluation(flagId, false, 'No cumple condiciones');
        return false;
      }
    }
    
    // Evaluar porcentaje de rollout
    if (flag.targetUsers === 'percentage') {
      const userId = this.getUserId();
      const hash = this.hashString(userId);
      const percentage = hash % 100;
      
      const isEnabled = percentage < flag.rolloutPercentage;
      const reason = isEnabled 
        ? `Usuario en porcentaje de rollout (${percentage} < ${flag.rolloutPercentage})`
        : `Usuario fuera de porcentaje de rollout (${percentage} >= ${flag.rolloutPercentage})`;
      
      this.logEvaluation(flagId, isEnabled, reason);
      return isEnabled;
    }
    
    // Para targetUsers === 'specific', se asume que las condiciones ya lo manejan
    this.logEvaluation(flagId, true, 'Habilitado por condiciones específicas');
    return true;
  }
  
  /**
   * Obtiene el estado de todos los flags
   */
  getAllFlags(context?: any): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    
    Object.keys(this.config.flags).forEach(flagId => {
      result[flagId] = this.isEnabled(flagId as keyof FeatureFlagsConfig['flags'], context);
    });
    
    return result;
  }
  
  /**
   * Actualiza un feature flag
   */
  updateFlag(flagId: keyof FeatureFlagsConfig['flags'], updates: Partial<FeatureFlag>): void {
    const flag = this.config.flags[flagId];
    
    if (!flag) {
      throw new Error(`Feature flag ${flagId} no encontrado`);
    }
    
    this.config.flags[flagId] = {
      ...flag,
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
  }
  
  /**
   * Habilita/deshabilita un flag
   */
  setFlagEnabled(flagId: keyof FeatureFlagsConfig['flags'], enabled: boolean): void {
    this.updateFlag(flagId, { enabled });
  }
  
  /**
   * Configura el porcentaje de rollout
   */
  setRolloutPercentage(flagId: keyof FeatureFlagsConfig['flags'], percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
    
    this.updateFlag(flagId, { rolloutPercentage: percentage });
  }
  
  /**
   * Obtiene evaluaciones recientes
   */
  getRecentEvaluations(limit = 50): FeatureFlagEvaluation[] {
    return this.evaluations.slice(-limit);
  }
  
  /**
   * Obtiene estadísticas de uso
   */
  getUsageStats(): Record<string, { enabled: number; disabled: number; total: number }> {
    const stats: Record<string, { enabled: number; disabled: number; total: number }> = {};
    
    this.evaluations.forEach(evaluation => {
      if (!stats[evaluation.flagId]) {
        stats[evaluation.flagId] = { enabled: 0, disabled: 0, total: 0 };
      }
      
      stats[evaluation.flagId].total++;
      
      if (evaluation.enabled) {
        stats[evaluation.flagId].enabled++;
      } else {
        stats[evaluation.flagId].disabled++;
      }
    });
    
    return stats;
  }
  
  /**
   * Crea un contexto de evaluación basado en la configuración del usuario
   */
  createContextFromConfig(config: Configuracion | null): any {
    if (!config) {
      return {
        license: 'gratuita',
        profession: 'unknown',
        migrationStatus: 'not_started'
      };
    }
    
    return {
      license: config.licencia.tipo,
      profession: config.profesion,
      accountType: config.tipoCuenta,
      migrationStatus: this.getMigrationStatus(config),
      userId: this.getUserId()
    };
  }
  
  /**
   * Resetea los flags a los valores por defecto
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_FEATURE_FLAGS };
    this.evaluations = [];
    this.saveToStorage();
  }
  
  // Métodos privados
  
  private evaluateConditions(conditions: FeatureFlagCondition[], context: any): boolean {
    return conditions.every(condition => {
      const contextValue = this.getContextValue(condition.type, context);
      
      switch (condition.operator) {
        case 'equals':
          return contextValue === condition.value;
        case 'greaterThan':
          return contextValue > condition.value;
        case 'lessThan':
          return contextValue < condition.value;
        case 'contains':
          return String(contextValue).includes(String(condition.value));
        case 'startsWith':
          return String(contextValue).startsWith(String(condition.value));
        default:
          return false;
      }
    });
  }
  
  private getContextValue(type: string, context: any): any {
    switch (type) {
      case 'license':
        return context?.license || 'gratuita';
      case 'profession':
        return context?.profession || 'unknown';
      case 'user':
        return context?.userId || 'anonymous';
      case 'date':
        return new Date();
      case 'migration':
        return context?.migrationStatus || 'not_started';
      default:
        return null;
    }
  }
  
  private getMigrationStatus(config: Configuracion): string {
    // Lógica simplificada para determinar estado de migración
    // En una implementación real, esto verificaría la base de datos
    const hasOldConfig = localStorage.getItem('has-old-configuration') === 'true';
    const hasMigrated = localStorage.getItem('migration-completed') === 'true';
    
    if (hasMigrated) return 'completed';
    if (hasOldConfig) return 'pending';
    return 'not_started';
  }
  
  private getUserId(): string {
    // Generar un ID de usuario estable
    const storedId = localStorage.getItem('user-id');
    
    if (storedId) {
      return storedId;
    }
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user-id', newId);
    
    return newId;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    return Math.abs(hash);
  }
  
  private logEvaluation(flagId: string, enabled: boolean, reason: string): void {
    if (!this.config.global.enableLogging) {
      return;
    }
    
    const evaluation: FeatureFlagEvaluation = {
      flagId,
      enabled,
      reason,
      evaluatedAt: new Date()
    };
    
    this.evaluations.push(evaluation);
    
    // Mantener solo las últimas 1000 evaluaciones
    if (this.evaluations.length > 1000) {
      this.evaluations = this.evaluations.slice(-1000);
    }
    
    // Guardar en localStorage periódicamente
    if (this.evaluations.length % 10 === 0) {
      this.saveToStorage();
    }
  }
  
  private saveToStorage(): void {
    try {
      const data = {
        config: this.config,
        evaluations: this.evaluations.slice(-100) // Guardar solo las últimas 100
      };
      
      localStorage.setItem('feature-flags', JSON.stringify(data));
    } catch (error) {
      console.warn('No se pudo guardar feature flags en localStorage:', error);
    }
  }
  
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('feature-flags');
      
      if (stored) {
        const data = JSON.parse(stored);
        
        // Actualizar configuración con valores almacenados
        if (data.config) {
          this.config = {
            ...this.config,
            ...data.config,
            flags: {
              ...this.config.flags,
              ...data.config.flags
            }
          };
        }
        
        // Cargar evaluaciones
        if (data.evaluations) {
          this.evaluations = data.evaluations.map((evaluation: any) => ({
            ...evaluation,
            evaluatedAt: new Date(evaluation.evaluatedAt)
          }));
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar feature flags desde localStorage:', error);
    }
  }
}

// Instancia singleton
export const featureFlagsService = new FeatureFlagsService();

// Hook para React (si se necesita)
export const useFeatureFlags = () => {
  return {
    isEnabled: (flagId: keyof FeatureFlagsConfig['flags'], context?: any) => 
      featureFlagsService.isEnabled(flagId, context),
    
    getAllFlags: (context?: any) => 
      featureFlagsService.getAllFlags(context),
    
    updateFlag: (flagId: keyof FeatureFlagsConfig['flags'], updates: Partial<FeatureFlag>) => 
      featureFlagsService.updateFlag(flagId, updates),
    
    setFlagEnabled: (flagId: keyof FeatureFlagsConfig['flags'], enabled: boolean) => 
      featureFlagsService.setFlagEnabled(flagId, enabled),
    
    getRecentEvaluations: (limit?: number) => 
      featureFlagsService.getRecentEvaluations(limit),
    
    getUsageStats: () => 
      featureFlagsService.getUsageStats(),
    
    createContextFromConfig: (config: Configuracion | null) => 
      featureFlagsService.createContextFromConfig(config),
    
    resetToDefaults: () => 
      featureFlagsService.resetToDefaults()
  };
};

// Utilidades de desarrollo
export const developmentUtils = {
  /**
   * Habilita todos los flags (solo para desarrollo)
   */
  enableAllFlags: () => {
    Object.keys(DEFAULT_FEATURE_FLAGS.flags).forEach(flagId => {
      featureFlagsService.setFlagEnabled(
        flagId as keyof FeatureFlagsConfig['flags'], 
        true
      );
    });
    
    console.log('✅ Todos los feature flags habilitados (modo desarrollo)');
  },
  
  /**
   * Deshabilita todos los flags (solo para desarrollo)
   */
  disableAllFlags: () => {
    Object.keys(DEFAULT_FEATURE_FLAGS.flags).forEach(flagId => {
      featureFlagsService.setFlagEnabled(
        flagId as keyof FeatureFlagsConfig['flags'], 
        false
      );
    });
    
    console.log('❌ Todos los feature flags deshabilitados (modo desarrollo)');
  }
};