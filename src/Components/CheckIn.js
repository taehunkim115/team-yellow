import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Title, Button, Container, Table, Field, Control, Input, Content, Message } from 'rbx';
import FirebaseHelper from '../Functions/FirebaseHelper';
import * as emailjs from 'emailjs-com'

var templateParams = {
    user_name: '', // user name
    to_name: '', // emergency contact name
    to_email: '', // emergency contact email
    from_name: 'CheckIn', // App name
    checkin_email: 'checkin.yellow@gmail.com' // App email
   };

const ButtonClick = (contacts, setDisabled) => {
    FirebaseHelper.CheckIn('Taehun Kim');
    setDisabled(true);
    
    contacts.map((contact) => {
      templateParams.user_name = "Taehun Kim";
      templateParams.to_name = contact.name; // set emergency contact name
      templateParams.to_email = contact.email; // set emergency contact email
      emailjs.send("gmail", "checkin", templateParams, "user_5eWzW76xiRQHYgG8R0toY");
      })
  }

const CheckInButton = (contacts, disabled, setDisabled) => {
    return (
      <Button.Group align="centered">
        <Button id='checkin-button' rounded={ true } color={ 'danger' } size={ 'large' } data-testid="check-in-button" onClick={()=>{ alert("You have checked in!");ButtonClick(contacts, setDisabled);} } disabled={ disabled }>CheckIn</Button>
      </Button.Group>
    )
  }

export default CheckInButton;