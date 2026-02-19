export type Language = 'fr' | 'en' | 'es';

export interface DynamicField {
  id: string;
  key: string; // e.g. "NOM_CLIENT", "DATE"
  label: Record<Language, string>;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  required: boolean;
  options?: Record<Language, string[]>; // for select type
  placeholder?: Record<Language, string>;
}

export interface ConsentCheckbox {
  id: string;
  label: Record<Language, string>;
  required: boolean;
  defaultChecked?: boolean;
}

export interface ContractSection {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
}

export interface ContractTemplate {
  id: string;
  name: Record<Language, string>;
  category: string;
  description: Record<Language, string>;
  icon: string;
  sections: ContractSection[];
  fields: DynamicField[];
  checkboxes: ConsentCheckbox[];
  tags: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignedContract {
  id: string;
  templateId: string;
  templateName: string;
  clientName: string;
  clientEmail: string;
  language: Language;
  fieldValues: Record<string, string>;
  checkboxValues: Record<string, boolean>;
  signatureDataUrl: string;
  signedAt: string;
  practitionerEmail: string;
}

export interface AppSettings {
  defaultLanguage: Language;
  practitionerEmail: string;
  practitionerName: string;
  businessName: string;
  pinCode: string;
  pinEnabled: boolean;
}

export type AppMode = 'practitioner' | 'client';
