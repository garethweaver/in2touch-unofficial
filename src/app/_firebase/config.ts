// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBrV1Ei-8iDTfTzL7FSSK1Qw2kzEImxXQ",
  authDomain: "in2touch-cc0ab.firebaseapp.com",
  databaseURL: "https://in2touch-cc0ab.firebaseio.com",
  projectId: "in2touch-cc0ab",
  storageBucket: "in2touch-cc0ab.appspot.com",
  messagingSenderId: "410654017001",
  appId: "1:410654017001:web:5f53ac9fc10d3a5dabf778",
  measurementId: "G-LJ5GZ8JN1X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const analytics = getAnalytics(app);

export { database };
