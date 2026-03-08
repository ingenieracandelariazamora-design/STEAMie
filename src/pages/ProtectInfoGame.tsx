import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Lock, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import emabotMascot from '@/assets/emabot-mascot.png';

interface InfoItem {
  text: string;
  isPrivate: boolean;
  emoji: string;
}

const INFO_ITEMS: InfoItem[] = [
  { text: 'Tu nombre completo', isPrivate: true, emoji: '📝' },
  { text: 'Tu color favorito', isPrivate: false, emoji: '🎨' },
  { text: 'Tu dirección de casa', isPrivate: true, emoji: '🏠' },
  { text: 'Tu comida favorita', isPrivate: false, emoji: '🍕' },
  { text: 'El nombre de tu escuela', isPrivate: true, emoji: '🏫' },
  { text: 'Tu película favorita', isPrivate: false, emoji: '🎬' },
  { text: 'Tu contraseña', isPrivate: true, emoji: '🔑' },
  { text: 'Tu animal favorito', isPrivate: false, emoji: '🐱' },
  { text: 'Tu número de teléfono', isPrivate: true, emoji: '📱' },
  { text: 'Tu deporte favorito', isPrivate: false, emoji: '⚽' },
];

const ProtectInfoGame = () => {
  const navigate = useNavigate();
  const { addPoints } = useGame();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = INFO_ITEMS[currentIndex];
  const total = INFO_ITEMS.length;

  const handleAnswer = (saidPrivate: boolean) => {
    const correct = saidPrivate === current.isPrivate;
    setAnswered(saidPrivate);
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      addPoints(score * 10);
      setPhase('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(null);
      setIsCorrect(null);
    }
  };

  const restart = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setScore(0);
    setAnswered(null);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary/5 via-background to-primary/5 font-body">
      <header className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <button onClick={() => navigate('/mini-games')} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Lock className="h-5 w-5 text-secondary" />
        <h1 className="font-display font-bold text-foreground text-base">Protege tu Información</h1>
        {phase === 'playing' && (
          <div className="ml-auto text-xs font-medium text-muted-foreground">{currentIndex + 1}/{total}</div>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="h-28 w-28 rounded-full border-4 border-secondary/30 overflow-hidden shadow-xl bg-secondary/10">
              <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
            </div>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-sm leading-relaxed text-foreground">
                ¡Hola Emma! 🔒 Vamos a aprender qué información es <strong>privada</strong> y cuál puedes compartir.
              </p>
              <p className="text-sm leading-relaxed text-foreground mt-2">
                Te mostraré datos y tú decides: ¿es <span className="text-destructive font-bold">privado</span> o se puede <span className="text-success font-bold">compartir</span>? 💜
              </p>
            </div>
            <Button onClick={() => setPhase('playing')} className="btn-kid bg-secondary text-secondary-foreground shadow-xl text-lg px-10">
              🔒 ¡Empezar!
            </Button>
          </div>
        )}

        {phase === 'playing' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={currentIndex}>
            <div className="flex items-center gap-2 self-end">
              {Array.from({ length: score }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-secondary fill-secondary animate-scale-in" />
              ))}
            </div>

            {/* Info card */}
            <div className="w-full bg-card rounded-3xl border-2 border-secondary/20 p-6 shadow-xl text-center space-y-3">
              <span className="text-5xl block">{current.emoji}</span>
              <p className="text-lg font-display font-bold leading-relaxed text-foreground">{current.text}</p>
            </div>

            {answered === null ? (
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex items-center justify-center gap-3 w-full rounded-2xl border-3 border-destructive/30 bg-destructive/10 px-6 py-5 text-lg font-display font-bold text-destructive hover:bg-destructive/20 active:scale-95 transition-all shadow-md"
                >
                  🔒 Es privado
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex items-center justify-center gap-3 w-full rounded-2xl border-3 border-success/30 bg-success/10 px-6 py-5 text-lg font-display font-bold text-success hover:bg-success/20 active:scale-95 transition-all shadow-md"
                >
                  ✅ Se puede compartir
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
                {showConfetti && (
                  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute text-2xl" style={{
                        left: `${Math.random() * 100}%`, top: '-10%',
                        animation: `confetti 1.5s ease-out ${Math.random() * 0.5}s forwards`,
                      }}>
                        {['⭐', '🔒', '✨', '💜', '🛡️'][Math.floor(Math.random() * 5)]}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg ${
                  isCorrect ? 'bg-success/20 border-4 border-success/40' : 'bg-primary/10 border-4 border-primary/30'
                } animate-scale-in`}>
                  <span className="text-3xl">{isCorrect ? '🎉' : '💜'}</span>
                </div>

                <div className="flex items-start gap-3 w-full">
                  <div className="h-10 w-10 rounded-full border-2 border-secondary/30 overflow-hidden flex-shrink-0 shadow-md">
                    <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                    <p className="text-sm leading-relaxed text-foreground">
                      {isCorrect
                        ? current.isPrivate
                          ? `¡Correcto! "${current.text}" es información privada. ¡No la compartas con desconocidos! 🛡️`
                          : `¡Muy bien! "${current.text}" se puede compartir porque no es peligroso. 🌟`
                        : current.isPrivate
                          ? `"${current.text}" es información privada. Debemos protegerla y solo compartirla con adultos de confianza. 💜`
                          : `"${current.text}" no es privado, ¡se puede compartir sin peligro! 😊`
                      }
                    </p>
                  </div>
                </div>

                <Button onClick={handleNext} className="btn-kid bg-secondary text-secondary-foreground shadow-xl w-full max-w-xs text-base">
                  {currentIndex + 1 >= total ? '🏆 Ver resultados' : '➡️ Siguiente'}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === 'results' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="h-24 w-24 rounded-full border-4 border-secondary/50 overflow-hidden shadow-xl bg-secondary/10 animate-level-up">
              <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {score === total ? '¡Perfecta! 🌟' : score >= total / 2 ? '¡Muy bien! 💜' : '¡Sigue aprendiendo! 💖'}
            </h2>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg space-y-3 w-full max-w-xs">
              <p className="text-lg font-display font-bold text-foreground">{score} de {total} correctas</p>
              <p className="text-sm text-muted-foreground">+{score * 10} puntos ganados</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-secondary text-secondary-foreground shadow-xl text-base">🔄 Jugar de nuevo</Button>
              <Button onClick={() => navigate('/mini-games')} variant="outline" className="btn-kid text-base">🎮 Más juegos</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectInfoGame;
