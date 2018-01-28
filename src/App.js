import * as React from 'react';
import './App.css';

type Props = {
  children?: React.Node,
};

function App(props: Props) {
  return <div>{ props.children }</div>;
}


export default App;
