from flask import Flask, jsonify, request

app = Flask(__name__)

trips = [
    { 'tripID': ['routes'] }
]


@app.route('/trip')
def get_trips():
    return jsonify(trips)


@app.route('/trip', methods=['POST'])
def add_trip():
    trips.append(request.get_json())
    return '', 204