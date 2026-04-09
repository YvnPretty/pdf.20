import React, { useState } from 'react';
import localforage from 'localforage';
import FileUploader from './components/FileUploader.jsx';
import ToastPanel from './components/ToastPanel.jsx';
import HistoryDashboard from './components/HistoryDashboard.jsx';
import PreviewModal from './components/PreviewModal.jsx';

function App() {
  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [previewData, setPreviewData] = useState(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setToast({ type: 'uploading', title: 'Convirtiendo la magia...', message: file.name });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = "https://pdf-20.onrender.com/api/convert";
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Error inesperado del servidor';
        try {
           const errorData = await response.json();
           errorMsg = errorData.error;
        } catch(e){}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const outputName = file.name.includes('.') 
          ? file.name.substring(0, file.name.lastIndexOf('.')) + '.pdf' 
          : file.name + '.pdf';
      
      setToast(null);
      setPreviewData({ blob, file, outputName });
      
    } catch (err) {
       setToast({ type: 'error', title: 'Regla de negocio no cumplida', message: err.message });
    }
  };

  const handleConfirmPreview = async () => {
    if (!previewData) return;
    
    setToast({ type: 'uploading', title: 'Guardando...', message: previewData.outputName });
    
    try {
      const id = 'pdf_' + Date.now();
      await localforage.setItem(id, {
        id,
        name: previewData.outputName,
        blob: previewData.blob,
        timestamp: Date.now()
      });

      setToast({ type: 'success', title: '¡Éxito Quirúrgico!', message: 'Archivo guardado en el historial.' });
      setRefreshTrigger(prev => prev + 1);
      setPreviewData(null);
    } catch(err) {
      setToast({ type: 'error', title: 'Error al guardar', message: err.message });
    }
  };

  const handleCancelPreview = () => {
    setPreviewData(null);
  };

  const closeToast = () => setToast(null);

  return (
    <>
      <header>
        <h1>PDFForge</h1>
        <p className="subtitle">Conversiones precisas. PWA instalable de alta fidelidad.</p>
      </header>

      <main className="converter-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <FileUploader onFileSelect={handleFileSelect} />
        <HistoryDashboard refreshTrigger={refreshTrigger} />
      </main>

      <PreviewModal 
        isOpen={!!previewData}
        pdfBlob={previewData?.blob}
        fileName={previewData?.outputName}
        onConfirm={handleConfirmPreview}
        onCancel={handleCancelPreview}
      />

      <ToastPanel toast={toast} onClose={closeToast} />
    </>
  );
}

export default App;
