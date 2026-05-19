// ============================================================================
// saludvalpa 3.0 - PROGRESS TRACKER COMPONENT
// ============================================================================

import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { db } from '../db/database';
import Card from './shared/Card';

type MilestoneType = 'onboarding' | 'first_patient' | 'first_appointment' | 'first_document' | 'license_activation' | 'profile_completion';

interface Milestone {
  id: MilestoneType;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  dateCompleted?: Date;
  reward?: string;
  action?: () => void;
}

interface ProgressStats {
  totalPatients: number;
  totalAppointments: number;
  totalDocuments: number;
  daysActive: number;
  completionRate: number;
}

interface ProgressTrackerProps {
  onClose?: () => void;
}

const ProgressTracker = ({ onClose }: ProgressTrackerProps) => {
  const { configuracion, licencia } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalDocuments: 0,
    daysActive: 0,
    completionRate: 0
  });

  // Calculate days active and fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!configuracion?.fechaCreacion) return;

      const startDate = new Date(configuracion.fechaCreacion);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      try {
        // Fetch real counts from database
        const [patients, appointments, documents] = await Promise.all([
          db.pacientes.count(),
          db.citas.count(),
          db.documentos.count()
        ]);

        // Calculate profile completion percentage
        let profileCompletion = 0;
        if (configuracion) {
          const requiredFields = [
            configuracion.branding?.nombreProfesional,
            configuracion.datosContacto?.telefono,
            configuracion.datosContacto?.email
          ];
          const optionalFields = [
            configuracion.branding?.credenciales,
            configuracion.branding?.especialidad,
            configuracion.datosContacto?.direccion,
            configuracion.branding?.logo
          ];
          
          const completedRequired = requiredFields.filter(field => field && field.trim().length > 0).length;
          const completedOptional = optionalFields.filter(field => field && field.trim().length > 0).length;
          
          // Weight: 70% for required fields, 30% for optional fields
          // Avoid division by zero
          const requiredScore = requiredFields.length > 0
            ? (completedRequired / requiredFields.length) * 70
            : 0;
          const optionalScore = optionalFields.length > 0
            ? (completedOptional / optionalFields.length) * 30
            : 0;
            
          profileCompletion = Math.round(requiredScore + optionalScore);
        }

        setStats({
          totalPatients: patients,
          totalAppointments: appointments,
          totalDocuments: documents,
          daysActive: diffDays,
          completionRate: profileCompletion
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Fallback to zero values if database error
        setStats({
          totalPatients: 0,
          totalAppointments: 0,
          totalDocuments: 0,
          daysActive: diffDays,
          completionRate: 0
        });
      }
    };

    fetchStats();
  }, [configuracion]);

  const milestones: Milestone[] = [
    {
      id: 'onboarding',
      title: 'Onboarding Completado',
      description: 'Configuraste tu perfil y especialidad',
      icon: '🎯',
      completed: !!configuracion,
      dateCompleted: configuracion?.fechaCreacion,
      reward: 'Acceso completo a SaludValpa'
    },
    {
      id: 'first_patient',
      title: 'Primer Paciente',
      description: 'Registraste tu primer paciente',
      icon: '👤',
      completed: stats.totalPatients > 0,
      reward: 'Plantilla de historia clínica'
    },
    {
      id: 'first_appointment',
      title: 'Primera Cita',
      description: 'Programaste tu primera cita',
      icon: '📅',
      completed: stats.totalAppointments > 0,
      reward: 'Recordatorios automáticos'
    },
    {
      id: 'first_document',
      title: 'Primer Documento',
      description: 'Generaste tu primer documento profesional',
      icon: '📄',
      completed: stats.totalDocuments > 0,
      reward: 'Acceso a plantillas premium'
    },
    {
      id: 'license_activation',
      title: 'Licencia Activada',
      description: 'Actualizaste a versión premium',
      icon: '⭐',
      completed: licencia?.tipo === 'pagada',
      reward: 'Características premium desbloqueadas'
    },
    {
      id: 'profile_completion',
      title: 'Perfil 100% Completado',
      description: 'Completaste toda tu información profesional',
      icon: '✅',
      completed: stats.completionRate >= 100,
      reward: 'Badge de experto SaludValpa'
    }
  ];

  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = milestones.length;
  const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100);

  const getNextMilestone = (): Milestone | undefined => {
    return milestones.find(m => !m.completed);
  };

  const nextMilestone = getNextMilestone();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate level based on progress
  const calculateLevel = () => {
    const points = completedMilestones * 10 + stats.totalPatients * 2 + stats.totalAppointments * 1 + stats.totalDocuments * 3;
    if (points >= 100) return { level: 5, label: 'Experto', nextLevelPoints: 0 };
    if (points >= 75) return { level: 4, label: 'Avanzado', nextLevelPoints: 100 - points };
    if (points >= 50) return { level: 3, label: 'Intermedio', nextLevelPoints: 75 - points };
    if (points >= 25) return { level: 2, label: 'Principiante+', nextLevelPoints: 50 - points };
    return { level: 1, label: 'Principiante', nextLevelPoints: 25 - points };
  };

  const levelInfo = calculateLevel();

  if (!isExpanded) {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow relative" onClick={toggleExpanded}>
        {onClose && (
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar progreso"
          >
            ✕
          </button>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Tu Progreso</h3>
              <p className="text-sm text-gray-600">
                Nivel {levelInfo.level} • {completedMilestones}/{totalMilestones} hitos
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-saludvalpa-blue">{progressPercentage}%</div>
            <div className="text-xs text-gray-500">completado</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-saludvalpa-blue to-saludvalpa-teal rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {nextMilestone && (
            <div className="mt-3 text-sm text-gray-600 flex items-center">
              <span className="mr-2">🎯</span>
              <span>Siguiente: {nextMilestone.title}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tu Progreso en SaludValpa</h2>
          <p className="text-gray-600">Sigue tu evolución y desbloquea recompensas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpanded}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Colapsar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar progreso"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Level and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-saludvalpa-blue to-saludvalpa-teal rounded-xl p-6 text-white">
          <div className="text-4xl font-bold mb-2">Nivel {levelInfo.level}</div>
          <div className="text-lg font-semibold mb-1">{levelInfo.label}</div>
          <div className="text-sm opacity-90">
            {levelInfo.nextLevelPoints > 0 
              ? `${levelInfo.nextLevelPoints} puntos para el siguiente nivel`
              : '¡Nivel máximo alcanzado!'}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">{progressPercentage}%</div>
          <div className="text-gray-600 mb-3">Progreso general</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-saludvalpa-blue rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.daysActive}</div>
          <div className="text-gray-600">Días activo</div>
          <div className="mt-3 text-sm text-gray-500">
            Desde {configuracion?.fechaCreacion ? new Date(configuracion.fechaCreacion).toLocaleDateString('es-MX') : '---'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
          <div className="text-sm text-gray-600">Pacientes</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
          <div className="text-sm text-gray-600">Citas</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</div>
          <div className="text-sm text-gray-600">Documentos</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.completionRate}%</div>
          <div className="text-sm text-gray-600">Completitud</div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Hitos y Recompensas</h3>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id}
              className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                milestone.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                milestone.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <span className="text-2xl">{milestone.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${
                    milestone.completed ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {milestone.title}
                  </h4>
                  {milestone.completed ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Completado
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Pendiente
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                
                {milestone.reward && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 mr-2">Recompensa:</span>
                    <span className="text-xs font-medium text-saludvalpa-blue">{milestone.reward}</span>
                  </div>
                )}
                
                {milestone.dateCompleted && (
                  <div className="text-xs text-gray-500 mt-1">
                    Completado el {new Date(milestone.dateCompleted).toLocaleDateString('es-MX')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-saludvalpa-blue/10 to-saludvalpa-teal/10 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-2">💡 Consejos para progresar más rápido</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <span className="mr-2">•</span>
            <span>Completa tu perfil profesional al 100% para desbloquear todas las funciones</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            <span>Usa las plantillas predefinidas para agilizar la creación de documentos</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            <span>Programa recordatorios automáticos para reducir las inasistencias</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            <span>Explora la biblioteca de recursos específicos para tu especialidad</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={toggleExpanded}
          className="text-saludvalpa-blue hover:text-saludvalpa-blue-dark font-medium"
        >
          Ver resumen
        </button>
      </div>
    </Card>
  );
};

export default ProgressTracker;