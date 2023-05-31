from flask import Flask, jsonify, request, abort, make_response, render_template
from flask_restful import Resource, Api, reqparse
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)
api = Api(app)

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)

# import resources
import resources.Trips as Trips 
import resources.Login as Login

class Main(Resource):
    def get(self):
        return "Nav-E API", 200


api.add_resource(Main, '/')
api.add_resource(Trips.Trips, '/trips/<string:tripID>')
api.add_resource(Login.Login, '/login')
api.add_resource(Login.SignUp, '/signup')    

if __name__ == '__main__':
    app.run(port=8080, debug=True)