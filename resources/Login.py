from flask import Flask, jsonify, make_response
from flask_restful import Resource, reqparse

from resources.datasource.firestore_methods import *

app = Flask(__name__)

class Login(Resource):
    def get(self):
        return {'username': 'username',
                'password': 'password'}, 200

    def post(self):
        # parse args
        login_post_args = reqparse.RequestParser()
        login_post_args.add_argument("username", type=str, help="username is required", required=True)
        login_post_args.add_argument("password", type=str, help="password is required", required=True)
        args = login_post_args.parse_args()

        username = args['username'].lower()
        password = args['password']
        try: 
            doc = fs_get('users', username)
            if doc is None:
                return "login failed", 401
            if doc['password'] != password:
                return "login failed", 401
            return "login successful", 200
        except:
            return "login failed"
        


class SignUp(Resource):
    def get(self):
        return {'username': 'username',
                'password': 'password'}, 200
    
    def post(self):
        # parse args
        create_post_args = reqparse.RequestParser()
        create_post_args.add_argument("username", type=str, help="username is required", required=True)
        create_post_args.add_argument("password", type=str, help="password is required", required=True)
        args = create_post_args.parse_args()

        username = args['username'].lower()
        password = args['password']
        try: 
            doc = fs_get('users', username)
            if doc is not None:
                return "username already exists", 401
            fs_post('users', username, {'password': password})
            return "account created", 200
        except:
            return "failed to create account"
        
