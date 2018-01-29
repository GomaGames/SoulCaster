import * as React from 'react';
import { connect } from 'react-redux';
import './index.css';

class RgeModal extends React.Component<Props, State> {

  pay = () => {
    const payload = new String(this.props.id);
    this.props.socket.send(JSON.stringify({ op: 'RGE_PAID', payload }));
  }

  decline = () => {
    const payload = new String(this.props.id);
    this.props.socket.send(JSON.stringify({ op: 'RGE_DECLINED', payload }));
  }

  render() {
    return <div className='rge-modal-bg'><div className='rge-modal'>
      <p>{this.props.text}</p>
      <div className='rge-button-container'>
        <button className='button rge-modal-decline-button' onClick={this.decline}>
          No Thanks
        </button>
        <button className='button rge-modal-pay-button' onClick={this.pay}>
          Pay
        </button>
      </div>
    </div></div>;
  }
}

const mapStateToProps = (state) => state;
const ConnectedRgeModal = connect(mapStateToProps)(RgeModal);
export default ConnectedRgeModal;
