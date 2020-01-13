import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import React from 'react';

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
const db = firebase.firestore(); //database().ref("test/test/");

const user = "User1";

const CheckIn = () => {
    console.log('You checked in!');
    var date = new Date();
    db.collection("test").doc(user).set({ time:date });
}

var time = ''

const FetchTime = () => {
    db.collection("test").doc(user).get().then((data) => {
        console.log(data.data())
        time = data.data().time
    })
}

const FirebaseHelper = {
    user, 
    CheckIn,
    FetchTime,
    time
}

export default FirebaseHelper;