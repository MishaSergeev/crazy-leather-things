import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import classes from './Modal.module.css'

export default function Modal({ children, open, onClose, isItemImg, isLogin }) {
  const dialog = useRef()

  const handleClick = (event) => {
    if (event.target === dialog.current) {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      dialog.current?.showModal()
    } else {
      dialog.current?.close()
    }
  }, [open])

  return createPortal(
    <dialog
      ref={dialog}
      onClick={handleClick}
      className={clsx(
        classes.dialog,
        isItemImg && open && classes.itemimg,
        isLogin && open && classes.modal_content_login
      )}
    >
      <div
        className={clsx(
          classes.modal_content,
          isItemImg && open && classes.modal_content_itemimg
        )}
      >
        {children}
      </div>
    </dialog>,
    document.getElementById('modal')
  )
}