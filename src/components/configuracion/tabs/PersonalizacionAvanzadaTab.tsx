// ============================================================================
// saludvalpa 3.0 - PERSONALIZACION AVANZADA TAB
// Componente para la pestaña de personalización avanzada (temas, colores, branding)
// ============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

const PersonalizacionAvanzadaTab: React.FC = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();
  const [logoPreview, setLogoPreview] = useState<string>(configuracion?.branding.logo || '');

  const handleBrandingChange = (field: string, value: any) => {
    if (!configuracion) return;
    
    actualizarConfiguracion({
      branding: {
        ...configuracion.branding,
        [field]: value
      }
    });
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
    {
      id: 'medico',
      nombre: 'Médico',
      colores: { primario: '#0D9488', secundario: '#14B8A6', acento: '#F97316' }
    },
    {
      id: 'calido',
      nombre: 'Cálido',
      colores: { primario: '#DC2626', secundario: '#F97316', acento: '#FBBF24' }
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

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Logo y Marca"
          description="Personaliza el logo y elementos de marca de tu consultorio"
          icon="🏢"
          variant="info"
        >
          <div className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Consultorio/Clínica
              </label>
              <input
                type="text"
                value={configuracion?.branding.nombreClinica || ''}
                onChange={(e) => handleBrandingChange('nombreClinica', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: Clínica SaludValpa, Centro de Rehabilitación"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aparecerá en el encabezado de los documentos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Profesional
              </label>
              <input
                type="text"
                value={configuracion?.branding.nombreProfesional || ''}
                onChange={(e) => handleBrandingChange('nombreProfesional', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: Dr. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credenciales Profesionales
              </label>
              <input
                type="text"
                value={configuracion?.branding.credenciales || ''}
                onChange={(e) => handleBrandingChange('credenciales', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                placeholder="Ej: Lic. en Fisioterapia, Cédula 1234567"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aparecerá en documentos PDF
              </p>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Temas y Colores"
          description="Personaliza los colores y tema visual de la aplicación"
          icon="🎨"
          variant="success"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temas Preestablecidos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                  <p className="text-xs text-gray-500 mt-1">Botones principales, encabezados</p>
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
                  <p className="text-xs text-gray-500 mt-1">Botones secundarios, bordes</p>
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
                  <p className="text-xs text-gray-500 mt-1">Enlaces, elementos destacados</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Modo Oscuro</p>
                <p className="text-sm text-gray-600">Cambiar automáticamente al modo oscuro según sistema</p>
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
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Configuración Avanzada (Enterprise)"
          description="Funcionalidades avanzadas de personalización para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-indigo-900">White Label</p>
                <p className="text-sm text-indigo-700">Remover todas las referencias a SaludValpa</p>
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
                <p className="font-medium text-indigo-900">Temas por Especialidad</p>
                <p className="text-sm text-indigo-700">Temas preconfigurados para diferentes especialidades médicas</p>
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
              <h4 className="font-medium text-indigo-900 mb-2">🎨 Biblioteca de Temas</h4>
              <p className="text-sm text-indigo-700 mb-3">
                Accede a una biblioteca de temas profesionales diseñados por expertos.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Temas Médicos</p>
                  <p className="text-lg font-bold text-indigo-600">12+</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Temas Personalizados</p>
                  <p className="text-lg font-bold text-green-600">Ilimitados</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default PersonalizacionAvanzadaTab;