import { createStore } from 'redux';

const initialState = {
    user: null,
    username: '',
    media: null,
    displayMedia: [],
    addVideoGame: { title: '', developer: '', platform: '', rating: '', genre: '' },
    newMovie: {'title': '', 'director': '', 'genre': '', 'length': 0, 'rating': '', 'actors': []},
    book: {title: '', author: '', isbn:'', genre: '' }
};

function libraryReducer(state = initialState, action) {
    console.log(state);
    console.log(action);
    switch(action.type) {
        case 'login':
            return Object.assign({}, state, {username: '', user: action.user, media: null})
        case 'loadMedia':
            return Object.assign({}, state, {media: action.media})
        case 'handleFieldChange':
            return Object.assign({}, state, {addVideoGame: action.media})
        case 'handleUsername':
            return Object.assign({}, state, {username: action.username})
        case 'queryMedia':
            return Object.assign({}, state, {displayMedia: action.media})
        case 'addVideoGame':
            return Object.assign({}, state, {addVideoGame: action.media})
        case 'movieFieldUpdate':
            return Object.assign({}, state, {newMovie: action.newMovie})
        case 'handleBookFieldChange':
            return Object.assign({}, state, {book: action.book})
        default:
            return state;
    }
}

let store = createStore(libraryReducer);

export default store;