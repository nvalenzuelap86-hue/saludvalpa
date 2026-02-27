// ============================================================================
// saludvalpa 3.0 - PÁGINA DE ECONOMÍA
// ============================================================================

import { useState } from 'react';
import GestionServicios from '../components/GestionServicios';
import GestionCotizaciones from '../components/GestionCotizaciones';
import GestionRecibos from '../components/GestionRecibos';
import ReportesFinancieros from '../components/ReportesFinancieros';

type TabEconomia = 'servicios' | 'cotizaciones' | 'recibos' | 'reportes';

const Economia = () => {
  const [tabActual, setTabActual] = useState<TabEconomia>('reportes');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">💰 Economía</h1>
        <p className="text-gray-600 mt-2">
          Gestiona servicios, cotizaciones, recibos y reportes financieros
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setTabActual('reportes')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                tabActual === 'reportes'
                  ? 'border-saludvalpa-blue text-saludvalpa-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            📊 Reportes
          </button>
          <button
            onClick={() => setTabActual('servicios')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                tabActual === 'servicios'
                  ? 'border-saludvalpa-blue text-saludvalpa-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            🏷️ Catálogo de Servicios
          </button>
          <button
            onClick={() => setTabActual('cotizaciones')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                tabActual === 'cotizaciones'
                  ? 'border-saludvalpa-blue text-saludvalpa-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            📋 Cotizaciones
          </button>
          <button
            onClick={() => setTabActual('recibos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                tabActual === 'recibos'
                  ? 'border-saludvalpa-blue text-saludvalpa-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            🧾 Recibos
          </button>
        </nav>
      </div>

      {/* Contenido según tab */}
      <div className="min-h-[400px]">
        {tabActual === 'servicios' && <GestionServicios />}
        {tabActual === 'cotizaciones' && <GestionCotizaciones />}
        {tabActual === 'recibos' && <GestionRecibos />}
        {tabActual === 'reportes' && <ReportesFinancieros />}
      </div>
    </div>
  );
};

export default Economia;
