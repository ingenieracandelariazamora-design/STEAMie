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
    scenario: "You receive a message from someone you don't know: 'Hey! You won a free iPhone! Click this link to claim it now! 🎉'",
    emoji: '📩',
    choices: [
      { text: "Click the link right away — free iPhone!", correct: false, feedback: "Never click links from strangers! This is a common phishing scam designed to steal your information." },
      { text: "Ignore the message and tell a trusted adult", correct: true, feedback: "Great choice! Ignoring suspicious messages and telling an adult is always the safest option." },
      { text: "Reply asking for more details", correct: false, feedback: "Replying to scammers lets them know your account is active. It's better to ignore and report." },
    ],
  },
  {
    scenario: "A friend on a game asks you to share your home address so they can 'send you a gift'. What do you do?",
    emoji: '🎮',
    choices: [
      { text: "Share your address — they seem nice!", correct: false, feedback: "Never share personal information like your address online, even with people who seem friendly. You can't verify who they really are." },
      { text: "Share a fake address instead", correct: false, feedback: "While creative, it's better to simply refuse. Sharing any address could encourage them to keep asking for information." },
      { text: "Politely decline and never share personal info", correct: true, feedback: "Perfect! Your personal information should stay private. A real friend would understand!" },
    ],
  },
  {
    scenario: "You see a pop-up saying: 'WARNING! Your device has a virus! Download this app to fix it NOW!'",
    emoji: '⚠️',
    choices: [
      { text: "Download the app to fix the virus", correct: false, feedback: "These scary pop-ups are fake! Downloading unknown apps can actually install real viruses on your device." },
      { text: "Close the pop-up and tell a trusted adult", correct: true, feedback: "Excellent! Fake virus warnings are a common trick. Always close them and let an adult know." },
      { text: "Click 'X' but also share it with friends", correct: false, feedback: "Closing is right, but sharing it could cause your friends to fall for the scam. Tell an adult instead." },
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="font-display text-3xl font-bold text-foreground">Mission Complete!</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            You got <span className="font-bold text-primary">{totalCorrect}/{storySteps.length}</span> correct!
          </p>
          <div className="mt-4 rounded-2xl bg-success/10 p-4">
            <p className="font-display font-semibold text-success">+{totalCorrect * 15} points earned!</p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            className="btn-bounce mt-6 w-full rounded-full bg-primary py-6 font-display text-lg text-primary-foreground hover:bg-primary/90"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-4">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-foreground">The Suspicious Message</span>
          <span className="ml-auto text-sm text-muted-foreground">{step + 1}/{storySteps.length}</span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-1 bg-primary transition-all duration-500" style={{ width: `${((step + 1) / storySteps.length) * 100}%` }} />
        </div>
      </header>

      <div className="container flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg animate-slide-up">
          {/* Scenario */}
          <div className="card-playful mb-6 text-center">
            <div className="mb-3 text-5xl">{currentStep.emoji}</div>
            <p className="font-body text-lg leading-relaxed text-foreground">{currentStep.scenario}</p>
          </div>

          {/* Choices */}
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

          {/* Feedback */}
          {selected !== null && (
            <div className="mt-4 animate-slide-up">
              <div className={`rounded-2xl p-4 ${currentStep.choices[selected].correct ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                <p className="font-body text-sm text-foreground">{currentStep.choices[selected].feedback}</p>
              </div>
              <Button
                onClick={handleNext}
                className="btn-bounce mt-4 w-full rounded-full bg-primary py-5 font-display text-primary-foreground hover:bg-primary/90"
              >
                {step < storySteps.length - 1 ? 'Next Scenario →' : 'Finish Mission 🎉'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryMission;
