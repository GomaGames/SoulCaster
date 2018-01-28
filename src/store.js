import { createStore } from 'redux';

export const SET_SOCKET = 'SET_SOCKET';
export const JOIN_ROOM = 'JOIN_ROOM';
export const CREATE_ROOM = 'CREATE_ROOM';
export const PLAYER_JOINED = 'PLAYER_JOINED';

const initialState = {
  joined: false,
  room: null,
  code: null,
  socket: null,
  playerNumber: null
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
    case `${SET_SOCKET}`:
      state.socket = action.socket;
      return state;
    case `${CREATE_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      state.playerNumber = 1;
      return state;
    case `${JOIN_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      state.playerNumber = 2;
      return state;
    case `${PLAYER_JOINED}`:
      state.joined = true;
      return state;
    default:
      return state;
  }
});
