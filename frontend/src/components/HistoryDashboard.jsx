import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import { FileText, Download, Trash2, Clock } from 'lucide-react';

export default function HistoryDashboard({ refreshTrigger }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    const keys = await localforage.keys();
    const items = [];
    for (const key of keys) {
      if (key.startsWith('pdf_')) {
        const item = await localforage.getItem(key);
        items.push(item);
      }
    }
    items.sort((a, b) => b.timestamp - a.timestamp);
    setHistory(items);
  };

  const clearHistory = async () => {
    const keys = await localforage.keys();
    for (const key of keys) {
      if (key.startsWith('pdf_')) await localforage.removeItem(key);
    }
    setHistory([]);
  };

  const handleDownload = (item) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="history-icon" /> Historial de Exportaciones
        </h3>
        <button onClick={clearHistory} className="btn-icon" title="Limpiar historial">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="history-grid">
        {history.map((item) => (
          <div key={item.id} className="history-card">
            <FileText size={36} className="history-file-icon" />
            <div className="history-info">
              <span className="history-name" title={item.name}>{item.name}</span>
              <span className="history-date">
                {new Date(item.timestamp).toLocaleDateString()} - {(item.blob.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button onClick={() => handleDownload(item)} className="btn-icon download" title="Descargar de nuevo">
              <Download size={22} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
