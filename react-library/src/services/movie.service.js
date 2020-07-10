import UriService from './uri.service';
const axios = require('axios');

class MovieService {
    uriService = new UriService()
    constructor(){
        this.URI = this.uriService.getUri()+'movies';
    }

    getMovies() {
        return axios.get(this.URI);
    }

    addMovie(movie) {
        console.log(movie)
        return axios.post(this.URI, movie);
    }
}

export default MovieService;