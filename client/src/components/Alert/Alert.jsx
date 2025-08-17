import { useEffect } from "react"
import clsx from "clsx"

import classes from "./Alert.module.css"

export default function Alert({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={clsx(classes.custom_alert, classes[type])}>
      <span>{message}</span>
    </div>
  )
}