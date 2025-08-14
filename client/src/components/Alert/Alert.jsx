import { useEffect } from "react"

import "./Alert.css"

export default function Alert({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`custom-alert ${type}`}>
      <span>{message}</span>
    </div>
  )
}