import React from 'react';
import PropTypes from 'prop-types';

const CommandPrefix = (props) => {
  const { path, readOnly, value, prefix } = props;

  return (
    <>
      <span className="input-prompt">
        {readOnly || value} {prefix}
      </span>
      <span className="path">{path} </span>
    </>
  );
};

CommandPrefix.propTypes = {
  path: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  prefix: PropTypes.string,
};

export default CommandPrefix;
