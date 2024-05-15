import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {

  return (
    <Router>
      <div>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        <Link to="/add">add book</Link>
      </div>
      <Routes>
        <Route path="/authors" element={<Authors />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook />} />
        
      </Routes>
    </Router>
  );
};

export default App;
