// ============================================================================
// saludvalpa 3.0 - EDITOR DE NOTAS SOAP
// Componente para crear y editar notas SOAP estructuradas
// ============================================================================

import React, { useState } from 'react';
import Button from '../../../../components/shared/Button';
import Card from '../../../../components/shared/Card';
import useMedicalHistory from '../../hooks/useMedicalHistory';
import type { NotaSOAP, Paciente, SignosVitales, ExamenFisicoCompleto, TratamientoCompleto } from '../../../../types';

interface SOAPNoteEditorProps {
  paciente: Paciente;
  initialData?: Partial<NotaSOAP>;
  onSave?: (nota: NotaSOAP) => void;
  onCancel?: () => void;
}

const defaultSignosVitales: SignosVitales = {
  temperatura: '',
  presionArterialSistolica: '',
  presionArterialDiastolica: '',
  frecuenciaCardiaca: '',
  frecuenciaRespiratoria: '',
  saturacionOxigeno: '',
  peso: '',
  talla: '',
  imc: ''
};

const defaultExamenFisico: ExamenFisicoCompleto = {
  general: '',
  cabezaCuello: '',
  torax: '',
  cardiovascular: '',
  abdominal: '',
  neurologico: '',
  musculoEsqueletico: '',
  piel: ''
};

const defaultTratamiento: TratamientoCompleto = {
  medicamentos: [],
  estudiosSolicitados: [],
  recomendaciones: '',
  seguimiento: {
    fecha: new Date(),
    tipo: 'consulta',
    instrucciones: ''
  }
};

export default function SOAPNoteEditor({ 
  paciente, 
  initialData, 
  onSave, 
  onCancel 
}: SOAPNoteEditorProps) {
  const medicalHistory = useMedicalHistory();
  
  const [nota, setNota] = useState<Partial<NotaSOAP>>({
    id: crypto.randomUUID(),
    fecha: new Date(),
    pacienteId: paciente.id,
    subjetivo: initialData?.subjetivo || {
      motivoConsulta: '',
      historiaEnfermedadActual: '',
      sintomasAsociados: [],
      revisionPorSistemas: {}
    },
    objetivo: initialData?.objetivo || {
      signosVitales: defaultSignosVitales,
      examenFisico: defaultExamenFisico,
      resultadosEstudios: []
    },
    analisis: initialData?.analisis || {
      impresionDiagnostica: '',
      diagnosticoDiferencial: [],
      justificacion: ''
    },
    plan: initialData?.plan || defaultTratamiento,
    ...initialData
  });

  const [activeSection, setActiveSection] = useState<'subjetivo' | 'objetivo' | 'analisis' | 'plan'>('subjetivo');

  const handleSectionChange = (section: 'subjetivo' | 'objetivo' | 'analisis' | 'plan') => {
    setActiveSection(section);
  };

  const handleSubjetivoChange = (field: keyof NotaSOAP['subjetivo'], value: string | string[] | Record<string, string>) => {
    setNota(prev => ({
      ...prev,
      subjetivo: {
        ...prev.subjetivo!,
        [field]: value
      }
    }));
  };

  const handleSignosVitalesChange = (field: keyof SignosVitales, value: string) => {
    setNota(prev => ({
      ...prev,
      objetivo: {
        ...prev.objetivo!,
        signosVitales: {
          ...prev.objetivo!.signosVitales,
          [field]: value
        }
      }
    }));
  };

  const handleExamenFisicoChange = (field: keyof ExamenFisicoCompleto, value: string) => {
    setNota(prev => ({
      ...prev,
      objetivo: {
        ...prev.objetivo!,
        examenFisico: {
          ...prev.objetivo!.examenFisico,
          [field]: value
        }
      }
    }));
  };

  const handleAnalisisChange = (field: keyof NotaSOAP['analisis'], value: string | string[]) => {
    setNota(prev => ({
      ...prev,
      analisis: {
        ...prev.analisis!,
        [field]: value
      }
    }));
  };

  const handlePlanChange = (field: keyof TratamientoCompleto, value: any) => {
    setNota(prev => ({
      ...prev,
      plan: {
        ...prev.plan!,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const notaCompleta: NotaSOAP = {
      id: nota.id || crypto.randomUUID(),
      fecha: nota.fecha || new Date(),
      pacienteId: paciente.id,
      subjetivo: nota.subjetivo!,
      objetivo: nota.objetivo!,
      analisis: nota.analisis!,
      plan: nota.plan!,
      profesionalId: nota.profesionalId
    };

    onSave?.(notaCompleta);
  };

  const sectionDescriptions = {
    subjetivo: 'Queja principal, síntomas, historia de la enfermedad actual, antecedentes relevantes',
    objetivo: 'Signos vitales, hallazgos del examen físico, resultados de estudios',
    analisis: 'Interpretación de hallazgos, diagnóstico diferencial, evaluación del progreso',
    plan: 'Tratamiento prescrito, estudios solicitados, recomendaciones, seguimiento'
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'subjetivo':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Motivo de Consulta</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Describa la queja principal del paciente..."
                value={nota.subjetivo?.motivoConsulta || ''}
                onChange={(e) => handleSubjetivoChange('motivoConsulta', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Historia de la Enfermedad Actual</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Incluya tiempo de inicio, evolución, características, factores agravantes/mejorantes..."
                value={nota.subjetivo?.historiaEnfermedadActual || ''}
                onChange={(e) => handleSubjetivoChange('historiaEnfermedadActual', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Síntomas Asociados</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Ingrese síntomas separados por comas..."
                value={nota.subjetivo?.sintomasAsociados?.join(', ') || ''}
                onChange={(e) => handleSubjetivoChange('sintomasAsociados', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
          </div>
        );

      case 'objetivo':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Signos Vitales</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <input 
                    type="text" 
                    className="w-full p-1 border-b" 
                    placeholder="°C"
                    value={nota.objetivo?.signosVitales.temperatura || ''}
                    onChange={(e) => handleSignosVitalesChange('temperatura', e.target.value)}
                  />
                </div>
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-600">Presión Arterial</p>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      className="w-1/2 p-1 border-b" 
                      placeholder="Sistólica"
                      value={nota.objetivo?.signosVitales.presionArterialSistolica || ''}
                      onChange={(e) => handleSignosVitalesChange('presionArterialSistolica', e.target.value)}
                    />
                    <span>/</span>
                    <input 
                      type="text" 
                      className="w-1/2 p-1 border-b" 
                      placeholder="Diastólica"
                      value={nota.objetivo?.signosVitales.presionArterialDiastolica || ''}
                      onChange={(e) => handleSignosVitalesChange('presionArterialDiastolica', e.target.value)}
                    />
                  </div>
                </div>
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-600">Frecuencia Cardíaca</p>
                  <input 
                    type="text" 
                    className="w-full p-1 border-b" 
                    placeholder="lpm"
                    value={nota.objetivo?.signosVitales.frecuenciaCardiaca || ''}
                    onChange={(e) => handleSignosVitalesChange('frecuenciaCardiaca', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Examen Físico - General</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Estado general, conciencia, hidratación..."
                value={nota.objetivo?.examenFisico.general || ''}
                onChange={(e) => handleExamenFisicoChange('general', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Examen Físico - Cardiovascular</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Ruidos cardíacos, pulsos, edemas..."
                value={nota.objetivo?.examenFisico.cardiovascular || ''}
                onChange={(e) => handleExamenFisicoChange('cardiovascular', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resultados de Estudios</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Resultados de laboratorio, imágenes, otros estudios relevantes..."
                value={nota.objetivo?.resultadosEstudios?.join('\n') || ''}
                onChange={(e) => setNota(prev => ({
                  ...prev,
                  objetivo: {
                    ...prev.objetivo!,
                    resultadosEstudios: e.target.value.split('\n').filter(Boolean)
                  }
                }))}
              />
            </div>
          </div>
        );

      case 'analisis':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Impresión Diagnóstica</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Diagnóstico principal y secundarios..."
                value={nota.analisis?.impresionDiagnostica || ''}
                onChange={(e) => handleAnalisisChange('impresionDiagnostica', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Diagnóstico Diferencial</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Lista de diagnósticos considerados separados por comas..."
                value={nota.analisis?.diagnosticoDiferencial?.join(', ') || ''}
                onChange={(e) => handleAnalisisChange('diagnosticoDiferencial', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Justificación</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Criterios diagnósticos utilizados, hallazgos de apoyo..."
                value={nota.analisis?.justificacion || ''}
                onChange={(e) => handleAnalisisChange('justificacion', e.target.value)}
              />
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recomendaciones</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Instrucciones para el paciente, modificaciones de estilo de vida..."
                value={nota.plan?.recomendaciones || ''}
                onChange={(e) => handlePlanChange('recomendaciones', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estudios Solicitados</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Laboratorios, imágenes, consultas especializadas..."
                value={nota.plan?.estudiosSolicitados?.join('\n') || ''}
                onChange={(e) => handlePlanChange('estudiosSolicitados', e.target.value.split('\n').filter(Boolean))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Seguimiento</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Seguimiento</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded" 
                    value={nota.plan?.seguimiento?.fecha ? new Date(nota.plan.seguimiento.fecha).toISOString().split('T')[0] : ''}
                    onChange={(e) => handlePlanChange('seguimiento', {
                      ...nota.plan?.seguimiento,
                      fecha: new Date(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Seguimiento</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={nota.plan?.seguimiento?.tipo || 'consulta'}
                    onChange={(e) => handlePlanChange('seguimiento', {
                      ...nota.plan?.seguimiento,
                      tipo: e.target.value
                    })}
                  >
                    <option value="consulta">Consulta</option>
                    <option value="phone">Llamada telefónica</option>
                    <option value="results">Revisión de resultados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Nota SOAP</h2>
        <p className="text-gray-600">Complete la nota SOAP para {paciente.nombre} {paciente.apellidos}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        {(['subjetivo', 'objetivo', 'analisis', 'plan'] as const).map((section) => (
          <button
            key={section}
            onClick={() => handleSectionChange(section)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeSection === section
                ? 'border-blue-500 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Section Description */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}:</span>{' '}
          {sectionDescriptions[activeSection]}
        </p>
      </div>

      {/* Section Content */}
      <div className="mb-6">
        {renderSectionContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            // Save as draft
            handleSave();
          }}>
            Guardar Borrador
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar y Finalizar
          </Button>
        </div>
      </div>
    </Card>
  );
}