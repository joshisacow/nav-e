from flask import Flask
from flask_restful import Resource, reqparse, request

from resources.datasource.maps_api_methods import *

app = Flask(__name__)

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
        json_data['origin']['location']['latLng']['latitude'] = arr[0].get("lat")
        json_data['origin']['location']['latLng']['longitude'] = arr[0].get("lng")

        json_data['destination']['location']['latLng']['latitude'] = arr[-1].get("lat")
        json_data['destination']['location']['latLng']['longitude'] = arr[-1].get("lng")

        # add intermediates
        if len(arr) > 2:
            i = 1
            json_data['intermediates'] = []
            while i != len(arr)-1:
                json_data['intermediates'].append({'location': {'latLng': {}}})
                json_data['intermediates'][i-1]['location']['latLng']['latitude'] = arr[i].get("lat")
                json_data['intermediates'][i-1]['location']['latLng']['longitude'] = arr[i].get("lng")
                i+=1
        return json_data
        

    def post(self):
        route_post_args = reqparse.RequestParser()
        route_post_args.add_argument("trip", type=dict, action="append", help="trip is required", required=True)
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

        arr = args['trip']
        json_data = self.build_json(arr, mode, tolls)
        # return json_data, 200
        return getRoute(json_data), 200
    
class Place(Resource):
    def get(self):
        # place_parser = reqparse.RequestParser()
        # place_parser.add_argument("placeID", type=str, help="placeID is required", required=True)
        # args = place_parser.parse_args()
        args = request.args.get('placeID')
        return getPlaceDetails(args), 200