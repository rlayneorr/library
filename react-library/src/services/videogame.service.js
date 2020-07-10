import UriService from './uri.service';
const axios = require('axios');

class VideoGameService {
    uriService = new UriService()
    constructor(){
        this.URI = this.uriService.getUri()+'videogames';
    }

    getVideoGames() {
        return axios.get(this.URI);
    }

    addVideoGame(videogame) {
        return axios.post(this.URI, videogame);
    }
}

export default VideoGameService;