import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTemplates, saveTemplate } from '@/store/repository';
import { ContractTemplate, DynamicField, ConsentCheckbox, ContractSection, Language } from '@/types';
import { PinGuard } from '@/components/PinGuard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, GripVertical, Type, Mail, Phone, Calendar,
  AlignLeft, List, CheckSquare, PenTool, Save, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { toast } from 'sonner';

const FIELD_TYPES: { value: DynamicField['type']; icon: any; label: Record<Language, string> }[] = [
  { value: 'text', icon: Type, label: { fr: 'Texte', en: 'Text', es: 'Texto' } },
  { value: 'email', icon: Mail, label: { fr: 'Email', en: 'Email', es: 'Email' } },
  { value: 'tel', icon: Phone, label: { fr: 'Téléphone', en: 'Phone', es: 'Teléfono' } },
  { value: 'date', icon: Calendar, label: { fr: 'Date', en: 'Date', es: 'Fecha' } },
  { value: 'textarea', icon: AlignLeft, label: { fr: 'Zone de texte', en: 'Text area', es: 'Área de texto' } },
  { value: 'select', icon: List, label: { fr: 'Liste déroulante', en: 'Dropdown', es: 'Lista desplegable' } },
];

const emptyMultilang = (): Record<Language, string> => ({ fr: '', en: '', es: '' });

const TemplateEditor = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isNew = templateId === 'new';

  const [template, setTemplate] = useState<ContractTemplate>(() => {
    if (!isNew) {
      const found = getTemplates().find(t => t.id === templateId);
      if (found) return { ...found };
    }
    return {
      id: crypto.randomUUID(),
      name: emptyMultilang(),
      category: 'tattoo',
      description: emptyMultilang(),
      icon: '📄',
      sections: [],
      fields: [],
      checkboxes: [],
      tags: [],
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'sections' | 'fields' | 'checkboxes'>('info');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const updateTemplate = (partial: Partial<ContractTemplate>) => {
    setTemplate(prev => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    if (!template.name.fr && !template.name.en) {
      toast.error(language === 'fr' ? 'Le nom du modèle est requis' : 'Template name is required');
      return;
    }
    updateTemplate({ updatedAt: new Date().toISOString() });
    saveTemplate({ ...template, updatedAt: new Date().toISOString() });
    toast.success(language === 'fr' ? 'Modèle enregistré' : language === 'es' ? 'Plantilla guardada' : 'Template saved');
    navigate('/templates');
  };

  // Fields
  const addField = (type: DynamicField['type']) => {
    const newField: DynamicField = {
      id: crypto.randomUUID(),
      key: `FIELD_${Date.now()}`,
      label: emptyMultilang(),
      type,
      required: false,
      ...(type === 'select' ? { options: { fr: ['Option 1'], en: ['Option 1'], es: ['Opción 1'] } } : {}),
    };
    updateTemplate({ fields: [...template.fields, newField] });
  };

  const updateField = (id: string, partial: Partial<DynamicField>) => {
    updateTemplate({
      fields: template.fields.map(f => f.id === id ? { ...f, ...partial } : f),
    });
  };

  const removeField = (id: string) => {
    updateTemplate({ fields: template.fields.filter(f => f.id !== id) });
  };

  // Sections
  const addSection = () => {
    const newSection: ContractSection = {
      id: crypto.randomUUID(),
      title: emptyMultilang(),
      content: emptyMultilang(),
    };
    updateTemplate({ sections: [...template.sections, newSection] });
    setExpandedSection(newSection.id);
  };

  const updateSection = (id: string, partial: Partial<ContractSection>) => {
    updateTemplate({
      sections: template.sections.map(s => s.id === id ? { ...s, ...partial } : s),
    });
  };

  const removeSection = (id: string) => {
    updateTemplate({ sections: template.sections.filter(s => s.id !== id) });
  };

  // Checkboxes
  const addCheckbox = () => {
    const newCb: ConsentCheckbox = {
      id: crypto.randomUUID(),
      label: emptyMultilang(),
      required: false,
      defaultChecked: false,
    };
    updateTemplate({ checkboxes: [...template.checkboxes, newCb] });
  };

  const updateCheckbox = (id: string, partial: Partial<ConsentCheckbox>) => {
    updateTemplate({
      checkboxes: template.checkboxes.map(c => c.id === id ? { ...c, ...partial } : c),
    });
  };

  const removeCheckbox = (id: string) => {
    updateTemplate({ checkboxes: template.checkboxes.filter(c => c.id !== id) });
  };

  const tabs = [
    { key: 'info' as const, label: language === 'fr' ? 'Infos' : language === 'es' ? 'Info' : 'Info' },
    { key: 'sections' as const, label: language === 'fr' ? 'Sections' : 'Sections' },
    { key: 'fields' as const, label: language === 'fr' ? 'Champs' : language === 'es' ? 'Campos' : 'Fields' },
    { key: 'checkboxes' as const, label: language === 'fr' ? 'Cases à cocher' : language === 'es' ? 'Casillas' : 'Checkboxes' },
  ];

  const categories = ['tattoo', 'microblading', 'piercing', 'aesthetic', 'medical'];
  const icons = ['📄', '🎨', '✨', '💎', '🌿', '💉', '✍️', '📋', '🏥', '💆'];

  // Collect all field keys for replication hint
  const allFieldKeys = template.fields.map(f => f.key);

  return (
    <PinGuard>
      <div className="tablet-container pb-28 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-6">
          <button onClick={() => navigate('/templates')} className="touch-button p-3 bg-secondary rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="section-title flex-1">
            {isNew
              ? (language === 'fr' ? 'Nouveau modèle' : language === 'es' ? 'Nueva plantilla' : 'New Template')
              : (language === 'fr' ? 'Modifier le modèle' : language === 'es' ? 'Editar plantilla' : 'Edit Template')
            }
          </h1>
          <button onClick={handleSave} className="touch-button px-6 py-3 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 font-semibold">
            <Save size={20} />
            {language === 'fr' ? 'Enregistrer' : language === 'es' ? 'Guardar' : 'Save'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`touch-button px-5 py-3 rounded-xl whitespace-nowrap text-base ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-5">
                {/* Name */}
                <div className="card-elevated p-5 space-y-4">
                  <h3 className="font-bold text-lg">{language === 'fr' ? 'Nom du modèle' : 'Template Name'}</h3>
                  {(['fr', 'en', 'es'] as Language[]).map(lang => (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-semibold text-muted-foreground uppercase">{lang}</span>
                      <input
                        value={template.name[lang]}
                        onChange={e => updateTemplate({ name: { ...template.name, [lang]: e.target.value } })}
                        placeholder={`Nom (${lang})`}
                        className="flex-1 p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="card-elevated p-5 space-y-4">
                  <h3 className="font-bold text-lg">{language === 'fr' ? 'Description' : 'Description'}</h3>
                  {(['fr', 'en', 'es'] as Language[]).map(lang => (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-semibold text-muted-foreground uppercase">{lang}</span>
                      <input
                        value={template.description[lang]}
                        onChange={e => updateTemplate({ description: { ...template.description, [lang]: e.target.value } })}
                        placeholder={`Description (${lang})`}
                        className="flex-1 p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Category & Icon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card-elevated p-5 space-y-3">
                    <h3 className="font-bold text-lg">{language === 'fr' ? 'Catégorie' : 'Category'}</h3>
                    <select
                      value={template.category}
                      onChange={e => updateTemplate({ category: e.target.value })}
                      className="w-full p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{t(`cat.${c}`)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="card-elevated p-5 space-y-3">
                    <h3 className="font-bold text-lg">{language === 'fr' ? 'Icône' : 'Icon'}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {icons.map(icon => (
                        <button
                          key={icon}
                          onClick={() => updateTemplate({ icon })}
                          className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center border-2 transition-colors ${
                            template.icon === icon ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="card-elevated p-5 space-y-3">
                  <h3 className="font-bold text-lg">Tags</h3>
                  <input
                    value={template.tags.join(', ')}
                    onChange={e => updateTemplate({ tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {language === 'fr'
                      ? 'Utilisez {{CLE}} pour insérer la valeur d\'un champ (ex: {{NOM_CLIENT}})'
                      : 'Use {{KEY}} to insert a field value (e.g. {{NOM_CLIENT}})'}
                  </p>
                  <button onClick={addSection} className="touch-button px-5 py-3 bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                    <Plus size={18} />
                    {language === 'fr' ? 'Ajouter' : 'Add'}
                  </button>
                </div>

                {template.sections.map((section, idx) => (
                  <div key={section.id} className="card-elevated overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="w-full p-5 flex items-center gap-3 text-left"
                    >
                      <GripVertical size={18} className="text-muted-foreground" />
                      <span className="font-bold flex-1">
                        {section.title[language] || `Section ${idx + 1}`}
                      </span>
                      {expandedSection === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {expandedSection === section.id && (
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          {language === 'fr' ? 'Titre' : 'Title'}
                        </h4>
                        {(['fr', 'en', 'es'] as Language[]).map(lang => (
                          <div key={lang} className="flex items-center gap-3">
                            <span className="w-8 text-xs font-bold text-muted-foreground uppercase">{lang}</span>
                            <input
                              value={section.title[lang]}
                              onChange={e => updateSection(section.id, { title: { ...section.title, [lang]: e.target.value } })}
                              className="flex-1 p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none"
                            />
                          </div>
                        ))}

                        <h4 className="font-semibold text-sm text-muted-foreground mt-4">
                          {language === 'fr' ? 'Contenu' : 'Content'}
                        </h4>
                        {allFieldKeys.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-muted-foreground mr-1">{language === 'fr' ? 'Champs disponibles:' : 'Available fields:'}</span>
                            {allFieldKeys.map(key => (
                              <span key={key} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-mono">{`{{${key}}}`}</span>
                            ))}
                          </div>
                        )}
                        {(['fr', 'en', 'es'] as Language[]).map(lang => (
                          <div key={lang} className="flex items-start gap-3">
                            <span className="w-8 text-xs font-bold text-muted-foreground uppercase mt-3">{lang}</span>
                            <textarea
                              value={section.content[lang]}
                              onChange={e => updateSection(section.id, { content: { ...section.content, [lang]: e.target.value } })}
                              rows={4}
                              className="flex-1 p-3 bg-background border-2 border-border rounded-xl text-base focus:border-primary focus:outline-none resize-none"
                            />
                          </div>
                        ))}

                        <button
                          onClick={() => removeSection(section.id)}
                          className="flex items-center gap-2 text-destructive text-sm font-medium mt-2"
                        >
                          <Trash2 size={16} />
                          {language === 'fr' ? 'Supprimer cette section' : 'Delete this section'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {template.sections.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {language === 'fr' ? 'Aucune section. Ajoutez-en une pour commencer.' : 'No sections. Add one to get started.'}
                  </div>
                )}
              </div>
            )}

            {/* FIELDS TAB */}
            {activeTab === 'fields' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {FIELD_TYPES.map(ft => {
                    const Icon = ft.icon;
                    return (
                      <button
                        key={ft.value}
                        onClick={() => addField(ft.value)}
                        className="touch-button px-4 py-3 bg-secondary text-secondary-foreground rounded-xl flex items-center gap-2 text-sm"
                      >
                        <Icon size={16} />
                        <Plus size={14} />
                        {ft.label[language]}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  {language === 'fr'
                    ? '💡 Utilisez la même CLÉ pour plusieurs champs afin de répliquer automatiquement la saisie (ex: NOM_CLIENT saisi une fois, affiché partout).'
                    : '💡 Use the same KEY for multiple fields to auto-replicate input across the form.'}
                </p>

                {template.fields.map((field, idx) => {
                  const TypeIcon = FIELD_TYPES.find(ft => ft.value === field.type)?.icon || Type;
                  return (
                    <div key={field.id} className="card-elevated p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <TypeIcon size={18} className="text-primary shrink-0" />
                        <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {FIELD_TYPES.find(ft => ft.value === field.type)?.label[language]}
                        </span>
                        <div className="flex-1" />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={e => updateField(field.id, { required: e.target.checked })}
                            className="w-5 h-5 rounded accent-primary"
                          />
                          {language === 'fr' ? 'Obligatoire' : 'Required'}
                        </label>
                        <button onClick={() => removeField(field.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Key */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground w-16">
                          {language === 'fr' ? 'Clé' : 'Key'}
                        </span>
                        <input
                          value={field.key}
                          onChange={e => updateField(field.id, { key: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                          className="flex-1 p-2 bg-background border-2 border-border rounded-lg text-sm font-mono focus:border-primary focus:outline-none"
                          placeholder="NOM_CLIENT"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(`{{${field.key}}}`)}
                          className="p-2 text-muted-foreground hover:text-primary rounded-lg"
                          title={language === 'fr' ? 'Copier la balise' : 'Copy tag'}
                        >
                          <Copy size={16} />
                        </button>
                      </div>

                      {/* Labels */}
                      {(['fr', 'en', 'es'] as Language[]).map(lang => (
                        <div key={lang} className="flex items-center gap-3">
                          <span className="w-16 text-xs font-bold text-muted-foreground uppercase">{lang} label</span>
                          <input
                            value={field.label[lang]}
                            onChange={e => updateField(field.id, { label: { ...field.label, [lang]: e.target.value } })}
                            className="flex-1 p-2 bg-background border-2 border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      ))}

                      {/* Select options */}
                      {field.type === 'select' && (
                        <div className="space-y-2 mt-2 pl-4 border-l-2 border-primary/20">
                          <h4 className="text-sm font-semibold text-muted-foreground">
                            {language === 'fr' ? 'Options de la liste' : 'Dropdown options'}
                          </h4>
                          {(['fr', 'en', 'es'] as Language[]).map(lang => (
                            <div key={lang} className="flex items-center gap-3">
                              <span className="w-8 text-xs font-bold text-muted-foreground uppercase">{lang}</span>
                              <input
                                value={(field.options?.[lang] || []).join(', ')}
                                onChange={e => updateField(field.id, {
                                  options: { ...(field.options || { fr: [], en: [], es: [] }), [lang]: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                                })}
                                placeholder="Option 1, Option 2, Option 3"
                                className="flex-1 p-2 bg-background border-2 border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {template.fields.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {language === 'fr' ? 'Aucun champ. Ajoutez-en avec les boutons ci-dessus.' : 'No fields yet. Add some using the buttons above.'}
                  </div>
                )}
              </div>
            )}

            {/* CHECKBOXES TAB */}
            {activeTab === 'checkboxes' && (
              <div className="space-y-4">
                <button onClick={addCheckbox} className="touch-button px-5 py-3 bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                  <Plus size={18} />
                  <CheckSquare size={18} />
                  {language === 'fr' ? 'Ajouter une case' : 'Add checkbox'}
                </button>

                {template.checkboxes.map((cb, idx) => (
                  <div key={cb.id} className="card-elevated p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={18} className="text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {language === 'fr' ? `Case ${idx + 1}` : `Checkbox ${idx + 1}`}
                      </span>
                      <div className="flex-1" />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={cb.required}
                          onChange={e => updateCheckbox(cb.id, { required: e.target.checked })}
                          className="w-5 h-5 rounded accent-primary"
                        />
                        {language === 'fr' ? 'Obligatoire' : 'Required'}
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={cb.defaultChecked || false}
                          onChange={e => updateCheckbox(cb.id, { defaultChecked: e.target.checked })}
                          className="w-5 h-5 rounded accent-primary"
                        />
                        {language === 'fr' ? 'Coché par défaut' : 'Default checked'}
                      </label>
                      <button onClick={() => removeCheckbox(cb.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {(['fr', 'en', 'es'] as Language[]).map(lang => (
                      <div key={lang} className="flex items-start gap-3">
                        <span className="w-8 text-xs font-bold text-muted-foreground uppercase mt-2">{lang}</span>
                        <textarea
                          value={cb.label[lang]}
                          onChange={e => updateCheckbox(cb.id, { label: { ...cb.label, [lang]: e.target.value } })}
                          rows={2}
                          className="flex-1 p-2 bg-background border-2 border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>
                ))}

                {template.checkboxes.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {language === 'fr' ? 'Aucune case à cocher.' : 'No checkboxes yet.'}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PinGuard>
  );
};

export default TemplateEditor;
