import { useState, useEffect } from 'react';
import usePrescriptions from '../../hooks/usePrescriptions';
import type { MedicamentoPrescritoDetallado } from '../../../../types';
import Card from '../../../../components/shared/Card';
import Button from '../../../../components/shared/Button';

interface DrugInteractionCheckerProps {
  medications: MedicamentoPrescritoDetallado[];
  onInteractionsDetected?: (interactions: { medicamentoA: string; medicamentoB: string; interaccion: string }[]) => void;
}

export default function DrugInteractionChecker({
  medications,
  onInteractionsDetected
}: DrugInteractionCheckerProps) {
  const { verificarInteracciones } = usePrescriptions();
  
  const [interactions, setInteractions] = useState<{ medicamentoA: string; medicamentoB: string; interaccion: string }[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'major' | 'moderate' | 'minor'>('all');

  useEffect(() => {
    if (medications.length > 1) {
      checkInteractions();
    } else {
      setInteractions([]);
    }
  }, [medications]);

  const checkInteractions = async () => {
    if (medications.length < 2) {
      setInteractions([]);
      return;
    }

    setIsChecking(true);
    try {
      const detectedInteractions = await verificarInteracciones(medications);
      setInteractions(detectedInteractions);
      if (onInteractionsDetected) {
        onInteractionsDetected(detectedInteractions);
      }
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      setInteractions([]);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverity = (interaction: string): 'major' | 'moderate' | 'minor' => {
    const lowerInteraction = interaction.toLowerCase();
    
    if (lowerInteraction.includes('contraindicado') || 
        lowerInteraction.includes('grave') || 
        lowerInteraction.includes('mortal') ||
        lowerInteraction.includes('riesgo alto')) {
      return 'major';
    } else if (lowerInteraction.includes('precaución') || 
               lowerInteraction.includes('moderado') ||
               lowerInteraction.includes('monitorizar')) {
      return 'moderate';
    } else {
      return 'minor';
    }
  };

  const getSeverityColor = (severity: 'major' | 'moderate' | 'minor') => {
    switch (severity) {
      case 'major': return 'bg-red-100 border-red-300 text-red-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'minor': return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getSeverityLabel = (severity: 'major' | 'moderate' | 'minor') => {
    switch (severity) {
      case 'major': return 'Grave';
      case 'moderate': return 'Moderada';
      case 'minor': return 'Leve';
    }
  };

  const filteredInteractions = interactions.filter(interaction => {
    if (severityFilter === 'all') return true;
    const severity = getSeverity(interaction.interaccion);
    return severity === severityFilter;
  });

  const interactionCounts = {
    major: interactions.filter(i => getSeverity(i.interaccion) === 'major').length,
    moderate: interactions.filter(i => getSeverity(i.interaccion) === 'moderate').length,
    minor: interactions.filter(i => getSeverity(i.interaccion) === 'minor').length,
    total: interactions.length
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Verificador de Interacciones Medicamentosas</h2>
          <p className="text-gray-600">Detecta posibles interacciones entre medicamentos prescritos</p>
        </div>
        <Button
          variant="outline"
          onClick={checkInteractions}
          disabled={isChecking || medications.length < 2}
        >
          {isChecking ? 'Verificando...' : 'Verificar Interacciones'}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-gray-800">{interactionCounts.total}</div>
          <div className="text-sm text-gray-600">Total Interacciones</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-700">{interactionCounts.major}</div>
          <div className="text-sm text-red-600">Graves</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-700">{interactionCounts.moderate}</div>
          <div className="text-sm text-yellow-600">Moderadas</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-700">{interactionCounts.minor}</div>
          <div className="text-sm text-blue-600">Leves</div>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtrar por Gravedad</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-4 py-2 rounded-lg border ${severityFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
          >
            Todas ({interactionCounts.total})
          </button>
          <button
            onClick={() => setSeverityFilter('major')}
            className={`px-4 py-2 rounded-lg border ${severityFilter === 'major' ? 'bg-red-800 text-white border-red-800' : 'bg-red-100 text-red-700 border-red-300'}`}
          >
            Graves ({interactionCounts.major})
          </button>
          <button
            onClick={() => setSeverityFilter('moderate')}
            className={`px-4 py-2 rounded-lg border ${severityFilter === 'moderate' ? 'bg-yellow-800 text-white border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}
          >
            Moderadas ({interactionCounts.moderate})
          </button>
          <button
            onClick={() => setSeverityFilter('minor')}
            className={`px-4 py-2 rounded-lg border ${severityFilter === 'minor' ? 'bg-blue-800 text-white border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-300'}`}
          >
            Leves ({interactionCounts.minor})
          </button>
        </div>
      </div>

      {/* Interactions List */}
      {medications.length < 2 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Agregue al menos 2 medicamentos para verificar interacciones.</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-green-500 text-4xl mb-2">✓</div>
          <p className="text-gray-700 font-medium">No se detectaron interacciones medicamentosas</p>
          <p className="text-gray-500">Los medicamentos prescritos no presentan interacciones conocidas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Interacciones Detectadas ({filteredInteractions.length})
          </h3>
          
          {filteredInteractions.map((interaction, index) => {
            const severity = getSeverity(interaction.interaccion);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{interaction.medicamentoA}</span>
                    <span className="mx-2">+</span>
                    <span className="font-semibold">{interaction.medicamentoB}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    severity === 'major' ? 'bg-red-200 text-red-800' :
                    severity === 'moderate' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {getSeverityLabel(severity)}
                  </span>
                </div>
                <p className="text-gray-700">{interaction.interaccion}</p>
                
                {/* Recommendations based on severity */}
                <div className="mt-3 pt-3 border-t border-opacity-50">
                  <p className="text-sm font-medium">Recomendación:</p>
                  {severity === 'major' && (
                    <p className="text-sm text-red-700">
                      <strong>Contraindicado:</strong> Evitar la combinación. Considerar alternativas terapéuticas.
                    </p>
                  )}
                  {severity === 'moderate' && (
                    <p className="text-sm text-yellow-700">
                      <strong>Precaución:</strong> Monitorizar al paciente. Ajustar dosis si es necesario.
                    </p>
                  )}
                  {severity === 'minor' && (
                    <p className="text-sm text-blue-700">
                      <strong>Leve:</strong> Interacción clínicamente insignificante en la mayoría de pacientes.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Current Medications */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Medicamentos Analizados</h3>
        {medications.length === 0 ? (
          <p className="text-gray-500 italic">No hay medicamentos para analizar.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {medications.map((med, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="font-medium text-gray-800">{med.nombre}</div>
                <div className="text-sm text-gray-600">
                  {med.dosis} {med.unidadDosis} • {med.frecuencia.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Footer */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-start">
          <div className="text-yellow-500 mr-3">ℹ️</div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Información sobre interacciones medicamentosas:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Las interacciones se basan en bases de datos farmacológicas actualizadas</li>
              <li>Las interacciones "Graves" requieren acción inmediata</li>
              <li>Las interacciones "Moderadas" requieren monitorización</li>
              <li>Consulte siempre con un farmacéutico o especialista en caso de duda</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}