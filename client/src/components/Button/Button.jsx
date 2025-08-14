import { useState } from 'react'

import classes from './Button.module.css'

export default function Button({ children, isActive, ...props }) {
  const [isMouseOver, setMouseOver] = useState(false)
  return (
    <button
      {...props}
      onMouseOver={()=>setMouseOver(true)}
      onMouseOut={()=>setMouseOver(false)}
      className={
        isActive ? `${classes.button} ${classes.active}` : (isMouseOver? `${classes.button} ${classes.focus}` :classes.button)
      }
    >
      {children}
    </button>
  )
}
