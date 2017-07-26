import React from 'react';
import ReactDOM from 'react-dom';
import UserControls from './UserControls.jsx';

it('renders without crashing', () => {
  const inputData = {'url': 'https://config.api.intuit.com/v2', 'app': '{app}', 'profiles': 'default', 'label': 'master'}
  const div = document.createElement('div');
  ReactDOM.render(<UserControls inputData={inputData} />, div);
});
