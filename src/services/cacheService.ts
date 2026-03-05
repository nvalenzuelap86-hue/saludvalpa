// ============================================================================
// saludvalpa 3.0 - Cache Service
// Sistema de caché para mejorar rendimiento de la aplicación
// ============================================================================

import type { Configuracion } from '../types';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
}

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    memoryUsage: 0
  };
  
  // Tiempo de expiración por defecto (5 minutos)
  private defaultTTL = 5 * 60 * 1000;
  
  /**
   * Almacena un valor en la caché
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt,
      key
    };
    
    this.cache.set(key, entry);
    this.updateStats();
  }
  
  /**
   * Obtiene un valor de la caché
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Verificar si ha expirado
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    this.stats.hits++;
    return entry.data;
  }
  
  /**
   * Obtiene un valor de la caché o ejecuta la función para obtenerlo
   */
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const data = await fetchFn();
    this.set(key, data, ttl);
    
    return data;
  }
  
  /**
   * Elimina un valor de la caché
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }
  
  /**
   * Limpia la caché completa o por patrón
   */
  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
    } else {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    }
    
    this.updateStats();
  }
  
  /**
   * Obtiene estadísticas de la caché
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Obtiene todas las claves en la caché
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Verifica si una clave existe en la caché (sin verificar expiración)
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  /**
   * Actualiza las estadísticas
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    
    // Estimación simple de uso de memoria
    let estimatedSize = 0;
    for (const entry of this.cache.values()) {
      try {
        const jsonString = JSON.stringify(entry.data);
        estimatedSize += jsonString.length * 2; // Aproximación para strings UTF-16
      } catch {
        // Si no se puede serializar, estimar tamaño base
        estimatedSize += 1000;
      }
    }
    
    this.stats.memoryUsage = estimatedSize;
  }
  
  /**
   * Limpia entradas expiradas
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.updateStats();
    }
    
    return cleaned;
  }
}

// Instancia global de caché
export const globalCache = new CacheService();

// Caché específica para configuración
export class ConfigurationCache {
  static readonly CONFIG_KEY = 'configuracion_v1';
  private static readonly CONFIG_TTL = 10 * 60 * 1000; // 10 minutos
  
  /**
   * Obtiene la configuración desde la caché o la base de datos
   */
  static async getConfig(fetchFromDB: () => Promise<Configuracion | null>): Promise<Configuracion | null> {
    return globalCache.getOrSet(
      this.CONFIG_KEY,
      fetchFromDB,
      this.CONFIG_TTL
    );
  }
  
  /**
   * Actualiza la configuración en la caché
   */
  static setConfig(config: Configuracion): void {
    globalCache.set(this.CONFIG_KEY, config, this.CONFIG_TTL);
  }
  
  /**
   * Invalida la caché de configuración
   */
  static invalidate(): void {
    globalCache.delete(this.CONFIG_KEY);
  }
  
  /**
   * Obtiene estadísticas de la caché de configuración
   */
  static getStats() {
    return {
      hasConfig: globalCache.has(this.CONFIG_KEY),
      ...globalCache.getStats()
    };
  }
}

// Caché para datos de pacientes
export class PatientsCache {
  private static readonly PATIENTS_KEY_PREFIX = 'patients_';
  private static readonly PATIENTS_LIST_KEY = 'patients_list';
  private static readonly PATIENTS_TTL = 2 * 60 * 1000; // 2 minutos
  
  static getPatient(id: string) {
    return globalCache.get(`${this.PATIENTS_KEY_PREFIX}${id}`);
  }
  
  static setPatient(id: string, data: any) {
    globalCache.set(`${this.PATIENTS_KEY_PREFIX}${id}`, data, this.PATIENTS_TTL);
  }
  
  static getPatientsList() {
    return globalCache.get(this.PATIENTS_LIST_KEY);
  }
  
  static setPatientsList(data: any) {
    globalCache.set(this.PATIENTS_LIST_KEY, data, this.PATIENTS_TTL);
  }
  
  static invalidatePatient(id: string) {
    globalCache.delete(`${this.PATIENTS_KEY_PREFIX}${id}`);
  }
  
  static invalidateAll() {
    globalCache.clear(`${this.PATIENTS_KEY_PREFIX}.*`);
    globalCache.delete(this.PATIENTS_LIST_KEY);
  }
}

// Hook para React
export const useCache = () => {
  return {
    // Métodos generales
    get: <T>(key: string) => globalCache.get<T>(key),
    set: <T>(key: string, data: T, ttl?: number) => globalCache.set(key, data, ttl),
    delete: (key: string) => globalCache.delete(key),
    clear: (pattern?: string) => globalCache.clear(pattern),
    
    // Métodos específicos de configuración
    getConfig: () => globalCache.get<Configuracion>(ConfigurationCache.CONFIG_KEY),
    setConfig: (config: Configuracion) => ConfigurationCache.setConfig(config),
    invalidateConfig: () => ConfigurationCache.invalidate(),
    
    // Métodos específicos de pacientes
    getPatient: (id: string) => PatientsCache.getPatient(id),
    setPatient: (id: string, data: any) => PatientsCache.setPatient(id, data),
    getPatientsList: () => PatientsCache.getPatientsList(),
    setPatientsList: (data: any) => PatientsCache.setPatientsList(data),
    
    // Estadísticas
    getStats: () => globalCache.getStats(),
    cleanup: () => globalCache.cleanup()
  };
};

// Inicializar limpieza automática cada minuto
if (typeof window !== 'undefined') {
  setInterval(() => {
    globalCache.cleanup();
  }, 60 * 1000); // Cada minuto
}

export default globalCache;