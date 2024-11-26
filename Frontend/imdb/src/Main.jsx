// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sign from './IMDB/Sign';
import Login from "./IMDB/Login";
import Movie from "./IMDB/Movie"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movie" element ={<Movie/>} />
      </Routes>
    </Router>
  );
}

export default App;
