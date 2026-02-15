import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTemplates } from '@/store/repository';
import { TemplateCard } from '@/components/TemplateCard';
import { PinGuard } from '@/components/PinGuard';
import { Search, ArrowLeft } from 'lucide-react';

const categories = ['all', 'tattoo', 'microblading', 'piercing', 'aesthetic', 'medical'];

const Templates = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const templates = getTemplates();

  const filtered = useMemo(() => {
    return templates.filter((tpl) => {
      if (tpl.archived) return false;
      if (category !== 'all' && tpl.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          tpl.name[language].toLowerCase().includes(q) ||
          tpl.description[language].toLowerCase().includes(q) ||
          tpl.tags.some((tag) => tag.includes(q))
        );
      }
      return true;
    });
  }, [templates, search, category, language]);

  return (
    <PinGuard>
      <div className="tablet-container pb-28 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-6">
          <button onClick={() => navigate('/')} className="touch-button p-3 bg-secondary rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="section-title flex-1">{t('templates.title')}</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('templates.search')}
            className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-2xl text-lg focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`touch-button px-5 py-3 rounded-xl whitespace-nowrap text-base ${
                category === cat
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {cat === 'all' ? t('templates.all') : t(`cat.${cat}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onUse={(id) => navigate(`/contract/${id}`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-lg">
            {language === 'fr' ? 'Aucun modèle trouvé' : language === 'es' ? 'No se encontraron plantillas' : 'No templates found'}
          </div>
        )}
      </div>
    </PinGuard>
  );
};

export default Templates;
