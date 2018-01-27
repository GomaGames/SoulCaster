import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.css';
import { JOIN_ROOM } from '../store';

type State = {
  code: string, //?
  invalidCode: boolean
};

class JoinRoomScreen extends React.Component<Props, State> {

  state = {
    code: '',
    invalidCode: false
  }

	join = (event: SyntheticEvent<HTMLButtonElement>) => {
    (event.currentTarget: HTMLButtonElement);

    if(this.state.code === 'xlrt') {
      this.props.history.push('/lobby');
      let data = { CODE: this.state.code, PLAYER_NUMBER: 2 };
      this.props.join_room(data)
    } else {
      this.setState({ invalidCode: true });
    }
  }

  setCode = (e) => {
    this.setState({ invalidCode: false });
    this.setState({ code: e.target.value });
  }

  render() {
    let content = null;
    let errorMessage = null;

    if(this.state.invalidCode) {
      errorMessage = <p className="error-message">That code is incorrect!</p>
    }

    if(this.state.code.length === 4) {
      content = <div>
        <div className="code">
          <input value={ this.state.code } onChange={ this.setCode.bind(this) } />
          { errorMessage }
        </div>
        <button className="button join-button" type="button" onClick={ this.join }>Join</button>
      </div>
    } else {
      content = <div>
        <p>Enter code from Player 1:</p>
        <div className="code">
          <input placeholder="Enter Code Here" onChange={ this.setCode.bind(this) } />
        </div>
      </div>
    }

    return (
    	<div className="join-room-screen screen">
    		<h1>Ready?</h1>
        <p className="subtitle">Looking for opponent...</p>
    		{ content }
        <Link className='exit-button' to='/'>&#8249; Exit</Link>
    	</div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    join_room: data => {
      dispatch({ type: JOIN_ROOM, code: data.CODE, player_number: data.PLAYER_NUMBER });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedJoinRoom = connect(mapStateToProps, mapDispatchToProps)(JoinRoomScreen);
export default ConnectedJoinRoom;