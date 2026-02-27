// ============================================================================
// saludvalpa 3.0 - HISTORIA CLÍNICA NUTRICIONAL
// Historia clínica completa para evaluación nutricional
// ============================================================================

import { useState, useEffect } from 'react';
import type { DatosNutricion } from '../../../types';
import Button from '../../../components/shared/Button';
import Input from '../../../components/shared/Input';

interface HistoriaClinicaNutricionalProps {
  datos: DatosNutricion;
  onChange: (datos: DatosNutricion) => void;
}

export default function HistoriaClinicaNutricional({ datos, onChange }: HistoriaClinicaNutricionalProps) {
  const [historia, setHistoria] = useState({
    motivoConsulta: '',
    antecedentesPersonales: {
      patologicos: [] as string[],
      quirurgicos: [] as string[],
      alergicos: [] as string[],
      toxicos: [] as string[],
      familiares: [] as string[],
    },
    habitosVida: {
      actividadFisica: '',
      horasSueno: '',
      consumoAgua: '',
      tabaco: false,
      alcohol: false,
      otrasSustancias: '',
    },
    consumoAlimentario: {
      comidasDia: 0,
      fueraCasa: false,
      frecuenciaConsumo: {
        frutasVerduras: '',
        cereales: '',
        proteinas: '',
        lacteos: '',
        grasas: '',
        azucares: '',
      },
      suplementos: [] as string[],
    },
    objetivos: {
      perdidaPeso: false,
      gananciaMuscular: false,
      controlEnfermedad: false,
      rendimientoDeportivo: false,
      otros: '',
    },
  });

  const [nuevoAntecedente, setNuevoAntecedente] = useState({ tipo: 'patologicos', valor: '' });
  const [nuevoSuplemento, setNuevoSuplemento] = useState('');

  // Actualizar datos principales cuando cambia la historia
  useEffect(() => {
    onChange({
      ...datos,
      // Aquí se integraría con la estructura de DatosNutricion
      // Por ahora mantenemos la estructura simple
    });
  }, [historia]);


  const handleHabitChange = (campo: keyof typeof historia.habitosVida, valor: any) => {
    setHistoria(prev => ({
      ...prev,
      habitosVida: {
        ...prev.habitosVida,
        [campo]: valor
      }
    }));
  };

  const handleConsumoChange = (campo: keyof typeof historia.consumoAlimentario, valor: any) => {
    setHistoria(prev => ({
      ...prev,
      consumoAlimentario: {
        ...prev.consumoAlimentario,
        [campo]: valor
      }
    }));
  };

  const handleFrecuenciaChange = (grupo: keyof typeof historia.consumoAlimentario.frecuenciaConsumo, valor: string) => {
    setHistoria(prev => ({
      ...prev,
      consumoAlimentario: {
        ...prev.consumoAlimentario,
        frecuenciaConsumo: {
          ...prev.consumoAlimentario.frecuenciaConsumo,
          [grupo]: valor
        }
      }
    }));
  };

  const agregarAntecedente = () => {
    if (nuevoAntecedente.valor.trim()) {
      setHistoria(prev => ({
        ...prev,
        antecedentesPersonales: {
          ...prev.antecedentesPersonales,
          [nuevoAntecedente.tipo]: [
            ...(prev.antecedentesPersonales[nuevoAntecedente.tipo as keyof typeof prev.antecedentesPersonales] as string[]),
            nuevoAntecedente.valor.trim()
          ]
        }
      }));
      setNuevoAntecedente({ ...nuevoAntecedente, valor: '' });
    }
  };

  const eliminarAntecedente = (tipo: keyof typeof historia.antecedentesPersonales, index: number) => {
    setHistoria(prev => ({
      ...prev,
      antecedentesPersonales: {
        ...prev.antecedentesPersonales,
        [tipo]: (prev.antecedentesPersonales[tipo] as string[]).filter((_, i) => i !== index)
      }
    }));
  };

  const agregarSuplemento = () => {
    if (nuevoSuplemento.trim()) {
      setHistoria(prev => ({
        ...prev,
        consumoAlimentario: {
          ...prev.consumoAlimentario,
          suplementos: [...prev.consumoAlimentario.suplementos, nuevoSuplemento.trim()]
        }
      }));
      setNuevoSuplemento('');
    }
  };

  const eliminarSuplemento = (index: number) => {
    setHistoria(prev => ({
      ...prev,
      consumoAlimentario: {
        ...prev.consumoAlimentario,
        suplementos: prev.consumoAlimentario.suplementos.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleObjetivo = (objetivo: keyof typeof historia.objetivos) => {
    if (objetivo === 'otros') return;
    
    setHistoria(prev => ({
      ...prev,
      objetivos: {
        ...prev.objetivos,
        [objetivo]: !prev.objetivos[objetivo]
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Sección: Motivo de Consulta */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">📝 Motivo de Consulta</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describa el motivo principal de la consulta nutricional
          </label>
          <textarea
            value={historia.motivoConsulta}
            onChange={(e) => setHistoria(prev => ({ ...prev, motivoConsulta: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Ej: Deseo perder peso, mejorar mi alimentación, controlar diabetes, aumentar masa muscular..."
          />
        </div>
      </div>

      {/* Sección: Antecedentes Personales */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">🏥 Antecedentes Personales</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar antecedente
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={nuevoAntecedente.tipo}
              onChange={(e) => setNuevoAntecedente(prev => ({ ...prev, tipo: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="patologicos">Patológicos</option>
              <option value="quirurgicos">Quirúrgicos</option>
              <option value="alergicos">Alérgicos</option>
              <option value="toxicos">Tóxicos</option>
              <option value="familiares">Familiares</option>
            </select>
            
            <Input
              value={nuevoAntecedente.valor}
              onChange={(e) => setNuevoAntecedente(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="Ej: Diabetes tipo 2, Hipertensión, Alergia a mariscos..."
              className="flex-1"
            />
            
            <Button
              type="button"
              variant="secondary"
              onClick={agregarAntecedente}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de antecedentes por tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(historia.antecedentesPersonales).map(([tipo, lista]) => (
            <div key={tipo} className="bg-white p-4 rounded border">
              <h4 className="font-medium text-gray-700 mb-2 capitalize">
                {tipo === 'patologicos' ? 'Patológicos' :
                 tipo === 'quirurgicos' ? 'Quirúrgicos' :
                 tipo === 'alergicos' ? 'Alérgicos' :
                 tipo === 'toxicos' ? 'Tóxicos' : 'Familiares'}
              </h4>
              
              {(lista as string[]).length > 0 ? (
                <ul className="space-y-1">
                  {(lista as string[]).map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm text-gray-600">
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => eliminarAntecedente(tipo as keyof typeof historia.antecedentesPersonales, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No hay antecedentes registrados</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sección: Hábitos de Vida */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">🏃 Hábitos de Vida</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actividad física */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actividad Física
            </label>
            <select
              value={historia.habitosVida.actividadFisica}
              onChange={(e) => handleHabitChange('actividadFisica', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar...</option>
              <option value="sedentario">Sedentario (sin ejercicio)</option>
              <option value="ligero">Ligero (1-2 veces/semana)</option>
              <option value="moderado">Moderado (3-4 veces/semana)</option>
              <option value="intenso">Intenso (5+ veces/semana)</option>
              <option value="atleta">Atleta (entrenamiento diario)</option>
            </select>
          </div>

          {/* Horas de sueño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas de Sueño (promedio)
            </label>
            <Input
              type="number"
              value={historia.habitosVida.horasSueno || ''}
              onChange={(e) => handleHabitChange('horasSueno', e.target.value)}
              placeholder="Ej: 7"
            />
          </div>

          {/* Consumo de agua */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumo de Agua (litros/día)
            </label>
            <Input
              type="number"
              step="0.5"
              value={historia.habitosVida.consumoAgua || ''}
              onChange={(e) => handleHabitChange('consumoAgua', e.target.value)}
              placeholder="Ej: 2.5"
            />
          </div>

          {/* Hábitos tóxicos */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Hábitos Tóxicos
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={historia.habitosVida.tabaco}
                  onChange={(e) => handleHabitChange('tabaco', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Tabaco</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={historia.habitosVida.alcohol}
                  onChange={(e) => handleHabitChange('alcohol', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Alcohol</span>
              </label>
            </div>
            
            <Input
              value={historia.habitosVida.otrasSustancias}
              onChange={(e) => handleHabitChange('otrasSustancias', e.target.value)}
              placeholder="Otras sustancias..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Sección: Consumo Alimentario */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">🍎 Consumo Alimentario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Comidas al día */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Comidas al Día
            </label>
            <Input
              type="number"
              value={historia.consumoAlimentario.comidasDia || ''}
              onChange={(e) => handleConsumoChange('comidasDia', parseInt(e.target.value) || 0)}
              placeholder="Ej: 3"
            />
          </div>

          {/* Come fuera de casa */}
          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={historia.consumoAlimentario.fueraCasa}
                onChange={(e) => handleConsumoChange('fueraCasa', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Come frecuentemente fuera de casa
              </span>
            </label>
          </div>
        </div>

        {/* Frecuencia de consumo por grupos */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Frecuencia de Consumo por Grupos Alimentarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(historia.consumoAlimentario.frecuenciaConsumo).map(([grupo, valor]) => (
              <div key={grupo}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {grupo === 'frutasVerduras' ? 'Frutas y Verduras' :
                   grupo === 'proteinas' ? 'Proteínas' :
                   grupo === 'lacteos' ? 'Lácteos' :
                   grupo === 'azucares' ? 'Azúcares' : grupo}
                </label>
                <select
                  value={valor}
                  onChange={(e) => handleFrecuenciaChange(grupo as keyof typeof historia.consumoAlimentario.frecuenciaConsumo, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="diario">Diario</option>
                  <option value="varias_semana">Varias veces/semana</option>
                  <option value="semanal">Semanal</option>
                  <option value="ocasional">Ocasional</option>
                  <option value="raro">Raro/Nunca</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Suplementos */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Suplementos Alimenticios</h4>
          <div className="flex gap-2 mb-3">
            <Input
              value={nuevoSuplemento}
              onChange={(e) => setNuevoSuplemento(e.target.value)}
              placeholder="Ej: Multivitamínico, Proteína en polvo, Omega-3..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={agregarSuplemento}
            >
              Agregar
            </Button>
          </div>
          
          {historia.consumoAlimentario.suplementos.length > 0 ? (
            <ul className="space-y-2">
              {historia.consumoAlimentario.suplementos.map((suplemento, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700">{suplemento}</span>
                  <button
                    type="button"
                    onClick={() => eliminarSuplemento(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No hay suplementos registrados.</p>
          )}
        </div>
      </div>

      {/* Sección: Objetivos */}
      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
        <h3 className="text-lg font-semibold text-pink-900 mb-4">🎯 Objetivos de la Consulta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={historia.objetivos.perdidaPeso}
              onChange={() => toggleObjetivo('perdidaPeso')}
              className="rounded"
            />
            <span className="text-gray-700">Pérdida de peso</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={historia.objetivos.gananciaMuscular}
              onChange={() => toggleObjetivo('gananciaMuscular')}
              className="rounded"
            />
            <span className="text-gray-700">Ganancia muscular</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={historia.objetivos.controlEnfermedad}
              onChange={() => toggleObjetivo('controlEnfermedad')}
              className="rounded"
            />
            <span className="text-gray-700">Control de enfermedad</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={historia.objetivos.rendimientoDeportivo}
              onChange={() => toggleObjetivo('rendimientoDeportivo')}
              className="rounded"
            />
            <span className="text-gray-700">Rendimiento deportivo</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Otros objetivos
          </label>
          <Input
            value={historia.objetivos.otros}
            onChange={(e) => setHistoria(prev => ({
              ...prev,
              objetivos: { ...prev.objetivos, otros: e.target.value }
            }))}
            placeholder="Objetivos específicos adicionales..."
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumen de Historia Clínica Nutricional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Antecedentes</h4>
            <p className="text-sm text-gray-600">
              {Object.values(historia.antecedentesPersonales).flat().length} antecedente(s) registrado(s)
            </p>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Hábitos</h4>
            <p className="text-sm text-gray-600">
              Actividad física: {historia.habitosVida.actividadFisica || 'No especificada'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Consumo</h4>
            <p className="text-sm text-gray-600">
              {historia.consumoAlimentario.comidasDia || 0} comida(s) al día
            </p>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Suplementos</h4>
            <p className="text-sm text-gray-600">
              {historia.consumoAlimentario.suplementos.length} suplemento(s) registrado(s)
            </p>
          </div>
        </div>
      </div>
    </div>
    );
  }