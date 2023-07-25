import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAyXh2hpDEUKl_i0aXoI84ObH9H5fUU-GA",
    authDomain: "az-react-project.firebaseapp.com",
    projectId: "az-react-project",
    storageBucket: "az-react-project.appspot.com",
    messagingSenderId: "43110857861",
    appId: "1:43110857861:web:a58b7e6f54eb322a903dec"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase as default };
