import React from 'react';
import ReactDOM from 'react-dom';
import UserInputs from './UserInputs.jsx';

it('renders without crashing', () => {
  test = () => {};
  const div = document.createElement('div');
  ReactDOM.render(<UserInputs toggle headerCount={0}
    transferData={test} toggleHeaders={test}
    label='' updateURLs={test} user='' repo='' />, div);
});
