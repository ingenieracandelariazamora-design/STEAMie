import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';
import emabotMascot from '@/assets/emabot-mascot.png';

const HAIR_STYLES = ['👧', '👩', '🧒', '👱‍♀️'];
const HAIR_COLORS = ['#3B2F2F', '#F5D76E', '#D35400', '#E74C3C', '#8E44AD', '#2ECC71'];
const SKIN_COLORS = ['#FDEBD0', '#F5CBA7', '#DC7633', '#A0522D', '#6B3FA0', '#3498DB'];

const CreateAvatar = () => {
  const navigate = useNavigate();
  const { setAvatar, startGame, ageGroup } = useGame();
  const [name, setName] = useState('');
  const [hairStyle, setHairStyle] = useState(0);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [skinColor, setSkinColor] = useState(SKIN_COLORS[0]);

  const handleStart = () => {
    if (!name.trim()) return;
    setAvatar({ name: name.trim(), hairStyle, hairColor, skinColor });
    startGame();
    navigate('/dashboard');
  };

  const isYoung = ageGroup === '5-7';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-hero p-4">
      <div className="flex items-center gap-3 mb-6">
        <img src={emabotMascot} alt="Emabot" className="w-12 h-12" />
        <span className="font-display text-2xl font-bold text-foreground">EmaBot</span>
      </div>

      <div className="card-playful w-full max-w-md">
        <h1 className="text-center font-display text-3xl font-bold text-foreground">
          {isYoung ? '¡Crea tu personaje! 🌈' : 'Crea tu heroína digital 💪'}
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          {isYoung ? '¡Elige cómo te ves!' : '¡Personaliza a tu defensora digital!'}
        </p>

        {/* Preview */}
        <div className="my-6 flex justify-center">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full text-6xl shadow-lg animate-pulse-glow"
            style={{ backgroundColor: skinColor }}
          >
            {HAIR_STYLES[hairStyle]}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="mb-1 block font-display text-sm font-semibold text-foreground">
            {isYoung ? '¿Cómo te llamas?' : 'Nombre de tu heroína'}
          </label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={isYoung ? 'Tu nombre...' : 'Escribe un nombre genial...'}
            className="rounded-xl text-center font-body text-lg"
            maxLength={20}
          />
        </div>

        {/* Hair Style */}
        <div className="mb-4">
          <label className="mb-2 block font-display text-sm font-semibold text-foreground">Elige tu aspecto</label>
          <div className="flex justify-center gap-3">
            {HAIR_STYLES.map((style, i) => (
              <button
                key={i}
                onClick={() => setHairStyle(i)}
                className={`btn-bounce flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all ${
                  hairStyle === i ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-4">
          <label className="mb-2 block font-display text-sm font-semibold text-foreground">Color de cabello</label>
          <div className="flex justify-center gap-2">
            {HAIR_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setHairColor(color)}
                className={`btn-bounce h-10 w-10 rounded-full border-2 transition-all ${
                  hairColor === color ? 'border-primary scale-110 ring-2 ring-primary/50' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Skin Color */}
        <div className="mb-6">
          <label className="mb-2 block font-display text-sm font-semibold text-foreground">Tono de piel</label>
          <div className="flex justify-center gap-2">
            {SKIN_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSkinColor(color)}
                className={`btn-bounce h-10 w-10 rounded-full border-2 transition-all ${
                  skinColor === color ? 'border-primary scale-110 ring-2 ring-primary/50' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!name.trim()}
          className="btn-kid w-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isYoung ? '🌟 ¡A jugar!' : '🛡️ ¡Comienza tu misión!'}
        </Button>
      </div>
    </div>
  );
};

export default CreateAvatar;
