import * as React from 'react';
import { connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RECEIVE_ATTACK } from '../store';
import './index.css';

// Levels > Res > States??
const characters = {
  level3: {
    high: {
      idle: {
        color1: '/assets/wizard-level3-color1-idle-high.png',
        color2: '/assets/wizard-level3-color2-idle-high.png'
      },
      attack: {
        color1: '/assets/wizard-level3-color1-attack-high.png'
        // color2: '/assets/wizard-level3-color2-attack-high.png'
      },
      hit: {
        color1: '/assets/wizard-level3-color1-hit-high.png'
        // color2: '/assets/wizard-level3-color2-hit-high.png'
      }
    }
  }
}

const weapons = {
  weapon_stick_button_high: '/assets/weapon-stick-button-high.png',
  weapon_broomstick_button_high: '/assets/weapon-broomstick-button-high.png'
}
const icons = {
  heart_high: '/assets/icon-heart-high.png',
  coin_high: '/assets/icon-coin-high.png'
}

type State = {
  money: number,
  health: number,
  income: number
}

class GameScreen extends React.Component<Props, State> {

  componentDidMount() {
    // uncomment when done working with characters and ui
    // if( this.props.socket === null ) return;

    // this.props.socket.addEventListener('message', function(data) {
    //   switch(data.op) {
    //     case 'RECEIVE_ATTACK':
    //       // trigger animation
    //       this.setState({
    //         health: data.health
    //       });
    //       break;
    //   }
    // });
  }

  state = {
    money: this.props.money,
    health: this.props.health,
    income: this.props.income
  }

  attack = () => {
    this.props.socket.send(JSON.stringify({ op: 'ATTACK' }));
  }

  render() {
    // uncomment when done working with characters and ui
    // if(this.props.socket === null) return <Redirect to='/' />;
    
    return (
      <div className="game-screen screen">
        <div className="players">
          <div className="health-container">
            <div className="player-1">
              <img className="icon-heart icon" src={ icons.heart_high }/>
              <p className="health player1-health">{ this.state.health }</p>
              <p>{ this.props.playerNumber === 1 ? 'You' : ''}</p>
            </div>
            <div className="player-2">
              <img className="icon-heart icon" src={ icons.heart_high }/>
              <p className="health player2-health">{ this.state.health }</p>
              <p>{ this.props.playerNumber === 2 ? 'You' : ''}</p>
            </div>
          </div>
          <div className="player player-1">
            <img src={ characters.level3.high.idle.color1 } />
          </div>
          <div className="player player-2">
            <img src={ characters.level3.high.idle.color2 } />
          </div>
        </div>
        <div className="game-ui">
          <div className="money">
            <img className="icon-coin icon" src={ icons.coin_high } />
            <p>{ this.state.money } <span>+3.13/s</span></p>
          </div>
          <div className="weapons">
            <div className="weapon">
              <div className="weapon-image">
                <img src={ weapons.weapon_stick_button_high } />
              </div>
              <div className="weapon-cost">
                <img className="icon-coin icon" src={ icons.coin_high } />
                <p>200</p>
              </div>
            </div>
            <div className="weapon disabled">
              <div className="weapon-image">
                <img src={ weapons.weapon_broomstick_button_high } />
              </div>
              <div className="weapon-cost">
                <img className="icon-coin icon" src={ icons.coin_high } />
                <p>200</p>
              </div>
            </div>
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
