from flask import Flask
from flask_restful import Resource, reqparse
import json, datetime

from resources.datasource.firestore_methods import *
from resources.datasource.maps_api_methods import *

app = Flask(__name__)


class Trips(Resource):
    def get(self, tripID):
        doc = fs_get('trips', tripID)
        if doc is None:      
            return "trip does not exist", 404
        return doc, 200
        
    
    def post(self, tripID):

        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("trip", type = dict, action = "append", help="trip is required", required=True)
        args = trips_post_args.parse_args()

        # trip must have at least start and end
        if len(args['trip']) < 2:
            return "invalid trip", 400
        
        # args = json.dumps(args['trip'])
        fs_post('trips', tripID, args)
        return "trip added", 200
    
    def delete(self, tripID):
        doc = fs_get('trips', tripID)
        if doc is None:
            return "trip does not exist", 404
        fs_delete('trips', tripID)
        return 'trip deleted', 200
    

