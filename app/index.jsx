import 'array.prototype.findindex';
import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import UserLogin from './components/UserLogin.jsx';
import Student from './components/Student.jsx';
import Lecturer from './components/Lecturer.jsx';
import Dashboard from './components/Dashboard.jsx';
import About from './components/About.jsx';
import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';



main();

function main() {
  // persist(alt, storage, 'app');
  //const app = document.createElement('div');

  //document.body.appendChild(app);

  ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
    	<IndexRoute component={UserLogin} />
      <Route path="about" component={About} />
      <Route path="about/:aboutId" component={About} />
      <Route path="student/:deckId" component={Student} />
      <Route path="lecturer/:deckId" component={Lecturer} />
      <Route path="dashboard/:deckId" component={Dashboard} />
      <Route path="login" component={UserLogin} />
    </Route>
  </Router>
 	,
	document.getElementById('app'));
  // ReactDOM.render(<App />, app);
}
