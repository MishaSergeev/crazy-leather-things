import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'

import { useTranslation } from '../../hooks/useTranslation'

import 'react-datepicker/dist/react-datepicker.css'
import classes from './CalendarInput.module.css'

export default function CalendarInput({ value, onChange }) {
  const t = useTranslation()
  const [localDate, setLocalDate] = useState(value || null)

  useEffect(() => {
    setLocalDate(value || null)
  }, [value])

  const handleChange = (date) => {
    setLocalDate(date)
    onChange(date || null)
  }

  return (
    <div className={classes.div_calendarinput_container}>
      <DatePicker
        selected={localDate}
        onChange={handleChange}
        dateFormat="dd.MM.yyyy"
        placeholderText={t('placeholder_text')}
        className={classes.input_calendarinput_field}
        isClearable
      />
    </div>
  )
}
