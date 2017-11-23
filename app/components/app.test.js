import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

it('renders without crashing', () => {
  window.fetch = jest.fn().mockImplementation(
    () => new Promise(resolve => resolve())
  );
  window.history.pushState = jest.fn().mockImplementation(() => {})
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
