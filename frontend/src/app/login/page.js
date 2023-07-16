"use client"

import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// decode json config 
const firebaseConfig = JSON.parse(Buffer.from(process.env.NEXT_PUBLIC_FIREBASE_CONFIG, 'base64').toString('utf-8'));

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: '/',
    });
  }, []);

  return (
    <>
      <h1>Login </h1>
      <div id="firebaseui-auth-container"></div>
    </>
  )
}