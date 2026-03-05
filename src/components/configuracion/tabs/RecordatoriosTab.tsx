// ============================================================================
// saludvalpa 3.0 - RECORDATORIOS TAB
// Componente para la pestaña de configuración de recordatorios y notificaciones
// ============================================================================

import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

const RecordatoriosTab: React.FC = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();

  const handleRecordatorioChange = (field: string, value: any) => {
    if (!configuracion) return;
    
    actualizarConfiguracion({
      preferencias: {
        ...configuracion.preferencias,
        recordatorios: {
          ...(configuracion.preferencias?.recordatorios || {}),
          [field]: value
        }
      }
    });
  };

  const tiposRecordatorios = [
    { id: 'citas', label: 'Recordatorio de Citas', description: 'Notificaciones antes de cada cita' },
    { id: 'pagos', label: 'Recordatorio de Pagos', description: 'Recordatorios de pagos pendientes' },
    { id: 'cumpleanos', label: 'Cumpleaños de Pacientes', description: 'Notificaciones de cumpleaños' },
    { id: 'seguimiento', label: 'Seguimiento Post-Cita', description: 'Recordatorios para seguimiento' },
    { id: 'promociones', label: 'Promociones', description: 'Ofertas y promociones especiales' },
  ];

  const canalesNotificacion = [
    { id: 'push', label: 'Notificaciones Push', description: 'En la aplicación' },
    { id: 'email', label: 'Correo Electrónico', description: 'Envío por email' },
    { id: 'sms', label: 'SMS', description: 'Mensajes de texto (requiere créditos)' },
    { id: 'whatsapp', label: 'WhatsApp', description: 'Mensajes por WhatsApp (próximamente)' },
  ];

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Configuración de Recordatorios"
          description="Personaliza cómo y cuándo recibir notificaciones"
          icon="🔔"
          variant="warning"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tipos de Recordatorios</h4>
              <div className="space-y-3">
                {tiposRecordatorios.map((tipo) => (
                  <div key={tipo.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{tipo.label}</p>
                      <p className="text-sm text-gray-600">{tipo.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion?.preferencias?.recordatorios?.[tipo.id as keyof typeof configuracion.preferencias.recordatorios] || false}
                        onChange={(e) => handleRecordatorioChange(tipo.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Canales de Notificación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {canalesNotificacion.map((canal) => (
                  <div key={canal.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{canal.label}</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracion?.preferencias?.recordatorios?.canales?.[canal.id as keyof typeof configuracion.preferencias.recordatorios.canales] || false}
                          onChange={(e) => {
                            if (!configuracion) return;
                            const currentCanales = configuracion.preferencias?.recordatorios?.canales || {};
                            actualizarConfiguracion({
                              preferencias: {
                                ...configuracion.preferencias,
                                recordatorios: {
                                  ...(configuracion.preferencias?.recordatorios || {}),
                                  canales: {
                                    ...currentCanales,
                                    [canal.id]: e.target.checked
                                  }
                                }
                              }
                            });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">{canal.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configuración de Tiempo</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recordatorio de Citas (Anticipación)
                  </label>
                  <select
                    value={configuracion?.preferencias?.recordatorios?.anticipacionCitas || '1_hora'}
                    onChange={(e) => handleRecordatorioChange('anticipacionCitas', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="15_min">15 minutos antes</option>
                    <option value="30_min">30 minutos antes</option>
                    <option value="1_hora">1 hora antes</option>
                    <option value="2_horas">2 horas antes</option>
                    <option value="1_dia">1 día antes</option>
                    <option value="2_dias">2 días antes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora del Día para Recordatorios
                  </label>
                  <input
                    type="time"
                    value={configuracion?.preferencias?.recordatorios?.horaRecordatorio || '09:00'}
                    onChange={(e) => handleRecordatorioChange('horaRecordatorio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hora preferida para recibir recordatorios diarios
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📱 Notificaciones Push</h4>
              <p className="text-sm text-blue-700 mb-3">
                Las notificaciones push requieren que tengas la aplicación instalada y los permisos habilitados.
              </p>
              <button
                onClick={() => {
                  if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission();
                  } else if (Notification.permission === 'denied') {
                    alert('Los permisos de notificación están bloqueados. Por favor, habilítalos en la configuración de tu navegador.');
                  }
                }}
                className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Verificar Permisos de Notificación
              </button>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Plantillas de Recordatorios"
          description="Personaliza los mensajes de tus recordatorios"
          icon="📝"
          variant="info"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla para Citas
              </label>
              <textarea
                value={configuracion?.preferencias?.recordatorios?.plantillaCita || 'Recordatorio: Tienes una cita con {paciente} el {fecha} a las {hora}. Lugar: {lugar}'}
                onChange={(e) => handleRecordatorioChange('plantillaCita', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Plantilla personalizada para recordatorios de citas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{paciente}'}, {'{fecha}'}, {'{hora}'}, {'{lugar}'}, {'{profesional}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla para Pagos
              </label>
              <textarea
                value={configuracion?.preferencias?.recordatorios?.plantillaPago || 'Recordatorio de pago: Tienes un pago pendiente de {monto} para {servicio}. Vence el {fecha_vencimiento}'}
                onChange={(e) => handleRecordatorioChange('plantillaPago', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Plantilla personalizada para recordatorios de pagos"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{monto}'}, {'{servicio}'}, {'{fecha_vencimiento}'}, {'{paciente}'}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Incluir firma personalizada</p>
                <p className="text-sm text-gray-600">Agregar tu nombre y contacto al final de los mensajes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion?.preferencias?.recordatorios?.incluirFirma || true}
                  onChange={(e) => handleRecordatorioChange('incluirFirma', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
              </label>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Configuración Avanzada (Enterprise)"
          description="Funcionalidades avanzadas de recordatorios para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-indigo-900">Recordatorios Automáticos por Lote</p>
                <p className="text-sm text-indigo-700">Envío masivo de recordatorios a todos los pacientes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion?.preferencias?.recordatorios?.loteAutomatico || false}
                  onChange={(e) => handleRecordatorioChange('loteAutomatico', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de Recordatorios Masivos
              </label>
              <select
                value={configuracion?.preferencias?.recordatorios?.frecuenciaMasivos || 'semanal'}
                onChange={(e) => handleRecordatorioChange('frecuenciaMasivos', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal (Lunes)</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual (Primer día)</option>
              </select>
            </div>

            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">📊 Analytics de Recordatorios</h4>
              <p className="text-sm text-indigo-700 mb-3">
                Monitorea el rendimiento de tus recordatorios: tasas de apertura, clics y confirmaciones.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Tasa de Apertura</p>
                  <p className="text-2xl font-bold text-indigo-600">78%</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Confirmaciones</p>
                  <p className="text-2xl font-bold text-green-600">92%</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default RecordatoriosTab;