import requests, json, base64, os
from dotenv import load_dotenv, find_dotenv

from flask import Flask

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


def getPlaceDetails(placeID):
    url = 'https://maps.googleapis.com/maps/api/place/details/json'

    headers = {

    }

    payload = {
        "place_id": placeID,
        "key": MAP_KEY,
        "fields": "formatted_address,name,url,business_status,formatted_phone_number,website",
    }
    # photo,price_level,rating,reviews,user_ratings_total,editorial_summary
    r = requests.get(url, headers = headers, params = payload)
    return r.json()
