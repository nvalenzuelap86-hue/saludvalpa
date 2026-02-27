// ============================================================================
// saludvalpa 3.0 - CLOUD SYNC PANEL (Fase 1: MVP Sincronización Manual)
// Componente de interfaz para sincronización con Google Drive
// ============================================================================

import { useState, useEffect } from 'react';
import Card from './shared/Card';

const CloudSyncPanel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleConnectGoogleDrive = async () => {
    setIsLoading(true);
    setStatusMessage('Conectando con Google Drive...');
    
    // Simular conexión
    setTimeout(() => {
      setIsConnected(true);
      setStatusMessage('✅ Conectado exitosamente (modo demostración)');
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setStatusMessage('✅ Desconectado de Google Drive');
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    setStatusMessage('Creando respaldo en la nube...');
    
    setTimeout(() => {
      setStatusMessage('✅ Respaldo creado exitosamente (modo demostración)');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">☁️ Sincronización en la Nube</h2>
        <p className="text-gray-600 mt-2">
          Respalda y restaura tus datos en Google Drive. Mantén el control total de tus datos.
        </p>
      </div>

      {/* Estado de conexión */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Estado de Conexión</h3>
            <p className="text-sm text-gray-600">
              {isConnected 
                ? 'Conectado a Google Drive' 
                : 'No conectado a Google Drive'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isConnected ? '✅ Conectado' : '❌ Desconectado'}
          </div>
        </div>

        {/* Mensaje de estado */}
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${statusMessage.includes('✅') ? 'bg-green-50 text-green-800' : statusMessage.includes('❌') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
            {statusMessage}
          </div>
        )}

        {/* Controles de conexión */}
        <div className="flex flex-wrap gap-3">
          {!isConnected ? (
            <button
              onClick={handleConnectGoogleDrive}
              disabled={isLoading}
              className="bg-saludvalpa-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Conectar con Google Drive</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleCreateBackup}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    <span>Creando respaldo...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Crear Respaldo en la Nube</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🚪</span>
                <span>Desconectar</span>
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Información */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">🔒 Información de Privacidad</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Tus datos, tu control:</strong> Los respaldos se almacenan en TU cuenta de Google Drive, no en servidores de SaludValpa.</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Acceso limitado:</strong> SaludValpa solo accede a archivos que crea (scope drive.file).</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Desconexión en cualquier momento:</strong> Puedes revocar el acceso desde tu cuenta de Google.</span>
          </li>
        </ul>
      </Card>

      {/* Instrucciones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Cómo Usar la Sincronización</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-medium text-gray-900 mb-1">Conectar</h4>
            <p className="text-sm text-gray-600">Conecta tu cuenta de Google Drive para habilitar el respaldo en la nube.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-medium text-gray-900 mb-1">Crear Respaldo</h4>
            <p className="text-sm text-gray-600">Crea respaldos periódicos de tus datos para mantenerlos seguros.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-medium text-gray-900 mb-1">Restaurar</h4>
            <p className="text-sm text-gray-600">Restaura tus datos desde Google Drive cuando lo necesites.</p>
          </div>
        </div>
      </Card>

      {/* Nota de configuración */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-1">⚠️ Configuración Requerida</h4>
        <p className="text-sm text-yellow-800">
          Para usar la sincronización real con Google Drive, necesitas configurar las credenciales de Google Cloud Console.
          Consulta la documentación en <code className="bg-yellow-100 px-1 rounded">docs/configuracion-google-cloud.md</code>.
        </p>
      </div>
    </div>
  );
};

export default CloudSyncPanel;