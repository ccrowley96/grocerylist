import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom';
import './index.scss';
import App from './components/App/App';
import Print from './components/Print/Print'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
          <Route path="/print">
            <Print />
          </Route>
          <Route path="/">
            <App />
          </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
