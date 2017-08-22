import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

it('renders without crashing', () => {
  window.fetch = jest.fn().mockImplementation(() => new Promise(resolve => resolve()));
  const div = document.createElement('div');
  ReactDOM.render(<App url='https://config-e2e.api.intuit.com/v2' appName='publisher' profiles='default' label='master' />, div);
});
