// ============================================================================
// saludvalpa 3.0 - RESPALDOS TAB (Fase 3)
// Componente para la pestaña de configuración de respaldos automáticos
// ============================================================================

import React, { useState, useEffect } from 'react';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

interface ConfiguracionRespaldo {
  frecuencia: 'diario' | 'semanal' | 'mensual' | 'manual';
  hora: string;
  diaSemana?: number; // 0-6 (domingo-sábado)
  diaMes?: number; // 1-31
  retencionDias: number;
  notificarExito: boolean;
  notificarError: boolean;
  destino: 'local' | 'nube' | 'ambos';
  ultimoRespaldo?: Date;
  proximoRespaldo?: Date;
}

const RespaldosTab: React.FC = () => {
  const [configRespaldo, setConfigRespaldo] = useState<ConfiguracionRespaldo>({
    frecuencia: 'semanal',
    hora: '02:00',
    retencionDias: 30,
    notificarExito: true,
    notificarError: true,
    destino: 'local'
  });
  const [estadoRespaldo, setEstadoRespaldo] = useState<'activo' | 'inactivo' | 'error'>('activo');
  const [historialRespaldos, setHistorialRespaldos] = useState<any[]>([
    { fecha: '2026-03-04T02:00:00', tipo: 'automático', tamaño: '45 MB', estado: 'éxito' },
    { fecha: '2026-02-27T02:00:00', tipo: 'automático', tamaño: '42 MB', estado: 'éxito' },
    { fecha: '2026-02-20T02:00:00', tipo: 'automático', tamaño: '40 MB', estado: 'éxito' },
  ]);

  useEffect(() => {
    // Cargar configuración de respaldos desde localStorage
    const configGuardada = localStorage.getItem('configuracion_respaldos');
    if (configGuardada) {
      try {
        setConfigRespaldo(JSON.parse(configGuardada));
      } catch (error) {
        console.error('Error al cargar configuración de respaldos:', error);
      }
    }
  }, []);

  const guardarConfiguracion = () => {
    localStorage.setItem('configuracion_respaldos', JSON.stringify(configRespaldo));
    alert('Configuración de respaldos guardada exitosamente');
  };

  const ejecutarRespaldoManual = () => {
    setEstadoRespaldo('activo');
    // Simular respaldo en progreso
    setTimeout(() => {
      const nuevoRespaldo = {
        fecha: new Date().toISOString(),
        tipo: 'manual',
        tamaño: '46 MB',
        estado: 'éxito'
      };
      setHistorialRespaldos([nuevoRespaldo, ...historialRespaldos]);
      alert('Respaldo manual completado exitosamente');
    }, 2000);
  };

  const handleConfigChange = (field: keyof ConfiguracionRespaldo, value: any) => {
    setConfigRespaldo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularProximoRespaldo = () => {
    const ahora = new Date();
    const [horas, minutos] = configRespaldo.hora.split(':').map(Number);
    
    let proximo = new Date(ahora);
    proximo.setHours(horas, minutos, 0, 0);
    
    if (proximo <= ahora) {
      // Si la hora ya pasó hoy, programar para mañana
      proximo.setDate(proximo.getDate() + 1);
    }
    
    if (configRespaldo.frecuencia === 'semanal' && configRespaldo.diaSemana !== undefined) {
      // Ajustar al día de la semana específico
      const diferenciaDias = (configRespaldo.diaSemana - proximo.getDay() + 7) % 7;
      proximo.setDate(proximo.getDate() + diferenciaDias);
    } else if (configRespaldo.frecuencia === 'mensual' && configRespaldo.diaMes !== undefined) {
      // Ajustar al día del mes específico
      proximo.setDate(configRespaldo.diaMes);
      if (proximo <= ahora) {
        proximo.setMonth(proximo.getMonth() + 1);
      }
    }
    
    return proximo;
  };

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Programación de Respaldos Automáticos"
          description="Configura respaldos automáticos de tu base de datos"
          icon="🔄"
          variant="info"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Frecuencia de Respaldos</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'diario', label: 'Diario', icon: '📅' },
                  { id: 'semanal', label: 'Semanal', icon: '📆' },
                  { id: 'mensual', label: 'Mensual', icon: '🗓️' },
                  { id: 'manual', label: 'Manual', icon: '⏰' },
                ].map((frec) => (
                  <button
                    key={frec.id}
                    onClick={() => handleConfigChange('frecuencia', frec.id)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      configRespaldo.frecuencia === frec.id
                        ? 'border-saludvalpa-blue bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{frec.icon}</div>
                    <p className="font-medium text-gray-900">{frec.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {configRespaldo.frecuencia !== 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora del Respaldo
                  </label>
                  <input
                    type="time"
                    value={configRespaldo.hora}
                    onChange={(e) => handleConfigChange('hora', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se recomienda programar en horarios de baja actividad
                  </p>
                </div>

                {configRespaldo.frecuencia === 'semanal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Día de la Semana
                    </label>
                    <select
                      value={configRespaldo.diaSemana || 0}
                      onChange={(e) => handleConfigChange('diaSemana', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    >
                      <option value={0}>Domingo</option>
                      <option value={1}>Lunes</option>
                      <option value={2}>Martes</option>
                      <option value={3}>Miércoles</option>
                      <option value={4}>Jueves</option>
                      <option value={5}>Viernes</option>
                      <option value={6}>Sábado</option>
                    </select>
                  </div>
                )}

                {configRespaldo.frecuencia === 'mensual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Día del Mes
                    </label>
                    <select
                      value={configRespaldo.diaMes || 1}
                      onChange={(e) => handleConfigChange('diaMes', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configuración de Retención</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conservar respaldos por (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={configRespaldo.retencionDias}
                    onChange={(e) => handleConfigChange('retencionDias', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Los respaldos más antiguos serán eliminados automáticamente
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notificar éxito de respaldo</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configRespaldo.notificarExito}
                        onChange={(e) => handleConfigChange('notificarExito', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notificar errores de respaldo</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configRespaldo.notificarError}
                        onChange={(e) => handleConfigChange('notificarError', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={guardarConfiguracion}
                className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Guardar Configuración
              </button>
              <button
                onClick={ejecutarRespaldoManual}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Ejecutar Respaldo Manual
              </button>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Destino de Respaldos"
          description="Configura dónde se guardarán tus respaldos"
          icon="💾"
          variant="default"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleConfigChange('destino', 'local')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  configRespaldo.destino === 'local'
                    ? 'border-saludvalpa-blue bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">💻</div>
                <p className="font-medium text-gray-900">Local</p>
                <p className="text-sm text-gray-600">En este dispositivo</p>
                <p className="text-xs text-gray-500 mt-2">Gratuito</p>
              </button>

              <button
                onClick={() => handleConfigChange('destino', 'nube')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  configRespaldo.destino === 'nube'
                    ? 'border-saludvalpa-blue bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">☁️</div>
                <p className="font-medium text-gray-900">Nube</p>
                <p className="text-sm text-gray-600">Google Drive / Dropbox</p>
                <p className="text-xs text-gray-500 mt-2">Requiere conexión</p>
              </button>

              <button
                onClick={() => handleConfigChange('destino', 'ambos')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  configRespaldo.destino === 'ambos'
                    ? 'border-saludvalpa-blue bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">🔄</div>
                <p className="font-medium text-gray-900">Ambos</p>
                <p className="text-sm text-gray-600">Local + Nube</p>
                <p className="text-xs text-gray-500 mt-2">Máxima seguridad</p>
              </button>
            </div>

            {configRespaldo.destino !== 'local' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">⚠️ Configuración de Nube Requerida</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Para respaldos en la nube, necesitas configurar integraciones con servicios de almacenamiento.
                </p>
                <button
                  onClick={() => alert('Redirigiendo a configuración de integraciones...')}
                  className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark text-sm font-medium"
                >
                  Configurar integraciones de nube →
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Historial de Respaldos"
          description="Revisa el historial de respaldos realizados"
          icon="📊"
          variant="default"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historialRespaldos.map((respaldo, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(respaldo.fecha).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {respaldo.tipo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {respaldo.tamaño}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          respaldo.estado === 'éxito'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {respaldo.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Mostrando {historialRespaldos.length} respaldos
              </p>
              <button
                onClick={() => alert('Funcionalidad de exportación de historial disponible próximamente')}
                className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark text-sm font-medium"
              >
                Exportar historial completo →
              </button>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default RespaldosTab;
