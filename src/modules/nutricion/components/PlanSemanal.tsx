// ============================================================================
// saludvalpa 3.0 - PLAN SEMANAL DE COMIDAS
// Componente de cuadrícula semanal (Lun-Dom) para planificar comidas por día
// Incluye soporte para repetición de menú (copiar día/semana)
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import SelectorComidas from './SelectorComidas';
import type { ComidaEnDia, DiaSemana, ComidaEnPlan, ComidaPrecargada, RecetaPersonalizada } from '../../../types/nutricion';

interface PlanSemanalProps {
  comidasPorDia: ComidaEnDia[];
  onChange: (comidasPorDia: ComidaEnDia[]) => void;
  readOnly?: boolean;
  // Soporte para repetición de menú
  semanaActual?: number; // Número de semana actual (1-based)
  totalSemanas?: number; // Total de semanas en el ciclo
  onCambiarSemana?: (semana: number) => void;
  onCopiarDia?: (origen: DiaSemana, destino: DiaSemana) => void;
  onCopiarSemana?: (origen: number, destino: number) => void;
  onLimpiarDia?: (dia: DiaSemana) => void;
  onLimpiarSemana?: () => void;
  // Soporte para recetas personalizadas
  recetasPersonalizadas?: RecetaPersonalizada[];
  onCrearReceta?: (receta: Omit<RecetaPersonalizada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  onEditarReceta?: (receta: RecetaPersonalizada) => void;
  onEliminarReceta?: (id: string) => void;
}

const DIAS: { key: DiaSemana; label: string; labelCorto: string }[] = [
  { key: 'lunes', label: 'Lunes', labelCorto: 'Lun' },
  { key: 'martes', label: 'Martes', labelCorto: 'Mar' },
  { key: 'miercoles', label: 'Miércoles', labelCorto: 'Mié' },
  { key: 'jueves', label: 'Jueves', labelCorto: 'Jue' },
  { key: 'viernes', label: 'Viernes', labelCorto: 'Vie' },
  { key: 'sabado', label: 'Sábado', labelCorto: 'Sáb' },
  { key: 'domingo', label: 'Domingo', labelCorto: 'Dom' },
];

// 5 categorías: desayuno, colación matutina, comida, colación vespertina, cena
const CATEGORIAS_COMIDA: { key: string; label: string; icon: string; color: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '🌅', color: 'bg-amber-50 border-amber-200' },
  { key: 'colacion1', label: 'Colación matutina', icon: '🍎', color: 'bg-green-50 border-green-200' },
  { key: 'comida', label: 'Comida', icon: '🍽️', color: 'bg-blue-50 border-blue-200' },
  { key: 'colacion2', label: 'Colación vespertina', icon: '🥜', color: 'bg-orange-50 border-orange-200' },
  { key: 'cena', label: 'Cena', icon: '🌙', color: 'bg-purple-50 border-purple-200' },
];

export default function PlanSemanal({
  comidasPorDia,
  onChange,
  readOnly = false,
  semanaActual = 1,
  totalSemanas = 1,
  onCambiarSemana,
  onCopiarDia,
  onCopiarSemana,
  onLimpiarDia,
  onLimpiarSemana,
  recetasPersonalizadas = [],
  onCrearReceta,
  onEditarReceta,
  onEliminarReceta,
}: PlanSemanalProps) {
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaSemana | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [colacionTipo, setColacionTipo] = useState<'colacion1' | 'colacion2'>('colacion1');
  const [diaExpandido, setDiaExpandido] = useState<DiaSemana | null>(null);
  const [editandoPorcion, setEditandoPorcion] = useState<{ dia: DiaSemana; comidaId: string } | null>(null);
  const [menuCopiarDia, setMenuCopiarDia] = useState<DiaSemana | null>(null);
  const [menuCopiarSemana, setMenuCopiarSemana] = useState(false);

  // Obtener IDs de comidas ya seleccionadas
  const comidasYaSeleccionadas = useMemo(() => {
    const ids = new Set<string>();
    comidasPorDia.forEach(dia => {
      dia.comidas.forEach(c => {
        if (c.comidaPrecargadaId) {
          ids.add(c.comidaPrecargadaId);
        }
      });
    });
    return Array.from(ids);
  }, [comidasPorDia]);

  // Obtener comidas de un día específico
  const getComidasDelDia = (dia: DiaSemana): ComidaEnPlan[] => {
    const diaData = comidasPorDia.find(d => d.dia === dia);
    return diaData?.comidas || [];
  };

  // Agrupar comidas de un día por categoría (colación matutina y vespertina separadas)
  const getComidasPorCategoria = (dia: DiaSemana) => {
    const comidas = getComidasDelDia(dia);
    return {
      desayuno: comidas.filter(c => c.tipo === 'desayuno'),
      colacion1: comidas.filter(c => c.tipo === 'colacion1'),
      comida: comidas.filter(c => c.tipo === 'comida'),
      colacion2: comidas.filter(c => c.tipo === 'colacion2'),
      cena: comidas.filter(c => c.tipo === 'cena'),
    };
  };

  // Determinar el tipo de comida a asignar según la categoría seleccionada.
  // Las categorías de la cuadrícula (colacion1/colacion2) coinciden con los tipos.
  const resolverTipoComida = (comida: ComidaPrecargada): ComidaEnPlan['tipo'] => {
    if (categoriaSeleccionada !== 'todas') {
      return categoriaSeleccionada as ComidaEnPlan['tipo'];
    }
    // Sin categoría específica: mapear la categoría del catálogo.
    // Las colaciones del catálogo usan el tipo de colación elegido (matutina/vespertina).
    if (comida.categoria === 'colacion') return colacionTipo;
    return comida.categoria as ComidaEnPlan['tipo'];
  };

  // Agregar comida a un día
  const handleAgregarComida = (comida: ComidaPrecargada) => {
    if (!diaSeleccionado) return;

    const tipo = resolverTipoComida(comida);

    const nuevaComida: ComidaEnPlan = {
      id: crypto.randomUUID(),
      comidaPrecargadaId: comida.id,
      nombre: comida.nombre,
      tipo,
      horario: obtenerHorarioPorDefecto(tipo),
      ingredientes: comida.ingredientes,
      preparacion: comida.preparacion?.join('\n'),
      porcion: `${comida.porciones} porción(es)`,
      porcionMultiplicador: 1,
      nutrientes: {
        calorias: comida.nutrientes.calorias,
        proteinas: comida.nutrientes.proteinas,
        carbohidratos: comida.nutrientes.carbohidratos,
        grasas: comida.nutrientes.grasas,
        fibra: comida.nutrientes.fibra,
      },
      orden: getComidasDelDia(diaSeleccionado).length,
    };

    const nuevosDias = comidasPorDia.map(d => {
      if (d.dia === diaSeleccionado) {
        return { ...d, comidas: [...d.comidas, nuevaComida] };
      }
      return d;
    });

    // Si el día no existe, crearlo
    if (!comidasPorDia.find(d => d.dia === diaSeleccionado)) {
      nuevosDias.push({ dia: diaSeleccionado, comidas: [nuevaComida] });
    }

    onChange(nuevosDias);
  };

  // Eliminar comida de un día
  const handleEliminarComida = (dia: DiaSemana, comidaId: string) => {
    const nuevosDias = comidasPorDia.map(d => {
      if (d.dia === dia) {
        return { ...d, comidas: d.comidas.filter(c => c.id !== comidaId) };
      }
      return d;
    }).filter(d => d.comidas.length > 0); // Eliminar días vacíos

    onChange(nuevosDias);
  };

  // Actualizar porción de una comida
  const handleActualizarPorcion = (dia: DiaSemana, comidaId: string, multiplicador: number) => {
    const nuevosDias = comidasPorDia.map(d => {
      if (d.dia === dia) {
        return {
          ...d,
          comidas: d.comidas.map(c =>
            c.id === comidaId ? { ...c, porcionMultiplicador: multiplicador } : c
          ),
        };
      }
      return d;
    });

    onChange(nuevosDias);
  };

  // Calcular totales semanales
  const totalesSemanales = useMemo(() => {
    const totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, comidas: 0 };
    comidasPorDia.forEach(dia => {
      dia.comidas.forEach(c => {
        const mult = c.porcionMultiplicador || 1;
        totales.calorias += Math.round((c.nutrientes?.calorias || 0) * mult);
        totales.proteinas += Math.round((c.nutrientes?.proteinas || 0) * mult);
        totales.carbohidratos += Math.round((c.nutrientes?.carbohidratos || 0) * mult);
        totales.grasas += Math.round((c.nutrientes?.grasas || 0) * mult);
        totales.comidas++;
      });
    });
    return totales;
  }, [comidasPorDia]);

  // Abrir selector para un día específico
  const abrirSelector = (dia: DiaSemana, categoria?: string) => {
    setDiaSeleccionado(dia);
    setCategoriaSeleccionada(categoria || 'todas');
    // Si se abre desde una colación específica, fijar el tipo de colación
    if (categoria === 'colacion1') setColacionTipo('colacion1');
    if (categoria === 'colacion2') setColacionTipo('colacion2');
    setSelectorAbierto(true);
  };

  // Copiar contenido de un día a otro
  const handleCopiarDia = useCallback((origen: DiaSemana, destino: DiaSemana) => {
    if (onCopiarDia) {
      onCopiarDia(origen, destino);
    } else {
      // Comportamiento por defecto: copiar comidas de origen a destino
      const comidasOrigen = comidasPorDia.find(d => d.dia === origen)?.comidas || [];
      if (comidasOrigen.length === 0) return;

      const nuevasComidas = comidasOrigen.map(c => ({
        ...c,
        id: crypto.randomUUID(),
      }));

      const nuevosDias = comidasPorDia.filter(d => d.dia !== destino);
      nuevosDias.push({ dia: destino, comidas: nuevasComidas });
      onChange(nuevosDias);
    }
    setMenuCopiarDia(null);
  }, [comidasPorDia, onChange, onCopiarDia]);

  // Copiar el contenido de un día a varios días de destino (optimización de carga semanal)
  const handleCopiarDiaAVarios = useCallback((origen: DiaSemana, destinos: DiaSemana[]) => {
    const comidasOrigen = comidasPorDia.find(d => d.dia === origen)?.comidas || [];
    if (comidasOrigen.length === 0 || destinos.length === 0) return;

    const nuevosDias = comidasPorDia.filter(d => !destinos.includes(d.dia));
    destinos.forEach(destino => {
      const nuevasComidas = comidasOrigen.map(c => ({
        ...c,
        id: crypto.randomUUID(),
      }));
      nuevosDias.push({ dia: destino, comidas: nuevasComidas });
    });
    onChange(nuevosDias);
    setMenuCopiarDia(null);
  }, [comidasPorDia, onChange]);

  // Copiar un día a todos los demás días de la semana
  const handleCopiarDiaATodos = useCallback((origen: DiaSemana) => {
    const destinos = DIAS.filter(d => d.key !== origen).map(d => d.key);
    handleCopiarDiaAVarios(origen, destinos);
  }, [handleCopiarDiaAVarios]);

  // Copiar un día a todos los días laborables (lunes a viernes)
  const handleCopiarDiaASemana = useCallback((origen: DiaSemana) => {
    const laborables: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const destinos = laborables.filter(d => d !== origen);
    handleCopiarDiaAVarios(origen, destinos);
  }, [handleCopiarDiaAVarios]);

  // Copiar semana completa
  const handleCopiarSemana = useCallback((semanaDestino: number) => {
    if (onCopiarSemana) {
      onCopiarSemana(semanaActual, semanaDestino);
    }
    setMenuCopiarSemana(false);
  }, [semanaActual, onCopiarSemana]);

  // Limpiar un día
  const handleLimpiarDia = useCallback((dia: DiaSemana) => {
    if (onLimpiarDia) {
      onLimpiarDia(dia);
    } else {
      onChange(comidasPorDia.filter(d => d.dia !== dia));
    }
  }, [comidasPorDia, onChange, onLimpiarDia]);

  // Limpiar toda la semana
  const handleLimpiarSemana = useCallback(() => {
    if (onLimpiarSemana) {
      onLimpiarSemana();
    } else {
      onChange([]);
    }
  }, [onChange, onLimpiarSemana]);

  return (
    <div className="space-y-4">
      {/* Navegación de semanas (para ciclos de menú) */}
      {totalSemanas > 1 && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">📅 Semana</span>
            <div className="flex gap-1">
              {Array.from({ length: totalSemanas }, (_, i) => i + 1).map(sem => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => onCambiarSemana?.(sem)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    sem === semanaActual
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          {!readOnly && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuCopiarSemana(!menuCopiarSemana)}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                📋 Copiar semana
              </button>

              {menuCopiarSemana && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 mb-2 px-2">Copiar a semana:</p>
                    {Array.from({ length: totalSemanas }, (_, i) => i + 1)
                      .filter(s => s !== semanaActual)
                      .map(sem => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => handleCopiarSemana(sem)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          Semana {sem}
                        </button>
                      ))}
                    {totalSemanas <= 1 && (
                      <p className="text-xs text-gray-400 px-2 py-1">No hay otras semanas</p>
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-1">
                    <button
                      type="button"
                      onClick={handleLimpiarSemana}
                      className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      🗑️ Limpiar semana
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Vista móvil: días colapsables */}
      <div className="md:hidden space-y-2">
        {DIAS.map(({ key, label }) => {
          const comidas = getComidasDelDia(key);
          const expandido = diaExpandido === key;
          return (
            <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setDiaExpandido(expandido ? null : key)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{label}</span>
                  <span className="text-xs text-gray-500">
                    ({comidas.length} comida{comidas.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {comidas.reduce((sum, c) => sum + (c.nutrientes?.calorias || 0) * (c.porcionMultiplicador || 1), 0)} kcal
                  </span>
                  <span className="text-gray-400">{expandido ? '▲' : '▼'}</span>
                </div>
              </button>

              {expandido && (
                <div className="p-3 space-y-3">
                  {renderComidasDelDia(key, comidas)}

                  {!readOnly && (
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIAS_COMIDA.map((cat) => (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => abrirSelector(key, cat.key)}
                          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          {cat.icon} +{cat.label}
                        </button>
                      ))}
                      {/* Botón copiar día */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuCopiarDia(menuCopiarDia === key ? null : key)}
                          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          📋 Copiar
                        </button>
                        {menuCopiarDia === key && (
                          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                            <div className="p-2">
                              <p className="text-xs text-gray-500 mb-2 px-2">Copiar a:</p>
                              {DIAS.filter(d => d.key !== key).map(d => (
                                <button
                                  key={d.key}
                                  type="button"
                                  onClick={() => handleCopiarDia(key, d.key)}
                                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 p-1 space-y-0.5">
                              <button
                                type="button"
                                onClick={() => handleCopiarDiaATodos(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              >
                                ⚡ Copiar a todos los días
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopiarDiaASemana(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                              >
                                💼 Copiar a días laborables
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLimpiarDia(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                🗑️ Limpiar día
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vista desktop: cuadrícula */}
      <div className="hidden md:block overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {/* Header con días */}
          {DIAS.map(({ key, labelCorto, label }) => (
            <div key={key} className="text-center">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {labelCorto}
              </div>
              <div className="text-xs text-gray-400 hidden lg:block">{label}</div>
            </div>
          ))}

          {/* Celdas de días */}
          {DIAS.map(({ key }) => {
            const comidas = getComidasDelDia(key);
            const comidasPorCat = getComidasPorCategoria(key);
            const totalKcal = comidas.reduce(
              (sum, c) => sum + (c.nutrientes?.calorias || 0) * (c.porcionMultiplicador || 1),
              0
            );

            return (
              <div
                key={key}
                className={`border border-gray-200 rounded-lg min-h-[200px] ${
                  comidas.length > 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="p-2 space-y-2">
                  {/* Totales del día */}
                  {comidas.length > 0 && (
                    <div className="text-center text-xs text-gray-500 border-b border-gray-100 pb-1">
                      {totalKcal} kcal
                    </div>
                  )}

                  {/* Comidas por categoría */}
                  {CATEGORIAS_COMIDA.map((cat) => {
                    const comidasCat = comidasPorCat[cat.key as keyof typeof comidasPorCat];
                    if (!comidasCat || comidasCat.length === 0) return null;

                    return (
                      <div key={cat.key} className={`rounded p-1.5 ${cat.color} border`}>
                        <div className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <span>{cat.icon}</span>
                          <span>{comidasCat.length > 1 ? `${cat.label} (${comidasCat.length})` : cat.label}</span>
                        </div>
                        {comidasCat.map((comida) => (
                          <div key={comida.id} className="text-xs group relative">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-800 truncate">
                                  {comida.nombre}
                                </div>
                                <div className="text-gray-500">
                                  {Math.round((comida.nutrientes?.calorias || 0) * (comida.porcionMultiplicador || 1))} kcal
                                  {comida.porcionMultiplicador !== 1 && (
                                    <span className="text-amber-600 ml-1">x{comida.porcionMultiplicador}</span>
                                  )}
                                </div>
                              </div>
                              {!readOnly && (
                                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditandoPorcion(
                                      editandoPorcion?.dia === key && editandoPorcion?.comidaId === comida.id
                                        ? null
                                        : { dia: key, comidaId: comida.id }
                                    )}
                                    className="p-0.5 text-blue-600 hover:bg-blue-50 rounded text-xs"
                                    title="Ajustar porción"
                                  >
                                    ⚙️
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarComida(key, comida.id)}
                                    className="p-0.5 text-red-600 hover:bg-red-50 rounded text-xs"
                                    title="Eliminar"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Editor de porción inline */}
                            {editandoPorcion?.dia === key && editandoPorcion?.comidaId === comida.id && !readOnly && (
                              <div className="mt-1 flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleActualizarPorcion(
                                    key,
                                    comida.id,
                                    Math.max(0.25, (comida.porcionMultiplicador || 1) - 0.25)
                                  )}
                                  className="px-1 py-0.5 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <span className="text-xs font-medium text-amber-700">
                                  {(comida.porcionMultiplicador || 1).toFixed(2)}x
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleActualizarPorcion(
                                    key,
                                    comida.id,
                                    Math.min(4, (comida.porcionMultiplicador || 1) + 0.25)
                                  )}
                                  className="px-1 py-0.5 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {/* Día vacío */}
                  {comidas.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-400 mb-2">Sin comidas</p>
                    </div>
                  )}

                  {/* Botones de acción del día */}
                  {!readOnly && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => abrirSelector(key)}
                        className="w-full py-1 text-xs text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-200 transition-colors"
                      >
                        + Agregar comida
                      </button>

                      {/* Menú de copiar/limpiar día */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuCopiarDia(menuCopiarDia === key ? null : key)}
                          className="w-full py-1 text-xs text-gray-500 hover:bg-gray-100 rounded border border-dashed border-gray-200 transition-colors"
                        >
                          📋 Más opciones
                        </button>
                        {menuCopiarDia === key && (
                          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                            <div className="p-2">
                              <p className="text-xs text-gray-500 mb-2 px-2">Copiar este día a:</p>
                              {DIAS.filter(d => d.key !== key).map(d => (
                                <button
                                  key={d.key}
                                  type="button"
                                  onClick={() => handleCopiarDia(key, d.key)}
                                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 p-1 space-y-0.5">
                              <button
                                type="button"
                                onClick={() => handleCopiarDiaATodos(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              >
                                ⚡ Copiar a todos los días
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopiarDiaASemana(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                              >
                                💼 Copiar a días laborables (Lun-Vie)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLimpiarDia(key)}
                                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                🗑️ Limpiar día
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de acciones para repetición (visible solo cuando no hay navegación de semanas) */}
      {totalSemanas <= 1 && !readOnly && comidasPorDia.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleLimpiarSemana}
            className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
          >
            🗑️ Limpiar semana
          </button>
        </div>
      )}

      {/* Totales semanales */}
      {comidasPorDia.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            📊 Totales Semanales
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-lg font-bold text-blue-700">{totalesSemanales.calorias}</div>
              <div className="text-xs text-blue-600">kcal totales</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-lg font-bold text-red-700">{totalesSemanales.proteinas}g</div>
              <div className="text-xs text-red-600">Proteínas</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-lg font-bold text-amber-700">{totalesSemanales.carbohidratos}g</div>
              <div className="text-xs text-amber-600">Carbohidratos</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-lg font-bold text-green-700">{totalesSemanales.grasas}g</div>
              <div className="text-xs text-green-600">Grasas</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-700">{totalesSemanales.comidas}</div>
              <div className="text-xs text-purple-600">Comidas totales</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Promedio diario: ~{Math.round(totalesSemanales.calorias / Math.max(comidasPorDia.length, 1))} kcal
          </div>
        </div>
      )}

      {/* Selector de Comidas Modal */}
      <SelectorComidas
        open={selectorAbierto}
        onClose={() => {
          setSelectorAbierto(false);
          setDiaSeleccionado(null);
        }}
        onSeleccionar={handleAgregarComida}
        comidasYaSeleccionadas={comidasYaSeleccionadas}
        categoria={categoriaSeleccionada !== 'todas'
          ? (categoriaSeleccionada === 'colacion1' || categoriaSeleccionada === 'colacion2'
              ? 'colacion'
              : categoriaSeleccionada as any)
          : undefined}
        colacionTipo={colacionTipo}
        onCambiarColacionTipo={setColacionTipo}
        recetasPersonalizadas={recetasPersonalizadas}
        onCrearReceta={onCrearReceta}
        onEditarReceta={onEditarReceta}
        onEliminarReceta={onEliminarReceta}
      />
    </div>
  );

  // Helper para renderizar comidas de un día (vista móvil)
  function renderComidasDelDia(dia: DiaSemana, comidas: ComidaEnPlan[]) {
    if (comidas.length === 0) {
      return (
        <div className="text-center py-4 text-sm text-gray-400">
          Sin comidas planificadas
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {CATEGORIAS_COMIDA.map((cat) => {
          const comidasCat = comidas.filter(c => c.tipo === cat.key);
          if (comidasCat.length === 0) return null;

          return (
            <div key={cat.key} className={`rounded p-2 ${cat.color} border`}>
              <div className="text-xs font-medium text-gray-600 mb-1">
                {cat.icon} {cat.label}
              </div>
              {comidasCat.map((comida) => (
                <div key={comida.id} className="flex items-center justify-between text-sm py-0.5">
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-800 truncate block">{comida.nombre}</span>
                    <span className="text-xs text-gray-500">
                      {Math.round((comida.nutrientes?.calorias || 0) * (comida.porcionMultiplicador || 1))} kcal
                      {comida.porcionMultiplicador !== 1 && (
                        <span className="text-amber-600 ml-1">x{comida.porcionMultiplicador}</span>
                      )}
                    </span>
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleEliminarComida(dia, comida.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

function obtenerHorarioPorDefecto(tipo: ComidaEnPlan['tipo']): string {
  const horarios: Record<ComidaEnPlan['tipo'], string> = {
    desayuno: '07:00 - 08:00',
    colacion1: '10:00 - 10:30',
    comida: '13:00 - 14:00',
    colacion2: '16:30 - 17:00',
    cena: '19:30 - 20:30',
  };
  return horarios[tipo];
}
