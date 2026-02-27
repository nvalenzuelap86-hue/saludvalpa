// ============================================================================
// SALUDVALPA - PÁGINA "ACERCA DE SALUDVALPA"
// ============================================================================

import { useState } from 'react';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';

const AcercaDeSaludValpa = () => {
  const [seccionActiva, setSeccionActiva] = useState<'historia' | 'mision' | 'vision' | 'privacidad'>('historia');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:ml-64">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-saludvalpa-blue mb-4">Acerca de SaludValpa</h1>
        <p className="text-gray-600 text-lg">Tu movimiento, nuestra ciencia</p>
      </div>

      {/* Navegación por secciones */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={seccionActiva === 'historia' ? 'primary' : 'outline'}
            onClick={() => setSeccionActiva('historia')}
            className="min-w-[120px]"
          >
            📖 Nuestra Historia
          </Button>
          <Button
            variant={seccionActiva === 'mision' ? 'primary' : 'outline'}
            onClick={() => setSeccionActiva('mision')}
            className="min-w-[120px]"
          >
            🎯 Nuestra Misión
          </Button>
          <Button
            variant={seccionActiva === 'vision' ? 'primary' : 'outline'}
            onClick={() => setSeccionActiva('vision')}
            className="min-w-[120px]"
          >
            🔭 Nuestra Visión
          </Button>
          <Button
            variant={seccionActiva === 'privacidad' ? 'primary' : 'outline'}
            onClick={() => setSeccionActiva('privacidad')}
            className="min-w-[120px]"
          >
            🔒 Nuestra Privacidad
          </Button>
        </div>
      </div>

      {/* Contenido de las secciones */}
      <div className="space-y-8">
        {/* Sección: Nuestra Historia */}
        {seccionActiva === 'historia' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">🏥</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold text-saludvalpa-blue mb-4">La Historia Detrás de SaludValpa</h2>
                  <p className="text-gray-700 text-lg mb-4 italic">
                    "De una pequeña farmacia en el Estado de México a tu consultorio"
                  </p>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      SaludValpa nació en 2023 en el corazón de una pequeña farmacia comunitaria en el Estado de México, 
                      donde un grupo de fisioterapeutas y desarrolladores apasionados observaron un problema fundamental: 
                      los profesionales de la salud carecían de herramientas digitales accesibles, privadas y diseñadas 
                      específicamente para sus necesidades clínicas.
                    </p>
                    <p className="text-gray-700">
                      Mientras atendían pacientes en condiciones limitadas, nuestros fundadores - fisioterapeutas que 
                      también eran "locos del código" - se dieron cuenta de que las soluciones existentes eran demasiado 
                      costosas, dependientes de internet constante, complicadas con funciones innecesarias y comprometían 
                      la privacidad de los datos de los pacientes.
                    </p>
                    <p className="text-gray-700 font-medium">
                      Creamos SaludValpa con una convicción simple pero poderosa: <span className="text-saludvalpa-blue">la tecnología debe servir al profesional de la salud, no al revés</span>.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">El Momento de la Inspiración</h3>
                <p className="text-gray-600 text-sm">
                  Observando las limitaciones de las herramientas existentes en consultorios reales, 
                  entendimos que necesitábamos algo diferente.
                </p>
              </Card>

              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Equipo Fundador</h3>
                <p className="text-gray-600 text-sm">
                  Fisioterapeutas y desarrolladores trabajando juntos para crear herramientas 
                  que realmente entienden las necesidades clínicas.
                </p>
              </Card>

              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Filosofía SaludValpa</h3>
                <p className="text-gray-600 text-sm">
                  Cada función, cada interfaz, cada decisión de diseño se tomó pensando en cómo 
                  facilitaría tu trabajo diario y protegería a tus pacientes.
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10">
              <h3 className="text-2xl font-bold text-saludvalpa-blue mb-4">Nuestro Compromiso</h3>
              <p className="text-gray-700">
                Somos profesionales de la salud que construimos para profesionales de la salud. 
                Entendemos tus desafíos porque los hemos vivido. SaludValpa no es solo una aplicación; 
                es la herramienta que siempre quisimos tener.
              </p>
            </Card>
          </div>
        )}

        {/* Sección: Nuestra Misión */}
        {seccionActiva === 'mision' && (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal text-white">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold mb-4">Misión de SaludValpa</h2>
                <p className="text-xl italic">
                  "Empoderar a los profesionales de la salud con herramientas digitales accesibles, 
                  privadas y diseñadas específicamente para optimizar su práctica clínica, manteniendo 
                  siempre la confidencialidad y autonomía sobre sus datos."
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-saludvalpa-blue">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Accesibilidad Universal</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Herramientas asequibles para consultorios de todos los tamaños</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Funcionalidad completa sin suscripciones mensuales costosas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Interfaz intuitiva que reduce la curva de aprendizaje</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-saludvalpa-teal">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Privacidad Absoluta</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Arquitectura offline-first: tus datos nunca salen de tu dispositivo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Cero dependencia de servidores externos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Control total sobre la información de tus pacientes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-saludvalpa-lime">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Diseño Centrado en el Profesional</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Funciones específicas para cada especialidad de la salud</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Flujos de trabajo que reflejan la práctica clínica real</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Documentación profesional lista para usar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-saludvalpa-blue">4</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Autonomía Tecnológica</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Sin bloqueos por falta de conexión a internet</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Capacidad de trabajo en cualquier lugar y momento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Independencia de proveedores de servicios en la nube</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Sección: Nuestra Visión */}
        {seccionActiva === 'vision' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔭</div>
                <h2 className="text-3xl font-bold text-saludvalpa-blue mb-4">Visión de SaludValpa</h2>
                <p className="text-xl text-gray-700 italic">
                  "Ser la plataforma de referencia para la gestión clínica en América Latina, 
                  transformando la manera en que los profesionales de la salud documentan, 
                  gestionan y optimizan su práctica, mientras mantenemos nuestro compromiso 
                  inquebrantable con la privacidad y accesibilidad."
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-saludvalpa-blue mb-4">Objetivos Estratégicos 2025-2030</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-saludvalpa-teal">📈</span> Expansión de Especialidades
                    </h4>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Cubrir las 10 principales especialidades de la salud para 2026</li>
                      <li className="list-disc">Desarrollar módulos específicos para cada disciplina</li>
                      <li className="list-disc">Crear una comunidad interdisciplinaria de profesionales</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-saludvalpa-lime">🚀</span> Innovación Tecnológica
                    </h4>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Implementar inteligencia artificial asistiva (sin comprometer privacidad)</li>
                      <li className="list-disc">Desarrollar integraciones con equipos médicos locales</li>
                      <li className="list-disc">Crear herramientas de análisis clínico avanzado</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-saludvalpa-blue">🌍</span> Impacto Social
                    </h4>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Facilitar el acceso a herramientas digitales en zonas rurales</li>
                      <li className="list-disc">Reducir la brecha tecnológica en el sector salud</li>
                      <li className="list-disc">Contribuir a la estandarización de documentación clínica</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-saludvalpa-teal">♻️</span> Sostenibilidad
                    </h4>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Mantener el modelo de precio único sin suscripciones forzadas</li>
                      <li className="list-disc">Continuar con arquitectura offline-first</li>
                      <li className="list-disc">Expandir capacidades manteniendo la simplicidad</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-saludvalpa-teal/10 to-saludvalpa-lime/10">
                <h3 className="text-2xl font-bold text-saludvalpa-blue mb-4">Línea de Tiempo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-saludvalpa-blue mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">2023 - Fundación</h4>
                      <p className="text-sm text-gray-600">Nacimiento en una farmacia del Estado de México</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-saludvalpa-teal mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">2024 - SaludValpa 1.0</h4>
                      <p className="text-sm text-gray-600">Lanzamiento de la primera versión para fisioterapeutas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-saludvalpa-lime mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">2025 - SaludValpa 3.0</h4>
                      <p className="text-sm text-gray-600">Expansión a 5 especialidades de la salud</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-saludvalpa-blue/50 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">2026 - SaludValpa 4.0</h4>
                      <p className="text-sm text-gray-600">Inteligencia artificial asistiva y comunidad profesional</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-saludvalpa-teal/50 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">2027 - SaludValpa 5.0</h4>
                      <p className="text-sm text-gray-600">Plataforma de referencia en América Latina</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Sección: Nuestra Privacidad */}
        {seccionActiva === 'privacidad' && (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal text-white">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-3xl font-bold mb-4">Nuestra Filosofía de Privacidad</h2>
                <p className="text-xl italic">
                  "Tu consultorio, tus datos, tu control."
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sin Internet Requerido</h3>
                <p className="text-gray-600 text-sm text-center">
                  SaludValpa funciona completamente offline desde el primer momento. Tus datos nunca necesitan conexión a internet.
                </p>
              </Card>

              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">💾</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Almacenamiento 100% Local</h3>
                <p className="text-gray-600 text-sm text-center">
                  Tus pacientes, historiales y documentos se guardan exclusivamente en tu dispositivo. Nunca usamos servidores en la nube.
                </p>
              </Card>

              <Card className="p-6">
                <div className="text-4xl mb-4 text-center">👁️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Cero Acceso Externo</h3>
                <p className="text-gray-600 text-sm text-center">
                  Nosotros no vemos tus datos. No tenemos acceso a tu información. No recolectamos datos de uso.
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500">
              <h3 className="text-2xl font-bold text-red-700 mb-4">⚠️ Responsabilidades del Usuario</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">1. Respaldo de Información</h4>
                  <p className="text-gray-600">
                    <strong>Recomendación crítica:</strong> Realiza respaldos regularmente desde Configuración → Respaldos.
                    Guarda el archivo en múltiples lugares seguros.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">2. Gestión de Contraseñas</h4>
                  <p className="text-gray-600">
                    <strong>Advertencia importante:</strong> No podemos recuperar contraseñas. No almacenamos contraseñas en servidores.
                    Usa un gestor de contraseñas y anota tu contraseña en un lugar seguro.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">3. Seguridad del Dispositivo</h4>
                  <p className="text-gray-600">
                    Mantén tu dispositivo actualizado, usa bloqueo de pantalla y considera encriptación del dispositivo completo.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-saludvalpa-blue mb-4">Preguntas Frecuentes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">¿SaludValpa cumple con regulaciones de protección de datos?</h4>
                  <p className="text-gray-600">
                    Sí, al mantener todos los datos localmente y bajo tu control exclusivo, SaludValpa facilita el cumplimiento
                    con regulaciones como HIPAA (EE.UU.), GDPR (Europa) y la Ley Federal de Protección de Datos Personales (México).
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">¿Qué pasa si pierdo o cambio de dispositivo?</h4>
                  <p className="text-gray-600">
                    Tus respaldos son portables. Simplemente instala SaludValpa en tu nuevo dispositivo, importa tu respaldo más reciente
                    y continúa donde lo dejaste.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">¿SaludValpa es realmente gratis?</h4>
                  <p className="text-gray-600">
                    Sí, la versión básica es completamente gratuita y siempre lo será. Ofrecemos funciones premium opcionales
                    para quienes desean soporte prioritario o características avanzadas.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10">
              <h3 className="text-2xl font-bold text-saludvalpa-blue mb-4">Declaración Final de Privacidad</h3>
              <p className="text-gray-700 italic">
                "En SaludValpa, tu privacidad no es una característica, es nuestro fundamento. Hemos construido una aplicación
                que respeta tu autonomía profesional, protege la confidencialidad de tus pacientes y te da control total
                sobre tu práctica. Porque creemos que la tecnología debe empoderar, no vigilar."
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcercaDeSaludValpa;