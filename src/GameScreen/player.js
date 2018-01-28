import * as React from 'react';
import { AnimationFrame } from './';
import './index.css';

const Player = ({
  number,
  playerNumber,
  characterSrc,
  animationFrame,
  opponentAnimationFrame,
  weaponSrc
}) => {
  const componentClassNames = ['player', `player-${number}`];
  let weapon = '';
  if( number === playerNumber ){ // self
    characterSrc = characterSrc[animationFrame][`color${number}`];
    if( animationFrame === AnimationFrame.ATTACK ){
      componentClassNames.push(`player-${number}-attack`);
      weapon = <img className="attack-weapon" src={ weaponSrc } alt="weapon"/>;
    } else if( animationFrame === AnimationFrame.HIT ){
      componentClassNames.push(`player-${number}-hit`) 
    }
  } else { // opponent
    characterSrc = characterSrc[opponentAnimationFrame][`color${number}`];
    if( opponentAnimationFrame === AnimationFrame.ATTACK ){
      componentClassNames.push(`player-${number}-attack`) 
      weapon = <img className="attack-weapon" src={ weaponSrc } alt="weapon"/>;
    } else if( opponentAnimationFrame === AnimationFrame.HIT ){
      componentClassNames.push(`player-${number}-hit`) 
    }
  }


  return <div className={componentClassNames.join(' ')}>
    <img src={ characterSrc } alt="player" />
    { weapon }
  </div>;
};
export default Player;