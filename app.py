from flask import Flask, jsonify, request, abort, make_response
from flask_restful import Resource, Api, reqparse
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)
api = Api(app)

# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()
trips_ref = db.collection('trips')

trips = { 1: ['no', 'josh'],
        2: 'yes'}


class Main(Resource):
    def get(self):
        return "Nav-E API", 200
    
class Trips(Resource):
    def get(self, tripID):
        doc = trips_ref.document(str(tripID)).get()
        if not doc.exists:
            return "trip does not exist", 404
        return doc.to_dict(), 200
        
            
        
    
    def post(self, tripID):

        # parse args
        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("trip", type=str, action="append", help="trip is required", required=True)
        args = trips_post_args.parse_args()

        trips_ref.document(str(tripID)).set(args)
        return "trip added", 200
    
    def delete(self, tripID):
        doc = trips_ref.document(str(tripID)).get()
        if not doc.exists:
            return "trip does not exist", 404
        trips_ref.document(tripID).delete()
        return 'trip deleted', 200

api.add_resource(Main, '/')
api.add_resource(Trips, '/trips/<string:tripID>')

# @app.route("/")
# def index():
#     return "Hello, World!"

# @app.route('/trip/<tripID>', methods=['GET', 'PUT', 'DELETE'])
# def tripId(tripID):
#     if request.method == 'GET':
#         return jsonify(trips[int(tripID)])
#     elif request.method == 'PUT':
#         trips[int(tripID)] = request.get_json()
#         return '', 204
#     elif request.method == 'DELETE':
#         trips.pop(int(tripID))
#         return '', 204
#     else:
#         return '', 405



# @app.route('/trips', methods=['POST', 'GET', 'PUT', 'DELETE'])
# def trips():
#     if request.method == 'POST':
#         trips.append(request.get_json())
#         return '', 204
#     elif request.method == 'GET':
#         return jsonify(trips)
#     # elif request.method == 'PUT': not sure if this is needed

#     elif request.method == 'DELETE':
#         trips.clear()
#         return '', 204
#     else:
#         return '', 405
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)