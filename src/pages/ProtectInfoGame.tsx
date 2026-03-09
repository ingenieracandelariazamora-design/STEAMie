import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Lock, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useTTS } from '@/hooks/useTTS';
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
  const { speak, stop, toggle, isEnabled } = useTTS({ rate: 0.8, pitch: 1.15 });

  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = INFO_ITEMS[currentIndex];
  const total = INFO_ITEMS.length;

  // Auto-speak on phase/question changes
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        speak('¡Hola Emma! Vamos a aprender qué información es privada y cuál puedes compartir. Te mostraré datos y tú decides si es privado o se puede compartir.');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && current && answered === null) {
      const timer = setTimeout(() => {
        speak(`${current.text}. ¿Es privado o se puede compartir?`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, answered]);

  const handleAnswer = (saidPrivate: boolean) => {
    stop();
    const correct = saidPrivate === current.isPrivate;
    setAnswered(saidPrivate);
    setIsCorrect(correct);

    const feedbackText = correct
      ? current.isPrivate
        ? `¡Correcto! ${current.text} es información privada. No la compartas con desconocidos.`
        : `¡Muy bien! ${current.text} se puede compartir porque no es peligroso.`
      : current.isPrivate
        ? `${current.text} es información privada. Debemos protegerla y solo compartirla con adultos de confianza.`
        : `${current.text} no es privado, se puede compartir sin peligro.`;

    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1600);
    }

    setTimeout(() => speak(feedbackText), 300);
  };

  const getFeedbackText = () => {
    if (isCorrect === null) return '';
    return isCorrect
      ? current.isPrivate
        ? `¡Correcto! "${current.text}" es información privada. ¡No la compartas con desconocidos! 🛡️`
        : `¡Muy bien! "${current.text}" se puede compartir porque no es peligroso. 🌟`
      : current.isPrivate
        ? `"${current.text}" es información privada. Debemos protegerla y solo compartirla con adultos de confianza. 💜`
        : `"${current.text}" no es privado, ¡se puede compartir sin peligro! 😊`;
  };

  const handleNext = () => {
    stop();
    if (currentIndex + 1 >= total) {
      addPoints(score * 10);
      setPhase('results');
      const msg = score === total
        ? '¡Perfecta Emma! Respondiste todas las preguntas correctamente. ¡Eres una experta en proteger información!'
        : `¡Buen trabajo Emma! Respondiste ${score} de ${total} preguntas correctamente.`;
      setTimeout(() => speak(msg), 400);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(null);
      setIsCorrect(null);
    }
  };

  const restart = () => {
    stop();
    setPhase('intro');
    setCurrentIndex(0);
    setScore(0);
    setAnswered(null);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-secondary/5 via-background to-primary/5 font-body">
      <header className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <button onClick={() => { stop(); navigate('/mini-games'); }} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Lock className="h-5 w-5 text-secondary" />
        <h1 className="font-display font-bold text-foreground text-base flex-1">Protege tu Información</h1>
        {phase === 'playing' && (
          <span className="text-xs font-medium text-muted-foreground">{currentIndex + 1}/{total}</span>
        )}
        <button
          onClick={toggle}
          className={`p-2 rounded-xl transition-colors ${isEnabled ? 'bg-secondary/10 text-secondary' : 'hover:bg-muted/50 text-muted-foreground'}`}
        >
          {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </header>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="absolute text-2xl" style={{
              left: `${Math.random() * 100}%`, top: '-10%',
              animation: `confetti 1.5s ease-out ${Math.random() * 0.5}s forwards`,
            }}>
              {['⭐', '🔒', '✨', '💜', '🛡️'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative h-32 w-32">
              <div className="h-32 w-32 rounded-full border-4 border-secondary/30 overflow-hidden shadow-2xl bg-secondary/10">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 h-8 w-8 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Volume2 className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-base font-display font-medium text-foreground">
                ¡Hola Emma! 🔒
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                Vamos a aprender qué información es <strong className="text-destructive">privada</strong> y cuál puedes <strong className="text-primary">compartir</strong>. 💜
              </p>
            </div>
            <Button onClick={() => setPhase('playing')} className="btn-kid bg-secondary text-secondary-foreground shadow-xl text-xl px-12 py-6 rounded-3xl">
              🔒 ¡Empezar!
            </Button>
          </div>
        )}

        {phase === 'playing' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={currentIndex}>
            {/* Progress */}
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pregunta {currentIndex + 1} de {total}</span>
              <div className="flex gap-1">
                {Array.from({ length: score }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-secondary animate-scale-in" />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex) / total) * 100}%` }}
              />
            </div>

            {/* Info card */}
            <div className="w-full bg-card rounded-3xl border-2 border-secondary/20 p-6 shadow-xl text-center space-y-3">
              <span className="text-6xl block">{current.emoji}</span>
              <p className="text-xl font-display font-bold leading-relaxed text-foreground">{current.text}</p>
              {answered === null && (
                <button
                  onClick={() => speak(`${current.text}. ¿Es privado o se puede compartir?`)}
                  className="flex items-center gap-2 mx-auto text-xs text-muted-foreground hover:text-secondary transition-colors bg-muted/50 hover:bg-secondary/10 px-3 py-1.5 rounded-full"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Escuchar de nuevo
                </button>
              )}
            </div>

            {answered === null ? (
              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex items-center justify-center gap-4 w-full rounded-3xl border-2 border-destructive/30 bg-destructive/10 px-6 py-6 text-xl font-display font-bold text-destructive hover:bg-destructive/20 active:scale-95 transition-all shadow-lg"
                >
                  <span className="text-3xl">🔒</span>
                  <span>Es privado</span>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex items-center justify-center gap-4 w-full rounded-3xl border-2 border-primary/30 bg-primary/10 px-6 py-6 text-xl font-display font-bold text-primary hover:bg-primary/20 active:scale-95 transition-all shadow-lg"
                >
                  <span className="text-3xl">✅</span>
                  <span>Se puede compartir</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 ${
                  isCorrect ? 'bg-primary/10 border-primary/30' : 'bg-secondary/10 border-secondary/30'
                } animate-scale-in`}>
                  <span className="text-3xl">{isCorrect ? '🎉' : '💜'}</span>
                </div>

                <div className="flex items-start gap-3 w-full">
                  <div className="h-12 w-12 rounded-full border-2 border-secondary/30 overflow-hidden flex-shrink-0 shadow-md">
                    <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                    <p className="text-sm leading-relaxed text-foreground">{getFeedbackText()}</p>
                    <button
                      onClick={() => speak(getFeedbackText())}
                      className="flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-secondary transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Repetir
                    </button>
                  </div>
                </div>

                <Button onClick={handleNext} className="btn-kid bg-secondary text-secondary-foreground shadow-xl w-full text-lg py-5 rounded-3xl">
                  {currentIndex + 1 >= total ? '🏆 Ver resultados' : '➡️ Siguiente'}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === 'results' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="h-28 w-28 rounded-full border-4 border-secondary/50 overflow-hidden shadow-2xl bg-secondary/10 animate-level-up">
              <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {score === total ? '¡Perfecta! 🌟' : score >= total / 2 ? '¡Muy bien! 💜' : '¡Sigue aprendiendo! 💖'}
            </h2>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg space-y-3 w-full max-w-xs">
              <div className="flex justify-center gap-1 text-2xl">
                {Array.from({ length: score }).map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="text-lg font-display font-bold text-foreground">{score} de {total} correctas</p>
              <p className="text-sm text-muted-foreground">+{score * 10} puntos ganados</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-secondary text-secondary-foreground shadow-xl text-lg py-5 rounded-3xl">🔄 Jugar de nuevo</Button>
              <Button onClick={() => { stop(); navigate('/mini-games'); }} variant="outline" className="btn-kid text-base rounded-3xl">🎮 Más juegos</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectInfoGame;
