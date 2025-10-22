// Import the functions you need from the SDKs you need
import firebase from "firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAreOKHhUYEVjfO_Fulu26JutDNLPG5Lwc",
  authDomain: "apps-eng-software.firebaseapp.com",
  databaseURL: "https://apps-eng-software-default-rtdb.firebaseio.com",
  projectId: "apps-eng-software",
  storageBucket: "apps-eng-software.firebasestorage.app",
  messagingSenderId: "1004161560851",
  appId: "1:1004161560851:web:eabcc6a776afb90571aae6",
  measurementId: "G-Y3EKYJFXSG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
