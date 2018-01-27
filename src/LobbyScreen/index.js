import * as React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

type Props = {
  player2: Object
};

class LobbyScreen extends React.Component<Props> {

  startGame = (event: SyntheticEvent<HTMLButtonElement>) => {
    (event.currentTarget: HTMLButtonElement);

    this.props.history.push('/game')
  }

  render() {
    let content = null;

    if(this.props.player) {
      content = <button className="button start-game-button" type="button" onClick={ this.startGame }>Start Game</button>
    } else {
      content = <div>
        <p>Tell your opponent this code:</p>
        <div className="code">
          <p>XLRT</p>
        </div>
      </div>
    }

    return (
      <div className="lobby-screen screen">
        <h1>Ready?</h1>
        <p className="subtitle">{ this.props.player2 ? 'It\'s time for battle!' : 'Waiting for Player 2...' }</p>
        { content }
        <Link className='exit-button' to='/'>&#8249; Exit</Link>
      </div>
    );
  }
}

export default LobbyScreen;