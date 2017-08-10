import React from 'react';
import ReactDOM from 'react-dom';
import Headers from './Headers.jsx';

it('renders without crashing', () => {
  const test = (count) => {};
  const div = document.createElement('div');
  ReactDOM.render(<Headers show updateHeaderCount={test} updateHeaders={() => {}} />, div);
});
