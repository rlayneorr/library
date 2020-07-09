'''Module to test the library.media.model module'''
import unittest

import library.media.model
from library.users.model import User

# Unit Test Suite
class BookTestSuite(unittest.TestCase):
    ''' Test suite for Book class '''
    book = None
    user = None
    def setUp(self):
        ''' This method will run before every test '''
        print('setting up the book')
        BookTestSuite.book = library.media.model.Book('title', 'author', 'genre')
    def tearDown(self):
        ''' This method runs after each test '''
        print('Tearing the book')
        BookTestSuite.book = None
    @classmethod
    def setUpClass(cls):
        ''' This method runs before any tests '''
        print('setting up the entire suite')
        BookTestSuite.user = User()
    @classmethod
    def tearDownClass(cls):
        ''' This method runs after every test '''
        print('tear down the entire suite')
        BookTestSuite.user = None
    def test_is_available(self):
        ''' Tests that the book is available and then checks it out
            and tests that it is no longer available'''
        print('is available')
        print(BookTestSuite.book)
        self.assertTrue(BookTestSuite.book.is_available(), 'Should be true')
        BookTestSuite.book.borrower = BookTestSuite.user
        self.assertFalse(BookTestSuite.book.is_available(), 'Should be false')
    def test_check_out(self):
        '''Tests that the checkout function properly assigns a user to the book'''
        print('check out')
        self.assertIsNone(BookTestSuite.book.borrower)
        BookTestSuite.book.checkout(BookTestSuite.user)
        self.assertEqual(BookTestSuite.book.borrower, BookTestSuite.user,
                         'Should be the same person')

class MovieTestSuite(unittest.TestCase):
    '''Example of a second test suite in the same script'''
    def test_check_out(self):
        '''prints movie tot he console to demonstrate that test ran'''
        print('movie')
        self.assertIsNone(None)
if __name__ == '__main__':
    unittest.main()
