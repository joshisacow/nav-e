import requests, json, base64, os
from dotenv import load_dotenv, find_dotenv

#initialize API key
load_dotenv(find_dotenv())
encoded_key = os.getenv("GMAPS_KEY")
MAP_KEY = json.loads(base64.b64decode(encoded_key).decode('utf-8'))


def getRoute(json_data):

    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'
    
    headers = {
        'content-type': 'application/json',
        'X-Goog-Api-Key': MAP_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    }
    
    r = requests.post(url, json=json_data, headers=headers)
    return r.json()
