import React from 'react';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillReceiveProps() {
  // }
  componentDidMount() {
  }

  render() {
    return (
      <div className='title'>
        <div className="nameTitle">HALFWAZE</div>
        <img className={this.props.spin} src="images/icon.png"/>
      </div>
    )    
  }
}

export default Title;