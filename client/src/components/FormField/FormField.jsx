import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import clsx from "clsx"

import CalendarInput from "../CalendarInput/CalendarInput"
import classes from "./FormField.module.css"

export default function FormField({
  label,
  name,
  value,
  placeholder,
  onChange,
  t,
  type,
  style,
  important,
  exception,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType =
    name === "email"
      ? "email"
      : name === "phone"
      ? "tel"
      : type === "password" && showPassword
      ? "text"
      : type

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  const isValidPhone = (val) => /^\+?\d{10,15}$/.test(val)

  let isError = false
  if (important) {
    if (!value?.trim()) {
      isError = true
    } else if (inputType === "email" && !isValidEmail(value)) {
      isError = true
    } else if (inputType === "tel" && !isValidPhone(value)) {
      isError = true
    }
  }

  return (
    <label className={style || classes.label_form_text}>
      {t(label)} {name === exception && <>{value}</>}

      {type === "calendar" ? (
        <CalendarInput
          value={value}
          onChange={onChange}
          autoComplete={name}
          className={clsx(classes.input_form_field, {
            [classes.field_error]: isError,
          })}
        />
      ) : (
        name !== exception && (
          <div className={classes.formfield_input_wrapper}>
            <input
              name={name}
              value={value}
              autoComplete={name}
              placeholder={placeholder}
              type={inputType}
              onChange={onChange}
              className={clsx(classes.input_form_field, {
                [classes.field_error]: isError,
              })}
            />
            {type === "password" && (
              <span
                className={classes.password_toggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>
        )
      )}
    </label>
  )
}