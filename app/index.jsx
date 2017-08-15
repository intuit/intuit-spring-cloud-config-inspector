import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.jsx'

import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<App url='https://config-e2e.api.intuit.com/v2' appName='publisher' profiles={['default']} label='master' />, document.getElementById('app'));
