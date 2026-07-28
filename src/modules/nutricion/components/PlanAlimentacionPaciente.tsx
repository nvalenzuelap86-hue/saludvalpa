// ============================================================================
// saludvalpa 3.0 - PLAN DE ALIMENTACIÓN PARA PACIENTE
// Vista detallada de un plan de alimentación asignado a un paciente
// Incluye lista de compras para planes semanales y generación de PDF
// ============================================================================

import { useState, useEffect } from 'react';
import Modal from '../../../components/shared/Modal';
import type { PlanAlimentacion, ComidaEnPlan, SeguimientoNutricional } from '../../../types/nutricion';
import type { Paciente } from '../../../types';
import { usePlanesAlimentacion } from '../hooks/usePlanesAlimentacion';
import EditorPDFPlanAlimentacion from './EditorPDFPlanAlimentacion';

interface PlanAlimentacionPacienteProps {
  plan: PlanAlimentacion;
  onVolver: () => void;
  paciente: Paciente;
}

const TIPOS_COMIDA: { key: ComidaEnPlan['tipo']; label: string; icon: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '🌅' },
  { key: 'colacion1', label: 'Colación matutina', icon: '🍎' },
  { key: 'comida', label: 'Comida', icon: '🍽️' },
  { key: 'colacion2', label: 'Colación vespertina', icon: '🥜' },
  { key: 'cena', label: 'Cena', icon: '🌙' },
];

const CATEGORIAS_COMPRA: Record<string, { icon: string; color: string }> = {
  'Proteinas': { icon: '🥩', color: 'bg-red-50 border-red-200' },
  'Verduras': { icon: '🥦', color: 'bg-green-50 border-green-200' },
  'Frutas': { icon: '🍎', color: 'bg-amber-50 border-amber-200' },
  'Cereales y Tubérculos': { icon: '🌾', color: 'bg-yellow-50 border-yellow-200' },
  'Leguminosas': { icon: '🫘', color: 'bg-orange-50 border-orange-200' },
  'Lácteos': { icon: '🥛', color: 'bg-blue-50 border-blue-200' },
  'Aceites y Semillas': { icon: '🥜', color: 'bg-purple-50 border-purple-200' },
  'Endulzantes': { icon: '🍯', color: 'bg-pink-50 border-pink-200' },
  'Especias y Condimentos': { icon: '🧂', color: 'bg-gray-50 border-gray-200' },
  'Otros': { icon: '📦', color: 'bg-gray-100 border-gray-300' },
};

export default function PlanAlimentacionPaciente({ plan, onVolver, paciente }: PlanAlimentacionPacienteProps) {
  const {
    toggleActivo,
    convertirEnPlantilla,
    eliminarComida,
    personalizarComida,
    calcularNutrientesPlan,
    registrarSeguimiento,
    obtenerSeguimiento,
    obtenerAdherencia,
    generarListaCompras,
  } = usePlanesAlimentacion();

  const [seguimientos, setSeguimientos] = useState<SeguimientoNutricional[]>([]);
  const [adherencia, setAdherencia] = useState<any>(null);
  const [nutrientesCalculados, setNutrientesCalculados] = useState<any>(null);
  const [editandoComida, setEditandoComida] = useState<{ tipo: ComidaEnPlan['tipo']; comidaId: string } | null>(null);
  const [porcionEdit, setPorcionEdit] = useState(1);
  const [notasEdit, setNotasEdit] = useState('');

  // Estado para editor PDF
  const [editorPDFAbierto, setEditorPDFAbierto] = useState(false);

  // Estado para lista de compras
  const [listaComprasAbierta, setListaComprasAbierta] = useState(false);
  const [listaCompras, setListaCompras] = useState<{
    ingredientes: { nombre: string; cantidad: string; categoria: string }[];
    totalCalorias: number;
    totalProteinas: number;
    totalCarbohidratos: number;
    totalGrasas: number;
  } | null>(null);
  const [cargandoLista, setCargandoLista] = useState(false);

  // Cargar datos adicionales
  useEffect(() => {
    const cargarDatos = async () => {
      const [segs, adh, nute] = await Promise.all([
        obtenerSeguimiento(plan.id),
        obtenerAdherencia(plan.id),
        calcularNutrientesPlan(plan.id),
      ]);
      setSeguimientos(segs);
      setAdherencia(adh);
      setNutrientesCalculados(nute);
    };
    cargarDatos();
  }, [plan.id]);

  const handleGenerarListaCompras = async () => {
    setCargandoLista(true);
    try {
      const resultado = await generarListaCompras(plan.id);
      setListaCompras(resultado);
      setListaComprasAbierta(true);
    } catch (err: any) {
      console.error('Error al generar lista de compras:', err);
    } finally {
      setCargandoLista(false);
    }
  };

  const handlePersonalizar = async (tipo: ComidaEnPlan['tipo'], comidaId: string) => {
    await personalizarComida(plan.id, comidaId, {
      porcionMultiplicador: porcionEdit,
      notas: notasEdit || undefined,
    });
    setEditandoComida(null);
  };

  const handleEliminarComida = async (tipo: ComidaEnPlan['tipo'], comidaId: string) => {
    await eliminarComida(plan.id, comidaId);
  };

  const totalComidas = Object.values(plan.distribucionComidas).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header del plan */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{plan.nombre}</h2>
          {plan.descripcion && (
            <p className="text-sm text-gray-500 mt-1">{plan.descripcion}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleActivo(plan.id)}
            className={`px-3 py-1.5 rounded text-sm ${
              plan.activo
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {plan.activo ? '✓ Activo' : 'Inactivo'}
          </button>
          {!plan.esPlantilla && (
            <button
              onClick={() => convertirEnPlantilla(plan.id)}
              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
            >
              📋 Convertir en plantilla
            </button>
          )}
          <button
            onClick={handleGenerarListaCompras}
            disabled={cargandoLista}
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 disabled:opacity-50"
          >
            {cargandoLista ? 'Generando...' : '🛒 Lista de Compras'}
          </button>
          <button
            onClick={() => setEditorPDFAbierto(true)}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            📄 Enviar Plan
          </button>
          <button
            onClick={onVolver}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200"
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{plan.requerimientos.calorias}</div>
          <div className="text-xs text-blue-600">kcal/día</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">{totalComidas}</div>
          <div className="text-xs text-amber-600">Comidas/día</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            {adherencia ? `${adherencia.promedio}%` : '-'}
          </div>
          <div className="text-xs text-green-600">Adherencia</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{seguimientos.length}</div>
          <div className="text-xs text-purple-600">Registros</div>
        </div>
      </div>

      {/* Macros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribución de macronutrientes</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Proteínas</span>
              <span className="text-xs font-medium text-blue-700">{plan.requerimientos.proteinas}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{
                  width: `${plan.requerimientos.calorias > 0
                    ? Math.round((plan.requerimientos.proteinas * 4 / plan.requerimientos.calorias) * 100)
                    : 0}%`
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Carbohidratos</span>
              <span className="text-xs font-medium text-amber-700">{plan.requerimientos.carbohidratos}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-500 rounded-full h-2"
                style={{
                  width: `${plan.requerimientos.calorias > 0
                    ? Math.round((plan.requerimientos.carbohidratos * 4 / plan.requerimientos.calorias) * 100)
                    : 0}%`
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Grasas</span>
              <span className="text-xs font-medium text-red-700">{plan.requerimientos.grasas}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 rounded-full h-2"
                style={{
                  width: `${plan.requerimientos.calorias > 0
                    ? Math.round((plan.requerimientos.grasas * 9 / plan.requerimientos.calorias) * 100)
                    : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de comidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan de comidas</h3>
        <div className="space-y-4">
          {TIPOS_COMIDA.map(({ key, label, icon }) => {
            const comidas = plan.distribucionComidas[key];
            return (
              <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{icon} {label}</span>
                  <span className="text-xs text-gray-500">
                    {comidas.reduce((sum, c) => sum + (c.nutrientes?.calorias || 0), 0)} kcal
                  </span>
                </div>
                {comidas.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {comidas.map((comida) => (
                      <div key={comida.id} className="px-4 py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{comida.nombre}</span>
                              <span className="text-xs text-gray-400">{comida.horario}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>🔥 {comida.nutrientes?.calorias || 0} kcal</span>
                              <span>🥩 {comida.nutrientes?.proteinas || 0}g</span>
                              <span>🍚 {comida.nutrientes?.carbohidratos || 0}g</span>
                              <span>🧈 {comida.nutrientes?.grasas || 0}g</span>
                              {comida.porcionMultiplicador !== 1 && (
                                <span className="text-amber-600 font-medium">
                                  x{comida.porcionMultiplicador}
                                </span>
                              )}
                            </div>
                            {comida.ingredientes && comida.ingredientes.length > 0 && (
                              <div className="mt-1 text-xs text-gray-400">
                                {comida.ingredientes.join(', ')}
                              </div>
                            )}
                            {comida.notas && (
                              <div className="mt-1 text-xs text-amber-600 italic">
                                📝 {comida.notas}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => {
                                setEditandoComida({ tipo: key, comidaId: comida.id });
                                setPorcionEdit(comida.porcionMultiplicador);
                                setNotasEdit(comida.notas || '');
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                              title="Personalizar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleEliminarComida(key, comida.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Editor de personalización inline */}
                        {editandoComida?.tipo === key && editandoComida?.comidaId === comida.id && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <h5 className="text-sm font-medium text-amber-800 mb-2">
                              Personalizar comida
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-amber-700 mb-1">
                                  Factor de porción
                                </label>
                                <input
                                  type="number"
                                  step="0.25"
                                  min="0.25"
                                  max="4"
                                  value={porcionEdit}
                                  onChange={(e) => setPorcionEdit(parseFloat(e.target.value) || 1)}
                                  className="w-full px-2 py-1 border border-amber-300 rounded text-sm"
                                />
                                <p className="text-xs text-amber-600 mt-1">
                                  1 = normal, 0.5 = media, 2 = doble
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs text-amber-700 mb-1">
                                  Notas / Sustituciones
                                </label>
                                <input
                                  type="text"
                                  value={notasEdit}
                                  onChange={(e) => setNotasEdit(e.target.value)}
                                  placeholder="Ej: Sustituir pollo por tofu"
                                  className="w-full px-2 py-1 border border-amber-300 rounded text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <button
                                onClick={() => setEditandoComida(null)}
                                className="px-2 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handlePersonalizar(key, comida.id)}
                                className="px-2 py-1 text-xs text-white bg-amber-600 rounded hover:bg-amber-700"
                              >
                                Guardar cambios
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    Sin comidas registradas
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      {plan.recomendaciones.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-2">📋 Recomendaciones</h4>
          <ul className="list-disc list-inside space-y-1">
            {plan.recomendaciones.map((rec, idx) => (
              <li key={idx} className="text-sm text-green-700">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Seguimiento */}
      {seguimientos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de seguimiento</h3>
          <div className="space-y-2">
            {seguimientos.slice(-10).reverse().map((seg) => (
              <div key={seg.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(seg.fecha).toLocaleDateString('es-MX')}
                  </span>
                  <span className={`text-sm font-medium ${
                    seg.cumplimiento >= 80 ? 'text-green-600' :
                    seg.cumplimiento >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {seg.cumplimiento}% cumplimiento
                  </span>
                </div>
                {seg.dificultades.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Dificultades: {seg.dificultades.join(', ')}
                  </div>
                )}
                {seg.observaciones && (
                  <div className="mt-1 text-xs text-gray-400 italic">
                    {seg.observaciones}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Lista de Compras */}
      <Modal
        isOpen={listaComprasAbierta}
        onClose={() => setListaComprasAbierta(false)}
        title="🛒 Lista de Compras Semanal"
        size="lg"
      >
        {listaCompras && (
          <div className="space-y-4">
            {/* Totales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">{listaCompras.totalCalorias}</div>
                <div className="text-xs text-blue-600">kcal totales</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-700">{listaCompras.totalProteinas}g</div>
                <div className="text-xs text-red-600">Proteínas</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-amber-700">{listaCompras.totalCarbohidratos}g</div>
                <div className="text-xs text-amber-600">Carbohidratos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-700">{listaCompras.totalGrasas}g</div>
                <div className="text-xs text-green-600">Grasas</div>
              </div>
            </div>

            {/* Ingredientes por categoría */}
            {Object.entries(
              listaCompras.ingredientes.reduce((acc, ing) => {
                if (!acc[ing.categoria]) acc[ing.categoria] = [];
                acc[ing.categoria].push(ing);
                return acc;
              }, {} as Record<string, typeof listaCompras.ingredientes>)
            ).map(([categoria, items]) => {
              const catInfo = CATEGORIAS_COMPRA[categoria] || { icon: '📦', color: 'bg-gray-100 border-gray-300' };
              return (
                <div key={categoria} className={`rounded-lg p-3 ${catInfo.color} border`}>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">
                    {catInfo.icon} {categoria} ({items.length})
                  </h5>
                  <ul className="space-y-1">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.nombre}</span>
                        <span className="text-xs text-gray-500">{item.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Editor PDF Plan de Alimentación */}
      {editorPDFAbierto && (
        <EditorPDFPlanAlimentacion
          plan={plan}
          paciente={paciente}
          onClose={() => setEditorPDFAbierto(false)}
        />
      )}
    </div>
  );
}
