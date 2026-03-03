import { useState } from 'react';
import Card from '../../../../components/shared/Card';
import Button from '../../../../components/shared/Button';

interface ClinicalGuideline {
  id: string;
  title: string;
  category: 'diagnóstico' | 'tratamiento' | 'prevención' | 'seguimiento';
  condition: string;
  organization: string;
  year: number;
  summary: string;
  recommendations: string[];
  strength: 'fuerte' | 'moderada' | 'débil';
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
}

export default function ClinicalGuidelinesViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGuideline, setSelectedGuideline] = useState<ClinicalGuideline | null>(null);

  // Mock data - in a real app, this would come from an API or database
  const guidelines: ClinicalGuideline[] = [
    {
      id: '1',
      title: 'Manejo de Hipertensión Arterial en Adultos',
      category: 'tratamiento',
      condition: 'Hipertensión Arterial',
      organization: 'ACC/AHA',
      year: 2023,
      summary: 'Guías para el diagnóstico y tratamiento de la hipertensión arterial en adultos.',
      recommendations: [
        'Objetivo de presión arterial < 130/80 mmHg para la mayoría de pacientes',
        'Iniciar tratamiento farmacológico con IECA o ARA II como primera línea',
        'Considerar terapia combinada si presión arterial > 20/10 mmHg por encima del objetivo',
        'Evaluar daño orgánico mediante estudios de laboratorio y ecocardiograma'
      ],
      strength: 'fuerte',
      evidenceLevel: 'A'
    },
    {
      id: '2',
      title: 'Diagnóstico y Tratamiento de Diabetes Mellitus Tipo 2',
      category: 'diagnóstico',
      condition: 'Diabetes Mellitus Tipo 2',
      organization: 'ADA',
      year: 2024,
      summary: 'Criterios diagnósticos y manejo inicial de diabetes mellitus tipo 2.',
      recommendations: [
        'Diagnóstico: HbA1c ≥ 6.5%, glucosa en ayunas ≥ 126 mg/dL, o prueba de tolerancia a la glucosa anormal',
        'Objetivo de HbA1c < 7% para la mayoría de pacientes',
        'Iniciar metformina como terapia de primera línea',
        'Evaluar complicaciones micro y macrovasculares anualmente'
      ],
      strength: 'fuerte',
      evidenceLevel: 'A'
    },
    {
      id: '3',
      title: 'Prevención de Enfermedad Cardiovascular',
      category: 'prevención',
      condition: 'Enfermedad Cardiovascular',
      organization: 'ESC',
      year: 2023,
      summary: 'Recomendaciones para prevención primaria y secundaria de enfermedad cardiovascular.',
      recommendations: [
        'Evaluar riesgo cardiovascular mediante SCORE2',
        'Estatinas para pacientes con riesgo alto (>10% a 10 años)',
        'Aspirina en dosis baja para prevención secundaria',
        'Control estricto de factores de riesgo modificables'
      ],
      strength: 'moderada',
      evidenceLevel: 'B'
    },
    {
      id: '4',
      title: 'Manejo de Infección de Vías Urinarias',
      category: 'tratamiento',
      condition: 'Infección de Vías Urinarias',
      organization: 'IDSA',
      year: 2022,
      summary: 'Diagnóstico y tratamiento empírico de infecciones de vías urinarias no complicadas.',
      recommendations: [
        'Cultivo de orina antes de iniciar antibióticos en casos complicados',
        'Tratamiento empírico con nitrofurantoína o trimetoprim-sulfametoxazol por 5-7 días',
        'Evitar fluoroquinolonas como primera línea',
        'Evaluar resistencia local para guiar terapia empírica'
      ],
      strength: 'fuerte',
      evidenceLevel: 'A'
    },
    {
      id: '5',
      title: 'Seguimiento de Pacientes con Cáncer',
      category: 'seguimiento',
      condition: 'Cáncer',
      organization: 'NCCN',
      year: 2024,
      summary: 'Protocolos de seguimiento para pacientes en remisión de cáncer.',
      recommendations: [
        'Evaluación clínica cada 3-6 meses los primeros 2 años',
        'Estudios de imagen según tipo y estadio del cáncer',
        'Marcadores tumorales según indicación específica',
        'Atención a síntomas de recurrencia o complicaciones tardías'
      ],
      strength: 'moderada',
      evidenceLevel: 'B'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'diagnóstico', label: 'Diagnóstico' },
    { id: 'tratamiento', label: 'Tratamiento' },
    { id: 'prevención', label: 'Prevención' },
    { id: 'seguimiento', label: 'Seguimiento' }
  ];

  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'fuerte': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'débil': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'C': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'D': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Guías de Práctica Clínica</h2>
            <p className="text-gray-600">Acceso a recomendaciones basadas en evidencia para apoyo en decisiones clínicas</p>
          </div>
          <Button variant="outline">
            Actualizar Guías
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar guías por condición, título o contenido..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Mostrando {filteredGuidelines.length} de {guidelines.length} guías clínicas
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuidelines.map(guideline => (
            <div
              key={guideline.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => setSelectedGuideline(guideline)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{guideline.title}</h3>
                  <p className="text-sm text-gray-600">{guideline.condition}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStrengthColor(guideline.strength)}`}>
                    {guideline.strength.charAt(0).toUpperCase() + guideline.strength.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium mt-1 ${getEvidenceColor(guideline.evidenceLevel)}`}>
                    Nivel {guideline.evidenceLevel}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700 text-sm">{guideline.summary}</p>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span className="font-medium">{guideline.organization}</span>
                  <span className="mx-2">•</span>
                  <span>{guideline.year}</span>
                </div>
                <div className="capitalize">
                  {guideline.category}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {guideline.recommendations.length} recomendaciones
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuidelines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron guías que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </Card>

      {/* Guideline Detail Modal */}
      {selectedGuideline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedGuideline.title}</h2>
                <p className="text-gray-600">{selectedGuideline.condition}</p>
              </div>
              <button
                onClick={() => setSelectedGuideline(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Organización</h3>
                  <p className="text-gray-900">{selectedGuideline.organization}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Año</h3>
                  <p className="text-gray-900">{selectedGuideline.year}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Categoría</h3>
                  <p className="text-gray-900 capitalize">{selectedGuideline.category}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Fuerza de Recomendación</h3>
                  <span className={`px-3 py-1 rounded ${getStrengthColor(selectedGuideline.strength)}`}>
                    {selectedGuideline.strength.charAt(0).toUpperCase() + selectedGuideline.strength.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Nivel de Evidencia</h3>
                  <span className={`px-3 py-1 rounded ${getEvidenceColor(selectedGuideline.evidenceLevel)}`}>
                    Nivel {selectedGuideline.evidenceLevel}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Resumen</h3>
                <p className="text-gray-900">{selectedGuideline.summary}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Recomendaciones Clínicas</h3>
              <ul className="space-y-3">
                {selectedGuideline.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">Interpretación de Niveles de Evidencia</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-3 rounded">
                  <div className="font-bold text-blue-800">Nivel A</div>
                  <div className="text-sm text-blue-700">Evidencia de múltiples ensayos randomizados</div>
                </div>
                <div className="bg-purple-100 p-3 rounded">
                  <div className="font-bold text-purple-800">Nivel B</div>
                  <div className="text-sm text-purple-700">Evidencia de un solo ensayo o estudios observacionales</div>
                </div>
                <div className="bg-orange-100 p-3 rounded">
                  <div className="font-bold text-orange-800">Nivel C</div>
                  <div className="text-sm text-orange-700">Consenso de expertos, estudios de casos</div>
                </div>
                <div className="bg-red-100 p-3 rounded">
                  <div className="font-bold text-red-800">Nivel D</div>
                  <div className="text-sm text-red-700">Evidencia insuficiente o contradictoria</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedGuideline(null)}
                className="mr-3"
              >
                Cerrar
              </Button>
              <Button variant="primary">
                Aplicar a Caso Actual
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}