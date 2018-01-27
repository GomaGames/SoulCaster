import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GameScreen from './GameScreen';
import JoinRoomScreen from './JoinRoomScreen';
import LobbyScreen from './LobbyScreen';
import TitleScreen from './TitleScreen';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Route exact path="/" component={TitleScreen} />
      <Route path="/lobby" component={LobbyScreen}/>
      <Route path="/join" component={JoinRoomScreen}/>
      <Route path="/game" component={GameScreen}/>
    </App>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
