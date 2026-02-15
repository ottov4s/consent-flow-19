import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, FileText, Clock, Settings, Plus } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const items = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/templates', icon: FileText, label: t('nav.templates') },
    { path: '/contract/new', icon: Plus, label: t('nav.newContract'), accent: true },
    { path: '/history', icon: Clock, label: t('nav.history') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-safe">
      <div className="flex items-center justify-around max-w-3xl mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-3 px-4 min-w-[72px] transition-colors ${
                item.accent
                  ? 'text-primary-foreground'
                  : isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.accent ? (
                <div className="w-14 h-14 -mt-8 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <Icon size={28} className="text-primary-foreground" />
                </div>
              ) : (
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              )}
              <span className={`text-xs ${isActive || item.accent ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
