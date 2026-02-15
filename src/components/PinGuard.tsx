import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSettings } from '@/store/repository';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface PinGuardProps {
  children: React.ReactNode;
}

export function PinGuard({ children }: PinGuardProps) {
  const { t } = useLanguage();
  const settings = getSettings();
  const [unlocked, setUnlocked] = useState(!settings.pinEnabled);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = () => {
    if (pin === settings.pinCode) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-elevated p-10 max-w-sm w-full text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="text-primary" size={36} />
        </div>
        <h2 className="section-title">{t('pin.title')}</h2>
        <p className="text-muted-foreground">{t('pin.enter')}</p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full text-center text-3xl tracking-[1em] py-4 bg-secondary border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
          autoFocus
        />

        {error && (
          <p className="text-destructive font-medium">{t('pin.incorrect')}</p>
        )}

        <button
          onClick={handleSubmit}
          className="touch-button-lg w-full bg-primary text-primary-foreground rounded-2xl"
        >
          {t('common.confirm')}
        </button>
      </motion.div>
    </div>
  );
}
