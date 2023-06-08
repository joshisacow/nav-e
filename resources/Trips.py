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
        trips_post_args.add_argument("trip", type = list, action = "append", location = 'json', help="trip is required", required=True)
        args = trips_post_args.parse_args()

        # trip must have at least start and end
        if len(args['trip']) < 2:
            return "invalid trip", 400
        
        args = json.dumps(args['trip'])
        fs_post('trips', tripID, {'trip': args})
        return "trip added", 200
    
    def delete(self, tripID):
        doc = fs_get('trips', tripID)
        if doc is None:
            return "trip does not exist", 404
        fs_delete('trips', tripID)
        return 'trip deleted', 200
    
class Route(Resource):
    def get(self):
        return "hi", 200

    def build_json(self, arr, mode, tolls):

        # curr = datetime.datetime.utcnow().isoformat() + 'Z'

        # initialize json body
        json_data = {
            'origin': { 'location': {'latLng': {}} },
            'destination': { 'location': {'latLng': {}} },
            "travelMode": mode,
            "routingPreference": "TRAFFIC_UNAWARE",
            # "departureTime": curr, 
            "computeAlternativeRoutes": False,
            "routeModifiers": {
                "avoidTolls": tolls,
                "avoidHighways": False,
                "avoidFerries": False
            },
            "languageCode": "en-US"
        }
        # add origin and destination
        json_data['origin']['location']['latLng']['latitude'] = arr[0][0]
        json_data['origin']['location']['latLng']['longitude'] = arr[0][1]

        json_data['destination']['location']['latLng']['latitude'] = arr[-1][0]
        json_data['destination']['location']['latLng']['longitude'] = arr[-1][1]

        # add intermediates
        if len(arr) > 2:
            i = 1
            json_data['intermediates'] = []
            while i != len(arr)-1:
                json_data['intermediates'].append({'location': {'latLng': {}}})
                json_data['intermediates'][i-1]['location']['latLng']['latitude'] = arr[i][0]
                json_data['intermediates'][i-1]['location']['latLng']['longitude'] = arr[i][1]
                i+=1
        return json_data
        

    def post(self):
        route_post_args = reqparse.RequestParser()
        route_post_args.add_argument("trip", type=str, help="trip is required", required=True)
        route_post_args.add_argument("mode", type=str, help="travel mode is required")
        route_post_args.add_argument("tolls", type=bool, help="toll preference is required")
        args = route_post_args.parse_args()

        # check if params are provided
        if args["mode"] is None:
            mode = 'DRIVE'
        else:
            mode = args["mode"]
        if args["tolls"] is None:
            tolls = False
        else:
            tolls = args["tolls"]

        arr = json.loads(args['trip'])
        json_data = self.build_json(arr, mode, tolls)
        # return json_data, 200
        return getRoute(json_data), 200
