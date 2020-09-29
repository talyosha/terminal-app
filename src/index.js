import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import TerminalAuth from './components/terminals/TerminalAuth';
import TerminalWrapper from './components/terminals/TerminalWrapper';
import ColorSwitcherWrapper from './components/themes/ColorSwitcherWrapper';

ReactDOM.render(
  <ColorSwitcherWrapper>
    <TerminalWrapper>
      <TerminalAuth />
    </TerminalWrapper>
  </ColorSwitcherWrapper>,
  document.getElementById('root')
);

serviceWorker.unregister();
