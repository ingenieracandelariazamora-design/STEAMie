import { useNavigate } from 'react-router-dom';
import { Shield, Heart, BookOpen, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame, AgeGroup } from '@/contexts/GameContext';
import emabotMascot from '@/assets/emabot-mascot.png';

const AGE_GROUPS: { id: AgeGroup; label: string; emoji: string; desc: string }[] = [
  { id: '5-7', label: '5 – 7 años', emoji: '🧸', desc: 'Juegos sencillos y coloridos' },
  { id: '8-12', label: '8 – 12 años', emoji: '🌈', desc: 'Historias y desafíos divertidos' },
  { id: 'teens', label: 'Adolescentes', emoji: '💜', desc: 'Redes sociales y privacidad' },
  { id: 'adults', label: 'Madres y familias', emoji: '👩‍👧', desc: 'Guía para proteger a tu familia' },
];

const Landing = () => {
  const navigate = useNavigate();
  const { setAgeGroup } = useGame();

  const handleSelectAge = (age: AgeGroup) => {
    setAgeGroup(age);
    if (age === 'adults') {
      navigate('/family-guide');
    } else {
      navigate('/create-avatar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero font-body">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">EmaBot</span>
        </div>
        <Button
          onClick={() => navigate('/family-guide')}
          variant="outline"
          className="btn-bounce rounded-full font-display text-sm"
        >
          <Users className="h-4 w-4 mr-1" />
          Para familias
        </Button>
      </nav>

      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-12 md:flex-row md:py-20">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            Seguridad digital para niñas y mujeres
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            ¡Aprende a estar <span className="text-gradient">segura en internet</span> jugando!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Emabot te guía con historias, juegos y consejos para que te sientas <strong>segura y confiada</strong> usando la tecnología. 💪✨
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={emabotMascot}
            alt="Emabot, tu amiga robot de seguridad digital"
            className="w-52 md:w-72 animate-float drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Age Selection */}
      <section className="container pb-16">
        <h2 className="text-center font-display text-3xl font-bold text-foreground mb-2 md:text-4xl">
          ¿Quién eres? 💖
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Elige tu grupo para una experiencia personalizada
        </p>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          {AGE_GROUPS.map((group) => (
            <button
              key={group.id}
              onClick={() => handleSelectAge(group.id)}
              className="card-playful flex items-center gap-4 text-left group cursor-pointer hover:border-primary/50"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl group-hover:animate-wiggle">
                {group.emoji}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{group.label}</h3>
                <p className="text-sm text-muted-foreground">{group.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/80 py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl mb-10">
            ¿Qué aprenderás? 🌟
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🛡️', title: 'Contraseñas seguras', desc: 'Aprende a crear y proteger tus contraseñas.' },
              { icon: '🎣', title: 'Detectar engaños', desc: 'Identifica mensajes falsos y estafas.' },
              { icon: '💬', title: 'Extraños en línea', desc: 'Saber qué hacer si alguien desconocido te contacta.' },
              { icon: '💪', title: 'Confianza digital', desc: 'Siéntete segura y capaz con la tecnología.' },
            ].map((item, i) => (
              <div key={item.title} className="card-playful text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mb-3 text-4xl">{item.icon}</div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl mb-10">
            ¿Cómo funciona? 🚀
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🤖', title: 'Conoce a Emabot', desc: 'Tu amiga robot te guía paso a paso.' },
              { icon: '📖', title: 'Lee cómics', desc: 'Historias ilustradas sobre seguridad digital.' },
              { icon: '🎮', title: 'Juega y aprende', desc: 'Minijuegos interactivos y divertidos.' },
              { icon: '🏆', title: 'Gana premios', desc: '¡Insignias, puntos y niveles!' },
            ].map((item, i) => (
              <div key={item.title} className="card-playful text-center">
                <div className="mb-3 text-4xl">{item.icon}</div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-10">
        <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">EmaBot</span>
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-foreground">Acerca de</span>
            <span className="cursor-pointer hover:text-foreground" onClick={() => navigate('/family-guide')}>Para familias</span>
            <span className="cursor-pointer hover:text-foreground">Privacidad</span>
          </div>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="h-3 w-3 text-primary fill-primary" /> para niñas y mujeres valientes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
