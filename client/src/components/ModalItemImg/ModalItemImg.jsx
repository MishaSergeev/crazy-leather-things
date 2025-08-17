import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import classes from './ModalItemImg.module.css'

export default function Modal({ children, open, onClose }) {
  const modalRef = useRef()

  const handleClick = (event) => {
    if (event.target === modalRef.current) {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      modalRef.current?.classList.add(classes.open)
    } else {
      modalRef.current?.classList.remove(classes.open)
    }
  }, [open])

  return createPortal(
    <div
      ref={modalRef}
      className={clsx(classes.modal_overlay, { [classes.open]: open })}
      onClick={handleClick}
    >
      <div className={classes.modal_content}>
        {children}
      </div>
    </div>,
    document.getElementById('modal')
  )
}
