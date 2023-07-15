from flask import Flask
from flask_restful import Resource, reqparse, request
from itertools import permutations

from resources.datasource.maps_api_methods import *

app = Flask(__name__)

class Route(Resource):

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
    
    def build_matrix_json(self, arr):
        points = []
        for point in arr:
            points.append(
                {"waypoint": 
                    {"location": 
                        {"latLng": {
                            "latitude": point.get("lat"), 
                            "longitude":point.get("lng")
                            }
                        }
                    }
                })
        json_data = {
            "origins": points,
            "destinations": points,
            "travelMode": "DRIVE"
        }
        return json_data
    
    def calculate_path_length (self, arr, matrix):
        length = 0
        for i in range(len(arr)-1):
            length += matrix[arr[i]][arr[i+1]]
        return length
        

    def get(self):
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
    

    def post(self):
        route_post_args = reqparse.RequestParser()
        route_post_args.add_argument("trip", type=dict, action="append", help="trip is required", required=True)
        args = route_post_args.parse_args()
        arr = []
        for point in args['trip']:
            arr.append(point["position"])
        raw_matrix = getRouteMatrix(self.build_matrix_json(arr))

        # initialize matrix
        matrix = []
        for i in range(len(arr)):
            matrix.append([])
            for j in range(len(arr)):
                matrix[i].append(0)
        
        # fill matrix with durations
        for point in raw_matrix:
            matrix[point.get("originIndex")][point.get("destinationIndex")] = int(point.get("duration")[:-1]) # remove 's' from duration

        # store original indices in array
        index_arr = [i for i in range(len(arr))]

        # test all possible permutations
        # for permutation in list(permutations(range(1, len(arr)))):
        #     new_path = [0]
        #     for index in permutation:
        #         new_path.append(index)
        #         new_length = self.calculate_path_length(new_path, matrix)
        #         if new_length < init_length:
        #             index_arr = new_path
        #             init_length = new_length


        # 2-opt algorithm
        init_length = self.calculate_path_length(index_arr, matrix)
        improved = True
        while improved:
            improved = False
            for i in range(1, len(index_arr)-2):
                for j in range(i, len(index_arr)):
                    if j-i == 1: continue
                    new_path = index_arr[:i] + index_arr[i:j+1][::-1] + index_arr[j+1:]
                    new_length = self.calculate_path_length(new_path, matrix)
                    if new_length < init_length:
                        index_arr = new_path
                        improved = True
                        init_length = new_length

        # transform array of indices to array of coordinates
        opt_route = [args["trip"][i] for i in index_arr]
        opt_arr = []
        for point in opt_route:
            opt_arr.append(point["position"])
        return [opt_route, getRoute(self.build_json(opt_arr, 'DRIVE', False))], 200



class Place(Resource):
    def get(self):
        # place_parser = reqparse.RequestParser()
        # place_parser.add_argument("placeID", type=str, help="placeID is required", required=True)
        # args = place_parser.parse_args()
        args = request.args.get('placeID')
        return getPlaceDetails(args), 200