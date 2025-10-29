import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAl4rTUtWuC_L2wv5tIkwNHR6rPG9hiGGg",
  authDomain: "app-clinica-medica-e0491.firebaseapp.com",
  projectId: "app-clinica-medica-e0491",
  storageBucket: "app-clinica-medica-e0491.firebasestorage.app",
  messagingSenderId: "267591403313",
  appId: "1:267591403313:web:ff4ae7db5dbdda71555210"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
