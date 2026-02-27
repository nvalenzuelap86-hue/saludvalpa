// ============================================================================
// saludvalpa 3.0 - APP STORE
// Estado global de la aplicación usando Zustand
// ============================================================================

import { create } from 'zustand';
import type { Configuracion, Licencia, TipoProfesion } from '../types';
import { TipoLicencia, EstadoLicencia } from '../types';
import { db } from '../db/database';

interface OnboardingData {
  profesion: TipoProfesion;
  branding: {
    nombreProfesional: string;
    credenciales: string;
    especialidad: string;
    colores: {
      primario: string;
      secundario: string;
      acento: string;
    };
    tema: 'saludvalpa' | 'minimalista' | 'profesional' | 'moderno' | 'personalizado';
    piePagina: string;
    mostrarMarcaDeAgua: boolean;
    formatoDocumentos: 'formal' | 'informal' | 'moderno';
  };
  datosContacto: {
    telefono: string;
    email: string;
  };
}

interface AppState {
  // Estado de configuración
  configuracion: Configuracion | null;
  licencia: Licencia | null;
  
  // Estado de carga
  isLoading: boolean;
  isInitialized: boolean;
  
  // Estado de onboarding
  onboardingStep: 'landing' | 'welcome' | 'specialty' | 'profile' | 'complete';
  onboardingProgress: number; // 0-100
  
  // Acciones
  cargarConfiguracion: () => Promise<void>;
  actualizarConfiguracion: (config: Partial<Configuracion>) => Promise<void>;
  actualizarLicencia: (licencia: Licencia) => Promise<void>;
  completarOnboarding: (data: OnboardingData) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOnboardingStep: (step: 'landing' | 'welcome' | 'specialty' | 'profile' | 'complete') => void;
  updateOnboardingProgress: (progress: number) => void;
  resetOnboarding: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  configuracion: null,
  licencia: null,
  isLoading: true,
  isInitialized: false,
  onboardingStep: 'landing',
  onboardingProgress: 0,

  cargarConfiguracion: async () => {
    try {
      set({ isLoading: true });
      const config = await db.configuracion.get('1');
      
      if (config) {
        // Usuario ya completó onboarding
        set({
          configuracion: config,
          licencia: config.licencia,
          isInitialized: true,
          onboardingStep: 'complete',
          onboardingProgress: 100,
        });
      } else {
        // No hay configuración, usuario debe hacer onboarding
        set({
          configuracion: null,
          licencia: null,
          isInitialized: true, // IMPORTANTE: marcar como inicializado aunque no haya config
          onboardingStep: 'landing',
          onboardingProgress: 0,
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      set({
        isInitialized: true,
        onboardingStep: 'landing',
        onboardingProgress: 0,
      }); // Marcar como inicializado incluso con error
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarConfiguracion: async (updates: Partial<Configuracion>) => {
    try {
      const currentConfig = get().configuracion;
      if (!currentConfig) return;

      const nuevaConfig = {
        ...currentConfig,
        ...updates,
        fechaActualizacion: new Date(),
      };

      await db.configuracion.update('1', nuevaConfig);
      set({ configuracion: nuevaConfig });
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
    }
  },

  actualizarLicencia: async (licencia: Licencia) => {
    try {
      const currentConfig = get().configuracion;
      if (!currentConfig) return;

      const nuevaConfig = {
        ...currentConfig,
        licencia,
        fechaActualizacion: new Date(),
      };

      await db.configuracion.update('1', nuevaConfig);
      set({ 
        configuracion: nuevaConfig,
        licencia,
      });
    } catch (error) {
      console.error('Error al actualizar licencia:', error);
    }
  },

  completarOnboarding: async (data: OnboardingData) => {
    try {
      const ahora = new Date();
      
      const configuracionInicial: Configuracion = {
        id: '1',
        profesion: data.profesion,
        tipoCuenta: 'personal',
        licencia: {
          tipo: TipoLicencia.GRATUITA,
          estado: EstadoLicencia.ACTIVA,
          fechaActivacion: ahora,
          fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          limitePacientes: 10,
        },
        branding: data.branding,
        datosContacto: data.datosContacto,
        preferencias: {
          formatoFecha: 'DD/MM/YYYY',
          zonaHoraria: 'America/Mexico_City',
          idioma: 'es',
          notificaciones: true,
          recordatorios: {
            habilitados: true,
            anticipacionCitas: 60,
            anticipacionDia: 24,
            sonido: true,
          },
          agenda: {
            vistaInicial: 'semana',
            horaInicio: '08:00',
            horaFin: '20:00',
            duracionCitaDefault: 60,
          },
          economia: {
            moneda: 'MXN',
            mostrarImpuestos: false,
            iva: 16,
          },
        },
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      };

      // Guardar en la base de datos (usar put para actualizar si existe)
      await db.configuracion.put(configuracionInicial);

      // Actualizar estado
      set({
        configuracion: configuracionInicial,
        licencia: configuracionInicial.licencia,
        isInitialized: true,
      });

      console.log('✅ Onboarding completado para:', data.profesion);
    } catch (error) {
      console.error('Error al completar onboarding:', error);
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setOnboardingStep: (step: 'landing' | 'welcome' | 'specialty' | 'profile' | 'complete') => {
    set({ onboardingStep: step });
    
    // Actualizar progreso basado en el paso
    const progressMap = {
      'landing': 0,
      'welcome': 25,
      'specialty': 50,
      'profile': 75,
      'complete': 100
    };
    
    set({ onboardingProgress: progressMap[step] });
  },

  updateOnboardingProgress: (progress: number) => {
    // Asegurar que el progreso esté entre 0 y 100
    const clampedProgress = Math.max(0, Math.min(100, progress));
    set({ onboardingProgress: clampedProgress });
  },

  resetOnboarding: () => {
    set({
      onboardingStep: 'landing',
      onboardingProgress: 0,
      configuracion: null,
      licencia: null,
    });
  },
}));
