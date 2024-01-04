import requests, json, os
from dotenv import load_dotenv, find_dotenv

#initialize API key
load_dotenv(find_dotenv())
MAP_KEY = os.getenv("GMAPS_KEY")



def getRoute(json_data):

    url = 'https://routes.googleapis.com/directions/v2:computeRoutes'
    
    headers = {
        'content-type': 'application/json',
        'X-Goog-Api-Key': MAP_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    }
    
    r = requests.post(url, json=json_data, headers=headers)
    return r.json()

def getRouteMatrix(json_data):
    url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix'

    headers = {
        'content-type': 'application/json',
        'X-Goog-Api-Key': MAP_KEY,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration', #distanceMeters
    }
    
    r = requests.post(url, json=json_data, headers=headers)
    return r.json()


def getPlaceDetails(placeID):
    url = 'https://maps.googleapis.com/maps/api/place/details/json'

    headers = {

    }

    payload = {
        "place_id": placeID,
        "key": MAP_KEY,
        "fields": "formatted_address,name,url,formatted_phone_number,website,place_id,price_level,rating,user_ratings_total,editorial_summary,opening_hours",
    }
    #photo
    r = requests.get(url, headers = headers, params = payload)
    return r.json()
