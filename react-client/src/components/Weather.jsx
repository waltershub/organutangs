import React from 'react';
import Skycons from 'react-skycons';
import convertIcons from '../convertIcons.js'

class Weather extends React.Component {
  constructor(props){
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
      <div className="weatherBox">
        <h1 className="sub-title">WEATHER DATA</h1>
        <div className="weatherData">
          <img src={this.props.icon} />
          <div>{this.props.temp}</div>
          <div>{this.props.summary}</div>
        </div>
      </div>
    );
  }
}

export default Weather;
