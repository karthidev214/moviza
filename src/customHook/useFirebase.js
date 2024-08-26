import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // For Realtime Database
import { getFirestore } from 'firebase/firestore'; // For Firestore
import { getStorage } from 'firebase/storage'; // For Storage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTeUPlMVgXYt60SAUE7y5COkCxywRJbeQ",
    authDomain: "moviza-db6ad.firebaseapp.com",
    databaseURL: "https://moviza-db6ad-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "moviza-db6ad",
    storageBucket: "moviza-db6ad.appspot.com",
    messagingSenderId: "1088122486336",
    appId: "1:1088122486336:web:38f3550ca70e818a2969a5",
    measurementId: "G-XLQ7BYLPQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app); // For Realtime Database
const firestore = getFirestore(app); // For Firestore
const storage = getStorage(app); // Initialize Cloud Storage and get a reference to the service

export { auth, provider, database, firestore, storage };
