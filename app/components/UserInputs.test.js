import React from 'react';
import ReactDOM from 'react-dom';
import UserInputs from './UserInputs.jsx';

it('renders without crashing', () => {
  test = () => {};
  const div = document.createElement('div');
  ReactDOM.render(<UserInputs user='' repo='' url='' appName=''
    profiles='default' label='' portal={false} updateInfo={test}
    updateLabel={test} updateProfiles={test} transactionId='' simple={false}
    updateLabelOptions={test} stateHandler={test} updateSimple={test} />, div);
});
