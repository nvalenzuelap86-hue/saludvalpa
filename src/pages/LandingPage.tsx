// ============================================================================
// saludvalpa 3.0 - LANDING PAGE
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import InteractiveTour from '../components/InteractiveTour';

const LandingPage = () => {
  const navigate = useNavigate();
  const { configuracion, licencia } = useAppStore();
  const [showTour, setShowTour] = useState(false);
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = configuracion?.profesion !== undefined;
  // Check if license is active (pagada means paid)
  const isLicenseActive = licencia?.tipo === 'pagada';

  // Redirigir automáticamente al dashboard si ya completó el onboarding
  useEffect(() => {
    if (hasCompletedOnboarding) {
      console.log('🔀 LandingPage: Usuario ya completó onboarding, redirigiendo a /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [hasCompletedOnboarding, navigate]);

  const benefits = [
    {
      icon: '📊',
      title: 'Gestión Integral',
      description: 'Administra pacientes, citas, documentos y finanzas en un solo lugar.'
    },
    {
      icon: '⚡',
      title: 'Automatización Inteligente',
      description: 'Genera consentimientos, recibos y documentos automáticamente.'
    },
    {
      icon: '🔒',
      title: 'Seguridad y Privacidad',
      description: 'Tus datos están protegidos con encriptación de extremo a extremo.'
    },
    {
      icon: '📱',
      title: 'Acceso Multiplataforma',
      description: 'Funciona en web, móvil y como aplicación PWA instalable.'
    },
    {
      icon: '🔄',
      title: 'Sincronización en Nube',
      description: 'Accede a tus datos desde cualquier dispositivo, siempre actualizados.'
    },
    {
      icon: '🎯',
      title: 'Especializado por Profesión',
      description: 'Herramientas específicas para medicina, fisioterapia, psicología y más.'
    }
  ];

  const specialties = [
    { id: 'medicina', name: 'Medicina', icon: '🩺', color: 'bg-blue-100 text-blue-800', status: 'en construcción' },
    { id: 'fisioterapia', name: 'Fisioterapia', icon: '💪', color: 'bg-green-100 text-green-800', status: 'concluido' },
    { id: 'psicologia', name: 'Psicología', icon: '🧠', color: 'bg-purple-100 text-purple-800', status: 'en construcción' },
    { id: 'odontologia', name: 'Odontología', icon: '🦷', color: 'bg-teal-100 text-teal-800', status: 'en construcción' },
    { id: 'nutricion', name: 'Nutrición', icon: '🥗', color: 'bg-yellow-100 text-yellow-800', status: 'en construcción' }
  ];

  const handleGetStarted = () => {
    if (hasCompletedOnboarding) {
      // Usuario ya completó onboarding - ir al dashboard independientemente del tipo de licencia
      navigate('/dashboard');
    } else {
      // Usuario no ha completado onboarding - ir al onboarding
      navigate('/onboarding');
    }
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    // Store selected specialty in app store
    // Then navigate to onboarding
    navigate('/onboarding', { state: { specialty: specialtyId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-saludvalpa-blue/5">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-2xl mb-6">
            <span className="text-3xl">⚕️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Tu práctica profesional,
            <span className="block text-saludvalpa-blue">más eficiente que nunca</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            SaludValpa es la plataforma todo-en-uno diseñada específicamente para profesionales de la salud.
            Simplifica tu gestión diaria, automatiza tareas repetitivas y enfócate en lo que realmente importa: tus pacientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg"
            >
              Comenzar Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowTour(true)}
              className="px-8 py-4 text-lg"
            >
              Ver Tour Interactivo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sin tarjeta de crédito • 14 días de prueba gratuita
          </p>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-full flex items-center justify-center text-white font-bold text-lg">DR</div>
                <div className="ml-4">
                  <div className="font-semibold">Dr. Alejandro Martínez</div>
                  <div className="text-sm text-gray-500">Médico General</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"SaludValpa ha transformado completamente mi consultorio. La gestión de pacientes que antes me tomaba horas ahora es cuestión de minutos. ¡Increíble!"</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-full flex items-center justify-center text-white font-bold text-lg">FT</div>
                <div className="ml-4">
                  <div className="font-semibold">Lic. Carla Rodríguez</div>
                  <div className="text-sm text-gray-500">Fisioterapeuta</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"Como fisioterapeuta, las herramientas específicas para mi especialidad son invaluables. La biblioteca de ejercicios me ahorra mucho tiempo en la planificación de tratamientos."</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-full flex items-center justify-center text-white font-bold text-lg">PS</div>
                <div className="ml-4">
                  <div className="font-semibold">Dra. Sofía González</div>
                  <div className="text-sm text-gray-500">Psicóloga</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"La privacidad y seguridad que ofrece SaludValpa es fundamental en mi práctica. Además, la generación automática de consentimientos me da mucha tranquilidad legal."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Todo lo que necesitas para tu práctica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Selection */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Especializado para tu profesión
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            SaludValpa se adapta a las necesidades específicas de cada especialidad con herramientas y flujos de trabajo diseñados exclusivamente.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {specialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => handleSpecialtySelect(specialty.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl ${specialty.color} hover:scale-105 transition-transform relative`}
              >
                <span className="text-3xl mb-2">{specialty.icon}</span>
                <span className="font-medium">{specialty.name}</span>
                <span className={`absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full ${specialty.status === 'concluido' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  {specialty.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para transformar tu práctica profesional?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de profesionales que ya están usando SaludValpa para optimizar su trabajo diario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg bg-white text-saludvalpa-blue hover:bg-gray-100"
            >
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/acerca-de-saludvalpa')}
              className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2025 SaludValpa.app - Tu movimiento, nuestra ciencia</p>
          <p className="mb-2 text-sm">
            <a href="mailto:contacto@valpa.app" className="text-saludvalpa-blue hover:underline">contacto@valpa.app</a>
          </p>
          <p className="text-sm">
            <a href="/acerca-de-saludvalpa" className="hover:text-saludvalpa-blue">Acerca de</a> •
            <a href="#" className="hover:text-saludvalpa-blue ml-4">Privacidad</a> •
            <a href="#" className="hover:text-saludvalpa-blue ml-4">Términos</a> •
            <a href="/app/activar-licencia" className="hover:text-saludvalpa-blue ml-4">Licencia</a>
          </p>
        </div>
      </footer>

      {/* Interactive Tour */}
      {showTour && (
        <InteractiveTour
          open={showTour}
          onClose={() => setShowTour(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;