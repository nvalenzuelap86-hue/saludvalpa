// ============================================================================
// saludvalpa 3.0 - DATOS PRECARGADOS DE DIAGNÓSTICOS CIE-10
// Lista de diagnósticos CIE-10 comunes para medicina general
// ============================================================================

export interface DiagnosticoCIE10 {
  codigo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
}

export const diagnosticosCIE10: DiagnosticoCIE10[] = [
  // Enfermedades del sistema respiratorio (J00-J99)
  {
    codigo: 'J00',
    descripcion: 'Rinofaringitis aguda [resfriado común]',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Infecciones respiratorias altas',
  },
  {
    codigo: 'J02.9',
    descripcion: 'Faringitis aguda, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Infecciones respiratorias altas',
  },
  {
    codigo: 'J03.9',
    descripcion: 'Amigdalitis aguda, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Infecciones respiratorias altas',
  },
  {
    codigo: 'J06.9',
    descripcion: 'Infección aguda de las vías respiratorias superiores, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Infecciones respiratorias altas',
  },
  {
    codigo: 'J18.9',
    descripcion: 'Neumonía, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Neumonía',
  },
  {
    codigo: 'J20.9',
    descripcion: 'Bronquitis aguda, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Bronquitis',
  },
  {
    codigo: 'J30.9',
    descripcion: 'Rinitis alérgica, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Alergias respiratorias',
  },
  {
    codigo: 'J45.9',
    descripcion: 'Asma, no especificada',
    categoria: 'Enfermedades respiratorias',
    subcategoria: 'Asma',
  },

  // Enfermedades del sistema circulatorio (I00-I99)
  {
    codigo: 'I10',
    descripcion: 'Hipertensión esencial (primaria)',
    categoria: 'Enfermedades cardiovasculares',
    subcategoria: 'Hipertensión',
  },
  {
    codigo: 'I25.1',
    descripcion: 'Enfermedad aterosclerótica del corazón',
    categoria: 'Enfermedades cardiovasculares',
    subcategoria: 'Cardiopatía isquémica',
  },
  {
    codigo: 'I48',
    descripcion: 'Fibrilación y aleteo auricular',
    categoria: 'Enfermedades cardiovasculares',
    subcategoria: 'Arritmias',
  },
  {
    codigo: 'I50.9',
    descripcion: 'Insuficiencia cardíaca, no especificada',
    categoria: 'Enfermedades cardiovasculares',
    subcategoria: 'Insuficiencia cardíaca',
  },
  {
    codigo: 'I73.9',
    descripcion: 'Enfermedad vascular periférica, no especificada',
    categoria: 'Enfermedades cardiovasculares',
    subcategoria: 'Enfermedad vascular',
  },

  // Enfermedades endocrinas, nutricionales y metabólicas (E00-E90)
  {
    codigo: 'E11.9',
    descripcion: 'Diabetes mellitus tipo 2, sin complicaciones',
    categoria: 'Enfermedades endocrinas',
    subcategoria: 'Diabetes',
  },
  {
    codigo: 'E04.9',
    descripcion: 'Bocio no tóxico, no especificado',
    categoria: 'Enfermedades endocrinas',
    subcategoria: 'Trastornos tiroideos',
  },
  {
    codigo: 'E66.9',
    descripcion: 'Obesidad, no especificada',
    categoria: 'Enfermedades endocrinas',
    subcategoria: 'Trastornos nutricionales',
  },
  {
    codigo: 'E78.5',
    descripcion: 'Hiperlipidemia, no especificada',
    categoria: 'Enfermedades endocrinas',
    subcategoria: 'Trastornos lipídicos',
  },
  {
    codigo: 'E55.9',
    descripcion: 'Deficiencia de vitamina D, no especificada',
    categoria: 'Enfermedades endocrinas',
    subcategoria: 'Deficiencias vitamínicas',
  },

  // Enfermedades del sistema digestivo (K00-K93)
  {
    codigo: 'K21.9',
    descripcion: 'Enfermedad por reflujo gastroesofágico, sin esofagitis',
    categoria: 'Enfermedades gastrointestinales',
    subcategoria: 'Enfermedades esofágicas',
  },
  {
    codigo: 'K29.7',
    descripcion: 'Gastritis, no especificada',
    categoria: 'Enfermedades gastrointestinales',
    subcategoria: 'Gastritis',
  },
  {
    codigo: 'K52.9',
    descripcion: 'Gastroenteritis y colitis no infecciosas, no especificadas',
    categoria: 'Enfermedades gastrointestinales',
    subcategoria: 'Enteritis y colitis',
  },
  {
    codigo: 'K59.0',
    descripcion: 'Estreñimiento',
    categoria: 'Enfermedades gastrointestinales',
    subcategoria: 'Trastornos funcionales',
  },
  {
    codigo: 'K80.2',
    descripcion: 'Cálculos de la vesícula biliar sin colangitis ni colecistitis',
    categoria: 'Enfermedades gastrointestinales',
    subcategoria: 'Enfermedades biliares',
  },

  // Enfermedades del sistema musculoesquelético (M00-M99)
  {
    codigo: 'M54.5',
    descripcion: 'Lumbalgia, no especificada',
    categoria: 'Enfermedades musculoesqueléticas',
    subcategoria: 'Dolor de espalda',
  },
  {
    codigo: 'M17.9',
    descripcion: 'Gonartrosis [artrosis de rodilla], no especificada',
    categoria: 'Enfermedades musculoesqueléticas',
    subcategoria: 'Artrosis',
  },
  {
    codigo: 'M25.5',
    descripcion: 'Dolor en articulación',
    categoria: 'Enfermedades musculoesqueléticas',
    subcategoria: 'Artralgias',
  },
  {
    codigo: 'M79.1',
    descripcion: 'Mialgia',
    categoria: 'Enfermedades musculoesqueléticas',
    subcategoria: 'Dolor muscular',
  },
  {
    codigo: 'M62.8',
    descripcion: 'Otros trastornos musculares especificados',
    categoria: 'Enfermedades musculoesqueléticas',
    subcategoria: 'Trastornos musculares',
  },

  // Enfermedades del sistema nervioso (G00-G99)
  {
    codigo: 'G43.9',
    descripcion: 'Migraña, no especificada',
    categoria: 'Enfermedades neurológicas',
    subcategoria: 'Cefaleas',
  },
  {
    codigo: 'G47.0',
    descripcion: 'Trastornos del inicio y el mantenimiento del sueño [insomnio]',
    categoria: 'Enfermedades neurológicas',
    subcategoria: 'Trastornos del sueño',
  },
  {
    codigo: 'G56.0',
    descripcion: 'Síndrome del túnel carpiano',
    categoria: 'Enfermedades neurológicas',
    subcategoria: 'Neuropatías',
  },
  {
    codigo: 'G93.3',
    descripcion: 'Síndrome de fatiga postviral',
    categoria: 'Enfermedades neurológicas',
    subcategoria: 'Síndromes',
  },

  // Enfermedades infecciosas y parasitarias (A00-B99)
  {
    codigo: 'A09',
    descripcion: 'Gastroenteritis y colitis de origen infeccioso',
    categoria: 'Enfermedades infecciosas',
    subcategoria: 'Infecciones gastrointestinales',
  },
  {
    codigo: 'B34.9',
    descripcion: 'Infección viral, no especificada',
    categoria: 'Enfermedades infecciosas',
    subcategoria: 'Infecciones virales',
  },
  {
    codigo: 'A49.9',
    descripcion: 'Infección bacteriana, no especificada',
    categoria: 'Enfermedades infecciosas',
    subcategoria: 'Infecciones bacterianas',
  },
  {
    codigo: 'B02.9',
    descripcion: 'Herpes zóster sin complicación',
    categoria: 'Enfermedades infecciosas',
    subcategoria: 'Infecciones virales',
  },

  // Trastornos mentales y del comportamiento (F00-F99)
  {
    codigo: 'F41.9',
    descripcion: 'Trastorno de ansiedad, no especificado',
    categoria: 'Trastornos mentales',
    subcategoria: 'Trastornos de ansiedad',
  },
  {
    codigo: 'F32.9',
    descripcion: 'Episodio depresivo, no especificado',
    categoria: 'Trastornos mentales',
    subcategoria: 'Trastornos del estado de ánimo',
  },
  {
    codigo: 'F43.2',
    descripcion: 'Trastornos de adaptación',
    categoria: 'Trastornos mentales',
    subcategoria: 'Trastornos relacionados con estrés',
  },
  {
    codigo: 'F51.0',
    descripcion: 'Insomnio no orgánico',
    categoria: 'Trastornos mentales',
    subcategoria: 'Trastornos del sueño',
  },

  // Enfermedades de la piel y tejido subcutáneo (L00-L99)
  {
    codigo: 'L20.9',
    descripcion: 'Dermatitis atópica, no especificada',
    categoria: 'Enfermedades de la piel',
    subcategoria: 'Dermatitis',
  },
  {
    codigo: 'L30.9',
    descripcion: 'Dermatitis, no especificada',
    categoria: 'Enfermedades de la piel',
    subcategoria: 'Dermatitis',
  },
  {
    codigo: 'L70.0',
    descripcion: 'Acné vulgar',
    categoria: 'Enfermedades de la piel',
    subcategoria: 'Trastornos de las glándulas sebáceas',
  },
  {
    codigo: 'L03.9',
    descripcion: 'Celulitis, no especificada',
    categoria: 'Enfermedades de la piel',
    subcategoria: 'Infecciones de la piel',
  },

  // Enfermedades del sistema genitourinario (N00-N99)
  {
    codigo: 'N39.0',
    descripcion: 'Infección de vías urinarias, sitio no especificado',
    categoria: 'Enfermedades genitourinarias',
    subcategoria: 'Infecciones urinarias',
  },
  {
    codigo: 'N40',
    descripcion: 'Hiperplasia de la próstata',
    categoria: 'Enfermedades genitourinarias',
    subcategoria: 'Trastornos prostáticos',
  },
  {
    codigo: 'N70.9',
    descripcion: 'Enfermedad inflamatoria pélvica, no especificada',
    categoria: 'Enfermedades genitourinarias',
    subcategoria: 'Enfermedades inflamatorias',
  },

  // Síntomas, signos y hallazgos anormales (R00-R99)
  {
    codigo: 'R07.4',
    descripcion: 'Dolor torácico, no especificado',
    categoria: 'Síntomas y signos',
    subcategoria: 'Dolor',
  },
  {
    codigo: 'R10.4',
    descripcion: 'Dolor abdominal, no especificado',
    categoria: 'Síntomas y signos',
    subcategoria: 'Dolor',
  },
  {
    codigo: 'R51',
    descripcion: 'Cefalea',
    categoria: 'Síntomas y signos',
    subcategoria: 'Dolor',
  },
  {
    codigo: 'R53',
    descripcion: 'Malestar y fatiga',
    categoria: 'Síntomas y signos',
    subcategoria: 'Síntomas generales',
  },
  {
    codigo: 'R55',
    descripcion: 'Síncope y colapso',
    categoria: 'Síntomas y signos',
    subcategoria: 'Síntomas cardiovasculares',
  },
];

export default diagnosticosCIE10;