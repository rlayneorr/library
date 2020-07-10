import UriService from './uri.service';
const { default: axios } = require('axios')

class UserService {
    uriService = new UriService()
    constructor(){
        this.URI = this.uriService.getUri()+'users';
    }

    checkLogin() {
        return axios.get(this.URI, {withCredentials: true})
    }
    login(username) {
        return axios.post(this.URI, 'user='+username, {withCredentials: true})
    }
    logout() {
        return axios.delete(this.URI, {withCredentials: true})
    }
}

export default UserService;