// ============================================================================
// saludvalpa 3.0 - USUARIOS Y PERMISOS TAB
// Componente para la pestaña de gestión de usuarios y permisos (Fase 3)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../stores/appStore';
import SectionCard from '../SectionCard';
import { LicenseGate } from '../LicenseGate';
import useUsuarios, { ROLES_PERMISOS } from '../../../hooks/useUsuarios';
import type { Usuario, TipoProfesion } from '../../../types';

const UsuariosPermisosTab: React.FC = () => {
  const { configuracion } = useAppStore();
  const {
    usuarios,
    loading,
    error,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    reactivarUsuario,
    inicializarUsuarioAdmin,
  } = useUsuarios();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    rol: 'profesional' as 'admin' | 'profesional' | 'recepcionista',
    profesion: configuracion?.profesion || 'fisioterapia' as TipoProfesion,
  });

  // Inicializar usuario administrador si no hay usuarios
  useEffect(() => {
    if (configuracion?.profesion && usuarios.length === 0 && !loading) {
      inicializarUsuarioAdmin(configuracion.profesion);
    }
  }, [configuracion?.profesion, usuarios.length, loading, inicializarUsuarioAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usuarioEditando) {
      // Actualizar usuario existente
      const resultado = await actualizarUsuario(usuarioEditando.id, formData);
      if (resultado.success) {
        alert('✅ Usuario actualizado correctamente');
        resetForm();
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    } else {
      // Crear nuevo usuario
      const resultado = await crearUsuario(formData);
      if (resultado.success) {
        alert('✅ Usuario creado correctamente');
        resetForm();
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    }
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol,
      profesion: usuario.profesion || configuracion?.profesion || 'fisioterapia',
    });
    setMostrarFormulario(true);
  };

  const handleEliminarUsuario = async (usuario: Usuario) => {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) {
      const resultado = await eliminarUsuario(usuario.id);
      if (resultado.success) {
        alert('✅ Usuario eliminado correctamente');
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    }
  };

  const handleReactivarUsuario = async (usuario: Usuario) => {
    const resultado = await reactivarUsuario(usuario.id);
    if (resultado.success) {
      alert('✅ Usuario reactivado correctamente');
    } else {
      alert(`❌ Error: ${resultado.error}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      email: '',
      rol: 'profesional',
      profesion: configuracion?.profesion || 'fisioterapia',
    });
    setUsuarioEditando(null);
    setMostrarFormulario(false);
  };

  const getRolDescripcion = (rol: string) => {
    const descripciones: Record<string, string> = {
      admin: 'Administrador - Acceso completo a todas las funcionalidades',
      profesional: 'Profesional - Puede gestionar pacientes, agenda y documentos',
      recepcionista: 'Recepcionista - Puede gestionar agenda y pacientes básicos',
    };
    return descripciones[rol] || rol;
  };

  const getPermisosResumen = (rol: string) => {
    const permisos = ROLES_PERMISOS[rol];
    if (!permisos) return 'Sin permisos definidos';
    
    const modulosConAcceso = Object.entries(permisos)
      .filter(([_, moduloPermisos]) => Object.values(moduloPermisos).some(p => p))
      .map(([modulo]) => modulo);
    
    return `Acceso a: ${modulosConAcceso.join(', ')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <LicenseGate requiredLevel="paid">
      <div className="space-y-6">
        {/* Lista de usuarios */}
        <SectionCard
          title="Usuarios del Sistema"
          description="Gestiona los profesionales y personal que tienen acceso a esta cuenta"
          icon="👥"
          variant="info"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Usuarios registrados ({usuarios.length})</h3>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-saludvalpa-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                <span>Agregar usuario</span>
              </button>
            </div>

            {usuarios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay usuarios registrados. Agrega el primer usuario.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuarios.map(usuario => (
                  <div
                    key={usuario.id}
                    className={`p-4 border rounded-lg ${usuario.activo ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellidos}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {usuario.rol}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{usuario.email}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {getRolDescripcion(usuario.rol)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getPermisosResumen(usuario.rol)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {usuario.activo ? (
                          <>
                            <button
                              onClick={() => handleEditarUsuario(usuario)}
                              className="text-sm text-saludvalpa-blue hover:text-saludvalpa-blue-dark"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarUsuario(usuario)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleReactivarUsuario(usuario)}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Formulario para agregar/editar usuario */}
        {mostrarFormulario && (
          <SectionCard
            title={usuarioEditando ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            description="Completa los datos del nuevo usuario del sistema"
            icon={usuarioEditando ? "✏️" : "➕"}
            variant="default"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Juan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Ej: Pérez García"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder="Ej: juan.perez@clinica.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol *
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="admin">Administrador</option>
                    <option value="profesional">Profesional</option>
                    <option value="recepcionista">Recepcionista</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRolDescripcion(formData.rol)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad/Profesión
                  </label>
                  <select
                    name="profesion"
                    value={formData.profesion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  >
                    <option value="fisioterapia">Fisioterapia</option>
                    <option value="psicologia">Psicología</option>
                    <option value="nutricion">Nutrición</option>
                    <option value="medicina_general">Medicina General</option>
                    <option value="odontologia">Odontología</option>
                  </select>
                </div>
              </div>

              {/* Vista previa de permisos */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Permisos que tendrá este usuario:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(ROLES_PERMISOS[formData.rol] || {}).map(([modulo, permisos]) => (
                    <div key={modulo} className="flex items-center gap-2">
                      <span className="font-medium capitalize">{modulo}:</span>
                      <span>
                        {Object.entries(permisos)
                          .filter(([_, tienePermiso]) => tienePermiso)
                          .map(([accion]) => accion)
                          .join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-saludvalpa-blue text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {usuarioEditando ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Información sobre permisos */}
        <SectionCard
          title="Sistema de Permisos"
          description="Explicación de los diferentes roles y permisos disponibles"
          icon="🔐"
          variant="info"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Administrador</h4>
              <p className="text-sm text-blue-800 mb-2">
                Acceso completo a todas las funcionalidades del sistema. Puede gestionar usuarios, configuración, pacientes, documentos y economía.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Crear, editar y eliminar cualquier dato</li>
                <li>• Gestionar todos los usuarios del sistema</li>
                <li>• Configurar todas las opciones del sistema</li>
                <li>• Acceso completo a reportes y estadísticas</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Profesional</h4>
              <p className="text-sm text-green-800 mb-2">
                Acceso a funcionalidades clínicas. Puede gestionar pacientes, agenda, documentos clínicos y ver información económica.
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Gestionar pacientes (crear, editar, ver)</li>
                <li>• Gestionar agenda y citas</li>
                <li>• Crear y firmar documentos clínicos</li>
                <li>• Ver información económica (solo lectura)</li>
                <li>• No puede gestionar usuarios ni configuración</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Recepcionista</h4>
              <p className="text-sm text-purple-800 mb-2">
                Acceso limitado a funciones administrativas. Puede gestionar agenda y pacientes básicos.
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Gestionar agenda y citas</li>
                <li>• Crear y editar pacientes básicos</li>
                <li>• Ver documentos (solo lectura)</li>
                <li>• Ver información económica (solo lectura)</li>
                <li>• No puede crear documentos ni gestionar configuración</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Nota sobre licencia */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Nota sobre licencia</h4>
          <p className="text-sm text-yellow-800">
            La gestión de múltiples usuarios está disponible solo en licencias pagadas.
            En la versión gratuita solo puedes tener un usuario (el administrador principal).
          </p>
        </div>
      </div>
    </LicenseGate>
  );
};

export default UsuariosPermisosTab;
