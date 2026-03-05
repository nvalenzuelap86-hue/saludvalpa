// ============================================================================
// saludvalpa 3.0 - HOOK PARA GESTIÓN DE USUARIOS
// Sistema de gestión de usuarios y permisos para Fase 3
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import type { Usuario, TipoProfesion } from '../types';

// Tipos de permisos por módulo
export interface PermisosModulo {
  pacientes: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  agenda: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  documentos: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
    firmar: boolean;
  };
  economia: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  configuracion: {
    ver: boolean;
    editar: boolean;
  };
  usuarios: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  biblioteca: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  reportes: {
    ver: boolean;
    crear: boolean;
    exportar: boolean;
    configurar: boolean;
  };
  respaldos: {
    ver: boolean;
    crear: boolean;
    exportar: boolean;
    importar: boolean;
    configurar: boolean;
  };
  integraciones: {
    ver: boolean;
    configurar: boolean;
  };
  seguridad: {
    ver: boolean;
    configurar: boolean;
  };
  analiticas: {
    ver: boolean;
    configurar: boolean;
    exportar: boolean;
  };
}

// Roles predefinidos con permisos
export const ROLES_PERMISOS: Record<string, PermisosModulo> = {
  admin: {
    pacientes: { ver: true, crear: true, editar: true, eliminar: true },
    agenda: { ver: true, crear: true, editar: true, eliminar: true },
    documentos: { ver: true, crear: true, editar: true, eliminar: true, firmar: true },
    economia: { ver: true, crear: true, editar: true, eliminar: true },
    configuracion: { ver: true, editar: true },
    usuarios: { ver: true, crear: true, editar: true, eliminar: true },
    biblioteca: { ver: true, crear: true, editar: true, eliminar: true },
    reportes: { ver: true, crear: true, exportar: true, configurar: true },
    respaldos: { ver: true, crear: true, exportar: true, importar: true, configurar: true },
    integraciones: { ver: true, configurar: true },
    seguridad: { ver: true, configurar: true },
    analiticas: { ver: true, configurar: true, exportar: true },
  },
  profesional: {
    pacientes: { ver: true, crear: true, editar: true, eliminar: false },
    agenda: { ver: true, crear: true, editar: true, eliminar: false },
    documentos: { ver: true, crear: true, editar: true, eliminar: false, firmar: true },
    economia: { ver: true, crear: false, editar: false, eliminar: false },
    configuracion: { ver: false, editar: false },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    biblioteca: { ver: true, crear: true, editar: true, eliminar: false },
    reportes: { ver: true, crear: false, exportar: true, configurar: false },
    respaldos: { ver: true, crear: true, exportar: true, importar: false, configurar: false },
    integraciones: { ver: false, configurar: false },
    seguridad: { ver: false, configurar: false },
    analiticas: { ver: true, configurar: false, exportar: true },
  },
  recepcionista: {
    pacientes: { ver: true, crear: true, editar: true, eliminar: false },
    agenda: { ver: true, crear: true, editar: true, eliminar: false },
    documentos: { ver: true, crear: false, editar: false, eliminar: false, firmar: false },
    economia: { ver: true, crear: false, editar: false, eliminar: false },
    configuracion: { ver: false, editar: false },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    biblioteca: { ver: true, crear: false, editar: false, eliminar: false },
    reportes: { ver: false, crear: false, exportar: false, configurar: false },
    respaldos: { ver: false, crear: false, exportar: false, importar: false, configurar: false },
    integraciones: { ver: false, configurar: false },
    seguridad: { ver: false, configurar: false },
    analiticas: { ver: false, configurar: false, exportar: false },
  },
};

// Interfaz para usuario con permisos extendidos
export interface UsuarioConPermisos extends Usuario {
  permisos: PermisosModulo;
}

// Hook principal
export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioConPermisos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los usuarios
  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const usuariosDB = await db.usuarios.toArray();
      
      // Convertir a UsuarioConPermisos
      const usuariosConPermisos = usuariosDB.map(usuario => ({
        ...usuario,
        permisos: ROLES_PERMISOS[usuario.rol] || ROLES_PERMISOS.profesional,
      }));
      
      setUsuarios(usuariosConPermisos);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo usuario
  const crearUsuario = async (usuarioData: Omit<Usuario, 'id' | 'fechaCreacion' | 'activo'>) => {
    try {
      const nuevoUsuario: Usuario = {
        ...usuarioData,
        id: crypto.randomUUID(),
        activo: true,
        fechaCreacion: new Date(),
      };

      await db.usuarios.add(nuevoUsuario);
      await cargarUsuarios(); // Recargar lista
      return { success: true, usuario: nuevoUsuario };
    } catch (err) {
      console.error('Error al crear usuario:', err);
      return { success: false, error: 'No se pudo crear el usuario' };
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async (id: string, updates: Partial<Usuario>) => {
    try {
      await db.usuarios.update(id, updates);
      await cargarUsuarios(); // Recargar lista
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      return { success: false, error: 'No se pudo actualizar el usuario' };
    }
  };

  // Eliminar usuario (soft delete)
  const eliminarUsuario = async (id: string) => {
    try {
      await db.usuarios.update(id, { activo: false });
      await cargarUsuarios(); // Recargar lista
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      return { success: false, error: 'No se pudo eliminar el usuario' };
    }
  };

  // Reactivar usuario
  const reactivarUsuario = async (id: string) => {
    try {
      await db.usuarios.update(id, { activo: true });
      await cargarUsuarios(); // Recargar lista
      return { success: true };
    } catch (err) {
      console.error('Error al reactivar usuario:', err);
      return { success: false, error: 'No se pudo reactivar el usuario' };
    }
  };

  // Obtener usuario por ID
  const obtenerUsuario = async (id: string): Promise<UsuarioConPermisos | null> => {
    try {
      const usuario = await db.usuarios.get(id);
      if (!usuario) return null;
      
      return {
        ...usuario,
        permisos: ROLES_PERMISOS[usuario.rol] || ROLES_PERMISOS.profesional,
      };
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      return null;
    }
  };

  // Verificar permisos de usuario actual
  const verificarPermiso = (
    usuario: UsuarioConPermisos | null,
    modulo: keyof PermisosModulo,
    accion: keyof PermisosModulo[keyof PermisosModulo]
  ): boolean => {
    if (!usuario) return false;
    return usuario.permisos[modulo][accion as keyof typeof usuario.permisos[typeof modulo]];
  };

  // Inicializar usuario administrador por defecto
  const inicializarUsuarioAdmin = async (profesion: TipoProfesion) => {
    try {
      const usuariosExistentes = await db.usuarios.toArray();
      if (usuariosExistentes.length > 0) return; // Ya hay usuarios

      const usuarioAdmin: Usuario = {
        id: crypto.randomUUID(),
        nombre: 'Administrador',
        apellidos: 'Principal',
        email: 'admin@clinica.com',
        rol: 'admin',
        profesion,
        activo: true,
        fechaCreacion: new Date(),
      };

      await db.usuarios.add(usuarioAdmin);
      console.log('✅ Usuario administrador creado por defecto');
    } catch (err) {
      console.error('Error al crear usuario administrador:', err);
    }
  };

  // Cargar usuarios al montar el hook
  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    reactivarUsuario,
    obtenerUsuario,
    verificarPermiso,
    inicializarUsuarioAdmin,
    ROLES_PERMISOS,
  };
}