import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "./queries";
import { useState } from "react";

const Books = ({ userFaveGenre }) => {
  const [genreFilter, setGenreFilter] = useState("");

  const result = useQuery(GET_BOOKS);


  if (!result.data) return;

  const getAllGenres = () => {
    const genreArrays = result.data.allBooks.map((entry) => entry.genres);
    const flattenedGenres = genreArrays.flat();
    const uniqueGenres = [...new Set(flattenedGenres)];
    return uniqueGenres;
  };

  return (
    <div>
      {!userFaveGenre ? <h2>Books</h2> : null }
      <table>
        <tbody>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.data.allBooks
            .filter((book) => {
              if (genreFilter) {
                return book.genres.includes(genreFilter);
              } else if (userFaveGenre) {
                return book.genres.includes(userFaveGenre)
              } else {
                return book;
              }
            })
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      
      {!userFaveGenre ? <>
      <h3>Filter by genre</h3>
      <div>
        {getAllGenres().map((genre) => {
          return (
            <button key={genre} onClick={() => setGenreFilter(genre)}>
              {genre}
            </button>
          );
        })}
        <button onClick={() => setGenreFilter("")}>Reset filters</button>
      </div> </> : null }
    </div> 
  );
};

export default Books;
