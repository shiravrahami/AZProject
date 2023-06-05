/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import firebase from 'firebase/app';
import 'firebase/storage';

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const config ={
    apiKey: "AIzaSyAyXh2hpDEUKl_i0aXoI84ObH9H5fUU-GA",
  authDomain: "az-react-project.firebaseapp.com",
  projectId: "az-react-project",
  storageBucket: "az-react-project.appspot.com",
  messagingSenderId: "43110857861",
  appId: "1:43110857861:web:a58b7e6f54eb322a903dec"

}

const firebase = require('firebase');
firebase.initializeApp(config);
