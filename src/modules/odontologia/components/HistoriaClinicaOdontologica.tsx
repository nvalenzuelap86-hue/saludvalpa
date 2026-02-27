// ============================================================================
// saludvalpa 3.0 - HISTORIA CLÍNICA ODONTOLÓGICA
// Formulario completo para historia clínica dental
// ============================================================================

import { useState } from 'react';
import type { DatosOdontologia } from '../../../types';
import { OdontogramaSVG } from '../odontograma/OdontogramaSVG';

interface HistoriaClinicaOdontologicaProps {
  datos: DatosOdontologia;
  onChange: (datos: DatosOdontologia) => void;
}

export default function HistoriaClinicaOdontologica({ datos, onChange }: HistoriaClinicaOdontologicaProps) {
  // Estados locales para formulario
  const [motivoConsulta, setMotivoConsulta] = useState(datos.motivoConsulta || '');
  const [historiaEnfermedadActual, setHistoriaEnfermedadActual] = useState(datos.historiaEnfermedadActual || '');
  
  // Antecedentes odontológicos
  const [antecedentes, setAntecedentes] = useState({
    tratamientosPrevios: datos.antecedentesOdontologicos?.tratamientosPrevios || [],
    traumatismos: datos.antecedentesOdontologicos?.traumatismos || [],
    habitos: datos.antecedentesOdontologicos?.habitos || [],
    protesis: datos.antecedentesOdontologicos?.protesis || [],
  });

  // Diagnóstico
  const [diagnostico, setDiagnostico] = useState({
    caries: datos.diagnostico?.caries || [],
    enfermedadPeriodontal: datos.diagnostico?.enfermedadPeriodontal || [],
    maloclusion: datos.diagnostico?.maloclusion || [],
    otros: datos.diagnostico?.otros || [],
  });

  // Higiene
  const [higiene, setHigiene] = useState({
    indicePlaca: datos.indicePlaca || 0,
    indiceSangrado: datos.indiceSangrado || 0,
    instruccionesHigiene: datos.instruccionesHigiene || [],
  });

  const handleChange = (campo: keyof DatosOdontologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const handleOdontogramaChange = (piezas: any[]) => {
    handleChange('odontograma', {
      ...datos.odontograma,
      piezas,
      notas: datos.odontograma?.notas || '',
    });
  };

  const handleDiagnosticoChange = (tipo: keyof typeof diagnostico, valor: string[]) => {
    const nuevoDiagnostico = { ...diagnostico, [tipo]: valor };
    setDiagnostico(nuevoDiagnostico);
    handleChange('diagnostico', nuevoDiagnostico);
  };

  const handleHigieneChange = (campo: keyof typeof higiene, valor: any) => {
    const nuevaHigiene = { ...higiene, [campo]: valor };
    setHigiene(nuevaHigiene);
    
    if (campo === 'indicePlaca') {
      handleChange('indicePlaca', valor);
    } else if (campo === 'indiceSangrado') {
      handleChange('indiceSangrado', valor);
    } else if (campo === 'instruccionesHigiene') {
      handleChange('instruccionesHigiene', valor);
    }
  };

  const handleAntecedentesChange = (tipo: keyof typeof antecedentes, valor: string[]) => {
    const nuevosAntecedentes = { ...antecedentes, [tipo]: valor };
    setAntecedentes(nuevosAntecedentes);
    handleChange('antecedentesOdontologicos', nuevosAntecedentes);
  };

  // Opciones para selección
  const opcionesHabitOS = [
    'Bruxismo', 'Onicofagia', 'Respiración bucal', 'Deglución atípica',
    'Succión digital', 'Uso de chupón', 'Tabaco', 'Alcohol'
  ];

  const opcionesEnfermedadPeriodontal = [
    'Gingivitis', 'Periodontitis crónica', 'Periodontitis agresiva',
    'Recesión gingival', 'Hipertrofia gingival', 'Absceso periodontal'
  ];

  const opcionesMaloclusion = [
    'Clase I', 'Clase II División 1', 'Clase II División 2', 'Clase III',
    'Mordida cruzada', 'Mordida abierta', 'Mordida profunda', 'Apiñamiento'
  ];

  return (
    <div className="historia-clinica-odontologica space-y-8 p-4">
      {/* Encabezado */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-800">Historia Clínica Odontológica</h2>
        <p className="text-blue-600">Formulario completo para evaluación dental</p>
      </div>

      {/* Sección 1: Motivo de consulta */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">1. Motivo de Consulta</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo principal de consulta:
            </label>
            <textarea
              value={motivoConsulta}
              onChange={(e) => {
                setMotivoConsulta(e.target.value);
                handleChange('motivoConsulta', e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describa el motivo principal..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Historia de la enfermedad actual:
            </label>
            <textarea
              value={historiaEnfermedadActual}
              onChange={(e) => {
                setHistoriaEnfermedadActual(e.target.value);
                handleChange('historiaEnfermedadActual', e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Cronología, síntomas, tratamientos previos..."
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Antecedentes */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">2. Antecedentes Odontológicos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tratamientos previos:
            </label>
            <textarea
              value={antecedentes.tratamientosPrevios.join(', ')}
              onChange={(e) => {
                const valores = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handleAntecedentesChange('tratamientosPrevios', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ortodoncia, extracciones, endodoncias..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traumatismos dentales:
            </label>
            <textarea
              value={antecedentes.traumatismos.join(', ')}
              onChange={(e) => {
                const valores = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handleAntecedentesChange('traumatismos', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Golpes, fracturas, luxaciones..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hábitos:
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
              {opcionesHabitOS.map((habito) => (
                <label key={habito} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={antecedentes.habitos.includes(habito)}
                    onChange={(e) => {
                      const nuevosHabitos = e.target.checked
                        ? [...antecedentes.habitos, habito]
                        : antecedentes.habitos.filter(h => h !== habito);
                      handleAntecedentesChange('habitos', nuevosHabitos);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{habito}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prótesis:
            </label>
            <textarea
              value={antecedentes.protesis.join(', ')}
              onChange={(e) => {
                const valores = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handleAntecedentesChange('protesis', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Coronas, puentes, implantes..."
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Odontograma */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">3. Odontograma</h3>
        <OdontogramaSVG
          datosOdontograma={datos.odontograma}
          onOdontogramaChange={handleOdontogramaChange}
          modoEdicion={true}
          mostrarLeyenda={true}
        />
      </div>

      {/* Sección 4: Diagnóstico */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">4. Diagnóstico</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caries (piezas):
            </label>
            <textarea
              value={diagnostico.caries.join(', ')}
              onChange={(e) => {
                const valores = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handleDiagnosticoChange('caries', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ej: 16, 26, 36, 46"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfermedad periodontal:
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
              {opcionesEnfermedadPeriodontal.map((enfermedad) => (
                <label key={enfermedad} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={diagnostico.enfermedadPeriodontal.includes(enfermedad)}
                    onChange={(e) => {
                      const nuevas = e.target.checked
                        ? [...diagnostico.enfermedadPeriodontal, enfermedad]
                        : diagnostico.enfermedadPeriodontal.filter(e => e !== enfermedad);
                      handleDiagnosticoChange('enfermedadPeriodontal', nuevas);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{enfermedad}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maloclusión:
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
              {opcionesMaloclusion.map((maloclusion) => (
                <label key={maloclusion} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={diagnostico.maloclusion.includes(maloclusion)}
                    onChange={(e) => {
                      const nuevas = e.target.checked
                        ? [...diagnostico.maloclusion, maloclusion]
                        : diagnostico.maloclusion.filter(m => m !== maloclusion);
                      handleDiagnosticoChange('maloclusion', nuevas);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{maloclusion}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Otros diagnósticos:
            </label>
            <textarea
              value={diagnostico.otros.join(', ')}
              onChange={(e) => {
                const valores = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handleDiagnosticoChange('otros', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="ATM, estomatitis, lesiones..."
            />
          </div>
        </div>
      </div>

      {/* Sección 5: Higiene */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">5. Higiene y Prevención</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Índice de Placa: {higiene.indicePlaca}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={higiene.indicePlaca}
              onChange={(e) => handleHigieneChange('indicePlaca', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              0 = Sin placa, 3 = Placa abundante
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Índice de Sangrado: {higiene.indiceSangrado}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={higiene.indiceSangrado}
              onChange={(e) => handleHigieneChange('indiceSangrado', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              0 = Sin sangrado, 3 = Sangrado severo
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrucciones de higiene:
            </label>
            <textarea
              value={higiene.instruccionesHigiene.join('\n')}
              onChange={(e) => {
                const valores = e.target.value.split('\n').filter(i => i.trim());
                handleHigieneChange('instruccionesHigiene', valores);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Una por línea..."
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">Resumen del estado dental</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-blue-600">
              {diagnostico.caries.length}
            </div>
            <div className="text-sm">Piezas cariadas</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-green-600">
              {diagnostico.enfermedadPeriodontal.length}
            </div>
            <div className="text-sm">Problemas periodontales</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-orange-600">
              {diagnostico.maloclusion.length}
            </div>
            <div className="text-sm">Maloclusiones</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-2xl font-bold text-red-600">
              {higiene.indicePlaca + higiene.indiceSangrado}
            </div>
            <div className="text-sm">Índice de higiene total</div>
          </div>
        </div>
      </div>
    </div>
  );
}