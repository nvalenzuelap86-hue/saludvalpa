// ============================================================================
// saludvalpa 3.0 - FORMULARIO DE RECETA PERSONALIZADA
// Modal para crear y editar recetas personalizadas del usuario
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/shared/Modal';
import type { RecetaPersonalizada } from '../../../types/nutricion';

// ----------------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------------

interface FormularioRecetaProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (receta: Omit<RecetaPersonalizada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  recetaExistente?: RecetaPersonalizada | null;
}

type CategoriaReceta = 'desayuno' | 'colacion' | 'comida' | 'cena';
type Dificultad = 'facil' | 'media' | 'avanzada';

const CATEGORIAS: { key: CategoriaReceta; label: string; icon: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { key: 'colacion', label: 'Colación', icon: '🍎' },
  { key: 'comida', label: 'Comida', icon: '🍽️' },
  { key: 'cena', label: 'Cena', icon: '🌙' },
];

const DIFICULTADES: { key: Dificultad; label: string }[] = [
  { key: 'facil', label: 'Fácil' },
  { key: 'media', label: 'Media' },
  { key: 'avanzada', label: 'Avanzada' },
];

const ALERGENOS_COMUNES = [
  'gluten', 'lacteos', 'huevo', 'nueces', 'cacahuate',
  'soya', 'pescado', 'mariscos', 'sesamo', 'sulfitos',
];

const ETIQUETAS_SUGERIDAS = [
  'vegano', 'vegetariano', 'sin gluten', 'sin lactosa',
  'bajo en calorias', 'alto en proteina', 'keto', 'mediterraneo',
  'mexicana', 'italiana', 'asiatica', 'rapida',
];

const APTOS_PARA = [
  'diabetico', 'hipertenso', 'celiaco', 'embarazada',
  'deportista', 'adulto mayor', 'nino',
];

// ----------------------------------------------------------------------------
// Estado inicial del formulario
// ----------------------------------------------------------------------------

const RECETA_VACIA = {
  nombre: '',
  categoria: 'comida' as CategoriaReceta,
  descripcion: '',
  ingredientes: [''],
  preparacion: [''],
  tiempoPreparacion: 15,
  dificultad: 'facil' as Dificultad,
  nutrientes: {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    fibra: 0,
  },
  porciones: 1,
  alergenos: [] as string[],
  etiquetas: [] as string[],
  aptoPara: [] as string[],
  favorita: false,
};

// ----------------------------------------------------------------------------
// Componente
// ----------------------------------------------------------------------------

export default function FormularioReceta({
  isOpen,
  onClose,
  onGuardar,
  recetaExistente,
}: FormularioRecetaProps) {
  const [formData, setFormData] = useState(RECETA_VACIA);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [nuevoPaso, setNuevoPaso] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modoEdicion, setModoEdicion] = useState(false);

  // Cargar datos de receta existente al editar
  useEffect(() => {
    if (recetaExistente) {
      setFormData({
        nombre: recetaExistente.nombre,
        categoria: recetaExistente.categoria,
        descripcion: recetaExistente.descripcion,
        ingredientes: recetaExistente.ingredientes.length > 0
          ? recetaExistente.ingredientes
          : [''],
        preparacion: recetaExistente.preparacion.length > 0
          ? recetaExistente.preparacion
          : [''],
        tiempoPreparacion: recetaExistente.tiempoPreparacion,
        dificultad: recetaExistente.dificultad,
        nutrientes: {
          calorias: recetaExistente.nutrientes.calorias,
          proteinas: recetaExistente.nutrientes.proteinas,
          carbohidratos: recetaExistente.nutrientes.carbohidratos,
          grasas: recetaExistente.nutrientes.grasas,
          fibra: recetaExistente.nutrientes.fibra ?? 0,
        },
        porciones: recetaExistente.porciones,
        alergenos: recetaExistente.alergenos || [],
        etiquetas: recetaExistente.etiquetas || [],
        aptoPara: recetaExistente.aptoPara || [],
        favorita: recetaExistente.favorita,
      });
      setModoEdicion(true);
    } else {
      setFormData(RECETA_VACIA);
      setModoEdicion(false);
    }
    setErrors({});
  }, [recetaExistente, isOpen]);

  // Manejar cambios en campos simples
  const handleChange = useCallback((
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  // Manejar cambios en nutrientes
  const handleNutrienteChange = useCallback((
    field: string,
    value: number
  ) => {
    setFormData(prev => ({
      ...prev,
      nutrientes: { ...prev.nutrientes, [field]: value },
    }));
  }, []);

  // Agregar ingrediente
  const agregarIngrediente = useCallback(() => {
    const trimmed = nuevoIngrediente.trim();
    if (trimmed) {
      setFormData(prev => ({
        ...prev,
        ingredientes: [...prev.ingredientes.filter(i => i.trim()), trimmed],
      }));
      setNuevoIngrediente('');
    }
  }, [nuevoIngrediente]);

  // Eliminar ingrediente
  const eliminarIngrediente = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index),
    }));
  }, []);

  // Agregar paso de preparación
  const agregarPaso = useCallback(() => {
    const trimmed = nuevoPaso.trim();
    if (trimmed) {
      setFormData(prev => ({
        ...prev,
        preparacion: [...prev.preparacion.filter(p => p.trim()), trimmed],
      }));
      setNuevoPaso('');
    }
  }, [nuevoPaso]);

  // Eliminar paso
  const eliminarPaso = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      preparacion: prev.preparacion.filter((_, i) => i !== index),
    }));
  }, []);

  // Toggle alergeno
  const toggleAlergeno = useCallback((alergeno: string) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.includes(alergeno)
        ? prev.alergenos.filter(a => a !== alergeno)
        : [...prev.alergenos, alergeno],
    }));
  }, []);

  // Toggle etiqueta
  const toggleEtiqueta = useCallback((etiqueta: string) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.includes(etiqueta)
        ? prev.etiquetas.filter(e => e !== etiqueta)
        : [...prev.etiquetas, etiqueta],
    }));
  }, []);

  // Toggle apto para
  const toggleAptoPara = useCallback((apto: string) => {
    setFormData(prev => ({
      ...prev,
      aptoPara: prev.aptoPara.includes(apto)
        ? prev.aptoPara.filter(a => a !== apto)
        : [...prev.aptoPara, apto],
    }));
  }, []);

  // Validar formulario
  const validar = useCallback((): boolean => {
    const nuevosErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrors.descripcion = 'La descripción es obligatoria';
    }

    const ingredientesValidos = formData.ingredientes.filter(i => i.trim());
    if (ingredientesValidos.length === 0) {
      nuevosErrors.ingredientes = 'Agrega al menos un ingrediente';
    }

    const pasosValidos = formData.preparacion.filter(p => p.trim());
    if (pasosValidos.length === 0) {
      nuevosErrors.preparacion = 'Agrega al menos un paso de preparación';
    }

    if (formData.nutrientes.calorias <= 0) {
      nuevosErrors.calorias = 'Las calorías deben ser mayores a 0';
    }

    if (formData.porciones <= 0) {
      nuevosErrors.porciones = 'Las porciones deben ser mayores a 0';
    }

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  }, [formData]);

  // Guardar receta
  const handleGuardar = useCallback(() => {
    if (!validar()) return;

    const ingredientesValidos = formData.ingredientes.filter(i => i.trim());
    const pasosValidos = formData.preparacion.filter(p => p.trim());

    onGuardar({
      ...formData,
      ingredientes: ingredientesValidos,
      preparacion: pasosValidos,
    });
  }, [formData, validar, onGuardar]);

  // Manejar Enter en inputs
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modoEdicion ? '✏️ Editar Receta' : '🍳 Nueva Receta'} size="xl">
      <div className="space-y-6">
        {/* Nombre y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la receta *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              placeholder="Ej: Ensalada de quinoa con verduras"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              value={formData.categoria}
              onChange={e => handleChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            value={formData.descripcion}
            onChange={e => handleChange('descripcion', e.target.value)}
            placeholder="Describe brevemente la receta..."
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.descripcion ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
          )}
        </div>

        {/* Tiempo, Dificultad, Porciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de preparación (min)
            </label>
            <input
              type="number"
              min={1}
              max={480}
              value={formData.tiempoPreparacion}
              onChange={e => handleChange('tiempoPreparacion', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dificultad
            </label>
            <select
              value={formData.dificultad}
              onChange={e => handleChange('dificultad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DIFICULTADES.map(d => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porciones *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={formData.porciones}
              onChange={e => handleChange('porciones', parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.porciones ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.porciones && (
              <p className="text-red-500 text-xs mt-1">{errors.porciones}</p>
            )}
          </div>
        </div>

        {/* Información Nutricional */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Información Nutricional (por porción)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Calorías *</label>
              <input
                type="number"
                min={0}
                value={formData.nutrientes.calorias}
                onChange={e => handleNutrienteChange('calorias', parseInt(e.target.value) || 0)}
                className={`w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.calorias ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.calorias && (
                <p className="text-red-500 text-xs mt-1">{errors.calorias}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Proteínas (g)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formData.nutrientes.proteinas}
                onChange={e => handleNutrienteChange('proteinas', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Carbohidratos (g)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formData.nutrientes.carbohidratos}
                onChange={e => handleNutrienteChange('carbohidratos', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Grasas (g)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formData.nutrientes.grasas}
                onChange={e => handleNutrienteChange('grasas', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fibra (g)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formData.nutrientes.fibra || 0}
                onChange={e => handleNutrienteChange('fibra', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Ingredientes *
          </h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevoIngrediente}
              onChange={e => setNuevoIngrediente(e.target.value)}
              onKeyDown={e => handleKeyDown(e, agregarIngrediente)}
              placeholder="Escribe un ingrediente y presiona Enter..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={agregarIngrediente}
              disabled={!nuevoIngrediente.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Agregar
            </button>
          </div>
          {errors.ingredientes && (
            <p className="text-red-500 text-xs mb-2">{errors.ingredientes}</p>
          )}
          {formData.ingredientes.filter(i => i.trim()).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.ingredientes.map((ing, index) =>
                ing.trim() ? (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {ing}
                    <button
                      onClick={() => eliminarIngrediente(index)}
                      className="text-blue-400 hover:text-red-500 transition-colors"
                      aria-label={`Eliminar ${ing}`}
                    >
                      ✕
                    </button>
                  </span>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No hay ingredientes agregados</p>
          )}
        </div>

        {/* Pasos de Preparación */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Pasos de Preparación *
          </h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={nuevoPaso}
              onChange={e => setNuevoPaso(e.target.value)}
              onKeyDown={e => handleKeyDown(e, agregarPaso)}
              placeholder="Describe un paso y presiona Enter..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={agregarPaso}
              disabled={!nuevoPaso.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Agregar
            </button>
          </div>
          {errors.preparacion && (
            <p className="text-red-500 text-xs mb-2">{errors.preparacion}</p>
          )}
          {formData.preparacion.filter(p => p.trim()).length > 0 ? (
            <ol className="list-decimal list-inside space-y-1">
              {formData.preparacion.map((paso, index) =>
                paso.trim() ? (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="flex-1">{paso}</span>
                    <button
                      onClick={() => eliminarPaso(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label={`Eliminar paso ${index + 1}`}
                    >
                      ✕
                    </button>
                  </li>
                ) : null
              )}
            </ol>
          ) : (
            <p className="text-gray-400 text-sm italic">No hay pasos de preparación</p>
          )}
        </div>

        {/* Alérgenos */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Alérgenos</h4>
          <div className="flex flex-wrap gap-2">
            {ALERGENOS_COMUNES.map(alergeno => (
              <button
                key={alergeno}
                onClick={() => toggleAlergeno(alergeno)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  formData.alergenos.includes(alergeno)
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {formData.alergenos.includes(alergeno) ? '✓ ' : ''}
                {alergeno.charAt(0).toUpperCase() + alergeno.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Etiquetas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Etiquetas</h4>
          <div className="flex flex-wrap gap-2">
            {ETIQUETAS_SUGERIDAS.map(etiqueta => (
              <button
                key={etiqueta}
                onClick={() => toggleEtiqueta(etiqueta)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  formData.etiquetas.includes(etiqueta)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {formData.etiquetas.includes(etiqueta) ? '✓ ' : ''}
                {etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Apto para */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Apto para</h4>
          <div className="flex flex-wrap gap-2">
            {APTOS_PARA.map(apto => (
              <button
                key={apto}
                onClick={() => toggleAptoPara(apto)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  formData.aptoPara.includes(apto)
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {formData.aptoPara.includes(apto) ? '✓ ' : ''}
                {apto.charAt(0).toUpperCase() + apto.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Favorita */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.favorita}
              onChange={e => handleChange('favorita', e.target.checked)}
              className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">⭐ Marcar como favorita</span>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {modoEdicion ? 'Actualizar Receta' : 'Guardar Receta'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
