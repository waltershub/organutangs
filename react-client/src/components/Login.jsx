import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.loggingIn = this.loggingIn.bind(this);
  }

  componentWillMount() {
    this.props.checkLogin();
  }

  handleChangeName(event) {
    event.preventDefault();
    this.setState({userName: event.target.value});
  }

  handleChangePassword(event) {
    event.preventDefault();
    this.setState({password: event.target.value});
  }

  loggingIn(e, user, pw) {
    //this.props.setAuth(true);
    e.preventDefault();
    axios.post('/users/login', {
      username: user,
      password: pw
    })
    .then((response) =>{
      this.props.checkLogin();
      console.log('you logged in bruh')
    })
    .catch(function (error) {
      console.log("error logging in ", error);
    });
  }

  render() {
    return (
    <div>
      <form className="loginForm" onSubmit={(event)=>{this.loggingIn(event, this.state.userName, this.state.password)}}>
        <p className="inputLable">Username:</p>
        <input
          autoFocus
          className="username"
          type="text"
          value={this.state.userName}
          onChange={this.handleChangeName}
        />
        <p className="inputLable">Password:</p>
        <input className="password" type="password" value={this.state.password} onChange={this.handleChangePassword}/>
        <button type="submit">Submit</button>
      </form>
    </div>
    );
  }
}

export default Login;
