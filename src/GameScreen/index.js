import * as React from 'react';
import { connect} from 'react-redux';
import { RECEIVE_ATTACK } from '../../store';
import './index.css';

type State = {
  money: number,
  health: number,
  income: number
}

class GameScreen extends React.Component<Props, State> {

  onComponentDidMount() {
    this.props.socket.addEventListener('message', function(data) {
      switch(data.op) {
        case 'RECEIVE_ATTACK':
          // trigger animation
          this.setState({
            health: data.health
          });
          break;
      }
    });
  }

  state = {
    money: this.props.money || 0,
    health: this.props.health || 1000,
    income: this.props.income || 0
  }

  attack = () => {
    this.props.socket.send(JSON.stringify({ op: 'ATTACK' }));
  }

  render() {
    return (
      <div className="game-screen screen">
        <div className="players">
          <div className="player player-1">
            <div className="health-container">
              <p className="health">{ this.state.health }</p>
              <p>{ this.props.playerNumber === 1 ? 'You' : 'You'}</p>
            </div>
          </div>
          <div className="player player-2">
            <div className="health-container">
              <p className="health">{ this.state.health }</p>
              <p>{ this.props.playerNumber === 2 ? 'You' : ''}</p>
            </div>
          </div>
        </div>
        <div className="game-ui">
          <p className="money">{ this.state.money } <span>+3.13/s</span></p>
          <div className="weapons">
            <div className="weapon">200</div>
            <div className="weapon">380</div>
          </div>
          <button className="attack-button" type="button attack-button" onClick={ this.attack }>Attack</button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   receive_attack: health => {
      dispatch({ type: RECEIVE_ATTACK, health });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedGameScreen = connect(mapStateToProps, mapDispatchToProps)(GameScreen);
export default ConnectedGameScreen;