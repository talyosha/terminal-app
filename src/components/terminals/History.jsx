import React from 'react';
import PropTypes from 'prop-types';
import Input from '../inputs/Input';
import { COMMAND_RESULT_ERROR, COMMAND_RESULT_NOTHING, COMMAND_RESULT_WAIT } from '../../helpers/constants';

const CommandResult = (props) => {
  const { result, error } = props;

  if (result === COMMAND_RESULT_NOTHING) return null;

  if (result === COMMAND_RESULT_ERROR)
    return error.split('\n').map((item, i) => {
      return (
        <p className="command-result" key={i}>
          {item}
        </p>
      );
    });

  return (
    <div>
      {result === COMMAND_RESULT_WAIT ? (
        <p className="command-result" />
      ) : (
        result.split('\n').map((item, i) => {
          return (
            <p className="command-result" key={i}>
              {item}
            </p>
          );
        })
      )}
    </div>
  );
};

CommandResult.propTypes = {
  result: PropTypes.string,
  error: PropTypes.bool,
};

const OneHistoryItem = (props) => {
  const { path, value, result, error } = props.command;

  return (
    <li>
      <Input currentPath={path} inputValue={value} readOnly />
      <CommandResult result={result} error={error} />
    </li>
  );
};

OneHistoryItem.propTypes = {
  command: PropTypes.shape({
    path: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    error: PropTypes.bool,
  }),
};

export const History = (props) => {
  const { history } = props;

  return (
    <div className="history-container">
      <ul aria-label="terminal-history">
        {history.map((command) => (
          <OneHistoryItem key={command.id} command={command} />
        ))}
      </ul>
    </div>
  );
};

History.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    })
  ),
};

export default History;
