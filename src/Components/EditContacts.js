import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button} from 'rbx';

const ContactsButton = ({showContacts, setShowContacts}) => {
  console.log(showContacts)
  return (
    <Button.Group align="centered">
        <Button hidden={showContacts} data-testid="contact-button" onClick={() => {setShowContacts(true)}}>Edit Contacts</Button>
        <Button hidden={!showContacts} onClick={() => {setShowContacts(false)}}>Close Contact Edit</Button>
    </Button.Group>
  )
}

export default ContactsButton;