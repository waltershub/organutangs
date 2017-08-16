import React from 'react';

class Weather extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayMessage: '',
      currentTemp: props.temp,
      currentSummary: props.summary,
      currentIcon: props.icon,
    }
    //this.displayWeatherData = this.displayWeatherData.bind(this)
  }

  // displayWeatherData() {
  //   var display = 'Today is a ' + this.state.currentSummary.toLowerCase() + ' day.';
  //   if (this.state.currentTemp < 69) {
  //     display += ' The current temperature is ' + this.state.currentTemp + ' degrees F. You may want to wear a jacket cus its brick out here fam. '
  //   }
  //   return display
  // }

  // componentDidMount() {
  //   this.displayWeatherData();
  // }

  render() {
    return (
      <div>
        <p>Weather n' Shit</p>
        <div>{this.state.displayMessage}</div>
      </div>
    );
  }
}

export default Weather;
