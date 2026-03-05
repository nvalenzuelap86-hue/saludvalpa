// ============================================================================
// saludvalpa 3.0 - DOCUMENTOS TAB
// Componente para la pestaña de configuración de documentos PDF
// ============================================================================

import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';

const DocumentosTab: React.FC = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();

  const handleBrandingChange = (field: string, value: any) => {
    if (!configuracion) return;
    
    actualizarConfiguracion({
      branding: {
        ...configuracion.branding,
        [field]: value
      }
    });
  };

  const formatosDocumento = [
    { id: 'formal', label: 'Formal', description: 'Estilo profesional clásico' },
    { id: 'moderno', label: 'Moderno', description: 'Diseño contemporáneo' },
    { id: 'informal', label: 'Informal', description: 'Estilo amigable' },
  ];

  return (
    <div className="space-y-6">
      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Formato de Documentos"
          description="Personaliza el diseño y formato de tus documentos PDF"
          icon="📄"
          variant="info"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Estilo de Documentos</h4>
              <div className="space-y-3">
                {formatosDocumento.map((formato) => (
                  <div key={formato.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{formato.label}</p>
                      <p className="text-sm text-gray-600">{formato.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="formatoDocumentos"
                        checked={configuracion?.branding.formatoDocumentos === formato.id}
                        onChange={() => handleBrandingChange('formatoDocumentos', formato.id)}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-saludvalpa-blue peer-checked:bg-saludvalpa-blue flex items-center justify-center">
                        {configuracion?.branding.formatoDocumentos === formato.id && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Afecta el diseño de todos los PDFs generados
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Encabezados y Pie de Página</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pie de Página en Documentos
                  </label>
                  <input
                    type="text"
                    value={configuracion?.branding.piePagina || ''}
                    onChange={(e) => handleBrandingChange('piePagina', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Clínica SaludValpa - Tel: 555-1234 - www.clinicavalpa.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aparecerá en el pie de todos los documentos PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="free">
        <SectionCard
          title="Marcas de Agua"
          description="Configura las marcas de agua en tus documentos"
          icon="💧"
          variant="warning"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mostrar Marca de Agua</p>
                <p className="text-sm text-gray-600">
                  {configuracion?.licencia.tipo === 'gratuita' 
                    ? 'Siempre visible en versión gratuita'
                    : 'Mostrar "Creado con SaludValpa" en documentos'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracion?.branding.mostrarMarcaDeAgua || configuracion?.licencia.tipo === 'gratuita'}
                  disabled={configuracion?.licencia.tipo === 'gratuita'}
                  onChange={(e) => {
                    if (configuracion && configuracion.licencia.tipo !== 'gratuita') {
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
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saludvalpa-blue-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saludvalpa-blue ${configuracion?.licencia.tipo === 'gratuita' ? 'opacity-50' : ''}`}></div>
              </label>
            </div>

            {configuracion?.licencia.tipo === 'gratuita' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  🔒 <strong>Activa una licencia pagada</strong> para remover la marca de agua de tus documentos
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Plantillas Avanzadas"
          description="Configura plantillas personalizadas para diferentes tipos de documentos"
          icon="🎨"
          variant="success"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Plantillas Personalizadas</h4>
              <p className="text-sm text-blue-700 mb-3">
                Con una licencia pagada, puedes crear y guardar plantillas personalizadas para:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Historias clínicas especializadas</li>
                <li>• Consentimientos informados</li>
                <li>• Recibos y facturas</li>
                <li>• Planes de tratamiento</li>
                <li>• Informes de progreso</li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Exportar Plantillas</p>
                <p className="text-sm text-gray-600">Exportar tus plantillas personalizadas para respaldo</p>
              </div>
              <button
                onClick={() => alert('Funcionalidad de exportación de plantillas disponible próximamente')}
                className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Exportar
              </button>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="paid">
        <SectionCard
          title="Gestión de Plantillas Personalizadas"
          description="Crea y gestiona plantillas personalizadas para diferentes tipos de documentos"
          icon="📋"
          variant="default"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Plantillas Disponibles</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Historia Clínica Básica</p>
                    <p className="text-sm text-gray-600">Plantilla estándar para historias clínicas</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Consentimiento Informado</p>
                    <p className="text-sm text-gray-600">Plantilla para consentimientos médicos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Recibo Profesional</p>
                    <p className="text-sm text-gray-600">Plantilla para recibos y facturas</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Crear Nueva Plantilla</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Plantilla
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Plan de Tratamiento Personalizado"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent">
                    <option value="">Seleccionar tipo</option>
                    <option value="historia_clinica">Historia Clínica</option>
                    <option value="consentimiento">Consentimiento Informado</option>
                    <option value="recibo">Recibo/Factura</option>
                    <option value="plan_tratamiento">Plan de Tratamiento</option>
                    <option value="informe_progreso">Informe de Progreso</option>
                    <option value="nota_evolucion">Nota de Evolución</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    rows={3}
                    placeholder="Describe el propósito de esta plantilla..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium">
                    Crear Plantilla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>

      <LicenseGate requiredLevel="enterprise">
        <SectionCard
          title="Configuración Avanzada (Enterprise)"
          description="Funcionalidades avanzadas de documentos para equipos"
          icon="🚀"
          variant="enterprise"
          badge="ENTERPRISE"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="font-medium text-indigo-900">Procesamiento por Lotes</p>
                <p className="text-sm text-indigo-700">Generar múltiples documentos simultáneamente</p>
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
              <h4 className="font-medium text-indigo-900 mb-2">📊 Analytics de Documentos</h4>
              <p className="text-sm text-indigo-700 mb-3">
                Monitorea el uso de tus documentos: tipos más generados, frecuencia y tamaño.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Documentos Generados</p>
                  <p className="text-2xl font-bold text-indigo-600">1,247</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Espacio Usado</p>
                  <p className="text-2xl font-bold text-green-600">45 MB</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🔄 Flujos de Aprobación</h4>
              <p className="text-sm text-green-700 mb-3">
                Configura flujos de aprobación para documentos importantes
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Revisión de Historias Clínicas</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {}}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Aprobación de Consentimientos</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {}}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </LicenseGate>
    </div>
  );
};

export default DocumentosTab;