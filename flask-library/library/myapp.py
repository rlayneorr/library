'''This module is the start of the application'''
from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS

from library.media.model import MediaEncoder
from library.users.model import User
from library.media.handler import book_page, movie_page, video_game_page, media_page
from library.data.logger import get_logger
import werkzeug

import library.data.mongo as db

_log = get_logger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.json_encoder = MediaEncoder
app.register_blueprint(book_page)
app.register_blueprint(movie_page)
app.register_blueprint(video_game_page)
app.register_blueprint(media_page)

@app.route('/secret')
def reset_db():
    db.init_db()
    return {}, 200

@app.route('/')
def hello_world():
    return app.send_static_file('home.html'), 200

@app.route('/templatebooks')
def render_book_list():
    return render_template("medialist.html", mediatype="books", media_list=db.get_books())
@app.route('/templatemovies')
def render_movie_list():
    return render_template("medialist.html", mediatype="movies", media_list=db.get_movies())
@app.route('/templatevideogames')
def render_game_list():
    return render_template("medialist.html", mediatype="video games", media_list=db.get_video_games())

@app.route('/users', methods=['GET', 'POST', 'DELETE'])
def login():
    if request.method == 'POST':
        # getting the user information from the form and getting the information from the db
        _log.debug(request.form)
        user = db.login(request.form['user'])
        if user:
            # Generate our token
            auth_token = user.encode_auth_token()
            _log.debug(dir(auth_token))
            response = make_response(jsonify(user))
            response.set_cookie('authorization', auth_token.decode())
            return response, 200
        return {}, 401
    elif request.method == 'GET':
        auth_token = request.cookies.get('authorization')
        if auth_token:
            _log.debug(auth_token)
            _log.debug(User.decode_auth_token(auth_token))
            return jsonify(db.get_user_by_id(User.decode_auth_token(auth_token))), 200
        else:
            return {}, 401
    else:
        empty = make_response({})
        empty.set_cookie('authorization', '')
        return empty, 204

@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_not_found(e):
    return app.send_static_file('404.html'), 404

@app.route('/testdb')
def test():
    last = 0
    num_page = 2
    books = db.get_books_page_better(last, num_page=num_page)
    while books:
        for b in books:
            print(b)
        last = books[-1]._id
        books = db.get_books_page_better(last, num_page=num_page)
    print('out of books')
    return {}, 200

'''
# The old app.py follows:
from flask import Flask, request, session, jsonify

from library.media.model import MediaEncoder
from library.media.handler import book_page, movie_page, video_game_page, media_page
from library.data.logger import get_logger

import library.data.mongo as db

_log = get_logger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = '10101567unique'
app.json_encoder = MediaEncoder
app.register_blueprint(book_page)
app.register_blueprint(movie_page)
app.register_blueprint(video_game_page)
app.register_blueprint(media_page)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/users', methods=['GET', 'POST', 'DELETE'])
def login():
    if request.method == 'POST':
        _log.debug(request.form)
        user = db.login(request.form['user'])
        session['logged_user']= user
        return jsonify(user)
    elif request.method == 'GET':
        if 'logged_user' in session.keys():
            return session['logged_user']
        else:
            return {}, 401
    else:
        session.clear()
        return {}, 204
'''
