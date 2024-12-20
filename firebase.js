// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCubaw5RIhclc6HyvgSDrH7pD-3r3y2tvo",
    authDomain: "munitoring.firebaseapp.com",
    projectId: "munitoring",
    storageBucket: "munitoring.firebasestorage.app",
    messagingSenderId: "637659575083",
    appId: "1:637659575083:web:e6ae2a9a6b5b8a6d7a0b6e",
    measurementId: "G-7V9HJVXW8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
