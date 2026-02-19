import jsPDF from 'jspdf';
import { SignedContract, ContractTemplate, Language } from '@/types';

export function generateContractPdf(
  contract: SignedContract,
  template: ContractTemplate | undefined
): void {
  const doc = new jsPDF();
  const lang = contract.language;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, size: number, bold = false, align: 'left' | 'center' = 'left') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    if (y + lines.length * (size * 0.5) > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines, align === 'center' ? pageWidth / 2 : margin, y, { align });
    y += lines.length * (size * 0.45) + 4;
  };

  const addSpace = (h: number) => { y += h; };

  // Title
  addText(contract.templateName, 18, true, 'center');
  addSpace(6);

  // Date
  const dateStr = new Date(contract.signedAt).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  addText(dateStr, 10, false, 'center');
  addSpace(10);

  // Client info
  addText(lang === 'fr' ? 'Informations du client' : lang === 'es' ? 'Información del cliente' : 'Client Information', 14, true);
  addSpace(2);

  Object.entries(contract.fieldValues).forEach(([key, value]) => {
    if (value) {
      const field = template?.fields.find(f => f.key === key);
      const label = field ? field.label[lang] : key;
      addText(`${label}: ${value}`, 11);
    }
  });

  addSpace(8);

  // Contract sections
  if (template) {
    template.sections.forEach(section => {
      addText(section.title[lang], 13, true);
      addSpace(2);
      let content = section.content[lang];
      Object.entries(contract.fieldValues).forEach(([key, value]) => {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`);
      });
      addText(content, 10);
      addSpace(6);
    });
  }

  // Checkboxes
  addText(lang === 'fr' ? 'Consentements' : lang === 'es' ? 'Consentimientos' : 'Consents', 14, true);
  addSpace(2);

  if (template) {
    template.checkboxes.forEach(cb => {
      const checked = contract.checkboxValues[cb.id] ? '☑' : '☐';
      addText(`${checked} ${cb.label[lang]}`, 10);
    });
  }

  addSpace(10);

  // Signature
  if (contract.signatureDataUrl) {
    addText(lang === 'fr' ? 'Signature:' : lang === 'es' ? 'Firma:' : 'Signature:', 12, true);
    addSpace(4);
    if (y + 45 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
    try {
      doc.addImage(contract.signatureDataUrl, 'PNG', margin, y, 60, 30);
      y += 35;
    } catch {
      addText('[Signature]', 10);
    }
  }

  addSpace(6);
  addText(`${lang === 'fr' ? 'Signé le' : lang === 'es' ? 'Firmado el' : 'Signed on'} ${dateStr}`, 9);

  // Save
  const safeName = contract.clientName.replace(/[^a-zA-Z0-9]/g, '_') || 'contract';
  doc.save(`${safeName}_${contract.signedAt.split('T')[0]}.pdf`);
}
