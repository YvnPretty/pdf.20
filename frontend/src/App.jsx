import React, { useState } from 'react';
import localforage from 'localforage';
import FileUploader from './components/FileUploader.jsx';
import ToastPanel from './components/ToastPanel.jsx';
import HistoryDashboard from './components/HistoryDashboard.jsx';

function App() {
  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setToast({ type: 'uploading', title: 'Convirtiendo la magia...', message: file.name });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api/convert`;
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
      
      const id = 'pdf_' + Date.now();
      await localforage.setItem(id, {
        id,
        name: outputName,
        blob: blob,
        timestamp: Date.now()
      });

      setToast({ type: 'success', title: '¡Éxito Quirúrgico!', message: 'Archivo transformado y guardado.' });
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err) {
       setToast({ type: 'error', title: 'Regla de negocio no cumplida', message: err.message });
    }
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

      <ToastPanel toast={toast} onClose={closeToast} />
    </>
  );
}

export default App;
