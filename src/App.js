import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import FlightList from './flightList';
import FlightDetails from './flightDetails';


import "./App.css";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          
          <Switch>
            <Route exact path='/' component={FlightList} />
            <Route exact path='/:flight_id' component={FlightDetails} />
          </Switch>

          <footer className="page-footer">
              <div className="footer-copyright">
                    <div className="container">
                    © 2021 Copyright Code dhirendrapratapsingh398@gmail.com
                    <a className="grey-text text-lighten-4 right" href="#!" target="_blank" rel="noopener noreferrer">More Links</a>
                    </div>
              </div>
          </footer>
          
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

  