import React from 'react';
import PeopleList from './components/PeopleList';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold', fontSize: '2.5rem', margin: '2rem 0', letterSpacing: '1px' }}>
        👋 Welcome to Alpha Platform: People Research!
      </h1>
      <PeopleList />
    </div>
  );
}

export default App;
