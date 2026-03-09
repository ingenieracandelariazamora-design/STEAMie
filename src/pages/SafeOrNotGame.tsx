import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Shield, CheckCircle2, XCircle, Trophy, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useTTS } from '@/hooks/useTTS';
import emabotMascot from '@/assets/emabot-mascot.png';

interface Situation {
  id: number;
  text: string;
  isSafe: boolean;
  correctFeedback: string;
  wrongFeedback: string;
  emoji: string;
}

const SITUATIONS: Situation[] = [
  {
    id: 1,
    text: 'Un desconocido en internet te pide tu dirección de casa.',
    isSafe: false,
    correctFeedback: '¡Muy bien, Emma! Nunca compartimos nuestra dirección con desconocidos en internet.',
    wrongFeedback: '¡Cuidado! Nuestra dirección es información privada. No debemos compartirla con desconocidos.',
    emoji: '🏠',
  },
  {
    id: 2,
    text: 'Antes de descargar un juego nuevo, le preguntas a mamá o papá.',
    isSafe: true,
    correctFeedback: '¡Correcto! Siempre es bueno preguntar a un adulto de confianza antes de descargar algo.',
    wrongFeedback: 'Recuerda: preguntar a mamá o papá antes de descargar algo es lo más seguro.',
    emoji: '📱',
  },
  {
    id: 3,
    text: 'Una amiga de la escuela te envía un mensaje para decir hola.',
    isSafe: true,
    correctFeedback: '¡Bien hecho! Hablar con personas que conoces es más seguro.',
    wrongFeedback: 'Si es una amiga que conoces de la escuela, ¡está bien contestar!',
    emoji: '👋',
  },
  {
    id: 4,
    text: 'Alguien que no conoces te pide una foto tuya.',
    isSafe: false,
    correctFeedback: '¡Excelente! Nunca enviamos fotos a personas que no conocemos.',
    wrongFeedback: 'Cuidado: nunca debemos enviar fotos a desconocidos. Cuéntale a un adulto.',
    emoji: '📸',
  },
  {
    id: 5,
    text: 'Usas una contraseña que solo tú y tus papás conocen.',
    isSafe: true,
    correctFeedback: '¡Perfecto! Las contraseñas son secretos que solo compartimos con nuestros papás.',
    wrongFeedback: 'Las contraseñas seguras son las que solo tú y tus papás conocen. ¡Eso es bueno!',
    emoji: '🔑',
  },
  {
    id: 6,
    text: 'Un mensaje dice que ganaste un premio y te pide hacer clic en un enlace.',
    isSafe: false,
    correctFeedback: '¡Muy lista! Esos mensajes son trampas. Nunca hagas clic en enlaces extraños.',
    wrongFeedback: '¡Cuidado! Esos premios falsos son trampas. Siempre dile a un adulto.',
    emoji: '🎁',
  },
];

const SafeOrNotGame = () => {
  const navigate = useNavigate();
  const { addPoints } = useGame();
  const { speak, stop, toggle, isEnabled } = useTTS({ rate: 0.8, pitch: 1.2 });

  const [phase, setPhase] = useState<'intro' | 'playing' | 'feedback' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = SITUATIONS[currentIndex];
  const total = SITUATIONS.length;

  // Auto-speak on phase changes
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        speak('¡Hola Emma! Vamos a jugar. Te mostraré situaciones de internet y tú dices si son seguras o no. ¡Comencemos!');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && current) {
      const timer = setTimeout(() => {
        speak(`${current.text}. ¿Es seguro o no es seguro?`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex]);

  const handleAnswer = (answeredSafe: boolean) => {
    stop();
    const correct = answeredSafe === current.isSafe;
    setSelectedAnswer(answeredSafe);
    setIsCorrect(correct);
    setPhase('feedback');

    if (correct) {
      setScore(prev => prev + 1);
      setStars(prev => [...prev, currentIndex]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    // Speak feedback
    setTimeout(() => speak(correct ? current.correctFeedback : current.wrongFeedback), 300);
  };

  const handleNext = () => {
    stop();
    if (currentIndex + 1 >= total) {
      addPoints(score * 10);
      setPhase('results');
      const msg = score === total
        ? '¡Perfecta Emma! Respondiste todo correcto. ¡Eres una experta en seguridad digital!'
        : `¡Muy bien Emma! Respondiste ${score} de ${total} preguntas correctas.`;
      setTimeout(() => speak(msg), 400);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPhase('playing');
    }
  };

  const restart = () => {
    stop();
    setPhase('intro');
    setCurrentIndex(0);
    setScore(0);
    setStars([]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 font-body">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <button onClick={() => { stop(); navigate(-1); }} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="font-display font-bold text-foreground text-base flex-1">¿Seguro o No Seguro?</h1>

        {/* TTS toggle */}
        <button
          onClick={toggle}
          className={`p-2 rounded-xl transition-colors ${isEnabled ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-muted-foreground'}`}
          title={isEnabled ? 'Silenciar voz' : 'Activar voz'}
        >
          {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>

        {(phase === 'playing' || phase === 'feedback') && (
          <div className="flex items-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i < currentIndex ? (stars.includes(i) ? 'bg-secondary scale-125' : 'bg-destructive/40') :
                  i === currentIndex ? 'bg-primary scale-110' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </header>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-2xl" style={{
              left: `${Math.random() * 100}%`, top: '-10%',
              animation: `confetti 1.5s ease-out ${Math.random() * 0.5}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}>
              {['⭐', '🌟', '✨', '💖', '🎉'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {/* INTRO */}
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-primary/30 overflow-hidden shadow-2xl bg-primary/10">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 h-9 w-9 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Volume2 className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-base font-display font-medium text-foreground">
                ¡Hola Emma! 👋 <strong>¡Vamos a jugar!</strong>
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                Te mostraré situaciones de internet y tú dices si son <span className="text-primary font-bold">seguras</span> o <span className="text-destructive font-bold">no seguras</span>. 🌟
              </p>
            </div>
            <Button
              onClick={() => setPhase('playing')}
              className="btn-kid bg-primary text-primary-foreground shadow-xl text-xl px-12 py-6 rounded-3xl"
            >
              🎮 ¡A jugar!
            </Button>
          </div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={currentIndex}>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pregunta {currentIndex + 1} de {total}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: score }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-secondary animate-scale-in" />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${(currentIndex / total) * 100}%` }}
              />
            </div>

            {/* Situation card */}
            <div className="w-full bg-card rounded-3xl border-2 border-primary/20 p-6 shadow-xl text-center space-y-3">
              <span className="text-6xl block">{current.emoji}</span>
              <p className="text-base font-display font-semibold leading-relaxed text-foreground">{current.text}</p>
              {/* Repeat button */}
              <button
                onClick={() => speak(`${current.text}. ¿Es seguro o no es seguro?`)}
                className="flex items-center gap-2 mx-auto text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Escuchar de nuevo
              </button>
            </div>

            {/* Answer buttons - big for kids */}
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center gap-4 w-full rounded-3xl border-2 border-primary/30 bg-primary/10 px-6 py-6 text-xl font-display font-bold text-primary hover:bg-primary/20 active:scale-95 transition-all shadow-lg"
              >
                <CheckCircle2 className="h-8 w-8" />
                <span>✅ Es seguro</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center gap-4 w-full rounded-3xl border-2 border-destructive/30 bg-destructive/10 px-6 py-6 text-xl font-display font-bold text-destructive hover:bg-destructive/20 active:scale-95 transition-all shadow-lg"
              >
                <XCircle className="h-8 w-8" />
                <span>❌ No es seguro</span>
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK */}
        {phase === 'feedback' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={`fb-${currentIndex}`}>
            {/* Result icon */}
            <div className={`h-20 w-20 rounded-full flex items-center justify-center shadow-xl border-4 ${
              isCorrect ? 'bg-primary/15 border-primary/40' : 'bg-secondary/10 border-secondary/30'
            } animate-scale-in`}>
              <span className="text-4xl">{isCorrect ? '🎉' : '💜'}</span>
            </div>

            {/* Emabot feedback */}
            <div className="flex items-start gap-3 w-full">
              <div className="h-12 w-12 rounded-full border-2 border-primary/30 overflow-hidden flex-shrink-0 shadow-md">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed text-foreground">
                  {isCorrect ? current.correctFeedback : current.wrongFeedback}
                </p>
                <button
                  onClick={() => speak(isCorrect ? current.correctFeedback : current.wrongFeedback)}
                  className="flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Repetir
                </button>
              </div>
            </div>

            {isCorrect && (
              <div className="flex items-center gap-2 animate-scale-in">
                <Star className="h-6 w-6 text-secondary fill-secondary" />
                <span className="text-sm font-bold text-secondary font-display">+10 puntos</span>
              </div>
            )}

            <Button
              onClick={handleNext}
              className="btn-kid bg-primary text-primary-foreground shadow-xl w-full text-lg py-6 rounded-3xl"
            >
              {currentIndex + 1 >= total ? '🏆 Ver resultados' : '➡️ Siguiente'}
            </Button>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full border-4 border-secondary/50 overflow-hidden shadow-2xl bg-secondary/10 animate-level-up">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {score === total ? '¡Perfecta, Emma! 🌟' : score >= total / 2 ? '¡Muy bien, Emma! 💜' : '¡Sigue practicando! 💖'}
            </h2>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg space-y-3 w-full max-w-xs">
              <div className="flex justify-center gap-1">
                {Array.from({ length: total }).map((_, i) => (
                  <Star key={i} className={`h-6 w-6 transition-all ${stars.includes(i) ? 'text-secondary fill-secondary' : 'text-muted'}`} />
                ))}
              </div>
              <p className="text-xl font-display font-bold text-foreground">{score} de {total} correctas</p>
              <p className="text-sm text-muted-foreground">+{score * 10} puntos ganados</p>
            </div>
            <div className="bg-card rounded-2xl border border-border/80 px-4 py-3 shadow-sm max-w-xs">
              <p className="text-sm text-foreground leading-relaxed">
                {score === total
                  ? '¡Eres una experta en seguridad digital! 🛡️ ¡Sigue así!'
                  : '¡Aprendiste cosas muy importantes hoy! Recuerda siempre hablar con un adulto de confianza. 💜'}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-primary text-primary-foreground shadow-xl text-lg py-5 rounded-3xl">
                🔄 Jugar de nuevo
              </Button>
              <Button onClick={() => { stop(); navigate('/dashboard'); }} variant="outline" className="btn-kid text-base rounded-3xl">
                🏠 Volver al inicio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeOrNotGame;
