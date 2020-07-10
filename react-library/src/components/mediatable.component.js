import React from 'react';
import Book from './book.component';
import VideoGame from './videogame.component';
import Movie from './movie.component';
import './mediatable.component.css';
import './mediatable.component.scss';
import BookService from '../services/book.service';
import MovieService from '../services/movie.service';
import VideoGameService from '../services/videogame.service';
import { connect } from 'react-redux';

class MediaTable extends React.Component {
    bookService = new BookService();
    movieService = new MovieService();
    videogameService = new VideoGameService();
    constructor(props) {
        console.log('Mounting: Constructor MediaTable')
        super(props);
    }

    componentDidMount() {
        // Called by React after the component has mounted.
        const location = this.props.location.pathname;
        console.log('Mounting: Component Did Mount MediaTable')
        if (location === '/books') {
            this.bookService.getBooks().then(res => {
                console.log(res);
                this.props.queryMedia(res.data);
            })
        } else if (location === '/movies'){
            this.movieService.getMovies().then(res => {
                console.log(res);
                this.props.queryMedia(res.data);
            })
        } else if (location === '/videogames') {
            this.videogameService.getVideoGames().then(res => {
                console.log(res);
                this.props.queryMedia(res.data);
            })
        }
        
    }

    componentDidUpdate() {
        // Called by React after the component has updated.
        console.log('Updating: Component Did Update MediaTable')
    }

    shouldComponentUpdate(){
        // DO NOT OVERRIDE THIS FUNCTION WITHOUT A GOOD REASON
        // Called by React to determine if an update is necessary prior to render
        console.log('UPDATING: shouldComponentUpdate MediaTable')
        // 3 situations that will result in an update
        // New props are passed into the component from a parent component
        // setState() function is called
        // forceUpdate() function is called
        return true;
    }

    bookTable(media) {
        return (
            <>
                <table className="table book">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            media.map((book) => {
                                return <Book key={book._id} book={book}></Book>
                            })
                        }
                        
                    </tbody>
                </table>
            </>
        )
    }

    videogameTable(media){
        return (
            <>
                <table className="table vg">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Developer</th>
                            <th>Rating</th>
                            <th>Platform</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            media.map((videogame) => {
                                return <VideoGame key={videogame._id} videogame={videogame}></VideoGame>
                            })
                        }
                        
                    </tbody>
                </table>
            </>
        )
    }

    movieTable(media){
        return (
            <>
                <table className="table movie">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Director</th>
                            <th>Rating</th>
                            <th>Length</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            media.map((movie) => {
                                return <Movie key={movie._id} movie={movie}></Movie>
                            })
                        }
                        
                    </tbody>
                </table>
            </>
        )
    }

    render() {
        // Called by React whenever the state changes and during mounting
        console.log('render(): MediaTable')
        const location = this.props.location.pathname;
        if (location === '/books') {
            return this.bookTable(this.props.media)
        } else if (location === '/movies'){
            return this.movieTable(this.props.media)
        } else if (location === '/videogames') {
            return this.videogameTable(this.props.media)
        }
    }
}
function mapStateToProps(state) {
    const { displayMedia } = state;
    return { media: displayMedia }
}
function mapDispatchToProps(dispatch) {
    return {
        queryMedia: (media) => dispatch({type: 'queryMedia', media: media})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MediaTable);