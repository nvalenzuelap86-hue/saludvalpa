// ============================================================================
// saludvalpa 3.0 - Enrutador Dinámico por Profesión
// Carga y renderiza componentes específicos según la profesión configurada
// ============================================================================

import { useEffect, useState, Suspense } from 'react';
import { useAppStore } from '../stores/appStore';
import { getProfessionModule } from '../utils/moduleLoader';
import type { ProfessionModule } from '../utils/moduleLoader';

/**
 * Componente que carga dinámicamente y renderiza los componentes específicos
 * de la profesión configurada en la aplicación.
 * 
 * Este componente utiliza lazy loading para cargar solo el módulo necesario,
 * reduciendo el bundle size inicial y mejorando el performance.
 */
export default function ProfessionRouter() {
  const { configuracion } = useAppStore();
  const [module, setModule] = useState<ProfessionModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el módulo correspondiente a la profesión configurada
  useEffect(() => {
    const profesion = configuracion?.profesion;
    
    if (!profesion) {
      // Si no hay profesión configurada, no cargar ningún módulo
      setModule(null);
      return;
    }

    setLoading(true);
    setError(null);

    getProfessionModule(profesion)
      .then(loadedModule => {
        setModule(loadedModule);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar módulo de profesión:', err);
        setError(`No se pudo cargar el módulo para ${profesion}`);
        setLoading(false);
      });
  }, [configuracion?.profesion]);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando módulo de {configuracion?.profesion || 'profesión'}...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="text-lg font-semibold text-red-800">Error al cargar módulo</h3>
        <p className="text-red-600">{error}</p>
        <p className="mt-2 text-red-500 text-sm">
          Por favor, verifica la configuración de tu profesión o contacta al soporte.
        </p>
      </div>
    );
  }

  // Si no hay módulo cargado (no hay profesión configurada)
  if (!module) {
    return (
      <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-800">Profesión no configurada</h3>
        <p className="text-yellow-600">
          Por favor, configura tu profesión en la página de Configuración para acceder a las funcionalidades específicas.
        </p>
      </div>
    );
  }

  // Renderizar el componente específico de la profesión
  return (
    <Suspense fallback={
      <div className="p-4 text-gray-500">
        Cargando componente específico...
      </div>
    }>
      <module.CamposEspecificos />
    </Suspense>
  );
}

/**
 * Componente helper para renderizar documentos específicos por profesión
 */
export function ProfessionDocumentRenderer({ documentType }: { documentType: string }) {
  const { configuracion } = useAppStore();
  const [DocumentComponent, setDocumentComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profesion = configuracion?.profesion;
    
    if (!profesion || !documentType) {
      setDocumentComponent(null);
      return;
    }

    setLoading(true);

    getProfessionModule(profesion)
      .then(module => {
        const component = module.DocumentosEspecificos[documentType];
        setDocumentComponent(() => component || (() => (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-600">
              Documento "{documentType}" no disponible para {profesion}
            </p>
          </div>
        )));
        setLoading(false);
      })
      .catch(() => {
        setDocumentComponent(() => () => (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50">
            <p className="text-red-600">Error al cargar documento</p>
          </div>
        ));
        setLoading(false);
      });
  }, [configuracion?.profesion, documentType]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-1 text-sm text-gray-500">Cargando documento...</p>
      </div>
    );
  }

  if (!DocumentComponent) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600">Selecciona un tipo de documento válido</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Cargando documento...</div>}>
      <DocumentComponent />
    </Suspense>
  );
}