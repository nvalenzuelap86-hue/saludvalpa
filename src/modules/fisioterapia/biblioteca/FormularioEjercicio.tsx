// ============================================================================
// COMPONENTE: FormularioEjercicio
// Formulario para crear y editar ejercicios personalizados
// ============================================================================

import { useState, useEffect } from 'react';
import Modal from '../../../components/shared/Modal';
import {
  CategoriaEjercicio,
  IntensidadEjercicio,
  ZonaCorporal,
  type Ejercicio,
} from '../../../types';

interface FormularioEjercicioProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (ejercicio: Omit<Ejercicio, 'id' | 'fechaCreacion' | 'precargado'>) => Promise<void>;
  ejercicioEditar?: Ejercicio;
}

export default function FormularioEjercicio({
  isOpen,
  onClose,
  onGuardar,
  ejercicioEditar,
}: FormularioEjercicioProps) {
  const esEdicion = !!ejercicioEditar;

  // Estado del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<string>(CategoriaEjercicio.OTRO);
  const [descripcion, setDescripcion] = useState('');
  const [instrucciones, setInstrucciones] = useState<string[]>(['']);
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState<string[]>([]);
  const [intensidad, setIntensidad] = useState<string>(IntensidadEjercicio.MEDIA);
  const [equipoNecesario, setEquipoNecesario] = useState<string[]>([]);
  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [contraindicaciones, setContraindicaciones] = useState<string[]>([]);
  const [nuevaContraindicacion, setNuevaContraindicacion] = useState('');
  const [videosUrls, setVideosUrls] = useState<string[]>([]);
  const [nuevaUrlVideo, setNuevaUrlVideo] = useState('');
  const [repeticionesSugeridas, setRepeticionesSugeridas] = useState('');
  const [duracionSugerida, setDuracionSugerida] = useState<number | ''>('');
  const [notasPersonales, setNotasPersonales] = useState('');
  
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (ejercicioEditar) {
      setNombre(ejercicioEditar.nombre);
      setCategoria(ejercicioEditar.categoria);
      setDescripcion(ejercicioEditar.descripcion);
      setInstrucciones(ejercicioEditar.instrucciones);
      setZonasSeleccionadas(ejercicioEditar.zonasCorporales);
      setIntensidad(ejercicioEditar.intensidad);
      setEquipoNecesario(ejercicioEditar.equipoNecesario);
      setContraindicaciones(ejercicioEditar.contraindicaciones);
      setVideosUrls(ejercicioEditar.videosUrls || []);
      setRepeticionesSugeridas(ejercicioEditar.repeticionesSugeridas || '');
      setDuracionSugerida(ejercicioEditar.duracionSugerida || '');
      setNotasPersonales(ejercicioEditar.notasPersonales || '');
    } else {
      resetearFormulario();
    }
  }, [ejercicioEditar, isOpen]);

  const resetearFormulario = () => {
    setNombre('');
    setCategoria(CategoriaEjercicio.OTRO);
    setDescripcion('');
    setInstrucciones(['']);
    setZonasSeleccionadas([]);
    setIntensidad(IntensidadEjercicio.MEDIA);
    setEquipoNecesario([]);
    setNuevoEquipo('');
    setContraindicaciones([]);
    setNuevaContraindicacion('');
    setVideosUrls([]);
    setNuevaUrlVideo('');
    setRepeticionesSugeridas('');
    setDuracionSugerida('');
    setNotasPersonales('');
    setError('');
  };

  const handleAgregarInstruccion = () => {
    setInstrucciones([...instrucciones, '']);
  };

  const handleActualizarInstruccion = (index: number, valor: string) => {
    const nuevas = [...instrucciones];
    nuevas[index] = valor;
    setInstrucciones(nuevas);
  };

  const handleEliminarInstruccion = (index: number) => {
    if (instrucciones.length > 1) {
      setInstrucciones(instrucciones.filter((_, i) => i !== index));
    }
  };

  const handleToggleZona = (zona: string) => {
    if (zonasSeleccionadas.includes(zona)) {
      setZonasSeleccionadas(zonasSeleccionadas.filter(z => z !== zona));
    } else {
      setZonasSeleccionadas([...zonasSeleccionadas, zona]);
    }
  };

  const handleAgregarEquipo = () => {
    if (nuevoEquipo.trim() && !equipoNecesario.includes(nuevoEquipo.trim())) {
      setEquipoNecesario([...equipoNecesario, nuevoEquipo.trim()]);
      setNuevoEquipo('');
    }
  };

  const handleEliminarEquipo = (equipo: string) => {
    setEquipoNecesario(equipoNecesario.filter(e => e !== equipo));
  };

  const handleAgregarContraindicacion = () => {
    if (nuevaContraindicacion.trim() && !contraindicaciones.includes(nuevaContraindicacion.trim())) {
      setContraindicaciones([...contraindicaciones, nuevaContraindicacion.trim()]);
      setNuevaContraindicacion('');
    }
  };

  const handleEliminarContraindicacion = (contraindicacion: string) => {
    setContraindicaciones(contraindicaciones.filter(c => c !== contraindicacion));
  };

  const handleAgregarUrlVideo = () => {
    const url = nuevaUrlVideo.trim();
    if (!url) return;

    // Validación básica: debe comenzar con http:// o https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('La URL debe comenzar con http:// o https://');
      return;
    }

    if (!videosUrls.includes(url)) {
      setVideosUrls([...videosUrls, url]);
      setNuevaUrlVideo('');
    }
  };

  const handleEliminarUrlVideo = (url: string) => {
    setVideosUrls(videosUrls.filter(u => u !== url));
  };

  const validarFormulario = (): boolean => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }

    const instruccionesFiltradas = instrucciones.filter(i => i.trim());
    if (instruccionesFiltradas.length === 0) {
      setError('Debes agregar al menos una instrucción');
      return false;
    }

    if (zonasSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una zona corporal');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      const ejercicio: Omit<Ejercicio, 'id' | 'fechaCreacion' | 'precargado'> = {
        nombre: nombre.trim(),
        categoria: categoria as any,
        descripcion: descripcion.trim(),
        instrucciones: instrucciones.filter(i => i.trim()),
        zonasCorporales: zonasSeleccionadas as any[],
        intensidad: intensidad as any,
        equipoNecesario,
        contraindicaciones,
        videosUrls: videosUrls.length > 0 ? videosUrls : undefined,
        repeticionesSugeridas: repeticionesSugeridas.trim() || undefined,
        duracionSugerida: duracionSugerida ? Number(duracionSugerida) : undefined,
        notasPersonales: notasPersonales.trim() || undefined,
        favorito: ejercicioEditar?.favorito || false,
        usuarioCreadorId: '1', // TODO: Obtener del usuario actual
        fechaActualizacion: esEdicion ? new Date() : undefined,
      };

      await onGuardar(ejercicio);
      resetearFormulario();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el ejercicio');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={esEdicion ? 'Editar Ejercicio' : 'Nuevo Ejercicio Personalizado'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre del Ejercicio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            placeholder="Ej: Sentadilla con peso"
            required
          />
        </div>

        {/* Categoría e Intensidad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              required
            >
              <option value={CategoriaEjercicio.MOVILIDAD}>Movilidad</option>
              <option value={CategoriaEjercicio.FUERZA}>Fuerza</option>
              <option value={CategoriaEjercicio.EQUILIBRIO}>Equilibrio</option>
              <option value={CategoriaEjercicio.ESTIRAMIENTO}>Estiramiento</option>
              <option value={CategoriaEjercicio.CARDIO}>Cardio</option>
              <option value={CategoriaEjercicio.OTRO}>Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Intensidad <span className="text-red-500">*</span>
            </label>
            <select
              value={intensidad}
              onChange={(e) => setIntensidad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              required
            >
              <option value={IntensidadEjercicio.BAJA}>Baja</option>
              <option value={IntensidadEjercicio.MEDIA}>Media</option>
              <option value={IntensidadEjercicio.ALTA}>Alta</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            placeholder="Describe el ejercicio..."
            required
          />
        </div>

        {/* Instrucciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instrucciones Paso a Paso <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {instrucciones.map((instruccion, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-sm text-gray-500 pt-2 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={instruccion}
                  onChange={(e) => handleActualizarInstruccion(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                  placeholder={`Paso ${index + 1}`}
                />
                {instrucciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleEliminarInstruccion(index)}
                    className="text-red-600 hover:text-red-700 px-2"
                  >
                    ✗
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAgregarInstruccion}
            className="mt-2 text-sm text-saludvalpa-blue hover:text-saludvalpa-blue-dark"
          >
            + Agregar paso
          </button>
        </div>

        {/* Zonas Corporales */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Zonas Corporales <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {Object.values(ZonaCorporal).map((zona) => (
              <label
                key={zona}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={zonasSeleccionadas.includes(zona)}
                  onChange={() => handleToggleZona(zona)}
                  className="rounded text-saludvalpa-blue focus:ring-saludvalpa-blue"
                />
                <span className="capitalize">
                  {zona.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>
          {zonasSeleccionadas.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {zonasSeleccionadas.length} zona(s) seleccionada(s)
            </p>
          )}
        </div>

        {/* Repeticiones y Duración */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Repeticiones Sugeridas
            </label>
            <input
              type="text"
              value={repeticionesSugeridas}
              onChange={(e) => setRepeticionesSugeridas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="Ej: 3 series de 10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Duración (minutos)
            </label>
            <input
              type="number"
              value={duracionSugerida}
              onChange={(e) => setDuracionSugerida(e.target.value ? Number(e.target.value) : '')}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="Ej: 10"
            />
          </div>
        </div>

        {/* Equipo Necesario */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Equipo Necesario
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevoEquipo}
              onChange={(e) => setNuevoEquipo(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAgregarEquipo();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="Ej: Banda elástica"
            />
            <button
              type="button"
              onClick={handleAgregarEquipo}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Agregar
            </button>
          </div>
          {equipoNecesario.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {equipoNecesario.map((equipo, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {equipo}
                  <button
                    type="button"
                    onClick={() => handleEliminarEquipo(equipo)}
                    className="hover:text-blue-900"
                  >
                    ✗
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contraindicaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Contraindicaciones
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevaContraindicacion}
              onChange={(e) => setNuevaContraindicacion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAgregarContraindicacion();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="Ej: Dolor agudo de rodilla"
            />
            <button
              type="button"
              onClick={handleAgregarContraindicacion}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Agregar
            </button>
          </div>
          {contraindicaciones.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contraindicaciones.map((contraindicacion, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                >
                  {contraindicacion}
                  <button
                    type="button"
                    onClick={() => handleEliminarContraindicacion(contraindicacion)}
                    className="hover:text-yellow-900"
                  >
                    ✗
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Videos de referencia (URLs) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Videos de referencia (URLs)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Agrega enlaces a videos de YouTube, Vimeo, etc.
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={nuevaUrlVideo}
              onChange={(e) => setNuevaUrlVideo(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAgregarUrlVideo();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <button
              type="button"
              onClick={handleAgregarUrlVideo}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Agregar
            </button>
          </div>
          {videosUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {videosUrls.map((url, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm max-w-full"
                >
                  <span className="truncate max-w-[250px]">
                    🎬 {url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEliminarUrlVideo(url)}
                    className="hover:text-green-900 flex-shrink-0"
                  >
                    ✗
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notas Personales */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Notas Personales
          </label>
          <textarea
            value={notasPersonales}
            onChange={(e) => setNotasPersonales(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
            placeholder="Notas adicionales sobre el ejercicio..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 bg-saludvalpa-blue text-white py-2 px-4 rounded-lg hover:bg-saludvalpa-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear Ejercicio'}
          </button>
          <button
            type="button"
            onClick={() => {
              resetearFormulario();
              onClose();
            }}
            disabled={guardando}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
