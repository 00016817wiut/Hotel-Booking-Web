import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomDetail from './pages/RoomDetail';
import Header from './components/Header';

function App(){
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<RoomDetail />} />
        </Routes>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Anor Avenue Hotel. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
