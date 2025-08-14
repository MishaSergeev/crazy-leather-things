import './InputField.css';

export default function InputField({ inputRef, value, onChange, onFocus, onIncrement, onDecrement }) {
  return (
    <div className="div-inputfield-wrapper">
      {onDecrement&&<button className="button-inputfield" onClick={onDecrement}>-</button>}
      <input
        className="input-inputfield"
        ref={inputRef}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        inputMode="numeric"
      />
      {onIncrement&&<button className="button-inputfield" onClick={onIncrement}>+</button>}
    </div>
  );
}