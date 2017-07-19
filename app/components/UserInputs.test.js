import React from 'react';
import ReactDOM from 'react-dom';
import UserInputs from './UserInputs.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserInputs />, div);
});
