import Books from "./Books";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "./queries";

const Recommended = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userFaveGenre = data.me.favouriteGenre;

  return (
    <div>
      <h2>Recommended for you</h2>
      <h4>Because you like &quot;{userFaveGenre}&quot;</h4>
      <Books userFaveGenre={userFaveGenre} />
    </div>
  );
};

export default Recommended;
