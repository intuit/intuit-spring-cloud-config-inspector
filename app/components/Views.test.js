import React from 'react';
import ReactDOM from 'react-dom';
import Views from './Views.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  test = () => {};
  ReactDOM.render(<Views urls={{}} headers={{}} updateUserRepo={test} info={{}}
    filter={[]} updateFilter={test} transactionId='' labelOptions={[]}
    user='' repo='' simple={false} stateHandler={test} />, div);
});
