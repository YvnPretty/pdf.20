import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function ToastPanel({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      if (toast.type !== 'uploading') {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(onClose, 400);
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-container ${visible ? 'enter' : 'exit'} ${toast.type}`}>
      <div className="toast-content">
        {toast.type === 'uploading' && <Loader2 className="toast-icon spinning" size={26} />}
        {toast.type === 'success' && <CheckCircle2 className="toast-icon success" size={26} />}
        {toast.type === 'error' && <XCircle className="toast-icon error" size={26} />}
        
        <div className="toast-text">
          <strong>{toast.title}</strong>
          {toast.message && <p>{toast.message}</p>}
        </div>
      </div>
    </div>
  );
}
