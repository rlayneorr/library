''' A handler for User operations in our server '''
# External Modules
from http.server import SimpleHTTPRequestHandler
import json
# Internal Modules
import library.data.mongo as db
from library.users.model import UserEncoder
from library.data.logger import get_logger
from os import path

_log = get_logger(__name__)