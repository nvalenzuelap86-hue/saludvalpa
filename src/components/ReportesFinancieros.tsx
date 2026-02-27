// ============================================================================
// saludvalpa 3.0 - REPORTES FINANCIEROS
// ============================================================================

import { useState, useEffect } from 'react';
import { useEconomia } from '../hooks/useEconomia';
import { Card } from './';
import { formatearMoneda } from '../utils/helpers';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const ReportesFinancieros = () => {
  const { calcularEstadisticas, obtenerDeudasPorPaciente } = useEconomia();
  
  const [periodo, setPeriodo] = useState<'mes' | 'año' | 'todo'>('mes');
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [deudas, setDeudas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        let fechaInicio, fechaFin;
        const hoy = new Date();

        if (periodo === 'mes') {
          fechaInicio = startOfMonth(hoy);
          fechaFin = endOfMonth(hoy);
        } else if (periodo === 'año') {
          fechaInicio = startOfYear(hoy);
          fechaFin = endOfYear(hoy);
        }

        const stats = await calcularEstadisticas(fechaInicio, fechaFin);
        const deudasData = await obtenerDeudasPorPaciente();
        
        setEstadisticas(stats);
        setDeudas(deudasData);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [periodo, calcularEstadisticas, obtenerDeudasPorPaciente]);

  if (cargando) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Cargando reportes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriodo('mes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodo === 'mes'
              ? 'bg-saludvalpa-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Este Mes
        </button>
        <button
          onClick={() => setPeriodo('año')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodo === 'año'
              ? 'bg-saludvalpa-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Este Año
        </button>
        <button
          onClick={() => setPeriodo('todo')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodo === 'todo'
              ? 'bg-saludvalpa-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todo
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Ingresos Totales</div>
          <div className="text-2xl font-bold text-green-600">
            {formatearMoneda(estadisticas?.totalIngresos || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Recibos + Sesiones
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Ingresos por Recibos</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatearMoneda(estadisticas?.ingresosRecibos || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {estadisticas?.recibosPagados || 0} pagados
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Ingresos por Sesiones</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatearMoneda(estadisticas?.ingresosSesiones || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {estadisticas?.totalSesiones || 0} sesiones
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Pendientes de Pago</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatearMoneda(estadisticas?.totalPendiente || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {estadisticas?.recibosPendientes || 0} recibos
          </div>
        </Card>
      </div>

      {/* Servicios más solicitados */}
      {estadisticas?.serviciosMasSolicitados && estadisticas.serviciosMasSolicitados.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏆 Servicios más solicitados
          </h3>
          <div className="space-y-3">
            {estadisticas.serviciosMasSolicitados.map((servicio: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{servicio.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {servicio.cantidad} veces
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-saludvalpa-blue">
                    {formatearMoneda(servicio.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ingresos por método de pago */}
      {estadisticas?.ingresosPorMetodo && Object.keys(estadisticas.ingresosPorMetodo).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💳 Ingresos por método de pago
          </h3>
          <div className="space-y-3">
            {Object.entries(estadisticas.ingresosPorMetodo).map(([metodo, total]: [string, any]) => (
              <div key={metodo} className="flex items-center justify-between">
                <div className="font-medium text-gray-700 capitalize">{metodo}</div>
                <div className="font-semibold text-saludvalpa-blue">
                  {formatearMoneda(total)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Deudas por paciente */}
      {deudas.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚠️ Deudas pendientes por paciente
          </h3>
          <div className="space-y-2">
            {deudas.map((deuda, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-gray-900">{deuda.nombrePaciente}</div>
                <div className="font-bold text-red-600">
                  {formatearMoneda(deuda.deuda)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Estado vacío si no hay datos */}
      {estadisticas && estadisticas.totalRecibos === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos financieros aún
          </h3>
          <p className="text-gray-600">
            Los reportes aparecerán cuando generes recibos o cotizaciones
          </p>
        </Card>
      )}
    </div>
  );
};

export default ReportesFinancieros;
