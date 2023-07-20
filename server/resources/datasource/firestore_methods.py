from firebase_admin import credentials, firestore
from flask import Flask

app = Flask(__name__)

db = firestore.client()

def fs_get(colID, docID):
    return db.collection(str(colID)).document(str(docID)).get().to_dict()

def fs_post(colID, docID, args):
    db.collection(str(colID)).document(str(docID)).set(args)

#removes entire document
def fs_delete(colID, docID):
    db.collection(str(colID)).document(str(docID)).delete()

