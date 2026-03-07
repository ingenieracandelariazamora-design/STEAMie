import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, AlertTriangle, MessageCircle, Eye, Lock, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import emabotMascot from '@/assets/emabot-mascot.png';

interface GuideSection {
  icon: React.ReactNode;
  title: string;
  emoji: string;
  tips: string[];
}

const SECTIONS: GuideSection[] = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'Comunicación abierta',
    emoji: '💬',
    tips: [
      'Habla con tus hijas sobre lo que hacen en internet desde temprana edad.',
      'Crea un ambiente donde se sientan cómodas contándote si algo las asusta o incomoda.',
      'Evita reaccionar con enojo si te cuentan algo — eso las hará confiar más en ti.',
      'Pregúntales regularmente: "¿Algo raro pasó en internet hoy?"',
    ],
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: 'Supervisión sin invadir',
    emoji: '👀',
    tips: [
      'Coloca las computadoras y tablets en áreas comunes del hogar.',
      'Usa controles parentales apropiados para la edad.',
      'Revisa las apps y juegos que usan, pero respetando su privacidad según su madurez.',
      'Conoce los juegos y redes sociales que son populares entre niñas y adolescentes.',
    ],
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Contraseñas y privacidad',
    emoji: '🔐',
    tips: [
      'Enséñales a crear contraseñas fuertes y a no compartirlas con nadie.',
      'Explícales qué información es privada: nombre completo, dirección, escuela, fotos.',
      'Configura juntas la privacidad de sus redes sociales.',
      'Enséñales que lo que publican en internet se queda para siempre.',
    ],
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: 'Señales de alerta',
    emoji: '⚠️',
    tips: [
      'Si tu hija se pone nerviosa o esconde la pantalla cuando te acercas.',
      'Cambios de humor después de usar el teléfono o computadora.',
      'Si menciona "amigos" nuevos que conoció en internet.',
      'Si recibe regalos o dinero de fuentes desconocidas.',
    ],
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Empoderar, no asustar',
    emoji: '💪',
    tips: [
      'Enseña a tus hijas que la tecnología es una herramienta poderosa que pueden dominar.',
      'Celebra cuando toman buenas decisiones en línea.',
      'Enséñales que pedir ayuda es un acto de valentía, no de debilidad.',
      'Fomenta su confianza: "Tú eres más inteligente que cualquier estafador".',
    ],
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Ciberacoso',
    emoji: '🚫',
    tips: [
      'Explica qué es el ciberacoso y que nunca es culpa de la víctima.',
      'Enséñales a guardar evidencia (capturas de pantalla) si reciben acoso.',
      'Diles que siempre pueden bloquear y reportar a quien las moleste.',
      'Si el acoso persiste, contacta a la escuela y considera ayuda profesional.',
    ],
  },
];

const RESOURCES = [
  { title: '📞 Línea de ayuda contra ciberacoso', desc: 'Contacta a las autoridades locales si tu hija está siendo acosada en línea.' },
  { title: '📱 Apps recomendadas de control parental', desc: 'Family Link (Google), Screen Time (Apple), Qustodio.' },
  { title: '📖 Habla con tu hija sobre...', desc: 'Grooming, sexting, privacidad, huella digital, y respeto en línea.' },
];

const FamilyGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="bg-gradient-hero border-b border-border">
        <div className="container py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-display text-sm">Volver al inicio</span>
          </button>
          <div className="flex items-center gap-4">
            <img src={emabotMascot} alt="Emabot" className="w-16 h-16" />
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Guía para madres y familias 👩‍👧
              </h1>
              <p className="text-muted-foreground mt-1">
                Consejos prácticos para proteger a tus hijas en el mundo digital
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="container py-8">
        <div className="card-playful bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-2">¿Por qué esta guía?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Las niñas y mujeres enfrentan riesgos únicos en internet: desde ciberacoso hasta grooming. Esta guía te ayuda a crear un ambiente seguro donde tus hijas puedan explorar la tecnología con confianza, mientras tú las acompañas y proteges. 💜
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guide sections */}
      <section className="container pb-8">
        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <div key={i} className="card-playful">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {section.emoji} {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent mt-0.5">
                      {j + 1}
                    </span>
                    <p className="text-foreground leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="bg-card/80 py-12">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            <BookOpen className="inline h-6 w-6 mr-2 text-primary" />
            Recursos útiles
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {RESOURCES.map((res, i) => (
              <div key={i} className="card-playful text-center">
                <h4 className="font-display font-bold text-foreground mb-2">{res.title}</h4>
                <p className="text-sm text-muted-foreground">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          ¿Tu hija quiere aprender jugando? 🎮
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Deja que Emabot le enseñe seguridad digital con juegos, cómics e historias interactivas.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="btn-kid bg-primary text-primary-foreground"
        >
          🚀 Comenzar aventura
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Hecho con <Heart className="h-3 w-3 text-primary fill-primary" /> para familias que cuidan a sus hijas en el mundo digital
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FamilyGuide;
