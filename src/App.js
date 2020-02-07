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
  user_name: FirebaseHelper.user, // user name
  to_name: '', // emergency contact name
  to_email: '', // emergency contact email
  from_name: 'CheckIn', // App name
  checkin_email: 'checkin.yellow@gmail.com' // App email
 };

const ButtonEnabled = (time) => {
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


  FirebaseHelper.FetchTime().then(time => { 
    setDisabled(ButtonEnabled(time));
  });

  useEffect(() => {
    const startContacts = () => {
      FirebaseHelper.FetchContacts().then(currContacts => {
        setContacts(currContacts);
      })
    };
    startContacts();
  }, []);

  useEffect(() => {
    FirebaseHelper.firebase.auth().onAuthStateChanged(setUser);
  }, []);

  const Banner = ({ user }) => (
    <React.Fragment>
      { user ? <Welcome user={ user } /> : <SignIn /> }
    </React.Fragment>
  );

  const Welcome = ({ user }) => (
    <Message color="info">
      <Message.Header>
        Welcome, {user.displayName}
        <Button primary onClick={() => FirebaseHelper.firebase.auth().signOut()}>
          Log out
        </Button>
      </Message.Header>
    </Message>
  );
  
  const SignIn = () => (
    <StyledFirebaseAuth
      uiConfig={uiConfig}
      firebaseAuth={FirebaseHelper.firebase.auth()}
    />
  );
  
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
    FirebaseHelper.CheckIn();
    setDisabled(true);

    contacts.map((contact) => {
      templateParams.to_name = contact.name; // set emergency contact name
      templateParams.to_email = contact.email; // set emergency contact email
      emailjs.send("gmail", "checkin", templateParams, "user_5eWzW76xiRQHYgG8R0toY");
      })
  }

  const RemoveContact = (contact) => {
    FirebaseHelper.RemoveContact(contact);

    FirebaseHelper.FetchContacts().then(currContacts => {
      setContacts(currContacts);
    })
  }

  const AddContact = (name, email) => {
    if (!RegExp('[a-zA-Z0-9-_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+').test(email)) {
      setInvalidEmail(true);
      return
    }
    setInvalidEmail(false);

    FirebaseHelper.StoreContact({name:name, email:email}).then( newContacts => {
      setContacts(newContacts);
    });

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