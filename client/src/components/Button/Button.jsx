import { useState } from "react"
import clsx from "clsx"

import classes from "./Button.module.css"

export default function Button({ children, isActive, ...props }) {
  const [isMouseOver, setMouseOver] = useState(false)

  return (
    <button
      {...props}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      className={clsx(
        classes.button,
        isActive && classes.active,
        isMouseOver && classes.focus
      )}
    >
      {children}
    </button>
  )
}
