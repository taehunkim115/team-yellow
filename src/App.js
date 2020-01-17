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
    var newContacts = [];
    contacts.forEach(contact => newContacts.push(contact));
    newContacts.push({name:name, number:number});
    setContacts(newContacts);

    var inputs = document.getElementsByTagName('Input')
    for (var i=0; i < inputs.length; i++) {
      inputs[i].value = ''
    }
  }

  const EmergencyContacts = ({contacts}) => {
    return (
      <Table id='contact-table'>
        {/* <Table.Head>
          <Table.Row>
            <Table.Heading>
              Emergency Contacts
            </Table.Heading>
          </Table.Row>
        </Table.Head> */}

        <Table.Body>
          {contacts.map(contact =>
            <Table.Row key={contact.name.concat('_', contact.number)}>
              <Table.Cell>
                {contact.name}
              </Table.Cell>
              <Table.Cell>
                {contact.number}
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

      <Button.Group align="centered">
        <Button id='checkin-button' rounded={ true } color={ 'danger' } size={ 'large' } onClick={ ButtonClick } disabled={ disabled }>CheckIn</Button>
      </Button.Group>
      <div className='checkin-text' hidden={ !disabled }>You CheckedIn!</div>
      <div className='checkin-text' hidden={ disabled }>Please CheckIn!</div>

      <br/>
      <hr class='divider'/>
      <Title size={5} id='contact-header'>Emergency Contacts</Title>
      <EmergencyContacts contacts={ contacts }/>
      <br/>
      
      <Field>
        <Control className='input-box'>
          <Input type='text' placeholder="Contact's Name" onChange={ e => currName=e.target.value }/>
        </Control>
        <Control className='input-box'>
          <Input type='text' placeholder="Contact's Number" onChange={ e => currNum=e.target.value }/>
        </Control>
      </Field>
      <br/>
      <Button.Group align='centered'>
        <Button size={ 'medium' } color={ 'info' } onClick={() => AddContact(currName, currNum)}>Add Emergency Contacts</Button>
      </Button.Group>

    </Container>
  )
};

export default App;
