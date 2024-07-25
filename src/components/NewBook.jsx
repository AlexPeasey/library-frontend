import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_BOOKS, ADD_BOOK } from "./queries";
import { useNavigate } from "react-router-dom";

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const navigateTo = useNavigate();

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.error("Mutation error:", error);

      if (error.networkError) {
        console.error("Network error:", error.networkError);
        setError(`Network error: ${error.networkError.message}`);
      }

      if (error.graphQLErrors) {
        const messages = error.graphQLErrors.map((e) => e.message).join("\n");
        console.error("GraphQL errors:", error.graphQLErrors);
        setError(messages);
      }
    },
    update: (cache, { data: { addBook } }) => {
      cache.updateQuery({ query: GET_BOOKS }, (data) => {
        if (!data) {
          data = { allBooks: [], allGenres: [] };
        }

        // Extract the new genres from the added book
        const newGenres = addBook.genres.filter((genre) => !data.allGenres.includes(genre));

        return {
          allBooks: data.allBooks.concat(addBook),
          allGenres: data.allGenres.concat(newGenres),
        };
      });
    },
    onCompleted: () => {
      navigateTo("/books");
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    addBook({ variables: { title, author, published: Number(published), genres } });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <h2>Add book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
