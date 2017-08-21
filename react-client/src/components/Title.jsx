import React from 'react';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillReceiveProps() {
  // }
  componentDidMount() {
    console.log('THE PROPS IN TITLE COMPONENT: ', this.props)
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