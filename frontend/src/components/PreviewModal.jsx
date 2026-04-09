import React, { useEffect, useState, useRef } from 'react';
import { X, Save, RefreshCw, ExternalLink, FilePlus } from 'lucide-react';

function PreviewModal({ isOpen, pdfBlob, fileName, onConfirm, onCancel, onAddPage }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const addPageInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [isOpen, pdfBlob]);

  const handleAddPage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPage(Array.from(e.target.files));
    }
  };

  if (!isOpen || !pdfBlob || !objectUrl) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Revisión de Documento</h2>
          <button className="btn-icon" onClick={onCancel} title="Descartar">
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
          <div className="preview-meta">
            <p className="preview-filename">{fileName}</p>
          </div>
          
          <div className="modal-actions">
            <input 
              type="file" 
              ref={addPageInputRef} 
              onChange={handleAddPage} 
              style={{ display: 'none' }} 
              multiple 
              accept="image/*, .doc, .docx, .xls, .xlsx, .txt"
            />
            <button className="btn btn-secondary" onClick={() => addPageInputRef.current.click()}>
              <FilePlus size={18} />
              Añadir Hoja
            </button>

            <a 
              href={objectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={18} />
              Pantalla Completa
            </a>

            <button className="btn btn-primary" onClick={onConfirm}>
              <Save size={18} />
              Finalizar y Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
