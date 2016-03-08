import uuid from 'node-uuid';
import alt from '../libs/alt';
import UserActions from '../actions/UserActions';
import io from 'socket.io-client';

var UserSource = io.connect('//localhost:3000/user',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]});

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    this.loggedInUser = {};
    this.loginError = null;
  }

  send(cmd,msg) {
    UserSource.emit(cmd,msg);
  }

  fetch(cmd) {
    return new Promise((resolve, reject) => {
      UserSource.once(cmd, (msg) => {
        // console.log('UserStore fetch', cmd, msg);
        resolve(msg);
      });
    });
  }

  login({inputUser, inputPasswd}) {
    this.fetch('login')
    .then((msg) => {
      this.setState({
        loggedInUser: {username: msg.username, role: msg.role},
        loginError: msg.error
      });
      // console.log('UserStore login',msg, this.state);
    });
    this.send('login',{inputUser,inputPasswd});

  }
  logout() {
    this.fetch('logout',this.loggedInUser.username);
    this.setState({loggedInUser:{}});
  }
}

export default alt.createStore(UserStore, 'UserStore');
