import * as React from 'react';
import { connect } from 'react-redux';
import { SET_SOCKET, CREATE_ROOM } from '../store';
import Websocket from 'react-websocket';

const socket = new Websocket({ url: 'ws://localhost:8000/ws' });

type Props = {};

class TitleScreen extends React.Component<Props> {
  componentDidMount() {
    this.props.set_socket(socket);
  }

  createRoom = () => {
    this.props.create_room({ CODE: 'xlrt' });
    this.props.history.push('/lobby')
  }

  joinRoom = () => {
    this.props.history.push('/join')
  }

  render() {

    return (
      <div className="title-screen screen">
        <h1 className="title">Soul Caster</h1>
        <div className="buttons">
          <button className="button create-room-button" type="button" onClick={ this.createRoom }>Create Room</button>
          <button className="button join-room-button" type="button" onClick={ this.joinRoom }>Join Room</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    set_socket: socket => {
      dispatch({ type: SET_SOCKET, socket });
    },
    create_room: data => {
      dispatch({ type: CREATE_ROOM, code: data.CODE });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedTitleScreen = connect(mapStateToProps, mapDispatchToProps)(TitleScreen);
export default ConnectedTitleScreen;