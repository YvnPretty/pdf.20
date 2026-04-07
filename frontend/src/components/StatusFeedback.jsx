import React from 'react';

function StatusFeedback({ file, status, errorMessage, pdfUrl, onConvert, onReset }) {
  return (
    <div className="status-panel">
      <div className={`status-card ${status === 'error' ? 'error' : status === 'success' ? 'success' : ''}`}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '1.1rem', display: 'block' }}>Archivo Seleccionado</strong>
            <span style={{ color: 'var(--text-muted)' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          
          {status === 'idle' && (
            <button className="btn" onClick={onConvert}>
              Convertir a PDF 🚀
            </button>
          )}
        </div>

        {status === 'uploading' && (
          <div>
            <p style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Convirtiendo magia en realidad...</p>
            <div className="progress-bar-container">
              <div className="progress-bar"></div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
             <h4 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>❌ Error de Regla de Negocio</h4>
             <p>{errorMessage}</p>
             <button className="btn" style={{ background: 'var(--border)', marginTop: '1rem' }} onClick={onReset}>
                Intentar otro archivo
             </button>
          </div>
        )}

        {status === 'success' && (
          <div>
             <h4 style={{ color: 'var(--success)', marginBottom: '1rem' }}>✅ ¡Conversión Exitosa y Fiel!</h4>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <a href={pdfUrl} download={`${file.name.split('.')[0]}.pdf`} className="btn" style={{ textDecoration: 'none' }}>
                 Descargar PDF 📥
               </a>
               <button className="btn" style={{ background: 'var(--border)' }} onClick={onReset}>
                 Nuevo archivo
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StatusFeedback;
