import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Shield, Star, Trophy, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTTS } from '@/hooks/useTTS';
import emabotMascot from '@/assets/emabot-mascot.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { avatar, points, level, badges, completedMissions, pointsAnimation, ageGroup } = useGame();
  const [showEmabotHint, setShowEmabotHint] = useState(false);
  const { speak } = useTTS();

  if (!avatar) {
    navigate('/create-avatar');
    return null;
  }

  const levelLabels: Record<string, string> = {
    'Beginner': 'Principiante',
    'Digital Defender': 'Defensora Digital',
    'Cyber Hero': 'Ciber Heroína',
  };
  const levelLabel = levelLabels[level] || level;

  const nextLevel = level === 'Beginner' ? 100 : level === 'Digital Defender' ? 200 : 300;
  const prevLevel = level === 'Beginner' ? 0 : level === 'Digital Defender' ? 100 : 200;
  const progress = ((points - prevLevel) / (nextLevel - prevLevel)) * 100;

  const isYoung = ageGroup === '5-7';

  const missions = [
    { id: 'emabot-chat', title: '💬 Habla con Emabot', desc: 'Tu guía digital te enseña seguridad', icon: '🤖', path: 'emabot-hint', completed: false, ttsHint: '¡Hola! Para hablar conmigo toca mi burbuja de chat en la esquina.' },
    { id: 'game-safe', title: '¿Seguro o No Seguro?', desc: '¡Aprende qué es seguro en internet!', icon: '🛡️', path: '/game-safe-or-not', completed: false, ttsHint: 'Vamos a jugar. Tú decides si algo en internet es seguro o peligroso.' },
    { id: 'story-1', title: 'El mensaje sospechoso', desc: 'Un extraño te envía un enlace raro...', icon: '📩', path: '/story', completed: completedMissions.includes('story-1'), ttsHint: 'Un extraño te envía un mensaje raro. ¿Qué deberías hacer?' },
    { id: 'game-phishing', title: '¡Detecta el falso!', desc: '¿Puedes identificar cuál mensaje es phishing?', icon: '🎣', path: '/game-phishing', completed: completedMissions.includes('game-phishing'), ttsHint: '¿Puedes descubrir cuál mensaje es falso?' },
    { id: 'videos', title: '🎬 Videos de seguridad', desc: '¡Aprende con videos cortos y divertidos!', icon: '🎬', path: '/videos', completed: false, ttsHint: 'Vamos a ver una historia para aprender a estar seguras en internet.' },
  ];

  const badgeLabels: Record<string, { name: string; description: string }> = {
    'first-mission': { name: 'Primeros pasos', description: 'Completa tu primera misión' },
    'phishing-pro': { name: 'Experta en Phishing', description: 'Detecta todos los mensajes falsos' },
    'story-master': { name: 'Maestra de Historias', description: 'Completa una historia interactiva' },
    'cyber-defender': { name: 'Ciber Defensora', description: 'Alcanza 100 puntos' },
    'perfect-score': { name: 'Puntaje Perfecto', description: 'Obtén puntaje perfecto en cualquier juego' },
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <img src={emabotMascot} alt="Emabot" className="w-8 h-8" />
            <span className="font-display text-lg font-bold text-foreground">EmaBot</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1">
              <Star className="h-4 w-4 text-gold" />
              <span className={`font-display font-bold text-secondary-foreground ${pointsAnimation ? 'animate-points-pop' : ''}`}>
                {points}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-lg">
              {['👧', '👩', '🧒', '👱‍♀️'][avatar.hairStyle]}
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-6">
        {/* Welcome */}
        <div className="card-playful mb-6 bg-gradient-to-r from-pink-light/50 to-purple-light/50">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {isYoung ? `¡Hola, ${avatar.name}! 🌈` : `¡Hola de nuevo, ${avatar.name}! 💪`}
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
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Tus insignias ✨</h2>
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
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">
            {isYoung ? '¡A jugar! 🎮' : 'Misiones disponibles 🚀'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {missions.map(mission => (
              <div
                key={mission.id}
                className={`card-playful flex items-center gap-4 cursor-pointer ${
                  mission.completed ? 'border-success/50 bg-success/5' : ''
                }`}
                onClick={() => {
                  if (isYoung && mission.ttsHint) {
                    speak(mission.ttsHint);
                  }
                  if (mission.path === 'emabot-hint') {
                    setShowEmabotHint(true);
                    window.dispatchEvent(new CustomEvent('highlight-emabot-bubble'));
                    setTimeout(() => setShowEmabotHint(false), 6000);
                  } else {
                    if (isYoung && mission.ttsHint) {
                      setTimeout(() => navigate(mission.path), 1500);
                    } else {
                      navigate(mission.path);
                    }
                  }
                }}
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

        {/* Community Stories */}
        <section>
          <div
            className="card-playful flex items-center gap-4 cursor-pointer border-2 border-accent/30"
            onClick={() => {
              if (isYoung) {
                speak('Aquí las familias comparten experiencias para aprender sobre seguridad digital.');
                setTimeout(() => navigate('/community-stories'), 1500);
              } else {
                navigate('/community-stories');
              }
            }}
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
              💜
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">Historias de la Comunidad</h3>
              <p className="text-sm text-muted-foreground">Experiencias reales de familias sobre seguridad digital</p>
            </div>
            <ArrowRight className="h-5 w-5 text-accent" />
          </div>
        </section>

        {/* Emabot hint overlay */}
        {showEmabotHint && (
          <div className="fixed inset-0 z-40 flex items-end justify-end p-4 pb-24 pointer-events-none animate-slide-up">
            <div className="relative max-w-xs pointer-events-auto bg-card border-2 border-primary/40 rounded-3xl p-5 shadow-2xl mr-2 mb-2">
              <button
                onClick={() => setShowEmabotHint(false)}
                className="absolute top-2 right-3 text-muted-foreground hover:text-foreground text-lg"
              >
                ✕
              </button>
              <div className="flex items-start gap-3">
                <img src={emabotMascot} alt="Emabot" className="h-12 w-12 rounded-full border-2 border-primary/30 flex-shrink-0" />
                <div>
                  <p className="font-display font-bold text-foreground text-base">¡Hola! Soy Emabot 🤖</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Para hablar conmigo, toca mi burbuja de chat en la esquina de la pantalla 💬
                  </p>
                  <p className="text-sm text-primary font-semibold mt-1">
                    ¡Ahí podemos jugar y aprender juntas! ✨
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-primary/40" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
