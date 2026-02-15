import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { getSignedContracts, getTemplates } from '@/store/repository';
import { motion } from 'framer-motion';
import { FileText, Clock, Plus, Shield } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const contractCount = getSignedContracts().length;
  const templateCount = getTemplates().filter(t => !t.archived).length;

  const actions = [
    {
      icon: Plus,
      label: t('home.startContract'),
      desc: t('nav.newContract'),
      path: '/contract/new',
      primary: true,
    },
    {
      icon: FileText,
      label: t('home.manageTemplates'),
      desc: `${templateCount} ${t('home.templates')}`,
      path: '/templates',
    },
    {
      icon: Clock,
      label: t('home.viewHistory'),
      desc: `${contractCount} ${t('home.contractsSigned')}`,
      path: '/history',
    },
  ];

  return (
    <div className="tablet-container pb-28 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={32} />
          <h1 className="text-3xl font-bold font-display text-foreground">ConsentFlow</h1>
        </div>
        <LanguageSelector compact />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-primary rounded-3xl p-8 text-primary-foreground"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
          {t('home.welcome')}
        </h2>
        <p className="text-primary-foreground/80 text-lg">
          {t('home.subtitle')}
        </p>

        <div className="flex gap-4 mt-6">
          <div className="bg-primary-foreground/15 rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-bold">{contractCount}</p>
            <p className="text-sm text-primary-foreground/70">{t('home.contractsSigned')}</p>
          </div>
          <div className="bg-primary-foreground/15 rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-bold">{templateCount}</p>
            <p className="text-sm text-primary-foreground/70">{t('home.templates')}</p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              onClick={() => navigate(action.path)}
              className={`card-elevated p-6 text-left flex items-start gap-4 active:scale-[0.98] transition-transform ${
                action.primary ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                action.primary ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              }`}>
                <Icon size={26} />
              </div>
              <div>
                <p className="text-lg font-semibold font-display">{action.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
