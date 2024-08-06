import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_BOOKS, ADD_BOOK } from "./queries";
import { useNavigate } from "react-router-dom";

const updateCache = (cache, query, book) => {
  // Helper to eliminate duplicate books based on their IDs
  const uniqById = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.id;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  try {
    // Read the existing data from the cache
    const data = cache.readQuery(query);
    if (!data) {
      console.log("No data found in cache for query:", query);
      return;
    }

    // Write the updated data back to the cache
    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: uniqById(allBooks.concat(book)),
        allGenres: [
          ...new Set(
            allBooks
              .concat(book)
              .map((book) => book.genres)
              .flat()
          ),
        ],
      };
    });
  } catch (error) {
    console.error("Error updating cache:", error);
  }
};

const NewBook = ({ setError }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const navigateTo = useNavigate();

  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook } }) => {
      updateCache(cache, { query: GET_BOOKS, variables: { genre: "" } }, addBook);
    },
    onError: (error) => {
      setError("Mutation error:", error.message);
    },
    onCompleted: () => {
      navigateTo("/books");
    },
  });

  const submitTest = async (event) => {
    event.preventDefault();
    addBook({
      variables: {
        title: Math.floor(Math.random() * 1000000000).toString(),
        author: Math.floor(Math.random() * 1000000000).toString(),
        published: 2000,
        genres: [Math.floor(Math.random() * 1000000000).toString()],
      },
    });
  };
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
      <form onSubmit={submitTest}>
        <button>submit test book</button>
      </form>
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
