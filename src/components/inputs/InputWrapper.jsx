import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const InputScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [children]);

  return <div ref={scrollRef}>{children}</div>;
};

InputScrollWrapper.propTypes = {
  children: PropTypes.element,
};

export default InputScrollWrapper;
