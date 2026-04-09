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
  const [draftFiles, setDraftFiles] = useState([]);

  const handleFileSelect = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    const filesToConvert = [...draftFiles, ...newFiles];
    setDraftFiles(filesToConvert);
    convertFiles(filesToConvert);
  };

  const convertFiles = async (files) => {
    setToast({ type: 'uploading', title: 'Procesando documentos...', message: `${files.length} archivo(s)` });

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const backendUrl = "https://pdf-20.onrender.com/api/convert";
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Error en la conversión empresarial';
        try {
           const errorData = await response.json();
           errorMsg = errorData.error;
        } catch(e){}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const outputName = files.length > 1 
          ? `${files[0].name.split('.')[0]}_compilation.pdf`
          : files[0].name.split('.')[0] + '.pdf';
      
      setToast(null);
      setPreviewData({ blob, files, outputName });
      
    } catch (err) {
       setToast({ type: 'error', title: 'Error de Procesamiento', message: err.message });
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
      setDraftFiles([]);
    } catch(err) {
      setToast({ type: 'error', title: 'Error al guardar', message: err.message });
    }
  };

  const handleCancelPreview = () => {
    setPreviewData(null);
    setDraftFiles([]);
  };

  const closeToast = () => setToast(null);

  return (
    <>
      <header>
        <h1>PDFForge</h1>
        <p className="subtitle">Estamos aquí para programar y resolver.</p>
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
        onAddPage={handleFileSelect}
      />

      <ToastPanel toast={toast} onClose={closeToast} />
    </>
  );
}

export default App;
