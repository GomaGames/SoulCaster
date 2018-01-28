import * as React from 'react';
import { connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { throttle } from 'lodash';
import { RECEIVE_ATTACK, RGE_TRIGGERED } from '../store';
import Player from './player';
import RgeModal from './rge_modal';
import './index.css';

// Levels > Res > States??
const characters = {
  level3: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_idle_res1.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_idle_res1.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_attack_res1.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_attack_res1.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_hit_res1.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_hit_res1.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_idle_res2.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_idle_res2.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_attack_res2.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_attack_res2.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_hit_res2.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_hit_res2.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_idle_res3.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_idle_res3.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_attack_res3.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_attack_res3.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_hit_res3.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_hit_res3.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_idle_res4.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_idle_res4.png'
      },
      attack: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_attack_res4.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_attack_res4.png'
      },
      hit: {
        color1: '/assets/characters/wizard_3/wizard_c_color1_hit_res4.png',
        color2: '/assets/characters/wizard_3/wizard_c_color2_hit_res4.png'
      }
    }
  },
  level2: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_idle_res1.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_idle_res1.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_attack_res1.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_attack_res1.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_hit_res1.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_hit_res1.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_idle_res2.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_idle_res2.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_attack_res2.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_attack_res2.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_hit_res2.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_hit_res2.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_idle_res3.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_idle_res3.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_attack_res3.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_attack_res3.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_hit_res3.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_hit_res3.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_idle_res4.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_idle_res4.png'
      },
      attack: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_attack_res4.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_attack_res4.png'
      },
      hit: {
        color1: '/assets/characters/wizard_2/wizard_b_color1_hit_res4.png',
        color2: '/assets/characters/wizard_2/wizard_b_color2_hit_res4.png'
      }
    }
  },
  level1: {
    high: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_idle_res1.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_idle_res1.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_attack_res1.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_attack_res1.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_hit_res1.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_hit_res1.png'
      }
    },
    med: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_idle_res2.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_idle_res2.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_attack_res2.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_attack_res2.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_hit_res2.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_hit_res2.png'
      }
    },
    medlo: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_idle_res3.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_idle_res3.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_attack_res3.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_attack_res3.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_hit_res3.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_hit_res3.png'
      }
    },
    lo: {
      idle: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_idle_res4.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_idle_res4.png'
      },
      attack: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_attack_res4.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_attack_res4.png'
      },
      hit: {
        color1: '/assets/characters/wizard_1/wizard_a_color1_hit_res4.png',
        color2: '/assets/characters/wizard_1/wizard_a_color2_hit_res4.png'
      }
    }
  }
}

const buttons = {
  broomstick: '/assets/weapons/weapon_broomstick_button_res1.png',
  stick: '/assets/weapons/weapon_stick_button_res1.png',
}
const weapons = {
  staff: {
    high: '/assets/weapons/weapon_staff_attack_res1.png',
    med: '/assets/weapons/weapon_staff_attack_res1.png',
    medlo: '/assets/weapons/weapon_staff_attack_res1.png',
    lo: '/assets/weapons/weapon_staff_attack_res1.png'
  },
  stick: {
    high: '/assets/weapons/weapon_stick_attack_res1.png',
    med: '/assets/weapons/weapon_stick_attack_res1.png',
    medlo: '/assets/weapons/weapon_stick_attack_res1.png',
    lo: '/assets/weapons/weapon_stick_attack_res1.png'
  },
  broomstick: {
    high: '/assets/weapons/weapon_broomstick_attack_res1.png',
    med: '/assets/weapons/weapon_broomstick_attack_res1.png',
    medlo: '/assets/weapons/weapon_broomstick_attack_res1.png',
    lo: '/assets/weapons/weapon_stick_broomattack_res1.png'
  }
}
const icons = {
  heart: {
    high: '/assets/icons/icon_heart_res1.png',
    med: '/assets/icons/icon_heart_res2.png',
    medlo: '/assets/icons/icon_heart_res3.png',
    lo: '/assets/icons/icon_heart_res4.png'
  },
  coin: {
    high: '/assets/icons/icon_coin_res1.png',
    med: '/assets/icons/icon_coin_res2.png',
    medlo: '/assets/icons/icon_coin_res3.png',
    lo: '/assets/icons/icon_coin_res4.png'
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
      switch(op) {
        case 'RGE_TRIGGERED':
          this.props.rge_triggered(JSON.parse(payload));
          break;
        case 'RECEIVE_ATTACK':
          const { health } = JSON.parse(payload);
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
        { this.props.rge !== null ?
          <RgeModal { ...this.props.rge } /> : ''
        }
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
    },
    rge_triggered: ({ id }) => {
      dispatch({ type: RGE_TRIGGERED, id });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedGameScreen = connect(mapStateToProps, mapDispatchToProps)(GameScreen);
export default ConnectedGameScreen;
