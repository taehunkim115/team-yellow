import React from 'react';
import './App.css';
import 'rbx/index.css';
import { Title, Button, Container } from 'rbx';

const CheckIn = () => {
  console.log("You checked in!");
}

function App() {
  return (
    <Container>
      <Title>Welcome, John!</Title>
      <Button rounded={ true } color={ 'danger' } size={ 'large' } onClick={ CheckIn }>CheckIn</Button>
    </Container>
  );
}

export default App;
