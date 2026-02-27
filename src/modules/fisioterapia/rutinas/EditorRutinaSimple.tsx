// ============================================================================
// COMPONENTE: EditorRutinaSimple
// Wrapper del EditorRutina para uso en perfil de paciente
// ============================================================================

import { useState, useEffect } from 'react';
import EditorRutina from './EditorRutina';
import { useRutinas } from '../hooks/useRutinas';
import type { RutinaEjercicios } from '../../../types';

interface EditorRutinaSimpleProps {
  rutinaId?: string;
  pacienteIdInicial?: string;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function EditorRutinaSimple({
  rutinaId,
  pacienteIdInicial,
  onGuardar,
  onCancelar,
}: EditorRutinaSimpleProps) {
  const { obtenerRutina, crearRutina, actualizarRutina } = useRutinas();
  const [rutina, setRutina] = useState<RutinaEjercicios | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (rutinaId) {
        const r = await obtenerRutina(rutinaId);
        setRutina(r);
      } else {
        setRutina(undefined);
      }
      setCargando(false);
    };
    cargar();
  }, [rutinaId, obtenerRutina]);

  const handleGuardar = async (datos: Omit<RutinaEjercicios, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      // Si hay pacienteIdInicial y no se especificó un paciente, asignarlo
      const datosFinales = {
        ...datos,
        pacienteId: datos.pacienteId || pacienteIdInicial || undefined,
      };

      if (rutinaId) {
        await actualizarRutina(rutinaId, datosFinales);
      } else {
        await crearRutina(datosFinales);
      }

      onGuardar();
    } catch (error) {
      console.error('Error al guardar rutina:', error);
      alert('Error al guardar la rutina: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saludvalpa-blue"></div>
      </div>
    );
  }

  return (
    <EditorRutina
      isOpen={true}
      onClose={onCancelar}
      onGuardar={handleGuardar}
      rutinaEditar={rutina}
    />
  );
}
