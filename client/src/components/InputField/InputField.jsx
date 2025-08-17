import classes from './InputField.module.css';

export default function InputField({ inputRef, value, onChange, onFocus, onIncrement, onDecrement }) {
  return (
    <div className={classes.div_inputfield_wrapper}>
      {onDecrement && (
        <button className={classes.button_inputfield} onClick={onDecrement}>
          -
        </button>
      )}
      <input
        className={classes.input_inputfield}
        ref={inputRef}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        inputMode="numeric"
      />
      {onIncrement && (
        <button className={classes.button_inputfield} onClick={onIncrement}>
          +
        </button>
      )}
    </div>
  );
}