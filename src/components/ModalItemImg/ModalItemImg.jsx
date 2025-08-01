import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './ModalItemImg.css';

export default function Modal({ children, open, onClose }) {
  const modalRef = useRef();

  const handleClick = (event) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      modalRef.current?.classList.add('open');
    } else {
      modalRef.current?.classList.remove('open');
    }
  }, [open]);

  return createPortal(
    <div
      ref={modalRef}
      className="modal-overlay"
      onClick={handleClick}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal')
  );
}