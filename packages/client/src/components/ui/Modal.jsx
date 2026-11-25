import { useEffect, useCallback } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white text-ink w-full max-w-[850px] max-h-[90vh] overflow-auto relative p-7"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl w-9 h-9 flex items-center justify-center bg-white rounded-full z-10 hover:bg-muted"
          aria-label="Đóng"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

