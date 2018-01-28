import * as React from 'react';
import { connect } from 'react-redux';
import './index.css';

class RgeModal extends React.Component<Props, State> {

  pay = () => {
    this.props.socket.send(JSON.stringify({ op: 'RGE_PAID', payload : { id : this.props.id } }));
  }

  decline = () => {
    this.props.socket.send(JSON.stringify({ op: 'RGE_DECLINED', payload : { id : this.props.id } }));
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

const mapStateToProps = (state) => state;
const ConnectedRgeModal = connect(mapStateToProps)(RgeModal);
export default ConnectedRgeModal;