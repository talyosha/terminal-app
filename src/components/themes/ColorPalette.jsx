import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { themes } from '../../helpers/themes';

const ColorPalette = (props) => {
  const { theme, setTheme } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      addEvents();
    }

    return () => removeEvents();
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const handleDocumentClick = (e) => (containerRef && containerRef.current.contains(e.target) ? null : toggle());

  const changeThemeColor = (color) => {
    setTheme(color);
    toggle();
  };

  const addEvents = () =>
    ['click', 'touchstart'].forEach((event) => document.addEventListener(event, handleDocumentClick, true));
  const removeEvents = () =>
    ['click', 'touchstart'].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));

  return (
    <div ref={containerRef} className={`theme-colors ${isOpen ? 'shown' : ''}`}>
      <div>
        {themes.map((oneTheme) => (
          <div className="color-choose" key={oneTheme.class} onClick={() => changeThemeColor(oneTheme.class)}>
            <span className={`theme-color ${oneTheme.class} ${oneTheme.class === theme ? 'active' : ''}`}>
              <span />
            </span>
            <p>{oneTheme.name}</p>
          </div>
        ))}
      </div>

      <span className="theme-button" onClick={toggle} />
    </div>
  );
};

ColorPalette.propTypes = {
  setTheme: PropTypes.func,
  theme: PropTypes.string,
};

export default ColorPalette;
