import React from 'react';
import convertIcons from '../convertIcons.js';

class Weather extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayMessage: '',
    };
    //this.displayWeatherData = this.displayWeatherData.bind(this)
  }

  // displayWeatherData() {
  //   var display = 'Today is a ' + this.state.currentSummary.toLowerCase() + ' day.';
  //   if (this.state.currentTemp < 69) {
  //     display += ' The current temperature is ' + this.state.currentTemp + ' degrees F. You may want to wear a jacket cus its brick out here fam. '
  //   }
  //   return display
  // }


  render() {
    return (
      <div className="weatherBox" style={{transition: 'all .3s ease-out', transform: 'scale(' + this.props.scale + ')'}}>
        <h1 className="sub-title">WEATHER</h1>
        <div className="weatherData">
          <div className="weatherIS">
            <div className="weatherIcon">
              <img src={this.props.icon} />
            </div>
            <div>{this.props.summary}</div>
          </div>
          <div className="weatherNumerical">
            <div className="weatherNumericalEntry">Temperature: {this.props.temp}°F</div>
            <div className="weatherNumericalEntry">Humidity: {Math.round(this.props.humidity * 100)}%</div>
            <div className="weatherNumericalEntry">Precipitation: {this.props.precipProbability}%</div>
            <div className="weatherNumericalEntry">Wind Speed: {this.props.windSpeed} mph</div>
            <div className="weatherNumericalEntry">UV Index: {this.props.uv} of 10</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
