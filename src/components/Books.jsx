import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "./queries";
import { useState } from "react";

const Books = () => {

  const [genreFilter, setGenreFilter] = useState('')


  const result = useQuery(GET_BOOKS)  

  if (!result.data) return


  const getAllGenres = () => {
    const genreArrays = result.data.allBooks.map(entry => entry.genres)
    const flattenedGenres = genreArrays.flat()
    const uniqueGenres = [...new Set(flattenedGenres)]
    return uniqueGenres
  }


  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.filter((book) => {
            if (genreFilter) {
              return book.genres.includes(genreFilter)
            } else {
              return book
            }
          }).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Filter by genre</h3>
      <div>
      {getAllGenres().map((genre) => {
        return <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>
      })}
      <button onClick={() => setGenreFilter('')}>Reset filters</button>
      </div>
          
    </div>
  )
}

export default Books
