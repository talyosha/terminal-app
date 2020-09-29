import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CommandPrefix from './CommandPrefix';

export const Input = ({
  currentPath,
  handleChange,
  handleKeyDown,
  handleKeyUp,
  handleSubmit,
  inputValue,
  prefix,
  readOnly,
  typePassword,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    inputRef.current.focus();

    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  const handleClickOutside = (event) => {
    if (inputRef && !inputRef.current.contains(event.target)) {
      event.preventDefault();
    }
  };

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit}>
        <CommandPrefix path={currentPath} prefix={prefix} value={inputValue} readOnly />
        <input
          aria-label="terminal-input"
          autoComplete="none"
          autoCapitalize="none"
          autoCorrect="off"
          type={typePassword ? 'password' : 'text'}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          readOnly={readOnly}
          ref={inputRef}
        />
      </form>
    </div>
  );
};

Input.propTypes = {
  currentPath: PropTypes.string,
  handleChange: PropTypes.func,
  handleKeyDown: PropTypes.func,
  handleKeyUp: PropTypes.func,
  handleSubmit: PropTypes.func,
  inputValue: PropTypes.string,
  prefix: PropTypes.string,
  readOnly: PropTypes.bool,
  typePassword: PropTypes.bool,
};

export default Input;
