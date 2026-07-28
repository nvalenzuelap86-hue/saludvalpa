// ============================================================================
// saludvalpa 3.0 - PLAN SEMANAL DE COMIDAS
// Componente de cuadrícula semanal (Lun-Dom) para planificar comidas por día
// Sigue el patrón de EditorRutina.tsx de fisioterapia
// ============================================================================

import { useState, useMemo } from 'react';
import SelectorComidas from './SelectorComidas';
import type { ComidaEnDia, DiaSemana, ComidaEnPlan, ComidaPrecargada } from '../../../types/nutricion';
import { obtenerComidaPorId } from '../data/comidasPrecargadas';

interface PlanSemanalProps {
  comidasPorDia: ComidaEnDia[];
  onChange: (comidasPorDia: ComidaEnDia[]) => void;
  readOnly?: boolean;
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

const CATEGORIAS_COMIDA: { key: string; label: string; icon: string; color: string }[] = [
  { key: 'desayuno', label: 'Desayuno', icon: '🌅', color: 'bg-amber-50 border-amber-200' },
  { key: 'colacion', label: 'Colación', icon: '🍎', color: 'bg-green-50 border-green-200' },
  { key: 'comida', label: 'Comida', icon: '🍽️', color: 'bg-blue-50 border-blue-200' },
  { key: 'cena', label: 'Cena', icon: '🌙', color: 'bg-purple-50 border-purple-200' },
];

export default function PlanSemanal({
  comidasPorDia,
  onChange,
  readOnly = false,
}: PlanSemanalProps) {
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaSemana | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [diaExpandido, setDiaExpandido] = useState<DiaSemana | null>(null);
  const [editandoPorcion, setEditandoPorcion] = useState<{ dia: DiaSemana; comidaId: string } | null>(null);

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

  // Agrupar comidas de un día por categoría
  const getComidasPorCategoria = (dia: DiaSemana) => {
    const comidas = getComidasDelDia(dia);
    return {
      desayuno: comidas.filter(c => c.tipo === 'desayuno'),
      colacion: comidas.filter(c => c.tipo === 'colacion1' || c.tipo === 'colacion2'),
      comida: comidas.filter(c => c.tipo === 'comida'),
      cena: comidas.filter(c => c.tipo === 'cena'),
    };
  };

  // Agregar comida a un día
  const handleAgregarComida = (comida: ComidaPrecargada) => {
    if (!diaSeleccionado) return;

    const nuevaComida: ComidaEnPlan = {
      id: crypto.randomUUID(),
      comidaPrecargadaId: comida.id,
      nombre: comida.nombre,
      tipo: categoriaSeleccionada !== 'todas'
        ? (categoriaSeleccionada as ComidaEnPlan['tipo'])
        : (comida.categoria === 'colacion' ? 'colacion1' : comida.categoria as ComidaEnPlan['tipo']),
      horario: obtenerHorarioPorDefecto(
        categoriaSeleccionada !== 'todas'
          ? (categoriaSeleccionada as ComidaEnPlan['tipo'])
          : (comida.categoria === 'colacion' ? 'colacion1' : comida.categoria as ComidaEnPlan['tipo'])
      ),
      ingredientes: comida.ingredientes,
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
    setSelectorAbierto(true);
  };

  return (
    <div className="space-y-4">
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

                  {/* Botón agregar comida */}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => abrirSelector(key)}
                      className="w-full py-1 text-xs text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-200 transition-colors"
                    >
                      + Agregar comida
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        categoria={categoriaSeleccionada !== 'todas' ? categoriaSeleccionada as any : undefined}
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
          const comidasCat = comidas.filter(c => {
            if (cat.key === 'colacion') return c.tipo === 'colacion1' || c.tipo === 'colacion2';
            return c.tipo === cat.key;
          });
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
