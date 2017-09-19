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
    if (this.state.newFriend === 'alice') alert('window says hi.');
    if (this.state.newFriend === 'HAL 9000') alert('Affirmative, Dave. I read you.');
    if (this.state.newFriend === 'chetan') alert('You must be special.')
    if (this.state.newFriend === '') {}
    this.state.friends.includes(this.state.newFriend) ? this.setState({ newFriend: '' }) :
      axios.post('users/friends', {
        friend: this.state.newFriend,
      })
      .then((res) => {
        this.setState({ newFriend: res.data})
        setTimeout(this.setState.bind(this, { newFriend: '' }), 600);
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
