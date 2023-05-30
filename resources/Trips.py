from firebase_admin import credentials, firestore, initialize_app, get_app
from flask import Flask, jsonify, request, abort, make_response, render_template
from flask_restful import Resource, reqparse

app = Flask(__name__)

# Initialize Firestore DB
db = firestore.client()
trips_ref = db.collection('trips')



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