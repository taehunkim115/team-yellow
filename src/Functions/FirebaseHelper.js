import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBTMi1z22HLI8uiyOvLBOU_TkgSEwj18s4",
    authDomain: "checkin-26602.firebaseapp.com",
    databaseURL: "https://checkin-26602.firebaseio.com",
    projectId: "checkin-26602",
    storageBucket: "checkin-26602.appspot.com",
    messagingSenderId: "929723304013",
    appId: "1:929723304013:web:af2b97d82f2e6c06cfb404"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const user = "User4";

const CheckIn = () => {
    var date = new Date();
    db.collection("users").doc(user).set({ date })
    .then( () => { console.log('You checked in!'); })
    .catch( (error) => { console.log("Error writing checkin date: ", error)});
}

async function FetchTime() {
    return db.collection("users")
    .doc(user)
    .get()
    .then(doc => {
        var timestamp = doc.data().date.seconds*1000 + doc.data().date.nanoseconds/1000000;
        var date = new Date(timestamp);
        return date;
    })
    .catch( (error) => { console.log("Error fetching data for user: ", user);
                         return new Date(0); });
};
    
const FirebaseHelper = {
    user, 
    CheckIn,
    FetchTime
}

export default FirebaseHelper;