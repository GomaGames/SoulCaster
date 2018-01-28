import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PLAYER_JOINED, GAME_STARTED } from '../store';
import './index.css';

class LobbyScreen extends React.Component<Props, State> {

  componentDidMount() {
    if( this.props.socket === null ) return;

    // if(this.props.code === null) {
    //   this.props.history.push('/');
    // }

    this.props.socket.addEventListener('message', event => {
      const { op, payload } = JSON.parse(event.data);
      switch(op) {
        case 'PLAYER_JOINED':
          this.props.player_joined(true);
          break;
        case 'GAME_STARTED':
          this.props.game_started(payload);
          this.props.history.push('/game');
          break;
        default:
          break;
      }
    });
  }

  startGame = () => {
    this.props.socket.send(JSON.stringify({ op: 'START_GAME' }));
  }

  render() {
    if(this.props.socket === null) return <Redirect to='/' />;

    let content = null;

    if(this.props.joined) {
      content = <button className="button start-game-button" type="button" onClick={ this.startGame }>Start Game</button>
    } else {
      content = <div>
        <p>Tell your opponent this code:</p>
        <div className="code">
          <p>{ this.props.code }</p>
        </div>
      </div>
    }

    return (
      <div className={ this.props.playerNumber === 2 ? "player2 lobby-screen screen" : "lobby-screen screen" } >
        <div className="container">
          <h1>Ready?</h1>
          <p className="subtitle">{ this.props.player2 ? 'It\'s time for battle!' : 'Waiting for Player 2...' }</p>
          { content }
          <Link className='exit-button' to='/'>&#8249; Exit</Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    player_joined: joined => {
      dispatch({ type: PLAYER_JOINED, joined });
    },
    game_started: ({ health, money, income }) => {
      dispatch({ type: GAME_STARTED, health, money, income });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedLobbyScreen = connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
export default ConnectedLobbyScreen;