import * as React from 'react';
import { connect } from 'react-redux';
import { SET_SOCKET, CREATE_ROOM } from '../store';
import './index.css';

const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`);

class TitleScreen extends React.Component<Props> {

  componentDidMount() {
    ws.addEventListener('open', this.setupSocket.bind(this));
  }

  setupSocket() {
    this.props.set_socket(ws);
    ws.addEventListener('message', event => {
      const { op, payload } = JSON.parse(event.data);

      switch(op) {
        case 'ROOM_CREATED':
          this.props.create_room(payload);
          this.props.history.push('/lobby');
          break;
      }
    });
  }

  createRoom = () => {
    let OP = 'CREATE_ROOM';
    ws.send(JSON.stringify({ op: "CREATE_ROOM" }));
    this.props.history.push('/lobby'); //remve this
  }

  joinRoom = () => {
    this.props.history.push('/join')
  }

  render() {

    return (
      <div className="title-screen screen">
        <div className="container">
          <div className="buttons bottom-buttons">
            <button className="button create-room-button" type="button" onClick={ this.createRoom }>Create Room</button>
            <button className="button join-room-button" type="button" onClick={ this.joinRoom }>Join Room</button>
          </div>
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
    create_room: code => {
      dispatch({ type: CREATE_ROOM, code });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedTitleScreen = connect(mapStateToProps, mapDispatchToProps)(TitleScreen);
export default ConnectedTitleScreen;