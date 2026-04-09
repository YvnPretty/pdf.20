import React, { useState, useRef } from 'react';
import { FileUp, Camera } from 'lucide-react';

function FileUploader({ onFileSelect }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div className="uploader-wrapper">
      <div 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          style={{ display: 'none' }} 
          multiple
          accept="image/png, image/jpeg, image/jpg, text/plain, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <FileUp className="drop-icon" size={64} style={{ opacity: 0.8 }} />
        <h3 className="dropzone-text">Seleccionar archivos</h3>
        <p className="dropzone-subtext">o haz clic para explorar en tu dispositivo</p>
        <p className="dropzone-subtext" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>Soporta Imágenes, Texto, Word y Excel (Max 10MB)</p>
      </div>

      <button className="btn btn-camera" onClick={() => cameraInputRef.current.click()}>
        <Camera size={24} />
        Abre la cámara para escanear documento
      </button>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        onChange={handleFileInput} 
        style={{ display: 'none' }} 
      />
    </div>
  );
}

export default FileUploader;
