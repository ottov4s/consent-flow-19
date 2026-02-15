import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types';

const flags: Record<Language, string> = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸' };
const names: Record<Language, string> = { fr: 'Français', en: 'English', es: 'Español' };

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSelector({ compact, className }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const languages: Language[] = ['fr', 'en', 'es'];

  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`touch-button flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            language === lang
              ? 'border-primary bg-primary/10 text-foreground font-semibold'
              : 'border-border bg-card text-muted-foreground hover:border-primary/40'
          }`}
        >
          <span className="text-2xl">{flags[lang]}</span>
          {!compact && <span className="text-base">{names[lang]}</span>}
        </button>
      ))}
    </div>
  );
}
