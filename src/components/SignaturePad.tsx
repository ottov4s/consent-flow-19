import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useLanguage } from '@/contexts/LanguageContext';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

export function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const { t } = useLanguage();

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      onSignatureChange(sigRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    onSignatureChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="signature-canvas relative overflow-hidden" style={{ height: 200 }}>
        <SignatureCanvas
          ref={sigRef}
          penColor="#1a3a3a"
          canvasProps={{
            className: 'sig-canvas',
            style: { width: '100%', height: '100%' },
          }}
          onEnd={handleEnd}
        />
        <p className="absolute bottom-3 left-0 right-0 text-center text-sm text-muted-foreground pointer-events-none">
          {t('form.signHere')}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="touch-button px-6 py-3 bg-secondary text-secondary-foreground rounded-xl text-base"
      >
        {t('form.clearSignature')}
      </button>
    </div>
  );
}
