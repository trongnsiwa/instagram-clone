import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDEgAkSmZ9zBeKi-92qmQ0txY4l76B8MJI",
  authDomain: "intagram-clone-48e11.firebaseapp.com",
  projectId: "intagram-clone-48e11",
  storageBucket: "intagram-clone-48e11.appspot.com",
  messagingSenderId: "379664132569",
  appId: "1:379664132569:web:f8616d9289c9e4f3ce91c8",
  measurementId: "G-ZPMQ9T89GR",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
