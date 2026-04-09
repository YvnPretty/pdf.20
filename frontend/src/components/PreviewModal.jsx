import React from 'react';
import { X, Save, RefreshCw } from 'lucide-react';

function PreviewModal({ isOpen, pdfBlob, fileName, onConfirm, onCancel }) {
  if (!isOpen || !pdfBlob) return null;

  const objectUrl = URL.createObjectURL(pdfBlob);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Vista Previa del Documento</h2>
          <button className="btn-icon" onClick={onCancel} title="Cancelar">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <iframe 
            src={`${objectUrl}#toolbar=0`} 
            title="PDF Preview" 
            className="pdf-preview-frame"
          />
        </div>

        <div className="modal-footer">
          <p className="preview-filename">{fileName}</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              <RefreshCw size={18} />
              Intentar de nuevo
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
