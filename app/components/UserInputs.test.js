import React from 'react';
import ReactDOM from 'react-dom';
import UserInputs from './UserInputs.jsx';

it('renders without crashing', () => {
  test = () => {};
  const div = document.createElement('div');
  ReactDOM.render(<UserInputs toggle headerCount={0}
    updateLabel={test} toggleHeaders={test} url='' appName='' label=''
    profiles={['default']} updateURLs={test} user='' repo='' />, div);
});
