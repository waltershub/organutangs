import React from 'react';

export default class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillReceiveProps() {
  // }

  render() {
    return (
      <div className='title'>
        <div className="nameTitle">HALFWAZE</div>
        <img className="logo spin" src="images/icon.png"/>
      </div>
    )    
  }
}


