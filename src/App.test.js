import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CheckInButton from "./Components/CheckIn";
import { render, fireEvent } from '@testing-library/react';
import ContactsButton from './Components/EditContacts';

test('CheckIn button renders', () => {
  const { getByTestId } = render(<CheckInButton/>);
  expect(getByTestId("check-in-button").textContent).toBe('CheckIn');
});

test('Edit contact button changes', () => {
  const showContacts = jest.fn()
  const setShowContacts = jest.fn()

  const { getByTestId } = render(<ContactsButton showContacts={showContacts} setShowContacts={setShowContacts}/>);
  fireEvent.click(getByTestId('contact-button'))
  expect(setShowContacts).toBeCalledWith(true)
  expect(setShowContacts).toHaveBeenCalledTimes(1)
});

