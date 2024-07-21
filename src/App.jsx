import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

const Notify = ({ error }) => {
  if (!error) {
    return null;
  }
  return <div style={{color:"red"}}>{error}</div>;
};

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const notify = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <Notify error={error}></Notify>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
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
      <Notify error={error}></Notify>
      <Routes>
        <Route path="/authors" element={<Authors />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook setError={notify}/>} />
      </Routes>
    </Router>
  );
};

export default App;
