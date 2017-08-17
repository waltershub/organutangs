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
import convertIcons from './convertIcons.js'

const io = require('socket.io-client');
const socket = io();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: 'none',
      userId:'',
      meetingLocations: [],
      midpoint: { "lat": 40.751094, "lng": -73.987597 },
      center: { "lat": 40.751094, "lng": -73.987597 },
      userLocation: {},
      startPoint: {},
      displayWeather: {
        currently: {
          summary: 'Summary loading',
          temperature: 'Temperature loading',
          icon: "../images/weather/loading.png"
        }
      },
      weatherScale: 0,
      loginForm: '-1000px',
      cssLoginCheck: false
    };

    this.setAuth = this.setAuth.bind(this);
    this.setuserId = this.setuserId.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.convertIcon = this.convertIcon.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.resetLoginForm = this.resetLoginForm.bind(this);
    this.socketLoggedIn = this.socketLoggedIn.bind(this);
  }

  convertIcon(icon) {
    return convertIcons.translate(icon);
  }

  getLocation() {
    //get the users initial location
    navigator.geolocation.getCurrentPosition((loc) => {
      console.log('THE CURRENT LOCATION IS ', loc.coords.latitude, ' ', loc.coords.longitude);
      this.setState({userLocation: { latitude: loc.coords.latitude, longitude: loc.coords.longitude }});
      this.setState({midpoint: { lat: loc.coords.latitude, lng: loc.coords.longitude }});
      this.setState({center: { lat: loc.coords.latitude, lng: loc.coords.longitude }});
      //send to backend to grab weather data
      socket.emit('initLocation', this.state.userLocation);
    })
    //get the weather data for current location
    socket.on('initWeather', (data) => {
      //console.log('WEATHER BEEEEEOOCHCHH', this.state.displayWeather)
      this.setState({displayWeather: {currently: {icon: this.convertIcon(data.currently.icon), temperature: data.currently.temperature, summary: data.currently.summary}}})
      console.log('DISPLAY WEATHER ', this.state.displayWeather)
      this.setState({weatherScale: 1})
    })
  }

  setuserId(input) {
    this.socketLoggedIn();
    this.setState({userId: input});
  }

  setAuth(input) {
    this.socketLoggedIn();
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

  componentWillMount() {
    this.checkLogin();
  }

  checkLogin() {
    axios.get('/users/loggedin')
    .then(({data}) => {
      this.setAuth(data.auth);
      this.setuserId(data.user);
      if(!data.auth){
        this.setState({loginForm: '60px'});
      } else if (data.auth){
        this.setState({weatherScale: 1});
      }
    });
  }

  socketLoggedIn() {
    socket.on('loginTrue', (bool) => {
      this.setState({cssLoginCheck: bool})
      console.log('cssLoginCheck state was set', this.state.cssLoginCheck)
    })
    socket.on('loginFalse', (bool) => {
      this.setState({cssLoginCheck: bool})
      console.log('cssLoginCheck state was set', this.state.cssLoginCheck)
    })
  }

  resetLoginForm() {
    this.setState({loginForm: '-1000px'})
  }

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
      //this.setState({displayWeather: data})
      this.setState({displayWeather: {currently: {icon: this.convertIcon(data.currently.icon), temperature: data.currently.temperature, summary: data.currently.summary}}})
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
      {this.state.auth === 'none' ? null :
      this.state.auth ? (
        <div>
          <div className="top">
            <Title />
            <Weather
              summary={this.state.displayWeather.currently.summary}
              temp={this.state.displayWeather.currently.temperature}
              icon={this.state.displayWeather.currently.icon}
              scale={this.state.weatherScale}
            />
            <LogoutButton setuserId={this.setuserId} setAuth={this.setAuth}/>
          </div>
          <div className="searchBox">
            <MeetUpForm userId={this.state.userId}/>
            <div className= "mapBox" >
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
          <div className="resultsContainer">
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
        <div className="signInContainer" >
          <div className="signInForms">
            <div className="loginCard" style={{transition: 'all .3s ease-in', transform: 'translateY(' + this.state.loginForm + ')'}}>
              <p className="title">Login</p>
              <Login setAuth={this.setAuth} setuserId={this.setuserId}/>
            </div>
            <div className="regCard" style={{transition: 'all .3s ease-in', transform: 'translateY(' + this.state.loginForm + ')'}}>
              <p className="title">Sign Up</p>
              <Register
                setAuth={this.setAuth}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
