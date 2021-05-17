import React, { Component } from 'react'
import flyIcon from './flyIcon.png' 
import { Link } from 'react-router-dom'
import airlines from './json/airlines.json';
import result from './json/result.json';


/* Since Placeholder isOnline REST API for Testing and Prototyping 
it doesnt change the data on the server but it appears like*/

class FlightList extends Component
{
    constructor() {
        super();
        this.state = {   
            availableFlights: [],
            availableAirlines : [],
        }
    }
    
    componentDidMount() {

        //result and airlines are obtained from local JSON files

        var availableFlights = result.Data.PricedItineraries;
        var stateObject = {};

        var parsedFlightList = availableFlights.map(data =>{

            let flightIternaries = {};
            flightIternaries.airlineCode = data.ValidatingAirlineCode || 'XX';
            flightIternaries.name = this.getFlightName( data.ValidatingAirlineCode);

            // Departure Iternary detials
            let dateTimeDeparture = data.OriginDestinationOptions[0].FlightSegments[0].DepartureDateTime ;
            flightIternaries.departureDate = this.getBeautifiedDate(dateTimeDeparture) ;
            flightIternaries.departureTime = this.getBeautifiedTime(dateTimeDeparture) ;
            flightIternaries.departureAirport = data.OriginDestinationOptions[0].FlightSegments[0].DepartureAirportLocationCode || 'Unknown';

            // Arrival Iternary detials
            let dateTimeArrival = data.OriginDestinationOptions[0].FlightSegments[0].ArrivalDateTime ;
            flightIternaries.arrivalDate = this.getBeautifiedDate(dateTimeArrival) ;
            flightIternaries.arrivalTime = this.getBeautifiedTime(dateTimeArrival) ;
            flightIternaries.arrivalAirport = data.OriginDestinationOptions[0].FlightSegments[0].ArrivalAirportLocationCode || 'Unknown';

            // Halt details
            flightIternaries.journeyTime = this.getTimeGapDifference(new Date(dateTimeArrival), new Date(dateTimeDeparture));
            flightIternaries.layover = data.OriginDestinationOptions[0].FlightSegments[0].StopQuantity+" Stops" ;
            flightIternaries.flightCode = data.ValidatingAirlineCode;

            //Amount details
            flightIternaries.totalPrice = data.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;
            flightIternaries.currency = data.AirItineraryPricingInfo.ItinTotalFare.TotalFare.CurrencyCode;


            return flightIternaries;
            
        });

        if (Array.isArray(parsedFlightList)) {

            let availableAirlines =  airlines.reduce((availableAirline,airline)=>{

                for (let index = 0; index < parsedFlightList.length; index++) {
                    const availableFlight = parsedFlightList[index];
                    if (availableFlight.flightCode === airline.iata && !availableAirline.includes(airline) ) {
                        availableAirline.push(airline);
                    }
                }
                return availableAirline;

            },[]);

            console.log(availableAirlines);

            stateObject.availableFlights = parsedFlightList;
            stateObject.availableAirlines = availableAirlines;

            for (let index = 0; index < availableAirlines.length; index++) 
            {
                const airlines = availableAirlines[index];
                stateObject[airlines.name] = true;
                
                if (index === availableAirlines.length-1) {
                    this.setState(stateObject);
                    localStorage.setItem('availableFlights',JSON.stringify(parsedFlightList)); //so that for filtration always full list i available
                }
            }

        }

    }

    getBeautifiedDate = (dateTimeString) =>{
        
        let dateTime =  new Date(dateTimeString);
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let beautifiedDate = dateTimeString ? dateTime.getDate() +'-'+ months[dateTime.getMonth()] + '-'+dateTime.getFullYear() : "Please check Airline";
        
        return beautifiedDate;
    }

    getBeautifiedTime = (dateTimeString) =>{
        
        let dateTime =  new Date(dateTimeString);
        let beautifiedTime = dateTimeString ? dateTime.getHours() +':'+ dateTime.getMinutes() : "Please check Airline";
        
        return beautifiedTime;
    }

    getTimeGapDifference = (dateFuture, dateNow) => {

        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
    
        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
    
        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
    
        let difference = '';
        if (days > 0) {
          difference += (days === 1) ? `${days} day, ` : `${days} days, `;
        }
    
        difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
    
        difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`; 
    
        return difference;
    }
    
    

    getFlightName = (flightId) =>{
     
        let matches =  airlines.filter(data=> data.iata === flightId );
        let flightName = matches.length ? matches[0].name : 'None';
        return flightName;

    }

    handleInputChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.checked;
        var self = this;

        console.log(name+" - "+value);

        var visibleFlights = JSON.parse( localStorage.getItem('availableFlights') );
        var filters = this.state.availableAirlines;
        console.log(visibleFlights);

        this.setState({
            [name] : value
        },function () {
            var updatedList = visibleFlights.filter(function(flight){

                for (let index = 0; index < filters.length; index++) {
                    const filter = filters[index];
                    if (flight.name === filter.name && self.state[filter.name] === true) {
                        return true;
                    }
                    
                }
                return false;
               
            });
    
            this.setState({availableFlights:updatedList});
            console.log(updatedList);
        });

        
    }


    render() {
       
        const availableFlightsToShow = this.state.availableFlights.length ?
        (this.state.availableFlights.map( (flight,index) => (
              
            
            <div className="row post card hoverable" key={index}>
                <img src={flyIcon} alt="Fly Icon" className="App-logo responsive-img"  />

                <div className="card-content" style={{marginLeft:'5%'}}>

                    <div className="col s3 l3 m3" name="flight-company">
                        <h6>{flight.name}</h6>
                    </div>

                    <div className="col s2 l2 m2 right-align" name="departure">
                        <label>{flight.departureTime}</label>
                        <label className="bold">{flight.departureAirport}</label>
                        <label>{flight.departureDate}</label>
                    </div>

                    <div className="col s2 l2 m2 center-align" name="transition">
                        <label>{flight.journeyTime}</label>
                        <label>{flight.layover}</label>
                    </div>

                    <div className="col s2 l2 m2 left-align" name="arrival">
                        <label>{flight.arrivalTime}</label>
                        <label className="bold">{flight.arrivalAirport}</label>
                        <label>{flight.arrivalDate}</label>
                    </div>
                   
                </div>
                <Link to={'/'+index}>
                    <div className="col s3 l3 m3 bookNowLink red lighten-2 waves-red" name="price ">
                    
                        <label>Book Flight</label>
                        <label>{flight.currency} <span className="priceAmount">{flight.totalPrice}</span> </label>
                    
                    </div>
                </Link>

            </div>
            ))
            
        ): 
        (   /* by the time post gets loaded show this */
            <div className="center">Flights not available</div> 
        );



        const availableAirlines = this.state.availableAirlines ?
        (
            this.state.availableAirlines.map(airline=>(
            <p key={airline.iata} className="left-align flight-filters-title">
                <label htmlFor={airline.iata}>
                    
                    <input type="checkbox" name={airline.name} id={airline.iata} checked={this.state[airline.name]} onChange={this.handleInputChange} />
                    <span></span>
                    <label className="flight-filters"  htmlFor={airline.iata} >{airline.name}</label> 
                </label>
            </p>
            ))
        ):
        (
            <div className="center">Flights not available</div> 
        );

        console.log('Flight List in UI updated');

        return (
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                        <a href="/" className="brand-logo left" target="_blank" rel="noopener noreferrer"> My Flights</a>
                        <ul id="nav-mobile" className="right ">
                            <li><a href="linkedin.com/in/dhirendra-pratap-singh-530b17112/" target="_blank" rel="noopener noreferrer">Profile</a></li>
                            <li><a href="/">Home</a></li>
                            <li><a href="thub.com/dhirendrapratapsingh" target="_blank" rel="noopener noreferrer">Logout</a></li>
                        </ul>
                        </div>
                    </nav>
                    
                </div>
                <div className="container" style={{width:'90%'}}>
                    <div className="row" style={{ padding: '40px 0px' }}>

                        <div className="col s3 l3 m3" name="filter">
                        
                            <div className="card" style={{marginLeft: '40px !important'}}>
                                <div className="card-content">
                                    <form action="#">
                                        <label className=" filter-heading">Filter by Airlines</label>
                                        {availableAirlines}
                                    </form>
                               
                                </div>
                                
                            </div>

                        </div>

                        <div className="col s8 l8 m9" name="flight-list">
                            {availableFlightsToShow}
                        </div>
                    </div>
                   
                </div>
            </div>
        )
    }
}

export default FlightList