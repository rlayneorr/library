''' A handler for Media operations in our server '''
# External Modules
from flask import Flask, jsonify, Blueprint, request
from datetime import datetime, date
import urllib.parse
import html
# Internal Modules
import library.data.mongo as db
from library.media.model import MediaEncoder, Media, Book, Movie, VideoGame
from library.users.model import User
from library.data.logger import get_logger
from os import path

_log = get_logger(__name__)

book_page = Blueprint('book_page', __name__, static_folder='../static')
movie_page = Blueprint('movie_page', __name__, static_folder='../static')
video_game_page = Blueprint('video_game_page', __name__, static_folder='../static')
media_page = Blueprint('media_page', __name__, static_folder='../static')

@book_page.route('/booklist')
def book_list():
    '''Route for the static file books.html'''
    return book_page.send_static_file('books.html')

@book_page.route('/edit-book')
def edit_book():
    '''Route for the static file edit-book.html'''
    return book_page.send_static_file('edit-book.html')

@book_page.route('/books', methods=['GET', 'POST'])
def book_collection():
    '''A GET requeston /books returns a list of all books and a POST
       request on /books adds a book to the collection. '''
    if request.method == 'POST':
        # args - key/value pairs in a URL Query string
        # form - key/value pairs in an html form
        # files - files in the body (multipart/form-data)
        # values - Combo of Args and Form
        # json - parsed JSON data (application/json)
        # request.get_json(force=True)
        _log.debug(request)
        input_dict = request.json
        _log.debug(input_dict)
        return validate_media(Book, db.insert_media, input_dict)
        
    else:
        _log.debug(request.args)
        if 'num_of_results' in request.args:
            page = int(request.args['num_of_results'])
            results = {}
            if 'last' in request.args:
                last = int(request.args['last'])
                results = db.get_books_page_better(last_index=last, num_page=page)
            else:
                results = db.get_books_page_better(num_page= page)
            return jsonify(results), 200
        else: 
            return jsonify(db.get_books())

# Group 1: movie_page and also edit-movies.html
@movie_page.route('/movieslist')
def movie_list():
    return movie_page.send_static_file('movies.html')

@movie_page.route('/edit-movie/<int:movieid>')
def edit_movie(movieid):
    return movie_page.send_static_file('edit-movie.html')


@movie_page.route('/movies', methods=['GET', 'POST'])
def movie_collection():
    if request.method == 'POST':
        input_dict = request.json
        return validate_media(Movie, db.insert_media, input_dict)
    else:
        return jsonify(db.get_movies())

@movie_page.route('/movies/<int:movieid>', methods=['GET', 'PUT'])
def get_movie(movieid):
    if request.method == 'GET':
        movie = db.get_movie_by_id(movieid)
        if movie:
            return jsonify(db.get_movie_by_id(movieid)), 200
        else:
            return movie_page.send_static_file('404.html'), 404
    elif request.method == 'PUT':
        return validate_media(Movie, db.update_movie, request.json)


# Group 2: video_game_page and edit-videogames.html


@video_game_page.route('/videogamelist')
def video_game_list():
    '''video_game_list route resolution.'''
    return video_game_page.send_static_file('videogames.html')

@video_game_page.route('/edit-videogame')
def edit_video_game():
    '''edit_video_game route resolution.'''
    return video_game_page.send_static_file('edit-videogame.html')

@video_game_page.route('/videogames', methods=['GET', 'POST'])
def video_game_collection():
    '''A GET requeston /videogames returns a list of all games and a POST
       request on /videogames adds a videogame to the collection. '''
    if request.method == 'POST':
        video_game = VideoGame.from_dict(request.json)
        db.insert_media(video_game)
        return jsonify(video_game)
    else:
        return jsonify(db.get_video_games())

# Group 3: Renewing and checking in media (all kinds) and the renewmedia.html
# Old Branch is jsRenew
@media_page.route('/mymedia', methods=['GET'])
def my_media():
    if request.method == 'GET':
        return book_page.send_static_file('renewmedia.html')

@media_page.route('/createmedia', methods=['GET'])
def create_media():
    _log.debug(request.method)
    return media_page.send_static_file('createmedia.html')

@media_page.route('/media', methods=['GET', 'POST'])
def media():
    if request.method == 'GET':
        user = request.args.get('borrower')
        return jsonify(db.find_checkedout_media(user))
    else:
        input_dict = request.json
        media_type = input_dict['media_type']
        _log.debug(input_dict)
        input_dict.pop('media_type')
        if media_type == 'Book':
            return validate_media(Book, db.insert_media, input_dict)
        elif media_type == 'Movie':
            return validate_media(Movie, db.insert_media, input_dict)
        elif media_type == 'VideoGame':
            media = VideoGame.from_dict(input_dict)
        db.insert_media(media)
        return jsonify(media)


@book_page.route('/books/<int:book_field>/borrower', methods=['POST', 'PUT', 'DELETE'])
# TODO: Checkout books with POST request from here
def checkin_renew(book_field):
    if request.method == 'POST': # Checkout media
        _log.debug(book_field)
        db.checkout_media(db.get_book_by_id(book_field), User.from_dict(request.json))
        return {}
    elif request.method == 'PUT': # RENEW MEDIA
        _log.debug(book_field)
        book = db.get_book_by_id(book_field)
        db.renew_media(book)
        return {}
    elif request.method == 'DELETE': # CHECK IN MEDIA
        _log.debug(book_field)
        book = db.get_book_by_id(book_field)
        db.checkin_media(book)
        return jsonify(book)

@movie_page.route('/movies/<int:movie_field>/borrower', methods=['POST', 'PUT', 'DELETE'])
# TODO: Checkout movies with POST request from here
def movie_checkin_renew(movie_field):
    if request.method == 'POST': # Checkout media
        _log.debug(movie_field)
        db.checkout_media(db.get_movie_by_id(movie_field), User.from_dict(request.json))
        return {}
    if request.method == 'PUT': # RENEW MEDIA
        movie = db.get_movie_by_id(movie_field)
        db.renew_media(movie)
        return {}
    elif request.method == 'DELETE': # CHECK IN MEDIA
        movie = db.get_movie_by_id(movie_field)
        db.checkin_media(movie)
        return jsonify(movie)

@video_game_page.route('/videogames/<int:videogame_field>/borrower', methods=['POST', 'PUT', 'DELETE'])
# TODO: Checkout movies with POST request from here
def video_game_checkin_renew(videogame_field):
    if request.method == 'POST': # Checkout media
        _log.debug(videogame_field)
        db.checkout_media(db.get_video_game_by_id(videogame_field), User.from_dict(request.json))
        return {}
    if request.method == 'PUT': # RENEW MEDIA
        video_game = db.get_video_game_by_id(videogame_field)
        db.renew_media(video_game)
        return {}
    elif request.method == 'DELETE': # CHECK IN MEDIA
        video_game = db.get_video_game_by_id(videogame_field)
        db.checkin_media(video_game)
        return jsonify(video_game)

def validate_media(media_class, operation, input_dict):
    valid_media = media_class.validate(input_dict)
    if not valid_media:
        for item in input_dict.keys():
            if isinstance(input_dict[item], list):
                input_list = []
                for i in input_dict[item]:
                    input_list.append(html.escape(i))
                input_dict[item] = input_list
            else:
                input_dict[item] = html.escape(input_dict[item])
        media = media_class.from_dict(request.json)
        operation(media)
        return jsonify(media)
    else:
        return jsonify(valid_media), 400