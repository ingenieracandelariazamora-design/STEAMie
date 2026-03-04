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
    { sender: '🏦 TuBanco', content: '¡URGENTE! ¡Tu cuenta será cerrada! Haz clic aquí para verificar: bit.ly/x8k2m', isPhishing: true, explanation: 'Los bancos reales nunca envían enlaces urgentes por mensaje. La URL acortada oculta el destino real.' },
    { sender: '👩‍🏫 Sra. García', content: '¡No olvides traer tu proyecto de ciencias a clase mañana!', isPhishing: false, explanation: 'Este es un recordatorio normal de una profesora sobre una tarea escolar.' },
    { sender: '🏫 Secretaría', content: 'El día de fotos es el próximo viernes. Por favor trae tu autorización firmada.', isPhishing: false, explanation: 'Este es un aviso normal de la escuela sin enlaces sospechosos.' },
  ],
  [
    { sender: '👤 Desconocido', content: "¡Hola! Soy amigo de tu papá. ¿Cuál es tu dirección? Tengo una sorpresa para ti 🎁", isPhishing: true, explanation: "Un verdadero amigo de la familia contactaría a tus padres directamente. Nunca compartas información personal con extraños." },
    { sender: '📚 Biblioteca', content: 'Tu libro reservado "Harry Potter" está listo para recoger en el mostrador.', isPhishing: false, explanation: 'Una notificación normal de la biblioteca sobre una reserva.' },
    { sender: '👨‍👩‍👧 Mamá', content: 'Te recojo a las 3:30 hoy. Espérame en la entrada principal.', isPhishing: false, explanation: 'Un mensaje normal de tu mamá sobre la hora de recogida.' },
  ],
  [
    { sender: '🎮 GameMaster2000', content: '¡Acabas de ganar 10,000 monedas! Ingresa tu contraseña en monedas-gratis.xyz para reclamarlas!', isPhishing: true, explanation: 'Las estafas de monedas gratis son muy comunes. Los juegos legítimos nunca piden contraseñas por mensaje.' },
    { sender: '⚽ Entrenador Miguel', content: 'La práctica se movió a las 5 PM mañana por el clima. ¡Los espero!', isPhishing: false, explanation: 'Un cambio de horario normal de un entrenador.' },
    { sender: '🏥 Consultorio Dr. López', content: 'Recordatorio: Tu cita de revisión es el martes a las 2 PM.', isPhishing: false, explanation: 'Un recordatorio estándar de cita médica.' },
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-24">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="mb-4 text-6xl">🏆</div>
          <h1 className="font-display text-3xl font-bold text-foreground">¡Juego completado!</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            ¡Detectaste <span className="font-bold text-primary">{score}/{rounds.length}</span> mensajes falsos!
          </p>
          <div className="mt-4 rounded-2xl bg-success/10 p-4">
            <p className="font-display font-semibold text-success">+{score * 20} puntos ganados</p>
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
          <span className="font-display font-bold text-foreground">¡Detecta el falso!</span>
          <span className="ml-auto text-sm text-muted-foreground">Ronda {round + 1}/{rounds.length}</span>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-1 bg-secondary transition-all duration-500" style={{ width: `${((round + 1) / rounds.length) * 100}%` }} />
        </div>
      </header>

      <div className="container flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">🔍 ¿Cuál mensaje es falso?</h2>
            <p className="mt-1 text-muted-foreground">¡Toca el mensaje de phishing!</p>
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
                  {currentRound[selected].isPhishing ? '✅ ¡Correcto! ¡Detectaste el falso!' : '❌ ¡Ups! Ese era un mensaje real.'}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="btn-bounce w-full rounded-full bg-secondary py-5 font-display text-secondary-foreground hover:bg-secondary/90"
              >
                {round < rounds.length - 1 ? 'Siguiente ronda →' : '¡Terminar juego! 🏆'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingGame;
