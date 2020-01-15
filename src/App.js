import React, { useState } from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container, Table } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';

const currentDate = new Date();

const ButtonEnabled = (time) => {
  return (
    time.getDay() === currentDate.getDay() && time.getMonth() === currentDate.getMonth() && time.getYear() === currentDate.getYear()
  );
};

const EmergencyContacts = (contacts) => {
  console.log(contacts);

  return (
    <Table>
        <Table.Head>Emergency Contact</Table.Head>
        <Table.Body>
          {contacts.map(contact =>
            <Table.Row>
              <Table.Cell>{contact.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
  );
};

const App = () => {
  const [disabled, setDisabled] = useState(true);
  FirebaseHelper.FetchTime().then(time => { 
    setDisabled(ButtonEnabled(time));
  });

  const ButtonClick = () => {
    FirebaseHelper.CheckIn();
    setDisabled(true);
  }

  return (
    <Container>
      <Button.Group align="centered">
        <Title>Welcome, { FirebaseHelper.user }!</Title>
      </Button.Group>
      <Button.Group align="centered">
        <Button rounded={ true } color={ 'danger' } size={ 'large' } onClick={ ButtonClick } disabled={ disabled }>CheckIn</Button>
      </Button.Group>
      <div className='checkin-text' hidden={ !disabled }>You CheckedIn!</div>
      <div className='checkin-text' hidden={ disabled }>Please CheckIn!</div>
      <EmergencyContacts contacts={ [{name:'Jane Doe'}, {name: 'Jhon Doe'}] }></EmergencyContacts>
      <Button.Group align='centered'>
        <Button size={ 'medium' } color={ 'info' }>Edit Emergency Contacts</Button>
      </Button.Group>
    </Container>
  )
};

export default App;
