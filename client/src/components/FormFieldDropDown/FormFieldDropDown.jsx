import { useState, useEffect } from "react"
import clsx from "clsx"

import classes from "./FormFieldDropDown.module.css"

export default function FormFieldDropDown({
  label,
  value,
  onChange,
  t,
  firstOption,
  options,
  type,
  style,
  important,
  width,
  isInput,
  optionsType,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const isError = important && !value

  const list = type === "object" ? options?.map((el) => el.Description) : options

  const filteredOptions = list?.filter((opt) =>
    t(opt).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (selected) => {
    onChange({ target: { value: selected } })
    setSearchTerm(selected)
    setShowDropdown(false)
  }

  useEffect(() => {
    setSearchTerm(value || "")
  }, [value])

  return (
    <label
      className={style || classes.label_form_dropdown_text}
      style={{ width }}
    >
      {t(label)}

      {isInput ? (
        <div className={classes.dropdown_input_wrapper}>
          <input
            type="text"
            value={searchTerm || value || ""}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
              onChange({ target: { value: e.target.value } })
            }}
            onFocus={() => setSearchTerm("")}
            className={clsx(classes.select_form_dropdown_field, {
              [classes.field_error]: isError,
            })}
          />

          {showDropdown && filteredOptions?.length > 0 && (
            <ul className={classes.ul_form_dropdown_autocomplete_option}>
              {filteredOptions.map((opt) => (
                <li
                  key={opt}
                  className={classes.li_form_dropdown_autocomplete_option}
                  onClick={() => handleSelect(opt)}
                >
                  {t(opt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <select
          value={value}
          onChange={onChange}
          className={clsx(classes.select_form_dropdown_field, {
            [classes.field_error]: isError,
          })}
        >
          {firstOption && <option value="">{t(firstOption)}</option>}
          {type === "object"
            ? options?.map((el) => (
                <option
                  key={el.Ref}
                  value={optionsType ? el[optionsType] : el.Description}
                >
                  {el.Description}
                </option>
              ))
            : options?.map((el) => (
                <option key={el} value={el}>
                  {t(el)}
                </option>
              ))}
        </select>
      )}
    </label>
  )
}