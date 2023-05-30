from flask import Flask, jsonify, request, abort, make_response, render_template
from flask_restful import Resource, Api, reqparse
from firebase_admin import credentials, firestore, initialize_app
import resources.Trips as Trips 

app = Flask(__name__)
api = Api(app)

class Main(Resource):
    def get(self):
        return "Nav-E API", 200

# @app.route('/login', methods = ['POST', 'GET'])
# def login():
#     if request.method == 'POST':
#         username = request.form.get('username')
#         password = request.form.get('password')
#         try: 
#             doc = db.collection('users').document(username).get()
#             if not doc.exists:
#                 return "user does not exist", 404
#             if doc.to_dict()['password'] != password:
#                 return "incorrect password", 401
#             return "login successful", 200
#         except:
#             return "failed to login"
    
#     return make_response(render_template('login.html')), 200

# @app.route('/create-account', methods = ['POST', 'GET'])
# def createAccount():
#     if request.method == 'POST':
#         username = request.form.get('username')
#         password = request.form.get('password')
#         try: 
#             doc = db.collection('users').document(username).get()
#             if doc.exists:
#                 return "user already exists", 409
#             db.collection('users').document(username).set({'password': password})
#             return "account created", 200
#         except:
#             return "failed to create account"
#     return make_response(render_template('create-account.html')), 200
    

            
    


api.add_resource(Main, '/')
api.add_resource(Trips.Trips, '/trips/<string:tripID>')
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)