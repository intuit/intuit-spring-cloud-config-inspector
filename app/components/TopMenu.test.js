import React from 'react';
import ReactDOM from 'react-dom';
import TopMenu from './TopMenu.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TopMenu />, div);
});
