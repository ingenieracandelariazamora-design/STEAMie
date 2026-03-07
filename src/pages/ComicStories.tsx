import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';

interface ComicPanel {
  emoji: string;
  scene: string;
  dialog: string;
  character: string;
}

interface ComicStory {
  id: string;
  title: string;
  coverEmoji: string;
  description: string;
  ageGroups: string[];
  panels: ComicPanel[];
  lesson: string;
}

const STORIES: ComicStory[] = [
  {
    id: 'password-secret',
    title: 'El secreto de la contraseña',
    coverEmoji: '🔐',
    description: 'Sofía aprende por qué las contraseñas son un tesoro secreto.',
    ageGroups: ['5-7', '8-12'],
    panels: [
      { emoji: '👧', scene: '🏠 En casa', dialog: 'Sofía está jugando en su tablet cuando su amiga Luna le escribe...', character: 'Narrador' },
      { emoji: '💬', scene: '📱 Chat', dialog: '"¡Sofi! ¿Me das tu contraseña? Quiero ver tu perfil desde mi tablet" — Luna', character: 'Luna' },
      { emoji: '🤔', scene: '💭 Sofía piensa...', dialog: '"Mmm... Luna es mi amiga, pero Emabot me enseñó algo importante..."', character: 'Sofía' },
      { emoji: '🤖', scene: '💡 Recuerdo', dialog: '"¡Las contraseñas son como la llave de tu casa! No se comparten ni con amigos."', character: 'Emabot' },
      { emoji: '💪', scene: '📱 Chat', dialog: '"Luna, mi contraseña es secreta. ¡Pero podemos jugar juntas cuando nos veamos!" — Sofía', character: 'Sofía' },
      { emoji: '🌟', scene: '😊 Final feliz', dialog: 'Luna entendió y siguieron siendo amigas. ¡Sofía protegió su contraseña como una campeona! 🏆', character: 'Narrador' },
    ],
    lesson: '🔑 Las contraseñas son secretas. No se comparten con nadie, ni siquiera con amigos. ¡Tú puedes proteger la tuya!'
  },
  {
    id: 'stranger-danger',
    title: 'El desconocido amable',
    coverEmoji: '👤',
    description: 'Valentina recibe un mensaje de alguien que no conoce.',
    ageGroups: ['5-7', '8-12', 'teens'],
    panels: [
      { emoji: '👧', scene: '🎮 Jugando en línea', dialog: 'Valentina está en su juego favorito cuando recibe un mensaje de "SuperAmigo99"...', character: 'Narrador' },
      { emoji: '💬', scene: '📱 Chat del juego', dialog: '"¡Hola Valentina! Vi que juegas muy bien. ¿Cuántos años tienes? ¿En qué ciudad vives?" — SuperAmigo99', character: 'SuperAmigo99' },
      { emoji: '🤨', scene: '💭 Valentina piensa...', dialog: '"Qué raro... No conozco a esta persona. ¿Por qué quiere saber dónde vivo?"', character: 'Valentina' },
      { emoji: '🤖', scene: '💡 Consejo de Emabot', dialog: '"¡No le digas información personal a desconocidos en internet! No sabes quién está del otro lado."', character: 'Emabot' },
      { emoji: '🛡️', scene: '📱 Acción', dialog: 'Valentina no respondió y le contó a su mamá. Juntas bloquearon a SuperAmigo99.', character: 'Narrador' },
      { emoji: '💖', scene: '🤗 Final', dialog: 'Su mamá la abrazó y le dijo: "¡Hiciste lo correcto! Siempre cuéntame si algo se siente raro." ✨', character: 'Mamá' },
    ],
    lesson: '🚫 Nunca compartas información personal con desconocidos en internet. Si algo se siente raro, cuéntale a un adulto de confianza.'
  },
  {
    id: 'fake-prize',
    title: 'El premio que no existía',
    coverEmoji: '🎁',
    description: 'Camila ve un anuncio que promete un premio increíble.',
    ageGroups: ['8-12', 'teens'],
    panels: [
      { emoji: '👧', scene: '📱 Navegando', dialog: 'Camila ve un anuncio brillante: "¡¡FELICIDADES!! ¡Ganaste un iPhone! Haz clic AQUÍ para reclamarlo!"', character: 'Narrador' },
      { emoji: '🤩', scene: '💭 Emoción', dialog: '"¡¡Un iPhone gratis!! ¡Qué suerte! Solo tengo que hacer clic..."', character: 'Camila' },
      { emoji: '⚠️', scene: '🔍 Pero espera...', dialog: '"¿Por qué me piden mi contraseña y el número de tarjeta de mi mamá para un premio gratis?"', character: 'Camila' },
      { emoji: '🤖', scene: '💡 Emabot aparece', dialog: '"¡Cuidado! Los premios falsos son una trampa para robar tu información. Si algo es demasiado bueno para ser verdad... ¡probablemente no lo es!"', character: 'Emabot' },
      { emoji: '🚫', scene: '✋ Decisión', dialog: 'Camila cerró el anuncio y le contó a su hermana mayor sobre la trampa.', character: 'Narrador' },
      { emoji: '🌟', scene: '💪 Final', dialog: '"¡Ser inteligente en internet es el mejor premio de todos!" dijo su hermana orgullosa. 🏆', character: 'Hermana' },
    ],
    lesson: '🎁 Si algo es demasiado bueno para ser verdad, probablemente es una trampa. Nunca hagas clic en enlaces de premios "gratis".'
  },
];

const ComicStories = () => {
  const navigate = useNavigate();
  const { ageGroup, addPoints, completeMission } = useGame();
  const [selectedStory, setSelectedStory] = useState<ComicStory | null>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [showLesson, setShowLesson] = useState(false);

  const filteredStories = ageGroup
    ? STORIES.filter(s => s.ageGroups.includes(ageGroup))
    : STORIES;

  const handleFinishStory = () => {
    setShowLesson(true);
    if (selectedStory) {
      addPoints(10);
      completeMission(`comic-${selectedStory.id}`);
    }
  };

  if (selectedStory && showLesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-24">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="mb-4 text-6xl">📚✨</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">¡Lección aprendida!</h2>
          <div className="rounded-2xl bg-primary/10 p-5 mb-6">
            <p className="font-body text-lg text-foreground leading-relaxed">{selectedStory.lesson}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => { setSelectedStory(null); setCurrentPanel(0); setShowLesson(false); }}
              variant="outline"
              className="btn-bounce flex-1 rounded-full font-display"
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Más cómics
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="btn-bounce flex-1 rounded-full bg-primary font-display text-primary-foreground"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedStory) {
    const panel = selectedStory.panels[currentPanel];
    return (
      <div className="flex min-h-screen flex-col bg-background pb-24">
        <header className="border-b border-border bg-card">
          <div className="container flex items-center gap-3 py-4">
            <button onClick={() => { setSelectedStory(null); setCurrentPanel(0); }} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-display font-bold text-foreground flex-1">{selectedStory.title}</span>
            <span className="text-sm text-muted-foreground">{currentPanel + 1}/{selectedStory.panels.length}</span>
          </div>
          <div className="h-1.5 bg-muted">
            <div className="h-1.5 bg-primary transition-all duration-500 rounded-r-full" style={{ width: `${((currentPanel + 1) / selectedStory.panels.length) * 100}%` }} />
          </div>
        </header>

        <div className="container flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-md animate-slide-up" key={currentPanel}>
            {/* Comic panel */}
            <div className="card-playful text-center border-4 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-primary/5 px-3 py-1.5 text-xs font-display font-semibold text-muted-foreground">
                {panel.scene}
              </div>
              <div className="pt-8 pb-2">
                <div className="text-7xl mb-4">{panel.emoji}</div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3 relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-muted/50 rotate-45" />
                  <p className="font-display text-xs font-semibold text-primary mb-1">{panel.character}</p>
                  <p className="font-body text-base text-foreground leading-relaxed">{panel.dialog}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {currentPanel > 0 && (
                <Button
                  onClick={() => setCurrentPanel(prev => prev - 1)}
                  variant="outline"
                  className="btn-bounce flex-1 rounded-full font-display"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
              )}
              {currentPanel < selectedStory.panels.length - 1 ? (
                <Button
                  onClick={() => setCurrentPanel(prev => prev + 1)}
                  className="btn-bounce flex-1 rounded-full bg-primary font-display text-primary-foreground"
                >
                  Siguiente <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishStory}
                  className="btn-bounce flex-1 rounded-full bg-accent font-display text-accent-foreground"
                >
                  ¡Ver lección! 🌟
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <div className="container pt-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">📚 Cómics de seguridad</h1>
        <p className="text-muted-foreground mb-6">
          Historias cortas que te enseñan a estar segura en internet
        </p>

        <div className="grid gap-4">
          {filteredStories.map(story => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="card-playful flex items-center gap-4 text-left cursor-pointer hover:border-primary/50"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-4xl">
                {story.coverEmoji}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-foreground">{story.title}</h3>
                <p className="text-sm text-muted-foreground">{story.description}</p>
                <div className="flex gap-1 mt-1">
                  {story.ageGroups.map(ag => (
                    <span key={ag} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold">
                      {ag === '5-7' ? '5-7' : ag === '8-12' ? '8-12' : ag === 'teens' ? 'Teens' : 'Adultos'}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicStories;
