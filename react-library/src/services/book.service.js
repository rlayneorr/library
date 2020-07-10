import UriService from './uri.service';
const axios = require('axios');

class BookService {
    uriService = new UriService()
    constructor(){
        this.URI = this.uriService.getUri()+'books';
    }

    getBooks() {
        return axios.get(this.URI);
    }

    addBook(book) {
        return axios.post(this.URI, book);
    }
}

export default BookService;