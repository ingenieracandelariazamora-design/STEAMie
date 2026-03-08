import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Sparkles, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
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
    correctFeedback: '¡Muy bien, Emma! 🌟 Nunca compartimos nuestra dirección con desconocidos en internet.',
    wrongFeedback: '¡Cuidado! 💜 Nuestra dirección es información privada. No debemos compartirla con desconocidos.',
    emoji: '🏠',
  },
  {
    id: 2,
    text: 'Antes de descargar un juego nuevo, le preguntas a mamá o papá.',
    isSafe: true,
    correctFeedback: '¡Correcto! 🎉 Siempre es bueno preguntar a un adulto de confianza antes de descargar algo.',
    wrongFeedback: 'Recuerda: preguntar a mamá o papá antes de descargar algo es lo más seguro. 💖',
    emoji: '📱',
  },
  {
    id: 3,
    text: 'Una amiga de la escuela te envía un mensaje para decir hola.',
    isSafe: true,
    correctFeedback: '¡Bien hecho! 💬 Hablar con personas que conoces es más seguro.',
    wrongFeedback: 'Si es una amiga que conoces de la escuela, ¡está bien contestar! 😊',
    emoji: '👋',
  },
  {
    id: 4,
    text: 'Alguien que no conoces te pide una foto tuya.',
    isSafe: false,
    correctFeedback: '¡Excelente! 🛡️ Nunca enviamos fotos a personas que no conocemos.',
    wrongFeedback: 'Cuidado: nunca debemos enviar fotos a desconocidos. Cuéntale a un adulto. 💜',
    emoji: '📸',
  },
  {
    id: 5,
    text: 'Usas una contraseña que solo tú y tus papás conocen.',
    isSafe: true,
    correctFeedback: '¡Perfecto! 🔐 Las contraseñas son secretos que solo compartimos con nuestros papás.',
    wrongFeedback: 'Las contraseñas seguras son las que solo tú y tus papás conocen. ¡Eso es bueno! 🌟',
    emoji: '🔑',
  },
  {
    id: 6,
    text: 'Un mensaje dice que ganaste un premio y te pide hacer clic en un enlace.',
    isSafe: false,
    correctFeedback: '¡Muy lista! 🧠 Esos mensajes son trampas. Nunca hagas clic en enlaces extraños.',
    wrongFeedback: '¡Cuidado! Esos premios falsos son trampas. Siempre dile a un adulto. 🛡️',
    emoji: '🎁',
  },
];

const SafeOrNotGame = () => {
  const navigate = useNavigate();
  const { addPoints } = useGame();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'feedback' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = SITUATIONS[currentIndex];
  const total = SITUATIONS.length;

  const handleAnswer = (answeredSafe: boolean) => {
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
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      addPoints(score * 10);
      setPhase('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPhase('playing');
    }
  };

  const restart = () => {
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
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="font-display font-bold text-foreground text-base">¿Seguro o No Seguro?</h1>
        {phase === 'playing' || phase === 'feedback' ? (
          <div className="ml-auto flex items-center gap-1.5">
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
        ) : null}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {/* INTRO */}
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full border-4 border-primary/30 overflow-hidden shadow-xl bg-primary/10">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center shadow-md animate-bounce">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>

            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-sm leading-relaxed text-foreground">
                ¡Hola Emma! 👋 <strong>¡Vamos a jugar!</strong>
              </p>
              <p className="text-sm leading-relaxed text-foreground mt-2">
                Te mostraré situaciones que pueden pasar en internet y tú debes decir si es <span className="text-success font-bold">seguro</span> o <span className="text-destructive font-bold">no seguro</span>. 🌟
              </p>
            </div>

            <Button
              onClick={() => setPhase('playing')}
              className="btn-kid bg-primary text-primary-foreground shadow-xl hover:shadow-2xl text-lg px-10"
            >
              🎮 ¡A jugar!
            </Button>
          </div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={currentIndex}>
            {/* Score bar */}
            <div className="flex items-center gap-2 self-end">
              {Array.from({ length: score }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-secondary fill-secondary animate-scale-in" />
              ))}
            </div>

            {/* Emabot mini */}
            <div className="flex items-start gap-3 w-full">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 overflow-hidden flex-shrink-0 shadow-md">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-2.5 shadow-sm">
                <p className="text-xs text-muted-foreground">Pregunta {currentIndex + 1} de {total}</p>
              </div>
            </div>

            {/* Situation card */}
            <div className="w-full bg-card rounded-3xl border-2 border-primary/20 p-6 shadow-xl text-center space-y-3">
              <span className="text-5xl block">{current.emoji}</span>
              <p className="text-base font-medium leading-relaxed text-foreground font-display">
                {current.text}
              </p>
            </div>

            {/* Answer buttons */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center justify-center gap-3 w-full rounded-2xl border-3 border-success/30 bg-success/10 px-6 py-5 text-lg font-display font-bold text-success hover:bg-success/20 hover:border-success/50 hover:shadow-lg transition-all active:scale-95 shadow-md"
              >
                <CheckCircle2 className="h-7 w-7" />
                ✅ Es seguro
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center justify-center gap-3 w-full rounded-2xl border-3 border-destructive/30 bg-destructive/10 px-6 py-5 text-lg font-display font-bold text-destructive hover:bg-destructive/20 hover:border-destructive/50 hover:shadow-lg transition-all active:scale-95 shadow-md"
              >
                <XCircle className="h-7 w-7" />
                ❌ No es seguro
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK */}
        {phase === 'feedback' && current && (
          <div className="flex flex-col items-center gap-5 w-full animate-fade-in" key={`fb-${currentIndex}`}>
            {/* Confetti */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10%',
                      animation: `confetti 1.5s ease-out ${Math.random() * 0.5}s forwards`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  >
                    {['⭐', '🌟', '✨', '💖', '🎉'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}

            {/* Result icon */}
            <div className={`h-20 w-20 rounded-full flex items-center justify-center shadow-xl ${
              isCorrect ? 'bg-success/20 border-4 border-success/40' : 'bg-destructive/10 border-4 border-destructive/30'
            } animate-scale-in`}>
              {isCorrect ? (
                <span className="text-4xl">🎉</span>
              ) : (
                <span className="text-4xl">💜</span>
              )}
            </div>

            {/* Emabot feedback */}
            <div className="flex items-start gap-3 w-full">
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 overflow-hidden flex-shrink-0 shadow-md">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed text-foreground">
                  {isCorrect ? current.correctFeedback : current.wrongFeedback}
                </p>
              </div>
            </div>

            {/* Stars earned */}
            {isCorrect && (
              <div className="flex items-center gap-2 animate-scale-in">
                <Star className="h-6 w-6 text-secondary fill-secondary" />
                <span className="text-sm font-bold text-secondary font-display">+10 puntos</span>
              </div>
            )}

            <Button
              onClick={handleNext}
              className="btn-kid bg-primary text-primary-foreground shadow-xl w-full max-w-xs text-base"
            >
              {currentIndex + 1 >= total ? '🏆 Ver resultados' : '➡️ Siguiente'}
            </Button>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-secondary/50 overflow-hidden shadow-xl bg-secondary/10 animate-level-up">
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
                  <Star
                    key={i}
                    className={`h-7 w-7 transition-all ${
                      stars.includes(i) ? 'text-secondary fill-secondary' : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-display font-bold text-foreground">
                {score} de {total} correctas
              </p>
              <p className="text-sm text-muted-foreground">
                +{score * 10} puntos ganados
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border/80 px-4 py-3 shadow-sm max-w-xs">
              <p className="text-sm text-foreground leading-relaxed">
                {score === total
                  ? '¡Eres una experta en seguridad digital! 🛡️ ¡Sigue así!'
                  : '¡Aprendiste cosas muy importantes hoy! Recuerda siempre hablar con un adulto de confianza. 💜'}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-primary text-primary-foreground shadow-xl text-base">
                🔄 Jugar de nuevo
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="btn-kid text-base">
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
