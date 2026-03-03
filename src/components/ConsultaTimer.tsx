// ============================================================================
// saludvalpa 3.0 - COMPONENTE CONSULTA TIMER
// Temporizador visual atractivo para consultas con marcador de tiempo
// ============================================================================

import { useState, useEffect, useRef } from 'react';

interface ConsultaTimerProps {
  /** Duración inicial en segundos (opcional) */
  duracionInicial?: number;
  /** Si el temporizador está activo por defecto */
  activoPorDefecto?: boolean;
  /** Callback cuando se inicia el temporizador */
  onIniciar?: () => void;
  /** Callback cuando se pausa el temporizador */
  onPausar?: () => void;
  /** Callback cuando se finaliza el temporizador */
  onFinalizar?: (duracionTotal: number) => void;
  /** Callback cuando cambia el tiempo */
  onTiempoCambiado?: (segundos: number) => void;
  /** Si se muestra en modo compacto */
  modoCompacto?: boolean;
  /** Color personalizado */
  color?: 'azul' | 'verde' | 'lime' | 'teal';
}

export default function ConsultaTimer({
  duracionInicial = 0,
  activoPorDefecto = true,
  onIniciar,
  onPausar,
  onFinalizar,
  onTiempoCambiado,
  modoCompacto = false,
  color = 'azul'
}: ConsultaTimerProps) {
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(duracionInicial);
  const [activo, setActivo] = useState(activoPorDefecto);
  const [mostrarControles, setMostrarControles] = useState(!modoCompacto);
  const intervalRef = useRef<number | null>(null);

  // Mapeo de colores
  const colores = {
    azul: {
      primario: 'bg-saludvalpa-blue',
      secundario: 'bg-saludvalpa-blue/20',
      texto: 'text-saludvalpa-blue',
      borde: 'border-saludvalpa-blue'
    },
    verde: {
      primario: 'bg-saludvalpa-green',
      secundario: 'bg-saludvalpa-green/20',
      texto: 'text-saludvalpa-green',
      borde: 'border-saludvalpa-green'
    },
    lime: {
      primario: 'bg-saludvalpa-lime',
      secundario: 'bg-saludvalpa-lime/20',
      texto: 'text-saludvalpa-lime',
      borde: 'border-saludvalpa-lime'
    },
    teal: {
      primario: 'bg-saludvalpa-teal',
      secundario: 'bg-saludvalpa-teal/20',
      texto: 'text-saludvalpa-teal',
      borde: 'border-saludvalpa-teal'
    }
  };

  const colorConfig = colores[color];

  // Formatear tiempo
  const formatearTiempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  // Calcular porcentaje para círculo de progreso (si aplica)
  const calcularPorcentaje = () => {
    // Consideramos una consulta típica de 1 hora como 100%
    const duracionMaxima = 3600; // 60 minutos en segundos
    return Math.min((segundosTranscurridos / duracionMaxima) * 100, 100);
  };

  // Iniciar temporizador
  const iniciar = () => {
    if (!activo) {
      setActivo(true);
      if (onIniciar) onIniciar();
    }
  };

  // Pausar temporizador
  const pausar = () => {
    if (activo) {
      setActivo(false);
      if (onPausar) onPausar();
    }
  };

  // Reiniciar temporizador
  const reiniciar = () => {
    setSegundosTranscurridos(0);
    setActivo(true);
  };

  // Finalizar temporizador
  const finalizar = () => {
    setActivo(false);
    if (onFinalizar) onFinalizar(segundosTranscurridos);
  };

  // Efecto para el temporizador
  useEffect(() => {
    if (activo) {
      intervalRef.current = window.setInterval(() => {
        setSegundosTranscurridos(prev => {
          const nuevoValor = prev + 1;
          if (onTiempoCambiado) onTiempoCambiado(nuevoValor);
          return nuevoValor;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activo, onTiempoCambiado]);

  // Modo compacto (solo display)
  if (modoCompacto) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${activo ? colorConfig.primario : 'bg-gray-400'}`}></div>
        <span className="font-mono font-bold text-gray-900">
          {formatearTiempo(segundosTranscurridos)}
        </span>
        <button
          onClick={activo ? pausar : iniciar}
          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          {activo ? '⏸' : '▶'}
        </button>
      </div>
    );
  }

  // Modo completo
  return (
    <div className={`p-6 border ${colorConfig.borde} rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colorConfig.primario} rounded-lg flex items-center justify-center`}>
            <span className="text-xl text-white">⏱️</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Temporizador de Consulta</h3>
            <p className="text-sm text-gray-600">Seguimiento de duración en tiempo real</p>
          </div>
        </div>
        <button
          onClick={() => setMostrarControles(!mostrarControles)}
          className="text-gray-500 hover:text-gray-700"
        >
          {mostrarControles ? '▲' : '▼'}
        </button>
      </div>

      {/* Display principal */}
      <div className="flex flex-col items-center mb-6">
        {/* Círculo de progreso (opcional) */}
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 font-mono">
                {formatearTiempo(segundosTranscurridos)}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {activo ? 'En progreso' : 'Pausado'}
              </div>
            </div>
          </div>
          {/* Círculo de fondo */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${calcularPorcentaje() * 5.52} 552`}
              className={colorConfig.texto}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {Math.floor(segundosTranscurridos / 3600)}
            </div>
            <div className="text-xs text-gray-600">Horas</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {Math.floor((segundosTranscurridos % 3600) / 60)}
            </div>
            <div className="text-xs text-gray-600">Minutos</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {segundosTranscurridos % 60}
            </div>
            <div className="text-xs text-gray-600">Segundos</div>
          </div>
        </div>
      </div>

      {/* Controles (si están visibles) */}
      {mostrarControles && (
        <div className="space-y-4">
          {/* Barra de estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${activo ? colorConfig.primario : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {activo ? 'Temporizador activo' : 'Temporizador pausado'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Iniciado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Botones de control */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={activo ? pausar : iniciar}
              className={`px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                activo
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : `${colorConfig.primario} text-white hover:opacity-90`
              }`}
            >
              <span>{activo ? '⏸' : '▶'}</span>
              <span>{activo ? 'Pausar' : 'Iniciar'}</span>
            </button>

            <button
              onClick={reiniciar}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Reiniciar</span>
            </button>

            <button
              onClick={finalizar}
              className="px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 flex items-center justify-center gap-2"
            >
              <span>⏹️</span>
              <span>Finalizar</span>
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(formatearTiempo(segundosTranscurridos))}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Copiar</span>
            </button>
          </div>

          {/* Notas rápidas */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Nota:</span> El temporizador se guarda automáticamente 
              junto con las notas de la consulta. La duración final se incluirá en el reporte PDF.
            </p>
          </div>
        </div>
      )}

      {/* Indicador de estado en la parte inferior */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {activo ? '⏱️ Registrando tiempo...' : '⏸ Tiempo pausado'}
        </div>
        <div className="text-xs font-medium text-gray-700">
          Duración total: {formatearTiempo(segundosTranscurridos)}
        </div>
      </div>
    </div>
  );
}