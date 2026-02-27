// ============================================================================
// saludvalpa 3.0 - ACTIVAR LICENCIA - REDISEÑO MODERNO
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { activarLicencia } from '../services/licenseService';
import FeatureUnlockModal from '../components/FeatureUnlockModal';

const ActivarLicencia = () => {
  const navigate = useNavigate();
  const { licencia, cargarConfiguracion, configuracion } = useAppStore();
  const [codigo, setCodigo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [showFeatureUnlock, setShowFeatureUnlock] = useState(false);

  const handleActivar = async () => {
    if (!codigo.trim()) {
      setMensaje({ tipo: 'error', texto: 'Por favor ingresa un código de licencia' });
      return;
    }

    setProcesando(true);
    setMensaje(null);

    try {
      const resultado = await activarLicencia(codigo.toUpperCase().trim());
      
      if (resultado.success) {
        setMensaje({ tipo: 'success', texto: resultado.message });
        await cargarConfiguracion();
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } else {
        setMensaje({ tipo: 'error', texto: resultado.message });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al procesar la licencia' });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:ml-64">
      {/* Modal de características premium */}
      <FeatureUnlockModal
        isOpen={showFeatureUnlock}
        onClose={() => setShowFeatureUnlock(false)}
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Header limpio */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Desbloquea SaludValpa PRO
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Accede a todas las herramientas profesionales para {configuracion?.profesion === 'fisioterapia' ? 'fisioterapeutas' :
              configuracion?.profesion === 'psicologia' ? 'psicólogos' :
              configuracion?.profesion === 'medicina_general' ? 'médicos' :
              configuracion?.profesion === 'odontologia' ? 'odontólogos' :
              configuracion?.profesion === 'nutricion' ? 'nutriólogos' : 'profesionales de la salud'}
          </p>
        </div>

        {/* Tarjeta principal de licencia */}
        <div className="bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="text-lg">🏆</span>
                  <span>Recomendado</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  Licencia Anual Completa
                </h2>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-white">$999</span>
                  <span className="text-white/80 text-lg">MXN</span>
                  <span className="ml-4 px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                    IVA incluido
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Pacientes ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Marca blanca personalizable</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Herramientas especializadas para tu profesión</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Soporte prioritario 24/7</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Backup en la nube automático</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="text-xl">✓</span>
                    <span>Actualizaciones incluidas por 1 año</span>
                  </li>
                </ul>
                
                <div className="space-y-4">
                  <a
                    href="https://mpago.la/1siypQK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-saludvalpa-blue px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors text-center font-bold text-lg shadow-lg"
                  >
                    Obtener Licencia
                  </a>
                  
                  <p className="text-white/80 text-center text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span>🔒</span>
                      Pago seguro con Mercado Pago
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎁</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">¿Tienes un código promocional?</h3>
                      <p className="text-white/80 text-sm">Contacta a soporte antes de realizar el pago</p>
                    </div>
                  </div>
                  
                  <a
                    href="mailto:contacto@saludvalpa.app?subject=Código promocional SaludValpa"
                    className="block w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                  >
                    Contactar Soporte
                  </a>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/70 text-xs text-center">
                      También disponible por WhatsApp:
                    </p>
                    <a
                      href="https://wa.me/5215512769504"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-white text-sm text-center hover:underline"
                    >
                      +52 55 1276 9504
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de código existente */}
        {licencia?.tipo === 'gratuita' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Ya tienes un código de licencia?
              </h3>
              <p className="text-gray-600">
                Ingresa tu código para activar SaludValpa PRO inmediatamente
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de licencia
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="saludvalpa-XXXXX-XXXXX-XXXXX"
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent font-mono text-center text-lg shadow-sm"
                    maxLength={30}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Formato: saludvalpa-XXXXX-XXXXX-XXXXX o BETA-PRO-YYYY-XXXXX
                  </p>
                </div>

                {mensaje && (
                  <div className={`p-4 rounded-xl ${
                    mensaje.tipo === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {mensaje.tipo === 'success' ? '✅' : '❌'}
                      </span>
                      <p className="text-sm font-medium">{mensaje.texto}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleActivar}
                  disabled={procesando}
                  className="w-full bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-md"
                >
                  {procesando ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Activando...
                    </span>
                  ) : 'Validar Código'}
                </button>
              </div>
            </div>
            
            {/* Estado actual */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Tu estado actual</h4>
              {licencia?.tipo === 'gratuita' ? (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-800 font-bold text-lg">📦 Versión gratuita</p>
                      <p className="text-orange-700 mt-1">
                        ⏰ {licencia.diasRestantes || 0} días restantes • 
                        👥 Máximo {licencia.limitePacientes} pacientes
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFeatureUnlock(true)}
                      className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ver características
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-bold text-lg">✅ Licencia activa</p>
                      <p className="text-green-700 mt-1">
                        📅 Válida hasta: {licencia?.fechaExpiracion?.toLocaleDateString('es-ES')} • 
                        👥 Pacientes ilimitados
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                      🎨 Marca blanca activa
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer informativo minimalista */}
        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>
            SaludValpa PRO • Sistema de gestión profesional para {configuracion?.profesion === 'fisioterapia' ? 'fisioterapeutas' :
              configuracion?.profesion === 'psicologia' ? 'psicólogos' :
              configuracion?.profesion === 'medicina_general' ? 'médicos' :
              configuracion?.profesion === 'odontologia' ? 'odontólogos' :
              configuracion?.profesion === 'nutricion' ? 'nutriólogos' : 'profesionales de la salud'}
          </p>
          <p className="flex items-center justify-center gap-4">
            <a href="mailto:contacto@saludvalpa.app" className="hover:text-saludvalpa-blue hover:underline">
              contacto@saludvalpa.app
            </a>
            <span>•</span>
            <a href="https://saludvalpa.app" target="_blank" rel="noopener noreferrer" className="hover:text-saludvalpa-blue hover:underline">
              saludvalpa.app
            </a>
            <span>•</span>
            <span>© {new Date().getFullYear()} SaludValpa</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivarLicencia;
