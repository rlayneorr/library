'''Modularization of Mongo data access
    Define all of our CRUD (Create, Read, Update, and Delete) in this file so as to
    separate those concerns'''
import os
from datetime import datetime, timedelta
import pymongo

from library.users.model import User
from library.media.model import Media, VideoGame, Book, Movie
from library.data.logger import get_logger


_log = get_logger(__name__)

try:
    _lib = pymongo.MongoClient(os.environ.get('MONGO_URI')).library
except:
    _log.exception('Could not connect to Mongo')
    raise
# CRUD Operations to our Database

def get_books():
    '''Read all books from the collection'''
    dict_list = _lib.books.find()
    return [Book.from_dict(book) for book in dict_list]

def get_books_page_bad(page=0, num_page=2):
    '''Returns the list of results''' 
    return _lib.books.find().skip(page*num_page).limit(num_page)

def get_books_page_better(last_index=0, num_page=2):
    dict_list = _lib.books.find({'_id':{'$gt':last_index}}).limit(num_page)
    results = [Book.from_dict(book) for book in dict_list]
    if len(results) == 0:
        return None
    return results

def get_book_by_id(db_id: int):
    '''Retrieves a book by its id'''
    return Book.from_dict(_lib.books.find_one({'_id': db_id}))
def get_movie_by_id(db_id: int):
    '''Retrieves a book by its id'''
    movie = _lib.movies.find_one({'_id': db_id})
    if movie:
        return Movie.from_dict(movie)
    else:
        return None
def get_video_game_by_id(db_id: int):
    '''Retrieves a video game by its id'''
    return VideoGame.from_dict(_lib.video_games.find_one({'_id': db_id}))
def get_movies():
    '''Read all movies from the collection'''
    dict_list = _lib.movies.find()
    movie_list = []
    for movie in dict_list:
        movie_list.append(Movie().from_dict(movie))
    return movie_list

def get_video_games():
    '''Read all video_games from the collection'''
    dict_list = _lib.video_games.find()
    video_game_list = []
    for video_game in dict_list:
        video_game_list.append(VideoGame().from_dict(video_game))
    return video_game_list

def get_book_by_title(title: str):
    '''returns all matching books by title'''
    _log.debug('Attempting to retrieve books matching %{title} from database.')
    query_dict = {'title': title}
    book_dict = _lib.books.find_one(query_dict)
    _log.debug(book_dict)
    _log.debug(type(book_dict))
    return Book.from_dict(book_dict) if book_dict else None

def get_movie_by_title(title: str):
    '''returns all matching movies by title'''
    query_dict = {'title': title}
    movie_dict = _lib.movie.find_one(query_dict)
    return Movie.from_dict(movie_dict) if movie_dict else None

def get_video_game_by_title(title: str):
    '''returns all matching video games by title'''
    query_dict = {'title': title}
    vg_dict = _lib.video_games.find_one(query_dict)
    return VideoGame.from_dict(vg_dict) if vg_dict else None

def find_checkedout_media(username: str):
    '''Retrieve all media checked out be user, returns a list of media'''
    query = {"borrower.username": username}
    media_list = []
    media_list += [Book.from_dict(book) for book in _lib.books.find(query)]
    media_list += [Movie.from_dict(movie) for movie in _lib.movies.find(query)]
    media_list += [VideoGame.from_dict(video) for video in _lib.video_games.find(query)]
    return media_list

def insert_media(media: Media):
    '''Inserts the media into the appropriate collection 
       based on the type of media'''
    media._id = _get_id()
    media_type = type(media).__name__
    if media_type == 'Book':
        _lib.books.insert_one(media.to_dict())
    if media_type == 'Movie':
        _lib.movies.insert_one(media.to_dict())
    if media_type == 'VideoGame':
        _lib.video_games.insert_one(media.to_dict())

def checkout_media(media: Media, borrower: User):
    '''Updates the borrower, checkout, and return dates
     of the document in the appropriate collection'''
    myquery = {"_id": media._id}
    _log.debug(myquery)
    _log.debug(borrower.to_dict())
    date = datetime.today()
    return_date = (datetime.now() + timedelta(days=30))
    media_type = type(media).__name__
    _log.debug(media_type)
    if media_type == 'Book':
        _lib.books.update_one(myquery,
                            {'$set': {"borrower": borrower.to_dict(),
                             "checkout_date": date,
                             "return_date": return_date}})
    if media_type == 'Movie':
        _lib.movies.update_one(myquery, 
                            {'$set': {"borrower": borrower.to_dict(),
                             "checkout_date": date,
                             "return_date": return_date}})
    if media_type == 'VideoGame':
        _log.debug('Updating a videogame')
        _lib.video_games.update_one(myquery, 
                            {'$set': {"borrower": borrower.to_dict(),
                             "checkout_date": date,
                             "return_date": return_date}})
    
    media.checkout(borrower, date, return_date)

def renew_media(media: Media):
    '''Renews the media, updating the return date of the document in the
       appropriate collection'''
    myquery = {"_id": media._id}
    return_date = (media.return_date + timedelta(days=30))
    media_type = type(media).__name__
    if media_type == 'Book':
        _lib.books.update_one(myquery,
                              {'$set': {"return_date": return_date}})
    if media_type == 'Movie':
        _lib.movies.update_one(myquery, 
                               {'$set': {"return_date": return_date}})
    if media_type == 'VideoGame':
        _lib.video_games.update_one(myquery, 
                                   {'$set': {"return_date": return_date}})
    media.renew(return_date)

def checkin_media(media: Media):
    myquery = {"_id": media._id}
    media_type = type(media).__name__
    if media_type == 'Book':
        _lib.books.update_one(myquery,
                              {'$unset': {'borrower': '', 'checkout_date': '', 'return_date': ''}})
    if media_type == 'Movie':
        _lib.movies.update_one(myquery, 
                               {'$unset': {'borrower': '', 'checkout_date': '', 'return_date': ''}})
    if media_type == 'VideoGame':
        _lib.video_games.update_one(myquery, 
                                   {'$unset': {'borrower': '', 'checkout_date': '', 'return_date':
                                    ''}})
    media.checkin()

def remove_media(media: Media):
    '''Removes the document from the appropriate collection'''
    value = int(media._id)
    string = type(media).__name__
    query = {"_id": value}
    if(string == 'VideoGame'):
        _lib['video_games'].remove(query)
    elif(string == 'Movie'):
        _lib['movies'].remove(query)
    elif(string == 'Book'):
        _lib['books'].remove(query)
    else:
        pass
def register_user(user: User):
    '''Registers a new user to the database'''
    _lib.users.insert_one(user.to_dict())
def update_book(book: Book):
    '''A function that takes in a book and updates the entire book with that id'''
    myquery = {"_id": book._id}
    _lib.books.update_one(myquery, {'$set': book.to_dict()})
def update_movie(movie: Movie):
    '''A function that takes in a movie and updates the entire book with that id'''
    myquery = {"_id": movie._id}
    _lib.movies.update_one(myquery, {'$set': movie.to_dict()})

def login(username: str):
    '''A function that takes in a username and returns a user object with that username'''
    _log.debug('Attempting to retrieve user from database')
    query_dict = {'username': username}
    user_dict = _lib.users.find_one(query_dict)
    _log.debug(user_dict)
    _log.debug(type(user_dict))
    # Ternary is "True value" if <condition> else "False Value"
    return User.from_dict(user_dict) if user_dict else None

def get_user_by_id(db_id: int):
    '''Returns a user by their id'''
    return User.from_dict(_lib.users.find_one({'_id': db_id}))

def _get_id():
    '''Retrieves the next id in the database and increments it.'''
    return _lib.counter.find_one_and_update({'_id': 'UNIQUE_COUNT'},
                                            {'$inc': {'count': 1}},
                                            return_document=pymongo.ReturnDocument.AFTER)['count']

def init_db():
    _log.info('Running Mongo script: dropping collections from _library database')
    _log.info(_lib.list_collection_names())
    _lib.books.drop()
    _lib.users.drop()
    _lib.video_games.drop()
    _lib.movies.drop()
    _lib.counter.drop()

    _lib.counter.insert_one({'_id': 'UNIQUE_COUNT', 'count': 0})

    user_list = []
    user_list.append(User(_get_id(), 'Matthew', 'Patron').to_dict())
    user_list.append(User(_get_id(), 'William', 'Patron').to_dict())
    user_list.append(User(_get_id(), 'Justin', 'Librarian').to_dict())

    video_game_list = []
    video_game_list.append(VideoGame(_get_id(), 'Minecraft', 'Mojang', 'Open World',
                                     'E', 'Xbox').to_dict())
    video_game_list.append(VideoGame(_get_id(), 'Heaven\'s Vault', 'Inkle',
                                     'Puzzle', 'E', 'PS4').to_dict())
    video_game_list.append(VideoGame(_get_id(), 'Overwatch', 'Blizzard',
                                     'FPS', 'E', 'PC').to_dict())
    video_game_list.append(VideoGame(_get_id(), 'Halo', 'Bungie', 'FPS', 'T', 'Xbox').to_dict())
    video_game_list.append(VideoGame(_get_id(), 'Animal Crossing', 'Nintendo',
                                     'Sim', 'E', 'Switch').to_dict())

    book_list = []
    book_list.append(Book(_get_id(), 'Harry Potter and the Prisoner of Azkaban', 'J.K. Rowling',
                          'Fantasy', '1234567892').to_dict())
    book_list.append(Book(_get_id(), 'Harry Potter and the Chamber of Secrets', 'J.K. Rowling',
                          'Fantasy', '1234567891').to_dict())
    book_list.append(Book(_get_id(), 'Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling',
                          'Fantasy', '1234567891').to_dict())
    book_list.append(Book(_get_id(), 'Dzur', 'Steven Brust', 'Fantasy', '1231231231').to_dict())
    book_list.append(Book(_get_id(), 'Great Expectations', 'Kathy Acker',
                          'Fiction', '1231231236').to_dict())
    book_list.append(Book(_get_id(), 'Great Expectations', 'Charles Dickens',
                          'Fiction', '1231231278').to_dict())
    movie_list = []
    movie_list.append(Movie(_get_id(), 'Harry Potter and the Sorcer\'s Stone',
                            'Chris Columbus', 'Fantasy', 'PG', [], 1.3).to_dict())

    _lib.users.insert_many(user_list)
    _lib.users.create_index('username', unique=True)
    _lib.video_games.insert_many(video_game_list)
    _lib.video_games.create_index('title')
    _lib.books.insert_many(book_list)
    _lib.books.create_index([('title', pymongo.ASCENDING), ('author', pymongo.ASCENDING)])
    # Should not index volatile fields.
    # _lib.books.create_index('borrower.username')
    _lib.movies.insert_many(movie_list)
    _lib.movies.create_index('title')

    book = book_list[0]
    user = user_list[0]
    checkout_media(Book.from_dict(book), User.from_dict(user))

'''
    for book in _lib.books.find().sort([('title', pymongo.ASCENDING),
                                        ('author', pymongo.ASCENDING)]):
        print(book)
    for book in _lib.books.find().sort([('title', pymongo.ASCENDING)]):
        print(book)
'''
