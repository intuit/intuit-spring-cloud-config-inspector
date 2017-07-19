import React from 'react';
import ReactDOM from 'react-dom';
import PropSearch from './PropSearch.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PropSearch />, div);
});
