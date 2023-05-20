from flask import Flask, jsonify, request

app = Flask(__name__)

trips = [
    { 'tripID': ['routes'] }
]

@app.route('/trip/<tripID>', methods=['GET', 'PUT', 'DELETE'])
def tripId(tripID):
    if request.method == 'GET':
        return jsonify(trips[int(tripID)])
    elif request.method == 'PUT':
        trips[int(tripID)] = request.get_json()
        return '', 204
    elif request.method == 'DELETE':
        trips.pop(int(tripID))
        return '', 204
    else:
        return '', 405



@app.route('/trips', methods=['POST', 'GET', 'PUT', 'DELETE'])
def trips():
    if request.method == 'POST':
        trips.append(request.get_json())
        return '', 204
    elif request.method == 'GET':
        return jsonify(trips)
    # elif request.method == 'PUT': not sure if this is needed

    elif request.method == 'DELETE':
        trips.clear()
        return '', 204
    else:
        return '', 405
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)