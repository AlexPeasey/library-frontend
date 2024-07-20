import { LOGIN } from "./queries";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  });
  const handleLogin = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          Username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
