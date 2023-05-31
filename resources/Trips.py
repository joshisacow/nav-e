from flask import Flask, jsonify, request, abort, make_response, render_template
from flask_restful import Resource, reqparse

from resources.datasource.firestore_methods import *

app = Flask(__name__)


class Trips(Resource):
    def get(self, tripID):
        doc = fs_get('trips', tripID)
        if not doc.exists:
            return "trip does not exist", 404
        return doc.to_dict(), 200
        
    
    def post(self, tripID):

        # parse args
        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("trip", type=str, action="append", help="trip is required", required=True)
        args = trips_post_args.parse_args()

        fs_post('trips', tripID, args)
        return "trip added", 200
    
    def delete(self, tripID):
        doc = fs_get('trips', tripID)
        if not doc.exists:
            return "trip does not exist", 404
        fs_delete('trips', tripID)
        return 'trip deleted', 200