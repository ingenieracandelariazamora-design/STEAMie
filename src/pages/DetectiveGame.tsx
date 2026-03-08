import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Search, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
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
    scenario: 'Recibes un correo que dice: "¡Ganaste un iPhone! Haz clic aquí para reclamarlo."',
    emoji: '📧',
    clues: [
      { text: 'El correo viene de "premios123@gratis.xyz"', isSuspicious: true },
      { text: 'Te pide hacer clic en un enlace', isSuspicious: true },
      { text: 'Dice que ganaste sin participar en nada', isSuspicious: true },
      { text: 'Tiene errores de ortografía', isSuspicious: false },
    ],
    explanation: '¡Muy bien, detective! 🕵️ Este correo es una trampa. Nadie regala premios sin que participemos. ¡Nunca hagas clic en enlaces sospechosos!',
  },
  {
    id: 2,
    scenario: 'Una página web te pide tu nombre, edad y dirección para un "concurso escolar".',
    emoji: '🌐',
    clues: [
      { text: 'Te pide tu dirección de casa', isSuspicious: true },
      { text: 'No tiene el candadito 🔒 en la barra', isSuspicious: true },
      { text: 'Tu maestra no te habló de este concurso', isSuspicious: true },
      { text: 'El sitio tiene colores bonitos', isSuspicious: false },
    ],
    explanation: '¡Excelente investigación! 🌟 Los sitios que piden tu información personal sin que tus papás lo sepan son peligrosos. ¡Siempre pregunta a un adulto!',
  },
  {
    id: 3,
    scenario: 'Alguien en un juego en línea te dice: "Dame tu contraseña y te regalo monedas."',
    emoji: '🎮',
    clues: [
      { text: 'Te pide tu contraseña', isSuspicious: true },
      { text: 'Promete regalos a cambio', isSuspicious: true },
      { text: 'Es alguien que no conoces en persona', isSuspicious: true },
      { text: 'Juegan el mismo juego que tú', isSuspicious: false },
    ],
    explanation: '¡Gran trabajo! 🛡️ Nunca compartas tu contraseña con nadie, ni siquiera por regalos en un juego. ¡Tu contraseña es solo tuya y de tus papás!',
  },
];

const DetectiveGame = () => {
  const navigate = useNavigate();
  const { addPoints } = useGame();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foundClues, setFoundClues] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalFound, setTotalFound] = useState(0);

  const current = SCENARIOS[currentIndex];
  const suspiciousCount = current?.clues.filter(c => c.isSuspicious).length || 0;

  const handleClueClick = (index: number) => {
    if (foundClues.includes(index) || showExplanation) return;
    setFoundClues(prev => [...prev, index]);
    if (current.clues[index].isSuspicious) {
      setScore(prev => prev + 1);
      setTotalFound(prev => prev + 1);
    }
    const newFound = [...foundClues, index];
    const allSuspiciousFound = current.clues.every((c, i) => !c.isSuspicious || newFound.includes(i));
    if (allSuspiciousFound) {
      setTimeout(() => setShowExplanation(true), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= SCENARIOS.length) {
      addPoints(totalFound * 10);
      setPhase('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setFoundClues([]);
      setShowExplanation(false);
    }
  };

  const restart = () => {
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
        <button onClick={() => navigate('/mini-games')} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Search className="h-5 w-5 text-accent" />
        <h1 className="font-display font-bold text-foreground text-base">Detective de Internet</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto w-full">
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="h-28 w-28 rounded-full border-4 border-accent/30 overflow-hidden shadow-xl bg-accent/10">
              <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
            </div>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg max-w-xs">
              <p className="text-sm leading-relaxed text-foreground">
                ¡Hola, Detective Emma! 🕵️ Hoy vamos a buscar <strong>pistas sospechosas</strong> en internet.
              </p>
              <p className="text-sm leading-relaxed text-foreground mt-2">
                Toca las pistas que te parezcan peligrosas. ¡Vamos a investigar! 🔍
              </p>
            </div>
            <Button onClick={() => setPhase('playing')} className="btn-kid bg-accent text-accent-foreground shadow-xl text-lg px-10">
              🔍 ¡A investigar!
            </Button>
          </div>
        )}

        {phase === 'playing' && current && (
          <div className="flex flex-col gap-5 w-full animate-fade-in" key={currentIndex}>
            <div className="flex items-center gap-2 self-end">
              {Array.from({ length: score }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-secondary fill-secondary animate-scale-in" />
              ))}
            </div>

            {/* Scenario card */}
            <div className="bg-card rounded-3xl border-2 border-accent/20 p-5 shadow-xl text-center space-y-3">
              <span className="text-5xl block">{current.emoji}</span>
              <p className="text-sm text-muted-foreground">Caso {currentIndex + 1} de {SCENARIOS.length}</p>
              <p className="text-base font-display font-medium leading-relaxed text-foreground">{current.scenario}</p>
            </div>

            {/* Clues */}
            <p className="text-xs text-muted-foreground text-center font-medium">
              Toca las pistas sospechosas ({foundClues.filter(i => current.clues[i]?.isSuspicious).length}/{suspiciousCount})
            </p>
            <div className="grid gap-2.5">
              {current.clues.map((clue, i) => {
                const isFound = foundClues.includes(i);
                const isGood = isFound && !clue.isSuspicious;
                const isBad = isFound && clue.isSuspicious;
                return (
                  <button
                    key={i}
                    onClick={() => handleClueClick(i)}
                    disabled={isFound || showExplanation}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all active:scale-[0.97] shadow-sm ${
                      isBad ? 'border-destructive/40 bg-destructive/10 text-destructive' :
                      isGood ? 'border-success/40 bg-success/10 text-success' :
                      'border-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/5'
                    }`}
                  >
                    <span className="text-lg">{isBad ? '🚨' : isGood ? '✅' : '🔎'}</span>
                    <span className="flex-1">{clue.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full border-2 border-accent/30 overflow-hidden flex-shrink-0 shadow-md">
                    <img src={emabotMascot} alt="Emabot" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 bg-card rounded-2xl rounded-bl-md border border-border/80 px-4 py-3 shadow-lg">
                    <p className="text-sm leading-relaxed text-foreground">{current.explanation}</p>
                  </div>
                </div>
                <Button onClick={handleNext} className="btn-kid bg-accent text-accent-foreground shadow-xl w-full text-base">
                  {currentIndex + 1 >= SCENARIOS.length ? '🏆 Ver resultados' : '➡️ Siguiente caso'}
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
              {totalFound === totalSuspicious ? '¡Detective perfecta! 🌟' : '¡Gran investigación! 🕵️'}
            </h2>
            <div className="bg-card rounded-3xl border-2 border-border/60 p-5 shadow-lg space-y-3 w-full max-w-xs">
              <p className="text-lg font-display font-bold text-foreground">{totalFound} de {totalSuspicious} pistas encontradas</p>
              <p className="text-sm text-muted-foreground">+{totalFound * 10} puntos ganados</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={restart} className="btn-kid bg-accent text-accent-foreground shadow-xl text-base">🔄 Jugar de nuevo</Button>
              <Button onClick={() => navigate('/mini-games')} variant="outline" className="btn-kid text-base">🎮 Más juegos</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectiveGame;
