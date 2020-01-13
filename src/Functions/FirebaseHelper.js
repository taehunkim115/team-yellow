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

const user = "User1";

const CheckIn = () => {
    console.log('You checked in!');
    var date = new Date();
    db.collection("test").doc(user).set({ time:date });
}

var time = ''

const FetchTime = async (n) => {
    try {
        const response = await fetch(db.collection("test").doc(user).get()).then((data) => {
            console.log(data.data())
        });
        if(!response.ok) throw response;
        time = await response.time;
        return time;
    } catch (e) {
        console.log(e);
        return null;
        // TODO: do something with this error
        // time = new Date(0);
    }
};
    
const FirebaseHelper = {
    user, 
    CheckIn,
    FetchTime,
    time
}

export default FirebaseHelper;