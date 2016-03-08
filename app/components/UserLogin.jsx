import React from 'react';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import { hashHistory, Link } from 'react-router';

export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = UserStore.getState();
  }
  componentDidMount() {
    UserStore.listen(this.storeChanged);
  }
  componentWillUnmount() {
    UserStore.unlisten(this.storeChanged);
  }
  storeChanged = (state) => {
    this.setState(state);
    // console.log('UserLogin storeChanged', state, this.state);

    // if login was clicked and no error, redirect to class page
    if (state.loggedInUser.username) {
      hashHistory.push('/about');
    }
  }
  render() {
      return (
        <div className="row">
          <h3>WASABI Login</h3>
          <div><label>Username:</label> <input type="text" className="input" onBlur={this.handleInputUser} /></div>
          <div><label>Password:</label> <input type="password" className="input" onBlur={this.handleInputPasswd} /></div>
          <div><button type="button" className="btn btn-default add-note" onClick={this.userLogin}>
          Login
          </button></div>
          <div>
          {(() => {
              if (this.state.loginError) {
                return "Username and password do not match.";
              }
          })()}
          </div>
        </div>
      );
    // }
  }
  handleInputUser = (event) => {
    this.setState({inputUser:event.target.value});
    // console.log('handleInputUser',this.state);
  }
  handleInputPasswd = (event) => {
    this.setState({inputPasswd:event.target.value});
    // console.log('handleInputPasswd',this.state);
  }
  userLogin = (event) => {
    // console.log('userLogin',this.state);
    UserActions.login(this.state);
  }
}
