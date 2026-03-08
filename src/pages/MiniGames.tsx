import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import emabotMascot from '@/assets/emabot-mascot.png';

const GAMES = [
  {
    id: 'safe-or-not',
    title: '¿Seguro o No Seguro?',
    desc: 'Decide si las situaciones en internet son seguras.',
    emoji: '🎮',
    path: '/game-safe-or-not',
    gradient: 'from-primary/20 to-accent/10',
    border: 'border-primary/30',
  },
  {
    id: 'internet-detective',
    title: 'Detective de Internet',
    desc: 'Encuentra las pistas que muestran si algo es falso.',
    emoji: '🕵️',
    path: '/game-detective',
    gradient: 'from-accent/20 to-secondary/10',
    border: 'border-accent/30',
  },
  {
    id: 'protect-info',
    title: 'Protege tu Información',
    desc: 'Aprende qué datos son privados y cuáles puedes compartir.',
    emoji: '🔒',
    path: '/game-protect-info',
    gradient: 'from-secondary/20 to-primary/10',
    border: 'border-secondary/30',
  },
];

const MiniGames = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 pb-24 font-body">
      <div className="container pt-8 px-4 max-w-lg mx-auto">
        {/* Emabot greeting */}
        <div className="flex items-start gap-3 mb-8 animate-fade-in">
          <div className="h-14 w-14 rounded-full border-2 border-primary/30 overflow-hidden flex-shrink-0 shadow-lg bg-primary/10">
            <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-md">
            <p className="text-sm leading-relaxed text-foreground">
              ¡Gran elección! 🌟 Vamos a jugar y aprender cómo estar seguras en internet. <strong>¡Elige un juego!</strong>
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-secondary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Mini Juegos</h1>
        </div>

        {/* Game cards */}
        <div className="grid gap-4">
          {GAMES.map((game, i) => (
            <div
              key={game.id}
              className={`rounded-3xl border-2 ${game.border} bg-gradient-to-br ${game.gradient} p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-card shadow-md text-4xl">
                  {game.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground text-base leading-tight">{game.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{game.desc}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(game.path)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3.5 font-display font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                ▶️ ¡Jugar!
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniGames;
