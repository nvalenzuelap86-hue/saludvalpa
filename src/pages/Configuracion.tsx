// ============================================================================
// saludvalpa 3.0 - CONFIGURACIÓN
// ============================================================================

import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { descargarRespaldo, importarRespaldoDesdeArchivo, obtenerEstadisticasRespaldo } from '../services/backupService';
import { db } from '../db/database';

const Configuracion = () => {
  const { configuracion, actualizarConfiguracion } = useAppStore();
  const [tabActiva, setTabActiva] = useState<'general' | 'branding' | 'respaldos' | 'instalacion'>('general');
  const [stats, setStats] = useState<any>(null);

  const handleReiniciarOnboarding = async () => {
    const confirmar = confirm(
      '⚠️ ADVERTENCIA: Esto borrará TODOS tus datos (pacientes, sesiones, documentos, configuración) y te llevará al inicio. ¿Estás seguro?'
    );
    
    if (!confirmar) return;
    
    const segundaConfirmacion = confirm(
      '🚨 ÚLTIMA ADVERTENCIA: No hay vuelta atrás. Se perderá TODO. ¿Continuar?'
    );
    
    if (!segundaConfirmacion) return;
    
    try {
      // Borrar toda la base de datos
      await db.delete();
      
      // Recargar la página para empezar de cero
      window.location.href = '/onboarding';
    } catch (error) {
      alert('❌ Error al reiniciar. Intenta borrar manualmente IndexedDB desde DevTools.');
    }
  };

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
        window.location.reload(); // Recargar para reflejar nuevos datos
      } else {
        alert(`❌ ${resultado.message}`);
      }
    } catch (error) {
      alert('❌ Error al importar respaldo');
    }
  };

  const cargarEstadisticas = async () => {
    const estadisticas = await obtenerEstadisticasRespaldo();
    setStats(estadisticas);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración</h1>
        <a
          href="/configuracion-avanzada"
          className="inline-flex items-center gap-2 px-4 py-2 bg-saludvalpa-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm"
        >
          <span>⚙️</span>
          <span>Configuración Avanzada</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setTabActiva('general')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActiva === 'general'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setTabActiva('branding')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActiva === 'branding'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Personalización
          </button>
          <button
            onClick={() => {
              setTabActiva('respaldos');
              cargarEstadisticas();
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActiva === 'respaldos'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Respaldos
          </button>
          <button
            onClick={() => setTabActiva('instalacion')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActiva === 'instalacion'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Instalación
          </button>
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {tabActiva === 'general' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos profesionales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre profesional/clínica
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
                  Teléfono
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
                  placeholder="Ej: +52 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
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
                  placeholder="Ej: contacto@ejemplo.com"
                />
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'branding' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalización de marca</h2>
            {configuracion?.licencia.tipo === 'gratuita' ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <span className="text-4xl block mb-2">🔒</span>
                <h3 className="font-semibold text-orange-900 mb-1">
                  Personalización bloqueada
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  Activa una licencia para personalizar tu logo y marca
                </p>
                <a
                  href="/app/activar-licencia"
                  className="inline-block bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                >
                  Activar licencia
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo personalizado
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato recomendado: PNG con fondo transparente
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pie de página en documentos
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
                    placeholder="Ej: Clínica SaludValpa - Tel: 555-1234"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {tabActiva === 'respaldos' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Respaldos de datos</h2>
            
            {/* Estadísticas */}
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

            {/* Exportar */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Exportar respaldo</h3>
              <p className="text-sm text-gray-600 mb-3">
                Descarga todos tus datos en un archivo JSON. Guárdalo en un lugar seguro.
              </p>
              <button
                onClick={handleExportarRespaldo}
                className="bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <span>💾</span>
                <span>Descargar respaldo</span>
              </button>
            </div>

            {/* Importar */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-2">Importar respaldo</h3>
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

            {/* Zona de peligro */}
            <div className="border-t-2 border-red-200 pt-6 mt-8">
              <h3 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                <span>🚨</span> Zona de peligro
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Esta acción borrará <strong>TODOS</strong> tus datos (pacientes, sesiones, documentos, configuración) y te llevará al inicio del onboarding. <strong>Es irreversible.</strong>
              </p>
              <button
                onClick={handleReiniciarOnboarding}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                <span>🗑️</span>
                <span>Reiniciar desde cero</span>
              </button>
            </div>
          </div>
        )}

        {tabActiva === 'instalacion' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Instalación como App</h2>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Qué es una PWA?</h3>
              <p className="text-sm text-gray-700 mb-3">
                SaludValpa es una <strong>Aplicación Web Progresiva (PWA)</strong>. Esto significa que puedes instalarla en tu dispositivo
                como si fuera una aplicación nativa, con acceso rápido desde tu pantalla de inicio y funcionamiento 100% offline.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Funciona sin internet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Se actualiza automáticamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Ocupa poco espacio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Acceso directo desde pantalla de inicio</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Guía de instalación rápida</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span>🤖</span> Android (Chrome)
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>1. Abre SaludValpa en Chrome</li>
                    <li>2. Toca "Instalar" o "Agregar a pantalla de inicio"</li>
                    <li>3. Confirma la instalación</li>
                    <li>4. ¡Listo! El ícono aparecerá en tu pantalla de inicio</li>
                  </ol>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span>🍎</span> iOS (iPhone/iPad)
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>1. Abre SaludValpa en Safari (no Chrome)</li>
                    <li>2. Toca el ícono de compartir (↑)</li>
                    <li>3. Selecciona "Agregar a pantalla de inicio"</li>
                    <li>4. Personaliza el nombre y toca "Agregar"</li>
                  </ol>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span>💻</span> Computadora
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>1. Abre SaludValpa en Chrome, Edge o Firefox</li>
                    <li>2. Busca el ícono de instalación en la barra de direcciones</li>
                    <li>3. Haz clic en "Instalar SaludValpa"</li>
                    <li>4. Se abrirá como aplicación independiente</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">¿Necesitas ayuda detallada?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Visita nuestra guía completa de instalación con capturas de pantalla y solución de problemas.
              </p>
              <a
                href="/instalacion-pwa"
                className="inline-flex items-center gap-2 bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                <span>📱</span>
                <span>Abrir guía completa de instalación</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;
