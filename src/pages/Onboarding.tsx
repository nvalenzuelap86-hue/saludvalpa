// ============================================================================
// saludvalpa 3.0 - STREAMLINED ONBOARDING
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import type { TipoProfesion } from '../types';
import Button from '../components/shared/Button';

type Step = 'welcome' | 'specialty' | 'profile' | 'complete';

interface OnboardingData {
  nombreProfesional: string;
  credenciales: string;
  especialidad: string;
  telefono: string;
  email: string;
  profesion: TipoProfesion | null;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completarOnboarding } = useAppStore();
  const [step, setStep] = useState<Step>('welcome');
  const [data, setData] = useState<OnboardingData>({
    nombreProfesional: '',
    credenciales: '',
    especialidad: '',
    telefono: '',
    email: '',
    profesion: location.state?.specialty || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // If specialty was passed from landing page, skip to specialty step
  useEffect(() => {
    if (location.state?.specialty && step === 'welcome') {
      const specialty = location.state.specialty as TipoProfesion;
      setData(prev => ({ ...prev, profesion: specialty }));
      setStep('specialty');
    }
  }, [location.state, step]);

  const handleSelectProfession = (profesion: TipoProfesion) => {
    const specialtyDefaults: Partial<Record<TipoProfesion, string>> = {
      fisioterapia: 'Fisioterapia',
      psicologia: 'Psicología',
      nutricion: 'Nutrición',
      medicina_general: 'Medicina General',
      odontologia: 'Odontología',
    };

    setData(prev => ({
      ...prev,
      profesion,
      especialidad: specialtyDefaults[profesion] || '',
    }));
    setStep('profile');
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.profesion) {
      alert('Por favor selecciona tu profesión primero');
      setStep('specialty');
      return;
    }
    
    if (!data.nombreProfesional.trim()) {
      alert('Por favor ingresa tu nombre profesional');
      return;
    }

    setIsSaving(true);
    try {
      await completarOnboarding({
        profesion: data.profesion,
        branding: {
          nombreProfesional: data.nombreProfesional.trim(),
          credenciales: data.credenciales.trim(),
          especialidad: data.especialidad.trim(),
          colores: {
            primario: '#2C5D7D',
            secundario: '#5FB4B4',
            acento: '#9BCB56',
          },
          tema: 'saludvalpa',
          piePagina: 'Creado en saludvalpa.app - versión gratuita',
          mostrarMarcaDeAgua: true,
          formatoDocumentos: 'formal',
        },
        datosContacto: {
          telefono: data.telefono.trim(),
          email: data.email.trim(),
        },
      });

      setStep('complete');
    } catch (error) {
      console.error('Error al completar onboarding:', error);
      alert('Hubo un error al guardar tu configuración. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  // Simple progress indicator
  const ProgressIndicator = () => {
    const stepsConfig = [
      { id: 'welcome', title: 'Bienvenida' },
      { id: 'specialty', title: 'Especialidad' },
      { id: 'profile', title: 'Perfil' },
      { id: 'complete', title: 'Listo' },
    ];
    
    const currentIndex = stepsConfig.findIndex(s => s.id === step);
    
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          {stepsConfig.map((stepItem, index) => (
            <div key={stepItem.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentIndex 
                  ? 'bg-saludvalpa-blue text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-2 text-gray-600">{stepItem.title}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-saludvalpa-blue rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / (stepsConfig.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-10">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime rounded-3xl flex items-center justify-center mb-6">
                <span className="text-4xl">⚕️</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bienvenido a <span className="text-saludvalpa-blue">SaludValpa</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                La plataforma profesional diseñada para simplificar tu práctica diaria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">Gestión Integral</h3>
                <p className="text-gray-600 text-sm">
                  Pacientes, citas, documentos y finanzas en un solo lugar
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Automatización</h3>
                <p className="text-gray-600 text-sm">
                  Genera documentos profesionales en segundos
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">Especializado</h3>
                <p className="text-gray-600 text-sm">
                  Herramientas específicas para tu profesión
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setStep('specialty')}
                className="w-full max-w-md mx-auto py-4"
              >
                Comenzar Configuración
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full max-w-md mx-auto py-4"
              >
                Volver al Inicio
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Configuración rápida • 3-5 minutos • Sin tarjeta de crédito
            </p>
          </div>
        );

      case 'specialty':
        return (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              ¿Cuál es tu especialidad?
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Selecciona tu área para personalizar la experiencia con herramientas específicas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'fisioterapia' as TipoProfesion, name: 'Fisioterapia', icon: '💪', color: 'from-blue-500 to-cyan-500', description: 'Evaluaciones, planes de tratamiento, evoluciones' },
                { id: 'psicologia' as TipoProfesion, name: 'Psicología', icon: '🧠', color: 'from-purple-500 to-pink-500', description: 'Historia clínica, sesiones terapéuticas, planes' },
                { id: 'medicina_general' as TipoProfesion, name: 'Medicina General', icon: '🩺', color: 'from-red-500 to-orange-500', description: 'Historia clínica, recetas, certificados' },
                { id: 'odontologia' as TipoProfesion, name: 'Odontología', icon: '🦷', color: 'from-teal-500 to-emerald-500', description: 'Historia odontológica, odontogramas, tratamientos' },
                { id: 'nutricion' as TipoProfesion, name: 'Nutrición', icon: '🥗', color: 'from-green-500 to-lime-500', description: 'Planes nutricionales, valoraciones, seguimiento' },
              ].map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => handleSelectProfession(specialty.id)}
                  className={`bg-white rounded-2xl p-8 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 ${
                    data.profesion === specialty.id ? 'border-saludvalpa-blue' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${specialty.color} flex items-center justify-center mb-4`}>
                    <span className="text-3xl">{specialty.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{specialty.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{specialty.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-center">
                      <span className="text-green-500 mr-1">✓</span>
                      <span>Herramientas específicas</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-green-500 mr-1">✓</span>
                      <span>Documentos personalizados</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => setStep('welcome')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Volver
              </button>
            </div>
          </div>
        );

      case 'profile':
        return data.profesion ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">
                {data.profesion === 'fisioterapia' && '💪'}
                {data.profesion === 'psicologia' && '🧠'}
                {data.profesion === 'nutricion' && '🥗'}
                {data.profesion === 'medicina_general' && '🩺'}
                {data.profesion === 'odontologia' && '🦷'}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Bienvenido, {data.profesion === 'fisioterapia' ? 'Fisioterapeuta' : 
                data.profesion === 'psicologia' ? 'Psicólogo/a' :
                data.profesion === 'medicina_general' ? 'Médico/a' :
                data.profesion === 'odontologia' ? 'Odontólogo/a' :
                data.profesion === 'nutricion' ? 'Nutriólogo/a' : 'Profesional'}
              </h2>
              <p className="text-gray-600">
                Configura tu perfil para comenzar a usar SaludValpa
              </p>
            </div>
            
            <form onSubmit={handleSubmitProfile} className="bg-white rounded-2xl shadow-xl p-8 mt-8">
              <h3 className="text-2xl font-bold mb-6">Completa tu perfil profesional</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre profesional o clínica *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.nombreProfesional}
                    onChange={(e) => setData({...data, nombreProfesional: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                    placeholder="Dr. Juan Pérez / Clínica Salud"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credenciales
                    </label>
                    <input
                      type="text"
                      value={data.credenciales}
                      onChange={(e) => setData({...data, credenciales: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="Lic. Fisioterapia, Ced. 12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      value={data.especialidad}
                      onChange={(e) => setData({...data, especialidad: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="Fisioterapia Deportiva"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={data.telefono}
                      onChange={(e) => setData({...data, telefono: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="+52 555 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({...data, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saludvalpa-blue focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('specialty')}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ← Cambiar especialidad
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Guardando...' : 'Continuar →'}
                </Button>
              </div>
            </form>
          </div>
        ) : null;

      case 'complete':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">¡Configuración Completada!</h2>
              <p className="text-gray-600 mb-8">
                Tu cuenta de SaludValpa está lista para usar. Ahora puedes comenzar a gestionar tu práctica profesional.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold mb-3">Lo que puedes hacer ahora:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Gestionar pacientes y citas</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Generar documentos profesionales</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Acceder a herramientas específicas para tu especialidad</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Configurar recordatorios automáticos</span>
                  </li>
                </ul>
              </div>

              <Button
                size="lg"
                variant="primary"
                onClick={handleComplete}
                className="w-full py-4"
              >
                Ir al Dashboard
              </Button>

              <p className="text-sm text-gray-500 mt-6">
                ¿Necesitas ayuda? Revisa nuestra guía de inicio rápido o contacta a soporte.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <ProgressIndicator />
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
