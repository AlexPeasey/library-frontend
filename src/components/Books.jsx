import { useQuery, gql } from "@apollo/client";

const Books = () => {

  const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }`

  const result = useQuery(GET_BOOKS)

  if (!result.data) return

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
