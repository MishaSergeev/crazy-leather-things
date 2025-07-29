import CalendarInput from "../CalendarInput/CalendarInput";
import './FormField.css';

export default function FormField({ label, name, value, onChange, t, type, style, important, exception}) {
  const isError = important && !value?.trim();

  return (
    <label className={style || "label-form-text"}>
      {t(label)} {name===exception&&<>{value}</>}
      {type === "calendar" ? (
        <CalendarInput
          value={value}
          onChange={onChange}
          autoComplete={name}
          className={`input-form-field ${isError ? 'field-error' : ''}`}
        />
      ) : (
        name!==exception&&<input
          name={name}
          value={value}
          autoComplete={name}
          type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
          onChange={onChange}
          className={`input-form-field ${isError ? 'field-error' : ''}`}
        />
      )}
    </label>
  );
}