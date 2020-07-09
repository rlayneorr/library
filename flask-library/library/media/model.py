''' Modularization of the model of the Book app for library '''
#from library.data.mongo import find_checkedout_media
import json
import datetime
from library.users.model import User
from library.data.logger import get_logger

_log = get_logger(__name__)
class Media:
    '''A class that defines how media should behave'''
    def __init__(self, db_id=-1, title='', genre=''):
        ''' A method. A function defined within a class that takes self as a parameter
        is a method of that object type. '''
        self._id = db_id
        self.title = title
        self.genre = genre
        self.borrower = None
        self.checkout_date = None
        self.return_date = None
    def checkout(self, borrower, checkout_date, return_date):
        '''sets the borrower's name to the person who checked out the book'''
        print('Media checkout')
        self.borrower = borrower
        self.checkout_date = checkout_date
        self.return_date = return_date
    def renew(self, new_date):
        '''updates the due date given the media is already checked out'''
        self.return_date = new_date
    def checkin(self):
        '''Returns the book to the library'''
        self.borrower = None
        self.checkout_date = None
        self.return_date = None
    def is_available(self):
        '''Returns True if book is not checked out, False otherwise'''
        return not self.borrower
    def to_dict(self):
        '''Creates and returns a dictionary representation of instance'''
        dict_rep = self.__dict__
        if self.borrower:
            dict_rep['borrower'] = self.borrower.to_dict()
        return self.__dict__
    @classmethod
    def from_dict(cls, input_dict):
        '''Creates an instance of the class from a dictionary input'''
        # Create a new media
        media = cls()
        # Take the input_dict data and put it inside of the media
        media.__dict__.update(input_dict)
        if media.borrower:
            media.borrower = User.from_dict(media.borrower)
        if media.checkout_date and isinstance(media.checkout_date, str):
            media.checkout_date = datetime.datetime.fromisoformat(media.checkout_date)
        if media.return_date and isinstance(media.checkout_date, str):
            media.return_date = datetime.datetime.fromisoformat(media.return_date)
        # Return the media
        return media

class Movie(Media):
    '''Class for storing movie information'''
    def __init__(self, db_id=-1, title='', director='', genre='', rating='', actors=None, length=0):
        super().__init__(db_id, title, genre)
        self.director = director
        self.rating = rating
        self.actors = actors
        self.length = length
    def __str__(self):
        string = self.title + ' directed by '+ self.director + '/' +self.genre
        string += '\n'+self.rating+', '+str(self.length)
        if self.borrower:
            string += ' - CHECKED OUT'
        return string
    def __repr__(self):
        return self.__str__()
    @classmethod
    def validate(cls, values_dict: dict):
        valid_movie = ""
        if not values_dict['title'] or not isinstance(values_dict['title'], str):
            valid_movie += "INVALID title\n"
        if not values_dict['director'] or not isinstance(values_dict['director'], str):
            valid_movie += "INVALID director\n"
        if not values_dict['genre'] or not isinstance(values_dict['genre'], str):
            valid_movie += "INVALID genre\n"
        if not values_dict['rating'] or not isinstance(values_dict['rating'], str):
            valid_movie += "INVALID rating\n"
        if not values_dict['length'].isdigit():
            valid_movie += "INVALID length\n"
        # if not values_dict['actors']:
        #     valid_movie += 'INVALID actors'
        # else:
        #     for actor in values_dict['actors']:
        #         if not actor or not isinstance(actor, str):
        #             valid_movie += "INVALID actor\n"
        return valid_movie


class Book(Media):
    '''The Book class defines the state and behavior of books'''
    #Python has no (real) concept of overloading
    def __init__(self, db_id=-1, title='', author='', genre='', isbn=''):
        super().__init__(db_id, title, genre)
        self.author = author
        self.isbn = isbn
    def __str__(self):
        string = self.isbn + ': ' + self.title + ' by '+ self.author + '/' +self.genre
        if self.borrower:
            string += ' - CHECKED OUT'
        return string
    def __repr__(self):
        return self.__str__()
    @classmethod
    def validate(cls, values_dict: dict):
        valid_book = ""
        if not values_dict['title'] or not isinstance(values_dict['title'], str):
            valid_book += "INVALID title\n"
        if not values_dict['author'] or not isinstance(values_dict['author'], str):
            valid_book += "INVALID author\n"
        if not values_dict['genre'] or not isinstance(values_dict['genre'], str):
            valid_book += "INVALID genre\n"
        if not values_dict['isbn'] or not isinstance(values_dict['isbn'], str):
            valid_book += "INVALID isbn\n"
        elif not len(values_dict['isbn']) == 13:
            valid_book += "INVALID isbn\n"
        elif not values_dict['isbn'].isdigit():
            valid_book += "INVALID isbn\n"
        return valid_book




class VideoGame(Media):
    '''The Video Game class defines the state and the behavior of video games'''
    def __init__(self, db_id=-1, title='', developer='', genre='', rating='', platform=''):
        super().__init__(db_id, title, genre)
        self.developer = developer
        self.rating = rating
        self.platform = platform
    def __str__(self):
        string = self.title + " by " + self.developer + "/" + self.genre
        string += "\n\t" + self.platform + ", " + self.rating
        if self.borrower:
            string += " - CHECKED OUT"
        return string
    def __repr__(self):
        return self.__str__()

class MediaEncoder(json.JSONEncoder):
    ''' Allows us to serialize our objects as JSON '''
    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.__str__()
        return o.to_dict()
