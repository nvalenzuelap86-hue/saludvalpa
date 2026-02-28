// ============================================================================
// saludvalpa 3.0 - PACIENTES
// Página de gestión de pacientes con CRUD completo
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { usePacientes } from '../hooks/usePacientes';
import type { Paciente, FiltrosPacientes } from '../types';
import { obtenerIniciales, formatearFecha } from '../utils/helpers';
import Modal from '../components/shared/Modal';
import FormularioPaciente from '../components/FormularioPaciente';
import Button from '../components/shared/Button';

const Pacientes = () => {
  const navigate = useNavigate();
  const { licencia } = useAppStore();
  const [busqueda, setBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState<'nombre' | 'fechaCreacion' | 'ultimaConsulta'>('nombre');
  const [soloActivos, setSoloActivos] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const filtros: FiltrosPacientes = {
    busqueda: busqueda || undefined,
    activo: soloActivos ? true : undefined,
    ordenarPor,
    ordenDireccion: 'asc',
  };

  const { pacientes, crearPaciente, error } = usePacientes(filtros);

  const handleCrearPaciente = async (datos: Omit<Paciente, 'id' | 'fechaCreacion' | 'edad'>) => {
    setGuardando(true);
    try {
      const resultado = await crearPaciente(datos);
      if (resultado.success) {
        setMostrarFormulario(false);
        // Navegar al perfil del nuevo paciente
        if (resultado.paciente) {
          navigate(`/app/pacientes/${resultado.paciente.id}`);
        }
      } else {
        alert(resultado.error || 'Error al crear paciente');
      }
    } catch (err) {
      alert('Error inesperado al crear paciente');
    } finally {
      setGuardando(false);
    }
  };

  const handleClickPaciente = (paciente: Paciente) => {
    console.log('Click en paciente:', paciente.id, paciente.nombre);
    console.log('Navegando a:', `/app/pacientes/${paciente.id}`);
    navigate(`/app/pacientes/${paciente.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:ml-64">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pacientes</h1>
          <Button onClick={() => setMostrarFormulario(true)}>
            <span>➕</span>
            <span className="hidden md:inline">Nuevo paciente</span>
          </Button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          />
          
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="fechaCreacion">Ordenar por fecha de creación</option>
            <option value="ultimaConsulta">Ordenar por última consulta</option>
          </select>

          <button
            onClick={() => setSoloActivos(!soloActivos)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              soloActivos
                ? 'border-saludvalpa-blue bg-saludvalpa-blue-light text-saludvalpa-blue'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {soloActivos ? '✓ Solo activos' : 'Todos'}
          </button>
        </div>
      </div>

      {/* Info de límite */}
      {licencia?.tipo === 'gratuita' && licencia.limitePacientes && (
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800 flex items-center justify-between">
          <span>
            {pacientes.length} de {licencia.limitePacientes} pacientes utilizados en versión gratuita
          </span>
          {pacientes.length >= licencia.limitePacientes && (
            <button
              onClick={() => navigate('/app/activar-licencia')}
              className="text-xs font-medium bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
            >
              Activar licencia
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Lista de pacientes */}
      {pacientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="text-6xl mb-4 block">👥</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {busqueda ? 'No se encontraron pacientes' : 'No hay pacientes todavía'}
          </h3>
          <p className="text-gray-600 mb-4">
            {busqueda 
              ? 'Intenta con otro término de búsqueda' 
              : 'Comienza agregando tu primer paciente'}
          </p>
          {!busqueda && (
            <Button onClick={() => setMostrarFormulario(true)}>
              ➕ Agregar primer paciente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientes.map((paciente) => (
            <div
              key={paciente.id}
              onClick={() => handleClickPaciente(paciente)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-saludvalpa-blue transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {obtenerIniciales(paciente.nombre, paciente.apellidos)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {paciente.nombre} {paciente.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {paciente.edad} años • {paciente.genero}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    ID: {paciente.id.substring(0, 13)}...
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>📞</span>
                  <span className="truncate">{paciente.telefono}</span>
                </div>
                {paciente.ultimaConsulta && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>📅</span>
                    <span>Última consulta: {formatearFecha(paciente.ultimaConsulta)}</span>
                  </div>
                )}
                {paciente.motivoConsulta && (
                  <div className="text-xs text-gray-500 truncate">
                    💬 {paciente.motivoConsulta}
                  </div>
                )}
              </div>

              <div className="mt-3 text-right">
                <span className="text-xs text-saludvalpa-blue font-medium">Ver perfil →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {pacientes.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''}
          {soloActivos && ' activo'}
          {soloActivos && pacientes.length !== 1 && 's'}
        </div>
      )}

      {/* Modal de creación */}
      <Modal
        isOpen={mostrarFormulario}
        onClose={() => !guardando && setMostrarFormulario(false)}
        title="Nuevo paciente"
        size="xl"
      >
        <FormularioPaciente
          onSubmit={handleCrearPaciente}
          onCancel={() => setMostrarFormulario(false)}
          isLoading={guardando}
        />
      </Modal>
    </div>
  );
};

export default Pacientes;
