import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CheckInButton from "./Components/CheckIn";
import { render, fireEvent } from '@testing-library/react';

test('CheckIn button renders', () => {

  const { getByTestId } = render(<CheckInButton/>);
  // expect(container.querySelector('#checkin-button').textContent).toBe('CheckIn');
  expect(getByTestId("check-in-button").textContent).toBe('CheckIn');
});


