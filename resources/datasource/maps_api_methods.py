import requests
import json
import base64
import os
from dotenv import load_dotenv, find_dotenv

#initialize API key
load_dotenv(find_dotenv())
MAP_KEY = os.getenv("GMAPS_KEY")
# MAP_KEY = json.loads(base64.b64decode(encoded_key).decode('utf-8'))


def getRoute(json_data):

    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'
    
    headers = {
        'content-type': 'application/json',
        'X-Goog-Api-Key': MAP_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    }
    r = requests.post(url, json=json_data, headers=headers)
    return r.json()

# sample input json

# json_data = {
#     'origin': {
#         'location': {
#             'latLng': {
#                 'latitude': 37.419734,
#                 'longitude': -122.0827784,
#             },
#         },
#     },
#     'destination': {
#         'location': {
#             'latLng': {
#                 'latitude': 37.417670,
#                 'longitude': -122.079595,
#             },
#         },
#     },
#     'travelMode': 'DRIVE',
#     'routingPreference': 'TRAFFIC_AWARE',
#     'departureTime': '2023-10-15T15:01:23.045123456Z',
#     'computeAlternativeRoutes': False,
#     'routeModifiers': {
#         'avoidTolls': False,
#         'avoidHighways': False,
#         'avoidFerries': False,
#     },
#     'languageCode': 'en-US',
#     'units': 'IMPERIAL',
# }
