import { useNavigate } from 'react-router-dom';
import { Shield, MessageCircleWarning, Eye, Gamepad2, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mascot from '@/assets/cyber-guardian-mascot.png';
import heroBg from '@/assets/hero-bg.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">CyberGuardians</span>
        </div>
        <Button onClick={() => navigate('/create-avatar')} className="btn-bounce rounded-full bg-secondary font-display text-secondary-foreground hover:bg-secondary/90">
          Start Playing
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="container flex flex-col items-center gap-8 py-16 md:flex-row md:py-24">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Learn to Stay <span className="text-gradient">Safe Online</span> Through Games!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Interactive stories, mini games, and fun challenges that teach children how to protect themselves in the digital world.
            </p>
            <Button
              onClick={() => navigate('/create-avatar')}
              size="lg"
              className="btn-bounce mt-8 rounded-full bg-primary px-8 py-6 font-display text-lg text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              🚀 Start Your Mission
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={mascot}
              alt="CyberGuardian mascot robot"
              className="w-64 md:w-80 animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            Why Digital Safety Matters
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Children face real risks online every day. CyberGuardians helps them recognize and avoid these dangers.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { icon: MessageCircleWarning, title: 'Online Scams', desc: 'Fake messages and links designed to trick kids into sharing personal info.' },
              { icon: Eye, title: 'Privacy Risks', desc: 'Sharing too much online can put children and families at risk.' },
              { icon: Shield, title: 'Cyberbullying', desc: 'Hurtful messages and behavior that can affect kids emotionally.' },
            ].map((item) => (
              <div key={item.title} className="card-playful text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <item.icon className="h-7 w-7 text-destructive" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            How CyberGuardians Works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🤖', title: 'Create Your Avatar', desc: 'Customize your digital hero.' },
              { icon: '📖', title: 'Play Stories', desc: 'Make choices in interactive scenarios.' },
              { icon: '🎮', title: 'Mini Games', desc: 'Test your skills spotting dangers.' },
              { icon: '🏆', title: 'Earn Rewards', desc: 'Collect points, badges and level up!' },
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

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">CyberGuardians</span>
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-foreground">About</span>
            <span className="cursor-pointer hover:text-foreground">Contact</span>
            <span className="cursor-pointer hover:text-foreground">Privacy Policy</span>
          </div>
          <p>© 2026 CyberGuardians. Made for kids, by safety experts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
