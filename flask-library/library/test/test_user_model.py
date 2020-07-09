'''Test module to test the user model'''
import unittest

class UserTestSuite(unittest.TestCase):
    '''Test class to demonstrate test cases'''
    def test_works(self):
        '''Prints the word user to the console to demonstrate that the test ran'''
        print('user')
        self.assertIsNone(None)


if __name__ == '__main__':
    unittest.main()
