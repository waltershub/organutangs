import React from 'react';
import axios from 'axios';
import Title from './Title.jsx';
const io = require('socket.io-client');
const socket = io();
import Autocomplete from 'react-google-autocomplete';
import Autosuggest from 'react-autosuggest';
import PopUp from './PopUp.jsx';
import FriendList from './FriendList.jsx';

class MeetUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendId: "",
      userLocationAddress: '',
      status: '',
      mode: 'walking',
      query: '',
      autoCompleteArray: [],
      display: 'form',
      popUpResult: null,
      modeMessage: 'none',
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleFriendChange = this.handleFriendChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitFriendOrAddress = this.handleSubmitFriendOrAddress.bind(this);
    this.handleMode = this.handleMode.bind(this);
    this.recalculateSuggestions = this.recalculateSuggestions.bind(this);
    this.clearSuggestions = this.clearSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestions =this.getSuggestions.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  componentDidMount() {
    socket.on('match status', (data) => {
      this.setState({ status : data });
    });

    socket.on('mode', (mode) => {
      const modes = {
        walking: 'Walk',
        'driving&avoid=highways': 'Drive',
        transit: 'take Public Transit',
        bicycling: 'Bike',
      };
      if (mode !== this.state.mode) {
        this.setState({ display: 'mode', modeMessage: modes[mode] });
      }
    });
  }

  handleUserChange(event) {
    this.setState({ userId: event.target.value });
  }

  handleFriendChange(event) {
    if (event.target.value === 'no friends ') {
      this.setState({ friendId: this.state.userLocationAddress });
      this.setState({ query: 'bars' });
      this.handleSubmitFriendOrAddress();
    } else {
      this.setState({ friendId: event.target.value });
    }
  }

  handleAddressChange(event) {
    this.setState({ userLocationAddress: event.target.value });
  }


  getSuggestions(value){
    return axios.post('autoComplete',{ text: this.state.query })
     .then((res) => {
       return res.data;
     })
     .catch((err) => console.error('error fetching suggestions: ', err));
  }
  recalculateSuggestions({value}){

      this.getSuggestions(value)
      .then(suggestions =>{        this.setState({autoCompleteArray: suggestions} ,()=>{
        });
      });

  }

  clearSuggestions(){
    if (this.state.query === ''){
      this.setState({autoCompleteArray : []});
    }
  }

  getSuggestionValue(suggestion){
    console.log('SUGEST', suggestion);
    return suggestion;
  }

  onChange  (event, { newValue })  {
    this.setState({
      query: newValue
    });
  }

  renderSuggestion(suggestion){
  return(
    <strong>
      {suggestion}
  </strong>);

  }



  handleSubmitFriendOrAddress(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // If the user entered an address (identified by a space)
    if (this.state.friendId.includes(' ')) {
      // socket.emit('match status', 'Searching...');
      this.setState({ status : 'Searching...' });
      socket.emit('match status', 'Searching...');
      var userId = this.props.userId;
      var location1 = { "address" : this.state.userLocationAddress, "coordinates": [0,0] };
      var location2 = { "address": this.state.friendId, "coordinates": [0,0] };
      const mode = this.state.mode;
      const query = this.state.query;
      axios.post('/two-locations', {
        userId,
        location1,
        location2,
        mode,
        query,
      }).then((res) => {
        // do something with the res
        this.setState({ status : 'Results found.' });
        // console.log('res', res)
      });
    }

    // Else the user entered a friend
    else {
      this.handleSubmit(e);
    }
  }

  handleMode({ target }) {
    this.setState({mode: target.value});
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var userId = this.props.userId;
    var friendId = this.state.friendId;
    var userLocation = {
      "address" : this.state.userLocationAddress,
      "coordinates": [0,0]
    };
    const query = this.state.query;
    const mode = this.state.mode;
    // this.setState({ status: 'Looking for your friend...'});

    axios.post('/meetings', {
      userId,
      friendId,
      userLocation,
      query,
    })
      .then(function (response) {
        socket.emit('user looking for friend',
          {
            userId,
            friendId,
            userLocation,
            mode,
            query,
          });
      })
      .catch(function (error) {
        alert('error ' + error);
      });
  }

  toggleDisplay() {
    this.setState({ display: 'form' });
  }

  setPopUpResult(bool, mode) {
    const modes = {
      Walk: 'walking',
      Drive: 'driving&avoid=highways',
      'take Public Transit': 'transit',
      'Bike': 'bicycling',
    };
    if (bool) this.setState({ mode: modes[this.state.modeMessage] });
    else this.handleSubmitFriendOrAddress();
  }

  display() {
    return this.state.display === 'mode' ? (
      <PopUp
        display={this.toggleDisplay.bind(this)}
        cb={this.setPopUpResult.bind(this)}
        getMode={() => this.state.modeMessage}
      />
    ) : this.state.display === 'friend' ? (
      <FriendList
        setFriend={this.handleFriendChange}
        toggleDisplay={this.toggleDisplay.bind(this)}
      />
    ) : (
      <div>
      <form
        className="loginForm"
        onSubmit={this.handleSubmitFriendOrAddress}
      >

          <p className="inputLable">Enter your location</p>
          <select
            className="mode"
            name="mode"
            onChange={this.handleMode}
            value={this.state.mode}
          >
            <option value="walking">Walk</option>
            <option value="driving&avoid=highways">Drive</option>
            <option value="transit">Public Transit</option>
            <option value="bicycling">Bike</option>
          </select>
          <Autocomplete
            autoFocus
            onPlaceSelected={ (place) => {
              this.setState({ userLocationAddress: place.formatted_address });
            } }
            types={['address']}
            onChange={ this.handleAddressChange }
            placeholder="Ex. 369 Lexintgon, New York, NY"
            value={ this.state.userLocationAddress }
          />


          <p className="inputLable2">Your friend's name or address</p>
          <input type="text" value={ this.state.friendId } onChange={ this.handleFriendChange } />
        <div className="search">
          <p className="inputLable2">What would you like to do </p>
          <Autosuggest
            suggestions={ this.state.autoCompleteArray }
            onSuggestionsFetchRequested={ this.recalculateSuggestions }
            onSuggestionsClearRequested = { this.clearSuggestions }
            getSuggestionValue = { this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps = {{
              placeholder:'Ex. Sake Bar',
              value: this.state.query,
              onChange: this.onChange
            }}
            highlightFirstSuggestion = {false}
          />
        </div>
        <button className="submit" type="submit">Join</button>
      <button
        onClick={(e) => {
          e.preventDefault();
          this.setState({ display: 'friend' });
        }}
      >
      Friend List</button>
      </form>
      </div>
    );
  }

  render(){
    return (
      <div>
        <div className="meetCard">
          <div className="flex-row-center">
            <p className="meet-card-header">Logged in as:
              <span className="bold">{` ${this.props.userId}`}</span>
            </p>
          </div>
          {this.display.bind(this)()}
          <p className="messageText">{ this.state.status }</p>
        </div>
      </div>
    );
  }
}

export default MeetUpForm;
