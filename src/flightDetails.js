import React, { Component } from 'react';
import flyIcon from './flyIcon.png';

class FlightDetails extends Component 
{
    state = {
        iternaryDetails: null
    }
    componentDidMount()
    {
        let id = this.props.match.params.flight_id; /* Params obtained from props */
        console.log(this.props);

        let visibleFlights = JSON.parse( localStorage.getItem('availableFlights') );
        this.setState({iternaryDetails: visibleFlights[id] });

    }
    render()
    {
        const {iternaryDetails} = this.state;
        const iternaryDetailsUI = this.state.iternaryDetails ?
        (           
            <div className="row">
                <div className="col s12 m12 l12">
                    <div className="card">
                        <div className="card-image">
                            <img src={flyIcon} id="Company-logo" alt="mystifly" />
                            <span className="card-title">Success</span>
                        </div>
                        <div className="card-content">
                            <p>Your flight from <span className="bold">{iternaryDetails.departureAirport}</span> to <span className="bold">{iternaryDetails.arrivalAirport}</span> on <span className="bold">{iternaryDetails.departureDate}</span> is confirmed.</p>
                        </div>
                        <div className="card-action">
                            <a href="/" target="_blank" rel="noopener noreferrer">Happy Journey</a>
                        </div>
                    </div>
                </div>
              </div>

        ) : (
          <div className="center">Loading iternary Details...</div>
        );

        return (
          <>
              <div className="navbar-fixed">
                  <nav>
                      <div className="nav-wrapper">
                      <a href="/" className="brand-logo left" target="_blank" rel="noopener noreferrer"> My Flights</a>
                      <ul id="nav-mobile" className="right ">
                          <li><a href="linkedin.com/in/dhirendra-pratap-singh-530b17112/" target="_blank" rel="noopener noreferrer">Profile</a></li>
                          <li><a href="/" target="_blank" rel="noopener noreferrer">Home</a></li>
                          <li><a href="thub.com/dhirendrapratapsingh" target="_blank" rel="noopener noreferrer">Logout</a></li>
                      </ul>
                      </div>
                  </nav>
                    
              </div>
              <div className="container" style={{ marginTop: "15px"}}>
                {iternaryDetailsUI}
              </div>
              
              
          </>
        )
    }
}

export default FlightDetails