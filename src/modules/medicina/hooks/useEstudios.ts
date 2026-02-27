// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE ESTUDIOS DE LABORATORIO
// Hook personalizado para gestionar estudios de laboratorio y gabinete
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

interface EstudioLaboratorio {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preparacion?: string;
  indicaciones?: string;
  tiempoResultado?: string;
}

interface OrdenEstudio {
  id: string;
  pacienteId: string;
  estudios: EstudioLaboratorio[];
  fechaOrden: string;
  fechaRealizacion?: string;
  resultados?: string;
  estado: 'pendiente' | 'realizado' | 'cancelado';
  notas?: string;
}

interface UseEstudiosReturn {
  // Estado
  estudios: EstudioLaboratorio[];
  estudiosFiltrados: EstudioLaboratorio[];
  ordenesEstudio: OrdenEstudio[];
  estudiosSeleccionados: EstudioLaboratorio[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  buscarEstudios: (termino: string) => void;
  seleccionarEstudio: (estudio: EstudioLaboratorio) => void;
  deseleccionarEstudio: (id: string) => void;
  limpiarSeleccion: () => void;
  cargarEstudiosPrecargados: () => Promise<void>;
  crearOrdenEstudio: (pacienteId: string, notas?: string) => Promise<string>;
  actualizarResultados: (ordenId: string, resultados: string) => Promise<void>;
  marcarComoRealizado: (ordenId: string, fechaRealizacion: string) => Promise<void>;
  obtenerOrdenesPorPaciente: (pacienteId: string) => OrdenEstudio[];
}

export default function useEstudios(): UseEstudiosReturn {
  const [estudios, setEstudios] = useState<EstudioLaboratorio[]>([]);
  const [estudiosFiltrados, setEstudiosFiltrados] = useState<EstudioLaboratorio[]>([]);
  const [ordenesEstudio, setOrdenesEstudio] = useState<OrdenEstudio[]>([]);
  const [estudiosSeleccionados, setEstudiosSeleccionados] = useState<EstudioLaboratorio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estudios precargados al iniciar
  useEffect(() => {
    cargarEstudiosPrecargados();
  }, []);

  const cargarEstudiosPrecargados = useCallback(async () => {
    try {
      setCargando(true);
      
      // Estudios de laboratorio comunes
      const estudiosEjemplo: EstudioLaboratorio[] = [
        // Hematología
        { id: 'hemo-1', nombre: 'Biometría Hemática Completa', categoria: 'Hematología', descripcion: 'Evaluación de células sanguíneas', preparacion: 'Ayuno de 8 horas', tiempoResultado: '24 horas' },
        { id: 'hemo-2', nombre: 'Velocidad de Sedimentación Globular (VSG)', categoria: 'Hematología', descripcion: 'Medición de inflamación', tiempoResultado: '2 horas' },
        { id: 'hemo-3', nombre: 'Tiempo de Protrombina (TP)', categoria: 'Hematología', descripcion: 'Evaluación de coagulación', preparacion: 'Sin preparación especial', tiempoResultado: '4 horas' },
        
        // Química sanguínea
        { id: 'quim-1', nombre: 'Glucosa en Ayunas', categoria: 'Química Sanguínea', descripcion: 'Nivel de glucosa en sangre', preparacion: 'Ayuno de 8-12 horas', tiempoResultado: '2 horas' },
        { id: 'quim-2', nombre: 'Perfil Lipídico', categoria: 'Química Sanguínea', descripcion: 'Colesterol total, HDL, LDL, triglicéridos', preparacion: 'Ayuno de 12 horas', tiempoResultado: '24 horas' },
        { id: 'quim-3', nombre: 'Función Hepática', categoria: 'Química Sanguínea', descripcion: 'Transaminasas, bilirrubina, fosfatasa alcalina', preparacion: 'Ayuno de 8 horas', tiempoResultado: '24 horas' },
        { id: 'quim-4', nombre: 'Función Renal', categoria: 'Química Sanguínea', descripcion: 'Urea, creatinina, ácido úrico', preparacion: 'Ayuno de 8 horas', tiempoResultado: '24 horas' },
        { id: 'quim-5', nombre: 'Electrolitos Séricos', categoria: 'Química Sanguínea', descripcion: 'Sodio, potasio, cloro, calcio', preparacion: 'Sin preparación especial', tiempoResultado: '4 horas' },
        
        // Orina
        { id: 'orin-1', nombre: 'Examen General de Orina', categoria: 'Orina', descripcion: 'Análisis físico, químico y microscópico', preparacion: 'Primera orina de la mañana', tiempoResultado: '2 horas' },
        { id: 'orin-2', nombre: 'Urocultivo', categoria: 'Orina', descripcion: 'Cultivo bacteriológico de orina', preparacion: 'Técnica de recolección estéril', tiempoResultado: '48-72 horas' },
        
        // Hormonas
        { id: 'horm-1', nombre: 'TSH', categoria: 'Hormonas', descripcion: 'Hormona estimulante de tiroides', preparacion: 'Sin preparación especial', tiempoResultado: '24 horas' },
        { id: 'horm-2', nombre: 'T4 Libre', categoria: 'Hormonas', descripcion: 'Tiroxina libre', preparacion: 'Sin preparación especial', tiempoResultado: '24 horas' },
        { id: 'horm-3', nombre: 'Cortisol', categoria: 'Hormonas', descripcion: 'Hormona del estrés', preparacion: 'Muestra en la mañana (8 AM)', tiempoResultado: '48 horas' },
        
        // Marcadores tumorales
        { id: 'tumo-1', nombre: 'PSA Total', categoria: 'Marcadores Tumorales', descripcion: 'Antígeno prostático específico', preparacion: 'Evitar actividad sexual 48h antes', tiempoResultado: '48 horas' },
        { id: 'tumo-2', nombre: 'CA 125', categoria: 'Marcadores Tumorales', descripcion: 'Marcador para cáncer de ovario', preparacion: 'Sin preparación especial', tiempoResultado: '48 horas' },
        
        // Gabinete
        { id: 'gab-1', nombre: 'Radiografía de Tórax', categoria: 'Gabinete', descripcion: 'Estudio de imagen de tórax', preparacion: 'Sin preparación especial', tiempoResultado: 'Inmediato' },
        { id: 'gab-2', nombre: 'Electrocardiograma', categoria: 'Gabinete', descripcion: 'Registro de actividad eléctrica cardíaca', preparacion: 'Sin preparación especial', tiempoResultado: 'Inmediato' },
        { id: 'gab-3', nombre: 'Ultrasonido Abdominal', categoria: 'Gabinete', descripcion: 'Estudio de imagen de abdomen', preparacion: 'Ayuno de 6-8 horas', tiempoResultado: '24 horas' },
        { id: 'gab-4', nombre: 'Tomografía de Cráneo', categoria: 'Gabinete', descripcion: 'Estudio de imagen cerebral', preparacion: 'Ayuno de 4 horas', tiempoResultado: '48 horas' },
        { id: 'gab-5', nombre: 'Resonancia Magnética de Columna', categoria: 'Gabinete', descripcion: 'Estudio de imagen de columna vertebral', preparacion: 'Sin preparación especial (sin metales)', tiempoResultado: '72 horas' },
        
        // Especializados
        { id: 'esp-1', nombre: 'Prueba de Esfuerzo', categoria: 'Especializados', descripcion: 'Evaluación cardiovascular durante ejercicio', preparacion: 'Ropa y calzado deportivo', tiempoResultado: 'Inmediato' },
        { id: 'esp-2', nombre: 'Endoscopia Digestiva Alta', categoria: 'Especializados', descripcion: 'Visualización de esófago, estómago y duodeno', preparacion: 'Ayuno de 8 horas', tiempoResultado: '24 horas' },
        { id: 'esp-3', nombre: 'Colonoscopia', categoria: 'Especializados', descripcion: 'Visualización de colon', preparacion: 'Dieta y preparación intestinal', tiempoResultado: '48 horas' },
      ];

      setEstudios(estudiosEjemplo);
      setEstudiosFiltrados(estudiosEjemplo);
      setError(null);
    } catch (err) {
      setError('Error al cargar estudios de laboratorio');
      console.error('Error cargando estudios:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarEstudios = useCallback((termino: string) => {
    if (!termino.trim()) {
      setEstudiosFiltrados(estudios);
      return;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    const filtrados = estudios.filter(est => 
      est.nombre.toLowerCase().includes(terminoLower) ||
      est.categoria.toLowerCase().includes(terminoLower) ||
      est.descripcion.toLowerCase().includes(terminoLower)
    );
    
    setEstudiosFiltrados(filtrados);
  }, [estudios]);

  const seleccionarEstudio = useCallback((estudio: EstudioLaboratorio) => {
    if (!estudiosSeleccionados.some(e => e.id === estudio.id)) {
      setEstudiosSeleccionados(prev => [...prev, estudio]);
    }
  }, [estudiosSeleccionados]);

  const deseleccionarEstudio = useCallback((id: string) => {
    setEstudiosSeleccionados(prev => prev.filter(e => e.id !== id));
  }, []);

  const limpiarSeleccion = useCallback(() => {
    setEstudiosSeleccionados([]);
  }, []);

  const crearOrdenEstudio = useCallback(async (pacienteId: string, notas?: string): Promise<string> => {
    try {
      if (!pacienteId) {
        throw new Error('ID de paciente requerido');
      }

      if (estudiosSeleccionados.length === 0) {
        throw new Error('Seleccione al menos un estudio');
      }

      setCargando(true);
      
      const nuevaOrden: OrdenEstudio = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pacienteId,
        estudios: [...estudiosSeleccionados],
        fechaOrden: new Date().toISOString(),
        estado: 'pendiente',
        notas: notas || '',
      };

      // En una implementación real, guardaríamos en la base de datos
      // await db.ordenesEstudio.add(nuevaOrden);
      
      setOrdenesEstudio(prev => [...prev, nuevaOrden]);
      setError(null);
      
      // Limpiar selección después de crear la orden
      limpiarSeleccion();
      
      return nuevaOrden.id;
      
    } catch (err) {
      const mensajeError = err instanceof Error ? err.message : 'Error al crear orden de estudios';
      setError(mensajeError);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [estudiosSeleccionados, limpiarSeleccion]);

  const actualizarResultados = useCallback(async (ordenId: string, resultados: string) => {
    try {
      setCargando(true);
      
      // En una implementación real, actualizaríamos en la base de datos
      // await db.ordenesEstudio.update(ordenId, { resultados });
      
      setOrdenesEstudio(prev => 
        prev.map(orden => 
          orden.id === ordenId 
            ? { ...orden, resultados, estado: 'realizado' as const }
            : orden
        )
      );
      
      setError(null);
      
    } catch (err) {
      setError('Error al actualizar resultados');
      console.error('Error actualizando resultados:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const marcarComoRealizado = useCallback(async (ordenId: string, fechaRealizacion: string) => {
    try {
      setCargando(true);
      
      // En una implementación real, actualizaríamos en la base de datos
      // await db.ordenesEstudio.update(ordenId, { 
      //   estado: 'realizado', 
      //   fechaRealizacion 
      // });
      
      setOrdenesEstudio(prev => 
        prev.map(orden => 
          orden.id === ordenId 
            ? { ...orden, estado: 'realizado' as const, fechaRealizacion }
            : orden
        )
      );
      
      setError(null);
      
    } catch (err) {
      setError('Error al marcar orden como realizada');
      console.error('Error marcando orden:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerOrdenesPorPaciente = useCallback((pacienteId: string): OrdenEstudio[] => {
    return ordenesEstudio.filter(orden => orden.pacienteId === pacienteId);
  }, [ordenesEstudio]);

  return {
    // Estado
    estudios,
    estudiosFiltrados,
    ordenesEstudio,
    estudiosSeleccionados,
    cargando,
    error,
    
    // Acciones
    buscarEstudios,
    seleccionarEstudio,
    deseleccionarEstudio,
    limpiarSeleccion,
    cargarEstudiosPrecargados,
    crearOrdenEstudio,
    actualizarResultados,
    marcarComoRealizado,
    obtenerOrdenesPorPaciente,
  };
}