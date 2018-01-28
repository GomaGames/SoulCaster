import * as React from 'react';
import './index.css';

class RgeModal extends React.Component<Props, State> {
  componentDidMount() {

  }

  pay = () => {

  }

  decline = () => {

  }

  render() {
    return <div className='rge-modal'>
      <p>{this.props.text}</p>
      <div>
        <button className='rge-modal rge-modal-pay' onClick={this.pay}>
          Pay
        </button>
        <button className='rge-modal rge-modal-decline' onClick={this.decline}>
          Decline
        </button>
      </div>
    </div>;
  }
}
export default RgeModal;