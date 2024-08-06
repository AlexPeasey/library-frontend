import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import { useQuery, useMutation, useSubscription, ApolloConsumer } from '@apollo/client'
import { BOOK_ADDED } from "./components/queries";

const Notify = ({ error }) => {
  if (!error) {
    return null;
  }
  return <div style={{ color: "red" }}>{error}</div>;
};

const App = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const notify = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    setToken(localStorage.getItem("library-user-token"));
  }, []);

useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
    }
  })

  const logout = (client) => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
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
        <div className="main-nav">
          <Link to="/authors">Authors</Link>
          <span> | </span>
          <Link to="/books">Books</Link>
          <span> | </span>
          <Link to="/add">Add book</Link>
          <span> | </span>
          <Link to="/recommended">Recommended for you</Link>
        </div>
        <div className="side-nav">{token ? 
           <ApolloConsumer>{client => (<button onClick={() => logout(client)}>logout</button> )}</ApolloConsumer> : null}</div>
      </div>
      <Notify error={error}></Notify>
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Books />} />
        <Route path="/books" element={<Books setError={notify} />} />
        <Route path="/recommended" element={<Recommended />}></Route>
        <Route path="/add" element={<NewBook setError={notify} />} />
      </Routes>
    </Router>
  );
};

export default App;
