import React, { useState, useEffect } from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container, Table, Field, Control, Input, Content, Message } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';
import * as emailjs from 'emailjs-com'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


const currentDate = new Date();

emailjs.init("user_5eWzW76xiRQHYgG8R0toY");

var templateParams = {
  user_name: '', // user name
  to_name: '', // emergency contact name
  to_email: '', // emergency contact email
  from_name: 'CheckIn', // App name
  checkin_email: 'checkin.yellow@gmail.com' // App email
 };

const ButtonEnabled = (time, user) => {
  if(!user) return true;
  return (
    time.getDay() === currentDate.getDay() && time.getMonth() === currentDate.getMonth() && time.getYear() === currentDate.getYear()
  );
};

const App = () => {
  const [disabled, setDisabled] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [user, setUser] = useState(null);
  const [UserEmail, setUserEmail] = useState(null);

  const StartOnUserLoad = (newUser) =>{
    if(!newUser){
      console.log("user missing");
    }
    else{
      console.log(newUser.displayName)
    
      setUser(newUser.displayName);
      console.log(user)
      FirebaseHelper.FetchTime(newUser.displayName).then(time => { 
        setDisabled(ButtonEnabled(time, newUser.displayName));
      });
      setUserEmail(newUser.email);
      FirebaseHelper.FetchContacts(newUser.displayName, newUser.email).then(currContacts => {
        console.log(currContacts);
        setContacts(currContacts);
      });
    }
  };


  useEffect(() => {
    const startContacts = () => {
      FirebaseHelper.FetchContacts().then(currContacts => {
        setContacts(currContacts);
      })
    };
    startContacts();
  }, []);

  useEffect(() => {
    FirebaseHelper.firebase.auth().onAuthStateChanged(StartOnUserLoad);
  }, []);

  useEffect(() =>{
    FirebaseHelper.FetchTime().then(time => { 
      setDisabled(ButtonEnabled(time, user));
    });
  }, user);
  const Banner = ({ user }) => (
    <React.Fragment>
      { user ? <Welcome user={ user } /> : <SignIn /> }
    </React.Fragment>
  );

  const Welcome = ({ user }) => (
    <Message color="info">
      <Message.Header>
        Welcome, {user}
        <Button primary onClick={SignOut}>
          Log out
        </Button>
      </Message.Header>
    </Message>
  );
  
  const SignIn = () => {
    FirebaseHelper.FetchTime().then(time => { 
      setDisabled(ButtonEnabled(time, user));
    });
    return (
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={FirebaseHelper.firebase.auth()}
      />
      )
    };
  
  const SignOut = () => {
    setDisabled(true);
    FirebaseHelper.firebase.auth().signOut();
    setUser(null);
    setContacts([]);
    setUserEmail(null);
  };

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      FirebaseHelper.firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

  
  const ButtonClick = (contacts) => {
    FirebaseHelper.CheckIn(user.displayName);
    setDisabled(true);

    contacts.map((contact) => {
      templateParams.user_name = user;
      templateParams.to_name = contact.name; // set emergency contact name
      templateParams.to_email = contact.email; // set emergency contact email
      emailjs.send("gmail", "checkin", templateParams, "user_5eWzW76xiRQHYgG8R0toY");
      })
  }

  const RemoveContact = (contact) => {
    FirebaseHelper.RemoveContact(contact, user);

    FirebaseHelper.FetchContacts(user).then(currContacts => {
      setContacts(currContacts);
    })
  }

  const AddContact = (name, email) => {
    if (!RegExp('[a-zA-Z0-9-_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+').test(email)) {
      setInvalidEmail(true);
      return
    }
    setInvalidEmail(false);
    FirebaseHelper.StoreContact({name:name, email:email}, user).then( newContacts => {
      setContacts(newContacts);
    });
    templateParams.user_name = user;
    templateParams.to_name = user;
    templateParams.to_email = UserEmail;
    console.log(templateParams);
    emailjs.send("gmail", "reminder", templateParams, "user_5eWzW76xiRQHYgG8R0toY");
    var inputs = document.getElementsByTagName('Input');
    for (var i=0; i < inputs.length; i++) {
      inputs[i].value = ''
    }
  }

  const EmergencyContacts = ({contacts}) => {
    return (
      <Table id='contact-table'>
        <Table.Body>
          {contacts.map(contact =>
            <Table.Row key={contact.name.concat('_', contact.email)}>
              <Table.Cell>
                {contact.name}
              </Table.Cell>
              <Table.Cell>
                {contact.email}
              </Table.Cell>
              <Table.Cell>
                <Button onClick={()=>{RemoveContact(contact)}}>X</Button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  };

  var currName = '';
  var currNum = '';

  return (
    <Container>
      <Banner user={user} />
      <br/>


      <br/>

      <Title subtitle size={4} className='checkin-text' hidden={ !disabled }>You CheckedIn!</Title>
      <Title className='checkin-text' hidden={ disabled }>Please CheckIn!</Title>

      <Button.Group align="centered">
        <Button id='checkin-button' rounded={ true } color={ 'danger' } size={ 'large' } onClick={()=>{ alert("You have checked in!");ButtonClick(contacts);} } disabled={ disabled }>CheckIn</Button>
      </Button.Group>


      <br/>
      {/* <hr className='divider'/> */}
      <Button.Group align="centered">
        <Button hidden={showContacts} onClick={() => {setShowContacts(true)}}>Edit Contacts</Button>
        <Button hidden={!showContacts} onClick={() => {setShowContacts(false)}}>Close Contact Edit</Button>
      </Button.Group>
      
      <div hidden={!showContacts}>
      <Title size={5} id='contact-header'>Emergency Contacts</Title>
      <EmergencyContacts contacts={ contacts }/>
      <br/>
      
      <Field>
        <Control className='input-box'>
          <Input type='text' placeholder="Contact's Name" onChange={ e => currName=e.target.value }/>
        </Control>
        <Control className='input-box'>
          <Input type='text' placeholder="Contact's Email" onChange={ e => currNum=e.target.value }/>
        </Control>
      </Field>
      <Content size='medium' className='invalid-email' hidden={ !invalidEmail }>Invalid Email</Content>
      <br/>
      <Button.Group align='centered'>
        <Button size={ 'medium' } color={ 'info' } onClick={() => AddContact(currName, currNum) }>Add Emergency Contacts</Button>
      </Button.Group>
      </div>

    </Container>
  )
};

export default App;