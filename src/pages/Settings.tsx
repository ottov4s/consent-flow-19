import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSettings, saveSettings } from '@/store/repository';
import { PinGuard } from '@/components/PinGuard';
import { AppSettings, Language } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const [settings, setSettingsState] = useState<AppSettings>(getSettings());

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setLanguage(settings.defaultLanguage);
    toast.success(t('settings.saved'));
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'es', label: '🇪🇸 Español' },
  ];

  return (
    <PinGuard>
      <div className="tablet-container pb-28 space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <button onClick={() => navigate('/')} className="touch-button p-3 bg-secondary rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="section-title flex-1">{t('settings.title')}</h1>
        </div>

        {/* Practitioner Info */}
        <div className="card-elevated p-6 space-y-5">
          <h2 className="text-xl font-bold font-display">{t('settings.practitioner')}</h2>

          <div className="space-y-2">
            <label className="text-base font-medium">{t('settings.name')}</label>
            <input
              value={settings.practitionerName}
              onChange={(e) => update('practitionerName', e.target.value)}
              className="w-full p-4 bg-background border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium">{t('settings.email')}</label>
            <input
              type="email"
              value={settings.practitionerEmail}
              onChange={(e) => update('practitionerEmail', e.target.value)}
              className="w-full p-4 bg-background border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium">{t('settings.business')}</label>
            <input
              value={settings.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              className="w-full p-4 bg-background border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium">{t('settings.defaultLang')}</label>
            <div className="flex gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => update('defaultLanguage', lang.value)}
                  className={`touch-button px-5 py-3 rounded-xl text-base ${
                    settings.defaultLanguage === lang.value
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card-elevated p-6 space-y-5">
          <h2 className="text-xl font-bold font-display">{t('settings.security')}</h2>

          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.pinEnabled ? 'bg-primary' : 'bg-border'
              }`}
              onClick={() => update('pinEnabled', !settings.pinEnabled)}
            >
              <div
                className={`w-6 h-6 rounded-full bg-card shadow-md transition-transform mt-1 ${
                  settings.pinEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-base font-medium">{t('settings.pinEnable')}</span>
          </label>

          {settings.pinEnabled && (
            <div className="space-y-2">
              <label className="text-base font-medium">{t('settings.pinCode')}</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={settings.pinCode}
                onChange={(e) => update('pinCode', e.target.value)}
                className="w-full p-4 bg-background border-2 border-border rounded-xl text-lg tracking-widest focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="touch-button-lg w-full bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-3"
        >
          <Save size={22} />
          {t('settings.save')}
        </button>
      </div>
    </PinGuard>
  );
};

export default SettingsPage;
