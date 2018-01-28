import * as React from 'react';
import { connect } from 'react-redux';
import { SET_SOCKET, CREATE_ROOM } from '../store';

const ws = new WebSocket(`ws://${window.location.host}/ws`);

class TitleScreen extends React.Component<Props> {

  componentDidMount() {
    ws.addEventListener('open', this.setupSocket.bind(this));
  }

  setupSocket() {
    this.props.set_socket(ws);
    ws.addEventListener('message', function(data) {
      console.log(data)
      switch(data.op) {
        case 'ROOM_CREATES':
          this.props.create_room({ code: data.playload });
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
          <h1 className="title">Soul Caster</h1>
          <div className="buttons">
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
    create_room: data => {
      dispatch({ type: CREATE_ROOM, code: data.code });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedTitleScreen = connect(mapStateToProps, mapDispatchToProps)(TitleScreen);
export default ConnectedTitleScreen;