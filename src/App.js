import React, { useState } from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container, Table, Field, Control, Input } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';

const currentDate = new Date();

const ButtonEnabled = (time) => {
  return (
    time.getDay() === currentDate.getDay() && time.getMonth() === currentDate.getMonth() && time.getYear() === currentDate.getYear()
  );
};



const App = () => {
  const [disabled, setDisabled] = useState(true);
  const [contacts, setContacts] = useState([]);

  FirebaseHelper.FetchTime().then(time => { 
    setDisabled(ButtonEnabled(time));
  });

  const ButtonClick = () => {
    FirebaseHelper.CheckIn();
    setDisabled(true);
  }

  const AddContact = (name, number) => {
    var newContacts = contacts;
    newContacts.push({name:name, number:number});
    setContacts(newContacts);
  }

  const EmergencyContacts = ({contacts}) => {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Heading>
              Emergency Contacts
            </Table.Heading>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {contacts.map(contact =>
            <Table.Row>
              <Table.Cell>
                {contact.name}
              </Table.Cell>
              <Table.Cell>
                X
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  };

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

      <EmergencyContacts contacts={ contacts }/>
      <Field>
        <Control>
          <Input type='text' placeholder="Contact's Name"/>
        </Control>
        <Control>
          <Input type='text' placeholder="Contact's Number"/>
        </Control>
      </Field>
      <Button.Group align='centered'>
        <Button size={ 'medium' } color={ 'info' } onClick={() => AddContact("test", "test")}>Add Emergency Contacts</Button>
      </Button.Group>

    </Container>
  )
};

export default App;
