import { useQuery, useMutation } from "@apollo/client";
import { DELETE_BOOK, GET_BOOKS } from "./queries";
import { useState } from "react";

const Books = ({ userFaveGenre, setError }) => {
  const [genreFilter, setGenreFilter] = useState("");
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onError: (error) => {
      setError(error.message);
    },
    update: (cache, { data: { deleteBook } }, { variables: { id } }) => {
      // Read the current books and genres from the cache
      const { allBooks } = cache.readQuery({ query: GET_BOOKS, variables: { genre: "" } });

      // Filter out the deleted book by its ID
      const updatedBooks = [...new Set(allBooks.filter((book) => book.id !== id))];

      // Compute unique genres after deletion
      const updatedGenres = [...new Set(updatedBooks.map((book) => book.genres).flat())];

      // Write the updated data back to the cache
      cache.writeQuery({
        query: GET_BOOKS,
        variables: { genre: "" },
        data: {
          allBooks: updatedBooks,
          allGenres: updatedGenres,
        },
      });
    },
  });
  const { data, error, loading } = useQuery(GET_BOOKS, {
    variables: { genre: genreFilter },
  });

  const handleDelete = (id) => {
    deleteBook({ variables: { id } });
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) console.log(error.message);
  if (!data) return;

  return (
    <div>
      {!userFaveGenre ? <h2>Books</h2> : null}
      <table>
        <tbody>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
          {data.allBooks
            .filter((book) => {
              if (userFaveGenre) {
                return book.genres.includes(userFaveGenre);
              } else return book;
            })
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
                <td>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {!userFaveGenre ? (
        <>
          <h3>Filter by genre</h3>
          <div>
            {data.allGenres.map((genre) => {
              return (
                <button key={genre} onClick={() => setGenreFilter(genre)}>
                  {genre}
                </button>
              );
            })}
            <button onClick={() => setGenreFilter("")}>Reset filters</button>
          </div>{" "}
        </>
      ) : null}
    </div>
  );
};

export default Books;
