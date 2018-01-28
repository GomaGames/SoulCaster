import * as React from 'react';
import { connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { throttle } from 'lodash';
import { RECEIVE_ATTACK } from '../store';
import Player from './player';
import './index.css';

// Levels > Res > States??
const characters = {
  level3: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-idle-high.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-idle-high.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-attack-high.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-attack-high.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-hit-high.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-hit-high.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-idle-med.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-idle-med.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-attack-med.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-attack-med.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-hit-med.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-hit-med.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-idle-medlo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-idle-medlo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-attack-medlo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-attack-medlo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-hit-medlo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-hit-medlo.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-idle-lo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-idle-lo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-attack-lo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-attack-lo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard-level3-color1-hit-lo.png',
        color2: '/assets/characters/wizard_3/wizard-level3-color2-hit-lo.png'
      }
    }
  },
  level2: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-idle-high.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-idle-high.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-attack-high.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-attack-high.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-hit-high.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-hit-high.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-idle-med.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-idle-med.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-attack-med.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-attack-med.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-hit-med.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-hit-med.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-idle-medlo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-idle-medlo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-attack-medlo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-attack-medlo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-hit-medlo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-hit-medlo.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-idle-lo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-idle-lo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-attack-lo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-attack-lo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard-level2-color1-hit-lo.png',
        color2: '/assets/characters/wizard_2/wizard-level2-color2-hit-lo.png'
      }
    }
  },
  level1: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-idle-high.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-idle-high.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-attack-high.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-attack-high.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-hit-high.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-hit-high.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-idle-med.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-idle-med.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-attack-med.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-attack-med.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-hit-med.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-hit-med.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-idle-medlo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-idle-medlo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-attack-medlo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-attack-medlo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-hit-medlo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-hit-medlo.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-idle-lo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-idle-lo.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-attack-lo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-attack-lo.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard-level1-color1-hit-lo.png',
        color2: '/assets/characters/wizard_1/wizard-level1-color2-hit-lo.png'
      }
    }
  }
}

const buttons = {
  broomstick: '/assets/weapons/weapon-broomstick-button.png',
  stick: '/assets/weapons/weapon-stick-button.png',
}
const weapons = {
  staff: {
    high: '/assets/weapons/weapon-staff-high.png'
  },
  stick: {
    high: '/assets/weapons/weapon-stick-high.png'
  }
}
const icons = {
  heart: {
    high: '/assets/icons/icon-heart-high.png',
    med: '/assets/icons/icon-heart-med.png',
    medlo: '/assets/icons/icon-heart-medlo.png',
    lo: '/assets/icons/icon-heart-lo.png'
  },
  coin: {
    high: '/assets/icons/icon-coin-high.png',
    med: '/assets/icons/icon-coin-med.png',
    medlo: '/assets/icons/icon-coin-high.png',
    lo: '/assets/icons/icon-coin-lo.png'
  }
}

type State = {
  money: number,
  health: number,
  income: number
}

export const AnimationFrame = {
  IDLE : "idle",
  ATTACK : "attack",
  HIT : "hit"
}

class GameScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.attack = throttle(this.attack,1000);
  }

  componentDidMount() {
    // uncomment when done working with characters and ui
    if( this.props.socket === null ) return;

    this.props.socket.addEventListener('message', event => {
      const { op, payload } = JSON.parse(event.data);
      const { health } = JSON.parse(payload);
      switch(op) {
        case 'RECEIVE_ATTACK':
          this.hit(health);
          break;
      }
    });
  }

  state = {
    money: this.props.money,
    health: this.props.health,
    income: this.props.income,
    animationFrame: AnimationFrame.IDLE,
    opponentAnimationFrame: AnimationFrame.IDLE
  }

  hit(health) {
    // trigger self animation
    this.setState({
      animationFrame: AnimationFrame.HIT,
      health
    });
    setTimeout(() => this.setState({animationFrame: AnimationFrame.IDLE}), 350);

    // trigger other player animation
    this.setState({
      opponentAnimationFrame: AnimationFrame.ATTACK
    });
    setTimeout(() => this.setState({opponentAnimationFrame: AnimationFrame.IDLE}), 300);
  }

  attack() {
    // uncomment when done working with characters and ui
    this.props.socket.send(JSON.stringify({ op: 'ATTACK' }));

    // trigger self animation
    this.setState({ animationFrame: AnimationFrame.ATTACK });
    setTimeout(() => this.setState({animationFrame: AnimationFrame.IDLE}), 300);

    // trigger other player animation
    this.setState({
      opponentAnimationFrame: AnimationFrame.HIT
    });
    setTimeout(() => this.setState({opponentAnimationFrame: AnimationFrame.IDLE}), 350);
  }

  render() {
    // uncomment when done working with characters and ui
    if(this.props.socket === null) return <Redirect to='/' />;

    let weaponCost = 200; //remove this when implemented. used to "disable" weapon button
    let res = 'high'; //remove this when resolution implemented.
    let playerNumber = this.props.playerNumber;

    // dev
    // playerNumber = 1;

    return (
      <div className={ res +  " game-screen screen" }>
        <div className="players">
          <div className="health-container">
            <div className="player-1">
              <div className="life-counter">
                <img className="icon-heart icon" src={ icons.heart.high } alt="icon-heart"/>
                <p className="health player1-health">{ this.state.health }</p>
              </div>
              <p className="player-marker">{ playerNumber === 1 ? 'You' : ''}</p>
            </div>
            <div className="player-2">
              <div className="life-counter">
                <img className="icon-heart icon" src={ icons.heart.high } alt="icon-heart"/>
                <p className="health player2-health">{ this.state.health }</p>
              </div>
              <p className="player-marker">{ playerNumber === 2 ? 'You' : ''}</p>
            </div>
          </div>
          <Player 
            number={1}
            playerNumber={playerNumber} 
            characterSrc={ characters.level3[res] }
            animationFrame={this.state.animationFrame}
            opponentAnimationFrame={this.state.opponentAnimationFrame}
            weaponSrc={ weapons.stick.high } />
          <Player 
            number={2}
            playerNumber={playerNumber} 
            characterSrc={ characters.level3[res] }
            animationFrame={this.state.animationFrame}
            opponentAnimationFrame={this.state.opponentAnimationFrame}
            weaponSrc={ weapons.stick.high } />
        </div>
        <div className="game-ui">
          <div className="money">
            <img className="icon-coin icon" src={ icons.coin.high } alt="icon-coin"/>
            <p>{ this.state.money } <span>+3.13/s</span></p>
          </div>
          <div className="weapons">
            <div className={ this.state.money < weaponCost ? 'weapon disabled' : 'weapon' }>
              <div className="weapon-image">
                <img src={ buttons.stick } alt="weapon"/>
              </div>
              <div className="weapon-cost">
                <img className="icon-coin icon" src={ icons.coin.high } alt="icon-coin"/>
                <p>200</p>
              </div>
            </div>
            <div className={ this.state.money < weaponCost ? 'weapon disabled' : 'weapon' }>
              <div className="weapon-image">
                <img src={ buttons.broomstick } alt="weapon"/>
              </div>
              <div className="weapon-cost">
                <img className="icon-coin icon" src={ icons.coin.high } alt="icon-coin"/>
                <p>200</p>
              </div>
            </div>
          </div>
          <button className="attack-button" type="button" onClick={ this.attack.bind(this) }>Attack</button>
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
