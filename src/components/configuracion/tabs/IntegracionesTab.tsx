// ============================================================================
// saludvalpa 3.0 - INTEGRACIONES TAB
// Componente para la pestaña de integraciones externas (Fase 3)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

// Tipos de integraciones disponibles
type TipoIntegracion = 'google_calendar' | 'google_drive' | 'stripe' | 'paypal' | 'whatsapp' | 'email' | 'webhook' | 'api_personalizada';

interface ConfiguracionIntegracion {
  tipo: TipoIntegracion;
  nombre: string;
  descripcion: string;
  icono: string;
  configurado: boolean;
  configuracion: Record<string, any>;
  webhooks?: {
    url: string;
    eventos: string[];
    activo: boolean;
  }[];
}

const IntegracionesTab: React.FC = () => {
  const { configuracion } = useAppStore();
  const [integraciones, setIntegraciones] = useState<ConfiguracionIntegracion[]>([
    {
      tipo: 'google_calendar',
      nombre: 'Google Calendar',
      descripcion: 'Sincroniza tu agenda con Google Calendar',
      icono: '📅',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'google_drive',
      nombre: 'Google Drive',
      descripcion: 'Guarda respaldos y documentos en Google Drive',
      icono: '☁️',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'stripe',
      nombre: 'Stripe',
      descripcion: 'Procesamiento de pagos en línea con Stripe',
      icono: '💳',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'paypal',
      nombre: 'PayPal',
      descripcion: 'Acepta pagos con PayPal',
      icono: '💰',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'whatsapp',
      nombre: 'WhatsApp Business',
      descripcion: 'Envía recordatorios por WhatsApp',
      icono: '💬',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'email',
      nombre: 'Email SMTP',
      descripcion: 'Configuración de servidor de correo para notificaciones',
      icono: '📧',
      configurado: false,
      configuracion: {},
    },
    {
      tipo: 'webhook',
      nombre: 'Webhooks',
      descripcion: 'Configura webhooks para eventos del sistema',
      icono: '🔗',
      configurado: false,
      configuracion: {},
      webhooks: [],
    },
    {
      tipo: 'api_personalizada',
      nombre: 'API Personalizada',
      descripcion: 'Conecta con tus propias APIs y sistemas',
      icono: '⚙️',
      configurado: false,
      configuracion: {},
    },
  ]);

  const [integracionActiva, setIntegracionActiva] = useState<TipoIntegracion | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [webhooks, setWebhooks] = useState<Array<{ url: string; eventos: string[]; activo: boolean }>>([]);

  // Cargar configuración guardada (simulado)
  useEffect(() => {
    // En una implementación real, cargaríamos desde la base de datos
    const configuracionesGuardadas = localStorage.getItem('integraciones_config');
    if (configuracionesGuardadas) {
      try {
        const parsed = JSON.parse(configuracionesGuardadas);
        setIntegraciones(prev => prev.map(integ => ({
          ...integ,
          configurado: parsed[integ.tipo]?.configurado || false,
          configuracion: parsed[integ.tipo]?.configuracion || {},
        })));
      } catch (error) {
        console.error('Error al cargar configuraciones de integraciones:', error);
      }
    }
  }, []);

  const handleConfigurarIntegracion = (tipo: TipoIntegracion) => {
    const integracion = integraciones.find(i => i.tipo === tipo);
    if (integracion) {
      setIntegracionActiva(tipo);
      setFormData(integracion.configuracion);
      setWebhooks(integracion.webhooks || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardarConfiguracion = () => {
    if (!integracionActiva) return;

    // Actualizar la integración
    setIntegraciones(prev => prev.map(integ => {
      if (integ.tipo === integracionActiva) {
        return {
          ...integ,
          configurado: true,
          configuracion: formData,
          webhooks: integ.tipo === 'webhook' ? webhooks : integ.webhooks,
        };
      }
      return integ;
    }));

    // Guardar en localStorage (simulado)
    const configuracionesGuardadas = localStorage.getItem('integraciones_config');
    const parsed = configuracionesGuardadas ? JSON.parse(configuracionesGuardadas) : {};
    parsed[integracionActiva] = {
      configurado: true,
      configuracion: formData,
      webhooks: integracionActiva === 'webhook' ? webhooks : undefined,
    };
    localStorage.setItem('integraciones_config', JSON.stringify(parsed));

    alert('✅ Configuración guardada correctamente');
    setIntegracionActiva(null);
  };

  const handleDesconectarIntegracion = (tipo: TipoIntegracion) => {
    if (confirm('¿Estás seguro de desconectar esta integración?')) {
      setIntegraciones(prev => prev.map(integ => {
        if (integ.tipo === tipo) {
          return { ...integ, configurado: false, configuracion: {} };
        }
        return integ;
      }));

      // Actualizar localStorage
      const configuracionesGuardadas = localStorage.getItem('integraciones_config');
      const parsed = configuracionesGuardadas ? JSON.parse(configuracionesGuardadas) : {};
      delete parsed[tipo];
      localStorage.setItem('integraciones_config', JSON.stringify(parsed));

      alert('✅ Integración desconectada');
    }
  };

  const handleAgregarWebhook = () => {
    setWebhooks(prev => [...prev, { url: '', eventos: [], activo: true }]);
  };

  const handleWebhookChange = (index: number, field: string, value: any) => {
    setWebhooks(prev => prev.map((webhook, i) => {
      if (i === index) {
        return { ...webhook, [field]: value };
      }
      return webhook;
    }));
  };

  const handleEliminarWebhook = (index: number) => {
    setWebhooks(prev => prev.filter((_, i) => i !== index));
  };

  const renderFormularioConfiguracion = () => {
    if (!integracionActiva) return null;

    const integracion = integraciones.find(i => i.tipo === integracionActiva);
    if (!integracion) return null;

    switch (integracionActiva) {
      case 'google_calendar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client ID de Google API
              </label>
              <input
                type="text"
                name="clientId"
                value={formData.clientId || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Secret
              </label>
              <input
                type="password"
                name="clientSecret"
                value={formData.clientSecret || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="••••••••••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Calendario
              </label>
              <input
                type="text"
                name="calendarId"
                value={formData.calendarId || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="primary o email del calendario"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sincronizarAutomaticamente"
                name="sincronizarAutomaticamente"
                checked={formData.sincronizarAutomaticamente || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-saludvalpa-blue focus:ring-saludvalpa-blue border-gray-300 rounded"
              />
              <label htmlFor="sincronizarAutomaticamente" className="ml-2 block text-sm text-gray-700">
                Sincronizar automáticamente
              </label>
            </div>
          </div>
        );

      case 'stripe':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave secreta de Stripe
              </label>
              <input
                type="password"
                name="secretKey"
                value={formData.secretKey || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="sk_live_••••••••••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                Encuentra tus claves en el dashboard de Stripe
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave pública de Stripe
              </label>
              <input
                type="text"
                name="publishableKey"
                value={formData.publishableKey || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="pk_live_••••••••••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Secret
              </label>
              <input
                type="password"
                name="webhookSecret"
                value={formData.webhookSecret || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="whsec_••••••••••••••••"
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configurar Webhooks</h4>
              <p className="text-sm text-gray-600 mb-4">
                Los webhooks permiten que otros sistemas reciban notificaciones cuando ocurren eventos en SaludValpa.
              </p>
              
              <div className="mb-4">
                <button
                  onClick={handleAgregarWebhook}
                  className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Agregar Webhook</span>
                </button>
              </div>

              {webhooks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p>No hay webhooks configurados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-gray-900">Webhook #{index + 1}</h5>
                        <button
                          onClick={() => handleEliminarWebhook(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL del endpoint
                          </label>
                          <input
                            type="url"
                            value={webhook.url}
                            onChange={(e) => handleWebhookChange(index, 'url', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                            placeholder="https://tusistema.com/webhook"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Eventos a notificar
                          </label>
                          <div className="space-y-2">
                            {['cita_creada', 'cita_cancelada', 'documento_generado', 'pago_recibido', 'paciente_creado'].map(evento => (
                              <div key={evento} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`evento-${index}-${evento}`}
                                  checked={webhook.eventos.includes(evento)}
                                  onChange={(e) => {
                                    const nuevosEventos = e.target.checked
                                      ? [...webhook.eventos, evento]
                                      : webhook.eventos.filter(e => e !== evento);
                                    handleWebhookChange(index, 'eventos', nuevosEventos);
                                  }}
                                  className="h-4 w-4 text-saludvalpa-blue focus:ring-saludvalpa-blue border-gray-300 rounded"
                                />
                                <label htmlFor={`evento-${index}-${evento}`} className="ml-2 block text-sm text-gray-700">
                                  {evento.replace(/_/g, ' ')}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`activo-${index}`}
                            checked={webhook.activo}
                            onChange={(e) => handleWebhookChange(index, 'activo', e.target.checked)}
                            className="h-4 w-4 text-saludvalpa-blue focus:ring-saludvalpa-blue border-gray-300 rounded"
                          />
                          <label htmlFor={`activo-${index}`} className="ml-2 block text-sm text-gray-700">
                            Webhook activo
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Eventos disponibles</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>cita_creada</strong>: Cuando se crea una nueva cita</li>
                <li>• <strong>cita_cancelada</strong>: Cuando se cancela una cita</li>
                <li>• <strong>documento_generado</strong>: Cuando se genera un documento</li>
                <li>• <strong>pago_recibido</strong>: Cuando se registra un pago</li>
                <li>• <strong>paciente_creado</strong>: Cuando se crea un nuevo paciente</li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave API
              </label>
              <input
                type="password"
                name="apiKey"
                value={formData.apiKey || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ingresa tu clave API"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del endpoint
              </label>
              <input
                type="url"
                name="endpointUrl"
                value={formData.endpointUrl || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="https://api.tusistema.com/v1"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verificarSSL"
                name="verificarSSL"
                checked={formData.verificarSSL || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-saludvalpa-blue focus:ring-saludvalpa-blue border-gray-300 rounded"
              />
              <label htmlFor="verificarSSL" className="ml-2 block text-sm text-gray-700">
                Verificar certificado SSL
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <LicenseGate requiredLevel="enterprise">
      <div className="space-y-6">
        <SectionCard
          title="Integraciones Externas"
          description="Conecta SaludValpa con tus sistemas favoritos y servicios externos"
          variant="default"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integraciones.map((integracion) => (
              <div
                key={integracion.tipo}
                className={`p-4 border rounded-lg transition-colors ${
                  integracion.configurado
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integracion.icono}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{integracion.nombre}</h4>
                      <p className="text-sm text-gray-600">{integracion.descripcion}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integracion.configurado
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {integracion.configurado ? 'Configurado' : 'No configurado'}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleConfigurarIntegracion(integracion.tipo)}
                    className="flex-1 bg-saludvalpa-blue text-white px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                  >
                    {integracion.configurado ? 'Editar' : 'Configurar'}
                  </button>
                  {integracion.configurado && (
                    <button
                      onClick={() => handleDesconectarIntegracion(integracion.tipo)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {integracionActiva && (
          <SectionCard
            title={`Configurar ${integraciones.find(i => i.tipo === integracionActiva)?.nombre}`}
            description="Completa los campos requeridos para conectar esta integración"
            variant="default"
          >
            {renderFormularioConfiguracion()}
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIntegracionActiva(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarConfiguracion}
                className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </SectionCard>
        )}
      </div>
    </LicenseGate>
  );
};

export default IntegracionesTab;