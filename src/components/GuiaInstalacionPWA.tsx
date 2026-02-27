// ============================================================================
// saludvalpa 3.0 - GUÍA DE INSTALACIÓN PWA
// ============================================================================

import { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';

const GuiaInstalacionPWA = () => {
  const [dispositivoActivo, setDispositivoActivo] = useState<'android' | 'ios' | 'desktop'>('android');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-saludvalpa-blue mb-4">Instala SaludValpa como App</h1>
        <p className="text-gray-600 text-lg">
          Convierte SaludValpa en una aplicación nativa en tu dispositivo para acceso rápido y funcionamiento offline
        </p>
      </div>

      {/* ¿Qué es una PWA? */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10">
        <h2 className="text-2xl font-bold text-saludvalpa-blue mb-4">¿Qué es una PWA (Progressive Web App)?</h2>
        <p className="text-gray-700 mb-4">
          SaludValpa es una <strong>Aplicación Web Progresiva</strong>, lo que significa que puedes instalarla en tu dispositivo 
          como si fuera una aplicación nativa, con todas estas ventajas:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl text-green-500">✅</div>
            <div>
              <h3 className="font-bold text-gray-900">Funciona 100% offline</h3>
              <p className="text-gray-600 text-sm">Accede a todos tus datos sin conexión a internet</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl text-green-500">✅</div>
            <div>
              <h3 className="font-bold text-gray-900">Se actualiza automáticamente</h3>
              <p className="text-gray-600 text-sm">Siempre tendrás la última versión sin hacer nada</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl text-green-500">✅</div>
            <div>
              <h3 className="font-bold text-gray-900">Ocupa muy poco espacio</h3>
              <p className="text-gray-600 text-sm">Menos de 5MB en tu dispositivo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl text-green-500">✅</div>
            <div>
              <h3 className="font-bold text-gray-900">Acceso directo desde pantalla de inicio</h3>
              <p className="text-gray-600 text-sm">Un toque y listo, sin abrir el navegador</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Selector de dispositivo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Selecciona tu dispositivo</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={dispositivoActivo === 'android' ? 'primary' : 'outline'}
            onClick={() => setDispositivoActivo('android')}
            className="min-w-[120px]"
          >
            🤖 Android
          </Button>
          <Button
            variant={dispositivoActivo === 'ios' ? 'primary' : 'outline'}
            onClick={() => setDispositivoActivo('ios')}
            className="min-w-[120px]"
          >
            🍎 iOS (iPhone/iPad)
          </Button>
          <Button
            variant={dispositivoActivo === 'desktop' ? 'primary' : 'outline'}
            onClick={() => setDispositivoActivo('desktop')}
            className="min-w-[120px]"
          >
            💻 Computadora
          </Button>
        </div>
      </div>

      {/* Instrucciones por dispositivo */}
      <div className="space-y-8">
        {/* Android */}
        {dispositivoActivo === 'android' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">🤖</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Instalación en Android (Chrome)</h3>
                <p className="text-gray-600">Pasos para instalar SaludValpa en tu teléfono o tablet Android</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Abre SaludValpa en Chrome</h4>
                  <p className="text-gray-600">Ve a <strong>saludvalpa.app</strong> en tu navegador Chrome</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Espera el aviso de instalación</h4>
                  <p className="text-gray-600">Chrome mostrará automáticamente un mensaje como "Instalar SaludValpa" o "Agregar a pantalla de inicio"</p>
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Consejo:</strong> Si no aparece el aviso, toca el menú de Chrome (tres puntos) y busca "Instalar app" o "Agregar a pantalla de inicio"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Toca "Instalar" o "Agregar"</h4>
                  <p className="text-gray-600">Confirma la instalación cuando te lo solicite</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">¡Listo!</h4>
                  <p className="text-gray-600">Encontrarás el ícono de SaludValpa en tu pantalla de inicio. Tócalo para abrir la aplicación</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">📱 Ventajas en Android:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Notificaciones push (si las activas)</li>
                <li>• Funciona como app nativa</li>
                <li>• Actualizaciones automáticas en segundo plano</li>
                <li>• Acceso rápido desde cualquier lugar</li>
              </ul>
            </div>
          </Card>
        )}

        {/* iOS */}
        {dispositivoActivo === 'ios' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">🍎</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Instalación en iOS (iPhone/iPad)</h3>
                <p className="text-gray-600">Pasos para instalar SaludValpa en tu dispositivo Apple</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Abre SaludValpa en Safari</h4>
                  <p className="text-gray-600">Ve a <strong>saludvalpa.app</strong> en Safari (no uses otros navegadores)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Toca el ícono de compartir</h4>
                  <p className="text-gray-600">Es el cuadrado con una flecha hacia arriba, en la barra inferior de Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Desplázate y selecciona "Agregar a pantalla de inicio"</h4>
                  <p className="text-gray-600">Desliza hacia arriba en el menú de compartir hasta encontrar esta opción</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Personaliza el nombre (opcional) y toca "Agregar"</h4>
                  <p className="text-gray-600">Puedes dejar "SaludValpa" o ponerle otro nombre si prefieres</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">¡Listo!</h4>
                  <p className="text-gray-600">SaludValpa aparecerá como una aplicación en tu pantalla de inicio. Tócala para abrirla</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-bold text-purple-800 mb-2">📱 Notas importantes para iOS:</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• <strong>Solo funciona en Safari</strong>, no en Chrome o Firefox para iOS</li>
                <li>• Necesitas iOS 12.2 o superior</li>
                <li>• La primera vez que abras la app, mantén presionada para "Confiar"</li>
                <li>• Funciona offline como una app nativa</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Desktop */}
        {dispositivoActivo === 'desktop' && (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">💻</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Instalación en Computadora</h3>
                <p className="text-gray-600">Pasos para instalar SaludValpa en Windows, Mac o Linux</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Abre SaludValpa en tu navegador</h4>
                  <p className="text-gray-600">Funciona en Chrome, Edge, Firefox o Safari</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Busca el ícono de instalación</h4>
                  <p className="text-gray-600">
                    En la barra de direcciones, busca:
                    <br />
                    • Chrome/Edge: Un símbolo de "+" o de descarga
                    <br />
                    • Firefox: Una casa con un "+"
                    <br />
                    • Safari: Compartir → "Agregar a escritorio"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Haz clic en "Instalar SaludValpa"</h4>
                  <p className="text-gray-600">Confirma la instalación cuando te lo solicite</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-saludvalpa-blue text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">¡Listo!</h4>
                  <p className="text-gray-600">SaludValpa se abrirá como una aplicación independiente. También tendrás un acceso directo en tu escritorio o menú de aplicaciones</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">💻 Ventajas en computadora:</h4>
              <ul className="space-y-1 text-green-700">
                <li>• Ventana independiente sin barras del navegador</li>
                <li>• Inicio más rápido que una página web</li>
                <li>• Atajos de teclado personalizados</li>
                <li>• Integración con el sistema operativo</li>
                <li>• Funciona offline perfectamente</li>
              </ul>
            </div>
          </Card>
        )}
      </div>

      {/* Solución de problemas */}
      <Card className="p-6 mt-8 border-l-4 border-orange-500">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Solución de Problemas Comunes</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">No aparece el aviso de instalación</h4>
            <p className="text-gray-600">
              • Actualiza tu navegador a la última versión
              <br />
              • Asegúrate de estar en <strong>saludvalpa.app</strong> (no en localhost)
              <br />
              • Intenta desde el menú del navegador (tres puntos → "Instalar app")
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">La aplicación no se instala</h4>
            <p className="text-gray-600">
              • Verifica que tengas suficiente espacio de almacenamiento
              <br />
              • Reinicia tu navegador y vuelve a intentar
              <br />
              • En iOS, asegúrate de usar Safari (no Chrome)
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-2">No funciona offline</h4>
            <p className="text-gray-600">
              • Asegúrate de haber visitado SaludValpa al menos una vez con conexión
              <br />
              • Verifica que el Service Worker esté activo (en Chrome: DevTools → Application → Service Workers)
              <br />
              • Intenta reinstalar la aplicación
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">¿Necesitas ayuda?</h4>
          <p className="text-blue-700">
            Si tienes problemas para instalar SaludValpa, contáctanos en <strong>soporte@saludvalpa.app</strong> o por WhatsApp al <strong>52 5512769504</strong>
          </p>
        </div>
      </Card>

      {/* Llamado a la acción */}
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Disfruta de SaludValpa como app nativa!</h3>
        <p className="text-gray-600 mb-6">
          Una vez instalada, SaludValpa funcionará como una aplicación nativa en tu dispositivo,
          con todas las ventajas de una PWA y manteniendo tu privacidad y datos offline.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/'}
          className="text-lg px-8 py-3"
        >
          Volver a SaludValpa
        </Button>
      </div>
    </div>
  );
};

export default GuiaInstalacionPWA;