import React, { useEffect, useState } from 'react';
import { X, Save, RefreshCw, ExternalLink } from 'lucide-react';

function PreviewModal({ isOpen, pdfBlob, fileName, onConfirm, onCancel }) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (isOpen && pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [isOpen, pdfBlob]);

  if (!isOpen || !pdfBlob || !objectUrl) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Vista Previa del Documento</h2>
          <button className="btn-icon" onClick={onCancel} title="Cancelar">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body" style={{ position: 'relative' }}>
          <iframe 
            src={`${objectUrl}#toolbar=0`} 
            title="PDF Preview" 
            className="pdf-preview-frame"
            style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
          />
        </div>

        <div className="modal-footer">
          <p className="preview-filename">{fileName}</p>
          <div className="modal-actions">
            <a 
              href={objectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Abre el PDF en una pestaña externa para dispositivos móviles"
            >
              <ExternalLink size={18} />
              Ver Completo
            </a>
            <button className="btn btn-secondary" onClick={onCancel}>
              <RefreshCw size={18} />
              Reintentar
            </button>
            <button className="btn btn-primary" onClick={onConfirm}>
              <Save size={18} />
              Guardar y Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
