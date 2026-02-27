// ============================================================================
// saludvalpa 3.0 - CONFIGURACIÓN AVANZADA (FASE 8)
// ============================================================================

import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { descargarRespaldo, importarRespaldoDesdeArchivo, obtenerEstadisticasRespaldo } from '../services/backupService';
import { Card } from '../components';
import CloudSyncPanel from '../components/CloudSyncPanel';

type Tab = 'general' | 'branding' | 'preferencias' | 'recordatorios' | 'documentos' | 'respaldos' | 'sincronizacion';

const ConfiguracionAvanzada = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();
  const [tabActiva, setTabActiva] = useState<Tab>('general');
  const [stats, setStats] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    if (configuracion?.branding.logo) {
      setLogoPreview(configuracion.branding.logo);
    }
  }, [configuracion]);

  const handleExportarRespaldo = async () => {
    try {
      await descargarRespaldo();
      alert('✅ Respaldo descargado exitosamente');
    } catch (error) {
      alert('❌ Error al crear respaldo');
    }
  };

  const handleImportarRespaldo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmacion = confirm(
      '⚠️ ADVERTENCIA: Importar un respaldo reemplazará TODOS tus datos actuales. ¿Deseas continuar?'
    );

    if (!confirmacion) return;

    try {
      const resultado = await importarRespaldoDesdeArchivo(file);
      if (resultado.success) {
        alert(`✅ ${resultado.message}`);
        window.location.reload();
      } else {
        alert(`❌ ${resultado.message}`);
      }
    } catch (error) {
      alert('❌ Error al importar respaldo');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('❌ El logo no debe superar 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      if (configuracion) {
        actualizarConfiguracion({
          branding: {
            ...configuracion.branding,
            logo: base64,
          }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const cargarEstadisticas = async () => {
    const estadisticas = await obtenerEstadisticasRespaldo();
    setStats(estadisticas);
  };

  const temasPreestablecidos = [
    {
      id: 'saludvalpa',
      nombre: 'SaludValpa Original',
      colores: { primario: '#2C5D7D', secundario: '#5FB4B4', acento: '#9BCB56' }
    },
    {
      id: 'minimalista',
      nombre: 'Minimalista',
      colores: { primario: '#000000', secundario: '#6B7280', acento: '#3B82F6' }
    },
    {
      id: 'profesional',
      nombre: 'Profesional',
      colores: { primario: '#1E3A8A', secundario: '#60A5FA', acento: '#10B981' }
    },
    {
      id: 'moderno',
      nombre: 'Moderno',
      colores: { primario: '#7C3AED', secundario: '#C084FC', acento: '#F59E0B' }
    },
  ];

  const aplicarTema = (tema: typeof temasPreestablecidos[0]) => {
    if (configuracion) {
      actualizarConfiguracion({
        branding: {
          ...configuracion.branding,
          tema: tema.id as any,
          colores: tema.colores,
        }
      });
    }
  };

  const esLicenciaPagada = configuracion?.licencia.tipo === 'pagada';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración Avanzada</h1>
        <p className="text-gray-600 mt-2">
          Personaliza SaludValpa según tus necesidades
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-2 md:gap-4 min-w-max">
          {[
            { id: 'general', label: '👤 General', icon: '' },
            { id: 'branding', label: '🎨 Personalización', icon: '' },
            { id: 'preferencias', label: '⚙️ Preferencias', icon: '' },
            { id: 'recordatorios', label: '🔔 Recordatorios', icon: '' },
            { id: 'documentos', label: '📄 Documentos', icon: '' },
            { id: 'respaldos', label: '💾 Respaldos', icon: '' },
            { id: 'sincronizacion', label: '☁️ Sincronización', icon: '' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTabActiva(tab.id as Tab);
                if (tab.id === 'respaldos') cargarEstadisticas();
              }}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                tabActiva === tab.id
                  ? 'border-saludvalpa-blue text-saludvalpa-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido */}
      <Card className="p-6">
        {/* TAB: GENERAL */}
        {tabActiva === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos Profesionales</h2>
              
              <div className="space-y-4">
                {/* Nombre del Consultorio/Clínica */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del consultorio/clínica
                  </label>
                  <input
                    type="text"
                    value={configuracion?.branding.nombreClinica || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          branding: {
                            ...configuracion.branding,
                            nombreClinica: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Clínica SaludValpa, Centro de Rehabilitación"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparecerá en el encabezado de los documentos
                  </p>
                </div>

                {/* Nombre Profesional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre profesional *
                  </label>
                  <input
                    type="text"
                    value={configuracion?.branding.nombreProfesional || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          branding: {
                            ...configuracion.branding,
                            nombreProfesional: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Dr. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credenciales profesionales
                  </label>
                  <input
                    type="text"
                    value={configuracion?.branding.credenciales || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          branding: {
                            ...configuracion.branding,
                            credenciales: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Lic. en Fisioterapia, Cédula 1234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparecerá en documentos PDF
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    value={configuracion?.branding.especialidad || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          branding: {
                            ...configuracion.branding,
                            especialidad: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Especialista en Rehabilitación Deportiva"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={configuracion?.datosContacto.telefono || ''}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            datosContacto: {
                              ...configuracion.datosContacto,
                              telefono: e.target.value,
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="+52 555 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={configuracion?.datosContacto.email || ''}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            datosContacto: {
                              ...configuracion.datosContacto,
                              email: e.target.value,
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="contacto@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={configuracion?.datosContacto.direccion || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          datosContacto: {
                            ...configuracion.datosContacto,
                            direccion: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Calle, número, colonia, ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sitio web
                  </label>
                  <input
                    type="url"
                    value={configuracion?.datosContacto.sitioWeb || ''}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          datosContacto: {
                            ...configuracion.datosContacto,
                            sitioWeb: e.target.value,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BRANDING */}
        {tabActiva === 'branding' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personalización de Marca</h2>

              {!esLicenciaPagada ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center mb-6">
                  <span className="text-5xl block mb-3">🔒</span>
                  <h3 className="font-semibold text-orange-900 text-lg mb-2">
                    Personalización Bloqueada
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Activa una licencia para personalizar logo, colores y marca
                  </p>
                  <a
                    href="/app/activar-licencia"
                    className="inline-block bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Activar Licencia
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Personalizado
                    </label>
                    
                    {logoPreview && (
                      <div className="mb-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
                        <img 
                          src={logoPreview} 
                          alt="Logo" 
                          className="max-h-24 object-contain"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato recomendado: PNG con fondo transparente (máx. 2MB)
                    </p>
                  </div>

                  {/* Temas preestablecidos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temas Preestablecidos
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {temasPreestablecidos.map((tema) => (
                        <button
                          key={tema.id}
                          onClick={() => aplicarTema(tema)}
                          className={`p-4 border-2 rounded-lg transition-all hover:border-saludvalpa-blue ${
                            configuracion?.branding.tema === tema.id
                              ? 'border-saludvalpa-blue bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            <div 
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: tema.colores.primario }}
                            />
                            <div 
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: tema.colores.secundario }}
                            />
                            <div 
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: tema.colores.acento }}
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{tema.nombre}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colores personalizados */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colores Personalizados
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color Primario</label>
                        <input
                          type="color"
                          value={configuracion?.branding.colores.primario || '#2C5D7D'}
                          onChange={(e) => {
                            if (configuracion) {
                              actualizarConfiguracion({
                                branding: {
                                  ...configuracion.branding,
                                  tema: 'personalizado',
                                  colores: {
                                    ...configuracion.branding.colores,
                                    primario: e.target.value,
                                  }
                                }
                              });
                            }
                          }}
                          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color Secundario</label>
                        <input
                          type="color"
                          value={configuracion?.branding.colores.secundario || '#5FB4B4'}
                          onChange={(e) => {
                            if (configuracion) {
                              actualizarConfiguracion({
                                branding: {
                                  ...configuracion.branding,
                                  tema: 'personalizado',
                                  colores: {
                                    ...configuracion.branding.colores,
                                    secundario: e.target.value,
                                  }
                                }
                              });
                            }
                          }}
                          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color Acento</label>
                        <input
                          type="color"
                          value={configuracion?.branding.colores.acento || '#9BCB56'}
                          onChange={(e) => {
                            if (configuracion) {
                              actualizarConfiguracion({
                                branding: {
                                  ...configuracion.branding,
                                  tema: 'personalizado',
                                  colores: {
                                    ...configuracion.branding.colores,
                                    acento: e.target.value,
                                  }
                                }
                              });
                            }
                          }}
                          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pie de página */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pie de Página en Documentos
                    </label>
                    <input
                      type="text"
                      value={configuracion?.branding.piePagina || ''}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            branding: {
                              ...configuracion.branding,
                              piePagina: e.target.value,
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="Ej: Clínica SaludValpa - Tel: 555-1234 - www.clinicavalpa.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Aparecerá en el pie de todos los documentos PDF
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PREFERENCIAS */}
        {tabActiva === 'preferencias' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferencias Generales</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Fecha
                  </label>
                  <select
                    value={configuracion?.preferencias.formatoFecha || 'DD/MM/YYYY'}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          preferencias: {
                            ...configuracion.preferencias,
                            formatoFecha: e.target.value as any,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda
                  </label>
                  <select
                    value={configuracion?.preferencias?.economia?.moneda || 'MXN'}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          preferencias: {
                            ...configuracion.preferencias,
                            economia: {
                              ...(configuracion.preferencias?.economia || {}),
                              moneda: e.target.value,
                            }
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="USD">USD - Dólar</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mostrar IVA en Economía</p>
                    <p className="text-sm text-gray-600">Incluir IVA en cotizaciones y recibos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion?.preferencias?.economia?.mostrarImpuestos || false}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            preferencias: {
                              ...configuracion.preferencias,
                              economia: {
                                ...configuracion.preferencias?.economia || {},
                                mostrarImpuestos: e.target.checked,
                              }
                            }
                          });
                        }
                      }}
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
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={configuracion?.preferencias?.economia?.iva || 16}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            preferencias: {
                              ...configuracion.preferencias,
                              economia: {
                                ...configuracion.preferencias?.economia || {},
                                iva: parseFloat(e.target.value),
                              }
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agenda</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vista Inicial
                  </label>
                  <select
                    value={configuracion?.preferencias?.agenda?.vistaInicial || 'semana'}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          preferencias: {
                            ...configuracion.preferencias,
                            agenda: {
                              ...configuracion.preferencias?.agenda || {},
                              vistaInicial: e.target.value as any,
                            }
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="dia">Vista Día</option>
                    <option value="semana">Vista Semana</option>
                    <option value="mes">Vista Mes</option>
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
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            preferencias: {
                              ...configuracion.preferencias,
                              agenda: {
                                ...configuracion.preferencias?.agenda || {},
                                horaInicio: e.target.value,
                              }
                            }
                          });
                        }
                      }}
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
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            preferencias: {
                              ...configuracion.preferencias,
                              agenda: {
                                ...configuracion.preferencias?.agenda || {},
                                horaFin: e.target.value,
                              }
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración Predeterminada de Citas (minutos)
                  </label>
                  <select
                    value={configuracion?.preferencias?.agenda?.duracionCitaDefault || 60}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          preferencias: {
                            ...configuracion.preferencias,
                            agenda: {
                              ...configuracion.preferencias?.agenda || {},
                              duracionCitaDefault: parseInt(e.target.value),
                            }
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                    <option value="90">90 minutos</option>
                    <option value="120">120 minutos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECORDATORIOS */}
        {tabActiva === 'recordatorios' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recordatorios y Notificaciones</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Habilitar Recordatorios</p>
                    <p className="text-sm text-gray-600">Recibir notificaciones de citas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion?.preferencias?.recordatorios?.habilitados || false}
                      onChange={(e) => {
                        if (configuracion) {
                          actualizarConfiguracion({
                            preferencias: {
                              ...configuracion.preferencias,
                              recordatorios: {
                                ...configuracion.preferencias?.recordatorios || {},
                                habilitados: e.target.checked,
                              }
                            }
                          });
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                  </label>
                </div>

                {configuracion?.preferencias?.recordatorios?.habilitados && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recordatorio antes de la cita (minutos)
                      </label>
                      <select
                        value={configuracion?.preferencias?.recordatorios?.anticipacionCitas || 60}
                        onChange={(e) => {
                          if (configuracion) {
                            actualizarConfiguracion({
                              preferencias: {
                                ...configuracion.preferencias,
                                recordatorios: {
                                  ...configuracion.preferencias?.recordatorios || {},
                                  anticipacionCitas: parseInt(e.target.value),
                                }
                              }
                            });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      >
                        <option value="15">15 minutos antes</option>
                        <option value="30">30 minutos antes</option>
                        <option value="60">1 hora antes</option>
                        <option value="120">2 horas antes</option>
                        <option value="180">3 horas antes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recordatorio del día anterior (horas antes)
                      </label>
                      <select
                        value={configuracion?.preferencias?.recordatorios?.anticipacionDia || 24}
                        onChange={(e) => {
                          if (configuracion) {
                            actualizarConfiguracion({
                              preferencias: {
                                ...configuracion.preferencias,
                                recordatorios: {
                                  ...configuracion.preferencias?.recordatorios || {},
                                  anticipacionDia: parseInt(e.target.value),
                                }
                              }
                            });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      >
                        <option value="12">12 horas antes</option>
                        <option value="24">24 horas antes (1 día)</option>
                        <option value="48">48 horas antes (2 días)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Sonido de Notificación</p>
                        <p className="text-sm text-gray-600">Reproducir sonido con notificaciones</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracion?.preferencias?.recordatorios?.sonido || false}
                          onChange={(e) => {
                            if (configuracion) {
                              actualizarConfiguracion({
                                preferencias: {
                                  ...configuracion.preferencias,
                                  recordatorios: {
                                    ...configuracion.preferencias?.recordatorios || {},
                                    sonido: e.target.checked,
                                  }
                                }
                              });
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue"></div>
                      </label>
                    </div>
                  </>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Para recibir notificaciones, asegúrate de que tu navegador tenga permisos de notificaciones activados para SaludValpa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DOCUMENTOS */}
        {tabActiva === 'documentos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Documentos PDF</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Documentos
                  </label>
                  <select
                    value={configuracion?.branding.formatoDocumentos || 'formal'}
                    onChange={(e) => {
                      if (configuracion) {
                        actualizarConfiguracion({
                          branding: {
                            ...configuracion.branding,
                            formatoDocumentos: e.target.value as any,
                          }
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="formal">Formal - Estilo profesional clásico</option>
                    <option value="moderno">Moderno - Diseño contemporáneo</option>
                    <option value="informal">Informal - Estilo amigable</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Afecta el diseño de todos los PDFs generados
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Marca de Agua</p>
                    <p className="text-sm text-gray-600">
                      {esLicenciaPagada 
                        ? 'Mostrar "Creado con SaludValpa" en documentos'
                        : 'Siempre visible en versión gratuita'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion?.branding.mostrarMarcaDeAgua || false}
                      disabled={!esLicenciaPagada}
                      onChange={(e) => {
                        if (configuracion && esLicenciaPagada) {
                          actualizarConfiguracion({
                            branding: {
                              ...configuracion.branding,
                              mostrarMarcaDeAgua: e.target.checked,
                            }
                          });
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue ${!esLicenciaPagada ? 'opacity-50' : ''}`}></div>
                  </label>
                </div>

                {!esLicenciaPagada && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      🔒 <strong>Activa una licencia</strong> para remover la marca de agua de tus documentos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: RESPALDOS */}
        {tabActiva === 'respaldos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Respaldos de Datos</h2>
              
              {stats && (
                <div className="mb-6 p-4 bg-saludvalpa-blue-light rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Datos actuales:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {stats.pacientes} pacientes</li>
                    <li>• {stats.sesiones} sesiones registradas</li>
                    <li>• {stats.citas} citas programadas</li>
                    <li>• {stats.documentos} documentos generados</li>
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {/* Exportar */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Exportar Respaldo</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Descarga todos tus datos en un archivo JSON. Guárdalo en un lugar seguro.
                  </p>
                  <button
                    onClick={handleExportarRespaldo}
                    className="bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>💾</span>
                    <span>Descargar Respaldo Completo</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Recomendación: Haz respaldos semanalmente
                  </p>
                </div>

                {/* Importar */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Importar Respaldo</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Restaura tus datos desde un archivo de respaldo anterior.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-800">
                      ⚠️ <strong>Advertencia:</strong> Importar un respaldo reemplazará todos tus datos actuales.
                      Asegúrate de hacer un respaldo antes si tienes datos importantes.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportarRespaldo}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Info adicional */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Información de Seguridad</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Tus datos se guardan solo en tu dispositivo (IndexedDB)</li>
                    <li>• SaludValpa no envía ningún dato a servidores externos</li>
                    <li>• Los respaldos son archivos JSON que puedes abrir y verificar</li>
                    <li>• Guarda los respaldos en múltiples lugares (nube, USB, etc.)</li>
                    <li>• Si cambias de dispositivo, usa el respaldo para migrar tus datos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SINCRONIZACIÓN */}
        {tabActiva === 'sincronizacion' && (
          <div className="space-y-6">
            <CloudSyncPanel />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConfiguracionAvanzada;
