/**
 * CDSS Core Engine - Motor central del Sistema de Soporte a Decisiones Clínicas
 * 
 * Este motor coordina todos los subsistemas del CDSS y proporciona una interfaz unificada
 * para la evaluación de reglas clínicas, generación de alertas y recomendaciones basadas en evidencia.
 */

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

export interface PatientContext {
  id: string;
  edad?: number;
  sexo?: 'masculino' | 'femenino' | 'otro';
  peso?: number;
  talla?: number;
  alergias?: string[];
  condicionesCronicas?: string[];
  medicamentosActuales?: string[];
  ultimaConsulta?: Date;
  grupoSanguineo?: string;
  factoresRiesgo?: string[];
}

export interface CDSSEvaluationRequest {
  pacienteId: string;
  consultaId?: string;
  contexto: PatientContext;
  datosClinicos: ClinicalData;
  accionesSolicitadas: CDSSActionType[];
}

export interface ClinicalData {
  signosVitales?: VitalSigns;
  medicamentosActuales?: Medication[];
  alergias?: Allergy[];
  diagnosticoPrincipal?: string;
  diagnosticosSecundarios?: string[];
  estudiosLaboratorio?: LabResult[];
  antecedentes?: MedicalHistory[];
}

export interface VitalSigns {
  presionArterial?: { sistolica: number; diastolica: number };
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  temperatura?: number;
  saturacionOxigeno?: number;
  peso?: number;
  talla?: number;
  imc?: number;
}

export interface Medication {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
  via: string;
  fechaInicio: Date;
  duracion?: number;
}

export interface Allergy {
  sustancia: string;
  tipoReaccion: string;
  severidad: 'leve' | 'moderada' | 'grave';
}

export interface LabResult {
  prueba: string;
  valor: number;
  unidad: string;
  fecha: Date;
  rangoNormal: { min: number; max: number };
}

export interface MedicalHistory {
  condicion: string;
  fechaDiagnostico: Date;
  estado: 'activo' | 'resuelto' | 'cronico';
  tratamiento?: string;
}

export type CDSSActionType = 
  | 'evaluarInteracciones'
  | 'evaluarRiesgos'
  | 'generarDiagnosticos'
  | 'recomendarTratamientos'
  | 'verificarGuías'
  | 'generarAlertas';

export interface CDSSEvaluationResult {
  alertas: ClinicalAlert[];
  recomendaciones: TreatmentRecommendation[];
  evaluacionesRiesgo: RiskAssessment[];
  diagnosticosDiferenciales: DifferentialDiagnosis[];
  interaccionesMedicamentosas: DrugInteraction[];
  guiasAplicables: ClinicalGuideline[];
  resumen: CDSSSummary;
}

export interface ClinicalAlert {
  id: string;
  tipo: 'interaccion' | 'contraindicacion' | 'riesgo' | 'alergia' | 'dosis' | 'monitoreo';
  severidad: 'critico' | 'alto' | 'medio' | 'bajo';
  titulo: string;
  descripcion: string;
  contexto: string;
  accionesRecomendadas: string[];
  evidencia?: string;
  fechaGeneracion: Date;
}

export interface TreatmentRecommendation {
  id: string;
  diagnostico: string;
  linea: 'primera' | 'segunda' | 'tercera';
  medicamento: string;
  dosis: string;
  duracion: string;
  nivelEvidencia: 'A' | 'B' | 'C' | 'D';
  justificacion: string;
  alternativas: string[];
}

export interface RiskAssessment {
  calculadora: string;
  resultado: number;
  interpretacion: 'bajo' | 'moderado' | 'alto' | 'muy_alto';
  factoresContribuyentes: string[];
  recomendaciones: string[];
  seguimientoRecomendado: string;
}

export interface DifferentialDiagnosis {
  diagnostico: string;
  codigoCIE10: string;
  probabilidad: 'alta' | 'media' | 'baja';
  criterios: string[];
  estudiosConfirmatorios: string[];
}

export interface DrugInteraction {
  medicamentoA: string;
  medicamentoB: string;
  tipo: 'farmacodinamica' | 'farmacocinetica' | 'fisicoquimica';
  severidad: 'contraindicado' | 'grave' | 'moderado' | 'leve';
  mecanismo: string;
  efectoClinico: string;
  recomendacion: string;
  alternativas: string[];
}

export interface ClinicalGuideline {
  organizacion: string;
  condicion: string;
  año: number;
  nivelEvidencia: 'A' | 'B' | 'C' | 'D';
  recomendacion: string;
  contextoAplicacion: string;
}

export interface CDSSSummary {
  totalAlertas: number;
  alertasCriticas: number;
  alertasAltas: number;
  recomendacionesGeneradas: number;
  riesgosIdentificados: number;
  interaccionesDetectadas: number;
  guiasAplicadas: number;
  resumenEjecutivo: string;
}

// ============================================================================
// CLASE PRINCIPAL CDSS ENGINE
// ============================================================================

/**
 * Clase principal del motor CDSS
 */
export class CDSSEngine {
  
  constructor() {}
  
  /**
   * Evalúa el contexto clínico y genera recomendaciones
   */
  async evaluate(request: CDSSEvaluationRequest): Promise<CDSSEvaluationResult> {
    console.log(`[CDSS] Iniciando evaluación para paciente ${request.pacienteId}`);
    
    const resultados: CDSSEvaluationResult = {
      alertas: [],
      recomendaciones: [],
      evaluacionesRiesgo: [],
      diagnosticosDiferenciales: [],
      interaccionesMedicamentosas: [],
      guiasAplicables: [],
      resumen: {
        totalAlertas: 0,
        alertasCriticas: 0,
        alertasAltas: 0,
        recomendacionesGeneradas: 0,
        riesgosIdentificados: 0,
        interaccionesDetectadas: 0,
        guiasAplicadas: 0,
        resumenEjecutivo: ''
      }
    };
    
    // Ejecutar evaluaciones solicitadas
    for (const accion of request.accionesSolicitadas) {
      switch (accion) {
        case 'evaluarInteracciones':
          this.evaluarInteraccionesMedicamentosas(request, resultados);
          break;
        case 'evaluarRiesgos':
          this.evaluarRiesgosClinicos(request, resultados);
          break;
        case 'generarDiagnosticos':
          this.generarDiagnosticosDiferenciales(request, resultados);
          break;
        case 'recomendarTratamientos':
          this.recomendarTratamientos(request, resultados);
          break;
        case 'verificarGuías':
          this.verificarGuiasClinicas(request, resultados);
          break;
        case 'generarAlertas':
          this.generarAlertasClinicas(request, resultados);
          break;
      }
    }
    
    // Generar resumen ejecutivo
    resultados.resumen = this.generarResumen(resultados);
    
    console.log(`[CDSS] Evaluación completada: ${resultados.resumen.totalAlertas} alertas, ${resultados.resumen.recomendacionesGeneradas} recomendaciones`);
    
    return resultados;
  }
  
  /**
   * Evalúa interacciones medicamentosas
   */
  private evaluarInteraccionesMedicamentosas(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    if (!request.datosClinicos.medicamentosActuales || 
        request.datosClinicos.medicamentosActuales.length < 2) {
      return;
    }
    
    // Simulación de evaluación de interacciones
    const medicamentos = request.datosClinicos.medicamentosActuales;
    
    for (let i = 0; i < medicamentos.length; i++) {
      for (let j = i + 1; j < medicamentos.length; j++) {
        const medA = medicamentos[i];
        const medB = medicamentos[j];
        
        // Verificar interacción conocida (simulación)
        const interaccion = this.detectarInteraccion(medA.nombre, medB.nombre);
        if (interaccion) {
          resultados.interaccionesMedicamentosas.push(interaccion);
          
          // Generar alerta correspondiente
          resultados.alertas.push({
            id: `interaccion-${Date.now()}-${i}-${j}`,
            tipo: 'interaccion',
            severidad: this.mapearSeveridadInteraccion(interaccion.severidad),
            titulo: `Interacción medicamentosa: ${medA.nombre} + ${medB.nombre}`,
            descripcion: interaccion.efectoClinico,
            contexto: `Paciente está tomando ${medA.nombre} y ${medB.nombre} simultáneamente`,
            accionesRecomendadas: [interaccion.recomendacion, ...interaccion.alternativas.map(a => `Considerar alternativa: ${a}`)],
            evidencia: `Mecanismo: ${interaccion.mecanismo}`,
            fechaGeneracion: new Date()
          });
        }
      }
    }
  }
  
  /**
   * Evalúa riesgos clínicos
   */
  private evaluarRiesgosClinicos(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    // Evaluar riesgo cardiovascular si hay datos disponibles
    if (request.datosClinicos.signosVitales) {
      const riesgoCV = this.calcularRiesgoCardiovascular(request.datosClinicos);
      if (riesgoCV) {
        resultados.evaluacionesRiesgo.push(riesgoCV);
        
        if (riesgoCV.interpretacion === 'alto' || riesgoCV.interpretacion === 'muy_alto') {
          resultados.alertas.push({
            id: `riesgo-cv-${Date.now()}`,
            tipo: 'riesgo',
            severidad: 'alto',
            titulo: `Riesgo cardiovascular ${riesgoCV.interpretacion.toUpperCase()}`,
            descripcion: `Score de riesgo: ${riesgoCV.resultado}`,
            contexto: 'Evaluación basada en signos vitales y factores de riesgo',
            accionesRecomendadas: riesgoCV.recomendaciones,
            evidencia: 'Calculadora de riesgo cardiovascular basada en Framingham',
            fechaGeneracion: new Date()
          });
        }
      }
    }
  }
  
  /**
   * Genera diagnósticos diferenciales
   */
  private generarDiagnosticosDiferenciales(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    if (!request.datosClinicos.diagnosticoPrincipal) {
      return;
    }
    
    // Simulación de generación de diagnósticos diferenciales
    const diagnosticos = this.getDifferentialDiagnoses(request.datosClinicos.diagnosticoPrincipal);
    resultados.diagnosticosDiferenciales.push(...diagnosticos);
  }
  
  /**
   * Recomienda tratamientos basados en evidencia
   */
  private recomendarTratamientos(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    if (!request.datosClinicos.diagnosticoPrincipal) {
      return;
    }
    
    const recomendaciones = this.getTreatmentRecommendations(request.datosClinicos.diagnosticoPrincipal, request.contexto);
    resultados.recomendaciones.push(...recomendaciones);
  }
  
  /**
   * Verifica guías clínicas aplicables
   */
  private verificarGuiasClinicas(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    const guias = this.getApplicableGuidelines(request.datosClinicos.diagnosticoPrincipal || '', request.contexto);
    resultados.guiasAplicables.push(...guias);
  }
  
  /**
   * Genera alertas clínicas
   */
  private generarAlertasClinicas(
    request: CDSSEvaluationRequest, 
    resultados: CDSSEvaluationResult
  ): void {
    const alertas = this.generateAlerts(request.contexto, request.datosClinicos);
    resultados.alertas.push(...alertas);
  }
  
  /**
   * Detecta interacción entre dos medicamentos (simulación)
   */
  private detectarInteraccion(
    medicamentoA: string, 
    medicamentoB: string
  ): DrugInteraction | null {
    // Base de datos simulada de interacciones comunes
    const interaccionesConocidas: Record<string, DrugInteraction> = {
      'warfarin-aspirin': {
        medicamentoA: 'Warfarina',
        medicamentoB: 'Aspirina',
        tipo: 'farmacodinamica',
        severidad: 'grave',
        mecanismo: 'Potenciación del efecto anticoagulante',
        efectoClinico: 'Aumento del riesgo de sangrado',
        recomendacion: 'Monitorizar INR frecuentemente, considerar ajuste de dosis',
        alternativas: ['Paracetamol para analgesia', 'Clopidogrel como antiagregante alternativo']
      },
      'simvastatin-amlodipine': {
        medicamentoA: 'Simvastatina',
        medicamentoB: 'Amlodipino',
        tipo: 'farmacocinetica',
        severidad: 'moderado',
        mecanismo: 'Inhibición del CYP3A4 aumentando niveles de simvastatina',
        efectoClinico: 'Aumento del riesgo de miopatía y rabdomiólisis',
        recomendacion: 'Considerar reducir dosis de simvastatina o cambiar a pravastatina',
        alternativas: ['Pravastatina', 'Rosuvastatina']
      }
    };
    
    const key = `${medicamentoA.toLowerCase()}-${medicamentoB.toLowerCase()}`;
    const keyInversa = `${medicamentoB.toLowerCase()}-${medicamentoA.toLowerCase()}`;
    
    return interaccionesConocidas[key] || interaccionesConocidas[keyInversa] || null;
  }
  
  /**
   * Mapea severidad de interacción a severidad de alerta
   */
  private mapearSeveridadInteraccion(severidad: DrugInteraction['severidad']): ClinicalAlert['severidad'] {
    switch (severidad) {
      case 'contraindicado': return 'critico';
      case 'grave': return 'alto';
      case 'moderado': return 'medio';
      case 'leve': return 'bajo';
      default: return 'medio';
    }
  }
  
  /**
   * Calcula riesgo cardiovascular (simulación)
   */
  private calcularRiesgoCardiovascular(datosClinicos: ClinicalData): RiskAssessment | null {
    if (!datosClinicos.signosVitales) return null;
    
    const vs = datosClinicos.signosVitales;
    
    // Cálculo simplificado del riesgo cardiovascular
    let score = 0;
    
    // Edad (simulada)
    score += 5; // Base
    
    // Presión arterial
    if (vs.presionArterial) {
      if (vs.presionArterial.sistolica >= 140 || vs.presionArterial.diastolica >= 90) {
        score += 3;
      }
    }
    
    // IMC
    if (vs.imc) {
      if (vs.imc >= 30) score += 2;
      else if (vs.imc >= 25) score += 1;
    }
    
    // Interpretación
    let interpretacion: RiskAssessment['interpretacion'] = 'bajo';
    if (score >= 8) interpretacion = 'muy_alto';
    else if (score >= 6) interpretacion = 'alto';
    else if (score >= 4) interpretacion = 'moderado';
    
    const factores: string[] = [];
    if (vs?.presionArterial && (vs.presionArterial.sistolica >= 140 || vs.presionArterial.diastolica >= 90)) {
      factores.push('Hipertensión arterial');
    }
    if (vs?.imc && vs.imc >= 25) {
      factores.push(vs.imc >= 30 ? 'Obesidad' : 'Sobrepeso');
    }
    factores.push('Edad (factor de riesgo base)');
    
    const recomendaciones: string[] = [
      'Dieta baja en sodio y grasas saturadas',
      'Ejercicio aeróbico regular (150 min/semana)',
      'Control de peso',
      'No fumar',
      'Limitación de alcohol'
    ];
    
    if (interpretacion === 'muy_alto' || interpretacion === 'alto') {
      recomendaciones.push('Evaluación cardiológica urgente');
      recomendaciones.push('Iniciar tratamiento farmacológico según guías');
    }
    
    return {
      calculadora: 'Riesgo Cardiovascular Simplificado',
      resultado: score,
      interpretacion,
      factoresContribuyentes: factores,
      recomendaciones,
      seguimientoRecomendado: interpretacion === 'muy_alto' || interpretacion === 'alto' 
        ? 'Evaluación cardiológica en 1 mes' 
        : 'Control anual'
    };
  }
  
  /**
   * Obtiene diagnósticos diferenciales (simulación)
   */
  private getDifferentialDiagnoses(diagnostico: string): DifferentialDiagnosis[] {
    // Base de conocimiento simplificada
    const baseConocimiento: Record<string, DifferentialDiagnosis[]> = {
      'dolor_toracico': [
        {
          diagnostico: 'Angina de pecho',
          codigoCIE10: 'I20.9',
          probabilidad: 'alta',
          criterios: ['Dolor opresivo', 'Irradiación a brazo izquierdo', 'Relación con esfuerzo'],
          estudiosConfirmatorios: ['Electrocardiograma', 'Enzimas cardíacas', 'Prueba de esfuerzo']
        },
        {
          diagnostico: 'Reflujo gastroesofágico',
          codigoCIE10: 'K21.9',
          probabilidad: 'media',
          criterios: ['Pirosis', 'Relación con alimentos', 'Mejora con antiácidos'],
          estudiosConfirmatorios: ['Endoscopia', 'pH-metría esofágica']
        }
      ],
      'cefalea': [
        {
          diagnostico: 'Migraña',
          codigoCIE10: 'G43.9',
          probabilidad: 'alta',
          criterios: ['Dolor pulsátil unilateral', 'Fotofobia', 'Náuseas'],
          estudiosConfirmatorios: ['Evaluación neurológica', 'Tomografía cerebral']
        },
        {
          diagnostico: 'Cefalea tensional',
          codigoCIE10: 'G44.209',
          probabilidad: 'media',
          criterios: ['Dolor en banda', 'Relación con estrés', 'Sin síntomas asociados'],
          estudiosConfirmatorios: ['Evaluación clínica']
        }
      ]
    };
    
    return baseConocimiento[diagnostico.toLowerCase()] || [];
  }
  
  /**
   * Obtiene recomendaciones de tratamiento (simulación)
   */
  private getTreatmentRecommendations(diagnostico: string, contexto: PatientContext): TreatmentRecommendation[] {
    const recomendaciones: TreatmentRecommendation[] = [];
    
    if (diagnostico.toLowerCase() === 'hipertension_arterial') {
      recomendaciones.push({
        id: 'htn-1',
        diagnostico: 'Hipertensión arterial',
        linea: 'primera',
        medicamento: 'Lisinopril',
        dosis: '10 mg',
        duracion: 'Diario',
        nivelEvidencia: 'A',
        justificacion: 'IECA de primera línea para hipertensión sin contraindicaciones',
        alternativas: ['Losartán', 'Amlodipino', 'Hidroclorotiazida']
      });
    }
    
    if (diagnostico.toLowerCase() === 'diabetes_tipo_2') {
      recomendaciones.push({
        id: 'dm2-1',
        diagnostico: 'Diabetes tipo 2',
        linea: 'primera',
        medicamento: 'Metformina',
        dosis: '500 mg',
        duracion: '2 veces al día',
        nivelEvidencia: 'A',
        justificacion: 'Fármaco de primera línea para diabetes tipo 2',
        alternativas: ['Glimepirida', 'Sitagliptina', 'Insulina']
      });
    }
    
    return recomendaciones;
  }
  
  /**
   * Obtiene guías clínicas aplicables (simulación)
   */
  private getApplicableGuidelines(diagnostico: string, contexto: PatientContext): ClinicalGuideline[] {
    const guias: ClinicalGuideline[] = [];
    
    if (diagnostico.toLowerCase() === 'hipertension_arterial') {
      guias.push({
        organizacion: 'American Heart Association',
        condicion: 'Hipertensión arterial',
        año: 2023,
        nivelEvidencia: 'A',
        recomendacion: 'Meta de presión arterial <130/80 mmHg para la mayoría de adultos',
        contextoAplicacion: 'Pacientes adultos sin condiciones especiales'
      });
    }
    
    if (diagnostico.toLowerCase() === 'diabetes_tipo_2') {
      guias.push({
        organizacion: 'American Diabetes Association',
        condicion: 'Diabetes tipo 2',
        año: 2024,
        nivelEvidencia: 'A',
        recomendacion: 'Meta de HbA1c <7% para la mayoría de pacientes',
        contextoAplicacion: 'Pacientes adultos con diabetes tipo 2'
      });
    }
    
    return guias;
  }
  
  /**
   * Genera alertas clínicas (simulación)
   */
  private generateAlerts(contexto: PatientContext, datosClinicos: ClinicalData): ClinicalAlert[] {
    const alertas: ClinicalAlert[] = [];
    
    // Alerta: Presión arterial elevada
    if (datosClinicos.signosVitales?.presionArterial) {
      const pa = datosClinicos.signosVitales.presionArterial;
      if (pa.sistolica >= 180 || pa.diastolica >= 120) {
        alertas.push({
          id: `pa-crisis-${Date.now()}`,
          tipo: 'riesgo',
          severidad: 'critico',
          titulo: 'Crisis hipertensiva',
          descripcion: `Presión arterial ${pa.sistolica}/${pa.diastolica} mmHg - Requiere atención inmediata`,
          contexto: 'Valores compatibles con emergencia hipertensiva',
          accionesRecomendadas: ['Evaluación urgente', 'Tratamiento antihipertensivo inmediato', 'Monitorización continua'],
          evidencia: 'Guías AHA para crisis hipertensiva',
          fechaGeneracion: new Date()
        });
      }
    }
    
    // Alerta: Frecuencia cardíaca anormal
    if (datosClinicos.signosVitales?.frecuenciaCardiaca) {
      const fc = datosClinicos.signosVitales.frecuenciaCardiaca;
      if (fc < 50 || fc > 120) {
        alertas.push({
          id: `fc-anormal-${Date.now()}`,
          tipo: 'monitoreo',
          severidad: fc < 40 || fc > 140 ? 'alto' : 'medio',
          titulo: 'Frecuencia cardíaca anormal',
          descripcion: `Frecuencia cardíaca: ${fc} lpm (rango normal: 60-100 lpm)`,
          contexto: 'Valor fuera de rango normal',
          accionesRecomendadas: ['Evaluar síntomas asociados', 'Revisar medicamentos que afecten FC', 'Considerar ECG'],
          evidencia: 'Rango normal de frecuencia cardíaca adulta',
          fechaGeneracion: new Date()
        });
      }
    }
    
    return alertas;
  }
  
  /**
   * Genera resumen de la evaluación
   */
  private generarResumen(resultados: CDSSEvaluationResult): CDSSSummary {
    const totalAlertas = resultados.alertas.length;
    const alertasCriticas = resultados.alertas.filter(a => a.severidad === 'critico').length;
    const alertasAltas = resultados.alertas.filter(a => a.severidad === 'alto').length;
    
    let resumenEjecutivo = '';
    if (totalAlertas === 0) {
      resumenEjecutivo = 'No se detectaron alertas críticas. Evaluación dentro de parámetros normales.';
    } else if (alertasCriticas > 0) {
      resumenEjecutivo = `Se detectaron ${alertasCriticas} alertas CRÍTICAS que requieren atención inmediata.`;
    } else if (alertasAltas > 0) {
      resumenEjecutivo = `Se detectaron ${alertasAltas} alertas de ALTA prioridad que requieren revisión.`;
    } else {
      resumenEjecutivo = `Se detectaron ${totalAlertas} alertas de prioridad media/baja para revisión.`;
    }
    
    return {
      totalAlertas,
      alertasCriticas,
      alertasAltas,
      recomendacionesGeneradas: resultados.recomendaciones.length,
      riesgosIdentificados: resultados.evaluacionesRiesgo.length,
      interaccionesDetectadas: resultados.interaccionesMedicamentosas.length,
      guiasAplicadas: resultados.guiasAplicables.length,
      resumenEjecutivo
    };
  }
}
