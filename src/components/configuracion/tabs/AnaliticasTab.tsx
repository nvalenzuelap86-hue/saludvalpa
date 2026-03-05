// ============================================================================
// saludvalpa 3.0 - ANALÍTICAS TAB (Fase 3)
// Componente para la pestaña de configuración de analíticas y reportes
// ============================================================================

import React, { useState, useEffect } from 'react';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

interface ConfiguracionAnaliticas {
  metricasActivas: string[];
  frecuenciaReportes: 'diario' | 'semanal' | 'mensual' | 'trimestral';
  horaReporte: string;
  formatoExportacion: 'pdf' | 'excel' | 'csv' | 'json';
  dashboardPersonalizado: boolean;
  alertasMetricas: boolean;
  umbralAlertas: Record<string, number>;
  compartirReportes: boolean;
  destinatariosReportes: string[];
}

const AnaliticasTab: React.FC = () => {
  const [configAnaliticas, setConfigAnaliticas] = useState<ConfiguracionAnaliticas>({
    metricasActivas: ['pacientes', 'citas', 'ingresos', 'documentos'],
    frecuenciaReportes: 'semanal',
    horaReporte: '08:00',
    formatoExportacion: 'pdf',
    dashboardPersonalizado: false,
    alertasMetricas: true,
    umbralAlertas: {
      pacientes_nuevos: 10,
      citas_canceladas: 5,
      ingresos_mensuales: 10000
    },
    compartirReportes: false,
    destinatariosReportes: []
  });
  const [metricasDisponibles] = useState([
    { id: 'pacientes', label: 'Pacientes', desc: 'Nuevos pacientes, retención' },
    { id: 'citas', label: 'Citas', desc: 'Programadas, completadas, canceladas' },
    { id: 'ingresos', label: 'Ingresos', desc: 'Ventas, pagos, facturación' },
    { id: 'documentos', label: 'Documentos', desc: 'Generados, tipos, tamaño' },
    { id: 'sesiones', label: 'Sesiones', desc: 'Duración, frecuencia, notas' },
    { id: 'productividad', label: 'Productividad', desc: 'Tiempo por tarea, eficiencia' },
  ]);
  const [datosMetricas] = useState({
    pacientes_nuevos: { actual: 15, objetivo: 20, tendencia: '↑' },
    citas_completadas: { actual: 87, objetivo: 90, tendencia: '→' },
    ingresos_mensuales: { actual: 12500, objetivo: 15000, tendencia: '↑' },
    documentos_generados: { actual: 42, objetivo: 50, tendencia: '↓' },
  });

  useEffect(() => {
    // Cargar configuración de analíticas desde localStorage
    const configGuardada = localStorage.getItem('configuracion_analiticas');
    if (configGuardada) {
      try {
        setConfigAnaliticas(JSON.parse(configGuardada));
      } catch (error) {
        console.error('Error al cargar configuración de analíticas:', error);
      }
    }
  }, []);

  const guardarConfiguracion = () => {
    localStorage.setItem('configuracion_analiticas', JSON.stringify(configAnaliticas));
    alert('Configuración de analíticas guardada exitosamente');
  };

  const handleConfigChange = (field: keyof ConfiguracionAnaliticas, value: any) => {
    setConfigAnaliticas(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleMetrica = (metricaId: string) => {
    const nuevasMetricas = configAnaliticas.metricasActivas.includes(metricaId)
      ? configAnaliticas.metricasActivas.filter(id => id !== metricaId)
      : [...configAnaliticas.metricasActivas, metricaId];
    
    handleConfigChange('metricasActivas', nuevasMetricas);
  };

  const generarReporteInmediato = () => {
    alert(`Generando reporte ${configAnaliticas.formatoExportacion.toUpperCase()}... El reporte estará disponible en unos momentos.`);
  };

  const programarExportacion = () => {
    alert(`Exportación programada para ${configAnaliticas.frecuenciaReportes} a las ${configAnaliticas.horaReporte}`);
  };

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Métricas y Dashboard"
          description="Configura qué métricas monitorear y personaliza tu dashboard"
          icon="📊"
          variant="info"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Métricas Activas</h4>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona las métricas que quieres monitorear en tu dashboard
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {metricasDisponibles.map((metrica) => (
                  <div
                    key={metrica.id}
                    onClick={() => toggleMetrica(metrica.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      configAnaliticas.metricasActivas.includes(metrica.id)
                        ? 'border-saludvalpa-blue bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{metrica.label}</p>
                        <p className="text-sm text-gray-600">{metrica.desc}</p>
                      </div>
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                        configAnaliticas.metricasActivas.includes(metrica.id)
                          ? 'border-saludvalpa-blue bg-saludvalpa-blue'
                          : 'border-gray-300'
                      }`}>
                        {configAnaliticas.metricasActivas.includes(metrica.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Vista Previa de Métricas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(datosMetricas).map(([key, data]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{data.actual}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        data.actual >= data.objetivo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {data.tendencia} {((data.actual / data.objetivo) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Objetivo: {data.objetivo}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-saludvalpa-blue h-2 rounded-full" 
                        style={{ width: `${Math.min((data.actual / data.objetivo) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dashboard Personalizado</p>
                <p className="text-sm text-gray-600">
                  Reorganiza widgets y crea vistas personalizadas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configAnaliticas.dashboardPersonalizado}
                  onChange={(e) => handleConfigChange('dashboardPersonalizado', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
              </label>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Reportes y Exportación"
          description="Configura reportes automáticos y exportación de datos"
          icon="📈"
          variant="default"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Programación de Reportes</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia
                    </label>
                    <select
                      value={configAnaliticas.frecuenciaReportes}
                      onChange={(e) => handleConfigChange('frecuenciaReportes', e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                      <option value="trimestral">Trimestral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Envío
                    </label>
                    <input
                      type="time"
                      value={configAnaliticas.horaReporte}
                      onChange={(e) => handleConfigChange('horaReporte', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Exportación
                  </label>
                  <div className="flex space-x-3">
                    {['pdf', 'excel', 'csv', 'json'].map((formato) => (
                      <button
                        key={formato}
                        onClick={() => handleConfigChange('formatoExportacion', formato as any)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          configAnaliticas.formatoExportacion === formato
                            ? 'border-saludvalpa-blue bg-blue-50 text-saludvalpa-blue'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {formato.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Alertas de Métricas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Activar alertas de métricas</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configAnaliticas.alertasMetricas}
                      onChange={(e) => handleConfigChange('alertasMetricas', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                {configAnaliticas.alertasMetricas && (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-medium text-yellow-900 mb-2">Umbrales de Alerta</h5>
                      {Object.entries(configAnaliticas.umbralAlertas).map(([metrica, valor]) => (
                        <div key={metrica} className="flex items-center justify-between mb-2 last:mb-0">
                          <span className="text-sm text-yellow-800 capitalize">
                            {metrica.replace('_', ' ')}
                          </span>
                          <input
                            type="number"
                            value={valor}
                            onChange={(e) => {
                              const nuevosUmbrales = {
                                ...configAnaliticas.umbralAlertas,
                                [metrica]: parseInt(e.target.value)
                              };
                              handleConfigChange('umbralAlertas', nuevosUmbrales);
                            }}
                            className="w-24 px-3 py-1 border border-yellow-300 rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={generarReporteInmediato}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Generar Reporte Ahora
              </button>
              <button
                onClick={programarExportacion}
                className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Programar Exportación
              </button>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Analíticas Avanzadas (Enterprise)"
          description="Funcionalidades avanzadas de analíticas para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Compartir Reportes</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <div>
                    <p className="font-medium text-indigo-900">Compartir reportes automáticamente</p>
                    <p className="text-sm text-indigo-700">
                      Enviar reportes a otros miembros del equipo o clientes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configAnaliticas.compartirReportes}
                      onChange={(e) => handleConfigChange('compartirReportes', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {configAnaliticas.compartirReportes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destinatarios de Reportes
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium">
                          Agregar
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                          <span className="text-sm">admin@clinica.com</span>
                          <button className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                          <span className="text-sm">gerencia@clinica.com</span>
                          <button className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">API de Analíticas</h4>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-700 mb-3">
                  Accede a tus datos de analíticas mediante nuestra API REST para integrar con otras herramientas.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-indigo-900">Clave API</p>
                    <p className="text-xs text-indigo-600">••••••••••••••••••••••••••••••</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Regenerar Clave
                  </button>
                </div>
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
          Guardar Configuración de Analíticas
        </button>
      </div>
    </div>
  );
};

export default AnaliticasTab;