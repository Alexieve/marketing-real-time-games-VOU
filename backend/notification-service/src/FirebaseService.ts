// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcfVNg647hol3dXwLWrgPyrl9Xy9FnMaw",
  authDomain: "marketing-real-time-games-vou.firebaseapp.com",
  projectId: "marketing-real-time-games-vou",
  storageBucket: "marketing-real-time-games-vou.appspot.com",
  messagingSenderId: "667899663927",
  appId: "1:667899663927:web:98a03816094a0d204b91b2",
  measurementId: "G-15JDLDZ7DC"
};



// Initialize Firebase
export const _ = initializeApp(firebaseConfig);
