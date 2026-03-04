import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface Choice {
  text: string;
  correct: boolean;
  feedback: string;
}

interface StoryStep {
  scenario: string;
  emoji: string;
  choices: Choice[];
}

const storySteps: StoryStep[] = [
  {
    scenario: "Recibes un mensaje de alguien que no conoces: '¡Hola! ¡Ganaste un celular gratis! Haz clic en este enlace para reclamarlo! 🎉'",
    emoji: '📩',
    choices: [
      { text: "Hago clic en el enlace — ¡un celular gratis!", correct: false, feedback: "¡Nunca hagas clic en enlaces de desconocidos! Esta es una estafa muy común para robar tu información." },
      { text: "Ignoro el mensaje y le cuento a un adulto de confianza", correct: true, feedback: "¡Excelente decisión! Ignorar mensajes sospechosos y contarle a un adulto es siempre lo más seguro." },
      { text: "Respondo pidiendo más detalles", correct: false, feedback: "Responderle a los estafadores les dice que tu cuenta está activa. Es mejor ignorar y reportar." },
    ],
  },
  {
    scenario: "Un amigo en un juego te pide que le compartas tu dirección de casa para 'enviarte un regalo'. ¿Qué haces?",
    emoji: '🎮',
    choices: [
      { text: "Le doy mi dirección — ¡parece buena persona!", correct: false, feedback: "Nunca compartas información personal como tu dirección en internet, ni siquiera con personas que parecen amigables. No puedes saber quiénes son realmente." },
      { text: "Le doy una dirección falsa", correct: false, feedback: "Aunque es creativo, es mejor simplemente decir que no. Dar cualquier dirección podría hacer que sigan pidiéndote información." },
      { text: "Le digo amablemente que no y nunca comparto información personal", correct: true, feedback: "¡Perfecto! Tu información personal debe quedarse privada. ¡Un verdadero amigo lo entendería!" },
    ],
  },
  {
    scenario: "Ves una ventana emergente que dice: '¡ALERTA! ¡Tu dispositivo tiene un virus! ¡Descarga esta app para arreglarlo YA!'",
    emoji: '⚠️',
    choices: [
      { text: "Descargo la app para arreglar el virus", correct: false, feedback: "¡Esas alertas de virus son falsas! Descargar apps desconocidas puede instalar virus reales en tu dispositivo." },
      { text: "Cierro la ventana y le cuento a un adulto de confianza", correct: true, feedback: "¡Excelente! Las alertas falsas de virus son un truco muy común. Siempre ciérralas y avisa a un adulto." },
      { text: "Cierro la ventana pero se la envío a mis amigos", correct: false, feedback: "Cerrarla está bien, pero compartirla podría hacer que tus amigos caigan en la trampa. Mejor avisa a un adulto." },
    ],
  },
];

const StoryMission = () => {
  const navigate = useNavigate();
  const { addPoints, completeMission, earnBadge } = useGame();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentStep = storySteps[step];

  const handleChoice = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (currentStep.choices[index].correct) {
      setScore(prev => prev + 1);
      addPoints(15);
    }
  };

  const handleNext = () => {
    if (step < storySteps.length - 1) {
      setStep(prev => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
      completeMission('story-1');
      earnBadge('story-master');
      if (score + (currentStep.choices[selected!]?.correct ? 1 : 0) === storySteps.length) {
        earnBadge('perfect-score');
        addPoints(20);
      }
    }
  };

  if (finished) {
    const totalCorrect = score;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-24">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="font-display text-3xl font-bold text-foreground">¡Misión completada!</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            ¡Acertaste <span className="font-bold text-primary">{totalCorrect}/{storySteps.length}</span>!
          </p>
          <div className="mt-4 rounded-2xl bg-success/10 p-4">
            <p className="font-display font-semibold text-success">+{totalCorrect * 15} puntos ganados</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            className="btn-bounce mt-6 w-full rounded-full bg-primary py-6 font-display text-lg text-primary-foreground hover:bg-primary/90"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-4">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-foreground">El mensaje sospechoso</span>
          <span className="ml-auto text-sm text-muted-foreground">{step + 1}/{storySteps.length}</span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-1 bg-primary transition-all duration-500" style={{ width: `${((step + 1) / storySteps.length) * 100}%` }} />
        </div>
      </header>

      <div className="container flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="card-playful mb-6 text-center">
            <div className="mb-3 text-5xl">{currentStep.emoji}</div>
            <p className="font-body text-lg leading-relaxed text-foreground">{currentStep.scenario}</p>
          </div>

          <div className="space-y-3">
            {currentStep.choices.map((choice, i) => {
              let style = 'border-border bg-card hover:border-primary/50 cursor-pointer';
              if (selected !== null) {
                if (i === selected && choice.correct) style = 'border-success bg-success/10';
                else if (i === selected && !choice.correct) style = 'border-destructive bg-destructive/10';
                else if (choice.correct) style = 'border-success/50 bg-success/5';
                else style = 'border-border bg-muted/50 opacity-60';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-body text-foreground">{choice.text}</span>
                    {selected !== null && i === selected && (
                      choice.correct ? <CheckCircle2 className="ml-auto h-5 w-5 flex-shrink-0 text-success" /> : <XCircle className="ml-auto h-5 w-5 flex-shrink-0 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-4 animate-slide-up">
              <div className={`rounded-2xl p-4 ${currentStep.choices[selected].correct ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                <p className="font-body text-sm text-foreground">{currentStep.choices[selected].feedback}</p>
              </div>
              <Button
                onClick={handleNext}
                className="btn-bounce mt-4 w-full rounded-full bg-primary py-5 font-display text-primary-foreground hover:bg-primary/90"
              >
                {step < storySteps.length - 1 ? 'Siguiente escenario →' : '¡Terminar misión! 🎉'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryMission;
