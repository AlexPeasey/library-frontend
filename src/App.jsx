import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

const App = () => {
  const [token, setToken] = useState(null)

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm />
      </div>
    )
  }

  return (
    <Router>
      <div className="nav">
        <Link to="/authors">authors</Link>
        <span> | </span>
        <Link to="/books">books</Link>
        <span> | </span>
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
