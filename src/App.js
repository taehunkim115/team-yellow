import React, { useState, useEffect } from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container, Table, Field, Control, Input, Content, Modal } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';

const currentDate = new Date();

const ButtonEnabled = (time) => {
  return (
    time.getDay() === currentDate.getDay() && time.getMonth() === currentDate.getMonth() && time.getYear() === currentDate.getYear()
  );
};

// NEW: Commented out and moved to useEffect() in App function
// const startContacts = (setContacts) => {
//   FirebaseHelper.FetchContacts().then(currContacts => {
//     setContacts(currContacts);
//   })
// };

const App = () => {
  const [disabled, setDisabled] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  // startContacts(setContacts);
  // if we uncomment this, currNum does not get passed into the addContact Function on line 104. We dont know why

  FirebaseHelper.FetchTime().then(time => { 
    setDisabled(ButtonEnabled(time));
  });

  // NEW: using useEffect will run startContacts on every render, so contact data from firestore is read every render
  // it's also inside the App function so no issue regarding passing setContacts
  useEffect(() => {
    const startContacts = () => {
      FirebaseHelper.FetchContacts().then(currContacts => {
        setContacts(currContacts);
      })
    };
    startContacts();
  }, []);

  const ButtonClick = () => {
    FirebaseHelper.CheckIn();
    setDisabled(true);
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
      <br/>
      <Button.Group align="centered">
        <Title>Welcome, { FirebaseHelper.user }!</Title>
      </Button.Group>

      <br/>

      <Title subtitle size={4} className='checkin-text' hidden={ !disabled }>You CheckedIn!</Title>
      <Title className='checkin-text' hidden={ disabled }>Please CheckIn!</Title>

      <Button.Group align="centered">
        <Button id='checkin-button' rounded={ true } color={ 'danger' } size={ 'large' } onClick={()=>{ alert("You have checked in!");ButtonClick();} } disabled={ disabled }>CheckIn</Button>
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