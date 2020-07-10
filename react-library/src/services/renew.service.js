import UriService from './uri.service';
const axios = require('axios');

class RenewService {
    uriService = new UriService()
    constructor(){
        this.URI = this.uriService.getUri();
    }

    getMedia(username) {
        return axios.get(this.URI+ '/media?borrower=' + username, {withCredentials: true});
    }

    renewMedia(id, media_type, user) {
        let uri = `${this.URI}/${media_type}/${id}/borrower`
        return axios.put(uri, user, {withCredentials:true});
    }

    checkinMedia(id, media_type, user) {
        let uri = `${this.URI}/${media_type}/${id}/borrower`
        return axios.delete(uri, user, {withCredentials:true});
    }
}

export default RenewService;