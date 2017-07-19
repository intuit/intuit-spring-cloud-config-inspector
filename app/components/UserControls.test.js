import React from 'react';
import ReactDOM from 'react-dom';
import UserControls from './UserControls.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserControls />, div);
});
