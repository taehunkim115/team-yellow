import React, {useEffect} from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container } from 'rbx';
import FirebaseHelper from './Functions/FirebaseHelper';

const currentDate = new Date();
var disabled = true; // currentDate.getDay() === time.getDay();
//console.log(disabled)
console.log("Appjs time: ", FirebaseHelper.FetchTime());

const App = () => {
  return (
    <Container>
      <Button.Group align="centered">
        <Title>Welcome, { FirebaseHelper.user }!</Title>
      </Button.Group>
      <Button.Group align="centered">
        <Button  rounded={ true } color={ 'danger' } size={ 'large' } onClick={ FirebaseHelper.CheckIn }>CheckIn</Button>
      </Button.Group>
    </Container>
  )
};

export default App;
