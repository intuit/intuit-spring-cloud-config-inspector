import React from 'react';
import ReactDOM from 'react-dom';
import Views from './Views.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Views urls={{}} headers={{}} updateUserRepo={()=>{}}
    filter={[]} updateFilter={()=>{}} />, div);
});
