import React from 'react';
import axios from 'axios';

export default class FriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      newFriend: '',
    };
  }

  componentWillMount() {
    this.getFriends();
  }

  getFriends() {
    axios.get('/users/friends')
    .then((res) => {
      this.setState({ friends: res.data })
    });
  }

  addFriend(e) {
    e.preventDefault();
    axios.post('users/friends', {
      friend: this.state.newFriend,
    })
    .then((res) => {
      this.setState({ newFriend: ''})
      setTimeout(this.setState.bind(this, { newFriend: '' }), 0);
      this.getFriends();
    });
  }

  render() {
    return (
      <div>
      <div className="friendListItems">
        {this.state.friends.map(friend => (
          <button
            className="friendListItem"
            onClick={(e) => {
              e.preventDefault();
              this.props.setFriend({ target: { value: friend } });
              this.props.toggleDisplay();
            }}
          >{friend}</button>
        ))}
      </div>
      <form
        onSubmit={this.addFriend.bind(this)}
        className="friendList"
      >
        <input
          type="text"
          name="newFriend"
          placeholder="Add A Friend"
          onChange={({ target }) => this.setState({ newFriend: target.value })}
          value={this.state.newFriend}
        ></input>
        <button type="submit">Submit</button>
        <button onClick={(e) => {
          e.preventDefault();
          this.props.toggleDisplay();
        }}>Back</button>
      </form>
      </div>
    );
  }
}
