import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBkwgGZH8NigEzr-blzlPGFz0-jmAbhOyU",
    authDomain: "projects-b8a50.firebaseapp.com",
    projectId: "projects-b8a50",
    storageBucket: "projects-b8a50.firebasestorage.app",
    messagingSenderId: "919408097278",
    appId: "1:919408097278:web:f1ff5457413b7347c1f2af",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app); // Initialize Firestore

export { auth, googleProvider, db }; // Export Firestore (db)