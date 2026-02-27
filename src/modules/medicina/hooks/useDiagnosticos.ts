// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE DIAGNÓSTICOS CIE-10
// Hook personalizado para gestionar diagnósticos y códigos CIE-10
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

interface DiagnosticoCIE10 {
  codigo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
}

interface UseDiagnosticosReturn {
  // Estado
  diagnosticos: DiagnosticoCIE10[];
  diagnosticosFiltrados: DiagnosticoCIE10[];
  diagnosticosSeleccionados: string[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  buscarDiagnosticos: (termino: string) => void;
  seleccionarDiagnostico: (codigo: string) => void;
  deseleccionarDiagnostico: (codigo: string) => void;
  limpiarSeleccion: () => void;
  cargarDiagnosticosCIE10: () => Promise<void>;
  obtenerDescripcionPorCodigo: (codigo: string) => string;
}

export default function useDiagnosticos(): UseDiagnosticosReturn {
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoCIE10[]>([]);
  const [diagnosticosFiltrados, setDiagnosticosFiltrados] = useState<DiagnosticoCIE10[]>([]);
  const [diagnosticosSeleccionados, setDiagnosticosSeleccionados] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar diagnósticos CIE-10 al iniciar
  useEffect(() => {
    cargarDiagnosticosCIE10();
  }, []);

  const cargarDiagnosticosCIE10 = useCallback(async () => {
    try {
      setCargando(true);
      
      // En una implementación real, esto cargaría desde una API o archivo JSON
      // Por ahora, usamos datos de ejemplo de diagnósticos comunes
      const diagnosticosEjemplo: DiagnosticoCIE10[] = [
        // Enfermedades respiratorias
        { codigo: 'J06.9', descripcion: 'Infección aguda de las vías respiratorias superiores, no especificada', categoria: 'Enfermedades respiratorias' },
        { codigo: 'J18.9', descripcion: 'Neumonía, no especificada', categoria: 'Enfermedades respiratorias' },
        { codigo: 'J45.9', descripcion: 'Asma, no especificada', categoria: 'Enfermedades respiratorias' },
        { codigo: 'J20.9', descripcion: 'Bronquitis aguda, no especificada', categoria: 'Enfermedades respiratorias' },
        
        // Enfermedades cardiovasculares
        { codigo: 'I10', descripcion: 'Hipertensión esencial (primaria)', categoria: 'Enfermedades cardiovasculares' },
        { codigo: 'I25.1', descripcion: 'Enfermedad aterosclerótica del corazón', categoria: 'Enfermedades cardiovasculares' },
        { codigo: 'I48', descripcion: 'Fibrilación y aleteo auricular', categoria: 'Enfermedades cardiovasculares' },
        { codigo: 'I50.9', descripcion: 'Insuficiencia cardíaca, no especificada', categoria: 'Enfermedades cardiovasculares' },
        
        // Enfermedades endocrinas
        { codigo: 'E11.9', descripcion: 'Diabetes mellitus tipo 2, sin complicaciones', categoria: 'Enfermedades endocrinas' },
        { codigo: 'E04.9', descripcion: 'Bocio no tóxico, no especificado', categoria: 'Enfermedades endocrinas' },
        { codigo: 'E66.9', descripcion: 'Obesidad, no especificada', categoria: 'Enfermedades endocrinas' },
        { codigo: 'E78.5', descripcion: 'Hiperlipidemia, no especificada', categoria: 'Enfermedades endocrinas' },
        
        // Enfermedades gastrointestinales
        { codigo: 'K29.7', descripcion: 'Gastritis, no especificada', categoria: 'Enfermedades gastrointestinales' },
        { codigo: 'K21.9', descripcion: 'Enfermedad por reflujo gastroesofágico, sin esofagitis', categoria: 'Enfermedades gastrointestinales' },
        { codigo: 'K59.0', descripcion: 'Estreñimiento', categoria: 'Enfermedades gastrointestinales' },
        { codigo: 'K52.9', descripcion: 'Gastroenteritis y colitis no infecciosas, no especificadas', categoria: 'Enfermedades gastrointestinales' },
        
        // Enfermedades musculoesqueléticas
        { codigo: 'M54.5', descripcion: 'Lumbalgia, no especificada', categoria: 'Enfermedades musculoesqueléticas' },
        { codigo: 'M25.5', descripcion: 'Dolor en articulación', categoria: 'Enfermedades musculoesqueléticas' },
        { codigo: 'M17.9', descripcion: 'Gonartrosis [artrosis de rodilla], no especificada', categoria: 'Enfermedades musculoesqueléticas' },
        { codigo: 'M79.1', descripcion: 'Mialgia', categoria: 'Enfermedades musculoesqueléticas' },
        
        // Enfermedades infecciosas
        { codigo: 'A09', descripcion: 'Gastroenteritis y colitis de origen infeccioso', categoria: 'Enfermedades infecciosas' },
        { codigo: 'B34.9', descripcion: 'Infección viral, no especificada', categoria: 'Enfermedades infecciosas' },
        { codigo: 'A49.9', descripcion: 'Infección bacteriana, no especificada', categoria: 'Enfermedades infecciosas' },
        { codigo: 'B99', descripcion: 'Otras enfermedades infecciosas y las no especificadas', categoria: 'Enfermedades infecciosas' },
        
        // Trastornos mentales
        { codigo: 'F41.9', descripcion: 'Trastorno de ansiedad, no especificado', categoria: 'Trastornos mentales' },
        { codigo: 'F32.9', descripcion: 'Episodio depresivo, no especificado', categoria: 'Trastornos mentales' },
        { codigo: 'F43.2', descripcion: 'Trastornos de adaptación', categoria: 'Trastornos mentales' },
        { codigo: 'G47.0', descripcion: 'Trastornos del inicio y el mantenimiento del sueño [insomnio]', categoria: 'Trastornos mentales' },
        
        // Enfermedades de la piel
        { codigo: 'L30.9', descripcion: 'Dermatitis, no especificada', categoria: 'Enfermedades de la piel' },
        { codigo: 'L20.9', descripcion: 'Dermatitis atópica, no especificada', categoria: 'Enfermedades de la piel' },
        { codigo: 'L70.0', descripcion: 'Acné vulgar', categoria: 'Enfermedades de la piel' },
        { codigo: 'B02.9', descripcion: 'Herpes zóster sin complicación', categoria: 'Enfermedades de la piel' },
      ];

      setDiagnosticos(diagnosticosEjemplo);
      setDiagnosticosFiltrados(diagnosticosEjemplo);
      setError(null);
    } catch (err) {
      setError('Error al cargar diagnósticos CIE-10');
      console.error('Error cargando diagnósticos CIE-10:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarDiagnosticos = useCallback((termino: string) => {
    if (!termino.trim()) {
      setDiagnosticosFiltrados(diagnosticos);
      return;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    const filtrados = diagnosticos.filter(diag => 
      diag.codigo.toLowerCase().includes(terminoLower) ||
      diag.descripcion.toLowerCase().includes(terminoLower) ||
      diag.categoria.toLowerCase().includes(terminoLower)
    );
    
    setDiagnosticosFiltrados(filtrados);
  }, [diagnosticos]);

  const seleccionarDiagnostico = useCallback((codigo: string) => {
    if (!diagnosticosSeleccionados.includes(codigo)) {
      setDiagnosticosSeleccionados(prev => [...prev, codigo]);
    }
  }, [diagnosticosSeleccionados]);

  const deseleccionarDiagnostico = useCallback((codigo: string) => {
    setDiagnosticosSeleccionados(prev => prev.filter(c => c !== codigo));
  }, []);

  const limpiarSeleccion = useCallback(() => {
    setDiagnosticosSeleccionados([]);
  }, []);

  const obtenerDescripcionPorCodigo = useCallback((codigo: string): string => {
    const diagnostico = diagnosticos.find(d => d.codigo === codigo);
    return diagnostico ? `${diagnostico.codigo} - ${diagnostico.descripcion}` : `Código no encontrado: ${codigo}`;
  }, [diagnosticos]);

  return {
    // Estado
    diagnosticos,
    diagnosticosFiltrados,
    diagnosticosSeleccionados,
    cargando,
    error,
    
    // Acciones
    buscarDiagnosticos,
    seleccionarDiagnostico,
    deseleccionarDiagnostico,
    limpiarSeleccion,
    cargarDiagnosticosCIE10,
    obtenerDescripcionPorCodigo,
  };
}