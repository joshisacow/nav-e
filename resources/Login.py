from flask import Flask, jsonify, make_response
from flask_restful import Resource, reqparse
from firebase_admin import credentials, firestore, initialize_app, get_app

app = Flask(__name__)

# Initialize Firestore DB
db = firestore.client()
users_ref = db.collection('users')


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
            doc = users_ref.document(username).get()
            if not doc.exists:
                return "user does not exist", 404
            if doc.to_dict()['password'] != password:
                return "incorrect password", 401
            return "login successful", 200
        except:
            return "failed to login"


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
            doc = users_ref.document(username).get()
            if doc.exists:
                return "user already exists", 409
            users_ref.document(username).set({'password': password})
            return "account created", 200
        except:
            return "failed to create account"
