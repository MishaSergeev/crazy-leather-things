import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import classes from './Modal.module.css'

export default function Modal({ children, open, onClose, isItemImg, isLogin }) {

  const dialog = useRef()

  const handleClick = (event) => {
    if (event.target === dialog.current) {
      onClose();
    }
  };
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open])

  return createPortal(
    <dialog
      className={isItemImg && open ? `${classes.dialog} ${classes.itemimg}` : isLogin&&open?`${classes.dialog} ${classes.modal_content_login}`:classes.dialog}
      ref={dialog} onClick={handleClick}>
      <div className={isItemImg && open ? `${classes.modal_content} ${classes.modal_content_itemimg}` :
       classes.modal_content}>{children}</div>
    </dialog>,
    document.getElementById('modal')
  )
}
