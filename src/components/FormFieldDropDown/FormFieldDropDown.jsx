import './FormFieldDropDown.css';

export default function FormFieldDropDown({
  label, value, onChange, t, firstOption, options, type, style, important
}) {
  const isError = important && !value;

  return (
    <label className={style || "label-form-dropdown-text"}>
      {t(label)}
      <select
        value={value}
        onChange={onChange}
        className={`select-form-dropdown-field ${isError ? 'field-error' : ''}`}
      >
        {firstOption && <option value="">{t(firstOption)}</option>}
        {type === 'object'
          ? options?.map((el) => (
              <option key={el.Ref} value={el.Ref}>
                {el.Description}
              </option>
            ))
          : options?.map((el) => (
              <option key={el} value={el}>
                {t(el)}
              </option>
            ))}
      </select>
    </label>
  );
}
