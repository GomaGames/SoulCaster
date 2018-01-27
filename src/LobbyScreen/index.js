import * as React from 'react';

type Props = {};

class LobbyScreen extends React.Component<Props> {

  play = (event: SyntheticEvent<HTMLButtonElement>) => {
    (event.currentTarget: HTMLButtonElement);

    this.props.history.push('/game')
  }

  render() {

    return (
      <div className="lobby-screen">
        <h1>Waiting for Players</h1>
        <button className="button play-button" type="button" onClick={ this.play }>Play</button>
      </div>
    );
  }
}

export default LobbyScreen;