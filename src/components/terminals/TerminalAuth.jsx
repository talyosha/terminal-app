import React, { PureComponent } from 'react';
import Terminal from './Terminal';
import Input from '../inputs/Input';
import { disconnectSocket, joinSocket, listenSocket } from '../../socket';
import defaultAuthQuestions from '../../helpers/default-auth-questions';
import { messages } from '../../helpers/constants';

class TerminalAuth extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: false,
      authenticated: false,
      error: false,
      questionHistory: defaultAuthQuestions,
      value: '',
      questionIndex: 0,
    };
  }

  componentDidMount() {
    listenSocket('ready', () => {
      this.setState({
        authenticated: true,
      });
    });

    listenSocket('end', () => {
      this.setState({
        authenticated: false,
      });
    });

    listenSocket('authError', () => {
      this.setState({
        authenticated: false,
        error: messages.authError,
        questionHistory: defaultAuthQuestions,
        value: '',
        questionIndex: 0,
        readOnly: false,
      });
    });
  }

  exitConnection = () => {
    disconnectSocket();
    this.setState({
      authenticated: false,
      questionHistory: defaultAuthQuestions,
      value: '',
      questionIndex: 0,
      readOnly: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.state.value) return;

    this.setState(
      (prev) => ({
        value: '',
        questionHistory: prev.questionHistory.map((question, index) =>
          prev.questionIndex === index ? { ...question, value: prev.value, isCompleted: true } : question
        ),
        questionIndex: prev.questionIndex + 1,
      }),
      this.checkIfReadyAuthData
    );
  };

  checkIfReadyAuthData = () => {
    const { questionIndex, questionHistory } = this.state;

    if (questionIndex !== questionHistory.length) return;

    const authData = questionHistory.reduce(
      (accumulator, current) => ({ ...accumulator, [current.name]: current.value }),
      {}
    );

    joinSocket(authData);

    this.setState({
      readOnly: true,
      value: '',
      questionHistory: [{ question: messages.waitAuth }],
      questionIndex: 0,
      error: false,
    });
  };

  render() {
    const { authenticated, value, readOnly, questionHistory, questionIndex, error } = this.state;
    const { question, name } =
      questionHistory.length !== questionIndex ? questionHistory[questionIndex] : questionIndex - 1;

    if (authenticated) return <Terminal user="" exit={this.exitConnection} />;

    const showError = error ? <p className="error">{error}</p> : null;

    return (
      <>
        {showError}
        <Input
          typePassword={name === 'password'}
          inputValue={value}
          prefix={question}
          readOnly={readOnly}
          handleChange={(e) => this.setState({ value: e.target.value })}
          handleSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default TerminalAuth;
