import React, { Component } from 'react';
import MovieService from '../services/movie.service';
import { connect } from 'react-redux';

class MovieForm extends Component {
    movieService = new MovieService();
    constructor(props) {
        super(props);
        console.log(this.props)
        console.log('Mounting: Constructor')
    }
    handleFieldChange(event) {
        let movie = Object.assign({}, this.props.newMovie);
        movie[event.target.name] = String(event.target.value);
        this.props.dispatch( {type: 'movieFieldUpdate', newMovie: movie })
    }
    addMovie() {
        console.log('Submit the form');
        console.log(this.props.newMovie);
        this.movieService.addMovie(this.props.newMovie)
        this.props.dispatch({ type: 'movieFieldUpdate', newMovie: { director:'', title:'', genre:'', length:'', rating:'' } })

    }
    render() {
        const FIELDS = ['title', 'director', 'genre', 'length', 'rating'];
        return (
            <>
            <div className='container border'>
                <h1>Add a movie to the library</h1>
                    {
                    FIELDS.map((name) => {
                        return (
                            <div key={name}>
                                <label htmlFor={'b_' + name}>{name}</label>
                                <input type='text' className='form-control' name={name}
                                        id={'b_' + name} value={this.props.newMovie[name]}
                                        onChange={(e) => this.handleFieldChange(e) }/>
                            </div>
                        )
                    })
                    }  
                <button className='btn btn-primary' 
                        onClick={ () => this.addMovie() } >Submit</button>
            </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    const { newMovie } = state
    return {newMovie: newMovie}
}

export default connect(mapStateToProps)(MovieForm);