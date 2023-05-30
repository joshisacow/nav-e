from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request, abort, make_response, render_template

app = Flask(__name__)

db = firestore.client()

# trips methods

def trips_get(tripID):
    doc = db.collection('trips').document(str(tripID)).get()
    if not doc.exists:
        return "trip does not exist", 404
    return doc.to_dict(), 200

def trips_post(tripID, args):
    db.collection('trips').document(str(tripID)).set(args)
    return "trip added", 200

def trips_del(tripID):
    doc = db.collection('trips').document(str(tripID)).get()
    if not doc.exists:
        return "trip does not exist", 404
    db.collection('trips').document(tripID).delete()
    return 'trip deleted', 200



# authentication methods

def authenticate(username, password):
    try: 
        doc = db.collection('users').document(username).get()
        if not doc.exists:
            return "login failed", 401
        if doc.to_dict()['password'] != password:
            return "login failed", 401
        return "login successful", 200
    except:
        return "login failed"
    
def create_account(username, password):
    try: 
        doc = db.collection('users').document(username).get()
        if doc.exists:
            return "username already exists", 401
        db.collection('users').document(username).set({'password': password})
        return "account created", 200
    except:
        return "failed to create account"