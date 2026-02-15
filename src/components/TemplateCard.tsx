import { ContractTemplate, Language } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface TemplateCardProps {
  template: ContractTemplate;
  onUse: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function TemplateCard({ template, onUse, onEdit }: TemplateCardProps) {
  const { language, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6 flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{template.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold font-display truncate">
            {template.name[language]}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {template.description[language]}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
          {template.fields.length} {language === 'fr' ? 'champs' : language === 'es' ? 'campos' : 'fields'}
        </span>
      </div>

      <div className="flex gap-3 mt-auto pt-2">
        <button
          onClick={() => onUse(template.id)}
          className="touch-button flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-base font-semibold"
        >
          {t('templates.use')}
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(template.id)}
            className="touch-button px-5 py-3 border-2 border-border text-foreground rounded-xl text-base"
          >
            {t('templates.edit')}
          </button>
        )}
      </div>
    </motion.div>
  );
}
