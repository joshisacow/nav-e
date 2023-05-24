from flask import Flask, jsonify, request, abort, make_response
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app)

trips = { 1: ['no', 'josh'],
        2: 'yes'}


class Main(Resource):
    def get(self):
        return "Nav-E API", 200
    
def abort_trip_dne(tripID):
    # not printing my message -> keyError: 0
    if int(tripID) not in trips:
        return "Trip does not exist", 404

def abort_trip_exists(tripID):
    if int(tripID) in trips:
        return "Trip already exists", 409
class Trips(Resource):
    def get(self, tripID):
        abort_trip_dne(tripID)
        return trips[int(tripID)], 200
    
    def post(self, tripID):
        abort_trip_exists(tripID)

        # parse args
        trips_post_args = reqparse.RequestParser()
        trips_post_args.add_argument("tripID", type=int, help="tripID is required", required=True)
        trips_post_args.add_argument("trip", type=list, help="trip is required", required=True)
        args = trips_post_args.parse_args()

        trips[int(tripID)] = args
        return trips[int(tripID)], 201
    
    def delete(self, tripID):
        abort_trip_dne(tripID)
        del trips[int(tripID)]
        return '', 204

api.add_resource(Main, '/')
api.add_resource(Trips, '/trips/<int:tripID>')

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