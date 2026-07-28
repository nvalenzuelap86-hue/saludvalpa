// ============================================================================
// saludvalpa 3.0 - LAYOUT
// Layout principal con navegación
// ============================================================================

import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

const Layout = () => {
  const location = useLocation();
  const { configuracion, licencia } = useAppStore();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Calcular días restantes de la licencia
  const calcularDiasRestantes = () => {
    if (!licencia?.fechaExpiracion) return 0;
    const ahora = new Date();
    const expiracion = new Date(licencia.fechaExpiracion);
    const diferencia = expiracion.getTime() - ahora.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const diasRestantes = calcularDiasRestantes();

  const navItems = [
    { path: '/app/dashboard', icon: '🏠', label: 'Inicio' },
    { path: '/app/pacientes', icon: '👥', label: 'Pacientes' },
    { path: '/app/agenda', icon: '📅', label: 'Agenda' },
    { path: '/app/economia', icon: '💰', label: 'Economía' },
    { path: '/app/biblioteca', icon: '📚', label: 'Biblioteca' },
    { path: '/app/documentos', icon: '📄', label: 'Documentos' },
    { path: '/app/configuracion', icon: '⚙️', label: 'Config' },
    { path: '/acerca-de-saludvalpa', icon: 'ℹ️', label: 'Acerca de SaludValpa' },
  ];

  // Dividir menú móvil: principales vs secundarios
  const navPrincipales = navItems.slice(0, 4); // Dashboard, Pacientes, Agenda, Economía
  const navSecundarios = navItems.slice(4); // Biblioteca, Documentos, Config, Acerca de

  const isActive = (path: string) => location.pathname === path;
  
  const handleNavClick = () => {
    setMenuMovilAbierto(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-saludvalpa-blue via-saludvalpa-teal to-saludvalpa-lime rounded-lg"></div>
            <div>
              <h1 className="text-lg font-bold text-saludvalpa-blue">saludvalpa</h1>
              <p className="text-xs text-gray-500 -mt-1">Tu movimiento, nuestra ciencia</p>
            </div>
          </div>
          
          {/* Info de licencia */}
          <div className="text-right">
            {licencia && (
              <div className="text-xs">
                {licencia.tipo === 'gratuita' ? (
                  <span className="text-orange-600 font-medium">
                    Versión gratuita - {diasRestantes} días restantes
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">
                    Licencia activa
                  </span>
                )}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {configuracion?.branding.nombreProfesional || 'Profesional'}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto pb-20 md:pb-4">
        <Outlet />
      </main>

      {/* Navegación inferior (mobile) - Solo 4 principales + Menú */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div className="flex items-center justify-around py-2">
          {navPrincipales.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-saludvalpa-blue bg-saludvalpa-blue-light'
                  : 'text-gray-500 hover:text-saludvalpa-blue'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Botón de menú para opciones adicionales */}
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              navSecundarios.some(item => isActive(item.path))
                ? 'text-saludvalpa-blue bg-saludvalpa-blue-light'
                : 'text-gray-500 hover:text-saludvalpa-blue'
            }`}
          >
            <span className="text-2xl">≡</span>
            <span className="text-xs font-medium">Más</span>
          </button>
        </div>
      </nav>

      {/* Menú desplegable móvil */}
      {menuMovilAbierto && (
        <>
          {/* Overlay para cerrar */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setMenuMovilAbierto(false)}
          />
          
          {/* Menú */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 animate-slide-up">
            <div className="p-4 space-y-2">
              {navSecundarios.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-saludvalpa-blue bg-saludvalpa-blue-light font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navegación lateral (desktop) */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 pt-20">
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-saludvalpa-blue bg-saludvalpa-blue-light font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
