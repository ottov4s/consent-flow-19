import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSignedContracts } from '@/store/repository';
import { PinGuard } from '@/components/PinGuard';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Calendar, Mail, Eye } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const contracts = getSignedContracts();

  const filtered = useMemo(() => {
    if (!search) return contracts;
    const q = search.toLowerCase();
    return contracts.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.clientEmail.toLowerCase().includes(q) ||
        c.templateName.toLowerCase().includes(q)
    );
  }, [contracts, search]);

  return (
    <PinGuard>
      <div className="tablet-container pb-28 space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <button onClick={() => navigate('/')} className="touch-button p-3 bg-secondary rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="section-title flex-1">{t('history.title')}</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('history.search')}
            className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-2xl text-lg focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-xl">{t('history.noContracts')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((contract, i) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-elevated p-5 flex items-center gap-4"
              >
                {contract.signatureDataUrl && (
                  <img
                    src={contract.signatureDataUrl}
                    alt="Signature"
                    className="w-16 h-12 object-contain rounded-lg bg-secondary p-1"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold truncate">{contract.clientName}</p>
                  <p className="text-sm text-muted-foreground truncate">{contract.templateName}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {contract.clientEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(contract.signedAt).toLocaleDateString(
                        language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US'
                      )}
                    </span>
                  </div>
                </div>
                <button className="touch-button p-3 bg-secondary rounded-xl">
                  <Eye size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PinGuard>
  );
};

export default History;
