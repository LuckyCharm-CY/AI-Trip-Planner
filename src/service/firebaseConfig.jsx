// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe6jxg_o18QPN1c302UmJdriwGj-osJ9c",
  authDomain: "travelbuddy-2b5a8.firebaseapp.com",
  projectId: "travelbuddy-2b5a8",
  storageBucket: "travelbuddy-2b5a8.firebasestorage.app",
  messagingSenderId: "613445061324",
  appId: "1:613445061324:web:f832a2f13421d6a1f7d069",
  measurementId: "G-HHL6MFTWT7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
// const analytics = getAnalytics(app);