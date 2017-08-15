import React from 'react';
import axios from 'axios';
import Title from './Title.jsx';
const io = require('socket.io-client');
const socket = io();
import Autocomplete from 'react-google-autocomplete';

class MeetUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendId: "",
      userLocationAddress: '',
      status: '',
      mode: 'walking',
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleFriendChange = this.handleFriendChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitFriendOrAddress = this.handleSubmitFriendOrAddress.bind(this);
    this.handleMode = this.handleMode.bind(this);
  }

  componentDidMount() {
    socket.on('match status', (data) => {
      this.setState({ status : data });
    });
  }

  handleUserChange(event) {
    this.setState({ userId: event.target.value });
  }

  handleFriendChange(event) {
    this.setState({ friendId: event.target.value });
  }

  handleAddressChange(event) {
    this.setState({ userLocationAddress: event.target.value });
  }

  handleSubmitFriendOrAddress(e) {
    e.preventDefault();
    e.stopPropagation();

    // If the user entered an address (identified by a space)
    if (this.state.friendId.includes(' ')) {
      console.log(1);
      // socket.emit('match status', 'Searching...');
      this.setState({ status : 'Searching...' });
      socket.emit('match status', 'Searching...');
      var userId = this.props.userId;
      var location1 = { "address" : this.state.userLocationAddress, "coordinates": [0,0] };
      var location2 = { "address": this.state.friendId, "coordinates": [0,0] };
      const mode = this.state.mode;
      axios.post('/two-locations', {
        userId,
        location1,
        location2,
        mode
      }).then((res) => {
        // do something with the res
        this.setState({ status : 'Results found.' });
        // console.log('res', res)
      });
    }

    // Else the user entered a friend
    else {
      console.log(2);
      this.handleSubmit(e);
    }
  }

  handleMode({ target }) {
    this.setState({mode: target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    var userId = this.props.userId;
    var friendId = this.state.friendId;
    var userLocation = {
      "address" : this.state.userLocationAddress,
      "coordinates": [0,0]
    };

    // this.setState({ status: 'Looking for your friend...'});

    axios.post('/meetings', {
      userId,
      friendId,
      userLocation
    })
      .then(function (response) {
        socket.emit('user looking for friend',
          {
            userId,
            friendId,
            userLocation
          });
      })
      .catch(function (error) {
        alert('error ' + error);
      });
  }

  render(){
    return (
      <div>
        <div className="search">
          <p>Your name</p>
          <p>{this.props.userId}</p>
        </div>
        <form
          onSubmit={this.handleSubmitFriendOrAddress}
        >
          <div className="search">
            <p>Enter your location</p>
            <select
              name="mode"
              onChange={this.handleMode}
            >
              <option value="walking">Walk</option>
              <option value="driving&avoid=highways">Drive</option>
              <option value="transit">Public Transit</option>
              <option value="bicycling">Bike</option>
            </select>
            <Autocomplete
              onPlaceSelected={ (place) => {
                this.setState({ userLocationAddress: place.formatted_address })
              } }
              types={['address']}
              onChange={ this.handleAddressChange }
            />
          </div>
          <div className="search">
            <p>Your friend's name or address</p>
            <input type="text" value={ this.state.friendId } onChange={ this.handleFriendChange } />
          </div>
          <button className="submit" type="submit">Join</button>
        </form>
        <p className="messageText">{ this.state.status }</p>
      </div>
    );
  }
}

export default MeetUpForm;
