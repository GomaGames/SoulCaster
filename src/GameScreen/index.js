import * as React from 'react';
import { connect} from 'react-redux';

type Props = {};

class GameScreen extends React.Component<Props> {
  render() {

    return <h1>Game</h1>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   
  };
};

const mapStateToProps = (state) => state;
const ConnectedGameScreen = connect(mapStateToProps, mapDispatchToProps)(GameScreen);
export default ConnectedGameScreen;