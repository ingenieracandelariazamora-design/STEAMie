import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Search, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useTTS } from '@/hooks/useTTS';
import emabotMascot from '@/assets/emabot-mascot.png';

interface Clue {
  id: number;
  scenario: string;
  emoji: string;
  clues: { text: string; isSuspicious: boolean }[];
  explanation: string;
}

const SCENARIOS: Clue[] = [
  {
    id: 1,
    scenario: 'Recibes un correo que dice: ¡Ganaste un iPhone! Haz clic aquí para reclamarlo.',
    emoji: '📧',
    clues: [
      { text: 'El correo viene de "premios123@gratis.xyz"', isSuspicious: true },
      { text: 'Te pide hacer clic en un enlace', isSuspicious: true },
      { text: 'Dice que ganaste sin participar en nada', isSuspicious: true },
      { text: 'Tiene colores brillantes', isSuspicious: false },
    ],
    explanation: '¡Muy bien detective! Este correo es una trampa. Nadie regala premios sin que participemos. ¡Nunca hagas clic en enlaces sospechosos!',
  },
  {
    id: 2,
    scenario: 'Una página web te pide tu nombre, edad y dirección para un concurso escolar.',
    emoji: '🌐',
    clues: [
      { text: 'Te pide tu dirección de casa', isSuspicious: true },
      { text: 'No tiene el candadito en la barra', isSuspicious: true },
      { text: 'Tu maestra no te habló de este concurso', isSuspicious: true },
      { text: 'El sitio tiene colores bonitos', isSuspicious: false },
    ],
    explanation: '¡Excelente investigación! Los sitios que piden tu información personal sin que tus papás lo sepan son peligrosos. ¡Siempre pregunta a un adulto!',
  },
  {
    id: 3,
    scenario: 'Alguien en un juego en línea te dice: Dame tu contraseña y te regalo monedas.',
    emoji: '🎮',
    clues: [
      { text: 'Te pide tu contraseña', isSuspicious: true },
      { text: 'Promete regalos a cambio', isSuspicious: true },
      { text: 'Es alguien que no conoces en persona', isSuspicious: true },
      { text: 'Juegan el mismo juego que tú', isSuspicious: false },
    ],
    explanation: '¡Gran trabajo! Nunca compartas tu contraseña con nadie, ni siquiera por regalos en un juego. ¡Tu contraseña es solo tuya y de tus papás!',
  },
];

const DetectiveGame = () => {
  const navigate = useNavigate();
  const { addPoints } = useGame();
  const { speak, stop, toggle, isEnabled } = useTTS({ rate: 0.8, pitch: 1.15 });

  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foundClues, setFoundClues] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalFound, setTotalFound] = useState(0);

  const current = SCENARIOS[currentIndex];
  const suspiciousCount = current?.clues.filter(c => c.isSuspicious).length || 0;

  // Auto-speak on phase changes
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        speak('¡Hola Detective Emma! Hoy vamos a buscar pistas sospechosas en internet. Toca las pistas que te parezcan peligrosas. ¡Vamos a investigar!');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && current) {
      const timer = setTimeout(() => {
        speak(`Caso ${currentIndex + 1}. ${current.scenario}. ¡Toca las pistas sospechosas!`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex]);

  const handleClueClick = (index: number) => {
    if (foundClues.includes(index) || showExplanation) return;
    const clue = current.clues[index];

    // Speak the clue text
    speak(clue.text);

    setFoundClues(prev => [...prev, index]);
    if (clue.isSuspicious) {
      setScore(prev => prev + 1);
      setTotalFound(prev => prev + 1);
    }
    const newFound = [...foundClues, index];
    const allSuspiciousFound = current.clues.every((c, i) => !c.isSuspicious || newFound.includes(i));
    if (allSuspiciousFound) {
      setTimeout(() => {
        setShowExplanation(true);
        setTimeout(() => speak(current.explanation), 300);
      }, 500);
    }
  };

  const handleNext = () => {
    stop();
    if (currentIndex + 1 >= SCENARIOS.length) {
      addPoints(totalFound * 10);
      setPhase('results');
      const totalSuspicious = SCENARIOS.reduce((sum, s) => sum + s.clues.filter(c => c.isSuspicious).length, 0);
      const msg = totalFound === totalSuspicious
        ? '¡Eres una detective perfecta Emma! Encontraste todas las pistas. ¡Excelente trabajo!'
        : `¡Gran investigación Emma! Encontraste ${totalFound} de ${totalSuspicious} pistas sospechosas.`;
      setTimeout(() => speak(msg), 400);
    } else {
      setCurrentIndex(prev => prev + 1);
      setFoundClues([]);
      setShowExplanation(false);
    }
  };

  const restart = () => {
    stop();
    setPhase('intro');
    setCurrentIndex(0);
    setFoundClues([]);
    setShowExplanation(false);
    setScore(0);
    setTotalFound(0);
  };

  const totalSuspicious = SCENARIOS.reduce((sum, s) => sum + s.clues.filter(c => c.isSuspicious).length, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-accent/5 via-background to-primary/5 font-body">
      <header className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <button onClick={() => { stop(); navigate('/mini-games'); }} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Search className="h-5 w-5 text-accent" />
        <h1 className="font-display font-bold text-foreground text-base flex-1">Detective de Internet</h1>
        <button
          onClick={toggle}
          className={`p-2 rounded-xl transition-colors ${isEnabled ? 'bg-accent/10 text-accent' : 'hover:bg-muted/50 text-muted-foreground'}`}
        >
          {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="relative h-32 w-32">
              <div className="h-32 w-32 rounded-full border-4 border-accent/30 overflow-hidden shadow-2xl bg-accent/10">
                <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 h-8 w-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Volume2 className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-base font-display font-medium text-foreground">
                ¡Hola, Detective Emma! 🕵️
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                Hoy vamos a buscar <strong>pistas sospechosas</strong> en internet. Toca las pistas que te parezcan peligrosas. ¡Vamos a investigar! 🔍
              </p>
            </div>
            <Button onClick={() => setPhase('playing')} className="btn-kid bg-accent text-accent-foreground shadow-xl text-xl px-12 py-6 rounded-3xl">
              🔍 ¡A investigar!
            </Button>
          </div>
        )}

        {phase === 'playing' && current && (
          <div className="flex flex-col gap-5 w-full animate-fade-in" key={currentIndex}>
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-medium text-muted-foreground">Caso {currentIndex + 1} de {SCENARIOS.length}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: score }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-secondary animate-scale-in" />
                ))}
              </div>
            </div>

            {/* Scenario card */}
            <div className="bg-card rounded-3xl border-2 border-accent/20 p-5 shadow-xl text-center space-y-3">
              <span className="text-5xl block">{current.emoji}</span>
              <p className="text-sm font-display font-semibold leading-relaxed text-foreground">{current.scenario}</p>
              <button
                onClick={() => speak(`${current.scenario}. Toca las pistas sospechosas.`)}
                className="flex items-center gap-2 mx-auto text-xs text-muted-foreground hover:text-accent transition-colors bg-muted/50 hover:bg-accent/10 px-3 py-1.5 rounded-full"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Escuchar de nuevo
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center font-medium">
              🔎 Toca las pistas sospechosas ({foundClues.filter(i => current.clues[i]?.isSuspicious).length}/{suspiciousCount})
            </p>

            <div className="grid gap-3">
              {current.clues.map((clue, i) => {
                const isFound = foundClues.includes(i);
                const isGood = isFound && !clue.isSuspicious;
                const isBad = isFound && clue.isSuspicious;
                return (
                  <button
                    key={i}
                    onClick={() => handleClueClick(i)}
                    disabled={isFound || showExplanation}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-sm font-medium transition-all active:scale-[0.97] shadow-md text-base ${
                      isBad ? 'border-destructive/40 bg-destructive/10 text-destructive' :
                      isGood ? 'border-primary/40 bg-primary/10 text-primary' :
                      'border-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/5'
                    }`}
                  >
                    <span className="text-2xl">{isBad ? '🚨' : isGood ? '✅' : '🔎'}</span>
                    <span className="flex-1">{clue.text}</span>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full border-2 border-accent/30 overflow-hidden flex-shrink-0 shadow-md">
                    <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                    <p className="text-sm leading-relaxed text-foreground">{current.explanation}</p>
                    <button
                      onClick={() => speak(current.explanation)}
                      className="flex items-center gap-1 mt-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Repetir
                    </button>
                  </div>
                </div>
                <Button onClick={handleNext} className="btn-kid bg-accent text-accent-foreground shadow-xl w-full text-lg py-5 rounded-3xl">
                  {currentIndex + 1 >= SCENARIOS.length ? '🏆 Ver resultados' : '➡️ Siguiente caso'}
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
              {totalFound === totalSuspicious ? '¡Detective perfecta! 🌟' : '¡Gran investigación! 🕵️'}
            </h2>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg space-y-3 w-full max-w-xs">
              <p className="text-lg font-display font-bold text-foreground">{totalFound} de {totalSuspicious} pistas encontradas</p>
              <p className="text-sm text-muted-foreground">+{totalFound * 10} puntos ganados</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-accent text-accent-foreground shadow-xl text-lg py-5 rounded-3xl">🔄 Jugar de nuevo</Button>
              <Button onClick={() => { stop(); navigate('/mini-games'); }} variant="outline" className="btn-kid text-base rounded-3xl">🎮 Más juegos</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectiveGame;
