import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import axios from 'axios';
import Map from './components/Map.jsx';
import MeetUpForm from './components/MeetUpForm.jsx';
import Title from './components/Title.jsx';
import sampleData from './sampleData.js';
import LogoutButton from './components/LogoutButton.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Weather from './components/Weather.jsx';
const io = require('socket.io-client');
const socket = io();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      userId:'',
      // meetingLocations: [],
      meetingLocations: sampleData.sampleData,
      midpoint: { "lat": 40.751094, "lng": -73.987597 },
      center: { "lat": 40.751094, "lng": -73.987597 },
      userLocation: {},
<<<<<<< HEAD
      startPoint: {},
=======
      weather: {
        currently: {
          summary: '',
          temperature: ''   
        }
      }
>>>>>>> forecast
    };

    this.setAuth = this.setAuth.bind(this);
    this.setuserId = this.setuserId.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((loc) => {
      console.log('THE CURRENT LOCATION IS ', loc.coords.latitude, ' ', loc.coords.longitude);
      this.setState({userLocatoin: { lat: loc.coords.latitude, lng: loc.coords.longitude }});
    })
  }

  setuserId(input) {
    this.setState({userId: input});
  }

  setAuth(input) {
    this.setState({auth: input});
  }

  handleListClick(item, key) {
    console.log("item:", item, ", key:", key);
    this.setState({center: {"lat": item.coordinates.latitude, "lng": item.coordinates.longitude} })
  }

  handleMarkerClick(item, key) {
    console.log("item:", item, ", key:", key);
    this.setState({center: {"lat": item.coordinates.latitude, "lng": item.coordinates.longitude} })
  };

  componentDidMount() {
    socket.on('meeting locations', (data) => {
      this.setState({ meetingLocations: data });
    });

    socket.on('match status', (data) => {
      console.log('match status inside index.jsx');
    });

    socket.on('midpoint', (data) => {
      //console.log('midpoint listener data', data);
      this.setState({ midpoint: data, center: data });
    });

    socket.on('weather', (data) => {
      console.log('the weather data is ', data);
      this.setState({ weather: data});
    })

    //chetan - grab users location
    this.getLocation();

    socket.on('user locations', (data) => {
      this.setState({
        startPoint: data.location1
      });
    });
  }

//this render method renders title,meetup,map if you're logged in, else it renders login/register components
  render () {
    return (
      <div>
      {this.state.auth ? (
        <div>
          <div className="top">
            <Title />
            <LogoutButton setuserId={this.setuserId} setAuth={this.setAuth}/>
          </div>
          <div className="formWeather">
            <MeetUpForm userId={this.state.userId}/>
            <Weather summary={this.state.weather.currently.summary} temp={this.state.weather.currently.temperature} icon={this.state.weather.currently.icon}/>
          </div>
          <div className="resultsContainer">
            <div className= "mapBox" >
              <div className="subMapBox">
                <Map
                  markers={ this.state.meetingLocations }
                  midpoint={ this.state.midpoint }
                  center={ this.state.center }
                  containerElement={<div style={{height:100+'%'}} />}
                  mapElement={<div style={{height:100+'%'}} />}
                  handleMarkerClick={this.handleMarkerClick.bind(this)}
                />
              </div>
            </div>
            <div className="listContainer">
              <List
                handleClick={this.handleListClick.bind(this)}
                items={this.state.meetingLocations}
                startPoint={this.state.startPoint}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="signInContainer">
          <div className="signInForms">
            <div className="card">
              <div className="title">Login Here!</div>
              <Login setAuth={this.setAuth} setuserId={this.setuserId}/>
            </div>
            <div className="card">
              <div className="title">New User? Register here!</div>
              <Register/>
            </div>
          </div>
        </div>
      )}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
