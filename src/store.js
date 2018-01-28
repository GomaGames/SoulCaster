import { createStore } from 'redux';
import RGE from './rge';

export const SET_SOCKET = 'SET_SOCKET';
export const JOIN_ROOM = 'JOIN_ROOM';
export const CREATE_ROOM = 'CREATE_ROOM';
export const PLAYER_JOINED = 'PLAYER_JOINED';
export const GAME_STARTED = 'GAME_STARTED';
export const RECEIVE_ATTACK = 'RECEIVE_ATTACK';
export const RGE_TRIGGERED = 'RGE_TRIGGERED';
export const RGE_ACTIVATE = 'RGE_ACTIVATE';

const initialState = {
  joined: false,
  room: null,
  playerNumber: null,
  code: null,
  socket: null,
  health: null,
  money: null,
  income: null,
  rge: null,
  resolution: 3
};

class Room {

  constructor(code) {
    this.state = {
      code
    }
  }
}

export const store = createStore((state = initialState, action) => {
  switch(action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket : action.socket
      };
    case CREATE_ROOM:
      return {
        ...state,
        code : action.code,
        room : new Room(action.code),
        playerNumber : 1
      };
    case JOIN_ROOM:
      return {
        ...state,
        code : action.code,
        room : new Room(action.code),
        playerNumber : 2
      };
    case PLAYER_JOINED:
      return {
        ...state,
        joined : true
      };
    case GAME_STARTED:
      return {
        ...state,
        health : action.health,
        money : action.money,
        income : action.income
      };
    case RECEIVE_ATTACK:
      return {
        ...state,
        health : action.health
      };
    case RGE_TRIGGERED:
      return {
        ...state,
        rge : RGE[action.id]
      };
    case RGE_ACTIVATE:
      if( RGE[action.id].effect.hasOwnProperty('resolution') ){
        return {
          ...state,
          resolution : state.resolution + RGE[action.id].effect.resolution
        };
      } else {
        return state;
      }
    default:
      return state;
  }
},
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);