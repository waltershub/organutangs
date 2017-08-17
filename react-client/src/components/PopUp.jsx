import React from 'react';
const io = require('socket.io-client');
const socket = io();

export default class PopUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Your Friend Wants to',
      message: 'Is that ok with you?',
    };
  }

  render() {
    return (
      <div
        className="popUp"
      >
        <div
          className="popUpText"
        >
          <p
            className="inputLable"
          >{`${this.state.title} `}{this.props.getMode()}</p>
          <p
            className="inputLable"
          >{this.state.message}</p>
        </div>
        <button
          onClick={() => {
            this.props.cb(true);
            this.props.display();
          }}
        >Yes</button>
        <button
          onClick={() => {
            this.props.cb(false);
            this.props.display();
          }}
        >Nah Yo</button>
      </div>
    );
  }
}
