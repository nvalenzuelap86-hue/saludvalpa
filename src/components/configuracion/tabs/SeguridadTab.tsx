// ============================================================================
// saludvalpa 3.0 - SEGURIDAD TAB (Fase 3)
// Componente para la pestaña de configuración de seguridad y privacidad
// ============================================================================

import React, { useState, useEffect } from 'react';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

interface ConfiguracionSeguridad {
  autenticacionDosFactores: boolean;
  metodo2FA: 'app' | 'sms' | 'email' | 'none';
  tiempoSesion: number; // minutos
  intentosFallidosMax: number;
  bloqueoTemporal: boolean;
  politicaRetencionDatos: number; // días
  cifradoDatos: boolean;
  registroAuditoria: boolean;
  notificacionesSeguridad: boolean;
  ipPermitidas?: string[];
}

const SeguridadTab: React.FC = () => {
  const [configSeguridad, setConfigSeguridad] = useState<ConfiguracionSeguridad>({
    autenticacionDosFactores: false,
    metodo2FA: 'app',
    tiempoSesion: 60,
    intentosFallidosMax: 5,
    bloqueoTemporal: true,
    politicaRetencionDatos: 365,
    cifradoDatos: true,
    registroAuditoria: true,
    notificacionesSeguridad: true
  });
  const [ipActual, setIpActual] = useState<string>('192.168.1.100');
  const [historialAccesos, setHistorialAccesos] = useState<any[]>([
    { fecha: '2026-03-05T14:30:00', usuario: 'admin', ip: '192.168.1.100', accion: 'login', resultado: 'éxito' },
    { fecha: '2026-03-05T10:15:00', usuario: 'recepcion', ip: '192.168.1.101', accion: 'login', resultado: 'éxito' },
    { fecha: '2026-03-04T18:45:00', usuario: 'admin', ip: '192.168.1.100', accion: 'cambio_config', resultado: 'éxito' },
    { fecha: '2026-03-04T12:20:00', usuario: 'desconocido', ip: '203.0.113.25', accion: 'login', resultado: 'fallido' },
  ]);

  useEffect(() => {
    // Cargar configuración de seguridad desde localStorage
    const configGuardada = localStorage.getItem('configuracion_seguridad');
    if (configGuardada) {
      try {
        setConfigSeguridad(JSON.parse(configGuardada));
      } catch (error) {
        console.error('Error al cargar configuración de seguridad:', error);
      }
    }
  }, []);

  const guardarConfiguracion = () => {
    localStorage.setItem('configuracion_seguridad', JSON.stringify(configSeguridad));
    alert('Configuración de seguridad guardada exitosamente');
  };

  const handleConfigChange = (field: keyof ConfiguracionSeguridad, value: any) => {
    setConfigSeguridad(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const configurar2FA = () => {
    if (configSeguridad.autenticacionDosFactores) {
      alert('Autenticación de dos factores ya está activada. Configurando método: ' + configSeguridad.metodo2FA);
    } else {
      alert('Activando autenticación de dos factores...');
      handleConfigChange('autenticacionDosFactores', true);
    }
  };

  const generarReporteAuditoria = () => {
    alert('Generando reporte de auditoría... El reporte estará disponible en unos momentos.');
  };

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Autenticación y Acceso"
          description="Configura medidas de seguridad para el acceso al sistema"
          icon="🔐"
          variant="info"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Autenticación de Dos Factores (2FA)</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Activar 2FA</p>
                    <p className="text-sm text-gray-600">
                      Requerir un segundo factor de autenticación al iniciar sesión
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configSeguridad.autenticacionDosFactores}
                      onChange={(e) => handleConfigChange('autenticacionDosFactores', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                {configSeguridad.autenticacionDosFactores && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de 2FA
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'app', label: 'App Autenticadora', icon: '📱', desc: 'Google Authenticator, Authy' },
                        { id: 'sms', label: 'SMS', icon: '📲', desc: 'Código por mensaje de texto' },
                        { id: 'email', label: 'Email', icon: '📧', desc: 'Código por correo electrónico' },
                      ].map((metodo) => (
                        <button
                          key={metodo.id}
                          onClick={() => handleConfigChange('metodo2FA', metodo.id as any)}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            configSeguridad.metodo2FA === metodo.id
                              ? 'border-saludvalpa-blue bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{metodo.icon}</div>
                          <p className="font-medium text-gray-900">{metodo.label}</p>
                          <p className="text-xs text-gray-600 mt-1">{metodo.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={configurar2FA}
                        className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                      >
                        Configurar 2FA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configuración de Sesiones</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo de sesión inactiva (minutos)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={configSeguridad.tiempoSesion}
                    onChange={(e) => handleConfigChange('tiempoSesion', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La sesión se cerrará automáticamente después de este tiempo de inactividad
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Bloqueo temporal por intentos fallidos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configSeguridad.bloqueoTemporal}
                        onChange={(e) => handleConfigChange('bloqueoTemporal', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                    </label>
                  </div>

                  {configSeguridad.bloqueoTemporal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intentos fallidos máximos antes de bloqueo
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configSeguridad.intentosFallidosMax}
                        onChange={(e) => handleConfigChange('intentosFallidosMax', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Privacidad y Retención de Datos"
          description="Configura políticas de privacidad y retención de datos"
          icon="🛡️"
          variant="default"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Política de Retención de Datos</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conservar datos de pacientes por (días)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="3650"
                    value={configSeguridad.politicaRetencionDatos}
                    onChange={(e) => handleConfigChange('politicaRetencionDatos', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Los datos más antiguos serán anonimizados automáticamente después de este período
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Cifrado de Datos</p>
                    <p className="text-sm text-gray-600">
                      Cifrar datos sensibles en la base de datos
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configSeguridad.cifradoDatos}
                      onChange={(e) => handleConfigChange('cifradoDatos', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Registro y Auditoría</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Registro de auditoría completo</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configSeguridad.registroAuditoria}
                      onChange={(e) => handleConfigChange('registroAuditoria', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Notificaciones de seguridad</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configSeguridad.notificacionesSeguridad}
                      onChange={(e) => handleConfigChange('notificacionesSeguridad', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    onClick={generarReporteAuditoria}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                  >
                    Generar Reporte de Auditoría
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Genera un reporte detallado de todas las actividades del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Seguridad Avanzada (Enterprise)"
          description="Funcionalidades avanzadas de seguridad para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Control de Acceso por IP</h4>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm text-indigo-700 mb-2">
                    Tu IP actual: <span className="font-medium">{ipActual}</span>
                  </p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Ej: 192.168.1.0/24"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium">
                      Agregar IP
                    </button>
                  </div>
                  <p className="text-xs text-indigo-600 mt-2">
                    Solo las IPs en la lista blanca podrán acceder al sistema
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">IPs Permitidas</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                      <span className="text-sm">192.168.1.0/24</span>
                      <button className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                      <span className="text-sm">10.0.0.0/8</span>
                      <button className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Historial de Accesos</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historialAccesos.map((acceso, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(acceso.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {acceso.usuario}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {acceso.ip}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {acceso.accion}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            acceso.resultado === 'éxito'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {acceso.resultado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <div className="flex justify-end">
        <button
          onClick={guardarConfiguracion}
          className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          Guardar Configuración de Seguridad
        </button>
      </div>
    </div>
  );
};

export default SeguridadTab;