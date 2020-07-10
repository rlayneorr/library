import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Link } from 'react-router-dom';

import UserService from '../services/user.service'

import { Navbar, Nav } from 'react-bootstrap';
import Login from './login.component';
import BookForm from './bookform.component';
import MovieForm from './movieform.component';
import VideogameForm from './videogameform.component';
import MediaTable from './mediatable.component';
import MyMediaTable from './mymediatable.component'

/*
Group 1: Expand MediaTable for different routes
    * Must be contingent on current route
    * videogame.service
    * movie.service
Group 2: Add Movie and Add VideoGame Components
Group 3: Renew/Checkin media components
Group 4: Edit Book
    * Retrieve specific book id from route
    * Generalize existing BookForm Component
    * Add put request to book service
*/
class Routing extends Component {
    render() {
        return <Router>
            <div>
                <Navbar id='navBar' bg='light' expand='lg' sticky='top'>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='mr-auto'>
                            <Link to='/books'>Books</Link>
                            <Link to='/addBook'>Add a book</Link>
                            <Link to='/movies'>Movies</Link>
                            <Link to='/addMovie'>Add a movie</Link>
                            <Link to='/videogames'>Video Games</Link>
                            <Link to='/addVideoGame'>Add a video game</Link>
                            <Link to='/mymedia'>My media</Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Login></Login>
                </Navbar>
                <Route path='/books' component={MediaTable}/>
                <Route path='/movies' component={MediaTable}/>
                <Route path='/videogames' component={MediaTable}/>
                <Route path='/addBook' component={BookForm}/>
                <Route path='/addMovie' component={MovieForm}/>
                <Route path='/addVideoGame' component={VideogameForm}/>
                <Route path='/books/:id' component={BookForm}/>
                <Route path='/mymedia' component={MyMediaTable}/>
            </div>
        </Router>
    }
}

export default Routing;