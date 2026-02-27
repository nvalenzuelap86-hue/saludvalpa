// ============================================================================
// saludvalpa 3.0 - COMPONENTE ESTADO DENTAL
// Define los estados posibles de una pieza dental y sus colores asociados
// ============================================================================

import React from 'react';

// Estados dentales según estándares odontológicos
export const ESTADOS_DENTALES = {
  SANO: 'sano',
  CARIADO: 'cariado',
  OBTURADO: 'obturado',
  AUSENTE: 'ausente',
  PROTESIS: 'protesis',
  CORONA: 'corona',
  ENDODONCIA: 'endodoncia',
  SELLANTE: 'sellante',
  MOVILIDAD: 'movilidad',
  FRACTURA: 'fractura',
  RAICES: 'raices',
  IMPACTADO: 'impactado',
  ERUPCION: 'erupcion',
} as const;

export type EstadoDental = typeof ESTADOS_DENTALES[keyof typeof ESTADOS_DENTALES];

// Colores para cada estado (sistema FDI)
export const COLORES_ESTADOS: Record<EstadoDental, string> = {
  [ESTADOS_DENTALES.SANO]: '#4CAF50', // Verde - diente sano
  [ESTADOS_DENTALES.CARIADO]: '#F44336', // Rojo - caries
  [ESTADOS_DENTALES.OBTURADO]: '#2196F3', // Azul - obturado/restaurado
  [ESTADOS_DENTALES.AUSENTE]: '#9E9E9E', // Gris - ausente
  [ESTADOS_DENTALES.PROTESIS]: '#9C27B0', // Púrpura - prótesis
  [ESTADOS_DENTALES.CORONA]: '#FF9800', // Naranja - corona
  [ESTADOS_DENTALES.ENDODONCIA]: '#795548', // Marrón - endodoncia
  [ESTADOS_DENTALES.SELLANTE]: '#00BCD4', // Cyan - sellante
  [ESTADOS_DENTALES.MOVILIDAD]: '#FFEB3B', // Amarillo - movilidad
  [ESTADOS_DENTALES.FRACTURA]: '#FF5722', // Naranja oscuro - fractura
  [ESTADOS_DENTALES.RAICES]: '#607D8B', // Azul grisáceo - raíces
  [ESTADOS_DENTALES.IMPACTADO]: '#3F51B5', // Índigo - impactado
  [ESTADOS_DENTALES.ERUPCION]: '#E91E63', // Rosa - en erupción
};

// Descripciones de cada estado
export const DESCRIPCIONES_ESTADOS: Record<EstadoDental, string> = {
  [ESTADOS_DENTALES.SANO]: 'Diente sano sin patologías',
  [ESTADOS_DENTALES.CARIADO]: 'Presencia de caries',
  [ESTADOS_DENTALES.OBTURADO]: 'Diente con restauración/obturación',
  [ESTADOS_DENTALES.AUSENTE]: 'Diente ausente (extraído o no erupcionado)',
  [ESTADOS_DENTALES.PROTESIS]: 'Prótesis dental (fija o removible)',
  [ESTADOS_DENTALES.CORONA]: 'Corona dental',
  [ESTADOS_DENTALES.ENDODONCIA]: 'Tratamiento de endodoncia realizado',
  [ESTADOS_DENTALES.SELLANTE]: 'Sellante de fosas y fisuras',
  [ESTADOS_DENTALES.MOVILIDAD]: 'Movilidad dental patológica',
  [ESTADOS_DENTALES.FRACTURA]: 'Fractura dental',
  [ESTADOS_DENTALES.RAICES]: 'Raíces residuales',
  [ESTADOS_DENTALES.IMPACTADO]: 'Diente impactado/retenido',
  [ESTADOS_DENTALES.ERUPCION]: 'Diente en proceso de erupción',
};

// Componente para mostrar un indicador de estado
interface IndicadorEstadoProps {
  estado: EstadoDental;
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  mostrarTexto?: boolean;
}

export const IndicadorEstado: React.FC<IndicadorEstadoProps> = ({
  estado,
  tamaño = 'mediano',
  mostrarTexto = true,
}) => {
  const tamañoPx = {
    pequeño: 12,
    mediano: 16,
    grande: 20,
  }[tamaño];

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full border border-gray-300"
        style={{
          width: tamañoPx,
          height: tamañoPx,
          backgroundColor: COLORES_ESTADOS[estado],
        }}
      />
      {mostrarTexto && (
        <span className="text-sm">
          {DESCRIPCIONES_ESTADOS[estado]}
        </span>
      )}
    </div>
  );
};

// Componente para mostrar la leyenda completa
export const LeyendaEstadosDentales: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
      {Object.values(ESTADOS_DENTALES).map((estado) => (
        <div key={estado} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: COLORES_ESTADOS[estado] }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">
              {estado.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500">
              {DESCRIPCIONES_ESTADOS[estado]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndicadorEstado;