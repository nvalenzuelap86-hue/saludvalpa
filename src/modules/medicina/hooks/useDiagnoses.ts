// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE DIAGNÓSTICOS CON CIE-10
// Hook personalizado para gestionar diagnósticos médicos con códigos CIE-10
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import type { DiagnosticoCIE10 } from '../../../types';

interface UseDiagnosesReturn {
  // Estado
  diagnosticos: DiagnosticoCIE10[];
  diagnosticosActivos: DiagnosticoCIE10[];
  diagnosticosPrincipales: DiagnosticoCIE10[];
  cargando: boolean;
  error: string | null;
  
  // Acciones
  cargarDiagnosticosPaciente: (pacienteId: string) => Promise<void>;
  crearDiagnostico: (diagnostico: Omit<DiagnosticoCIE10, 'id'>) => Promise<string>;
  actualizarDiagnostico: (id: string, actualizaciones: Partial<DiagnosticoCIE10>) => Promise<void>;
  resolverDiagnostico: (id: string, fechaResolucion: Date, notas?: string) => Promise<void>;
  buscarDiagnosticosPorCodigo: (codigoCIE10: string) => Promise<DiagnosticoCIE10[]>;
  buscarDiagnosticosPorDescripcion: (descripcion: string) => Promise<DiagnosticoCIE10[]>;
  obtenerDiagnosticosComorbilidades: (pacienteId: string) => Promise<DiagnosticoCIE10[]>;
  obtenerHistorialDiagnosticos: (pacienteId: string) => Promise<DiagnosticoCIE10[]>;
  sugerirDiagnosticosPorSintomas: (sintomas: string[]) => Promise<Array<{ codigo: string; descripcion: string; probabilidad: number }>>;
  validarCodigoCIE10: (codigo: string) => boolean;
}

export default function useDiagnoses(): UseDiagnosesReturn {
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoCIE10[]>([]);
  const [diagnosticosActivos, setDiagnosticosActivos] = useState<DiagnosticoCIE10[]>([]);
  const [diagnosticosPrincipales, setDiagnosticosPrincipales] = useState<DiagnosticoCIE10[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDiagnosticosPaciente = useCallback(async (pacienteId: string) => {
    try {
      setCargando(true);
      setError(null);

      const todosDiagnosticos = await db.diagnosticosCIE10
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fechaDiagnostico');

      setDiagnosticos(todosDiagnosticos);
      
      // Filtrar diagnósticos activos (sin fecha de resolución)
      const activos = todosDiagnosticos.filter(d => 
        d.certeza !== 'resuelto' // En una implementación real, tendríamos campo de resolución
      );
      setDiagnosticosActivos(activos);
      
      // Filtrar diagnósticos principales
      const principales = todosDiagnosticos.filter(d => d.tipo === 'principal');
      setDiagnosticosPrincipales(principales);
    } catch (err) {
      setError('Error al cargar diagnósticos del paciente');
      console.error('Error cargando diagnósticos:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const crearDiagnostico = useCallback(async (diagnosticoData: Omit<DiagnosticoCIE10, 'id'>): Promise<string> => {
    try {
      setCargando(true);
      setError(null);

      // Validar datos requeridos
      if (!diagnosticoData.codigo.trim()) {
        throw new Error('Código CIE-10 es requerido');
      }

      if (!diagnosticoData.descripcion.trim()) {
        throw new Error('Descripción del diagnóstico es requerida');
      }

      if (!diagnosticoData.pacienteId) {
        throw new Error('ID del paciente es requerido');
      }

      // Validar formato del código CIE-10
      if (!validarCodigoCIE10(diagnosticoData.codigo)) {
        throw new Error('Formato de código CIE-10 inválido');
      }

      const diagnosticoCompleto: DiagnosticoCIE10 = {
        ...diagnosticoData,
        id: crypto.randomUUID(),
      };

      await db.diagnosticosCIE10.add(diagnosticoCompleto);
      
      // Actualizar estado local
      setDiagnosticos(prev => [...prev, diagnosticoCompleto]);
      
      if (diagnosticoCompleto.certeza !== 'resuelto') {
        setDiagnosticosActivos(prev => [...prev, diagnosticoCompleto]);
      }
      
      if (diagnosticoCompleto.tipo === 'principal') {
        setDiagnosticosPrincipales(prev => [...prev, diagnosticoCompleto]);
      }
      
      return diagnosticoCompleto.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear diagnóstico');
      console.error('Error creando diagnóstico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarDiagnostico = useCallback(async (id: string, actualizaciones: Partial<DiagnosticoCIE10>) => {
    try {
      setCargando(true);
      setError(null);

      const diagnosticoExistente = await db.diagnosticosCIE10.get(id);
      if (!diagnosticoExistente) {
        throw new Error('Diagnóstico no encontrado');
      }

      await db.diagnosticosCIE10.update(id, actualizaciones);
      
      // Actualizar estado local
      setDiagnosticos(prev => 
        prev.map(d => d.id === id ? { ...d, ...actualizaciones } : d)
      );
      
      setDiagnosticosActivos(prev => {
        const diagnosticoActualizado = { ...diagnosticoExistente, ...actualizaciones };
        const esActivo = diagnosticoActualizado.certeza !== 'resuelto';
        
        if (esActivo) {
          // Reemplazar o agregar
          const existe = prev.some(d => d.id === id);
          if (existe) {
            return prev.map(d => d.id === id ? diagnosticoActualizado : d);
          } else {
            return [...prev, diagnosticoActualizado];
          }
        } else {
          // Remover si ya no está activo
          return prev.filter(d => d.id !== id);
        }
      });
      
      setDiagnosticosPrincipales(prev => {
        const diagnosticoActualizado = { ...diagnosticoExistente, ...actualizaciones };
        const esPrincipal = diagnosticoActualizado.tipo === 'principal';
        
        if (esPrincipal) {
          const existe = prev.some(d => d.id === id);
          if (existe) {
            return prev.map(d => d.id === id ? diagnosticoActualizado : d);
          } else {
            return [...prev, diagnosticoActualizado];
          }
        } else {
          return prev.filter(d => d.id !== id);
        }
      });
    } catch (err) {
      setError('Error al actualizar diagnóstico');
      console.error('Error actualizando diagnóstico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const resolverDiagnostico = useCallback(async (id: string, fechaResolucion: Date, notas?: string) => {
    try {
      setCargando(true);
      setError(null);

      await actualizarDiagnostico(id, {
        certeza: 'resuelto',
        notas: notas ? `${diagnosticos.find(d => d.id === id)?.notas || ''}\nResuelto: ${notas}`.trim() : 'Resuelto',
      });

    } catch (err) {
      setError('Error al resolver diagnóstico');
      console.error('Error resolviendo diagnóstico:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [actualizarDiagnostico, diagnosticos]);

  const buscarDiagnosticosPorCodigo = useCallback(async (codigoCIE10: string): Promise<DiagnosticoCIE10[]> => {
    try {
      setCargando(true);
      setError(null);

      if (!codigoCIE10.trim()) {
        return [];
      }

      const codigoBusqueda = codigoCIE10.toUpperCase().trim();
      const todosDiagnosticos = await db.diagnosticosCIE10.toArray();
      
      const resultados = todosDiagnosticos.filter(d =>
        d.codigo.toUpperCase().includes(codigoBusqueda)
      );

      return resultados;
    } catch (err) {
      setError('Error al buscar diagnósticos por código');
      console.error('Error buscando diagnósticos por código:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarDiagnosticosPorDescripcion = useCallback(async (descripcion: string): Promise<DiagnosticoCIE10[]> => {
    try {
      setCargando(true);
      setError(null);

      if (!descripcion.trim()) {
        return [];
      }

      const termino = descripcion.toLowerCase().trim();
      const todosDiagnosticos = await db.diagnosticosCIE10.toArray();
      
      const resultados = todosDiagnosticos.filter(d =>
        d.descripcion.toLowerCase().includes(termino)
      );

      return resultados;
    } catch (err) {
      setError('Error al buscar diagnósticos por descripción');
      console.error('Error buscando diagnósticos por descripción:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerDiagnosticosComorbilidades = useCallback(async (pacienteId: string): Promise<DiagnosticoCIE10[]> => {
    try {
      setCargando(true);
      setError(null);

      const diagnosticosPaciente = await db.diagnosticosCIE10
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fechaDiagnostico');

      // Filtrar comorbilidades (diagnósticos secundarios o de comorbilidad activos)
      const comorbilidades = diagnosticosPaciente.filter(d => 
        (d.tipo === 'secundario' || d.tipo === 'comorbilidad') && 
        d.certeza !== 'resuelto'
      );

      return comorbilidades;
    } catch (err) {
      setError('Error al obtener comorbilidades');
      console.error('Error obteniendo comorbilidades:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerHistorialDiagnosticos = useCallback(async (pacienteId: string): Promise<DiagnosticoCIE10[]> => {
    try {
      setCargando(true);
      setError(null);

      const historial = await db.diagnosticosCIE10
        .where('pacienteId')
        .equals(pacienteId)
        .sortBy('fechaDiagnostico');

      return historial;
    } catch (err) {
      setError('Error al obtener historial de diagnósticos');
      console.error('Error obteniendo historial de diagnósticos:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  const sugerirDiagnosticosPorSintomas = useCallback(async (sintomas: string[]): Promise<Array<{ codigo: string; descripcion: string; probabilidad: number }>> => {
    try {
      // En una implementación real, esto consultaría una base de conocimiento
      // Por ahora, retornamos sugerencias estáticas basadas en síntomas comunes
      
      const sugerenciasComunes = [
        { sintomas: ['fiebre', 'tos', 'dolor garganta'], diagnostico: { codigo: 'J06.9', descripcion: 'Infección aguda de las vías respiratorias superiores', probabilidad: 0.7 } },
        { sintomas: ['dolor cabeza', 'náuseas', 'fotofobia'], diagnostico: { codigo: 'G43.9', descripcion: 'Migraña', probabilidad: 0.6 } },
        { sintomas: ['dolor abdominal', 'náuseas', 'vómitos'], diagnostico: { codigo: 'K52.9', descripcion: 'Gastroenteritis', probabilidad: 0.8 } },
        { sintomas: ['dolor articulaciones', 'fiebre', 'erupción'], diagnostico: { codigo: 'M79.7', descripcion: 'Fibromialgia', probabilidad: 0.5 } },
        { sintomas: ['fatiga', 'debilidad', 'palidez'], diagnostico: { codigo: 'D64.9', descripcion: 'Anemia', probabilidad: 0.6 } },
      ];

      const sintomasLower = sintomas.map(s => s.toLowerCase());
      const sugerencias: Array<{ codigo: string; descripcion: string; probabilidad: number }> = [];

      for (const sugerencia of sugerenciasComunes) {
        const coincidencias = sugerencia.sintomas.filter(s => 
          sintomasLower.some(sintoma => sintoma.includes(s) || s.includes(sintoma))
        ).length;
        
        if (coincidencias > 0) {
          const probabilidad = Math.min(0.9, sugerencia.diagnostico.probabilidad * (coincidencias / sugerencia.sintomas.length));
          sugerencias.push({
            codigo: sugerencia.diagnostico.codigo,
            descripcion: sugerencia.diagnostico.descripcion,
            probabilidad,
          });
        }
      }

      // Ordenar por probabilidad descendente
      return sugerencias.sort((a, b) => b.probabilidad - a.probabilidad);
    } catch (err) {
      console.error('Error sugiriendo diagnósticos:', err);
      return [];
    }
  }, []);

  const validarCodigoCIE10 = useCallback((codigo: string): boolean => {
    // Validación básica de formato CIE-10
    // Formato: Letra + 2 dígitos + opcional . + opcional 1-2 dígitos
    const regexCIE10 = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;
    return regexCIE10.test(codigo.toUpperCase());
  }, []);

  return {
    // Estado
    diagnosticos,
    diagnosticosActivos,
    diagnosticosPrincipales,
    cargando,
    error,
    
    // Acciones
    cargarDiagnosticosPaciente,
    crearDiagnostico,
    actualizarDiagnostico,
    resolverDiagnostico,
    buscarDiagnosticosPorCodigo,
    buscarDiagnosticosPorDescripcion,
    obtenerDiagnosticosComorbilidades,
    obtenerHistorialDiagnosticos,
    sugerirDiagnosticosPorSintomas,
    validarCodigoCIE10,
  };
}