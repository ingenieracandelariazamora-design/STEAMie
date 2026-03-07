import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { ArrowRight } from 'lucide-react';

const Missions = () => {
  const navigate = useNavigate();
  const { completedMissions, ageGroup } = useGame();

  const isYoung = ageGroup === '5-7';

  const missions = [
    { id: 'story-1', title: 'El mensaje sospechoso', desc: 'Un extraño te envía un enlace raro...', icon: '📩', path: '/story', completed: completedMissions.includes('story-1') },
    { id: 'game-phishing', title: '¡Detecta el falso!', desc: '¿Puedes identificar cuál mensaje es phishing?', icon: '🎣', path: '/game-phishing', completed: completedMissions.includes('game-phishing') },
    { id: 'comics', title: '📚 Cómics de seguridad', desc: 'Historias ilustradas para aprender', icon: '📖', path: '/comics', completed: false },
  ];

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <div className="container pt-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          {isYoung ? '¡A jugar! 🎮' : 'Misiones 🚀'}
        </h1>
        <p className="text-muted-foreground mb-6">
          Completadas: {completedCount}/{missions.length}
        </p>

        <div className="grid gap-4">
          {missions.map(mission => (
            <div
              key={mission.id}
              className={`card-playful flex items-center gap-4 cursor-pointer ${
                mission.completed ? 'border-success/50 bg-success/5' : ''
              }`}
              onClick={() => navigate(mission.path)}
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {mission.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{mission.title}</h3>
                <p className="text-sm text-muted-foreground">{mission.desc}</p>
              </div>
              {mission.completed ? (
                <span className="text-2xl">✅</span>
              ) : (
                <ArrowRight className="h-5 w-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Missions;
