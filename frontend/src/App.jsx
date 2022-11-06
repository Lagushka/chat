import React from 'react';
import './style.scss';
import Header from './components/Header/Header';
import CurrentChat from './components/CurrentChat/CurrentChat';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <CurrentChat />
      </main>
    </div>
  );
}

export default App;
