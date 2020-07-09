'''Defines the model for users'''
import json
import jwt
import datetime

from library.data.logger import get_logger

_log = get_logger(__name__)
_secret_key = '10101567unique'

class User:
    '''A class that defines how Users should behave'''
    def __init__(self, db_id=-1, username='', role=''):
        self._id = db_id
        self.username = username
        self.role = role
    def login(self, name):
        '''checks to see if this is the one'''
        return self.username == name
    def to_dict(self):
        '''returns the dictionary representation of itself'''
        return self.__dict__
    def get_role(self):
        '''returns the role of the user'''
        return self.role
    @classmethod
    def from_dict(cls, input_user):
        '''Creates an instance of the class from a dictionary'''
        user = User()
        user.__dict__.update(input_user)
        return user
    def encode_auth_token(self):
        ''' Generate an authentication token for this user '''
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                'iat': datetime.datetime.utcnow(),
                'sub': self._id
            }
            _log.debug("payload set")
            return jwt.encode(payload, _secret_key, algorithm='HS256')
        except Exception as e:
            _log.exception('Encode failed.')
            return e
    @staticmethod
    def decode_auth_token(auth_token):
        ''' Decode the auth token to receive the id of user '''
        try:
            payload = jwt.decode(auth_token, _secret_key)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Token expired. please login again.'
        except jwt.InvalidTokenError:
            return 'Token invalid. Please login.'

class UserEncoder(json.JSONEncoder):
    ''' Allows us to serialize our objects as JSON '''
    def default(self, o):
        return o.to_dict()

