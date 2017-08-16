import React from 'react';

class Weather extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      displayMessage: '',
      // currentTemp: this.props.initTemp,
      // currentSummary: this.props.initSummary,
      // currentIcon: this.props.initIcon,
    };
    //this.displayWeatherData = this.displayWeatherData.bind(this)
    this.handleWeather = this.handleWeather.bind(this);
  }

  // displayWeatherData() {
  //   var display = 'Today is a ' + this.state.currentSummary.toLowerCase() + ' day.';
  //   if (this.state.currentTemp < 69) {
  //     display += ' The current temperature is ' + this.state.currentTemp + ' degrees F. You may want to wear a jacket cus its brick out here fam. '
  //   }
  //   return display
  // }
  
  handleWeather() {
    console.log("The state is ", this.state.currentTemp)
    // this.setState({currentTemp: this.props.initTemp})
    // this.setState({currentSummary: this.props.initSummary})
    // this.setState({currentIcon: this.props.initIcon})
  }
  componentDidMount() {
    //this.displayWeatherData();
    // this.handleWeather();
  }

  render() {
    return (
      <div>
        <h1>WEATHER DATA</h1>
        <div>hi{this.props.temp}</div>
        <div>hi{this.props.summary}</div>
        <div>hi{this.props.icon}</div>
      </div>
    );
  }
}

export default Weather;