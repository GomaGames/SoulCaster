import * as React from 'react';

type Props = {};

class JoinRoomScreen extends React.Component<Props> {

	join = (event: SyntheticEvent<HTMLButtonElement>) => {
    (event.currentTarget: HTMLButtonElement);

    this.props.history.push('/lobby')
  }

  render() {

    return (
    	<div className="join-room-screen">
    		<h1>Join Room</h1>
    		<input type="text" placeholder="Room Code" />
    		<button className="button join-button" type="button" onClick={ this.join }>Join</button>
    	</div>
    );
  }
}

export default JoinRoomScreen;