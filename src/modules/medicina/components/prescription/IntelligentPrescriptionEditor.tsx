import { useState, useEffect } from 'react';
import usePrescriptions from '../../hooks/usePrescriptions';
import type { MedicamentoPrescritoDetallado, Paciente } from '../../../../types';
import { UnidadDosis, FrecuenciaMedicacion, ViaAdministracion } from '../../../../types';
import Button from '../../../../components/shared/Button';
import Card from '../../../../components/shared/Card';

interface IntelligentPrescriptionEditorProps {
  paciente: Paciente & { peso?: number; funcionRenal?: number };
  onPrescriptionChange: (prescriptions: MedicamentoPrescritoDetallado[]) => void;
  initialPrescriptions?: MedicamentoPrescritoDetallado[];
}

export default function IntelligentPrescriptionEditor({
  paciente,
  onPrescriptionChange,
  initialPrescriptions = []
}: IntelligentPrescriptionEditorProps) {
  const {
    crearPrescripcion,
    actualizarPrescripcion,
    suspenderPrescripcion,
    verificarInteracciones,
    calcularDosis,
    generarInstruccionesPaciente
  } = usePrescriptions();

  const [prescriptions, setPrescriptions] = useState<MedicamentoPrescritoDetallado[]>(initialPrescriptions);
  const [newMedication, setNewMedication] = useState<Partial<MedicamentoPrescritoDetallado>>({
    nombre: '',
    presentacion: 'tabletas',
    concentracion: 0,
    unidadConcentracion: UnidadDosis.MG,
    dosis: 0,
    unidadDosis: UnidadDosis.MG,
    frecuencia: FrecuenciaMedicacion.CADA_8_HORAS,
    duracionDias: 7,
    via: ViaAdministracion.ORAL,
    indicacionesEspeciales: ''
  });
  const [interactions, setInteractions] = useState<{ medicamentoA: string; medicamentoB: string; interaccion: string }[]>([]);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [patientInstructions, setPatientInstructions] = useState<string>('');

  // Load patient's existing prescriptions
  useEffect(() => {
    if (paciente.id) {
      setPrescriptions(initialPrescriptions);
    }
  }, [paciente.id, initialPrescriptions]);

  // Check for drug interactions whenever prescriptions change
  useEffect(() => {
    const checkInteractions = async () => {
      if (prescriptions.length > 1) {
        setIsCheckingInteractions(true);
        try {
          const detectedInteractions = await verificarInteracciones(prescriptions);
          setInteractions(detectedInteractions);
        } catch (error) {
          console.error('Error checking drug interactions:', error);
        } finally {
          setIsCheckingInteractions(false);
        }
      } else {
        setInteractions([]);
      }
    };

    checkInteractions();
  }, [prescriptions, verificarInteracciones]);

  const handleAddMedication = async () => {
    if (!newMedication.nombre || !newMedication.dosis || !newMedication.frecuencia) {
      alert('Por favor complete los campos requeridos: nombre, dosis y frecuencia');
      return;
    }

    try {
      const prescriptionData: Omit<MedicamentoPrescritoDetallado, 'id'> = {
        nombre: newMedication.nombre!,
        presentacion: newMedication.presentacion || 'tabletas',
        concentracion: newMedication.concentracion || 0,
        unidadConcentracion: newMedication.unidadConcentracion || UnidadDosis.MG,
        dosis: newMedication.dosis!,
        unidadDosis: newMedication.unidadDosis || UnidadDosis.MG,
        frecuencia: newMedication.frecuencia!,
        duracionDias: newMedication.duracionDias || 7,
        via: newMedication.via || ViaAdministracion.ORAL,
        indicacionesEspeciales: newMedication.indicacionesEspeciales || '',
        pacienteId: paciente.id,
        notaSOAPId: undefined,
        principioActivo: newMedication.principioActivo,
        justificacion: newMedication.justificacion,
        contraindicaciones: newMedication.contraindicaciones,
        monitorizacion: newMedication.monitorizacion,
        costoAproximado: newMedication.costoAproximado
      };

      const prescriptionId = await crearPrescripcion(prescriptionData);
      
      const newPrescription: MedicamentoPrescritoDetallado = {
        ...prescriptionData,
        id: prescriptionId
      };

      const updatedPrescriptions = [...prescriptions, newPrescription];
      setPrescriptions(updatedPrescriptions);
      onPrescriptionChange(updatedPrescriptions);
      
      // Reset form
      setNewMedication({
        nombre: '',
        presentacion: 'tabletas',
        concentracion: 0,
        unidadConcentracion: UnidadDosis.MG,
        dosis: 0,
        unidadDosis: UnidadDosis.MG,
        frecuencia: FrecuenciaMedicacion.CADA_8_HORAS,
        duracionDias: 7,
        via: ViaAdministracion.ORAL,
        indicacionesEspeciales: ''
      });

      // Generate patient instructions
      const instructions = generarInstruccionesPaciente(newPrescription);
      setPatientInstructions(instructions);

    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Error al crear la prescripción. Por favor intente nuevamente.');
    }
  };

  const handleUpdateMedication = async (id: string, updates: Partial<MedicamentoPrescritoDetallado>) => {
    try {
      await actualizarPrescripcion(id, updates);
      
      const updatedPrescriptions = prescriptions.map(prescription =>
        prescription.id === id ? { ...prescription, ...updates } : prescription
      );
      
      setPrescriptions(updatedPrescriptions);
      onPrescriptionChange(updatedPrescriptions);
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Error al actualizar la prescripción.');
    }
  };

  const handleSuspendMedication = async (id: string, motivo: string) => {
    try {
      await suspenderPrescripcion(id, motivo);
      
      // In a real implementation, we would update the prescription status
      alert(`Prescripción ${id} suspendida: ${motivo}`);
    } catch (error) {
      console.error('Error suspending prescription:', error);
      alert('Error al suspender la prescripción.');
    }
  };

  const calculateDosage = () => {
    if (!paciente.peso) {
      alert('El peso del paciente no está disponible para calcular dosis');
      return;
    }

    const calculatedDose = calcularDosis(
      paciente.peso,
      10, // Base dose - this should be configurable
      UnidadDosis.MG_KG,
      paciente.funcionRenal
    );

    setNewMedication(prev => ({
      ...prev,
      dosis: calculatedDose,
      unidadDosis: UnidadDosis.MG_KG
    }));
  };

  const formatDosage = (dosis: number, unidad: UnidadDosis) => {
    if (unidad === UnidadDosis.MG_KG) {
      return `${dosis} mg/kg`;
    } else if (unidad === UnidadDosis.MCG_KG) {
      return `${dosis} mcg/kg`;
    } else {
      return `${dosis} ${unidad}`;
    }
  };

  const formatFrequency = (freq: FrecuenciaMedicacion) => {
    return freq.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Editor Inteligente de Prescripciones</h2>
        <p className="text-gray-600 mb-6">
          Sistema de prescripción con verificación de interacciones medicamentosas y cálculo de dosis
        </p>

        {/* Drug Interaction Alerts */}
        {interactions.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Interacciones Medicamentosas Detectadas</h3>
            <ul className="space-y-2">
              {interactions.map((interaction, index) => (
                <li key={index} className="text-red-700">
                  <strong>{interaction.medicamentoA}</strong> + <strong>{interaction.medicamentoB}</strong>: {interaction.interaccion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add New Medication Form */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Agregar Nuevo Medicamento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Medicamento *
              </label>
              <input
                type="text"
                value={newMedication.nombre || ''}
                onChange={(e) => setNewMedication({ ...newMedication, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Amoxicilina, Ibuprofeno..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosis *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newMedication.dosis || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, dosis: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 500"
                  step="0.1"
                />
                <select
                  value={newMedication.unidadDosis || UnidadDosis.MG}
                  onChange={(e) => setNewMedication({ ...newMedication, unidadDosis: e.target.value as UnidadDosis })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(UnidadDosis).map((unidad) => (
                    <option key={unidad} value={unidad}>
                      {unidad}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={calculateDosage}
                  className="whitespace-nowrap"
                  disabled={!paciente.peso}
                >
                  Calcular
                </Button>
              </div>
              {paciente.peso && (
                <p className="text-xs text-gray-500 mt-1">
                  Peso del paciente: {paciente.peso} kg {paciente.funcionRenal && `| Función renal: ${paciente.funcionRenal}%`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia *
              </label>
              <select
                value={newMedication.frecuencia || FrecuenciaMedicacion.CADA_8_HORAS}
                onChange={(e) => setNewMedication({ ...newMedication, frecuencia: e.target.value as FrecuenciaMedicacion })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(FrecuenciaMedicacion).map((freq) => (
                  <option key={freq} value={freq}>
                    {formatFrequency(freq)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (días)
              </label>
              <input
                type="number"
                value={newMedication.duracionDias || 7}
                onChange={(e) => setNewMedication({ ...newMedication, duracionDias: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vía de Administración
              </label>
              <select
                value={newMedication.via || ViaAdministracion.ORAL}
                onChange={(e) => setNewMedication({ ...newMedication, via: e.target.value as ViaAdministracion })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(ViaAdministracion).map((via) => (
                  <option key={via} value={via}>
                    {via}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentación
              </label>
              <input
                type="text"
                value={newMedication.presentacion || ''}
                onChange={(e) => setNewMedication({ ...newMedication, presentacion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Tabletas, Jarabe, Crema..."
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indicaciones Especiales
            </label>
            <textarea
              value={newMedication.indicacionesEspeciales || ''}
              onChange={(e) => setNewMedication({ ...newMedication, indicacionesEspeciales: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Ej: Tomar con alimentos, Evitar exposición al sol..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAddMedication}
              disabled={isCheckingInteractions}
            >
              {isCheckingInteractions ? 'Verificando interacciones...' : 'Agregar Medicamento'}
            </Button>
          </div>
        </div>

        {/* Current Medications List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Medicamentos Prescritos</h3>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500 italic">No hay medicamentos prescritos aún.</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((prescription, index) => (
                <div key={prescription.id || index} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{prescription.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDosage(prescription.dosis, prescription.unidadDosis)} • {formatFrequency(prescription.frecuencia)} • {prescription.via}
                      </p>
                      <p className="text-sm text-gray-600">Duración: {prescription.duracionDias} días</p>
                      {prescription.indicacionesEspeciales && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Indicaciones:</strong> {prescription.indicacionesEspeciales}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const motivo = prompt('Motivo de suspensión:');
                          if (motivo && prescription.id) {
                            handleSuspendMedication(prescription.id, motivo);
                          }
                        }}
                      >
                        Suspender
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patient Instructions */}
        {patientInstructions && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Instrucciones para el Paciente</h3>
            <p className="text-gray-700 whitespace-pre-line">{patientInstructions}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
