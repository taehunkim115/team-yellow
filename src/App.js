import React, { useEffect, useState } from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container, Content } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';

const currentDate = new Date();
console.log("Appjs time: ", FirebaseHelper.FetchTime());

const ButtonEnabled = (time) => {
  return (
    time.getDay() === currentDate.getDay() && time.getMonth() === currentDate.getMonth() && time.getYear() === currentDate.getYear()
  );
};

const App = () => {
  const [disabled, setDisabled] = useState(false);
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
    </Container>
  )
};

export default App;
