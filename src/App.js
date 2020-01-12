import React from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';


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
const db = firebase.database().ref("test/test/");


const CheckIn = () => {
  console.log('You checked in!');
  var date = new Date();
  db.set({ time:date });
}

function App() {
  return (
    <Container>
      <Title>Welcome, John!</Title>
      <Button rounded={ true } color={ 'danger' } size={ 'large' } onClick={ CheckIn }>CheckIn</Button>
    </Container>
  );
}

export default App;
