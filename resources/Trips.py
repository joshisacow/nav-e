from flask import Flask, jsonify, request, abort, make_response, render_template
from flask_restful import Resource, reqparse

from resources.datasource.firestore_methods import trips_get, trips_post, trips_del

app = Flask(__name__)


class Trips(Resource):
    def get(self, tripID):
        return trips_get(tripID)
        
    
    def post(self, tripID):

        # parse args
        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("trip", type=str, action="append", help="trip is required", required=True)
        args = trips_post_args.parse_args()

        return trips_post(tripID, args)
    
    def delete(self, tripID):
        return trips_del(tripID)