import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useTTS } from '@/hooks/useTTS';
import emabotMascot from '@/assets/emabot-mascot.png';

interface VideoQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

interface SafetyVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  ageGroups: string[];
  emabotIntro: string;
  quiz: VideoQuiz;
}

const VIDEOS: SafetyVideo[] = [
  {
    id: 'password-safety',
    title: '🔐 Protege tu contraseña',
    description: 'Aprende por qué tu contraseña es un tesoro secreto.',
    thumbnail: 'https://img.youtube.com/vi/yrln8nyVBLU/hqdefault.jpg',
    youtubeId: 'yrln8nyVBLU',
    ageGroups: ['5-7', '8-12'],
    emabotIntro: '¡Vamos a aprender por qué las contraseñas son como la llave de tu casa! No se las des a nadie.',
    quiz: {
      question: '¿Qué debes hacer con tu contraseña?',
      options: ['Compartirla con amigos', 'Mantenerla en secreto', 'Escribirla en un papel público'],
      correctIndex: 1,
      feedback: '¡Correcto! Las contraseñas son secretas. ¡Nunca las compartas con nadie!'
    }
  },
  {
    id: 'stranger-online',
    title: '👤 Cuidado con desconocidos',
    description: 'No hables con extraños en internet.',
    thumbnail: 'https://img.youtube.com/vi/UMhLBPPtlrY/hqdefault.jpg',
    youtubeId: 'UMhLBPPtlrY',
    ageGroups: ['5-7', '8-12', 'teens'],
    emabotIntro: 'Este video te enseña qué hacer si un desconocido te habla en internet. ¡Vamos a verlo!',
    quiz: {
      question: '¿Qué haces si un desconocido te escribe en internet?',
      options: ['Le doy mi nombre y dirección', 'No respondo y le cuento a un adulto', 'Le envío una foto'],
      correctIndex: 1,
      feedback: '¡Muy bien! Nunca compartas información personal con desconocidos. ¡Cuéntale a un adulto de confianza!'
    }
  },
  {
    id: 'phishing-links',
    title: '🎣 No hagas clic en todo',
    description: 'Aprende a reconocer enlaces peligrosos.',
    thumbnail: 'https://img.youtube.com/vi/XSbkidkazpA/hqdefault.jpg',
    youtubeId: 'XSbkidkazpA',
    ageGroups: ['8-12', 'teens'],
    emabotIntro: 'A veces nos llegan mensajes con enlaces falsos. ¡Vamos a aprender a detectarlos!',
    quiz: {
      question: '¿Qué debes hacer con un enlace sospechoso?',
      options: ['Hacer clic para ver qué pasa', 'Ignorarlo y avisar a un adulto', 'Compartirlo con amigos'],
      correctIndex: 1,
      feedback: '¡Excelente! Si un enlace parece sospechoso, no lo toques y cuéntale a un adulto.'
    }
  },
  {
    id: 'kindness-online',
    title: '💖 Sé amable en internet',
    description: 'Trata a todos con respeto, también en línea.',
    thumbnail: 'https://img.youtube.com/vi/mgm3VpG3FBQ/hqdefault.jpg',
    youtubeId: 'mgm3VpG3FBQ',
    ageGroups: ['5-7', '8-12'],
    emabotIntro: 'Vamos a ver una historia para aprender a ser amables en internet. ¡Ser amable nos hace más fuertes!',
    quiz: {
      question: '¿Cómo debes tratar a los demás en internet?',
      options: ['Con respeto y amabilidad', 'No importa cómo los trate', 'Puedo decir lo que quiera'],
      correctIndex: 0,
      feedback: '¡Así es! Ser amable en internet es igual de importante que en la vida real. 💖'
    }
  },
];

const SafetyVideos = () => {
  const navigate = useNavigate();
  const { ageGroup, addPoints, completeMission, avatar } = useGame();
  const { speak } = useTTS();
  const [selectedVideo, setSelectedVideo] = useState<SafetyVideo | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const isYoung = ageGroup === '5-7';

  const filteredVideos = ageGroup
    ? VIDEOS.filter(v => v.ageGroups.includes(ageGroup))
    : VIDEOS;

  const handleSelectVideo = (video: SafetyVideo) => {
    setSelectedVideo(video);
    setShowQuiz(false);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    if (isYoung) {
      speak(video.emabotIntro);
    }
  };

  const handleVideoEnd = () => {
    setShowQuiz(true);
    if (selectedVideo && isYoung) {
      speak(`¡Muy bien ${avatar?.name || ''}! Ahora te voy a hacer una pregunta sobre lo que aprendiste.`);
    }
  };

  const handleAnswer = (index: number) => {
    if (quizCompleted) return;
    setSelectedAnswer(index);
    setQuizCompleted(true);

    if (selectedVideo) {
      const isCorrect = index === selectedVideo.quiz.correctIndex;
      if (isCorrect) {
        addPoints(15);
        completeMission(`video-${selectedVideo.id}`);
        if (isYoung) speak(selectedVideo.quiz.feedback);
      } else {
        if (isYoung) speak('¡Casi! Piénsalo de nuevo. La respuesta correcta es la otra opción.');
      }
    }
  };

  // Quiz view
  if (selectedVideo && showQuiz) {
    const quiz = selectedVideo.quiz;
    const isCorrect = selectedAnswer === quiz.correctIndex;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 pb-24">
        <div className="card-playful w-full max-w-md text-center animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={emabotMascot} alt="Emabot" className="h-12 w-12 rounded-full border-2 border-primary/30" />
            <p className="font-display text-lg font-bold text-foreground">Emabot pregunta...</p>
          </div>

          <div className="rounded-2xl bg-primary/10 p-5 mb-6">
            <p className="font-display text-lg font-semibold text-foreground">{quiz.question}</p>
          </div>

          <div className="space-y-3 mb-6">
            {quiz.options.map((option, i) => {
              let btnClass = 'w-full rounded-2xl border-2 p-4 text-left font-body text-base transition-all ';
              if (quizCompleted) {
                if (i === quiz.correctIndex) {
                  btnClass += 'border-success bg-success/10 text-foreground';
                } else if (i === selectedAnswer && !isCorrect) {
                  btnClass += 'border-destructive bg-destructive/10 text-foreground';
                } else {
                  btnClass += 'border-border bg-muted/30 text-muted-foreground';
                }
              } else {
                btnClass += 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer text-foreground';
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} className={btnClass} disabled={quizCompleted}>
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                    {quizCompleted && i === quiz.correctIndex && <CheckCircle className="ml-auto h-5 w-5 text-success" />}
                    {quizCompleted && i === selectedAnswer && !isCorrect && i !== quiz.correctIndex && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
                  </span>
                </button>
              );
            })}
          </div>

          {quizCompleted && (
            <div className={`rounded-2xl p-4 mb-4 animate-slide-up ${isCorrect ? 'bg-success/10 border border-success/30' : 'bg-warning/10 border border-warning/30'}`}>
              <p className="font-display font-semibold text-foreground">
                {isCorrect ? '🎉 ¡Excelente!' : '💪 ¡Sigue intentando!'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{quiz.feedback}</p>
            </div>
          )}

          {quizCompleted && (
            <div className="flex gap-3">
              <Button
                onClick={() => { setSelectedVideo(null); setShowQuiz(false); }}
                variant="outline"
                className="btn-bounce flex-1 rounded-full font-display"
              >
                Más videos
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="btn-bounce flex-1 rounded-full bg-primary font-display text-primary-foreground"
              >
                Volver al inicio
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Video player view
  if (selectedVideo) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-24">
        <header className="border-b border-border bg-card">
          <div className="container flex items-center gap-3 py-4">
            <button onClick={() => setSelectedVideo(null)} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-display font-bold text-foreground flex-1">{selectedVideo.title}</span>
          </div>
        </header>

        <div className="container py-6 flex flex-col items-center gap-6">
          {/* Emabot intro */}
          <div className="flex items-start gap-3 w-full max-w-lg bg-card rounded-2xl border border-primary/20 p-4 animate-slide-up">
            <img src={emabotMascot} alt="Emabot" className="h-10 w-10 rounded-full border-2 border-primary/30 flex-shrink-0" />
            <div>
              <p className="font-display font-bold text-foreground text-sm">Emabot dice:</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedVideo.emabotIntro}</p>
            </div>
          </div>

          {/* YouTube Player */}
          <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg">
            <iframe
              ref={playerRef}
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
              title={selectedVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Button to proceed to quiz */}
          <Button
            onClick={handleVideoEnd}
            className="btn-bounce rounded-full bg-accent font-display text-accent-foreground px-8 py-3 text-lg"
          >
            ¡Ya terminé de ver el video! 🌟
          </Button>
        </div>
      </div>
    );
  }

  // Video gallery
  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <div className="container pt-8">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">🎬 Videos de Seguridad Digital</h1>
        </div>
        <p className="text-muted-foreground mb-6 ml-8">
          Videos cortos para aprender a estar segura en internet
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {filteredVideos.map(video => (
            <button
              key={video.id}
              onClick={() => handleSelectVideo(video)}
              className="group relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-card shadow-md transition-all hover:border-primary/50 hover:shadow-xl text-left"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-all group-hover:bg-foreground/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-foreground">{video.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
                <div className="flex gap-1 mt-2">
                  {video.ageGroups.map(ag => (
                    <span key={ag} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold">
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Separator + link to comics */}
        <div className="mt-8 mb-4 border-t border-border pt-6">
          <button
            onClick={() => navigate('/comics')}
            className="card-playful flex items-center gap-4 w-full text-left cursor-pointer hover:border-primary/50"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
              📚
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">Cómics de seguridad</h3>
              <p className="text-sm text-muted-foreground">Historias ilustradas para aprender</p>
            </div>
            <ArrowLeft className="h-5 w-5 text-primary rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyVideos;
