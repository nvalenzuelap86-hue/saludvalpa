// ============================================================================
// saludvalpa 3.0 - SINCRONIZACION TAB
// Componente para la pestaña de configuración de sincronización en la nube
// ============================================================================

import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';
import CloudSyncPanel from '../../CloudSyncPanel';

const SincronizacionTab: React.FC = () => {
  const { configuracion } = useAppStore();

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Sincronización en la Nube"
          description="Respalda y sincroniza tus datos con Google Drive"
          icon="☁️"
          variant="info"
        >
          <div className="space-y-6">
            <CloudSyncPanel />
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-3">Configuración de Sincronización</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sincronización Automática</p>
                    <p className="text-sm text-gray-600">Sincronizar cambios automáticamente cada 24 horas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => alert('Funcionalidad disponible en próximas actualizaciones')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sincronizar Solo en WiFi</p>
                    <p className="text-sm text-gray-600">Evitar sincronización en redes móviles</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => alert('Funcionalidad disponible en próximas actualizaciones')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia de Respaldo Automático
                  </label>
                  <select
                    value="diario"
                    onChange={() => alert('Funcionalidad disponible en próximas actualizaciones')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal (Domingos)</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual (Primer día)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Servicios de Nube Compatibles"
          description="Conecta SaludValpa con tus servicios favoritos"
          icon="🔗"
          variant="success"
        >
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Google Drive</p>
                    <p className="text-sm text-gray-600">15 GB de almacenamiento gratuito</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Disponible
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Tus datos se respaldan en una carpeta privada en tu Google Drive. Solo tú tienes acceso.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-bold">D</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dropbox</p>
                    <p className="text-sm text-gray-600">2 GB de almacenamiento gratuito</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                  Próximamente
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Integración con Dropbox disponible en la próxima actualización.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-bold">O</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">OneDrive</p>
                    <p className="text-sm text-gray-600">5 GB de almacenamiento gratuito</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                  Próximamente
                </span>
              </div>
              <p className="text-sm text-gray-700">
                Integración con Microsoft OneDrive disponible próximamente.
              </p>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Configuración Avanzada (Enterprise)"
          description="Funcionalidades avanzadas de sincronización para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-indigo-900">Sincronización en Tiempo Real</p>
                <p className="text-sm text-indigo-700">Cambios sincronizados instantáneamente entre dispositivos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => {}}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-indigo-900">Sincronización Multi-Usuario</p>
                <p className="text-sm text-indigo-700">Varios profesionales pueden sincronizar en el mismo equipo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => {}}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">📊 Analytics de Sincronización</h4>
              <p className="text-sm text-indigo-700 mb-3">
                Monitorea el estado de sincronización: últimos respaldos, espacio usado y actividad.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Último Respaldo</p>
                  <p className="text-lg font-bold text-indigo-600">Hace 2 horas</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Espacio Usado</p>
                  <p className="text-lg font-bold text-green-600">45 MB / 15 GB</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default SincronizacionTab;