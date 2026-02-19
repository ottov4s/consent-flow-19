import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTemplates, saveSignedContract, getSettings } from '@/store/repository';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SignaturePad } from '@/components/SignaturePad';
import { PinGuard } from '@/components/PinGuard';
import { Language, ContractTemplate, SignedContract } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, AlertCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ContractForm = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const templates = getTemplates();
  const settings = getSettings();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    templateId === 'new' ? null : templateId ?? null
  );
  const template = templates.find((t) => t.id === selectedTemplateId);

  const [step, setStep] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>({});
  const [checkboxesInitialized, setCheckboxesInitialized] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showProPin, setShowProPin] = useState(false);
  const [proPin, setProPin] = useState('');
  const [proPinError, setProPinError] = useState(false);

  const totalSteps = 3;

  // Initialize default checkbox values when template is selected
  if (template && !checkboxesInitialized) {
    const defaults: Record<string, boolean> = {};
    template.checkboxes.forEach(cb => {
      if (cb.defaultChecked) defaults[cb.id] = true;
    });
    if (Object.keys(defaults).length > 0) {
      setCheckboxValues(prev => ({ ...defaults, ...prev }));
    }
    setCheckboxesInitialized(true);
  }

  const handleProAccess = () => {
    if (!settings.pinEnabled) {
      navigate('/templates');
      return;
    }
    setShowProPin(true);
  };

  const handleProPinSubmit = () => {
    if (proPin === settings.pinCode) {
      setShowProPin(false);
      navigate('/templates');
    } else {
      setProPinError(true);
      setProPin('');
    }
  };

  // Template selection screen
  if (!template) {
    return (
      <div className="tablet-container pb-28 space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <button onClick={() => navigate('/')} className="touch-button p-3 bg-secondary rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="section-title flex-1">{t('nav.newContract')}</h1>
          <button
            onClick={handleProAccess}
            className="touch-button px-4 py-3 bg-secondary text-secondary-foreground rounded-xl flex items-center gap-2 text-sm font-semibold"
          >
            <Lock size={18} />
            {language === 'fr' ? 'Accès Pro' : language === 'es' ? 'Acceso Pro' : 'Pro Access'}
          </button>
        </div>

        {/* Pro PIN modal */}
        {showProPin && (
          <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated p-8 max-w-sm w-full text-center space-y-5"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold font-display">{t('pin.title')}</h3>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={proPin}
                onChange={(e) => { setProPin(e.target.value); setProPinError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleProPinSubmit()}
                className="w-full text-center text-2xl tracking-[0.8em] py-3 bg-secondary border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                autoFocus
              />
              {proPinError && <p className="text-destructive text-sm font-medium">{t('pin.incorrect')}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowProPin(false)} className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium">
                  {t('common.cancel')}
                </button>
                <button onClick={handleProPinSubmit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold">
                  {t('common.confirm')}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <LanguageSelector className="justify-center" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.filter(t => !t.archived).map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => { setSelectedTemplateId(tpl.id); setCheckboxesInitialized(false); }}
              className="card-elevated p-6 text-left flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <span className="text-4xl">{tpl.icon}</span>
              <div>
                <p className="text-lg font-bold font-display">{tpl.name[language]}</p>
                <p className="text-sm text-muted-foreground">{tpl.description[language]}</p>
              </div>
              <ChevronRight className="ml-auto text-muted-foreground shrink-0" size={24} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const updateField = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateCheckbox = (id: string, checked: boolean) => {
    setCheckboxValues((prev) => ({ ...prev, [id]: checked }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (step === 0) {
      template.fields.forEach((f) => {
        if (f.required && !fieldValues[f.key]?.trim()) {
          errs.push(f.label[language]);
        }
      });
    }
    if (step === 1) {
      template.checkboxes.forEach((c) => {
        if (c.required && !checkboxValues[c.id]) {
          errs.push(c.label[language]);
        }
      });
    }
    if (step === 2 && !signature) {
      errs.push(t('form.signatureRequired'));
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    setErrors([]);
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }

    const contract: SignedContract = {
      id: crypto.randomUUID(),
      templateId: template.id,
      templateName: template.name[language],
      clientName: fieldValues['NOM_CLIENT'] || '',
      clientEmail: fieldValues['EMAIL'] || '',
      language,
      fieldValues,
      checkboxValues,
      signatureDataUrl: signature!,
      signedAt: new Date().toISOString(),
      practitionerEmail: settings.practitionerEmail,
    };

    saveSignedContract(contract);
    toast.success(t('form.success'));
    navigate('/history');
  };

  const renderContent = (content: string) => {
    let result = content;
    Object.entries(fieldValues).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`);
    });
    return result;
  };

  return (
    <div className="tablet-container pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <button
          onClick={() => step > 0 ? handleBack() : navigate(-1)}
          className="touch-button p-3 bg-secondary rounded-xl"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display">{template.name[language]}</h1>
          <p className="text-sm text-muted-foreground">
            {t('form.step')} {step + 1} {t('common.of')} {totalSteps}
          </p>
        </div>
        <LanguageSelector compact />
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {[0, 1, 2].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="text-destructive shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-destructive">{t('form.fillRequired')}</p>
              <ul className="text-sm text-destructive/80 mt-1 list-disc list-inside">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="section-title">{t('form.clientInfo')}</h2>
              {template.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-base font-medium flex items-center gap-2">
                    {field.label[language]}
                    {field.required && <span className="text-destructive text-sm">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder?.[language]}
                      rows={3}
                      className="w-full p-4 bg-card border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full p-4 bg-card border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">{field.placeholder?.[language] || '—'}</option>
                      {(field.options?.[language] || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder?.[language]}
                      className="w-full p-4 bg-card border-2 border-border rounded-xl text-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {template.sections.map((section) => (
                <div key={section.id} className="card-elevated p-6 space-y-3">
                  <h3 className="text-lg font-bold font-display">{section.title[language]}</h3>
                  <p className="text-base leading-relaxed text-foreground/90">
                    {renderContent(section.content[language])}
                  </p>
                </div>
              ))}

              <h2 className="section-title">{t('form.consent')}</h2>
              <div className="space-y-3">
                {template.checkboxes.map((cb) => (
                  <label
                    key={cb.id}
                    className={`card-elevated p-5 flex items-start gap-4 cursor-pointer ${
                      checkboxValues[cb.id] ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 shrink-0 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      checkboxValues[cb.id] ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {checkboxValues[cb.id] && <Check size={18} className="text-primary-foreground" />}
                    </div>
                    <span className="text-base leading-relaxed">
                      {renderContent(cb.label[language])}
                      {cb.required && <span className="text-destructive ml-1">*</span>}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!checkboxValues[cb.id]}
                      onChange={(e) => updateCheckbox(cb.id, e.target.checked)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="section-title">{t('form.signature')}</h2>
              <SignaturePad onSignatureChange={setSignature} />
              <div className="card-elevated p-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {fieldValues['NOM_CLIENT']} — {fieldValues['EMAIL']}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-4 pt-4">
        {step > 0 && (
          <button onClick={handleBack} className="touch-button flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-xl py-4">
            <ChevronLeft size={20} />
            {t('common.previous')}
          </button>
        )}
        {step < totalSteps - 1 ? (
          <button onClick={handleNext} className="touch-button flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-semibold">
            {t('common.next')}
            <ChevronRight size={20} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="touch-button-lg flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-xl">
            <Check size={24} />
            {t('form.signAndSend')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractForm;
