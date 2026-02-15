import { AppSettings, ContractTemplate, Language, SignedContract } from '@/types';
import { defaultTemplates } from './defaultTemplates';

const KEYS = {
  templates: 'consent_templates',
  contracts: 'consent_signed_contracts',
  settings: 'consent_settings',
};

const defaultSettings: AppSettings = {
  defaultLanguage: 'fr',
  practitionerEmail: '',
  practitionerName: '',
  businessName: '',
  pinCode: '1234',
  pinEnabled: false,
};

function load<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Templates
export function getTemplates(): ContractTemplate[] {
  const stored = load<ContractTemplate[] | null>(KEYS.templates, null);
  if (!stored) {
    save(KEYS.templates, defaultTemplates);
    return defaultTemplates;
  }
  return stored;
}

export function saveTemplate(template: ContractTemplate): void {
  const templates = getTemplates();
  const idx = templates.findIndex(t => t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.push(template);
  save(KEYS.templates, templates);
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter(t => t.id !== id);
  save(KEYS.templates, templates);
}

// Signed Contracts
export function getSignedContracts(): SignedContract[] {
  return load<SignedContract[]>(KEYS.contracts, []);
}

export function saveSignedContract(contract: SignedContract): void {
  const contracts = getSignedContracts();
  contracts.unshift(contract);
  save(KEYS.contracts, contracts);
}

export function deleteSignedContract(id: string): void {
  const contracts = getSignedContracts().filter(c => c.id !== id);
  save(KEYS.contracts, contracts);
}

// Settings
export function getSettings(): AppSettings {
  return load<AppSettings>(KEYS.settings, defaultSettings);
}

export function saveSettings(settings: AppSettings): void {
  save(KEYS.settings, settings);
}
