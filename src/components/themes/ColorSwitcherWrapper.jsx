import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ColorPalette from './ColorPalette';
import { defaultThemeClass } from '../../helpers/themes';

const ColorSwitcherWrapper = ({ children }) => {
  const getDefaultThemeClass = () =>
    localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : defaultThemeClass;

  const [theme, setTheme] = useState(getDefaultThemeClass);

  const setThemeWithReloadSave = (chosenTheme) => {
    localStorage.setItem('theme', chosenTheme);
    setTheme(chosenTheme);
  };

  return (
    <div className={`color-switcher ${theme}`}>
      {children}
      <ColorPalette setTheme={setThemeWithReloadSave} theme={theme} />
    </div>
  );
};

ColorSwitcherWrapper.propTypes = {
  children: PropTypes.element,
};

export default ColorSwitcherWrapper;
