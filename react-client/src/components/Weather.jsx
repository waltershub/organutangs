import React from 'react';
//import Skycons from 'react-skycons';
import convertIcons from '../convertIcons.js';

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
    console.log("The state is ", this.state.currentTemp);
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
      <div className="weatherBox slideIn" style={{transition: 'all .3s ease-out', transform: 'scale(' + this.props.scale + ')'}}>
        <h1 className="sub-title">WEATHER</h1>
        <div className="weatherData">
          <div className="weatherNumerical">
            <img src={this.props.icon} />
            <div>{this.props.summary}</div>
          </div>
            <div>{this.props.temp}</div>
        </div>
      </div>
    );
  }
}

export default Weather;
