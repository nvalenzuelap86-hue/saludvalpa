// ============================================================================
// saludvalpa 3.0 - CAMPOS ODONTOLOGÍA
// Componente principal para sesiones de odontología
// ============================================================================

import { useState } from 'react';
import type { DatosOdontologia } from '../../../types';
import HistoriaClinicaOdontologica from './HistoriaClinicaOdontologica';
import { OdontogramaSVG } from '../odontograma/OdontogramaSVG';

interface CamposOdontologiaProps {
  datos: DatosOdontologia;
  onChange: (datos: DatosOdontologia) => void;
}

export default function CamposOdontologia({ datos, onChange }: CamposOdontologiaProps) {
  const [seccionActiva, setSeccionActiva] = useState<'historia' | 'odontograma' | 'tratamiento' | 'documentos'>('historia');
  
  // Estados para tratamientos
  const [nuevoProcedimiento, setNuevoProcedimiento] = useState({
    codigo: '',
    descripcion: '',
    piezas: [] as number[],
    costo: 0,
    duracion: 60,
    prioridad: 'media' as 'alta' | 'media' | 'baja',
  });

  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre: '',
    cantidad: 1,
    unidad: 'unidad',
    costo: 0,
  });

  const handleChange = (campo: keyof DatosOdontologia, valor: any) => {
    onChange({
      ...datos,
      [campo]: valor,
    });
  };

  const agregarProcedimiento = () => {
    if (!nuevoProcedimiento.codigo || !nuevoProcedimiento.descripcion) return;
    
    const procedimientos = [...datos.tratamientoPlanificado, {
      ...nuevoProcedimiento,
      piezas: nuevoProcedimiento.piezas,
    }];
    
    handleChange('tratamientoPlanificado', procedimientos);
    
    // Resetear formulario
    setNuevoProcedimiento({
      codigo: '',
      descripcion: '',
      piezas: [],
      costo: 0,
      duracion: 60,
      prioridad: 'media',
    });
  };

  const agregarMaterial = () => {
    if (!nuevoMaterial.nombre) return;
    
    const materiales = [...datos.materialesUtilizados, nuevoMaterial];
    handleChange('materialesUtilizados', materiales);
    
    // Resetear formulario
    setNuevoMaterial({
      nombre: '',
      cantidad: 1,
      unidad: 'unidad',
      costo: 0,
    });
  };

  const eliminarProcedimiento = (index: number) => {
    const procedimientos = datos.tratamientoPlanificado.filter((_, i) => i !== index);
    handleChange('tratamientoPlanificado', procedimientos);
  };

  const eliminarMaterial = (index: number) => {
    const materiales = datos.materialesUtilizados.filter((_, i) => i !== index);
    handleChange('materialesUtilizados', materiales);
  };

  // Calcular total del tratamiento
  const calcularTotal = () => {
    const totalProcedimientos = datos.tratamientoPlanificado.reduce((sum, p) => sum + (p.costo || 0), 0);
    const totalMateriales = datos.materialesUtilizados.reduce((sum, m) => sum + ((m.costo || 0) * m.cantidad), 0);
    return totalProcedimientos + totalMateriales;
  };

  // Renderizar sección de navegación
  const renderNavegacion = () => (
    <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
      <button
        onClick={() => setSeccionActiva('historia')}
        className={`px-4 py-2 rounded-lg font-medium ${
          seccionActiva === 'historia'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Historia Clínica
      </button>
      <button
        onClick={() => setSeccionActiva('odontograma')}
        className={`px-4 py-2 rounded-lg font-medium ${
          seccionActiva === 'odontograma'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Odontograma
      </button>
      <button
        onClick={() => setSeccionActiva('tratamiento')}
        className={`px-4 py-2 rounded-lg font-medium ${
          seccionActiva === 'tratamiento'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Plan de Tratamiento
      </button>
      <button
        onClick={() => setSeccionActiva('documentos')}
        className={`px-4 py-2 rounded-lg font-medium ${
          seccionActiva === 'documentos'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Documentos
      </button>
    </div>
  );

  // Renderizar sección de historia clínica
  const renderHistoriaClinica = () => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Historia Clínica Odontológica</h3>
      <HistoriaClinicaOdontologica datos={datos} onChange={onChange} />
    </div>
  );

  // Renderizar sección de odontograma
  const renderOdontograma = () => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Odontograma Interactivo</h3>
      <div className="mb-4">
        <p className="text-gray-600">
          Registre el estado de cada pieza dental. Haga clic en las piezas para cambiar su estado.
        </p>
      </div>
      <OdontogramaSVG
        datosOdontograma={datos.odontograma}
        onOdontogramaChange={(piezas) => {
          handleChange('odontograma', {
            ...datos.odontograma,
            piezas,
            notas: datos.odontograma?.notas || '',
          });
        }}
        modoEdicion={true}
        mostrarLeyenda={true}
      />
    </div>
  );

  // Renderizar sección de tratamiento
  const renderTratamiento = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Plan de Tratamiento</h3>
        
        {/* Formulario para nuevo procedimiento */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-bold text-gray-700 mb-3">Agregar Procedimiento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código CDT:
              </label>
              <input
                type="text"
                value={nuevoProcedimiento.codigo}
                onChange={(e) => setNuevoProcedimiento({...nuevoProcedimiento, codigo: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ej: D1110"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción:
              </label>
              <input
                type="text"
                value={nuevoProcedimiento.descripcion}
                onChange={(e) => setNuevoProcedimiento({...nuevoProcedimiento, descripcion: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ej: Profilaxis dental"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piezas (números FDI):
              </label>
              <input
                type="text"
                value={nuevoProcedimiento.piezas.join(', ')}
                onChange={(e) => {
                  const piezas = e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                  setNuevoProcedimiento({...nuevoProcedimiento, piezas});
                }}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ej: 16, 26, 36, 46"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo ($):
              </label>
              <input
                type="number"
                value={nuevoProcedimiento.costo}
                onChange={(e) => setNuevoProcedimiento({...nuevoProcedimiento, costo: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (min):
              </label>
              <input
                type="number"
                value={nuevoProcedimiento.duracion}
                onChange={(e) => setNuevoProcedimiento({...nuevoProcedimiento, duracion: parseInt(e.target.value) || 60})}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad:
              </label>
              <select
                value={nuevoProcedimiento.prioridad}
                onChange={(e) => setNuevoProcedimiento({...nuevoProcedimiento, prioridad: e.target.value as any})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
          <button
            onClick={agregarProcedimiento}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Procedimiento
          </button>
        </div>

        {/* Lista de procedimientos */}
        <div className="mb-8">
          <h4 className="font-bold text-gray-700 mb-3">Procedimientos Planificados</h4>
          {datos.tratamientoPlanificado.length === 0 ? (
            <p className="text-gray-500 italic">No hay procedimientos planificados</p>
          ) : (
            <div className="space-y-3">
              {datos.tratamientoPlanificado.map((proc, index) => (
                <div key={index} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {proc.codigo} - {proc.descripcion}
                    </div>
                    <div className="text-sm text-gray-600">
                      Piezas: {proc.piezas.join(', ')} | 
                      Costo: ${proc.costo.toFixed(2)} | 
                      Duración: {proc.duracion} min | 
                      Prioridad: <span className={`font-medium ${
                        proc.prioridad === 'alta' ? 'text-red-600' :
                        proc.prioridad === 'media' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{proc.prioridad}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarProcedimiento(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario para materiales */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-bold text-gray-700 mb-3">Agregar Material</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre:
              </label>
              <input
                type="text"
                value={nuevoMaterial.nombre}
                onChange={(e) => setNuevoMaterial({...nuevoMaterial, nombre: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ej: Composite A2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad:
              </label>
              <input
                type="number"
                value={nuevoMaterial.cantidad}
                onChange={(e) => setNuevoMaterial({...nuevoMaterial, cantidad: parseInt(e.target.value) || 1})}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad:
              </label>
              <select
                value={nuevoMaterial.unidad}
                onChange={(e) => setNuevoMaterial({...nuevoMaterial, unidad: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="unidad">Unidad</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="paquete">Paquete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo unitario ($):
              </label>
              <input
                type="number"
                value={nuevoMaterial.costo}
                onChange={(e) => setNuevoMaterial({...nuevoMaterial, costo: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button
            onClick={agregarMaterial}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Agregar Material
          </button>
        </div>

        {/* Lista de materiales */}
        <div className="mb-8">
          <h4 className="font-bold text-gray-700 mb-3">Materiales Utilizados</h4>
          {datos.materialesUtilizados.length === 0 ? (
            <p className="text-gray-500 italic">No hay materiales registrados</p>
          ) : (
            <div className="space-y-3">
              {datos.materialesUtilizados.map((mat, index) => (
                <div key={index} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{mat.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {mat.cantidad} {mat.unidad} × ${mat.costo?.toFixed(2) || '0.00'} = 
                      <span className="font-medium ml-1">
                        ${((mat.costo || 0) * mat.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => eliminarMaterial(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen financiero */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-700 mb-3">Resumen Financiero</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-blue-600">
                {datos.tratamientoPlanificado.length}
              </div>
              <div className="text-sm">Procedimientos</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-green-600">
                {datos.materialesUtilizados.length}
              </div>
              <div className="text-sm">Materiales</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-purple-600">
                ${calcularTotal().toFixed(2)}
              </div>
              <div className="text-sm">Total estimado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar sección de documentos
  const renderDocumentos = () => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Documentos Odontológicos</h3>
      <p className="text-gray-600 mb-6">
        Genere documentos profesionales para el paciente.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">📋</div>
          <h4 className="font-bold text-gray-700">Historia Clínica</h4>
          <p className="text-sm text-gray-500">Generar PDF completo</p>
        </div>
        
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">🦷</div>
          <h4 className="font-bold text-gray-700">Odontograma</h4>
          <p className="text-sm text-gray-500">Exportar odontograma</p>
        </div>
        
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="font-bold text-gray-700">Presupuesto</h4>
          <p className="text-sm text-gray-500">Generar presupuesto</p>
        </div>
        
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">📝</div>
          <h4 className="font-bold text-gray-700">Consentimiento</h4>
          <p className="text-sm text-gray-500">Informado</p>
        </div>
        
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">📊</div>
          <h4 className="font-bold text-gray-700">Plan de Tratamiento</h4>
          <p className="text-sm text-gray-500">Detallado</p>
        </div>
        
        <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
          <div className="text-3xl mb-2">🩺</div>
          <h4 className="font-bold text-gray-700">Nota de Evolución</h4>
          <p className="text-sm text-gray-500">Seguimiento</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Los generadores de documentos PDF se implementarán en la siguiente fase.
          Por ahora, los datos están listos para ser exportados.
        </p>
      </div>
    </div>  );

  // Renderizar contenido según sección activa
  const renderContenido = () => {
    switch (seccionActiva) {
      case 'historia':
        return renderHistoriaClinica();
      case 'odontograma':
        return renderOdontograma();
      case 'tratamiento':
        return renderTratamiento();
      case 'documentos':
        return renderDocumentos();
      default:
        return renderHistoriaClinica();
    }
  };

  return (
    <div className="campos-odontologia">
      {renderNavegacion()}
      {renderContenido()}
    </div>
  );
}
