import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyANgKimbcj0yxxQC2gNuZHFHPhzINhEcxo",
    authDomain: "travis-187f4.firebaseapp.com",
    databaseURL: "https://travis-187f4.firebaseio.com",
    projectId: "travis-187f4",
    storageBucket: "travis-187f4.appspot.com",
    messagingSenderId: "375648150489",
    appId: "1:375648150489:web:2eee7dc7963871c45eefc8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CheckIn = (user) => {
    
    var date = new Date();
    if(user){
        db.collection("users").doc(user).update({ date:date })
        .then( () => { console.log('You checked in!'); })
        .catch( (error) => { console.log("Error writing checkin date: ", error)});
    }
    
}

const StoreContact = (newcon, user) => {
    if(user)
    {
        return FetchContacts().then(contacts => {
            contacts.push(newcon);
            db.collection("users").doc(user).update({ contacts:contacts })
            .then( () => { console.log('You saved contact info!'); })
            .catch( (error) => { console.log("Error writing contact info: ", error)});
            return contacts;
        });
    }
    else{
        return [];
    }
}

const RemoveContact = (oldContact, user) => {
    if(user){
        db.collection("users").doc(user).update({"contacts": firebase.firestore.FieldValue.arrayRemove(oldContact)}).catch((error) => console.log(error));
    }
}

async function FetchContacts(user, email) {
    if(user){
        db.collection("users").doc(user).update({"email":email});
        return db.collection("users")
        .doc(user)
        .get()
        .then(doc => {
            if (doc.data().contacts === undefined) return [];
            return doc.data().contacts;
        })
        .catch( (error) => { console.log("Error fetching data for user: ", user);});
    }
    else{
        return [];
    }
};

async function FetchTime(user) {
    if(user){
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
    }
    else{
        return new Date(0);
    }
};
    
const FirebaseHelper = {
    CheckIn,
    FetchTime,
    StoreContact,
    FetchContacts,
    RemoveContact,
    firebase
}

export default FirebaseHelper;