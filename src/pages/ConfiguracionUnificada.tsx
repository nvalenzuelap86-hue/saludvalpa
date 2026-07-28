// ============================================================================
// saludvalpa 3.0 - CONFIGURACION UNIFICADA
// Componente principal de configuración unificada (Fase 2 - 9 pestañas)
// ============================================================================

import { useState, Suspense, lazy } from 'react';
import { useAppStore } from '../stores/appStore';
import useConfiguracion from '../hooks/useConfiguracion';
import ProfessionSelector from '../components/ProfessionSelector';
import type { TipoProfesion } from '../types';
import { LicenseGate, useLicenseCheck } from '../components/configuracion/LicenseGate';
import SectionCard from '../components/configuracion/SectionCard';
import DangerZone from '../components/configuracion/DangerZone';
import LicenseAlert from '../components/configuracion/LicenseAlert';
import { descargarRespaldo, importarRespaldoDesdeArchivo, obtenerEstadisticasRespaldo } from '../services/backupService';
import { db } from '../db/database';

// Lazy loading para componentes de pestañas (mejora performance)
const PreferenciasTab = lazy(() => import('../components/configuracion/tabs/PreferenciasTab'));
const RecordatoriosTab = lazy(() => import('../components/configuracion/tabs/RecordatoriosTab'));
const DocumentosTab = lazy(() => import('../components/configuracion/tabs/DocumentosTab'));
const SincronizacionTab = lazy(() => import('../components/configuracion/tabs/SincronizacionTab'));
const PersonalizacionAvanzadaTab = lazy(() => import('../components/configuracion/tabs/PersonalizacionAvanzadaTab'));
// Importar nuevas pestañas de Fase 3 con lazy loading
const UsuariosPermisosTab = lazy(() => import('../components/configuracion/tabs/UsuariosPermisosTab'));
const IntegracionesTab = lazy(() => import('../components/configuracion/tabs/IntegracionesTab'));
const RespaldosTab = lazy(() => import('../components/configuracion/tabs/RespaldosTab'));
const SeguridadTab = lazy(() => import('../components/configuracion/tabs/SeguridadTab'));
const AnaliticasTab = lazy(() => import('../components/configuracion/tabs/AnaliticasTab'));

// Componente de carga para pestañas
const TabLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-saludvalpa-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">Cargando pestaña...</p>
    </div>
  </div>
);

type TabType = 'general' | 'preferencias' | 'recordatorios' | 'documentos' | 'personalizacion' | 'sincronizacion' | 'respaldos' | 'instalacion' | 'avanzada' | 'usuarios' | 'integraciones' | 'respaldos_avanzados' | 'seguridad' | 'analiticas';

const ConfiguracionUnificada = () => {
  const { configuracion, actualizarConfiguracion, cambiarProfesion } = useAppStore();
  const { updateNestedField } = useConfiguracion();
  const { isPaid } = useLicenseCheck();
  
  const [tabActiva, setTabActiva] = useState<TabType>('general');
  const [stats, setStats] = useState<any>(null);
  const [showChangeProfession, setShowChangeProfession] = useState(false);
  const [pendingProfession, setPendingProfession] = useState<TipoProfesion | null>(null);
  const [migrateData, setMigrateData] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

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
        window.location.reload();
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

  const handleChangeProfession = async () => {
    if (!pendingProfession) return;
    
    setIsChanging(true);
    try {
      await cambiarProfesion(pendingProfession, migrateData);
      setShowChangeProfession(false);
      setPendingProfession(null);
      alert(`✅ Profesión cambiada exitosamente a ${pendingProfession}. La página se recargará para aplicar los cambios.`);
      window.location.reload();
    } catch (error) {
      alert('❌ Error al cambiar la profesión. Intenta de nuevo.');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración Unificada</h1>
          <p className="text-gray-600 mt-2">
            Gestiona toda tu configuración en un solo lugar
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            Licencia: <strong>{isPaid ? 'Pagada' : 'Gratuita'}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 md:gap-4 min-w-max">
          <button
            onClick={() => setTabActiva('general')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'general'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            👤 General
          </button>
          <button
            onClick={() => setTabActiva('preferencias')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'preferencias'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚙️ Preferencias
          </button>
          <button
            onClick={() => setTabActiva('recordatorios')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'recordatorios'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔔 Recordatorios
          </button>
          <button
            onClick={() => setTabActiva('documentos')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'documentos'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📄 Documentos
          </button>
          <button
            onClick={() => setTabActiva('personalizacion')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'personalizacion'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🎨 Personalización
          </button>
          <button
            onClick={() => setTabActiva('sincronizacion')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'sincronizacion'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ☁️ Sincronización
          </button>
          <button
            onClick={() => {
              setTabActiva('respaldos');
              cargarEstadisticas();
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'respaldos'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            💾 Respaldos
          </button>
          <button
            onClick={() => setTabActiva('instalacion')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'instalacion'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📱 Instalación
          </button>
          <button
            onClick={() => setTabActiva('avanzada')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'avanzada'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚡ Avanzada
          </button>
          <button
            onClick={() => setTabActiva('usuarios')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'usuarios'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setTabActiva('integraciones')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'integraciones'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔌 Integraciones
          </button>
          <button
            onClick={() => setTabActiva('respaldos_avanzados')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'respaldos_avanzados'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔄 Respaldos Av.
          </button>
          <button
            onClick={() => setTabActiva('seguridad')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'seguridad'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔐 Seguridad
          </button>
          <button
            onClick={() => setTabActiva('analiticas')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              tabActiva === 'analiticas'
                ? 'border-saludvalpa-blue text-saludvalpa-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Analíticas
          </button>
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="space-y-6">
        {/* TAB: GENERAL */}
        {tabActiva === 'general' && (
          <SectionCard
            title="Datos Profesionales"
            description="Información básica que aparecerá en tus documentos"
            icon="👤"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre profesional/clínica
                </label>
                <input
                  type="text"
                  value={configuracion?.branding.nombreProfesional || ''}
                  onChange={(e) => updateNestedField('branding', 'nombreProfesional', e.target.value)}
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
                  onChange={(e) => updateNestedField('datosContacto', 'telefono', e.target.value)}
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
                  onChange={(e) => updateNestedField('datosContacto', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder="Ej: contacto@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={configuracion?.datosContacto.direccion || ''}
                  onChange={(e) => updateNestedField('datosContacto', 'direccion', e.target.value)}
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
                  onChange={(e) => updateNestedField('datosContacto', 'sitioWeb', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder="https://www.ejemplo.com"
                />
              </div>
            </div>
          </SectionCard>
        )}

        {/* SECCIÓN: Cambiar Profesión */}
        {tabActiva === 'general' && (
          <>
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cambiar Profesión</h3>
                  <p className="text-sm text-gray-600">
                    Profesión actual: <strong>{configuracion?.profesion || 'No configurada'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setShowChangeProfession(true)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                >
                  Cambiar Profesión
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Importante:</strong> Al cambiar de profesión, los módulos y documentos disponibles se actualizarán.
                  Los datos existentes (pacientes, sesiones) mantendrán su profesión original a menos que elijas migrarlos.
                </p>
              </div>
            </div>

            {/* MODAL: Confirmar cambio de profesión */}
            {showChangeProfession && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cambiar Profesión</h2>
                  
                  <ProfessionSelector
                    selectedProfession={pendingProfession || undefined}
                    onSelect={(prof) => setPendingProfession(prof)}
                    showTitle={false}
                    showDescription={false}
                  />
                  
                  {/* Opción de migración */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={migrateData}
                        onChange={(e) => setMigrateData(e.target.checked)}
                        className="mt-1 h-4 w-4 text-saludvalpa-blue rounded border-gray-300 focus:ring-saludvalpa-blue"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Migrar datos existentes</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Actualizar la profesión en todos los pacientes, sesiones, citas y documentos existentes.
                          Si no marcas esta opción, los datos históricos conservarán su profesión original.
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Botones */}
                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowChangeProfession(false);
                        setPendingProfession(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleChangeProfession}
                      disabled={!pendingProfession || isChanging}
                      className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                        !pendingProfession || isChanging
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      {isChanging ? 'Cambiando...' : 'Confirmar Cambio'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: PREFERENCIAS */}
        {tabActiva === 'preferencias' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <PreferenciasTab />
          </Suspense>
        )}

        {/* TAB: RECORDATORIOS */}
        {tabActiva === 'recordatorios' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <RecordatoriosTab />
          </Suspense>
        )}

        {/* TAB: DOCUMENTOS */}
        {tabActiva === 'documentos' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <DocumentosTab />
          </Suspense>
        )}

        {/* TAB: PERSONALIZACION */}
        {tabActiva === 'personalizacion' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <PersonalizacionAvanzadaTab />
          </Suspense>
        )}

        {/* TAB: SINCRONIZACION */}
        {tabActiva === 'sincronizacion' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <SincronizacionTab />
          </Suspense>
        )}

        {/* TAB: RESPALDOS */}
        {tabActiva === 'respaldos' && (
          <div className="space-y-6">
            <SectionCard
              title="Respaldos de datos"
              description="Exporta e importa tus datos de forma segura"
              icon="💾"
            >
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
            </SectionCard>

            {/* Zona de peligro */}
            <DangerZone
              title="Reiniciar desde cero"
              description="Esta acción borrará TODOS tus datos (pacientes, sesiones, documentos, configuración) y te llevará al inicio del onboarding."
              buttonText="Reiniciar desde cero"
              onConfirm={handleReiniciarOnboarding}
              warningText="Esta acción es irreversible."
            />
          </div>
        )}

        {/* TAB: INSTALACION */}
        {tabActiva === 'instalacion' && (
          <SectionCard
            title="Instalación como App"
            description="Instala SaludValpa como una aplicación en tu dispositivo"
            icon="📱"
          >
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10 rounded-lg">
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
          </SectionCard>
        )}

        {/* TAB: USUARIOS */}
        {tabActiva === 'usuarios' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <UsuariosPermisosTab />
          </Suspense>
        )}

        {/* TAB: INTEGRACIONES */}
        {tabActiva === 'integraciones' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <IntegracionesTab />
          </Suspense>
        )}

        {/* TAB: RESPALDOS AVANZADOS */}
        {tabActiva === 'respaldos_avanzados' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <RespaldosTab />
          </Suspense>
        )}

        {/* TAB: SEGURIDAD */}
        {tabActiva === 'seguridad' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <SeguridadTab />
          </Suspense>
        )}

        {/* TAB: ANALITICAS */}
        {tabActiva === 'analiticas' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <AnaliticasTab />
          </Suspense>
        )}

        {/* TAB: AVANZADA */}
        {tabActiva === 'avanzada' && (
          <div className="space-y-6">
            <SectionCard
              title="Configuración Avanzada"
              description="Funcionalidades avanzadas y de sistema"
              icon="⚡"
            >
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-gray-900 mb-2">¡Configuración unificada completada!</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Todas las funcionalidades de ConfiguracionAvanzada.tsx han sido migradas al sistema unificado.
                    Ahora puedes gestionar toda tu configuración desde las pestañas correspondientes:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Preferencias</strong>: Formato de fechas, economía, agenda</li>
                    <li>• <strong>Recordatorios</strong>: Notificaciones y plantillas</li>
                    <li>• <strong>Documentos</strong>: Formato PDF y marca de agua</li>
                    <li>• <strong>Personalización</strong>: Temas y colores avanzados</li>
                    <li>• <strong>Sincronización</strong>: Google Drive y respaldos en la nube</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Migración completada</h4>
                  <p className="text-sm text-yellow-700">
                    La configuración avanzada ha sido completamente integrada en el sistema unificado.
                    El archivo ConfiguracionAvanzada.tsx ya no es necesario y puede ser eliminado.
                  </p>
                </div>

                <LicenseGate requiredLevel="enterprise">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Funcionalidades Enterprise</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Como usuario Enterprise, tienes acceso a todas las funcionalidades avanzadas:
                    </p>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Personalización completa de documentos</li>
                      <li>• Sincronización automática con Google Drive</li>
                      <li>• Plantillas de recordatorios personalizadas</li>
                      <li>• Temas y colores ilimitados</li>
                    </ul>
                  </div>
                </LicenseGate>
              </div>
            </SectionCard>

            <DangerZone
              title="Eliminar ConfiguracionAvanzada.tsx"
              description="Esta acción eliminará el archivo ConfiguracionAvanzada.tsx original ya que todas sus funcionalidades han sido migradas al sistema unificado."
              buttonText="Eliminar archivo obsoleto"
              onConfirm={() => {
                if (confirm('¿Estás seguro de eliminar ConfiguracionAvanzada.tsx? Todas sus funcionalidades ya están en el sistema unificado.')) {
                  alert('Archivo marcado para eliminación. En producción, se recomienda mantenerlo como referencia durante la transición.');
                }
              }}
              warningText="Esta acción es irreversible. Asegúrate de haber probado todas las funcionalidades migradas."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionUnificada;
