import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Shield, Star, Trophy, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LEVEL_THRESHOLDS = { 'Principiante': 0, 'Defensor Digital': 100, 'Ciber Héroe': 200 };

const Dashboard = () => {
  const navigate = useNavigate();
  const { avatar, points, level, badges, completedMissions, pointsAnimation } = useGame();

  if (!avatar) {
    navigate('/create-avatar');
    return null;
  }

  const levelLabels: Record<string, string> = {
    'Beginner': 'Principiante',
    'Digital Defender': 'Defensor Digital',
    'Cyber Hero': 'Ciber Héroe',
  };
  const levelLabel = levelLabels[level] || level;

  const nextLevel = level === 'Beginner' ? 100 : level === 'Digital Defender' ? 200 : 300;
  const prevLevel = level === 'Beginner' ? 0 : level === 'Digital Defender' ? 100 : 200;
  const progress = ((points - prevLevel) / (nextLevel - prevLevel)) * 100;

  const missions = [
    { id: 'story-1', title: 'El mensaje sospechoso', desc: 'Un extraño te envía un enlace raro...', icon: '📩', path: '/story', completed: completedMissions.includes('story-1') },
    { id: 'game-phishing', title: '¡Detecta el falso!', desc: '¿Puedes identificar cuál mensaje es phishing?', icon: '🎣', path: '/game-phishing', completed: completedMissions.includes('game-phishing') },
  ];

  const badgeLabels: Record<string, { name: string; description: string }> = {
    'first-mission': { name: 'Primeros pasos', description: 'Completa tu primera misión' },
    'phishing-pro': { name: 'Experto en Phishing', description: 'Detecta todos los mensajes falsos' },
    'story-master': { name: 'Maestro de Historias', description: 'Completa una historia interactiva' },
    'cyber-defender': { name: 'Ciber Defensor', description: 'Alcanza 100 puntos' },
    'perfect-score': { name: 'Puntaje Perfecto', description: 'Obtén puntaje perfecto en cualquier juego' },
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">CyberGuardians</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-warning/20 px-3 py-1">
              <Star className="h-4 w-4 text-gold" />
              <span className={`font-display font-bold text-warning-foreground ${pointsAnimation ? 'animate-points-pop' : ''}`}>
                {points}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-lg">
              {['🧑', '👦', '👧', '🧒'][avatar.hairStyle]}
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-8">
        {/* Welcome */}
        <div className="card-playful mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            ¡Hola de nuevo, {avatar.name}! 👋
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-display font-semibold text-accent">{levelLabel}</span>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-sm text-muted-foreground">
              <span>{points} puntos</span>
              <span>{nextLevel} para el siguiente nivel</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-3 rounded-full" />
          </div>
        </div>

        {/* Badges */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Tus insignias</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map(badge => {
              const label = badgeLabels[badge.id];
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 transition-all ${
                    badge.earned
                      ? 'border-gold bg-gold/10 shadow-md animate-scale-in'
                      : 'border-border bg-muted/50 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{label?.name || badge.name}</p>
                    <p className="text-xs text-muted-foreground">{label?.description || badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Missions */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Misiones disponibles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {missions.map(mission => (
              <div
                key={mission.id}
                className={`card-playful flex items-center gap-4 cursor-pointer ${
                  mission.completed ? 'border-success/50 bg-success/5' : ''
                }`}
                onClick={() => !mission.completed && navigate(mission.path)}
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
