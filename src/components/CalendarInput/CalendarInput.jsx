import { useState, useEffect } from 'react'

import { useTranslation } from '../../hooks/useTranslation';
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import './CalendarInput.css'

export default function CalendarInput({ value, onChange }) {
  const [localDate, setLocalDate] = useState(value || null)
  const t = useTranslation()

  useEffect(() => {
    setLocalDate(value || null)
  }, [value])

  const handleChange = (date) => {
    setLocalDate(date)
    onChange(date || null)
  }

  return (
    <div className="div-calendarinput-container">
      <DatePicker
        selected={localDate}
        onChange={handleChange}
        dateFormat="dd.MM.yyyy"
        placeholderText={t('placeholder_text')}
        className="input-calendarinput-field"
        isClearable
      />
    </div>
  )
}