// ============================================================================
// saludvalpa 3.0 - COMPONENTE DE HISTORIA CLÍNICA PSICOLÓGICA
// ============================================================================

import type { DatosPsicologia } from '../../../types';

interface HistoriaClinicaPsicologicaProps {
  datos: DatosPsicologia;
  onChange: (datos: DatosPsicologia) => void;
}

export default function HistoriaClinicaPsicologica({ datos, onChange }: HistoriaClinicaPsicologicaProps) {
  const handleChange = (campo: keyof DatosPsicologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Historia Clínica Psicológica Integral</h3>
        <p className="text-sm text-indigo-600">
          Registre información completa sobre antecedentes, desarrollo y contexto psicosocial del paciente.
        </p>
      </div>

      {/* Motivo de consulta */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">1. Motivo de consulta</h4>
        <textarea
          value={datos.historiaClinica?.motivoConsulta || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            motivoConsulta: e.target.value
          })}
          placeholder="Describa con las palabras del paciente por qué busca ayuda psicológica..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
        />
      </div>

      {/* Antecedentes personales */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">2. Antecedentes personales</h4>
        <textarea
          value={datos.historiaClinica?.antecedentesPersonales || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            antecedentesPersonales: e.target.value
          })}
          placeholder="Embarazo, parto, desarrollo psicomotor, hitos del desarrollo, educación, relaciones significativas, eventos traumáticos..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
        />
      </div>

      {/* Antecedentes familiares */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">3. Antecedentes familiares</h4>
        <textarea
          value={datos.historiaClinica?.antecedentesFamiliares || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            antecedentesFamiliares: e.target.value
          })}
          placeholder="Composición familiar, relaciones, enfermedades mentales en familiares, patrones de comunicación, conflictos familiares..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
        />
      </div>

      {/* Historia psiquiátrica */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">4. Historia psiquiátrica y tratamientos previos</h4>
        <textarea
          value={datos.historiaClinica?.historiaPsiquiatrica || ''}
          onChange={(e) => handleChange('historiaClinica', {
            ...(datos.historiaClinica || {}),
            historiaPsiquiatrica: e.target.value
          })}
          placeholder="Diagnósticos previos, hospitalizaciones, medicamentos, psicoterapias, respuesta a tratamientos, efectos secundarios..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
        />
      </div>

      {/* Contexto psicosocial */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">5. Contexto psicosocial actual</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situación laboral/académica
            </label>
            <textarea
              placeholder="Empleo, estudios, satisfacción, estrés laboral, relaciones laborales..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situación familiar/relacional
            </label>
            <textarea
              placeholder="Estado civil, hijos, relaciones significativas, apoyo social, conflictos..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Factores estresantes actuales
            </label>
            <textarea
              placeholder="Problemas económicos, de salud, familiares, laborales, pérdidas recientes..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recursos y fortalezas del paciente
            </label>
            <textarea
              placeholder="Habilidades de afrontamiento, apoyo social, recursos económicos, motivación para el cambio..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Examen mental */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-3">6. Examen mental inicial</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apariencia y comportamiento
            </label>
            <textarea
              value={datos.estadoMental || ''}
              onChange={(e) => handleChange('estadoMental', e.target.value)}
              placeholder="Vestimenta, higiene, contacto visual, postura, movimientos..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ánimo y afecto
            </label>
            <textarea
              value={datos.estadoEmocional || ''}
              onChange={(e) => handleChange('estadoEmocional', e.target.value)}
              placeholder="Estado de ánimo predominante, reactividad afectiva, congruencia..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}