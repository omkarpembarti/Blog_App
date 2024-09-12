// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCkJWajvY2QIixdOd6gOTm4FFHhjnWuEVs",
    authDomain: "blog-app-aab8d.firebaseapp.com",
    projectId: "blog-app-aab8d",
    storageBucket: "blog-app-aab8d.appspot.com",
    messagingSenderId: "127853498175",
    appId: "1:127853498175:web:36c5bd7c0ce0604c1b8d8a",
    measurementId: "G-EXD114K97D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);