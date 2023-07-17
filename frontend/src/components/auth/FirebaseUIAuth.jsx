import { useEffect } from 'react'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import auth from '@/services/auth'

const FirebaseUIAuth = () => {
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: false,
            },
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            signInSuccessUrl: '/',
        });
    }, [])

    return (
        <div id="firebaseui-auth-container" ></div>
    )
}

export default FirebaseUIAuth
