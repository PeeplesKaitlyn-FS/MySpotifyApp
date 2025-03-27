import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import SearchBar from './pages/SearchBar';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<SearchBar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;