import React from 'react';
import ReactDOM from 'react-dom';
import LabelMenu from './LabelMenu.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LabelMenu updateLabel={ () => {} } label='' />, div);
});
