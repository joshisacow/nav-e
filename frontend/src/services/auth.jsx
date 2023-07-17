import firebase from 'firebase/compat/app'
import { getAuth } from "firebase/auth";

// decode json config 
const firebaseConfig = JSON.parse(Buffer.from(process.env.NEXT_PUBLIC_FIREBASE_CONFIG, 'base64').toString('utf-8'))

const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app)

export default auth;