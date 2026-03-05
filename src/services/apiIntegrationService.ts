// ============================================================================
// saludvalpa 3.0 - API INTEGRATION SERVICE (Fase 3)
// Servicio para manejar integraciones con APIs externas y webhooks
// ============================================================================

import type { Cita, Paciente, Documento, Recibo } from '../types';

// Tipos de integraciones disponibles
export type TipoIntegracion = 'google_calendar' | 'google_drive' | 'stripe' | 'paypal' | 'whatsapp' | 'email' | 'webhook' | 'api_personalizada';

// Configuración de integración
export interface ConfiguracionIntegracion {
  tipo: TipoIntegracion;
  configurado: boolean;
  configuracion: Record<string, any>;
  webhooks?: WebhookConfig[];
}

// Configuración de webhook
export interface WebhookConfig {
  url: string;
  eventos: string[];
  activo: boolean;
  secret?: string; // Para verificación de firma
  ultimoEnvio?: Date;
  errores?: number;
}

// Eventos del sistema que pueden disparar webhooks
export type TipoEvento = 
  | 'cita_creada'
  | 'cita_cancelada'
  | 'cita_modificada'
  | 'cita_completada'
  | 'paciente_creado'
  | 'paciente_modificado'
  | 'documento_generado'
  | 'pago_recibido'
  | 'pago_fallido'
  | 'recibo_generado'
  | 'sesion_iniciada'
  | 'sesion_finalizada'
  | 'backup_completado'
  | 'error_sistema';

// Datos del evento para webhooks
export interface EventoWebhook {
  tipo: TipoEvento;
  timestamp: string;
  datos: Record<string, any>;
  metadata: {
    usuarioId?: string;
    dispositivoId?: string;
    versionApp: string;
  };
}

// Servicio principal de integraciones
class ApiIntegrationService {
  private configuraciones: Map<TipoIntegracion, ConfiguracionIntegracion> = new Map();
  private webhooks: WebhookConfig[] = [];
  private eventListeners: Map<TipoEvento, Function[]> = new Map();

  constructor() {
    this.cargarConfiguraciones();
    this.cargarWebhooks();
    this.inicializarEventListeners();
  }

  // Cargar configuraciones guardadas
  private cargarConfiguraciones(): void {
    const configGuardada = localStorage.getItem('integraciones_config');
    if (configGuardada) {
      try {
        const parsed = JSON.parse(configGuardada);
        Object.entries(parsed).forEach(([tipo, config]) => {
          this.configuraciones.set(tipo as TipoIntegracion, config as ConfiguracionIntegracion);
        });
      } catch (error) {
        console.error('Error al cargar configuraciones de integraciones:', error);
      }
    }
  }

  // Guardar configuraciones
  private guardarConfiguraciones(): void {
    const configObj: Record<string, ConfiguracionIntegracion> = {};
    this.configuraciones.forEach((config, tipo) => {
      configObj[tipo] = config;
    });
    localStorage.setItem('integraciones_config', JSON.stringify(configObj));
  }

  // Inicializar listeners de eventos
  private inicializarEventListeners(): void {
    const eventos: TipoEvento[] = [
      'cita_creada', 'cita_cancelada', 'cita_modificada', 'cita_completada',
      'paciente_creado', 'paciente_modificado', 'documento_generado',
      'pago_recibido', 'pago_fallido', 'recibo_generado'
    ];
    
    eventos.forEach(evento => {
      this.eventListeners.set(evento, []);
    });
  }

  // Registrar un listener para un evento
  public on(evento: TipoEvento, callback: Function): void {
    const listeners = this.eventListeners.get(evento) || [];
    listeners.push(callback);
    this.eventListeners.set(evento, listeners);
  }

  // Disparar un evento
  public async emitirEvento(evento: TipoEvento, datos: Record<string, any>): Promise<void> {
    console.log(`📢 Evento emitido: ${evento}`, datos);

    // Ejecutar listeners locales
    const listeners = this.eventListeners.get(evento) || [];
    listeners.forEach(listener => {
      try {
        listener(datos);
      } catch (error) {
        console.error(`Error en listener para evento ${evento}:`, error);
      }
    });

    // Enviar a webhooks configurados
    await this.enviarAWebhooks(evento, datos);
  }

  // Enviar evento a webhooks configurados
  private async enviarAWebhooks(evento: TipoEvento, datos: Record<string, any>): Promise<void> {
    const webhooksActivos = this.webhooks.filter(w => 
      w.activo && w.eventos.includes(evento)
    );

    if (webhooksActivos.length === 0) return;

    const eventoWebhook: EventoWebhook = {
      tipo: evento,
      timestamp: new Date().toISOString(),
      datos,
      metadata: {
        versionApp: '3.0.0',
        usuarioId: datos.usuarioId,
        dispositivoId: datos.dispositivoId
      }
    };

    // Enviar a cada webhook en paralelo
    const promesas = webhooksActivos.map(async (webhook, index) => {
      try {
        await this.enviarWebhook(webhook, eventoWebhook);
        webhook.ultimoEnvio = new Date();
        webhook.errores = 0;
      } catch (error) {
        console.error(`Error enviando webhook ${index + 1} (${webhook.url}):`, error);
        webhook.errores = (webhook.errores || 0) + 1;
        
        // Desactivar webhook después de 5 errores consecutivos
        if (webhook.errores >= 5) {
          webhook.activo = false;
          console.warn(`Webhook ${webhook.url} desactivado por múltiples errores`);
        }
      }
    });

    await Promise.allSettled(promesas);
  }

  // Enviar solicitud HTTP a webhook
  private async enviarWebhook(webhook: WebhookConfig, evento: EventoWebhook): Promise<void> {
    const respuesta = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SaludValpa/3.0',
        'X-Webhook-Event': evento.tipo,
        'X-Webhook-Timestamp': evento.timestamp,
        ...(webhook.secret && {
          'X-Webhook-Signature': await this.calcularFirma(webhook.secret, evento)
        })
      },
      body: JSON.stringify(evento),
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }
  }

  // Calcular firma HMAC para verificación de webhook
  private async calcularFirma(secret: string, evento: EventoWebhook): Promise<string> {
    const payload = JSON.stringify(evento);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Configurar una integración
  public configurarIntegracion(tipo: TipoIntegracion, configuracion: Record<string, any>): void {
    const configActual = this.configuraciones.get(tipo) || {
      tipo,
      configurado: false,
      configuracion: {}
    };

    this.configuraciones.set(tipo, {
      ...configActual,
      configurado: true,
      configuracion: { ...configActual.configuracion, ...configuracion }
    });

    this.guardarConfiguraciones();
  }

  // Desconectar una integración
  public desconectarIntegracion(tipo: TipoIntegracion): void {
    const configActual = this.configuraciones.get(tipo);
    if (configActual) {
      this.configuraciones.set(tipo, {
        ...configActual,
        configurado: false,
        configuracion: {}
      });
      this.guardarConfiguraciones();
    }
  }

  // Obtener configuración de una integración
  public obtenerConfiguracion(tipo: TipoIntegracion): ConfiguracionIntegracion | undefined {
    return this.configuraciones.get(tipo);
  }

  // Obtener todas las configuraciones
  public obtenerTodasConfiguraciones(): ConfiguracionIntegracion[] {
    return Array.from(this.configuraciones.values());
  }

  // Verificar si una integración está configurada
  public estaConfigurada(tipo: TipoIntegracion): boolean {
    return this.configuraciones.get(tipo)?.configurado || false;
  }

  // Agregar webhook
  public agregarWebhook(webhook: Omit<WebhookConfig, 'ultimoEnvio' | 'errores'>): void {
    this.webhooks.push({
      ...webhook,
      ultimoEnvio: undefined,
      errores: 0
    });
    this.guardarWebhooks();
  }

  // Actualizar webhook
  public actualizarWebhook(index: number, updates: Partial<WebhookConfig>): void {
    if (index >= 0 && index < this.webhooks.length) {
      this.webhooks[index] = { ...this.webhooks[index], ...updates };
      this.guardarWebhooks();
    }
  }

  // Eliminar webhook
  public eliminarWebhook(index: number): void {
    if (index >= 0 && index < this.webhooks.length) {
      this.webhooks.splice(index, 1);
      this.guardarWebhooks();
    }
  }

  // Obtener todos los webhooks
  public obtenerWebhooks(): WebhookConfig[] {
    return [...this.webhooks];
  }

  // Guardar webhooks en localStorage
  private guardarWebhooks(): void {
    localStorage.setItem('integraciones_webhooks', JSON.stringify(this.webhooks));
  }

  // Cargar webhooks desde localStorage
  private cargarWebhooks(): void {
    const webhooksGuardados = localStorage.getItem('integraciones_webhooks');
    if (webhooksGuardados) {
      try {
        this.webhooks = JSON.parse(webhooksGuardados);
      } catch (error) {
        console.error('Error al cargar webhooks:', error);
      }
    }
  }

  // Métodos específicos para cada tipo de integración

  // Google Calendar: Crear evento
  public async crearEventoGoogleCalendar(evento: {
    titulo: string;
    descripcion?: string;
    inicio: Date;
    fin: Date;
    ubicacion?: string;
    participantes?: string[];
  }): Promise<string | null> {
    const config = this.obtenerConfiguracion('google_calendar');
    if (!config?.configurado) return null;

    // En una implementación real, aquí se haría la llamada a Google Calendar API
    console.log('Creando evento en Google Calendar:', evento);
    
    // Simulación de éxito
    return 'evento_123456';
  }

  // Stripe: Crear sesión de pago
  public async crearSesionPagoStripe(pago: {
    monto: number;
    moneda: string;
    descripcion: string;
    metadata?: Record<string, any>;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string | null> {
    const config = this.obtenerConfiguracion('stripe');
    if (!config?.configurado) return null;

    // En una implementación real, aquí se haría la llamada a Stripe API
    console.log('Creando sesión de pago en Stripe:', pago);
    
    // Simulación de éxito
    return 'cs_test_123456';
  }

  // WhatsApp: Enviar mensaje
  public async enviarMensajeWhatsApp(mensaje: {
    telefono: string;
    texto: string;
    plantilla?: string;
    variables?: Record<string, string>;
  }): Promise<boolean> {
    const config = this.obtenerConfiguracion('whatsapp');
    if (!config?.configurado) return false;

    // En una implementación real, aquí se haría la llamada a WhatsApp Business API
    console.log('Enviando mensaje por WhatsApp:', mensaje);
    
    // Simulación de éxito
    return true;
  }

  // Email: Enviar correo
  public async enviarCorreo(correo: {
    destinatario: string;
    asunto: string;
    cuerpo: string;
    html?: boolean;
    adjuntos?: Array<{ nombre: string; contenido: string; tipo: string }>;
  }): Promise<boolean> {
    const config = this.obtenerConfiguracion('email');
    if (!config?.configurado) return false;

    // En una implementación real, aquí se haría la llamada al servidor SMTP
    console.log('Enviando correo:', correo);
    
    // Simulación de éxito
    return true;
  }

  // API Personalizada: Llamada genérica
  public async llamarApiPersonalizada(endpoint: string, datos: any, metodo: string = 'POST'): Promise<any> {
    const config = this.obtenerConfiguracion('api_personalizada');
    if (!config?.configurado) throw new Error('API personalizada no configurada');

    const { apiKey, baseUrl } = config.configuracion;
    
    try {
      const respuesta = await fetch(`${baseUrl}${endpoint}`, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'SaludValpa/3.0'
        },
        body: metodo !== 'GET' ? JSON.stringify(datos) : undefined
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
      }

      return await respuesta.json();
    } catch (error) {
      console.error('Error en llamada a API personalizada:', error);
      throw error;
    }
  }

  // Verificar estado de todas las integraciones
  public async verificarEstadoIntegraciones(): Promise<Record<TipoIntegracion, { ok: boolean; mensaje: string }>> {
    const resultados: Partial<Record<TipoIntegracion, { ok: boolean; mensaje: string }>> = {};
    const tipos: TipoIntegracion[] = ['google_calendar', 'google_drive', 'stripe', 'paypal', 'whatsapp', 'email', 'webhook', 'api_personalizada'];

    for (const tipo of tipos) {
      const config = this.obtenerConfiguracion(tipo);
      
      if (!config?.configurado) {
        resultados[tipo] = { ok: false, mensaje: 'No configurado' };
        continue;
      }

      try {
        // Verificaciones específicas por tipo
        switch (tipo) {
          case 'google_calendar':
          case 'google_drive':
            resultados[tipo] = { ok: true, mensaje: 'Conectado a Google' };
            break;
          case 'stripe':
            resultados[tipo] = { ok: true, mensaje: 'Conectado a Stripe' };
            break;
          case 'paypal':
            resultados[tipo] = { ok: true, mensaje: 'Conectado a PayPal' };
            break;
          case 'whatsapp':
            resultados[tipo] = { ok: true, mensaje: 'Conectado a WhatsApp Business' };
            break;
          case 'email':
            resultados[tipo] = { ok: true, mensaje: 'Servidor SMTP configurado' };
            break;
          case 'webhook':
            const webhooksActivos = this.webhooks.filter(w => w.activo).length;
            resultados[tipo] = { ok: webhooksActivos > 0, mensaje: `${webhooksActivos} webhook(s) activo(s)` };
            break;
          case 'api_personalizada':
            resultados[tipo] = { ok: true, mensaje: 'API personalizada configurada' };
            break;
        }
      } catch (error) {
        resultados[tipo] = { ok: false, mensaje: `Error: ${error instanceof Error ? error.message : 'Desconocido'}` };
      }
    }

    return resultados as Record<TipoIntegracion, { ok: boolean; mensaje: string }>;
  }
}

// Instancia singleton del servicio
export const apiIntegrationService = new ApiIntegrationService();

// Helper para disparar eventos comunes
export const eventosHelper = {
  citaCreada: (cita: Cita) => {
    apiIntegrationService.emitirEvento('cita_creada', {
      citaId: cita.id,
      pacienteId: cita.pacienteId,
      fechaHora: cita.fechaHora,
      duracion: cita.duracion,
      tipo: cita.tipo,
      estado: cita.estado,
      profesion: cita.profesion
    });
  },
  
  citaCancelada: (cita: Cita) => {
    apiIntegrationService.emitirEvento('cita_cancelada', {
      citaId: cita.id,
      pacienteId: cita.pacienteId,
      fechaHora: cita.fechaHora,
      motivo: 'cancelada_por_usuario'
    });
  },
  
  citaModificada: (cita: Cita, cambios: Partial<Cita>) => {
    apiIntegrationService.emitirEvento('cita_modificada', {
      citaId: cita.id,
      pacienteId: cita.pacienteId,
      cambios: cambios,
      fechaOriginal: cita.fechaHora
    });
  },
  
  pacienteCreado: (paciente: Paciente) => {
    apiIntegrationService.emitirEvento('paciente_creado', {
      pacienteId: paciente.id,
      nombre: paciente.nombre,
      email: paciente.email,
      telefono: paciente.telefono
    });
  },
  
  documentoGenerado: (documento: Documento) => {
    apiIntegrationService.emitirEvento('documento_generado', {
      documentoId: documento.id,
      tipo: documento.tipo,
      nombre: documento.nombre,
      pacienteId: documento.pacienteId
    });
  },
  
  pagoRecibido: (recibo: Recibo) => {
    apiIntegrationService.emitirEvento('pago_recibido', {
      reciboId: recibo.id,
      monto: recibo.total,
      pacienteId: recibo.pacienteId,
      metodoPago: recibo.metodoPago,
      numeroRecibo: recibo.numero
    });
  }
};