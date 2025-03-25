import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import SearchBar from './pages/SearchBar';

const App = () => {
  return (
    <BrowserRouter>
        <Route path="/login" component={Login} />
        <Route path="/callback" component={Callback} />
        <Route path="/" component={SearchBar} />
    </BrowserRouter>
  );
};

export default App;