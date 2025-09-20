import React, { useEffect } from 'react';
import PlaylistCoverGenerator from './components/PlaylistCoverGenerator';
import './App.css';

function App() {
  // Set dark mode as default on app load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div className="App">
      <PlaylistCoverGenerator />
    </div>
  );
}

export default App;
