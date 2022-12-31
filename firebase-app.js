// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLZYV9SX66f5XH1jkgiN-29wc7Y1-EWQ4",
  authDomain: "venany-capstone-r2me.firebaseapp.com",
  projectId: "venany-capstone-r2me",
  storageBucket: "venany-capstone-r2me.appspot.com",
  messagingSenderId: "869365617997",
  appId: "1:869365617997:web:bbfbe29a41c1addbe25304",
  measurementId: "G-GSL82WBTC7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
