'''A module for testing the data.mongo module'''
# built-ins
import unittest
from unittest.mock import patch
# customs
import library.data.mongo as db
from library.data.logger import get_logger

log = get_logger(__name__)

class TestDatabase(unittest.TestCase):
    '''Contains unittests for functions in our database module'''
    @patch('library.data.mongo.lib.users')
    def test_login(self, mock_db):
        '''Tests that a username retrieves a user object'''
        user_dict = {'username':'William', 'role':'Test', '_id':'Test'}
        mock_db.find_one.return_value = user_dict
        username = 'William'
        user = db.login(username)
        log.debug(user)
        mock_db.find_one.assert_called_with({'username':'William'})
        self.assertIsNotNone(user, 'Should be not None')
        self.assertEqual(user.username, username, 'Should be equal')
    @patch('library.data.mongo.lib.users')
    def test_login_not_found(self, mock_db):
        '''Tests that a username retrieves a user object'''
        username = 'Tiborowitz'
        mock_db.find_one.return_value = None
        user = db.login(username)
        self.assertIsNone(user, 'Should be not None')

if __name__ == '__main__':
    unittest.main()
