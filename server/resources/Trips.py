from flask import Flask
from flask_restful import Resource, reqparse, request
import json, datetime

from resources.datasource.firestore_methods import *
from resources.datasource.maps_api_methods import *

app = Flask(__name__)


class Trips(Resource):

    def get(self, userID):
        doc = fs_get('trips', userID)
        if doc is None or 'trip' not in doc:      
            return "trip does not exist", 404
        return json.loads(doc['trip']), 200
        
    
    def post(self, userID):

        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("trip", type = dict, action = "append", help="trip is required", required=True)
        args = trips_post_args.parse_args()

        # trip must have at least start and end
        if len(args['trip']) < 2:
            return "invalid trip", 400
        
        doc = fs_get('trips', userID)
        if doc is None or 'trip' not in doc:
            # initialize to empty array
            fs_post('trips', userID, {'trip': json.dumps([args['trip']])})
        else:
            # append to existing array
            doc = json.loads(doc['trip'])
            doc.append(args['trip'])
            fs_post('trips', userID, {'trip': json.dumps(doc)})
        return "trip added", 200
    
    def delete(self, userID):
        doc = fs_get('trips', userID)
        if doc is None or 'trip' not in doc:
            return "trip does not exist", 404
        
        # parse index
        args = request.args.get('index')
        doc = json.loads(doc['trip'])
        del doc[int(args)]
        fs_post('trips', userID, {'trip': json.dumps(doc)})
        return 'trip deleted', 200
    

