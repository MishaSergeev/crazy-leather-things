import { useState, useEffect } from 'react';
import './FormFieldDropDown.css';

export default function FormFieldDropDown({
  label, value, onChange, t, firstOption, options, type, style, important, width, isInput, optionsType
}) {
  const isError = important && !value;
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const list = type === 'object'
    ? options?.map((el) => el.Description)
    : options;

  const filteredOptions = list?.filter(opt =>
    t(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selected) => {
    onChange({ target: { value: selected } });
    setSearchTerm(selected);
    setShowDropdown(false);
    console.log('showDropdown', showDropdown)
  };
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  return (
    <label
      className={style || "label-form-dropdown-text"}
      style={{ width }}
    >
      {t(label)}

      {isInput ? (
        <div className="dropdown-input-wrapper">
          <input
            type="text"
            value={searchTerm || value || ''}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              onChange({ target: { value: e.target.value } });
            }}
            onFocus={() => setSearchTerm('')}
            className={`select-form-dropdown-field ${isError ? 'field-error' : ''}`}
          />

          {showDropdown && filteredOptions?.length > 0 && (
            <ul className="ul-form-dropdown-autocomplete-option">
              {filteredOptions.map((opt) => (
                <li
                  className="li-form-dropdown-autocomplete-option"
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  style={{ padding: '8px', cursor: 'pointer' }}
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
          className={`select-form-dropdown-field ${isError ? 'field-error' : ''}`}
        >
          {firstOption && <option value="">{t(firstOption)}</option>}
          {type === 'object'
            ? options?.map((el) => (
              <option key={el.Ref} value={optionsType?el[optionsType]:el.Description}>
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
  );
}
