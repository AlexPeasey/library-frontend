import { useQuery, gql, useMutation } from "@apollo/client";
import { GET_AUTHORS } from "./queries";
import { useState } from "react";
import { CHANGE_YEAR } from "./queries";

const Authors = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const { loading, error, data } = useQuery(GET_AUTHORS);
  const [changeYear, { error: mutationError }] = useMutation(CHANGE_YEAR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const submit = (e) => {
    e.preventDefault();

    changeYear({ variables: { name, setBornTo: Number(year) } });

    setName("");
    setYear("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        name <select value={name} onChange={({ target }) => setName(target.value)}>
          <option value="">Select an author</option>
          {data.allAuthors.map((a) => (
            <option value={a.name} key={a.name}>{a.name}</option>
          ))}
        </select>
        <br />
        born <input type="number" value={year} onChange={({ target }) => setYear(target.value)} />
        <br />
        <button type="submit">Set year</button>
      </form>
      {mutationError && <p>Error in mutation: {mutationError.message}</p>}
    </div>
  );
};

export default Authors;
