import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom';
import './index.scss';
import ListContainer from './components/ListContainer/ListContainer';
import Print from './components/Print/Print'
import Rooms from './components/Rooms/Rooms';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
          <Route path="/print">
            <Print />
          </Route>
          <Route path="/rooms">
            <Rooms />
          </Route>
          <Route path="/">
            <ListContainer />
          </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
