import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const navigate = useNavigate();
  const { avatar, points, level, badges, completedMissions } = useGame();

  if (!avatar) {
    navigate('/create-avatar');
    return null;
  }

  const levelLabels: Record<string, string> = {
    'Beginner': 'Principiante',
    'Digital Defender': 'Defensora Digital',
    'Cyber Hero': 'Ciber Heroína',
  };

  const nextLevel = level === 'Beginner' ? 100 : level === 'Digital Defender' ? 200 : 300;
  const prevLevel = level === 'Beginner' ? 0 : level === 'Digital Defender' ? 100 : 200;
  const progress = ((points - prevLevel) / (nextLevel - prevLevel)) * 100;

  return (
    <div className="min-h-screen bg-background pb-24 font-body">
      <div className="container pt-8 flex flex-col items-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-lg animate-pulse-glow mb-4"
          style={{ backgroundColor: avatar.skinColor }}
        >
          {['👧', '👩', '🧒', '👱‍♀️'][avatar.hairStyle]}
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">{avatar.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <span className="font-display font-semibold text-accent">{levelLabels[level] || level}</span>
        </div>

        <div className="mt-6 w-full max-w-sm">
          <div className="card-playful">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-foreground">Puntos</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-gold" />
                <span className="font-display font-bold text-secondary-foreground">{points}</span>
              </div>
            </div>
            <div className="mb-1 flex justify-between text-sm text-muted-foreground">
              <span>Progreso</span>
              <span>{nextLevel} para subir</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-3 rounded-full" />
          </div>

          <div className="card-playful mt-4">
            <div className="flex justify-between">
              <span className="font-display font-semibold text-foreground">Misiones completadas</span>
              <span className="font-display font-bold text-primary">{completedMissions.length}</span>
            </div>
          </div>

          <div className="card-playful mt-4">
            <div className="flex justify-between">
              <span className="font-display font-semibold text-foreground">Insignias ganadas</span>
              <span className="font-display font-bold text-primary">{badges.filter(b => b.earned).length}/{badges.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
