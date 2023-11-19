// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDckOsvYg68jgU5g0wiWAfeXaE9OW0NfD8",
    authDomain: "autoshopweb-2a8ae.firebaseapp.com",
    projectId: "autoshopweb-2a8ae",
    storageBucket: "autoshopweb-2a8ae.appspot.com",
    messagingSenderId: "529254414340",
    appId: "1:529254414340:web:f88ada8f545cf60ff19d51"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const auth = getAuth(app)

export const db = getFirestore(app);