import { Language } from '@/types';

type TranslationKeys = {
  [key: string]: Record<Language, string>;
};

export const translations: TranslationKeys = {
  // Navigation
  'nav.home': { fr: 'Accueil', en: 'Home', es: 'Inicio' },
  'nav.templates': { fr: 'Modèles', en: 'Templates', es: 'Plantillas' },
  'nav.history': { fr: 'Historique', en: 'History', es: 'Historial' },
  'nav.settings': { fr: 'Réglages', en: 'Settings', es: 'Ajustes' },
  'nav.newContract': { fr: 'Nouveau contrat', en: 'New Contract', es: 'Nuevo contrato' },

  // Home
  'home.welcome': { fr: 'Gestion des Consentements', en: 'Consent Management', es: 'Gestión de Consentimientos' },
  'home.subtitle': { fr: 'Gérez vos contrats de consentement en toute simplicité', en: 'Manage your consent contracts with ease', es: 'Gestione sus contratos de consentimiento con facilidad' },
  'home.startContract': { fr: 'Démarrer un contrat', en: 'Start a contract', es: 'Iniciar un contrato' },
  'home.manageTemplates': { fr: 'Gérer les modèles', en: 'Manage templates', es: 'Gestionar plantillas' },
  'home.viewHistory': { fr: 'Voir l\'historique', en: 'View history', es: 'Ver historial' },
  'home.contractsSigned': { fr: 'Contrats signés', en: 'Contracts signed', es: 'Contratos firmados' },
  'home.templates': { fr: 'Modèles disponibles', en: 'Available templates', es: 'Plantillas disponibles' },
  'home.selectLanguage': { fr: 'Langue', en: 'Language', es: 'Idioma' },

  // Templates
  'templates.title': { fr: 'Bibliothèque de modèles', en: 'Template Library', es: 'Biblioteca de plantillas' },
  'templates.search': { fr: 'Rechercher un modèle...', en: 'Search templates...', es: 'Buscar plantillas...' },
  'templates.all': { fr: 'Tous', en: 'All', es: 'Todos' },
  'templates.use': { fr: 'Utiliser', en: 'Use', es: 'Usar' },
  'templates.edit': { fr: 'Modifier', en: 'Edit', es: 'Editar' },
  'templates.duplicate': { fr: 'Dupliquer', en: 'Duplicate', es: 'Duplicar' },
  'templates.archive': { fr: 'Archiver', en: 'Archive', es: 'Archivar' },

  // Contract Form
  'form.clientInfo': { fr: 'Informations du client', en: 'Client Information', es: 'Información del cliente' },
  'form.consent': { fr: 'Consentements', en: 'Consents', es: 'Consentimientos' },
  'form.signature': { fr: 'Signature', en: 'Signature', es: 'Firma' },
  'form.signAndSend': { fr: 'Signer et envoyer', en: 'Sign and send', es: 'Firmar y enviar' },
  'form.required': { fr: 'Obligatoire', en: 'Required', es: 'Obligatorio' },
  'form.clearSignature': { fr: 'Effacer la signature', en: 'Clear signature', es: 'Borrar firma' },
  'form.signHere': { fr: 'Signez ici avec votre doigt ou stylet', en: 'Sign here with your finger or stylus', es: 'Firme aquí con su dedo o lápiz' },
  'form.fillRequired': { fr: 'Veuillez remplir tous les champs obligatoires', en: 'Please fill all required fields', es: 'Por favor complete todos los campos obligatorios' },
  'form.signatureRequired': { fr: 'La signature est obligatoire', en: 'Signature is required', es: 'La firma es obligatoria' },
  'form.success': { fr: 'Contrat signé avec succès !', en: 'Contract signed successfully!', es: '¡Contrato firmado con éxito!' },
  'form.changeLang': { fr: 'Changer la langue du contrat', en: 'Change contract language', es: 'Cambiar idioma del contrato' },
  'form.step': { fr: 'Étape', en: 'Step', es: 'Paso' },

  // History
  'history.title': { fr: 'Historique des contrats', en: 'Contract History', es: 'Historial de contratos' },
  'history.search': { fr: 'Rechercher par nom, email...', en: 'Search by name, email...', es: 'Buscar por nombre, email...' },
  'history.noContracts': { fr: 'Aucun contrat signé', en: 'No signed contracts', es: 'Sin contratos firmados' },
  'history.signedOn': { fr: 'Signé le', en: 'Signed on', es: 'Firmado el' },
  'history.view': { fr: 'Voir', en: 'View', es: 'Ver' },

  // Settings
  'settings.title': { fr: 'Réglages', en: 'Settings', es: 'Ajustes' },
  'settings.practitioner': { fr: 'Informations du praticien', en: 'Practitioner Information', es: 'Información del profesional' },
  'settings.name': { fr: 'Nom du praticien', en: 'Practitioner name', es: 'Nombre del profesional' },
  'settings.email': { fr: 'Email professionnel', en: 'Professional email', es: 'Email profesional' },
  'settings.business': { fr: 'Nom de l\'établissement', en: 'Business name', es: 'Nombre del negocio' },
  'settings.defaultLang': { fr: 'Langue par défaut', en: 'Default language', es: 'Idioma por defecto' },
  'settings.security': { fr: 'Sécurité', en: 'Security', es: 'Seguridad' },
  'settings.pinEnable': { fr: 'Activer le code PIN', en: 'Enable PIN code', es: 'Activar código PIN' },
  'settings.pinCode': { fr: 'Code PIN', en: 'PIN Code', es: 'Código PIN' },
  'settings.save': { fr: 'Enregistrer', en: 'Save', es: 'Guardar' },
  'settings.saved': { fr: 'Réglages enregistrés', en: 'Settings saved', es: 'Ajustes guardados' },

  // PIN
  'pin.title': { fr: 'Accès praticien', en: 'Practitioner Access', es: 'Acceso profesional' },
  'pin.enter': { fr: 'Entrez votre code PIN', en: 'Enter your PIN code', es: 'Ingrese su código PIN' },
  'pin.incorrect': { fr: 'Code PIN incorrect', en: 'Incorrect PIN', es: 'PIN incorrecto' },

  // Languages
  'lang.fr': { fr: 'Français', en: 'French', es: 'Francés' },
  'lang.en': { fr: 'Anglais', en: 'English', es: 'Inglés' },
  'lang.es': { fr: 'Espagnol', en: 'Spanish', es: 'Español' },

  // Categories
  'cat.tattoo': { fr: 'Tatouage', en: 'Tattoo', es: 'Tatuaje' },
  'cat.microblading': { fr: 'Microblading', en: 'Microblading', es: 'Microblading' },
  'cat.aesthetic': { fr: 'Esthétique', en: 'Aesthetics', es: 'Estética' },
  'cat.medical': { fr: 'Médecine esthétique', en: 'Aesthetic Medicine', es: 'Medicina estética' },
  'cat.piercing': { fr: 'Piercing', en: 'Piercing', es: 'Piercing' },

  // Common
  'common.back': { fr: 'Retour', en: 'Back', es: 'Volver' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel', es: 'Cancelar' },
  'common.confirm': { fr: 'Confirmer', en: 'Confirm', es: 'Confirmar' },
  'common.delete': { fr: 'Supprimer', en: 'Delete', es: 'Eliminar' },
  'common.next': { fr: 'Suivant', en: 'Next', es: 'Siguiente' },
  'common.previous': { fr: 'Précédent', en: 'Previous', es: 'Anterior' },
  'common.of': { fr: 'de', en: 'of', es: 'de' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
