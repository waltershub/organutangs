import React from 'react';
import axios from 'axios';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password2: '',
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePassword2 = this.handleChangePassword2.bind(this);
    this.register = this.register.bind(this);
  }

  handleChangeName(event) {
    event.preventDefault();
    this.setState({username: event.target.value.replace(' ', '')});
  }

  handleChangePassword(event) {
    event.preventDefault();
    this.setState({password: event.target.value});
  }

  handleChangePassword2(event) {
    event.preventDefault();
    this.setState({password2: event.target.value});
  }

  register(e, user, pw, pw2) {
    e.preventDefault();
    axios.post('/users/register', {
      username: user,
      password: pw,
      password2: pw2
    })
    .then((res) =>{
      if (res) {
        this.props.checkLogin();
      }
    })
    .catch(function (error) {
      console.log("error response registering from axios");
      console.log(error);
    });
  }

  render() {
    return (
    <form className="registerForm" onSubmit={(event)=>{this.register(event, this.state.username, this.state.password, this.state.password2)}}>
      <p className="inputLable">Username</p>
      <input className="username" type="text" value={this.state.username} onChange={this.handleChangeName}/>
      <p className="inputLable">Password</p>
      <input className="password" type="password" value={this.state.password} onChange={this.handleChangePassword}/>
      <p className="inputLable">Confirm Password</p>
      <input className="password2" type="password" value={this.state.password2} onChange={this.handleChangePassword2}/>
      <button type="submit">Submit</button>
    </form>
    );
  }
}

export default Register;
