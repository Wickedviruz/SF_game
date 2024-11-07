import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css"
import Home from './pages/Home';
import Auth from './pages/Auth';
import Land from './pages/Land';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/land" element={<Land />} />
      </Routes>
    </Router>
  );
};

export default App;
