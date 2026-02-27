// ============================================================================
// ARCHIVO: diagnosticosDSM5.ts
// DESCRIPCIÓN: Datos precargados de diagnósticos del DSM-5 (Manual Diagnóstico
//              y Estadístico de los Trastornos Mentales, 5ª edición) para
//              psicología clínica.
// ============================================================================

export interface DiagnosticoDSM5 {
  codigo: string;
  nombre: string;
  categoria: string;
  criteriosDiagnosticos: string[];
  especificadores: string[];
  notasClinicas: string;
  diagnosticoDiferencial: string[];
  prevalencia: string;
  curso: string;
  factoresRiesgo: string[];
  comorbilidad: string[];
  tratamientoRecomendado: string[];
}

export const diagnosticosDSM5: DiagnosticoDSM5[] = [
  {
    codigo: 'F32.9',
    nombre: 'Trastorno Depresivo Mayor',
    categoria: 'Trastornos Depresivos',
    criteriosDiagnosticos: [
      'Cinco (o más) de los siguientes síntomas durante un período de 2 semanas, que representan un cambio respecto al funcionamiento previo',
      'Estado de ánimo deprimido la mayor parte del día, casi todos los días',
      'Disminución marcada del interés o placer en todas o casi todas las actividades',
      'Pérdida o aumento significativo de peso (sin hacer dieta) o disminución o aumento del apetito',
      'Insomnio o hipersomnia casi todos los días',
      'Agitación o enlentecimiento psicomotor',
      'Fatiga o pérdida de energía',
      'Sentimientos de inutilidad o culpa excesiva o inapropiada',
      'Disminución de la capacidad para pensar o concentrarse, o indecisión',
      'Pensamientos recurrentes de muerte, ideación suicida recurrente sin un plan específico, o intento de suicidio'
    ],
    especificadores: [
      'Episodio único',
      'Recurrente',
      'Leve/Moderado/Severo',
      'Con características psicóticas',
      'En remisión parcial/total',
      'Con inicio en el periparto',
      'Con patrón estacional'
    ],
    notasClinicas: 'Los síntomas causan malestar clínicamente significativo o deterioro en áreas sociales, laborales u otras áreas importantes del funcionamiento.',
    diagnosticoDiferencial: [
      'Trastorno bipolar',
      'Trastorno adaptativo con estado de ánimo deprimido',
      'Duelo normal',
      'Trastornos médicos (hipotiroidismo, etc.)',
      'Consumo de sustancias'
    ],
    prevalencia: '7% anual en adultos; mayor prevalencia en mujeres (1.5-3 veces)',
    curso: 'Variable; episodios típicamente duran varios meses si no se tratan',
    factoresRiesgo: [
      'Historia familiar de depresión',
      'Eventos vitales estresantes',
      'Enfermedades médicas crónicas',
      'Personalidad con alto neuroticismo',
      'Abuso de sustancias'
    ],
    comorbilidad: [
      'Trastornos de ansiedad',
      'Trastornos por uso de sustancias',
      'Trastornos de la personalidad',
      'Enfermedades médicas crónicas'
    ],
    tratamientoRecomendado: [
      'Terapia Cognitivo-Conductual (TCC)',
      'Terapia Interpersonal',
      'Activación conductual',
      'Antidepresivos (ISRS, IRSN)',
      'Terapia electroconvulsiva para casos severos'
    ]
  },
  {
    codigo: 'F41.1',
    nombre: 'Trastorno de Ansiedad Generalizada',
    categoria: 'Trastornos de Ansiedad',
    criteriosDiagnosticos: [
      'Ansiedad y preocupación excesivas que ocurren más días que no durante al menos 6 meses',
      'Dificultad para controlar la preocupación',
      'La ansiedad y preocupación se asocian con tres (o más) de los siguientes síntomas:',
      '1. Inquietud o sensación de estar atrapado o con los nervios de punta',
      '2. Fatigabilidad fácil',
      '3. Dificultad para concentrarse o tener la mente en blanco',
      '4. Irritabilidad',
      '5. Tensión muscular',
      '6. Alteraciones del sueño'
    ],
    especificadores: [],
    notasClinicas: 'La ansiedad, preocupación o síntomas físicos causan malestar clínicamente significativo o deterioro en áreas sociales, laborales u otras áreas importantes del funcionamiento.',
    diagnosticoDiferencial: [
      'Trastorno de pánico',
      'Fobia específica',
      'Trastorno de ansiedad social',
      'Trastorno obsesivo-compulsivo',
      'Condiciones médicas (hipertiroidismo, etc.)'
    ],
    prevalencia: '3% anual en adultos; mayor prevalencia en mujeres (2:1)',
    curso: 'Crónico, con fluctuaciones en intensidad; a menudo comienza en la adultez temprana',
    factoresRiesgo: [
      'Temperamento inhibido en la infancia',
      'Exposición a eventos estresantes',
      'Historia familiar de ansiedad',
      'Sexo femenino',
      'Bajo nivel socioeconómico'
    ],
    comorbilidad: [
      'Trastornos depresivos',
      'Otros trastornos de ansiedad',
      'Trastornos por uso de sustancias',
      'Trastornos somáticos'
    ],
    tratamientoRecomendado: [
      'Terapia Cognitivo-Conductual (TCC)',
      'Terapia de aceptación y compromiso (ACT)',
      'Entrenamiento en relajación',
      'ISRS o IRSN',
      'Benzodiacepinas (uso limitado por riesgo de dependencia)'
    ]
  },
  {
    codigo: 'F43.10',
    nombre: 'Trastorno de Estrés Postraumático',
    categoria: 'Trastornos Relacionados con Trauma y Factores de Estrés',
    criteriosDiagnosticos: [
      'Exposición a muerte real o amenazante, lesión grave o violencia sexual',
      'Presencia de uno (o más) síntomas intrusivos asociados al evento traumático',
      'Evitación persistente de estímulos asociados al evento traumático',
      'Alteraciones negativas en cogniciones y estado de ánimo',
      'Alteraciones marcadas en la activación y reactividad asociadas al evento traumático',
      'Duración de la alteración superior a 1 mes',
      'La alteración causa malestar clínicamente significativo o deterioro'
    ],
    especificadores: [
      'Con síntomas disociativos',
      'Con expresión retardada'
    ],
    notasClinicas: 'Los síntomas pueden incluir recuerdos intrusivos, pesadillas, flashbacks, evitación, alteraciones emocionales, hipervigilancia y respuestas exageradas de sobresalto.',
    diagnosticoDiferencial: [
      'Trastorno de adaptación',
      'Trastorno de ansiedad generalizada',
      'Trastorno depresivo mayor',
      'Trastorno por síntomas somáticos',
      'Traumatismo craneoencefálico'
    ],
    prevalencia: '8.7% a lo largo de la vida; mayor en veteranos de guerra, víctimas de violencia',
    curso: 'Variable; puede ser agudo (<3 meses), crónico (≥3 meses) o de inicio retardado',
    factoresRiesgo: [
      'Exposición a trauma severo',
      'Historia previa de trauma',
      'Falta de apoyo social',
      'Sexo femenino',
      'Historia familiar de trastornos mentales'
    ],
    comorbilidad: [
      'Depresión',
      'Trastornos por uso de sustancias',
      'Otros trastornos de ansiedad',
      'Trastornos de la personalidad',
      'Dolor crónico'
    ],
    tratamientoRecomendado: [
      'Terapia de procesamiento cognitivo (CPT)',
      'Terapia de exposición prolongada',
      'EMDR (Desensibilización y reprocesamiento por movimientos oculares)',
      'ISRS (sertralina, paroxetina)',
      'Prazosina para pesadillas'
    ]
  },
  {
    codigo: 'F60.3',
    nombre: 'Trastorno Límite de la Personalidad',
    categoria: 'Trastornos de la Personalidad',
    criteriosDiagnosticos: [
      'Patrón general de inestabilidad en las relaciones interpersonales, la autoimagen y la afectividad',
      'Esfuerzos frenéticos para evitar un abandono real o imaginado',
      'Patrón de relaciones interpersonales inestables e intensas',
      'Alteración de la identidad: autoimagen o sentido de sí mismo marcada y persistentemente inestable',
      'Impulsividad en al menos dos áreas que son potencialmente dañinas',
      'Comportamientos, intentos o amenazas suicidas recurrentes, o comportamiento automutilante',
      'Inestabilidad afectiva debida a una notable reactividad del estado de ánimo',
      'Sentimientos crónicos de vacío',
      'Ira inapropiada e intensa o dificultad para controlar la ira',
      'Ideación paranoide transitoria relacionada con el estrés o síntomas disociativos graves'
    ],
    especificadores: [],
    notasClinicas: 'El patrón es estable y de larga duración, y su inicio se remonta al menos a la adolescencia o al principio de la edad adulta.',
    diagnosticoDiferencial: [
      'Trastorno depresivo o bipolar',
      'Otros trastornos de la personalidad',
      'Trastorno por estrés postraumático',
      'Consumo de sustancias',
      'Condiciones médicas que afectan el estado de ánimo'
    ],
    prevalencia: '1.6% en población general; 20% en pacientes psiquiátricos hospitalizados',
    curso: 'Crónico pero con mejoría en la edad adulta media; la impulsividad tiende a disminuir con la edad',
    factoresRiesgo: [
      'Historia de abuso o negligencia en la infancia',
      'Separación o pérdida parental temprana',
      'Historia familiar de trastornos mentales',
      'Temperamento con alta reactividad emocional'
    ],
    comorbilidad: [
      'Trastornos del estado de ánimo',
      'Trastornos por uso de sustancias',
      'Trastornos de la conducta alimentaria',
      'Trastorno de estrés postraumático',
      'Otros trastornos de la personalidad'
    ],
    tratamientoRecomendado: [
      'Terapia Dialéctica Conductual (DBT)',
      'Terapia Centrada en Esquemas',
      'Terapia Basada en Mentalización (MBT)',
      'Tratamiento farmacológico sintomático',
      'Hospitalización parcial o programas intensivos ambulatorios'
    ]
  },
  {
    codigo: 'F42',
    nombre: 'Trastorno Obsesivo-Compulsivo',
    categoria: 'Trastorno Obsesivo-Compulsivo y Trastornos Relacionados',
    criteriosDiagnosticos: [
      'Presencia de obsesiones, compulsiones o ambas',
      'Las obsesiones o compulsiones consumen tiempo (más de 1 hora al día)',
      'Causan malestar clínicamente significativo o deterioro',
      'No se deben a los efectos fisiológicos de una sustancia u otra afección médica',
      'No se explican mejor por los síntomas de otro trastorno mental'
    ],
    especificadores: [
      'Con introspección buena o aceptable',
      'Con introspección pobre',
      'Con ausencia de introspección/con creencias delirantes'
    ],
    notasClinicas: 'Las obsesiones son pensamientos, impulsos o imágenes recurrentes y persistentes que se experimentan como intrusivos e no deseados. Las compulsiones son comportamientos repetitivos o actos mentales que el individuo se siente impulsado a realizar en respuesta a una obsesión.',
    diagnosticoDiferencial: [
      'Trastornos de ansiedad',
      'Trastorno de acumulación',
      'Trastorno de la conducta alimentaria',
      'Trastornos del espectro psicótico',
      'Condiciones médicas (encefalitis, etc.)'
    ],
    prevalencia: '1.2% anual; igual prevalencia en hombres y mujeres',
    curso: 'Crónico, con fluctuaciones; inicio típico en la adolescencia o adultez temprana',
    factoresRiesgo: [
      'Historia familiar de TOC',
      'Eventos estresantes de la vida',
      'Infecciones estreptocócicas (PANDAS en niños)',
      'Traumatismo craneoencefálico',
      'Sexo masculino en inicio infantil'
    ],
    comorbilidad: [
      'Trastornos de ansiedad',
      'Trastornos depresivos',
      'Trastornos por tics',
      'Trastornos de la conducta alimentaria',
      'Trastorno por déficit de atención/hiperactividad'
    ],
    tratamientoRecomendado: [
      'Terapia de exposición con prevención de respuesta (ERP)',
      'Terapia Cognitivo-Conductual (TCC)',
      'ISRS en dosis altas',
      'Clomipramina',
      'Estimulación cerebral profunda para casos refractarios'
    ]
  },
  {
    codigo: 'F40.10',
    nombre: 'Trastorno de Ansiedad Social (Fobia Social)',
    categoria: 'Trastornos de Ansiedad',
    criteriosDiagnosticos: [
      'Miedo o ansiedad intensa en una o más situaciones sociales en las que el individuo está expuesto al posible examen por parte de otras personas',
      'El individuo teme actuar de cierta manera o mostrar síntomas de ansiedad que serán evaluados negativamente',
      'Las situaciones sociales casi siempre provocan miedo o ansiedad',
      'Las situaciones sociales se evitan o se soportan con miedo o ansiedad intensos',
      'El miedo o ansiedad es desproporcionado a la amenaza real planteada por la situación social',
      'El miedo, ansiedad o evitación es persistente, típicamente dura 6 meses o más',
      'El miedo, ansiedad o evitación causa malestar clínicamente significativo o deterioro'
    ],
    especificadores: [
      'Solo actuación',
      'Generalizado'
    ],
    notasClinicas: 'En niños, la ansiedad debe ocurrir en entornos con compañeros, no solo en interacción con adultos. El miedo no se limita a hablar o actuar en público.',
    diagnosticoDiferencial: [
      'Timidez normal',
      'Trastorno de pánico',
      'Trastorno de ansiedad generalizada',
      'Trastorno depresivo mayor',
      'Trastorno del espectro autista'
    ],
    prevalencia: '7% anual; ligeramente mayor en mujeres',
    curso: 'Crónico, sin tratamiento; inicio típico en la adolescencia',
    factoresRiesgo: [
      'Temperamento inhibido',
      'Experiencias sociales negativas (acoso, humillación)',
      'Historia familiar',
      'Sobreprotección parental',
      'Factores culturales'
    ],
    comorbilidad: [
      'Depresión',
      'Otros trastornos de ansiedad',
      'Trastornos por uso de sustancias',
      'Trastornos de la conducta alimentaria'
    ],
    tratamientoRecomendado: [
      'Terapia Cognitivo-Conductual (TCC)',
      'Terapia de exposición',
      'Entrenamiento en habilidades sociales',
      'ISRS (paroxetina, sertralina)',
      'Betabloqueantes para ansiedad de desempeño'
    ]
  },
  {
    codigo: 'F50.00',
    nombre: 'Anorexia Nerviosa',
    categoria: 'Trastornos de la Conducta Alimentaria y de la Ingestión de Alimentos',
    criteriosDiagnosticos: [
      'Restricción de la ingesta energética en relación con las necesidades, que conduce a un peso corporal significativamente bajo',
      'Miedo intenso a ganar peso o a engordar, o comportamiento persistente que interfiere con el aumento de peso',
      'Alteración en la forma en que uno mismo percibe su peso o constitución corporal',
      'Influencia indebida del peso o la constitución corporal en la autoevaluación',
      'Falta de reconocimiento de la gravedad del bajo peso corporal actual'
    ],
    especificadores: [
      'Tipo restrictivo',
      'Tipo atracones/purgas'
    ],
    notasClinicas: 'El peso significativamente bajo se define como un peso inferior al mínimo normal o, para niños y adolescentes, inferior al mínimo esperado.',
    diagnosticoDiferencial: [
      'Condiciones médicas que causan pérdida de peso',
      'Trastorno depresivo mayor',
      'Trastorno obsesivo-compulsivo',
      'Bulimia nerviosa',
      'Esquizofrenia'
    ],
    prevalencia: '0.4% en mujeres jóvenes; 0.1% en hombres',
    curso: 'Variable; puede ser crónico o con recuperación completa; alta tasa de recaída',
    factoresRiesgo: [
      'Perfeccionismo',
      'Baja autoestima',
      'Historia familiar de trastornos alimentarios',
      'Presión cultural por la delgadez',
      'Deportes o profesiones que enfatizan el peso'
    ],
    comorbilidad: [
      'Depresión',
      'Ansiedad',
      'Trastorno obsesivo-compulsivo',
      'Abuso de sustancias',
      'Trastornos de la personalidad'
    ],
    tratamientoRecomendado: [
      'Terapia familiar (especialmente para adolescentes)',
      'Terapia Cognitivo-Conductual (TCC)',
      'Terapia de aceptación y compromiso (ACT)',
      'Nutrición médica y seguimiento de peso',
      'Hospitalización para casos severos'
    ]
  }
];
