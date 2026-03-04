import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface MessageCard {
  sender: string;
  content: string;
  isPhishing: boolean;
  explanation: string;
}

const rounds: MessageCard[][] = [
  [
    { sender: '🏦 YourBank', content: 'URGENT: Your account will be closed! Click here to verify: bit.ly/x8k2m', isPhishing: true, explanation: 'Real banks never send urgent links via text. The shortened URL hides the real destination.' },
    { sender: '👩‍🏫 Ms. Johnson', content: "Don't forget to bring your science project to class tomorrow!", isPhishing: false, explanation: 'This is a normal reminder from a teacher about a school assignment.' },
    { sender: '🏫 School Office', content: 'Picture day is next Friday. Please bring your permission form signed.', isPhishing: false, explanation: 'This is a regular school announcement with no suspicious links or requests.' },
  ],
  [
    { sender: '👤 Unknown', content: "Hey! I'm your dad's friend. What's your address? I have a surprise for you 🎁", isPhishing: true, explanation: "A real family friend would contact your parents directly. Never share personal info with strangers." },
    { sender: '📚 Library', content: 'Your reserved book "Harry Potter" is ready for pickup at the front desk.', isPhishing: false, explanation: 'A normal library notification about a book reservation.' },
    { sender: '👨‍👩‍👧 Mom', content: 'I will pick you up at 3:30 today. Wait by the front entrance.', isPhishing: false, explanation: 'A normal message from a parent about pickup.' },
  ],
  [
    { sender: '🎮 GameMaster2000', content: 'You just won 10,000 V-Bucks! Enter your password at free-vbucks.xyz to claim!', isPhishing: true, explanation: 'Free in-game currency scams are very common. Legit games never ask for passwords via messages.' },
    { sender: '⚽ Coach Mike', content: 'Practice moved to 5 PM tomorrow due to weather. See you there!', isPhishing: false, explanation: 'A simple schedule update from a coach.' },
    { sender: '🏥 Dr. Smith Office', content: 'Reminder: Your checkup appointment is on Tuesday at 2 PM.', isPhishing: false, explanation: 'A standard medical appointment reminder.' },
  ],
];

const PhishingGame = () => {
  const navigate = useNavigate();
  const { addPoints, completeMission, earnBadge } = useGame();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentRound = rounds[round];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (currentRound[index].isPhishing) {
      setScore(prev => prev + 1);
      addPoints(20);
    }
  };

  const handleNext = () => {
    if (round < rounds.length - 1) {
      setRound(prev => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
      completeMission('game-phishing');
      earnBadge('phishing-pro');
      if (score + (currentRound[selected!]?.isPhishing ? 1 : 0) === rounds.length) {
        earnBadge('perfect-score');
        addPoints(20);
      }
    }
  };

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="mb-4 text-6xl">🏆</div>
          <h1 className="font-display text-3xl font-bold text-foreground">Game Complete!</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            You spotted <span className="font-bold text-primary">{score}/{rounds.length}</span> phishing messages!
          </p>
          <div className="mt-4 rounded-2xl bg-success/10 p-4">
            <p className="font-display font-semibold text-success">+{score * 20} points earned!</p>
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
          <span className="font-display font-bold text-foreground">Spot the Fake!</span>
          <span className="ml-auto text-sm text-muted-foreground">Round {round + 1}/{rounds.length}</span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-1 bg-secondary transition-all duration-500" style={{ width: `${((round + 1) / rounds.length) * 100}%` }} />
        </div>
      </header>

      <div className="container flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">🔍 Which message is fake?</h2>
            <p className="mt-1 text-muted-foreground">Tap the phishing message!</p>
          </div>

          <div className="space-y-3">
            {currentRound.map((msg, i) => {
              let style = 'border-border bg-card hover:border-primary/50 cursor-pointer';
              if (selected !== null) {
                if (msg.isPhishing) style = 'border-destructive bg-destructive/10';
                else if (i === selected) style = 'border-warning bg-warning/10';
                else style = 'border-success/50 bg-success/5';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-display text-sm font-semibold text-muted-foreground">{msg.sender}</p>
                      <p className="mt-1 font-body text-foreground">{msg.content}</p>
                    </div>
                    {selected !== null && (
                      msg.isPhishing
                        ? <XCircle className="h-6 w-6 flex-shrink-0 text-destructive" />
                        : <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-success" />
                    )}
                  </div>
                  {selected !== null && (
                    <p className="mt-2 rounded-xl bg-muted/50 p-2 text-xs text-muted-foreground">{msg.explanation}</p>
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-4 animate-slide-up">
              <div className={`mb-4 rounded-2xl p-4 text-center ${
                currentRound[selected].isPhishing ? 'bg-success/10 border border-success/30' : 'bg-warning/10 border border-warning/30'
              }`}>
                <p className="font-display font-semibold">
                  {currentRound[selected].isPhishing ? '✅ Correct! You spotted the fake!' : '❌ Oops! That was a real message.'}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="btn-bounce w-full rounded-full bg-secondary py-5 font-display text-secondary-foreground hover:bg-secondary/90"
              >
                {round < rounds.length - 1 ? 'Next Round →' : 'Finish Game 🏆'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingGame;
