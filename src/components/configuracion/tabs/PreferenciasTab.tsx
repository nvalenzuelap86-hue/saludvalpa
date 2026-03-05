// ============================================================================
// saludvalpa 3.0 - PREFERENCIAS TAB
// Componente para la pestaña de preferencias del sistema
// ============================================================================

import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

const PreferenciasTab: React.FC = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();

  const handlePreferenciaChange = (section: string, field: string, value: any) => {
    if (!configuracion) return;
    
    actualizarConfiguracion({
      preferencias: {
        ...configuracion.preferencias,
        [section]: {
          ...(configuracion.preferencias?.[section as keyof typeof configuracion.preferencias] || {}),
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Formato y Localización"
          description="Configura formatos de fecha, moneda y zona horaria"
          icon="📅"
          variant="info"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato de Fecha
              </label>
              <select
                value={configuracion?.preferencias?.formatoFecha || 'DD/MM/YYYY'}
                onChange={(e) => handlePreferenciaChange('formatoFecha', 'formatoFecha', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
                <option value="DD MMM YYYY">DD MMM YYYY (31 Dic 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona Horaria
              </label>
              <select
                value={configuracion?.preferencias?.zonaHoraria || 'America/Mexico_City'}
                onChange={(e) => handlePreferenciaChange('zonaHoraria', 'zonaHoraria', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                <option value="America/New_York">Nueva York (UTC-5)</option>
                <option value="America/Los_Angeles">Los Ángeles (UTC-8)</option>
                <option value="Europe/Madrid">Madrid (UTC+1)</option>
                <option value="America/Buenos_Aires">Buenos Aires (UTC-3)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <select
                value={configuracion?.preferencias?.idioma || 'es'}
                onChange={(e) => handlePreferenciaChange('idioma', 'idioma', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Configuración Económica"
          description="Ajustes de moneda, impuestos y formatos de precios"
          icon="💰"
          variant="success"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda Principal
              </label>
              <select
                value={configuracion?.preferencias?.economia?.moneda || 'MXN'}
                onChange={(e) => handlePreferenciaChange('economia', 'moneda', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="MXN">MXN - Peso Mexicano ($)</option>
                <option value="USD">USD - Dólar Americano (US$)</option>
                <option value="COP">COP - Peso Colombiano ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="ARS">ARS - Peso Argentino ($)</option>
                <option value="CLP">CLP - Peso Chileno ($)</option>
                <option value="PEN">PEN - Sol Peruano (S/)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mostrar IVA/Impuestos</p>
                <p className="text-sm text-gray-600">Incluir impuestos en cotizaciones y recibos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion?.preferencias?.economia?.mostrarImpuestos || false}
                  onChange={(e) => handlePreferenciaChange('economia', 'mostrarImpuestos', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
              </label>
            </div>

            {configuracion?.preferencias?.economia?.mostrarImpuestos && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de IVA
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={configuracion?.preferencias?.economia?.iva || 16}
                    onChange={(e) => handlePreferenciaChange('economia', 'iva', parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-900 min-w-[60px]">
                    {configuracion?.preferencias?.economia?.iva || 16}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>Exento</span>
                  <span>8%</span>
                  <span>16%</span>
                  <span>30%</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato de Precios
              </label>
              <select
                value={configuracion?.preferencias?.economia?.formatoPrecio || 'con_decimales'}
                onChange={(e) => handlePreferenciaChange('economia', 'formatoPrecio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="con_decimales">Con decimales ($1,250.50)</option>
                <option value="sin_decimales">Sin decimales ($1,250)</option>
                <option value="separador_miles">Separador de miles ($1.250,50)</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Configuración de Agenda"
          description="Ajustes de vista, horarios y duración de citas"
          icon="📅"
          variant="info"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vista Inicial del Calendario
              </label>
              <select
                value={configuracion?.preferencias?.agenda?.vistaInicial || 'semana'}
                onChange={(e) => handlePreferenciaChange('agenda', 'vistaInicial', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="dia">Vista Día</option>
                <option value="semana">Vista Semana</option>
                <option value="mes">Vista Mes</option>
                <option value="agenda">Vista Agenda (Lista)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={configuracion?.preferencias?.agenda?.horaInicio || '08:00'}
                  onChange={(e) => handlePreferenciaChange('agenda', 'horaInicio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  value={configuracion?.preferencias?.agenda?.horaFin || '20:00'}
                  onChange={(e) => handlePreferenciaChange('agenda', 'horaFin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración Predeterminada de Citas (minutos)
              </label>
              <select
                value={configuracion?.preferencias?.agenda?.duracionCitaDefault || 30}
                onChange={(e) => handlePreferenciaChange('agenda', 'duracionCitaDefault', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
                <option value="90">90 minutos</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mostrar fines de semana</p>
                <p className="text-sm text-gray-600">Incluir sábado y domingo en el calendario</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion?.preferencias?.agenda?.mostrarFinDeSemana || false}
                  onChange={(e) => handlePreferenciaChange('agenda', 'mostrarFinDeSemana', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
              </label>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default PreferenciasTab;