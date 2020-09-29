import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import History from './History';
import Input from '../inputs/Input';
import '../../assets/scss/Terminal.scss';
import { disconnectSocket, listenSocket, sendCommand } from '../../socket';
import { COMMAND_RESULT_NOTHING, COMMAND_RESULT_WAIT } from '../../helpers/constants';
import InputScrollWrapper from '../inputs/InputWrapper';

class Terminal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentCommandId: 0,
      currentPath: '~',
      history: [],
      historyCommands: [],
      commandsHistoryIndex: -1,
      value: '',
    };
  }

  componentDidMount() {
    listenSocket('response', ({ result, id }) => this.setResult(result, id));
    listenSocket('errorResponse', ({ error, id }) => this.setResult(error, id));

    listenSocket('path', ({ path }) => {
      this.setState({
        currentPath: path,
      });
    });
  }

  setResult = (result, id) => {
    this.setState((prev) => ({
      history: prev.history.map((item) =>
        item.id === id ? { ...item, result: item.result === COMMAND_RESULT_WAIT ? result : item.result + result } : item
      ),
    }));
  };

  componentWillUnmount() {
    disconnectSocket();
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleUpArrowKeyPress = () => {
    const { commandsHistoryIndex } = this.state;

    if (commandsHistoryIndex < 0) return;

    if (commandsHistoryIndex === 0) {
      this.setState((prev) => ({
        value: prev.historyCommands[prev.commandsHistoryIndex],
      }));
    }

    if (commandsHistoryIndex > 0) {
      this.setState((prev) => ({
        commandsHistoryIndex: prev.commandsHistoryIndex - 1,
        value: prev.historyCommands[prev.commandsHistoryIndex],
      }));
    }
  };

  handleDownArrowKeyPress = () => {
    const { commandsHistoryIndex, historyCommands } = this.state;
    const commandsLength = historyCommands.length;

    if (commandsHistoryIndex + 1 < commandsLength) {
      this.setState((prev) => ({
        commandsHistoryIndex: prev.commandsHistoryIndex + 1,
        value: prev.historyCommands[prev.commandsHistoryIndex + 1],
      }));
    }

    if (commandsHistoryIndex + 1 >= commandsLength) {
      this.setState({
        value: '',
      });
    }
  };

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 38:
        event.preventDefault();
        this.handleUpArrowKeyPress();
        break;
      case 40:
        event.preventDefault();
        this.handleDownArrowKeyPress();
        break;
      default:
        break;
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let commandResult;

    const { exit } = this.props;
    const { value, currentPath, currentCommandId } = this.state;

    const trimmedValue = value.trim();

    switch (trimmedValue) {
      case 'clear':
        this.goToNextLine('');
        this.clearViewHistory();
        this.saveCommandToHistory(trimmedValue);
        break;

      case 'exit':
        exit();
        break;

      case '':
        commandResult = COMMAND_RESULT_NOTHING;
        this.goToNextLine(commandResult);
        break;

      default:
        commandResult = COMMAND_RESULT_WAIT;
        this.saveCommandToHistory(trimmedValue);
        this.goToNextLine(commandResult);
        this.sendCommandToServer(currentPath, trimmedValue, currentCommandId);
        break;
    }
  };

  clearViewHistory = () => {
    this.setState({
      history: [],
    });
  };

  saveCommandToHistory = (command) => {
    this.setState((prev) => ({
      historyCommands: [...prev.historyCommands, command],
      commandsHistoryIndex: prev.historyCommands.length,
    }));
  };

  sendCommandToServer = (path, message, id) => sendCommand({ path, message, id });

  goToNextLine = (result) => {
    this.setState((prev) => ({
      currentCommandId: prev.currentCommandId + 1,
      history: [
        ...prev.history,
        {
          path: prev.currentPath,
          id: prev.currentCommandId,
          result,
          value: prev.value,
          error: false,
        },
      ],
      value: '',
    }));
  };

  render() {
    const { currentPath, history, value } = this.state;
    const { user } = this.props;

    return (
      <>
        <History history={history} />
        <InputScrollWrapper>
          <Input
            currentPath={currentPath}
            handleChange={this.handleChange}
            handleKeyDown={this.handleKeyDown}
            handleSubmit={this.handleSubmit}
            inputValue={value}
            prefix={user}
            autoFocus
          />
        </InputScrollWrapper>
      </>
    );
  }
}

Terminal.propTypes = {
  exit: PropTypes.func,
  user: PropTypes.string,
};

export default Terminal;
