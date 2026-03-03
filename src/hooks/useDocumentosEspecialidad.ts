// ============================================================================
// saludvalpa 3.0 - HOOK PARA DOCUMENTOS POR ESPECIALIDAD
// Hook personalizado para gestión de documentos organizados por especialidad
// ============================================================================

import { useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type {
  Documento,
  TipoProfesion,
  DocumentoEspecialidad
} from '../types';
import {
  DOCUMENTOS_POR_ESPECIALIDAD,
  obtenerCategoriaDocumento,
  DocumentCategory
} from '../types';

export interface UseDocumentosEspecialidadOptions {
  especialidad?: TipoProfesion;
  pacienteId?: string;
  categoria?: DocumentCategory;
  ordenarPor?: 'fechaCreacion' | 'nombre';
  ordenDireccion?: 'asc' | 'desc';
}

export interface DocumentosOrganizados {
  medicos: Documento[];
  administrativos: Documento[];
  todos: Documento[];
  documentosEspecialidad: DocumentoEspecialidad[];
}

export const useDocumentosEspecialidad = (options: UseDocumentosEspecialidadOptions = {}) => {
  const {
    especialidad,
    pacienteId,
    categoria,
    ordenarPor = 'fechaCreacion',
    ordenDireccion = 'desc'
  } = options;

  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Query en vivo de documentos con Dexie React Hooks
  const documentos = useLiveQuery(async () => {
    try {
      setCargando(true);
      let query = db.documentos.toCollection();

      // Filtrar por paciente si se especifica
      if (pacienteId) {
        query = query.filter(d => d.pacienteId === pacienteId);
      }

      // Filtrar por especialidad si se especifica
      if (especialidad) {
        query = query.filter(d => d.profesion === especialidad);
      }

      // Filtrar por categoría si se especifica
      if (categoria) {
        const documentosFiltrados = await query.toArray();
        return documentosFiltrados.filter(d => {
          const docCategoria = d.categoria || obtenerCategoriaDocumento(d.tipo);
          return docCategoria === categoria;
        });
      }

      return await query.toArray();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar documentos');
      return [];
    } finally {
      setCargando(false);
    }
  }, [pacienteId, especialidad, categoria]);

  // Obtener documentos disponibles para la especialidad actual
  const documentosEspecialidad = useMemo(() => {
    if (!especialidad) {
      return [];
    }
    return DOCUMENTOS_POR_ESPECIALIDAD[especialidad] || [];
  }, [especialidad]);

  // Organizar documentos por categoría
  const documentosOrganizados = useMemo((): DocumentosOrganizados => {
    const docs = documentos || [];
    
    // Ordenar documentos
    const documentosOrdenados = [...docs].sort((a, b) => {
      const direccion = ordenDireccion === 'desc' ? -1 : 1;
      
      switch (ordenarPor) {
        case 'fechaCreacion':
          return direccion * (a.fechaCreacion.getTime() - b.fechaCreacion.getTime());
        case 'nombre':
          return direccion * a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });

    // Separar por categoría
    const medicos: Documento[] = [];
    const administrativos: Documento[] = [];

    documentosOrdenados.forEach(doc => {
      const docCategoria = doc.categoria || obtenerCategoriaDocumento(doc.tipo);
      
      if (docCategoria === DocumentCategory.MEDICO) {
        medicos.push(doc);
      } else if (docCategoria === DocumentCategory.ADMINISTRATIVO) {
        administrativos.push(doc);
      }
    });

    return {
      medicos,
      administrativos,
      todos: documentosOrdenados,
      documentosEspecialidad
    };
  }, [documentos, documentosEspecialidad, ordenarPor, ordenDireccion]);

  // Filtrar documentos de especialidad por categoría
  const filtrarDocumentosEspecialidadPorCategoria = useCallback((categoriaFiltro: DocumentCategory) => {
    if (!especialidad) return [];
    const docs = DOCUMENTOS_POR_ESPECIALIDAD[especialidad] || [];
    return docs.filter(doc => doc.categoria === categoriaFiltro);
  }, [especialidad]);

  // Buscar documento de especialidad por tipo
  const buscarDocumentoEspecialidadPorTipo = useCallback((tipoDocumento: string) => {
    if (!especialidad) return null;
    const docs = DOCUMENTOS_POR_ESPECIALIDAD[especialidad] || [];
    return docs.find(doc => doc.tipoDocumento === tipoDocumento) || null;
  }, [especialidad]);

  // Obtener estadísticas de documentos
  const estadisticas = useMemo(() => {
    const docs = documentos || [];
    return {
      total: docs.length,
      medicos: docs.filter(d => {
        const cat = d.categoria || obtenerCategoriaDocumento(d.tipo);
        return cat === DocumentCategory.MEDICO;
      }).length,
      administrativos: docs.filter(d => {
        const cat = d.categoria || obtenerCategoriaDocumento(d.tipo);
        return cat === DocumentCategory.ADMINISTRATIVO;
      }).length,
      porEspecialidad: especialidad ? 
        docs.filter(d => d.profesion === especialidad).length : 0
    };
  }, [documentos, especialidad]);

  // Agrupar documentos por mes/año para visualización
  const documentosAgrupadosPorFecha = useMemo(() => {
    const docs = documentos || [];
    const agrupados: Record<string, Documento[]> = {};
    
    docs.forEach(doc => {
      const fecha = new Date(doc.fechaCreacion);
      const clave = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`; // YYYY-MM
      
      if (!agrupados[clave]) {
        agrupados[clave] = [];
      }
      agrupados[clave].push(doc);
    });

    // Ordenar grupos por fecha descendente
    return Object.entries(agrupados)
      .sort(([claveA], [claveB]) => claveB.localeCompare(claveA))
      .map(([clave, docs]) => ({
        clave,
        fecha: new Date(parseInt(clave.split('-')[0]), parseInt(clave.split('-')[1]) - 1),
        documentos: docs
      }));
  }, [documentos]);

  return {
    // Datos
    documentos: documentos || [],
    documentosOrganizados,
    documentosEspecialidad,
    documentosAgrupadosPorFecha,
    
    // Estados
    cargando,
    error,
    estadisticas,
    
    // Funciones
    filtrarDocumentosEspecialidadPorCategoria,
    buscarDocumentoEspecialidadPorTipo,
    
    // Utilidades
    tieneDocumentos: (documentos?.length || 0) > 0,
    tieneDocumentosMedicos: documentosOrganizados.medicos.length > 0,
    tieneDocumentosAdministrativos: documentosOrganizados.administrativos.length > 0
  };
};