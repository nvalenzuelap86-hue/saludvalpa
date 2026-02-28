// ============================================================================
// saludvalpa 3.0 - LICENSE ALERT COMPONENT
// Componente para mostrar alertas sobre el estado de la licencia
// ============================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { obtenerEstadoLicencia } from '../services/licenseService';
import { TipoLicencia, EstadoLicencia } from '../types';

interface LicenseAlertProps {
  /**
   * Nivel de alerta a mostrar:
   * - 'all': Todas las alertas (expiración, límites, etc.)
   * - 'critical': Solo alertas críticas (licencia expirada)
   * - 'warning': Solo advertencias (licencia por expirar, límites cercanos)
   */
  level?: 'all' | 'critical' | 'warning';
  
  /**
   * Si es true, el componente se auto-oculta después de cierto tiempo
   */
  autoDismiss?: boolean;
  
  /**
   * Tiempo en milisegundos antes de auto-ocultarse (solo si autoDismiss=true)
   */
  dismissTime?: number;
  
  /**
   * Callback cuando el usuario cierra la alerta manualmente
   */
  onDismiss?: () => void;
}

const LicenseAlert = ({
  level = 'all',
  autoDismiss = false,
  dismissTime = 10000,
  onDismiss
}: LicenseAlertProps) => {
  const { licencia, configuracion } = useAppStore();
  const [alertState, setAlertState] = useState<'hidden' | 'visible' | 'dismissed'>('hidden');
  const [alertType, setAlertType] = useState<'critical' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  // Calcular días restantes
  const calcularDiasRestantes = () => {
    if (!licencia?.fechaExpiracion) return 0;
    const ahora = new Date();
    const expiracion = new Date(licencia.fechaExpiracion);
    const diferencia = expiracion.getTime() - ahora.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  // Evaluar estado de la licencia y determinar alertas
  useEffect(() => {
    const evaluarAlerta = async () => {
      if (!licencia) return;

      const diasRestantes = calcularDiasRestantes();
      setDaysRemaining(diasRestantes);

      // Licencia expirada (CRÍTICO)
      if (licencia.estado === EstadoLicencia.EXPIRADA || diasRestantes <= 0) {
        setAlertType('critical');
        setAlertMessage('Tu licencia ha expirado. Activa una nueva licencia para continuar usando todas las funciones.');
        setAlertState('visible');
        return;
      }

      // Licencia por expirar en menos de 7 días (ADVERTENCIA)
      if (diasRestantes <= 7 && licencia.estado === EstadoLicencia.ACTIVA) {
        if (level === 'all' || level === 'warning') {
          setAlertType('warning');
          setAlertMessage(`Tu licencia expira en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}. Renueva ahora para evitar interrupciones.`);
          setAlertState('visible');
          return;
        }
      }

      // Límite de pacientes alcanzado en versión gratuita (ADVERTENCIA)
      if (licencia.tipo === TipoLicencia.GRATUITA && licencia.limitePacientes) {
        // Necesitaríamos obtener el conteo actual de pacientes
        // Por ahora solo mostramos alerta genérica
        if (level === 'all' || level === 'warning') {
          setAlertType('warning');
          setAlertMessage(`Versión gratuita: Límite de ${licencia.limitePacientes} pacientes. Activa una licencia para pacientes ilimitados.`);
          setAlertState('visible');
          return;
        }
      }

      // Licencia activa pero cerca de expirar (INFO)
      if (diasRestantes <= 30 && licencia.estado === EstadoLicencia.ACTIVA) {
        if (level === 'all') {
          setAlertType('info');
          setAlertMessage(`Tu licencia es válida por ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} más.`);
          setAlertState('visible');
          return;
        }
      }

      // Sin alertas necesarias
      setAlertState('hidden');
    };

    evaluarAlerta();
  }, [licencia, level]);

  // Auto-dismiss
  useEffect(() => {
    if (autoDismiss && alertState === 'visible' && alertType !== 'critical') {
      const timer = setTimeout(() => {
        setAlertState('dismissed');
        if (onDismiss) onDismiss();
      }, dismissTime);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, alertState, alertType, dismissTime, onDismiss]);

  // Si no hay alerta o está oculta/dismissed, no renderizar nada
  if (alertState !== 'visible' || !alertType) {
    return null;
  }

  // Estilos según tipo de alerta
  const alertStyles = {
    critical: {
      container: 'bg-red-50 border border-red-200 text-red-800',
      icon: '🔴',
      title: 'Licencia Expirada',
      button: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
      icon: '⚠️',
      title: 'Atención',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      container: 'bg-blue-50 border border-blue-200 text-blue-800',
      icon: 'ℹ️',
      title: 'Información de Licencia',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };

  const styles = alertStyles[alertType];

  return (
    <div className={`fixed top-4 right-4 left-4 md:left-auto md:right-4 md:w-96 z-50 rounded-lg shadow-lg p-4 ${styles.container} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{styles.icon}</div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{styles.title}</h3>
            {alertType !== 'critical' && (
              <button
                onClick={() => {
                  setAlertState('dismissed');
                  if (onDismiss) onDismiss();
                }}
                className="text-gray-500 hover:text-gray-700 text-lg"
                aria-label="Cerrar alerta"
              >
                ×
              </button>
            )}
          </div>
          
          <p className="text-sm mb-3">{alertMessage}</p>
          
          <div className="flex flex-wrap gap-2">
            {/* Botón de acción principal */}
            {(alertType === 'critical' || alertType === 'warning') && (
              <Link
                to="/app/activar-licencia"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${styles.button}`}
              >
                {alertType === 'critical' ? 'Activar Licencia' : 'Renovar Licencia'}
              </Link>
            )}
            
            {/* Botón secundario para información */}
            <button
              onClick={() => {
                // Aquí podríamos abrir un modal con más información
                // Por ahora redirigimos a la página de activación
                window.location.href = '/app/activar-licencia';
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Más información
            </button>
            
            {/* Botón para contactar soporte */}
            <a
              href="mailto:contacto@valpa.app"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
          
          {/* Información adicional */}
          {licencia && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Estado:</span>{' '}
                  {licencia.estado === EstadoLicencia.ACTIVA ? 'Activa' : 
                   licencia.estado === EstadoLicencia.EXPIRADA ? 'Expirada' : 'Gratuita'}
                </div>
                <div>
                  <span className="font-medium">Tipo:</span>{' '}
                  {licencia.tipo === TipoLicencia.PAGADA ? 'Pagada' : 'Gratuita'}
                </div>
                {licencia.fechaExpiracion && (
                  <div className="col-span-2">
                    <span className="font-medium">Expiración:</span>{' '}
                    {new Date(licencia.fechaExpiracion).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Barra de progreso para días restantes */}
      {daysRemaining > 0 && daysRemaining <= 30 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Días restantes</span>
            <span>{daysRemaining} días</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                daysRemaining <= 7 ? 'bg-red-500' :
                daysRemaining <= 14 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (daysRemaining / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseAlert;